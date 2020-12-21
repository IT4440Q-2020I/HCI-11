<template>
	<MainLayout
		:dark="hasDarkTheme"
		@onRedirectToHomepage="onRedirectToHomepage"
		@onRedirect="(path) => handlerPath(path)"
		@onRequestCall="(phone) => onRequestCall(phone)"
		@onRequestSendMail="(email) => onRequestSendMail(email)"
		@onRequestSignUp="openAuthenticationForm('register')"
		@onRequestSignIn="openAuthenticationForm('login')"
		@onRequestSignOut="onRequestSignOut"
		@onUpdateSearchKeyword="
			(searchString) => onUpdateSearchKeyword(searchString)
		"
		@onRequestChangePassword="openAuthenticationForm('changePassword')"
		:isDisplayMarketHeader="isDisplayMarketHeader"
		:header-nav="headerNav"
		:isAuthenticated="authenticated"
		:cartItemCount="cartItemCount"
		:keywordMinCharCount="3"
		:recentNotis="authenticated ? notifications : baitNotifications"
		:unreadNotiCount="authenticated ? 99 : baitNotifications.length"
		:searchResult="searchResult"
		:user-profile="authUser"
		:contact-info="{
			phone: contactInfo ? contactInfo.hotline : '',
			email: contactInfo ? contactInfo.email : '',
			address: contactInfo ? contactInfo.address : '',
		}"
		:educationContentNav="educationContentNav"
		:introductionContentNav="introductionContentNav"
		:userProfileIsEditable="userProfileIsEditable"
	>
		<Popup ref="interest-popup">
			<InterestForm
				@post="(selected) => onSaveInterest(selected)"
				:options="getInterestTopic"
			/>
		</Popup>
		<div style="min-height: 900px">
			<slot />
		</div>
	</MainLayout>
</template>
<script>
import debounce from 'lodash-es/debounce'
import {mapActions, mapGetters} from 'vuex'
export default {
	data() {
		return {
			searchResult: [],
		}
	},
	async created() {
		await this.fetchOnlineTopics()
	},
	props: {
		hasDarkTheme: {
			type: Boolean,
			default: true,
		},
	},
	computed: {
		...mapGetters({
			getInterestTopic: 'topic/getInterestTopic',
			getTopics: 'topic/getOnlineTopics',
			authenticated: 'auth/getAuthenticated',
			authUser: 'auth/getAuthUser',
			contactInfo: 'vendor/getContact',
			cartItemCount: 'cart/getCartItemCount',
			getHeaderNav: 'vendor/getHeaderNav',
			getFooterItem: 'vendor/getFooterItem',
			isDisplayMarketHeader: 'vendor/getHeaderSetting',
			userProfileIsEditable: 'vendor/getDisplayProfile',
			notifications: 'notification/getNotifications',
			baitNotifications: 'notification/getBaitNotifications',
		}),
		headerNav() {
			let children = []
			let filterResult = []
			if (!this.isDisplayMarketHeader) {
				filterResult = this.$helpers.MENU_HEADER_HOMEPAGE.filter((item) => {
					if (this.getHeaderNav) {
						return this.getHeaderNav.indexOf(item.name) >= 0
					}
				}).map(item => {
					return {
						...item,
						label: this.$vuetify.lang.t(item.label),
						children: item.children.map(c => ({...c, label: this.$vuetify.lang.t(c.label)}))
					}
				})
			}
			if (this.getTopics) {
				let parentTopics = this.getTopics.filter(v=>!v.parentId)
				parentTopics.forEach((topic) => {
					children.push({
						label: topic.title,
						href: `/course-online?topic=${topic.id}`,
					})
				})
			}
			return [
				{
					label: this.$vuetify.lang.t("$vuetify.CATEGORY"),
					icon: 'hambuger_menu',
					hideMenuArrow: true,
					children: children,
				},
				...filterResult,
			]
		},
		isDisplaySearchBar() {
			if (
				this.getHeaderNav &&
				this.getHeaderNav.find((v) => v === 'searchBar')
			) {
				return true
			}
			return false
		},
		educationContentNav() {
			let filterResult = this.$helpers.FOOTER_EDUCATON_CONTENT.filter(
				(item) => {
					if (this.getFooterItem) {
						return this.getFooterItem.indexOf(item.name) >= 0
					}
				}
			).map(item => ({...item, label: this.$vuetify.lang.t(item.label)}))
			return filterResult
		},
		introductionContentNav() {
			let filterResult = this.$helpers.FOOTER_INTRO_CONTENT.filter((item) => {
				if (this.getFooterItem) {
					return this.getFooterItem.indexOf(item.name) >= 0
				}
			}).map(item => ({...item, label: this.$vuetify.lang.t(item.label)}))
			return filterResult
		},
	},
	methods: {
		...mapActions({
			signOut: 'auth/signOut',
			searchKeywords: 'onlineCourse/searchGlobal',
			fetchOnlineTopics: 'topic/fetchOnlineTopics',
			addMultipleInterest: 'interest/addMultipleInterest',
		}),
		async onSaveInterest(interests) {
			try {
				await this.addMultipleInterest({
					userId: this.authUser.id,
					dataType: 'topic',
					topicIds: interests,
				})
				window.localStorage.removeItem('is-seen-interest-popup')
				this.$refs['interest-popup'].closePopup()
				this.$router.push('/')
			} catch (error) {
				this.$message.error(error)
			}
		},
		async handlerPath(path) {
			if (this.$route.fullPath === path) {
				if (path.indexOf('/course-online?topic=') >= 0) {
					this.$emit('scrollToFilter')
				} else return
			} else {
				this.$router.push(path)
			}
		},
		onRequestSignOut() {
			this.signOut()
		},
		async onRequestSearch(searchString) {
			if (searchString) {
				const result = await this.searchKeywords({
					keyword: searchString,
					indexType: 'index',
					limit: 5,
				})
				this.searchResult = result.map((item) => {
					return {
						...item,
						_id: item.originId,
					}
				})
			}
		},
		debounce: debounce(function (searchString) {
			this.onRequestSearch(searchString)
		}, 1000),
		onUpdateSearchKeyword(searchString) {
			this.debounce(searchString)
		},
		openAuthenticationForm(state) {
			this.$authPopup.show(state)
		},
		onRequestCall(phone) {
			window.open(`tel:${phone}`)
		},
		onRequestSendMail(email) {
			window.open(`mailto:${email}`)
		},
		onRedirectToHomepage() {
			if (this.$route.path !== '/') this.$router.push('/')
		},
	},
	watch: {
		authUser: {
			handler(authUser) {
				let data = JSON.parse(localStorage.getItem('is-seen-interest-popup'))
				if (data && authUser) this.$refs['interest-popup'].openPopup()
			},
			immediate: true,
		},
	},
}
</script>