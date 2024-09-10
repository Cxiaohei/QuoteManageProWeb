<template>
  <div>
    <a-modal
      width="95%"
      title="申请变更"
      :visible="uservisible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      class="performanceManagement"
    >
      <table class="scrapBalanceTable">
        <tr>
          <td
            v-for="(item, index) in tableKey"
            :key="index"
            :class="{
              'narrow-column': [
                '部门',
                '立项人',
                '项目类型',
                '项目编号',
                '项目来源',
                '项目预算',
                '项目经理',
                '己使用金额',
              ].includes(item.name),
              'wide-column': ['项目目标', '项目目的'].includes(item.name),
            }"
          >
            {{ item.name }}
          </td>
        </tr>
        <tr>
          <td
            v-for="(item, index) in tableKey"
            :key="index"
            :class="{
              'narrow-column': [
                '部门',
                '立项人',
                '项目类型',
                '项目编号',
                '项目来源',
                '项目预算',
                '项目经理',
                '己使用金额',
              ].includes(item.name),
              'wide-column': ['项目目标', '项目目的'].includes(item.name),
            }"
          >
            <p v-if="item.name == '项目类型'">
              {{
                tableData[item.key] == 0
                  ? "常规型"
                  : tableData[item.key] == 1
                  ? "战略型"
                  : "改善型"
              }}
            </p>
            <p v-else-if="item.name == '项目来源'">
              {{
                tableData[item.key] == 0
                  ? "日常工作包"
                  : tableData[item.key] == 1
                  ? "战略型"
                  : "改善策略"
              }}
            </p>
            <p v-else-if="item.name == '项目目标'">
              <span
                v-for="(objective, objIndex) in tableData[item.key]"
                :key="objIndex"
              >
                {{ objective.objective }}
                <br />
              </span>
            </p>
            <p v-else-if="item.name == '起止时间'">
              起:{{
                tableData.startTime ? tableData.startTime.substring(0, 10) : ""
              }}
              <br />
              止:{{
                tableData.endTime ? tableData.endTime.substring(0, 10) : ""
              }}
            </p>
            <p v-else>{{ tableData[item.key] }}</p>
          </td>
        </tr>
      </table>

      <div style="text-align: center; color: red; line-height: 42px">
        申请变更类型：
        <a-select
          v-model="queryFrom.changeType"
          placeholder="变更类型："
          style="width: 350px"
        >
          <a-select-option value="1">项目变更</a-select-option>
          <a-select-option value="3">项目中止</a-select-option>
          <a-select-option value="4">项目结案</a-select-option>
        </a-select>
      </div>

      <a-form-model
        :model="queryFrom"
        layout="inline"
        :label-col="{ span: 6 }"
        :rules="rules"
        ref="userRefs"
      >
        <template v-if="queryFrom.changeType == 1">
          <a-form-model-item label="部门">
            <a-input
              v-model="tableData.department"
              style="width: 250px"
              placeholder="部门"
              disabled
            ></a-input>
            <a-input
              v-model="queryFrom.department"
              style="width: 250px"
              placeholder="部门"
            ></a-input>
          </a-form-model-item>

          <a-form-model-item label="项目时间">
            <a-range-picker
              v-model.trim="timeArr1"
              :allowClear="false"
              format="YYYY-MM-DD"
              style="width: 250px"
              disabled
              valueFormat="YYYY-MM-DD"
            />
            <a-range-picker
              v-model.trim="newtimeArr1"
              :allowClear="false"
              style="width: 250px"
              format="YYYY-MM-DD"
              valueFormat="YYYY-MM-DD"
            />
          </a-form-model-item>
          <a-form-model-item label="立项人">
            <a-input
              v-model="tableData.createUserName"
              style="width: 250px"
              placeholder="立项人"
              disabled
            ></a-input>
            <a-input
              v-model="queryFrom.createUserName"
              style="width: 250px"
              placeholder="立项人"
            ></a-input>
          </a-form-model-item>
          <a-form-model-item label="项目经理">
            <a-input
              v-model="tableData.projectManager"
              style="width: 250px"
              placeholder="项目经理"
              disabled
            ></a-input>
            <a-input
              v-model="queryFrom.projectManager"
              style="width: 250px"
              placeholder="项目经理"
            ></a-input>
          </a-form-model-item>
          <a-form-model-item label="项目目的">
            <a-textarea
              v-model="tableData.projectPurpose"
              style="width: 250px"
              placeholder="项目目的"
              disabled
            ></a-textarea>
            <a-textarea
              v-model="queryFrom.projectPurpose"
              style="width: 250px"
              placeholder="项目目的"
            ></a-textarea>
          </a-form-model-item>
          <a-form-model-item label="项目预算">
            <a-input
              v-model="tableData.projectBudget"
              style="width: 250px"
              placeholder="项目预算"
              disabled
            ></a-input>
          </a-form-model-item>
          <a-form-model-item label="项目目标">
            <div style="overflow: hidden; width: auto; display: flex">
              <!-- 第一列：禁用的输入框，绑定 queryFrom.projectObjectives -->
              <ul style="padding: 0; flex: 1">
                <li
                  style="
                    list-style: none;
                    display: flex;
                    align-items: flex-start;
                    margin-bottom: 8px;
                  "
                  v-for="(item, index) in queryFrom.projectObjectives"
                  :key="`disabled-${index}`"
                >
                  <a-textarea
                    v-model="item.objective"
                    style="width: 250px; margin-right: 5px"
                    placeholder="项目目标"
                    rows="3"
                    disabled
                  ></a-textarea>
                </li>
              </ul>

              <!-- 第二列：非禁用的输入框，绑定 projectObjectivesList -->
              <ul style="padding: 0; flex: 1">
                <li
                  style="
                    list-style: none;
                    display: flex;
                    align-items: flex-start;
                    margin-bottom: 8px;
                  "
                  v-for="(item, index) in projectObjectivesList"
                  :key="`enabled1-${index}`"
                >
                  <a-textarea
                    v-model="item.objective"
                    style="width: 250px; margin-right: 5px"
                    placeholder="项目目标"
                    rows="3"
                  ></a-textarea>
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

          <a-form-model-item label="预算明细">
            <div style="overflow: hidden; width: auto; display: flex">
              <!-- 第一列：禁用的输入框，绑定 queryFrom.projectBugetParts -->
              <ul style="padding: 0; flex: 1">
                <li
                  v-for="(item, index) in queryFrom.projectBugetParts"
                  :key="`disabled-${index}`"
                  style="list-style: none; margin-bottom: 16px"
                >
                  <!-- 交通费 -->
                  <div
                    style="
                      margin-bottom: 8px;
                      display: flex;
                      align-items: center;
                    "
                  >
                    <span
                      style="flex-shrink: 0; text-align: right; width: 100px"
                      >交通费：</span
                    >
                    <a-input
                      v-model="item.trafficMoney"
                      style="width: 150px; margin-left: 5px"
                      placeholder="交通费"
                      disabled
                    ></a-input>
                  </div>

                  <!-- 住宿费 -->
                  <div
                    style="
                      margin-bottom: 8px;
                      display: flex;
                      align-items: center;
                    "
                  >
                    <span
                      style="flex-shrink: 0; text-align: right; width: 100px"
                      >住宿费：</span
                    >
                    <a-input
                      v-model="item.accommodationMoney"
                      style="width: 150px; margin-left: 5px"
                      placeholder="住宿费"
                      disabled
                    ></a-input>
                  </div>

                  <!-- 餐费 -->
                  <div
                    style="
                      margin-bottom: 8px;
                      display: flex;
                      align-items: center;
                    "
                  >
                    <span
                      style="flex-shrink: 0; text-align: right; width: 100px"
                      >餐费：</span
                    >
                    <a-input
                      v-model="item.tableMoney"
                      style="width: 150px; margin-left: 5px"
                      placeholder="餐费"
                      disabled
                    ></a-input>
                  </div>

                  <!-- 业务招待费 -->
                  <div
                    style="
                      margin-bottom: 8px;
                      display: flex;
                      align-items: center;
                    "
                  >
                    <span
                      style="flex-shrink: 0; text-align: right; width: 100px"
                      >业务招待费：</span
                    >
                    <a-input
                      v-model="item.businessHospitalityMoney"
                      style="width: 150px; margin-left: 5px"
                      placeholder="业务招待费"
                      disabled
                    ></a-input>
                  </div>

                  <!-- 邮寄托运费 -->
                  <div
                    style="
                      margin-bottom: 8px;
                      display: flex;
                      align-items: center;
                    "
                  >
                    <span
                      style="flex-shrink: 0; text-align: right; width: 100px"
                      >邮寄托运费：</span
                    >
                    <a-input
                      v-model="item.shipMoney"
                      style="width: 150px; margin-left: 5px"
                      placeholder="邮寄托运费"
                      disabled
                    ></a-input>
                  </div>

                  <!-- 活动现场费 -->
                  <div
                    style="
                      margin-bottom: 8px;
                      display: flex;
                      align-items: center;
                    "
                  >
                    <span
                      style="flex-shrink: 0; text-align: right; width: 100px"
                      >活动现场费：</span
                    >
                    <a-input
                      v-model="item.eventSiteMoney"
                      style="width: 150px; margin-left: 5px"
                      placeholder="活动现场费"
                      disabled
                    ></a-input>
                  </div>

                  <!-- 礼品费 -->
                  <div
                    style="
                      margin-bottom: 8px;
                      display: flex;
                      align-items: center;
                    "
                  >
                    <span
                      style="flex-shrink: 0; text-align: right; width: 100px"
                      >礼品费：</span
                    >
                    <a-input
                      v-model="item.giftMoney"
                      style="width: 150px; margin-left: 5px"
                      placeholder="礼品费"
                      disabled
                    ></a-input>
                  </div>

                  <!-- 其他费用 -->
                  <div
                    style="
                      margin-bottom: 8px;
                      display: flex;
                      align-items: center;
                    "
                  >
                    <span
                      style="flex-shrink: 0; text-align: right; width: 100px"
                      >其他费用：</span
                    >
                    <a-input
                      v-model="item.otherMoney"
                      style="width: 150px; margin-left: 5px"
                      placeholder="其他费用"
                      disabled
                    ></a-input>
                  </div>

                  <!-- 总预算 -->
                  <div
                    style="
                      margin-bottom: 8px;
                      display: flex;
                      align-items: center;
                    "
                  >
                    <span
                      style="flex-shrink: 0; text-align: right; width: 100px"
                      >总预算：</span
                    >
                    <a-input
                      v-model="item.totalMoney"
                      style="width: 150px; margin-left: 5px"
                      placeholder="总预算"
                      disabled
                    ></a-input>
                  </div>

                  <!-- 其他费用说明 -->
                  <div
                    style="
                      margin-bottom: 8px;
                      display: flex;
                      align-items: center;
                    "
                  >
                    <span
                      style="flex-shrink: 0; text-align: right; width: 100px"
                      >其他费用说明：</span
                    >
                    <a-textarea
                      v-model="item.otherMoneyReamrk"
                      style="width: 150px; margin-left: 5px"
                      placeholder="其他费用说明"
                      disabled
                    ></a-textarea>
                  </div>
                </li>
              </ul>

              <!-- 第二列：非禁用的输入框，绑定 newprojectBugetParts -->
              <ul style="padding: 0; flex: 1">
                <li
                  v-for="(item, index) in newprojectBugetParts"
                  :key="`enabled-${index}`"
                  style="list-style: none; margin-bottom: 16px"
                >
                  <!-- 交通费 -->
                  <div
                    style="
                      margin-bottom: 8px;
                      display: flex;
                      align-items: center;
                    "
                  >
                    <span
                      style="flex-shrink: 0; text-align: right; width: 100px"
                      >交通费：</span
                    >
                    <a-input
                      v-model="item.trafficMoney"
                      style="width: 150px; margin-left: 5px"
                      placeholder="交通费"
                    ></a-input>
                  </div>

                  <!-- 住宿费 -->
                  <div
                    style="
                      margin-bottom: 8px;
                      display: flex;
                      align-items: center;
                    "
                  >
                    <span
                      style="flex-shrink: 0; text-align: right; width: 100px"
                      >住宿费：</span
                    >
                    <a-input
                      v-model="item.accommodationMoney"
                      style="width: 150px; margin-left: 5px"
                      placeholder="住宿费"
                    ></a-input>
                  </div>

                  <!-- 餐费 -->
                  <div
                    style="
                      margin-bottom: 8px;
                      display: flex;
                      align-items: center;
                    "
                  >
                    <span
                      style="flex-shrink: 0; text-align: right; width: 100px"
                      >餐费：</span
                    >
                    <a-input
                      v-model="item.tableMoney"
                      style="width: 150px; margin-left: 5px"
                      placeholder="餐费"
                    ></a-input>
                  </div>

                  <!-- 业务招待费 -->
                  <div
                    style="
                      margin-bottom: 8px;
                      display: flex;
                      align-items: center;
                    "
                  >
                    <span
                      style="flex-shrink: 0; text-align: right; width: 100px"
                      >业务招待费：</span
                    >
                    <a-input
                      v-model="item.businessHospitalityMoney"
                      style="width: 150px; margin-left: 5px"
                      placeholder="业务招待费"
                    ></a-input>
                  </div>

                  <!-- 邮寄托运费 -->
                  <div
                    style="
                      margin-bottom: 8px;
                      display: flex;
                      align-items: center;
                    "
                  >
                    <span
                      style="flex-shrink: 0; text-align: right; width: 100px"
                      >邮寄托运费：</span
                    >
                    <a-input
                      v-model="item.shipMoney"
                      style="width: 150px; margin-left: 5px"
                      placeholder="邮寄托运费"
                    ></a-input>
                  </div>

                  <!-- 活动现场费 -->
                  <div
                    style="
                      margin-bottom: 8px;
                      display: flex;
                      align-items: center;
                    "
                  >
                    <span
                      style="flex-shrink: 0; text-align: right; width: 100px"
                      >活动现场费：</span
                    >
                    <a-input
                      v-model="item.eventSiteMoney"
                      style="width: 150px; margin-left: 5px"
                      placeholder="活动现场费"
                    ></a-input>
                  </div>

                  <!-- 礼品费 -->
                  <div
                    style="
                      margin-bottom: 8px;
                      display: flex;
                      align-items: center;
                    "
                  >
                    <span
                      style="flex-shrink: 0; text-align: right; width: 100px"
                      >礼品费：</span
                    >
                    <a-input
                      v-model="item.giftMoney"
                      style="width: 150px; margin-left: 5px"
                      placeholder="礼品费"
                    ></a-input>
                  </div>

                  <!-- 其他费用 -->
                  <div
                    style="
                      margin-bottom: 8px;
                      display: flex;
                      align-items: center;
                    "
                  >
                    <span
                      style="flex-shrink: 0; text-align: right; width: 100px"
                      >其他费用：</span
                    >
                    <a-input
                      v-model="item.otherMoney"
                      style="width: 150px; margin-left: 5px"
                      placeholder="其他费用"
                    ></a-input>
                  </div>

                  <!-- 总预算 -->
                  <div
                    style="
                      margin-bottom: 8px;
                      display: flex;
                      align-items: center;
                    "
                  >
                    <span
                      style="flex-shrink: 0; text-align: right; width: 100px"
                      >总预算：</span
                    >
                    <a-input
                      v-model="item.totalMoney"
                      style="width: 150px; margin-left: 5px"
                      placeholder="总预算"
                    ></a-input>
                  </div>

                  <!-- 其他费用说明 -->
                  <div
                    style="
                      margin-bottom: 8px;
                      display: flex;
                      align-items: center;
                    "
                  >
                    <span
                      style="flex-shrink: 0; text-align: right; width: 100px"
                      >其他费用说明：</span
                    >
                    <a-textarea
                      v-model="item.otherMoneyReamrk"
                      style="width: 150px; margin-left: 5px"
                      placeholder="其他费用说明"
                    ></a-textarea>
                  </div>
                </li>
              </ul>
            </div>
          </a-form-model-item>
        </template>

        <a-form-model-item label="审批人"  v-if="queryFrom.changeType">
          <div style="overflow: hidden; width: auto; display: flex">
            <ul style="padding: 0; flex: 1">
              <li
                style="
                  list-style: none;
                  display: flex;
                  align-items: flex-start;
                  margin-bottom: 8px;
                "
                v-for="(
                  auditeUserNamesListItem, auditeUserNamesListindex
                ) in auditeUserNamesList"
                :key="auditeUserNamesListindex"
              >
                <a-input
                  v-model="auditeUserNamesListItem.value"
                  style="width: 250px; margin-right: 5px"
                  placeholder="审批人"
                ></a-input>
                <a-button
                  type="primary"
                  style="margin-right: 5px"
                  @click="addUserNamesList"
                  >+</a-button
                >
                <a-button
                  type="primary"
                  @click="removeUserNamesList(auditeUserNamesListindex)"
                  v-if="auditeUserNamesListindex > 0"
                  >-</a-button
                >
              </li>
            </ul>
          </div>
        </a-form-model-item>

        <a-form-model-item label="变更申请备注"  v-if="queryFrom.changeType">
          <a-textarea
            v-model="queryFrom.remark"
            style="width: 550px"
            placeholder="变更申请备注"
          ></a-textarea>
        </a-form-model-item>
        <a-form-model-item label="上传报告" v-if="queryFrom.changeType&&queryFrom.changeType != 1">
          <input type="file" @change="handleFileChange" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import {
  changeProductDataList,
  changeProductTerminated,
} from "@/services/performance/performanceManagement";
import cloneDeep from "lodash.clonedeep";

