<template>
  <a-card>
    <vxe-toolbar ref="xToolbar1" custom>
      <template #buttons>
        <a-form :model="queryFrom" layout="inline">
          <a-form-item>
            <a-input
              v-model.trim="queryFrom.Filter"
              style="width: 180px"
              placeholder="关键字"
            ></a-input>
          </a-form-item>
          <a-form-item label="年份">
            <a-input
              v-model.trim="queryFrom.year"
              style="width: 180px"
              placeholder="输入年份"
            ></a-input>
          </a-form-item>
          <a-form-item>
            <a-space>
              <a-button type="primary" icon="search" @click="search_pagelist"
                >查询</a-button
              >
              <a-button type="primary" @click="reset_pagelists">重置</a-button>
            </a-space>
          </a-form-item>
        </a-form>
      </template>
    </vxe-toolbar>
    <vxe-table
      border
      resizable
      ref="xTable1"
      id="toolbar_demo5"
      height="650"
      size="large"
      :loading="loading"
      :sort-config="{
        trigger: 'cell',
        defaultSort: { field: 'age', order: 'desc' },
        orders: ['desc', 'asc', null],
      }"
      show-overflow="tooltip"
      :row-config="rowConfig"
      :custom-config="customConfig"
      :data="dataSource"
      @resizable-change="resizableChangeEvent"
    >
      <vxe-column type="seq" width="50"></vxe-column>
      <!-- <vxe-column field="action"  width="80" title="操作">
        <template #default="{ row }">
          <a
            href="javascript:;"
            @click="productData_edit(row)"
            style="margin-right: 5px"
            >编辑</a
          >
          <a
            href="javascript:;"
            @click="productOrder_edit(row, 'detail')"
            style="margin-right: 5px"
            >详情</a
          >
          <a
            href="javascript:;"
            @click="productMoney_edit(row)"
            style="margin-right: 5px"
            >编辑费用</a
          >
        </template>
      </vxe-column>-->
      <vxe-column
        field="department"
        width="80"
        title="部门"
        sort-type="string"
        sortable
      ></vxe-column>
      <vxe-column
        field="createUserName"
        width="100"
        title="立项人"
        sort-type="string"
        sortable
      ></vxe-column>
      <vxe-column
        field="projectType"
        width="120"
        title="项目类型"
        sort-type="string"
        sortable
      >
        <template #default="{ row }">
          <span v-if="row.projectType == 0">常规型</span>
          <span v-if="row.projectType == 1">战略型</span>
          <span v-if="row.projectType == 2">改善型</span>
        </template>
      </vxe-column>
      <vxe-column
        field="projectNo"
        width="120"
        title="项目编号"
        sort-type="string"
        sortable
      ></vxe-column>
      <vxe-column
        field="projectName"
        width="160"
        title="项目名称"
        sort-type="string"
        sortable
      ></vxe-column>
      <vxe-column
        field="projectManager"
        width="120"
        title="项目经理"
        sort-type="string"
        sortable
      ></vxe-column>
      <vxe-column
        field="projectBudget"
        width="120"
        title="项目预算"
        sortable
      ></vxe-column>
      <vxe-column
        field="usedBuget"
        width="120"
        title="已使用金额"
        sort-type="number"
        sortable
      ></vxe-column>
      <vxe-column
        field="budgetMonthAvailableMoney"
        width="120"
        title="月均值"
        sortable
      ></vxe-column>
      <vxe-column
        field="projectBudgetDetail"
        width="140"
        title="预算包含内容"
      ></vxe-column>
      <vxe-column
        field="fixedCharge"
        width="120"
        title="固定费用"
        sortable
      ></vxe-column>
      <vxe-column
        field="manufacturingContainCost"
        width="180"
        title="制造费包含金额"
        sortable
      ></vxe-column>
      <vxe-column field="startMonth" width="80" title="启动时间"></vxe-column>
      <vxe-column field="projectCycle" width="80" title="项目周期"></vxe-column>
      <vxe-column field="timeSchedule" width="200" title="时间进度" sortable>
        <template #default="{ row }">
          <a-progress :percent="Number(row.timeSchedule.toFixed(2)) * 100" />
        </template>
      </vxe-column>
      <vxe-column
        field="costSchedule"
        width="200"
        title="费用使用比例"
        sortable
      >
        <template #default="{ row }">
          <a-progress :percent="Number(row.costSchedule.toFixed(2)) * 100" />
        </template>
      </vxe-column>
      <vxe-column field="differenceRate" width="100" title="差异率" sortable>
        <template #default="{ row }">
          <div
            style="text-align: center"
            :class="{
              'bg-red': row.differenceRate <= 15,
              'bg-yellow': row.differenceRate > 15 && row.differenceRate <= 50,
            }"
          >
            {{ row.differenceRate == 0 ? 0 : row.differenceRate.toFixed(4) }}
          </div>
        </template>
      </vxe-column>
      <vxe-column
        field="balanceMoney"
        width="80"
        title="余额"
        sortable
      ></vxe-column>
      <vxe-column field="balanceRate" width="120" title="余额比例" sortable>
        <template #default="{ row }"
          >{{ (row.balanceRate * 100).toFixed(2) }}%</template
        >
      </vxe-column>
      <vxe-column
        field="manufactureFee"
        width="140"
        title="制造费金额"
        sortable
      ></vxe-column>
      <vxe-column
        field="monthAvailableMoney"
        width="180"
        title="月均可使用金额"
        sortable
      ></vxe-column>
      <vxe-column
        field="kkProjectBudgetDetails"
        width="800"
        title="月度预算使用明细"
      >
        <template #default="{ row }">
          <div style="white-space: nowrap; overflow-x: auto">
            <ul style="padding: 0; display: flex; overflow-x: auto">
              <li
                v-for="(item, index) in row.kkProjectBudgetDetails"
                :key="index"
                style="
                  list-style: none;
                  margin: 0 20px 10px 0;
                  text-align: center;
                "
              >
                <div class="kkProjectBudgetDetailsList">
                  <p>{{ item.budgetMonth.substring(0, 7) }}</p>
                  <div style="margin-bottom: 5px">
                    预算:
                    <a-input
                      placeholder="预算"
                      style="width: 100px"
                      v-model="item.monthCost"
                      v-if="
                        new Date(item.budgetMonth).getMonth() >=
                          new Date().getMonth() &&
                        new Date(item.budgetMonth).getFullYear() >=
                          new Date().getFullYear()
                      "
                    />
                    <a-input
                      placeholder="预算"
                      style="width: 100px"
                      v-model="item.monthCost"
                      disabled
                      v-if="
                        new Date(item.budgetMonth).getMonth() <
                          new Date().getMonth() &&
                        new Date(item.budgetMonth).getFullYear() <=
                          new Date().getFullYear()
                      "
                    />
                  </div>
                  <div style="margin-bottom: 5px">
                    领料:
                    <a-input
                      placeholder="领料"
                      style="width: 100px"
                      v-model="item.getMaterials"
                      v-if="
                        new Date(item.budgetMonth).getMonth() >=
                          new Date().getMonth() &&
                        new Date(item.budgetMonth).getFullYear() >=
                          new Date().getFullYear()
                      "
                    />
                    <a-input
                      placeholder="领料"
                      style="width: 100px"
                      v-model="item.getMaterials"
                      disabled
                      v-if="
                        new Date(item.budgetMonth).getMonth() <
                          new Date().getMonth() &&
                        new Date(item.budgetMonth).getFullYear() <=
                          new Date().getFullYear()
                      "
                    />
                  </div>
                  <div style="margin-bottom: 5px">
                    制造:
                    <a-input
                      placeholder="制造费用"
                      style="width: 100px"
                      v-model="item.manufactureFee"
                      v-if="
                        new Date(item.budgetMonth).getMonth() >=
                          new Date().getMonth() &&
                        new Date(item.budgetMonth).getFullYear() >=
                          new Date().getFullYear()
                      "
                    />
                    <a-input
                      placeholder="制造费用"
                      style="width: 100px"
                      v-model="item.manufactureFee"
                      disabled
                      v-if="
                        new Date(item.budgetMonth).getMonth() <
                          new Date().getMonth() &&
                        new Date(item.budgetMonth).getFullYear() <=
                          new Date().getFullYear()
                      "
                    />
                  </div>
                </div>
                <a-button
                  type="primary"
                  @click="editFyList(item)"
                  style="margin-right: 5px"
                  v-if="
                    new Date(item.budgetMonth).getMonth() >=
                      new Date().getMonth() &&
                    new Date(item.budgetMonth).getFullYear() >=
                      new Date().getFullYear()
                  "
                  >保存</a-button
                >
                <a-button
                  type="primary"
                  @click="changeDisable(item)"
                  style="margin-right: 5px"
                  v-if="
                    new Date(item.budgetMonth).getMonth() <
                      new Date().getMonth() &&
                    new Date(item.budgetMonth).getFullYear() <=
                      new Date().getFullYear()
                  "
                  >编辑</a-button
                >
              </li>
            </ul>
          </div>
        </template>
      </vxe-column>
      <!-- <vxe-column field="remarks" title="备注"></vxe-column> -->
    </vxe-table>
    <div style="margin-top: 10px; display: flex; justify-content: flex-end">
      <a-pagination
        :total="pagination.total"
        :showQuickJumper="pagination.showQuickJumper"
        :current="pagination.current"
        :pageSize="pagination.pageSize"
        :show-total="pagination.showTotal"
        @change="handleTableChange"
      />
    </div>

    <PerformanceManagementModal
      ref="PerformanceManagementModalRefs"
      @ok="getMonitoringPageList"
    ></PerformanceManagementModal>
    <PerMoneyModal
      ref="PerMoneyModalRefs"
      @ok="getMonitoringPageList"
    ></PerMoneyModal>
    <a-modal
      title="编辑月度费用"
      :visible="bugetFromVisible"
      @ok="handleOkbugetFrom"
      @cancel="bugetFromVisible = false"
      width="350px"
    >
      <!-- {{ bugetFrom }} -->
      <div style="margin-bottom: 15px">
        预算使用月份:
        <a-month-picker v-model="bugetFrom.budgetMonth" disabled format="YYYY-MM" valueFormat="YYYY-MM" />
      </div>
      <div style="margin-bottom: 15px">
        预算:
        <a-input placeholder="预算" style="width: 240px" v-model="bugetFrom.monthCost" />
      </div>
      <div >
        领料:
        <a-input placeholder="领料" style="width: 240px" v-model="bugetFrom.getMaterials" />
        <div  style="margin-top: 15px">
          制造:
          <a-input placeholder="制造费用" style="width: 240px" v-model="bugetFrom.manufactureFee" />
        </div>
      </div>
    </a-modal>
  </a-card>
