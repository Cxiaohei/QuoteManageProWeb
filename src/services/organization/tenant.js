import { request, METHOD } from '@/utils/request'
import { transformAbpListQuery } from '@/utils/abp'
// const BASE_URL = process.env.VUE_APP_API_MAIN_URL
export async function getList() {
    return request( `/api/identity/organization-units/all`, METHOD.GET)
}

export async function createUpdate(params) {
    if (params.id) {
        return request(`/api/identity/organization-units/${params.id}`, METHOD.PUT, params)
    }
    return request("/api/identity/organization-units", METHOD.POST, params)
}

export async function get(id) {
    return request(`/api/identity/organization-units/${id}`, METHOD.GET)
}
export async function del(id) {
    return request(`/api/identity/organization-units?id=`+ id, METHOD.DELETE)
}
export async function getMember(id,params) {
    return request(`/api/identity/organization-units/${id}/members`, METHOD.GET, transformAbpListQuery(params))
}
export async function putMember(id,params) {
    return request(`/api/identity/organization-units/${id}/members`, METHOD.PUT,params)
}
export async function createOrg(params) {
    return request("/api/identity/organization-units", METHOD.POST, params)
}
export async function getAddMember(params) {
    return request("/api/identity/organization-units/available-users", METHOD.GET, transformAbpListQuery(params))
}
export async function delMember(id,memberId) {
    return request(`/api/identity/organization-units/${id}/members/${memberId}`, METHOD.DELETE)
}

export async function getRole(id,params) {
    return request(`/api/identity/organization-units/${id}/roles`, METHOD.GET, transformAbpListQuery(params))
}
export async function delRole(id,memberId) {
    return request(`/api/identity/organization-units/${id}/roles/${memberId}`, METHOD.DELETE)
}
export async function getAddRole(params) {
    return request("/api/identity/organization-units/available-roles", METHOD.GET, transformAbpListQuery(params))
}
export async function putRole(id,params) {
    return request(`/api/identity/organization-units/${id}/roles`, METHOD.PUT,params)
}
export default {
    getList,
    createUpdate,
    get,
    del,
    getMember,
    createOrg,
    getAddMember,
    putMember,
    delMember,
    getRole,
    delRole,
    getAddRole,
    putRole
}