export default {
  name: "customerModal",
  props: {},
  data() {
    return {
      projectReportFile: null,
      projectReportFileName: "",
      title: "标题",
      uservisible: false,
      tableKey: [
        {
          name: "部门",
          key: "department",
        },
        {
          name: "立项人",
          key: "createUserName",
        },
        {
          name: "项目类型",
          key: "projectType",
        },
        {
          name: "项目编号",
          key: "projectNo",
        },
        {
          name: "项目来源",
          key: "projectSource",
        },
        {
          name: "项目名称",
          key: "projectName",
        },
        {
          name: "项目经理",
          key: "projectManager",
        },
        {
          name: "项目目的",
          key: "projectPurpose",
        },
        {
          name: "项目目标",
          key: "projectObjectives",
        },
        {
          name: "起止时间",
          key: "",
        },
        {
          name: "项目预算",
          key: "projectBudget",
        },
        {
          name: "己使用金额",
          key: "usedBuget",
        },
      ],
      tableData: {},
      queryFrom: {},
      timeArr1: [],
      newtimeArr1: [],
      auditeUserNamesList: [{ value: "" }],
      confirmLoading: false,
      projectObjectivesList: [{ value: "" }],
      newprojectBugetParts: [],
      rules: {
        categoryName: [
          { required: true, message: "请输入类别名称", trigger: "change" },
        ],
        categoryLevel: [
          { required: true, message: "请选择等级", trigger: "change" },
        ],
        categoryType: [
          { required: true, message: "请选择岗位", trigger: "change" },
        ],
      },
    };
  },
  computed: {
    // 计算 totalMoney 的值
    totalMoney() {
      return this.newprojectBugetParts.map((item) => {
        // 计算所有费用的总和
        return (
          Number(item.trafficMoney) +
          Number(item.accommodationMoney) +
          Number(item.tableMoney) +
          Number(item.businessHospitalityMoney) +
          Number(item.shipMoney) +
          Number(item.eventSiteMoney) +
          Number(item.giftMoney) +
          Number(item.otherMoney)
        );
      });
    },
  },
  watch: {
    // 监听 newprojectBugetParts 中的数据变化
    newprojectBugetParts: {
      handler(newParts) {
        newParts.forEach((item) => {
          // 更新每个项的 totalMoney
          item.totalMoney = this.totalMoney;
        });
      },
      deep: true,
    },
  },
  methods: {
    handleFileChange(event) {
      const file = event.target.files[0];
      this.projectReportFileName = file.name;
      if (!file) {
        console.log("No file selected");
        return;
      }
      this.projectReportFile = file;
    },
    openModules(type, info) {
      this.queryFrom = {};
      this.queryFrom = cloneDeep(info);
      this.tableData = cloneDeep(info);
      this.uservisible = true;
      this.projectObjectivesList = this.queryFrom.projectObjectives;
      this.newprojectBugetParts = this.queryFrom.projectBugetParts;
      this.timeArr1 = [this.queryFrom.startTime, this.queryFrom.endTime];
      this.newtimeArr1 = [this.queryFrom.startTime, this.queryFrom.endTime];
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
    addUserNamesList() {
      this.auditeUserNamesList.push({ value: "" });
    },
    removeUserNamesList(index) {
      this.auditeUserNamesList.splice(index, 1);
    },

    // 确定
    handleOk() {
      this.confirmLoading = true;
      this.changeProductDataList();
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
        kkProjectId: this.queryFrom.id,
        ProjectReportFile: null,
      };
      const projectObjectives = [];
      this.projectObjectivesList.map((item) => {
        projectObjectives.push({
          objective: item.value,
        });
      });
      const auditeUserNames = [];
      this.auditeUserNamesList.map((item) => {
        auditeUserNames.push(item.value);
      });

      if (this.newtimeArr1 && this.newtimeArr1.length > 0) {
        params.startTime = this.newtimeArr1[0];
        params.endTime = this.newtimeArr1[1];
      }
      params["projectObjectives"] = this.queryFrom.projectObjectives;
      params["auditeUserNames"] = auditeUserNames;
      params["kKProjectBugetPart"] = this.newprojectBugetParts[0];
      if(this.queryFrom.changeType==1)
      {
        changeProductDataList(params)
        .then((res) => {
          if (res.code == 1) {
            this.$message.success(res.msg);
                  this.$emit("ok");
                  this.uservisible = false;
                  this.confirmLoading = false;
          } else {
            this.$message.error(res.msg);
          }
          this.confirmLoading = false;
        })
        .catch((err) => {
          this.loading = false;
          this.confirmLoading = false;
        });
      }
      else
      {
        if(!this.projectReportFile)
      {
        this.$message.error('必须选择上传结案报告');
        return;
      }
        let formData = new FormData();
            
            formData.append("kkProjectId", this.queryFrom.id);
            formData.append("remark", this.queryFrom.remark);
            formData.append("changeType", this.queryFrom.changeType);
            formData.append("auditeUserNames", auditeUserNames);
            formData.append("ProjectReportFile", this.projectReportFile);
            changeProductTerminated(formData)
        .then((res) => {
          if (res.code == 1) {
            this.$message.success(res.msg);
                  this.$emit("ok");
                  this.uservisible = false;
                  this.confirmLoading = false;
          } else {
            this.$message.error(res.msg);
          }
          this.confirmLoading = false;
        })
        .catch((err) => {
          this.loading = false;
          this.confirmLoading = false;
        });
      }
     
    },
  },
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

.scrapBalanceTable td,
.scrapBalanceTable th {
  border: 1px solid #ddd;
  padding: 8px;
}

.scrapBalanceTable td {
  text-align: left;
}

.scrapBalanceTable .narrow-column {
  width: 90px;
}

.scrapBalanceTable .wide-column {
  width: 300px; /* 根据需要调整宽度 */
}
</style>
