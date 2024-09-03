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

          <a-form-item label="年份">
            <a-input
              v-model.trim="queryFrom.year"
              style="width: 180px"
              placeholder="输入年份"
            ></a-input>
          </a-form-item>
          <a-form-item>
            <a-select v-model="queryFrom.projectType" style="width: 200px;" placeholder="项目类型">
            <a-select-option :value="0">常规型</a-select-option>
            <a-select-option :value="1">战略型</a-select-option>
            <a-select-option :value="3">改善型</a-select-option>
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
      height="400"
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
          <a
            href="javascript:;"
            @click="productData_edit(row)"
            style="margin-right: 5px"
            v-if="row.status == 0"
            >编辑</a
          >

          <a
            href="javascript:;"
            @click="productData_change(row)"
            style="margin-right: 5px"
            v-if="row.status == 1"
            >申请变更</a
          >
          <a-popconfirm
            title="确定删除吗?"
            ok-text="确定"
            cancel-text="取消"
            @confirm="deleteKKProject(row)"
          >
            <a href="#"  v-if="row.status == 0"   style="margin-right: 5px">删除</a>
          </a-popconfirm>
          <a href="javascript:;" @click="productOrder_edit(row, 'detail')"
            >详情</a
          >
        </template>
      </vxe-column>
      <vxe-column field="department" width="150" title="部门" sort-type="string" sortable></vxe-column>
      <vxe-column field="projectNo" width="150" title="项目编号" sort-type="string" sortable></vxe-column>
      <vxe-column field="projectType" width="80" title="项目类型" sort-type="string" sortable>
        <template #default="{ row }">
          <span v-if="row.projectType == 0">常规型</span>
          <span v-if="row.projectType == 1">战略型</span>
          <span v-if="row.projectType == 2">改善型</span>
        </template>
      </vxe-column>
      <vxe-column field="projectName" width="320" title="项目名称" sort-type="string" sortable></vxe-column>
      <vxe-column
        field="createUserName"
        width="150"
        title="立项人"
        sort-type="string"
        sortable
      ></vxe-column>
      <vxe-column
        field="projectManager"
        width="150"
        title="项目经理"
        sort-type="string"
      ></vxe-column>
      <vxe-column field="status" title="项目状态" sort-type="number" sortable width="80">
        <template #default="{ row }">
          <span v-if="row.status == 0">待提交</span>
          <span v-if="row.status == 1">已确认</span>
          <span v-if="row.status == 2">变更审批中</span>
          <span v-if="row.status == 3">项目中止</span>
        </template>
      </vxe-column>
      <vxe-column
        field="projectBudget"
        width="150"
        title="项目预算"
         sort-type="number"
         sortable
      ></vxe-column>

      <vxe-column
        field="budgetMonthAvailableMoney"
        width="200"
        title="月均值"
         sort-type="number"
         sortable
      ></vxe-column>
      <vxe-column
        field="projectBudgetDetail"
        width="200"
        title="预算包含内容"
         sort-type="string"
         sortable
      ></vxe-column>
      <vxe-column field="fixedCharge" width="150" title="固定费用"  sort-type="number" sortable></vxe-column>
      <vxe-column field="manufacturingContainCost" width="150" title="制造费包含金额"  sort-type="number" sortable></vxe-column>
      <vxe-column
        field="projectCycle"
        width="150"
        title="项目周期"
         sort-type="number"
         sortable
      ></vxe-column>
      <vxe-column
        field="startTime"
        width="150"
        title="项目开始时间"
        sortable
      >
      <template #default="{ row }">
          <span >
        {{
        row.startTime
        ? row.startTime.substring(0, 10).replace("T", "  ")
        : "/"
        }}
      </span>
        </template>
    </vxe-column>
      <vxe-column field="endTime" width="150" title="项目终止时间" sortable>
        <template #default="{ row }">
          <span >
        {{
        row.endTime
        ? row.endTime.substring(0, 10).replace("T", "  ")
        : "/"
        }}
      </span>
        </template>
      </vxe-column>
      <vxe-column field="remarks" width="150" title="备注" sortable></vxe-column>
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
      @ok="getPageList"
    ></PerformanceManagementModal>

    <PerformanceChangeModal
      ref="PerformanceChangeModalRefs"
      @ok="getPageList"
    ></PerformanceChangeModal>
  </a-card>
</template>

<script>
import {
  getPageList,
  importExcel,
  downloadTemplate,
  deleteKKProject,
} from "@/services/performance/performanceManagement";
import { checkPermission } from "@/utils/abp";
import { mapGetters } from "vuex";
import PerformanceManagementModal from "./modules/PerformanceManagementModal";
import PerformanceChangeModal from "./modules/PerformanceChangeModal";

export default {
  data() {
    return {
      selectedRowKeys: [],
      queryFrom: {
        processStepName: "",
        year: "",
      },
      timeArr: [],
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
  components: { PerformanceManagementModal, PerformanceChangeModal },
  mounted() {
    this.$nextTick(() => {
      // 手动将表格和工具栏进行关联
      this.$refs.xTable1.connect(this.$refs.xToolbar1);
    });
  },
  created() {
    this.getPageList();
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
    //编辑
    productData_change(record) {
      this.$refs.PerformanceChangeModalRefs.openModules("edit", record);
    },
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
    deleteKKProject(record){
      console.log(record)
      deleteKKProject(record.id).then(res => {
        this.$message.success("删除成功");
        this.getPageList();
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
          this.getPageList();
        } else {
          this.$message.info(response.msg);
        }
      });
    },
    //获取列表数据
    getPageList() {
      const params = {
        skipCount: (this.pagination.current - 1) * this.pagination.pageSize,
        MaxResultCount: this.pagination.pageSize,
        ...this.queryFrom,
      };
      if (this.timeArr && this.timeArr.length > 0) {
        params.startTime = this.timeArr[0];
        params.endTime = this.timeArr[1];
      }
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
      this.getPageList();
    },
    //重置
    reset_pagelists() {
      this.pagination.current = 1;
      this.queryFrom = {};
      this.getPageList();
      this.timeArr = [];
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
