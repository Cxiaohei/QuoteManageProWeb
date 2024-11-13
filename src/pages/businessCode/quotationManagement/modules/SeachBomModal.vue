<template>
  <div>
    <a-modal
      :width="1200"
      title="查询"
      :visible="uservisible"
      @ok="uservisible=false"
      @cancel="uservisible=false"
    >
      <a-form :model="queryFrom" layout="inline">
        <a-form-item label="9NC">
          <a-input v-model.trim="queryFrom.nineNC" style="width: 110px" placeholder="输入数据"></a-input>
        </a-form-item>
        <a-form-item label="物料名称">
          <a-input v-model.trim="queryFrom.bomName" style="width: 110px" placeholder="输入数据"></a-input>
        </a-form-item>
        <a-form-item label="物料代码">
          <a-input v-model.trim="queryFrom.bomCode" style="width: 110px" placeholder="输入数据"></a-input>
        </a-form-item>
        <a-form-item label="型号">
          <a-input v-model.trim="queryFrom.bomModel" style="width: 110px" placeholder="输入数据"></a-input>
        </a-form-item>
        <a-form-item label="规格">
          <a-input v-model.trim="queryFrom.specification" style="width: 110px" placeholder="输入数据"></a-input>
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button type="primary" icon="search" @click="search_pagelist">查询</a-button>
            <a-button type="primary" @click="reset_pagelists">重置</a-button>
          </a-space>
        </a-form-item>
      </a-form>内部
      <a-table :columns="columns" :dataSource="detailDataList1" :pagination="false" bordered>
        <span slot="action" slot-scope="text, record">
          <span style="cursor: pointer;" @click="checkData(record)">选择</span>
        </span>
      </a-table>外部
      <a-table :columns="excolumns" :dataSource="detailDataList2" :pagination="false" bordered>
        <span slot="action" slot-scope="text, record">
          <span style="cursor: pointer;" @click="checkData(record)">选择</span>
        </span>
      </a-table>
    </a-modal>
  </div>
</template>

<script>
import { bomfilterApi } from "@/services/businessCode/quotationManagement/bomQuote";
import cloneDeep from "lodash.clonedeep";

const columns = [
  {
    title: "操作",
    width: "70px",
    dataIndex: "action",
    scopedSlots: {
      customRender: "action"
    }
  },
  // {
  //   title: "部件名称",
  //   dataIndex: "categoryName",
  //   scopedSlots: {
  //     customRender: "categoryName"
  //   }
  // },
  {
    title: "9NC",
    dataIndex: "nineNC",
    scopedSlots: {
      customRender: "nineNC"
    }
  },
  {
    title: "物料名称",
    dataIndex: "bomName",
    scopedSlots: {
      customRender: "bomName"
    }
  },
  {
    title: "品牌",
    dataIndex: "brand",
    scopedSlots: {
      customRender: "brand"
    }
  },
  {
    title: "规格",
    dataIndex: "specification",
    scopedSlots: {
      customRender: "specification"
    }
  },
  {
    title: "物料脚数",
    dataIndex: "bomLegNum",
    scopedSlots: {
      customRender: "bomLegNum"
    }
  },
  {
    title: "最近一次采购价",
    dataIndex: "recentPrice",
    scopedSlots: {
      customRender: "recentPrice"
    }
  },
  {
    title: "历史最高价",
    dataIndex: "maxPrice",
    scopedSlots: {
      customRender: "maxPrice"
    }
  },
  {
    title: "历史最低价",
    dataIndex: "minPrice",
    scopedSlots: {
      customRender: "minPrice"
    }
  }
];
const excolumns = [
  {
    title: "操作",
    width: "70px",
    dataIndex: "action",
    scopedSlots: {
      customRender: "action"
    }
  },
  {
    title: "物料来源",
    dataIndex: "dataSource",
    scopedSlots: {
      customRender: "dataSource"
    }
  },
  {
    title: "物料名称",
    dataIndex: "bomName",
    scopedSlots: {
      customRender: "bomName"
    }
  },
  {
    title: "品牌",
    dataIndex: "brand",
    scopedSlots: {
      customRender: "brand"
    }
  },
  {
    title: "型号",
    dataIndex: "bomModel",
    scopedSlots: {
      customRender: "bomModel"
    }
  },
  {
    title: "规格",
    dataIndex: "specification",
    scopedSlots: {
      customRender: "specification"
    }
  },
  {
    title: "最低价",
    dataIndex: "currentPrice",
    scopedSlots: {
      customRender: "currentPrice"
    }
  },
  {
    title: "次低价",
    dataIndex: "secondPrice",
    scopedSlots: {
      customRender: "secondPrice"
    }
  },
  {
    title: "平均价",
    dataIndex: "currentAvailablePrice",
    scopedSlots: {
      customRender: "currentAvailablePrice"
    }
  }
];

export default {
  name: "customerModal",
  props: {
    dsProductsId: String,
    developProjectId: String
  },
  data() {
    return {
      uservisible: false,
      columns,
      excolumns,
      detailDataList1: [],
      detailDataList2: [],
      queryFrom: {},
      clickIndex: 0,
      clickType: "type1"
    };
  },
  methods: {
    openModules(index, type) {
      this.uservisible = true;
      this.clickIndex = index;
      this.clickType = type;
      this.detailDataList1 = [];
      this.detailDataList2 = [];
    },
    search_pagelist() {
      bomfilterApi(this.queryFrom).then(res => {
        this.detailDataList1 = res.data.dsBomDetails;
        this.detailDataList2 = res.data.externalBoms;
      });
    },
    reset_pagelists() {
      this.queryFrom = {};
      this.detailDataList1 = [];
      this.detailDataList2 = [];
    },
    // 确定
    checkData(recorddata) {
      this.$emit("checkDataSet", {
        data: recorddata,
        index: this.clickIndex,
        type: this.clickType
      });
      this.uservisible = false;
    },

    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    }
  }
};
</script>

<style lang="less" scoped></style>
