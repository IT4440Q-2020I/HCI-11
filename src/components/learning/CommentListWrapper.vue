<template>
	<div>
		<div v-if="canShowTotalComments" class="full-width">
			<TextStyle font-type="subtitle-2" class="font-weight-medium" noMargin>{{
				$vuetify.lang.t(
					'$vuetify.LEARNING.TOTAL_COMMENTS',
					displayedTotalComments
				)
			}}</TextStyle>
		</div>
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
				<DecoratorButton
					v-if="canShowLoadmore"
					@click="fetchMoreComments"
					text
					>{{ $vuetify.lang.t('$vuetify.BUTTON.VIEW_MORE') }}</DecoratorButton
				>
			</template>
		</CommentList>
	</div>
</template>
<script>
import {mapGetters, mapActions, mapMutations} from 'vuex'
import helpers from '@/helpers'
const {countTypeEnums} = helpers.commentEnums
const defaultAvatar = helpers.DEFAULT_IMAGE.avatar
const COMMENT_LIMIT = 3
export default {
	props: {
		canShowTotalComments: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			defaultAvatar,
			commentSkip: 0,
			contentTruncatedLimit: 150,
			object: {},
			container: {},
		}
	},
	computed: {
		...mapGetters({
			comments: 'comment/comments',
			replies: 'comment/replies',
			totalComment: 'comment/commentCount',
			userProfile: 'auth/getAuthUser',
			currentLesson: 'unit/getUnit',
			currentCourse: 'onlineCourse/getCourse',
		}),
		displayedComments() {
			if (this.comments && this.comments.length > 0) {
				return this.comments
					.filter(
						(comment) =>
							comment.containerId === this.container.containerId &&
							comment.objectId === this.object.objectId
					)
					.map((comment) => {
						return {
							...comment,
							name:
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
						name: reply.userName || this.$vuetify.lang.t('$vuetify.ANONYMOUS'),
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
		mustApproveDiscussion() {
			const lesson = this.currentLesson
			const course = this.currentCourse
			if (lesson.data && typeof lesson.data.mustApproveDiscussion === 'boolean')
				return lesson.data.mustApproveDiscussion
			if (course.data && typeof course.data.mustApproveDiscussion === 'boolean')
				return course.data.mustApproveDiscussion
			return true
		},
		displayedTotalComments() {
			return (
				this.totalComment ||
				this.comments.filter(
					(comment) => comment.objectId === this.object.objectId
				).length ||
				0
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
			this.$message.warning(
				this.$vuetify.lang.t('$vuetify.MESSAGES.COMMENT_RECEIVED_LOADING')
			)
			try {
				const status = this.mustApproveDiscussion ? 'unpublish' : 'publish'
				const baseCreateObject = {
					...this.object,
					...this.container,
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
		async fetchMoreComments(fetchBaseParams = {}) {
			const _skip = this.commentSkip * COMMENT_LIMIT
			if (_skip < this.totalComment) {
				try {
					await this.fetchComments({
						...fetchBaseParams,
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
			const {objectId, objectType} = this.object
			const {containerId, containerType} = this.container
			if (
				this.displayedComments.some(
					(comment) =>
						comment.objectId === objectId && comment.containerId === containerId
				)
			)
				return
			const fetchBaseParams = {
				objectId,
				objectType,
				containerId,
				containerType,
			}
			await this.fetchCount({
				...fetchBaseParams,
				type: 'comment',
				countType: countTypeEnums.COMMENT,
			})
			await this.fetchMoreComments(fetchBaseParams)
		},
		async onFetchReplies(payloadObject = {}, callback) {
			try {
				if (
					this.displayedReplies.some(
						(reply) => reply.commentId === payloadObject.commentId
					)
				)
					return
				await this.fetchRepliesOfComment(payloadObject)
				callback && callback()
			} catch (error) {
				this.$message.error(error)
			}
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
		//#region methods called by other component via ref
		async focusDiscussion(object = {}, container = {}) {
			this.object = object
			this.container = container
			this.commentSkip = 0
			await this.refreshData()
		},
		loseFocusDiscussion() {
			this.object = {}
			this.container = {}
		},
		//#endregion
	},
}
</script>
