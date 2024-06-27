import { request, METHOD } from '@/utils/request'
import { transformAbpListQuery, download } from '@/utils/abp'
import qs from 'querystring'
//获取基础数据列表
export async function getPageList(params) {
    return request("/api/app/odm-quote/odm-quote-list", METHOD.GET, transformAbpListQuery(params))
}

//新增基础数据
export async function addOdmDataList(params) {
    return request("/api/app/odm-quote/odm-quote", METHOD.POST, params)
}
export async function OdmDetailDataList(Id) {
    return request(`/api/app/odm-quote/odm-quote-detail/${Id}`, METHOD.POST, GET)
}

//编辑基础数据
// export async function editEssentialDataList(params) {
//     return request("/api/app/basic-configuration/base-data-info", METHOD.PUT, params)
// }




export default {
    getPageList,
    addOdmDataList,
    OdmDetailDataList,
}
