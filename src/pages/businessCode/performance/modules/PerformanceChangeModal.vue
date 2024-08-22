<template>
  <div>
    <a-modal
      width="60%"
      title="申请变更"
      :visible="uservisible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      class="performanceManagement"
    >
      <table class="scrapBalanceTable">
        <tr>
          <td v-for="(item, index) in tableKey" :key="index">{{ item.name }}</td>
        </tr>
        <tr>
          <td v-for="(item, index) in tableKey" :key="index">
            <p v-if="item.name=='项目类型' ">
              {{
              tableData[item.key]==0 ?"常规型" :
              tableData[item.key]==1 ?"战略型" :"改善型"
              }}
            </p>
            <p v-else-if="item.name=='项目来源' ">
              {{
              tableData[item.key]==0 ?"日常工作包" :
              tableData[item.key]==1 ?"战略型" :"改善策略"
              }}
            </p>
            <p v-else-if="item.name=='起止时间' ">
              起:{{
              tableData.startTime.substring(0,10)
              }}
              <br />
              止:{{
              tableData.endTime.substring(0,10)
              }}
            </p>
            <p v-else>{{ tableData[item.key] }}</p>
          </td>
        </tr>
      </table>
      <a-form-model
        :model="queryFrom"
        layout="inline"
        :label-col="{ span: 6 }"
        :rules="rules"
        ref="userRefs"
      >
        <a-form-model-item label="部门">
          <a-input v-model="tableData.department" style="width: 175px" placeholder="部门" disabled></a-input>
          <a-input v-model="queryFrom.department" style="width: 175px" placeholder="部门"></a-input>
        </a-form-model-item>

        <a-form-model-item label="项目时间">
          <a-range-picker
            v-model.trim="timeArr1"
            :allowClear="false"
            format="YYYY-MM-DD"
            valueFormat="YYYY-MM-DD"
          />
        </a-form-model-item>
        <a-form-model-item label="立项人">
          <a-input
            v-model="tableData.createUserName"
            style="width: 175px"
            placeholder="立项人"
            disabled
          ></a-input>
          <a-input v-model="queryFrom.createUserName" style="width: 175px" placeholder="立项人"></a-input>
        </a-form-model-item>
        <a-form-model-item label="项目经理">
          <a-input
            v-model="tableData.projectManager"
            style="width: 175px"
            placeholder="项目经理"
            disabled
          ></a-input>
          <a-input v-model="queryFrom.projectManager" style="width: 175px" placeholder="项目经理"></a-input>
        </a-form-model-item>
        <a-form-model-item label="项目目的">
          <a-input
            v-model="tableData.projectPurpose"
            style="width: 175px"
            placeholder="项目目的"
            disabled
          ></a-input>
          <a-input v-model="queryFrom.projectPurpose" style="width: 175px" placeholder="项目目的"></a-input>
        </a-form-model-item>
        <!-- <a-form-model-item label="项目目标">
          <a-input
            v-model="tableData.projectObjectives"
            style="width: 175px"
            placeholder="项目目标"
            disabled
          ></a-input>
          <a-input v-model="queryFrom.projectObjectives" style="width: 175px" placeholder="项目目标"></a-input>
        </a-form-model-item>-->
        <a-form-model-item label="项目目标">
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
                  placeholder="项目目标"
                ></a-input>
                <a-button type="primary" style="margin-right: 5px" @click="addList">+</a-button>
                <a-button type="primary" @click="removeList(index)" v-if="index > 0">-</a-button>
              </li>
            </ul>
          </div>
        </a-form-model-item>

        <a-form-model-item label="项目预算">
          <a-input
            v-model="tableData.projectBudget"
            style="width: 175px"
            placeholder="项目预算"
            disabled
          ></a-input>
          <a-input v-model="queryFrom.projectBudget" style="width: 175px" placeholder="项目经理"></a-input>
        </a-form-model-item>

        <a-form-model-item label="变更申请备注">
          <a-input v-model="queryFrom.remark" style="width: 350px" placeholder="变更申请备注"></a-input>
        </a-form-model-item>

        <!-- <a-form-model-item label="项目编号">
          <a-input v-model="queryFrom.projectNo" style="width: 350px" placeholder="项目编号"></a-input>
        </a-form-model-item>
        <a-form-model-item label="项目名称">
          <a-input v-model="queryFrom.projectName" style="width: 350px" placeholder="项目名称"></a-input>
        </a-form-model-item>
        
        <a-form-model-item label="项目来源">
          <a-select v-model="queryFrom.projectSource" placeholder="项目来源" style="width: 350px">
            <a-select-option value="0">日常工作包</a-select-option>
            <a-select-option value="1">战略策略</a-select-option>
            <a-select-option value="2">改善策略</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="项目目的">
          <a-input
            v-model="queryFrom.projectPurpose"
            style="width: 350px"
            placeholder="项目目的"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item label="项目时间">
          <a-range-picker
            v-model.trim="timeArr1"
            :allowClear="false"
            format="YYYY-MM-DD"
            valueFormat="YYYY-MM-DD"
          />
        </a-form-model-item>
        <a-form-model-item label="项目预算">
          <a-input v-model="queryFrom.projectBudget" style="width: 350px" placeholder="项目预算"></a-input>
        </a-form-model-item>
        <a-form-model-item label="费用备注">
          <a-input v-model="queryFrom.projectRemark" style="width: 350px" placeholder="费用备注"></a-input>
        </a-form-model-item>

        <a-form-model-item label="是否终止项目">
          <a-radio-group v-model="queryFrom.isTerminate">
            <a-radio :value="true">是</a-radio>
            <a-radio :value="false">否</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="项目类型">
          <a-select v-model="queryFrom.projectType" placeholder="项目类型" style="width: 350px">
            <a-select-option value="0">常规型</a-select-option>
            <a-select-option value="1">战略型</a-select-option>
            <a-select-option value="2">改善型</a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item label="审批人列表">
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
                  placeholder="审批人列表"
                ></a-input>
                <a-button type="primary" style="margin-right: 5px" @click="addList">+</a-button>
                <a-button type="primary" @click="removeList(index)" v-if="index > 0">-</a-button>
              </li>
            </ul>
          </div>
        </a-form-model-item>
        -->
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { changeProductDataList } from "@/services/performance/performanceManagement";
import cloneDeep from "lodash.clonedeep";

