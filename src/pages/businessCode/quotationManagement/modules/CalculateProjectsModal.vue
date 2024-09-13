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
    <div class="table-container">
    <table>
      <thead>
        <tr>
          <th rowspan="2">序号</th>
          <th rowspan="2">维度</th>
          <th rowspan="2">明细</th>
          <th rowspan="2">比重</th>
          <th colspan="5">评分</th>
          <th rowspan="2">备注</th>
        </tr>
        <tr>
          <th>100</th>
          <th>90</th>
          <th>80</th>
          <th>70</th>
          <th>60</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in tableData" :key="index">
          <td>{{ row.serial }}</td>
          <td v-if="index==0" rowspan="2">{{ row.dimension }}<br><span style="color: red;">A=客户支付/东胜支出</span></td>
          <td v-if="index==2" rowspan="1">{{ row.dimension }}<br><span style="color: red;">B=首单金额*30%/东胜支出</span></td>
          <td v-if="index==3" rowspan="2">{{ row.dimension }}<br><span style="color: red;">C=*月订单*30%/东胜支出取最大值</span></td>
          <td v-if="index==5" rowspan="3">{{ row.dimension }}<br><span style="color: red;">D=最大得分项</span></td>
          <td>{{ row.detail }}</td>
          <td v-if="index==0" rowspan="2">{{ row.weight }}</td>
          <td v-if="index==2" rowspan="1">{{ row.weight }}</td>
          <td v-if="index==3" rowspan="2">{{ row.weight }}</td>
          <td v-if="index==5" rowspan="3">{{ row.weight }}</td>
          <td  v-if="index==0" rowspan="2">{{ row.score100 }}</td>
          <td  v-if="index==0" rowspan="2">{{ row.score90 }}</td>
          <td  v-if="index==0" rowspan="2">{{ row.score80 }}</td>
          <td  v-if="index==0" rowspan="2">{{ row.score70 }}</td>
          <td  v-if="index==0" rowspan="2">{{ row.score60 }}</td>
          <td  v-if="index!=0&&index!=1" >{{ row.score100 }}</td>
          <td  v-if="index!=0&&index!=1">{{ row.score90 }}</td>
          <td  v-if="index!=0&&index!=1" >{{ row.score80 }}</td>
          <td  v-if="index!=0&&index!=1" >{{ row.score70 }}</td>
          <td  v-if="index!=0&&index!=1" >{{ row.score60 }}</td>
          <td>{{ row.note }}</td>
        </tr>
      </tbody>
    </table>
    <div class="footer">
      <p>1. 项目综合得分 = A*30% + B*30% + C*30% + D*10%，初定项目评估得分要大于60分</p>
      <p>2. 产品和销售认为成略型项目的定项目详细审批及审批流程</p>
    </div>
  </div>
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
  editProjectScore
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
      tableData: [
        { serial: 1, dimension: '研发费', detail: '客户支付', weight: '30%', score100: '客户支付能覆盖东胜支出', score90: '客户支付能覆盖东胜支出90%', score80: '客户支付能覆盖东胜支出80%', score70: '客户支付能覆盖东胜支出70%', score60: '客户支付能覆盖东胜支出60%', note: '' },
        { serial: 2, dimension: '研发费', detail: '东胜支出', weight: '30%', score100: '', score90: '', score80: '', score70: '', score60: '', note: '' },
        { serial: 3, dimension: '首单收入', detail: '首单金额', weight: '30%', score100: '首单利润能覆盖研发费用', score90: '首单利润能覆盖研发费用90%', score80: '首单利润能覆盖研发费用80%', score70: '首单利润能覆盖研发费用70%', score60: '首单利润能覆盖研发费用60%', note: '' },
        { serial: 4, dimension: '预期收入', detail: '6个月内订单金额', weight: '30%', score100: '6个月订单利润能覆盖研发费用', score90: '6个月订单利润能覆盖研发费用90%', score80: '6个月订单利润能覆盖研发费用80%', score70: '6个月订单利润能覆盖研发费用70%', score60: '6个月订单利润能覆盖研发费用60%', note: '' },
        { serial: 5, dimension: '预期收入', detail: '12个月内订单金额', weight: '30%', score100: '', score90: '', score80: '', score70: '', score60: '12个月订单利润能覆盖研发费用', note: '' },
        { serial: 6, dimension: '产品及技术积累', detail: '能形成新的通用的软件系统', weight: '10%', score100: '', score90: '', score80: '', score70: '能形成新的软件系统', score60: '', note: '' },
        { serial: 7, dimension: '产品及技术积累', detail: '能形成新的硬件产品', weight: '10%', score100: '', score90: '', score80: '', score70: '', score60: '能形成新的硬件产品', note: '' },
        { serial: 8, dimension: '产品及技术积累', detail: '能形成新的软硬件产品', weight: '10%', score100: '', score90: '', score80: '能形成新的软硬件产品', score70: '', score60: '', note: '' }
      ],
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
        this.title = "编辑";
        getProjectScore(record.id).then(res => {
          this.detailDataList[0] = res.data;
          this.$forceUpdate();
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
        // this.uservisible = true;
        this.editProjectScore();
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
    editProjectScore() {
      let params = {
        ...this.detailDataList[0],
        ProjectScoreId: this.detailDataList[0].id
      };
      editProjectScore(params)
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

<style lang="less" scoped>
.table-container {
  margin: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #000;
}

th, td {
  border: 1px solid #000;
  padding: 10px;
  text-align: center;
}

th {
  background-color: #f2f2f2;
  font-weight: bold;
}

tfoot p {
  margin: 10px 0;
}

.footer {
  margin-top: 20px;
}

.footer p {
  font-size: 14px;
  margin: 5px 0;
  color: red;
}
</style>
