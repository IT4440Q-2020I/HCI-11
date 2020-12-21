<template>
	<div>
		<div class="certificate">
			<div class="certificate-preview full-width full-height bg-white">
				<div
					v-if="loading"
					class="full-width full-height flex-column align-items-center"
				>
					<v-progress-circular
						:rotate="-90"
						:size="48"
						:value="percent"
						:width="5"
						color="#0084FF"
						class="mb-2"
					/>
					<TextStyle font-type="subtitle-2">{{$vuetify.lang.t('$vuetify.MESSAGES.LOADING')}}</TextStyle>
				</div>
				<div class="full-height align-items-center" v-if="errorMessage">
					{{ errorMessage }}
				</div>
				<div v-if="pdfDoc" class="full-width d-flex">
					<canvas class="pdf-canvas full-width" ref="pdf-canvas"></canvas>
				</div>
			</div>
		</div>
		<div v-if="pdfDoc" class="btn-download align-items-center">
			<DecoratorButton
				outlined
				@click="
					() => {
						$emit('onDownload')
					}
				"
				>{{$vuetify.lang.t('$vuetify.DOWNLOAD_PDF_FILE')}}
				<v-icon size="18">mdi-download</v-icon>
			</DecoratorButton>
		</div>
	</div>
</template>
<script>
/*eslint-disable */
import clamp from 'lodash-es/clamp'
import pdfjs from 'pdfjs-dist/build/pdf'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry'
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker
export default {
	data() {
		return {
			sourceLink: '',
			errorMessage: null,
			loading: true,
			linkInProgress: null,
			linkInQueue: null,
			pdfDoc: null,
			percent: 0,
		}
	},
	props: {
		pdfLink: {
			type: String,
			required: true,
		},
	},
	methods: {
		async loadPdf(link) {
			const getLinkFromServerWithoutCache = this.$utils.getLinkWithoutCache(
				link
			)
			let loadPDF = pdfjs.getDocument(getLinkFromServerWithoutCache)
			loadPDF.onProgress = ({loaded, total}) => {
				this.percent = Math.round((loaded / total) * 100)
			}
			let doc = await loadPDF.promise
			this.pdfDoc = doc
			this.loading = false
		},
		reset() {
			this.pdfDoc = null
			this.loading = false
		},
		async showPage() {
			if (!this.pdfDoc) {
				return
			}
			try {
				let page = await this.pdfDoc.getPage(1)
				let viewport = page.getViewport({scale: 2})
				let canvas = this.$refs['pdf-canvas']
				if (!canvas) return
				let canvasContext = canvas.getContext('2d')
				let renderContext = {
					canvasContext,
					viewport,
				}
				canvas.width = viewport.width
				canvas.height = viewport.height
				await page.render(renderContext).promise
			} catch (err) {
				this.$message.error(err)
			}
		},
	},
	watch: {
		pdfLink: {
			async handler(link) {
				if (!link) {
					this.errorMessage = this.$vuetify.lang.t('$vuetify.MESSAGES.CANNOT_FIND_PDF_TRY_AGAIN')
					this.reset()
				} else {
					this.pdfDoc = null
					this.loading = true
					this.errorMessage = ''
					if (link !== this.sourceLink) {
						this.sourceLink = link
						await this.loadPdf(link)
						this.showPage()
					}
				}
			},
			immediate: true,
		},
	},
}
</script>
<style lang="scss" scoped>
.certificate {
	position: relative;
	padding-top: 70.7%;
	.certificate-preview {
		overflow: hidden;
		position: absolute;
		top: 0;
		left: 0;
		border-radius: 4px;
		border: 1px solid #F2F0F1;
	}
}
.btn-download {
	margin: 16px 0;
	i {
		margin-left: 4px;
	}
}
</style>