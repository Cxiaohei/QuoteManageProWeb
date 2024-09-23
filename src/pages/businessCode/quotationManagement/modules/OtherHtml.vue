<template>
  <div>
    <!-- <a-modal
      :width="1180"
      :title="title"
      :visible="uservisible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    > -->
      <a-form-model
        :model="queryFromData"
        layout="inline"
        :label-col="{ span: 8 }"
        :rules="rules"
        ref="userRefs"
      >
      <a-form-model-item style="width: 31%">
        <a-button type="primary" @click="handleOk">保存</a-button>
      </a-form-model-item>
        <a-form-model-item
          style="width: 31%"
          :label="item.title"
          v-for="(item,index) in processRoteList"
          :key="index"
          :help="item.help"
        >
          <a-input v-model="queryFromData[item.key]" style="width: 150px" :placeholder="item.title"></a-input>
        </a-form-model-item>
      </a-form-model>
    <!-- </a-modal> -->
  </div>
</template>

<script>
import {
  setOtherFee,
  editOtherFee
} from "@/services/businessCode/quotationManagement/odmQuote";
import cloneDeep from "lodash.clonedeep";

export default {
  name: "customerModal",
  props: {
    queryFromData: {
      type: Object
    }
  },
  data() {
    return {
      title: "标题",
      uservisible: false,
      // queryFromData: {},
      confirmLoading: false,
      rules: {
        // categoryName: [
        //   { required: true, message: "请输入类别名称", trigger: "change" }
        // ],
      },
      processRoteList: [
        {
          key: "materialConsumptionRate",
          title: "物耗费用系数",
          help: "0.5%-2%之间"
        },
        {
          key: "materialConsumptionPrice",
          title: "物耗费用",
          help: "BOM报价单价格*比例"
        },
        { key: "materialConsumptionDescription", title: "物耗费用比例描述" },
        { key: "managementRate", title: "管理费用系数", help: "默认10%" },
        {
          key: "managementPrice",
          title: "物耗费用",
          help: "BOM报价单价格*比例"
        },
        { key: "managementDescription", title: "物耗费用比例描述" },
        { key: "transportRate", title: "运输费用系数", help: "默认10%" },
        { key: "transportPrice", title: "运输费用", help: "计算方式待确认" },
        { key: "transportDescription", title: "物耗费用比例描述" },
        { key: "smallOrderPrice", title: "小单费", help: "计算方式待确认" },
        { key: "profitMoney", title: "利润", help: "计算方式待确认" },
        { key: "otherFeeTotalPrice", title: "总价" },
        { key: "remarks", title: "备注" }
      ]
    };
  },
  methods: {
    openModules(type, info) {
      this.queryFromData = {};

      if (type == "add") {
        this.title = "新增";
      } else {
        this.title = "编辑";
        this.queryFromData = cloneDeep(info);
      }
      this.uservisible = true;
    },
    // 确定
    handleOk() {
      this.$refs.userRefs.validate(valid => {
        if (valid) {
          this.confirmLoading = true;
          this.setOtherFee();

          // if (this.title == "新增") {
          //   this.setOtherFee();
          // } else {
          //   this.editOtherFee();
          // }
        }
      });
    },
    handleCancel() {
      this.uservisible = false;
      this.$refs.userRefs.resetFields();
    },
    //新增基础数据
    setOtherFee() {
      this.logDataSource = [];
      let params = {
        ...this.queryFromData,
        odmQuoteId: this.$route.query.id
      };
      setOtherFee(params)
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
    editOtherFee() {
      this.logDataSource = [];
      let params = {
        ...this.queryFromData
      };
      editOtherFee(params)
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
