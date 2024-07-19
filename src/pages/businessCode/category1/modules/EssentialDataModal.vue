<template>
  <div>
    <a-modal
      :width="1000"
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
        <a-form-model-item style="width: 31%;" label="类别名称" prop="categoryName">
          <a-input v-model="queryFrom.categoryName" style="width: 180px" placeholder="类别名称"></a-input>
        </a-form-model-item>

        <a-form-model-item style="width: 31%;" label="等级" prop="categoryLevel">
          <a-select v-model="queryFrom.categoryLevel" style="width: 150px;" placeholder="等级">
            <a-select-option :value="0">初级</a-select-option>
            <a-select-option :value="1">中级</a-select-option>
            <a-select-option :value="2">高级</a-select-option>
            <a-select-option :value="3">资深</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item style="width: 31%;" label="数据类型" prop="categoryType">
          <a-select v-model="queryFrom.categoryType" style="width: 150px;" placeholder="数据类型">
            <a-select-option :value="0">岗位</a-select-option>
            <a-select-option :value="1">物料种类</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          style="width: 31%;"
          label="物料类型"
          prop="dsBaseDataType"
          v-if="queryFrom.categoryType==1"
        >
          <a-select v-model="queryFrom.dsBaseDataType" style="width: 150px;" placeholder="物料类型">
            <a-select-option :value="0">结构料</a-select-option>
            <a-select-option :value="1">电子料</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item style="width: 31%;" label="类别父级" prop="parentId" help="不选则为一级类别">
          <a-select
            v-model="queryFrom.parentId"
            style="width: 150px;"
            placeholder="类别父级"
            allowClear
          >
            <a-select-option
              :value="item.id"
              v-for="(item,index) in ParentBaseList"
              :key="index"
            >{{item.categoryName}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item style="width: 31%;" label="单价" prop="unitPrice">
          <a-input v-model="queryFrom.unitPrice" style="width: 180px" placeholder="类别名称"></a-input>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import {
  addEssentialDataList,
  editEssentialDataList,
  getParentBase
} from "@/services/businessCode/category1/essentialData";
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
      ParentBaseList: [],
      parentId: "", //父级ID
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
      this.confirmLoading = true;
      //获取父级数据
      getParentBase().then(res => {
        this.ParentBaseList = res.data;
        this.confirmLoading = false;
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
        ...this.queryFrom
      };
      addEssentialDataList(params)
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
    editEssentialDataList() {
      this.logDataSource = [];
      let params = {
        ...this.queryFrom
      };
      editEssentialDataList(params)
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
