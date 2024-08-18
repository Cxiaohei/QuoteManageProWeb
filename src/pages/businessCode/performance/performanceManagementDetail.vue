<template>
  <div>
    <a-card>
      <h3>
        项目基础数据：
        <a-button type="primary" @click="sendDetail" v-if="pageType != 'detail'"
          >保存</a-button
        >
        <a-button
          type="primary"
          @click="sendconfigDetail"
          v-if="pageType != 'detail'"
          style="margin-left: 15px"
          >项目确认提交</a-button
        >
      </h3>
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

      <div style="padding: 30px 0px">
        <h3>
          月度费用使用预算：
          <a-button
            type="primary"
            @click="addKkfYList"
            v-if="pageType != 'detail'"
            >新增</a-button
          >
        </h3>
        <ul style="padding: 0">
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
              </p>
              <p>
                <span style>{{ item.monthCost }}</span>
                <span style>{{ item.getMaterials }}</span>
              </p>
            </div>
            <a-button
              type="primary"
              @click="editFyList(item)"
              style="margin-right: 5px"
              v-if="pageType != 'detail'"
              >编辑</a-button
            >
            <!-- <a-popconfirm title="确定删除吗?" ok-text="确定" cancel-text="取消" @confirm="removeList(item)">
              <a-button type="danger">删除目标</a-button>
            </a-popconfirm>-->
          </li>
        </ul>
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
      <div>
        领料:
        <a-input
          placeholder="领料"
          style="width: 240px"
          v-model="bugetFrom.getMaterials"
        />
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
          label: "项目预算",
          key: "projectBudget",
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
        {
          label: "费用使用比例",
          key: "costSchedule",
          disabled: "disabled",
          type: "string",
        },
        {
          label: "时间进度",
          key: "timeSchedule",
          disabled: "disabled",
          type: "string",
        },
        {
          label: "差异率",
          key: "differenceRate",
          disabled: "disabled",
          type: "string",
        },
        {
          label: "余额",
          key: "balanceMoney",
          disabled: "disabled",
          type: "string",
        },
        {
          label: "余额比例",
          key: "balanceRate",
          disabled: "disabled",
          type: "string",
        },
        // {
        //   label: "月均可使用金额",
        //   key: "monthAvailableMone",
        //   disabled: "disabled",
        //   type: "string"
        // }
        // {
        //   label: "软件开发",
        //   key: "haveSoftware",
        //   type: "boolean"
        // }
      ],
      projectObjectivesList: [], //项目目标
      kkProjectBudgetDetailsList: [], //费用
      rules: {
        categoryName: [
          { required: true, message: "请输入类别名称", trigger: "change" },
        ],
      },
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
        this.queryFrom = res.data;
        this.queryFrom.creationTime = this.queryFrom.creationTime
          .replace("T", "/")
          .substring(0, 19);
        this.projectObjectivesList = res.data.projectObjectives;
        this.kkProjectBudgetDetailsList = res.data.kkProjectBudgetDetails;

        console.log(res.data);
      });
    },
    sendDetail() {
      //编辑基础数据
      let params = {
        ...this.queryFrom,
        kkProjectId: this.queryFrom.id,
      };
      editProductDataList(params).then((res) => {
        if (res.code == 1) {
          this.$message.success(res.msg);
          // this.$bus.$emit(
          //   "closeCurrentPage",
          //   "/performance/performanceManagement"
          // );
        } else {
          this.$message.error(res.msg);
        }
        this.getDetail();
      });
    },
    sendconfigDetail() {
      let that = this;
      this.$confirm({
        title: "提交后项目信息不可更改，是否确认？",
        onOk() {
          console.log("OK");
          setKKProjectId(that.$route.query.id).then((res) => {
            if (res.code == 1) {
              that.$message.success(res.msg);
            }else{
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
