import { request, METHOD } from '@/utils/request'
import { transformAbpListQuery, download } from '@/utils/abp'
import qs from 'querystring'
//获取列表数据
export async function getPageList(params) {
    return request("/api/app/bom-details/bom-detail-list", METHOD.GET, transformAbpListQuery(params))
}
//新增内部物料
export async function addEssentialDataList(params) {
    return request("/api/app/bom-details/bom-detail", METHOD.POST, params)
}
//编辑内部物料
export async function editEssentialDataList(params) {
    // params.baseDataId = params.id;
    return request("/api/app/bom-details/bom-detail-info", METHOD.PUT, params)
}


export default {
    getPageList,
    addEssentialDataList,
    editEssentialDataList
}
