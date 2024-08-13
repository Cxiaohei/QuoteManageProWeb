<template>
  <div>
    <a-modal
      :width="600"
      title="发起审批"
      :visible="uservisible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form-model
        :model="queryFrom"
        :label-col="{ span: 5 }"
        :rules="rules"
        ref="userRefs"
      >
        <a-form-item label="类型"> auditeType </a-form-item>
        <a-form-item label="研发项目"> quoteId </a-form-item>
        <a-form-item label="项目评分表"> projectScoreId </a-form-item>
        <a-form-item label="项目最终评分"> finalScore </a-form-item>
        <a-form-item label="审核提交人姓名"> createUserName </a-form-item>
        <a-form-item label="审批人列表">
          <ul>
            <li>auditeUserNames</li>
            <li>auditeUserNames</li>
            <li>auditeUserNames</li>
          </ul>
        </a-form-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import {
  addBomDataList,
  getAllProductList,
  getCategoryTypeData,
  bomfilterApi,
  importExcel,
  downloadTemplate,
  // editBomDataList
} from "@/services/businessCode/quotationManagement/bomQuote";
import cloneDeep from "lodash.clonedeep";

const columns = [
  {
    title: "操作",
    width: "70px",
    dataIndex: "action",
    scopedSlots: {
      customRender: "action",
    },
  },
  {
    title: "物料结构",
    width: "100px",
    dataIndex: "dsBaseDataType",
    scopedSlots: {
      customRender: "dsBaseDataType",
    },
  },
  {
    title: "部件名称",
    dataIndex: "categoryName",
    scopedSlots: {
      customRender: "categoryName",
    },
  },
  {
    title: "9NC",
    dataIndex: "nineNC",
    scopedSlots: {
      customRender: "nineNC",
    },
  },
  {
    title: "物料名称",
    dataIndex: "bomName",
    scopedSlots: {
      customRender: "bomName",
    },
  },
  {
    title: "物料代码",
    dataIndex: "bomCode",
    scopedSlots: {
      customRender: "bomCode",
    },
  },
  {
    title: "型号",
    dataIndex: "bomModel",
    scopedSlots: {
      customRender: "bomModel",
    },
  },
  {
    title: "规格",
    dataIndex: "specification",
    scopedSlots: {
      customRender: "specification",
    },
  },
  {
    title: "总价",
    dataIndex: "totalPrice",
    scopedSlots: {
      customRender: "totalPrice",
    },
  },
];

export default {
  name: "customerModal",
  props: {
    dsProductsId: String,
  },
  data() {
    return {
      title: "标题",
      uservisible: false,
      confirmLoading: false,
      dsProductsIdDisabled: false,
      queryFrom: {},
      columns,
      rules: {
        categoryName: [
          { required: true, message: "请输入类别名称", trigger: "change" },
        ],
      },
    };
  },
  methods: {
    openModules(type, info) {
      this.uservisible = true;
    },
    // 确定
    handleOk() {
      this.$refs.userRefs.validate((valid) => {
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
    //下载模板
    downloadTemplate() {
      downloadTemplate();
    },
    //导入
    importExcel(resData) {
      let formData = new FormData();
      formData.append("ImportFile", resData.file);
      importExcel(formData).then((response) => {
        if (response.code == 1) {
          this.$message.success("导入成功");
          var arr1 = [];
          var arr2 = [];
          response.data.map((item) => {
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
        bomQuoteRelations: [...this.detailDataList1, ...this.detailDataList2],
      };
      if (this.$route.path == "/quotationManagement/odmQuoteDetail") {
        params.odmQuoteId = this.$route.query.id;
      }
      params.bomQuoteRelations.map((item) => {
        item.id = "";
      });
      addBomDataList(params)
        .then((res) => {
          if (res.code == 1) {
            this.$message.success(res.msg);
            if (this.$route.path == "/quotationManagement/odmQuoteDetail") {
              this.$router.push({
                path: "bomQuoteDetail",
                query: {
                  id: res.data.id,
                },
              });
            }
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
    editBomDataList() {
      this.logDataSource = [];
      let params = {
        ...this.queryFrom,
      };
      editBomDataList(params)
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

    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
  },
};
</script>

<style lang="less" scoped></style>
