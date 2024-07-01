import { request, METHOD } from '@/utils/request'
import { transformAbpListQuery, download } from '@/utils/abp'
import qs from 'querystring'
//获取基础数据列表
export async function getPageList(params) {
    return request("/api/app/odm-quote/odm-quote-list", METHOD.GET, transformAbpListQuery(params))
}

//新增基础数据
export async function addOdmDataList(params) {
    return request("/api/app/odm-quote/odm-quote", METHOD.POST, params)
}
export async function OdmDetailDataList(Id) {
    return request(`/api/app/odm-quote/odm-quote-detail/${Id}`, METHOD.GET)
}

//编辑基础数据
// export async function editEssentialDataList(params) {
//     return request("/api/app/basic-configuration/base-data-info", METHOD.PUT, params)
// }
//获取产品列表
export async function getAllProductList() {
    return request("/api/app/product/all-product-list", METHOD.POST, {
        "maxResultCount": 0,
        "skipCount": 0,
        "pageIndx": 0,
        // "filter": "string"
    })
}


//研发项目详情
export async function getRdProjectsDetail(Id) {
    return request(`/api/app/develop-project/dev-project-detail/${Id}`, METHOD.GET)
}
//bom详情
export async function BomDetailDataList(Id) {
    return request(`/api/app/bom-quote/bom-quote-detail/${Id}`, METHOD.GET)
}



export default {
    getPageList,
    addOdmDataList,
    OdmDetailDataList,
    getAllProductList,
    getRdProjectsDetail,
    BomDetailDataList
}
