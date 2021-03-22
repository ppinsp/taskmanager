<template>
  <base-layout>
    <v-row class="justify-space-between">
      <v-col md="4" cols="4">
        <v-btn outlined small color="primary" @click="$router.push({ name: 'CreateUser' })">
          <v-icon class="mr-1">mdi-account-multiple-plus</v-icon> Add
        </v-btn>
      </v-col>
      <v-col class="row" md="6" cols="8">
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
      <template v-slot:[`item.option`]="{ item }">
        <v-menu>
          <template v-slot:activator="{ on, attrs }">
            <v-icon v-bind="attrs" v-on="on">
              mdi-dots-vertical
            </v-icon>
          </template>
          <v-list>
            <v-list-item @click="$router.push({ name: 'UserDetail', params: { id: item.id }})">
              <v-list-item-title>Detail</v-list-item-title>
            </v-list-item>
            <v-list-item @click="$router.push({ name: 'UpdateUser', params: { id: item.id }})">
              <v-list-item-title>Edit</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
  </v-data-table>
  </base-layout>
</template>

<script>
import UserProvider from '@/resources/UserProvider'

const userService = new UserProvider()
export default {
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
      { text: 'E-mail', value: 'email' },
      { text: 'Department', value: 'department' },
      { text: 'Phone number', value: 'phoneNumber' },
      { text: 'Option',  align: 'center', value: 'option' }
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
