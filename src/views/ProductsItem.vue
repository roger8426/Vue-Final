<template>
  <LoadingComponent :active="isLoading"></LoadingComponent>
    <div class="text-end">
        <button class="btn btn-primary" type="button" @click="openProductModal(true)">
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
        {{ $filters.currency(item.origin_price) }}
      </td>
      <td class="text-right">
        {{ $filters.currency(item.price) }}
      </td>
      <td>
        <span class="text-success" v-if="item.is_enabled">啟用</span>
        <span class="text-muted" v-else>未啟用</span>
      </td>
      <td>
        <div class="btn-group">
          <button class="btn btn-outline-primary btn-sm" @click="openProductModal(false, item)">編輯</button>
          <button class="btn btn-outline-danger btn-sm" @click="openDelModal(item)">刪除</button>
        </div>
      </td>
    </tr>
  </tbody>
</table>
<Pagination :pages="pagination" @change-pages="getProducts"></Pagination>
<ProductsModal ref="productsModal" :product="tempPruduct"
@update-product="updateProduct"></ProductsModal>
<DelModal ref="delModal" :del-product="tempPruduct"
@del-item="delProduct"></DelModal>
</template>

<script>
import ProductsModal from '../components/ProductsModal.vue'
import DelModal from '../components/DelModal.vue'
import Pagination from '../components/PaginationComponent.vue'

export default {
  data () {
    return {
      products: [],
      tempPruduct: {},
      pagination: {},
      isNew: false,
      isLoading: false
    }
  },
  components: {
    ProductsModal,
    DelModal,
    Pagination
  },
  methods: {
    getProducts (page = 1) {
      this.isLoading = true
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/products?page=${page}`
      this.$http.get(api).then((res) => {
        if (res.data.success) {
          this.pagination = res.data.pagination
          this.products = res.data.products
          this.isLoading = false
        }
      })
    },
    openProductModal (isNew, item) {
      if (isNew) {
        this.tempPruduct = {}
      } else {
        this.tempPruduct = { ...item }
      }
      this.isNew = isNew
      this.$refs.productsModal.showModal()
    },
    openDelModal (item) {
      this.tempPruduct = { ...item }
      this.$refs.delModal.showModal()
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

      this.$http[httpMethod](api, { data: this.tempPruduct }).then((res) => {
        this.$refs.productsModal.hideModal()
        if (res.data.success) {
          this.getProducts()
          this.$messages(res, '產品更新')
        } else {
          this.$messages(res, '產品更新')
          this.isLoading = false
        }
      })
    },
    delProduct () {
      this.isLoading = true
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/product/${this.tempPruduct.id}`
      this.$http.delete(api).then((res) => {
        this.$refs.delModal.hideModal()
        this.$messages(res, '刪除產品')
        this.getProducts()
      })
    }
  },
  created () {
    this.getProducts()
  }
}
</script>
