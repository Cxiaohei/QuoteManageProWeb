<template>
  <a-modal
    :title="model.id ? '修改数据类型' : '新增数据类型'"
    :width="800"
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
        <a-form-model-item label="所属类型" prop="code">
          <a-input
            v-model="form.code"
          />
        </a-form-model-item>
        <a-form-model-item label="显示名称" prop="code">
          <a-input
            v-model="form.code"
          />
        </a-form-model-item>
        <a-form-model-item label="数据类型代码" prop="code">
          <a-input
            v-model="form.code"
          />
        </a-form-model-item>
        <a-form-model-item label="备注" prop="code">
          <a-textarea
            v-model="form.code"
          />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
export default {
  data() {
    return {
      labelCol: { span: 7 },
      wrapperCol: { span: 10 },
      visible: false,
      confirmLoading: false,
      form: {},
      model: '',
      rules: {
        // name: [{ required: true, message: "内置名称必须填写", trigger: "blur" }],
        // displayName: [{ required: true, message: "展示名称必须填写", trigger: "blur" }],
        // openAppIdOrName: [{ required: true, message: "开放平台 AppId (或名称)必须填写", trigger: "blur" }],
        // appId: [{ required: true, message: "AppId必须填写", trigger: "blur" }],
      },
    };
  },
  created() {

  },
  methods: {
    openModal(model){
      this.visible = true;
      this.model = model
      console.log(model)
      if(model && model.id){
        this.form.code = model.title
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
      // this.confirmLoading = true;
      this.visible = false;
      // form.validate((valid) => {
      //   if (valid) {
      //     let values = this.form;
      //     values.items = this.$refs.dataDictionaryItem.getDataList();
      //     createOrUpdate(values)
      //       .then((res) => {
      //         this.visible = false;
      //         form.resetFields();
      //         this.$message.info("操作成功");
      //         this.$emit('ok')
      //       })
      //       .finally(() => {
      //         this.confirmLoading = false;
      //       });
      //   } else {
      //     this.confirmLoading = false;
      //   }
      // });
    }
  },
  
};
</script>

