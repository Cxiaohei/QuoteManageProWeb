import { request, METHOD } from '@/utils/request'
import { transformAbpListQuery, download } from '@/utils/abp'
import qs from 'querystring'
//获取基础数据列表
export async function getPageList(params) {
    return request("/api/app/basic-configuration/process-rote-list", METHOD.GET, transformAbpListQuery(params))
}




//新增基础数据
export async function addCraftLineDataList(params) {
    return request("/api/app/basic-configuration/process-rote", METHOD.POST, params)
}
//编辑基础数据
export async function editCraftLineDataList(params) {
    params.baseDataId = params.id;
    return request("/api/app/basic-configuration/process-rote-info", METHOD.PUT, params)
}




export default {
    getPageList,
    addCraftLineDataList,
    editCraftLineDataList,
}
