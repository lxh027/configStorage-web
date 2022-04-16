import request from '../utils/request';

export const getUserNamespaces = query => {
    return request({
        url: "/namespace/getUserNamespaces",
        method: "post",
        data: query
    })
}

export const newNamespaces = query => {
    return request({
        url: "/namespace/newNamespace",
        method: "post",
        data: query
    })
}

export const setUserNamespaceAuth = query => {
    return request({
        url: "/namespace/setAuth",
        method: "post",
        data: query
    })
}