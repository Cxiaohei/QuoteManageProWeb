import { request, METHOD } from '@/utils/request'
import { transformAbpListQuery, download } from '@/utils/abp'
import qs from 'querystring'
//获取列表数据
export async function getPageList(params) {
    params.AuditeType = 4;
    return request("/api/app/quote-audite/quote-audite-list", METHOD.GET, transformAbpListQuery(params))
}




export async function getPagechange(params) {
    return request(`/api/app/k-kProject/project-change-info/${params}`, METHOD.GET)
}



