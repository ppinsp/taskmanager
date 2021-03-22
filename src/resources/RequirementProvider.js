import HttpRequest from './HttpRequest'
import { getAuthToken } from '@/utils/js/Auth'
export default class RequirementProvider extends HttpRequest {
    updateRequirement (id, payload) {
        this.setHeader(getAuthToken())
        return this.put(`/requirements/${id}`, payload)
    }

    getRequirementByUserId (id) {
        this.setHeader(getAuthToken())
        return this.get(`/requirements/getRequirement/${id}`)
    }
}