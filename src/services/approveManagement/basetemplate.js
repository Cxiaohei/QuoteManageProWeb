import { request, METHOD } from '@/utils/request'
import { transformAbpListQuery, download } from '@/utils/abp'
import qs from 'querystring'
//获取列表数据
export async function getPageList(params) {
    return request("/api/app/tempatet-file/template-file-list", METHOD.GET, transformAbpListQuery(params))
}

export async function templateFileAdd(params) {
    return request("/api/app/tempatet-file/template-file", METHOD.POST, params)
}

export async function checkAudite(params) {
    return request("/api/app/quote-audite/audite-quote-develop-project", METHOD.POST, params)
}

checkAudite

export default {
    getPageList,
    templateFileAdd,
    checkAudite
}
