<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">作品範例</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div class="navbar-nav">
                    <router-link to="/dashboard/products" class="nav-link" href="#">產品</router-link>
                    <router-link to="/dashboard/order" class="nav-link" href="#">訂單</router-link>
                    <router-link to="/dashboard/coupon" class="nav-link" href="#">優惠券</router-link>
                    <a class="nav-link" href="#">貼文</a>
                    <a class="nav-link" href="#" @click.prevent="logout">登出</a>
                </div>
            </div>
        </div>
    </nav>
</template>

<script>
export default {
  methods: {
    logout () {
      const api = `${process.env.VUE_APP_API}logout`
      this.$http.post(api, this.user).then((res) => {
        if (res.data.success) {
          this.$router.push('/login')
        }
      })
    }
  }
}
</script>
