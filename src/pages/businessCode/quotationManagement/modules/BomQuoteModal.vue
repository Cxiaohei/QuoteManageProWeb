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
        <a-row :gutter="16">
          <!-- 设置合适的间距 -->
          <!-- 遍历生成表单项 -->
          <a-col :span="8" v-for="(item, index) in queryFromDataList" :key="index">
            <a-form-model-item :label="item.label">
              <!-- 输入框 -->
              <a-input
                v-if="item.type == 'string'"
                v-model="queryFrom[item.key]"
                style="width: 150px"
                :placeholder="item.label"
              ></a-input>
            </a-form-model-item>
          </a-col>

          <!-- 研发报价单 -->
          <a-col :span="8">
            <a-form-model-item label="研发报价单">
              <a-select
                style="width: 150px"
                v-model="queryFrom.developProjectId"
                :disabled="developProjectIdDisabled"
                placeholder="研发报价单"
                @change="developProjectSelect()"
                allowClear
              >
                <a-select-option
                  :value="item.id"
                  v-for="(item, index) in DevelopProjectList"
                  :key="index"
                >{{ item.projectName }}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="客户名称">
              <!-- 输入框 -->
              <a-input v-model="queryFrom.customerName" style="width: 150px" placeholder="客户名称"></a-input>
            </a-form-model-item>
          </a-col>

          <!-- 研发类型 -->
          <a-col :span="8">
            <a-form-model-item label="研发类型">
              <a-select
                v-model="queryFrom.developmentType"
                placeholder="研发类型"
                style="width: 150px"
                allowClear
              >
                <a-select-option
                  :value="item.categoryName"
                  v-for="(item, index) in DevelopmentTypeList"
                  :key="index"
                >{{ item.categoryName }}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>

          <!-- 项目周期 -->
          <a-col :span="12">
            <a-form-model-item label="项目周期">
              <a-range-picker
                v-model.trim="timeArr1"
                style="width: 300px"
                :allowClear="false"
                format="YYYY-MM-DD"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-form-item>
            <a-space>
              <a-upload name="file" :fileList="[]" action :customRequest="importExcel">
                <a-button type="primary" icon="to-top">导入</a-button>
              </a-upload>
              <span @click="downloadTemplate" style="color: #1890ff; cursor: pointer">下载导入模板</span>
            </a-space>
          </a-form-item>
          <!-- {{detailDataList1}} -->
          <div style="padding-top: 20px">
            <h3>结构料</h3>
            <a-table
              :rowKey="
                (data, index) => {
                  return index;
                }
              "
              :columns="columns"
              :dataSource="detailDataList1"
              :pagination="false"
              :scroll="{ x: 1600 }"
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
                {{
                record.dsBaseDataType == 0 ? "结构料" : "电子料"
                }}
              </span>

              <!-- 部件名称 -->
              <span slot="categoryName" slot-scope="text, record">
                <a-select
                  v-model="record.categoryName"
                  style="width: 120px"
                  show-search
                  :filter-option="filterOption"
                  placeholder="部件名称"
                >
                  <a-select-option
                    :value="Citem.categoryName"
                    v-for="(Citem, categoryNameindex) in dataSource1Copy"
                    :key="categoryNameindex"
                  >{{ Citem.categoryName }}</a-select-option>
                </a-select>
              </span>

              <span
                :slot="tdItem"
                slot-scope="text, record"
                v-for="(tdItem, tdIndex) in TdArr"
                :key="tdIndex"
              >
                <a-input v-model="record[tdItem]"></a-input>
                <!-- <a-auto-complete
                  v-model="record[tdItem]"
                  :data-source="seachData"
                  style="width: 100px"
                  placeholder="请输入内容查询"
                  @select="onSelect($event, record, [tdItem])"
                  @search="onSearch(record, [tdItem])"
                  @change="onChange(record, [tdItem])"
                >
                  <template slot="dataSource">
                    <a-select-option
                      v-for="item in seachData"
                      :key="item.id"
                      :value="item[tdItem]"
                      >{{ item[tdItem] }}</a-select-option
                    >
                  </template>
                </a-auto-complete>-->
              </span>

              <!-- 数量 -->
              <span slot="needBomNum" slot-scope="text, record">
                <a-input-number
                  v-model="record.needBomNum"
                  :min="1"
                  :max="999999"
                  size="small"
                  style="width: 60px"
                  @change="onQuantityChange(record, 'internal')"
                  placeholder="数量"
                />
              </span>

              <!-- 总价 -->
              <span slot="totalPrice" slot-scope="text, record">
                <span class="total-price-display">¥{{ record.totalPrice || '0.00' }}</span>
              </span>
            </a-table>
          </div>

          <div style="padding-top: 20px">
            <h3>电子料</h3>
            <a-table
              :rowKey="
                (data, index) => {
                  return index;
                }
              "
              :columns="columns"
              :dataSource="detailDataList2"
              :pagination="false"
              :scroll="{ x: 1600 }"
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
                {{
                record.dsBaseDataType == 0 ? "结构料" : "电子料"
                }}
              </span>

              <!-- 部件名称 -->
              <span slot="categoryName" slot-scope="text, record">
                <a-select
                  v-model="record.categoryName"
                  style="width: 120px"
                  show-search
                  :filter-option="filterOption"
                  placeholder="部件名称"
                >
                  <a-select-option
                    :value="Citem.categoryName"
                    v-for="(Citem, categoryNameindex) in dataSource2"
                    :key="categoryNameindex"
                  >{{ Citem.categoryName }}</a-select-option>
                </a-select>
              </span>

              <span
                :slot="tdItem"
                slot-scope="text, record"
                v-for="(tdItem, tdIndex) in TdArr"
                :key="tdIndex"
              >
                <a-input v-model="record[tdItem]"></a-input>
                <!-- <a-auto-complete
                  v-model="record[tdItem]"
                  :data-source="seachData"
                  style="width: 100px"
                  placeholder="请输入内容查询"
                  @select="onSelect($event, record, [tdItem])"
                  @search="onSearch(record, [tdItem])"
                  @change="onChange(record, [tdItem])"
                >
                  <template slot="dataSource">
                    <a-select-option
                      v-for="item in seachData"
                      :key="item.id"
                      :value="item[tdItem]"
                    >{{ item[tdItem] }}</a-select-option>
                  </template>
                </a-auto-complete>-->
              </span>

              <!-- 数量 -->
              <span slot="needBomNum" slot-scope="text, record">
                <a-input-number
                  v-model="record.needBomNum"
                  :min="1"
                  :max="999999"
                  size="small"
                  style="width: 60px"
                  @change="onQuantityChange(record, 'external')"
                  placeholder="数量"
                />
              </span>

              <!-- 总价 -->
              <span slot="totalPrice" slot-scope="text, record">
                <span class="total-price-display">¥{{ record.totalPrice || '0.00' }}</span>
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
  addBomDataList,
  getAllProductList,
  getCategoryTypeData,
  bomfilterApi,
  importExcel,
  downloadTemplate
  // editBomDataList
} from "@/services/businessCode/quotationManagement/bomQuote";
import { getPageListTypeSelect } from "@/services/basicsSeting/productXian";
import { getDevelopmentTypeListSelect } from "@/services/basicsSeting/developmentType";
import { getAlldevelopProjectList } from "@/services/businessCode/quotationManagement/rdProjects";
import cloneDeep from "lodash.clonedeep";

