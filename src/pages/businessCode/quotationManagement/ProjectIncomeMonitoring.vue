<template>
  <a-card>
    <vxe-toolbar ref="xToolbar1" custom>
      <template #buttons>
        <a-form :model="queryFrom" layout="inline">
          <a-form-item>
          <a-space>
            <a-button type="primary" @click="add_pagelist">新增</a-button>
          </a-space>
        </a-form-item>
          <a-form-item>
            <a-input v-model.trim="queryFrom.Filter" style="width: 180px" placeholder="关键字"></a-input>
          </a-form-item>
          <a-form-item label="年份">
            <a-input v-model.trim="queryFrom.year" style="width: 180px" placeholder="输入年份"></a-input>
          </a-form-item>
          <a-form-item>
            <a-space>
              <a-button type="primary" icon="search" @click="search_pagelist">查询</a-button>
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
  :sort-config="{ trigger: 'cell', defaultSort: { field: 'age', order: 'desc' }, orders: ['desc', 'asc', null] }"
  :row-config="rowConfig"
  :custom-config="customConfig"
  :data="dataSource"
  @resizable-change="resizableChangeEvent"
  show-overflow

>
  <vxe-column type="seq" width="60"></vxe-column>
  
  <vxe-column field="action" width="120px" title="操作">
    <template #default="{ row }">
      <!-- <a href="javascript:;" @click="showLog(row)" style="margin-right: 5px;">日志</a> -->
      <a href="javascript:;" @click="essentialData_edit(row)" style="margin-right: 5px;">编辑</a>
    </template>
  </vxe-column>

  <vxe-column field="creationTime" title="发起时间" width="180px" sortable>
    <template #default="{ row }">
      <span>
        {{ row.creationTime ? row.creationTime.substring(0, 19).replace('T', ' ') : '/' }}
      </span>
    </template>
  </vxe-column>
  
  <vxe-column field="customerName" title="客户名称" width="180px" sort-type="string" sortable></vxe-column>
  <vxe-column field="customerAttribute" title="客户属性" width="180px" sort-type="string" sortable></vxe-column>
  <vxe-column field="developmentType" title="研发类型" width="180px" sort-type="string" sortable></vxe-column>
  <vxe-column field="productType" title="产品类型" width="180px" sort-type="string" sortable></vxe-column>
  <vxe-column field="finalScore" title="项目评分" width="120px" sort-type="number" sortable></vxe-column>
  <vxe-column field="developStatus" title="研发状态" width="150px" sort-type="string" sortable></vxe-column>
  
  <vxe-column field="collectDevelopMoney" title="收取研发费（不含模具费）" width="200px" sort-type="string" sortable></vxe-column>
  <vxe-column field="researchDevelopMoney" title="投入研发费" width="180px" sort-type="string" sortable></vxe-column>
  <vxe-column field="totalFee" title="模板报价" width="150px" sort-type="number" sortable></vxe-column>
  <vxe-column field="quotationAccuracy" title="报价准确率" width="160px" sort-type="string" sortable></vxe-column>
  <vxe-column field="expenseProfitLoss" title="研发费盈亏" width="150px" sort-type="number" sortable></vxe-column>
  <vxe-column field="orderStatus" title="订单状态" width="150px" sort-type="string" sortable></vxe-column>
  <vxe-column field="signedContractMoney" title="已签合同订单金额" width="200px" sort-type="string" sortable></vxe-column>
  <vxe-column field="shipmentOrderMoney" title="出货订单金额" width="180px" sort-type="number" sortable></vxe-column>
  <vxe-column field="shippingProfit" title="出货利润" width="150px" sort-type="number" sortable></vxe-column>

  <vxe-column field="financialGrossMargin" title="财务毛利率" width="180px" sort-type="number" sortable></vxe-column>
  <vxe-column field="estimatedGrossProfit" title="预估毛利" width="150px" sort-type="number" sortable></vxe-column>
  <vxe-column field="estimatedProfit" title="预估利润额" width="150px" sort-type="number" sortable></vxe-column>
  <vxe-column field="customerAcquisitionCost" title="获客成本" width="180px" sort-type="number" sortable></vxe-column>
  <vxe-column field="projectProfitLoss" title="项目盈亏" width="150px" sort-type="number" sortable></vxe-column>
  <vxe-column field="unfinishedCause" title="未完成原因" width="180px" sort-type="number" sortable></vxe-column>
  <vxe-column field="projectRisk" title="项目风险" width="180px" sort-type="number" sortable></vxe-column>
  <vxe-column field="salesForecast" title="本年度销售额预测" width="200px" sort-type="number" sortable></vxe-column>
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
    <ProjectIncomeMonitoringModal ref="ProjectIncomeMonitoringModalRefs" @ok="getPageList"></ProjectIncomeMonitoringModal>
    <CalculateProjectsModal ref="CalculateProjectsModalRefs" @ok="getPageList"></CalculateProjectsModal>
    <LogListModal ref="LogListModalRefs"></LogListModal>
  </a-card>
