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
          <span v-if="item.label == '项目得分'">
            <a v-if="finalScore == '0'" @click="calculateProjects()">评分</a>
            <span v-else>
              <a
                @click="getcalculateProjects()"
                style="margin-right: 15px; text-decoration: underline"
              >{{ finalScore }}</a>
              <a
                @click="setAudite()"
                v-if="
                  !detailData.auditeNo &&
                  detailData.auditeStatus != 0 &&
                  finalScore &&
                  finalScore < 60
                "
              >提交审批</a>
              <a
                @click="setAudite()"
                v-if="
                  detailData.auditeNo &&
                  detailData.auditeStatus == 10 &&
                  finalScore &&
                  finalScore < 60
                "
              >审批未通过,重新提交</a>
              <span
                v-if="
                  detailData.auditeNo &&
                  detailData.auditeStatus == 0 &&
                  finalScore < 60
                "
              >审批中</span>
              <span
                v-if="
                  detailData.auditeNo &&
                  detailData.auditeStatus == 1 &&
                  finalScore  < 60
                "
              >审批通过</span>
            </span>
          </span>
          <span v-else>{{ detailData[item.key] }}</span>
        </a-descriptions-item>
      </a-descriptions>
    </div>

    <a-tabs default-active-key="0">
      <a-tab-pane
        :tab="item.title"
        v-for="(item, index) in hasDataList"
        :key="index"
      >
      <h3>
        {{ item.title }} (费用:
        {{ detailData[item.moneyHasKey] ? detailData[item.moneyHasKey] : 0 }})
      </h3>
      <a-button
        type="primary"
        @click="addChildren(item.title, item.detailType)"
        style="margin-bottom: 15px"
      >新增</a-button>
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
          >编辑</a>
          <a-popconfirm
            title="确定删除吗?"
            ok-text="确定"
            cancel-text="取消"
            @confirm="deleteChildren(record.id)"
          >
            <a href="#">删除</a>
          </a-popconfirm>
        </span>
        <span
          slot="detailFeeType"
          slot-scope="text, record"
        >{{ record.detailFeeType == 0 ? "费用" : "人工" }}</span>
        <span slot="engineerLevel" slot-scope="text, record">
          {{
          record.engineerLevel == 0
          ? "初级"
          : record.engineerLevel == 1
          ? "中级"
          : record.engineerLevel == 2
          ? "高级"
          : "资深"
          }}
        </span>

        <span slot="creationTime" slot-scope="text, record">{{ record.creationTime }}</span>
      </a-table>
      </a-tab-pane>
    </a-tabs>

    <!-- <div v-for="(item, index) in hasDataList" :key="index" style="margin-bottom: 15px">
      <h3>
        {{ item.title }} (费用:
        {{ detailData[item.moneyHasKey] ? detailData[item.moneyHasKey] : 0 }})
      </h3>
      <a-button
        type="primary"
        @click="addChildren(item.title, item.detailType)"
        style="margin-bottom: 15px"
      >新增</a-button>
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
          >编辑</a>
          <a-popconfirm
            title="确定删除吗?"
            ok-text="确定"
            cancel-text="取消"
            @confirm="deleteChildren(record.id)"
          >
            <a href="#">删除</a>
          </a-popconfirm>
        </span>
        <span
          slot="detailFeeType"
          slot-scope="text, record"
        >{{ record.detailFeeType == 0 ? "费用" : "人工" }}</span>
        <span slot="engineerLevel" slot-scope="text, record">
          {{
          record.engineerLevel == 0
          ? "初级"
          : record.engineerLevel == 1
          ? "中级"
          : record.engineerLevel == 2
          ? "高级"
          : "资深"
          }}
        </span>

        <span slot="creationTime" slot-scope="text, record">{{ record.creationTime }}</span>
      </a-table>
    </div> -->

    <RdProjectsDetailModal ref="RdProjectsDetailModalRefs" @ok="getRdProjectsDetail"></RdProjectsDetailModal>

    <!-- 计算得分 -->
    <CalculateProjectsModal ref="CalculateProjectsModalRefs" @ok="getRdProjectsDetail"></CalculateProjectsModal>

    <a-modal
      title="创建审批"
      :visible="visibleAudite"
      @ok="handleOkAudite"
      @cancel="visibleAudite = false"
    >
      备注：
      <a-input v-model="remarksAudite"></a-input>
    </a-modal>
  </a-card>
