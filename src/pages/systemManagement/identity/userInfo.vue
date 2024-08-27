<template>
  <a-spin :spinning="loading">
    <a-card>
      <a-tabs v-model="activeKey">
        <a-tab-pane key="1" tab="修改信息">
          <a-form-model
            :model="form"
            :rules="rules"
            style="height: calc(100vh - 200px); width: 60%; overflow: auto"
            ref="ruleForm"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-form-model-item label="用户名" ref="userName" prop="userName">
              <a-input
                disabled
                v-model.trim="form.userName"
                placeholder="请输入角色名称"
                @blur="
                  () => {
                    $refs.userName.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
            <a-form-model-item label="名">
              <a-input v-model.trim="form.name" />
            </a-form-model-item>
            <a-form-model-item label="姓">
              <a-input v-model.trim="form.surname" />
            </a-form-model-item>
            <!-- <a-form-model-item label="性别">
                <a-radio-group v-model.trim="form.sex">
                  <a-radio :value="1">男</a-radio>
                  <a-radio :value="2">女</a-radio>
                </a-radio-group>
              </a-form-model-item> -->
            <a-form-model-item label="邮箱地址" ref="email" prop="email">
              <a-input
                v-model.trim="form.email"
                @blur="
                  () => {
                    $refs.email.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
            <a-form-model-item label="手机号码">
              <a-input v-model.trim="form.phoneNumber" />
            </a-form-model-item>
            <a-button type="primary" style="margin-left: 20%" @click="handleOk"
              >保存</a-button
            >
          </a-form-model>
        </a-tab-pane>
        <a-tab-pane key="2" tab="修改密码">
          <a-form-model
            :model="form2"
            :rules="rules2"
            style="height: calc(100vh - 200px); width: 60%; overflow: auto"
            ref="ruleForm2"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-form-model-item label="当前密码" prop="currentPassword">
              <a-input v-model.trim="form2.currentPassword" type="password" />
            </a-form-model-item>
            <a-form-model-item label="新密码" prop="newPassword">
              <a-input v-model.trim="form2.newPassword" type="password" />
            </a-form-model-item>
            <a-form-model-item label="确认新密码" prop="newPasswordConfirm">
              <a-input
                v-model.trim="form2.newPasswordConfirm"
                type="password"
              />
            </a-form-model-item>
            <a-button type="primary" style="margin-left: 20%" @click="handleOk2"
              >保存</a-button
            >
          </a-form-model>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </a-spin>
</template>
<script>
import { mapMutations } from "vuex";
import {
  createUpdate,
  postChangePassword,
  putUser,
  get,
} from "@/services/identity/user";
export default {
  data() {
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (value.length < 6) {
        callback(new Error("密码长度不能少于6位"));
      } else {
        if (this.form2.currentPassword !== "") {
          this.$refs.ruleForm2.validateField("currentPassword");
        }
        callback();
      }
    };
    let validatePass1 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (value.length < 6) {
        callback(new Error("密码长度不能少于6位"));
      } else {
        if (this.form2.newPassword !== "") {
          this.$refs.ruleForm2.validateField("newPassword");
        }
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (value.length < 6) {
        callback(new Error("密码长度不能少于6位"));
      } else if (value !== this.form2.newPassword) {
        callback(new Error("两次密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      showFile: [],
      loading: false,
      activeKey: "1",
      userid:JSON.parse(localStorage.getItem("admin.user")).id,
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      form: {},
      form2: {},
      rules2: {
        currentPassword: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { validator: validatePass, trigger: "change" },
        ],
        newPassword: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { validator: validatePass1, trigger: "change" },
        ],
        newPasswordConfirm: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { validator: validatePass2, trigger: "change" },
        ],
      },
      rules: {
        userName: [
          { required: true, message: "用户名必须填写", trigger: "blur" },
        ],
        email: [
          {
            type: "email",
            required: true,
            message: "请填写正确的邮箱地址",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    ...mapMutations("account", ["setUser"]),
    getUserInfo(flag) {
      this.loading = true;
      get(this.userid)
        .then((res) => {
            console.log('form信息',res);
            this.form = {
                id: res.id,
              userName: res.userName,
              name: res.name,
              surname: res.surname,
              email: res.email,
              phoneNumber: res.phoneNumber,
            };
            this.form2 = {
              id: res.id,
            };
            if (flag) {
              this.setUser({
                ...res,
              });
            }
        
            console.log('form信息',this.form);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleOk2() {
      this.$refs.ruleForm2.validate((valid) => {
        if (valid) {
          this.loading = true;
          postChangePassword(this.form2)
            .then((res) => {
              this.$message.success("操作成功");
              this.getUserInfo();
            })
            .finally(() => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },
    handleOk() {
      const form = this.$refs.ruleForm;
      form.validate((valid) => {
        if (valid) {
          this.loading = true;
          createUpdate(this.form)
            .then((res) => {
              form.resetFields();
              this.$message.success("操作成功");
              this.getUserInfo(true);
            })
            .finally(() => {
              this.loading = false;
            });
        }
      });
    },
  },
  activated() {
    this.getUserInfo();
  },
};
</script>
<style scoped>
::-webkit-scrollbar {
  display: none;
}
</style>
