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
      <a-form-model-item style="width: 31%" label="是否标准产品">
          <!-- 产品线下拉 -->
          <a-select
            v-model="queryFrom.isStandard"
            style="width: 150px"
            placeholder="是否标准产品"
            allowClear
          >
            <a-select-option :value="true">是</a-select-option>
            <a-select-option :value="false">否</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item style="width: 31%" label="产品线">
          <!-- 产品线下拉 -->
          <a-select
            v-model="queryFrom.productLine"
            style="width: 150px"
            placeholder="产品线"
            allowClear
          >
            <a-select-option
              :value="item.productLineName"
              v-for="(item,index) in ProductLineList"
              :key="index"
            >{{item.productLineName}}</a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item style="width: 31%" label="产品类别">
          <!-- 产品类别 -->
          <a-select
            v-model="queryFrom.productType"
            style="width: 150px"
            placeholder="产品类别"
            allowClear
          >
            <a-select-option
              :value="item.productTypeName"
              v-for="(item,index) in ProductLineListType"
              :key="index"
            >{{item.productTypeName}}</a-select-option>
          </a-select>
        </a-form-model-item>

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
  addProductDataList,
  editProductDataList
} from "@/services/businessCode/category1/productManagement";
import cloneDeep from "lodash.clonedeep";
import {
  getPageListSelect,
  getPageListTypeSelect
} from "@/services/basicsSeting/productXian";

export default {
  name: "customerModal",
  props: {},
  data() {
    return {
      title: "标题",
      uservisible: false,
      queryFrom: {},
      confirmLoading: false,
      ProductLineList: [], //产品线
      ProductLineListType: [], //类别
      queryFromDataList: [
        {
          label: "产品编号",
          key: "productNo"
        },
        {
          label: "产品名称",
          key: "productName"
        },
        // {
        //   label: "产品类别",
        //   key: "productType"
        // },
        {
          label: "9NC",
          key: "nineNC"
        },
        // {
        //   label: "产品线",
        //   key: "productLine"
        // },
        {
          label: "产品硬件平台",
          key: "hardwarePlatform"
        },
        {
          label: "产品软件平台",
          key: "softwarePlatform"
        },
        {
          label: "产品描述",
          key: "description"
        },
        {
          label: "图片",
          key: "productImgUrls"
        },
        {
          label: "操作人姓名",
          key: "operatUserName"
        },
        {
          label: "最后一次报价时间",
          key: "lastQuoteTime"
        },
        {
          label: "标准价格",
          key: "standardPrice"
        },
        {
          label: "成本价",
          key: "costPrice"
        },
        {
          label: "当前报价",
          key: "currentPrice"
        },
        {
          label: "备注",
          key: "remarks"
        }
      ],
      rules: {
        categoryName: [
          { required: true, message: "请输入类别名称", trigger: "change" }
        ],
        categoryLevel: [
          { required: true, message: "请选择等级", trigger: "change" }
        ],
        categoryType: [
          { required: true, message: "请选择岗位", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    openModules(type, info) {
      this.queryFrom = {};
      //产线下拉
      getPageListSelect().then(res => {
        console.log(res);
        this.ProductLineList = res.data;
      });
      //产线下拉
      getPageListTypeSelect().then(res => {
        console.log(res);
        this.ProductLineListType = res.data;
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
            this.addProductDataList();
          } else {
            this.editProductDataList();
          }
        }
      });
    },
    handleCancel() {
      this.uservisible = false;
      this.$refs.userRefs.resetFields();
    },
    //新增基础数据
    addProductDataList() {
      this.logDataSource = [];
      let params = {
        ...this.queryFrom
      };
      addProductDataList(params)
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
    editProductDataList() {
      this.logDataSource = [];
      let params = {
        ...this.queryFrom
      };
      editProductDataList(params)
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
