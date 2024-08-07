import { LOGIN, ROUTES, ApplicationConfiguration } from '@/services/api'
import { request, METHOD, removeAuthorization } from '@/utils/request'
import qs from 'querystring'
/**
 * 登录服务
 * @param name 账户名
 * @param password 账户密码
 * @returns {Promise<AxiosResponse<T>>}
 */
// export async function login(name, password) {
//   return request(LOGIN, METHOD.POST, {
//     name: name,
//     password: password
//   })
// }
export async function login(username, password, tenant) {
  const params = {
    username: username,
    password: password,
    client_id: 'QuoteManagePro_App',
    // client_secret: '1q2w3e*',
    grant_type: "password",
    scope:'QuoteManagePro', //AbpVnext  Framework
    // scope:"Framework" //AbpVnext  Framework
  };
  let config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  }
  if (tenant) {
    config.headers.__tenant = tenant;
  }
  return request(LOGIN, METHOD.POST, qs.stringify(params), config)
}
export async function getRoutesConfig() {
  return request(ROUTES, METHOD.GET)
}

/**
 * 退出登录
 */
export function logout() {
  localStorage.removeItem(process.env.VUE_APP_ROUTES_KEY)
  localStorage.removeItem(process.env.VUE_APP_PERMISSIONS_KEY)
  localStorage.removeItem(process.env.VUE_APP_ROLES_KEY)
  removeAuthorization()
}
export async function applicationConfiguration() {
  return request(ApplicationConfiguration, METHOD.GET)
}
export async function pcLoginAcode(params) {
  return request(`/api/wechatManagement/mini-programs/login/pc-login-acode`, METHOD.GET, params)
}
export async function pcLogin(params) {
  return request(`/api/wechatManagement/mini-programs/login/pc-code-login`, METHOD.POST, params)
}

//获取图片验证码
export async function getImgCode(timestamp) {
  return request(
    `/api/administration-service/common/validatecode/${timestamp}`,
    METHOD.GET
  );
}
//发送短信验证码
export async function sendCode(params) {
  return request(
    `/api/administration-service/smsLogs/send-verification-code`,
    METHOD.POST,
    params
  );
}

export default {
  login,
  logout,
  getRoutesConfig,
  applicationConfiguration,
  pcLoginAcode,
  pcLogin,
  getImgCode,
  sendCode
}
