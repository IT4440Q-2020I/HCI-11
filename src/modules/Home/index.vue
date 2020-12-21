<script>
import {mapGetters, mapActions} from 'vuex'
import MainLayout from '@/templates/layout/MainLayout.vue'
export default {
	components: {
		MainLayout,
	},
	props: {
		type: {
			type: String,
			default: 'ViewData',
		},
	},
	data() {
		return {
			convertedData: [],
			path: this.type,
		}
	},

	computed: {
		...mapGetters({
			authUser: 'auth/getAuthUser',
			userPermissions: 'userPermission/getUserPermissions',
			isAuthenticated: 'auth/getAuthenticated',
			dataHomePage: 'vendor/getDataHomePage',
			getTopics: 'topic/getOnlineTopics',
			blogs: 'blog/getList',
		}),
		getViewData() {
			return this.$store.getters[`vendor/get${this.path}`]
		},
	},
	methods: {
		...mapActions({
			fetchDataForHomePage: 'vendor/fetchDataForHomePage',
			fetchUserPermissions: 'userPermission/fetchUserPermissions',
			fetchBlogs: 'blog/fetchBlogs',
		}),
		replaceIdByObjectDetail(viewHasId, viewHasDetail) {
			viewHasId.forEach((id, index) => {
				const replaceItem = viewHasDetail.find((detailItem) => {
					return detailItem.id === id || detailItem.dynamoId === id
				})
				if (replaceItem) viewHasId[index] = replaceItem
			})
		},
		setDataForHomepage(viewData) {
			const listElementQueryHomepage = this.$helpers.LIST_ELEMENT_QUERY_HOMEPAGE
			listElementQueryHomepage.forEach((element) => {
				viewData.forEach((view) => {
					if (view.element === element.name) {
						this.replaceIdByObjectDetail(
							view.props.items,
							this.dataHomePage[element.key]
						)
					}
				})
			})
		},
		inputElementIdToQuery(viewData, query) {
			const listElementQueryHomepage = this.$helpers.LIST_ELEMENT_QUERY_HOMEPAGE
			listElementQueryHomepage.forEach((element) => {
				viewData.forEach((view) => {
					if (view.element === element.name) {
						query[element.key].ids = query[element.key].ids.concat(
							view.props.items
						)
					}
				})
			})
			return query
		},
		async getDataDetails(viewData) {
			const query = this.$helpers.QUERY_HOMEPAGE
			const queryHasElementId = this.inputElementIdToQuery(viewData, query)
			await this.fetchDataForHomePage({query: queryHasElementId})
			await this.fetchBlogs({
				_skip: 0,
				_limit: 3,
				state:'PUBLIC'
			})
			this.setDataForHomepage(viewData)
			return viewData
		},
		convertPreviewImage(data) {
			let newItemList = data.props.items.map((item) => {
				return {
					...item,
					previewImage:
						item.previewImage && typeof item.previewImage === 'object'
							? this.$utils.wrapperLinkImage(item.previewImage)
							: undefined,
				}
			})
			let newData = {
				...data,
				props: {
					...data.props,
					items: newItemList,
				},
			}
			return newData
		},
		async resetPageView(viewData) {
			if (viewData) {
				const previwData = await this.getDataDetails(viewData)
				this.convertedData = await this.getDataNewDesignSystem(previwData)
			}
		},
		getChildrenTopics(topic) {
			if (topic.topic.children) {
				return topic.topic.children.map((item) => {
					return {
						...item,
						label: item.title,
						href: `/course-online?topic=${item.id}`,
					}
				})
			} else return []
		},
		getDataNewDesignSystem(convertedData) {
			return convertedData.map((data) => {
				let items = this.userPermissions
					.filter((course, index) => {
						return (
							course.type === 'online' &&
							course.status === 'published' &&
							index <= 3
						)
					})
					.map((course) => {
						const progress = Math.floor(course.progress || 0)
						return {
							...course,
							percent: progress > 100 ? 100 : progress,
						}
					})
				if (data.element === 'SectionMyCourseOnline') {
					return {
						...data,
						props: {
							...data.props,
							items: this.isAuthenticated ? items : [],
						},
					}
				} else if (data.element === 'SectionBannerImageSlider') {
					let items = data.props.items.map((item, index) => {
						return {
							image: item,
							link: data.props.hrefs[index],
						}
					})
					return {
						...data,
						props: {
							items: items,
							'full-width': true,
						},
						element: 'SectionSlideshow',
					}
				} else if (data.element === 'SectionImageDescription') {
					return {
						...data,
						props: {
							...data.props,
							backgroundImage: data.props['image-url'],
							buttonText: data.props['button-label'],
							showButton: data.props['show-button'],
							description: data.props.paragraph,
						},
						element: 'SectionHeroBanner',
					}
				} else if (data.element === 'SectionMostPopular') {
					const navigation = data.props.topics
						? data.props.topics.map((topic) => {
								let data = {}
								if (topic.topic)
									data = {
										...topic.topic,
										label: topic.topic.title,
										href: `/course-online?topic=${topic.topic.id}`,
										children: this.getChildrenTopics(topic),
									}
								if (topic.highlightItems)
									data = {...data, highlightItems: topic.highlightItems}
								return data
								// eslint-disable-next-line no-mixed-spaces-and-tabs
						  })
						: []
					return {
						...data,
						props: {
							navigation,
							sliderItems: data.props.items,
							additionalItems: data.props.items,
						},
					}
				} else if (data.element === 'SectionCourseOnline') {
					return {
						...data,
						props: {
							...data.props,
							ownedItemIds: this.isAuthenticated ? this.userPermissions.map(v=>v.id) : []
						},
						element: 'SectionOnlineCourse',
					}
				} else if (data.element === 'SectionCourseOffline') {
					return {
						...data,
						element: 'SectionOfflineCourse',
					}
				} else if (data.element === 'SectionDepartment') {
					const newData = this.convertPreviewImage(data)
					return {
						...newData,
					}
				} else if (data.element === 'SectionEventList') {
					const newData = this.convertPreviewImage(data)
					return {
						...newData,
						element: 'SectionEvent',
					}
				} else if (data.element === 'SectionEbook') {
					const newData = this.convertPreviewImage(data)
					return {
						...newData,
						element: 'SectionBook',
					}
				} else if (data.element === 'SectionSingleImageSlider') {
					let items = data.props.items.map((item, index) => {
						return {
							image: item,
							link: data.props.hrefs[index],
						}
					})
					return {
						...data,
						props: {
							items: items,
						},
						element: 'SectionSlideshow',
					}
				}
				else if (data.element === 'SectionBlog') {
					let items = this.blogs.map(item => {
						return {
							featuredImage: item.featuredImage,
							id: item.id,
							updatedAt : item.updatedAt,
							title: item.title
						}
					})
					return {
						...data,
						props: {
							...data.props,
							items: items
						},
						element: 'SectionBlog'
					}	
				}
				else if (data.element === 'SectionBannerText') {
					return {
						...data,
						props: {
							...data.props,
							description: data.props['description-text'],
							justify: data.props['text-align'],
						},
						element: 'SectionHeroBanner',
					}
				} else if (data.element === 'SectionTeacher') {
					let items = data.props.items.map((item) => {
						return {
							...item,
							avatar: item.avatar
								? this.$utils.combineLinkWithBucket(item.avatar.link)
								: '',
							title: item.fullname,
							subtitle: item.subtitle,
						}
					})
					return {
						...data,
						props: {
							...data.props,
							items: items,
						},
					}
				} else return data
			})
		},
	},
	render(createElement) {
		return this.$renderUIFromJSON.renderElement(createElement, {
			element: 'MainLayout',
			children: this.convertedData,
		})
	},
	watch: {
		isAuthenticated: {
			async handler(val) {
				if (val) {
					await this.fetchUserPermissions(this.authUser.id)
				}
				await this.resetPageView(this.getViewData)
			},
			immediate: true,
		},
		convertedData: {
			async handler(val) {
				if (val) {
					this.$forceUpdate()
				}
			},
			immediate: true,
		},
		getViewData: {
			async handler(viewData) {
				await this.resetPageView(viewData)
			},
			immediate: true,
		},
	},
}
</script>
