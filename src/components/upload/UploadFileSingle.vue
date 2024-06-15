<template>
  <div>
    <div class="upload-wrapper">
      <a-input placeholder="请输入内容" v-model="url" @change="handleChange" allowClear>
        <a-button slot="addonAfter" type="primary" :id="id" :loading="loading">上传</a-button>
      </a-input>
    </div>
  </div>
</template>
<script>
import uploader from "@/utils/ali-oss.js";
export default {
  name: 'fileUpload',
  props: {
    id: {
      type: String,
      default: 'fileSingle'
    },
    filePath: {
      type: String,
      default: ''
    },
    extraData: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  watch: {
    filePath(newVal,oldVal) {
      this.url = newVal;
    }
  },
  data () {
    return {
      url: '',
      loading: false
    }
  },
  mounted() {
    this.url = this.filePath;
    this.initUploader();
  },
  methods: {
    initUploader() {
      let that = this;
      uploader({
        that: this,
        el: that.id,
        extraData: that.extraData,
        file_added(uploader, files) {
          that.loading = true;
        },
        file_uploaded(url, file) {
          const path = url.host + url.key + (file.target_name || file.name);
          that.loading = false;
          that.$emit('ok', path, that.id);
          that.$message.success('上传成功');
        }
      }).init();
    },
    handleChange() {
      this.$emit('ok', this.url, this.id)
    }
  }
}
</script>

<style lang="less" scoped>
.upload-wrapper {
  /deep/ .ant-input-group-addon {
    padding: 0;
    border: none;
    background-color: transparent;
    button {
      border-radius: 0 4px 4px 0;
    }
  }
}
</style>