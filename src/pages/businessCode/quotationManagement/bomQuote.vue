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
      :sort-config="{trigger: 'cell', defaultSort: {field: 'age', order: 'desc'}, orders: ['desc', 'asc', null]}"
      show-overflow="tooltip"
      :row-config="rowConfig"
      :custom-config="customConfig"
      :data="dataSource"
      @resizable-change="resizableChangeEvent"
    >
    <vxe-column type="seq" width="60"></vxe-column>
    <vxe-column field="action" width="80px" title="操作">
        <template #default="{ row }">
          <a
          href="javascript:;"
          @click="rdProjectsDetail(row, 'detail')"
          style="margin-right: 5px;"
        >详情</a>
        <a href="javascript:;" @click="showLog(row)">日志</a>
        </template>
      </vxe-column>
      <vxe-column field="bomQuoteNo"  title="Bom报价编号" sort-type="string" sortable>
        <template #default="{ row }">
          <a
          href="javascript:;"
          @click="rdProjectsDetail(row, 'detail')"
          style="margin-right: 5px;"
        >  {{
        row.bomQuoteNo
        }}</a>
        </template>
      </vxe-column>
      <vxe-column field="status" title="状态" sort-type="number" sortable>
        <template #default="{ row }">
          <span v-if="row.status == 0">待审核</span>
          <span v-if="row.status == 1">审核中</span>
          <span v-if="row.status == 2">通过</span>
          <span v-if="row.status == 10">不通过</span>
        </template>
      </vxe-column>
      <vxe-column field="createUserName"  title="报价人姓名" sort-type="string" sortable></vxe-column>
      <vxe-column field="bomNum"  title="物料种类数" sort-type="number" sortable></vxe-column>
      <vxe-column field="electronicNum"  title="电子料种类数" sort-type="number" sortable></vxe-column>
      <vxe-column field="electronicMoney"  title="电子料总价" sort-type="number" sortable></vxe-column>
      <vxe-column field="structuralNum"  title="结构料种类数" sort-type="number" sortable></vxe-column>
      <vxe-column field="structuralMoney"  title="结构料总价" sort-type="number" sortable></vxe-column>
      <vxe-column field="productName"  title="报价产品名" sort-type="string" sortable></vxe-column>
      <vxe-column field="creationTime"   title="发起时间" sortable>
        <template #default="{ row }">
          <span >
        {{
        row.creationTime
        ? row.creationTime.substring(0, 19).replace("T", "  ")
        : "/"
        }}
      </span>
        </template>
      </vxe-column>
      <vxe-column field="remarks"  title="备注" sort-type="string" sortable></vxe-column>
     
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
    <BomQuoteModal ref="BomQuoteModalRefs" @ok="getPageList"></BomQuoteModal>
    <LogListModal ref="LogListModalRefs"></LogListModal>
  </a-card>
</template>
      
  <script>
import { getPageList } from "@/services/businessCode/quotationManagement/bomQuote";
import { checkPermission } from "@/utils/abp";
import { mapGetters } from "vuex";
import BomQuoteModal from "./modules/BomQuoteModal.vue";
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
    title: "编号",
    dataIndex: "bomQuoteNo",
    scopedSlots: {
      customRender: "bomQuoteNo"
    }
  },
  {
    title: "数量",
    dataIndex: "bomNum",
    scopedSlots: {
      customRender: "bomNum"
    }
  }
];
export default {
  components: { BomQuoteModal,LogListModal },
  data() {
    return {
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
      selectedRowKeys: [],
      queryFrom: {
        processStepName: ""
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
      this.$refs.BomQuoteModalRefs.openModules("add");
    },
    //编辑
    essentialData_edit(record) {
      this.$refs.BomQuoteModalRefs.openModules("edit", record);
    },
    showLog(record) {
      this.$refs.LogListModalRefs.openModules("0", record.id);
    },
    //详情页
    rdProjectsDetail(record) {
      this.$router.push({
        path: "bomQuoteDetail",
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
      