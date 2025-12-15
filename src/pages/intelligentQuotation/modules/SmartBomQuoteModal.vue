<template>
  <div>
    <a-modal
      :width="1400"
      :title="title"
      :visible="uservisible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form-model :model="queryFrom" layout="inline" :rules="rules" ref="userRefs">
        <a-row>
          <a-col :span="24">
            <a-form-item label="报价单名称" prop="bomQuoteName">
              <a-input v-model="queryFrom.bomQuoteName" placeholder="请输入报价单名称" style="width: 200px"></a-input>
            </a-form-item>
            <a-form-item label="备注">
              <a-input v-model="queryFrom.remarks" placeholder="请输入备注" style="width: 200px"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24" style="margin-top: 10px">
            <a-form-item>
              <a-space>
                <a-upload name="file" :fileList="[]" action :customRequest="importExcel">
                  <a-button type="primary" icon="to-top">导入</a-button>
                </a-upload>
                <span @click="downloadTemplate" style="color: #1890ff; cursor: pointer">下载导入模板</span>
              </a-space>
            </a-form-item>
          </a-col>
          
          <!-- 结构料表格 -->
          <div style="padding-top: 20px; width: 100%">
            <h3>结构料</h3>
            <a-table
              :rowKey="(data, index) => index"
              :columns="columns"
              :dataSource="detailDataList1"
              :pagination="false"
              :scroll="{ x: 1200 }"
              bordered
            >
              <span slot="action" slot-scope="text, record, index" class="action-buttons">
                <a-button
                  type="primary"
                  size="small"
                  class="query-btn"
                  @click="SeachBomModalClick(index,'type1')"
                >
                  <a-icon type="search" />
                  查询
                </a-button>
                <a
                  href="javascript:;"
                  v-if="index == 0"
                  style="margin-right: 5px"
                  @click="addDetailDataList1"
                >添加</a>
                <a href="javascript:;" v-if="index != 0" @click="removeDetailDataList1(index)">删除</a>
              </span>
              
              
              <!-- 物料结构 -->
              <span slot="dsBaseDataType" slot-scope="text, record">
                {{ record.dsBaseDataType == 0 ? "结构料" : "电子料" }}
              </span>

              <!-- 部件名称 -->
              <span slot="categoryName" slot-scope="text, record">
                <a-input v-model="record.categoryName" placeholder="部件名称" style="width: 100px"></a-input>
              </span>

              <span
                :slot="tdItem"
                slot-scope="text, record"
                v-for="(tdItem, tdIndex) in TdArr"
                :key="tdIndex"
              >
                <a-input v-model="record[tdItem]" style="width: 100px"></a-input>
              </span>

              <!-- 数量 -->
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

              <!-- 总价 -->
              <span slot="totalPrice" slot-scope="text, record">
                <span class="total-price-display">¥{{ calculateTotalPrice(record, 'internal') }}</span>
              </span>
            </a-table>
          </div>

          <!-- 电子料表格 -->
          <div style="padding-top: 20px; width: 100%">
            <h3>电子料</h3>
            <a-table
              :rowKey="(data, index) => index"
              :columns="columns"
              :dataSource="detailDataList2"
              :pagination="false"
              :scroll="{ x: 1200 }"
              bordered
            >
              <span slot="action" slot-scope="text, record, index" class="action-buttons">
                <a-button
                  type="primary"
                  size="small"
                  class="query-btn"
                  @click="SeachBomModalClick(index,'type2')"
                >
                  <a-icon type="search" />
                  查询
                </a-button>
                <a
                  href="javascript:;"
                  v-if="index == 0"
                  style="margin-right: 5px"
                  @click="addDetailDataList2"
                >添加</a>
                <a href="javascript:;" v-if="index != 0" @click="removeDetailDataList2(index)">删除</a>
              </span>
              
              <!-- 物料结构 -->
              <span slot="dsBaseDataType" slot-scope="text, record">
                {{ record.dsBaseDataType == 0 ? "结构料" : "电子料" }}
              </span>

              <!-- 部件名称 -->
              <span slot="categoryName" slot-scope="text, record">
                <a-input v-model="record.categoryName" placeholder="部件名称" style="width: 100px"></a-input>
              </span>

              <span
                :slot="tdItem"
                slot-scope="text, record"
                v-for="(tdItem, tdIndex) in TdArr"
                :key="tdIndex"
              >
                <a-input v-model="record[tdItem]" style="width: 100px"></a-input>
              </span>

              <!-- 数量 -->
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

              <!-- 总价 -->
              <span slot="totalPrice" slot-scope="text, record">
                <span class="total-price-display">¥{{ calculateTotalPrice(record, 'internal') }}</span>
              </span>
            </a-table>
          </div>
        </a-row>
      </a-form-model>
    </a-modal>

    <SeachBomModal ref="SeachBomModal" @checkDataSet="checkDataSet"></SeachBomModal>
  </div>
