<template>
  <v-container>
    <v-form>
      <v-row>
        <v-col cols="12" offset-md="3" md="6">
          <div class="text-center">
            <h1>Login</h1>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" offset-md="3" md="6">
          <v-text-field
            v-model="username"
            label="User name"
            persistent-hint
            outlined
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" offset-md="3" md="6">
          <v-text-field
            v-model="password"
            label="Password"
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show ? 'text' : 'password'"
            @click:append="show = !show"
            outlined
          />
          <div class="text-right cursor-pointer" @click="$router.push({ name: 'ForgotPassword'})">forget Password?</div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" offset-md="3" md="6">
          <div class="text-center">
            <v-btn
              @click="login"
              block
              color="primary"
              :loading="loading">
              Login
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-form>
    <snackbar
      :value="snackbar.value"
      :type="snackbar.type"
      :message="snackbar.message"
      @close="(val) => { snackbar.value = val }"/>
  </v-container>
</template>

<script>
import AuthProvider from '@/resources/AuthProvider'
import Snackbar from '@/components/Snackbar'
import { setAuthUser, setUserData } from '@/utils/js/Auth'
const authService = new AuthProvider()

export default {
  data: () => ({
    snackbar: {
      value: false,
      type: 'success',
      message: 'success'
    },
    loading: false,
    show: false,
    username: '',
    password: ''
  }),
  components: {
    Snackbar
  },
  methods: {
    async login () {
      try {
        this.loading = true
        const { data } = await authService.login(this.username, this.password)
        await setAuthUser(data.accessToken, data.tokenExpire)
        console.log(data)
        await setUserData(data)
        setTimeout(() => {
          this.$router.push('/')
        }, 500)
      } catch (err) {
        this.snackbar = {
          value: true,
          type: 'pink',
          message: 'Unauthorize'
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="css" scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>