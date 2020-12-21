<template>
	<v-row class="question" no-gutters>
		<v-col cols="2" v-if="!isDisableOrder" class="text-left">
			<TextStyle font-type="body-1" noMargin>{{ index + 1 }}</TextStyle>
		</v-col>
		<v-col cols="10" class="question__answers text-left">
			<Input
				v-if="!isShowResult"
				class="question__input mb-0"
				width="auto"
				wrapper="div"
				v-model="data"
			/>
			<div class="question__input" v-else>
				<TextStyle
					v-if="isCorrectAnswer"
					style="color: #4bca81"
					font-type="caption-2"
					variation="subtext"
					noMargin
					>{{ correctAnswer }}</TextStyle
				>
				<div v-else>
					<TextStyle
						class="mr-3"
						style="color: #d4504c; text-decoration: line-through"
						font-type="caption-2"
						variation="subtext"
						noMargin
						>{{ value }}</TextStyle
					>
					<TextStyle
						style="color: #4bca81"
						font-type="caption-2"
						variation="subtext"
						noMargin
						>{{ correctAnswer }}</TextStyle
					>
				</div>
			</div>
		</v-col>
	</v-row>
</template>
<script>
export default {
	props: {
		isShowResult: Boolean,
		index: Number,
		value: String,
		question: Object,
		isDisableOrder: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			data: '',
			isCorrectAnswer: false,
			correctAnswer: '',
		}
	},
	methods: {
		refresh() {
			this.data = ''
		},
		selectAnswer(answerString) {
			this.data = answerString
			this.$emit('input', this.data)
			this.$emit('synchronize')
		},
	},
	watch: {
		data: {
			handler() {
				this.selectAnswer(this.data)
			},
			immediate: true,
		},
		question: {
			handler(question) {
				this.isCorrectAnswer = question.isCorrect
				this.correctAnswer = question.correct
			},
			immediate: true,
		},
		value: {
			handler(value) {
				this.data = value
			},
			immediate: true,
		},
	},
}
</script>
<style lang="scss" scoped>
.question {
	display: flex;
	align-items: center;
	.question__answers {
		.question__input {
			width: 144px;
			::v-deep .wrapper-input {
				height: 8px !important;
				input {
					height: 30px !important;
				}
			}
		}
	}
	@media only screen and (max-width: 960px) {
		.question__answers {
			.question__input {
				width: 60%;
			}
		}
	}
}

::v-deep .input .input__input-wrapper input {
	height: 30px !important;
}
</style>