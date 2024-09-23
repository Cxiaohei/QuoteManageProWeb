<template>
  <div>
    <a-modal
      :width="1100"
      :title="title"
      :visible="uservisible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <!-- {{queryFrom}} -->
      <a-form-model
        :model="queryFrom"
        layout="inline"
        :rules="rules"
        ref="userRefs"
      >
        <a-form-model-item
        style="width: 40%;margin-left: 50px;"
          :label="item.title"
          v-for="(item, index) in processRoteList"
          :key="index"
        >
          <a-input
            v-model="queryFrom[item.key]"
            :placeholder="item.title"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item label="研发状态" style="width: 40%;margin-left: 50px;">
          <a-select
            v-model="queryFrom.developStatus"
            style="width: 150px;"
          >
            <a-select-option value="方案确定">方案确定</a-select-option>
            <a-select-option value="样品确认">样品确认</a-select-option>
            <a-select-option value="试产">试产</a-select-option>
            <a-select-option value="量产">量产</a-select-option>
            <a-select-option value="暂停">暂停</a-select-option>
            <a-select-option value="终止">终止</a-select-option>
            <a-select-option value="结案">结案</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="订单状态" style="width: 40%;margin-left: 50px;">
          <a-select
            v-model="queryFrom.orderStatus"
            style="width: 150px;"
          >
            <a-select-option value="待定">待定</a-select-option>
            <a-select-option value="进行中">进行中</a-select-option>
            <a-select-option value="已结案">已结案</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="未完成原因" style="width: 40%;margin-left: 50px;">
          <a-textarea
            v-model="queryFrom.unfinishedCause"
            placeholder="未完成原因"
          ></a-textarea>
        </a-form-model-item>
        <a-form-model-item label="项目风险" style="width: 40%;margin-left: 50px;">
          <a-textarea
            v-model="queryFrom.projectRisk"
            placeholder="项目风险"
          ></a-textarea>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import {
  setManufactureFee,
  editManufactureFee,
  getPriceList,
  FilterPrice,
  FilterPriceStrategyId,
  QuoteCalculate,
} from "@/services/businessCode/quotationManagement/ProjectIncomeMonitoring";
import cloneDeep from "lodash.clonedeep";

