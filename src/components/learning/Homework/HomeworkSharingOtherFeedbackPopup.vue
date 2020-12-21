<template>
	<v-dialog v-model="dialog" persistent max-width="1100" width="80%">
    <v-card class="full-height" style="overflow: hidden;">
      <v-card-title class="pa-5">
        <div class="d-flex justify-space-between full-width">
          <div class="d-flex">
            <ElementAvatar size="medium" class="mr-2" />
            <div>
              <TextStyle font-type="title-4" class="font-weight-bold" noMargin>{{item.name}}</TextStyle>
              <TextStyle font-type="body-2" class="grey--text" noMargin>{{moment(item.date).format('DD/MM/YYYY')}}</TextStyle>
            </div>
          </div>
          <div class="title-actions">
            <DecoratorButton outlined class="mr-4 d-none d-sm-inline-flex" @click="changeFeedback">
              <ElementIcon name="arrow-left" size="small" class="mr-1" no-margin/>
              <span>{{$vuetify.lang.t('$vuetify.LEARNING.HOMEWORK.PREVIOUS')}}</span>
            </DecoratorButton>
            <DecoratorButton class="mr-8 next-homework" @click="changeFeedback(true)">
              <span>{{$vuetify.lang.t('$vuetify.LEARNING.HOMEWORK.ANOTHER')}}</span>
              <ElementIcon name="arrow-right" size="small" class="ml-1" no-margin/>
            </DecoratorButton>
            <v-icon @click="closePopup">mdi-close</v-icon>
          </div>
        </div>
        <ElementDivider class="mb-0 mt-5 full-width"/>
      </v-card-title>
      <v-card-text style="height: calc(100% - 80px);" class="pa-5 pt-0">
        <v-row class="full-height" no-gutters>
          <v-col cols="12" sm="6" md="7" lg="8">
            <v-row v-if="!isAllAttachmentsImage" dense>
              <v-col cols="3" v-for="item in attachments" :key="item.id" @click="onDownloadFiles(item.link)" class="cursor-pointer">
                <v-card color="grey lighten-3" @click="onDownloadFiles(item.link)">
                  <v-row class="fill-height max-width d-flex justify-center align-center flex-column">
                    <v-icon :style="{color: $themeData.color_primary}">mdi-link-variant</v-icon>
                    <TextStyle font-type="body-2" variation="primary">{{$vuetify.lang.t('$vuetify.LEARNING.CHOOSE_TO_VIEW_FILE')}}</TextStyle>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
            <v-row v-else-if="attachments.length > 3" no-gutters>
              <v-col cols="12" class="pb-3">
                <img class="full-width full-height rounded cursor-pointer" :src="createLinkForAttachment(attachments[0].link)" alt="homework_1" @click="openGallery(0)">
              </v-col>
              <v-col cols="4" class="pr-1">
                <img class="full-width full-height rounded cursor-pointer" :src="createLinkForAttachment(attachments[1].link)" alt="homework_2" @click="openGallery(1)">
              </v-col>
              <v-col cols="4" class="px-2">
                <img class="full-width full-height rounded cursor-pointer" :src="createLinkForAttachment(attachments[2].link)" alt="homework_3" @click="openGallery(2)">
              </v-col>
              <v-col cols="4" class="pl-1" style="position:relative;">
                <div class="view-more-image full-width full-height d-flex justify-center align-center white--text rounded" v-if="attachments.length > 4">
                  <TextStyle font-type="title-3" class="font-weight-bold white--text" noMargin>+{{attachments.length - 4}}</TextStyle>
                </div>
                <img class="full-width full-height rounded cursor-pointer" :src="createLinkForAttachment(attachments[3].link)" alt="homework_4" @click="openGallery(3)">
              </v-col>
            </v-row>
            <v-row v-else-if="attachments.length > 2">
              <v-col cols="12" class="pb-3">
                <img class="full-width full-height rounded cursor-pointer" :src="createLinkForAttachment(attachments[0].link)" alt="homework_1" @click="openGallery(0)">
              </v-col>
              <v-col cols="6" class="pr-2">
                <img class="full-width full-height rounded cursor-pointer" :src="createLinkForAttachment(attachments[1].link)" alt="homework_2" @click="openGallery(1)">
              </v-col>
              <v-col cols="6" class="pl-2">
                <img class="full-width full-height rounded cursor-pointer" :src="createLinkForAttachment(attachments[2].link)" alt="homework_3" @click="openGallery(2)">
              </v-col>
            </v-row>
            <v-row v-else-if="attachments.length > 1">
              <v-col cols="12" class="pb-2">
                <img class="full-width full-height rounded cursor-pointer" :src="createLinkForAttachment(attachments[0].link)" alt="homework_1" @click="openGallery(0)">
              </v-col>
              <v-col cols="12">
                <img class="full-width full-height rounded cursor-pointer" :src="createLinkForAttachment(attachments[1].link)" alt="homework_2" @click="openGallery(1)">
              </v-col>
            </v-row>
            <v-row v-else>
              <v-col cols="12">
                <img class="full-width full-height rounded cursor-pointer" :src="createLinkForAttachment(attachments[0].link)" alt="homework_1" @click="openGallery(0)">
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" sm="6" md="5" lg="4" class="pl-3 full-height" style="overflow: auto; overflow-x: hidden;">
            <div class="mark-detail pa-3 mb-3 rounded">
              <div class="d-flex">
                <div class="mark d-flex justify-center align-center cursor-pointer rounded" @click="showSharingOwnedFeedback(item)" :style="{'background-color': $themeData.color_primary}">
                  <TextStyle font-type="title-3" class="font-weight-bold white--text" noMargin>{{item.mark}}</TextStyle>
                </div>
                <div class="ml-3 my-auto">
                  <TextStyle font-type="body-1" noMargin>{{$utils.fakeMarkEvaluation(item.mark)}}</TextStyle>
                  <TextStyle font-type="caption-1" variation="subtext" class="cursor-pointer" @click.native="showSharingOwnedFeedback(item)" noMargin>{{$vuetify.lang.t('$vuetify.BUTTON.DETAIL')}}</TextStyle>
                </div>
              </div>
              <TextStyle class="mb-1" font-type="body-2" variation="subtext" noMargin>{{item.teacher}}</TextStyle>
              <TextStyle class="cursor-pointer" font-type="body-2" @click="showSharingOwnedFeedback(item)" variation="subtext" noMargin>{{item.teacherFeedback}}</TextStyle>
            </div>
            <ElementDivider class="ma-0"/>
            <div>
              <HomeworkSharingReactionButton :item="item" />
              <DecoratorButton text class="px-1">
                <v-icon class="subtitle-1 grey--text mr-1">mdi-message-outline</v-icon>
                <TextStyle font-type="body-2" inline noMargin>{{$vuetify.lang.t('$vuetify.LEARNING.HOMEWORK.COMMENT_BUTTON')}}</TextStyle>
              </DecoratorButton>
            </div>
            <ElementDivider />
            <ElementLoading v-show="commentLoading" />
            <CommentListWrapper v-show="!commentLoading" :canShowTotalComments="true" ref="comment_section_other_feedback" />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <HomeworkSharingGallery ref="homework-sharing-gallery" />
    <HomeworkSharingOwnedFeedbackPopup ref="detail-feedback-dialog" />
  </v-dialog>
