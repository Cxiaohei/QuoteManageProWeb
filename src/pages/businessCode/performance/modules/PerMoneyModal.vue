<template>
  <div>
    <a-modal
      :width="980"
      title="编辑费用"
      :visible="uservisible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      class="performanceManagement"
    >
      <div style="padding: 30px 0px">
        <h3>
          月度费用使用预算：
          <a-button type="primary" @click="addKkfYList">新增</a-button>
        </h3>
        <ul style="padding: 0;overflow:hidden">
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
                <span style>制造</span>
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
            >编辑</a-button>
            <!-- <a-popconfirm title="确定删除吗?" ok-text="确定" cancel-text="取消" @confirm="removeList(item)">
              <a-button type="danger">删除目标</a-button>
            </a-popconfirm>-->
          </li>
        </ul>
      </div>

      <a-modal
        :title="bugetFromTitle"
        :visible="bugetFromVisible"
        @ok="handleOkbugetFrom"
        @cancel="bugetFromVisible = false"
        width="550px"
      >
        <!-- {{ bugetFrom }} -->
        <div style="margin-bottom: 15px">
          预算使用月份:
          <a-month-picker v-model="bugetFrom.budgetMonth" format="YYYY-MM" valueFormat="YYYY-MM" />
        </div>
        <div style="margin-bottom: 15px">
          预算:
          <a-input placeholder="预算" style="width: 240px" v-model="bugetFrom.monthCost" />
        </div>
        <div>
          领料:
          <a-input placeholder="领料" style="width: 240px" v-model="bugetFrom.getMaterials" />
        </div>
        <div>
          制造:
          <a-input placeholder="制造费用" style="width: 240px" v-model="bugetFrom.manufactureFee" />
        </div>
      </a-modal>
    </a-modal>
  </div>
</template>

<script>
import {
  getPageListDetail,
  addKkFy,
  editKkFy
} from "@/services/performance/performanceManagement";
import cloneDeep from "lodash.clonedeep";

export default {
  name: "customerModal",
  props: {},
  data() {
    return {
      title: "标题",
      uservisible: false,
      confirmLoading: false,
      kkProjectBudgetDetailsList: [],
      bugetFromVisible: false,
      bugetFromTitle: "新增月度费用预算",
      kkProjectId: "",
      bugetFrom: {
        kkProjectId: "",
        budgetMonth: "",
        monthCost: "",
        getMaterials: "",
        manufactureFee: "",
        projectBudgetDetailId: ""
      }
    };
  },
  methods: {
    openModules(info) {
      this.queryFrom = {};
      this.kkProjectId = info.id;
      this.getDetail()
      this.uservisible = true;
    },
    getDetail(){
      getPageListDetail(this.kkProjectId).then(res => {
        this.kkProjectBudgetDetailsList = res.data.kkProjectBudgetDetails;
      });
    },
    //费用添加 编辑
    addKkfYList() {
      this.bugetFrom = {
        kkProjectId: this.kkProjectId,
        budgetMonth: "",
        monthCost: "",
        getMaterials: "",
        manufactureFee: "",
        projectBudgetDetailId: ""
      };
      this.bugetFromTitle = "新增月度费用预算";
      this.bugetFromVisible = true;
    },
    editFyList(record) {
      this.bugetFrom = {
        kkProjectId: this.kkProjectId,
        budgetMonth: record.budgetMonth.substring(0, 7),
        monthCost: record.monthCost,
        getMaterials: record.getMaterials,
        manufactureFee: record.manufactureFee,
        projectBudgetDetailId: record.id
      };
      this.bugetFromTitle = "编辑月度费用预算";
      this.bugetFromVisible = true;
    },
    handleOkbugetFrom() {
      const params = { ...this.bugetFrom };
      if (this.bugetFromTitle == "编辑月度费用预算") {
        editKkFy(params).then(res => {
          if (res.code == 1) {
            this.$message.success(res.msg);
            this.getDetail();
          } else {
            this.$message.error(res.msg);
          }
          this.bugetFromVisible = false;
        });
      } else {
        addKkFy([params]).then(res => {
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
    // 确定
    handleOk() {
      this.uservisible = false;
      this.kkProjectBudgetDetailsList = [];
    },
    handleCancel() {
      this.uservisible = false;
      this.kkProjectBudgetDetailsList = [];
    }
  }
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
    width: 33%;
    border: 1px solid #ddd;
    border-top: none;
    border-bottom: none;
  }
}
</style>