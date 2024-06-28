<template>
  <div>
    <a-modal
      :width="1100"
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
        <a-form-model-item style="width: 31%" label="报价单名称">
          <a-input v-model="queryFrom.odmQuoteName" style="width: 150px" placeholder="报价单名称"></a-input>
        </a-form-model-item>
        <a-form-model-item style="width: 31%" label="产品">
          <!-- 产品下拉 -->
          <a-select
            v-model="queryFrom.dsProductsId"
            style="width: 150px"
            placeholder="产品"
            allowClear
          >
            <a-select-option
              :value="item.id"
              v-for="(item,index) in ProductList"
              :key="index"
            >{{item.productNo}}</a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item style="width: 31%" label="备注">
          <a-input v-model="queryFrom.remarks" style="width: 150px" placeholder="备注"></a-input>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import {
  addOdmDataList
  // editOdmDataList
} from "@/services/businessCode/quotationManagement/odmQuote";
import { getAllProductList } from "@/services/businessCode/quotationManagement/bomQuote";
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
      ProductList: [],
      rules: {
        // categoryName: [
        //   { required: true, message: "请输入类别名称", trigger: "change" }
        // ],
        // categoryLevel: [
        //   { required: true, message: "请选择等级", trigger: "change" }
        // ],
        // categoryType: [
        //   { required: true, message: "请选择岗位", trigger: "change" }
        // ]
      }
    };
  },
  methods: {
    openModules(type, info) {
      this.queryFrom = {
        haveProductDefinitions: true
      };

      //获取产品列表
      getAllProductList().then(res => {
        this.ProductList = res.data;
      });
      if (type == "add") {
        this.title = "新增";
      } else {
        this.title = "编辑";
        this.queryFrom = cloneDeep(info);
      }
      this.uservisible = true;
    },
    // 确定
    handleOk() {
      this.$refs.userRefs.validate(valid => {
        if (valid) {
          this.confirmLoading = true;
          if (this.title == "新增") {
            this.addOdmDataList();
          } else {
            this.editOdmDataList();
          }
        }
      });
    },
    handleCancel() {
      this.uservisible = false;
      this.$refs.userRefs.resetFields();
    },
    //新增基础数据
    addOdmDataList() {
      this.logDataSource = [];
      let params = {
        ...this.queryFrom
      };
      addOdmDataList(params)
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
    editOdmDataList() {
      this.logDataSource = [];
      let params = {
        ...this.queryFrom
      };
      editOdmDataList(params)
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
