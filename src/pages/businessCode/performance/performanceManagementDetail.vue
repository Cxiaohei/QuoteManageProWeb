<template>
  <div>
    <a-card>
      <h3>
        项目基础数据：
        <a-button type="primary" @click="sendDetail" v-if="pageType!='detail'">保存</a-button>
      </h3>
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
          <a-switch
            v-model="queryFrom[item.key]"
            v-if="item.type == 'boolean'"
            :disabled="pageType=='detail'"
          />
          <!-- 输入框 -->
          <a-input
            v-else-if="item.type == 'string'"
            v-model="queryFrom[item.key]"
            style="width: 250px"
            :placeholder="item.label"
            :disabled="pageType=='detail'"
          ></a-input>
          <!-- 产品下拉 -->
          <a-select
            v-else-if="item.label == '产品'"
            v-model="queryFrom[item.key]"
            style="width: 250px"
            :placeholder="item.label"
            :disabled="pageType=='detail'"
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

      <div style="padding: 30px 0px;">
        <h3>
          项目目标：
          <a-button type="primary" @click="addKkMbList" v-if="pageType!='detail'">新增目标</a-button>
        </h3>

        <ul style="padding: 0 0 0 42px;">
          <li
            style="list-style: none;float: left;margin:0 20px 10px 0;width:30%"
            v-for="(item,index) in projectObjectivesList"
            :key="index"
          >
            目标{{ index+1 }}:
            <a-input
              v-model="item.objective"
              style="width: 240px;margin-right:5px"
              placeholder="目标列表"
              disabled
            ></a-input>
            <a-button
              type="primary"
              @click="editList(item)"
              v-if="pageType!='detail'"
              style="margin-right: 5px;"
            >编辑</a-button>
            <a-popconfirm
              title="确定删除吗?"
              ok-text="确定"
              cancel-text="取消"
              @confirm="removeList(item)"
              v-if="pageType!='detail'"
            >
              <a-button type="danger">删除</a-button>
            </a-popconfirm>
          </li>
        </ul>
      </div>

      <!-- <div style="padding: 30px 0px;">
        <h3>月度费用使用预算：
          <a-button type="primary" @click="addKkMbList">新增</a-button>
        </h3>
        <ul style="padding: 0;">
          <li
            style="list-style: none;float: left;margin:0 20px 10px 0;"
            v-for="(item,index) in projectObjectivesList"
            :key="index"
          >
            目标{{ index+1 }}:
            <a-input
              v-model="item.objective"
              style="width: 250px;margin-right:5px"
              placeholder="目标列表"
              disabled
            ></a-input>
            <a-button type="primary" @click="editList(item)" style="margin-right: 5px;">编辑目标</a-button>
            <a-popconfirm title="确定删除吗?" ok-text="确定" cancel-text="取消" @confirm="removeList(item)">
              <a-button type="danger">删除目标</a-button>
            </a-popconfirm>
          </li>
        </ul>
      </div>-->
    </a-card>

    <a-modal :title="MbTitle" :visible="MbVisible" @ok="handleOkMb" @cancel="MbVisible=false">
      <a-input placeholder="目标" v-model="objective" />
    </a-modal>
  </div>
</template>

<script>
import {
  getPageListDetail,
  addKkMb,
  editKkMb,
  removeKkMb,
  editProductDataList
} from "@/services/performance/performanceManagement";

import cloneDeep from "lodash.clonedeep";

export default {
  name: "customerModal",
  components: {},
  props: {},
  data() {
    return {
      title: "标题",
      queryFrom: {},
      ProductList: [],
      MbVisible: false,
      MbTitle: "项目目标",
      objective: "",
      pageType: "detail", //页面类型区分编辑和详情
      projectObjectiveId: "",
      confirmLoading: false,
      queryFromDataList: [
        {
          label: "部门",
          key: "department",
          type: "string"
        },
        {
          label: "项目编号",
          key: "projectNo",
          type: "string"
        },
        {
          label: "项目名称",
          key: "projectName",
          type: "string"
        },
        {
          label: "项目预算",
          key: "projectBudget",
          type: "string"
        },
        {
          label: "创建时间",
          key: "creationTime",
          type: "string"
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
      projectObjectivesList: [], //项目目标
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
    getDetail() {
      //先重置数据
      this.queryFrom = {
        haveProductDefinitions: true
      };
      this.pageType = this.$route.query.type;
      getPageListDetail(this.$route.query.id).then(res => {
        console.log("详情");
        this.queryFrom = res.data;
        this.projectObjectivesList = res.data.projectObjectives;
        console.log(res.data);
      });
    },
    sendDetail() {
      //编辑基础数据
      let params = {
        ...this.queryFrom,
        kkProjectId: this.queryFrom.id
      };
      editProductDataList(params).then(res => {
        if (res.code == 1) {
          this.$message.success(res.msg);
          // this.$bus.$emit(
          //   "closeCurrentPage",
          //   "/performance/performanceManagement"
          // );
        } else {
          this.$message.error(res.msg);
        }
        this.getDetail();
      });
    },
    //目标
    addKkMbList() {
      this.projectObjectiveId = "";
      this.objective = "";
      this.MbTitle = "新增项目目标";
      this.MbVisible = true;
    },
    editList(record) {
      this.projectObjectiveId = record.id;
      this.objective = record.objective;
      this.MbTitle = "编辑项目目标";
      this.MbVisible = true;
    },
    handleOkMb() {
      const params = {
        kkProjectId: this.$route.query.id,
        objective: this.objective
      };
      if (this.MbTitle == "编辑项目目标") {
        params.projectObjectiveId = this.projectObjectiveId;
        editKkMb(params).then(res => {
          this.$message.success("编辑成功");
          this.MbVisible = false;
          this.getDetail();
        });
      } else {
        addKkMb(params).then(res => {
          this.$message.success("添加成功");
          this.MbVisible = false;
          this.getDetail();
        });
      }
    },
    //删除目标
    removeList(record) {
      removeKkMb(record.id).then(res => {
        this.$message.success("删除成功");
        this.getDetail();
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
