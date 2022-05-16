import {subnet} from "ip";
import {IncomingHttpHeaders} from "http";
import {Socket} from "node:net";


// https://github.com/pbojinov/request-ip/blob/master/src/index.js
// https://github.com/indutny/node-ip/issues/23
const targetHeaderKeys:string[] = [
    'x-real-ip',
    'x-client-ip',
    'true-client-ip',
    'x-forwarded-for',
    'cf-connecting-ip',
]
export const getIp = (headers:IncomingHttpHeaders, connection: Socket) => {
    targetHeaderKeys.forEach(headerKey => console.log(`${headerKey}: ${headers[headerKey]}`))
    console.log(`remoteAddress : ${connection.remoteAddress}`)

    const ip = (
        (
            targetHeaderKeys
                .map(headerKey => {
                    const headerValue = headers[headerKey]
                    return Array.isArray(headerValue) ? headerValue.pop() : headerValue;
                })
                .find(ip => !!ip)
        )
        || connection.remoteAddress
        || ''
    )
        .split(',')
        .pop()
        .trim()
    console.log(`ip : ${ip}`)
    return ip;
}

export const isAllowedIp = (headers:IncomingHttpHeaders, connection: Socket,subnetConfigs:SubnetConfigType[] ) => {

    const ip = getIp(headers, connection)

    const subnets = subnetConfigs
        .map(subnetConfig => subnet(subnetConfig.ipAddress, subnetConfig.subnetMask))
    console.dir(subnets, {depth: null})

    const matchedSubnets = subnets.filter(subnet => subnet.contains(ip))
    console.dir(matchedSubnets, {depth: null})

    const isAllowed = !!matchedSubnets.length
    console.dir(isAllowed)

    return isAllowed;
}