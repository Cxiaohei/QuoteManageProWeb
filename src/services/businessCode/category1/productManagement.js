import { request, METHOD } from '@/utils/request'
import { transformAbpListQuery, download } from '@/utils/abp'
import qs from 'querystring'
//获取列表数据
export async function getPageList(params) {
    return request("/api/app/product/product-list", METHOD.GET, transformAbpListQuery(params))
}
//新增物料
export async function addProductDataList(params) {
    return request("/api/app/product/product", METHOD.POST, params)
}
//编辑物料
export async function editProductDataList(params) {
    
    params.productId = params.id;
    return request("/api/app/product/product-info", METHOD.PUT, params)
}


export default {
    getPageList,
    addProductDataList,
    editProductDataList
}
