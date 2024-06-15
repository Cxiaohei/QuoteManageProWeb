<template>
  <div>
    <a-modal
      :width="1100"
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
          <a-switch
            v-model="queryFrom[item.key]"
            v-if="item.type == 'boolean'"
          />
          <a-input
            v-else-if="item.type == 'string'"
            v-model="queryFrom[item.key]"
            style="width: 150px"
            :placeholder="item.label"
          ></a-input>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import {
  addEssentialDataList,
  editEssentialDataList,
} from "@/services/businessCode/quotationManagement/rdProjects";
import cloneDeep from "lodash.clonedeep";

export default {
  name: "customerModal",
  props: {},
  data() {
    return {
      title: "标题",
      uservisible: false,
      queryFrom: {},
      confirmLoading: false,
      queryFromDataList: [
        {
          label: "研发项目名称",
          key: "projectName",
          type: "string",
        },
        {
          label: "产品定义",
          key: "haveProductDefinitions",
          type: "boolean",
        },
        {
          label: "硬件开发",
          key: "haveHardware",
          type: "boolean",
        },
        {
          label: "软件开发",
          key: "haveSoftware",
          type: "boolean",
        },
        {
          label: "结构开发",
          key: "haveStructural",
          type: "boolean",
        },
        {
          label: "产品测试",
          key: "haveProductTest",
          type: "boolean",
        },
        {
          label: "模具及工装",
          key: "haveMoldsAndTooling",
          type: "boolean",
        },
        {
          label: "认证",
          key: "haveAuthentication",
          type: "boolean",
        },
        {
          label: "其他研发相关费",
          key: "haveOtherFee",
          type: "boolean",
        },
        {
          label: "项目发起人姓名",
          key: "createUserName",
          type: "string",
        },
      ],
      rules: {
        categoryName: [
          { required: true, message: "请输入类别名称", trigger: "change" },
        ],
        categoryLevel: [
          { required: true, message: "请选择等级", trigger: "change" },
        ],
        categoryType: [
          { required: true, message: "请选择岗位", trigger: "change" },
        ],
      },
    };
  },
  methods: {
    openModules(type, info) {
      this.queryFrom = {
        haveProductDefinitions: true,
        haveHardware: true,
        haveSoftware: true,
        haveStructural: true,
        haveProductTest: true,
        haveMoldsAndTooling: true,
        haveAuthentication: true,
        haveOtherFee: true,
      };
      if (type == "add") {
        this.title = "新增";
      } else {
        this.title = "编辑";
        this.queryFrom = cloneDeep(info);
      }
      this.uservisible = true;
    },
    // 确定
    handleOk() {
      this.$refs.userRefs.validate((valid) => {
        if (valid) {
          this.confirmLoading = true;
          if (this.title == "新增") {
            this.addEssentialDataList();
          } else {
            this.editEssentialDataList();
          }
        }
      });
    },
    handleCancel() {
      this.uservisible = false;
      this.$refs.userRefs.resetFields();
    },
    //新增基础数据
    addEssentialDataList() {
      this.logDataSource = [];
      let params = {
        ...this.queryFrom,
      };
      addEssentialDataList(params)
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
    editEssentialDataList() {
      this.logDataSource = [];
      let params = {
        ...this.queryFrom,
      };
      editEssentialDataList(params)
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
