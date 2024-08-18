import { request, METHOD } from '@/utils/request'
import { transformAbpListQuery, download } from '@/utils/abp'
import qs from 'querystring'
//获取列表数据
export async function getPageList(params) {
    return request("/api/app/k-kProject/bom-detail-list", METHOD.GET, transformAbpListQuery(params))
}

export async function getMonitoringPageList(params) {
    return request("/api/app/k-kProject/project-buget-info-list", METHOD.GET, transformAbpListQuery(params))
}

export async function getPageListDetail(params) {
    return request(`/api/app/k-kProject/k-kProject-detail/${params}`, METHOD.GET)
}

//新增夸克
export async function addProductDataList(params) {
    return request("/api/app/k-kProject/k-kProject", METHOD.POST, params)
}
//编辑夸克
export async function editProductDataList(params) {
    params.productId = params.id;
    return request("/api/app/k-kProject/k-kProject-info", METHOD.PUT, params)
}

//项目变更
export async function changeProductDataList(params) {
    params.productId = params.id;
    return request("/api/app/k-kProject/submit-project-change-request", METHOD.POST, params)
}


//导入
export async function importExcel(params, data) {
    return request(`/api/app/product/import-products`, METHOD.POST, params, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
}

export async function downloadTemplate() {
    let url = `${process.env.VUE_APP_API_BASE_URL}/api/DownTempExcel/DownProductTempFile`;
    download(url, '产品模板.xlsx');
}


//目标增删
export async function addKkMb(params) {
    return request("/api/app/k-kProject/project-objective-detail", METHOD.POST, params)
}
export async function editKkMb(params) {
    return request("/api/app/k-kProject/project-objective-detail", METHOD.PUT, params)
}
export async function removeKkMb(Id) {
    return request(`/api/app/k-kProject/project-objective-detail/${Id}`, METHOD.DELETE)
}

//费用
export async function addKkFy(params) {
    return request("/api/app/k-kProject/project-buget-detail", METHOD.POST, params)
}

export async function editKkFy(params) {
    return request("/api/app/k-kProject/project-buget-detail-info", METHOD.PUT, params)
}

//提交项目确认
export async function setKKProjectId(KKProjectId) {
    return request(`/api/app/k-kProject/submit-project-info/${KKProjectId}`, METHOD.POST)
}




// export default {
//     getPageList,
//     addProductDataList,
//     editProductDataList,
//     getPageListDetail,
//     importExcel,
//     downloadTemplate,
// }
