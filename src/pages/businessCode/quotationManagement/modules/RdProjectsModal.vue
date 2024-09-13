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
        <a-form-model-item
          style="width: 31%"
          v-for="(item, index) in queryFromDataList"
          :key="index"
          :label="item.label"
        >
          <a-input
            v-model="queryFrom[item.key]"
            style="width: 150px"
            :placeholder="item.label"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item style="width: 31%" label="产品类型">
          <!-- 产品类别 -->
          <a-select
            v-model="queryFrom.productType"
            style="width: 150px"
            placeholder="产品类型"
            allowClear
          >
            <a-select-option
              :value="item.productTypeName"
              v-for="(item,index) in ProductTypeList"
              :key="index"
            >{{item.productTypeName}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item style="width: 31%" label="研发类型">
          <a-select
            v-model="queryFrom.developmentType"
            style="width: 150px"
            placeholder="研发类型"
            allowClear
          >
            <a-select-option
              :value="item.categoryName"
              v-for="(item,index) in DevelopmentTypeList"
              :key="index"
            >{{item.categoryName}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="项目周期">
          <a-range-picker
            v-model.trim="timeArr1"
            style="width: 350px"
            :allowClear="false"
            format="YYYY-MM-DD"
            valueFormat="YYYY-MM-DD"
          />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import {
  addEssentialDataList,
  editEssentialDataList,
} from "@/services/businessCode/quotationManagement/rdProjects";
import {
  getPageListTypeSelect
} from "@/services/basicsSeting/productXian";
import {
  getDevelopmentTypeListSelect,
  } from "@/services/basicsSeting/developmentType";
import cloneDeep from "lodash.clonedeep";

export default {
  name: "customerModal",
  props: {},
  data() {
    return {
      timeArr1: [],
      DevelopmentTypeList: [], //研发类型
      ProductTypeList: [], //产品类型
      title: "标题",
      uservisible: false,
      queryFrom: {},
      confirmLoading: false,
      queryFromDataList: [
        {
          label: "研发项目名称",
          key: "projectName",
          type: "string",
        },
        {
          label: "客户名称",
          key: "customerName",
          type: "string",
        },
        {
          label: "样机数量",
          key: "prototypeNum",
          type: "string",
        }
      ],
      rules: {
        categoryName: [
          { required: true, message: "请输入类别名称", trigger: "change" },
        ],
        categoryLevel: [
          { required: true, message: "请选择等级", trigger: "change" },
        ],
        categoryType: [
          { required: true, message: "请选择岗位", trigger: "change" },
        ],
      },
    };
  },
  methods: {
    openModules(type, info) {
      this.queryFrom = {
        haveProductDefinitions: true,
        haveHardware: true,
        haveSoftware: true,
        haveStructural: true,
        haveProductTest: true,
        haveMoldsAndTooling: true,
        haveAuthentication: true,
        haveOtherFee: true,
      };
      if (type == "add") {
        this.title = "新增";
      } else {
        this.title = "编辑";
        this.queryFrom = cloneDeep(info);
      }
      this.uservisible = true;
       //产品类型
       getPageListTypeSelect().then(res => {
        this.ProductTypeList = res.data;
      });
             //研发类型
             getDevelopmentTypeListSelect().then(res => {
        this.DevelopmentTypeList = res.data;
      });
    },
    // 确定
    handleOk() {
      this.$refs.userRefs.validate((valid) => {
        if (valid) {
          this.confirmLoading = true;
          if (this.title == "新增") {
            this.addEssentialDataList();
          } else {
            this.editEssentialDataList();
          }
        }
      });
    },
    handleCancel() {
      this.uservisible = false;
      this.$refs.userRefs.resetFields();
    },
    //新增基础数据
    addEssentialDataList() {
      this.logDataSource = [];
      let params = {
        ...this.queryFrom,
      };
      if (this.timeArr1 && this.timeArr1.length > 0) {
        params.startTime = this.timeArr1[0];
        params.endTime = this.timeArr1[1];
      }
      addEssentialDataList(params)
        .then((res) => {
          if (res.code == 1) {
            this.$message.success(res.msg);
            this.$emit("ok");
            this.uservisible = false;
          } else {
            this.$message.error(res.msg);
          }
          this.confirmLoading = false;
        })
        .catch((err) => {
          this.loading = false;
          this.confirmLoading = false;
        });
    },
    //编辑基础数据
    editEssentialDataList() {
      this.logDataSource = [];
      let params = {
        ...this.queryFrom,
      };
      if (this.timeArr1 && this.timeArr1.length > 0) {
        params.startTime = this.timeArr1[0];
        params.endTime = this.timeArr1[1];
      }
      editEssentialDataList(params)
        .then((res) => {
          if (res.code == 1) {
            this.$message.success(res.msg);
            this.$emit("ok");
            this.uservisible = false;
          } else {
            this.$message.error(res.msg);
          }
          this.confirmLoading = false;
        })
        .catch((err) => {
          this.loading = false;
          this.confirmLoading = false;
        });
    },
  },
};
</script>

<style lang="less" scoped></style>
