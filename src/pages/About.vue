<template>
	<div class="about">
		<h1>
			{{ authenticated ? `Welcome ${authUser.name}` : 'Are you login ?' }}
		</h1>
		<v-row style="display: flex; justify-content: center">
			<v-col cols="12" sm="6" md="3">
				<v-text-field
					v-model="email"
					label="Email"
					placeholder="Email"
					outlined
				></v-text-field>
				<v-text-field
					v-model="password"
					label="Password"
					placeholder="Password"
					type="password"
					outlined
				></v-text-field>
				<v-text-field
					v-model="searchString"
					label="Search String"
					placeholder="Search String"
					outlined
				></v-text-field>
			</v-col>
		</v-row>
		<v-file-input
			v-model="files"
			@change="onChange"
			color="deep-purple accent-4"
			counter
			label="File input"
			multiple
			placeholder="Select your files"
			prepend-icon="mdi-paperclip"
			outlined
			:show-size="1000"
		>
			<template v-slot:selection="{index, text}">
				<v-chip v-if="index < 2" color="deep-purple accent-4" dark label small>
					{{ text }}
				</v-chip>
				<span
					v-else-if="index === 2"
					class="overline grey--text text--darken-3 mx-2"
				>
					+{{ files.length - 2 }} File(s)
				</span>
			</template>
		</v-file-input>
		<v-btn class="mr-3" @click="logIn">Log in</v-btn>
		<v-btn class="mr-3" @click="logOut">Log out</v-btn>
		<v-btn v-if="authenticated" @click="refresh">Refresh token</v-btn>
		<v-btn @click="$message.loading('lodaing...')">Loading</v-btn>
	</div>
</template>
<script>
import debounce from 'lodash-es/debounce'
import {mapActions, mapGetters} from 'vuex'
export default {
	data() {
		return {
			email: '',
			password: '',
			files: [],
			searchString: '',
		}
	},
	methods: {
		...mapActions({
			signIn: 'auth/signIn',
			signOut: 'auth/signOut',
			refreshToken: 'auth/refreshToken',
			uploadHomework: 'document/uploadHomework',
			searchKeywords: 'onlineCourse/searchGlobal',
		}),
		async logIn() {
			try {
				await this.signIn({
					email: this.email,
					password: this.password,
				})
				this.$message.success('Đăng nhập thành công !')
			} catch (error) {
				this.$message.error(error)
			}
		},
		async onChange(files) {
			const promises = files.map((file) => {
				return this.uploadHomework({
					file: file,
					onProgress: ({percent}) => {
						console.log('percent', percent)
					},
				})
			})
			const result = await Promise.all(promises)
			console.log('result', result)
		},
		async logOut() {
			try {
				await this.signOut()
				this.$message.success('Đăng xuất thành công !')
			} catch (error) {
				this.$message.error(error)
			}
		},
		async refresh() {
			try {
				await this.refreshToken(this.authUser)
				this.$message.success('Lấy lại token thành công !')
			} catch (error) {
				this.$message.error(error)
			}
		},
		async searchGlobal() {
			if (this.searchString) {
				const result = await this.searchKeywords({
					keyword: this.searchString,
					indexType: 'index',
					limit: 5,
				})
				const data = result.map((item) => {
					return {
						id: item._id,
						type: item.originType,
						title: item.title,
					}
				})
				console.log('result', data)
			}
		},
		debounce: debounce(function () {
			this.searchGlobal()
		}, 1000),
	},
	computed: {
		...mapGetters({
			authUser: 'auth/getAuthUser',
			authenticated: 'auth/getAuthenticated',
		}),
	},
	watch: {
		searchString: {
			handler() {
				this.debounce()
			},
			immediate: true,
		},
	},
}
</script>
