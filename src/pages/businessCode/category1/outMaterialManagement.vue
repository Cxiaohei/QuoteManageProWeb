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
      height="600"
      size="small"
      :loading="loading"
      :sort-config="sortConfig"
      show-overflow="tooltip"
      :row-config="rowConfig"
      :custom-config="customConfig"
      :data="dataSource"
      @resizable-change="resizableChangeEvent"
    >
      <vxe-column type="seq" width="60"></vxe-column>
      <vxe-column field="action" title="操作">
        <template #default="{ row }">
          <a
            href="javascript:;"
            @click="edit_record(row)"
            style="margin-right: 5px"
            >编辑</a
          >
          <a href="javascript:;" @click="view_details(row)">详情</a>
        </template>
      </vxe-column>
      <vxe-column field="bomNo" title="物料编号"></vxe-column>
      <vxe-column field="bomName" title="物料名称"></vxe-column>
      <vxe-column field="bomCode" title="物料代码"></vxe-column>
      <vxe-column field="brand" title="品牌"></vxe-column>
      <vxe-column field="specification" title="规格"></vxe-column>
      <vxe-column field="bomModel" title="型号"></vxe-column>
      <vxe-column field="bomCraft" title="物料工艺">
        <template #default="{ row }">
          <span v-if="row.bomCraft === 0">贴片</span>
          <span v-if="row.bomCraft === 5">插件</span>
          <span v-if="row.bomCraft === 10">手工焊</span>
        </template>
      </vxe-column>

      <vxe-column field="dataSource" title="外部物料来源">
        <template #default="{ row }">
          <span v-if="row.dataSource === 0">嘉立创</span>
          <span v-if="row.dataSource === 1">华秋</span>
          <span v-if="row.dataSource === 3">猎芯网</span>
          <span v-if="row.dataSource === 4">圣禾堂</span>
        </template>
      </vxe-column>

      <vxe-column field="bomLegNum" title="物料脚数"></vxe-column>
      <vxe-column field="recentUseBomNum" title="最近一次使用数量"></vxe-column>
      <vxe-column field="currentPrice" title="当前市场价格"></vxe-column>
      <vxe-column field="recentPrice" title="最近一次采购价"></vxe-column>
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

    <OutMaterialManagementModal
      ref="OutMaterialManagementModalRefs"
      @ok="getPageList"
    ></OutMaterialManagementModal>
  </a-card>
</template>

<script>
import { getPageList } from "@/services/businessCode/category1/outMaterialManagement";
import { checkPermission } from "@/utils/abp";
import { mapGetters } from "vuex";
import OutMaterialManagementModal from "./modules/OutMaterialManagementModal";

export default {
  data() {
    return {
      selectedRowKeys: [],
      queryFrom: {
        processStepName: "",
      },
      loading: true,
      dataSource: [],
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
      },
    };
  },
  components: { OutMaterialManagementModal },
  mounted() {
    this.$nextTick(() => {
      // 手动将表格和工具栏进行关联
      this.$refs.xTable1.connect(this.$refs.xToolbar1);
    });
  },
  created() {
    this.getPageList();
  },
  methods: {
    checkPermission,
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
      this.$refs.OutMaterialManagementModalRefs.openModules("add");
    },
    //编辑
    edit_record(record) {
      this.$refs.OutMaterialManagementModalRefs.openModules("edit", record);
    },
    //详情
    view_details(record) {
      this.$router.push({
        path: "outMaterialDetail",
        query: {
          id: record.id,
          type: "view",
        },
      });
    },
    //获取列表数据
    getPageList() {
      const params = {
        skipCount: (this.pagination.current - 1) * this.pagination.pageSize,
        MaxResultCount: this.pagination.pageSize,
        ...this.queryFrom,
      };
      getPageList(params)
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
    //页数切换
    handleTableChange(pagination) {
      const pager = {
        ...this.pagination,
      };
      pager.current = pagination;
      this.pagination = pager;
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
</style>
