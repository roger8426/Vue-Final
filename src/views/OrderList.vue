<template>
    <LoadingComponent :active="isLoading"></LoadingComponent>
    <table class="table mt-4">
        <thead>
            <tr>
                <th>購買時間</th>
                <th>Email</th>
                <th>購買款項</th>
                <th>應付金額</th>
                <th>是否付款</th>
                <th>編輯</th>
            </tr>
        </thead>
        <tbody>
            <template v-for="(item, key) in orders" :key="key">
                <tr v-if="orders.length" :class="{ 'text-secondary': !item.is_paid }">
                    <td>{{ $filters.date(item.create_at) }}</td>
                    <td><span v-text="item.user.email" v-if="item.user"></span></td>
                    <td>
                        <ul class="list-unstyled">
                            <li v-for="(product, i) in item.products" :key="i">
                                {{ product.product.title }} 數量：{{ product.qty }}
                                {{ product.product.unit }}
                            </li>
                        </ul>
                    </td>
                    <td class="text-right">{{ item.total }}</td>
                    <td>
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" :id="`paidSwitch${item.id}`"
                                v-model="item.is_paid" @change="updatePaid(item)">
                            <label class="form-check-label" :for="`paidSwitch${item.id}`">
                                <span v-if="item.is_paid">已付款</span>
                                <span v-else>未付款</span>
                            </label>
                        </div>
                    </td>
                    <td>
                        <div class="btn-group">
                            <button class="btn btn-outline-primary btn-sm" @click="openOrderModal(false, item)">檢視</button>
                            <button class="btn btn-outline-danger btn-sm" @click="openDelModal(item)">刪除</button>
                        </div>
                    </td>
                </tr>
            </template>
        </tbody>
    </table>
    <OrderModal :order="tempOrder" ref="orderModal" @update-paid="updatePaid"></OrderModal>
    <DelModal :item="tempOrder" ref="delModal" @del-item="delOrder"></DelModal>
    <Pagination :pages="pagination" @emit-pages="getOrders"></Pagination>
</template>

<script>
import Pagination from '@/components/PaginationComponent.vue'
import OrderModal from '@/components/OrderModal.vue'
import DelModal from '@/components/DelModal.vue'

export default {
  data () {
    return {
      orders: [],
      tempOrder: {},
      pagination: {},
      currentPage: 1,
      isNew: false,
      isLoading: false
    }
  },
  components: {
    Pagination,
    OrderModal,
    DelModal
  },
  methods: {
    getOrders (currentPage = 1) {
      this.currentPage = currentPage
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/orders?page=${currentPage}`
      this.isLoading = true
      this.$http.get(url, this.tempProduct).then((res) => {
        this.orders = res.data.orders
        this.pagination = res.data.pagination
        this.isLoading = false
        console.log(res)
      })
    },
    openOrderModal (isNew, item) {
      this.tempOrder = { ...item }
      this.isNew = false
      const orderModal = this.$refs.orderModal
      orderModal.showModal()
    },
    openDelModal (item) {
      this.tempOrder = { ...item }
      const delModa = this.$refs.delModal
      delModa.showModal()
    },
    updatePaid (item) {
      this.isLoading = true
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/order/${item.id}`
      const paid = {
        is_paid: item.is_paid
      }
      this.$http.put(api, { data: paid }).then((res) => {
        this.isLoading = false
        this.getOrders(this.currentPage)
        this.$message(res, '更新付款狀態')
      })
    },
    delOrder () {
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/order/${this.tempOrder.id}`
      this.isLoading = true
      this.$http.delete(url).then((response) => {
        console.log(response)
        const delComponent = this.$refs.delModal
        delComponent.hideModal()
        this.getOrders(this.currentPage)
      })
    }
  },
  created () {
    this.getOrders()
    console.log(process.env.VUE_APP_API)
  }
}
</script>
