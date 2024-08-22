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
  :sort-config="sortConfig"
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
      </vxe-column> -->
      <vxe-column field="department" width="80" title="部门"></vxe-column>
      <vxe-column
        field="createUserName"
        width="80"
        title="立项人"
      ></vxe-column>
      <vxe-column field="projectType" width="80" title="项目类型">
        <template #default="{ row }">
          <span v-if="row.projectType == 0">常规型</span>
          <span v-if="row.projectType == 1">战略型</span>
          <span v-if="row.projectType == 2">改善型</span>
        </template>
      </vxe-column>
      <vxe-column field="projectNo" width="120" title="项目编号"></vxe-column>
      <vxe-column field="projectName" width="160" title="项目名称"></vxe-column>
      <vxe-column
        field="projectManager"
        width="80"
        title="项目经理"
      ></vxe-column>
      <vxe-column
        field="projectBudget"
        width="80"
        title="项目预算"
      ></vxe-column>
      <vxe-column
        field="budgetMonthAvailableMoney"
        width="80"
        title="月均值"
      ></vxe-column>
      <vxe-column
        field="projectBudgetDetail"
        width="80"
        title="预算包含内容"
      ></vxe-column>
      <vxe-column field="fixedCharge" width="80" title="固定费用"></vxe-column>
      <vxe-column
        field="manufacturingContainCost"
        width="80"
        title="制造费包含金额"
      ></vxe-column>
      <vxe-column field="startMonth" width="50" title="启动时间"></vxe-column>
      <vxe-column
        field="projectCycle"
        width="50"
        title="项目周期"
      ></vxe-column>
      <vxe-column field="timeSchedule" width="150" title="时间进度">
        <template #default="{ row }">
          <a-progress :percent="Number(row.timeSchedule.toFixed(3))*100" />
        </template>
      </vxe-column>
      <vxe-column field="costSchedule" width="150" title="费用使用比例">
        <template #default="{ row }">
          <a-progress :percent="Number(row.costSchedule.toFixed(3))*100" />
        </template>
      </vxe-column>
      <vxe-column field="differenceRate" width="80" title="差异率">
        <template #default="{ row }">
          <div
            style="text-align: center"
            :class="{
              'bg-red': row.differenceRate <= 15,
              'bg-yellow': row.differenceRate > 15 && row.differenceRate <= 50,
            }"
          >
            {{ row.differenceRate == 0 ? 0 : row.differenceRate.toFixed(2) }}
          </div>
        </template>
      </vxe-column>
      <vxe-column field="balanceMoney" width="80" title="余额"></vxe-column>
      <vxe-column field="balanceRate" width="80" title="余额比例"></vxe-column>
      <vxe-column
        field="monthAvailableMoney"
        width="80"
        title="月均可使用金额"
      ></vxe-column>
      <vxe-column field="kkProjectBudgetDetails" width="800" title="月度预算使用明细">
  <template #default="{ row }">
    <div style="white-space: nowrap; overflow-x: auto;">
      <ul style="padding: 0; display: flex; overflow-x: auto;">
        <li
          v-for="(item, index) in row.kkProjectBudgetDetails"
          :key="index"
          style="list-style: none; margin: 0 20px 10px 0; text-align: center;"
        >
          <div class="kkProjectBudgetDetailsList">
            <p>{{ item.budgetMonth.substring(0, 7) }}</p>
     <div style="margin-bottom: 5px">
          预算:
          <a-input placeholder="预算" style="width: 100px" v-model="item.monthCost" />
        </div>
        <div  style="margin-bottom: 5px">
          领料:
          <a-input placeholder="领料" style="width: 100px" v-model="item.getMaterials" />
        </div>
        <div  style="margin-bottom: 5px">
          制造:
          <a-input placeholder="制造费用" style="width: 100px" v-model="item.manufactureFee" />
        </div>
          </div>
          <a-button
            type="primary"
            @click="editFyList(item)"
            style="margin-right: 5px"
          >
            保存
          </a-button>
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
  </a-card>
</template>

<script>
import {
  getMonitoringPageList,
  importExcel,
  downloadTemplate,
} from "@/services/performance/performanceManagement";
import { checkPermission } from "@/utils/abp";
import { mapGetters } from "vuex";
import PerformanceManagementModal from "./modules/PerformanceManagementModal";
import PerMoneyModal from "./modules/PerMoneyModal";

export default {
  data() {
    return {
      selectedRowKeys: [],
      queryFrom: {
        processStepName: "",
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
      sortConfig: {
        defaultSort: [],
        multiple: true,
        trigger: "cell",
        remote: true,
      },
      rowConfig: {
        keyField: "id",
        height:240
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
    //下载模板
    downloadTemplate() {
      downloadTemplate();
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
      this.pagination = pager;
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
