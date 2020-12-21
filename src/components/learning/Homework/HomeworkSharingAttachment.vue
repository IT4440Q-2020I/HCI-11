<template>
	<div>
    <v-slide-group v-if="isSlide" active-class="success" show-arrows>
      <v-slide-item v-for="item in attachments" :key="item.id" class="mr-4">
        <v-card color="grey lighten-3" class="homework-image rounded" @click="onDownloadFiles(item.link)">
          <v-img class="fill-height" :src="createLinkForAttachment(item.link)" />
        </v-card>
      </v-slide-item>
    </v-slide-group>
    <v-slide-group v-else active-class="success" show-arrows>
      <v-slide-item v-for="item in attachments" :key="item.id">
        <v-card color="grey lighten-3" class="homework-image rounded" @click="onDownloadFiles(item.link)">
          <v-row class="fill-height max-width d-flex justify-center align-center flex-column">
            <v-icon :style="{color: $themeData.color_primary}">mdi-link-variant</v-icon>
            <TextStyle font-type="body-2" variation="primary">{{$vuetify.lang.t('$vuetify.LEARNING.CHOOSE_TO_VIEW_FILE')}}</TextStyle>
          </v-row>
        </v-card>
      </v-slide-item>
    </v-slide-group>
	</div>
</template>
<script>
export default {
	props: {
		attachments: {
			type: Array,
			default: () => [],
		},
	},
	computed: {
		isSlide() {
			if (this.attachments.length > 0) {
				const numberOfImages = this.attachments.filter((item) => {
					if (this.$utils.isImage(item.title.split('.').pop())) return true
					return false
				}).length
				if (numberOfImages === this.attachments.length) return true
				return false
			}
			return false
    },
	},
	methods: {
    createLinkForAttachment(rootLink = '') {
      const link = rootLink.includes('http')
        ? rootLink
        : this.$utils.combineLinkWithBucket(rootLink)
      return this.$utils.convertURL(link)
    },
    openLink(link) {
      window.open(link, '_blank')
    },
    onDownloadFiles(link) {
      const fullLink = this.$utils.combineLinkWithBucket(link)
      this.openLink(fullLink)
    },
	},
}
</script>
<style lang="scss" scoped>
.homework-image {
  height: 150px;
  width: 200px;
  object-fit: cover;
}
::v-deep .v-slide-group__prev {
  position: absolute;
  left: 0;
  top: 45%;
  background-color: white;
  height: 36px;
  min-width: 24px;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  z-index: 2;
}
::v-deep .v-slide-group__next {
  position: absolute;
  right: 0;
  top: 45%;
  background-color: white;
  height: 36px;
  min-width: 24px;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  z-index: 2;
}
</style>