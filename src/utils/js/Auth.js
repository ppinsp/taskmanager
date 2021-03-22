import jwtDecode from 'jwt-decode'
import Cookies from 'js-cookie'

const storageKey = 'AccessToken'

const getAuth = () => {
  const auth = Cookies.getJSON(storageKey)
  return auth
}

const getAuthDecode = () => {
  const auth = Cookies.getJSON(storageKey)
  return auth ? jwtDecode(auth) : null
}

const setAuthUser = (token, expire) => {
  Cookies.set(storageKey, token, {
    expires: new Date(expire),
    sameSite: 'strict'
  })
  return getAuth()
}

const clearAuth = () => {
  Cookies.remove(storageKey)
}

const getAuthToken = () => {
  let token = {}
  if (Cookies.getJSON(storageKey)) {
    token = {
      key: 'Authorization',
      value: `Bearer ${Cookies.getJSON(storageKey)}`
    }
  }
  return token
}

const setUserData = (data) => {
  window.localStorage.setItem('user_data', JSON.stringify(data))
}

export function getUser () {
  const user = window.localStorage.getItem('user_data')
  return user ? JSON.parse(user) : null
}


export function getStoreBearer () {
  let auth = window.localStorage.getItem('sellsuki.store.bearer')
  // auth = JSON.parse(auth)
  return auth
}

export default {
  setAuthUser,
  getAuth,
  getAuthToken,
  clearAuth,
  getAuthDecode,
  setUserData
}

export {
  setAuthUser,
  getAuth,
  getAuthToken,
  clearAuth,
  getAuthDecode,
  setUserData
}