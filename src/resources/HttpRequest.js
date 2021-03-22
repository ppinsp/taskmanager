import axios from 'axios'
import humps from 'humps'

class HttpRequest {
  constructor (url = process.env.VUE_APP_API) {
    this.axiosInstance = axios.create({
      baseURL: url,
      timeout: 120000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.axiosInstance.interceptors.request.use((config) => {
      const myConfig = config
      myConfig.data = config.data ? humps.decamelizeKeys(config.data) : config.data
      myConfig.params = config.params ? humps.decamelizeKeys(config.params) : config.params
      return myConfig
    }, (error) => Promise.reject(error))

    this.axiosInstance.interceptors.response.use((response) => {
      const newResponse = response
      newResponse.data = humps.camelizeKeys(response.data)
      return newResponse.data
    }, (error) => {
      const newError = new Error(error)
      if (error && error.response && error.response.data) {
        return Promise.reject(error.response.data)
      }
      const errorFail = {
        code: 503,
        message: newError.message
      }
      throw errorFail
    })
  }

  setHeader (header) {
    this.axiosInstance.defaults.headers.common[header.key] = header.value
    this.axiosInstance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
  }

  get (endpoint, data, config) {
    const params = {
      params: data
    }
    const newParams = Object.assign(params, config)
    return this.axiosInstance.get(endpoint, newParams)
  }

  post (endpoint, data, config) {
    return this.axiosInstance.post(endpoint, data, config)
  }

  put (endpoint, data, config) {
    return this.axiosInstance.put(endpoint, data, config)
  }

  edit (endpoint, data, config) {
    return this.axiosInstance.patch(endpoint, data, config)
  }

  remove (endpoint, data, config) {
    const params = { data }
    const newParams = Object.assign(params, config)
    return this.axiosInstance.delete(endpoint, newParams)
  }

  delete (endpoint, id, config) {
    const params = {
      params: {
        id
      }
    }
    const newParams = Object.assign(params, config)
    return this.axiosInstance.delete(endpoint, newParams)
  }

  getByPagination (endpoint, query) {
    const sortOrder = query.sortDesc[0] ? 'asc' : 'desc'
    let sortBy = '_id'
    if (query.sortBy[0] && query.sortBy[0] !== 'id') {
      sortBy = query.sortBy[0]
    }
    const params = {
      page: query.page || 1,
      limit: query.itemsPerPage || 25,
      search: query.search || '',
      sortBy,
      sortOrder
    }
    return this.axiosInstance.get(endpoint, { params })
  }
}

export default HttpRequest
