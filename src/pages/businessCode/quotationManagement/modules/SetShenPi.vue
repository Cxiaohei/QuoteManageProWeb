<template>
  <div>
    <a-modal
      :width="600"
      :title="title"
      :visible="uservisible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <!-- {{queryFrom}} -->
      <a-form-model :model="queryFrom" :label-col="{ span: 4 }" :rules="rules" ref="userRefs">
        <a-form-model-item label="类型">
          <a-select  v-model="queryFrom.auditeType" style="width: 450px" placeholder="类型">
            <a-select-option value="0">Oem报价审批</a-select-option>
            <a-select-option value="1">制作费用报价审批</a-select-option>
            <a-select-option value="2">研发费用报价审批</a-select-option>
            <a-select-option value="3">Odm报价审批</a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item label="研发项目">
          <a-input v-model="queryFrom.quoteld" style="width: 450px" placeholder="研发项目"></a-input>
        </a-form-model-item>

        <a-form-model-item label="项目最终评分">
          <a-input v-model="queryFrom.finalScore" style="width: 450px" placeholder="项目最终评分"></a-input>
        </a-form-model-item>

        <a-form-model-item label="提交人">
          <a-input v-model="queryFrom.createUserName" style="width: 450px" placeholder="提交人"></a-input>
        </a-form-model-item>

        <a-form-model-item label="审批人列表">
          <a-input v-model="queryFrom.auditeUserNames" style="width: 450px" placeholder="审批人列表"></a-input>
        </a-form-model-item>

        <a-form-model-item label="备注">
          <a-input v-model="queryFrom.remarks" style="width: 450px" placeholder="备注"></a-input>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import {
  setManufactureFee,
  editManufactureFee,
  getPriceList
} from "@/services/businessCode/quotationManagement/odmQuote";
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
      PriceList: [],
      seachData: [],
      seachPriceData: [], //价格策略
      rules: {
        // categoryName: [
        //   { required: true, message: "请输入类别名称", trigger: "change" }
        // ],
      }
    };
  },
  methods: {
    openModules(type, info) {
      this.queryFrom = {
        haveProductDefinitions: true
      };
      //获取价格策略不分页
      getPriceList().then(res => {
        this.PriceList = res.data;
      });
      // if (type == "add") {
      //   this.title = "新增";
      // } else {
      //   this.title = "编辑";
      //   this.queryFrom = cloneDeep(info);
      // }
      this.uservisible = true;
    },
    // 确定
    handleOk() {
      this.$refs.userRefs.validate(valid => {
        if (valid) {
          this.confirmLoading = true;
          if (this.title == "新增") {
            this.setManufactureFee();
          } else {
            this.editManufactureFee();
          }
        }
      });
    },
    handleCancel() {
      this.uservisible = false;
      this.$refs.userRefs.resetFields();
    },
    //新增基础数据
    setManufactureFee() {
      this.logDataSource = [];
      let params = {
        ...this.queryFrom,
        odmQuoteId: this.$route.query.id
      };
      setManufactureFee(params)
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
    editManufactureFee() {
      this.logDataSource = [];
      let params = {
        ...this.queryFrom
      };
      editManufactureFee(params)
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
