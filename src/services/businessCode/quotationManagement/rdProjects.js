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
//删除研发项目报价
export async function deleteDevProject(params) {
    return request(`/api/app/develop-project/dev-project/${params}`, METHOD.DELETE)
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
    return request(`/api/app/develop-project/dev-project-detail-list`, METHOD.PUT, params)
}
export async function deleteRdProjectsDetailList(params) {
    return request(`/api/app/develop-project/dev-pro-detail/${params}`, METHOD.DELETE)
}
//获取工种列表
export async function getTradesList(params) {
    return request("/api/app/basic-configuration/base-datas", METHOD.GET,params)
}

//计算项目得分
export async function calculateProjectScore(params) {
    return request(`/api/app/develop-project/calculate-project-score`, METHOD.POST, params)
}
//设置评分
export async function setProjectScore(params) {
    return request(`/api/app/develop-project/project-score`, METHOD.POST, params)
}
//获取项目得分详情
export async function getProjectScore(Id) {
    return request(`/api/app/develop-project/project-score-detail/${Id}`, METHOD.GET)
}
//获取项目得分详情
export async function editProjectScore(params) {
    return request(`/api/app/develop-project/project-score-info`, METHOD.PUT, params)
}

//创建审批
export async function setAudite(params) {
    return request(`/api/app/develop-project/quote-audite`, METHOD.POST, params)
}



export default {
    getPageList,
    addEssentialDataList,
    editEssentialDataList,
    getRdProjectsDetail,
    addRdProjectsDetailList,
    editRdProjectsDetailList,
    deleteRdProjectsDetailList,
    getTradesList,
    calculateProjectScore,
    setProjectScore,
    editProjectScore,
    setAudite
}
