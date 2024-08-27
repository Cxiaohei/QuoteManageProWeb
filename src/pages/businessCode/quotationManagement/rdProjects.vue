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
      <vxe-column field="projectNo"  title="研发项目编号" sort-type="string" sortable></vxe-column>
      <vxe-column field="projectName"  title="研发项目名称" sort-type="string" sortable></vxe-column>
      <vxe-column field="createUserName"  title="项目发起人" sort-type="string" sortable></vxe-column>
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
      <vxe-column field="totalFee"  title="项目总费用" sort-type="number" sortable></vxe-column>
      <vxe-column field="laborCost"  title="总人工费" sort-type="number" sortable></vxe-column>
      <vxe-column field="otherFee"  title="其他费用" sort-type="number" sortable></vxe-column>
      <vxe-column field="productDefinitionsMoney"  title="产品定义费" sort-type="number" sortable></vxe-column>
      <vxe-column field="hardwareMoney"  title="硬件开发费" sort-type="number" sortable></vxe-column>
      <vxe-column field="softwareMoney"  title="软件开发费" sort-type="number" sortable></vxe-column>
      <vxe-column field="structuralMoney"  title="结构开发费" sort-type="number" sortable></vxe-column>
      <vxe-column field="productTestMoney"  title="产品测试费" sort-type="number" sortable></vxe-column>
      <vxe-column field="moldsAndToolingMoney"  title="模具及工装费" sort-type="number" sortable></vxe-column>
      <vxe-column field="authenticationMoney"  title="常规认证费" sort-type="number" sortable></vxe-column>
      <vxe-column field="spicalAuthenticationMoney"  title="特种认证费" sort-type="number" sortable></vxe-column>
      <vxe-column field="otherFeeMoney"  title="其他研发相关费用" sort-type="number" sortable></vxe-column>
    </vxe-table>
    <RdProjectsModal ref="RdProjectsModalRefs" @ok="getPageList"></RdProjectsModal>
    <CalculateProjectsModal ref="CalculateProjectsModalRefs" @ok="getPageList"></CalculateProjectsModal>
    <LogListModal ref="LogListModalRefs"></LogListModal>
  </a-card>
</template>
      
  <script>
import { getPageList } from "@/services/businessCode/quotationManagement/rdProjects";
import { checkPermission } from "@/utils/abp";
import { mapGetters } from "vuex";
import RdProjectsModal from "./modules/RdProjectsModal.vue";
import CalculateProjectsModal from "./modules/CalculateProjectsModal.vue";
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
    title: "研发项目编号",
    dataIndex: "projectNo",
    scopedSlots: {
      customRender: "projectNo"
    }
  },
  {
    title: "研发项目名称",
    dataIndex: "projectName",
    scopedSlots: {
      customRender: "projectName"
    }
  },
  {
    title: "发起人姓名",
    dataIndex: "createUserName",
    scopedSlots: {
      customRender: "createUserName"
    }
  },
  {
    title: "项目总费用",
    dataIndex: "totalFee",
    scopedSlots: {
      customRender: "totalFee"
    }
  },
  {
    title: "人工总费用",
    dataIndex: "laborCost",
    scopedSlots: {
      customRender: "laborCost"
    }
  },
  {
    title: "其他费用",
    dataIndex: "otherFee",
    scopedSlots: {
      customRender: "otherFee"
    }
  }
];
export default {
  components: { RdProjectsModal, CalculateProjectsModal,LogListModal },
  data() {
    return {
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
    checkPermission,
    //新增
    add_pagelist() {
      this.$refs.RdProjectsModalRefs.openModules("add");
    },
    //编辑
    essentialData_edit(record) {
      this.$refs.RdProjectsModalRefs.openModules("edit", record);
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
      const pager = {
        ...this.pagination
      };
      pager.current = pagination.current;
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
      