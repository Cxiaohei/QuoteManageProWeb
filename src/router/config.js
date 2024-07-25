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
            icon: 'slack'
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
          path: 'product',
          name: '产品管理',
          meta: {
            icon: 'codepen-circle'
          },
          component: PageView,
          children: [
            {
              path: 'productManagement',
              name: '标准产品',
              meta: {
                // authority: 'AbpIdentity.OrganizationUnits',
              },
              component: () => import('@/pages/businessCode/category1/productManagement'),
            },
            {
              path: 'productNormManagement',
              name: '非标产品',
              meta: {
                // authority: 'AbpIdentity.OrganizationUnits',
              },
              component: () => import('@/pages/businessCode/category1/productManagement'),
            },
            {
              path: 'productAllManagement',
              name: '全部产品',
              meta: {
                // authority: 'AbpIdentity.OrganizationUnits',
              },
              component: () => import('@/pages/businessCode/category1/productManagement'),
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
              path: 'allProjects',
              name: '报价单管理',
              meta: {
                // authority: 'AbpIdentity.OrganizationUnits',
              },
              component: () => import('@/pages/businessCode/quotationManagement/allProjects'),
            },
            {
              path: 'rdProjects',
              name: '研发费报价',
              meta: {
                // authority: 'AbpIdentity.OrganizationUnits',
              },
              component: () => import('@/pages/businessCode/quotationManagement/rdProjects'),
            },
            {
              path: 'rdProjectsDetail',
              name: '研发费报价详情',
              meta: {
                invisible: true,
                // authority: 'AbpIdentity.OrganizationUnits',
              },
              component: () => import('@/pages/businessCode/quotationManagement/rdProjectsDetail'),
            },
            {
              path: 'rdProjectsDetailLook',
              name: '查看研发费报价',
              meta: {
                invisible: true,
                // authority: 'AbpIdentity.OrganizationUnits',
              },
              component: () => import('@/pages/businessCode/quotationManagement/rdProjectsDetailLook'),
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
                invisible: true,
                // authority: 'AbpIdentity.OrganizationUnits',
              },
              component: () => import('@/pages/businessCode/quotationManagement/odmQuoteDetail'),
            },
            {
              path: 'bomQuote',
              name: 'OEM报价',
              meta: {
                // authority: 'AbpIdentity.OrganizationUnits',
              },
              component: () => import('@/pages/businessCode/quotationManagement/bomQuote'),
            },
            {
              path: 'bomQuoteDetail',
              name: 'OEM报价详情',
              meta: {
                invisible: true,
                // authority: 'AbpIdentity.OrganizationUnits',
              },
              component: () => import('@/pages/businessCode/quotationManagement/bomQuoteDetail'),
            },
          ]
        },

        {
          path: 'performance',
          name: '管理绩效(夸克)',
          meta: {
            icon: 'ant-cloud'
          },
          component: PageView,
          children: [
            {
              path: 'performanceManagement',
              name: '项目',
              meta: {
                // authority: 'AbpIdentity.OrganizationUnits',
              },
              component: () => import('@/pages/businessCode/performance/performanceManagement'),
            },
          ]
        },
        // {
        //   path: 'category2',
        //   name: '审批管理',
        //   meta: {
        //     icon: 'switcher'
        //   },
        //   component: PageView,
        //   children: [
        //     {
        //       path: 'productManagement',
        //       name: '标准产品',
        //       meta: {
        //         // authority: 'AbpIdentity.OrganizationUnits',
        //       },
        //       component: () => import('@/pages/businessCode/category1/productManagement'),
        //     },
        //     {
        //       path: 'productNormManagement',
        //       name: '非标产品',
        //       meta: {
        //         // authority: 'AbpIdentity.OrganizationUnits',
        //       },
        //       component: () => import('@/pages/businessCode/category1/productNormManagement'),
        //     },
        //   ]
        // },


        {
          path: 'approveManagement',
          name: '审批管理',
          meta: {
            icon: 'laptop'
          },
          component: PageView,
          children: [
            {
              path: 'scoreApprove',
              name: '项目得分',
              meta: {
                // authority: 'AbpIdentity.OrganizationUnits',
              },
              component: () => import('@/pages/approveManagement/scoreApprove'),
            },
          ]
        },

        {
          path: 'system',
          name: '系统设置',
          meta: {
            icon: 'setting'
          },
          component: PageView,
          children: [
            // {
            //   path: 'essentialData',
            //   name: '基础数据',
            //   meta: {
            //     // authority: 'AbpIdentity.OrganizationUnits',
            //   },
            //   component: () => import('@/pages/businessCode/category1/essentialData'),
            // },

            {
              path: 'craftLine',
              name: '工艺线路',
              meta: {
                // authority: 'AbpIdentity.OrganizationUnits',
              },
              component: () => import('@/pages/businessCode/category1/craftLine'),
            },
            {
              path: 'priceStrategy',
              name: '价格策略',
              meta: {
                // authority: 'AbpIdentity.OrganizationUnits',
              },
              component: () => import('@/pages/businessCode/category1/priceStrategy'),
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
            // {
            //   path: 'claimTypes',
            //   name: '声明类型',
            //   meta: {
            //     authority: 'AbpIdentity.ClaimTypes',
            //   },
            //   component: () => import('@/pages/systemManagement/claimType/claimTypes'),
            // },
            // {
            //   path: 'securityLogs',
            //   name: '安全日志',
            //   meta: {
            //     authority: 'AbpIdentity.ClaimTypes',
            //   },
            //   component: () => import('@/pages/systemManagement/claimType/securityLogs'),
            // },
            // {
            //   path: 'dataDictionary',
            //   name: '数据字典',
            //   meta: {
            //     authority: 'EasyAbp.Abp.DataDictionary.DataDictionary',
            //   },
            //   component: () => import('@/pages/systemManagement/dataDictionary/DataDictionary')
            // },
            // {
            //   path: 'auditLog',
            //   name: '审计日志',
            //   meta: {
            //     authority: 'AbpAuditLogging.Default',
            //   },
            //   component: () => import('@/pages/systemManagement/auditlogging/List'),
            // },
            // {
            //   path: 'tenant',
            //   name: '租户管理',
            //   meta: {
            //     authority: 'Saas.Tenants',
            //   },
            //   component: () => import('@/pages/systemManagement/multiTenancy/TenantList'),
            // },
          ]
        },

        {
          path: 'basicsSeting',
          name: '基础数据',
          meta: {
            icon: 'profile'
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
            }, {
              path: 'essentialTwoData',
              name: '二级基础数据',
              meta: {
                // authority: 'AbpIdentity.OrganizationUnits',
              },
              component: () => import('@/pages/businessCode/category1/essentialTwoData'),
            },
            {
              path: 'productType',
              name: '产品类型',
              meta: {
                // authority: 'AbpIdentity.OrganizationUnits',
              },
              component: () => import('@/pages/basicsSeting/productType'),
            },
            {
              path: 'productXian',
              name: '产品线',
              meta: {
                // authority: 'AbpIdentity.OrganizationUnits',
              },
              component: () => import('@/pages/basicsSeting/productXian'),
            },
          ]
        },

      ]
    }
  ]
}

export default options
