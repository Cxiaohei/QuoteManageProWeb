<template>
  <div>
    <a-tabs default-active-key="1">
      <a-tab-pane key="1" tab="研发费报价">
        <rdProjects></rdProjects>
      </a-tab-pane>
      <a-tab-pane key="2" tab="ODM报价">
        <odmQuote></odmQuote>
      </a-tab-pane>
      <a-tab-pane key="3" tab="OEM报价">
        <bomQuote></bomQuote>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
      
  <script>
import { checkPermission } from "@/utils/abp";
import { mapGetters } from "vuex";
import rdProjects from "./rdProjects";
import odmQuote from "./odmQuote";
import bomQuote from "./bomQuote";

export default {
  components: { rdProjects, odmQuote, bomQuote },
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
      