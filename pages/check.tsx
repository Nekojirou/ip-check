import {GetServerSideProps} from "next";
import {getIp, isAllowedIp} from "../logic/ip";
import path from "path";
import fs from "fs";

export default function CheckPage({ip, isAllowed, subnetConfigs}: {ip: string, isAllowed: boolean, subnetConfigs: SubnetConfigType[]}) {
  return (
      <>
          <h1>
              Your ip address {ip} is {isAllowed? "allowed": "not allowed"}
          </h1>
          <div>
                <h3>
                    your ip address restriction config
                </h3>
              <div>
                  {subnetConfigs
                      .map((subnetConfig, index) => (
                          <div key={index}>{`ip : ${subnetConfig.ipAddress}, subnet mask : ${subnetConfig.subnetMask}`}</div>
                      ))}
              </div>
          </div>
      </>
  );
}

export const getServerSideProps:GetServerSideProps = async (ctx ) => {
    const {req} = ctx
    const {headers, connection} = req

    const ip = getIp(headers, connection)

    // 設定情報をjsonから読み込む
    const jsonPath = path.join(process.cwd(), 'data', 'subnetConfig.json')
    const jsonText = fs.readFileSync(jsonPath, 'utf-8')
    const subnetConfigs = JSON.parse(jsonText) as SubnetConfigType[]
    const isAllowed = isAllowedIp(headers, connection, subnetConfigs);

    // 認証に失敗した場合は、'/'へredirectする
    if(!isAllowed) {
        return {
            redirect: {
                permanent: false,
                destination: '/'
            }
        }
    }

    return { props: {
            ip,
            isAllowed,
            subnetConfigs
        } };
}
