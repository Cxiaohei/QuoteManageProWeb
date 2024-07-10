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
          <a-input v-model.trim="queryFrom.Filter" style="width: 120px" placeholder="关键字"></a-input>
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button type="primary" icon="search" @click="search_pagelist">查询</a-button>
            <a-button type="primary" @click="reset_pagelists">重置</a-button>
          </a-space>
        </a-form-item>
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
    
    <!-- childrenColumnName="childrens" -->
      <span slot="action" slot-scope="text, record">
        <a href="javascript:;" @click="essentialData_edit(record)" style="margin-right: 5px;">编辑</a>
        <!-- <a href="javascript:;" @click="pinbanOrder_edit(record, 'detail')">详情</a>
        <a href="javascript:;" @click="showLog(record)">日志</a>-->
      </span>

      <span slot="categoryLevel" slot-scope="text, record">
        {{
        record.categoryLevel == 0 ?"初级":record.categoryLevel == 1 ?"中级":record.categoryLevel == 2 ?"高级":"资深"
        }}
      </span>
      <span slot="categoryType" slot-scope="text, record">
        {{
        record.categoryType == 0 ?"岗位":"-"
        }}
      </span>
      <span slot="creationTime" slot-scope="text, record">
        {{
        record.creationTime?record.creationTime.substring(0,19).replace('T','/'):"/"
        }}
      </span>
    </a-table>

    <EssentialDataModel ref="EssentialDataModelRefs" @ok="getPageListTwoData"></EssentialDataModel>
  </a-card>
</template>
    
<script>
import { getPageListTwoData } from "@/services/businessCode/category1/essentialData";
import { checkPermission } from "@/utils/abp";
import { mapGetters } from "vuex";
import EssentialDataModel from "./modules/EssentialDataModal.vue";

const columns = [
  // {
  //   width: 150,
  //   title: "操作",
  //   scopedSlots: {
  //     customRender: "action"
  //   }
  // },
  {
    title: "类别名称",
    dataIndex: "categoryName",
    scopedSlots: {
      customRender: "categoryName"
    }
  },
  {
    title: "级别",
    dataIndex: "categoryLevel",
    scopedSlots: {
      customRender: "categoryLevel"
    }
  },
  {
    title: "类别",
    dataIndex: "categoryType",
    scopedSlots: {
      customRender: "categoryType"
    }
  },
  {
    title: "单价",
    dataIndex: "unitPrice",
    scopedSlots: {
      customRender: "unitPrice"
    }
  }
];
export default {
  components: { EssentialDataModel },
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
      }
    };
  },
  mounted() {},
  created() {
    this.getPageListTwoData();
  },
  computed: {
    ...mapGetters("account", ["organizationId"])
  },
  methods: {
    checkPermission,
    //新增
    add_pagelist() {
      this.$refs.EssentialDataModelRefs.openModules("add");
    },
    //编辑
    essentialData_edit(record) {
      this.$refs.EssentialDataModelRefs.openModules("edit", record);
    },
    //获取列表数据
    getPageListTwoData() {
      const params = {
        skipCount: (this.pagination.current - 1) * this.pagination.pageSize,
        MaxResultCount: this.pagination.pageSize,
        ...this.queryFrom
      };
      getPageListTwoData(params)
        .then(res => {
          if (res.code == 1) {
            const pagination = {
              ...this.pagination
            };
            pagination.total = res.data.totalCount;
            this.pagination = pagination;
            this.dataSource = res.data;
            // this.dataSource = this.buildTree(res.data.items);
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
    //处理原始数据为树
    buildTree(items) {
      // 创建一个 Map 来存储节点，以便快速查找
      const nodeMap = new Map(
        items.map(item => [item.id, { ...item, children: [] }])
      );

      // 遍历所有节点，构建树形结构
      items.forEach(item => {
        const parentId = item.parentId;
        if (parentId && nodeMap.has(parentId)) {
          // 如果节点有 parentId，则将其添加到其父节点的 children 数组中
          nodeMap.get(parentId).children.push(nodeMap.get(item.id));
        } else {
          // 否则，将节点视为根节点并添加到结果数组中（这里我们假设没有根节点数组，只是示例）
          // 你可以根据需要修改此部分来收集根节点
        }
      });

      // 从 Map 中获取根节点（假设 parentId 为 null 或 'root' 的节点是根节点）
      const roots = [];
      nodeMap.forEach((node, id) => {
        if (
          !node.parentId ||
          node.parentId === "root" ||
          node.parentId === null
        ) {
          roots.push(node);
        }
      });

      return roots; // 返回根节点数组
    },
    //切换选中
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
    },
    //页数切换
    handleTableChange(pagination) {
      const pager = {
        ...this.pagination
      };
      pager.current = pagination.current;
      this.pagination = pager;
      this.getPageListTwoData();
    },
    //重置
    reset_pagelists() {
      this.pagination.current = 1;
      this.queryFrom = {};
      this.getPageListTwoData();
    },
    //查询
    search_pagelist() {
      this.pagination.current = 1;
      this.getPageListTwoData();
    },
    // 刷新
    user_success() {
      this.getPageListTwoData();
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
    