import SeachBomModal from "./SeachBomModal.vue";

const columns = [
  {
    title: "操作",
    width: 140,
    dataIndex: "action",
    fixed: "left",
    scopedSlots: {
      customRender: "action"
    }
  },
  {
    title: "物料结构",
    width: 100,
    dataIndex: "dsBaseDataType",
    scopedSlots: {
      customRender: "dsBaseDataType"
    }
  },
  {
    title: "部件名称",
    width: 150,
    dataIndex: "categoryName",
    ellipsis: true,
    scopedSlots: {
      customRender: "categoryName"
    }
  },
  {
    title: "9NC",
    width: 120,
    dataIndex: "nineNC",
    ellipsis: true,
    scopedSlots: {
      customRender: "nineNC"
    }
  },
  {
    title: "物料名称",
    width: 280,
    dataIndex: "bomName",
    ellipsis: true,
    scopedSlots: {
      customRender: "bomName"
    }
  },
  {
    title: "物料代码",
    width: 150,
    dataIndex: "bomCode",
    ellipsis: true,
    scopedSlots: {
      customRender: "bomCode"
    }
  },
  {
    title: "型号",
    width: 180,
    dataIndex: "bomModel",
    ellipsis: true,
    scopedSlots: {
      customRender: "bomModel"
    }
  },
  {
    title: "规格",
    width: 150,
    dataIndex: "specification",
    ellipsis: true,
    scopedSlots: {
      customRender: "specification"
    }
  },
  {
    title: "数量",
    width: 80,
    dataIndex: "needBomNum",
    scopedSlots: {
      customRender: "needBomNum"
    }
  },
  {
    title: "总价",
    width: 120,
    fixed: "right",
    dataIndex: "totalPrice",
    scopedSlots: {
      customRender: "totalPrice"
    }
  }
];

