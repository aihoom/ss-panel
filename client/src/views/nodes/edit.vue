<template>
  <div class="node-edit">
    <div class="weui-loadmore" v-show="isLoading">
      <i class="weui-loading"></i>
      <span class="weui-loadmore__tips">正在加载</span>
    </div>
    <div v-show="!isLoading">
      <div class="weui-cells__title">节点信息</div>
      <div class="weui-cells weui-cells_form weui-panel__bd">
        <div class="weui-cell">
          <div class="weui-cell__hd">
            <label class="weui-label">节点名称</label>
          </div>
          <div class="weui-cell__bd">
            <input class="weui-input" type="text" placeholder="请输入节点名称" v-model="name">
          </div>
        </div>
        <div class="weui-cell weui-cell_select weui-cell_select-after">
          <div class="weui-cell__hd">
            <label class="weui-label">所在地区</label>
          </div>
          <div class="weui-cell__bd">
            <select class="weui-select" v-model="location">
              <option value="au">澳大利亚</option>
              <option value="de">德国</option>
              <option value="fr">法国</option>
              <option value="kr">韩国</option>
              <option value="nl">荷兰</option>
              <option value="ca">加拿大</option>
              <option value="us">美国</option>
              <option value="jp">日本</option>
              <option value="se">瑞典</option>
              <option value="es">西班牙</option>
              <option value="gr">希腊</option>
              <option value="sg">新加坡</option>
              <option value="in">印度</option>
              <option value="gb">英国</option>
              <option value="cn">中国</option>
            </select>
          </div>
        </div>
        <div class="weui-cell">
          <div class="weui-cell__hd">
            <label class="weui-label">节点描述</label>
          </div>
          <div class="weui-cell__bd">
            <textarea class="weui-textarea" placeholder="请输入节点描述" rows="3" v-model="description"></textarea>
          </div>
        </div>
        <div class="weui-cell">
          <div class="weui-cell__hd">
            <label class="weui-label">连接地址</label>
          </div>
          <div class="weui-cell__bd">
            <input class="weui-input" type="text" placeholder="请输入服务器地址" v-model="server">
          </div>
        </div>
        <div class="weui-cell">
          <div class="weui-cell__hd">
            <label class="weui-label">加密方式</label>
          </div>
          <div class="weui-cell__bd">
            <input class="weui-input" type="text" placeholder="请输入 SS 加密方式" v-model="method">
          </div>
        </div>
        <div class="weui-cell weui-cell_select weui-cell_select-after">
          <div class="weui-cell__hd">
            <label class="weui-label">是否可见</label>
          </div>
          <div class="weui-cell__bd">
            <select class="weui-select" v-model="isVisible">
              <option value="1">可见</option>
              <option value="0">隐藏</option>
            </select>
          </div>
        </div>
        <div class="weui-cell" :class="{'weui-cell_warn': isSortError}">
          <div class="weui-cell__hd">
            <label class="weui-label">节点排序</label>
          </div>
          <div class="weui-cell__bd">
            <input class="weui-input" type="number" placeholder="请输入排序 ID" v-model="sort">
          </div>
          <div class="weui-cell__ft" v-if="isSortError">
            <i class="weui-icon-warn"></i>
          </div>
        </div>
      </div>

    <div class="weui-btn-area">
      <div class="weui-flex">
        <div class="weui-flex__item">
          <div
            class="weui-btn weui-btn_primary"
            :class="{'weui-btn_disabled': !isValid, 'weui-btn_loading': isValid && (isSubmit || isRemove)}"
            @click="submit()">
            <span v-if="isSubmit">
              <i class="weui-loading"></i> 保存中
            </span>
            <span v-else>保存</span>
          </div>
        </div>
        <div class="weui-flex__item" v-if="nodeId">
          <div
            class="weui-btn weui-btn_warn"
            :class="{'weui-btn_loading': isSubmit || isRemove}"
            @click="remove()">
            <span v-if="isRemove">
              <i class="weui-loading"></i> 删除中
            </span>
            <span v-else>删除</span>
          </div>
        </div>
        <div class="weui-flex__item" v-else>
          <router-link
            class="weui-btn weui-btn_default"
            :class="{'weui-btn_loading': isSubmit}"
            :to="{name: 'nodes'}">
            返回
          </router-link>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import Api from '@/api'

export default {
  data () {
    return {
      name: null,
      location: null,
      description: null,
      server: null,
      method: null,
      isVisible: 1,
      sort: 1,
      isLoading: false,
      isSubmit: false,
      isRemove: false
    }
  },

  computed: {
    nodeId () {
      return this.$route.params.nodeId
    },
    isSortError () {
      return this.sort && (isNaN(this.sort) || this.sort <= 0)
    },
    isValid () {
      return this.name && this.location && this.description &&
             this.server && this.method && this.isVisible !== null &&
             this.sort && !this.isSortError
    }
  },

  created () {
    if (this.nodeId) {
      this.fetch()
    }
  },

  methods: {
    fetch () {
      this.isLoading = true
      Api(`/api/nodes/${this.nodeId}`).then(({ data }) => {
        this.isLoading = false
        this.name = data.name
        this.location = data.location
        this.description = data.description
        this.server = data.server
        this.method = data.method
        this.isVisible = Number(data.isVisible)
        this.sort = data.sort
      }).catch(() => {
        this.isLoading = false
      })
    },

    submit () {
      if (!this.isValid || this.isSubmit || this.isRemove) {
        return false
      }
      this.isSubmit = true

      let url = '/api/nodes'
      let method = 'POST'
      if (this.nodeId) {
        url = `/api/nodes/${this.nodeId}`
        method = 'PUT'
      }

      Api(url, {
        method,
        body: {
          name: this.name,
          location: this.location,
          description: this.description,
          server: this.server,
          method: this.method,
          isVisible: Boolean(Number(this.isVisible)),
          sort: Number(this.sort)
        }
      }).then(({ data }) => {
        this.isSubmit = false
        this.$router.push({
          name: 'node-detail',
          params: {
            nodeId: data.nodeId
          }
        })
      }).catch(() => {
        this.isSubmit = false
      })
    },

    remove () {
      if (this.isSubmit || this.isRemove) {
        return false
      } else if (!confirm('你确定要删除当前节点吗?')) {
        return false
      }

      this.isRemove = true
      Api(`/api/nodes/${this.nodeId}`, {
        method: 'DELETE'
      }).then(() => {
        this.isRemove = false
        this.$router.push({name: 'nodes'})
      }).catch(() => {
        this.isRemove = false
      })
    }
  }
}
</script>

<style lang="less">
.node-edit {
  .weui-cell .weui-cell__ft {
    font-size: 1em;
  }

  .weui-btn {
    margin: 0 5px;
    &:after {
      border: 0px;
    }
  }
}
</style>
