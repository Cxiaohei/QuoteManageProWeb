<template>
  <div>
    <a-card>
      <div class="queryFromBox">
        <a-descriptions title="基础信息" bordered>
          <a-descriptions-item
            :label="item.label"
            bordered
            v-for="(item, index) in queryFromDataList"
            :key="index"
          >
            <span>{{ queryFrom[item.key] }}</span>
          </a-descriptions-item>
        </a-descriptions>
      </div>
      <a-button type="primary" @click="setShenpi">发起审批</a-button>
      研发报价单：{{ queryFrom.developProjectId }}
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="研发费报价">
          <div style="padding-top: 30px">
            <h3>
              研发费报价:
              <a-select
                style="width: 250px"
                v-model="queryFrom.developProjectId"
                :disabled="allDevprojectTableData.length!=0"
                placeholder="研发报价单"
                allowClear
              >
                <a-select-option
                  :value="item.id"
                  v-for="(item, index) in DevelopProjectList"
                  :key="index"
                >{{ item.projectName }}</a-select-option>
              </a-select>
            </h3>

            <a-table
              v-if="allDevprojectTableData"
              rowKey="id"
              :columns="devprojectColumns"
              :dataSource="allDevprojectTableData"
              :pagination="false"
              bordered
            >
              <!-- 子类 -->
              <span slot="subclasses" slot-scope="text, record">
                <a-textarea v-model="record.subclasses" style="width: 150px"></a-textarea>
              </span>
              <!-- 费用说明 -->
              <span slot="feeDescription" slot-scope="text, record">
                <a-textarea v-model="record.feeDescription" style="width: 150px"></a-textarea>
              </span>
              <!-- 工种 -->
              <span slot="trades" slot-scope="text, record">
                <a-select
                  v-model="record.trades"
                  style="width: 150px"
                  placeholder="工种"
                  @change="changeTrades(record)"
                >
                  <a-select-option
                    :value="item.id"
                    v-for="(item, index) in TradesList"
                    :key="index"
                  >{{ item.categoryName }}</a-select-option>
                </a-select>
              </span>

              <!-- 费用类型 -->
              <span slot="detailFeeType" slot-scope="text, record">
                <a-select
                  v-model="record.detailFeeType"
                  style="width: 80px"
                  placeholder="类型"
                  @change="changeFeeType(record)"
                >
                  <a-select-option :value="0">费用</a-select-option>
                  <a-select-option :value="1">人工</a-select-option>
                </a-select>
              </span>

              <!-- 工程师级别 -->
              <span slot="engineerLevel" slot-scope="text, record">
                <a-select v-model="record.engineerLevel" style="width: 80px" placeholder="等级">
                  <a-select-option :value="0">初级</a-select-option>
                  <a-select-option :value="1">中级</a-select-option>
                  <a-select-option :value="2">高级</a-select-option>
                  <a-select-option :value="3">资深</a-select-option>
                </a-select>
              </span>

              <!-- 折扣率 -->
              <span slot="discountedRate" slot-scope="text, record">
                <a-input v-model="record.discountedRate" style="width: 50px"></a-input>
              </span>
              <!-- 数量 -->
              <span slot="quantityNum" slot-scope="text, record">
                <a-input
                  v-model="record.quantityNum"
                  style="width: 80px"
                  @change="changeNum(record)"
                ></a-input>
              </span>
              <!-- 单价 -->
              <span slot="unitPrice" slot-scope="text, record">
                <a-input v-model="record.unitPrice" style="width: 80px" @change="changeNum(record)"></a-input>
              </span>
              <!-- 参考值 -->
              <span slot="referenceValue" slot-scope="text, record">
                <a-textarea v-model="record.referenceValue" style="width: 150px"></a-textarea>
              </span>
              <!-- 备注 -->
              <span slot="remarks" slot-scope="text, record">
                <a-textarea v-model="record.remarks" style="width: 150px"></a-textarea>
              </span>
            </a-table>
            <h3>项目得分</h3>
            <a style="margin-right: 15px; text-decoration: underline">
              <span style="font-size: 50px">{{ finalScore }}</span>
            </a>
            <!-- <a-table
              :columns="columns1"
              :data-source="data11"
              :pagination="false"
            >
              <span slot="action" slot-scope="text, record">
                <a
                  href="javascript:;"
                  @click="RdProjectsDetail(record, 'detail')"
                  style="margin-right: 5px"
                  >详情</a
                >
              </span>
            </a-table>-->
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="BOM报价" force-render>
          <div style="padding-top: 30px">
            <h3>
              BOM报价
              <a-button type="primary" @click="addBomQuote" v-if="data22.length == 0">添加</a-button>
            </h3>
            <div style="padding-top: 20px">
              <h3>
                电子料
                <a-button type="primary" @click="addDetailDataList2">新增</a-button>
              </h3>
              <a-table
                :rowKey="
            (data, index) => {
              return index;
            }
          "
                :columns="columns"
                :dataSource="detailDataList2"
                :pagination="false"
                bordered
              >
                <span slot="action" slot-scope="text, record, index">
                  <a-popconfirm
                    v-if="record.isadd"
                    title="确定新增该条数据吗?"
                    ok-text="确定"
                    cancel-text="取消"
                    @confirm="confirmAddList(record)"
                  >
                    <a href="javascript:;" style="margin-right: 5px">新增</a>
                  </a-popconfirm>
                  <a
                    href="javascript:;"
                    v-if="record.isadd"
                    @click="removeDetailDataList2(index)"
                  >取消</a>

                  <a
                    href="javascript:;"
                    v-if="!record.isadd"
                    style="margin-right: 5px"
                    @click="editDetailDataList(record)"
                  >保存</a>

                  <a-popconfirm
                    v-if="!record.isadd"
                    title="确定删除吗?"
                    ok-text="确定"
                    cancel-text="取消"
                    @confirm="confirmDelete(record.id)"
                  >
                    <a href="javascript:;">删除</a>
                  </a-popconfirm>
                </span>
                <!-- 物料结构 -->
                <span
                  slot="dsBaseDataType"
                  slot-scope="text, record"
                >{{ record.dsBaseDataType == 0 ? "结构料" : "电子料" }}</span>

                <!-- 部件名称 -->
                <span slot="categoryName" slot-scope="text, record">
                  <a-select
                    v-model="record.categoryName"
                    style="width: 120px"
                    show-search
                    :filter-option="filterOption"
                    placeholder="部件名称"
                  >
                    <a-select-option
                      :value="Citem.categoryName"
                      v-for="(Citem, categoryNameindex) in dataSource2"
                      :key="categoryNameindex"
                    >{{ Citem.categoryName }}</a-select-option>
                  </a-select>
                </span>

                <span
                  :slot="tdItem"
                  slot-scope="text, record"
                  v-for="(tdItem, tdIndex) in TdArr"
                  :key="tdIndex"
                >
                  <a-auto-complete
                    v-model="record[tdItem]"
                    :data-source="seachData"
                    style="width: 100px"
                    placeholder="请输入内容查询"
                    @select="onSelect($event, record, [tdItem])"
                    @change="onChange(record, [tdItem])"
                  >
                    <template slot="dataSource">
                      <a-select-option
                        v-for="item in seachData"
                        :key="item.id"
                        :value="item[tdItem]"
                      >{{ item[tdItem] }}</a-select-option>
                    </template>
                  </a-auto-complete>
                </span>

                <!-- 总价 -->
                <span slot="totalPrice" slot-scope="text, record">
                  <a-input v-model="record.totalPrice" style="width: 80px" placeholder="总价" />
                </span>
              </a-table>
            </div>
            <div style="padding-top: 20px">
              <h3>
                结构料
                <a-button type="primary" @click="addDetailDataList1">新增</a-button>
              </h3>
              <a-table
                :rowKey="
            (data, index) => {
              return index;
            }
          "
                :columns="columns"
                :dataSource="detailDataList1"
                :pagination="false"
                bordered
              >
                <span slot="action" slot-scope="text, record, index">
                  <a-popconfirm
                    v-if="record.isadd"
                    title="确定新增该条数据吗?"
                    ok-text="确定"
                    cancel-text="取消"
                    @confirm="confirmAddList(record)"
                  >
                    <a href="javascript:;" style="margin-right: 5px">新增</a>
                  </a-popconfirm>
                  <a
                    href="javascript:;"
                    v-if="record.isadd"
                    @click="removeDetailDataList1(index)"
                  >取消</a>

                  <a
                    href="javascript:;"
                    v-if="!record.isadd"
                    style="margin-right: 5px"
                    @click="editDetailDataList(record)"
                  >保存</a>

                  <a-popconfirm
                    v-if="!record.isadd"
                    title="确定删除吗?"
                    ok-text="确定"
                    cancel-text="取消"
                    @confirm="confirmDelete(record.id)"
                  >
                    <a href="javascript:;">删除</a>
                  </a-popconfirm>
                </span>
                <!-- 物料结构 -->
                <span
                  slot="dsBaseDataType"
                  slot-scope="text, record"
                >{{ record.dsBaseDataType == 0 ? "结构料" : "电子料" }}</span>

                <!-- 部件名称 -->
                <span slot="categoryName" slot-scope="text, record">
                  <a-select
                    v-model="record.categoryName"
                    style="width: 120px"
                    show-search
                    :filter-option="filterOption"
                    placeholder="部件名称"
                  >
                    <a-select-option
                      :value="Citem.categoryName"
                      v-for="(Citem, categoryNameindex) in dataSource1"
                      :key="categoryNameindex"
                    >{{ Citem.categoryName }}</a-select-option>
                  </a-select>
                </span>

                <span
                  :slot="tdItem"
                  slot-scope="text, record"
                  v-for="(tdItem, tdIndex) in TdArr"
                  :key="tdIndex"
                >
                  <a-auto-complete
                    v-model="record[tdItem]"
                    :data-source="seachData"
                    style="width: 100px"
                    placeholder="请输入内容查询"
                    @select="onSelect($event, record, [tdItem])"
                    @change="onChange(record, [tdItem])"
                  >
                    <template slot="dataSource">
                      <a-select-option
                        v-for="item in seachData"
                        :key="item.id"
                        :value="item[tdItem]"
                      >{{ item[tdItem] }}</a-select-option>
                    </template>
                  </a-auto-complete>
                </span>

                <!-- 总价 -->
                <span slot="totalPrice" slot-scope="text, record">
                  <a-input v-model="record.totalPrice" style="width: 80px" placeholder="总价" />
                </span>
              </a-table>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="3" tab="加工费报价" force-render>
          <div style="padding-top: 30px">
            <h3>
              加工费报价
              <!-- <a-button type="primary" @click="addProcess" v-if="data33.length == 0">添加</a-button> -->
            </h3>
            <!-- {{ data33 }} -->
            
            <ProcessHtml :queryFromData="data33"></ProcessHtml>
            <!-- <a-table :columns="columns3" :data-source="data33" :pagination="false">
              <span slot="action" slot-scope="text, record">
                <a
                  href="javascript:;"
                  @click="bomDetail(record, 'detail')"
                  style="margin-right: 5px"
                >详情</a>
              </span>
            </a-table> -->
          </div>
        </a-tab-pane>
        <a-tab-pane key="4" tab="其他项费用报价" force-render>
          <div style="padding-top: 30px">
            <h3>
              其他项费用报价
              <!-- <a-button type="primary" @click="addOtherQuote" v-if="data44.length == 0">添加</a-button> -->
            </h3>
            <OtherHtml :queryFromData="data44"></OtherHtml>

            <!-- <a-table :columns="columns4" :data-source="data44" :pagination="false">
              <span slot="action" slot-scope="text, record">
                <a
                  href="javascript:;"
                  @click="bomDetail(record, 'detail')"
                  style="margin-right: 5px"
                >详情</a>
              </span>
            </a-table> -->
          </div>
        </a-tab-pane>
      </a-tabs>
      <h3>保存审批</h3>
      <div>
        <!-- <a-button type="primary" @click="editRdProjectsDetail()" v-if="queryFrom.status==0"
        >保存草稿</a-button
        >-->
        <a-button
          type="primary"
          @click="setShenpi"
          style="margin-left: 15px"
          v-if="queryFrom.status < 2"
        >提交审核</a-button>
        <span v-if="queryFrom.status == 2" style="font-size: xx-large">审批中</span>
        <span v-if="queryFrom.status == 3" style="font-size: xx-large">审批通过</span>
        <span v-if="queryFrom.status == 10" style="font-size: xx-large">审批不通过</span>
        <a-button
          type="primary"
          @click="setShenpi"
          style="margin-left: 15px"
          v-if="queryFrom.status == 10"
        >提交审核</a-button>
      </div>
    </a-card>

    <OdmRdProjectsModal ref="OdmRdProjectsModalRefs" @ok="getDetail"></OdmRdProjectsModal>
    <BomQuoteModal ref="BomQuoteModalRefs" @ok="getDetail" :dsProductsId="queryFrom.dsProductsId"></BomQuoteModal>

    <!-- <ProcessHtml ref="ProcessHtmlRefs" @ok="getDetail"></ProcessHtml> -->
    <OtherHtml ref="OtherHtmlRefs" @ok="getDetail"></OtherHtml>
    <SetShenPi ref="SetShenPiRef" :auditeType="3" :quoteId="$route.query.id"></SetShenPi>
  </div>
