<template>
  <div>
    <v-row class="justify-space-between">
      <v-col class="row" >
        <v-col md="9" cols="8">
          <v-text-field v-model="searchText" dense label="Search" @keydown.enter="searchItem"/>
        </v-col>
        <v-col md="3" class="d-flex justify-end" cols="4">
          <v-btn outlined small color="primary" @click="searchItem()">
            Find
          </v-btn>
        </v-col>
      </v-col>
    </v-row>
    <paginate
      :page="parseInt(page)"
      :per-page="perPage"
      :total="total"
      @on-page-change="changePage" />
    <v-data-table
      :headers="headers"
      :items-per-page="15"
      :items="mapedData"
      :loading="loading"
      disable-sort
      hide-default-footer
      class="elevation-1">
      <template v-slot:[`item.add`]="{ item }">
        <v-icon v-if="!disableAddBtn(item)" @click="addItem(item)">mdi-plus</v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import UserProvider from '@/resources/UserProvider'

const userService = new UserProvider()
export default {
  props: {
    validUsers: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    searchText: '',
    loading: false,
    perPage: 15,
    total: 15,
    page: 1,
    data: [],
    headers: [
      { text: 'Id', align: 'start', sortable: false, value: 'id' },
      { text: 'Username', value: 'username' },
      { text: 'Name', value: 'name' },
      { text: 'Department', value: 'department' },
      { text: 'Add', value: 'add' }
    ]
  }),
  computed: {
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
  methods: {
    disableAddBtn (user) {
      return this.validUsers.some(u => u.id === user.id)
    },
    addItem (val) {
      this.$emit('onAddUser', val)
    },
    changePage (page) {
      this.page = page
      this.getData()
    },
    searchItem () {
      this.page = 1
      this.getData()
    },
    async getData () {
      this.loading = true
      try {
        const query = `page=${this.page}&limit=${this.perPage}&search=${this.searchText}`
        const { data } = await userService.getUser(query)
        this.total = data.count
        this.data = data.results
      } catch (err) {
        alert(err)
      } finally {
        this.loading = false
      }
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
