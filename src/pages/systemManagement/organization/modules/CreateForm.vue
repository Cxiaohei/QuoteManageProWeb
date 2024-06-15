<template>
  <a-modal
    title="添加根机构"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="名称" ref="displayName" prop="displayName">
          <a-input
            v-model="form.displayName"
            placeholder="请输入机构名称"
            @blur="
              () => {
                $refs.displayName.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { createOrg } from "@/services/organization/tenant";
export default {
  name: "TenantForm",
  data() {
    return {
      labelCol: { span: 7 },
      wrapperCol: { span: 10 },
      visible: false,
      confirmLoading: false,
      form: {
          parentId: '',
          displayName: ''
      },
      rules: {
        displayName: [
          { required: true, message: "机构名称必须填写", trigger: "blur" },
        ],
      },
    };
  },
  created() {
  },
  methods: {
    openModal(model){
      this.visible = true;
      // this.form = model;
      if(model && model.id){
        this.form.parentId = model.id
      }
    },
    resetForm() {
      this.form = {};
    },
    handleCancel() {
      this.visible = false
      this.currentStep = 0
    },
    handleOk() {
      const form = this.$refs.ruleForm;
      this.confirmLoading = true;
      form.validate((valid) => {
        if (valid) {
          let values = {
            parentId: this.form.parentId,
            displayName: this.form.displayName
          }
          console.log(values)
          createOrg(values)
            .then((res) => {
              this.visible = false;
              form.resetFields();
              this.$message.info("操作成功");
              this.$emit('ok')
            })
            .finally(() => {
              this.confirmLoading = false;
            });
        } else {
          this.confirmLoading = false;
        }
      });
    }
  },
};
</script>

<style scoped>
</style>