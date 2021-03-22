import HttpRequest from './HttpRequest'

export default class AuthProvider extends HttpRequest {
  login (username, password) {
    return this.post('/auth/login', {
      username,
      password
    })
  }

  changePassword (password, token) {
    return this.post('/users/change-password', {
      password,
      token
    })
  }

  resetPassword (username) {
    return this.post('/users/reset-password', {
      username
    })
  }
}
