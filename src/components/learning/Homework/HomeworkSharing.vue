<template>
	<div>
		<TextStyle font-type="subtitle-1">{{$vuetify.lang.t('$vuetify.LEARNING.HOMEWORK.REFER_TO_OTHERS')}}</TextStyle>
		<v-row no-gutters v-for="(item, i) in displayedHomeworks" :key="item.id" class="mt-5">
			<v-col cols="12" sm="12" md="6" lg="4">
				<v-row no-gutters>
					<v-col cols="2" @click="openOtherFeedback(item, i)" class="cursor-pointer">
						<div class="mark d-flex justify-center align-center rounded" @click="openOtherFeedback(item, i)" :style="{'border': `1px solid ${$themeData.color_primary}`}">
							<TextStyle font-type="title-3" variation="primary" class="mark--text font-weight-bold" noMargin>{{item.mark}}</TextStyle>
						</div>
					</v-col>
					<v-col cols="10">
            <div class="d-flex mb-2 cursor-pointer" @click="openOtherFeedback(item, i)">
              <ElementAvatar size="small" class="mr-2" />
              <TextStyle font-type="title-4" class="font-weight-bold" noMargin>{{item.name}}</TextStyle>
            </div>
            <div class="mb-1">
              <TextStyle font-type="subtitle-1" class="font-weight-bold grey--text" noMargin>{{$utils.fakeMarkEvaluation(item.mark)}}</TextStyle>
            </div>
            <div class="mb-2">
              <!-- <TextStyle font-type="body-2" noMargin>{{item.teacher}}</TextStyle> -->
              <TextStyle font-type="body-2" noMargin>{{item.notes}}</TextStyle>
            </div>
            <div>
              <HomeworkSharingReactionButton :item="item" />
              <DecoratorButton text class="px-1" @click="() => toggleCommentSection(item.id)" :class="{'toggle-button': item.canShowComment}">
                <v-icon class="subtitle-1 grey--text mr-1">mdi-message-outline</v-icon>
                <TextStyle font-type="body-2" inline noMargin>{{$vuetify.lang.t('$vuetify.LEARNING.HOMEWORK.COMMENT_BUTTON')}}</TextStyle>
              </DecoratorButton>
            </div>
					</v-col>
				</v-row>
			</v-col>
			<v-col cols="12" sm="12" md="6" lg="8" class="pl-2">
				<HomeworkSharingAttachment :attachments="item.resources" />
			</v-col>
      <v-col cols="12" v-show="item.canShowComment">
        <v-row no-gutters>
          <v-col cols="12" sm="12" md="6" lg="4"></v-col>
          <v-col cols="12" sm="12" md="6" lg="8" class="pl-2">
            <CommentListWrapper :ref="`comment_section_${item.id}`" />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12">
        <ElementDivider class="mt-5" />
      </v-col>
		</v-row>
    <div v-if="homeworks.length < homeworkCount" class="d-flex justify-center py-6">
      <DecoratorButton @click="fetchMoreHomeworks" text>
        <TextStyle font-type="body-2" variation="primary" inline noMargin>{{$vuetify.lang.t('$vuetify.LEARNING.HOMEWORK.UPLOAD_MORE_FILES')}}</TextStyle>
        <v-icon class="ml-1">mdi-arrow-down</v-icon>
      </DecoratorButton>
    </div>
    <HomeworkSharingOtherFeedbackPopup ref="other-feedback-dialog" @change-feedback="changeFeedback" />
	</div>
