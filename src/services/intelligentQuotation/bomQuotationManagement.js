import { request, METHOD } from '@/utils/request'
import { transformAbpListQuery, download } from '@/utils/abp'

/**
 * 智能BOM报价单管理相关API
 */

// 获取智能BOM报价单列表（分页）
export async function getPageList(params) {
  return request("/api/app/smart-bom-quote/smart-bom-quote-list", METHOD.GET, transformAbpListQuery(params))
}

// 获取所有智能BOM报价单（不分页）
export async function getSmartBomQuoteAllSelect(params) {
  return request("/api/app/smart-bom-quote/smart-bom-quote-all-select", METHOD.GET, {
    "maxResultCount": 0,
    "skipCount": 0,
    "pageIndx": 0,
    "developProjectId": params
  })
}

// 获取智能BOM报价单详情
export async function getSmartBomQuoteDetail(Id) {
  return request(`/api/app/smart-bom-quote/smart-bom-quote-detail/${Id}`, METHOD.GET)
}

// 创建智能BOM报价单
export async function createSmartBomQuote(params) {
  return request("/api/app/smart-bom-quote/smart-bom-quote", METHOD.POST, params)
}

// 删除智能BOM报价单
export async function deleteSmartBomQuote(id) {
  return request(`/api/app/smart-bom-quote/smart-bom-quote?Id=${id}`, METHOD.DELETE)
}

// 再次报价
export async function reCreateSmartBomQuote(id) {
  return request(`/api/app/smart-bom-quote/re-create-smart-bom-quote?SmartBomQuoteId=${id}`, METHOD.POST)
}

// 新增智能BOM报价明细
export async function addSmartBomQuoteRelations(params) {
  return request("/api/app/smart-bom-quote/smart-bom-quote-relations", METHOD.POST, params)
}

// 更新智能BOM报价明细
export async function updateSmartBomQuoteRelations(params) {
  return request("/api/app/smart-bom-quote/smart-bom-quote-relations", METHOD.PUT, params)
}

// 删除智能BOM报价明细
export async function deleteSmartBomQuoteRelation(Id) {
  return request(`/api/app/smart-bom-quote/smart-bom-quote-relation?Id=${Id}`, METHOD.DELETE)
}

// 下载智能BOM报价导入模板
export function downloadTemplate() {
  let url = `${process.env.VUE_APP_API_BASE_URL}/api/app/smart-bom-quote/smart-bom-quote-temp-file-source`;
  download(url, '智能BOM报价模板.xlsx');
}

// 导入智能BOM明细
export function importExcel(params) {
  return request(`/api/app/smart-bom-quote/import-smart-bom-details`, METHOD.POST, params, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

// 获取产品列表
export async function getAllProductList() {
  return request("/api/app/product/all-product-list", METHOD.POST, {
    "maxResultCount": 0,
    "skipCount": 0,
    "pageIndx": 0,
  })
}

// 获取基础数据（部件名称）
export async function getCategoryTypeData() {
  return request("/api/app/basic-configuration/base-datas?CategoryType=1", METHOD.GET)
}

// 获取日志列表
// 智能报价日志类型 SmartQuoteLog
export async function getLogList(params) {
  return request("/api/app/quote-log/quote-log-list", METHOD.GET, transformAbpListQuery(params))
}

export default {
  getPageList,
  getSmartBomQuoteAllSelect,
  getSmartBomQuoteDetail,
  createSmartBomQuote,
  deleteSmartBomQuote,
  reCreateSmartBomQuote,
  addSmartBomQuoteRelations,
  updateSmartBomQuoteRelations,
  deleteSmartBomQuoteRelation,
  downloadTemplate,
  importExcel,
  getAllProductList,
  getCategoryTypeData,
  getLogList
}

