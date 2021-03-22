<template>
  <v-container
    class="main-container"
    fluid>
    <v-overlay :value="loading">
      <v-progress-circular
        indeterminate
        size="64" />
    </v-overlay>
    <v-card
      ref="main-card"
      class="main-card px-5 pt-5"
      :style="`height: calc(100% - ${isHeight}px)`"
      @scroll.native="handleScroll">
      <h1
        v-if="title"
        class="headline">
        {{ title }}
      </h1>
      <slot></slot>
    </v-card>
  </v-container>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: false,
      default: undefined
    },
    loading: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      isHeight: 0,
      headerHeight: 0,
      footerHeight: 0
    }
  },
  mounted () {
    this.setHeight()
  },
  methods: {
    setHeight () {
      if (this.$slots.header) {
        this.headerHeight = this.$refs['header-card'].$el.clientHeight ? this.$refs['header-card'].$el.clientHeight : 0
      }
      if (this.$slots.footer) {
        this.footerHeight = this.$refs['footer-card'].$el.clientHeight ? this.$refs['footer-card'].$el.clientHeight : 0
      }
      this.isHeight = this.headerHeight + this.footerHeight
    },
    handleScroll (event) {
      const scroll = {
        clientHeight: event.target.clientHeight,
        clientWidth: event.target.clientWidth,
        scrollHeight: event.target.scrollHeight,
        scrollLeft: event.target.scrollLeft,
        scrollTop: event.target.scrollTop,
        scrollWidth: event.target.scrollWidth
      }
      this.$emit('handleScroll', scroll)
    }
  }
}
</script>
<style scoped>
.main-container {
  height: calc(100vh - 60px);
}
.main-card {
  padding: 20px;
  overflow-x: auto;
}
</style>
