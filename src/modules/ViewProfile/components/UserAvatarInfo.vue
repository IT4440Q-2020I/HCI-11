<template>
	<div class="pa-4">
		<div class="avatar-upload">
			<img :src="link" class="avatar-user full-width full-height" />
			<div
				v-if="!loading"
				@click="triggerInputFile"
				class="btn_change-image full-width flex-column align-items-center"
			>
				<div>
					<v-icon color="white">mdi-camera</v-icon>
				</div>
				<div class="color--white text-bold mt-1">{{$vuetify.lang.t('$vuetify.BUTTON.CHANGE_AVATAR')}}</div>
			</div>
			<div
				v-if="loading"
				class="avatar-loading text-bold full-width full-height flex-column align-items-center"
			>
				{{ percent }}%
				<ElementLoading class="mt-2" color="white" />
			</div>
		</div>
		<input
			@change="uploadAvatar"
			accept=".png, .jpg"
			style="display: none"
			ref="input-file"
			type="file"
		/>
		<div class="text-align-center email-user">
			{{ profile ? profile.email : '' }}
		</div>
	</div>
</template>
<script>
import {mapActions} from 'vuex'
export default {
	data() {
		return {
			link: this.$helpers.DEFAULT_IMAGE.avatarProfile,
			loading: false,
			percent: 0,
		}
	},
	props: {
		profile: {
			type: Object,
			default: () => {},
		},
	},
	methods: {
		...mapActions({
			uploadImage: 'document/uploadImage',
		}),
		async uploadAvatar(event) {
			this.loading = true
			const file = event.target.files[0]
			try {
				const imageFile = await this.uploadImage({
					file,
					onProgress: ({percent}) => {
						this.percent = Math.floor(percent)
					},
				})
				const urlImage = this.$utils.combineLinkWithBucket(imageFile.link)
				this.link = urlImage
			} catch (err) {
				this.$message.error(err)
			}
			this.loading = false
			this.percent = 0
		},
		triggerInputFile() {
			this.$refs['input-file'].click()
		},
		getData() {
			return this.link
		},
	},
	watch: {
		profile: {
			handler(val) {
				if (val) {
					this.link = val.avatar
						? val.avatar
						: this.$helpers.DEFAULT_IMAGE.avatarProfile
				}
			},
			immediate: true,
		},
	},
}
</script>
<style lang="scss" scoped>
.avatar-upload {
	position: relative;
	width: 160px;
	padding-top: 160px;
	border-radius: 50%;
	margin: 0 auto 16px;
	border: 1px solid gray;
	&:hover {
		.btn_change-image {
			display: flex;
		}
	}
}
.btn_change-image {
	cursor: pointer;
	display: none;
	height: 50%;
	position: absolute;
	bottom: 0;
	border-radius: 0 0 160px 160px;
	background: rgba(0, 0, 0, 0.6);
}
.avatar-user {
	object-fit: cover;
	border-radius: 50%;
	position: absolute;
	bottom: 0;
}
.avatar-loading {
	background: rgba(255, 255, 255, 0.6);
	position: absolute;
	bottom: 0;
	border-radius: 50%;
}
.email-user {
	font-size: 16px;
	// @include truncateText();
}
</style>