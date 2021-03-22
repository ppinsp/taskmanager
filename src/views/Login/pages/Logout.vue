<template>
  <div></div>
</template>

<script>
import { clearAuth } from '@/utils/js/Auth'
export default {
  mounted () {
    clearAuth()
    setTimeout(() => {
      this.$router.push({ name: 'Login' })
    }, 200)
  }
}
</script>
