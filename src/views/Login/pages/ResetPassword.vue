<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col cols="12" md="4" offset-md="4" class="text-center">
          <h1>Reset Password</h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="4" offset-md="4">
          <v-text-field
            v-model="password"
            label="New Password"
            type="password"
            outlined
            ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="4" offset-md="4">
          <v-text-field
            v-model="confirmPassword"
            label="Confirm New Password"
            type="password"
            outlined
            ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="4" offset-md="4">
          <v-btn
            @click="resetPassword"
            :disabled="!validBtn"
            :loading="loading"
            block
            color="primary">
            {{ btnLable }}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <snackbar
      :value="snackbar.value"
      :type="snackbar.type"
      :message="snackbar.message"
      @close="(val) => { snackbar.value = val }"/>
  </v-form>
</template>

<script>
import AuthProvider from '@/resources/AuthProvider'
import Snackbar from '@/components/Snackbar'
const authService = new AuthProvider()


export default {
  components: {
    Snackbar
  },
  data: () => ({
    password: '',
    confirmPassword: '',
    loading: false,
    snackbar: {
      value: false,
      type: 'success',
      message: 'success'
    },
  }),
  computed: {
    validBtn () {
      return this.password === this.confirmPassword && this.password !== '' && this.password !== ' '
    },
    token () {
      return this.$route.query.token ? this.$route.query.token : ''
    },
    btnLable () {
      if (this.password === '' || this.password === ' ') {
        return 'Enter your new password'
      } else if (this.password !== this.confirmPassword) {
        return 'Password miss match'
      }
      return 'Reset Password'
    }
  },
  methods: {
    async resetPassword () {
      try {
        this.loading = true
        const { data } = await authService.changePassword(this.password, this.token)
        if (data) {
          this.snackbar = {
            value: true,
            type: 'success',
            message: 'Success'
          }
          setTimeout(() => {
            this.$router.push({ name: 'Login' })
          }, 1000)
        }
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

<style>
</style>