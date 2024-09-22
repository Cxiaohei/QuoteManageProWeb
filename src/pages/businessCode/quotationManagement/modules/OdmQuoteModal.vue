<template>
  <div>
    <a-modal
      :width="1200"
      :title="title"
      :visible="uservisible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form-model
        :model="queryFrom"
        layout="inline"
        :rules="rules"
        ref="userRefs"
      >
        <a-row :gutter="16">
          <a-col
            :span="8"
          >
            <a-form-model-item label="报价单名称">
              <!-- 输入框 -->
              <a-input
                v-model="queryFrom.odmQuoteName"
                style="width: 150px"
                placeholder="报价单名称"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <!-- 研发报价单 -->
          <a-col :span="8">
            <a-form-model-item label="研发报价单">
              <a-select
                style="width: 150px"
                v-model="queryFrom.developProjectId"
                :disabled="developProjectIdDisabled"
                placeholder="研发报价单"
                @change="developProjectSelect()"
                allowClear
              >
                <a-select-option
                  :value="item.id"
                  v-for="(item, index) in DevelopProjectList"
                  :key="index"
                  >{{ item.projectName }}</a-select-option
                >
              </a-select>
            </a-form-model-item>
          </a-col>
           <!-- BOM报价单 -->
           <a-col :span="8">
            <a-form-model-item label="BOM报价单">
              <a-select
                style="width: 150px"
                v-model="queryFrom.bomQuoteId"
                :disabled="bomQuoteIdDisabled"
                placeholder="BOM报价单"
                @change="bomQuoteSelect()"
                allowClear
              >
                <a-select-option
                  :value="item.id"
                  v-for="(item, index) in BomQuoteList"
                  :key="index"
                  >{{ item.bomQuoteName }}</a-select-option
                >
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="8"
          >
            <a-form-model-item label="客户名称">
              <!-- 输入框 -->
              <a-input
                v-model="queryFrom.customerName"
                style="width: 150px"
                placeholder="客户名称"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <!-- 产品 -->
          <a-col :span="8">
            <a-form-model-item label="产品">
              <a-select
                style="width: 150px"
                v-model="queryFrom.dsProductsId"
                :disabled="dsProductsIdDisabled"
                placeholder="产品"
                allowClear
              >
                <a-select-option
                  :value="item.id"
                  v-for="(item, index) in ProductList"
                  :key="index"
                  >{{ item.productName }}</a-select-option
                >
              </a-select>
            </a-form-model-item>
          </a-col>
          <!-- 产品类型 -->
          <a-col :span="8">
            <a-form-model-item label="产品类型">
              <a-select
                v-model="queryFrom.productType"
                placeholder="产品类型"
                style="width: 150px"
                allowClear
              >
                <a-select-option
                  :value="item.productTypeName"
                  v-for="(item, index) in ProductTypeList"
                  :key="index"
                  >{{ item.productTypeName }}</a-select-option
                >
              </a-select>
            </a-form-model-item>
          </a-col>

          <!-- 研发类型 -->
          <a-col :span="8">
            <a-form-model-item label="研发类型">
              <a-select
                v-model="queryFrom.developmentType"
                placeholder="研发类型"
                style="width: 150px"
                allowClear
              >
                <a-select-option
                  :value="item.categoryName"
                  v-for="(item, index) in DevelopmentTypeList"
                  :key="index"
                  >{{ item.categoryName }}</a-select-option
                >
              </a-select>
            </a-form-model-item>
          </a-col>

          <!-- 项目周期 -->
          <a-col :span="12">
            <a-form-model-item label="项目周期">
              <a-range-picker
                v-model.trim="timeArr1"
                style="width: 300px"
                :allowClear="false"
                format="YYYY-MM-DD"
              />
            </a-form-model-item>
          </a-col>

                   
        </a-row>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import {
  addOdmDataList
  // editOdmDataList
} from "@/services/businessCode/quotationManagement/odmQuote";
import { getAllProductList,getBomQuoteAllSelect } from "@/services/businessCode/quotationManagement/bomQuote"; 
import { getPageListTypeSelect } from "@/services/basicsSeting/productXian";
import { getDevelopmentTypeListSelect } from "@/services/basicsSeting/developmentType";
import { getAlldevelopProjectList } from "@/services/businessCode/quotationManagement/rdProjects";
import cloneDeep from "lodash.clonedeep";

