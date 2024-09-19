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

//删除bom报价
export async function deleteBomQuote(params) {
    return request(`/api/app/bom-quote/bom-quote/${params}`, METHOD.DELETE)
}
//再次报价bom
export async function reCreateBomQuote(params) {
    return request(`/api/app/bom-quote/re-create-bom-quote/${params}`, METHOD.POST)
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

//导入
export function importExcel(params, data) {
    return request(`/api/app/bom-quote/import-dSBom-details`, METHOD.POST, params, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
}


export function downloadTemplate() {
    let url = `${process.env.VUE_APP_API_BASE_URL}/api/DownTempExcel/DownBomQuoteTempFile`;
    download(url, 'BOM模版.xlsx');
}



/// Bom报价日志 0
/// 制作费用报价日志 1
/// 研发费用报价日志 2
/// Odm报价日志 3
/// 审批日志 4
export async function getLogList(params) {
    return request("/api/app/quote-log/quote-log-list", METHOD.GET, transformAbpListQuery(params))
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
    bomfilterApi,
    importExcel,
    downloadTemplate,
    getLogList
}
