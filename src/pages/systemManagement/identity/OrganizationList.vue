<template>
  <a-card>
    <div>
      <div class="operator">
        <a-button
          v-if="checkPermission('AbpIdentity.OrganitaionUnits.Create')"
          @click="$refs.createModal.openModal({})"
          type="primary"
        >新建</a-button>
        <!-- <a-dropdown v-if="selectedRows.length > 0">
          <a-menu @click="handleMenuClick" slot="overlay">
            <a-menu-item key="delete">删除</a-menu-item>
          </a-menu>
          <a-button> 批量操作 <a-icon type="down" /> </a-button>
        </a-dropdown>-->
      </div>
      <standard-table
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :selectedRows.sync="selectedRows"
        :loading="loading"
      >
        <span slot="creationTime" slot-scope="{ text }">
          {{
          text | moment
          }}
        </span>
        <div slot="action" slot-scope="{ record }">
          <a
            href="javascript:;" v-if="checkPermission('AbpIdentity.OrganitaionUnits.Create')"
            @click="$refs.createModal.openModal({ parentId: record.id},`${record.displayName}(${record.code})`)"
          >添加子项</a>
          <a href="javascript:;" v-if="checkPermission('AbpIdentity.OrganitaionUnits.Update')" @click="$refs.createModal.openModal(record)">编辑</a>
          <a-popconfirm title="确定要删除吗？" v-if="checkPermission('AbpIdentity.OrganitaionUnits.Delete')" @confirm="handleDel(record.id)">
            <a href="javascript:;">删除</a>
          </a-popconfirm>

          <!-- <template>
            <a-dropdown>
              <a class="ant-dropdown-link" href="javascript:;">
                操作
                <a-icon type="down" />
              </a>
              <a-menu slot="overlay">
                <a-menu-item v-if="checkPermission('AbpIdentity.OrganitaionUnits.Create')">
                  <a
                    href="javascript:;"
                    @click="
                      $refs.createModal.openModal({ parentId: record.id},`${record.displayName}(${record.code})`)
                    "
                  >添加子项</a>
                </a-menu-item>
                <a-menu-item v-if="checkPermission('AbpIdentity.OrganitaionUnits.Update')">
                  <a href="javascript:;" @click="$refs.createModal.openModal(record)">编辑</a>
                </a-menu-item>
                <a-menu-item v-if="checkPermission('AbpIdentity.OrganitaionUnits.Delete')">
                  <a-popconfirm title="确定要删除吗？" @confirm="handleDel(record.id)">
                    <a href="javascript:;">删除</a>
                  </a-popconfirm>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </template> -->
        </div>
      </standard-table>
    </div>
    <create-form ref="createModal" @ok="handleOk" />
  </a-card>
</template>

<script>
import StandardTable from "@/components/table/StandardTable";
import {
  deleteOrganization as del,
  getOrganizationsAll
} from "@/services/identity/organization";
import CreateForm from "./modules/OrganizationForm";
import { checkPermission } from "@/utils/abp";
const columns = [
  {
    title: "编码",
    dataIndex: "code"
  },
  {
    title: "名称",
    dataIndex: "displayName"
  },
  {
    title: "创建时间",
    dataIndex: "creationTime",
    scopedSlots: { customRender: "creationTime" },
    sorter: true
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" }
  }
];
let that;
export default {
  components: { StandardTable, CreateForm },
  data() {
    return {
      advanced: true,
      columns: columns,
      dataSource: [],
      selectedRows: [],
      loading: false,
      queryParam: {}
    };
  },
  // authorize: {
  //   deleteRecord: "delete",
  // },
  mounted() {
    that = this;
    this.loadData();
  },
  methods: {
    checkPermission,
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    handleDel(id) {
      del(id).then(res => {
        this.loadData();
        this.$message.info("删除成功");
      });
    },
    handleOk() {
      this.loadData();
    },
    handleMenuClick(e) {
      // if (e.key === "delete") {
      //   let selectedRowKeys = this.selectedRows.map((x) => x.id);
      //   if (selectedRowKeys.length == 0) {
      //     this.$message.warning("请选择要删除的行");
      //   }
      //   this.$confirm({
      //     title: "确定要删除吗?",
      //     okType: "danger",
      //     onOk() {
      //       dels(selectedRowKeys).then((res) => {
      //         that.loadData();
      //         that.$message.info("删除成功");
      //       });
      //     },
      //   });
      // }
    },
    loadData() {
      this.loading = true;
      getOrganizationsAll()
        .then(res => {
          this.handleData(res.items);
          this.dataSource = res.items;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleData(data) {
      data.forEach(x => {
        if (!x.children || x.children.length == 0) {
          delete x.children;
        } else {
          this.handleData(x.children);
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.search {
  margin-bottom: 54px;
}
.fold {
  width: calc(100% - 216px);
  display: inline-block;
}
.operator {
  margin-bottom: 18px;
}
@media screen and (max-width: 900px) {
  .fold {
    width: 100%;
  }
}
</style>