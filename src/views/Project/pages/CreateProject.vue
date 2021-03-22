<template>
  <v-container>
    <v-form ref="form" v-model="valid" :lazy-validation="false">
      <v-row>
        <v-col cols="12">
          <h1 v-if="isUpdating">Update Project</h1>
          <h1 v-else>Create Project</h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            label="Name"
            v-model="formData.name"
            :rules="validation.name"
            persistent-hint
            outlined
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            label="Detail"
            v-model="formData.detail"
            persistent-hint
            outlined
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <v-menu
            v-model="activeDate"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="formData.deadlineDate"
                label="Deadline Date"
                prepend-icon="mdi-calendar"
                readonly
                outlined
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="formData.deadlineDate"
              @input="activeDate = false"
            ></v-date-picker>
          </v-menu>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <v-select
            v-model="formData.team"
            :rules="validation.team"
            :items="teams"
            item-text="name"
            item-value="id"
            label="Team"
            outlined></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6" class="box">
          <h2> Requirement </h2>
          <div v-for="(requirement, index) in formData.requirements" :key="index">
            <v-row>
              <v-col cols="1 mt-2 text-center">
                <h3>{{ index + 1 }}</h3>
              </v-col>
              <v-col cols="10">
                <v-text-field
                  label="Detail"
                  :rules="validation.requirementDetail"
                  dense
                  v-model="formData.requirements[index].detail"
                  persistent-hint
                  outlined />
                <div class="d-flex ma-4 justify-center align-center flex-column" v-if="formData.requirements[index].imageUpload !== null">
                  <img :src="formData.requirements[index].imageUpload" width="200" alt="">
                  <v-btn
                    x-small
                    color="pink"
                    style="width: fit-content;"
                    @click="removeImage(index)"> X </v-btn>
                </div>
                <v-file-input
                  outlined
                  accept="image/*"
                  label="Image"
                  dense
                  v-model="formData.requirements[index].image"
                  @change="(file) => { uploadFile(file, 'imageUpload', index) }"
                  truncate-length="15"
                ></v-file-input>
                <div class="d-flex ma-4 justify-center align-center flex-column" v-if="formData.requirements[index].fileUpload !== null">
                  {{ formData.requirements[index].fileUpload }}
                  <v-btn
                    x-small
                    color="pink"
                    style="width: fit-content;"
                    @click="removeFile(index)"> X </v-btn>
                </div>
                <v-file-input
                  outlined
                  label="File"
                  dense
                  v-model="formData.requirements[index].file"
                  @change="(file) => { uploadFile(file, 'fileUpload', index) }"
                  truncate-length="15"
                ></v-file-input>

              </v-col>
              <v-col cols="1 mt-2 text-center">
                <v-icon @click="removeRequirement(index)">mdi-delete-outline</v-icon>
              </v-col>
            </v-row>
          </div>
          <div>
            <v-btn
              color="light-green"
              @click="addRequirement"
              :loading="loading"
              block>
              +
            </v-btn>
          </div>
        </v-col>
      </v-row>
      <v-row v-if="!isUpdating">
        <v-col cols="12" md="6">
          <div class="text-center">
            <v-btn
              block
              :loading="loading"
              @click="createProject()"
              color="primary">
              Save
            </v-btn>
          </div>
        </v-col>
      </v-row>
      <v-row v-else>
        <v-col cols="6" md="3">
          <v-btn block color="primary" :loading="loading" @click="updateProject">Save</v-btn>
        </v-col>
        <v-col cols="6" md="3">
          <v-btn block color="pink" :loading="loading" @click="confirmRemove">Delete</v-btn>
        </v-col>
      </v-row>
    </v-form>
    <modal-confirm
      :active="modalConfirm"
      :confirm-text="`Confirm`"
      :title="'Confirm delete.'"
      :message="`Confirm delete project ${formData.name}.`"
      :show-cancel="true"
      @onCancel="() => { modalConfirm = false }"
      @onConfirm="removeProject" />
  </v-container>
