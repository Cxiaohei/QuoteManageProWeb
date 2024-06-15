//跨域代理前缀
// const API_PROXY_PREFIX='/api'
// const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIX
// const BASE_URL = process.env.VUE_APP_API_BASE_URL
const BASE_URL = process.env.VUE_APP_API_BASE_URL
const LOGIN_URL = process.env.VUE_APP_API_BASE_LOGIN
module.exports = {
  LOGIN: `${LOGIN_URL}/connect/token`,
  ROUTES: `/routes`,
  ApplicationConfiguration:`/api/abp/application-configuration`,
  GOODS: `${BASE_URL}/goods`,
  GOODS_COLUMNS: `${BASE_URL}/columns`
}

