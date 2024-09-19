import { login, logout, getInfo, refreshToken } from '@/api/login'
import { getToken, setToken, setExpiresIn, removeToken, setRefreshToken, getRefreshToken} from '@/utils/auth'
import { groupByStatus } from '@/api/workflow/order'
import { encode, decode } from '@/utils/base/dataEncry.js';

const user = {
  state: {
    token: getToken(),
    name: '',
    userId: 0,
    avatar: '',
    roles: [],
    permissions: [],
    orderStatus: []
  },

  mutations: {
    // 保存token到vuex
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_EXPIRES_IN: (state, time) => {
      state.expires_in = time
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_ID: (state, id) => {
      state.userId = id
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    SET_ORDER: (state, orderStatus) => {
      state.orderStatus = orderStatus
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
            let data = res.data
            // 把token保存到本地
            setToken(data.access_token)
            commit('SET_TOKEN', data.access_token)
            // 把token的有效期存到本地
            setExpiresIn(data.expires_in)
            commit('SET_EXPIRES_IN', data.expires_in)
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    // 接收传来的token
    goIndex({ commit }, arr) {
      // 把token保存到本地
      if(arr.token){
        setToken(arr.token)
      commit('SET_TOKEN', arr.token)
      }
      // 把token的有效期存到本地
      setExpiresIn(arr.expiresIn)
      setRefreshToken(arr.refreshToken)
      commit('SET_EXPIRES_IN', arr.expiresIn)
      return true
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo()
          .then((res) => {
            const user = res.user
            const avatar =
              user.avatar === '' || user.avatar == null
                ? require('@/assets/images/profile.jpg')
                : user.avatar
            if (res.roles && res.roles.length > 0) {
              // 验证返回的roles是否是一个非空数组
              commit('SET_ROLES', res.roles)
              commit('SET_PERMISSIONS', res.permissions)
            } else {
              commit('SET_ROLES', ['ROLE_DEFAULT'])
            }
            commit('SET_ID', user.userId)
            commit('SET_NAME', user.userName)
            commit('SET_AVATAR', avatar)
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    // 刷新token
    RefreshToken({ commit, state }) {
      const refreshT = getRefreshToken()
      return new Promise((resolve, reject) => {
        refreshToken(refreshT)
          .then((res) => {
            setToken(res.access_token)
            commit('SET_TOKEN', res.access_token)
            setRefreshToken(res.refresh_token)
            setExpiresIn(res.data)
            commit('SET_EXPIRES_IN', res.data)
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token)
          .then(() => {
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            commit('SET_PERMISSIONS', [])
            removeToken()
            resolve()
          })
          .catch((error) => {
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
    },

    //统计订单各个状态的数量
    groupByStatus({ commit, state }) {
      let par = {}
      // if(state.permissions.includes('workflow:order:all') || state.permissions[0] == '*:*:*'){
        // par = {}
      // }else{
      //   par = encode({
      //     userId: state.userId.toString()
      //   })
      // }
      groupByStatus(par).then(res=>{
        commit('SET_ORDER', decode(res))
      })
      
    }
  }
}

export default user
