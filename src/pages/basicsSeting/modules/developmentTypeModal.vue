<template>
    <div>
      <a-modal
        :width="1180"
        :title="title"
        :visible="uservisible"
        :confirm-loading="confirmLoading"
        @ok="handleOk"
        @cancel="handleCancel"
      >
        <a-form-model
          :model="queryFrom"
          layout="inline"
          :label-col="{ span: 8 }"
          :rules="rules"
          ref="userRefs"
        >
          <a-form-model-item
            style="width: 31%"
            v-for="(item, index) in queryFromDataList"
            :key="index"
            :label="item.label"
          >
            <a-input v-model="queryFrom[item.key]" style="width: 150px" :placeholder="item.label"></a-input>
          </a-form-model-item>
        </a-form-model>
      </a-modal>
    </div>
  </template>
  
  <script>
  import {
    addDevelopmentType,
    editDevelopmentType
  } from "@/services/basicsSeting/developmentType";
  import cloneDeep from "lodash.clonedeep";
  
  export default {
    name: "customerModal",
    props: {},
    data() {
      return {
        title: "标题",
        uservisible: false,
        queryFrom: {},
        confirmLoading: false,
        queryFromDataList: [
          {
            label: "类别名称",
            key: "categoryName"
          },
        ],
        rules: {
          categoryName: [
            { required: true, message: "请输入类别名称", trigger: "change" }
          ]
        }
      };
    },
    methods: {
      openModules(type, info) {
        this.queryFrom = {};
        if (type == "add") {
          this.title = "新增";
        } else {
          this.title = "编辑";
          this.queryFrom = cloneDeep(info);
          this.queryFrom.dataDictionaryId = info.id;
          
        }
        this.uservisible = true;
      },
      // 确定
      handleOk() {
        this.$refs.userRefs.validate(valid => {
          if (valid) {
            this.confirmLoading = true;
            if (this.title == "新增") {
              this.addDevelopment();
            } else {
              this.editDevelopment();
            }
          }
        });
      },
      handleCancel() {
        this.uservisible = false;
        this.$refs.userRefs.resetFields();
      },
      //新增基础数据
      addDevelopment() {
        this.logDataSource = [];
        let params = {
          ...this.queryFrom
        };
        addDevelopmentType(params)
          .then(res => {
            if (res.code == 1) {
              this.$message.success(res.msg);
              this.$emit("ok");
              this.uservisible = false;
            } else {
              this.$message.error(res.msg);
            }
            this.confirmLoading = false;
          })
          .catch(err => {
            this.loading = false;
            this.confirmLoading = false;
          });
      },
      //编辑基础数据
      editDevelopment() {
        this.logDataSource = [];
        let params = {
          ...this.queryFrom
        };
        editDevelopmentType(params)
          .then(res => {
            if (res.code == 1) {
              this.$message.success(res.msg);
              this.$emit("ok");
              this.uservisible = false;
            } else {
              this.$message.error(res.msg);
            }
            this.confirmLoading = false;
          })
          .catch(err => {
            this.loading = false;
            this.confirmLoading = false;
          });
      }
    }
  };
  </script>
  
  <style lang="less" scoped></style>
  