<template>
  <div>
    <a-modal
      :width="600"
      :title="title"
      :visible="uservisible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <!-- {{queryFrom}} -->
      <a-form-model :model="queryFrom" :label-col="{ span: 4 }" :rules="rules" ref="userRefs">
        <a-form-model-item label="类型">
          <a-select v-model="queryFrom.auditeType" style="width: 450px" placeholder="类型" disabled>
            <a-select-option :value="0">Oem报价审批</a-select-option>
            <a-select-option :value="1">制作费用报价审批</a-select-option>
            <a-select-option :value="2">研发费用报价审批</a-select-option>
            <a-select-option :value="3">Odm报价审批</a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item label="研发项目" style="display: none;">
          <a-input v-model="queryFrom.quoteId" style="width: 450px" placeholder="研发项目" disabled></a-input>
        </a-form-model-item>

        <a-form-model-item label="项目最终评分" v-if="queryFrom.auditeType==2">
          <a-input v-model="queryFrom.finalScore" style="width: 450px" placeholder="项目最终评分" disabled></a-input>
        </a-form-model-item>

        <!-- <a-form-model-item label="提交人">
          <a-input v-model="queryFrom.createUserName" style="width: 450px" placeholder="提交人"></a-input>
        </a-form-model-item>-->

        <a-form-model-item label="审批人列表">
          <ul style="overflow: hidden;padding:0;margin:0">
            <li style="list-style: none;" v-for="(item,index) in auditeUserNamesList" :key="index">
              <a-input
                v-model="item.value"
                style="width: 250px;margin-right:5px"
                placeholder="审批人列表"
              ></a-input>
              <a-button type="primary" style="margin-right: 5px;" @click="addList">+</a-button>
              <a-button type="primary" @click="removeList(index)" v-if="index>0">-</a-button>
            </li>
          </ul>
        </a-form-model-item>

        <a-form-model-item label="备注">
          <a-input v-model="queryFrom.remarks" style="width: 450px" placeholder="备注"></a-input>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import {
  setQuoteAudite,
  editManufactureFee,
} from "@/services/businessCode/quotationManagement/shenpi";
import cloneDeep from "lodash.clonedeep";

export default {
  name: "customerModal",
  props: {
    auditeType: {
      type: Number,
      default: 0
    },
    quoteId: {
      type: String,
      default: "0"
    },
    finalScore: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      title: "发起审批",
      uservisible: false,
      queryFrom: {},
      confirmLoading: false,
      PriceList: [],
      seachData: [],
      seachPriceData: [], //价格策略
      auditeUserNamesList: [{ value: "" }],
      rules: {
        // categoryName: [
        //   { required: true, message: "请输入类别名称", trigger: "change" }
        // ],
      }
    };
  },
  methods: {
    openModules(type, info) {
      this.queryFrom = {
        auditeType: this.auditeType,
        quoteId: this.quoteId,
        finalScore: this.finalScore
      };
      this.uservisible = true;
    },
    // 确定
    handleOk() {
      this.$refs.userRefs.validate(valid => {
        if (valid) {
          this.confirmLoading = true;
          if (this.title == "发起审批") {
            this.setQuoteAudite();
          } 
        }
      });
    },
    addList() {
      this.auditeUserNamesList.push({ value: "" });
    },
    removeList(index) {
      this.auditeUserNamesList.splice(index, 1);
    },
    handleCancel() {
      this.uservisible = false;
      this.$refs.userRefs.resetFields();
    },
    //新增基础数据
    setQuoteAudite() {
      const params = {
        ...this.queryFrom
      };
      const auditeUserNames = [];
      this.auditeUserNamesList.map(item => {
        auditeUserNames.push(item.value);
      });
      params['auditeUserNames'] = auditeUserNames;
      setQuoteAudite(params)
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
  }
};
</script>

<style lang="less" scoped></style>
