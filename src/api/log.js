import request from '../utils/request';

export const getAllLogs = query => {
    return request({
        url: "/log/getAllLogs",
        method: "post",
        data: query
    })
}

export const newLog = query => {
    return request({
        url: "/log/newLog",
        method: "post",
        data: query
    })
}

export const delLog = query => {
    return request({
        url: "/log/delLog",
        method: "post",
        data: query
    })
}

export const commit = query => {
    return request({
        url: "/log/commit",
        method: "post",
        data: query
    })
}

export const getAllConfigs = query => {
    return request({
        url: "/config/getAllConfigs",
        method: "post",
        data: query
    })
}