</template>
      
  <script>
import {
  getRdProjectsDetail,
  deleteRdProjectsDetailList,
  setAudite,
  getProjectScore
} from "@/services/businessCode/quotationManagement/rdProjects";
import { checkPermission } from "@/utils/abp";
import { mapGetters } from "vuex";
import RdProjectsDetailModal from "./modules/RdProjectsDetailModal.vue";
import CalculateProjectsModal from "./modules/CalculateProjectsModal.vue";

const columns = [
  {
    width: 100,
    title: "操作",
    scopedSlots: {
      customRender: "action"
    }
  },
  {
    title: "子类",
    dataIndex: "subclasses",
    scopedSlots: {
      customRender: "subclasses"
    }
  },
  {
    title: "费用说明",
    width: "110px",
    dataIndex: "feeDescription",
    scopedSlots: {
      customRender: "feeDescription"
    }
  },
  {
    title: "工种",
    width: "150px",
    dataIndex: "trades",
    scopedSlots: {
      customRender: "trades"
    }
  },
  {
    title: "费用类型",
    width: "150px",
    dataIndex: "detailFeeType",
    scopedSlots: {
      customRender: "detailFeeType"
    }
  },
  {
    title: "工程师级别",
    width: "150px",
    dataIndex: "engineerLevel",
    scopedSlots: {
      customRender: "engineerLevel"
    }
  },
  {
    title: "折扣率",
    width: "100px",
    dataIndex: "discountedRate",
    scopedSlots: {
      customRender: "discountedRate"
    }
  },
  {
    title: "总价",
    width: "100px",
    dataIndex: "totalPrice",
    scopedSlots: {
      customRender: "totalPrice"
    }
  },
  {
    title: "数量",
    width: "100px",
    dataIndex: "quantityNum",
    scopedSlots: {
      customRender: "quantityNum"
    }
  },
  {
    title: "参考值",
    width: "100px",
    dataIndex: "referenceValue",
    scopedSlots: {
      customRender: "referenceValue"
    }
  },
  {
    title: "单价",
    width: "100px",
    dataIndex: "unitPrice",
    scopedSlots: {
      customRender: "unitPrice"
    }
  },
  {
    title: "备注",
    dataIndex: "remarks",
    scopedSlots: {
      customRender: "remarks"
    }
  }
];
export default {
  components: { RdProjectsDetailModal, CalculateProjectsModal },
  data() {
    return {
      selectedRowKeys: [],
      queryFrom: {
        processStepName: ""
      },
      finalScore: 0,
      loading: true,
      dataSource: [],
      selectedRows: [],
      columns: columns,
      pagination: {
        pageSize: 10,
        current: 1,
        showTotal: total => `总计 ${total} 条`
      },
      //新增的数据
      detailData: {},
      queryFromDataList: [
        {
          label: "研发项目名称",
          key: "projectName",
          type: "string"
        },
        {
          label: "项目发起人姓名",
          key: "createUserName",
          type: "string"
        },
        {
          label: "总人工费",
          key: "laborCost",
          type: "string"
        },
        {
          label: "其他费用汇总",
          key: "otherFee",
          type: "string"
        },
        {
          label: "项目总费用",
          key: "totalFee",
          type: "string"
        },
        {
          label: "项目得分",
          key: "projectNumber",
          type: "string"
        }
      ],
      // 所有子项
      AlldetailListChildren: [
        {
          key: "definitionDetails",
          hasKey: "haveProductDefinitions",
          moneyHasKey: "productDefinitionsMoney",
          detailType: 0,
          title: " 产品定义"
        },
        {
          key: "hardwareDetails",
          hasKey: "haveHardware",
          moneyHasKey: "hardwareMoney",
          detailType: 1,
          title: " 硬件开发"
        },
        {
          key: "softwareDetails",
          hasKey: "haveSoftware",
          moneyHasKey: "softwareMoney",
          detailType: 2,
          title: " 软件开发"
        },
        {
          key: "structuralDetails",
          hasKey: "haveStructural",
          moneyHasKey: "structuralMoney",
          detailType: 3,
          title: " 结构开发"
        },
        {
          key: "productTestDetails",
          hasKey: "haveProductTest",
          moneyHasKey: "productTestMoney",
          detailType: 4,
          title: " 产品测试类"
        },
        {
          key: "moldsAndToolingDetails",
          hasKey: "haveMoldsAndTooling",
          moneyHasKey: "moldsAndToolingMoney",
          detailType: 5,
          title: " 模具及工装"
        },
        {
          key: "authenticationDetails",
          hasKey: "haveAuthentication",
          moneyHasKey: "authenticationMoney",
          detailType: 6,
          title: " 认证"
        },
        {
          key: "otherFeeDetails",
          hasKey: "haveOtherFee",
          moneyHasKey: "otherFeeMoney",
          detailType: 7,
          title: " 其他研发相关费用"
        }
      ],
      hasDataList: [],
      projectScoreId: "",
      visibleAudite: false,
      remarksAudite: ""
    };
  },
  mounted() {},
  created() {
    this.getRdProjectsDetail();
  },
  computed: {
    ...mapGetters("account", ["organizationId"])
  },
  methods: {
    checkPermission,
    //评分
    calculateProjects(record) {
      this.$refs.CalculateProjectsModalRefs.openModules(
        { id: this.$route.query.id },
        "add"
      );
    },
    getcalculateProjects(record) {
      this.$refs.CalculateProjectsModalRefs.openModules(
        { id: this.projectScoreId },
        "detail"
      );
    },
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
        .then(res => {
          if (res.code == 1) {
            this.$message.success(res.msg);
            this.getRdProjectsDetail();
          } else {
            this.$message.error(res.message);
          }
        })
        .catch(err => {
          this.loading = false;
          console.log(err);
        });
    },
    setAudite() {
      this.visibleAudite = true;
    },
    handleOkAudite() {
      let params = {
        developProjectId: this.$route.query.id,
        finalScore: this.finalScore,
        projectScoreId: this.projectScoreId,
        remarks: this.remarksAudite
      };
      setAudite(params).then(res => {
        if (res.code == 1) {
          this.$message.success(res.msg);
          this.visibleAudite = false;
          this.getRdProjectsDetail();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //获取列表数据
    getRdProjectsDetail() {
      const params = this.$route.query.id;
      getRdProjectsDetail(params)
        .then(res => {
          if (res.code == 1) {
            this.detailData = res.data;
            //筛选出有数据的子项
            let newAllDetailListChildren = [];
            this.AlldetailListChildren.map(item => {
              if (res.data[item.hasKey]) {
                newAllDetailListChildren.push(item);
              }
            });
            this.hasDataList = newAllDetailListChildren;

            this.finalScore = res.data.finalScore;
            this.projectScoreId = res.data.projectScoreId;
          } else {
            this.loading = false;
            this.$message.error(res.message);
          }
        })
        .catch(err => {
          this.loading = false;
          console.log(err);
        });

      // getProjectScore(params).then(res => {
      //   if (res.code == 1) {
      //     console.log("得分");
      //     console.log(res.data);
      //     this.finalScore = res.data.finalScore;
      //   }
      // });
    },
    //下拉筛选
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
      