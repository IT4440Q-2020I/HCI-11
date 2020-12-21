import { RepositoryFactory } from '@/api/factory/repositoryFactory'
const UserCourseRepository = RepositoryFactory.get('userCourse')

const state = {
  userCourse: null,
  userCourses: [],
}

const actions = {
  async enrollUserCourse ({ commit }, data) {
    const userCourse = await UserCourseRepository.enroll(data)
    commit('setUserCourse', userCourse.data)
    return userCourse.data
  },
  async fetchUserCourse ({ rootState, commit }, { courseId }) {
    if (rootState.auth.authenticated) {
      let data = await UserCourseRepository.fetch({
        userId: rootState.auth.auth.id,
        course: courseId
      })
      commit('setUserCourse', data.data && data.data.length ? data.data[0] : {})
      return data.data
    }
  },
  async fetchUserCourseByUser ({ commit }, userId) {
    try {
      const res = await UserCourseRepository.fetch({ userId: userId })
      commit('setUserCourses', res.data.Items)
      return res.data.Items
    } catch (error) { 
      console.error('fetchUserCourseByUser error:', error)
    }
  },
  async interactUserCourse ({ commit }, { id, userCourse }) {
    const res = await UserCourseRepository.interact(id, userCourse)
    commit('setUserCourse', res.data)
    return res.data
  },
  createNewView (_, { views, newView }) {
    views.push(newView)
    return views
  },
  updateView (_, { views, updateView }) {
    return views.map(view => {
      if (view.unitId === updateView.unitId && !view.isDone) {
        return updateView
      } else return view
    })
  },
  async createOrUpdateViews ({ dispatch }, { newView, viewsOfStudent }) {
    let viewData = {}
    if (!viewsOfStudent) {
      viewData = {
        views: [newView]
      }
    } else {
      let existedView = viewsOfStudent.find(
        view => view.unitId === newView.unitId
      )
      if (existedView) {
        viewData = {
          views: await dispatch('updateView', {
            views: viewsOfStudent,
            updateView: newView
          })
        }
      } else {
        viewData = {
          views: await dispatch('createNewView', {
            views: viewsOfStudent,
            newView
          })
        }
      }
    }
    return viewData
  },
  calculateCourseProgress (_, { viewsOfStudent, syllabus }) {
    if (!viewsOfStudent) return 0
    const doneViews = viewsOfStudent.filter(view => view.isDone === true)
    let numberOfUnits = 0
    syllabus.forEach(syllabus => {
      numberOfUnits += syllabus.lessons.length
    })
    return doneViews && doneViews.length
      ? Math.floor((doneViews.length / numberOfUnits) * 100)
      : 0
  }
}

const mutations = {
  setUserCourse (state, userCourse) {
    state.userCourse = userCourse
  },
  setUserCourses (state, userCourses) {
    state.userCourses = userCourses
  }
}

const getters = {
  getUserCourse: state => {
    return state.userCourse
  },
  getUserCourses: state => {
    return state.userCourses
  }
}

export default {
  state,
  actions,
  getters,
  mutations,
  namespaced: true
}