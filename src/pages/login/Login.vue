<template>
  <common-layout>
    <div class="login_box">
      <div class="login_right">
        <div class="top">
          <div class="header">
            <span class="title">{{ systemName }}</span>
          </div>
        </div>
        <div class="login">
          <a-space style="text-align: center; margin-bottom: 10px">
            <h2
              @click="grant_type = 'code'"
              style="font-weight: bolder; cursor: pointer; margin-right: 20px"
              :style="{ color: grant_type == 'code' ? '#73d8ff' : '#424242' }"
            >密码登录</h2>
            <!-- <h2
              @click="grant_type = 'sms'"
              style="font-weight: bolder; cursor: pointer"
              :style="{ color: grant_type == 'sms' ? '#73d8ff' : '#424242' }"
            >短信登录</h2>-->
          </a-space>
          <a-form @submit="onSubmit" :form="form">
            <a-alert
              type="error"
              :closable="true"
              v-show="error"
              :message="error"
              showIcon
              style="margin-bottom: 24px"
            />
            <!-- <a-form-item>
              <a-input size="large" addon-before="租户" disabled placeholder="未选择" v-model="tenant">
                <a-button slot="suffix" type="primary" @click="visible = true">切换</a-button>
              </a-input>
            </a-form-item>-->

            <a-form-item v-if="grant_type == 'code'">
              <a-input
                autocomplete="autocomplete"
                size="large"
                placeholder="admin"
                v-decorator="[
                  'name',
                  {
                    rules: [
                      { required: true, message: '请输入账户名', whitespace: true },
                    ],
                  },
                ]"
              >
                <a-icon slot="prefix" type="user" />
              </a-input>
            </a-form-item>
            <a-form-item v-if="grant_type == 'code'">
              <a-input
                size="large"
                placeholder="1q2w3E*"
                autocomplete="autocomplete"
                type="password"
                v-decorator="[
                  'password',
                  {
                    rules: [
                      { required: true, message: '请输入密码', whitespace: true },
                    ],
                  },
                ]"
              >
                <a-icon slot="prefix" type="lock" />
              </a-input>
            </a-form-item>
            <!-- <a-form-item v-if="grant_type == 'code'">
              <div class="codeCls">
                <a-input
                  size="large"
                  placeholder="验证码"
                  v-decorator="[
                  'code',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入验证码',
                        whitespace: true,
                      },
                    ],
                  },
                ]"
                ></a-input>
                <img :src="imgCode" alt @click="getImgCode" />
              </div>
            </a-form-item> -->

            <a-form-item v-if="grant_type == 'sms'">
              <a-input
                autocomplete="autocomplete"
                size="large"
                placeholder="手机号"
                v-decorator="[
                'phone',
                {
                  rules: [
                    {
                      required: true,
                      pattern: validatPhone,
                      trigger: 'blur',
                    },
                  ],
                },
              ]"
              >
                <a-icon slot="prefix" type="phone" />
              </a-input>
            </a-form-item>
            <a-form-item v-if="grant_type == 'sms'">
              <div class="codeCls">
                <a-input
                  size="large"
                  placeholder="短信验证码"
                  v-decorator="[
                  'messageCode',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入验证码',
                        whitespace: true,
                      },
                    ],
                  },
                ]"
                ></a-input>
                <a-button
                  type="primary"
                  style="width: 128px;height:38px"
                  @click="startCountdown"
                  :disabled="count == 60 ? false : true"
                >{{ count == 60 ? '获取验证码' : count + 's后重新获取' }}</a-button>
              </div>
            </a-form-item>

            <a-form-item>
              <a-button
                :loading="logging"
                style="width: 100%; margin-top: 24px;"
                size="large"
                htmlType="submit"
                type="primary"
                class="login_btn"
              >登录</a-button>
            </a-form-item>
          </a-form>
          <a-modal
            title="切换租户"
            :visible="visible"
            :confirm-loading="confirmLoading"
            @ok="tenantSwitchModal"
            @cancel="visible = false"
          >
            <a-input v-model="tenantName" size="large" placeholder="租户名称" />
          </a-modal>
        </div>
        <we-chat-login-modal ref="weChatLoginModal" @ok="handleOk($event)" />
      </div>
    </div>
  </common-layout>