</template>
      
  <script>
import { getPageList,deleteDevProject,reCreateDevProject } from "@/services/businessCode/quotationManagement/rdProjects";
import { checkPermission } from "@/utils/abp";
import { mapGetters } from "vuex";
import ProjectIncomeMonitoringModal from "./modules/ProjectIncomeMonitoringModal.vue";
import CalculateProjectsModal from "./modules/CalculateProjectsModal.vue";
import LogListModal from "./modules/LogListModal.vue";



export default {
  components: { ProjectIncomeMonitoringModal, CalculateProjectsModal,LogListModal },
  data() {
    return {
      selectedRowKeys: [],
      queryFrom: {
        processStepName: ""
      },
      loading: true,
      dataSource: [],
      selectedRows: [],
      pagination: {
        pageSize: 10,
        current: 1,
        showTotal: total => `总计 ${total} 条`
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
      },
    };
  },
  mounted() {},
  created() {
    this.getPageList();
  },
  computed: {
    ...mapGetters("account", ["organizationId"])
  },
  methods: {
    // reCreateDevelopProject(record){
    //   reCreateDevProject(record.id).then(res => {
    //     this.$message.success("重新报价成功");
    //     this.getPageList();
    //   });
    // },
    deleteDevProject(record){
      deleteDevProject(record.id).then(res => {
        this.$message.success("删除成功");
        this.getPageList();
      });
    },
    checkPermission,
    //新增
    add_pagelist() {
      this.$refs.ProjectIncomeMonitoringModalRefs.openModules("add");
    },
    //编辑
    essentialData_edit(record) {
      this.$refs.ProjectIncomeMonitoringModalRefs.openModules("edit", record);
    },
    //详情页
    rdProjectsDetail(record) {
      this.$router.push({
        path: "rdProjectsDetail",
        query: {
          id: record.id
        }
      });
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
    //评分
    calculateProjects(record) {
      this.$refs.CalculateProjectsModalRefs.openModules(record, "add");
    },
    showLog(record) {
      this.$refs.LogListModalRefs.openModules("2", record.id);
    },
    //获取列表数据
    getPageList() {
      const params = {
        skipCount: (this.pagination.current - 1) * this.pagination.pageSize,
        MaxResultCount: this.pagination.pageSize,
        ...this.queryFrom
      };
      getPageList(params)
        .then(res => {
          if (res.code == 1) {
            const pagination = {
              ...this.pagination
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
        .catch(err => {
          this.loading = false;
          console.log(err);
        });
    },
    //切换选中
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
    },
    //页数切换
    handleTableChange(pagination) {
      
      this.pagination.current = pagination;
      
      this.getPageList();
    },
    //重置
    reset_pagelists() {
      this.pagination.current = 1;
      this.queryFrom = {};
      this.getPageList();
    },
    //查询
    search_pagelist() {
      this.pagination.current = 1;
      this.getPageList();
    },
    // 刷新
    user_success() {
      this.getPageList();
    },
    //下拉筛选
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    }
  }
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
      