<template>
  <div>
    <a-card>
      <div class="queryFromBox">
        <a-descriptions title="基础信息" bordered>
          <a-descriptions-item
            :label="item.label"
            bordered
            v-for="(item, index) in queryFromDataList"
            :key="index"
          >
            <span>{{ queryFrom[item.key] }}</span>
          </a-descriptions-item>
        </a-descriptions>
      </div>
      <a-form-model
        :model="queryFrom"
        layout="inline"
        :label-col="{ span: 8 }"
        :rules="rules"
        ref="userRefs"
      >
        <a-form-item>
          <a-space>
            <h2>导入物料明细</h2>
            <a-upload name="file" :fileList="[]" action :customRequest="importExcel">
              <a-button type="primary" icon="to-top">导入</a-button>
            </a-upload>
            <span @click="downloadTemplate" style="color: #1890ff; cursor: pointer">下载导入模板</span>
          </a-space>
        </a-form-item>
      </a-form-model>
      <!-- {{detailDataList1}} -->
      <div style="padding-top: 20px">
        <h3>
          电子料
          <a-button type="primary" @click="addDetailDataList2">新增</a-button>
        </h3>
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
            <a-popconfirm
              v-if="record.isadd"
              title="确定新增该条数据吗?"
              ok-text="确定"
              cancel-text="取消"
              @confirm="confirmAddList(record)"
            >
              <a href="javascript:;" style="margin-right: 5px">新增</a>
            </a-popconfirm>
            <a href="javascript:;" v-if="record.isadd" @click="removeDetailDataList2(index)">取消</a>

            <a
              href="javascript:;"
              v-if="!record.isadd"
              style="margin-right: 5px"
              @click="editDetailDataList(record)"
            >保存</a>

            <a-popconfirm
              v-if="!record.isadd"
              title="确定删除吗?"
              ok-text="确定"
              cancel-text="取消"
              @confirm="confirmDelete(record.id)"
            >
              <a href="javascript:;">删除</a>
            </a-popconfirm>
          </span>
          <!-- 物料结构 -->
          <span
            slot="dsBaseDataType"
            slot-scope="text, record"
          >{{ record.dsBaseDataType == 0 ? "结构料" : "电子料" }}</span>

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
        <h3>
          结构料
          <a-button type="primary" @click="addDetailDataList1">新增</a-button>
        </h3>
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
            <a-popconfirm
              v-if="record.isadd"
              title="确定新增该条数据吗?"
              ok-text="确定"
              cancel-text="取消"
              @confirm="confirmAddList(record)"
            >
              <a href="javascript:;" style="margin-right: 5px">新增</a>
            </a-popconfirm>
            <a href="javascript:;" v-if="record.isadd" @click="removeDetailDataList1(index)">取消</a>

            <a
              href="javascript:;"
              v-if="!record.isadd"
              style="margin-right: 5px"
              @click="editDetailDataList(record)"
            >保存</a>

            <a-popconfirm
              v-if="!record.isadd"
              title="确定删除吗?"
              ok-text="确定"
              cancel-text="取消"
              @confirm="confirmDelete(record.id)"
            >
              <a href="javascript:;">删除</a>
            </a-popconfirm>
          </span>
          <!-- 物料结构 -->
          <span
            slot="dsBaseDataType"
            slot-scope="text, record"
          >{{ record.dsBaseDataType == 0 ? "结构料" : "电子料" }}</span>

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
                v-for="(Citem, categoryNameindex) in dataSource1"
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
      <h3>保存审批</h3>
      <div>
        <!-- <a-button type="primary" @click="editRdProjectsDetail()" v-if="queryFrom.status==0"
        >保存草稿</a-button
        >-->
        <a-button
          type="primary"
          @click="setShenpiBtn"
          style="margin-left: 15px"
          v-if="queryFrom.status < 2"
        >提交审核</a-button>
        <span v-if="queryFrom.status == 2" style="font-size: xx-large">审批中</span>
        <span v-if="queryFrom.status == 3" style="font-size: xx-large">审批通过</span>
        <span v-if="queryFrom.status == 10" style="font-size: xx-large">审批不通过</span>
        <a-button
          type="primary"
          @click="setShenpiBtn"
          style="margin-left: 15px"
          v-if="queryFrom.status == 10"
        >提交审核</a-button>
        <SetShenPi ref="SetShenPiRef" :auditeType="0" :quoteId="$route.query.id"></SetShenPi>
      </div>
    </a-card>

    <SeachBomModal ref="SeachBomModal" @checkDataSet="checkDataSet"></SeachBomModal>
  </div>
