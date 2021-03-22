<template>
<v-form>
  <v-container>
    <v-row>
      <v-col cols="12" md="4" offset-md="4">
      <div class="text-center">
        <h1>Forgot Password?</h1>
      </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="4" offset-md="4">
        <v-text-field
            v-model="username"
            label="Enter your username"
            hint=""
            persistent-hint
            outlined
          ></v-text-field>
      </v-col>
    </v-row>
    
    <v-row>
      <v-col cols="12" md="4" offset-md="4">
        <div class="text-center">
          <v-btn
            @click="resetPassword"
            block
            :loading="loading"
            :disabled="!validBtn"
            color="primary">
            Reset Password
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
  <snackbar
    :value="snackbar.value"
    :type="snackbar.type"
    :message="snackbar.message"
    @close="(val) => { snackbar.value = val }"/>
  <modal-confirm
    :active="modal"
    :confirm-text="`Login`"
    :title="'Reset Password'"
    :message="`Please open your email for reset password`"
    :show-cancel="false"
    @onConfirm="() => { $router.push({ name: 'Login' })}" />
</v-form>
</template>

<script>
import AuthProvider from '@/resources/AuthProvider'
import Snackbar from '@/components/Snackbar'
import ModalConfirm from '@/components/ModalConfirm'


const authService = new AuthProvider()

export default {
  components: {
    Snackbar,
    ModalConfirm
  },
  data: () => ({
    username: '',
    loading: false,
    modal: false,
    snackbar: {
      value: false,
      type: 'success',
      message: 'success'
    },
  }),
  computed: {
    validBtn () {
      return this.username !== '' && this.username !== ' '
    }
  },
  methods: {
    async resetPassword () {
      try {
        this.loading = true
        await authService.resetPassword(this.username)
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
    }
  }
}
</script>
