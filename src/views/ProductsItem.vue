<template>
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
          <button class="btn btn-outline-danger btn-sm">刪除</button>
        </div>
      </td>
    </tr>
  </tbody>
</table>
<ProductsModal ref="productsModal" :product="tempPruduct"
@update-product="updateProduct"></ProductsModal>
</template>

<script>
import ProductsModal from '../components/ProductsModal.vue'

export default {
  data () {
    return {
      products: [],
      pagination: {},
      tempPruduct: {},
      isNew: false
    }
  },
  components: {
    ProductsModal
  },
  methods: {
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
    getProducts () {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/products`
      this.$http.get(api).then((res) => {
        if (res.data.success) {
          this.products = res.data.products
          this.pagination = res.data.pagination
        }
      })
    },
    updateProduct (item) {
      this.tempPruduct = item
      let api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/product`
      let httpMethod = 'post'

      if (!this.isNew) {
        api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/product/${item.id}`
        httpMethod = 'put'
      }

      const productModal = this.$refs.productsModal
      this.$http[httpMethod](api, { data: this.tempPruduct }).then((res) => {
        console.log(res)
        productModal.hideModal()
        this.getProducts()
      })
    }
  },
  created () {
    this.getProducts()
  }
}
</script>
