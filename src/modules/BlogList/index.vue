<template>
	<div>
		<MainLayout :has-dark-theme="false">
			<BaseLoading v-if="loading" class="mt-3" color="primary" block />
			<div v-else>
				<BlogList :blogs="popularBlogs" />
				<BlogItem
					:totalCount="totalCount"
					:blogs="newestBlogs"
					@loadMoreBlog="loadMoreBlog"
				/>
			</div>
		</MainLayout>
	</div>
</template>

<script>
import MainLayout from '@/templates/layout/MainLayout.vue'
import {mapActions, mapGetters} from 'vuex'
export default {
	components: {
		MainLayout
	},
	data() {
		return {
			newestBlogs: [],
			popularBlogs: [],
			loading: false,
			renderComponent: false
		}
	},
	async created() {
		this.loading = true
		await this.fetchBlogs({_skip: 0, _limit: 8, state: 'PUBLIC'})
		await this.countBlogs({state: 'PUBLIC'})
		this.popularBlogs = this.blogs.slice(0, 4)
		this.newestBlogs = this.blogs.slice(4)
		this.loading = false
	},
	methods: {
		...mapActions({
			fetchBlogs: 'blog/fetchBlogs',
			countBlogs: 'blog/countBlogs'
		}),
		async loadMoreBlog() {
			this.loading = true
			await this.fetchBlogs({
				_skip: this.newestBlogs.length + 4,
				_limit: 4,
				state: 'PUBLIC'
			})
			this.newestBlogs = [...this.newestBlogs, ...this.blogs]
			this.loading = false
		}
	},
	computed: {
		...mapGetters({
			blogs: 'blog/getList',
			totalCount: 'blog/getCount'
		})
	},
	watch: {
		newestBlogs: {
			handler(val) {
				if (val) {
					this.$forceUpdate()
				}
			}
		}
	}
}
</script>
