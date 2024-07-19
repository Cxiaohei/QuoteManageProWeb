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
          style="width: 31%;"
          v-for="(item,index) in queryFromDataList"
          :key="index"
          :label="item.label"
        >
        <a-select v-model="queryFrom[item.key]" style="width: 200px;" placeholder="物料工艺" v-if="item.key=='bomCraft'">
            <a-select-option :value="0">贴片</a-select-option>
            <a-select-option :value="5">插件</a-select-option>
            <a-select-option :value="10">手工焊</a-select-option>
          </a-select>
          <a-input v-else v-model="queryFrom[item.key]" style="width: 200px" :placeholder="item.label"></a-input>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import {
  addEssentialDataList,
  editEssentialDataList
} from "@/services/businessCode/category1/outMaterialManagement";
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
          label: "物料编号",
          key: "bomNo"
        },
        {
          label: "9NC",
          key: "nineNC"
        },
        {
          label: "物料代码",
          key: "bomCode"
        },
        {
          label: "物料名称",
          key: "bomName"
        },
        {
          label: "品牌",
          key: "brand"
        },
        {
          label: "规格",
          key: "specification"
        },
        {
          label: "型号",
          key: "bomModel"
        },
        {
          label: "物料工艺",
          key: "bomCraft"
        },
        {
          label: "物料脚数",
          key: "bomLegNum"
        },
        {
          label: "物料库存数",
          key: "inventoriesBomNum"
        },
        {
          label: "物料已使用数",
          key: "usedBomNum"
        },
        {
          label: "最近一次使用数",
          key: "recentUseBomNum"
        },
        {
          label: "历史最高价",
          key: "maxPrice"
        },
        {
          label: "历史最低价",
          key: "minPrice"
        },
        {
          label: "最近一次采购价",
          key: "recentPrice"
        },
        {
          label: "备注",
          key: "remarks"
        },
        {
          label: "备用1",
          key: "spareColumOne"
        },
        {
          label: "备用2",
          key: "spareColumTwo"
        },
        {
          label: "备用3",
          key: "spareColumThree"
        },
        {
          label: "备用4",
          key: "spareColumFour"
        }
      ],
      rules: {
        categoryName: [
          { required: true, message: "请输入类别名称", trigger: "change" }
        ],
        categoryLevel: [
          { required: true, message: "请选择等级", trigger: "change" }
        ],
        categoryType: [
          { required: true, message: "请选择岗位", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    openModules(type, info) {
      this.queryFrom = {};
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
      this.$refs.userRefs.validate(valid => {
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
        ...this.queryFrom
      };
      addEssentialDataList(params)
        .then(res => {
          if (res.code == 1) {
            this.$message.success(res.msg);

            this.$emit("ok");
            this.uservisible = false;
            this.confirmLoading = false;
          }
        })
        .catch(err => {
          this.loading = false;
          this.confirmLoading = false;
        });
    },
    //编辑基础数据
    editEssentialDataList() {
      this.logDataSource = [];
      let params = {
        ...this.queryFrom
      };
      editEssentialDataList(params)
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
    }
  }
};
</script>

<style lang="less" scoped></style>
