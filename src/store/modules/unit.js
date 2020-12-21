import { RepositoryFactory } from '@/api/factory/repositoryFactory'
const UnitRepository = RepositoryFactory.get('unit')
const state = {
  units: {},
  unit: {},
  remainingTime: 0,
  isStartChecking: true,
  timeout: null,
  count: 0,
  lastEvaluatedKey: null,
}

const actions = {
  async createUnit({ commit }, data) {
    const unit = await UnitRepository.create(data)
    commit('addUnit', unit.data)
    return unit.data
  },
  async updateRemainingTime({ state }, remainingTime) {
    state.remainingTime = remainingTime
    return state.remainingTime
  },
  async updateIsStartChecking({ state }, isStartChecking) {
    state.isStartChecking = isStartChecking
    return state.isStartChecking
  },
  async updateTimeoutRemainingTime({ state }, timeout) {
    state.timeout = timeout
    return state.timeout
  },
  async clearTimeoutRemainingTime({ state }) {
    clearTimeout(state.timeout)
  },
  async fetchUnits({ commit }, params = {}) {
    const res = await UnitRepository.fetch({
      ...params
    })
    commit('setUnits', res.data || [])
    return res.data
  },
  async fetchUnit({ commit }, id) {
    const res = await UnitRepository.fetchOne(id)
    commit('setUnitData', res.data || {})
    return res.data
  },
  async countUnits({ commit }, params = {}) {
    const res = await UnitRepository.count({
      ...params,
      type: 'unit'
    })
    commit('setCount', res.data.Count || 0)
  },
  async updateUnit({ commit }, { id, ...unit }) {
    const res = await UnitRepository.update(id, unit)
    return commit('setUnit', res.data)
  },
  async updateUnitOrder(units) {
    for (let i = 0; i < units.length; i++) {
      await UnitRepository.update(units[i].id, { index: i })
    }
  },
  async removeUnit({ commit }, item) {
    await UnitRepository.remove(item.id, {
      vendorId: item.vendorId
    })
    return commit('removeUnit', item.id)
  },
  async setUnit({ commit }, unit) {
    return commit('setUnitData', unit)
  },
  async addUnit({ commit }, unit) {
    return commit('setUnit', unit)
  },
}

const mutations = {
  setUnit(state, unit) {
    return (state.units = {
      ...state.units,
      [unit.id]: unit
    })
  },
  setCount(state, count) {
    return (state.count = count)
  },
  addUnit(state, unit) {
    state.count = state.count + 1
    state.units = {
      [unit.id]: unit,
      ...state.units
    }
  },
  updateUnits(state, units) {
    state.units = {
      ...units.reduce((acc, cur) => ({ ...acc, [cur.id]: cur }), {}),
      ...state.units
    }
  },
  setUnitData(state, unit) {
    state.unit = unit
    return state.unit
  },
  appendUnits(state, units) {
    return (state.units = {
      ...units.reduce((acc, cur) => ({ ...acc, [cur.id]: cur }), {}),
      ...state.units
    })
  },
  setUnits(state, units) {
    
    return (state.units = units.reduce(
      (acc, cur) => ({ ...acc, [cur.id]: cur }),
      {}
    ))
  },
  removeUnit(state, id) {
    delete state.units[id]
    state.units = { ...state.units }
  },
  setLastEvaluatedKey(state, key) {
    state.lastEvaluatedKey = key
  },
}

const getters = {
  getRemainingTime: (state) => {
    return state.remainingTime
  },
  getIsStartChecking: (state) => {
    return state.isStartChecking
  },
  units: (state) => {
    return Object.values(state.units).sort((a, b) => {
      const aIndex = a.index ? a.index : 0
      const bIndex = b.index ? b.index : 0
      return aIndex - bIndex
    })
  },
  objectUnits: (state) => {
    return state.units
  },
  getUnitsBySectionId: (state) => (sectionId) => {
    return Object.values(state.units)
      .filter((a) => a.section === sectionId)
      .sort((a, b) => {
        const aIndex = a.index ? a.index : 0
        const bIndex = b.index ? b.index : 0
        return aIndex - bIndex
      })
  },
  count: (state) => {
    return state.count
  },
  getUnit: (state) => {
    return state.unit
  },
}

export default {
  state,
  actions,
  mutations,
  getters,
  namespaced: true,
}