</template>

<script>
import {
  getAllProductList,
  OdmDetailDataList,
  getRdProjectsDetail,
  BomDetailDataList,
  ManuDetailDataList,
  OtherDetailDataList
} from "@/services/businessCode/quotationManagement/odmQuote";
import OdmRdProjectsModal from "./modules/OdmRdProjectsModal.vue";
import BomQuoteModal from "./modules/BomQuoteModal.vue";
import ProcessHtml from "./modules/ProcessHtml.vue";
import OtherHtml from "./modules/OtherHtml.vue";
import SetShenPi from "./modules/SetShenPi";
import {
  getBomQuoteAllSelect,
  getCategoryTypeData,
  deleteBomDetail,
  addBomDetail,
  editBomDetail,
  bomfilterApi
} from "@/services/businessCode/quotationManagement/bomQuote";

import {
  getAlldevelopProjectList,
  getTradesList
} from "@/services/businessCode/quotationManagement/rdProjects";

import cloneDeep from "lodash.clonedeep";

const columns = [
  {
    title: "操作",
    width: "120px",
    dataIndex: "action",
    scopedSlots: {
      customRender: "action"
    }
  },
  {
    title: "物料结构",
    width: "100px",
    dataIndex: "dsBaseDataType",
    scopedSlots: {
      customRender: "dsBaseDataType"
    }
  },
  {
    title: "部件名称",
    dataIndex: "categoryName",
    scopedSlots: {
      customRender: "categoryName"
    }
  },
  {
    title: "9NC",
    dataIndex: "nineNC",
    scopedSlots: {
      customRender: "nineNC"
    }
  },
  {
    title: "物料名称",
    dataIndex: "bomName",
    scopedSlots: {
      customRender: "bomName"
    }
  },
  {
    title: "物料代码",
    dataIndex: "bomCode",
    scopedSlots: {
      customRender: "bomCode"
    }
  },
  {
    title: "型号",
    dataIndex: "bomModel",
    scopedSlots: {
      customRender: "bomModel"
    }
  },
  {
    title: "规格",
    dataIndex: "specification",
    scopedSlots: {
      customRender: "specification"
    }
  },
  {
    title: "总价",
    dataIndex: "totalPrice",
    scopedSlots: {
      customRender: "totalPrice"
    }
  }
];
const columns1 = [
  {
    width: 100,
    title: "操作",
    scopedSlots: {
      customRender: "action"
    }
  },
  {
    title: "项目名",
    dataIndex: "projectName",
    key: "projectName"
  },
  {
    title: "发起人",
    dataIndex: "createUserName",
    key: "createUserName"
  }
];
const columns2 = [
  {
    width: 100,
    title: "操作",
    scopedSlots: {
      customRender: "action"
    }
  },
  {
    dataIndex: "bomQuoteNo",
    title: "报价单名称"
  },
  {
    title: "产品",
    dataIndex: "productNo",
    key: "productNo"
  },
  {
    title: "备注",
    dataIndex: "remarks",
    key: "remarks"
  }
];
const columns3 = [
  { dataIndex: "bomSpecies", title: "物料种类" },
  { dataIndex: "dipPointNum", title: "插件点数" },
  { dataIndex: "manualWeldingPointNum", title: "手焊点数" },
  { dataIndex: "patchPointNum", title: "贴片点数" },
  { dataIndex: "smtPrice", title: "SMT价格" },
  { dataIndex: "dipPrice", title: "插件价格" },
  { dataIndex: "manualWeldingPrice", title: "手焊价格" },
  { dataIndex: "pcbaTestPrice", title: "PCBA测试价格" },
  { dataIndex: "pcbaAssemblyPrice", title: "PCBA组装价格" },
  { dataIndex: "finishedProductTestPrice", title: "成品测试价格" },
  { dataIndex: "finishedProductAssemblyPrice", title: "成品组装价格" },
  { dataIndex: "pcbaTotalPrice", title: "PCBA价格" },
  { dataIndex: "assemblyTotalPrice", title: "组装价格" },
  { dataIndex: "productTotalPrice", title: "加工费总价" },
  { dataIndex: "remarks", title: "备注" }
];

