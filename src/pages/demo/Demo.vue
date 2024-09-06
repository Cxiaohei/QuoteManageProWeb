<template>
  <!-- <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <h1>{{$t('content')}}</h1>
  </div>-->
  <a-card>
    <a-row>
      <a-col :span="12">
        <a-timeline class="homeflow">
          <a-timeline-item color="green" v-for="(item,index) in homeflowList" :key="index">
            <p class="title">{{item.title}}</p>
            <p
              v-for="(listItem,listIndex) in item.list"
              :key="listIndex"
              style="width: 350px;border:1px solid #ddd;border-radius: 5px;padding: 5px 5px 5px 55px;"
            >
              <router-link :to="{ path: listItem.path }">{{listItem.name}}</router-link>
            </p>
          </a-timeline-item>
        </a-timeline>
      </a-col>
      <a-col :span="12">
        <a-timeline class="homeflow">
          <a-timeline-item color="green" v-for="(item,index) in homeflowList2" :key="index">
            <p class="title">{{item.title}}</p>
            <p
              v-for="(listItem,listIndex) in item.list"
              :key="listIndex"
              style="width: 350px;border:1px solid #ddd;border-radius: 5px;padding: 5px 5px 5px 55px;"
            >
              <router-link :to="{ path: listItem.path }">{{listItem.name}}</router-link>
            </p>
          </a-timeline-item>
        </a-timeline>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Demo",
  i18n: require("./i18n"),
  data() {
    return {
      homeflowList: [
        {
          title: "报价",
          list: [
            {
              name: "研发费报价",
              path: "/quotationManagement/rdProjects"
            },
            {
              name: "Bom报价",
              path: "/quotationManagement/bomQuote"
            }
          ]
        },
        {
          title: "项目评分",
          list: [
            {
              name: "项目评分",
              path: "/quotationManagement/allProjects"
            }
          ]
        },
        {
          title: "BOM报价",
          list: [
            {
              name: "BOM报价",
              path: "/quotationManagement/allProjects"
            }
          ]
        },
        {
          title: "制造费用报价",
          list: [
            {
              name: "制造费用报价",
              path: "/quotationManagement/allProjects"
            }
          ]
        },
        {
          title: "报价审批",
          list: [
            {
              name: "报价审批",
              path: "/approveManagement/allApprove"
            }
          ]
        }
      ],
      
      homeflowList2: [
        {
          title: "立项",
          list: [
            {
              name: "项目立项",
              path: "/performance/performanceManagement"
            }
          ]
        },
        {
          title: "管理",
          list: [
            {
              name: "项目绩效管理",
              path: "/performance/performanceManagement"
            },
            {
              name: "项目变更管理",
              path: "/performance/performanceManagement"
            }
          ]
        },
        {
          title: "项目结案",
          list: [
            {
              name: "项目结案",
              path: "/performance/performanceManagement"
            }
          ]
        }
      ]
    };
  },
  computed: {
    ...mapState("setting", ["pageMinHeight"]),
    desc() {
      return this.$t("description");
    }
  }
};
</script>

<style scoped lang="less">
@import "index";
.homeflow {
  padding: 0 30px;
  text-align: left;
  .title {
    font-size: 24px;
    margin: 0 0 10px;
    font-weight: bold;
  }
  a {
    color: #1890ff;
    font-weight: bold;
  }
}
</style>