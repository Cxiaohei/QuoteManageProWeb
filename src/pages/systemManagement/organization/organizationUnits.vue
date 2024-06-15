<template>
  <div class="page-header-index-wide">
       <a-row :gutter="16">
        <a-col :span="12">
            <a-card :bordered="false">
                <a-button type="primary" @click="$refs.createModal.openModal({})">添加根机构</a-button>
                <a-table :columns="columns" :dataSource="data" :pagination='false' rowKey="id" :customRow="onCustomRow" :rowClassName="setRowClassName">
                    <div slot="action"  slot-scope="record">
                        <template>
                            <a-dropdown>
                                <a class="ant-dropdown-link" href="javascript:;">
                                    操作
                                    <a-icon type="down" />
                                </a>
                                <a-menu slot="overlay">
                                    <a-menu-item>
                                        <a
                                            @click="$refs.createModal.openModal(record)"
                                            >编辑</a
                                        >
                                    </a-menu-item>
                                    <a-menu-item>
                                        <a
                                            @click="$refs.create.openModal(record)"
                                            >添加子机构</a
                                        >
                                    </a-menu-item>
                                    <a-menu-item>
                                        <a
                                            @click="addCustomer"
                                            >添加成员</a
                                        >
                                    </a-menu-item>
                                    <a-menu-item>
                                        <a
                                            @click="addRoleList"
                                            >添加角色</a
                                        >
                                    </a-menu-item>
                                    <a-menu-item>
                                        <a-popconfirm
                                            title="确定要删除吗？"
                                            @confirm="handleDel(record.id)"
                                        >
                                            <a href="javascript:;">删除</a>
                                        </a-popconfirm>
                                    </a-menu-item>
                                </a-menu>
                            </a-dropdown>
                        </template>
                    </div>
                </a-table>
                
            </a-card>
        </a-col>
        <a-col :span="12">
            <a-card>
              <a-tabs default-active-key="1" @change="callback">
                <a-tab-pane key="1" tab="成员">
                  <p v-if='isChecked'>选择一个组织机构来查看成员</p>
                  <div v-if='!isChecked'>
                     <a-button type="primary" @click="addCustomer">添加成员</a-button>
                     <standard-table
                        rowKey="id"
                        :columns="memberColumns"
                        :dataSource="dataSource"
                        :pagination="pagination"
                        @change="handleMTableChange"
                      >
                    <div slot="action" slot-scope="{ record }">
                      <template>
                        <a-dropdown>
                          <a class="ant-dropdown-link" href="javascript:;">
                            操作
                            <a-icon type="down" />
                          </a>
                          <a-menu slot="overlay">
                            <a-menu-item>
                              <a-popconfirm
                                title="确定要删除吗？"
                                @confirm="handleDelMember(record.id)"
                              >
                                <a href="javascript:;">删除</a>
                              </a-popconfirm>
                            </a-menu-item>
                          </a-menu>
                        </a-dropdown>
                      </template>
                    </div>
                     </standard-table>
                  </div>
                </a-tab-pane>
                <a-tab-pane key="2" tab="角色" force-render>
                  <p v-if='isChecked'>选择一个组织机构来查看角色</p>
                  <div v-if='!isChecked'>
                     <a-button type="primary" @click="addRoleList">添加角色</a-button>
                     <standard-table
                        rowKey="id"
                        :columns="roleColumns"
                        :dataSource="roleData"
                        :pagination="memberPagination"
                        @change="handleRTableChange"
                      >
                    <div slot="action" slot-scope="{ record }">
                      <template>
                        <a-dropdown>
                          <a class="ant-dropdown-link" href="javascript:;">
                            操作
                            <a-icon type="down" />
                          </a>
                          <a-menu slot="overlay">
                            <a-menu-item>
                              <a-popconfirm
                                title="确定要删除吗？"
                                @confirm="handleDelRole(record.id)"
                              >
                                <a href="javascript:;">删除</a>
                              </a-popconfirm>
                            </a-menu-item>
                          </a-menu>
                        </a-dropdown>
                      </template>
                    </div>
                     </standard-table>
                  </div>
                </a-tab-pane>
              </a-tabs>
            </a-card>
        </a-col>
       </a-row>
    <tenant-form ref="createModal" @ok="handleOk" /> 
    <create-form ref="create" @ok="handleOk" /> 
    <add-member ref="addMember" @ok="addMemberOK" /> 
    <add-roles ref="addRole" @ok="addRoleOK" /> 
  </div>
</template>

<script>
import StandardTable from "@/components/table/StandardTable";
import TenantForm from "./modules/TenantForm";
import CreateForm from "./modules/CreateForm";
import AddRoles from "./modules/AddRoles";
import AddMember from "./modules/AddMember";
import { getList, del, getMember, delMember, getRole,delRole } from "@/services/organization/tenant";
const datas = [
    {
        code: "00001",
        creationTime: "2021-04-20T14:57:15.8974492",
        creatorId: "6144163c-cb6b-855e-53b8-39fbeaf1b7eb",
        deleterId: null,
        deletionTime: null,
        displayName: "根级组织",
        extraProperties: {},
        id: "7639c80c-28f7-e44b-b20e-39fc003e7819",
        isDeleted: false,
        lastModificationTime: null,
        lastModifierId: null,
        parentId: null,
        roles: []
    },
    {
        code: "00001.00001",
        creationTime: "2021-04-20T15:39:13.846955",
        creatorId: "6144163c-cb6b-855e-53b8-39fbeaf1b7eb",
        deleterId: null,
        deletionTime: null,
        displayName: "子机构1",
        extraProperties: {},
        id: "8e0dc99c-b9b0-ee67-c492-39fc0064e40f",
        isDeleted: false,
        lastModificationTime: null,
        lastModifierId: null,
        parentId: "7639c80c-28f7-e44b-b20e-39fc003e7819",
        roles: [],
    }
]
const columns = [
  {
    title: '机构名称',
    dataIndex: 'displayName',
    key: 'displayName',
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
  },
];

