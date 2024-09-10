<template>
  <div>
    <a-card>
      <h3>项目基础数据：</h3>
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
          <a-switch
            v-model="queryFrom[item.key]"
            v-if="item.type == 'boolean'"
            :disabled="pageType == 'detail'"
          />
          <!-- 输入框 -->
          <a-input
            v-else-if="item.label == '创建时间'"
            v-model="queryFrom[item.key]"
            style="width: 250px"
            :placeholder="item.label"
            disabled
          ></a-input>

          <a-input
            v-else-if="item.type == 'string'"
            v-model="queryFrom[item.key]"
            style="width: 250px"
            :placeholder="item.label"
            :disabled="pageType == 'detail' || item.disabled == 'disabled'"
          ></a-input>
          <!-- 产品下拉 -->

          <a-select
            v-else-if="item.label == '项目类型'"
            v-model="queryFrom.projectType"
            :disabled="pageType == 'detail'"
            style="width: 250px"
          >
            <a-select-option :value="0">常规型</a-select-option>
            <a-select-option :value="1">战略型</a-select-option>
            <a-select-option :value="2">改善型</a-select-option>
          </a-select>
          <a-select
            v-else-if="item.label == '项目来源'"
            v-model="queryFrom.projectSource"
            :disabled="pageType == 'detail'"
            style="width: 250px"
          >
            <a-select-option :value="0">日常工作包</a-select-option>
            <a-select-option :value="1">战略策略</a-select-option>
            <a-select-option :value="2">改善策略</a-select-option>
          </a-select>
          <!-- <a-select
            v-else-if="item.label == '项目类型'"
            v-model="queryFrom[item.key]"
            style="width: 250px"
            :placeholder="item.label"
            :disabled="pageType=='detail'"
            allowClear
          >
            <a-select-option
              :value="item.id"
              v-for="(item,index) in ProductList"
              :key="index"
            >{{item.productNo}}</a-select-option>
          </a-select>-->
        </a-form-model-item>
        <a-form-model-item label="项目时间" style="width: 31%">
          <a-range-picker
            v-model.trim="timeArr1"
            style="width: 250px; display: inline-block"
            :allowClear="false"
            :disabled="pageType == 'detail'"
            format="YYYY-MM-DD"
            valueFormat="YYYY-MM-DD"
          />
        </a-form-model-item>
        <a-form-model-item label="项目预算" style="width: 31%">
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
          <a-button type="primary" @click="yusuanVisible = true"
            >预算明细项</a-button
          >
        </a-form-model-item>
        <a-form-model-item label="监控手段" style="width: 31%">
          <a-select
            v-model="queryFrom.monitoringMeans"
            :disabled="pageType == 'detail'"
            style="width: 250px"
          >
            <a-select-option value="月度定额">月度定额</a-select-option>
            <a-select-option value="月度监控">月度监控</a-select-option>
            <a-select-option value="条件使用">条件使用</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="制造费用" style="width: 31%">
          <a-input-number
            v-model="queryFrom.manufacturingContainCost"
            style="width: 250px"
            placeholder="制造费用"
            @change="quoteMean('manufacturingContainCost')"
            :disabled="pageType == 'detail'"
          ></a-input-number>
        </a-form-model-item>
        <a-form-model-item label="固定费用" style="width: 31%">
          <a-input-number
            v-model="queryFrom.fixedCharge"
            style="width: 250px"
            placeholder="固定费用"
            @change="quoteMean('fixedCharge')"
            :disabled="pageType == 'detail'"
          ></a-input-number>
        </a-form-model-item>
        <a-form-model-item label="项目目的" style="width: 31%">
          <a-textarea
            v-model="queryFrom.projectPurpose"
            style="width: 250px"
            placeholder="项目目的"
            :disabled="pageType == 'detail'"
          ></a-textarea>
        </a-form-model-item>
        <a-form-model-item label="立项人" style="width: 31%">
          <a-input
            v-model="queryFrom.createUserName"
            style="width: 250px"
            placeholder="立项人"
            :disabled="pageType == 'detail'"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item label="项目经理" style="width: 31%">
          <a-input
            v-model="queryFrom.projectManager"
            style="width: 250px"
            placeholder="项目经理"
            :disabled="pageType == 'detail'"
          ></a-input>
        </a-form-model-item>
      </a-form-model>

      <div style="padding: 30px 0px">
        <h3>
          项目目标：
          <a-button
            type="primary"
            @click="addKkMbList"
            v-if="pageType != 'detail'"
            >新增目标</a-button
          >
        </h3>

        <ul style="padding: 0 0 0 42px; width: 100%">
          <li
            style="list-style: none; margin: 0 20px 10px 0; width: 80%"
            v-for="(item, index) in projectObjectivesList"
            :key="index"
          >
            目标{{ index + 1 }}:
            <a-input
              v-model="item.objective"
              style="width: 80%; margin-right: 5px"
              placeholder="目标列表"
              disabled
            ></a-input>
            <a-button
              type="primary"
              @click="editList(item)"
              v-if="pageType != 'detail'"
              style="margin-right: 5px"
              >编辑</a-button
            >
            <a-popconfirm
              title="确定删除吗?"
              ok-text="确定"
              cancel-text="取消"
              @confirm="removeList(item)"
              v-if="pageType != 'detail'"
            >
              <a-button type="danger">删除</a-button>
            </a-popconfirm>
          </li>
        </ul>
      </div>

      <!-- <div style="padding: 30px 0px">
        <h3>
          月度费用使用预算：
          <a-button
            type="primary"
            @click="addKkfYList"
            v-if="pageType != 'detail'"
            >新增</a-button
          >
        </h3>
        <ul style="padding: 0; overflow: hidden">
          <li
            style="
              list-style: none;
              float: left;
              margin: 0 20px 10px 0;
              text-align: center;
            "
            v-for="(item, index) in kkProjectBudgetDetailsList"
            :key="index"
          >
            <div class="kkProjectBudgetDetailsList">
              <p style>{{ item.budgetMonth.substring(0, 7) }}</p>
              <p>
                <span style>费用</span>
                <span style>领料</span>
                <span style>制造费用</span>
              </p>
              <p>
                <span style>{{ item.monthCost }}</span>
                <span style>{{ item.getMaterials }}</span>
                <span style>{{ item.manufactureFee }}</span>
              </p>
            </div>
            <a-button
              type="primary"
              @click="editFyList(item)"
              style="margin-right: 5px"
              v-if="pageType != 'detail'"
              >编辑</a-button
            >
           <a-popconfirm title="确定删除吗?" ok-text="确定" cancel-text="取消" @confirm="removeList(item)">
              <a-button type="danger">删除目标</a-button>
            </a-popconfirm>
        </li>
        </ul>
      </div>-->
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
            v-model="kkProjectBugetPartModel.trafficMoney"
            :disabled="pageType == 'detail'"
          />
        </div>
        <div style="margin-bottom: 15px">
          住宿费:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <a-input-number
            placeholder="住宿费"
            style="width: 240px"
            v-model="kkProjectBugetPartModel.accommodationMoney"
            :disabled="pageType == 'detail'"
          />
        </div>
        <div style="margin-bottom: 15px">
          餐费:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <a-input-number
            placeholder="餐费"
            style="width: 240px"
            :disabled="pageType == 'detail'"
            v-model="kkProjectBugetPartModel.tableMoney"
          />
        </div>
        <div style="margin-bottom: 15px">
          业务招待费:
          <a-input-number
            placeholder="业务招待费"
            style="width: 240px"
            v-model="kkProjectBugetPartModel.businessHospitalityMoney"
            :disabled="pageType == 'detail'"
          />
        </div>
        <div style="margin-bottom: 15px">
          邮寄托运费:
          <a-input-number
            placeholder="邮寄托运费"
            style="width: 240px"
            v-model="kkProjectBugetPartModel.shipMoney"
            :disabled="pageType == 'detail'"
          />
        </div>
        <div style="margin-bottom: 15px">
          活动现场费:
          <a-input-number
            placeholder="活动现场费"
            style="width: 240px"
            v-model="kkProjectBugetPartModel.eventSiteMoney"
            :disabled="pageType == 'detail'"
          />
        </div>
        <div style="margin-bottom: 15px">
          礼品费:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <a-input-number
            placeholder="礼品费"
            style="width: 240px"
            v-model="kkProjectBugetPartModel.giftMoney"
            :disabled="pageType == 'detail'"
          />
        </div>
        <div style="margin-bottom: 15px">
          其他费用:&nbsp;&nbsp;&nbsp;&nbsp;
          <a-input-number
            placeholder="其他费用"
            style="width: 240px"
            v-model="kkProjectBugetPartModel.otherMoney"
            :disabled="pageType == 'detail'"
          />
        </div>
        <div style="margin-bottom: 15px">
          其他费用说明:
          <a-input
            placeholder="其他费用说明"
            style="width: 240px"
            v-model="kkProjectBugetPartModel.otherMoneyReamrk"
            :disabled="pageType == 'detail'"
          />
        </div>
      </a-modal>
      <h3 v-if="pageType != 'detail'">页面保存</h3>
      <div>
        <a-button type="primary" @click="sendDetail" v-if="pageType != 'detail'"
          >保存草稿</a-button
        >
        <a-button
          type="primary"
          @click="sendconfigDetail"
          v-if="pageType != 'detail'"
          style="margin-left: 15px"
          >提交审核</a-button
        >
      </div>
    </a-card>

    <a-modal
      :title="MbTitle"
      :visible="MbVisible"
      @ok="handleOkMb"
      @cancel="MbVisible = false"
    >
      <a-input placeholder="目标" v-model="objective" />
    </a-modal>

    <a-modal
      :title="bugetFromTitle"
      :visible="bugetFromVisible"
      @ok="handleOkbugetFrom"
      @cancel="bugetFromVisible = false"
      width="350px"
    >
      <!-- {{ bugetFrom }} -->
      <div style="margin-bottom: 15px">
        预算使用月份:
        <a-month-picker
          v-model="bugetFrom.budgetMonth"
          format="YYYY-MM"
          valueFormat="YYYY-MM"
        />
      </div>
      <div style="margin-bottom: 15px">
        预算:
        <a-input
          placeholder="预算"
          style="width: 240px"
          v-model="bugetFrom.monthCost"
        />
      </div>
      <div style="margin-bottom: 15px">
        领料:
        <a-input
          placeholder="领料"
          style="width: 240px"
          v-model="bugetFrom.getMaterials"
        />
        <div>
          制造:
          <a-input
            placeholder="制造费用"
            style="width: 240px"
            v-model="bugetFrom.manufactureFee"
          />
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import {
  getPageListDetail,
  addKkMb,
  editKkMb,
  removeKkMb,
  editProductDataList,
  addKkFy,
  editKkFy,
  setKKProjectId,
} from "@/services/performance/performanceManagement";

