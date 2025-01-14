import { login, logout, getInfo, refreshToken } from '@/api/login'
import { addCollectUser, setOutTime } from '@/api/count'
import { Notification } from 'element-ui'
import {
  getToken,
  setToken,
  setRefreshToken,
  getUser,
  setExpiresIn,
  removeToken,
  setUser,
  removeUser,
  removeRefreshToken,
  getRefreshToken,
  removeExpiresIn
} from '@/utils/auth'
import { encode } from '@/utils/base/dataEncry'
// import microApp from '@micro-zoe/micro-app'

let user = {
  state: {
    token: getToken(),
    refresh_token: getRefreshToken(),
    users: getUser(),
    name: '',
    userName: '',
    avatar: '',
    permissions: []
  },

  mutations: {
    // 保存token到vuex
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    // 保存有效期
    SET_EXPIRES_IN: (state, time) => {
      state.expires_in = time
    },
    SET_REFRESH_TOKEN: (state, token) => {
      state.refresh_token = token
    },
    // 昵称
    SET_NAME: (state, name) => {
      state.name = name
    },
    // 头像
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    // 用户名
    SET_USERNAME: (state, name) => {
      state.userName = name
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      const code = userInfo.code
      const uuid = userInfo.uuid
      return new Promise((resolve, reject) => {
        login(username, password, code, uuid)
          .then((res) => {
            if(res.code == 500){
              Notification.error({
                title: '验证码输入错误，请重新输入'
              })
              reject()
              return
            }
            if(res.code == 1002){
              Notification.error({
                title: res.msg
              })
              reject()
              return
            }
            let data = res
            // 把token保存到本地
            setToken(data.access_token)
            setRefreshToken(res.refresh_token)
            commit('SET_REFRESH_TOKEN', res.refresh_token)
            commit('SET_TOKEN', data.access_token)
            // 把token的有效期存到本地
            setExpiresIn(data.expires_in)
            commit('SET_EXPIRES_IN', data.expires_in)
            commit('SET_USERNAME', username)
            let par = {
              userName: username
            }
            addCollectUser(encode(par)).then()
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo()
          .then((res) => {
            // alert(JSON.stringify(res.user))
            const user = res.user
            // 是否返回用户头像
            const avatar =
              user.avatar === '' || user.avatar === null
                ? require('@/assets/images/profile.jpg')
                : user.avatar
            // 用户角色是否存在
            if (res.roles && res.roles.length > 0) {
              // 验证返回的roles是否是一个非空数组
              commit('SET_ROLES', res.roles)
              commit('SET_PERMISSIONS', res.permissions)
            } else {
              commit('SET_ROLES', ['ROLE_DEFAULT'])
            }
            let userInfu = {
              name: user.nickName,
              userName: user.userName,
              userId: user.userId,
              deptId: user.dept.deptId,
              deptName: user.dept.deptName,
              avatar: avatar
            }
            setUser(JSON.stringify(userInfu))
            commit('SET_NAME', user.userName)
            commit('SET_AVATAR', avatar)
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    // 刷新token
    RefreshToken({ commit, state }) {
      return new Promise((resolve, reject) => {
        refreshToken(state.refresh_token)
          .then((res) => {
            setToken(res.access_token)
            commit('SET_TOKEN', res.access_token)
            setRefreshToken(res.refresh_token)
            commit('SET_REFRESH_TOKEN', res.refresh_token)
            setExpiresIn(res.expires_in)
            commit('SET_EXPIRES_IN', res.expires_in)
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    // token失效时清除cookie
    clearCookie({ commit }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        commit('SET_PERMISSIONS', [])
        removeToken()
        removeRefreshToken()
        removeUser()
        removeExpiresIn()
        resolve()
      })
    },

    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        setOutTime(JSON.parse(state.users).userName).then(resp=>{
          logout(state.token)
          .then(() => {
              commit('SET_TOKEN', '')
              commit('SET_ROLES', [])
              commit('SET_PERMISSIONS', [])
              removeToken()
              removeRefreshToken()
              removeUser()
              removeExpiresIn()
              resolve()
            })
          })
          .catch((error) => {
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            commit('SET_PERMISSIONS', [])
            removeToken()
            removeRefreshToken()
            removeUser()
            removeExpiresIn()
            reject(error)
          })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
