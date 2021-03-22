<template>
  <div>
    <v-snackbar
      v-model="snackbar.active"
      :color="snackbar.type"
      multi-line="multi-line"
      :timeout="500"
      top />
    <header-bar
      v-model="drawer"
      :window-width="windowWidth"
      :breadcrumbs="breadcrumbs"
      :mini.sync="mini" />
    <sidebar-menu
      v-model="drawer"
      :is-mobile="isMobile"
      :items="menus"
      :mini="mini" />
    <v-main>
      <router-view />
    </v-main>
    <snackbar
      :value="snackbar.active"
      :type="snackbar.type"
      :message="snackbar.message"
      @close="setSnackbarData"/>
  </div>
</template>

<script>
import sidebarMenu from '@/components/SidebarMenu'
import headerBar from '@/components/HeaderBar'
import Snackbar from '@/components/Snackbar'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    sidebarMenu,
    headerBar,
    Snackbar
  },
  data () {
    return {
      menus: [],
      brandName: '',
      drawer: false,
      isUpToDate: true,
      mini: false,
      ready: false
    }
  },
  methods: {
    ...mapActions({
      setSnackbar: 'Style/setSnackbar'
    }),
    setSnackbarData (val) {
      this.setSnackbar({
        message: '',
        type: '',
        active: val
      })
    },
    getBreadcrumbs (data, value) {
      let newData = []
      for (let i = 0; i < data.length; i++) {
        if (data[i].to === value) {
          newData = [{ ...data[i] }]
          break
        } else if (data[i].children) {
          const sub = this.getBreadcrumbs(data[i].children, value)
          if (sub[0] && sub[0].to) {
            newData.push({ ...data[i] })
            newData.push({ ...sub[0] })
            break
          }
        }
      }
      return newData
    }
  },
  computed: {
    ...mapGetters({
      snackbar: 'Style/snackbar'
    }),
    windowWidth () {
      return this.$vuetify.breakpoint.width
    },
    windowHeight () {
      return this.$vuetify.breakpoint.height
    },
    isMobile () {
      return this.$vuetify.breakpoint.xs || this.$vuetify.breakpoint.sm
    },
    breadcrumbs () {
      const breadcrumbs = [
        {
          disabled: false,
          link: true,
          text: this.$route.name,
          href: this.$router.resolve({ name: 'Main' }).href
        }
      ]
      if (this.$route.name !== 'Main') {
        const newMenus = this.getBreadcrumbs(this.menus, this.$route.name)
        const mapMenus = newMenus.map((r) => ({
          disabled: false,
          link: true,
          text: r.title,
          href: this.$router.resolve({ name: r.to }).href
        }))
        breadcrumbs.push(...mapMenus)
      }
      breadcrumbs[breadcrumbs.length - 1].disabled = true
      return breadcrumbs
    }
  }
}
</script>>