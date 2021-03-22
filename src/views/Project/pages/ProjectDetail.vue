<template>
  <v-container>
    <v-row>
      <v-col>
        <table>
          <tr>
            <td class="pa-2"> code </td> <td class="pl-6">{{ project.id }} </td>
          </tr>
          <tr>
            <td class="pa-2"> Project name </td> <td class="pl-6"><div><h1> {{ project.name }} </h1></div></td>
          </tr>
          <tr>
            <td class="pa-2"> Team </td> <td class="pl-6">{{ project.team ? project.team.name : '' }} </td>
          </tr>
          <tr>
            <td class="pa-2"> Detail  </td> <td class="pl-6"> {{ project.detail }} </td>
          </tr>
        </table>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6" md="2">
        <v-btn block color="warning" :loading="loading" @click="$router.push({ name: 'UpdateProject', params: { id: project.id }})">Update</v-btn>
      </v-col>
      <v-col cols="6" md="2">
        <v-btn block color="pink" :loading="loading" @click="confirmRemove">Delete</v-btn>
      </v-col>
    </v-row>
    <v-row v-for="requirement in project.requirements" :key="requirement.id">
      <v-col class="box">
        <v-row class="col-12">
          <span style="font-weight: bold;"> Requriement List</span> {{ requirement.detail }}
        </v-row>
        <v-row class="col-12">
          <img :src="requirement.imageUpload" width="300" alt="">
        </v-row>
        <v-row class="col-12">
          <a :href="requirement.fileUpload" target="_blank">{{ requirement.fileUpload }} </a>
        </v-row>
      </v-col>
    </v-row>
    <modal-confirm
      :active="modalConfirm"
      :confirm-text="`Confirm`"
      :title="'Confirm delete'"
      :message="`Confirm delete project ${project.name}.`"
      :show-cancel="true"
      @onCancel="() => { modalConfirm = false }"
      @onConfirm="removeProject" />
  </v-container>
</template>

<script>
import ProjectProvider from '@/resources/ProjectProvider'
import ModalConfirm from '@/components/ModalConfirm'
import { mapActions } from 'vuex'
const projectService = new ProjectProvider()
export default {
  components: { ModalConfirm },
  data: () => ({
    loading: false,
    project: {},
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
    projectId () {
      return this.$route.params.id ? this.$route.params.id : 0
    }
  },
  async mounted () {
    this.loading = true
    await this.getProject()
    this.loading = false
  },
  methods: {
    ...mapActions({
      setSnackbar: 'Style/setSnackbar'
    }),
    confirmRemove () {
      this.modalConfirm = true
    },
    async getProject () {
      try {
        const { data } = await projectService.getProjectById(this.projectId)
        this.project = data
      } catch (err) {
        this.setSnackbar({
          message: err.message,
          type: 'pink',
          active: true
        })
      }
    },
    async removeProject () {
      try {
        this.loading = true
        const { data } = await projectService.deleteProject(this.projectId)
        if (data) {
          this.setSnackbar({
            message: 'Remove project success.',
            type: 'success',
            active: true
          })
          this.$router.push({ name: 'ProjectList'})
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

<style lang="css">
.box {
  border: 1px solid #cfcfcf;
  border-radius: 6px;
}
</style>