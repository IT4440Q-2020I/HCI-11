import { RepositoryFactory } from '@/api/factory/repositoryFactory'
const CommentRepository = RepositoryFactory.get('comment')
import helpers from '@/helpers'
const { countTypeEnums } = helpers.commentEnums

const state = {
  comments: [],
  total: 0,
  replies: [],
  commentCount: 0,
  replyCount: 0,
  ignoredComments: [],
  ignoredReplies: [],
}

const actions = {
  async createComment({ commit, state, rootState }, params) {
    if (!rootState.auth.authenticated || !params.objectId) return
    const { addToList, ...other } = params
    const res = await CommentRepository.create({
      ...other,
      userId: rootState.auth.auth.id,
      userEmail: rootState.auth.auth.email,
      userName: rootState.auth.auth.name,
      userAvatarLink: rootState.auth.auth.avatar,
    })
    if (res && res.data) {
      if (addToList) {
        if (params.type === 'comment') {
          commit('addComment', res.data || {})
        } else {
          // commit('addReply', res.data || {})
          commit('updateTotalReplies', res.data || {})
        }
        commit('setTotal', res.data ? state.total + 1 : state.total)
      }
      return res.data
    }
    throw new Error('Submit comment failed!')
  },
  async updateComment({ commit }, { id, addToList, ...other }) {
    if (!id) return
    const res = await CommentRepository.update(id, other)
    if (res && res.data) {
      if (addToList) {
        if (other.type === 'comment') {
          commit('updateComment', res.data || {})
        } else {
          commit('updateReply', res.data || {})
        }
      }
      return res.data
    }
    throw new Error('Submit reply failed!')
  },
  async fetchComments({ commit }, params) {
    const res = await CommentRepository.fetch({ ...params, status: 'publish' })
    commit('setComments', res.data || [])
  },
  async fetchCount({ commit }, { countType, ...params }) {
    const res = await CommentRepository.count({ ...params, status: 'publish' })
    switch (countType) {
      case countTypeEnums.TOTAL:
        commit('setTotal', res.data || 0)
        break
      case countTypeEnums.COMMENT:
        commit('setCommentCount', res.data || 0)
        break
      case countTypeEnums.REPLY:
        commit('setReplyCount', res.data || 0)
        break
      default:
        break
    }
  },
  async fetchRepliesOfComment({ commit }, params) {
    const res = await CommentRepository.fetch({ ...params, status: 'publish', _sort: true })
    commit('setReplies', res.data || [])
  },
}

const mutations = {
  setComments(state, comments) {
    if (state.ignoredComments.length > 0) {
      state.comments = state.comments.concat(comments.filter(comment => state.ignoredComments.indexOf(comment.id) < 1))
    } else {
      state.comments = state.comments.concat(comments)
    }
  },
  addComment(state, comment) {
    state.comments = [comment, ...state.comments]
    state.ignoredComments.concat(comment.id)
  },
  updateComment(state, comment) {
    if (comment && comment.id) {
      const index = state.comments.findIndex(item => item.id === comment.id)
      if (index >= 0) {
        state.comments.splice(index, 1, comment)
      }
    }
  },
  updateReply(state, reply) {
    if (reply && reply.id) {
      const index = state.replies.findIndex(item => item.id === reply.id)
      if (index >= 0) {
        state.replies.splice(index, 1, reply)
      }
    }
  },
  resetComments(state, objectType = 'ONLINE_COURSE') {
    state.comments = state.comments.filter(comment => comment.objectType !== objectType)
    state.ignoredComments = state.ignoredComments.filter(comment => comment.objectType !== objectType)
  },
  setTotal(state, total) {
    state.total = total
  },
  setCommentCount(state, count) {
    state.commentCount = count
  },
  setReplyCount(state, count) {
    state.replyCount = count
  },
  // TODO: using updateComment instead of updateTotalReplies
  updateTotalReplies(state, reply) {
    if (reply && !!reply.commentId) {
      const commentIndex = state.comments.findIndex(comment => comment.id === reply.commentId)
      if (commentIndex > -1) {
        state.comments.splice(commentIndex, 1, { ...state.comments[commentIndex], totalReplies: (state.comments[commentIndex].totalReplies || 0) + 1 })
      }
    }
  },
  setReplies(state, replies) {
    if (state.ignoredReplies.length > 0) {
      state.replies = state.replies.concat(replies.filter(reply => state.ignoredReplies.indexOf(reply.id) < 1))
    } else {
      state.replies = state.replies.concat(replies)
    }
  },
  addReply(state, reply) {
    state.replies = [reply, ...state.replies]
    state.ignoredReplies.concat(reply.id)
  },
  resetReplies(state, objectType = 'ONLINE_COURSE') {
    state.replies = state.replies.filter(reply => reply.objectType !== objectType)
    state.ignoredReplies = state.ignoredReplies.filter(reply => reply.objectType !== objectType)
  },
}

const getters = {
  comments(state) {
    return state.comments || []
  },
  total(state) {
    return state.total || 0
  },
  replies(state) {
    return state.replies
  },
  commentCount(state) {
    return state.commentCount
  },
  replyCount(state) {
    return state.replyCount
  },
}

export default {
  state,
  actions,
  mutations,
  getters,
  namespaced: true,
}