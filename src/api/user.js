import request from '../utils/request';

export const getUsers = query => {
    return request({
        url: "/user/getUsers",
        method: "post",
        data: query
    })
}

export const setUserAdmin = query => {
    return request({
        url: "/user/setAdmin",
        method: "post",
        data: query
    })
}

export const userLogin = query => {
    return request({
        url: "/user/login",
        method: 'post',
        data: query
    })
}

export const userLogout = query => {
    return request({
        url: "/user/logout",
        method: 'post',
        data: query
    })
}