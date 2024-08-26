<template>
  <a-card>
    <div class="queryFromBox">
      <a-form :model="queryFrom" layout="inline">
        <a-form-item>
          <a-space>
            <a-button type="primary" @click="add_pagelist">新增</a-button>
          </a-space>
        </a-form-item>
        <a-form-item>
          <a-input v-model.trim="queryFrom.Filter" style="width: 180px" placeholder="关键字"></a-input>
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button type="primary" icon="search" @click="search_pagelist">查询</a-button>
            <a-button type="primary" @click="reset_pagelists">重置</a-button>
          </a-space>
        </a-form-item>
        <!-- <a-form-item>
          <a-space>
            <a-upload name="file" :fileList="[]" action :customRequest="importExcel">
              <a-button type="primary" icon="to-top">导入</a-button>
            </a-upload>
            <span @click="downloadTemplate" style="color: #1890ff; cursor: pointer">下载导入模板</span>
          </a-space>
        </a-form-item>-->
      </a-form>
    </div>
    <a-table
      rowKey="id"
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
      }"
      :columns="columns"
      :dataSource="dataSource"
      @change="handleTableChange"
      :pagination="pagination"
      :loading="loading"
      :selectedRows.sync="selectedRows"
      bordered
    >
      <span slot="action" slot-scope="text, record">
        <a href="javascript:;" @click="showEdit(record)" style="margin-right: 5px">查看</a>

      </span>

      <span slot="status" slot-scope="text, record">
        {{  record.status == 0
            ? "待审核"
            : record.status == 1
            ? "已审核"
          :"未知"}}
        <!-- {{
          record.status == 0
            ? "待提交"
            : record.status == 1
            ? "已确认"
            : record.status == 2
            ? "变更审批中"
            : "项目中止"
        }}-->
      </span>
      <span slot="creationTime" slot-scope="text, record">
        {{
        record.creationTime
        ? record.creationTime.substring(0, 19).replace("T", "/")
        : "/"
        }}
      </span>
    </a-table>

    <a-modal
      title="变更申请"
      :visible="changeVisible"
      @ok="changeVisible = false"
      @cancel="changeVisible = false"
      width="95%"
      :bodyStyle="{ height: '90%', overflowY: 'auto' }"
    >
      <div v-if="changeListData.length > 0">
        <!-- 表格 -->
        <table class="scrapBalanceTable" style="margin-bottom: 20px">
          <tr>
            <td
              v-for="(item, index) in tableKey"
              :key="index"
              :class="{
                'narrow-column': [
                  '部门',
                  '立项人',
                  '项目类型',
                  '项目编号',
                  '项目来源',
                  '项目预算',
                  '项目经理',
                  '己使用金额',
                ].includes(item.name),
                'wide-column': ['项目目标', '项目目的'].includes(item.name),
              }"
            >{{ item.name }}</td>
          </tr>
          <tr>
            <td
              v-for="(item, index) in tableKey"
              :key="index"
              :class="{
                'narrow-column': [
                  '部门',
                  '立项人',
                  '项目类型',
                  '项目编号',
                  '项目来源',
                  '项目预算',
                  '项目经理',
                  '己使用金额',
                ].includes(item.name),
                'wide-column': ['项目目标', '项目目的'].includes(item.name),
              }"
            >
              <p v-if="item.name == '项目类型'">
                {{
                tableData[item.key] == 0
                ? "常规型"
                : tableData[item.key] == 1
                ? "战略型"
                : "改善型"
                }}
              </p>
              <p v-else-if="item.name == '项目来源'">
                {{
                tableData[item.key] == 0
                ? "日常工作包"
                : tableData[item.key] == 1
                ? "战略型"
                : "改善策略"
                }}
              </p>
              <p v-else-if="item.name == '项目目标'">
                <span v-for="(objective, objIndex) in tableData[item.key]" :key="objIndex">
                  {{ objective.objective }}
                  <br />
                </span>
              </p>
              <p v-else-if="item.name == '起止时间'">
                起:{{ tableData.startTime.substring(0, 10) }}
                <br />
                止:{{ tableData.endTime.substring(0, 10) }}
              </p>
              <p v-else>{{ tableData[item.key] }}</p>
            </td>
          </tr>
        </table>
        <a-form-model :model="changeListData[0]" layout="inline" style="width: 100%;">
          <div style="display: flex; flex-direction: column; gap: 16px; height: 100%;">
            <!-- 第一行 -->
            <div style="display: flex; gap: 16px; flex-wrap: nowrap;">
              <div style="flex: 1; min-width: 0;">
                <a-form-model-item label="部门" style="margin: 0;">
                  <div style="display: flex; gap: 8px;">
                    <a-input
                      v-model="changeListData[0].department"
                      style="width: 100%; max-width: 250px;"
                      placeholder="部门"
                      disabled
                    ></a-input>
                    <span style="margin: auto 0;">》</span>
                    <a-input
                      v-model="changeListData[1].department"
                      style="width: 100%; max-width: 250px;"
                      placeholder="部门"
                      disabled
                    ></a-input>
                  </div>
                </a-form-model-item>
              </div>
              <div style="flex: 1; min-width: 0;">
                <a-form-model-item label="项目经理" style="margin: 0;">
                  <div style="display: flex; gap: 8px;">
                    <a-input
                      v-model="changeListData[0].projectManager"
                      style="width: 100%; max-width: 250px;"
                      placeholder="项目经理"
                      disabled
                    ></a-input>
                    <span style="margin: auto 0;">》</span>
                    <a-input
                      v-model="changeListData[1].projectManager"
                      style="width: 100%; max-width: 250px;"
                      placeholder="项目经理"
                      disabled
                    ></a-input>
                  </div>
                </a-form-model-item>
              </div>
            </div>

            <!-- 第二行 -->
            <div style="display: flex; gap: 16px; flex-wrap: nowrap;">
              <div style="flex: 1; min-width: 0;">
                <a-form-model-item label="项目开始时间" style="margin: 0;">
                  <div style="display: flex; gap: 8px;">
                    <a-date-picker
                      v-model="changeListData[0].startTime"
                      style="width: 100%; max-width: 250px;"
                      placeholder="项目开始时间"
                      disabled
                    ></a-date-picker>
                    <span style="margin: auto 0;">》</span>
                    <a-date-picker
                      v-model="changeListData[1].startTime"
                      style="width: 100%; max-width: 250px;"
                      placeholder="项目开始时间"
                      disabled
                    ></a-date-picker>
                  </div>
                </a-form-model-item>
              </div>
              <div style="flex: 1; min-width: 0;">
                <a-form-model-item label="项目结束时间" style="margin: 0;">
                  <div style="display: flex; gap: 8px;">
                    <a-date-picker
                      v-model="changeListData[0].endTime"
                      style="width: 100%; max-width: 250px;"
                      placeholder="项目结束时间"
                      disabled
                    ></a-date-picker>
                    <span style="margin: auto 0;">》</span>
                    <a-date-picker
                      v-model="changeListData[1].endTime"
                      style="width: 100%; max-width: 250px;"
                      placeholder="项目结束时间"
                      disabled
                    ></a-date-picker>
                  </div>
                </a-form-model-item>
              </div>
            </div>

            <!-- 第三行 -->
            <div style="display: flex; gap: 16px; flex-wrap: nowrap;">
              <div style="flex: 1; min-width: 0;">
                <a-form-model-item label="项目周期" style="margin: 0;">
                  <div style="display: flex; gap: 8px;">
                    <a-input-number
                      v-model="changeListData[0].projectCycle"
                      style="width: 100%; max-width: 250px;"
                      placeholder="项目周期"
                      disabled
                    ></a-input-number>
                    <span style="margin: auto 0;">》</span>
                    <a-input-number
                      v-model="changeListData[1].projectCycle"
                      style="width: 100%; max-width: 250px;"
                      placeholder="项目周期"
                      disabled
                    ></a-input-number>
                  </div>
                </a-form-model-item>
              </div>
              <div style="flex: 1; min-width: 0;">
                <a-form-model-item label="项目预算" style="margin: 0;">
                  <div style="display: flex; gap: 8px;">
                    <a-input-number
                      v-model="changeListData[0].projectBudget"
                      style="width: 100%; max-width: 250px;"
                      placeholder="项目预算"
                      :precision="4"
                      :min="0"
                      disabled
                    ></a-input-number>
                    <span style="margin: auto 0;">》</span>
                    <a-input-number
                      v-model="changeListData[1].projectBudget"
                      style="width: 100%; max-width: 250px;"
                      placeholder="项目预算"
                      :precision="4"
                      :min="0"
                      disabled
                    ></a-input-number>
                  </div>
                </a-form-model-item>
              </div>
            </div>

            <!-- 第四行 -->
            <a-form-model-item label="项目目标" style="margin: 0;">
              <div style="display: flex; gap: 50px;">
                <!-- 第一列 -->
                <ul style="padding: 0; flex: 1; list-style: none; margin: 0;">
                  <li
                    v-for="(item, index) in changeListData[0].projectObjectives"
                    :key="`disabled-${index}`"
                    style="margin-bottom: 8px;"
                  >
                    <a-textarea
                      v-model="item.objective"
                      style="width: 600px;"
                      placeholder="项目目标"
                      rows="3"
                      disabled
                    ></a-textarea>
                  </li>
                </ul>
                <span style="margin: auto 0;">》</span>
                <!-- 第二列 -->
                <ul style="padding: 0; flex: 1; list-style: none; margin: 0;">
                  <li
                    v-for="(item, index) in changeListData[1].projectObjectives"
                    :key="`enabled-${index}`"
                    style="margin-bottom: 8px;"
                  >
                    <a-textarea
                      v-model="item.objective"
                      style="width: 600px;"
                      placeholder="项目目标"
                      rows="3"
                      disabled
                    ></a-textarea>
                  </li>
                </ul>
              </div>
            </a-form-model-item>

            <!-- 最后一行 -->
            <div style="display: flex; gap: 16px; flex-wrap: nowrap;">
              <div style="flex: 1; min-width: 0;">
                <a-form-model-item label="变更申请备注" style="margin: 0;">
                  <a-textarea
                    v-model="changeListData[1].remark"
                    style="width: 1200px;"
                    placeholder="变更申请备注"
                    disabled
                  ></a-textarea>
                </a-form-model-item>
              </div>
            </div>
          </div>
        </a-form-model>
      </div>
      <div style="text-align: center;" v-if="this.auditeStatus==0">
        <a-button type="primary" style="width: 150px;height: 40px;font-size: x-large;" @click="productData_edit(changeListData[1])">审核</a-button>
      </div>

    </a-modal>

    <a-modal title="审批" :visible="visibleAudite" @ok="handleOkAudite" @cancel="visibleAudite=false">
      状态：
      <a-radio-group v-model="statusAudite">
        <!-- <a-radio :value="0">待审核</a-radio> -->
        <a-radio :value="1">通过</a-radio>
        <a-radio :value="10">不通过</a-radio>
      </a-radio-group>
      <br />
      <br />说明：
      <a-input v-model="auditeRemarks" style="width: 80%;"></a-input>
    </a-modal>
  </a-card>
