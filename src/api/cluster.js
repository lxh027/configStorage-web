import request from "../utils/request";

export const getUserClusters = query => {
    return request({
        url: "/cluster/getUserClusters",
        method: "post",
        data: query
    })
}

export const getAllClusters = () => {
    return request({
        url: "/cluster/getAllClusters",
        method: "post",
    })
}


export const setUserClusterAuth = query => {
    return request({
        url: "/cluster/authUserCluster",
        method: "post",
        data: query
    })
}

export const unsetUserClusterAuth = query => {
    return request({
        url: "/cluster/unAuthUserCluster",
        method: "post",
        data: query
    })
}