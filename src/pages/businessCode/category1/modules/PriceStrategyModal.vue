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
        <!-- <a-form-model-item style="width: 31%;" label="报价策略名称" prop="priceStrategyName">
          <a-input v-model="queryFrom.priceStrategyName" style="width: 180px" placeholder="报价策略名称"></a-input>
        </a-form-model-item>
        <a-form-model-item style="width: 31%;" label="数据类型" prop="categoryType">
          <a-select v-model="queryFrom.categoryType" style="width: 150px;" placeholder="数据类型">
            <a-select-option :value="0">岗位</a-select-option>
            <a-select-option :value="1">物料种类</a-select-option>
          </a-select>
        </a-form-model-item> -->

        <a-form-model-item
          style="width: 31%"
          v-for="(item, index) in queryFromDataList"
          :key="index"
          :label="item.label"
        >
          <!-- 输入框 -->
          <a-input
            v-model="queryFrom[item.key]"
            style="width: 150px"
            :placeholder="item.label"
          ></a-input>
        </a-form-model-item>


      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import {
  addPriceStrategyDataList,
  editPriceStrategyDataList,
} from "@/services/businessCode/category1/priceStrategy";
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
      },
      
      queryFromDataList: [
        {
          label: "报价策略名称",
          key: "priceStrategyName",
          type: "string"
        },
        {
          label: "工艺路线",
          key: "processRote",
          type: "string"
        },
        {
          label: "测试岗工价(元/时)",
          key: "testUnitPrice",
          type: "string"
        },
        {
          label: "组装岗工价(元/时)",
          key: "assemblyUnitPrice",
          type: "string"
        },
        {
          label: "物料种类",
          key: "bomSpecies",
          type: "string"
        },
        {
          label: "贴片单价1(元/点)",
          key: "firstPatchUnitPrice",
          type: "string"
        },
        {
          label: "贴片单价1临界点",
          key: "firstPatchCritical",
          type: "string"
        },
        {
          label: "贴片单价2(元/点)",
          key: "secondPatchUnitPrice",
          type: "string"
        },
        {
          label: "贴片单价2临界点",
          key: "secondPatchCritical",
          type: "string"
        },
        {
          label: "贴片单价3(元/点)",
          key: "threePatchUnitPrice",
          type: "string"
        },
        {
          label: "贴片单价3临界点",
          key: "threePatchCritical",
          type: "string"
        },
        {
          label: "插件单价(元/点)",
          key: "dipUnitPrice",
          type: "string"
        },
        {
          label: "手焊单价(元/点)",
          key: "manualWeldingUnitPrice",
          type: "string"
        },
        {
          label: "备注",
          key: "remarks",
          type: "string"
        },
      ]
    };
  },
  methods: {
    openModules(type, info) {
      this.queryFrom = {};
      // this.confirmLoading = true;
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
            this.addPriceStrategyDataList();
          } else {
            this.editPriceStrategyDataList();
          }
        }
      });
    },
    handleCancel() {
      this.uservisible = false;
      this.$refs.userRefs.resetFields();
    },
    //新增基础数据
    addPriceStrategyDataList() {
      this.logDataSource = [];
      let params = {
        ...this.queryFrom
      };
      addPriceStrategyDataList(params)
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
    editPriceStrategyDataList() {
      this.logDataSource = [];
      let params = {
        ...this.queryFrom,
        priceStrategyId: this.queryFrom.id
      };
      editPriceStrategyDataList(params)
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
