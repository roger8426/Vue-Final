<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/user/cart">用戶端範例</router-link>
      </div>
    </nav>
    <div class="container-fluid mt-3 position-relative">
      <ToastMessage></ToastMessage>
      <router-view/>
    </div>
  </template>

<script>
import emitter from '@/methods/emitter'
import ToastMessage from '@/components/ToastMessage.vue'
export default {
  components: {
    ToastMessage
  },
  provide () {
    return {
      emitter
    }
  },
  created () {
  }
}
</script>
