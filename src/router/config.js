import TabsView from '@/layouts/tabs/TabsView'
import BlankView from '@/layouts/BlankView'
import PageView from '@/layouts/PageView'

// 路由配置
const options = {
  routes: [
    {
      path: '/login',
      name: '登录页',
      component: () => import('@/pages/login')
    },
    {
      path: '*',
      name: '404',
      component: () => import('@/pages/exception/404'),
    },
    {
      path: '/403',
      name: '403',
      component: () => import('@/pages/exception/403'),
    },
    {
      path: '/',
      name: '首页',
      component: TabsView,
      redirect: '/login',
      children: [
        {
          path: 'dashboard',
          name: '首页',
          meta: {
            icon: 'copy'
          },
          component: BlankView,
          children: [
            {
              path: 'home',
              name: '控制台',
              meta: {
                icon: 'dashboard',
              },
              component: () => import('@/pages/demo/Demo'),
            },
          ]
        },
        {
          path: 'category1',
          name: '物料管理',
          meta: {
            icon: 'setting'
          },
          component: PageView,
          children: [
            {
              path: 'materialManagement',
              name: '内部物料',
              meta: {
                // authority: 'AbpIdentity.OrganizationUnits',
              },
              component: () => import('@/pages/businessCode/category1/materialManagement'),
            },
            {
              path: 'outMaterialManagement',
              name: '外部物料',
              meta: {
                // authority: 'AbpIdentity.OrganizationUnits',
              },
              component: () => import('@/pages/businessCode/category1/outMaterialManagement'),
            },
          ]
        },
        {
          path: 'quotationManagement',
          name: '报价管理',
          meta: {
            icon: 'setting'
          },
          component: PageView,
          children: [
            {
              path: 'rdProjects',
              name: '研发项目',
              meta: {
                // authority: 'AbpIdentity.OrganizationUnits',
              },
              component: () => import('@/pages/businessCode/quotationManagement/rdProjects'),
            },
            {
              path: 'rdProjectsDetail',
              name: '研发项目详情',
              meta: {
                invisible: true,
                // authority: 'AbpIdentity.OrganizationUnits',
              },
              component: () => import('@/pages/businessCode/quotationManagement/rdProjectsDetail'),
            },
            {
              path: 'odmQuote',
              name: 'ODM报价',
              meta: {
                // authority: 'AbpIdentity.OrganizationUnits',
              },
              component: () => import('@/pages/businessCode/quotationManagement/odmQuote'),
            },
            {
              path: 'odmQuoteDetail',
              name: 'ODM详情',
              meta: {
                // authority: 'AbpIdentity.OrganizationUnits',
              },
              component: () => import('@/pages/businessCode/quotationManagement/odmQuoteDetail'),
            },
            {
              path: 'bomQuote',
              name: 'BOM报价',
              meta: {
                // authority: 'AbpIdentity.OrganizationUnits',
              },
              component: () => import('@/pages/businessCode/quotationManagement/bomQuote'),
            },
            {
              path: 'bomQuoteDetail',
              name: 'BOM报价详情',
              meta: {
                invisible: true,
                // authority: 'AbpIdentity.OrganizationUnits',
              },
              component: () => import('@/pages/businessCode/quotationManagement/bomQuoteDetail'),
            },
          ]
        },

        {
          path: 'category2',
          name: '产品管理',
          meta: {
            icon: 'setting'
          },
          component: PageView,
          children: [
            {
              path: 'productManagement',
              name: '产品管理',
              meta: {
                // authority: 'AbpIdentity.OrganizationUnits',
              },
              component: () => import('@/pages/businessCode/category1/productManagement'),
            },
            {
              path: 'category2list2',
              name: '目录1',
              meta: {
                // authority: 'AbpIdentity.OrganizationUnits',
              },
              component: () => import('@/pages/businessCode/category2/list1'),
            },
          ]
        },
        {
          path: 'system',
          name: '系统管理',
          meta: {
            icon: 'setting'
          },
          component: PageView,
          children: [
            {
              path: 'essentialData',
              name: '基础数据',
              meta: {
                // authority: 'AbpIdentity.OrganizationUnits',
              },
              component: () => import('@/pages/businessCode/category1/essentialData'),
            },
            {
              path: 'role',
              name: '角色管理',
              meta: {
                // authority: 'AbpIdentity.Roles',
              },
              component: () => import('@/pages/systemManagement/identity/RoleList'),
            },
            {
              path: 'user',
              name: '用户管理',
              meta: {
                // authority: 'AbpIdentity.Users',
              },
              component: () => import('@/pages/systemManagement/identity/UserList'),
            },
            {
              path: 'organization',
              name: '组织机构',
              meta: {
                // authority: 'AbpIdentity.OrganizationUnits',
              },
              component: () => import('@/pages/systemManagement/organization/organizationUnits'),
            },
            {
              path: 'claimTypes',
              name: '声明类型',
              meta: {
                authority: 'AbpIdentity.ClaimTypes',
              },
              component: () => import('@/pages/systemManagement/claimType/claimTypes'),
            },
            {
              path: 'securityLogs',
              name: '安全日志',
              meta: {
                authority: 'AbpIdentity.ClaimTypes',
              },
              component: () => import('@/pages/systemManagement/claimType/securityLogs'),
            },
            {
              path: 'dataDictionary',
              name: '数据字典',
              meta: {
                authority: 'EasyAbp.Abp.DataDictionary.DataDictionary',
              },
              component: () => import('@/pages/systemManagement/dataDictionary/DataDictionary')
            },
            {
              path: 'auditLog',
              name: '审计日志',
              meta: {
                authority: 'AbpAuditLogging.Default',
              },
              component: () => import('@/pages/systemManagement/auditlogging/List'),
            },
            {
              path: 'tenant',
              name: '租户管理',
              meta: {
                authority: 'Saas.Tenants',
              },
              component: () => import('@/pages/systemManagement/multiTenancy/TenantList'),
            },
          ]
        },
      ]
    }
  ]
}

export default options
