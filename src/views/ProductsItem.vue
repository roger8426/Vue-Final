<template>
  <LoadingComponent :active="isLoading"></LoadingComponent>
    <div class="text-end">
        <button class="btn btn-primary" type="button" @click="openModal(true)">
            增加產品
        </button>
    </div>
    <table class="table mt-4">
  <thead>
    <tr>
      <th width="120">分類</th>
      <th>產品名稱</th>
      <th width="120">原價</th>
      <th width="120">售價</th>
      <th width="100">是否啟用</th>
      <th width="200">編輯</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="item in products" :key="item.id">
      <td>{{ item.category }}</td>
      <td>{{ item.title }}</td>
      <td class="text-right">
        {{ item.origin_price }}
      </td>
      <td class="text-right">
        {{ item.price }}
      </td>
      <td>
        <span class="text-success" v-if="item.is_enabled">啟用</span>
        <span class="text-muted" v-else>未啟用</span>
      </td>
      <td>
        <div class="btn-group">
          <button class="btn btn-outline-primary btn-sm" @click="openModal(false, item)">編輯</button>
          <button class="btn btn-outline-danger btn-sm" @click="openDelModal(item)">刪除</button>
        </div>
      </td>
    </tr>
  </tbody>
</table>
<ProductsModal ref="productsModal" :product="tempPruduct"
@update-product="updateProduct"></ProductsModal>
<DelModal ref="delModal" :del-product="tempPruduct"
@del-item="delProduct"></DelModal>
</template>

<script>
import ProductsModal from '../components/ProductsModal.vue'
import DelModal from '../components/DelModal.vue'

export default {
  data () {
    return {
      products: [],
      pagination: {},
      tempPruduct: {},
      isNew: false,
      isLoading: false
    }
  },
  components: {
    ProductsModal,
    DelModal
  },
  inject: ['emitter'],
  methods: {
    getProducts () {
      this.isLoading = true
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/products`
      this.$http.get(api).then((res) => {
        if (res.data.success) {
          this.isLoading = false
          this.products = res.data.products
          this.pagination = res.data.pagination
        }
      })
    },
    openModal (isNew, item) {
      if (isNew) {
        this.tempPruduct = {}
      } else {
        this.tempPruduct = { ...item }
      }
      this.isNew = isNew
      const productModal = this.$refs.productsModal
      productModal.showModal()
    },
    openDelModal (item) {
      this.tempPruduct = { ...item }
      const delModal = this.$refs.delModal
      delModal.showModal()
    },
    updateProduct (item) {
      this.isLoading = true
      this.tempPruduct = item
      let api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/product`
      let httpMethod = 'post'

      if (!this.isNew) {
        api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/product/${item.id}`
        httpMethod = 'put'
      }

      const productModal = this.$refs.productsModal
      this.$http[httpMethod](api, { data: this.tempPruduct }).then((res) => {
        productModal.hideModal()
        if (res.data.success) {
          this.getProducts()
          this.emitter.emit('push-message', {
            style: 'success',
            title: '更新成功'
          })
        } else {
          this.isLoading = false
          this.emitter.emit('push-message', {
            style: 'danger',
            title: '更新失敗',
            content: res.data.message.join('、')
          })
        }
      })
    },
    delProduct () {
      this.isLoading = true
      const delModal = this.$refs.delModal
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/product/${this.tempPruduct.id}`
      this.$http.delete(api).then((res) => {
        delModal.hideModal()
        this.getProducts()
      })
    }
  },
  created () {
    this.getProducts()
  }
}
</script>
