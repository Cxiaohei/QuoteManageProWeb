<template>
  <div>
    <a-modal
      :width="1200"
      :title="title"
      :visible="uservisible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form-model :model="queryFrom" layout="inline" :rules="rules" ref="userRefs">
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
              bordered
            >
              <span slot="action" slot-scope="text, record, index">
                <a
                  href="javascript:;"
                  style="margin-right: 5px"
                  @click="SeachBomModalClick(index,'type1')"
                >查询</a>
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

              <!-- 总价 -->
              <span slot="totalPrice" slot-scope="text, record">
                <a-input v-model="record.totalPrice" style="width: 80px" placeholder="总价" />
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
              bordered
            >
              <span slot="action" slot-scope="text, record, index">
                <a
                  href="javascript:;"
                  style="margin-right: 5px"
                  @click="SeachBomModalClick(index,'type2')"
                >查询</a>
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

              <!-- 总价 -->
              <span slot="totalPrice" slot-scope="text, record">
                <a-input v-model="record.totalPrice" style="width: 80px" placeholder="总价" />
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
    width: "70px",
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
    dataIndex: "categoryName",
    scopedSlots: {
      customRender: "categoryName"
    }
  },
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
    title: "物料代码",
    dataIndex: "bomCode",
    scopedSlots: {
      customRender: "bomCode"
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
    title: "总价",
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
            this.detailDataList1 = [{ dsBaseDataType: 0 }];
          }
          if (arr2.length == 0) {
            this.detailDataList2 = [{ dsBaseDataType: 1 }];
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
    checkDataSet(dataSet) {
      console.log(dataSet);
      if (dataSet.type == "type1") {
        this.detailDataList1[dataSet.index].nineNC = dataSet.data.nineNC;
        this.detailDataList1[dataSet.index].bomName = dataSet.data.bomName;
        this.detailDataList1[dataSet.index].bomCode = dataSet.data.bomCode;
        this.detailDataList1[dataSet.index].bomModel = dataSet.data.bomModel;
        this.detailDataList1[dataSet.index].specification =
          dataSet.data.specification;
        this.detailDataList1[dataSet.index].totalPrice =
          dataSet.data.totalPrice;
      } else {
        this.detailDataList2[dataSet.index].nineNC = dataSet.data.nineNC;
        this.detailDataList2[dataSet.index].bomName = dataSet.data.bomName;
        this.detailDataList2[dataSet.index].bomCode = dataSet.data.bomCode;
        this.detailDataList2[dataSet.index].bomModel = dataSet.data.bomModel;
        this.detailDataList2[dataSet.index].specification =
          dataSet.data.specification;
        this.detailDataList2[dataSet.index].totalPrice =
          dataSet.data.totalPrice;
      }
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
      this.detailDataList1.push({dsBaseDataType: 0});
    },
    //删除表格
    removeDetailDataList1(index) {
      this.detailDataList1.splice(index, 1);
    },
    //新增基础数据
    addDetailDataList2() {
      this.detailDataList2.push({dsBaseDataType: 1});
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
            this.detailDataList1 = [{ dsBaseDataType: 0 }];
          }
          if (arr2.length == 0) {
            this.detailDataList2 = [{ dsBaseDataType: 1 }];
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

<style lang="less" scoped></style>
