<template>
  <div>
    <a-modal
      :width="1080"
      :title="title"
      :visible="uservisible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      class="performanceManagement"
    >
      <a-form-model
        :model="queryFrom"
        layout="inline"
        :label-col="{ span: 6 }"
        :rules="rules"
        ref="userRefs"
      >
        <a-form-model-item label="部门">
          <a-input
            v-model="queryFrom.department"
            style="width: 350px"
            placeholder="部门"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item label="立项人">
          <a-input
            v-model="queryFrom.createUserName"
            style="width: 350px"
            placeholder="立项人"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item label="项目编号">
          <a-input
            v-model="queryFrom.projectNo"
            style="width: 350px"
            placeholder="项目编号"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item label="项目名称">
          <a-input
            v-model="queryFrom.projectName"
            style="width: 350px"
            placeholder="项目名称"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item label="项目类型">
          <a-select
            v-model="queryFrom.projectType"
            placeholder="项目类型"
            style="width: 350px"
          >
            <a-select-option value="0">常规型</a-select-option>
            <a-select-option value="1">战略型</a-select-option>
            <a-select-option value="2">改善型</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="项目来源">
          <a-select
            v-model="queryFrom.projectSource"
            placeholder="项目来源"
            style="width: 350px"
          >
            <a-select-option value="0">日常工作包</a-select-option>
            <a-select-option value="1">战略策略</a-select-option>
            <a-select-option value="2">改善策略</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="项目目的">
          <a-textarea
            v-model="queryFrom.projectPurpose"
            style="width: 350px"
            placeholder="项目目的"
          ></a-textarea>
        </a-form-model-item>
        <a-form-model-item label="项目经理">
          <a-input
            v-model="queryFrom.projectManager"
            style="width: 350px"
            placeholder="项目经理"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item label="项目时间">
          <a-range-picker
            v-model.trim="timeArr1"
            style="width: 350px"
            :allowClear="false"
            format="YYYY-MM-DD"
            valueFormat="YYYY-MM-DD"
          />
          <!-- <a-input v-model="queryFrom.timeArr" style="width: 350px" placeholder="projectManager"></a-input> -->
        </a-form-model-item>
        <a-form-model-item label="项目预算">
          <a-tooltip>
            <template slot="title">总预算=三项费用+制造费用+领料</template>
            <a-icon type="info-circle" /> </a-tooltip
          >&nbsp;
          <a-input-number
            v-model="queryFrom.projectBudget"
            disabled
            style="width: 150px; margin-right: 5px"
            placeholder="项目预算"
          ></a-input-number>
          <a-button type="primary" style @click="yusuanVisible = true"
            >预算明细项</a-button
          >
        </a-form-model-item>
        <a-form-model-item label="关联目标">
          <div style="overflow: hidden; width: 350px">
            <ul style="padding: 0">
              <li
                style="list-style: none"
                v-for="(item, index) in projectObjectivesList"
                :key="index"
              >
                <a-input
                  v-model="item.value"
                  style="width: 250px; margin-right: 5px"
                  placeholder="目标列表"
                ></a-input>
                <a-button
                  type="primary"
                  style="margin-right: 5px"
                  @click="addList"
                  >+</a-button
                >
                <a-button
                  type="primary"
                  @click="removeList(index)"
                  v-if="index > 0"
                  >-</a-button
                >
              </li>
            </ul>
          </div>
        </a-form-model-item>
        <a-form-model-item label="固定费用">
          <a-input-number
            v-model="queryFrom.fixedCharge"
            style="width: 350px"
            placeholder="固定费用"
            @change="quoteMean('fixedCharge')"
          ></a-input-number>
        </a-form-model-item>

        <a-form-model-item label="监控手段">
          <a-select v-model="queryFrom.monitoringMeans" style="width: 250px">
            <a-select-option value="月度定额">月度定额</a-select-option>
            <a-select-option value="月度监控">月度监控</a-select-option>
            <a-select-option value="条件使用">条件使用</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="制造费包含金额">
          <a-input-number
            v-model="queryFrom.manufacturingContainCost"
            style="width: 350px"
            placeholder="制造费包含金额"
            @change="quoteMean('manufacturingContainCost')"
          ></a-input-number>
        </a-form-model-item>

        <a-form-model-item label="费用备注">
          <a-input
            v-model="queryFrom.remark"
            style="width: 350px"
            placeholder="费用备注"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item label="预算包含内容">
          <a-input
            v-model="queryFrom.projectBudgetDetail"
            style="width: 350px"
            placeholder="预算包含内容"
          ></a-input>
        </a-form-model-item>
      </a-form-model>

      <a-modal
        title="项目预算明细"
        :visible="yusuanVisible"
        @ok="handleOkyusuan"
        @cancel="yusuanVisible = false"
        width="420px"
      >
        <div style="margin-bottom: 15px">
          交通费:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <a-input-number
            placeholder="交通费"
            style="width: 240px"
            v-model="kkProjectBugetPart.trafficMoney"
          />
        </div>
        <div style="margin-bottom: 15px">
          住宿费:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <a-input-number
            placeholder="住宿费"
            style="width: 240px"
            v-model="kkProjectBugetPart.accommodationMoney"
          />
        </div>
        <div style="margin-bottom: 15px">
          餐费:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <a-input-number
            placeholder="餐费"
            style="width: 240px"
            v-model="kkProjectBugetPart.tableMoney"
          />
        </div>
        <div style="margin-bottom: 15px">
          业务招待费:
          <a-input-number
            placeholder="预算"
            style="width: 240px"
            v-model="kkProjectBugetPart.businessHospitalityMoney"
          />
        </div>
        <div style="margin-bottom: 15px">
          邮寄托运费:
          <a-input-number
            placeholder="预算"
            style="width: 240px"
            v-model="kkProjectBugetPart.shipMoney"
          />
        </div>
        <div style="margin-bottom: 15px">
          活动现场费:
          <a-input-number
            placeholder="预算"
            style="width: 240px"
            v-model="kkProjectBugetPart.eventSiteMoney"
          />
        </div>
        <div style="margin-bottom: 15px">
          礼品费:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <a-input-number
            placeholder="预算"
            style="width: 240px"
            v-model="kkProjectBugetPart.giftMoney"
          />
        </div>
        <div style="margin-bottom: 15px">
          其他费用:&nbsp;&nbsp;&nbsp;&nbsp;
          <a-input-number
            placeholder="预算"
            style="width: 240px"
            v-model="kkProjectBugetPart.otherMoney"
          />
        </div>
        <p>
          请预估你这一年要计入到制造费用、研发领料、客户免费样机、固定费用（一般指折旧，政府收费），或其他以上项目未提及的费用总额填写到其它费用预算框内，同时在其他费用说明文本框内列明明细。
        </p>
        <div style="margin-bottom: 15px">
          其他费用说明:
          <a-input
            placeholder="其他费用说明"
            style="width: 240px"
            v-model="kkProjectBugetPart.otherMoneyReamrk"
          />
        </div>
      </a-modal>
    </a-modal>
  </div>