</template>
<script>
import {mapActions, mapGetters, mapMutations} from 'vuex'
import get from 'lodash-es/get'
import HomeworkSharingOtherFeedbackPopup from '@/components/learning/Homework/HomeworkSharingOtherFeedbackPopup'
import HomeworkSharingAttachment from '@/components/learning/Homework/HomeworkSharingAttachment'
import HomeworkSharingReactionButton from '@/components/learning/Homework/HomeworkSharingReactionButton'
import CommentListWrapper from '@/components/learning/CommentListWrapper'
export default {
  components: {
    HomeworkSharingOtherFeedbackPopup,
    HomeworkSharingAttachment,
    CommentListWrapper,
    HomeworkSharingReactionButton,
  },
	data() {
		return {
      pageNumber: 0,
		}
  },
  async mounted() {
   await this.fetchMoreHomeworks()
   await this.fetchHomeworkCount({
     unit: this.unit.id,
     state: 'approved',
   })
  },
  computed: {
    ...mapGetters({
      homeworks: 'homework/getSharedHomeworks',
      homeworkCount: 'homework/getCount',
      unit: 'unit/getUnit',
      userInfo: 'auth/getAuthUser',
    }),
    displayedHomeworks() {
      return this.homeworks
        .map(homework => {
          let attachments = []
          if (homework.resources) {
            attachments = homework.resources.map(res => {
              return this.createLinkForAttachment(get(res, 'origin.link'))
            })
          }
          return {
            ...homework,
            attachments,
          }
        })
        .sort((a, b) => b.mark - a.mark)
    },
    commentContainer() {
      return {
        containerId: this.unit.id,
        containerType: 'COURSE_UNIT',
        containerName: this.unit.title,
      }
    },
  },
  methods: {
    ...mapActions({
      fetchSharedHomeworks: 'homework/fetchSharedHomeworks',
      fetchHomeworkCount: 'homework/fetchCount',
      fetchReactions: 'reaction/fetchReactions',
    }),
    ...mapMutations({
      toggleComment: 'homework/toggleCommentOfSharedHomework',
    }),
    openOtherFeedback(item, index) {
      const commentObject = {
        objectId: item.id,
        objectType: 'TEACHER_FEEDBACK',
        objectName: `Nhận xét của giảng viên vào bài của ${item.name}`
      }
      this.$refs['other-feedback-dialog'].openPopup(item, index, commentObject, this.commentContainer)
    },
    async fetchMoreHomeworks() {
      const _limit = (this.pageNumber + 3)
      try {
        await this.fetchSharedHomeworks({
          _limit,
          _skip: 0,
          unit: this.unit.id,
          state: 'approved',
        })
        this.pageNumber += 3
      } catch (error) {
        this.$message.error(this.$vuetify.lang.t('$vuetify.MESSAGES.SYSTEM_ERROR'))
      }
    },
    createLinkForAttachment(rootLink = '') {
      const link = rootLink.includes('http')
        ? rootLink
        : this.$utils.combineLinkWithBucket(rootLink)
      return this.$utils.convertURL(link)
    },
    async toggleCommentSection(id) {
      const currentHomework = this.homeworks.filter(homework => homework.id === id)[0]
      if (currentHomework.canShowComment) {
        await this.$refs[`comment_section_${id}`][0].loseFocusDiscussion()
      } else {
        await this.$refs[`comment_section_${id}`][0].focusDiscussion(
          {
            objectId: currentHomework.id,
            objectType: 'TEACHER_FEEDBACK',
            objectName: `Nhận xét của giảng viên vào bài của ${currentHomework.name}`
          },
          this.commentContainer,
        )
      }
      this.toggleComment(id)
    },
    changeFeedback(index) {
      if (index < 0) index = this.displayedHomeworks.length - 1
      else if (index >= this.displayedHomeworks.length) index = 0
      this.openOtherFeedback(this.displayedHomeworks[index], index)
    },
  },
  watch: {
    homeworks: {
      async handler(val, oldVal) {
        if (val && val.length > 0 && oldVal && val.length > oldVal.length) {
          await this.fetchReactions({objectId_in: val.map(v => v.id), objectType: 'HOMEWORK'})
        }
      },
      immediate: true,
    }
  }
}
</script>
<style lang="scss" scoped>
.mark {
	height: 48px;
	width: 48px;
}
</style>