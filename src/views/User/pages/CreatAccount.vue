<template>
  <v-container>
    <v-form ref="form" v-model="valid" :lazy-validation="false">
      <v-row>
        <v-col cols="12" offset-md="2" md="6">
          <div>
            <h1 v-if="isUpdating">Update User</h1>
            <h1 v-else>Create User account</h1>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="2" offset-md="2" md="2">
          <v-select
            v-model="formData.title"
            :rules="validation.title"
            :items="titles"
            label="Title"
            outlined></v-select>
        </v-col>
        <v-col cols="5" md="3">
          <v-text-field
            v-model="formData.firstName"
            :rules="validation.firstName"
            label="Frist name"
            persistent-hint
            outlined
          ></v-text-field>
        </v-col>
        <v-col cols="5" md="3">
          <v-text-field
            v-model="formData.lastName"
            :rules="validation.lastName"
            label="Last name"
            persistent-hint
            outlined
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" offset-md="2" md="8" class="my-n8">
          <v-text-field
            label="E-mail"
            v-model="formData.email"
            :rules="validation.email"
            persistent-hint
            outlined></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" offset-md="2" md="8">
          <v-text-field
            v-model="formData.phoneNumber"
            label="Phone number"
            persistent-hint
            outlined
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" offset-md="2" md="8" class="my-n8">
          <v-text-field
            v-model="formData.username"
            :rules="validation.username"
            label="User name"
            persistent-hint
            outlined
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="d-flex" offset-md="2" cols="12" md="8">
          <v-select
            v-model="formData.role"
            :items="roles"
            :rules="validation.role"
            label="Role"
            outlined></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="d-flex" offset-md="2" cols="12" md="8">
          <v-select
            v-model="formData.department"
            :rules="validation.department"
            :items="departments"
            item-text="name"
            item-value="id"
            label="Department"
            outlined></v-select>
        </v-col>
      </v-row>
      <v-row v-if="formData.photo !== null">
        <v-col class="d-flex flex-column align-center justify-center" cols="12" offset-md="2" md="8">
          <div class="img-panel">
            <v-btn class="mx-2 remove-img-btn" fab dark x-small @click="removeImage" color="pink">
              <v-icon>
                mdi-window-close
              </v-icon>
            </v-btn>
            <img :src="formData.photo" width="300" alt="">
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="d-flex" cols="12" offset-md="2" md="8">
          <v-file-input
            outlined
            accept="image/*"
            label="Image"
            v-model="image"
            @change="uploadImage()"
            truncate-length="15"
          ></v-file-input>
        </v-col>
      </v-row>
      <v-row v-if="!isUpdating">
        <v-col cols="12" offset-md="2" md="8">
          <v-btn block color="primary" :loading="loading" @click="createUser">Save</v-btn>
        </v-col>
      </v-row>
      <v-row v-else>
        <v-col cols="6" offset-md="2" md="4">
          <v-btn block color="primary" :loading="loading" @click="updateUser">Save</v-btn>
        </v-col>
        <v-col cols="6" md="4">
          <v-btn block color="pink" :loading="loading" @click="confirmRemove">Delete</v-btn>
        </v-col>
      </v-row>
    </v-form>
    <modal-confirm
      :active="modalConfirm"
      :confirm-text="`Confirm`"
      :title="'Confirm delete.'"
      :message="`Confirm delete user ${formData.username}.`"
      :show-cancel="true"
      @onCancel="() => { modalConfirm = false }"
      @onConfirm="removeUser" />
  </v-container>
</template>

<script>
import UserProvider from '@/resources/UserProvider'
import ModalConfirm from '@/components/ModalConfirm'
import { uploadToBucket } from '@/utils/js/S3'
import { mapActions } from 'vuex'
const userService = new UserProvider()
export default {
  components: { ModalConfirm },
  data: () => ({
    loading: false,
    image: null,
    modalConfirm: false,
    titles: [],
    valid: false,
    departments: [],
    formData: {
      title: '',
      firstName: '',
      lastName: '',
      email: '',
      role: 'admin',
      phoneNumber: '',
      username: '',
      department: '',
      photo: null
    },
    roles: [
      'admin',
      'hr',
      'sa',
      'dev'
    ],
    validation: {
      title: [
        v => !!v || 'This feild is require.'
      ],
      firstName: [
        v => !!v || 'This feild is require.'
      ],
      lastName: [
        v => !!v || 'This feild is require.'
      ],
      email: [
        v => !!v || 'This feild is require.',
        v => /.+@.+/.test(v) || 'Incorrect email.'
      ],
      username: [
        v => !!v || 'This feild is require.'
      ],
      department: [
        v => !!v || 'This feild is require.'
      ],
      role: [
        v => !!v || 'This feild is require.'
      ]
    }
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
    await this.getTitles()
    await this.getDepartments()
    if (this.isUpdating) {
      await this.getUser()
    }
    this.loading = false
  },
  methods: {
    ...mapActions({
      setSnackbar: 'Style/setSnackbar'
    }),
    confirmRemove () {
      this.modalConfirm = true
    },
    removeImage () {
      this.formData.photo = null
      this.image = null
    },
    async uploadImage () {
      this.loading = true
      if (this.image) {
        const fileName = this.image.name.split('.')
        const url = await uploadToBucket(this.image, fileName[fileName.length - 1])
        this.formData.photo = url
      } else {
        this.formData.photo = null
      }
      this.loading = false
    },
    async getUser () {
      try {
        const { data } = await userService.getUserById(this.userId)
        this.formData = {
          title: data.title,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          username: data.username,
          role: data.role,
          department: data.department.id,
          photo: data.photo
        }
      } catch (err) {
        this.setSnackbar({
          message: err.message,
          type: 'pink',
          active: true
        })
      }
    },
    async createUser () {
      this.$refs.form.validate()
      if (this.valid) {
        try {
          this.loading = true
          const { data } = await userService.createUser(this.formData)
          if (data) {
            this.setSnackbar({
              message: 'Create user success.',
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
    },
    async updateUser () {
      this.$refs.form.validate()
      if (this.valid) {
        try {
          this.loading = true
          const { data } = await userService.updateUser(this.userId, this.formData)
          if (data) {
            this.setSnackbar({
              message: 'Update user success.',
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
    },
    async getDepartments () {
      try {
        const { data } = await userService.getAllDepartments('limit=9999')
        this.departments = data.results
      } catch (err) {
        this.setSnackbar({
          message: err.message,
          type: 'pink',
          active: true
        })
      }
    },
    async getTitles () {
      try {
        const { data } = await userService.getTitle()
        this.titles = data.map(d => d.name)
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
.img-panel {
  width: fit-content;
  display: flex;
  justify-content: flex-end;
}

.remove-img-btn {
  position: absolute;
  margin-right: -10px !important;
  margin-top: -10px !important;
}
</style>