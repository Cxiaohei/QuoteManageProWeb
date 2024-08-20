<template>
    <div class="dashboard">
      <div class="header">
        <h1>部门项目预算看板</h1>
      </div>
      <div class="chart-container">

        
      </div>
    </div>
  </template>
  
  <script>

  
  export default {
    components: {
    },
    data() {
      return {
        pieOptions: {},
        barOptions: {},
      };
    },
    created() {
      this.fetchData();
    },
    methods: {
    }
  };
  </script>
  
  <style scoped>
  .dashboard {
    background-color: #2c3e50;
    padding: 20px;
    min-height: 100vh;
  }
  
  .header {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .header h1 {
    color: #ecf0f1;
    font-size: 2.5em;
    margin: 0;
  }
  
  .chart-container {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
  }
  
  .chart {
    width: 45%;
    height: 400px;
    margin-bottom: 20px;
  }
  </style>