import cloneDeep from "lodash.clonedeep";

export default {
  name: "customerModal",
  components: {},
  props: {},
  data() {
    return {
      title: "标题",
      queryFrom: {},
      ProductList: [],
      timeArr1: [],
      MbVisible: false,
      bugetFromVisible: false,
      MbTitle: "项目目标",
      bugetFromTitle: "新增月度费用预算",
      objective: "",
      pageType: "detail", //页面类型区分编辑和详情
      projectObjectiveId: "",
      confirmLoading: false,
      bugetFrom: {
        kkProjectId: "",
        budgetMonth: "",
        monthCost: "",
        getMaterials: "",
        projectBudgetDetailId: "",
      },

      yusuanVisible: false, //项目预算
      queryFromDataList: [
        {
          label: "部门",
          key: "department",
          type: "string",
        },
        {
          label: "项目类型",
          key: "projectType",
          // type: "string"
        },
        {
          label: "项目来源",
          key: "projectSource",
          // type: "string"
        },
        {
          label: "项目编号",
          key: "projectNo",
          type: "string",
        },
        {
          label: "项目名称",
          key: "projectName",
          type: "string",
        },
        {
          label: "备注",
          key: "remark",
          type: "string",
        },
        {
          label: "创建时间",
          key: "creationTime",
          type: "string",
        },
      ],
      projectObjectivesList: [], //项目目标
      kkProjectBudgetDetailsList: [], //费用

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
      kkProjectBugetPartModel: {},
    };
  },
  created() {
    this.getDetail();
  },
  methods: {
    getDetail() {
      //先重置数据
      this.queryFrom = {
        haveProductDefinitions: true,
      };
      this.pageType = this.$route.query.type;
      getPageListDetail(this.$route.query.id).then((res) => {
        console.log("详情");
        console.log(res.data);
        this.queryFrom = res.data;
        this.queryFrom.creationTime = this.queryFrom.creationTime
          .replace("T", "/")
          .substring(0, 19);
        this.timeArr1 = [this.queryFrom.startTime, this.queryFrom.endTime];
        this.projectObjectivesList = res.data.projectObjectives;
        this.kkProjectBudgetDetailsList = res.data.kkProjectBudgetDetails;
        this.kkProjectBugetPart = res.data.projectBugetParts[0];
        this.kkProjectBugetPartModel = cloneDeep(this.kkProjectBugetPart);
        console.log("明细", this.kkProjectBugetPart);
        console.log(res.data);
      });
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
        projectBudgetNum += parseInt(this.kkProjectBugetPartModel[item]);
        this.kkProjectBugetPart[item] = this.kkProjectBugetPartModel[item];
      });
      this.queryFrom.projectBudget = projectBudgetNum;
      this.yusuanVisible = false;
    },
    sendDetail() {
      //编辑基础数据
      let params = {
        ...this.queryFrom,
        kkProjectId: this.queryFrom.id,
      };
      params["kkProjectBugetPart"] = this.kkProjectBugetPart;
      var isbudget = !this.queryFrom.projectBudget;
      var isfied = !this.queryFrom.fixedCharge;
      var ismanuf = !this.queryFrom.manufacturingContainCost;

      var titleisbudgetStr = isbudget ? "项目预算金额为0，" : "";
      var titleisfiedStr = isfied ? "固定费用金额为0，" : "";
      var titleismanufStr = ismanuf ? "制造费用金额为0，" : "";
      var titleStr = titleisbudgetStr + titleisfiedStr + titleismanufStr;
      const self = this;
      if (titleStr) {
        this.$confirm({
          title:
            "你的" +
            titleisbudgetStr +
            titleisfiedStr +
            titleismanufStr +
            "请确认是否漏填，一旦你提交表单，所有的变更都只能走变更申请",
          onOk() {
            editProductDataList(params).then((res) => {
              if (res.code == 1) {
                self.$message.success(res.msg);
                // this.$bus.$emit(
                //   "closeCurrentPage",
                //   "/performance/performanceManagement"
                // );
              } else {
                self.$message.error(res.msg);
              }
              self.getDetail();
            });
          },
          onCancel() {
            self.confirmLoading = false;
          },
        });
      } else {
        editProductDataList(params).then((res) => {
              if (res.code == 1) {
                self.$message.success(res.msg);
                // this.$bus.$emit(
                //   "closeCurrentPage",
                //   "/performance/performanceManagement"
                // );
              } else {
                self.$message.error(res.msg);
              }
              self.getDetail();
            });
      }
    },
    sendconfigDetail() {
      let that = this;
      this.$confirm({
        title: "提交后项目信息不可再更改，需要走变更流程，是否确认？",
        onOk() {
          console.log("OK");
          setKKProjectId(that.$route.query.id).then((res) => {
            if (res.code == 1) {
              that.$message.success(res.msg);
            } else {
              that.$message.error(res.msg);
            }
          });
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    },

    //费用添加 编辑
    addKkfYList() {
      this.bugetFrom = {
        kkProjectId: this.$route.query.id,
        budgetMonth: "",
        monthCost: "",
        getMaterials: "",
        projectBudgetDetailId: "",
      };
      this.bugetFromTitle = "新增月度费用预算";
      this.bugetFromVisible = true;
    },
    editFyList(record) {
      this.bugetFrom = {
        kkProjectId: this.$route.query.id,
        budgetMonth: record.budgetMonth.substring(0, 7),
        monthCost: record.monthCost,
        getMaterials: record.getMaterials,
        projectBudgetDetailId: record.id,
      };
      this.bugetFromTitle = "编辑月度费用预算";
      this.bugetFromVisible = true;
    },
    handleOkbugetFrom() {
      const params = { ...this.bugetFrom };
      if (this.bugetFromTitle == "编辑月度费用预算") {
        editKkFy(params).then((res) => {
          if (res.code == 1) {
            this.$message.success(res.msg);
            this.getDetail();
          } else {
            this.$message.error(res.msg);
          }
          this.bugetFromVisible = false;
        });
      } else {
        addKkFy([params]).then((res) => {
          if (res.code == 1) {
            this.$message.success(res.msg);
            this.getDetail();
          } else {
            this.$message.error(res.msg);
          }
          this.bugetFromVisible = false;
        });
      }
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
    //目标
    addKkMbList() {
      this.projectObjectiveId = "";
      this.objective = "";
      this.MbTitle = "新增项目目标";
      this.MbVisible = true;
    },
    editList(record) {
      this.projectObjectiveId = record.id;
      this.objective = record.objective;
      this.MbTitle = "编辑项目目标";
      this.MbVisible = true;
    },
    handleOkMb() {
      const params = {
        kkProjectId: this.$route.query.id,
        objective: this.objective,
      };
      if (this.MbTitle == "编辑项目目标") {
        params.projectObjectiveId = this.projectObjectiveId;
        editKkMb(params).then((res) => {
          this.$message.success(res.msg);
          this.MbVisible = false;
          this.getDetail();
        });
      } else {
        addKkMb([params]).then((res) => {
          this.$message.success(res.msg);
          this.MbVisible = false;
          this.getDetail();
        });
      }
    },
    //删除目标
    removeList(record) {
      removeKkMb(record.id).then((res) => {
        this.$message.success("删除成功");
        this.getDetail();
      });
    },
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
.kkProjectBudgetDetailsList {
  width: 200px;
  margin: 20px 0;
  text-align: center;
  border: 1px solid #ddd;
  p {
    padding: 0;
    margin: 0;
    border: 1px solid #ddd;
  }
  span {
    padding: 0;
    margin: 0;
    display: inline-block;
    width: 50%;
    border: 1px solid #ddd;
    border-top: none;
    border-bottom: none;
  }
}
</style>