</template>
<script>
import moment from "moment"
import HomeworkSharingGallery from '@/components/learning/Homework/HomeworkSharingGallery'
import HomeworkSharingOwnedFeedbackPopup from '@/components/learning/Homework/HomeworkSharingOwnedFeedbackPopup'
import HomeworkSharingReactionButton from '@/components/learning/Homework/HomeworkSharingReactionButton'
import CommentListWrapper from '@/components/learning/CommentListWrapper'
export default {
  components: {
    HomeworkSharingGallery,
    CommentListWrapper,
    HomeworkSharingOwnedFeedbackPopup,
    HomeworkSharingReactionButton,
  },
	data() {
		return {
      moment,
      dialog: false,
      item: {},
      attachments: [],
      commentLoading: true,
      index: -1,
		}
  },
  computed: {
    isAllAttachmentsImage() {
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
    showSharingOwnedFeedback(item) {
      this.$refs['detail-feedback-dialog'].openPopup(item)
    },
    openPopup(item, index, commentObject, commentContainer) {
      this.attachments = item.resources
      this.item = item
      this.dialog = true
      this.index = index
      setTimeout(() => {
        this.$refs['comment_section_other_feedback'].focusDiscussion(commentObject, commentContainer)
        this.commentLoading = false
      }, 2000)
    },
    closePopup() {
      this.attachments = []
      this.dialog = false
    },
    openGallery(index = 0) {
      this.$refs['homework-sharing-gallery'].openModal(this.item.attachments, index)
    },
    changeFeedback(isNext = false) {
      this.closePopup()
      this.$emit('change-feedback', isNext ? this.index + 1 : this.index - 1)
    },
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
::v-deep .v-dialog {
  max-height: 800px;
}
::v-deep .title-actions {
  .mdi-close {
    position: absolute;
    top: 16px;
    right: 24px;
  }
}
img {
  object-fit: cover;
}
.mark {
	height: 48px;
	width: 48px;
}
.mark-detail {
  background-color: #F8F7F7;
}
.view-more-image {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.4);
}
</style>
