import { request, METHOD } from '@/utils/request'
import { transformAbpListQuery } from '@/utils/abp'
// const BASE_URL = process.env.VUE_APP_API_MAIN_URL
export async function getTypes(params) {
    return request("/api/identity/claim-types", METHOD.GET, transformAbpListQuery(params))
}

export async function create(params) {
    return request("/api/identity/claim-types", METHOD.POST, params)
}
export async function del(id) {
    return request(`/api/identity/claim-types/${id}`, METHOD.DELETE)
}
export async function getSecurity(params) {
    return request("/api/identity/security-logs", METHOD.GET, transformAbpListQuery(params))
}

export default {
    create,
    del,
    getTypes,
    getSecurity,
}
