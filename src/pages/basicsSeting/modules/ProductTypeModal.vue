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
        <a-form-model-item style="width: 31%" label="产品线">
          <!-- 产品下拉 -->
          <a-select
            v-model="queryFrom.productLineId"
            style="width: 150px"
            placeholder="产品"
            allowClear
          >
            <a-select-option
              :value="item.id"
              v-for="(item,index) in ProductLineList"
              :key="index"
            >{{item.productLineName}}</a-select-option>
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
} from "@/services/basicsSeting/productType";
import { getPageListSelect } from "@/services/basicsSeting/productXian";
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
          label: "产品类型名称",
          key: "productTypeName"
        },
        // {
        //   label: "所属产品线Id",
        //   key: "productLineId"
        // },
        // {
        //   label: "所属产品线名称",
        //   key: "productLineName"
        // },
        {
          label: "基准毛利",
          key: "standardGrossProfit"
        },
        {
          label: "备注",
          key: "remarks"
        },
        {
          label: "备用1",
          key: "spareColumOne"
        },
        {
          label: "备用2",
          key: "spareColumTwo"
        },
        {
          label: "备用3",
          key: "spareColumThree"
        }
      ],
      ProductLineList: [],
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
      //产线下拉
      getPageListSelect().then(res => {
        console.log(res);
        this.ProductLineList = res.data;
      });

      this.queryFrom = {};
      if (type == "add") {
        this.title = "新增";
      } else {
        this.title = "编辑";
        this.queryFrom = cloneDeep(info);
        this.queryFrom.productTypeId = info.id;
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
      this.ProductLineList.filter(item => {
        if (item.id == this.queryFrom.productLineId) {
          params.productLineName = item.productLineName;
        }
      })
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
      this.ProductLineList.filter(item => {
        if (item.id == this.queryFrom.productLineId) {
          params.productLineName = item.productLineName;
        }
      })
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
