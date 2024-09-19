import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

const ExpiresInKey = 'Admin-Expires-In'

const UserKey = 'Admin-User'

export function getToken() {
  return Cookies.get(TokenKey)
}
export function getUser() {
  return Cookies.get(UserKey)
}
// 把token存到本地
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}
export function setUser(user) {
  return Cookies.set(UserKey, user)
}
export function removeToken() {
  return Cookies.remove(TokenKey)
}
export function removeUser() {
  return Cookies.remove(UserKey)
}

export function getExpiresIn() {
  return Cookies.get(ExpiresInKey) || -1
}
// 把token的有效期存到本地
export function setExpiresIn(time) {
  return Cookies.set(ExpiresInKey, time)
}

export function removeExpiresIn() {
  return Cookies.remove(ExpiresInKey)
}
