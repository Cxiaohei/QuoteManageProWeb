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
        <a-form-model-item style="width: 31%;" label="工艺路线" prop="processRote">
          <a-input v-model="queryFrom.processRote" style="width: 180px" placeholder="工艺路线"></a-input>
        </a-form-model-item>
        <a-form-model-item style="width: 31%;" label="PCBA测试时间" prop="pcbaTestMinutes">
          <a-input v-model="queryFrom.pcbaTestMinutes" style="width: 180px" placeholder="PCBA测试时间"></a-input>
        </a-form-model-item>
        <a-form-model-item style="width: 31%;" label="PCBA组装时间" prop="pcbaAssemblyMinutes">
          <a-input v-model="queryFrom.pcbaAssemblyMinutes" style="width: 180px" placeholder="PCBA组装时间"></a-input>
        </a-form-model-item>
        <a-form-model-item style="width: 31%;" label="成品测试时间" prop="finishedProductTestMinutes">
          <a-input v-model="queryFrom.finishedProductTestMinutes" style="width: 180px" placeholder="成品测试时间"></a-input>
        </a-form-model-item>
        <a-form-model-item style="width: 31%;" label="成品组装时间" prop="finishedProductAssemblyMinutes">
          <a-input v-model="queryFrom.finishedProductAssemblyMinutes" style="width: 180px" placeholder="成品组装时间"></a-input>
        </a-form-model-item>
        <a-form-model-item style="width: 31%;" label="物料种类" prop="bomSpecies">
          <a-input v-model="queryFrom.bomSpecies" style="width: 180px" placeholder="物料种类"></a-input>
        </a-form-model-item>
        <a-form-model-item style="width: 31%;" label="插件点数" prop="dipPointNum">
          <a-input v-model="queryFrom.dipPointNum" style="width: 180px" placeholder="插件点数"></a-input>
        </a-form-model-item>
        <a-form-model-item style="width: 31%;" label="手焊点数" prop="manualWeldingPointNum">
          <a-input v-model="queryFrom.manualWeldingPointNum" style="width: 180px" placeholder="手焊点数"></a-input>
        </a-form-model-item>
        <a-form-model-item style="width: 31%;" label="贴片点数" prop="patchPointNum">
          <a-input v-model="queryFrom.patchPointNum" style="width: 180px" placeholder="贴片点数"></a-input>
        </a-form-model-item>
        <a-form-model-item style="width: 31%;" label="SMT价格" prop="smtPrice">
          <a-input v-model="queryFrom.smtPrice" style="width: 180px" placeholder="SMT价格"></a-input>
        </a-form-model-item>
        <a-form-model-item style="width: 31%;" label="PCBA价格" prop="pcbaTotalPrice">
          <a-input v-model="queryFrom.pcbaTotalPrice" style="width: 180px" placeholder="PCBA价格"></a-input>
        </a-form-model-item>
        <a-form-model-item style="width: 31%;" label="组装价格" prop="assemblyTotalPrice">
          <a-input v-model="queryFrom.assemblyTotalPrice" style="width: 180px" placeholder="组装价格"></a-input>
        </a-form-model-item>
        <a-form-model-item style="width: 31%;" label="加工费总价" prop="productTotalPrice">
          <a-input v-model="queryFrom.productTotalPrice" style="width: 180px" placeholder="加工费总价"></a-input>
        </a-form-model-item>

        <!-- <a-form-model-item
          style="width: 31%;"
          label="物料类型"
          prop="dsBaseDataType"
          v-if="queryFrom.categoryType==1"
        >
          <a-select v-model="queryFrom.dsBaseDataType" style="width: 150px;" placeholder="物料类型">
            <a-select-option :value="0">结构料</a-select-option>
            <a-select-option :value="1">电子料</a-select-option>
          </a-select>
        </a-form-model-item> -->

      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import {
  addCraftLineDataList,
  editCraftLineDataList
} from "@/services/businessCode/category1/craftLine";
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
      this.confirmLoading = false;

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
            this.addCraftLineDataList();
          } else {
            this.editCraftLineDataList();
          }
        }
      });
    },
    handleCancel() {
      this.uservisible = false;
      this.$refs.userRefs.resetFields();
    },
    //新增基础数据
    addCraftLineDataList() {
      this.logDataSource = [];
      let params = {
        ...this.queryFrom
      };
      addCraftLineDataList(params)
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
    editCraftLineDataList() {
      this.logDataSource = [];
      let params = {
        ...this.queryFrom,
        referenceProcessRoteId:this.queryFrom.id
      };
      editCraftLineDataList(params)
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
