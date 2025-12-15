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
          <a-input 
            v-model.trim="queryFrom.nineNC" 
            style="width: 110px" 
            placeholder="输入数据"
            @keyup.enter="search_pagelist"
          ></a-input>
        </a-form-item>
        <a-form-item label="物料名称">
          <a-input 
            v-model.trim="queryFrom.bomName" 
            style="width: 110px" 
            placeholder="输入数据"
            @keyup.enter="search_pagelist"
          ></a-input>
        </a-form-item>
        <a-form-item label="型号">
          <a-input 
            v-model.trim="queryFrom.bomModel" 
            style="width: 110px" 
            placeholder="输入数据"
            @keyup.enter="search_pagelist"
          ></a-input>
        </a-form-item>
        <a-form-item label="规格">
          <a-input 
            v-model.trim="queryFrom.specification" 
            style="width: 110px" 
            placeholder="输入数据"
            @keyup.enter="search_pagelist"
          ></a-input>
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button type="primary" icon="search" @click="search_pagelist">查询</a-button>
            <a-button type="primary" @click="reset_pagelists">重置</a-button>
          </a-space>
        </a-form-item>
      </a-form>内部物料
      <a-table :columns="columns" :dataSource="detailDataList1" :pagination="false" bordered>
        <span slot="action" slot-scope="text, record">
          <a-button
            type="primary"
            size="small"
            class="select-btn"
            @click="checkData(record)"
          >
            <a-icon type="check" />
            选择
          </a-button>
        </span>
        
        <!-- 数量输入框 -->
        <span slot="needBomNum" slot-scope="text, record">
          <a-input-number
            v-model="record.needBomNum"
            :min="1"
            :max="999999"
            size="small"
            style="width: 60px"
            @change="calculateTotalPrice(record, 'internal')"
            placeholder="数量"
          />
        </span>
        
        <!-- 总价显示 -->
        <span slot="totalPrice" slot-scope="text, record">
          <span class="total-price">¥{{ calculateTotalPrice(record, 'internal') }}</span>
        </span>
      </a-table>外部物料
      <a-table :columns="excolumns" :dataSource="detailDataList2" :pagination="false" bordered>
        <span slot="action" slot-scope="text, record">
          <a-button
            type="primary"
            size="small"
            class="select-btn"
            @click="checkData(record)"
          >
            <a-icon type="check" />
            选择
          </a-button>
        </span>
        <span slot="dataSource" slot-scope="text, record">
          <span style="cursor: pointer;" v-if="record.dataSource==0">立创</span>
          <span style="cursor: pointer;" v-else-if="record.dataSource==1">华秋</span>
          <span style="cursor: pointer;" v-else-if="record.dataSource==2">猎芯网</span>
          <span style="cursor: pointer;" v-else-if="record.dataSource==3">圣禾堂</span>
        </span>
        
        <!-- 数量输入框 -->
        <span slot="needBomNum" slot-scope="text, record">
          <a-input-number
            v-model="record.needBomNum"
            :min="1"
            :max="999999"
            size="small"
            style="width: 60px"
            @change="calculateTotalPrice(record, 'external')"
            placeholder="数量"
          />
        </span>
        
        <!-- 总价显示 -->
        <span slot="totalPrice" slot-scope="text, record">
          <span class="total-price">¥{{ calculateTotalPrice(record, 'external') }}</span>
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
    width: "80px",
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
    title: "数量",
    dataIndex: "needBomNum",
    width: "80px",
    scopedSlots: {
      customRender: "needBomNum"
    }
  },
  {
    title: "总价",
    dataIndex: "totalPrice",
    width: "100px",
    scopedSlots: {
      customRender: "totalPrice"
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
    width: "80px",
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
    title: "数量",
    dataIndex: "needBomNum",
    width: "80px",
    scopedSlots: {
      customRender: "needBomNum"
    }
  },
  {
    title: "总价",
    dataIndex: "totalPrice",
    width: "100px",
    scopedSlots: {
      customRender: "totalPrice"
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
        // 为内部物料数据添加默认数量
        this.detailDataList1 = res.data.dsBomDetails.map(item => ({
          ...item,
          needBomNum: 1
        }));
        
        // 为外部物料数据添加默认数量
        this.detailDataList2 = res.data.externalBoms.map(item => ({
          ...item,
          needBomNum: 1
        }));
      });
    },
    reset_pagelists() {
      this.queryFrom = {};
      this.detailDataList1 = [];
      this.detailDataList2 = [];
    },
    // 计算总价
    calculateTotalPrice(record, type) {
      let price = 0;
      let quantity = record.needBomNum || 1;
      
      if (type === 'internal') {
        // 内部物料使用最近一次采购价
        price = parseFloat(record.recentPrice) || 0;
      } else {
        // 外部物料使用最低价，如果没有则使用平均价
        price = parseFloat(record.currentPrice) || parseFloat(record.currentAvailablePrice) || 0;
      }
      
      const totalPrice = price * quantity;
      record.totalPrice = totalPrice.toFixed(2);
      return totalPrice.toFixed(2);
    },
    
    // 确定
    checkData(recorddata) {
      // 确保数据包含数量和总价
      if (!recorddata.needBomNum) {
        recorddata.needBomNum = 1;
      }
      this.calculateTotalPrice(recorddata, this.clickType === 'type1' ? 'internal' : 'external');
      
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

<style lang="less" scoped>
.select-btn {
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
  border: none;
  color: white;
  font-weight: bold;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  animation: select-pulse 2s infinite;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    transition: left 0.5s;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -1px;
    left: -1px;
    right: -1px;
    bottom: -1px;
    background: linear-gradient(45deg, #52c41a, #73d13d, #95de64, #52c41a);
    border-radius: 5px;
    z-index: -1;
    animation: select-border-glow 2s linear infinite;
  }
  
  &:hover {
    background: linear-gradient(135deg, #73d13d 0%, #95de64 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(82, 196, 26, 0.4);
    
    &::before {
      left: 100%;
    }
    
    &::after {
      animation: select-border-glow 1s linear infinite;
    }
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(82, 196, 26, 0.3);
  }
  
  &:focus {
    box-shadow: 0 0 0 2px rgba(82, 196, 26, 0.2);
  }
  
  .anticon {
    margin-right: 2px;
    font-size: 10px;
  }
}

@keyframes select-pulse {
  0%, 100% {
    box-shadow: 0 0 3px rgba(82, 196, 26, 0.4);
  }
  50% {
    box-shadow: 0 0 8px rgba(82, 196, 26, 0.7);
  }
}

@keyframes select-border-glow {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

// 表格操作列样式优化
.ant-table-tbody {
  .ant-btn {
    margin: 0;
  }
  
  // 行悬停时选择按钮更突出
  tr:hover {
    .select-btn {
      animation: select-pulse 1s infinite;
      transform: scale(1.05);
    }
  }
}

// 模态框内容样式
.ant-modal-body {
  .ant-table {
    margin-top: 16px;
  }
}

// 表格标题样式
.ant-table-thead > tr > th {
  background-color: #fafafa;
  font-weight: 600;
  color: #262626;
}

// 操作列标题居中
.ant-table-thead > tr > th[data-col-key="action"] {
  text-align: center;
}

// 操作列内容居中
.ant-table-tbody > tr > td[data-col-key="action"] {
  text-align: center;
}

// 总价显示样式
.total-price {
  font-weight: bold;
  color: #f5222d;
  font-size: 13px;
}

// 数量输入框样式
.ant-input-number {
  .ant-input-number-input {
    text-align: center;
  }
}

// 价格列样式
.ant-table-tbody > tr > td[data-col-key="totalPrice"] {
  text-align: right;
  font-weight: 600;
}
</style>
