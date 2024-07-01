<template>
  <div>
    <a-card>
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
            style="width: 250px"
            :placeholder="item.label"
          ></a-input>
          <!-- 产品下拉 -->
          <a-select
            v-else-if="item.label == '产品'"
            v-model="queryFrom[item.key]"
            style="width: 250px"
            :placeholder="item.label"
            allowClear
          >
            <a-select-option
              :value="item.id"
              v-for="(item,index) in ProductList"
              :key="index"
            >{{item.productNo}}</a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>

      <div style="padding-top: 30px;">
        <h3>
          研发项目
          <a-button type="primary" @click="addOdmRdProjects">添加</a-button>
        </h3>
        <a-table :columns="columns1" :data-source="data11" :pagination="false">
          <span slot="action" slot-scope="text, record">
            <a
              href="javascript:;"
              @click="RdProjectsDetail(record, 'detail')"
              style="margin-right: 5px;"
            >详情</a>
          </span>
        </a-table>
      </div>
      <div style="padding-top: 30px;">
        <h3>
          BOM报价
          <a-button type="primary" @click="addBomQuote">添加</a-button>
        </h3>
        <a-table :columns="columns2" :data-source="data22" :pagination="false">
          <span slot="action" slot-scope="text, record">
            <a
              href="javascript:;"
              @click="bomDetail(record, 'detail')"
              style="margin-right: 5px;"
            >详情</a>
          </span>
        </a-table>
      </div>
    </a-card>

    <OdmRdProjectsModal ref="OdmRdProjectsModalRefs" @ok="getDetail"></OdmRdProjectsModal>
    <BomQuoteModal ref="BomQuoteModalRefs" @ok="getDetail"></BomQuoteModal>
  </div>
</template>

<script>
import {
  getAllProductList,
  OdmDetailDataList,
  getRdProjectsDetail,
  BomDetailDataList
} from "@/services/businessCode/quotationManagement/odmQuote";
import OdmRdProjectsModal from "./modules/OdmRdProjectsModal.vue";
import BomQuoteModal from "./modules/BomQuoteModal.vue";

import cloneDeep from "lodash.clonedeep";

const columns1 = [
  {
    width: 100,
    title: "操作",
    scopedSlots: {
      customRender: "action"
    }
  },
  {
    title: "项目名",
    dataIndex: "projectName",
    key: "projectName"
  },
  {
    title: "发起人",
    dataIndex: "createUserName",
    key: "createUserName"
  }
];
const columns2 = [
  {
    width: 100,
    title: "操作",
    scopedSlots: {
      customRender: "action"
    }
  },
  {
    dataIndex: "bomQuoteNo",
    title: "报价单名称"
  },
  {
    title: "产品",
    dataIndex: "productNo",
    key: "productNo"
  },
  {
    title: "备注",
    dataIndex: "remarks",
    key: "remarks"
  }
];

export default {
  name: "customerModal",
  components: { OdmRdProjectsModal, BomQuoteModal },
  props: {},
  data() {
    return {
      title: "标题",
      queryFrom: {},
      ProductList: [],
      confirmLoading: false,
      queryFromDataList: [
        {
          label: "ODM编号",
          key: "odmQuoteNo",
          type: "string"
        },
        {
          label: "ODM名称",
          key: "odmQuoteName",
          type: "string"
        },
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
      rules: {
        categoryName: [
          { required: true, message: "请输入类别名称", trigger: "change" }
        ]
      },
      columns1,
      columns2,
      data11: [],
      data22: [],
      developProjectId: "",
      bomQuoteId: ""
    };
  },
  created() {
    this.getDetail();
  },
  methods: {
    getDetail() {
      //先重置数据
      this.queryFrom = {
        haveProductDefinitions: true
      };
      OdmDetailDataList(this.$route.query.id).then(res => {
        console.log("详情");
        this.queryFrom = res.data;
        console.log(res.data);
        this.developProjectId = res.data.developProjectId;
        this.bomQuoteId = res.data.bomQuoteId;
        // console.log("项目详情");
        getRdProjectsDetail(res.data.developProjectId).then(resDev => {
          console.log(resDev.data);
          this.data11 = [resDev.data];
        });
        // console.log("BOM详情");
        BomDetailDataList(res.data.bomQuoteId).then(resBom => {
          console.log(resBom.data);
          this.data22 = [resBom.data];
        });
      });

      //获取产品列表
      getAllProductList().then(res => {
        this.ProductList = res.data;
      });
    },
    addOdmRdProjects() {
      this.$refs.OdmRdProjectsModalRefs.openModules(
        "add",
        this.developProjectId
      );
    },
    addBomQuote() {
      this.$refs.BomQuoteModalRefs.openModules("add");
    },
    //项目详情
    RdProjectsDetail(record) {
      this.$router.push({
        path: "rdProjectsDetail",
        query: {
          id: record.id
        }
      });
    },
    //详情页
    bomDetail(record) {
      this.$router.push({
        path: "bomQuoteDetail",
        query: {
          id: record.id
        }
      });
    },
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
