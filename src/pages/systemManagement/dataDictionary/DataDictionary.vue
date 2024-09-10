<template>
  <div>
    <a-row :gutter="10">
      <a-col :span="6">
        <a-card>
            <div class='right'>
              <a-button type='primary'  icon="plus" @click="$refs.dataForm.openModal({})">添加数据类型</a-button>
            </div>
            <a-tree
              v-if="treeData.length>0"
              :treeData="treeData"
              :defaultExpandAll="true"
              @select="onSelect"
              @expand="onExpand"
              @rightClick="onRightClick"
            ></a-tree>
            <div :style="tmpStyle" v-if="NodeTreeItem">
              <div class="menu-item" @click="orgAdd">
                <a-tooltip placement="bottom" title="新增子组织">
                  <a-icon type="plus-circle-o" />
                </a-tooltip>
              </div>
              <div class="menu-item" @click="orgEdit">
                <a-tooltip placement="bottom" title="修改">
                  <a-icon type="edit" />
                </a-tooltip>
              </div>
              <div class="menu-item" @click="orgDelete" v-if="this.NodeTreeItem.parentOrgId">
                <a-tooltip placement="bottom" title="删除">
                  <a-icon type="minus-circle-o" />
                </a-tooltip>
              </div>
            </div>
        </a-card>
      </a-col>
      <a-col :span="18" >
          <a-card>
            <div class='right'>
              <a-button type='primary'  icon="plus" @click="$refs.dataForm.openModal({})">添加数据字典</a-button>
            </div>
            <standard-table
              rowKey="key"
              :columns="columns"
              :dataSource="data"
              @change="handleTableChange"
              :pagination="pagination"
              :loading="loading"
            > 
               <!-- slot-scope="{ record }" -->
              <span slot="action">
                <a>编辑</a>
                <a-divider type="vertical" />
                <a>删除</a>
              </span>
            </standard-table>
          </a-card>
      </a-col>
    </a-row>
    <data-form ref="dataForm" />
  </div>
</template>

<script>
import StandardTable from "@/components/table/StandardTable";
import dataForm from './modules/dataForm'
const columns = [
  {
    title: "数据字典",
    dataIndex: "age",
    key: "age"
  },
  {
    title: "添加时间",
    dataIndex: "time",
    key: "time"
  },
  {
    title: "Action",
    key: "action",
    scopedSlots: { customRender: "action" }
  }
];

const data = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    tags: ["nice", "developer"]
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    tags: ["loser"]
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sidney No. 1 Lake Park",
    tags: ["cool", "teacher"]
  }
];
let that;
export default {
  components: { StandardTable, dataForm },
  data () {
    return {
      NodeTreeItem: null, // 右键菜单
      tmpStyle: '',
      treeData: [
        {
          title: '企业信息',
          key: '0-0',
          children: [
            {
              title: '0-0-0',
              key: '0-0-0',
              children: [
                { title: '0-0-0-0', key: '0-0-0-0', parentId: '0-0-0' },
                { title: '0-0-0-1', key: '0-0-0-1', parentId: '0-0-0' },
                { title: '0-0-0-2', key: '0-0-0-2', parentId: '0-0-0' },
              ],
            },
            {
              title: '0-0-1',
              key: '0-0-1',
              children: [
                { title: '0-0-1-0', key: '0-0-1-0', parentId: '0-0-0' },
                { title: '0-0-1-1', key: '0-0-1-1', parentId: '0-0-0' },
                { title: '0-0-1-2', key: '0-0-1-2', parentId: '0-0-0' },
              ],
            },
            {
              title: '0-0-2',
              key: '0-0-2',
            },
          ],
        },
      ],
      data,
      columns,
      pagination: this.$store.state.setting.pagination,
      loading: false,
     }
  },
  methods: {
    onExpand(expandedKeys, {expanded: bool, node}) {
       this.NodeTreeItem = null;
    },
    onSelect (selectedKeys, info) {
      this.queryParam = {
        orgId: selectedKeys[0]
      };
      this.NodeTreeItem = null
    },
    onRightClick ({ event, node }) {
      const x =
        event.currentTarget.offsetLeft + event.currentTarget.clientWidth;
      const y = event.currentTarget.offsetTop;
      this.NodeTreeItem = {
        id: node._props.eventKey,
        title: node._props.title,
        parentOrgId: node._props.dataRef.parentId || null
      };
      this.tmpStyle = {
        position: 'absolute',
        maxHeight: 40,
        textAlign: 'center',
        left: `${x + 10 - 0}px`,
        top: `${y + 6 - 0}px`,
        display: 'flex',
        flexDirection: 'row'
      };
      
    },
    // 用于点击空白处隐藏增删改菜单
   clearMenu () {
      this.NodeTreeItem = null;
    },
    orgAdd () {
     this.$refs.dataForm.openModal({})
    },
    orgEdit () {
      this.$refs.dataForm.openModal(this.NodeTreeItem)
    },
    orgDelete () {
    // 写自己的业务逻辑
    },
    handleTableChange(pagination, filters, sorter) {
      const pager = { ...this.pagination };
      this.pagination.current = pagination;
      
    },
  }
}
</script>

<style lang="less" scoped>
.right {
  text-align: right;
}
.menu-item {
  margin-right: 10px
}
</style>