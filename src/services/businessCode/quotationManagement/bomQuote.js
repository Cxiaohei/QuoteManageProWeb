import { request, METHOD } from '@/utils/request'
import { transformAbpListQuery, download } from '@/utils/abp'
import qs from 'querystring'
//获取基础数据列表
export async function getPageList(params) {
    return request("/api/app/bom-quote/bom-quote-list", METHOD.GET, transformAbpListQuery(params))
}
//获取产品列表
export async function getAllProductList() {
    return request("/api/app/product/all-product-list", METHOD.POST, {
        "maxResultCount": 0,
        "skipCount": 0,
        "pageIndx": 0,
        // "filter": "string"
    })
}

export async function bomfilterApi(params) {
    return request("/api/app/bom-details/bom-detail-list-by-filter", METHOD.GET, transformAbpListQuery(params))
}



//获取基础数据
export async function getCategoryTypeData() {
    return request("/api/app/basic-configuration/base-datas?CategoryType=1", METHOD.GET)
}

//新增基础数据
export async function addBomDataList(params) {
    return request("/api/app/bom-quote/bom-quote", METHOD.POST, params)
}
//查询
export async function BomDetailDataList(Id) {
    return request(`/api/app/bom-quote/bom-quote-detail/${Id}`, METHOD.GET)
}



//新增明细
export async function addBomDetail(params) {
    return request("/api/app/bom-quote/bom-quote-relations", METHOD.POST, params)
}
// 编辑明细
export async function editBomDetail(params) {
    return request("/api/app/bom-quote/bom-qoute-relations", METHOD.PUT, params)
}
export async function deleteBomDetail(Id) {
    return request(`/api/app/bom-quote/bom-quote-relation/${Id}`, METHOD.DELETE)
}



export default {
    getPageList,
    addBomDataList,
    BomDetailDataList,
    addBomDetail,
    editBomDetail,
    deleteBomDetail,
    getAllProductList,
    getCategoryTypeData,
    bomfilterApi
}