</template>

<script>
import {
  getMonitoringPageList,
  importExcel,
  downloadTemplate,
  editKkFy,
} from "@/services/performance/performanceManagement";
import { checkPermission } from "@/utils/abp";
import { mapGetters } from "vuex";
import PerformanceManagementModal from "./modules/PerformanceManagementModal";
import PerMoneyModal from "./modules/PerMoneyModal";

export default {
  data() {
    return {
      bugetFrom: {
        kkProjectId: "",
        budgetMonth: "",
        monthCost: "",
        getMaterials: "",
        projectBudgetDetailId: "",
      },
      bugetFromVisible: false,
      selectedRowKeys: [],
      queryFrom: {
        processStepName: "",
        year: "",
      },
      loading: true,
      dataSource: [],
      selectedRows: [],
      pagination: {
        pageSize: 10,
        current: 1,
        showTotal: (total) => `总计 ${total} 条`,
      },
      // 表格配置
      customConfig: {
        storage: {
          visible: true,
          resizable: true,
          sort: true,
          fixed: true,
        },
      },
      rowConfig: {
        keyField: "id",
        height: 240,
      },
    };
  },
  components: { PerformanceManagementModal, PerMoneyModal },
  mounted() {},
  created() {
    this.getMonitoringPageList();
  },
  activated() {},
  computed: {
    ...mapGetters("account", ["organizationId"]),
  },
  methods: {
    handleOkbugetFrom() {
      const params = { ...this.bugetFrom };
      editKkFy(params).then((res) => {
        if (res.code == 1) {
          this.$message.success(res.msg);
          this.getMonitoringPageList();
        } else {
          this.$message.error(res.msg);
        }
        this.bugetFromVisible = false;
      });
    },
    checkPermission,
    checkColumnMethod({ column }) {
      if (column.field === "role") {
        return false;
      }
      return true;
    },
    resizableChangeEvent() {
      const columns = this.$refs.xTable1.getColumns();
      const customData = columns.map((column) => {
        return {
          width: column.renderWidth,
        };
      });
      console.log(customData);
    },
    //新增
    add_pagelist() {
      this.$refs.PerformanceManagementModalRefs.openModules("add");
    },
    productMoney_edit(row) {
      this.$refs.PerMoneyModalRefs.openModules(row);
    },
    //编辑
    // productData_edit(record) {
    //   this.$refs.PerformanceManagementModalRefs.openModules("edit", record);
    // },
    productData_edit(record) {
      // this.$refs.PerformanceManagementModalRefs.openModules("edit", record);
      this.$router.push({
        path: "performanceManagementDetail",
        query: {
          id: record.id,
          type: "edit",
        },
      });
    },
    changeDisable(record) {
      this.bugetFrom = {
        kkProjectId: this.kkProjectId,
        budgetMonth: record.budgetMonth.substring(0, 7),
        monthCost: record.monthCost,
        getMaterials: record.getMaterials,
        manufactureFee:record.manufactureFee,
        projectBudgetDetailId: record.id,
      };
      this.bugetFromVisible = true;
    },
    editFyList(record) {
      const params = {
        kkProjectId: this.kkProjectId,
        budgetMonth: record.budgetMonth.substring(0, 7),
        monthCost: record.monthCost,
        getMaterials: record.getMaterials,
        manufactureFee: record.manufactureFee,
        projectBudgetDetailId: record.id,
      };
      editKkFy(params).then((res) => {
        if (res.code == 1) {
          this.$message.success(res.msg);
          this.getMonitoringPageList();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //导入
    importExcel(resData) {
      let formData = new FormData();
      formData.append("ImportFile", resData.file);
      importExcel(formData).then((response) => {
        if (response.code == 1) {
          this.$message.success("导入成功");
          this.getMonitoringPageList();
        } else {
          this.$message.info(response.msg);
        }
      });
    },
    //获取列表数据
    getMonitoringPageList() {
      const params = {
        skipCount: (this.pagination.current - 1) * this.pagination.pageSize,
        MaxResultCount: this.pagination.pageSize,
        ...this.queryFrom,
      };
      getMonitoringPageList(params)
        .then((res) => {
          if (res.code == 1) {
            const pagination = {
              ...this.pagination,
            };
            pagination.total = res.data.totalCount;
            this.pagination = pagination;
            this.dataSource = res.data.items;
            this.dataSource.map((item) => {
              item.sortable = true;
            });
            this.$forceUpdate();

            this.loading = false;
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
    //切换选中
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
    },
    // 编辑
    productOrder_edit(record, type) {
      this.$router.push({
        path: "performanceManagementDetail",
        query: {
          id: record.id,
          type,
        },
      });
    },
    //页数切换
    handleTableChange(pagination) {
      const pager = {
        ...this.pagination,
      };
      pager.current = pagination;
      
      this.getMonitoringPageList();
    },
    //重置
    reset_pagelists() {
      this.pagination.current = 1;
      this.queryFrom = {};
      this.getMonitoringPageList();
    },
    //查询
    search_pagelist() {
      this.pagination.current = 1;
      this.getMonitoringPageList();
    },
    // 刷新
    user_success() {
      this.getMonitoringPageList();
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
::v-deep .bg-red {
  background-color: #dd8c8c;
}
::v-deep .bg-yellow {
  background-color: #eeea7e;
}
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
