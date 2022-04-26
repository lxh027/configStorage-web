import request from "../utils/request";

export const getClusterPeers = query => {
    return request({
        url: "/monitor/getRaftPeers",
        method: "post",
        data: query
    })
}

export const getPeerData = query => {
    return request({
        url: "/monitor/getPeerData",
        method: "post",
        data: query
    })
}