<template>
  <div class="dashboard">
    <div class="left-column">
      <div ref="totalProjectsPie" class="chart pie-chart"></div>
      <div ref="totalBudgetPie" class="chart pie-chart"></div>
    </div>
    <div class="right-column">
      <div ref="budgetLine" class="chart line-bar-chart"></div>
      <div ref="projectTypesBar" class="chart line-bar-chart"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import {
  getkBData
} from "@/services/performance/performanceManagement";

export default {
  data() {
    return {
      projectData: [], // 存储接口返回的数据不包含东胜
      projectDataAll: [], // 存储接口返回的数据
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      getkBData()
        .then((res) => {
          if (res.code == 1) {
            this.projectDataAll=res.data;
            this.projectData = res.data.filter(d => d.department != '东胜');
console.log(this.projectData)
            this.$nextTick(() => {
              this.initTotalProjectsPie();
              this.initTotalBudgetPie();
              this.initProjectTypesBar();
              this.initBudgetLine();
            });
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
    initTotalProjectsPie() {
      const chart = echarts.init(this.$refs.totalProjectsPie);
      const data = this.projectData.map(d => ({ name: d.department, value: d.totalProjects }));

      const option = {
        title: {
          text: '各部门项目总数占比',
          left: 'center',
          textStyle: {
            color: '#333',
            fontSize: 16,
            fontWeight: 'bold',
          },
        },
        tooltip: {
          trigger: 'item',
        },
        color: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
        series: [
          {
            name: '项目总数',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: true,
              position: 'outside',
              formatter: '{b}: {c} ({d}%)',
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '16',
                fontWeight: 'bold',
              },
            },
            labelLine: {
              show: true,
            },
            data,
          },
        ],
      };
      chart.setOption(option);
    },
    initTotalBudgetPie() {
      const chart = echarts.init(this.$refs.totalBudgetPie);
      const data = this.projectData.map(d => ({ name: d.department, value: d.totalBudget }));

      const option = {
        title: {
          text: '各部门预算占比',
          left: 'center',
          textStyle: {
            color: '#333',
            fontSize: 16,
            fontWeight: 'bold',
          },
        },
        tooltip: {
          trigger: 'item',
        },
        color: ['#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc', '#5470c6'],
        series: [
          {
            name: '总预算',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: true,
              position: 'outside',
              formatter: '{b}: {c} ({d}%)',
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '16',
                fontWeight: 'bold',
              },
            },
            labelLine: {
              show: true,
            },
            data,
          },
        ],
      };
      chart.setOption(option);
    },
    initProjectTypesBar() {
      const chart = echarts.init(this.$refs.projectTypesBar);

      const departments = this.projectDataAll.map(d => d.department);
      const strategicData = this.projectDataAll.map(d => d.strategicCount);
      const improvementData = this.projectDataAll.map(d => d.improvementCount);
      const regularData = this.projectDataAll.map(d => d.regularCount);
      const strategicBudget = this.projectDataAll.map(d => d.strategicBudget);
      const improvementBudget = this.projectDataAll.map(d => d.improvementBudget);
      const regularBudget = this.projectDataAll.map(d => d.regularBudget);

      const option = {
        title: {
          text: '项目类型与预算',
          left: 'center',
          textStyle: {
            color: '#333',
            fontSize: 16,
            fontWeight: 'bold',
          },
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: ['战略型项目数', '改善型项目数', '常规型项目数', '战略型项目预算', '改善型项目预算', '常规型项目预算'],
          top: 'bottom',
        },
        color: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272'],
        xAxis: {
          type: 'category',
          data: departments,
          axisLabel: {
            color: '#333',
          },
        },
        yAxis: [
          {
            type: 'value',
            name: '项目数',
            axisLabel: {
              color: '#333',
            },
          },
          {
            type: 'value',
            name: '预算 (元)',
            position: 'right',
            axisLabel: {
              color: '#333',
            },
          },
        ],
        series: [
          {
            name: '战略型项目数',
            type: 'bar',
            data: strategicData,
          },
          {
            name: '改善型项目数',
            type: 'bar',
            data: improvementData,
          },
          {
            name: '常规型项目数',
            type: 'bar',
            data: regularData,
          },
          {
            name: '战略型项目预算',
            type: 'bar',
            yAxisIndex: 1,
            data: strategicBudget,
          },
          {
            name: '改善型项目预算',
            type: 'bar',
            yAxisIndex: 1,
            data: improvementBudget,
          },
          {
            name: '常规型项目预算',
            type: 'bar',
            yAxisIndex: 1,
            data: regularBudget,
          },
        ],
      };
      chart.setOption(option);
    },
    initBudgetLine() {
      const chart = echarts.init(this.$refs.budgetLine);

      const departments = this.projectDataAll.map(d => d.department);
      const remainingPercentage = this.projectDataAll.map(d => d.remainingPercentage);
      const usedBudget = this.projectDataAll.map(d => d.usedBudget);

      const option = {
        title: {
          text: '剩余预算比例与已使用预算金额',
          left: 'center',
          textStyle: {
            color: '#333',
            fontSize: 16,
            fontWeight: 'bold',
          },
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: ['剩余预算比例', '已使用预算'],
          top: 'bottom',
        },
        color: ['#5470c6', '#91cc75'],
        xAxis: {
          type: 'category',
          data: departments,
          axisLabel: {
            color: '#333',
          },
        },
        yAxis: [
          {
            type: 'value',
            name: '剩余预算比例 (%)',
            axisLabel: {
              color: '#333',
            },
          },
          {
            type: 'value',
            name: '已使用预算 (元)',
            position: 'right',
            axisLabel: {
              color: '#333',
            },
          },
        ],
        series: [
          {
            name: '剩余预算比例',
            type: 'line',
            data: remainingPercentage,
          },
          {
            name: '已使用预算',
            type: 'line',
            yAxisIndex: 1,
            data: usedBudget,
          },
        ],
      };
      chart.setOption(option);
    },
  },
};
</script>

<style scoped>
.dashboard {
  display: flex;
  justify-content: space-between;
  padding: 20px;
}

.left-column {
  width: 40%;
}
.right-column {
  width: 60%;
}
.left-column {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.right-column {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.pie-chart {
  height: 380px; /* 调整饼图高度以符合三分之一页面高度 */
}

.line-bar-chart {
  height: 380px; /* 适当增加柱状图和折线图的高度 */
}

.chart {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
