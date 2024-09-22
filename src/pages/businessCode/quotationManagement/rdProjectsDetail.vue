<template>
  <a-card>
    <div class="queryFromBox">
      <a-descriptions title="基础信息" bordered>
        <a-descriptions-item
          :label="item.label"
          bordered
          v-for="(item, index) in queryFromDataList"
          :key="index"
        >
          <span>{{ detailData[item.key] }}</span>
        </a-descriptions-item>
      </a-descriptions>
    </div>

    <!-- <a-button type="primary" @click="addChildren" style="margin-bottom: 15px">新增</a-button> -->
    <a-table
      rowKey="id"
      :columns="columns"
      :dataSource="allTableData"
      :pagination="false"
      bordered
    >
      <!-- 子类 -->
      <span slot="subclasses" slot-scope="text, record">
        <a-textarea
          v-model="record.subclasses"
          style="width: 150px"
        ></a-textarea>
      </span>
      <!-- 费用说明 -->
      <span slot="feeDescription" slot-scope="text, record">
        <a-textarea
          v-model="record.feeDescription"
          style="width: 150px"
        ></a-textarea>
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
            >{{ item.categoryName }}</a-select-option
          >
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
        <a-select
          disabled
          v-model="record.engineerLevel"
          style="width: 80px"
          placeholder="等级"
        >
          <a-select-option :value="0">初级</a-select-option>
          <a-select-option :value="1">中级</a-select-option>
          <a-select-option :value="2">高级</a-select-option>
          <a-select-option :value="3">资深</a-select-option>
        </a-select>
      </span>

      <!-- 折扣率 -->
      <span slot="discountedRate" slot-scope="text, record">
        <a-input
          :disabled="record.detailFeeType == 0"
          v-model="record.discountedRate"
          style="width: 50px"
        ></a-input>
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
        <a-input
          v-model="record.unitPrice"
          style="width: 80px"
          @change="changeNum(record)"
        ></a-input>
      </span>
      <!-- 参考值 -->
      <span slot="referenceValue" slot-scope="text, record">
        <a-textarea
          v-model="record.referenceValue"
          style="width: 150px"
        ></a-textarea>
      </span>
      <!-- 备注 -->
      <span slot="remarks" slot-scope="text, record">
        <a-textarea v-model="record.remarks" style="width: 150px"></a-textarea>
      </span>
    </a-table>
    <h3 >项目得分</h3>
    <a-button
      type="primary"
      @click="calculateProjects()"
      v-if="finalScore == '0'"
      >评分</a-button
    >
    <a :disabled="developStatus>1"
       v-if="finalScore != '0'"
      @click="getcalculateProjects()"
      style="margin-right: 15px; text-decoration: underline"
      ><span style="font-size: 50px;">{{ finalScore }}</span>
      </a
    >
    <h3>保存审批</h3>
    <div>
      <a-button type="primary" @click="editRdProjectsDetail()" v-if="developStatus==0"
        >保存草稿</a-button
      >
      <a-button
        type="primary"
        @click="setAudite"
        style="margin-left: 15px"
         v-if="developStatus < 2"
        >提交审核</a-button
      >
      <span v-if="developStatus == 2" style="font-size: xx-large;">审批中</span>
        <span v-if="developStatus == 3" style="font-size: xx-large;"
          >审批通过</span
        >
        <span v-if="developStatus == 10" style="font-size: xx-large;"
          >审批不通过</span
        >
        <a-button
        type="primary"
        @click="setAudite"
        style="margin-left: 15px"
         v-if="developStatus == 10"
        >提交审核</a-button
      >
    </div>
    <RdProjectsDetailModal
      ref="RdProjectsDetailModalRefs"
      @ok="getRdProjectsDetail"
    ></RdProjectsDetailModal>

    <!-- 计算得分 -->
    <CalculateProjectsModal
      ref="CalculateProjectsModalRefs"
      @ok="getRdProjectsDetail"
    ></CalculateProjectsModal>

    <a-modal
      title="创建审批"
      :visible="visibleAudite"
      @ok="handleOkAudite"
      @cancel="visibleAudite = false"
    >
      备注：
      <a-input v-model="remarksAudite"></a-input>
    </a-modal>
    <SetShenPi
      ref="SetShenPiRef"
      :auditeType="2"
      :quoteId="$route.query.id"
      :finalScore="finalScore"
    ></SetShenPi>
  </a-card>
</template>

<script>
import {
  getRdProjectsDetail,
  deleteRdProjectsDetailList,
  setAudite,
  getProjectScore,
  getTradesList,
  editRdProjectsDetailList
} from "@/services/businessCode/quotationManagement/rdProjects";
import { checkPermission } from "@/utils/abp";
import { mapGetters } from "vuex";
import RdProjectsDetailModal from "./modules/RdProjectsDetailModal.vue";
import CalculateProjectsModal from "./modules/CalculateProjectsModal.vue";
import SetShenPi from "./modules/SetShenPi";

