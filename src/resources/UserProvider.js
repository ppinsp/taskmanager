import HttpRequest from './HttpRequest'
import { getAuthToken } from '@/utils/js/Auth'
export default class UserProvider extends HttpRequest {
  getUser (query) {
    this.setHeader(getAuthToken())
    return this.get(`/users?${query}`)
  }

  getAllDepartments (query) {
    this.setHeader(getAuthToken())
    return this.get(`/departments?${query}`)
  }

  getUserById (id) {
    this.setHeader(getAuthToken())
    return this.get(`/users/${id}`)
  }

  getTitle () {
    this.setHeader(getAuthToken())
    return this.get(`/titles`)
  }

  createUser (payload) {
    this.setHeader(getAuthToken())
    return this.post(`/users`, payload)
  }

  updateUser (id, payload) {
    this.setHeader(getAuthToken())
    return this.put(`/users/${id}`, payload)
  }

  deleteUser (id) {
    this.setHeader(getAuthToken())
    return this.delete(`/users?id=${id}`)
  }

  getDepartmentById (id) {
    this.setHeader(getAuthToken())
    return this.get(`/departments/${id}`)
  }

  createDepartment (payload) {
    this.setHeader(getAuthToken())
    return this.post(`/departments`, payload)
  }

  updateDepartment(id, payload) {
    this.setHeader(getAuthToken())
    return this.put(`/departments/${id}`, payload)
  }

  deleteDepartment (id) {
    this.setHeader(getAuthToken())
    return this.delete(`/departments?id=${id}`)
  }

  getAllTeam (query) {
    this.setHeader(getAuthToken())
    return this.get(`/teams?${query}`)
  }

  getTeamById (id) {
    this.setHeader(getAuthToken())
    return this.get(`/teams/${id}`)
  }

  createTeam (payload) {
    this.setHeader(getAuthToken())
    return this.post(`/teams`, payload)
  }

  updateTeam (id, payload) {
    this.setHeader(getAuthToken())
    return this.put(`/teams/${id}`, payload)
  }

  deleteTeam (id) {
    this.setHeader(getAuthToken())
    return this.delete(`/teams?id=${id}`)
  }
  getuserrequriement(id){
    this.setHeader(getAuthToken())
    return this.get(`/users/fixuser/${id}`)
  }
}
