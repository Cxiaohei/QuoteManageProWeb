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
            <a-select v-model="queryFrom.dataSource" style="width: 200px;" placeholder="物料来源">
            <a-select-option :value="0">ERP</a-select-option>
            <a-select-option :value="1">手动录入</a-select-option>
          </a-select>
          </a-form-item>
          <a-form-item>
            <a-space>
              <a-button type="primary" icon="search" @click="search_pagelist"
                >查询</a-button
              >
              <a-button type="primary" @click="reset_pagelists">重置</a-button>
            </a-space>
          </a-form-item>
          <a-form-item>
            <a-space>
              <a-upload
                name="file"
                :fileList="[]"
                action
                :customRequest="importExcel"
              >
                <a-button type="primary" icon="to-top">导入</a-button>
              </a-upload>
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
      :sort-config="{trigger: 'cell', defaultSort: {field: 'age', order: 'desc'}, orders: ['desc', 'asc', null]}"
      show-overflow="tooltip"
      :row-config="rowConfig"
      :custom-config="customConfig"
      :data="dataSource"
      @resizable-change="resizableChangeEvent"
    >
      <vxe-column type="seq" width="60"></vxe-column>
      <vxe-column field="action" title="操作">
        <template #default="{ row }">
          <a v-if="row.dataSource==1"
            href="javascript:;"
            @click="editBomDetail(row)"
            style="margin-right: 5px"
            >编辑</a
          >
        </template>
      </vxe-column>
      <!-- <vxe-column field="bomNo" title="物料编号" width="150" sort-type="string" sortable></vxe-column> -->
      <vxe-column field="nineNC" title="9NC" width="150" sort-type="string" sortable></vxe-column>
      <!-- <vxe-column field="bomCode" title="物料代码" width="150" sort-type="string" sortable></vxe-column> -->
      <vxe-column field="bomName" title="物料名称" width="200" sort-type="string" sortable></vxe-column>
      <vxe-column field="brand" title="品牌" width="150" sort-type="string" sortable></vxe-column>
      <vxe-column field="specification" title="型号规格" width="150" sort-type="string" sortable></vxe-column>
      <!-- <vxe-column field="bomModel" title="型号" width="150" sort-type="string" sortable></vxe-column> -->
      <vxe-column field="bomCraft" title="物料工艺"  sort-type="string" sortable>
        <template #default="{ row }">
          <span v-if="row.bomCraft === 0">贴片</span>
          <span v-if="row.bomCraft === 5">插件</span>
          <span v-if="row.bomCraft === 10">手工焊</span>
        </template>
      </vxe-column>

      <vxe-column field="bomLegNum" title="物料脚数" width="150"  sort-type="number" sortable></vxe-column>
      <!-- <vxe-column
        field="inventoriesBomNum"
        title="物料库存数"
        width="150"  
        sort-type="number" sortable
      ></vxe-column>
      <vxe-column
        field="usedBomNum"
        title="物料已使用数"
        width="150"
        sort-type="number" sortable
      ></vxe-column>
      <vxe-column
        field="recentUseBomNum"
        title="最近一次使用数量"
        width="200"
        sort-type="number" sortable
      ></vxe-column> -->
      <vxe-column field="maxPrice" title="历史最高价" width="150"  sort-type="number" sortable></vxe-column>
      <vxe-column field="minPrice" title="历史最低价" width="150"  sort-type="number" sortable></vxe-column>
      <vxe-column
        field="recentPrice"
        title="最近一次采购价"
        width="200"
        sort-type="number" sortable
      ></vxe-column>
      <vxe-column field="remarks" title="备注" width="200"   sort-type="string" sortable></vxe-column>
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

    <MaterialManagementModal
      ref="MaterialManagementModalRefs"
      @ok="getPageList"
    ></MaterialManagementModal>
  </a-card>
</template>

<script>
import {
  getPageList,
  importExcel,
  downloadTemplate,
} from "@/services/businessCode/category1/materialManagement";
import MaterialManagementModal from "./modules/MaterialManagementModal";

export default {
  data() {
    return {
      queryFrom: {
        Filter: "",
      },
      loading: true,
      dataSource: [],
      pagination: {
        pageSize: 10,
        current: 1,
        showTotal: (total) => `总计 ${total} 条`,
      },
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
  components: { MaterialManagementModal },
  mounted() {
    this.$nextTick(() => {
      this.$refs.xTable1.connect(this.$refs.xToolbar1);
    });
  },
  created() {
    this.getPageList();
  },
  methods: {
    // 获取列表数据
    getPageList() {
      const params = {
        skipCount: (this.pagination.current - 1) * this.pagination.pageSize,
        maxResultCount: this.pagination.pageSize,
        ...this.queryFrom,
      };
      getPageList(params)
        .then((res) => {
          if (res.code === 1) {
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
          console.error(err);
        });
    },
    // 新增
    add_pagelist() {
      this.$refs.MaterialManagementModalRefs.openModules("add");
    },
    // 编辑
    editBomDetail(record) {
      this.$refs.MaterialManagementModalRefs.openModules("edit", record);
    },
    // 重置
    reset_pagelists() {
      this.pagination.current = 1;
      this.queryFrom = {};
      this.getPageList();
    },
    // 查询
    search_pagelist() {
      this.pagination.current = 1;
      this.getPageList();
    },
    // 表格列变化
    resizableChangeEvent() {
      const columns = this.$refs.xTable1.getColumns();
      const customData = columns.map((column) => ({
        width: column.renderWidth,
      }));
      console.log(customData);
    },
    // 导入
    importExcel(resData) {
      const formData = new FormData();
      formData.append("ImportFile", resData.file);
      importExcel(formData).then((response) => {
        if (response.code === 1) {
          this.$message.success("导入成功");
          this.getPageList();
        } else {
          this.$message.info(response.msg);
        }
      });
    },
    // 分页切换
    handleTableChange(pagination) {
      this.pagination.current = pagination;
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
