<template>
  <div>
		<div class="full-width">
      <TextStyle font-type="subtitle-1">{{$vuetify.lang.t('$vuetify.LEARNING.HOMEWORK.SUBMISSION')}}</TextStyle>
    </div>
		<v-row no-gutters class="mt-5">
			<v-col cols="12" sm="12" md="6" lg="4">
				<v-row no-gutters>
					<v-col cols="3" @click="openOwnedFeedback(item)" class="cursor-pointer">
						<div class="mark d-flex justify-center align-center rounded" :style="{'background-color': $themeData.color_primary}">
							<TextStyle font-type="title-2" class="mark--text font-weight-bold white--text" noMargin>{{item.mark}}</TextStyle>
						</div>
					</v-col>
					<v-col cols="9">
            <div class="d-flex mb-2 cursor-pointer" @click="openOwnedFeedback(item)">
              <TextStyle font-type="title-4" class="font-weight-bold" noMargin>
                {{$utils.fakeMarkEvaluation(item.mark)}}
              </TextStyle>
            </div>
            <div class="mb-2">
              <!-- <TextStyle font-type="body-2" noMargin>{{item.teacher}}</TextStyle> -->
              <TextStyle font-type="body-2" noMargin>{{item.notes}}</TextStyle>
            </div>
            <div>
              <HomeworkSharingReactionButton :item="item" />
              <DecoratorButton text class="px-1" @click="() => toggleCommentSection()" :class="{'toggle-button': item.canShowComment}">
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
            <CommentListWrapper ref="comment_section_owned" />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12">
        <ElementDivider class="mt-5" />
      </v-col>
		</v-row>
    <HomeworkSharingOwnedFeedbackPopup ref="owned-feedback-dialog" />
	</div>
</template>
<script>
import {mapActions, mapGetters} from 'vuex'
import HomeworkSharingOwnedFeedbackPopup from '@/components/learning/Homework/HomeworkSharingOwnedFeedbackPopup'
import HomeworkSharingAttachment from '@/components/learning/Homework/HomeworkSharingAttachment'
import CommentListWrapper from '@/components/learning/CommentListWrapper'
import HomeworkSharingReactionButton from '@/components/learning/Homework/HomeworkSharingReactionButton'
export default {
  components: {
    HomeworkSharingOwnedFeedbackPopup,
    HomeworkSharingAttachment,
    CommentListWrapper,
    HomeworkSharingReactionButton,
  },
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    ...mapGetters({
      unit: 'unit/getUnit',
    }),
  },
  methods: {
    ...mapActions({
      fetchReactions: 'reaction/fetchReactions',
    }),
    async toggleCommentSection() {
      if (this.item.canShowComment) {
        await this.$refs['comment_section_owned'].loseFocusDiscussion()
      } else {
        await this.$refs['comment_section_owned'].focusDiscussion(
          {
            objectId: this.item.id,
            objectType: 'TEACHER_FEEDBACK',
            objectName: `Nhận xét của giảng viên vào bài của ${this.item.name}`
          },
          {
            containerId: this.unit.id,
            containerType: 'COURSE_UNIT',
            containerName: this.unit.title,
          },
        )
      }
      this.item.canShowComment = !this.item.canShowComment
    },
    openOwnedFeedback() {
      this.$refs['owned-feedback-dialog'].openPopup(this.item)
    },
  },
  watch: {
    item: {
      handler(val) {
        if (val) {
          this.fetchReactions({objectId_in: val.id, objectType: 'HOMEWORK'})
        }
      },
      immediate: true,
    }
  }
}
</script>
<style lang="scss" scoped>
.mark {
	height: 64px;
	width: 64px;
}
</style>