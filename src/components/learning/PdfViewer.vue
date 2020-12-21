<template>
	<div
		class="pdf-container full-width pt-4 px-4 d-flex flex-column align-center"
	>
		<div
			class="pdf-loading full-width flex-column align-items-center"
			v-if="loading"
		>
			<v-progress-circular
				:rotate="-90"
				:size="48"
				:value="percent"
				:width="5"
				color="#0084FF"
				class="mb-2"
			/>
			<TextStyle font-type="subtitle-2">Đang tải...</TextStyle>
		</div>
		<div class="pdf-error" v-if="errorMessage">{{ errorMessage }}</div>
		<div class="pdf-control-bar" v-if="pdfDoc">
			<button @click="prev">
				<v-icon>mdi-chevron-left</v-icon>
			</button>
			<button @click="next">
				<v-icon>mdi-chevron-right</v-icon>
			</button>
			<button @click="zoomIn">
				<v-icon size="20">mdi-magnify-plus-outline</v-icon>
			</button>
			<button @click="zoomOut">
				<v-icon size="20">mdi-magnify-minus-outline</v-icon>
			</button>
		</div>
		<div v-if="pdfDoc" class="canvas-wrapper full-width full-height d-flex">
			<div class="wrapper-canvas-scroll ma-auto">
				<canvas class="pdf-canvas" ref="pdf-canvas"></canvas>
			</div>
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
			rendering: false,
			linkInProgress: null,
			linkInQueue: null,
			pdfDoc: null,
			totalPage: 0,
			currentPage: 0,
			pendingPage: 0,
			currentScale: 2,
			scaleStep: 0.25,
			minScale: 0.25,
			maxScale: 5,
			percent: 0,
		}
	},
	created() {
		if (this.ebookPdf) {
			this.currentScale = 1.5
		}
	},
	props: {
		pdfLink: {
			type: String,
			required: true,
		},
		ebookPdf: {
			type: Boolean,
			default: false,
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
			this.totalPage = doc.numPages
			this.loading = false
		},
		reset() {
			this.pdfDoc = null
			this.totalPage = 0
			this.loading = false
		},
		next() {
			return this.showPage(this.currentPage + 1)
		},
		prev() {
			return this.showPage(this.currentPage - 1)
		},
		zoomIn() {
			return this.showPage(this.currentPage, this.currentScale + this.scaleStep)
		},
		zoomOut() {
			return this.showPage(this.currentPage, this.currentScale - this.scaleStep)
		},
		async showPage(pageNum = this.currentPage, scale = this.currentScale) {
			pageNum = clamp(pageNum, 1, this.totalPage)
			scale = clamp(scale, this.minScale, this.maxScale)
			if (!this.pdfDoc) {
				return
			}
			if (
				pageNum !== 1 &&
				pageNum === this.currentPage &&
				scale === this.currentScale
			) {
				return
			}
			if (this.rendering) {
				this.pendingPage = pageNum
				return
			}
			try {
				this.rendering = true
				let page = await this.pdfDoc.getPage(pageNum)
				let viewport = page.getViewport({scale})
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
				this.currentPage = pageNum
				this.currentScale = scale
			} catch (err) {
				this.$message.error(err)
			} finally {
				this.rendering = false
			}

			if (this.pendingPage) {
				let pendingPage = this.pendingPage
				this.pendingPage = 0
				return this.showPage(pendingPage)
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
						let sourceLink = this.$utils.convertURL(this.pdfLink)
						this.sourceLink = sourceLink
						await this.loadPdf(link)
						this.showPage(1)
					}
				}
			},
			immediate: true,
		},
	},
}
</script>
<style lang="scss" scoped>
.pdf-container {
	height: calc(100vh - 150px) !important;
	.pdf-control-bar {
		line-height: 25px;
		button {
			width: 25px;
			height: 25px;
			outline: none;
			background: #ffffff;
			&:hover {
				background: #f2f2f2;
			}
		}
	}
	.canvas-wrapper {
		background: #f8f8f8;
		max-width: 100%;
		height: calc(100% - 16px - 24px) !important;
		overflow: auto;
		canvas {
			border: 1px solid #f2f2f2;
		}
	}
	.pdf-loading {
		background: #f8f8f8;
		border: 1px solid #f2f0f1;
		height: 100vh;
	}
}
</style>
