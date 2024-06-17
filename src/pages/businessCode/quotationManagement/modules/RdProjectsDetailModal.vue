<template>
  <div>
    <a-modal
      :width="1280"
      :title="title"
      :visible="uservisible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-table
        :rowKey="
          (data, index) => {
            return index;
          }
        "
        :columns="columns"
        :dataSource="detailDataList"
        :pagination="false"
        bordered
      >
        <span slot="action" slot-scope="text, record, index">
          <a
            href="javascript:;"
            v-if="index == 0"
            style="margin-right: 5px"
            @click="addDetailDataList"
            >添加</a
          >
          <a
            href="javascript:;"
            v-if="index != 0"
            @click="removeDetailDataList(index)"
            >删除</a
          >
        </span>

        <!-- 工种 -->
        <span slot="trades" slot-scope="text, record">
          <a-select
            v-model="record.trades"
            style="width: 110px"
            placeholder="工种"
            @change="changeTrades(record)"
          >
            <a-select-option
              :value="item.id"
              v-for="(item, index) in TradesList"
              :key="index"
              >{{ item.categoryName }}</a-select-option
            >
          </a-select>
        </span>

        <!-- 费用类型 -->
        <span slot="detailFeeType" slot-scope="text, record">
          <a-select
            v-model="record.detailFeeType"
            style="width: 110px"
            placeholder="类型"
            @change="changeFeeType(record)"
          >
            <a-select-option :value="0">费用</a-select-option>
            <a-select-option :value="1">人工</a-select-option>
          </a-select>
        </span>

        <!-- 工程师级别 -->
        <span slot="engineerLevel" slot-scope="text, record">
          <a-select
            disabled
            v-model="record.engineerLevel"
            style="width: 80px"
            placeholder="等级"
          >
            <a-select-option :value="0">初级</a-select-option>
            <a-select-option :value="1">中级</a-select-option>
            <a-select-option :value="2">高级</a-select-option>
            <a-select-option :value="3">资深</a-select-option>
          </a-select>
        </span>

        <!-- 折扣率 -->
        <span slot="discountedRate" slot-scope="text, record">
          <a-input
            :disabled="record.detailFeeType == 0"
            v-model="record.discountedRate"
            style="width: 50px"
          ></a-input>
        </span>

        <span
          :slot="item"
          style="width: 80px"
          slot-scope="text, record"
          v-for="(item, index) in tdArr"
          :key="index"
        >
          <a-input v-model="record[item]"></a-input>
        </span>
      </a-table>
    </a-modal>
  </div>
</template>

<script>
import {
  addRdProjectsDetailList,
  editRdProjectsDetailList,
  getTradesList,
} from "@/services/businessCode/quotationManagement/rdProjects";

import cloneDeep from "lodash.clonedeep";

const columns = [
  {
    width: 70,
    title: "操作",
    dataIndex: "action",
    scopedSlots: {
      customRender: "action",
    },
  },
  {
    title: "子类",
    width: "110px",
    dataIndex: "subclasses",
    scopedSlots: {
      customRender: "subclasses",
    },
  },
  {
    title: "费用说明",
    width: "130px",
    dataIndex: "feeDescription",
    scopedSlots: {
      customRender: "feeDescription",
    },
  },
  {
    title: "工种",
    width: "130px",
    dataIndex: "trades",
    scopedSlots: {
      customRender: "trades",
    },
  },
  {
    title: "费用类型",
    width: "130px",
    dataIndex: "detailFeeType",
    scopedSlots: {
      customRender: "detailFeeType",
    },
  },
  {
    title: "工程师级别",
    width: "100px",
    dataIndex: "engineerLevel",
    scopedSlots: {
      customRender: "engineerLevel",
    },
  },
  {
    title: "折扣率",
    width: "80px",
    dataIndex: "discountedRate",
    scopedSlots: {
      customRender: "discountedRate",
    },
  },
  // {
  //   title: "总价",
  //   width: "100px",
  //   dataIndex: "totalPrice",
  //   scopedSlots: {
  //     customRender: "totalPrice",
  //   },
  // },
  {
    title: "数量",
    width: "100px",
    dataIndex: "quantityNum",
    scopedSlots: {
      customRender: "quantityNum",
    },
  },
  {
    title: "参考值",
    width: "100px",
    dataIndex: "referenceValue",
    scopedSlots: {
      customRender: "referenceValue",
    },
  },
  {
    title: "单价",
    width: "100px",
    dataIndex: "unitPrice",
    scopedSlots: {
      customRender: "unitPrice",
    },
  },
  {
    title: "备注",
    dataIndex: "remarks",
    scopedSlots: {
      customRender: "remarks",
    },
  },
];

export default {
  name: "customerModal",
  props: {},
  data() {
    return {
      title: "标题",
      uservisible: false,
      confirmLoading: false,
      detailType: 0,
      columns,
      //循环表格
      tdArr: [
        "subclasses",
        "feeDescription",
        // "totalPrice",
        "quantityNum",
        "referenceValue",
        "unitPrice",
        "remarks",
      ],
      TradesList: [], //工种列表
      detailDataList: [], //详情的列表
    };
  },
  methods: {
    // openModules(type, info) {
    openModules(title, detailType, type, record) {
      getTradesList().then((res) => {
        this.TradesList = res.data;
      });
      // this.title = title;
      this.detailType = detailType;
      this.detailDataList = [
        { detailType: this.detailType, developProjectId: this.$route.query.id },
      ];
      if (type == "add") {
        this.title = "新增";
      } else {
        this.title = "编辑";
        this.detailDataList[0] = cloneDeep(record);
      }
      this.uservisible = true;
    },
    //新增基础数据
    addDetailDataList() {
      if (this.title == "编辑") {
        this.$message.error("编辑页无法新增，请点击新增按钮进行添加操作");
        return false;
      }
      this.detailDataList.push({
        detailType: this.detailType,
        developProjectId: this.$route.query.id,
      });
    },
    //删除表格
    removeDetailDataList(index) {
      this.detailDataList.splice(index, 1);
    },
    //更新数据
    changeFeeType(record) {
      record.discountedRate = 100;
      this.$forceUpdate();
    },
    //编辑工种
    changeTrades(record) {
      this.TradesList.map((item) => {
        if (item.id == record.trades) {
          record.trades = item.categoryName; //工程师级别
          record.engineerLevel = item.categoryLevel; //工程师级别
          record.unitPrice = item.unitPrice; //单价
        }
      });
      this.$forceUpdate();
    },
    // 确定
    handleOk() {
      this.confirmLoading = true;
      if (this.title == "新增") {
        this.addRdProjectsDetailList();
      } else {
        this.editRdProjectsDetailList();
      }
    },
    handleCancel() {
      this.uservisible = false;
    },
    //新增基础数据
    addRdProjectsDetailList() {
      let params = {
        developProjectId: this.$route.query.id,
        devProDetails: this.detailDataList,
      };
      addRdProjectsDetailList(params)
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
    editRdProjectsDetailList() {
      let params = {
        ...this.detailDataList[0],
      };
      editRdProjectsDetailList(params)
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
