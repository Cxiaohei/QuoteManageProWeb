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
            <p v-for="(listItem,listIndex) in item.list" :key="listIndex">
              <router-link :to="{ path: listItem.path }">{{listItem.name}}</router-link>
            </p>
          </a-timeline-item>
        </a-timeline>
      </a-col>
      <a-col :span="12">
        <a-timeline class="homeflow">
          <a-timeline-item color="green" v-for="(item,index) in homeflowList" :key="index">
            <p class="title">{{item.title}}</p>
            <p v-for="(listItem,listIndex) in item.list" :key="listIndex">
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
          title: "物料",
          list: [
            {
              name: "内部物料",
              path: "/category1/materialManagement"
            },
            {
              name: "外部物料",
              path: "/category1/outMaterialManagement"
            }
          ]
        },
        {
          title: "物料",
          list: [
            {
              name: "内部物料",
              path: "/category1/materialManagement"
            },
            {
              name: "外部物料",
              path: "/category1/outMaterialManagement"
            }
          ]
        },
        {
          title: "物料",
          list: [
            {
              name: "内部物料",
              path: "/category1/materialManagement"
            },
            {
              name: "外部物料",
              path: "/category1/outMaterialManagement"
            }
          ]
        },
        {
          title: "物料",
          list: [
            {
              name: "内部物料",
              path: "/category1/materialManagement"
            },
            {
              name: "外部物料",
              path: "/category1/outMaterialManagement"
            }
          ]
        },
        {
          title: "物料",
          list: [
            {
              name: "内部物料",
              path: "/category1/materialManagement"
            },
            {
              name: "外部物料",
              path: "/category1/outMaterialManagement"
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