</template>

<script>
import {
  addProductDataList,
  editProductDataList,
} from "@/services/performance/performanceManagement";
import cloneDeep from "lodash.clonedeep";

export default {
  name: "customerModal",
  props: {},
  data() {
    return {
      title: "标题",
      uservisible: false,
      queryFrom: {},
      timeArr1: [],
      confirmLoading: false,
      queryFromDataList: [
        {
          label: "产品编号",
          key: "productNo",
        },
        {
          label: "产品名称",
          key: "productName",
        },
        {
          label: "产品类别",
          key: "productType",
        },
        {
          label: "9NC",
          key: "nineNC",
        },
        {
          label: "产品线",
          key: "productLine",
        },
        {
          label: "产品硬件平台",
          key: "hardwarePlatform",
        },
        {
          label: "产品软件平台",
          key: "softwarePlatform",
        },
        {
          label: "产品描述",
          key: "description",
        },
        {
          label: "图片",
          key: "productImgUrls",
        },
        {
          label: "操作人姓名",
          key: "operatUserName",
        },
        {
          label: "最后一次报价时间",
          key: "lastQuoteTime",
        },
        {
          label: "标准价格",
          key: "standardPrice",
        },
        {
          label: "成本价",
          key: "costPrice",
        },
        {
          label: "当前报价",
          key: "currentPrice",
        },
        {
          label: "备注",
          key: "remarks",
        },
      ],
      projectObjectivesList: [{ value: "" }],
      rules: {
        categoryName: [
          { required: true, message: "请输入类别名称", trigger: "change" },
        ],
      },
      kkProjectBugetPart: {
        kkProjectId: "",
        trafficMoney: 0,
        accommodationMoney: 0,
        tableMoney: 0,
        businessHospitalityMoney: 0,
        shipMoney: 0,
        eventSiteMoney: 0,
        giftMoney: 0,
        otherMoney: 0,
        otherMoneyReamrk: "",
        projectChangeType: 0,
        projectChangeRequestId: "",
      },
      yusuanVisible: false, //项目预算
    };
  },
  methods: {
    openModules(type, info) {
      this.queryFrom = {};
      if (type == "add") {
        this.title = "新增";
      } else {
        this.title = "编辑";
        this.queryFrom = cloneDeep(info);
      }
      this.uservisible = true;
    },
    addList() {
      this.projectObjectivesList.push({ value: "" });
    },
    removeList(index) {
      this.projectObjectivesList.splice(index, 1);
    },
    handleOkyusuan() {
      var addArr = [
        "trafficMoney",
        "accommodationMoney",
        "tableMoney",
        "businessHospitalityMoney",
        "shipMoney",
        "eventSiteMoney",
        "giftMoney",
        "otherMoney",
        "projectChangeType",
      ];
      var projectBudgetNum = 0;
      addArr.map((item) => {
        projectBudgetNum += parseInt(this.kkProjectBugetPart[item]);
      });
      this.queryFrom.projectBudget = projectBudgetNum;
      this.yusuanVisible = false;
    },
    quoteMean(key) {
      if (!this.queryFrom.projectBudget) {
        this.$message.error("请先填写项目预算");
        this.queryFrom[key] = 0;
      }
      if (
        this.queryFrom.fixedCharge + this.queryFrom.manufacturingContainCost >
        this.queryFrom.projectBudget
      ) {
        this.$message.error("固定收费+制造费用不能大于项目预算");
        this.queryFrom[key] = 0;
      }
    },
    // 确定
    handleOk() {
      this.$refs.userRefs.validate((valid) => {
        var isbudget = !this.queryFrom.projectBudget;
        var isfied = !this.queryFrom.fixedCharge;
        var ismanuf = !this.queryFrom.manufacturingContainCost;

        var titleisbudgetStr = isbudget ? "项目预算金额为0，" : "";
        var titleisfiedStr = isfied ? "固定费用金额为0，" : "";
        var titleismanufStr = ismanuf ? "制造费用金额为0，" : "";
        var isadd = this.title == "新增";
        var titleStr = titleisbudgetStr + titleisfiedStr + titleismanufStr;
        if (valid) {
          if (titleStr) {
            const self = this;
            this.$confirm({
              title:
                "你的" +
                titleisbudgetStr +
                titleisfiedStr +
                titleismanufStr +
                "请确认是否漏填，一旦你提交表单，所有的变更都只能走变更申请",
              onOk() {
                if (isadd) {
                  self.addProductDataList();
                } else {
                  editProductDataList();
                }
              },
              onCancel() {
              },
            });
          } else {
            if (isadd) {
              addProductDataList();
            } else {
              editProductDataList();
            }
          }
          this.confirmLoading = true;
        }
      });
    },
    handleCancel() {
      this.uservisible = false;
      this.$refs.userRefs.resetFields();
    },
    //新增基础数据
    addProductDataList() {
      this.logDataSource = [];
      let params = {
        ...this.queryFrom,
      };

      if (this.timeArr1 && this.timeArr1.length > 0) {
        params.startTime = this.timeArr1[0];
        params.endTime = this.timeArr1[1];
      }
      const projectObjectives = [];
      this.projectObjectivesList.map((item) => {
        projectObjectives.push({
          objective: item.value,
        });
      });
      params["projectObjectives"] = projectObjectives;
      params["kkProjectBugetPart"] = this.kkProjectBugetPart;

      addProductDataList(params)
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
    editProductDataList() {
      this.logDataSource = [];
      let params = {
        ...this.queryFrom,
        kkProjectId: this.queryFrom.id,
      };
      const projectObjectives = [];
      this.projectObjectivesList.map((item) => {
        projectObjectives.push({
          objective: item.value,
        });
      });
      params["projectObjectives"] = projectObjectives;
      editProductDataList(params)
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

<style lang="less" scoped>
.performanceManagement .ant-form-item {
  margin-bottom: 3px !important;
  width: 48%;
}
</style>
