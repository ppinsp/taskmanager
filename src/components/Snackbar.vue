<template>
  <v-snackbar
    v-model="isSnackbar"
    :color="type"
    multi-line="multi-line"
    :timeout="timeout"
    top>
    <v-icon
      v-if="icon"
      class="mr-2"
      color="#ffffff">
      {{ icon }}
    </v-icon>
    <span v-html="message" />
  </v-snackbar>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      required: true
    },
    type: {
      type: String,
      required: false,
      default: 'success'
    },
    message: {
      type: String,
      required: true
    },
    timeout: {
      type: Number,
      required: false,
      default: 4000
    }
  },
  data () {
    return {
      isSnackbar: false
    }
  },
  computed: {
    icon () {
      let icon = 'mdi-information'
      if (this.type === 'success') {
        icon = 'mdi-checkbox-marked-circle'
      } else if (this.type === 'warning') {
        icon = 'mdi-alert-circle'
      } else if (this.type === 'error') {
        icon = 'mdi-alert'
      }
      return icon
    }
  },
  watch: {
    value (e) {
      this.isSnackbar = e
    },
    isSnackbar (e) {
      if (!e) {
        this.closeSnackbar()
      }
    }
  },
  created () {
    this.isSnackbar = this.value
  },
  methods: {
    closeSnackbar () {
      this.$emit('close', false)
    }
  }
}
</script>
