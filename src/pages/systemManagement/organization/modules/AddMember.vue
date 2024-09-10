<template>
  <a-modal
    title="选择用户"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
       <standard-table
          rowKey="id"
          :columns="memberColumns"
          :dataSource="data"
          :selectedRows.sync="selectedRows"
          @change="handleTableChange"
          :pagination="pagination"
          @selectedRowChange='onSelectedRowChange'
        >
        </standard-table>
    </a-spin>
  </a-modal>
</template>

<script>
import StandardTable from "@/components/table/StandardTable";
import { getAddMember,putMember } from "@/services/organization/tenant";
const memberColumns = [
  {
    title: "用户名",
    dataIndex: "userName",
  },
  {
    title: "邮箱地址",
    dataIndex: "email",
  }
];
export default {
  components: { StandardTable },
  name: "TenantForm",
  data() {
    return {
      selectedRows: [],
      pagination: {
        pageSize: 10,
        current: 1,
        showQuickJumper:true,
        showTotal:total => `总计 ${total} 条`
      },
      sorter: {
        field: "id",
        order: "desc",
      },
      labelCol: { span: 7 },
      wrapperCol: { span: 10 },
      visible: false,
      confirmLoading: false,
      form: {
          parentId: '',
          displayName: ''
      },
      data: [],
      memberColumns,
      checkedId: '',
      checkedIds: []
    };
  },
  created() {
  },
  methods: {
    onSelectedRowChange(selectedRowKeys) {
      this.checkedIds = selectedRowKeys
    },
    handleTableChange(pagination, filters, sorter) {
      const pager = { ...this.pagination };
      this.pagination.current = pagination;
      
      // this.sorter = sorter;
      this.getFormData(this.checkedId);
    },
    openModal(model){
      this.visible = true;
      this.selectedRows = []
      if(model){
        this.checkedId = model
        this.getFormData(model);
      }
    },
    resetForm() {
      this.form = {};
    },
    getFormData(id) {
      this.confirmLoading = true;
      let params = {
        ...this.pagination,
        id:id,
        sorter: this.sorter,
      };
      getAddMember(params).then((res) => {
        const pagination = { ...this.pagination };
          pagination.total = res.totalCount;
          this.pagination = pagination;
          this.data = res.items;
      }).finally(()=>{
        this.confirmLoading = false
      });
    },
    handleCancel() {
      this.visible = false
      this.currentStep = 0
    },
    handleOk() {
      // const form = this.$refs.ruleForm;
      
      if(this.checkedIds.length>0) {
        let value = {
          userIds: this.checkedIds
        }
        this.confirmLoading = true;
        putMember(this.checkedId,value)
            .then((res) => {
              this.visible = false;
              this.$message.info("操作成功");
              this.$emit('ok')
            })
            .finally(() => {
              this.confirmLoading = false;
            });
      }else {
        this.handleCancel()
      }
    }
  },
};
</script>

<style scoped>
</style>