import request from '../utils/request';

export const fetchData = query => {
    return request({
        url: './table.json',
        method: 'get',
        params: query
    });
};

export const fetchNamespace = query => {
    return request({
        url: './namespace.json',
        method: 'get',
        params: query
    })
}

export const fetchLog = query => {
    return request({
        url: './log.json',
        method: 'get',
        params: query
    })
}

export const fetchCluster= query => {
    return request({
        url: './cluster.json',
        method: 'get',
        params: query
    })
}

export const fetchKey= query => {
    return request({
        url: './key.json',
        method: 'get',
        params: query
    })
}

export const fetchUsers= query => {
    return request({
        url: './user.json',
        method: 'get',
        params: query
    })
}