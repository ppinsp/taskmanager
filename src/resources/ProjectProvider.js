import HttpRequest from './HttpRequest'
import { getAuthToken } from '@/utils/js/Auth'
export default class ProjectProvider extends HttpRequest {
  getAllProject (query) {
    this.setHeader(getAuthToken())
    return this.get(`/projects?${query}`)
  }

  getProjectById (id) {
    this.setHeader(getAuthToken())
    return this.get(`/projects/${id}`)
  }

  createProject (payload) {
    this.setHeader(getAuthToken())
    return this.post(`/projects`, payload)
  }

  updateProject (id, payload) {
    this.setHeader(getAuthToken())
    return this.put(`/projects/${id}`, payload)
  }

  deleteProject (id) {
    this.setHeader(getAuthToken())
    return this.delete(`/projects?id=${id}`)
  }
  getProjectUserFind(id){
    this.setHeader(getAuthToken())
    return this.get(`/projects/userfind/${id}`)

  }
}
