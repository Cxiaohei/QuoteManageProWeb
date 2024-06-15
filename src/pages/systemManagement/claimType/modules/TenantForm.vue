<template>
  <a-modal
    title="新声明类型"
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
        <a-form-model-item label="名" ref="name" prop="name">
          <a-input
            v-model="form.name"
            placeholder="请输入名称"
            @blur="
              () => {
                $refs.name.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item  label="描述" ref="description" prop="description">
          <a-input
            v-model="form.description"
            placeholder="描述"
          />
        </a-form-model-item>
        <a-form-model-item label="正则" ref="regex" prop="regex">
          <a-input
            v-model="form.regex"
            placeholder="请输入正则"
          />
        </a-form-model-item>
        <a-form-model-item label="正则描述" ref="regexDescription" prop="regexDescription">
          <a-input
            v-model="form.regexDescription"
            placeholder="请输入正则描述"
          />
        </a-form-model-item>
        <a-form-model-item label="值类型" ref="valueType" prop="valueType">
            <a-select @change="handleChangeFei">
              <a-select-option value="String">
                String
              </a-select-option>
              <a-select-option value="Int">
                Int
              </a-select-option>
              <a-select-option value="Boolean">
                Boolean
              </a-select-option>
              <a-select-option value="DateTime">
                Int
              </a-select-option>
            </a-select>
        </a-form-model-item>
        <a-form-model-item label="选择" ref="required" prop="required">
           <a-checkbox
              v-decorator="[
              'required',
              {
                valuePropName: 'checked',
                initialValue: false,
              },
            ]" @change="handleChange">
              必要
            </a-checkbox>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { create } from "@/services/claimType/claimType";
export default {
  name: "TenantForm",
  data() {
    return {
      labelCol: { span: 7 },
      wrapperCol: { span: 10 },
      visible: false,
      confirmLoading: false,
      form: {},
      rules: {
        name: [
          { required: true, message: "名称必须填写", trigger: "blur" },
        ],
      },
    };
  },
  created() {
  },
  methods: {
    handleChangeFei(value,) {
        this.form.valueType = value
    },
    handleChange(e) {
      this.form.required  = e.target.checked;
    },
    openModal(model){
      this.visible = true;
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
          let values = this.form;
          create(values)
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