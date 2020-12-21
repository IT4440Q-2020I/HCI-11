import { UserPermission } from '@/api/repository/userPermissionRepository'

const state = {
  userPermissions: [],
  permissionAccessCourse: {}
}

const actions = {
  async fetchUserPermissions({ commit }, userId) {
    const res = await UserPermission.fetch({ userId })
    commit('setUserPermissions', res.data.courses)
    commit('setUserCoursePermissions', res.data.userCourses)
    return res.data
  },
  async checkPermissionAccessCourse({ commit }, courseId) {
    const res = await UserPermission.fetchOne({
      relationId: courseId
    })
    commit('setPermissionAccessCourse', res.data)
    return res.data
  }
}

const mutations = {
  setUserPermissions(state, userPermissions) {
    state.userPermissions = userPermissions
  },
  setPermissionAccessCourse(state, permissionAcessCourse) {
    state.permissionAccessCourse = permissionAcessCourse
  },
  setUserCoursePermissions(state, userCourses) {
    state.userPermissions = state.userPermissions.map(course => {
      const userCourseMatchWithCourse = userCourses.find(userCourse => userCourse.course === course.id)
      if (userCourseMatchWithCourse) {
        return {
          ...course,
          progress: userCourseMatchWithCourse.dataDetails && userCourseMatchWithCourse.dataDetails.progress ? userCourseMatchWithCourse.dataDetails.progress : 0
        }
      } else return course
    })
  }
}

const getters = {
  getUserPermissions: state => {
    return state.userPermissions
  },
  getPermissionAccessCourse: state => {
    return state.permissionAccessCourse
  }
}

export default {
  state,
  actions,
  mutations,
  getters,
  namespaced: true,
}
