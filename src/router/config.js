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
            icon: 'slack',
            authority: 'MaterialManagement',
          },
          component: PageView,
          children: [
            {
              path: 'materialManagement',
              name: '内部物料',
              meta: {
                authority: 'InMaterialManagement',
              },
              component: () => import('@/pages/businessCode/category1/materialManagement'),
            },
            {
              path: 'outMaterialManagement',
              name: '外部物料',
              meta: {
                authority: 'OutMaterialManagement',
              },
              component: () => import('@/pages/businessCode/category1/outMaterialManagement'),
            },
          ]
        }, 
        {
          path: 'performance',
          name: '管理绩效',
          meta: {
            icon: 'ant-cloud',
            authority: 'PerformanceManagement',
          },
          component: PageView,
          children: [
            {
              path: 'performanceManagement',
              name: '项目管理',
              meta: {
                authority: 'KKProjectManagement',
              },
              component: () => import('@/pages/businessCode/performance/performanceManagement'),
            },
            {
              path: 'performanceManagementDetail',
              name: '夸克项目详情',
              meta: {
                invisible: true,
                authority: 'KKProjectManagement',
              },
              component: () => import('@/pages/businessCode/performance/performanceManagementDetail'),
            },
            {
              path: 'perMonitoring',
              name: '项目预算监控',
              meta: {
                authority: 'PerMonitoring',
              },
              component: () => import('@/pages/businessCode/performance/perMonitoring'),
            },
            {
              path: 'projectbg',
              name: '项目变更申请',
              meta: {
                authority: 'Projectbg',
              },
              component: () => import('@/pages/businessCode/performance/projectbg'),
            },
            {
              path: 'projectkb',
              name: '项目看板',
              meta: {
                authority: 'ProjectKB',
              },
              component: () => import('@/pages/businessCode/performance/projectKB'),
            },
          ]
        },
        {
          path: 'approveManagement',
          name: '审批管理',
          meta: {
            icon: 'laptop',
            authority: 'ApproveManagement',
          },
          component: PageView,
          children: [
            {
              path: 'allApprove',
              name: '审批单管理',
              meta: {
                authority: 'ApproveBillManagement',
              },
              component: () => import('@/pages/approveManagement/allApprove'),
            },
            {
              path: 'oemApprove',
              name: 'Bom报价审批',
              meta: {
                authority: 'BomApprove',
              },
              component: () => import('@/pages/approveManagement/oemApprove'),
            },
            {
              path: 'zzApprove',
              name: '制造费用报价审批',
              meta: {
                authority: 'ZzApprove',
              },
              component: () => import('@/pages/approveManagement/zzApprove'),
            },
            {
              path: 'scoreApprove',
              name: '研发费用审批',
              meta: {
                authority: 'ScoreApprove',
              },
              component: () => import('@/pages/approveManagement/scoreApprove'),
            },
            {
              path: 'odmApprove',
              name: 'Odm报价审批',
              meta: {
                authority: 'OdmApprove',
              },
              component: () => import('@/pages/approveManagement/odmApprove'),
            },
          ]
        },

        {
          path: 'product',
          name: '产品管理',
          meta: {
            icon: 'codepen-circle',
            authority: 'ProductManagement',
          },
          component: PageView,
          children: [
            {
              path: 'productAllManagement',
              name: '全部产品',
              meta: {
                authority: 'AllProduct',
              },
              component: () => import('@/pages/businessCode/category1/productManagement'),
            },
            {
              path: 'productManagement',
              name: '标准产品',
              meta: {
                authority: 'BzProduct',
              },
              component: () => import('@/pages/businessCode/category1/productManagement'),
            },
            {
              path: 'productNormManagement',
              name: '非标产品',
              meta: {
                authority: 'FbProduct',
              },
              component: () => import('@/pages/businessCode/category1/productManagement'),
            },
            
          ]
        },
        {
          path: 'quotationManagement',
          name: '报价管理',
          meta: {
            icon: 'setting',
            authority: 'QuotationManagement',
          },
          component: PageView,
          children: [
            {
              path: 'allProjects',
              name: '报价单管理',
              meta: {
                authority: 'QuotationBill',
              },
              component: () => import('@/pages/businessCode/quotationManagement/allProjects'),
            },
            {
              path: 'ProjectIncomeMonitoring',
              name: '项目收益监控',
              meta: {
                authority: 'RdProjects',
              },
              component: () => import('@/pages/businessCode/quotationManagement/ProjectIncomeMonitoring'),
            },
            {
              path: 'rdProjects',
              name: '研发费报价',
              meta: {
                authority: 'RdProjects',
              },
              component: () => import('@/pages/businessCode/quotationManagement/rdProjects'),
            },
            {
              path: 'rdProjectsDetail',
              name: '研发费报价详情',
              meta: {
                invisible: true,
                authority: 'RdProjects',
              },
              component: () => import('@/pages/businessCode/quotationManagement/rdProjectsDetail'),
            },
            {
              path: 'rdProjectsDetailLook',
              name: '查看研发费报价',
              meta: {
                invisible: true,
                authority: 'RdProjects',
              },
              component: () => import('@/pages/businessCode/quotationManagement/rdProjectsDetailLook'),
            },
            {
              path: 'odmQuote',
              name: 'ODM报价',
              meta: {
                authority: 'OdmQuote',
              },
              component: () => import('@/pages/businessCode/quotationManagement/odmQuote'),
            },
            {
              path: 'odmQuoteDetail',
              name: 'ODM详情',
              meta: {
                invisible: true,
                authority: 'OdmQuote',
              },
              component: () => import('@/pages/businessCode/quotationManagement/odmQuoteDetail'),
            },
            {
              path: 'bomQuote',
              name: 'Bom报价',
              meta: {
                authority: 'BomQuote',
              },
              component: () => import('@/pages/businessCode/quotationManagement/bomQuote'),
            },
            {
              path: 'bomQuoteDetail',
              name: 'Bom报价详情',
              meta: {
                invisible: true,
                authority: 'BomQuote',
              },
              component: () => import('@/pages/businessCode/quotationManagement/bomQuoteDetail'),
            },
          ]
        },
        {
          path: 'intelligentQuotation',
          name: '智能报价管理',
          meta: {
            icon: 'bulb',
          },
          component: PageView,
          children: [
            {
              path: 'bomQuote',
              name: 'BOM报价管理',
              component: () => import('@/pages/businessCode/quotationManagement/bomQuote'),
            },
            {
              path: 'bomQuoteDetail',
              name: 'Bom报价详情',
              meta: {
                invisible: true,
              },
              component: () => import('@/pages/businessCode/quotationManagement/bomQuoteDetail'),
            },
            {
              path: 'rdProjects',
              name: '研发费用报价管理',
              component: () => import('@/pages/businessCode/quotationManagement/rdProjects'),
            },
            {
              path: 'rdProjectsDetail',
              name: '研发费报价详情',
              meta: {
                invisible: true,
              },
              component: () => import('@/pages/businessCode/quotationManagement/rdProjectsDetail'),
            },
            {
              path: 'rdProjectsDetailLook',
              name: '查看研发费报价',
              meta: {
                invisible: true,
              },
              component: () => import('@/pages/businessCode/quotationManagement/rdProjectsDetailLook'),
            },
          ]
        },
        {
          path: 'templateManagement',
          name: '模板管理',
          meta: {
            icon: 'laptop',
            authority: 'TemplateManagement',
          },
          component: PageView,
          children: [
            {
              path: 'basetemplate',
              name: '基础模板',
              meta: {
                authority: 'BasetemplateManagement',
              },
              component: () => import('@/pages/approveManagement/basetemplate'),
            }
          ]
        },

        {
          path: 'priceStrategyManagement',
          name: '价格策略',
          meta: {
            icon: 'laptop',
            authority: 'PriceStrategyManagement',
          },
          component: PageView,
          children: [
            {
              path: 'craftLine',
              name: '工艺线路',
              meta: {
                authority: 'CraftLine',
              },
              component: () => import('@/pages/businessCode/category1/craftLine'),
            },
            {
              path: 'essentialData',
              name: '工时费用',
              meta: {
                authority: 'EssentialData',
              },
              component: () => import('@/pages/businessCode/category1/essentialData'),
            },
            {
              path: 'essentialTwoData',
              name: '物料部件',
              meta: {
                authority: 'EssentialTwoData',
              },
              component: () => import('@/pages/businessCode/category1/essentialTwoData'),
            },
           
            {
              path: 'pcbStrategy',
              name: 'PCB报价策略',
              meta: {
                authority: 'PCBPriceStrategy',
              },
              component: () => import('@/pages/businessCode/category1/priceStrategy'),
            },
            {
              path: 'zzflpriceStrategy',
              name: '制造费率策略',
              meta: {
                authority: 'ZzflpriceStrategy',
              },
              component: () => import('@/pages/businessCode/category1/zzflpriceStrategy'),
            },
            {
              path: 'jgjpriceStrategy',
              name: '结构件报价策略',
              meta: {
                authority: 'JgjpriceStrategy',
              },
              component: () => import('@/pages/businessCode/category1/jgjpriceStrategy'),
            },
            {
              path: 'jgfpriceStrategy',
              name: '加工费用报价策略',
              meta: {
                authority: 'JgfpriceStrategy',
              },
              component: () => import('@/pages/businessCode/category1/jgfpriceStrategy'),
            },
          ]
        },

        {
          path: 'system',
          name: '系统设置',
          meta: {
            icon: 'setting',
          
          },
          component: PageView,
          children: [
            {
              path: 'developmentType',
              name: '研发类型',
              meta: {
                // authority: 'ProductType',
              },
              component: () => import('@/pages/basicsSeting/developmentType'),
            },
            {
              path: 'productType',
              name: '产品类型',
              meta: {
                authority: 'ProductType',
              },
              component: () => import('@/pages/basicsSeting/productType'),
            },
            {
              path: 'productXian',
              name: '产品线',
              meta: {
                authority: 'ProductXian',
              },
              component: () => import('@/pages/basicsSeting/productXian'),
            },
            {
              path: 'role',
              name: '角色管理',
              meta: {
                authority: 'AbpIdentity.Roles',
              },
              component: () => import('@/pages/systemManagement/identity/RoleList'),
            },
            {
              path: 'user',
              name: '用户管理',
              meta: {
                authority: 'AbpIdentity.Users',
              },
              component: () => import('@/pages/systemManagement/identity/UserList'),
            },
            {
              path: 'organization',
              name: '组织机构',
              meta: {
                authority: 'AbpIdentity.OrganizationUnits',
              },
              component: () => import('@/pages/systemManagement/organization/organizationUnits'),
            },
            {
              path: 'userInfo',
              name: '个人中心',
              meta: {
                invisible: true,
              },
              component: () =>
                import('@/pages/systemManagement/identity/userInfo.vue'),
            }
          ]
        },
      ]
    }
  ]
}

export default options
