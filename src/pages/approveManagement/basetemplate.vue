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
        <a href="javascript:;" @click="productData_edit(record)" style="margin-right: 5px;">编辑</a>
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
      <br />说明：
      <input type="file" @change="handleFileChange" />
    </a-modal>
  </a-card>
</template>
    
<script>
import {
  getPageList,
  templateFileAdd,
  templateFileEdit,
  downloadTemplate
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
    title: "名称",
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
  }
  // {
  //   title: "状态",
  //   dataIndex: "status",
  //   scopedSlots: {
  //     customRender: "status"
  //   }
  // },
  // {
  //   title: "备注",
  //   dataIndex: "remarks",
  //   scopedSlots: {
  //     customRender: "remarks"
  //   }
  // }
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
      templateFileId: "",
      templateFileType: 0,
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
      this.templateFileData = null;
      this.visibleAudite = true;
    },
    handleFileChange(event) {
      const file = event.target.files[0];
      this.templateFileName = file.name;
      if (!file) {
        console.log("No file selected");
        return;
      }
      this.templateFileData = file;
    },
    //确认
    handleOkAudite() {
      let formData = new FormData();
      formData.append("templateFileData", this.templateFileData);
      formData.append("templateFileType", this.templateFileType);
      if (this.modalTitle == "新增") {
        templateFileAdd(formData)
          .then(res => {
            if (res.code == 1) {
              this.$message.success("上传模板成功");
              this.getPageList();
              this.visibleAudite = false;
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch(err => {

          });
      } else {
        templateFileEdit(formData,this.templateFileId)
          .then(res => {
            if (res.code == 1) {
              this.$message.success("更新模板成功");
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
      this.modalTitle = "编辑";
      this.templateFileData = null;
      this.templateFileType = record.templateFileType;
      this.templateFileId = record.id;
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
      downloadTemplate(record);

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
    