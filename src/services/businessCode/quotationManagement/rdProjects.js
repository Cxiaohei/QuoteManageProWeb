import { request, METHOD } from '@/utils/request'
import { transformAbpListQuery, download } from '@/utils/abp'
import qs from 'querystring'
//获取基础数据列表
export async function getPageList(params) {
    return request("/api/app/develop-project/develop-project-list", METHOD.GET, transformAbpListQuery(params))
}
//新增基础数据
export async function addEssentialDataList(params) {
    return request("/api/app/develop-project/dev-project", METHOD.POST, params)
}
//编辑基础数据
export async function editEssentialDataList(params) {
    params.baseDataId = params.id;
    return request("/api/app/basic-configuration/base-data-info", METHOD.PUT, params)
}

//研发项目详情
export async function getRdProjectsDetail(Id) {
    return request(`/api/app/develop-project/dev-project-detail/${Id}`, METHOD.GET)
}
//研发项目新增子项
export async function addRdProjectsDetailList(params) {
    return request(`/api/app/develop-project/dev-project-detail-list`, METHOD.POST, params)
}
export async function editRdProjectsDetailList(params) {
    return request(`/api/app/develop-project/dev-project-detail`, METHOD.PUT, params)
}
export async function deleteRdProjectsDetailList(params) {
    return request(`/api/app/develop-project/dev-pro-detail/${params}`, METHOD.DELETE)
}
//获取工种列表
export async function getTradesList() {
    return request("/api/app/basic-configuration/base-datas", METHOD.GET)
}



export default {
    getPageList,
    addEssentialDataList,
    editEssentialDataList,
    getRdProjectsDetail,
    addRdProjectsDetailList,
    editRdProjectsDetailList,
    deleteRdProjectsDetailList,
    getTradesList
}
