<template>
  <v-app-bar
    app
    color="blue"
    src="@/assets/navbar-bg.jpg"
    :class="{ 'app-bar-mobile': windowWidth < 768 }">
    <v-app-bar-nav-icon @click="windowWidth < 768 ? update(true) : setMini()" />

    <v-breadcrumbs
      class="pl-3 py-2"
      :items="breadcrumbs" />
    <v-spacer />

    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          class="user-avatar"
          icon
          v-bind="attrs"
          width="36"
          height="36"
          v-on="on">
          <v-avatar
            min-width="36"
            width="36"
            height="36">
            <img v-if="userData && userData.photo" :src="userData.photo" alt="user-avatar">
            <v-icon v-else dark>
              mdi-account-circle
            </v-icon>
          </v-avatar>
        </v-btn>
      </template>
      <v-list v-if="ready">
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
          link
          :to="item.to">
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
import { getUser } from '@/utils/js/Auth'
export default {
  props: {
    value: {
      type: Boolean,
      required: true
    },
    breadcrumbs: {
      type: Array,
      required: false,
      default: () => []
    },
    windowWidth: {
      type: Number,
      required: true
    },
    mini: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      ready: false,
      userData: {},
      items: [
        {
          title: 'Logout',
          to: '/logout'
        },
        {
          title: 'My Account',
          to: ''
        }
      ]
    }
  },
  created () {
    this.userData = getUser()
    this.setLinkToMyAccount()
    this.ready = true
  },
  methods: {
    setLinkToMyAccount () {
      const index = this.items.findIndex(i => i.title === 'My Account')
      this.items[index].to = `/user/${this.userData.sub}/my-account`
    },
    update (value) {
      this.$emit('input', value)
    },
    setMini () {
      this.$emit('update:mini', !this.mini)
    }
  }
}
</script>

<style>
#select-warehouse,
#select-warehouse .v-input {
  display: flex;
  align-items: center;
}
#select-warehouse .v-input {
  width: 150px;
  margin-bottom: -5px;
}
#select-warehouse .v-text-field__details {
  display: none;
}
button.user-avatar {
  margin-right: 0 !important;
}
button.user-avatar i.v-icon.mdi-account-circle {
  width: 36px;
  height: 36px;
  font-size: 36px;
}
@media screen and (max-width: 767px) {
  #select-warehouse {
    width: 100%;
  }
}
</style>
