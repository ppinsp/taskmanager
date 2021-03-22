<template>
  <v-container>
    <v-form ref="form" v-model="valid" :lazy-validation="false">
      <v-row>
        <v-col cols="12" md="8" offset-md="2">
          <div>
            <h1>My Account</h1>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="2" md="2" offset-md="2">
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
        <v-col cols="12" md="8" offset-md="2" class="my-n8">
          <v-text-field
            label="E-mail"
            v-model="formData.email"
            :rules="validation.email"
            persistent-hint
            outlined></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="8" offset-md="2">
          <v-text-field
            v-model="formData.phoneNumber"
            label="Phone number"
            persistent-hint
            outlined
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="8" offset-md="2" class="my-n8">
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
        <v-col class="d-flex" cols="12" offset-md="2" md="8">
          <v-select
            v-model="formData.department"
            :rules="validation.department"
            :items="departments"
            disabled
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
      <v-row>
        <v-col cols="6" md="4" offset-md="2">
          <v-btn block color="primary" :loading="loading" @click="updateUser">Save</v-btn>
        </v-col>
        <v-col cols="6" md="4">
          <v-btn block color="teal" :loading="loading" @click="resetPassword()">Reset Password</v-btn>
        </v-col>
      </v-row>
    </v-form>
    <modal-confirm
      :active="modal"
      :confirm-text="`Login`"
      :title="'Reset Password'"
      :message="`Please open your email for reset password`"
      :show-cancel="false"
      @onConfirm="() => { $router.push({ name: 'Login' })}" />
  </v-container>
</template>

<script>
import UserProvider from '@/resources/UserProvider'
import { uploadToBucket } from '@/utils/js/S3'
import ModalConfirm from '@/components/ModalConfirm'
import { mapActions } from 'vuex'
import AuthProvider from '@/resources/AuthProvider'
const authService = new AuthProvider()
const userService = new UserProvider()
export default {
  components: {
    ModalConfirm
  },
  data: () => ({
    modal: false,
    loading: false,
    image: null,
    titles: [],
    valid: false,
    departments: [],
    formData: {
      title: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      username: '',
      department: '',
      photo: null,
      role: ''
    },
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
    userId () {
      return this.$route.params.id ? this.$route.params.id : 0
    }
  },
  async mounted () {
    this.loading = true
    await Promise.all([
      this.getTitles(),
      this.getDepartments(),
      this.getUser()
    ])
    this.loading = false
  },
  methods: {
    ...mapActions({
      setSnackbar: 'Style/setSnackbar'
    }),
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
          department: data.department.id,
          photo: data.photo,
          role: data.role
        }
      } catch (err) {
        this.setSnackbar({
          message: err.message,
          type: 'pink',
          active: true
        })
      }
    },
    async resetPassword () {
      try {
        this.loading = true
        await authService.resetPassword(this.formData.username)
        this.modal = true
      } catch (err) {
        this.snackbar = {
          value: true,
          type: 'pink',
          message: err.message
        }
      } finally {
        this.loading = false
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
    removeImage () {
      this.formData.photo = null
      this.image = null
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
