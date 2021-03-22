<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="8" offset-md="2">
        <v-card>
          <v-row>
            <v-col>
                <v-card
                  class="mx-auto"
                  max-width="434"
                  tile
                >
                  <v-img height="100%" src="@/assets/usercard-bg.jpg">
                    <v-row
                      align="end"
                      class="fill-height"
                    >
                      <v-col
                        align-self="start"
                        class="pa-0"
                        cols="12"
                      >
                        <v-avatar
                          class="profile"
                          color="grey"
                          size="164"
                          tile
                        >
                          <v-img v-if="user.photo && user.photo !== null" :src="user.photo"></v-img>
                          <v-icon size="84" v-else dark>
                            mdi-account-circle
                          </v-icon>
                        </v-avatar>
                      </v-col>
                      <v-col class="py-0">
                        <v-list-item
                          color="rgba(0, 0, 0, .4)"
                          dark
                        >
                          <v-list-item-content>
                            <v-list-item-title class="title">
                              {{ `${user.title} ${user.firstName} ${user.lastName}` }}
                            </v-list-item-title>
                            <v-list-item-subtitle>{{ user.department.name }}</v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                      </v-col>
                    </v-row>
                  </v-img>
                </v-card>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="8" offset-md="4">
              <table>
                <tr>
                  <td class="pa-2"> User code </td> <td class="pl-5"> {{ user.id }} </td>
                </tr>
                <tr>
                  <td class="pa-2"> Name  </td> <td class="pl-5"> {{ `${user.title} ${user.firstName} ${user.lastName}` }} </td>
                </tr>
                <tr>
                  <td class="pa-2"> Username  </td> <td class="pl-5"> {{ user.username }} </td>
                </tr>
                <tr>
                  <td class="pa-2"> Email  </td> <td class="pl-5"> {{ user.email }} </td>
                </tr>
                <tr>
                  <td class="pa-2"> Phone Number  </td> <td class="pl-5"> {{ user.phoneNumber }} </td>
                </tr>
                <tr>
                  <td class="pa-2"> Department  </td> <td class="pl-5"> {{ user.department.name }} </td>
                </tr>
                <tr>
                  <td class="pa-2"> CreateTime  </td> <td class="pl-5"> {{ user.createdAt | localDate() }} </td>
                </tr>
              </table>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4" offset="2">
        <v-btn block color="warning" :loading="loading" @click="$router.push({ name: 'UpdateUser', params: { id: user.id }})">Update</v-btn>
      </v-col>
      <v-col cols="4">
        <v-btn block color="pink" :loading="loading" @click="confirmRemove">Delete</v-btn>
      </v-col>
    </v-row>
    <modal-confirm
      :active="modalConfirm"
      :confirm-text="`Confirm`"
      :title="'Confirm delete'"
      :message="`Confirm delete user ${user.username}.`"
      :show-cancel="true"
      @onCancel="() => { modalConfirm = false }"
      @onConfirm="removeUser" />
  </v-container>
</template>

<script>
import UserProvider from '@/resources/UserProvider'
import ModalConfirm from '@/components/ModalConfirm'
import { mapActions } from 'vuex'
const userService = new UserProvider()
export default {
  components: { ModalConfirm },
  data: () => ({
    loading: false,
    user: {},
    modalConfirm: false
  }),
  computed: {
    isUpdating () {
      return this.$route.params.id ? true : false
    },
    userId () {
      return this.$route.params.id ? this.$route.params.id : 0
    }
  },
  async mounted () {
    this.loading = true
    await this.getUser()
    this.loading = false
  },
  methods: {
    ...mapActions({
      setSnackbar: 'Style/setSnackbar'
    }),
    confirmRemove () {
      this.modalConfirm = true
    },
    async getUser () {
      try {
        const { data } = await userService.getUserById(this.userId)
        this.user = data
      } catch (err) {
        this.setSnackbar({
          message: err.message,
          type: 'pink',
          active: true
        })
      }
    },
    async removeUser () {
      try {
        this.loading = true
        const { data } = await userService.deleteUser(this.userId)
        if (data) {
          this.setSnackbar({
            message: 'Remove user success.',
            type: 'success',
            active: true
          })
          this.$router.push({ name: 'UserList'})
        }
      } catch (err) {
        this.setSnackbar({
          message: err.message,
          type: 'pink',
          active: true
        })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.v-list-item__title.title {
  text-shadow: 1px 1px 1px #545454;
}
.v-list-item__subtitle {
  text-shadow: 1px 1px 1px #787878;
}
</style>