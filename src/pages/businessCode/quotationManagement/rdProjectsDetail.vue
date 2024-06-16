<template>
  <a-card>
    <div class="queryFromBox">
      <a-descriptions title="基础信息" bordered>
        <a-descriptions-item
          :label="item.label"
          bordered
          v-for="(item, index) in queryFromDataList"
          :key="index"
        >
          {{ detailData[item.key] }}
        </a-descriptions-item>
      </a-descriptions>
    </div>
    <div
      v-for="(item, index) in hasDataList"
      :key="index"
      style="margin-bottom: 15px"
    >
      <h3>{{ item.title }}</h3>
      <a-button
        type="primary"
        @click="addChildren(item.title, item.detailType)"
        style="margin-bottom: 5px"
        >新增</a-button
      >
      <a-table
        rowKey="id"
        :columns="columns"
        :dataSource="detailData[item.key]"
        :pagination="false"
        bordered
      >
        <span slot="action" slot-scope="text, record">
          <a
            href="javascript:;"
            style="margin-right: 5px"
            @click="editChildren(item.title, item.detailType, record)"
            >编辑</a
          >
          <a-popconfirm
            title="确定删除吗?"
            ok-text="确定"
            cancel-text="取消"
            @confirm="deleteChildren(record.id)"
          >
            <a href="#">删除</a>
          </a-popconfirm>
        </span>
        <span slot="creationTime" slot-scope="text, record">
          {{ record.creationTime }}
        </span>
      </a-table>
    </div>

    <RdProjectsDetailModal
      ref="RdProjectsDetailModalRefs"
      @ok="getRdProjectsDetail"
    ></RdProjectsDetailModal>
  </a-card>
</template>
      
  <script>
import {
  getRdProjectsDetail,
  deleteRdProjectsDetailList,
} from "@/services/businessCode/quotationManagement/rdProjects";
import { checkPermission } from "@/utils/abp";
import { mapGetters } from "vuex";
import RdProjectsDetailModal from "./modules/RdProjectsDetailModal.vue";

const columns = [
  {
    width: 100,
    title: "操作",
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
  components: { RdProjectsDetailModal },
  data() {
    return {
      selectedRowKeys: [],
      queryFrom: {
        processStepName: "",
      },
      loading: true,
      dataSource: [],
      selectedRows: [],
      columns: columns,
      pagination: {
        pageSize: 10,
        current: 1,
        showTotal: (total) => `总计 ${total} 条`,
      },
      //新增的数据
      detailData: {},
      queryFromDataList: [
        {
          label: "研发项目名称",
          key: "projectName",
          type: "string",
        },
        {
          label: "项目发起人姓名",
          key: "createUserName",
          type: "string",
        },
      ],
      // 所有子项
      AlldetailListChildren: [
        {
          key: "definitionDetails",
          hasKey: "haveProductDefinitions",
          detailType: 0,
          title: " 产品定义",
        },
        {
          key: "hardwareDetails",
          hasKey: "haveHardware",
          detailType: 1,
          title: " 硬件开发",
        },
        {
          key: "softwareDetails",
          hasKey: "haveSoftware",
          detailType: 2,
          title: " 软件开发",
        },
        {
          key: "structuralDetails",
          hasKey: "haveStructural",
          detailType: 3,
          title: " 结构开发",
        },
        {
          key: "productTestDetails",
          hasKey: "haveProductTest",
          detailType: 4,
          title: " 产品测试类",
        },
        {
          key: "moldsAndToolingDetails",
          hasKey: "haveMoldsAndTooling",
          detailType: 5,
          title: " 模具及工装",
        },
        {
          key: "authenticationDetails",
          hasKey: "haveAuthentication",
          detailType: 6,
          title: " 认证",
        },
        {
          key: "definitionDetails",
          hasKey: "haveOtherFee",
          detailType: 7,
          title: " 其他研发相关费用",
        },
      ],
      hasDataList: [],
    };
  },
  mounted() {},
  created() {
    this.getRdProjectsDetail();
  },
  computed: {
    ...mapGetters("account", ["organizationId"]),
  },
  methods: {
    checkPermission,
    //新增
    addChildren(title, detailType) {
      this.$refs.RdProjectsDetailModalRefs.openModules(
        title,
        detailType,
        "add"
      );
    },
    //编辑
    editChildren(title, detailType, record) {
      this.$refs.RdProjectsDetailModalRefs.openModules(
        title,
        detailType,
        "edit",
        record
      );
    },
    //删除
    deleteChildren(id) {
      deleteRdProjectsDetailList(id)
        .then((res) => {
          if (res.code == 1) {
            this.$message.success(res.msg);
            this.getRdProjectsDetail();
          } else {
            this.$message.error(res.message);
          }
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        });
    },
    //获取列表数据
    getRdProjectsDetail() {
      const params = this.$route.query.id;
      getRdProjectsDetail(params)
        .then((res) => {
          if (res.code == 1) {
            this.detailData = res.data;
            //筛选出有数据的子项
            let newAllDetailListChildren = [];
            this.AlldetailListChildren.map((item) => {
              if (res.data[item.hasKey]) {
                newAllDetailListChildren.push(item);
              }
            });
            this.hasDataList = newAllDetailListChildren;
          } else {
            this.loading = false;
            this.$message.error(res.message);
          }
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        });
    },
    //下拉筛选
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
      
      <style lang="less" scoped>
.queryFromBox {
  margin-bottom: 5px;
  .btnListBox {
    margin-bottom: 5px;
    button {
      margin-right: 10px;
    }
  }
}
</style>
      