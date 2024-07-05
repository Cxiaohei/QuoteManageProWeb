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
        <a-form-model-item style="width: 31%" label="9NC">
          <a-input v-model="queryFrom.nineNC" style="width: 150px" placeholder="9NC"></a-input>
        </a-form-model-item>

        <a-form-model-item style="width: 31%" label="产品名称">
          <a-input v-model="queryFrom.productName" style="width: 150px" placeholder="产品名称"></a-input>
        </a-form-model-item>

        <a-form-model-item style="width: 31%" label="工艺路线">
          <!-- <a-input v-model="queryFrom.processRote" style="width: 150px" placeholder="工艺路线"></a-input> -->
          <!-- <a-select
            v-model="queryFrom.processRote"
            style="width: 150px"
            placeholder="工艺路线"
            allowClear
          >
            <a-select-option
              :value="item.id"
              v-for="(item,index) in PriceList"
              :key="index"
            >{{item.productNo}}</a-select-option>
          </a-select>-->
          <a-auto-complete
            v-model="queryFrom.processRote"
            :data-source="seachData"
            style="width: 150px"
            placeholder="请输入内容查询"
            @select="onSelect"
            @change="onChange"
          >
            <template slot="dataSource">
              <a-select-option
                v-for="item in seachData"
                :key="item.id"
                :value="item.value"
              >{{ item.value }}</a-select-option>
            </template>
          </a-auto-complete>
        </a-form-model-item>

        <a-form-model-item
          style="width: 31%"
          :label="item.title"
          v-for="(item,index) in processRoteList"
          :key="index"
        >
          <a-input v-model="item[item.key]" style="width: 150px" :placeholder="item.title"></a-input>
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
      },
      processRoteList: [
        { key: "pcbaTestMinutes", title: "PCBA测试时间" },
        { key: "pcbaAssemblyMinutes", title: "PCBA组装时间" },
        { key: "finishedProductTestMinutes", title: "成品测试时间" },
        { key: "finishedProductAssemblyMinutes", title: "成品组装时间" },
        { key: "bomSpecies", title: "物料种类" },
        { key: "dipPointNum", title: "插件点数" },
        { key: "manualWeldingPointNum", title: "手焊点数" },
        { key: "patchPointNum", title: "贴片点数" },
        { key: "smtPrice", title: "SMT价格" },
        { key: "dipPrice", title: "插件价格" },
        { key: "manualWeldingPrice", title: "手焊价格" },
        { key: "pcbaTestPrice", title: "PCBA测试价格" },
        { key: "pcbaAssemblyPrice", title: "PCBA组装价格" },
        { key: "finishedProductTestPrice", title: "成品测试价格" },
        { key: "finishedProductAssemblyPrice", title: "成品组装价格" },
        { key: "pcbaTotalPrice", title: "PCBA价格" },
        { key: "assemblyTotalPrice", title: "组装价格" },
        { key: "productTotalPrice", title: "加工费总价" },
        { key: "remarks", title: "备注" }
      ]
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
      if (type == "add") {
        this.title = "新增";
      } else {
        this.title = "编辑";
        this.queryFrom = cloneDeep(info);
      }
      this.uservisible = true;
    },
    onSelect() {
      this.seachData = [{ id: "1", value: "1" }];
      this.$forceUpdate();
    },
    onChange() {
      this.seachData = [{ id: "1", value: "1" }];
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