</template>

<script>
import {
  createSmartBomQuote,
  getAllProductList,
  getCategoryTypeData,
  importExcel,
  downloadTemplate
} from "@/services/intelligentQuotation/bomQuotationManagement";
import SeachBomModal from "@/pages/businessCode/quotationManagement/modules/SeachBomModal.vue";

const columns = [
  {
    title: "操作",
    width: "120px",
    dataIndex: "action",
    scopedSlots: {
      customRender: "action"
    }
  },
  {
    title: "物料结构",
    width: "100px",
    dataIndex: "dsBaseDataType",
    scopedSlots: {
      customRender: "dsBaseDataType"
    }
  },
  {
    title: "部件名称",
    width: "120px",
    dataIndex: "categoryName",
    scopedSlots: {
      customRender: "categoryName"
    }
  },
  {
    title: "9NC",
    width: "120px",
    dataIndex: "nineNC",
    scopedSlots: {
      customRender: "nineNC"
    }
  },
  {
    title: "物料名称",
    width: "120px",
    dataIndex: "bomName",
    scopedSlots: {
      customRender: "bomName"
    }
  },
  {
    title: "品牌",
    width: "100px",
    dataIndex: "brand",
    scopedSlots: {
      customRender: "brand"
    }
  },
  {
    title: "型号",
    width: "120px",
    dataIndex: "model",
    scopedSlots: {
      customRender: "model"
    }
  },
  {
    title: "规格",
    width: "120px",
    dataIndex: "specifications",
    scopedSlots: {
      customRender: "specifications"
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
    scopedSlots: {
      customRender: "totalPrice"
    }
  }
];

export default {
  name: "SmartBomQuoteModal",
  components: { SeachBomModal },
  data() {
    return {
      title: "标题",
      uservisible: false,
      confirmLoading: false,
      columns,
      TdArr: ["nineNC", "bomName", "brand", "model", "specifications", "recentPrice"],
      queryFrom: {},
      productList: [],
      detailDataList1: [{ dsBaseDataType: 0, needBomNum: 1 }], // 结构料
      detailDataList2: [{ dsBaseDataType: 1, needBomNum: 1 }], // 电子料
      rules: {
        bomQuoteName: [
          { required: true, message: "请输入报价单名称", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    openModules(type, info) {
      this.detailDataList1 = [{ dsBaseDataType: 0, needBomNum: 1 }];
      this.detailDataList2 = [{ dsBaseDataType: 1, needBomNum: 1 }];
      this.queryFrom = {
        bomQuoteName: "",
        remarks: ""
      };

      // 获取产品列表
      getAllProductList().then(res => {
        if (res.code == 1) {
          this.productList = res.data.items || [];
        }
      });

      if (type == "add") {
        this.title = "新增智能BOM报价单";
      } else {
        this.title = "编辑智能BOM报价单";
        this.queryFrom = { ...info };
      }
      this.uservisible = true;
    },

    SeachBomModalClick(index, type) {
      this.$refs.SeachBomModal.openModules(index, type);
    },

    // 计算总价
    calculateTotalPrice(record, type) {
      let price = 0;
      let quantity = record.needBomNum || 1;
      
      // 使用最近一次采购价
      price = parseFloat(record.recentPrice) || 0;
      
      // 如果都没有，尝试从总价反推单价
      if (price === 0 && record.totalPrice && record.needBomNum) {
        price = parseFloat(record.totalPrice) / parseFloat(record.needBomNum) || 0;
      }
      
      const totalPrice = price * quantity;
      record.totalPrice = totalPrice.toFixed(2);
      return totalPrice.toFixed(2);
    },

    checkDataSet(dataSet) {
      if (dataSet.type == "type1") {
        this.detailDataList1[dataSet.index].nineNC = dataSet.data.nineNC;
        this.detailDataList1[dataSet.index].bomName = dataSet.data.bomName;
        this.detailDataList1[dataSet.index].brand = dataSet.data.brand;
        this.detailDataList1[dataSet.index].model = dataSet.data.model;
        this.detailDataList1[dataSet.index].specifications = dataSet.data.specification;
        this.detailDataList1[dataSet.index].needBomNum = dataSet.data.needBomNum || 1;
        this.detailDataList1[dataSet.index].recentPrice = dataSet.data.recentPrice;
        this.detailDataList1[dataSet.index].totalPrice = dataSet.data.totalPrice;
      } else {
        this.detailDataList2[dataSet.index].nineNC = dataSet.data.nineNC;
        this.detailDataList2[dataSet.index].bomName = dataSet.data.bomName;
        this.detailDataList2[dataSet.index].brand = dataSet.data.brand;
        this.detailDataList2[dataSet.index].model = dataSet.data.model;
        this.detailDataList2[dataSet.index].specifications = dataSet.data.specification;
        this.detailDataList2[dataSet.index].needBomNum = dataSet.data.needBomNum || 1;
        this.detailDataList2[dataSet.index].recentPrice = dataSet.data.recentPrice || dataSet.data.currentPrice;
        this.detailDataList2[dataSet.index].currentPrice = dataSet.data.currentPrice;
        this.detailDataList2[dataSet.index].totalPrice = dataSet.data.totalPrice;
      }
      this.$forceUpdate();
    },

    // 确定
    handleOk() {
      this.$refs.userRefs.validate(valid => {
        if (valid) {
          this.confirmLoading = true;
          this.addSmartBomDataList();
        }
      });
    },

    // 新增结构料
    addDetailDataList1() {
      this.detailDataList1.push({
        dsBaseDataType: 0,
        needBomNum: 1
      });
    },

    // 删除结构料
    removeDetailDataList1(index) {
      this.detailDataList1.splice(index, 1);
    },

    // 新增电子料
    addDetailDataList2() {
      this.detailDataList2.push({
        dsBaseDataType: 1,
        needBomNum: 1
      });
    },

    // 删除电子料
    removeDetailDataList2(index) {
      this.detailDataList2.splice(index, 1);
    },

    handleCancel() {
      this.uservisible = false;
      this.$refs.userRefs.resetFields();
    },

    // 下载模板
    downloadTemplate() {
      downloadTemplate();
    },

    // 导入Excel
    importExcel(resData) {
      let formData = new FormData();
      formData.append("ImportFile", resData.file);
      importExcel(formData).then(response => {
        if (response.code == 1) {
          this.$message.success("导入成功");
          var arr1 = [];
          var arr2 = [];
          response.data.map(item => {
            if (item.dsBaseDataType == 0) {
              arr1.push(item);
            } else {
              arr2.push(item);
            }
          });
          this.detailDataList1 = arr1.length > 0 ? arr1 : [{ dsBaseDataType: 0, needBomNum: 1 }];
          this.detailDataList2 = arr2.length > 0 ? arr2 : [{ dsBaseDataType: 1, needBomNum: 1 }];
        } else {
          this.$message.info(response.msg);
        }
      });
    },

    // 新增智能BOM报价单
    addSmartBomDataList() {
      let params = {
        ...this.queryFrom,
        smartBomQuoteRelations: [...this.detailDataList1, ...this.detailDataList2]
      };

      params.smartBomQuoteRelations.map(item => {
        item.id = "";
      });

      createSmartBomQuote(params)
        .then(res => {
          if (res.code == 1) {
            this.$message.success(res.msg || "新增成功");
            this.$emit("ok");
            this.uservisible = false;
          } else {
            this.$message.error(res.msg);
          }
          this.confirmLoading = false;
        })
        .catch(err => {
          this.confirmLoading = false;
        });
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
.query-button {
  background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
  border: none;
  color: white;
  font-weight: bold;
  font-size: 13px;
  padding: 4px 12px;
  border-radius: 4px;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #40a9ff 0%, #69c0ff 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(24, 144, 255, 0.4);
  }
}

.action-buttons {
  .ant-btn {
    margin-right: 8px;
    
    &.query-btn {
      @extend .query-button;
    }
  }
  
  a {
    color: #666;
    text-decoration: none;
    padding: 4px 8px;
    border-radius: 3px;
    transition: all 0.2s ease;
    
    &:hover {
      color: #1890ff;
      background-color: #f0f8ff;
    }
  }
}

.total-price-display {
  font-weight: bold;
  color: #f5222d;
  font-size: 13px;
}
</style>

