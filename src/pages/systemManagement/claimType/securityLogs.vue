<template>
  <a-card>
    <div>
      <a-form layout="horizontal">
        <div>
          <a-row>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="开始时间"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-date-picker v-model="queryParam.startTime" :format="dateFormat"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="结束时间"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-date-picker v-model="queryParam.endTime" :format="dateEFormat"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="应用程序"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-input
                  v-model="queryParam.applicationName"
                  placeholder="应用程序"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="标识"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-input
                  v-model="queryParam.identity"
                  placeholder="标识"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="用户名"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-input
                  v-model="queryParam.userName"
                  placeholder="用户名"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="操作"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-input
                  v-model="queryParam.action"
                  placeholder="操作"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="Client"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-input
                  v-model="queryParam.clientId"
                  placeholder="Client"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="correlationId"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-input
                  v-model="queryParam.correlationId"
                  placeholder="correlationId"
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
      <standard-table
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        @change="handleTableChange"
        :pagination="pagination"
        :loading="loading"
      > 
        <span slot="creationTime" slot-scope="{ text }">{{ text | dayjs }}</span>
      </standard-table>
    </div>
  </a-card>
</template>

<script>
import moment from 'moment';
import StandardTable from "@/components/table/StandardTable";
import { getSecurity } from "@/services/claimType/claimType";
import { checkPermission } from "@/utils/abp";
const columns = [
  {
    title: "创建时间",
    dataIndex: "creationTime",
    scopedSlots: { customRender: "creationTime" },
  },
  {
    title: "操作",
    dataIndex: "action",
  },
  {
    title: "IP地址",
    dataIndex: "clientIpAddress",
  },
  {
    title: "浏览器信息",
    dataIndex: "browserInfo",
  },
  {
    title: "应用程序",
    dataIndex: "applicationName",
  },
  {
    title: "标识",
    dataIndex: "identity",
  },
  {
    title: "用户名",
    dataIndex: "userName",
  },
  {
    title: "Client",
    dataIndex: "clientId",
  },
  {
    title: "Correlation",
    dataIndex: "correlationId",
  },
];
let that;
export default {
  name: "claimType",
  components: { StandardTable },
  data() {
    return {
      dateFormat: 'YYYY-MM-DD',
      dateEFormat: 'YYYY-MM-DD',
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
      moment,
    checkPermission,
    handleTableChange(pagination, filters, sorter) {
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      if (sorter.field) this.sorter = sorter;
      this.loadData();
    },
    loadData() {
      this.loading = true;
      if(this.queryParam.startTime) {
        this.queryParam.startTime = moment(this.queryParam.startTime).format('YYYY-MM-DD')
      }
      if(this.queryParam.endTime) {
        this.queryParam.endTime = moment(this.queryParam.endTime).format('YYYY-MM-DD')
      }
      let params = {
        ...this.pagination,
        ...this.queryParam,
        sorter: this.sorter,
      };
      getSecurity(params)
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