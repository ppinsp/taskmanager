<template>
  <v-list-item
    :to="{ name: to }"
    :link="!!to"
    :ripple="false"
    :exact="!currentPage(to)">
    <v-list-item-icon v-if="iconPrepend && icon">
      <v-icon>{{ icon }}</v-icon>
    </v-list-item-icon>

    <v-list-item-content>
      <v-list-item-title>{{ title }}</v-list-item-title>
    </v-list-item-content>

    <v-list-item-icon v-if="!iconPrepend && icon">
      <v-icon>{{ icon }}</v-icon>
    </v-list-item-icon>
  </v-list-item>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    to: {
      type: [Object, String],
      required: false,
      default: undefined
    },
    icon: {
      type: String,
      required: false,
      default: undefined
    },
    iconPrepend: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  methods: {
    currentPage (page) {
      return this.$route.name === page
    }
  }
}
</script>