export default {
  name: "customerModal",
  props: {},
  data() {
    return {
      title: "标题",
      uservisible: false,
      queryFrom: {},
      confirmLoading: false,
      PriceList: [],
      seachData: [],
      seachPriceData: [], //价格策略
      rules: {

      },
      processRoteList: [
        { key: "customerAttribute", title: "客户属性" },
        // { key: "developStatus", title: "研发状态" },
        { key: "collectDevelopMoney", title: "收取研发费（不含模具费）" },
        { key: "researchDevelopMoney", title: "投入研发费" },
        { key: "quotationAccuracy", title: "报价准确率" },
        { key: "expenseProfitLoss", title: "研发费盈亏(收取研发费-投入研发费)" },
        // { key: "orderStatus", title: "订单状态" },
        { key: "signedContractMoney", title: "已签合同订单金额" },
        { key: "shipmentOrderMoney", title: "出货订单金额" },
        { key: "shippingProfit", title: "出货利润" },
        { key: "financialGrossMargin", title: "财务利润率" },
        { key: "estimatedGrossProfit", title: "预估毛利" },
        { key: "estimatedProfit", title: "预估利润额" },
        { key: "customerAcquisitionCost", title: "获客成本" },
        { key: "projectProfitLoss", title: "项目盈亏" },
        // { key: "unfinishedCause", title: "未完成原因" },
        // { key: "projectRisk", title: "项目风险" },
        { key: "salesForecast", title: "本年度销售额预测" },
      ],
    };
  },
  computed: {
    quotationAccuracy() {
      const { collectDevelopMoney, researchDevelopMoney } = this.queryFrom;
      return researchDevelopMoney ? (collectDevelopMoney / researchDevelopMoney).toFixed(2) : 0;
    },
    expenseProfitLoss() {
      const { collectDevelopMoney, researchDevelopMoney } = this.queryFrom;
      return collectDevelopMoney && researchDevelopMoney
        ? (collectDevelopMoney - researchDevelopMoney).toFixed(2)
        : 0;
    },
    estimatedProfit() {
      const { signedContractMoney, estimatedGrossProfit } = this.queryFrom;
      return signedContractMoney && estimatedGrossProfit
        ? (signedContractMoney * estimatedGrossProfit).toFixed(2)
        : 0;
    },
    projectProfitLoss() {
      return (
        parseFloat(this.expenseProfitLoss) + parseFloat(this.estimatedProfit)
      ).toFixed(2);
    },
  },
  watch: {
    // Watching for changes in relevant fields and updating computed fields automatically
    'queryFrom.collectDevelopMoney': function() {
      this.queryFrom.quotationAccuracy = this.quotationAccuracy;
      this.queryFrom.expenseProfitLoss = this.expenseProfitLoss;
    },
    'queryFrom.researchDevelopMoney': function() {
      this.queryFrom.quotationAccuracy = this.quotationAccuracy;
      this.queryFrom.expenseProfitLoss = this.expenseProfitLoss;
    },
    'queryFrom.signedContractMoney': function() {
      this.queryFrom.estimatedProfit = this.estimatedProfit;
    },
    'queryFrom.estimatedGrossProfit': function() {
      this.queryFrom.estimatedProfit = this.estimatedProfit;
    },
    expenseProfitLoss(newVal) {
      this.queryFrom.projectProfitLoss = this.projectProfitLoss;
    },
    estimatedProfit(newVal) {
      this.queryFrom.projectProfitLoss = this.projectProfitLoss;
    },
  },
  methods: {
    openModules(type, info) {
      this.queryFrom = {
        haveProductDefinitions: true,
      };
      //获取价格策略不分页
      getPriceList().then((res) => {
        this.PriceList = res.data;
      });
      if (type == "add") {
        this.title = "新增";
      } else {
        this.title = "编辑";
        this.queryFrom = cloneDeep(info);
      }
      this.queryFrom.developProjectId=this.queryFrom.id;
      this.uservisible = true;
    },
    //工艺线路
    onSelect(value) {
      let checkObj = {};
      this.seachData.map((Sitem) => {
        // if (Sitem.id == value) {
        if (Sitem.processRote == value) {
          checkObj = Sitem;
        }
      });
      for (let key in checkObj) {
        this.queryFrom[key] = checkObj[key];
      }
      this.queryFrom.referenceProcessRoteId = checkObj.id;

      this.QuoteCalculate();
      this.$forceUpdate();
    },
    onChange(value) {
      FilterPrice(value).then((res) => {
        console.log(res);
        this.seachData = res.data.items;
      });
    },
    //计算加工费
    getCalculate(key) {
      var quoteArr = [
        { key: "pcbaTestMinutes", title: "PCBA测试时间" },
        { key: "pcbaAssemblyMinutes", title: "PCBA组装时间" },
        { key: "finishedProductTestMinutes", title: "成品测试时间" },
        { key: "finishedProductAssemblyMinutes", title: "成品组装时间" },
        { key: "bomSpecies", title: "物料种类" },
        { key: "dipPointNum", title: "插件点数" },
        { key: "manualWeldingPointNum", title: "手焊点数" },
        { key: "patchPointNum", title: "贴片点数" },
      ];
      //在此范围内计算费用
      var result = false;
      quoteArr.map((item) => {
        if (item.key == key) {
          result = true;
        }
      });
      if (result) {
        this.QuoteCalculate();
      }
    },
    //计算加工费
    QuoteCalculate() {
      if (this.queryFrom.priceStrategyId) {
        let params = {
          ...this.queryFrom,
          odmQuoteId: this.$route.query.id,
        };
        QuoteCalculate(params).then((res) => {
          for (let key in res.data) {
            this.queryFrom[key] = res.data[key];
          }
          this.$forceUpdate();
        });
      }
    },
    //价格策略
    onSelectPric(value) {
      let checkObj = {};
      this.seachPriceData.map((Sitem) => {
        // if (Sitem.id == value) {
        if (Sitem.id == value) {
          checkObj = Sitem;
        }
      });
      // for (let key in checkObj) {
      //   this.queryFrom[key] = checkObj[key];
      // }
      this.queryFrom.priceStrategyName = checkObj.priceStrategyName;
      this.queryFrom.priceStrategyId = checkObj.id;
      this.$forceUpdate();
    },
    onChangePric(value) {
      FilterPriceStrategyId(value).then((res) => {
        this.seachPriceData = res.data;
      });
    },
    // 确定
    handleOk() {
      this.$refs.userRefs.validate((valid) => {
        if (valid) {
          this.confirmLoading = true;
          if (this.title == "新增") {
            this.setManufactureFee();
          } else {
            this.editManufactureFee();
          }
        }
      });
    },
    handleCancel() {
      this.uservisible = false;
      this.$refs.userRefs.resetFields();
    },
    //新增基础数据
    setManufactureFee() {
      this.logDataSource = [];
      let params = {
        ...this.queryFrom,
        odmQuoteId: this.$route.query.id,
      };
      setManufactureFee(params)
        .then((res) => {
          if (res.code == 1) {
            this.$message.success(res.msg);
            this.$emit("ok");
            this.uservisible = false;
          } else {
            this.$message.error(res.msg);
          }
          this.confirmLoading = false;
        })
        .catch((err) => {
          this.loading = false;
          this.confirmLoading = false;
        });
    },
    //编辑基础数据
    editManufactureFee() {
      this.logDataSource = [];
      let params = {
        ...this.queryFrom,
      };
      editManufactureFee(params)
        .then((res) => {
          if (res.code == 1) {
            this.$message.success(res.msg);
            this.$emit("ok");
            this.uservisible = false;
          } else {
            this.$message.error(res.msg);
          }
          this.confirmLoading = false;
        })
        .catch((err) => {
          this.loading = false;
          this.confirmLoading = false;
        });
    },
  },
};
</script>

<style lang="less" scoped></style>
