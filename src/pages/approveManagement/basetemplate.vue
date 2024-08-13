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
        <!-- <a
          href="javascript:;"
          v-if="record.status==0"
          @click="productData_edit(record)"
          style="margin-right: 5px;"
        >审核</a>-->
        <a href="javascript:;" @click="lookProduct(record)" style="margin-right: 5px;color:#666">下载</a>
        <!-- <a href="javascript:;" @click="pinbanOrder_edit(record, 'detail')">详情</a>
        <a href="javascript:;" @click="showLog(record)">日志</a>-->
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

    <a-modal
      :title="modalTitle"
      :visible="visibleAudite"
      width="800px"
      @ok="handleOkAudite"
      @cancel="visibleAudite=false"
    >
      类型：
      <a-radio-group v-model="templateFileType" style="width: 600px;">
        <a-radio :value="0">内部物料模板</a-radio>
        <a-radio :value="1">BOM报价单模板</a-radio>
        <a-radio :value="2">ODM报价单模板</a-radio>
        <a-radio :value="3">研发费报价模板</a-radio>
        <a-radio :value="4">管理项目立项模板</a-radio>
        <a-radio :value="5">项目变更申请模板</a-radio>
      </a-radio-group>
      <br />

      <input type="file" @click="handleFileChange" />
      <br />
    </a-modal>
  </a-card>
</template>
    
<script>
import {
  getPageList,
  templateFileAdd,
  downloadTemplate,
} from "@/services/approveManagement/basetemplate";
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
    dataIndex: "templateFileName",
    scopedSlots: {
      customRender: "templateFileName"
    }
  },
  {
    title: "提交人",
    dataIndex: "submitUserName",
    scopedSlots: {
      customRender: "submitUserName"
    }
  },
  {
    title: "状态",
    dataIndex: "templateFileType",
    scopedSlots: {
      customRender: "templateFileType"
    }
  },
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
      headers: {
        authorization: "authorization-text"
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
      scoreApproveId: "",
      statusAudite: 1,
      auditeRemarks: "",
      modalTitle: "新增",
      templateFileType: "",
      templateFileName: "",
      templateFileData: null // 用于存储文件的ArrayBuffer
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
    add_pagelist() {
      this.modalTitle = "新增";
      this.visibleAudite = true;
    },
    // //下载模板
    // downloadTemplate() {
    //   downloadTemplate('ces ');
    // },
    handleFileChange(event) {
      const file = event.target.files[0];
      this.templateFileName = file.name;
      if (!file) {
        console.log("No file selected");
        return;
      }
      this.templateFileData=file;

    },
    //审核确认
    handleOkAudite() {
      // let params = {
      //   templateFileName: this.templateFileName,
      //   templateFileType: this.templateFileType,
      //   templateFileData: this.templateFileData
      // };
      let formData = new FormData();
      formData.append("templateFileData",this.templateFileData);
      formData.append("templateFileType",this.templateFileType);
      if (this.modalTitle == "新增") {
        templateFileAdd(formData)
          .then(res => {
            if (res.code == 1) {
              this.$message.success("审核成功");
              this.getPageList();
              this.visibleAudite = false;
            } else {
              this.$message.error(res.message);
            }
          })
          .catch(err => {
            this.$message.error(err.message);
          });
      }
    },
    //编辑
    productData_edit(record) {
      this.scoreApproveId = record.id;
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
    //查看项目
    lookProduct(record, type) {
      downloadTemplate(record.templateFileBlobName);
      // this.$router.push({
      //   path: "/quotationManagement/rdProjectsDetailLook",
      //   query: {
      //     id: record.developProjectId
      //   }
      // });
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
    