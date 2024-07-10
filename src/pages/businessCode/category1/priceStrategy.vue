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
        <a-form-item>
          <a-space>
            <a-upload name="file" :fileList="[]" action :customRequest="importExcel">
              <a-button type="primary" icon="to-top">导入</a-button>
            </a-upload>
            <span @click="downloadTemplate" style="color: #1890ff; cursor: pointer">下载导入模板</span>
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
      childrenColumnName="childrens"
      bordered
    >
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

    <PriceStrategyModal ref="PriceStrategyModalRefs" @ok="getPageList"></PriceStrategyModal>
  </a-card>
</template>
    
<script>
import { getPageList,
  importExcel,
  downloadTemplate } from "@/services/businessCode/category1/priceStrategy";
import { checkPermission } from "@/utils/abp";
import { mapGetters } from "vuex";
import PriceStrategyModal from "./modules/PriceStrategyModal.vue";

const columns = [
  {
    width: 70,
    title: "操作",
    scopedSlots: {
      customRender: "action"
    }
  },
  {
    title: "报价策略名称",
    dataIndex: "priceStrategyName"
  },
  {
    title: "工艺路线",
    dataIndex: "processRote"
  },
  {
    title: "测试岗工价(元/时)",
    dataIndex: "testUnitPrice"
  },
  {
    title: "组装岗工价(元/时)",
    dataIndex: "assemblyUnitPrice"
  },
  {
    title: "物料种类",
    dataIndex: "bomSpecies"
  },
  {
    title: "贴片单价1(元/点)",
    dataIndex: "firstPatchUnitPrice"
  },
  {
    title: "贴片单价1临界点",
    dataIndex: "firstPatchCritical"
  },
  {
    title: "贴片单价2(元/点)",
    dataIndex: "secondPatchUnitPrice"
  },
  {
    title: "贴片单价2临界点",
    dataIndex: "secondPatchCritical"
  },
  {
    title: "贴片单价3(元/点)",
    dataIndex: "threePatchUnitPrice"
  },
  {
    title: "贴片单价3临界点",
    dataIndex: "threePatchCritical"
  },
  {
    title: "插件单价(元/点)",
    dataIndex: "dipUnitPrice"
  },
  {
    title: "手焊单价(元/点)",
    dataIndex: "manualWeldingUnitPrice"
  },
  {
    title: "备注",
    dataIndex: "remarks"
  }
];
export default {
  components: { PriceStrategyModal },
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
    this.getPageList();
  },
  computed: {
    ...mapGetters("account", ["organizationId"])
  },
  methods: {
    checkPermission,
    //新增
    add_pagelist() {
      this.$refs.PriceStrategyModalRefs.openModules("add");
    },
    //编辑
    essentialData_edit(record) {
      this.$refs.PriceStrategyModalRefs.openModules("edit", record);
    },
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
    