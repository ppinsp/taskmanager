<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="8">
        <table>
          <tr>
            <td class="pa-2"> code </td> <td class="pl-5"> {{ department.id }} </td>
          </tr>
          <tr>
            <td class="pa-2"> Depart name  </td> <td class="pl-5"><div><h1>  {{ department.name }} </h1></div></td>
          </tr>
          <tr>
            <td class="pa-2"> Description  </td> <td class="pl-5">{{ department.description }} </td>
          </tr>
        </table>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6" md="2" >
        <v-btn block color="warning" :loading="loading" @click="$router.push({ name: 'UpdateDepartment', params: { id: department.id }})">Update</v-btn>
      </v-col>
      <v-col cols="6" md="2">
        <v-btn block color="pink" :loading="loading" @click="confirmRemove">Delete</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <paginate
          :page="parseInt(page)"
          :per-page="perPage"
          :total="total"
          @on-page-change="changePage" />
        <v-data-table
          :headers="headers"
          :items-per-page="15"
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
      :message="`Confirm delete department ${department.name}.`"
      :show-cancel="true"
      @onCancel="() => { modalConfirm = false }"
      @onConfirm="removeDepartment" />
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
    department: {},
    modalConfirm: false,
    tableLoading: false,
    perPage: 15,
    total: 15,
    page: 1,
    data: [],
    headers: [
      { text: 'Id', align: 'start', sortable: false, value: 'id' },
      { text: 'Username', value: 'username' },
      { text: 'Name', value: 'name' },
      { text: 'E-mail', value: 'email' },
      { text: 'Phone number', value: 'phoneNumber' }
    ]
  }),
  computed: {
    isUpdating () {
      return this.$route.params.id ? true : false
    },
    departmentId () {
      return this.$route.params.id ? this.$route.params.id : 0
    },
    mapedData () {
      return this.data.map(d => ({
        id: d.id,
        username: d.username,
        name: `${d.firstName} ${d.lastName}`,
        email: d.email,
        department: d.department.name,
        phoneNumber: d.phoneNumber
      }))
    }
  },
  async mounted () {
    this.loading = true
    await this.getDepartment()
    this.getData()
    this.loading = false
  },
  methods: {
    ...mapActions({
      setSnackbar: 'Style/setSnackbar'
    }),
    confirmRemove () {
      this.modalConfirm = true
    },
    async getDepartment () {
      try {
        const { data } = await userService.getDepartmentById(this.departmentId)
        this.department = data
      } catch (err) {
        this.setSnackbar({
          message: err.message,
          type: 'pink',
          active: true
        })
      }
    },
    async removeDepartment () {
      try {
        this.loading = true
        const { data } = await userService.deleteDepartment(this.departmentId)
        if (data) {
          this.setSnackbar({
            message: 'Remove department success.',
            type: 'success',
            active: true
          })
          this.$router.push({ name: 'DepartmentList'})
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
    },
    changePage (page) {
      this.page = page
      this.getData()
    },
    async getData () {
      this.loading = true
      try {
        const query = `department=${this.departmentId}&page=${this.page}&limit=${this.perPage}`
        const { data } = await userService.getUser(query)
        this.total = data.count
        this.data = data.results
      } catch (err) {
        alert(err)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>