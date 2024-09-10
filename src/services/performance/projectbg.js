import { request, METHOD } from '@/utils/request'
import { transformAbpListQuery, download } from '@/utils/abp'
import qs from 'querystring'
//获取列表数据
export async function getPageList(params) {
    params.AuditeType = 4;
    return request("/api/app/quote-audite/quote-audite-list", METHOD.GET, transformAbpListQuery(params))
}




export async function getPagechange(params) {
    return request(`/api/app/k-kProject/project-change-info/${params}`, METHOD.GET)
}
export async function checkAudite(params) {
    return request("/api/app/k-kProject/do-audite-quote", METHOD.POST, params)
}
export function downloadChangeFile(params) {
    let url = `${process.env.VUE_APP_API_BASE_URL}/api/DownTempExcel/DownLoadChangeFileAsync?ChangeFileBlobName=` + params.changeFileBlobName+'&downFileName='+params.changeFileName;
    download(url,  params.changeFileName);
}


