import { apiFetch } from './client'

export async function getPersonDetail(id) {
  return apiFetch(`/persons/${id}`)
}

export async function searchPersons(params = {}) {
  const searchParams = new URLSearchParams(params).toString()
  return apiFetch(`/persons?${searchParams}`)
}
