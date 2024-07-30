<template>
  <div>
    <a-modal :width="1100" title="日志" :visible="uservisible" @ok="handleOk" @cancel="handleCancel">
      <a-table
        :columns="columns"
        :data-source="dataList"
        :pagination="pagination"
        @change="handleTableChange"
      >
        <span slot="creationTime" slot-scope="text, record">
          {{
          record.creationTime
          ? record.creationTime.substring(0, 19).replace("T", "/")
          : "/"
          }}
        </span>
      </a-table>
    </a-modal>
  </div>
</template>
  
  <script>
import { getLogList } from "@/services/businessCode/quotationManagement/bomQuote";
import cloneDeep from "lodash.clonedeep";

const columns = [
  {
    title: "内容",
    dataIndex: "content",
    key: "content"
  },
  {
    title: "操作人",
    dataIndex: "operatUserName",
    key: "operatUserName"
  },
  {
    title: "操作时间",
    dataIndex: "creationTime",
    scopedSlots: {
      customRender: "creationTime"
    }
  }
];

export default {
  name: "customerModal",
  props: {},
  data() {
    return {
      title: "标题",
      uservisible: false,
      columns,
      dataList: [],
      pagination: {
        pageSize: 10,
        current: 1,
        showTotal: total => `总计 ${total} 条`
      },
      LogType: "",
      QuoteId: ""
    };
  },
  methods: {
    openModules(LogType, QuoteId) {
      this.LogType = LogType;
      this.QuoteId = QuoteId;
      this.getPageList();
      this.uservisible = true;
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
    getPageList() {
      const params = {
        skipCount: (this.pagination.current - 1) * this.pagination.pageSize,
        MaxResultCount: this.pagination.pageSize,
        LogType: this.LogType,
        QuoteId: this.QuoteId
      };
      //获取日志
      getLogList(params).then(res => {
        const pagination = {
          ...this.pagination
        };
        pagination.total = res.data.totalCount;
        this.pagination = pagination;
        this.dataList = res.data.items;
        this.loading = false;
      });
    },
    // 确定
    handleOk() {
      this.dataList = [];
      this.uservisible = false;
    },
    handleCancel() {
      this.uservisible = false;
      this.dataList = [];
    }
  }
};
</script>
  
  <style lang="less" scoped></style>
  