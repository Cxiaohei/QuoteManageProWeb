<template>
  <a-card>
    <vxe-toolbar ref="xToolbar1" custom>
      <template #buttons>
        <a-form :model="queryFrom" layout="inline">
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
      height="650"
      size="large"
      :loading="loading"
      :sort-config="{
        trigger: 'cell',
        defaultSort: { field: 'age', order: 'desc' },
        orders: ['desc', 'asc', null],
      }"
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
          v-if="row.status==0"
          @click="productData_edit(row)"
          style="margin-right: 5px;"
        >审核</a>
        </template>
      </vxe-column>
      <vxe-column field="auditeNo" title="审核编号" sort-type="string" sortable>
        <template #default="{ row }">
          <a
            href="javascript:;"
            @click="showEdit(row)"
            style="margin-right: 5px"
          >
            {{ row.auditeNo }}</a
          >
        </template>
      </vxe-column>
      <vxe-column
        field="remarks"
        title="申请备注"
        sort-type="string"
        sortable
      ></vxe-column>
      <vxe-column
        field="currentStepUserName"
        title="当前待审批人"
        sort-type="string"
        sortable
      >
      </vxe-column>
      <vxe-column
        field="auditeRecords"
        title="审批流程"
        sort-type="string"
        sortable
      >
        <template #default="{ row }">
          <div style="overflow: hidden; width: 350px">
            <ul style="padding: 0">
              <li
                style="list-style: none"
                v-for="(item, index) in row.auditeRecords"
                :key="index"
              >
                <span>{{ item.auditeUserName }}：</span>
                <span v-if="item.status == 0" style="color: red">待审核</span>
                <span v-if="item.status == 2" style="color: green">通过</span>
                <span v-if="item.status == 10" style="color: red">不通过</span>
              </li>
            </ul>
          </div>
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
      <vxe-column
        field="createUserName"
        title="申请人"
        sort-type="string"
        sortable
      ></vxe-column>
      <vxe-column field="creationTime" title="申请发起时间" sortable>
        <template #default="{ row }">
          <span>
            {{
              row.creationTime
                ? row.creationTime.substring(0, 19).replace("T", "  ")
                : "/"
            }}
          </span>
        </template>
      </vxe-column>
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

    <a-modal
      title="审批"
      :visible="visibleAudite"
      @ok="handleOkAudite"
      @cancel="visibleAudite = false"
    >
      状态：
      <a-radio-group v-model="statusAudite">
        <!-- <a-radio :value="0">待审核</a-radio> -->
        <a-radio :value="2">通过</a-radio>
        <a-radio :value="10">不通过</a-radio>
      </a-radio-group>
      <br />
      <br />说明：
      <a-input v-model="auditeRemarks" style="width: 80%"></a-input>
    </a-modal>
  </a-card>
</template>
    
<script>
import {
  getPageList,
  checkAudite
} from "@/services/approveManagement/allApprove";
import { checkPermission } from "@/utils/abp";
import { mapGetters } from "vuex";

const columns = [
  {
    width: 140,
    title: "操作",
    scopedSlots: {
      customRender: "action"
    }
  },
  {
    title: "编号",
    dataIndex: "auditeNo",
    scopedSlots: {
      customRender: "auditeNo"
    }
  },
  {
    title: "得分",
    dataIndex: "finalScore",
    scopedSlots: {
      customRender: "finalScore"
    }
  },
  {
    title: "类型",
    dataIndex: "auditeType",
    scopedSlots: {
      customRender: "auditeType"
    }
  },
  {
    title: "审批人",
    dataIndex: "auditeUserNames",
    scopedSlots: {
      customRender: "auditeUserNames"
    }
  },
  // {
  //   title: "状态",
  //   dataIndex: "status",
  //   scopedSlots: {
  //     customRender: "status"
  //   }
  // },
  {
    title: "备注",
    dataIndex: "remarks",
    scopedSlots: {
      customRender: "remarks"
    }
  }
];

export default {
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
      },
      visibleAudite: false,
      auditeId: "",
      statusAudite: 1,
      auditeRemarks: ""
    };
  },
  components: {},
  mounted() {},
  created() {
    this.getPageList();
  },
  activated() {},
  computed: {
    ...mapGetters("account", ["organizationId"])
  },
  methods: {
    resizableChangeEvent() {
      const columns = this.$refs.xTable1.getColumns();
      const customData = columns.map((column) => {
        return {
          width: column.renderWidth,
        };
      });
      console.log(customData);
    },
    checkPermission,
    //审核确认
    handleOkAudite() {
      let params = {
        auditeId: this.auditeId,
        status: this.statusAudite,
        remarks: this.auditeRemarks
      };
      checkAudite(params)
        .then(res => {
          if (res.code == 1) {
            this.$message.success("审核成功");
            this.getPageList();
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(err => {
          this.$message.error(err.message);
        });
      this.visibleAudite = false;
    },
    //编辑
    productData_edit(record) {
      this.auditeId = record.id;
      this.statusAudite = 1;
      this.auditeRemarks = "";
      this.visibleAudite = true;
    },
    //获取列表数据
    getPageList() {
      const params = {
        skipCount: (this.pagination.current - 1) * this.pagination.pageSize,
        MaxResultCount: this.pagination.pageSize,
        AuditeType: 2,
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
            this.$message.error(res.msg);
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
    //查看项目
    lookProduct(record, type) {
      this.$router.push({
        path: "/quotationManagement/rdProjectsDetailLook",
        query: {
          id: record.developProjectId
        }
      });
    },
    // 编辑
    pinbanOrder_edit(record, type) {
      this.$router.push({
        path: "actionFixedAssets",
        query: {
          id: record.id,
          type
        }
      });
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
    