const data = [
  {
    code: "00001",
    creationTime: "2021-04-20T14:57:15.8974492",
    creatorId: "6144163c-cb6b-855e-53b8-39fbeaf1b7eb",
    deleterId: null,
    deletionTime: null,
    displayName: "根级组织",
    extraProperties: {},
    id: "7639c80c-28f7-e44b-b20e-39fc003e7819",
    isDeleted: false,
    lastModificationTime: null,
    lastModifierId: null,
    parentId: null,
    roles: [],
    children: [
      {
        code: "00001.00001",
        creationTime: "2021-04-20T15:39:13.846955",
        creatorId: "6144163c-cb6b-855e-53b8-39fbeaf1b7eb",
        deleterId: null,
        deletionTime: null,
        displayName: "子机构1",
        extraProperties: {},
        id: "8e0dc99c-b9b0-ee67-c492-39fc0064e40f",
        isDeleted: false,
        lastModificationTime: null,
        lastModifierId: null,
        parentId: "7639c80c-28f7-e44b-b20e-39fc003e7819",
        roles: [],
      },
    ],
  }
];
const memberColumns = [
  {
    title: "用户名",
    dataIndex: "userName",
  },
  {
    title: "邮箱地址",
    dataIndex: "email",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
  },
];
const roleColumns = [
  {
    title: "角色名称",
    dataIndex: "name",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
  },
];
export default {
  components: { CreateForm, StandardTable, TenantForm, AddMember, AddRoles },
  data() {
    return {
      sorter: {
        field: "id",
        order: "desc",
      },
      roleData: [],
      loading: false,
      pagination: {
        pageSize: 10,
        current: 1,
        showQuickJumper:true,
        showTotal:total => `总计 ${total} 条`
      },
      memberPagination: {
        pageSize: 10,
        current: 1,
        showQuickJumper:true,
        showTotal:total => `总计 ${total} 条`
      },
      dataSource: [],//成员列表
      isChecked: true,
      data: [],
      columns,
      datas,
      checkedId: '',
      memberColumns,
      roleColumns
    };
  },
  methods: {
    handleMTableChange(pagination, filters, sorter) {
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      if (sorter.field) this.sorter = sorter;
      this.getMemberData(this.checkedId)
    },
    handleRTableChange(pagination, filters, sorter) {
      const pager = { ...this.memberPagination };
      pager.current = pagination.current;
      this.memberPagination = pager;
      if (sorter.field) this.sorter = sorter;
      this.getRoleData(this.checkedId)
    },
    addCustomer() {
      this.$refs.addMember.openModal(this.checkedId)
    },
    addRoleList() {
      this.$refs.addRole.openModal(this.checkedId)
    },
    callback(key) {
      console.log(key);
    },
    loadData() {
      this.loading = true;
      getList()
          .then((res) => {
            this.data = this.changeData(res.items)
            console.log(this.data)
          })
          .finally(() => {
          this.loading = false;
          });
    },
    changeData(data) {
            let result = []
              let map = {};
              data.forEach(item => {
                  map[item.id] = item;
              });
              data.forEach(item => {
                  let parent = map[item.parentId];
                  if(parent) {
                      (parent.children || (parent.children = [])).push(item);
                  } else {
                      result.push(item);
                  }
              });
              return result;
    },
    handleOk() {
      this.loadData();
    },
      addMemberOK() {
        this.getMemberData(this.checkedId)
      },
      addRoleOK() {
        this.getRoleData(this.checkedId)
      },
      onCustomRow (record) {
        return {
            on: { // 事件
                click: (event) => {
                    this.checkedId= record.id
                    if(record.id) {
                      this.isChecked = false
                      this.getMemberData(this.checkedId)
                      this.getRoleData(this.checkedId)
                    }
                },       // 点击行
            },

        };
      },
      //联动成员接口
      getMemberData(id) {
        let params = {
          ...this.pagination,
          sorter: this.sorter,
        };
        getMember(id,params)
          .then((res) => {
            this.dataSource = res.items
            const pagination = { ...this.pagination };
            pagination.total = res.totalCount;
            this.pagination = pagination;
          })
          .finally(() => {
          this.loading = false;
          });
      },
      //联动角色
      getRoleData(id) {
        let params = {
          ...this.memberPagination,
          sorter: this.sorter,
        };
        getRole(id,params)
          .then((res) => {
            this.roleData = res.items
            const memberPagination = { ...this.memberPagination };
            memberPagination.total = res.totalCount;
            this.memberPagination = memberPagination;
          })
          .finally(() => {
          this.loading = false;
          });
      },
      handleDel(id) {
        del(id).then((res) => {
            this.loadData();
            this.$message.info("删除成功");
        });
      },
      //删除成员
      handleDelMember(memberId) {
        delMember(this.checkedId,memberId).then((res) => {
            this.getMemberData(this.checkedId)
            this.$message.info("删除成功");
        });
      },
      //删除角色
      handleDelRole(memberId) {
        delRole(this.checkedId,memberId).then((res) => {
            this.getRoleData(this.checkedId)
            this.$message.info("删除成功");
        });
      },
      setRowClassName (record) {
          return record.id === this.checkedId ? 'clickRowStyle' : '';
      }
  },
  created() {
      
      this.loadData()
  }
};
</script>
<style lang="less">
.ant-table-row.clickRowStyle {
  background-color: rgba(0,0,0,.1) 
}
.ant-table-row.clickRowStyle:hover{
    background-color:rgba(0,0,0,.1) !important
  }
  
  
</style>