import {request, METHOD} from '@/utils/request'
import { transformAbpListQuery } from '@/utils/abp'

export function getOrganizationsAllWithDetails(query) {
  return request('/api/identity/users/available-organization-units', METHOD.GET, query)
}

/**
 * 获取组织机构
 * Example: ?filter&sorting&skipCount=0&maxResultCount=20
 * @param {object} query
 */
export function getOrganizationsWithDetails(query) {
  return request('/api/identity/organization-units/details', METHOD.GET, query)
}

/**
 * 后期考虑提交PR给abp,没有获取根节点的方法
 * @param {object} query
 */
export function getOrganizationsRoot() {
  return request('/api/identity/organization-units/root', METHOD.GET)
}

export function getOrganizationSingleWithDetails(id) {
  return request(`/api/identity/organization-units/${id}/details`, METHOD.GET)
}

export function getOrganizationSingle(id) {
  return request(`/api/identity/organization-units/${id}`, METHOD.GET)
}

export function getOrganizationsAll() {
  return request('/api/identity/organization-units/all', METHOD.GET)
}

export function getOrganizations(query) {
  return request('/api/identity/organization-units', METHOD.GET,transformAbpListQuery(query))
}

export function getOrganizationChildren(pid) {
  return request(`/api/identity/organization-units/children/${pid}`, METHOD.GET)
}

export function getOrgUsers(query) {
  return request('/api/identity/organization-units/users', METHOD.GET,transformAbpListQuery(query))
}

export function getOrgRoles(query) {
  return request('/api/identity/organization-units/roles', METHOD.GET,transformAbpListQuery(query))
}

export function createOrganization(payload) {
  return request('/api/identity/organization-units', METHOD.POST, payload)
}

export function updateOrganization(id, payload) {
  return request(`/api/identity/organization-units/${id}`, METHOD.PUT, payload)
}

export function deleteOrganization(id) {
  return request(`/api/identity/organization-units/${id}`, METHOD.DELETE)
}
export async function createUpdate(params) {
  if (params.id) {
      return request(`/api/identity/organization-units/${params.id}`, METHOD.PUT, params)
  }
  return request('/api/identity/organization-units', METHOD.POST, params)
}
