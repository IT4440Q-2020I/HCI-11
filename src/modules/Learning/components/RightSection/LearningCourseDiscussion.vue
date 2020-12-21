<template>
  <CommentList
    @create="onCreateComment"
    @reply="onCreateReply"
    @fetchReplies="onFetchReplies"
    @update="onUpdate"
    @like="onLikeComment"
    @unlike="onUnlikeComment"
    :replies="displayedReplies"
    :defaultAvatar="defaultAvatar"
    :comments="displayedComments"
    :currentUserId="userProfile ? userProfile.id : ''"
    :currentUserAvatar="userProfile ? userProfile.avatar : defaultAvatar"
    :maxDisplayedCharLength="contentTruncatedLimit"
  >
    <template slot="comment-load-more-button">
      <DecoratorButton v-if="canShowLoadmore" @click="fetchMoreComments" text>{{
        $vuetify.lang.t('$vuetify.BUTTON.VIEW_MORE')
      }}</DecoratorButton>
    </template>
  </CommentList>
</template>
<script>
import {mapGetters, mapActions, mapMutations} from 'vuex'
import helpers from '@/helpers'
const {countTypeEnums} = helpers.commentEnums
const defaultAvatar = helpers.DEFAULT_IMAGE.avatar
const COMMENT_LIMIT = 3
export default {
  props: {
    props: Object,
    currentLesson: Object,
    currentCourse: Object,
  },
  data() {
    return {
      defaultAvatar,
      filter: {
        objectType: 'ONLINE_COURSE',
        containerType: 'COURSE_UNIT',
        objectId: this.$route.params.courseId,
        containerId: this.$route.params.unitId,
      },
      commentSkip: 0,
      contentTruncatedLimit: 150,
    }
  },
  async mounted() {
    await this.refreshData()
  },
  computed: {
    ...mapGetters({
      comments: 'comment/comments',
      replies: 'comment/replies',
      totalComment: 'comment/commentCount',
      userProfile: 'auth/getAuthUser',
    }),
    displayedComments() {
      if (this.comments && this.comments.length > 0) {
        return this.comments
          .filter(
            (comment) =>
              comment.containerId === this.filter.containerId &&
              comment.objectId === this.filter.objectId
          )
          .map((comment) => {
            return {
              ...comment,
              userDisplayName:
                comment.userName || this.$vuetify.lang.t('$vuetify.ANONYMOUS'),
              createdAt: new Date(comment.createdAt).getTime(),
              avatar: comment.userAvatarLink || this.defaultAvatar,
              likeCount: comment.totalReaction_LOVE,
            }
          })
      }
      return []
    },
    displayedReplies() {
      if (this.replies && this.replies.length > 0) {
        return this.replies.map((reply) => {
          return {
            ...reply,
            userDisplayName:
              reply.userName || this.$vuetify.lang.t('$vuetify.ANONYMOUS'),
            createdAt: new Date(reply.createdAt).getTime(),
            avatar: reply.userAvatarLink || this.defaultAvatar,
            likeCount: reply.totalReaction_LOVE,
          }
        })
      }
      return []
    },
    canShowLoadmore() {
      return (
        this.comments &&
        this.comments.length > 0 &&
        this.comments.length < this.totalComment
      )
    },
  },
  methods: {
    ...mapActions({
      fetchComments: 'comment/fetchComments',
      fetchRepliesOfComment: 'comment/fetchRepliesOfComment',
      fetchCount: 'comment/fetchCount',
      createComment: 'comment/createComment',
      updateComment: 'comment/updateComment',
      createReaction: 'reaction/createReaction',
      removeMineReaction: 'reaction/removeMineReaction',
    }),
    ...mapMutations({
      resetComments: 'comment/resetComments',
      resetReplies: 'comment/resetReplies',
      resetReactions: 'reaction/resetReactions',
    }),
    hasCourseAndLesson(lesson, course) {
      if (!lesson || !lesson.id || !course || !course.id) return false
      return true
    },
    async onCreateComment({content, callback}) {
      await this.onSendComment({content, type: 'comment'}, {callback})
    },
    async onCreateReply({content, rootCommentId, callback}) {
      await this.onSendComment(
        {content, commentId: rootCommentId, type: 'reply'},
        {callback}
      )
    },
    async onUpdate({id, content, type, callback}) {
      await this.onSendComment(
        {id, content, type},
        {callback, actionName: 'updateComment'}
      )
    },
    async onSendComment(extendedCreateObject = {}, {callback, actionName}) {
      const lesson = this.currentLesson
      const course = this.currentCourse
      if (!this.hasCourseAndLesson(lesson, course)) return
      this.$message.warning(
        this.$vuetify.lang.t('$vuetify.MESSAGES.COMMENT_RECEIVED_LOADING')
      )
      try {
        const status = this.checkMustApproveComment(lesson, course)
          ? 'unpublish'
          : 'publish'
        const baseCreateObject = {
          containerId: lesson.id,
          containerType: 'COURSE_UNIT',
          containerName: lesson.title,
          objectId: course.id,
          objectType: 'ONLINE_COURSE',
          objectName: course.title,
          status,
          addToList: status === 'publish',
        }
        await this[actionName || 'createComment']({
          ...baseCreateObject,
          ...extendedCreateObject,
        })
        if (status === 'unpublish') {
          this.$message.success(
            this.$vuetify.lang.t(
              '$vuetify.MESSAGES.COMMENT_RECEIVED_AND_WAIT_CHECKING'
            )
          )
        } else {
          this.$message.success(
            this.$vuetify.lang.t('$vuetify.MESSAGES.COMMENT_RECEIVED')
          )
        }
        callback && callback()
      } catch (e) {
        this.$message.error(
          this.$vuetify.lang.t(
            '$vuetify.MESSAGES.COMMENT_RECEIVED_FAIL_AND_TRY_AGAIN'
          )
        )
        // eslint-disable-next-line no-console
        console.error('onCreateComment execption:', e)
      }
    },
    async fetchMoreComments() {
      const _skip = this.commentSkip * COMMENT_LIMIT
      if (_skip < this.totalComment) {
        try {
          await this.fetchComments({
            ...this.filter,
            type: 'comment',
            _limit: COMMENT_LIMIT,
            _skip,
          })
          this.commentSkip += 1
        } catch (error) {
          this.$message.error(error)
        }
      }
    },
    async refreshData() {
      await this.resetComments()
      await this.resetReplies()
      await this.resetReactions()
      await this.fetchCount({
        ...this.filter,
        type: 'comment',
        countType: countTypeEnums.COMMENT,
      })
      await this.fetchMoreComments()
    },
    async onFetchReplies({type, commentId, callback}) {
      try {
        await this.fetchRepliesOfComment({type, commentId})
        callback && callback()
      } catch (error) {
        this.$message.error(error)
      }
    },
    checkMustApproveComment(lesson, course) {
      if (lesson.data && typeof lesson.data.mustApproveDiscussion === 'boolean')
        return lesson.data.mustApproveDiscussion
      if (course.data && typeof course.data.mustApproveDiscussion === 'boolean')
        return course.data.mustApproveDiscussion
      return true
    },
    async onLikeComment({commentId, callback}) {
      try {
        await this.createReaction({
          objectId: commentId,
          objectType: 'COMMENT',
          type: 'LOVE',
          status: true,
        })
        callback && callback()
      } catch (error) {
        this.$message.error(error)
      }
    },
    async onUnlikeComment({commentId, userId, callback}) {
      try {
        await this.removeMineReaction({
          objectId: commentId,
          objectType: 'COMMENT',
          type: 'LOVE',
          status: false,
          userId,
        })
        callback && callback()
      } catch (error) {
        this.$message.error(error)
      }
    },
  },
  watch: {
    currentLesson: {
      async handler(val, oldVal) {
        if (val && oldVal && val.id !== oldVal.id) {
          this.filter.containerId = val.id
          this.commentSkip = 0
          await this.refreshData()
        }
      },
      immediate: true,
    },
  },
}
</script>
