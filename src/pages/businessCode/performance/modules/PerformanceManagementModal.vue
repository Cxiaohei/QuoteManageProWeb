<template>
  <div>
    <a-modal
      :width="580"
      :title="title"
      :visible="uservisible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form-model :model="queryFrom" :label-col="{ span: 4 }" :rules="rules" ref="userRefs">
        <a-form-model-item label="部门">
          <a-input v-model="queryFrom.department" style="width: 350px" placeholder="department"></a-input>
        </a-form-model-item>
        <a-form-model-item label="立项人">
          <a-input
            v-model="queryFrom.createUserName"
            style="width: 350px"
            placeholder="createUserName"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item label="项目编号">
          <a-input v-model="queryFrom.projectNo" style="width: 350px" placeholder="projectNo"></a-input>
        </a-form-model-item>
        <a-form-model-item label="项目名称">
          <a-input v-model="queryFrom.projectName" style="width: 350px" placeholder="projectName"></a-input>
        </a-form-model-item>
        <a-form-model-item label="项目类型">
          <a-input v-model="queryFrom.projectType" style="width: 350px" placeholder="projectType"></a-input>
        </a-form-model-item>
        <a-form-model-item label="项目目的">
          <a-input
            v-model="queryFrom.projectPurpose"
            style="width: 350px"
            placeholder="projectPurpose"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item label="项目经理">
          <a-input
            v-model="queryFrom.projectManager"
            style="width: 350px"
            placeholder="projectManager"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item label="项目时间">
          <a-input v-model="queryFrom.timeArr" style="width: 350px" placeholder="projectManager"></a-input>
        </a-form-model-item>
        <a-form-model-item label="项目预算">
          <a-input
            v-model="queryFrom.projectBudget"
            style="width: 350px"
            placeholder="projectBudget"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item label="关联目标">
          <a-input
            v-model="queryFrom.projectObjectives"
            style="width: 350px"
            placeholder="projectObjectives"
          ></a-input>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import {
  addProductDataList,
  editProductDataList
} from "@/services/performance/performanceManagement";
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
          label: "产品编号",
          key: "productNo"
        },
        {
          label: "产品名称",
          key: "productName"
        },
        {
          label: "产品类别",
          key: "productType"
        },
        {
          label: "9NC",
          key: "nineNC"
        },
        {
          label: "产品线",
          key: "productLine"
        },
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
