import Link from 'next/link';
import {GetServerSideProps} from "next";
import {getIp, isAllowedIp} from "../logic/ip";
import path from "path";
import fs from "fs";

export default function IndexPage({ ip }) {

  return (
      <div>
        <h1> Your ip is {ip}</h1>
        <Link href="/check">
          <a>check your ip address</a>
        </Link>
      </div>
  );
}


export const getServerSideProps:GetServerSideProps = async (ctx ) => {
    const {req} = ctx
    const {headers, connection} = req
    const ip = getIp(headers, connection)
    return {
    props: {
      ip
    },
  };
}
