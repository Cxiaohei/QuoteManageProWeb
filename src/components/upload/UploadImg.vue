<template>
  <a-spin :spinning="loading">
    <div class="upload-wrapper" :id="id">
      <div class="upload-item" v-for="(item, index) in fileList" :key="index">
        <img :src="item">
        <span class="upload-delete" @click.stop="handleDelete(index)">
          <a-icon type="delete" />
        </span>
      </div>
      <div class="selectpics upload-item" v-if="limitNum > fileList.length">
        <a-icon type="plus" />
      </div>
    </div>
    <div>上传图片大小不能超过 10MB，格式为jpg、jpeg、png、bmp<span v-if="limitNum">，限制上传{{limitNum}}个</span></div>
  </a-spin>
</template>
<script>
import uploader from "@/utils/ali-oss.js";
export default {
  name: 'fileUpload',
  props: {
    id: {
      type: String,
      default: 'uploadImg'
    },
    fileList: {
      type: Array,
      default: function() {
        return [];
      }
    },
    extraData: {
      type: Object,
      default: function() {
        return {};
      }
    },
    limitNum: {
      type: Number,
      default: 0
    },
    multi_selection: {
      type: Boolean,
      default: false
    },
    max_file_size: {
      type: String,
      default: '10MB'
    }
  },
  data () {
    return {
      loading: false
    }
  },
  mounted() {
    this.initUploader();
  },
  methods: {
    initUploader() {
      let that = this;
      uploader({
        that: this,
        el: that.id,
        extraData: that.extraData,
        limitNum: that.limitNum - that.fileList.length,
        multi_selection: that.limitNum > 1 || that.multi_selection,
        max_file_size: that.max_file_size,
        accept: [{
          title: "Image files",
          extensions: "jpg,jpeg,png,bmp"
        }],
        file_added(uploader, files) {
          that.loading = true;
        },
        file_uploaded(url, file) {
          const list = [...that.fileList];
          list.push(url.host + url.key + (file.target_name || file.name));
          that.loading = false;
          that.$emit('ok', list, that.id);
          that.$message.success('上传成功');
        }
      }).init();
    },
    handleDelete(index) {
      const list = [...this.fileList];
      list.splice(index, 1);
      this.$emit('ok', list, this.id);
    }
  }
}
</script>

<style scoped>
.upload-wrapper {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 10px;
}
.upload-item {
  margin-right: 10px;
  margin-bottom: 10px;
  width: 100px;
  height: 100px;
  border: 1px dashed #eee;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}
.upload-item:hover .upload-delete {
  display: block;
}
.upload-item img {
  width: 98px;
  height: 98px;
  display: block;
}
.upload-delete {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  line-height: 98px;
  background-color: rgba(0,0,0,0.2);
  color: #fff;
  cursor: pointer;
}
.selectpics {
  text-align: center;
  line-height: 98px;
  cursor: pointer;
}
.selectpics:hover {
  border-color: #f90;
}
</style>