export default {
  name: "customerModal",
  props: {
    dsProductsId: String,
    developProjectId: String,
    bomQuoteId:String
  },
  data() {
    return {
      title: "标题",
      timeArr1: [],
      DevelopmentTypeList: [], // 研发类型
      ProductTypeList: [], // 产品类型
      uservisible: false,
      developProjectIdDisabled: false,
      dsProductsIdDisabled: false,
      bomQuoteIdDisabled: false,
      queryFrom: {},
      confirmLoading: false,
      ProductList: [],
      DevelopProjectList: [],
      BomQuoteList: [],
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
       //获取产品列表
       getAllProductList().then((res) => {
        this.ProductList = res.data;

        //有产品复默认值
        if (this.dsProductsId) {
          this.queryFrom.dsProductsId = this.dsProductsId;
          this.dsProductsIdDisabled = true;
        }
      });
      //获取研发报价列表
      getAlldevelopProjectList().then((res) => {
        this.DevelopProjectList = res.data;
        //有研发报价单复默认值
        if (this.developProjectId) {
          this.queryFrom.developProjectId = this.developProjectId;
          this.developProjectIdDisabled = true;
        }
      });
            //获取BOM报价列表
            getBomQuoteAllSelect().then((res) => {
        this.BomQuoteList = res.data;
        //有研发报价单复默认值
        if (this.bomQuoteId) {
          this.queryFrom.bomQuoteId = this.bomQuoteId;
          this.bomQuoteIdDisabled = true;
        }
      });
      getPageListTypeSelect().then((res) => {
        this.ProductTypeList = res.data;
      });

      getDevelopmentTypeListSelect().then((res) => {
        this.DevelopmentTypeList = res.data;
      });
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
    developProjectSelect() {
      if (this.queryFrom.developProjectId) {
        var devData = this.DevelopProjectList.filter(
          (x) => x.id == this.queryFrom.developProjectId
        );
        this.queryFrom.productType=devData[0].productType;
        this.queryFrom.developmentType=devData[0].developmentType;
        this.queryFrom.customerName=devData[0].customerName;
        this.timeArr1 = [ this.$moment(devData[0].startTime,"YYYY-MM-DD"),  this.$moment(devData[0].endTime,"YYYY-MM-DD")];
              //获取研发报价列表
      getAlldevelopProjectList().then((res) => {
        this.DevelopProjectList = res.data;
        //有研发报价单复默认值
        if (this.developProjectId) {
          this.queryFrom.developProjectId = this.developProjectId;
          this.developProjectIdDisabled = true;
        }
      });
            //获取BOM报价列表
            getBomQuoteAllSelect(this.developProjectId).then((res) => {
        this.BomQuoteList = res.data;
        //有研发报价单复默认值
        if (this.bomQuoteId) {
          this.queryFrom.bomQuoteId = this.bomQuoteId;
          this.bomQuoteIdDisabled = true;
        }
      });
      }
    },
    bomQuoteSelect() {
      if (this.queryFrom.bomQuoteId&&!this.queryFrom.developProjectId) {
        var devData = this.BomQuoteList.filter(
          (x) => x.id == this.queryFrom.bomQuoteId
        );
        this.queryFrom.productType=devData[0].productType;
        this.queryFrom.developmentType=devData[0].developmentType;
        this.queryFrom.customerName=devData[0].customerName;
        this.timeArr1 = [ this.$moment(devData[0].startTime,"YYYY-MM-DD"),  this.$moment(devData[0].endTime,"YYYY-MM-DD")];
      }
    },
    //新增基础数据
    addOdmDataList() {
      this.logDataSource = [];
      let params = {
        ...this.queryFrom
      };
      if (this.timeArr1 && this.timeArr1.length > 0) {
        params.startTime = this.timeArr1[0];
        params.endTime = this.timeArr1[1];
      }
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
      if (this.timeArr1 && this.timeArr1.length > 0) {
        params.startTime = this.timeArr1[0];
        params.endTime = this.timeArr1[1];
      }
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
