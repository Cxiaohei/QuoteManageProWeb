<template>
  <a-card>
    <div class="queryFromBox">
      <a-form :model="queryFrom" layout="inline">
        <a-form-item>
          <a-space>
            <a-button type="primary" @click="add_pagelist">新增</a-button>
          </a-space>
        </a-form-item>
        <a-form-item>
          <a-input v-model.trim="queryFrom.Filter" style="width: 180px" placeholder="关键字"></a-input>
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button type="primary" icon="search" @click="search_pagelist">查询</a-button>
            <a-button type="primary" @click="reset_pagelists">重置</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </div>
    <a-table
      rowKey="id"
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
      }"
      :columns="columns"
      :dataSource="dataSource"
      @change="handleTableChange"
      :pagination="pagination"
      :loading="loading"
      :selectedRows.sync="selectedRows"
      bordered
    >
      <span slot="action" slot-scope="text, record">
        <a
          href="javascript:;"
          @click="rdProjectsDetail(record, 'detail')"
          style="margin-right: 5px;"
        >详情</a>
        <a href="javascript:;" @click="showLog(record)">日志</a>
      </span>

      <span slot="categoryLevel" slot-scope="text, record">
        {{
        record.categoryLevel == 0
        ? "初级"
        : record.categoryLevel == 1
        ? "中级"
        : record.categoryLevel == 2
        ? "高级"
        : "资深"
        }}
      </span>
      <span
        slot="categoryType"
        slot-scope="text, record"
      >{{ record.categoryType == 0 ? "岗位" : "-" }}</span>
    </a-table>

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
      