<template>
	<v-row no-gutters class="mb-4">
		<v-col class="mb-2" cols="12">
			<TextStyle font-type="subtitle-1">{{$vuetify.lang.t('$vuetify.LEARNING.HOMEWORK.DESCRIPTION')}}</TextStyle>
		</v-col>
		<v-col cols="12">
			<TextStyle v-if="hasDescription" font-type="body-2">{{
				description ? description : $vuetify.lang.t('$vuetify.LEARNING.HOMEWORK.NO_DESCRIPTION')
			}}</TextStyle>
			<hr class="mt-3" style="opacity: 0.3" />
		</v-col>
	</v-row>
</template>
<script>
export default {
	props: {
		description: String,
		hasDescription: Boolean,
	},
}
</script>
