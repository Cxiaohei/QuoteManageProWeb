import { request, METHOD } from '@/utils/request'
import { transformAbpListQuery, download } from '@/utils/abp'
import qs from 'querystring'
//获取列表数据
export async function getPageList(params) {
    return request("/api/app/basic-configuration/poduct-types-list", METHOD.GET, transformAbpListQuery(params))
}
//新增产品类型
export async function addProductDataList(params) {
    return request("/api/app/basic-configuration/poduct-type", METHOD.POST, params)
}
//编辑产品类型
export async function editProductDataList(params) {
    
    params.productId = params.id;
    return request("/api/app/basic-configuration/poduct-type-info", METHOD.PUT, params)
}

//导入
export function importExcel(params, data) {
    return request(`/api/app/product/import-products`, METHOD.POST, params, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
}


export function downloadTemplate() {
    let url = `${process.env.VUE_APP_API_BASE_URL}/api/DownTempExcel/DownProductTempFile`;
    download(url, '产品模板.xlsx');
}

export default {
    getPageList,
    addProductDataList,
    editProductDataList,
    importExcel,
    downloadTemplate
}
