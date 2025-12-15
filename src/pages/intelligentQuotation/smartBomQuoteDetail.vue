<template>
  <div>
    <a-card>
      <div class="queryFromBox">
        <a-descriptions title="基础信息" bordered>
          <a-descriptions-item
            :label="item.label"
            bordered
            v-for="(item, index) in queryFromDataList"
            :key="index"
          >
            <span>{{ queryFrom[item.key] }}</span>
          </a-descriptions-item>
        </a-descriptions>
      </div>
      <a-form-model
        :model="queryFrom"
        layout="inline"
        :label-col="{ span: 8 }"
        :rules="rules"
        ref="userRefs"
      >
        <a-form-item>
          <a-space>
            <h2>导入物料明细</h2>
            <a-upload name="file" :fileList="[]" action :customRequest="importExcel">
              <a-button type="primary" icon="to-top">导入</a-button>
            </a-upload>
            <span @click="downloadTemplate" style="color: #1890ff; cursor: pointer">下载导入模板</span>
          </a-space>
        </a-form-item>
      </a-form-model>
      
      <!-- 电子料表格 -->
      <div style="padding-top: 20px">
        <h3>
          电子料
          <a-button type="primary" @click="addDetailDataList2">新增</a-button>
        </h3>
        <a-table
          :rowKey="(data, index) => index"
          :columns="columns"
          :dataSource="detailDataList2"
          :pagination="false"
          bordered
        >
          <span slot="action" slot-scope="text, record, index">
            <a
              href="javascript:;"
              v-if="!record.isadd"
              style="margin-right: 5px"
              @click="editDetailDataList(record)"
            >保存</a>
            <a-popconfirm
              v-if="record.isadd"
              title="确定新增该条数据吗?"
              ok-text="确定"
              cancel-text="取消"
              @confirm="confirmAddList(record)"
            >
              <a href="javascript:;" style="margin-right: 5px">新增</a>
            </a-popconfirm>
            <a-popconfirm
              v-if="!record.isadd"
              title="确定删除吗?"
              ok-text="确定"
              cancel-text="取消"
              @confirm="confirmDelete(record.id)"
            >
              <a href="javascript:;">删除</a>
            </a-popconfirm>
            <a href="javascript:;" v-if="record.isadd" @click="removeDetailDataList2(index)">取消</a>
          </span>

          <span slot="dsBaseDataType" slot-scope="text, record">
            {{ record.dsBaseDataType == 0 ? "结构料" : "电子料" }}
          </span>

          <span slot="categoryName" slot-scope="text, record">
            <a-input v-model="record.categoryName" placeholder="部件名称"></a-input>
          </span>

          <span
            :slot="tdItem"
            slot-scope="text, record"
            v-for="(tdItem, tdIndex) in TdArr"
            :key="tdIndex"
          >
            <a-input v-model="record[tdItem]"></a-input>
          </span>

          <span slot="needBomNum" slot-scope="text, record">
            <a-input-number
              v-model="record.needBomNum"
              :min="1"
              style="width: 80px"
              placeholder="数量"
            ></a-input-number>
          </span>

          <span slot="totalPrice" slot-scope="text, record">
            <a-input v-model="record.totalPrice" style="width: 80px" placeholder="总价" />
          </span>
        </a-table>
      </div>

      <!-- 结构料表格 -->
      <div style="padding-top: 20px">
        <h3>
          结构料
          <a-button type="primary" @click="addDetailDataList1">新增</a-button>
        </h3>
        <a-table
          :rowKey="(data, index) => index"
          :columns="columns"
          :dataSource="detailDataList1"
          :pagination="false"
          bordered
        >
          <span slot="action" slot-scope="text, record, index">
            <a
              href="javascript:;"
              v-if="!record.isadd"
              style="margin-right: 5px"
              @click="editDetailDataList(record)"
            >保存</a>
            <a-popconfirm
              v-if="record.isadd"
              title="确定新增该条数据吗?"
              ok-text="确定"
              cancel-text="取消"
              @confirm="confirmAddList(record)"
            >
              <a href="javascript:;" style="margin-right: 5px">新增</a>
            </a-popconfirm>
            <a-popconfirm
              v-if="!record.isadd"
              title="确定删除吗?"
              ok-text="确定"
              cancel-text="取消"
              @confirm="confirmDelete(record.id)"
            >
              <a href="javascript:;">删除</a>
            </a-popconfirm>
            <a href="javascript:;" v-if="record.isadd" @click="removeDetailDataList1(index)">取消</a>
          </span>

          <span slot="dsBaseDataType" slot-scope="text, record">
            {{ record.dsBaseDataType == 0 ? "结构料" : "电子料" }}
          </span>

          <span slot="categoryName" slot-scope="text, record">
            <a-input v-model="record.categoryName" placeholder="部件名称"></a-input>
          </span>

          <span
            :slot="tdItem"
            slot-scope="text, record"
            v-for="(tdItem, tdIndex) in TdArr"
            :key="tdIndex"
          >
            <a-input v-model="record[tdItem]"></a-input>
          </span>

          <span slot="needBomNum" slot-scope="text, record">
            <a-input-number
              v-model="record.needBomNum"
              :min="1"
              style="width: 80px"
              placeholder="数量"
            ></a-input-number>
          </span>

          <span slot="totalPrice" slot-scope="text, record">
            <a-input v-model="record.totalPrice" style="width: 80px" placeholder="总价" />
          </span>
        </a-table>
      </div>
    </a-card>
  </div>
