import { request, METHOD } from '@/utils/request'
import { transformAbpListQuery, download } from '@/utils/abp'
import qs from 'querystring'
//获取基础数据列表
export async function getPageList(params) {
    return request("/api/app/odm-quote/odm-quote-list", METHOD.GET, transformAbpListQuery(params))
}




export async function setQuoteAudite(params) {
    return request("/api/app/quote-audite/quote-audite", METHOD.POST, params)
}



export default {
    getPageList,
    setQuoteAudite,
}
