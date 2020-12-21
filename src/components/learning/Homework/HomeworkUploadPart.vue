<template>
	<vue-dropzone
		ref="dropzone"
		id="dropzone"
		:include-styling="false"
		v-on:vdropzone-thumbnail="thumbnail"
		:useCustomSlot="true"
		:options="dropzoneOptions"
	>
		<div class="dropzone-custom-content">
			<img
				class="image-cloud"
				src="/img/icons/cloud-computing.svg"
				alt
			/>
			<p class="subtitle">
				<span>{{$vuetify.lang.t('$vuetify.DRAG_AND_DROP_FILE_TO_UPLOAD')}}</span>
			</p>
			<div v-if="loading" style="padding: 12px 0">
				{{$vuetify.lang.t('$vuetify.UPLOAD_PROGRESS')}}: {{ percent }}%
				<BaseLoading class="mt-2" block />
			</div>
			<DecoratorButton v-if="!loading" variation="primary" solid
				>{{$vuetify.lang.t('$vuetify.UPLOAD_FILE')}}</DecoratorButton
			>
		</div>
	</vue-dropzone>
</template>
<script>
import {mapActions} from 'vuex'
import vue2Dropzone from 'vue2-dropzone'
export default {
	components: {
		vueDropzone: vue2Dropzone,
	},
	data() {
		return {
			hasError: false,
			loading: false,
			percent: 0,
			dropzoneOptions: {
				uploadMultiple: true,
				parallelUploads: 5,
				url: this.uploadFile,
				params: () => {
					return {id: 0}
				},
				previewTemplate: this.template(),
				thumbnailWidth: 150,
				maxFilesize: 30,
				addRemoveLinks: false,
				maxFiles: 5,
				acceptedFiles: 'image/*,application/pdf,.zip, .rar, application/msword',
				init: function () {
					this.on('maxfilesexceeded', function (file) {
						this.removeAllFiles()
						this.addFile(file)
					})
					this.on('error', function (file, message) {
						if (message.includes('POST') || message.includes('413')) {
							// handle POST method error and dont display
						} else {
							// if (!this.hasError) {
							//   this.hasError = true
							//   alert('Không được nộp quá 5 files !')
							// }
							this.removeAllFiles()
						}
					})
				},
			},
		}
	},
	methods: {
		...mapActions({
			uploadHomework: 'document/uploadHomework',
		}),
		template: function () {
			return `<div></div>`
		},
		thumbnail: function (file, dataUrl) {
			var j, len, ref, thumbnailElement
			if (file.previewElement) {
				file.previewElement.classList.remove('dz-file-preview')
				ref = file.previewElement.querySelectorAll('[data-dz-thumbnail-bg]')
				for (j = 0, len = ref.length; j < len; j++) {
					thumbnailElement = ref[j]
					thumbnailElement.alt = file.name
					thumbnailElement.style.backgroundImage = 'url("' + dataUrl + '")'
				}
				return setTimeout(
					(function () {
						return function () {
							return file.previewElement.classList.add('dz-image-preview')
						}
					})(this),
					1
				)
			}
		},
		progressHandler(percent) {
			this.percent = Math.floor(percent)
		},
		async uploadFile(files) {
			// if (this.hasError) {
			//   this.hasError = false
			//   return
			// }
			this.loading = true
			const promises = files.map((file) => {
				return this.uploadHomework({
					file: file,
					onProgress: ({percent}) => {
						this.progressHandler(percent)
					},
				})
			})
			const result = await Promise.all(promises)
			this.loading = false
			this.$emit('onUploadSuccess', result)
		},
	},
}
</script>
<style lang="scss" scoped>
.image-cloud {
	height: 70px;
}
#dropzone {
	position: relative;
	background-color: transparent;
	font-family: 'Arial', sans-serif;
	letter-spacing: 0.2px;
	transition: background-color 0.2s linear;
	height: 248px;
}

#dropzone .dz-preview {
	text-align: center;
}
#dropzone .dz-image {
	margin-bottom: 10px;
}
#dropzone .dz-image .preview-title {
	margin-bottom: 20px;
}
#dropzone .dz-preview .dz-details {
	transition: opacity 0.2s linear;
	text-align: center;
}
#dropzone .dz-preview .dz-details .dz-filename {
	color: #3e3e3c;
	font-size: 16px;
	margin-bottom: 10px;
}
#dropzone .dz-preview .dz-details .dz-size {
	color: #79797c;
	font-size: 14px;
	margin-bottom: 10px;
}
#dropzone .dz-success-mark,
.dz-error-mark,
.dz-remove,
.dz-error-message {
	display: none !important;
}
#dropzone.dz-started .dz-message {
	display: none;
}
#dropzone .dropzone-custom-content {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	text-align: center;
}

#dropzone .dropzone-custom-title {
	margin-top: 0;
	color: #00b782;
}

#dropzone .subtitle {
	font-size: 16px;
	line-height: 22px;
	color: #79797c;
}
</style>
