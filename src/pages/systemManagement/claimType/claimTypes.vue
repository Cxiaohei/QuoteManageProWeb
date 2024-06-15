<template>
  <a-card>
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal">
        <div :class="advanced ? null : 'fold'">
          <a-row>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="搜索"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-input
                  v-model="queryParam.filter"
                  placeholder="搜索"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </div>
        <span style="float: right; margin-top: 3px">
          <a-button type="primary" @click="refresh">查询</a-button>
          <a-button
            style="margin-left: 8px"
            @click="() => (this.queryParam = {})"
            >重置</a-button
          >
        </span>
      </a-form>
    </div>
    <div>
      <div class="operator">
        <a-button
          v-if="checkPermission('AbpIdentity.ClaimTypes.Create')"
          @click="$refs.createModal.openModal({})"
          type="primary"
          >新建</a-button
        >
      </div>
      <standard-table
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        @change="handleTableChange"
        :pagination="pagination"
        :loading="loading"
      > 
        <span slot="required" slot-scope="{ text }">{{ text==true ? "√" : "×" }}</span>
        <span slot="isStatic" slot-scope="{ text }">{{ text==true ? "√" : "×" }}</span>
        <div slot="action" slot-scope="{ record }">
          <template>
            <a-dropdown>
              <a class="ant-dropdown-link" href="javascript:;">
                操作
                <a-icon type="down" />
              </a>
              <a-menu slot="overlay">
                <a-menu-item v-if="checkPermission('AbpIdentity.ClaimTypes.Delete')">
                  <a-popconfirm
                    title="确定要删除吗？"
                    @confirm="handleDel(record.id)"
                  >
                    <a href="javascript:;">删除</a>
                  </a-popconfirm>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </template>
        </div>
      </standard-table>
    </div>
    <create-form ref="createModal" @ok="handleOk" />
  </a-card>
</template>

<script>
import StandardTable from "@/components/table/StandardTable";
import { getTypes, del } from "@/services/claimType/claimType";
import { checkPermission } from "@/utils/abp";
import CreateForm from "./modules/TenantForm";
const columns = [
  {
    title: "名称",
    dataIndex: "name",
  },
  {
    title: "值类型",
    dataIndex: "valueTypeAsString",
  },
  {
    title: "描述",
    dataIndex: "description",
  },
  {
    title: "正则",
    dataIndex: "regex",
  },
  {
    title: "必要",
    dataIndex: "required",
    scopedSlots: { customRender: "required" },
  },
  {
    title: "是否静态",
    dataIndex: "isStatic",
    scopedSlots: { customRender: "isStatic" },
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
  },
];
let that;
export default {
  name: "claimType",
  components: { StandardTable, CreateForm },
  data() {
    return {
      advanced: true,
      columns: columns,
      dataSource: [],
      selectedRows: [],
      pagination: {
        pageSize: 10,
        current: 1,
        showQuickJumper: true,
        showTotal: (total) => `总计 ${total} 条`,
      },
      sorter: {
        field: "id",
        order: "desc",
      },
      loading: false,
      queryParam: {},
      roles: [],
      organizations: [],
      replaceFields: {
        children: "children",
        title: "displayName",
        key: "id",
        value: "id",
      },
    };
  },
  // authorize: {
  //   deleteRecord: "delete",
  // },
  mounted() {
    that = this;
    this.loadData();
  },
  filters: {
    sexFilter(key) {
      if (!key) {
        return "";
      }
      return sexMap[key].text;
    },
  },
  methods: {
    checkPermission,
    handleDel(id) {
      del(id).then((res) => {
        this.loadData();
        this.$message.info("删除成功");
      });
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    onSelectChange() {
      this.$message.info("选中行改变了");
    },
    handleOk() {
      this.loadData();
    },
    handleTableChange(pagination, filters, sorter) {
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      if (sorter.field) this.sorter = sorter;
      this.loadData();
    },
    loadData() {
      this.loading = true;
      let params = {
        ...this.pagination,
        ...this.queryParam,
        sorter: this.sorter,
      };
      getTypes(params)
        .then((res) => {
          const pagination = { ...this.pagination };
          pagination.total = res.totalCount;
          this.pagination = pagination;
          this.dataSource = res.items;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    refresh() {
      this.pagination.current = 1;
      this.loadData();
    },
  },
};
</script>

<style lang="less" scoped>
.search {
  margin-bottom: 54px;
}
.fold {
  width: calc(100% - 216px);
  display: inline-block;
}
.operator {
  margin-bottom: 18px;
}
@media screen and (max-width: 900px) {
  .fold {
    width: 100%;
  }
}
</style>