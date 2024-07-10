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

//导入
export function importExcel(params, data) {
    return request(`/api/app/bom-details/import-dSBom-details`, METHOD.POST, params, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
}


export function downloadTemplate() {
    let url = `${process.env.VUE_APP_API_BASE_URL}/api/DownTempExcel/DownDSBomDetailTempFile`;
    download(url, '内部物料模板.xlsx');
}

export default {
    getPageList,
    addEssentialDataList,
    editEssentialDataList,
    importExcel,
    downloadTemplate
}
