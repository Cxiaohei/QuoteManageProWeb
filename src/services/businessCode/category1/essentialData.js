import { request, METHOD } from '@/utils/request'
import { transformAbpListQuery, download } from '@/utils/abp'
import qs from 'querystring'
//获取基础数据列表
export async function getPageList(params) {
    return request("/api/app/basic-configuration/base-data-list", METHOD.GET, transformAbpListQuery(params))
}
//新增基础数据
export async function addEssentialDataList(params) {
    return request("/api/app/basic-configuration/base-data", METHOD.POST, params)
}
//编辑基础数据
export async function editEssentialDataList(params) {
    params.baseDataId = params.id;
    return request("/api/app/basic-configuration/base-data-info", METHOD.PUT, params)
}


//获取父级基础数据
export async function getParentBase() {
    return request("/api/app/basic-configuration/parent-base-datas", METHOD.GET)
}

export default {
    getPageList,
    addEssentialDataList,
    editEssentialDataList,
    getParentBase
}