</template>

<script>
import ProjectProvider from '@/resources/ProjectProvider'
import UserProvider from '@/resources/UserProvider'
import ModalConfirm from '@/components/ModalConfirm'
import { uploadToBucket } from '@/utils/js/S3'
import { mapActions } from 'vuex'
import dayjs from 'dayjs'
const projectService = new ProjectProvider()
const userService = new UserProvider()

export default {
  components: {
    ModalConfirm
  },
  data: () => ({
    teams: [],
    activeDate: false,
    valid: false,
    loading: false,
    modalConfirm: false,
    formData: {
      name: '',
      detail: '',
      team: null,
      requirements: [
        {
          fileUpload: null,
          imageUpload: null,
          detail: '',
          file: null,
          image: null
        }
      ],
      deadlineDate: null
    },
    validation: {
      name: [(v) => !!v || 'This feild is require.'],
      team: [(v) => !!v || 'This feild is require.'],
      requirementDetail: [(v) => !!v || 'This feild is require.']
    }
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
    if (this.isUpdating) {
      await this.getProject()
    }
    await this.getTeams()
    this.loading = false
  },
  methods: {
    ...mapActions({
      setSnackbar: 'Style/setSnackbar'
    }),
    removeRequirement (index) {
      if (this.formData.requirements.length > 1) {
        this.formData.requirements.splice(index, 1)
      } 
    },
    removeFile (index) {
      this.formData.requirements[index].fileUpload = null
      this.formData.requirements[index].file = null
    },
    removeImage (index) {
      this.formData.requirements[index].imageUpload = null
      this.formData.requirements[index].image = null
    },
    async getProject () {
      try {
        const { data } = await projectService.getProjectById(this.projectId)
        this.formData = {
          name: data.name,
          detail: data.detail,
          deadlineDate: dayjs(data.deadlineDate).format('YYYY-MM-DD'),
          team: data.team.id,
          requirements: data.requirements.map(r => ({
            id: r.id,
            fileUpload: r.fileUpload,
            imageUpload: r.imageUpload,
            detail: r.detail,
            file: null,
            image: null
          }))
        }
      } catch (err) {
        this.setSnackbar({
          message: err.message,
          type: 'pink',
          active: true
        })
      }
    },
    addRequirement () {
      this.formData.requirements.push({
        fileUpload: null,
        imageUpload: null,
        file: null,
        image: null,
        detail: ''
      })
    },
    confirmRemove () {
      this.modalConfirm = true
    },
    async createProject () {
      this.$refs.form.validate()
      if (this.valid) {
        try {
          this.loading = true
          const { data } = await projectService.createProject(this.formData)
          if (data) {
            this.setSnackbar({
              message: 'Create project success.',
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
    },
    async uploadFile (file, field, index) {
      this.loading = true
      if (file) {
        const fileName = file.name.split('.')
        const url = await uploadToBucket(file, fileName[fileName.length - 1])
        this.formData.requirements[index][field] = url
      } else {
        this.formData.requirements[index][field] = null
      }
      this.loading = false
    },
    async updateProject () {
      this.$refs.form.validate()
      if (this.valid) {
        try {
          this.loading = true
          const { data } = await projectService.updateProject(this.projectId, this.formData)
          if (data) {
            this.setSnackbar({
              message: 'Update project success.',
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
    },
    async getTeams () {
      try {
        const { data: { results } } = await userService.getAllTeam(`limit=9999`)
        this.teams = results.map(d => ({ name: d.name, id: d.id }))
      } catch (err) {
        this.setSnackbar({
          message: err.message,
          type: 'pink',
          active: true
        })
      }
    }
  }
}
</script>

<style lang="css" scoped>
.box {
  border: 1px solid #cfcfcf;
  border-radius: 6px;
}
</style>