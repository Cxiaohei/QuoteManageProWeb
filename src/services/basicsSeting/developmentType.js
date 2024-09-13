import { request, METHOD } from '@/utils/request'
import { transformAbpListQuery, download } from '@/utils/abp'
import qs from 'querystring'
//获取列表数据
export async function getPageList(params) {
    return request("/api/app/basic-configuration/development-types-list", METHOD.GET, transformAbpListQuery(params))
}


export async function getDevelopmentTypeListSelect() {
    return request("/api/app/basic-configuration/development-types", METHOD.GET)
}


//新增研发类型
export async function addDevelopmentType(params) {
    return request("/api/app/basic-configuration/development-type", METHOD.POST, params)
}
//编辑研发类型
export async function editDevelopmentType(params) {
    
    params.dataDictionaryId = params.id;
    return request("/api/app/basic-configuration/updat-development-type-info", METHOD.POST, params)
}
export async function deleteDevelopmentType(Id) {
    return request(`/api/app/basic-configuration/development-type/${Id}`, METHOD.DELETE)
}
export default {
    getPageList,
    addDevelopmentType,
    editDevelopmentType,
    getDevelopmentTypeListSelect,
    deleteDevelopmentType
}
