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
      <a-table
        :rowKey="
          (data, index) => {
            return index;
          }
        "
        :columns="columns"
        :dataSource="detailDataList"
        :pagination="false"
        bordered
      >
        <span slot="action" slot-scope="text, record, index">
          &nbsp; -

          <a
            href="javascript:;"
            v-if="index == 0"
            style="margin-right: 5px"
            @click="addDetailDataList"
            >添加</a
          >
          <a
            href="javascript:;"
            v-if="index != 0"
            @click="removeDetailDataList(index)"
            >删除</a
          >
        </span>
        <span slot="subclasses" slot-scope="text, record">
          <a-input v-model="record.subclasses"></a-input>
        </span>
        <span slot="feeDescription" slot-scope="text, record">
          <a-input v-model="record.feeDescription"></a-input>
        </span>
        <span slot="engineerLevel" slot-scope="text, record">
          <a-input v-model="record.engineerLevel"></a-input>
        </span>
        <span slot="remarks" slot-scope="text, record">
          <a-input v-model="record.remarks"></a-input>
        </span>
      </a-table>
    </a-modal>
  </div>
</template>

<script>
import {
  addRdProjectsDetailList,
  editRdProjectsDetailList,
} from "@/services/businessCode/quotationManagement/rdProjects";
import cloneDeep from "lodash.clonedeep";

const columns = [
  {
    width: 100,
    title: "操作",
    dataIndex: "action",
    scopedSlots: {
      customRender: "action",
    },
  },
  {
    title: "标题111",
    dataIndex: "subclasses",
    scopedSlots: {
      customRender: "subclasses",
    },
  },
  {
    title: "描述",
    dataIndex: "feeDescription",
    scopedSlots: {
      customRender: "feeDescription",
    },
  },
  {
    title: "engineerLevel",
    dataIndex: "engineerLevel",
    scopedSlots: {
      customRender: "engineerLevel",
    },
  },
  {
    title: "备注",
    dataIndex: "remarks",
    scopedSlots: {
      customRender: "remarks",
    },
  },
];

export default {
  name: "customerModal",
  props: {},
  data() {
    return {
      title: "标题",
      uservisible: false,
      confirmLoading: false,
      detailType: 0,
      columns,
      detailDataList: [], //详情的列表
    };
  },
  methods: {
    // openModules(type, info) {
    openModules(title, detailType, type, record) {
      // this.title = title;
      this.detailType = detailType;
      this.detailDataList = [{ detailType: this.detailType ,developProjectId:this.$route.query.id,}];
      if (type == "add") {
        this.title = "新增";
      } else {
        this.title = "编辑";
        this.detailDataList[0] = cloneDeep(record);
      }
      this.uservisible = true;
    },
    addDetailDataList() {
      if (this.title == "编辑") {
        this.$message.error("编辑页无法新增，请点击新增按钮进行添加操作");
        return false;
      }
      this.detailDataList.push({ detailType: this.detailType });
    },
    removeDetailDataList(index) {
      this.detailDataList.splice(index, 1);
    },
    // 确定
    handleOk() {
      this.confirmLoading = true;
      if (this.title == "新增") {
        this.addRdProjectsDetailList();
      } else {
        this.editRdProjectsDetailList();
      }
    },
    handleCancel() {
      this.uservisible = false;
    },
    //新增基础数据
    addRdProjectsDetailList() {
      let params = {
        developProjectId: this.$route.query.id,
        devProDetails: this.detailDataList,
      };
      addRdProjectsDetailList(params)
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
    editRdProjectsDetailList() {
      let params = {
        ...this.detailDataList[0],
      };
      editRdProjectsDetailList(params)
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