const columns4 = [
  {
    dataIndex: "materialConsumptionRate",
    title: "物耗费用系数"
  },
  {
    dataIndex: "materialConsumptionPrice",
    title: "物耗费用",
    help: "BOM报价单价格*比例"
  },
  { dataIndex: "materialConsumptionDescription", title: "物耗费用比例描述" },
  { dataIndex: "managementRate", title: "管理费用系数", help: "默认10%" },
  {
    dataIndex: "managementPrice",
    title: "物耗费用",
    help: "BOM报价单价格*比例"
  },
  { dataIndex: "managementDescription", title: "物耗费用比例描述" },
  { dataIndex: "transportRate", title: "运输费用系数", help: "默认10%" },
  { dataIndex: "transportPrice", title: "运输费用", help: "计算方式待确认" },
  { dataIndex: "transportDescription", title: "物耗费用比例描述" },
  { dataIndex: "smallOrderPrice", title: "小单费", help: "计算方式待确认" },
  { dataIndex: "profitMoney", title: "利润", help: "计算方式待确认" },
  { dataIndex: "otherFeeTotalPrice", title: "总价" },
  { dataIndex: "remarks", title: "备注" }
];
const devprojectColumns = [
  {
    title: "大类",
    dataIndex: "title",
    scopedSlots: {
      customRender: "title"
    },
    customRender: (title, record) => ({
      children: title,
      attrs: { rowSpan: record.rowSpan } // 通过设置colSpan为0来合并列
    })
  },
  {
    title: "子类",
    dataIndex: "subclasses",
    scopedSlots: {
      customRender: "subclasses"
    }
  },
  {
    title: "费用说明",
    dataIndex: "feeDescription",
    scopedSlots: {
      customRender: "feeDescription"
    }
  },
  {
    title: "工种",
    dataIndex: "trades",
    scopedSlots: {
      customRender: "trades"
    }
  },
  {
    title: "费用类型",
    dataIndex: "detailFeeType",
    scopedSlots: {
      customRender: "detailFeeType"
    }
  },
  {
    title: "工程师级别",
    dataIndex: "engineerLevel",
    scopedSlots: {
      customRender: "engineerLevel"
    }
  },
  {
    title: "折扣率",
    dataIndex: "discountedRate",
    scopedSlots: {
      customRender: "discountedRate"
    }
  },
  {
    title: "总价",
    dataIndex: "totalPrice",
    scopedSlots: {
      customRender: "totalPrice"
    }
  },
  {
    title: "数量",
    dataIndex: "quantityNum",
    scopedSlots: {
      customRender: "quantityNum"
    }
  },
  {
    title: "参考值",
    dataIndex: "referenceValue",
    scopedSlots: {
      customRender: "referenceValue"
    }
  },
  {
    title: "单价",
    dataIndex: "unitPrice",
    scopedSlots: {
      customRender: "unitPrice"
    }
  },
  {
    title: "备注",
    dataIndex: "remarks",
    scopedSlots: {
      customRender: "remarks"
    }
  }
];