const columns = [
  {
    title: "大类",
    dataIndex: "title",
    scopedSlots: {
      customRender: "title",
    },
    customRender: (title, record) => ({
      children: title,
      attrs: { rowSpan: record.rowSpan }, // 通过设置colSpan为0来合并列
    }),
  },
  {
    title: "子类",
    dataIndex: "subclasses",
    scopedSlots: {
      customRender: "subclasses",
    },
  },
  {
    title: "费用说明",
    dataIndex: "feeDescription",
    scopedSlots: {
      customRender: "feeDescription",
    },
  },
  {
    title: "工种",
    dataIndex: "trades",
    scopedSlots: {
      customRender: "trades",
    },
  },
  {
    title: "费用类型",
    dataIndex: "detailFeeType",
    scopedSlots: {
      customRender: "detailFeeType",
    },
  },
  {
    title: "工程师级别",
    dataIndex: "engineerLevel",
    scopedSlots: {
      customRender: "engineerLevel",
    },
  },
  {
    title: "折扣率",
    dataIndex: "discountedRate",
    scopedSlots: {
      customRender: "discountedRate",
    },
  },
  {
    title: "总价",
    dataIndex: "totalPrice",
    scopedSlots: {
      customRender: "totalPrice",
    },
  },
  {
    title: "数量",
    dataIndex: "quantityNum",
    scopedSlots: {
      customRender: "quantityNum",
    },
  },
  {
    title: "参考值",
    dataIndex: "referenceValue",
    scopedSlots: {
      customRender: "referenceValue",
    },
  },
  {
    title: "单价",
    dataIndex: "unitPrice",
    scopedSlots: {
      customRender: "unitPrice",
    },
  },
  {
    title: "备注",
    dataIndex: "remarks",
    scopedSlots: {
      customRender: "remarks",
    },
  },
];
export default {
  components: { RdProjectsDetailModal, CalculateProjectsModal, SetShenPi },
  data() {
    return {
      developStatus:0,
      selectedRowKeys: [],
      queryFrom: {
        processStepName: "",
      },
      finalScore: 0,
      loading: true,
      dataSource: [],
      selectedRows: [],
      columns: columns,
      pagination: {
        pageSize: 10,
        current: 1,
        showTotal: (total) => `总计 ${total} 条`,
      },
      //新增的数据
      detailData: {},
      queryFromDataList: [
        {
          label: "项目名称",
          key: "projectName",
          type: "string",
        },
        {
          label: "客户名称",
          key: "customerName",
          type: "string",
        },
        {
          label: "项目发起人",
          key: "createUserName",
          type: "string",
        },
        {
          label: "研发类型",
          key: "developmentType",
          type: "string",
        },
        {
          label: "产品类型",
          key: "productType",
          type: "string",
        },
        {
          label: "项目总费用",
          key: "totalFee",
          type: "string",
        },
        {
          label: "总人工费",
          key: "laborCost",
          type: "string",
        },
        {
          label: "其他费用",
          key: "otherFee",
          type: "string",
        },
        // {
        //   label: "产品定义费",
        //   key: "productDefinitionsMoney",
        //   type: "string"
        // },
        // {
        //   label: "硬件开发费",
        //   key: "hardwareMoney",
        //   type: "string"
        // },
        // {
        //   label: "软件开发费",
        //   key: "softwareMoney",
        //   type: "string"
        // },
        // {
        //   label: "结构开发费",
        //   key: "structuralMoney",
        //   type: "string"
        // },
        // {
        //   label: "产品测试费",
        //   key: "productTestMoney",
        //   type: "string"
        // },
        // {
        //   label: "模具及工装费",
        //   key: "moldsAndToolingMoney",
        //   type: "string"
        // },
        // {
        //   label: "常规认证费",
        //   key: "authenticationMoney",
        //   type: "string"
        // },
        // {
        //   label: "特种认证费",
        //   key: "spicalAuthenticationMoney",
        //   type: "string"
        // },
        // {
        //   label: "其他研发相关费用",
        //   key: "otherFeeMoney",
        //   type: "string"
        // },
        // {
        //   label: "项目得分",
        //   key: "projectNumber",
        //   type: "string"
        // }
      ],
      // 所有子项
      AlldetailListChildren: [
        {
          key: "definitionDetails",
          hasKey: "haveProductDefinitions",
          moneyHasKey: "productDefinitionsMoney",
          detailType: 0,
          title: " 产品定义",
        },
        {
          key: "hardwareDetails",
          hasKey: "haveHardware",
          moneyHasKey: "hardwareMoney",
          detailType: 1,
          title: " 硬件开发",
        },
        {
          key: "softwareDetails",
          hasKey: "haveSoftware",
          moneyHasKey: "softwareMoney",
          detailType: 2,
          title: " 软件开发",
        },
        {
          key: "structuralDetails",
          hasKey: "haveStructural",
          moneyHasKey: "structuralMoney",
          detailType: 3,
          title: " 结构开发",
        },
        {
          key: "productTestDetails",
          hasKey: "haveProductTest",
          moneyHasKey: "productTestMoney",
          detailType: 4,
          title: " 产品测试类",
        },
        {
          key: "moldsAndToolingDetails",
          hasKey: "haveMoldsAndTooling",
          moneyHasKey: "moldsAndToolingMoney",
          detailType: 5,
          title: " 模具及工装",
        },
        {
          key: "authenticationDetails",
          hasKey: "haveAuthentication",
          moneyHasKey: "authenticationMoney",
          detailType: 6,
          title: " 常规认证(CE,FCC,ROHS)",
        },
        {
          key: "otherFeeDetails",
          hasKey: "haveOtherFee",
          moneyHasKey: "otherFeeMoney",
          detailType: 7,
          title: " 其他研发相关费用",
        },
        {
          key: "spicalAuthenticationDetails",
          hasKey: "haveSpicalAuthentications",
          moneyHasKey: "spicalAuthenticationMoney",
          detailType: 8,
          title: " 特种认证费用",
        },
      ],
      allTableData: [],
      projectScoreId: "",
      visibleAudite: false,
      remarksAudite: "",
    };
  },
  mounted() {},
  created() {
    this.getRdProjectsDetail();
    let params = {
      CategoryType: 0,
    };
    getTradesList(params).then((res) => {
      this.TradesList = res.data;
    });
  },
  computed: {
    ...mapGetters("account", ["organizationId"]),
  },
  methods: {
        //编辑基础数据
        editRdProjectsDetail() {
      let params = this.allTableData;
      editRdProjectsDetailList(params)
        .then(res => {
          if (res.code == 1) {
            this.$message.success(res.msg);
            this.$emit("ok");
            this.uservisible = false;
          } else {
            this.$message.error(res.msg);
          }
          this.confirmLoading = false;
        })
        .catch(err => {
          this.loading = false;
          this.confirmLoading = false;
        });
    },
    //更新数据
    changeFeeType(record) {
      record.discountedRate = 100;
      this.$forceUpdate();
    },
    //编辑数量单价
    changeNum(record) {
      record.totalPrice = record.unitPrice * record.quantityNum;
      this.$forceUpdate();
    },
    //编辑工种
    changeTrades(record) {
      this.TradesList.map((item) => {
        if (item.id == record.trades) {
          record.trades = item.categoryName; //工程师级别
          record.engineerLevel = item.categoryLevel; //工程师级别
          record.unitPrice = item.unitPrice; //单价
        }
      });
      this.$forceUpdate();
    },
    checkPermission,
    //评分
    calculateProjects(record) {
      this.$refs.CalculateProjectsModalRefs.openModules(
        { id: this.$route.query.id },
        "add"
      );
    },
    getcalculateProjects(record) {
      this.$refs.CalculateProjectsModalRefs.openModules(
        { id: this.projectScoreId },
        "detail"
      );
    },
    //新增
    addChildren(title, detailType) {
      this.$refs.RdProjectsDetailModalRefs.openModules(
        title,
        detailType,
        "add"
      );
    },
    //编辑
    editChildren(title, detailType, record) {
      this.$refs.RdProjectsDetailModalRefs.openModules(
        title,
        detailType,
        "edit",
        record
      );
    },
    //删除
    deleteChildren(id) {
      deleteRdProjectsDetailList(id)
        .then((res) => {
          if (res.code == 1) {
            this.$message.success(res.msg);
            this.getRdProjectsDetail();
          } else {
            this.$message.error(res.message);
          }
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        });
    },
    setAudite() {
      // this.visibleAudite = true;
      this.$refs.SetShenPiRef.openModules();
    },
    handleOkAudite() {
      let params = {
        developProjectId: this.$route.query.id,
        finalScore: this.finalScore,
        projectScoreId: this.projectScoreId,
        remarks: this.remarksAudite,
      };
      setAudite(params).then((res) => {
        if (res.code == 1) {
          this.$message.success(res.msg);
          this.visibleAudite = false;
          this.getRdProjectsDetail();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //获取列表数据
    getRdProjectsDetail() {
      const params = this.$route.query.id;
      getRdProjectsDetail(params)
        .then((res) => {
          if (res.code == 1) {
            this.detailData = res.data;
            this.developStatus=res.data.status;
            this.finalScore = res.data.finalScore;
            this.projectScoreId = res.data.projectScoreId;

            var allTableData = [];
            this.AlldetailListChildren.map((item) => {
      
              if (res.data[item.key][0]) {
                res.data[item.key].map((childrenItem, childrenItemIndex) => {
                  childrenItem["title"] = item.title;
                  if (childrenItemIndex == 0) {
                    childrenItem["rowSpan"] = res.data[item.key].length;
                  } else {
                    childrenItem["rowSpan"] = 0;
                  }
                });
              }
              allTableData.push(...res.data[item.key]);
            });

            this.allTableData = allTableData;

          } else {
            this.loading = false;
            this.$message.error(res.message);
          }
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        });
    },
    //下拉筛选
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
  },
};
</script>

<style lang="less" scoped>
.queryFromBox {
  margin-bottom: 5px;
  .btnListBox {
    margin-bottom: 5px;
    button {
      margin-right: 10px;
    }
  }
}
</style>
