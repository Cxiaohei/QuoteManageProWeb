<template>
    <a-card>
        <vxe-toolbar ref="xToolbar1" custom>
      <template #buttons>
        <a-form :model="queryFrom" layout="inline">
          <a-form-item>
            <a-space>
              <a-button type="primary" @click="add_pagelist">新增</a-button>
            </a-space>
          </a-form-item>
          <a-form-item>
            <a-input
              v-model.trim="queryFrom.Filter"
              style="width: 180px"
              placeholder="关键字"
            ></a-input>
          </a-form-item>

          <a-form-item>
            <a-space>
              <a-button type="primary" icon="search" @click="search_pagelist"
                >查询</a-button
              >
              <a-button type="primary" @click="reset_pagelists">重置</a-button>
            </a-space>
          </a-form-item>
        </a-form>
      </template>
    </vxe-toolbar>
    <vxe-table
      border
      resizable
      ref="xTable1"
      id="toolbar_demo5"
      height="400"
      size="small"
      :loading="loading"
  :sort-config="{trigger: 'cell', defaultSort: {field: 'age', order: 'desc'}, orders: ['desc', 'asc', null]}"
      show-overflow="tooltip"
      :row-config="rowConfig"
      :custom-config="customConfig"
      :data="dataSource"
      @resizable-change="resizableChangeEvent"
    >
      <vxe-column type="seq" width="60"></vxe-column>
      <vxe-column field="action" title="操作">
        <template #default="{ row }">
          <a
            href="javascript:;"
            @click="productData_edit(row)"
            style="margin-right: 5px"
            >编辑</a
          >
          <a-popconfirm
            title="确定删除吗?"
            ok-text="确定"
            cancel-text="取消"
            @confirm="deleteDevelopment(row)"
          >
            <a href="#"   style="margin-right: 5px">删除</a>
          </a-popconfirm>
        </template>
      </vxe-column>
      <vxe-column field="categoryName" width="150" title="研发类型名称" sortable></vxe-column>
    </vxe-table>
    <div style="margin-top: 10px; display: flex; justify-content: flex-end">
      <a-pagination
        :total="pagination.total"
        :showQuickJumper="pagination.showQuickJumper"
        :current="pagination.current"
        :pageSize="pagination.pageSize"
        :show-total="pagination.showTotal"
        @change="handleTableChange"
      />
    </div>
      <developmentTypeModal ref="developmentTypeModalRefs" @ok="getPageList"></developmentTypeModal>
    </a-card>
  </template>
      
  <script>
  import {
    getPageList,
    deleteDevelopmentType
  } from "@/services/basicsSeting/developmentType";
  import { checkPermission } from "@/utils/abp";
  import { mapGetters } from "vuex";
  import developmentTypeModal from "./modules/developmentTypeModal";
  
  const columns = [
    {
      width: 100,
      title: "操作",
      scopedSlots: {
        customRender: "action"
      }
    },
    {
      title: "研发类型",
      dataIndex: "productLineName",
      scopedSlots: {
        customRender: "productLineName"
      }
    },
    {
      title: "产品线负责人",
      dataIndex: "lineDutyUserName",
      scopedSlots: {
        customRender: "lineDutyUserName"
      }
    },
    {
      title: "基准毛利",
      dataIndex: "standardGrossProfit",
      scopedSlots: {
        customRender: "standardGrossProfit"
      }
    },
    {
      title: "备注",
      dataIndex: "remarks",
      scopedSlots: {
        customRender: "remarks"
      }
    },
    {
      title: "备用1",
      dataIndex: "spareColumOne",
      scopedSlots: {
        customRender: "spareColumOne"
      }
    },
  ];
  
  export default {
    data() {
      return {
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
        // 表格配置
      customConfig: {
        storage: {
          visible: true,
          resizable: true,
          sort: true,
          fixed: true,
        },
      },
      sortConfig: {
        defaultSort: [],
        multiple: true,
        trigger: "cell",
        remote: true,
      },
      rowConfig: {
        keyField: "id",
      },
      };
    },
    components: { developmentTypeModal },
    mounted() {},
    created() {
      this.getPageList();
    },
    activated() {},
    computed: {
      ...mapGetters("account", ["organizationId"])
    },
    methods: {
    resizableChangeEvent() {
      const columns = this.$refs.xTable1.getColumns();
      const customData = columns.map((column) => {
        return {
          width: column.renderWidth,
        };
      });
      console.log(customData);
    },
      checkPermission,
      //新增
      add_pagelist() {
        this.$refs.developmentTypeModalRefs.openModules("add");
      },
      //编辑
      productData_edit(record) {
        this.$refs.developmentTypeModalRefs.openModules("edit", record);
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
            console.log(err);
          });
      },
      deleteDevelopment(record){
      console.log(record)
      deleteDevelopmentType(record.id).then(res => {
        this.$message.success("删除成功");
        this.getPageList();
      });
    },
      //切换选中
      onSelectChange(selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys;
      },
      // 编辑
      pinbanOrder_edit(record, type) {
        this.$router.push({
          path: "actionFixedAssets",
          query: {
            id: record.id,
            type
          }
        });
      },
      //页数切换
      handleTableChange(pagination) {
        
        this.pagination.current = pagination;
        
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
  </style>
      