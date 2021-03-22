<template>
  <v-row justify="center">
    <v-dialog
      v-model="active"
      persistent
      max-width="290">
      <v-card>
        <v-card-title class="headline">
          {{ title }}
        </v-card-title>
        <v-card-text>
          {{ message }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            v-if="showCancel"
            color="pink darken-1"
            text
            @click="cancel">
            {{ cancelText }}
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="confirm">
            {{ confirmText }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
export default {
  props: {
    active: {
      type: Boolean,
      required: true,
      default: false
    },
    confirmText: {
      type: String,
      required: false,
      default: 'Agree'
    },
    cancelText: {
      type: String,
      required: false,
      default: 'Cancel'
    },
    title: {
      type: String,
      required: false,
      default: ''
    },
    message: {
      type: String,
      required: false,
      default: ''
    },
    showCancel: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  methods: {
    confirm () {
      this.$emit('update:active', false)
      this.$emit('onConfirm')
    },
    cancel () {
      this.$emit('update:active', false)
      this.$emit('onCancel')
    }
  }
}
</script>