</template>

<script>
import {
  getSmartBomQuoteDetail,
  addSmartBomQuoteRelations,
  updateSmartBomQuoteRelations,
  deleteSmartBomQuoteRelation,
  importExcel,
  downloadTemplate
} from "@/services/intelligentQuotation/bomQuotationManagement";

export default {
  data() {
    return {
      queryFrom: {},
      queryFromDataList: [
        { label: "报价单编号", key: "bomQuoteNo" },
        { label: "报价单名称", key: "bomQuoteName" },
        { label: "客户名称", key: "customerName" },
        { label: "产品名称", key: "productName" },
        { label: "产品编号", key: "productNo" },
        { label: "研发类型", key: "developmentType" },
        { label: "产品类型", key: "productType" },
        { label: "样机数量", key: "prototypeNum" },
        { label: "项目周期", key: "projectCycle" },
        { label: "物料种类数", key: "bomNum" },
        { label: "电子料种类数", key: "electronicNum" },
        { label: "电子料总价", key: "electronicMoney" },
        { label: "结构料种类数", key: "structuralNum" },
        { label: "结构料总价", key: "structuralMoney" },
        { label: "备注", key: "remarks" }
      ],
      detailDataList1: [], // 结构料
      detailDataList2: [], // 电子料
      columns: [
        { title: "操作", scopedSlots: { customRender: "action" }, width: 150 },
        { title: "物料类型", dataIndex: "dsBaseDataType", scopedSlots: { customRender: "dsBaseDataType" } },
        { title: "部件名称", dataIndex: "categoryName", scopedSlots: { customRender: "categoryName" } },
        { title: "9NC编码", dataIndex: "nineNC", scopedSlots: { customRender: "nineNC" } },
        { title: "物料名称", dataIndex: "bomName", scopedSlots: { customRender: "bomName" } },
        { title: "品牌", dataIndex: "brand", scopedSlots: { customRender: "brand" } },
        { title: "型号", dataIndex: "model", scopedSlots: { customRender: "model" } },
        { title: "规格", dataIndex: "specifications", scopedSlots: { customRender: "specifications" } },
        { title: "数量", dataIndex: "needBomNum", scopedSlots: { customRender: "needBomNum" } },
        { title: "单价", dataIndex: "recentPrice", scopedSlots: { customRender: "recentPrice" } },
        { title: "总价", dataIndex: "totalPrice", scopedSlots: { customRender: "totalPrice" } }
      ],
      TdArr: ["nineNC", "bomName", "brand", "model", "specifications", "recentPrice"],
      rules: {}
    };
  },
  created() {
    this.getDetail();
  },
  methods: {
    // 获取详情
    async getDetail() {
      const id = this.$route.query.id;
      if (id) {
        const res = await getSmartBomQuoteDetail(id);
        if (res.code == 1) {
          this.queryFrom = res.data;
          const relations = res.data.smartBomQuoteRelations || [];
          this.detailDataList1 = relations.filter(x => x.dsBaseDataType == 0);
          this.detailDataList2 = relations.filter(x => x.dsBaseDataType == 1);
        }
      }
    },
    // 新增结构料
    addDetailDataList1() {
      this.detailDataList1.push({
        dsBaseDataType: 0,
        categoryName: "",
        nineNC: "",
        bomName: "",
        brand: "",
        model: "",
        specifications: "",
        needBomNum: 1,
        recentPrice: 0,
        totalPrice: 0,
        isadd: true
      });
    },
    // 新增电子料
    addDetailDataList2() {
      this.detailDataList2.push({
        dsBaseDataType: 1,
        categoryName: "",
        nineNC: "",
        bomName: "",
        brand: "",
        model: "",
        specifications: "",
        needBomNum: 1,
        recentPrice: 0,
        totalPrice: 0,
        isadd: true
      });
    },
    // 移除结构料
    removeDetailDataList1(index) {
      this.detailDataList1.splice(index, 1);
    },
    // 移除电子料
    removeDetailDataList2(index) {
      this.detailDataList2.splice(index, 1);
    },
    // 确认新增
    async confirmAddList(record) {
      const params = {
        smartBomQuoteId: this.$route.query.id,
        smartBomQuoteRelations: [record]
      };
      const res = await addSmartBomQuoteRelations(params);
      if (res.code == 1) {
        this.$message.success("新增成功");
        this.getDetail();
      }
    },
    // 编辑明细
    async editDetailDataList(record) {
      const res = await updateSmartBomQuoteRelations(record);
      if (res.code == 1) {
        this.$message.success("更新成功");
        this.getDetail();
      }
    },
    // 删除明细
    async confirmDelete(id) {
      const res = await deleteSmartBomQuoteRelation(id);
      if (res.code == 1) {
        this.$message.success("删除成功");
        this.getDetail();
      }
    },
    // 导入Excel
    async importExcel(file) {
      const formData = new FormData();
      formData.append("ImportFile", file.file);
      const res = await importExcel(formData);
      if (res.code == 1) {
        this.$message.success("导入成功");
        this.getDetail();
      } else {
        this.$message.error(res.message || "导入失败");
      }
    },
    // 下载模板
    downloadTemplate() {
      downloadTemplate();
    },
    // 筛选
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
  margin-bottom: 20px;
}
</style>