export default {
  name: "customerModal",
  props: {},
  data() {
    return {
      title: "标题",
      uservisible: false,
      tableKey: [
        {
          name: "部门",
          key: "department"
        },
        {
          name: "立项人",
          key: "createUserName"
        },
        {
          name: "项目类型",
          key: "projectType"
        },
        {
          name: "项目编号",
          key: "projectNo"
        },
        {
          name: "项目来源",
          key: "projectSource"
        },
        {
          name: "项目名称",
          key: "projectName"
        },
        {
          name: "项目经理",
          key: "projectManager"
        },
        {
          name: "项目目的",
          key: "projectPurpose"
        },
        {
          name: "项目目标",
          key: "projectObjectives"
        },
        {
          name: "起止时间",
          key: ""
        },
        {
          name: "项目预算",
          key: "projectBudget"
        },
        {
          name: "预算己使用金额",
          key: ""
        }
      ],
      tableData: {},
      queryFrom: {},
      timeArr1: [],
      confirmLoading: false,
      projectObjectivesList: [{ value: "" }],
      rules: {
        categoryName: [
          { required: true, message: "请输入类别名称", trigger: "change" }
        ],
        categoryLevel: [
          { required: true, message: "请选择等级", trigger: "change" }
        ],
        categoryType: [
          { required: true, message: "请选择岗位", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    openModules(type, info) {
      this.queryFrom = {};
      this.queryFrom = cloneDeep(info);
      this.tableData = cloneDeep(info);
      console.log(info);
      this.uservisible = true;
      this.projectObjectivesList = this.queryFrom.projectObjectives;
      if (this.projectObjectivesList.length == 0) {
        this.projectObjectivesList = [{ value: "" }];
      }
    },
    addList() {
      this.projectObjectivesList.push({ value: "" });
    },
    removeList(index) {
      this.projectObjectivesList.splice(index, 1);
    },
    // 确定
    handleOk() {
      this.$refs.userRefs.validate(valid => {
        if (valid) {
          this.confirmLoading = true;
          this.changeProductDataList();
        }
      });
    },
    handleCancel() {
      this.uservisible = false;
      this.$refs.userRefs.resetFields();
    },
    //项目变更
    changeProductDataList() {
      this.logDataSource = [];
      let params = {
        ...this.queryFrom,
        kkProjectId: this.queryFrom.id
      };
      const projectObjectives = [];
      this.projectObjectivesList.map(item => {
        projectObjectives.push({
          objective: item.value
        });
      });
      if (this.timeArr1 && this.timeArr1.length > 0) {
        params.startTime = this.timeArr1[0];
        params.endTime = this.timeArr1[1];
      }
      params["projectObjectives"] = projectObjectives;
      changeProductDataList(params)
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
    }
  }
};
</script>

<style lang="less" scoped>
.performanceManagement .ant-form-item {
  margin-bottom: 3px !important;
  width: 48%;
}
.scrapBalanceTable {
  table-layout: fixed !important;
  width: 100%;
  td {
    border: 1px solid #cccccc !important;
    text-align: center;
    padding: 3px;
    font-size: 12px;
  }
}
</style>
