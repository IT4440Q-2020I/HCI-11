import {RepositoryFactory} from '@/api/factory/repositoryFactory'
const Blog = RepositoryFactory.get('blog')
const namespaced = true

const state = {
	blog: {},
	blogs: [],
	count: 0
}

const actions = {
	async createBlog({commit}, data) {
		const blog = await Blog.create(data)
		commit('addBlog', blog.data)
		return blog.data
	},
	async fetchBlogs({commit}, params = {}) {
		const res = await Blog.fetch({
			...params
		})
		commit('setBlogs', res.data || [])
		return res.data
	},
	async fetchBlog({commit}, id) {
		const blog = await Blog.fetchOne(id)
		commit('setBlogData', blog.data)
		return blog.data
	},
	async countBlogs({commit}, params = {}) {
		const res = await Blog.count({...params})
		commit('setCount', res.data || 0)
	},
	async updateBlog({commit}, {id, ...blog}) {
		const res = await Blog.update(id, blog)
		commit('setBlogData', res.data)
		return res.data
	},
	async removeBlog({commit}, item) {
		const res = await Blog.remove(item.id)
		commit('removeBlog', item.id)
		return res.data
	},
	async setBlog({commit}, blog) {
		return commit('setBlogData', blog)
	}
}

const mutations = {
	setCount(state, count) {
		return (state.count = count)
	},
	addBlog(state, blog) {
		state.count = state.count + 1
		state.blogs.push(blog)
	},
	setBlogData(state, blog) {
		return (state.blog = blog)
	},
	setBlogs(state, blogs) {
		return (state.blogs = blogs)
	},
	removeBlog(state, id) {
		state.blogs = state.blogs.filter(blog => blog.id !== id)
		state.blog = {}
	}
}

const getters = {
	getList: state => {
		return state.blogs
	},
	getCount: state => {
		return state.count
	},
	getOne: state => {
		return state.blog
	}
}

export default {
	namespaced,
	state,
	actions,
	mutations,
	getters
}