</template>

<script>
import {
  addBomDataList,
  getAllProductList,
  getCategoryTypeData,
  bomfilterApi,
  BomDetailDataList,
  deleteBomDetail,
  addBomDetail,
  editBomDetail,
  importExcel,
  downloadTemplate
  // editBomDataList
} from "@/services/businessCode/quotationManagement/bomQuote";
import cloneDeep from "lodash.clonedeep";
import SetShenPi from "./modules/SetShenPi";

import SeachBomModal from "./modules/SeachBomModal.vue";

const columns = [
  {
    title: "操作",
    width: "140px",
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
  props: {},
  components: { SetShenPi, SeachBomModal },
  data() {
    return {
      title: "标题",
      uservisible: false,
      columns,
      TdArr: ["nineNC", "bomName", "bomModel", "bomCode", "specification"],
      seachData: [], //查询数据
      dataSource1: [], //结构部件名称
      dataSource2: [], //电子部件名称
      queryFrom: {},
      ProductList: [],
      confirmLoading: false,
      queryFromDataList: [
        {
          label: "报价单名称",
          key: "bomQuoteName",
          type: "string"
        },

        {
          label: "客户名称",
          key: "customerName",
          type: "string"
        },
        {
          label: "项目发起人",
          key: "createUserName",
          type: "string"
        },
        {
          label: "研发类型",
          key: "developmentType",
          type: "string"
        },
        {
          label: "产品类型",
          key: "productType",
          type: "string"
        },
        {
          label: "产品",
          key: "productName",
          type: "select"
        },
        {
          label: "备注",
          key: "remarks",
          type: "string"
        }
      ],
      detailDataList1: [],
      detailDataList2: [],
      rules: {
        categoryName: [
          { required: true, message: "请输入类别名称", trigger: "change" }
        ]
      }
    };
  },
  created() {
    this.getDetail();
  },
  methods: {
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
    getDetail() {
      this.detailDataList1 = [];
      this.detailDataList2 = [];
      this.dataSource1 = [];
      this.dataSource2 = [];
      //先重置数据
      this.queryFrom = {
        haveProductDefinitions: true
      };
      BomDetailDataList(this.$route.query.id).then(res => {
        console.log("详情");
        this.queryFrom = res.data;
        console.log(res.data);

        const arr1 = []; //结构料 0
        const arr2 = []; //电子料 1
        res.data.bomQuoteRelations.map(item => {
          if (item.dsBaseDataType == 0) {
            arr1.push(item);
          } else {
            arr2.push(item);
          }
          this.detailDataList1 = arr1;
          this.detailDataList2 = arr2;
          // if (arr1.length == 0) {
          //   this.detailDataList1 = [{ dsBaseDataType: 0 }];
          // }
          // if (arr2.length == 0) {
          //   this.detailDataList2 = [{ dsBaseDataType: 1 }];
          // }
        });
      });

      //获取基础数据 并赋值默认数据
      getCategoryTypeData().then(res => {
        console.log(res.data);
        res.data.map(item => {
          if (item.dsBaseDataType == 0) {
            this.dataSource1.push({
              categoryName: item.categoryName,
              id: item.id
            });
          } else {
            this.dataSource2.push({
              categoryName: item.categoryName,
              id: item.id
            });
          }
        });
      });
      //获取产品列表
      getAllProductList().then(res => {
        this.ProductList = res.data;
      });
    },
    setShenpiBtn() {
      this.$refs.SetShenPiRef.openModules();
    },
    onSelect(value, record, type) {
      console.log("onSelect", value);
      console.log(record);
      console.log(this.seachData);
      let checkObj = {};
      this.seachData.map(Sitem => {
        if (Sitem[type] == value) {
          checkObj = Sitem;
        }
      });
      console.log(checkObj);
      this.TdArr.map(item => {
        if (checkObj[item]) {
          record[item] = checkObj[item];
        } else {
          record[item] = "";
        }
      });
      this.$forceUpdate();
    },
    setShenpi() {
      this.$refs.ShenPiModalRef.openModules();
    },
    //新增
    confirmAddList(record) {
      const params = {
        bomQuoteId: this.$route.query.id,
        bomQuoteRelations: [record]
      };
      params.bomQuoteRelations[0].id = "";
      params.bomQuoteRelations.map(item => {
        item.bomQuoteId = this.$route.query.id;
      });
      addBomDetail(params).then(res => {
        if (res.code == 1) {
          this.$message.success("添加成功");
          this.getDetail();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //删除
    confirmDelete(id) {
      deleteBomDetail(id).then(() => {
        this.$message.success("删除成功");
        this.getDetail();
      });
    },
    //编辑
    editDetailDataList(record) {
      editBomDetail(record).then(() => {
        this.$message.success("编辑成功");
        // this.getDetail();
      });
    },
    onChange(record, type) {
      if (record[type] == "") {
        return false;
      }
      bomfilterApi({ [type]: record[type] }).then(res => {
        console.log(res);
        this.seachData = res.data;
        // var newArr = [];
        // res.data.map(x => newArr.push(x[type]));
        // this.seachData = Array.from(new Set(newArr));
      });
    },
    //新增基础数据
    addDetailDataList1() {
      let hasadd = false;
      this.detailDataList1.map(item => {
        item.isadd == true ? (hasadd = true) : "";
      });
      if (hasadd) {
        this.$message.error("请先保存新增数据");
        return false;
      }
      this.detailDataList1.unshift({ isadd: true, dsBaseDataType: 0 });
    },
    //删除表格
    removeDetailDataList1(index) {
      this.detailDataList1.splice(index, 1);
    },
    //新增基础数据
    addDetailDataList2() {
      let hasadd = false;
      this.detailDataList2.map(item => {
        item.isadd == true ? (hasadd = true) : "";
      });
      if (hasadd) {
        this.$message.error("请先保存新增数据");
        return false;
      }
      this.detailDataList2.unshift({ isadd: true, dsBaseDataType: 1 });
    },
    //删除表格
    removeDetailDataList2(index) {
      this.detailDataList2.splice(index, 1);
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
          const params = {
            bomQuoteId: this.$route.query.id,
            bomQuoteRelations: response.data
          };
          params.bomQuoteRelations[0].id = "";
          params.bomQuoteRelations.map(item => {
            item.bomQuoteId = this.$route.query.id;
          });
          addBomDetail(params).then(res => {
            if (res.code == 1) {
              this.$message.success("导入成功");
              // this.$message.success("添加成功");
              this.getDetail();
            } else {
              this.$message.error(res.msg);
            }
          });
        } else {
          this.$message.info(response.msg);
        }
      });
    },
    // handleCancel() {
    //   this.uservisible = false;
    //   this.$refs.userRefs.resetFields();
    // },
    // //新增基础数据
    // addBomDataList() {
    //   this.logDataSource = [];
    //   let params = {
    //     ...this.queryFrom,
    //     bomQuoteRelations: [...this.detailDataList1, ...this.detailDataList2]
    //   };
    //   addBomDataList(params)
    //     .then(res => {
    //       if (res.code == 1) {
    //         this.$message.success(res.msg);
    //         this.$emit("ok");
    //         this.uservisible = false;
    //       } else {
    //         this.$message.error(res.msg);
    //       }
    //       this.confirmLoading = false;
    //     })
    //     .catch(err => {
    //       this.loading = false;
    //       this.confirmLoading = false;
    //     });
    // },
    // //编辑基础数据
    // editBomDataList() {
    //   this.logDataSource = [];
    //   let params = {
    //     ...this.queryFrom
    //   };
    //   editBomDataList(params)
    //     .then(res => {
    //       if (res.code == 1) {
    //         this.$message.success(res.msg);
    //         this.$emit("ok");
    //         this.uservisible = false;
    //       } else {
    //         this.$message.error(res.msg);
    //       }
    //       this.confirmLoading = false;
    //     })
    //     .catch(err => {
    //       this.loading = false;
    //       this.confirmLoading = false;
    //     });
    // },

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
