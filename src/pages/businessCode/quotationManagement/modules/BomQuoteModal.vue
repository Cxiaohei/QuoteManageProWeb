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
      <a-form-model
        :model="queryFrom"
        layout="inline"
        :label-col="{ span: 8 }"
        :rules="rules"
        ref="userRefs"
      >
        <a-form-model-item
          style="width: 31%"
          v-for="(item, index) in queryFromDataList"
          :key="index"
          :label="item.label"
        >
          <!-- 布尔 -->
          <a-switch v-model="queryFrom[item.key]" v-if="item.type == 'boolean'" />
          <!-- 输入框 -->
          <a-input
            v-else-if="item.type == 'string'"
            v-model="queryFrom[item.key]"
            style="width: 150px"
            :placeholder="item.label"
          ></a-input>
          <!-- 产品下拉 -->
          <a-select
            v-else-if="item.label == '产品'"
            v-model="queryFrom[item.key]"
            style="width: 150px"
            :placeholder="item.label"
            allowClear
          >
            <a-select-option
              :value="item.id"
              v-for="(item,index) in ProductList"
              :key="index"
            >{{item.productName}}</a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
      {{detailDataList1}}
      <div style="padding-top:20px">
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
              v-if="index == 0"
              style="margin-right: 5px"
              @click="addDetailDataList1"
            >添加</a>
            <a href="javascript:;" v-if="index != 0" @click="removeDetailDataList1(index)">删除</a>
          </span>
          <!-- 物料结构 -->
          <span
            slot="dsBaseDataType"
            slot-scope="text, record"
          >{{ record.dsBaseDataType == 0 ?"结构料":"电子料" }}</span>

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
                v-for="(Citem,categoryNameindex) in dataSource1"
                :key="categoryNameindex"
              >{{ Citem.categoryName }}</a-select-option>
            </a-select>
          </span>

          <span
            :slot="tdItem"
            slot-scope="text, record"
            v-for="(tdItem,tdIndex) in TdArr"
            :key="tdIndex"
          >
            <a-auto-complete
              v-model="record[tdItem]"
              :data-source="seachData"
              style="width: 100px"
              placeholder="请输入内容查询"
              @select="onSelect($event,record,[tdItem])"
              @search="onSearch(record,[tdItem])"
              @change="onChange(record,[tdItem])"
            >
              <template slot="dataSource">
                <a-select-option
                  v-for="item in seachData"
                  :key="item.id"
                  :value="item[tdItem]"
                >{{ item[tdItem] }}</a-select-option>
              </template>
            </a-auto-complete>
          </span>

          <!-- 总价 -->
          <span slot="totalPrice" slot-scope="text, record">
            <a-input v-model="record.totalPrice" style="width: 80px" placeholder="总价" />
          </span>
        </a-table>
      </div>

      <div style="padding-top:20px">
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
              v-if="index == 0"
              style="margin-right: 5px"
              @click="addDetailDataList2"
            >添加</a>
            <a href="javascript:;" v-if="index != 0" @click="removeDetailDataList2(index)">删除</a>
          </span>
          <!-- 物料结构 -->
          <span
            slot="dsBaseDataType"
            slot-scope="text, record"
          >{{ record.dsBaseDataType == 0 ?"结构料":"电子料" }}</span>

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
                v-for="(Citem,categoryNameindex) in dataSource2"
                :key="categoryNameindex"
              >{{ Citem.categoryName }}</a-select-option>
            </a-select>
          </span>

          <span
            :slot="tdItem"
            slot-scope="text, record"
            v-for="(tdItem,tdIndex) in TdArr"
            :key="tdIndex"
          >
            <a-auto-complete
              v-model="record[tdItem]"
              :data-source="seachData"
              style="width: 100px"
              placeholder="请输入内容查询"
              @select="onSelect($event,record,[tdItem])"
              @search="onSearch(record,[tdItem])"
              @change="onChange(record,[tdItem])"
            >
              <template slot="dataSource">
                <a-select-option
                  v-for="item in seachData"
                  :key="item.id"
                  :value="item[tdItem]"
                >{{ item[tdItem] }}</a-select-option>
              </template>
            </a-auto-complete>
          </span>

          <!-- 总价 -->
          <span slot="totalPrice" slot-scope="text, record">
            <a-input v-model="record.totalPrice" style="width: 80px" placeholder="总价" />
          </span>
        </a-table>
      </div>
    </a-modal>
  </div>
</template>

<script>
import {
  addBomDataList,
  getAllProductList,
  getCategoryTypeData,
  bomfilterApi
  // editBomDataList
} from "@/services/businessCode/quotationManagement/bomQuote";
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
          key: "bomQuoteNo",
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
        {
          label: "产品",
          key: "dsProductsId",
          type: "select"
        },
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
        console.log(res.data);
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
          if (arr1.length == 0) {
            this.detailDataList1 = [{ dsBaseDataType: 0 }];
          }
          if (arr2.length == 0) {
            this.detailDataList2 = [{ dsBaseDataType: 1 }];
          }
        });
      });
      //获取产品列表
      getAllProductList().then(res => {
        this.ProductList = res.data;
      });
      if (type == "add") {
        this.title = "新增";
      } else {
        this.title = "编辑";
        this.queryFrom = cloneDeep(info);
      }
      this.uservisible = true;
    },
    onSearch(record, type) {
      bomfilterApi({ type: record[type] }).then(res => {
        console.log(res);
      });
      // this.seachData = !searchText
      //   ? []
      //   : [searchText, searchText.repeat(2), searchText.repeat(3)];
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
      this.detailDataList1.push({});
    },
    //删除表格
    removeDetailDataList1(index) {
      this.detailDataList1.splice(index, 1);
    },
    //新增基础数据
    addDetailDataList2() {
      this.detailDataList2.push({});
    },
    //删除表格
    removeDetailDataList2(index) {
      this.detailDataList2.splice(index, 1);
    },
    handleCancel() {
      this.uservisible = false;
      this.$refs.userRefs.resetFields();
    },
    //新增基础数据
    addBomDataList() {
      this.logDataSource = [];
      let params = {
        ...this.queryFrom,
        bomQuoteRelations: [...this.detailDataList1, ...this.detailDataList2]
      };
      addBomDataList(params)
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
    editBomDataList() {
      this.logDataSource = [];
      let params = {
        ...this.queryFrom
      };
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
