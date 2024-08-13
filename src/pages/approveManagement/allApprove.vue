<template>
  <a-card>
    <div class="queryFromBox">
      <a-form :model="queryFrom" layout="inline">
        <!-- <a-form-item>
          <a-space>
            <a-button type="primary" @click="add_pagelist">新增</a-button>
          </a-space>
        </a-form-item>-->
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
          v-if="record.status==0"
          @click="productData_edit(record)"
          style="margin-right: 5px;"
        >审核</a>
        <!-- <a
          href="javascript:;"
          @click="lookProduct(record)"
          style="margin-right: 5px;color:#666"
        >查看项目</a> -->
        <!-- <a href="javascript:;" @click="pinbanOrder_edit(record, 'detail')">详情</a>
        <a href="javascript:;" @click="showLog(record)">日志</a>-->
      </span>

      <span slot="auditeType" slot-scope="text, record">
        {{
        record.auditeType == 0 ?"Oem报价审批":
        record.auditeType == 1 ?"制作费用报价审批":
        record.auditeType == 2 ?"研发费用报价审批":"Odm报价审批"
        }}
      </span>
      <span slot="auditeUserNames" slot-scope="text, record">
        {{
        record.auditeUserNames.join(",")
        }}
      </span>

      <span slot="status" slot-scope="text, record">
        {{
        record.status == 0 ?"待审核":
        record.status == 1 ?"通过":
        "不通过"
        }}
      </span>
      <span slot="creationTime" slot-scope="text, record">
        {{
        record.creationTime?record.creationTime.substring(0,19).replace('T','/'):"/"
        }}
      </span>
    </a-table>

    <a-modal title="审批" :visible="visibleAudite" @ok="handleOkAudite" @cancel="visibleAudite=false">
      状态：
      <a-radio-group v-model="statusAudite">
        <!-- <a-radio :value="0">待审核</a-radio> -->
        <a-radio :value="1">通过</a-radio>
        <a-radio :value="10">不通过</a-radio>
      </a-radio-group>
      <br />
      <br />说明：
      <a-input v-model="auditeRemarks" style="width: 80%;"></a-input>
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
    