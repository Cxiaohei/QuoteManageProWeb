<template>
  <div>
    <a-tabs default-active-key="1">
      <a-tab-pane key="0" tab="Bom报价审批审批">
        <TypeApprove :auditeType="0"></TypeApprove>
      </a-tab-pane>
      <a-tab-pane key="1" tab="制作费用报价审批">
        <TypeApprove :auditeType="1"></TypeApprove>
      </a-tab-pane>
      <a-tab-pane key="2" tab="研发费用报价审批">
        <TypeApprove :auditeType="2"></TypeApprove>
      </a-tab-pane>
      <a-tab-pane key="3" tab="Odm报价审批">
        <TypeApprove :auditeType="3"></TypeApprove>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
      
  <script>
import { checkPermission } from "@/utils/abp";
import { mapGetters } from "vuex";
import TypeApprove from "./TypeApprove";

export default {
  components: { TypeApprove },
  data() {
    return {};
  },
  mounted() {},
  created() {},
  computed: {
    ...mapGetters("account", ["organizationId"])
  },
  methods: {
    checkPermission
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
      