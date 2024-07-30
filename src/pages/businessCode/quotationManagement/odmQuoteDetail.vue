<template>
  <div>
    <a-card>
      <a-form-model
        :model="queryFrom"
        layout="inline"
        :label-col="{ span: 8 }"
        :rules="rules"
        ref="userRefs"
      >
        <a-form-model-item
          style="width: 31%"
          v-for="(item, index) in queryFromDataList"
          :key="index"
          :label="item.label"
        >
          <!-- 布尔 -->
          <a-switch v-model="queryFrom[item.key]" v-if="item.type == 'boolean'" />
          <!-- 输入框 -->
          <a-input
            v-else-if="item.type == 'string'"
            v-model="queryFrom[item.key]"
            style="width: 250px"
            :placeholder="item.label"
            disabled
          ></a-input>
          <!-- 产品下拉 -->
          <a-select
            v-else-if="item.label == '产品'"
            v-model="queryFrom[item.key]"
            style="width: 250px"
            :placeholder="item.label"
            disabled
            allowClear
          >
            <a-select-option
              :value="item.id"
              v-for="(item,index) in ProductList"
              :key="index"
            >{{item.productNo}}</a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>

      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="研发项目">
          <div style="padding-top: 30px;">
            <h3>
              研发项目
              <a-button type="primary" @click="addOdmRdProjects" v-if="data11.length==0">添加</a-button>
            </h3>
            <a-table :columns="columns1" :data-source="data11" :pagination="false">
              <span slot="action" slot-scope="text, record">
                <a
                  href="javascript:;"
                  @click="RdProjectsDetail(record, 'detail')"
                  style="margin-right: 5px;"
                >详情</a>
              </span>
            </a-table>
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="BOM报价" force-render>
          <div style="padding-top: 30px;">
            <h3>
              BOM报价
              <a-button type="primary" @click="addBomQuote" v-if="data22.length==0">添加</a-button>
            </h3>
            <a-table :columns="columns2" :data-source="data22" :pagination="false">
              <span slot="action" slot-scope="text, record">
                <a
                  href="javascript:;"
                  @click="bomDetail(record, 'detail')"
                  style="margin-right: 5px;"
                >详情</a>
              </span>
            </a-table>
          </div>
        </a-tab-pane>
        <a-tab-pane key="3" tab="加工费报价" force-render>
          <div style="padding-top: 30px;">
            <h3>
              加工费报价
              <a-button type="primary" @click="addProcess" v-if="data33.length==0">添加</a-button>
            </h3>
            <a-table :columns="columns3" :data-source="data33" :pagination="false">
              <span slot="action" slot-scope="text, record">
                <a
                  href="javascript:;"
                  @click="bomDetail(record, 'detail')"
                  style="margin-right: 5px;"
                >详情</a>
              </span>
            </a-table>
          </div>
        </a-tab-pane>
        <a-tab-pane key="4" tab="其他项费用报价" force-render>
          <div style="padding-top: 30px;">
            <h3>
              其他项费用报价
              <a-button type="primary" @click="addOtherQuote" v-if="data44.length==0">添加</a-button>
            </h3>
            <a-table :columns="columns4" :data-source="data44" :pagination="false">
              <span slot="action" slot-scope="text, record">
                <a
                  href="javascript:;"
                  @click="bomDetail(record, 'detail')"
                  style="margin-right: 5px;"
                >详情</a>
              </span>
            </a-table>
          </div>
        </a-tab-pane>
      </a-tabs>
    </a-card>

    <OdmRdProjectsModal ref="OdmRdProjectsModalRefs" @ok="getDetail"></OdmRdProjectsModal>
    <BomQuoteModal ref="BomQuoteModalRefs" @ok="getDetail" :dsProductsId="queryFrom.dsProductsId"></BomQuoteModal>

    <ProcessModal ref="ProcessModalRefs" @ok="getDetail"></ProcessModal>
    <OtherModal ref="OtherModalRefs" @ok="getDetail"></OtherModal>
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
import ProcessModal from "./modules/ProcessModal.vue";
import OtherModal from "./modules/OtherModal.vue";

import cloneDeep from "lodash.clonedeep";

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

export default {
  name: "customerModal",
  components: { OdmRdProjectsModal, BomQuoteModal, ProcessModal, OtherModal },
  props: {},
  data() {
    return {
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
          label: "产品",
          key: "dsProductsId",
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
      columns1,
      columns2,
      columns3,
      columns4,
      data11: [],
      data22: [],
      data33: [],
      data44: [],
      developProjectId: "",
      bomQuoteId: "",
      manufactureFeeQuoteId: "",
      otherFeeQuoteId: ""
    };
  },
  created() {
    this.getDetail();
  },
  methods: {
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
        // console.log("项目详情");
        getRdProjectsDetail(res.data.developProjectId).then(resDev => {
          console.log(resDev.data);
          if (resDev.data) {
            this.data11 = [resDev.data];
          }
        });
        // console.log("BOM详情");
        BomDetailDataList(res.data.bomQuoteId).then(resBom => {
          console.log(resBom.data);
          if (resBom.data) {
            this.data22 = [resBom.data];
          }
        });
        // console.log("加工费");
        if (this.manufactureFeeQuoteId) {
          ManuDetailDataList(this.manufactureFeeQuoteId).then(res => {
            console.log("加工费");
            console.log(res);
            if (res.data) {
              this.data33 = [res.data];
            }
          });
        }
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
      this.$refs.ProcessModalRefs.openModules("add");
    },
    //加工费报价
    addOtherQuote() {
      this.$refs.OtherModalRefs.openModules("add");
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