export default {
  name: "customerModal",
  components: { SeachBomModal },
  props: {
    dsProductsId: String,
    developProjectId: String
  },
  data() {
    return {
      timeArr1: [],
      DevelopmentTypeList: [], // 研发类型
      ProductTypeList: [], // 产品类型
      title: "标题",
      uservisible: false,
      developProjectIdDisabled: false,
      dsProductsIdDisabled: false,
      columns,
      TdArr: ["nineNC", "bomName", "bomModel", "bomCode", "specification"],
      seachData: [], //查询数据
      dataSource1: [], //结构部件名称
      dataSource2: [], //电子部件名称
      queryFrom: {},
      ProductList: [],
      DevelopProjectList: [],
      confirmLoading: false,
      dataSource1Copy: [],
      queryFromDataList: [
        {
          label: "报价单名称",
          key: "bomQuoteName",
          type: "string"
        },
        // {
        //   label: "物料种类",
        //   key: "bomNum",
        //   type: "string"
        // },
        // {
        //   label: "电子料种",
        //   key: "electronicNum",
        //   type: "string"
        // },
        // {
        //   label: "结构料种",
        //   key: "structuralNum",
        //   type: "string"
        // },
        // {
        //   label: "创建人姓名",
        //   key: "createUserName",
        //   type: "string"
        // },
        // {
        //   label: "电子料总价",
        //   key: "electronicMoney",
        //   type: "string"
        // },
        // {
        //   label: "结构料总价",
        //   key: "structuralMoney",
        //   type: "string"
        // },
        // {
        //   label: "研发报价单",
        //   key: "developProjectId",
        //   type: "select"
        // },
        // {
        //   label: "产品",
        //   key: "dsProductsId",
        //   type: "select"
        // },
        {
          label: "备注",
          key: "remarks",
          type: "string"
        }
        // {
        //   label: "软件开发",
        //   key: "haveSoftware",
        //   type: "boolean"
        // }
      ],
      detailDataList1: [{}],
      detailDataList2: [{}],
      rules: {
        categoryName: [
          { required: true, message: "请输入类别名称", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    openModules(type, info) {
      this.detailDataList1 = [];
      this.detailDataList2 = [];
      this.dataSource1 = [];
      this.dataSource2 = [];
      //先重置数据
      this.queryFrom = {
        haveProductDefinitions: true
      };
      //获取基础数据 并赋值默认数据
      getCategoryTypeData().then(res => {
        const arr1 = []; //结构料 0
        const arr2 = []; //电子料 1
        res.data.map(item => {
          if (item.dsBaseDataType == 0) {
            arr1.push(item);
            this.dataSource1.push({
              categoryName: item.categoryName,
              id: item.id
            });
          } else {
            arr2.push(item);
            this.dataSource2.push({
              categoryName: item.categoryName,
              id: item.id
            });
          }
          this.detailDataList1 = arr1;
          this.detailDataList2 = arr2;


          this.dataSource1Copy = cloneDeep(this.dataSource1);
          if (arr1.length == 0) {
            this.detailDataList1 = [{
              dsBaseDataType: 0,
              needBomNum: 1,
              nineNC: '',
              bomName: '',
              bomCode: '',
              bomModel: '',
              specification: '',
              categoryName: '',
              recentPrice: 0,
              totalPrice: '0.00'
            }];
          }
          if (arr2.length == 0) {
            this.detailDataList2 = [{
              dsBaseDataType: 1,
              needBomNum: 1,
              nineNC: '',
              bomName: '',
              bomCode: '',
              bomModel: '',
              specification: '',
              categoryName: '',
              currentPrice: 0,
              recentPrice: 0,
              totalPrice: '0.00'
            }];
          }
          
          this.detailDataList1.length = 1;
          this.detailDataList2.length = 1;
        });
      });
      //获取产品列表
      getAllProductList().then(res => {
        this.ProductList = res.data;

        //有产品复默认值
        if (this.dsProductsId) {
          this.queryFrom.dsProductsId = this.dsProductsId;
          this.dsProductsIdDisabled = true;
        }
      });
      //获取研发报价列表
      getAlldevelopProjectList().then(res => {
        this.DevelopProjectList = res.data;
        //有研发报价单复默认值
        if (this.developProjectId) {
          this.queryFrom.developProjectId = this.developProjectId;
          this.developProjectIdDisabled = true;
        }
      });
      if (type == "add") {
        this.title = "新增";
        // 获取当前登录用户信息并填充报价单名称
        const currentUser = this.$store.getters['account/user'];
        if (currentUser && currentUser.name) {
          this.queryFrom.bomQuoteName = currentUser.name;
        }
      } else {
        this.title = "编辑";
        this.queryFrom = cloneDeep(info);
      }
      this.uservisible = true;
      getPageListTypeSelect().then(res => {
        this.ProductTypeList = res.data;
      });

      getDevelopmentTypeListSelect().then(res => {
        this.DevelopmentTypeList = res.data;
      });
    },
    SeachBomModalClick(index, type) {
      this.$refs.SeachBomModal.openModules(index, type);
    },
    // 计算总价 - 只计算不修改
    calculateTotalPrice(record, type) {
      let price = 0;
      let quantity = record.needBomNum || 1;
      
      // 根据类型选择价格来源
      if (type === 'internal') {
        // 结构料：优先使用 recentPrice，如果为0则尝试使用电子料字段
        if (record.recentPrice && parseFloat(record.recentPrice) > 0) {
          price = parseFloat(record.recentPrice);
        } else if (record.currentPrice && parseFloat(record.currentPrice) > 0) {
          price = parseFloat(record.currentPrice);
        } else if (record.currentAvailablePrice && parseFloat(record.currentAvailablePrice) > 0) {
          price = parseFloat(record.currentAvailablePrice);
        }
      } else {
        // 电子料：优先使用当前价格，然后是最近一次采购价
        price = parseFloat(record.currentPrice) || parseFloat(record.currentAvailablePrice) || parseFloat(record.recentPrice) || 0;
      }
      
      const totalPrice = price * quantity;
      return totalPrice.toFixed(2);
    },
    
    // 数量改变时更新总价
    onQuantityChange(record, type) {
      console.log('=== 数量改变事件触发 ===', {
        type: type,
        '改变前数量': record.needBomNum,
        'recentPrice': record.recentPrice,
        'currentPrice': record.currentPrice,
        'currentAvailablePrice': record.currentAvailablePrice,
        '改变前总价': record.totalPrice
      });
      
      let unitPrice = 0;
      const quantity = parseInt(record.needBomNum) || 1;
      
      if (type === 'internal') {
        // 结构料：优先使用 recentPrice，如果为0则尝试使用电子料字段
        if (record.recentPrice && parseFloat(record.recentPrice) > 0) {
          unitPrice = parseFloat(record.recentPrice);
        } else if (record.currentPrice && parseFloat(record.currentPrice) > 0) {
          unitPrice = parseFloat(record.currentPrice);
          console.warn('⚠️ 结构料使用了电子料的价格字段 currentPrice');
        } else if (record.currentAvailablePrice && parseFloat(record.currentAvailablePrice) > 0) {
          unitPrice = parseFloat(record.currentAvailablePrice);
          console.warn('⚠️ 结构料使用了电子料的价格字段 currentAvailablePrice');
        }
      } else {
        // 电子料使用 currentPrice
        unitPrice = parseFloat(record.currentPrice) || parseFloat(record.currentAvailablePrice) || parseFloat(record.recentPrice) || 0;
      }
      
      const totalPrice = (unitPrice * quantity).toFixed(2);
      this.$set(record, 'totalPrice', totalPrice);
      
      console.log('=== 数量改变后结果 ===', {
        数量: quantity,
        单价: unitPrice,
        总价: totalPrice
      });
      
      // 强制更新视图
      this.$forceUpdate();
    },
    
    checkDataSet(dataSet) {
      console.log('=== 接收到的完整物料数据 ===', JSON.stringify(dataSet, null, 2));
      
      if (dataSet.type == "type1") {
        // 结构料
        const index = dataSet.index;
        const data = dataSet.data;
        
        console.log('=== 结构料原始数据 ===', {
          needBomNum: data.needBomNum,
          recentPrice: data.recentPrice,
          totalPrice: data.totalPrice,
          '所有字段': Object.keys(data)
        });
        
        // 使用 $set 确保响应式更新 - 基本信息
        this.$set(this.detailDataList1[index], 'nineNC', data.nineNC || '');
        this.$set(this.detailDataList1[index], 'bomName', data.bomName || '');
        this.$set(this.detailDataList1[index], 'bomCode', data.bomCode || '');
        this.$set(this.detailDataList1[index], 'bomModel', data.bomModel || '');
        this.$set(this.detailDataList1[index], 'specification', data.specification || '');
        this.$set(this.detailDataList1[index], 'categoryName', data.categoryName || '');
        
        // 设置数量（确保是数字）
        const needBomNum = parseInt(data.needBomNum) || 1;
        this.$set(this.detailDataList1[index], 'needBomNum', needBomNum);
        
        // 设置价格字段（确保是数字）
        // 优先级：recentPrice > currentPrice > currentAvailablePrice > 从总价反推
        let recentPrice = 0;
        if (data.recentPrice !== null && data.recentPrice !== undefined && data.recentPrice !== '' && parseFloat(data.recentPrice) > 0) {
          recentPrice = parseFloat(data.recentPrice);
        } else if (data.currentPrice !== null && data.currentPrice !== undefined && data.currentPrice !== '' && parseFloat(data.currentPrice) > 0) {
          // 如果结构料没有价格，尝试使用电子料的价格字段
          recentPrice = parseFloat(data.currentPrice);
          console.warn('⚠️ 结构料使用了电子料的价格字段 currentPrice');
        } else if (data.currentAvailablePrice !== null && data.currentAvailablePrice !== undefined && data.currentAvailablePrice !== '' && parseFloat(data.currentAvailablePrice) > 0) {
          recentPrice = parseFloat(data.currentAvailablePrice);
          console.warn('⚠️ 结构料使用了电子料的价格字段 currentAvailablePrice');
        } else if (data.totalPrice && needBomNum > 0) {
          // 如果没有单价，尝试从总价反推
          recentPrice = parseFloat(data.totalPrice) / needBomNum;
        }
        
        // 确保价格是有效数字
        if (isNaN(recentPrice)) {
          recentPrice = 0;
        }
        
        this.$set(this.detailDataList1[index], 'recentPrice', recentPrice);
        
        // 计算并设置总价
        const totalPrice = recentPrice * needBomNum;
        this.$set(this.detailDataList1[index], 'totalPrice', totalPrice.toFixed(2));
        
        console.log('=== 结构料处理结果 ===', {
          needBomNum: needBomNum,
          recentPrice: recentPrice,
          totalPrice: totalPrice.toFixed(2),
          '当前行数据': this.detailDataList1[index]
        });
        
      } else {
        // 电子料
        const index = dataSet.index;
        const data = dataSet.data;
        
        console.log('=== 电子料原始数据 ===', {
          needBomNum: data.needBomNum,
          currentPrice: data.currentPrice,
          recentPrice: data.recentPrice,
          currentAvailablePrice: data.currentAvailablePrice,
          totalPrice: data.totalPrice,
          '所有字段': Object.keys(data)
        });
        
        // 使用 $set 确保响应式更新 - 基本信息
        this.$set(this.detailDataList2[index], 'nineNC', data.nineNC || '');
        this.$set(this.detailDataList2[index], 'bomName', data.bomName || '');
        this.$set(this.detailDataList2[index], 'bomCode', data.bomCode || '');
        this.$set(this.detailDataList2[index], 'bomModel', data.bomModel || '');
        this.$set(this.detailDataList2[index], 'specification', data.specification || '');
        this.$set(this.detailDataList2[index], 'categoryName', data.categoryName || '');
        
        // 设置数量（确保是数字）
        const needBomNum = parseInt(data.needBomNum) || 1;
        this.$set(this.detailDataList2[index], 'needBomNum', needBomNum);
        
        // 电子料价格处理：优先级 currentPrice > currentAvailablePrice > recentPrice
        let unitPrice = 0;
        if (data.currentPrice !== null && data.currentPrice !== undefined && data.currentPrice !== '') {
          unitPrice = parseFloat(data.currentPrice);
        } else if (data.currentAvailablePrice !== null && data.currentAvailablePrice !== undefined && data.currentAvailablePrice !== '') {
          unitPrice = parseFloat(data.currentAvailablePrice);
        } else if (data.recentPrice !== null && data.recentPrice !== undefined && data.recentPrice !== '') {
          unitPrice = parseFloat(data.recentPrice);
        } else if (data.totalPrice && needBomNum > 0) {
          // 如果没有单价，尝试从总价反推
          unitPrice = parseFloat(data.totalPrice) / needBomNum;
        }
        
        // 确保价格是有效数字
        if (isNaN(unitPrice)) {
          unitPrice = 0;
        }
        
        this.$set(this.detailDataList2[index], 'currentPrice', unitPrice);
        this.$set(this.detailDataList2[index], 'recentPrice', unitPrice);
        
        // 计算并设置总价
        const totalPrice = unitPrice * needBomNum;
        this.$set(this.detailDataList2[index], 'totalPrice', totalPrice.toFixed(2));
        
        console.log('=== 电子料处理结果 ===', {
          needBomNum: needBomNum,
          unitPrice: unitPrice,
          totalPrice: totalPrice.toFixed(2),
          '当前行数据': this.detailDataList2[index]
        });
      }
      
      // 强制更新视图
      this.$forceUpdate();
    },
    onSearch(record, type) {
      bomfilterApi({ type: record[type] }).then(res => {});
      // this.seachData = !searchText
      //   ? []
      //   : [searchText, searchText.repeat(2), searchText.repeat(3)];
    },
    onSelect(value, record, type) {
      let checkObj = {};
      this.seachData.map(Sitem => {
        if (Sitem[type] == value) {
          checkObj = Sitem;
        }
      });
      this.TdArr.map(item => {
        if (checkObj[item]) {
          record[item] = checkObj[item];
        } else {
          record[item] = "";
        }
      });
      this.$forceUpdate();
    },
    developProjectSelect() {
      if (this.queryFrom.developProjectId) {
        var devData = this.DevelopProjectList.filter(
          x => x.id == this.queryFrom.developProjectId
        );
        this.queryFrom.productType = devData[0].productType;
        this.queryFrom.developmentType = devData[0].developmentType;
        this.queryFrom.customerName = devData[0].customerName;
        this.timeArr1 = [
          this.$moment(devData[0].startTime, "YYYY-MM-DD"),
          this.$moment(devData[0].endTime, "YYYY-MM-DD")
        ];
      }
    },
    onChange(record, type) {
      if (record[type] == "") {
        return false;
      }
      bomfilterApi({ [type]: record[type] }).then(res => {
        this.seachData = res.data;
        // var newArr = [];
        // res.data.map(x => newArr.push(x[type]));
        // this.seachData = Array.from(new Set(newArr));
      });
    },
    // 确定
    handleOk() {
      this.$refs.userRefs.validate(valid => {
        if (valid) {
          this.confirmLoading = true;
          if (this.title == "新增") {
            this.addBomDataList();
          } else {
            this.editBomDataList();
          }
        }
      });
    },
    //新增基础数据
    addDetailDataList1() {
      this.detailDataList1.push({
        dsBaseDataType: 0,
        needBomNum: 1,
        nineNC: '',
        bomName: '',
        bomCode: '',
        bomModel: '',
        specification: '',
        categoryName: '',
        recentPrice: 0,
        totalPrice: '0.00'
      });
    },
    //删除表格
    removeDetailDataList1(index) {
      this.detailDataList1.splice(index, 1);
    },
    //新增基础数据
    addDetailDataList2() {
      this.detailDataList2.push({
        dsBaseDataType: 1,
        needBomNum: 1,
        nineNC: '',
        bomName: '',
        bomCode: '',
        bomModel: '',
        specification: '',
        categoryName: '',
        currentPrice: 0,
        recentPrice: 0,
        totalPrice: '0.00'
      });
    },
    //删除表格
    removeDetailDataList2(index) {
      this.detailDataList2.splice(index, 1);
    },
    handleCancel() {
      this.uservisible = false;
      this.$refs.userRefs.resetFields();
    },
    //下载模板
    downloadTemplate() {
      downloadTemplate();
    },
    //导入
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
          this.detailDataList1 = arr1;
          this.detailDataList2 = arr2;
          if (arr1.length == 0) {
            this.detailDataList1 = [{ dsBaseDataType: 0, needBomNum: 1 }];
          }
          if (arr2.length == 0) {
            this.detailDataList2 = [{ dsBaseDataType: 1, needBomNum: 1 }];
          }
          // this.detailDataList1 = this.detailDataList1.concat(arr1);
          // this.detailDataList2 = this.detailDataList2.concat(arr2);

          // this.getPageList();
        } else {
          this.$message.info(response.msg);
        }
      });
    },
    //新增基础数据
    addBomDataList() {
      this.logDataSource = [];
      let params = {
        ...this.queryFrom,
        bomQuoteRelations: [...this.detailDataList1, ...this.detailDataList2]
      };
      if (this.timeArr1 && this.timeArr1.length > 0) {
        params.startTime = this.timeArr1[0];
        params.endTime = this.timeArr1[1];
      }
      if (this.$route.path == "/quotationManagement/odmQuoteDetail") {
        params.odmQuoteId = this.$route.query.id;
      }
      params.bomQuoteRelations.map(item => {
        item.id = "";
      });
      addBomDataList(params)
        .then(res => {
          if (res.code == 1) {
            this.$message.success(res.msg);
            if (this.$route.path == "/quotationManagement/odmQuoteDetail") {
              this.$router.push({
                path: "bomQuoteDetail",
                query: {
                  id: res.data.id
                }
              });
            }
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
    editBomDataList() {
      this.logDataSource = [];
      let params = {
        ...this.queryFrom
      };
      if (this.timeArr1 && this.timeArr1.length > 0) {
        params.startTime = this.timeArr1[0];
        params.endTime = this.timeArr1[1];
      }
      editBomDataList(params)
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
  position: relative;
  overflow: hidden;
  animation: pulse-glow 2s infinite;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, #1890ff, #40a9ff, #69c0ff, #1890ff);
    border-radius: 6px;
    z-index: -1;
    animation: border-glow 2s linear infinite;
  }
  
  &:hover {
    background: linear-gradient(135deg, #40a9ff 0%, #69c0ff 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(24, 144, 255, 0.4);
    
    &::before {
      left: 100%;
    }
    
    &::after {
      animation: border-glow 1s linear infinite;
    }
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(24, 144, 255, 0.3);
  }
  
  &:focus {
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 5px rgba(24, 144, 255, 0.3);
  }
  50% {
    box-shadow: 0 0 15px rgba(24, 144, 255, 0.6);
  }
}

@keyframes border-glow {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.action-buttons {
  .ant-btn {
    margin-right: 8px;
    
    &.query-btn {
      @extend .query-button;
    }
  }
  
  // 为其他按钮添加样式
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

// 表格操作列样式优化
.ant-table-tbody {
  .action-buttons {
    display: flex;
    align-items: center;
    gap: 4px;
  }
}

// 总价显示样式
.total-price-display {
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
