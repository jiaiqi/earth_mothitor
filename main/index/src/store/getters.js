const getters = {
  device: (state) => state.app.device,
  dict: (state) => state.dict.dict,
  token: (state) => state.user.token,
  avatar: (state) => state.user.avatar, // 用户头像
  name: (state) => state.user.name, // 用户名字
  roles: (state) => state.user.roles, // 用户角色
  permissions: (state) => state.user.permissions, // 用户权限
  introduction: (state) => state.user.introduction,
  permission_routes: (state) => state.permission.routes,
  topbarRouters: (state) => state.permission.topbarRouters,
  defaultRoutes: (state) => state.permission.defaultRoutes
}
export default getters