export default {
  name: "customerModal",
  components: {
    OdmRdProjectsModal,
    BomQuoteModal,
    ProcessHtml,
    OtherHtml,
    SetShenPi
  },
  props: {},
  data() {
    return {
      DevelopProjectList: [],
      BomQuoteList: [],
      // 所有子项
      AlldetailListChildren: [
        {
          key: "definitionDetails",
          hasKey: "haveProductDefinitions",
          moneyHasKey: "productDefinitionsMoney",
          detailType: 0,
          title: " 产品定义"
        },
        {
          key: "hardwareDetails",
          hasKey: "haveHardware",
          moneyHasKey: "hardwareMoney",
          detailType: 1,
          title: " 硬件开发"
        },
        {
          key: "softwareDetails",
          hasKey: "haveSoftware",
          moneyHasKey: "softwareMoney",
          detailType: 2,
          title: " 软件开发"
        },
        {
          key: "structuralDetails",
          hasKey: "haveStructural",
          moneyHasKey: "structuralMoney",
          detailType: 3,
          title: " 结构开发"
        },
        {
          key: "productTestDetails",
          hasKey: "haveProductTest",
          moneyHasKey: "productTestMoney",
          detailType: 4,
          title: " 产品测试类"
        },
        {
          key: "moldsAndToolingDetails",
          hasKey: "haveMoldsAndTooling",
          moneyHasKey: "moldsAndToolingMoney",
          detailType: 5,
          title: " 模具及工装"
        },
        {
          key: "authenticationDetails",
          hasKey: "haveAuthentication",
          moneyHasKey: "authenticationMoney",
          detailType: 6,
          title: " 常规认证(CE,FCC,ROHS)"
        },
        {
          key: "otherFeeDetails",
          hasKey: "haveOtherFee",
          moneyHasKey: "otherFeeMoney",
          detailType: 7,
          title: " 其他研发相关费用"
        },
        {
          key: "spicalAuthenticationDetails",
          hasKey: "haveSpicalAuthentications",
          moneyHasKey: "spicalAuthenticationMoney",
          detailType: 8,
          title: " 特种认证费用"
        }
      ],
      devprojectColumns: devprojectColumns,
      finalScore: 0,
      allDevprojectTableData: [],
      title: "标题",
      queryFrom: {},
      ProductList: [],
      confirmLoading: false,
      queryFromDataList: [
        {
          label: "ODM编号",
          key: "odmQuoteNo",
          type: "string"
        },
        {
          label: "ODM名称",
          key: "odmQuoteName",
          type: "string"
        },
        {
          label: "客户名称",
          key: "customerName",
          type: "string"
        },
        {
          label: "研发类型",
          key: "developmentType",
          type: "string"
        },
        {
          label: "产品类型",
          key: "productType",
          type: "string"
        },
        {
          label: "产品名称",
          key: "productName",
          type: "select"
        },
        {
          label: "备注",
          key: "remarks",
          type: "string"
        }
        // {
        //   label: "软件开发",
        //   key: "haveSoftware",
        //   type: "boolean"
        // }
      ],
      rules: {
        categoryName: [
          { required: true, message: "请输入类别名称", trigger: "change" }
        ]
      },
      columns,
      columns1,
      columns2,
      columns3,
      columns4,
      data11: [],
      data22: [],
      data33: {},
      data44: [],
      TdArr: ["nineNC", "bomName", "bomModel", "bomCode", "specification"],
      seachData: [], //查询数据
      dataSource1: [], //结构部件名称
      dataSource2: [], //电子部件名称
      developProjectId: "",
      bomQuoteId: "",
      manufactureFeeQuoteId: "",
      otherFeeQuoteId: "",
      TradesList: [], //工种列表
      detailDataList1: [],
      detailDataList2: []
    };
  },
  created() {
    getTradesList({
      CategoryType: 0
    }).then(res => {
      this.TradesList = res.data;
    });

    //获取基础数据 并赋值默认数据
    getCategoryTypeData().then(res => {
      console.log(res.data);
      res.data.map(item => {
        if (item.dsBaseDataType == 0) {
          this.dataSource1.push({
            categoryName: item.categoryName,
            id: item.id
          });
        } else {
          this.dataSource2.push({
            categoryName: item.categoryName,
            id: item.id
          });
        }
      });
    });

    this.getDetail();
    //获取研发报价列表
    getAlldevelopProjectList().then(res => {
      this.DevelopProjectList = res.data;
      //有研发报价单复默认值
      if (this.developProjectId) {
        this.queryFrom.developProjectId = this.developProjectId;
      }
    });
    //获取研发报价列表
    getBomQuoteAllSelect().then(res => {
      this.BomQuoteList = res.data;
      //有研发报价单复默认值
      if (this.bomQuoteId) {
        this.queryFrom.bomQuoteId = this.bomQuoteId;
      }
    });
  },
  methods: {
    setShenpi() {
      this.$refs.SetShenPiRef.openModules();
    },
    getDetail() {
      //先重置数据
      this.queryFrom = {
        haveProductDefinitions: true
      };
      OdmDetailDataList(this.$route.query.id).then(res => {
        console.log("详情");
        this.queryFrom = res.data;
        console.log(res.data);
        this.developProjectId = res.data.developProjectId;
        this.bomQuoteId = res.data.bomQuoteId;
        this.manufactureFeeQuoteId = res.data.manufactureFeeQuoteId;
        this.otherFeeQuoteId = res.data.otherFeeQuoteId;
        if (res.data.developProjectId) {
          // console.log("项目详情");
          getRdProjectsDetail(res.data.developProjectId).then(resDev => {
            if (resDev.data) {
              this.data11 = [resDev.data];
              this.allDevprojectTableData = resDev.data;
              var allTableData = [];
              this.AlldetailListChildren.map(item => {
                if (resDev.data[item.key][0]) {
                  resDev.data[item.key].map(
                    (childrenItem, childrenItemIndex) => {
                      childrenItem["title"] = item.title;
                      if (childrenItemIndex == 0) {
                        childrenItem["rowSpan"] = resDev.data[item.key].length;
                      } else {
                        childrenItem["rowSpan"] = 0;
                      }
                    }
                  );
                }
                allTableData.push(...resDev.data[item.key]);
              });

              this.allDevprojectTableData = allTableData;
              console.log("123", this.allDevprojectTableData);
              this.finalScore = resDev.data.finalScore;
            }
          });
        }
        if (this.bomQuoteId) {
          // console.log("BOM详情");
          BomDetailDataList(this.bomQuoteId).then(resBom => {
            console.log(resBom.data);
            if (resBom.data) {
              this.data22 = [resBom.data];
              const arr1 = []; //结构料 0
              const arr2 = []; //电子料 1
              resBom.data.bomQuoteRelations.map(item => {
                if (item.dsBaseDataType == 0) {
                  arr1.push(item);
                } else {
                  arr2.push(item);
                }
                this.detailDataList1 = arr1;
                this.detailDataList2 = arr2;
                // if (arr1.length == 0) {
                //   this.detailDataList1 = [{ dsBaseDataType: 0 }];
                // }
                // if (arr2.length == 0) {
                //   this.detailDataList2 = [{ dsBaseDataType: 1 }];
                // }
              });
            }
          });
        }
        // console.log("加工费");
        if (this.manufactureFeeQuoteId) {
          ManuDetailDataList(this.manufactureFeeQuoteId).then(res => {
            console.log("加工费");
            console.log(res);
            if (res.data) {
              this.data33 = res.data;
            }
          });
        }
        if (this.otherFeeQuoteId) {
          // console.log("其他项费用");
          if (this.otherFeeQuoteId) {
            OtherDetailDataList(this.otherFeeQuoteId).then(res => {
              console.log("其他项费用");
              console.log(res);
              if (res.data) {
                this.data44 = [res.data];
              }
            });
          }
        }
      });

      //获取产品列表
      getAllProductList().then(res => {
        this.ProductList = res.data;
      });
    },
    addOdmRdProjects() {
      this.$refs.OdmRdProjectsModalRefs.openModules(
        "add",
        this.developProjectId
      );
    },
    addBomQuote() {
      this.$refs.BomQuoteModalRefs.openModules("add");
    },
    //加工费报价
    addProcess() {
      this.$refs.ProcessHtmlRefs.openModules("add");
    },
    //加工费报价
    addOtherQuote() {
      this.$refs.OtherHtmlRefs.openModules("add");
    },
    //新增
    confirmAddList(record) {
      const params = {
        bomQuoteId: this.bomQuoteId,
        bomQuoteRelations: [record]
      };
      params.bomQuoteRelations[0].id = "";
      params.bomQuoteRelations.map(item => {
        item.bomQuoteId = this.bomQuoteId;
      });
      addBomDetail(params).then(res => {
        if (res.code == 1) {
          this.$message.success("添加成功");
          this.getDetail();
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    onSelect(value, record, type) {
      console.log("onSelect", value);
      console.log(record);
      console.log(this.seachData);
      let checkObj = {};
      this.seachData.map(Sitem => {
        if (Sitem[type] == value) {
          checkObj = Sitem;
        }
      });
      console.log(checkObj);
      this.TdArr.map(item => {
        if (checkObj[item]) {
          record[item] = checkObj[item];
        } else {
          record[item] = "";
        }
      });
      this.$forceUpdate();
    },
    onChange(record, type) {
      if (record[type] == "") {
        return false;
      }
      bomfilterApi({ [type]: record[type] }).then(res => {
        console.log(res);
        this.seachData = res.data;
        // var newArr = [];
        // res.data.map(x => newArr.push(x[type]));
        // this.seachData = Array.from(new Set(newArr));
      });
    }, //新增基础数据
    addDetailDataList1() {
      let hasadd = false;
      this.detailDataList1.map(item => {
        item.isadd == true ? (hasadd = true) : "";
      });
      if (hasadd) {
        this.$message.error("请先保存新增数据");
        return false;
      }
      this.detailDataList1.unshift({ isadd: true, dsBaseDataType: 0 });
    }, //新增基础数据
    addDetailDataList2() {
      let hasadd = false;
      this.detailDataList2.map(item => {
        item.isadd == true ? (hasadd = true) : "";
      });
      if (hasadd) {
        this.$message.error("请先保存新增数据");
        return false;
      }
      this.detailDataList2.unshift({ isadd: true, dsBaseDataType: 1 });
    },
    //删除
    confirmDelete(id) {
      deleteBomDetail(id).then(() => {
        this.$message.success("删除成功");
        this.getDetail();
      });
    },
    //编辑
    editDetailDataList(record) {
      editBomDetail(record).then(() => {
        this.$message.success("编辑成功");
        // this.getDetail();
      });
    },
    //项目详情
    RdProjectsDetail(record) {
      this.$router.push({
        path: "rdProjectsDetail",
        query: {
          id: record.id
        }
      });
    },
    //详情页
    bomDetail(record) {
      this.$router.push({
        path: "bomQuoteDetail",
        query: {
          id: record.id
        }
      });
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    }
  }
};
</script>

<style lang="less" scoped></style>
