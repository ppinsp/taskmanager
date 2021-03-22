<template>
  <v-container>
    <v-row>
      <v-col>
        <table>
          <tr>
            <td class="pa-2"> Code </td> <td class="pl-5"> {{ team.id }} </td>
          </tr>
          <tr>
            <td class="pa-2"> Team name </td> <td class="pl-5"><div><h1> {{ team.name }} </h1></div></td>
          </tr>
          <tr>
            <td class="pa-2"> Description </td> <td class="pl-5"> {{ team.description }} </td>
          </tr>
        </table>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6" md="2">
        <v-btn block color="warning" :loading="loading" @click="$router.push({ name: 'UpdateTeam', params: { id: team.id }})">Update</v-btn>
      </v-col>
      <v-col cols="6" md="2">
        <v-btn block color="pink" :loading="loading" @click="confirmRemove">Delete</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items-per-page="9999"
          :items="mapedData"
          :loading="tableLoading"
          disable-sort
          hide-default-footer
          class="elevation-1" />
      </v-col>
    </v-row>
    <modal-confirm
      :active="modalConfirm"
      :confirm-text="`Confirm`"
      :title="'Confirm delete'"
      :message="`Confirm delete team ${team.name}.`"
      :show-cancel="true"
      @onCancel="() => { modalConfirm = false }"
      @onConfirm="removeTeam" />
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
    team: {},
    modalConfirm: false,
    tableLoading: false,
    perPage: 15,
    total: 15,
    page: 1,
    headers: [
      { text: 'Id', align: 'start', sortable: false, value: 'id' },
      { text: 'Username', value: 'username' },
      { text: 'Name', value: 'name' },
      { text: 'E-mail', value: 'email' },
      { text: 'Department', value: 'department' },
      { text: 'Phone number', value: 'phoneNumber' }
    ]
  }),
  computed: {
    isUpdating () {
      return this.$route.params.id ? true : false
    },
    teamId () {
      return this.$route.params.id ? this.$route.params.id : 0
    },
    mapedData () {
      return this.team.teamUsers ? this.team.teamUsers.map(d => ({
        id: d.user.id,
        username: d.user.username,
        name: `${d.user.firstName} ${d.user.lastName}`,
        email: d.user.email,
        department: d.user.department.name,
        phoneNumber: d.user.phoneNumber
      })) : []
    }
  },
  async mounted () {
    this.loading = true
    await this.getTeam()
    this.loading = false
  },
  methods: {
    ...mapActions({
      setSnackbar: 'Style/setSnackbar'
    }),
    confirmRemove () {
      this.modalConfirm = true
    },
    async getTeam () {
      try {
        const { data } = await userService.getTeamById(this.teamId)
        this.team = data
      } catch (err) {
        this.setSnackbar({
          message: err.message,
          type: 'pink',
          active: true
        })
      }
    },
    async removeTeam () {
      try {
        this.loading = true
        const { data } = await userService.deleteTeam(this.teamId)
        if (data) {
          this.setSnackbar({
            message: 'Remove team success.',
            type: 'success',
            active: true
          })
          this.$router.push({ name: 'TeamList'})
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