<template>
  <div>
    <a-modal
      :width="900" 
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
        <a-row :gutter="16"> <!-- 设置合适的间距 -->
          <!-- 遍历生成表单项 -->
          <a-col :span="8" v-for="(item, index) in queryFromDataList" :key="index">
            <a-form-model-item :label="item.label">
              <a-input
                v-model="queryFrom[item.key]"
                :placeholder="item.label"
                style="width: 150px" 
              />
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
                  v-for="(item,index) in ProductTypeList"
                  :key="index"
                >{{item.productTypeName}}</a-select-option>
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
                  v-for="(item,index) in DevelopmentTypeList"
                  :key="index"
                >{{item.categoryName}}</a-select-option>
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
  data() {
    return {
      timeArr1: [],
      DevelopmentTypeList: [], // 研发类型
      ProductTypeList: [], // 产品类型
      title: "标题",
      uservisible: false,
      queryFrom: {},
      confirmLoading: false,
      queryFromDataList: [
        { label: "研发项目名称", key: "projectName", type: "string" },
        { label: "客户名称", key: "customerName", type: "string" },
        { label: "样机数量", key: "prototypeNum", type: "string" }
      ],
      rules: {
        projectName: [{ required: true, message: "请输入研发项目名称", trigger: "blur" }],
        customerName: [{ required: true, message: "请输入客户名称", trigger: "blur" }],
        prototypeNum: [{ required: true, message: "请输入样机数量", trigger: "blur" }]
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
      
      getPageListTypeSelect().then(res => {
        this.ProductTypeList = res.data;
      });
      
      getDevelopmentTypeListSelect().then(res => {
        this.DevelopmentTypeList = res.data;
      });
    },
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
    addEssentialDataList() {
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
          this.confirmLoading = false;
        });
    },
    editEssentialDataList() {
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
          this.confirmLoading = false;
        });
    },
  },
};
</script>

<style lang="less" scoped>
/* 控制表单元素之间的距离，确保一行内元素对齐 */
a-form-model-item {
  margin-bottom: 16px;
  white-space: nowrap; /* 防止换行 */
}

</style>
