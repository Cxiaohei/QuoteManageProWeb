import { request, METHOD } from '@/utils/request'
import { transformAbpListQuery, download } from '@/utils/abp'
import qs from 'querystring'

//获取新BOM报价列表
export async function getPageList(params) {
    return request("/api/app/bom-quote-new/bom-quote-new-list", METHOD.GET, transformAbpListQuery(params))
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

//获取所有新BOM报价单不分页
export async function getBomQuoteNewAllSelect(params) {
    return request("/api/app/bom-quote-new/bom-quote-new-all-select", METHOD.GET, {
        "maxResultCount": 0,
        "skipCount": 0,
        "pageIndx": 0,
        "developProjectId": params
    })
}

export async function bomfilterApi(params) {
    return request("/api/app/bom-details/bom-detail-list-by-filter", METHOD.GET, transformAbpListQuery(params))
}

//获取基础数据
export async function getCategoryTypeData() {
    return request("/api/app/basic-configuration/base-datas?CategoryType=1", METHOD.GET)
}

//新增新BOM报价
export async function addBomQuoteNewDataList(params) {
    return request("/api/app/bom-quote-new/bom-quote-new", METHOD.POST, params)
}

//查询新BOM报价详情
export async function BomQuoteNewDetailDataList(Id) {
    return request(`/api/app/bom-quote-new/bom-quote-new-detail/${Id}`, METHOD.GET)
}

//删除新BOM报价
export async function deleteBomQuoteNew(params) {
    return request(`/api/app/bom-quote-new/bom-quote-new/${params}`, METHOD.DELETE)
}

//再次报价新BOM
export async function reCreateBomQuoteNew(params) {
    return request(`/api/app/bom-quote-new/re-create-bom-quote-new/${params}`, METHOD.POST)
}

//新增明细
export async function addBomQuoteNewDetail(params) {
    return request("/api/app/bom-quote-new/bom-quote-new-relations", METHOD.POST, params)
}

// 编辑明细
export async function editBomQuoteNewDetail(params) {
    return request("/api/app/bom-quote-new/bom-quote-new-relations", METHOD.PUT, params)
}

export async function deleteBomQuoteNewDetail(Id) {
    return request(`/api/app/bom-quote-new/bom-quote-new-relation/${Id}`, METHOD.DELETE)
}

//导入
export function importExcel(params, data) {
    return request(`/api/app/bom-quote-new/import-dSBom-details`, METHOD.POST, params, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
}

export function downloadTemplate() {
    let url = `${process.env.VUE_APP_API_BASE_URL}/api/DownTempExcel/DownBomQuoteNewTempFile`;
    download(url, '新BOM模版.xlsx');
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
    addBomQuoteNewDataList,
    BomQuoteNewDetailDataList,
    addBomQuoteNewDetail,
    editBomQuoteNewDetail,
    deleteBomQuoteNewDetail,
    getAllProductList,
    getCategoryTypeData,
    bomfilterApi,
    importExcel,
    downloadTemplate,
    getLogList,
    deleteBomQuoteNew,
    reCreateBomQuoteNew
}

