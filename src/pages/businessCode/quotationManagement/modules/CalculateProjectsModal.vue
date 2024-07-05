<template>
  <div>
    <a-modal
      :width="1280"
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
        Sindex
        :dataSource="detailDataList"
        :pagination="false"
        bordered
      >
        <!-- 费用类型 -->
        <span
          :slot="sitem"
          slot-scope="text, record"
          v-for="(sitem,Sindex) in tdSwitchArr"
          :key="Sindex"
        >
          <a-switch v-model="record[sitem]" @change="getFinalScore" :disabled="title == '查看'" />
        </span>
        <!-- <span slot="isNewHardware" slot-scope="text, record">
          <a-switch v-model="record.isNewHardware" @change="getFinalScore" />
        </span>
        <span slot="isHardwareSoftware" slot-scope="text, record">
          <a-switch v-model="record.isHardwareSoftware" @change="getFinalScore" />
        </span>-->
        <!-- 文本框 -->
        <span
          :slot="item"
          style="width: 80px"
          slot-scope="text, record"
          v-for="(item, index) in tdArr"
          :key="index"
        >
          <a-input v-model="record[item]" @change="getFinalScore" :disabled="title == '查看'"></a-input>
        </span>
      </a-table>
    </a-modal>
  </div>
</template>

<script>
import {
  calculateProjectScore, //计算得分
  setProjectScore,
  getProjectScore,
  editRdProjectsDetailList
} from "@/services/businessCode/quotationManagement/rdProjects";

import cloneDeep from "lodash.clonedeep";

const columns = [
  {
    title: "东胜支出",
    width: "110px",
    dataIndex: "dsDisburse",
    scopedSlots: {
      customRender: "dsDisburse"
    }
  },
  {
    title: "客户支付金额",
    width: "100px",
    dataIndex: "customerPayment",
    scopedSlots: {
      customRender: "customerPayment"
    }
  },
  {
    title: "首单金额",
    width: "80px",
    dataIndex: "firstOrderAmount",
    scopedSlots: {
      customRender: "firstOrderAmount"
    }
  },
  {
    title: "6个月内订单金额",
    width: "130px",
    dataIndex: "sixMonthAmount",
    scopedSlots: {
      customRender: "sixMonthAmount"
    }
  },
  {
    title: "12个月内订单金额",
    width: "130px",
    dataIndex: "twelveMonthAmount",
    scopedSlots: {
      customRender: "twelveMonthAmount"
    }
  },
  {
    title: "能否形成通用软件系统",
    width: "80px",
    dataIndex: "isCommonSoftware",
    scopedSlots: {
      customRender: "isCommonSoftware"
    }
  },
  {
    title: "能否形成新的硬件产品",
    width: "100px",
    dataIndex: "isNewHardware",
    scopedSlots: {
      customRender: "isNewHardware"
    }
  },
  {
    title: "能否形成新的软硬件产品",
    width: "100px",
    dataIndex: "isHardwareSoftware",
    scopedSlots: {
      customRender: "isHardwareSoftware"
    }
  },
  {
    title: "得分",
    width: "100px",
    dataIndex: "finalScore",
    scopedSlots: {
      customRender: "finalScore"
    }
  }
];

export default {
  name: "rdProjectsModal",
  props: {},
  data() {
    return {
      title: "标题",
      uservisible: false,
      confirmLoading: false,
      detailType: 0,
      columns,
      //循环表格
      tdArr: [
        "dsDisburse",
        "customerPayment",
        "firstOrderAmount",
        "sixMonthAmount",
        "twelveMonthAmount"
      ],
      //循环表格
      tdSwitchArr: ["isCommonSoftware", "isNewHardware", "isHardwareSoftware"],
      detailDataList: [{}] //详情的列表
    };
  },
  methods: {
    openModules(record,type) {
      if (type == "add") {
        this.title = "评分";
        this.detailDataList = [{ developProjectId: record.id }];
      } else {
        this.title = "查看";
        getProjectScore(record.id).then(res => {
          this.detailDataList[0] = res.data;
        });
      }
      this.uservisible = true;
    },
    // 确定
    handleOk() {
      this.confirmLoading = true;
      if (this.title == "评分") {
        this.setProjectScore();
      } else {
        this.uservisible = true;
        // this.editRdProjectsDetailList();
      }
    },
    handleCancel() {
      this.uservisible = false;
    },
    //计算费用
    getFinalScore() {
      calculateProjectScore(this.detailDataList[0])
        .then(res => {
          if (res.code != -1) {
            this.detailDataList[0].finalScore = res;
          } else {
            this.detailDataList[0].finalScore = 0;
          }
          this.$forceUpdate();
        })
        .catch(err => {
          this.loading = false;
          this.confirmLoading = false;
        });
    },
    //新增得分
    setProjectScore() {
      let params = this.detailDataList[0];
      setProjectScore(params)
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
    editRdProjectsDetailList() {
      let params = {
        ...this.detailDataList[0]
      };
      editRdProjectsDetailList(params)
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
