import { request, METHOD } from '@/utils/request'
import { transformAbpListQuery, download } from '@/utils/abp'
import qs from 'querystring'
//获取列表数据
export async function getPageList(params) {
    return request("/api/app/tempatet-file/template-file-list", METHOD.GET, transformAbpListQuery(params))
}

export async function templateFileAdd(params) {
    return request("/api/app/tempatet-file/template-file", METHOD.POST, params, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
}
export async function templateFileEdit(params,TemplateFileId) {
    return request(`/api/app/tempatet-file/template-file-info/${TemplateFileId}`, METHOD.PUT, params, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
}



export async function checkAudite(params) {
    return request("/api/app/quote-audite/audite-quote-develop-project", METHOD.POST, params)
}


//导入
// export function importExcel(params, data) {
//     return request(`/api/app/bom-quote/import-dSBom-details`, METHOD.POST, params, {
//         headers: {
//             'Content-Type': 'multipart/form-data',
//         },
//     })
// }


// export function downloadTemplate(params) {
//     request("/api/app/tempatet-file/down-load-template-file?TemplateFileBlobName=" + params.templateFileBlobName, METHOD.POST).then(res => {
//         let url = res.data
//         console.log(url)
//         download(url, params.templateFileName);
//     })
// }
export function downloadTemplate(params) {
    let url = `${process.env.VUE_APP_API_BASE_URL}/api/DownTempExcel/DownLoadTemplateFileAsync?TemplateFileBlobName=` + params.templateFileBlobName+'&downFileName='+params.templateFileName;
    download(url,  params.templateFileName);
}



export default {
    getPageList,
    templateFileAdd,
    templateFileEdit,
    checkAudite,
    downloadTemplate,
}
