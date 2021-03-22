<template>
  <div class="paginate">
    <div>{{ firstItem }} - {{ lastItem }} of {{ total }}</div>
    <v-icon
      class="pointer ml-4"
      color="#000"
      @click="changePage(-1)">
      mdi-chevron-left
    </v-icon>
    <v-icon
      class="pointer ml-4"
      color="#000"
      @click="changePage(1)">
      mdi-chevron-right
    </v-icon>
  </div>
</template>

<script>
export default {
  props: {
    page: {
      default: 1,
      type: Number,
      required: true
    },
    perPage: {
      default: 15,
      type: Number,
      required: true
    },
    total: {
      default: 0,
      type: Number,
      required: true
    }
  },
  computed: {
    firstItem () {
      return this.total !== 0 ? ((this.page - 1) * this.perPage) + 1 : 0
    },
    lastItem () {
      const last = this.page * this.perPage
      return last > this.total ? this.total : last
    }
  },
  methods: {
    changePage (value) {
      let result = (this.page + value) < 1 ? 1 : this.page + value
      const totalPage = Math.ceil(this.total / this.perPage)
      result = result > totalPage ? totalPage : result
      this.$emit('on-page-change', result)
    }
  }
}
</script>
<style scoped>
.paginate {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
</style>