</template>

<script>
import CommonLayout from "@/layouts/CommonLayout";
import { login, getImgCode, sendCode } from "@/services/user";
import { setAuthorization } from "@/utils/request";
import { mapMutations } from "vuex";
import { tenantSwitch } from "@/services/multiTenancy/tenant";
import WeChatLoginModal from "./modules/WeChatLoginModal";
import { mapState } from "vuex";
export default {
  name: "Login",
  components: { CommonLayout, WeChatLoginModal },
  data() {
    //电话校验
    const validatPhone = async (RuleObject, value) => {
      const reg = new RegExp(/^(?:(?:\+|00)86)?1[3-9]\d{9}$/);
      if (value) {
        if (!reg.test(value)) {
          return Promise.reject("请输入正确的手机号");
        } else {
          return Promise.resolve();
        }
      } else {
        return Promise.resolve();
      }
    };
    return {
      validatPhone,
      logging: false,
      error: "",
      form: this.$form.createForm(this),
      visible: false,
      confirmLoading: false,
      tenant: "",
      tenantName: "",
      grant_type: "code", //登录类型 验证码 短信验证码
      imgCode: "", //验证码图片地址
      count: 60, //倒计数
      getcount: true //能否执行获取短信验证码
    };
  },
  computed: {
    ...mapState("setting", ["footerLinks", "copyright"]),
    systemName() {
      return this.$store.state.setting.systemName;
    }
  },
  mounted() {
    //获取验证码
    this.getImgCode();
  },
  methods: {
    ...mapMutations("account", ["setUser", "setPermissions", "setRoles"]),
    onSubmit(e) {
      this.$message.success("登录成功", 3);
      this.$router.push("/dashboard/home");

      e.preventDefault();
      this.form.validateFields(err => {
        if (!err) {
          this.logging = true;
          const name = this.form.getFieldValue("name");
          const password = this.form.getFieldValue("password");
          const tenant = this.tenant;
          login(name, password, tenant)
            .then(this.afterLogin)
            .finally(() => {
              this.logging = false;
            });
        }
      });
    },
    afterLogin(res) {
      this.logging = false;
      const loginRes = res;
      if (loginRes) {
        // const { user, permissions, roles } = loginRes.data;
        // this.setUser(user);
        // this.setPermissions(permissions);
        // this.setRoles(roles);
        setAuthorization({
          token: loginRes.access_token,
          expireAt: new Date(new Date().getTime() + loginRes.expires_in)
        });
        // 获取路由配置
        // getRoutesConfig().then((result) => {
        //   const routesConfig = result.data.data;
        //   loadRoutes(
        //     { router: this.$router, store: this.$store, i18n: this.$i18n },
        //     routesConfig
        //   );
        //   this.$router.push("/demo");
        //   this.$message.success(loginRes.message, 3);
        // });
        this.$store.dispatch("account/refreshPermissions", res => {
          if (res == "success") {
            this.$message.success("登录成功", 3);
            this.$router.push("/dashboard/home");
          }
        });
      } else {
        this.error = loginRes.message;
      }
    },
    handlePermissions(obj) {
      let permissions = [];
      if (!obj) {
        return permissions;
      }
      permissions = Object.keys(obj).map(x => {
        return {
          id: x,
          operation: []
        };
      });
      return permissions;
      // let list = Object.keys(obj).map((x) => {
      //   let n = x.split(".").length - 1;
      //   return {
      //     val: x,
      //     num: n,
      //   };
      // });
      // let idList = list.filter((x) => x.num == 1);
      // permissions = idList.map((x) => {
      //   let operation = list
      //     .filter((y) => y.num == 2 && y.val.indexOf(x.val) > -1)
      //     .map((y) => {
      //       return y.val.split(".")[2];
      //     });
      //   return {
      //     id: x.val,
      //     operation: operation,
      //   };
      // });
      // return permissions;
    },
    tenantSwitchModal() {
      this.confirmLoading = true;
      let params = {
        name: this.tenantName
      };
      tenantSwitch(params)
        .then(res => {
          this.visible = false;
          this.tenant = this.tenantName;
        })
        .finally(() => {
          this.confirmLoading = false;
        });
    },
    handleOk(res) {
      this.afterLogin(res);
    },
    // 获取验证码
    getImgCode() {
      let baseUrl = process.env.VUE_APP_API_BASE_URL;
      this.timestamp =
        new Date().getTime() +
        Math.floor(Math.random() * (10000 - 1000) + 1000);
      console.log(new Date().getTime());
      baseUrl += `/api/administration-service/common/validatecode/${this.timestamp}`;
      getImgCode(this.timestamp).then(res => {
        this.imgCode = baseUrl;
      });
    },
    // 获取手机验证码
    getPhoneCode() {
      const phone = this.form.getFieldValue("phone");
      sendCode({
        phone: phone,
        smsFrom: "Manage",
        sendType: "Login"
      }).then(res => {
        if (res.success) {
          this.$message.success(res.message);
        } else {
          this.$message.error(res.message);
          this.getcount = true;
          this.count = 60;
        }
      });
    },
    //倒计时
    startCountdown() {
      if (this.getcount) {
        const phone = this.form.getFieldValue("phone");
        const reg = new RegExp(/^(?:(?:\+|00)86)?1[3-9]\d{9}$/);
        if (reg.test(phone)) {
          this.getcount = false;
          this.count--;
          this.getPhoneCode();
          this.countdown = setInterval(() => {
            this.count--;
            if (this.count === 0) {
              this.count = 60;
              this.getcount = true;
              clearInterval(this.countdown);
            }
          }, 1000);
        } else {
          this.$message.error("请输入正确的手机号");
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
.common-layout {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  .login_box {
    background-color: transparent;
    width: 1080px;
    height: 500px;
    top: 50%;
    transform: translate(0, 2px);
    .login_right {
      width: 50%;
      height: 100%;
      margin: auto auto;
      background: #fff;
      padding: 40px 75px 0;
      position: relative;
      .login-footer {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
      }
    }
  }
  .top {
    text-align: center;
    margin-bottom: 30px;
    .header {
      height: 44px;
      line-height: 44px;
      a {
        text-decoration: none;
      }
      .logo {
        height: 44px;
        vertical-align: top;
        margin-right: 16px;
      }
      .title {
        font-size: 30px;
        color: @title-color;
        font-family: "Myriad Pro", "Helvetica Neue", Arial, Helvetica,
          sans-serif;
        font-weight: 600;
        position: relative;
        top: 2px;
      }
    }
    .desc {
      font-size: 14px;
      color: @text-color-second;
      margin-top: 12px;
      margin-bottom: 40px;
    }
  }
  .login {
    width: 368px;
    margin: 0 auto;
    @media screen and (max-width: 576px) {
      width: 95%;
    }
    @media screen and (max-width: 320px) {
      .captcha-button {
        font-size: 14px;
      }
    }
    .icon {
      font-size: 24px;
      color: @text-color-second;
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: @primary-color;
      }
    }
  }
}
.codeCls {
  display: flex;
  align-items: center;

  & > img {
    flex-shrink: 0;
    width: 128px;
    height: 40px;
    object-fit: fill;
    margin-left: 10px;
    cursor: pointer;
  }
}
@media (max-width: 1200px) {
  .common-layout {
    .login_box {
      width: 100%;
      height: 600px;
      .login_left {
        display: none;
      }
      .login_right {
        width: 100%;
        float: none;
        padding: 60px 20px 0;
        .title {
          font-size: 20px;
        }
      }
    }
  }
}
</style>
