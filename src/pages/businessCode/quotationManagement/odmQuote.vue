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
    <vxe-table   height="400px"
      border
      resizable
      ref="xTable1"
      id="toolbar_demo5"
      size="large"
      :loading="loading"
      :sort-config="{trigger: 'cell', defaultSort: {field: 'age', order: 'desc'}, orders: ['desc', 'asc', null]}"
      show-overflow
      :row-config="rowConfig"
      :custom-config="customConfig"
      :data="dataSource"
      @resizable-change="resizableChangeEvent"
    >
    <vxe-column type="seq" width="60"></vxe-column>
    <vxe-column field="action" width="100px" title="操作">
        <template #default="{ row }">
          <a
          href="javascript:;"
          @click="odmQuoteDetail(row, 'detail')"
          style="margin-right: 5px;"
        >详情</a>
        <a href="javascript:;" @click="showLog(row)">日志</a>
        </template>
      </vxe-column>
      <vxe-column field="odmQuoteNo"  title="ODM编号" width="180px"  sort-type="string" sortable>
        <template #default="{ row }">
          <a
          href="javascript:;"
          @click="odmQuoteDetail(row, 'detail')"
          style="margin-right: 5px;"
        >  {{
        row.odmQuoteNo
        }}</a>
        </template>
      </vxe-column>
      <vxe-column field="status" title="状态" sort-type="number"  width="180px"  sortable>
        <template #default="{ row }">
          <span v-if="row.status == 0" >草稿</span>
          <span v-if="row.status == 1">已确认</span>
          <span v-if="row.status == 2" style="color: green;">审批中</span>
          <span v-if="row.status == 3" style="color: green;">审批通过</span>
          <span v-if="row.status == 10" style="color: red;">不通过</span>
        </template>
      </vxe-column>
      <vxe-column field="odmQuoteName"  title="ODM名称" width="180px"  sort-type="string" sortable></vxe-column>
      <vxe-column field="projectName"  title="项目名称" width="180px"  sort-type="string" sortable></vxe-column>
      <vxe-column field="customerName"  title="客户名称" width="180px"  sort-type="string" sortable></vxe-column>
      <vxe-column field="productType"  title="产品类型" width="180px"  sort-type="string" sortable></vxe-column>
      <vxe-column field="developmentType"  title="研发类型" width="180px"  sort-type="string" sortable></vxe-column>
      <vxe-column field="totalFee"  title="研发总费用" width="180px"  sort-type="number" sortable></vxe-column>
      <vxe-column field="finalScore"  title="项目评分" width="180px"  sort-type="number" sortable></vxe-column>
      <vxe-column field="electronicMoney"  title="电子料总价" width="180px"  sort-type="number" sortable></vxe-column>
      <vxe-column field="structuralMoney"  title="结构料总价" width="180px"  sort-type="number" sortable></vxe-column>
      <vxe-column  title="BOM总价" width="180px"  sortable>
        <template #default="{ row }">
          <span >
        {{
        row.electronicMoney + row.structuralMoney
        }}
      </span>
        </template>
      </vxe-column>
      <vxe-column field="electronicMoney" width="180px"   title="加工费" sort-type="number" sortable></vxe-column>
      <vxe-column field="structuralMoney"  width="180px"  title="运输费" sort-type="number" sortable></vxe-column>
      <vxe-column field="electronicMoney"  width="180px"  title="管理费" sort-type="number" sortable></vxe-column>
      <vxe-column field="structuralMoney"  width="180px"  title="利润" sort-type="number" sortable></vxe-column>
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
    <OdmQuoteModal ref="OdmQuoteModalRefs" @ok="getPageList"></OdmQuoteModal>
    <LogListModal ref="LogListModalRefs"></LogListModal>
  </a-card>
</template>
      
  <script>
import { getPageList } from "@/services/businessCode/quotationManagement/odmQuote";
import { checkPermission } from "@/utils/abp";
import { mapGetters } from "vuex";
import OdmQuoteModal from "./modules/OdmQuoteModal.vue";
import LogListModal from "./modules/LogListModal.vue";


const columns = [
  {
    width: 100,
    title: "操作",
    scopedSlots: {
      customRender: "action"
    }
  },
  {
    title: "ODM编号",
    dataIndex: "odmQuoteNo",
    scopedSlots: {
      customRender: "odmQuoteNo"
    }
  },
  {
    title: "ODM名称",
    dataIndex: "odmQuoteName",
    scopedSlots: {
      customRender: "odmQuoteName"
    }
  },
  {
    title: "备注",
    dataIndex: "remarks",
    scopedSlots: {
      customRender: "remarks"
    }
  },
  {
    title: "产品名",
    dataIndex: "productName",
    scopedSlots: {
      customRender: "productName"
    }
  },
];
export default {
  components: { OdmQuoteModal,LogListModal },
  data() {
    return {
      selectedRowKeys: [],
      queryFrom: {
        processStepName: ""
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
      loading: true,
      dataSource: [],
      selectedRows: [],
      columns: columns,
      pagination: {
        pageSize: 10,
        current: 1,
        showTotal: total => `总计 ${total} 条`
      }
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
    checkPermission,
    //新增
    add_pagelist() {
      this.$refs.OdmQuoteModalRefs.openModules("add");
    },
    //编辑
    essentialData_edit(record) {
      this.$refs.OdmQuoteModalRefs.openModules("edit", record);
    },
    showLog(record) {
      this.$refs.LogListModalRefs.openModules("3", record.id);
    },
    //详情页
    odmQuoteDetail(record) {
      this.$router.push({
        path: "odmQuoteDetail",
        query: {
          id: record.id
        }
      });
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
    resizableChangeEvent() {
      const columns = this.$refs.xTable1.getColumns();
      const customData = columns.map((column) => {
        return {
          width: column.renderWidth,
        };
      });
      console.log(customData);
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
      