<template>
  <a-modal
    :title="modalTitle"
    :width="1200"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-form-model
      ref="form"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-model-item label="报价单名称" prop="bomQuoteName">
            <a-input v-model="form.bomQuoteName" placeholder="请输入报价单名称" />
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="报价单编号" prop="bomQuoteNo">
            <a-input v-model="form.bomQuoteNo" placeholder="请输入报价单编号" />
          </a-form-model-item>
        </a-col>
      </a-row>
      
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-model-item label="报价产品名" prop="productName">
            <a-input v-model="form.productName" placeholder="请输入报价产品名" />
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="备注" prop="remarks">
            <a-input v-model="form.remarks" placeholder="请输入备注" />
          </a-form-model-item>
        </a-col>
      </a-row>

      <a-form-model-item label="BOM明细">
        <div style="margin-bottom: 10px;">
          <a-button type="primary" @click="addBomDetail">添加明细</a-button>
          <a-button type="primary" @click="importExcel" style="margin-left: 10px;">导入Excel</a-button>
          <a-button @click="downloadTemplate" style="margin-left: 10px;">下载模板</a-button>
        </div>
        
        <vxe-table
          ref="xTable"
          :data="form.bomDetails"
          border
          height="300"
          show-overflow="tooltip"
        >
          <vxe-column type="seq" width="60"></vxe-column>
          <vxe-column field="materialCode" title="物料编码" width="120">
            <template #default="{ row }">
              <a-input v-model="row.materialCode" placeholder="物料编码" />
            </template>
          </vxe-column>
          <vxe-column field="materialName" title="物料名称" width="150">
            <template #default="{ row }">
              <a-input v-model="row.materialName" placeholder="物料名称" />
            </template>
          </vxe-column>
          <vxe-column field="specification" title="规格型号" width="150">
            <template #default="{ row }">
              <a-input v-model="row.specification" placeholder="规格型号" />
            </template>
          </vxe-column>
          <vxe-column field="quantity" title="数量" width="100">
            <template #default="{ row }">
              <a-input-number v-model="row.quantity" :min="0" :precision="2" style="width: 100%" />
            </template>
          </vxe-column>
          <vxe-column field="unitPrice" title="单价" width="100">
            <template #default="{ row }">
              <a-input-number v-model="row.unitPrice" :min="0" :precision="4" style="width: 100%" />
            </template>
          </vxe-column>
          <vxe-column field="totalPrice" title="总价" width="100">
            <template #default="{ row }">
              <span>{{ (row.quantity * row.unitPrice).toFixed(2) }}</span>
            </template>
          </vxe-column>
          <vxe-column field="category" title="分类" width="100">
            <template #default="{ row }">
              <a-select v-model="row.category" placeholder="分类" style="width: 100%">
                <a-select-option value="electronic">电子料</a-select-option>
                <a-select-option value="structural">结构料</a-select-option>
              </a-select>
            </template>
          </vxe-column>
          <vxe-column title="操作" width="80">
            <template #default="{ rowIndex }">
              <a-button type="link" size="small" @click="removeBomDetail(rowIndex)">删除</a-button>
            </template>
          </vxe-column>
        </vxe-table>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import { addBomQuoteNewDataList, BomQuoteNewDetailDataList, addBomQuoteNewDetail, editBomQuoteNewDetail, deleteBomQuoteNewDetail, importExcel, downloadTemplate } from '@/services/businessCode/quotationManagement/bomQuoteNew'

export default {
  name: 'BomQuoteNewModal',
  data() {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      visible: false,
      confirmLoading: false,
      modalTitle: '',
      form: {
        bomQuoteName: '',
        bomQuoteNo: '',
        productName: '',
        remarks: '',
        bomDetails: []
      },
      rules: {
        bomQuoteName: [
          { required: true, message: '请输入报价单名称', trigger: 'blur' }
        ],
        bomQuoteNo: [
          { required: true, message: '请输入报价单编号', trigger: 'blur' }
        ],
        productName: [
          { required: true, message: '请输入报价产品名', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    openModules(type, record) {
      this.modalTitle = type === 'add' ? '新增新BOM报价' : '编辑新BOM报价'
      this.visible = true
      
      if (type === 'edit' && record) {
        this.loadData(record.id)
      } else {
        this.resetForm()
      }
    },
    
    async loadData(id) {
      try {
        const res = await BomQuoteNewDetailDataList(id)
        if (res.code === 1) {
          this.form = {
            ...res.data,
            bomDetails: res.data.bomDetails || []
          }
        }
      } catch (error) {
        this.$message.error('加载数据失败')
      }
    },
    
    resetForm() {
      this.form = {
        bomQuoteName: '',
        bomQuoteNo: '',
        productName: '',
        remarks: '',
        bomDetails: []
      }
      this.$refs.form && this.$refs.form.resetFields()
    },
    
    addBomDetail() {
      this.form.bomDetails.push({
        materialCode: '',
        materialName: '',
        specification: '',
        quantity: 0,
        unitPrice: 0,
        category: 'electronic'
      })
    },
    
    removeBomDetail(index) {
      this.form.bomDetails.splice(index, 1)
    },
    
    async handleSubmit() {
      try {
        await this.$refs.form.validate()
        this.confirmLoading = true
        
        const res = await addBomQuoteNewDataList(this.form)
        if (res.code === 1) {
          this.$message.success('保存成功')
          this.handleCancel()
          this.$emit('ok')
        } else {
          this.$message.error(res.message || '保存失败')
        }
      } catch (error) {
        console.error('保存失败:', error)
        this.$message.error('保存失败')
      } finally {
        this.confirmLoading = false
      }
    },
    
    handleCancel() {
      this.visible = false
      this.resetForm()
    },
    
    importExcel() {
      // 实现Excel导入功能
      this.$message.info('Excel导入功能待实现')
    },
    
    downloadTemplate() {
      downloadTemplate()
    }
  }
}
</script>

<style scoped>
</style>
