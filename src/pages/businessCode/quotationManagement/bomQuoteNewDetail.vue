<template>
  <a-card>
    <div style="margin-bottom: 16px;">
      <a-button @click="goBack" style="margin-right: 10px;">返回</a-button>
      <a-button type="primary" @click="editQuote" v-if="quoteData && quoteData.status === 0">编辑</a-button>
    </div>
    
    <a-descriptions title="新BOM报价详情" bordered>
      <a-descriptions-item label="报价单名称">{{ quoteData?.bomQuoteName || '-' }}</a-descriptions-item>
      <a-descriptions-item label="报价单编号">{{ quoteData?.bomQuoteNo || '-' }}</a-descriptions-item>
      <a-descriptions-item label="状态">
        <span v-if="quoteData?.status == 0">草稿</span>
        <span v-if="quoteData?.status == 1">已确认</span>
        <span v-if="quoteData?.status == 2" style="color: green;">审批中</span>
        <span v-if="quoteData?.status == 3" style="color: green;">审批通过</span>
        <span v-if="quoteData?.status == 10" style="color: red;">不通过</span>
      </a-descriptions-item>
      <a-descriptions-item label="报价人姓名">{{ quoteData?.createUserName || '-' }}</a-descriptions-item>
      <a-descriptions-item label="报价产品名">{{ quoteData?.productName || '-' }}</a-descriptions-item>
      <a-descriptions-item label="物料种类数">{{ quoteData?.bomNum || 0 }}</a-descriptions-item>
      <a-descriptions-item label="电子料种类数">{{ quoteData?.electronicNum || 0 }}</a-descriptions-item>
      <a-descriptions-item label="电子料总价">{{ quoteData?.electronicMoney || 0 }}</a-descriptions-item>
      <a-descriptions-item label="结构料种类数">{{ quoteData?.structuralNum || 0 }}</a-descriptions-item>
      <a-descriptions-item label="结构料总价">{{ quoteData?.structuralMoney || 0 }}</a-descriptions-item>
      <a-descriptions-item label="BOM总价">{{ (quoteData?.electronicMoney || 0) + (quoteData?.structuralMoney || 0) }}</a-descriptions-item>
      <a-descriptions-item label="发起时间">
        {{ quoteData?.creationTime ? quoteData.creationTime.substring(0, 19).replace("T", " ") : '-' }}
      </a-descriptions-item>
      <a-descriptions-item label="备注" :span="3">{{ quoteData?.remarks || '-' }}</a-descriptions-item>
    </a-descriptions>

    <div style="margin-top: 20px;">
      <h3>BOM明细</h3>
      <vxe-table
        :data="quoteData?.bomDetails || []"
        border
        height="400"
        show-overflow="tooltip"
      >
        <vxe-column type="seq" width="60"></vxe-column>
        <vxe-column field="materialCode" title="物料编码" width="120"></vxe-column>
        <vxe-column field="materialName" title="物料名称" width="150"></vxe-column>
        <vxe-column field="specification" title="规格型号" width="150"></vxe-column>
        <vxe-column field="quantity" title="数量" width="100"></vxe-column>
        <vxe-column field="unitPrice" title="单价" width="100"></vxe-column>
        <vxe-column field="totalPrice" title="总价" width="100">
          <template #default="{ row }">
            {{ (row.quantity * row.unitPrice).toFixed(2) }}
          </template>
        </vxe-column>
        <vxe-column field="category" title="分类" width="100">
          <template #default="{ row }">
            <span v-if="row.category === 'electronic'">电子料</span>
            <span v-if="row.category === 'structural'">结构料</span>
          </template>
        </vxe-column>
      </vxe-table>
    </div>
  </a-card>
</template>

<script>
import { BomQuoteNewDetailDataList } from '@/services/businessCode/quotationManagement/bomQuoteNew'

export default {
  name: 'BomQuoteNewDetail',
  data() {
    return {
      quoteData: null,
      loading: false
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    async loadData() {
      const id = this.$route.query.id
      if (!id) {
        this.$message.error('缺少报价单ID')
        this.goBack()
        return
      }
      
      this.loading = true
      try {
        const res = await BomQuoteNewDetailDataList(id)
        if (res.code === 1) {
          this.quoteData = res.data
        } else {
          this.$message.error(res.message || '加载数据失败')
        }
      } catch (error) {
        console.error('加载数据失败:', error)
        this.$message.error('加载数据失败')
      } finally {
        this.loading = false
      }
    },
    
    goBack() {
      this.$router.go(-1)
    },
    
    editQuote() {
      this.$router.push({
        path: '/quotationManagement/bomQuoteNew',
        query: { editId: this.quoteData.id }
      })
    }
  }
}
</script>

<style scoped>
</style>

