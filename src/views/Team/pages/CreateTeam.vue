<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <v-form ref="form" v-model="valid" :lazy-validation="false">
          <v-row>
            <v-col cols="12">
              <h1 v-if="isUpdating">Update Team</h1>
              <h1 v-else>Create Team</h1>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
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
            <v-col cols="12">
              <v-text-field
                label="Description"
                v-model="formData.description"
                persistent-hint
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <h2>Team User</h2>
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left"> Id </th>
                      <th class="text-left"> Username </th>
                      <th class="text-left"> Name </th>
                      <th class="text-left"> Department </th>
                      <th class="text-center"> Remove </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in formData.users" :key="item.id">
                      <td>{{ item.id }}</td>
                      <td>{{ item.username }}</td>
                      <td>{{ item.name }}</td>
                      <td>{{ item.department }}</td>
                      <td class="text-center">
                        <v-icon @click="formData.users.splice(index, 1)">
                          mdi-minus
                        </v-icon>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-col>
          </v-row>
          <v-row v-if="!isUpdating">
            <v-col cols="12">
              <div class="text-center">
                <v-btn block @click="createTeam()" color="primary" :loading="loading" dark>
                  Save
                </v-btn>
              </div>
            </v-col>
          </v-row>
          <v-row v-else>
            <v-col cols="6" md="3">
              <v-btn block color="primary" :loading="loading" @click="updateTeam">Save</v-btn>
            </v-col>
            <v-col cols="6" md="3">
              <v-btn block color="pink" :loading="loading" @click="confirmRemove">Delete</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
      <v-col>
        <user-table
          :validUsers="formData.users"
          @onAddUser="(user) => formData.users.push(user)"
        />
      </v-col>
    </v-row>
    <modal-confirm
      :active="modalConfirm"
      :confirm-text="`Confirm`"
      :title="'Confirm delete.'"
      :message="`Confirm delete team ${formData.name}.`"
      :show-cancel="true"
      @onCancel="() => { modalConfirm = false }"
      @onConfirm="removeTeam" />
  </v-container>
</template>

<script>
import UserProvider from '@/resources/UserProvider'
import ModalConfirm from '@/components/ModalConfirm'
import UserTable from '../components/UserTable'
import { mapActions } from 'vuex'
const userService = new UserProvider()

export default {
  components: {
    ModalConfirm,
    UserTable
  },
  data: () => ({
    valid: false,
    loading: false,
    modalConfirm: false,
    formData: {
      name: '',
      description: '',
      users: [],
      oldUsers: []
    },
    validation: {
      name: [(v) => !!v || 'This feild is require.']
    }
  }),
  computed: {
    isUpdating () {
      return this.$route.params.id ? true : false
    },
    teamId () {
      return this.$route.params.id ? this.$route.params.id : 0
    }
  },
  async mounted () {
    this.loading = true
    if (this.isUpdating) {
      await this.getTeam()
    }
    this.loading = false
  },
  methods: {
    ...mapActions({
      setSnackbar: 'Style/setSnackbar'
    }),
    mapUserForDisplay (users) {
      return users.map(d => ({
        id: d.id,
        username: d.username,
        name: `${d.firstName} ${d.lastName}`,
        email: d.email,
        department: d.department.name,
        phoneNumber: d.phoneNumber
      }))
    },
    async getTeam () {
      try {
        const { data } = await userService.getTeamById(this.teamId)
        this.formData = {
          name: data.name,
          description: data.description,
          oldUsers: data.teamUsers.map(tu => tu.user.id),
          users: this.mapUserForDisplay(data.teamUsers.map(tu => tu.user))
        }
      } catch (err) {
        this.setSnackbar({
          message: err.message,
          type: 'pink',
          active: true
        })
      }
    },
    confirmRemove () {
      this.modalConfirm = true
    },
    async createTeam () {
      this.$refs.form.validate()
      if (this.valid) {
        try {
          this.loading = true
          const payload = {
            ...this.formData,
            users: this.formData.users.map(user => user.id)
          }
          const { data } = await userService.createTeam(payload)
          if (data) {
            this.setSnackbar({
              message: 'Create team success.',
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
    },
    async updateTeam () {
      this.$refs.form.validate()
      if (this.valid) {
        try {
          this.loading = true
          const payload = {
            ...this.formData,
            users: this.formData.users.map(user => user.id)
          }
          const { data } = await userService.updateTeam(this.teamId, payload)
          if (data) {
            this.setSnackbar({
              message: 'Update team success.',
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