</template>

<script>
import { getPageList, getPagechange,checkAudite } from "@/services/performance/projectbg";
import { checkPermission } from "@/utils/abp";
import { mapGetters } from "vuex";

const columns = [
  {
    width: 200,
    title: "操作",
    scopedSlots: {
      customRender: "action"
    }
  },
  {
    title: "编号",
    dataIndex: "auditeNo",
    scopedSlots: {
      customRender: "auditeNo"
    }
  },
  {
    title: "创建人",
    dataIndex: "createUserName",
    scopedSlots: {
      customRender: "createUserName"
    }
  },
  {
    title: "状态",
    dataIndex: "status",
    scopedSlots: {
      customRender: "status"
    }
  },
  {
    title: "创建时间",
    dataIndex: "creationTime",
    scopedSlots: {
      customRender: "creationTime"
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
  data() {
    return {
      tableKey: [
        {
          name: "部门",
          key: "department"
        },
        {
          name: "立项人",
          key: "createUserName"
        },
        {
          name: "项目类型",
          key: "projectType"
        },
        {
          name: "项目编号",
          key: "projectNo"
        },
        {
          name: "项目来源",
          key: "projectSource"
        },
        {
          name: "项目名称",
          key: "projectName"
        },
        {
          name: "项目经理",
          key: "projectManager"
        },
        {
          name: "项目目的",
          key: "projectPurpose"
        },
        {
          name: "项目目标",
          key: "projectObjectives"
        },
        {
          name: "起止时间",
          key: ""
        },
        {
          name: "项目预算",
          key: "projectBudget"
        },
        {
          name: "己使用金额",
          key: "usedBuget"
        }
      ],
      tableData: {},
      bgInfoFrom: {},
      selectedRowKeys: [],
      queryFrom: {
        processStepName: ""
      },
      loading: true,
      dataSource: [],
      selectedRows: [],
      columns: columns,
      pagination: {
        pageSize: 10,
        current: 1,
        showTotal: total => `总计 ${total} 条`
      },
      changeVisible: false,
      changeListData: [],
      auditeId: "",
      auditeStatus:0,
      visibleAudite: false,
      statusAudite: 1,
      auditeRemarks: "",
      changeList: [
        {
          name: "项目编号",
          key: "projectNo"
        },
        {
          name: "项目名称",
          key: "projectName"
        },
        {
          name: "部门",
          key: "department"
        },
        {
          name: "项目经理",
          key: "projectManager"
        },
        {
          name: "项目预算",
          key: "projectBudget"
        },
        {
          name: "费用备注",
          key: "projectRemark"
        },
        {
          name: "变更申请备注",
          key: "remark"
        }
        // {
        //   name: "是否终止项目",
        //   key: "isTerminate"
        // },
        // {
        //   name: "审批人列表",
        //   key: "isTerminate"
        // }
      ]
    };
  },
  components: {},
  mounted() {},
  created() {
    this.getPageList();
  },
  activated() {},
  computed: {
    ...mapGetters("account", ["organizationId"])
  },
  methods: {
    checkPermission,
    //新增
    add_pagelist() {
      this.$refs.PerformanceManagementModalRefs.openModules("add");
    },
    showEdit(record) {
      getPagechange(record.quoteId).then(res => {
        if (res.code == 1) {
          this.changeListData = res.data;
          this.tableData = res.data[0];
          this.bgInfoFrom = res.data[0];
          this.changeVisible = true;
          this.auditeId = record.id;
      this.auditeStatus=record.status;
        } else {
          this.$message.info(res.msg);
        }
      });
    },

    //编辑
    productData_edit(record) {  
      this.statusAudite = 1;
      this.auditeRemarks = "";
      this.visibleAudite = true;
    },
    handleOk() {},
    //下载模板
    downloadTemplate() {
      downloadTemplate();
    },
    //导入
    importExcel(resData) {
      let formData = new FormData();
      formData.append("ImportFile", resData.file);
      importExcel(formData).then(response => {
        if (response.code == 1) {
          this.$message.success("导入成功");
          this.getPageList();
        } else {
          this.$message.info(response.msg);
        }
      });
    },
    //获取列表数据
    getPageList() {
      const params = {
        skipCount: (this.pagination.current - 1) * this.pagination.pageSize,
        MaxResultCount: this.pagination.pageSize,
        ...this.queryFrom
      };
      getPageList(params)
        .then(res => {
          if (res.code == 1) {
            const pagination = {
              ...this.pagination
            };
            pagination.total = res.data.totalCount;
            this.pagination = pagination;
            this.dataSource = res.data.items;
            this.loading = false;
          } else {
            this.loading = false;
            this.$message.error(res.message);
          }
        })
        .catch(err => {
          this.loading = false;
       
        });
    },
    //切换选中
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
    },
    //审核确认
    handleOkAudite() {
      let params = {
        auditeId: this.auditeId,
        status: this.statusAudite,
        auditeRemarks: this.auditeRemarks
      };
      checkAudite(params)
        .then(res => {
          if (res.code == 1) {
            this.$message.success("审核成功");
            this.getPageList();
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(err => {
          this.$message.error(err.message);
        });
      this.visibleAudite = false;
    },
    // 编辑
    productOrder_edit(record, type) {
      this.$router.push({
        path: "performanceManagementDetail",
        query: {
          id: record.id,
          type
        }
      });
    },
    //页数切换
    handleTableChange(pagination) {
      const pager = {
        ...this.pagination
      };
      pager.current = pagination.current;
      this.pagination = pager;
      this.getPageList();
    },
    //重置
    reset_pagelists() {
      this.pagination.current = 1;
      this.queryFrom = {};
      this.getPageList();
    },
    //查询
    search_pagelist() {
      this.pagination.current = 1;
      this.getPageList();
    },
    // 刷新
    user_success() {
      this.getPageList();
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
li {
  list-style: none;
}
.scrapBalanceTable {
  table-layout: fixed !important;
  width: 100%;
  td {
    border: 1px solid #cccccc !important;
    text-align: center;
    padding: 3px;
    font-size: 12px;
  }
}

.scrapBalanceTable td,
.scrapBalanceTable th {
  border: 1px solid #ddd;
  padding: 8px;
}

.scrapBalanceTable td {
  text-align: left;
}

.scrapBalanceTable .narrow-column {
  width: 90px;
}

.scrapBalanceTable .wide-column {
  width: 300px; /* 根据需要调整宽度 */
}
</style>
