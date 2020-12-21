<template>
	<v-btn
		:class="className"
		depressed
		:outlined="outlined"
		:dark="dark"
		:text="isButtonText"
		:color="color"
		:loading="loading"
		@click="$emit('click')"
		:disabled="disabled"
	>
		<v-icon small class="mr-1" v-if="icon && !surffix">
			{{ icon }}
		</v-icon>
		{{ text }}
		<v-icon small class="mr-1" v-if="icon && surffix">
			{{ icon }}
		</v-icon></v-btn
	>
</template>
<script>
export default {
	props: {
		loading: {
			type: Boolean,
			default: false
		},
		outlined: {
			type: Boolean,
			default: false
		},
		color: {
			type: String,
			default: 'primary'
		},
		isButtonText: {
			type: Boolean,
			default: false,
		},
		icon: {
			type: String,
			default: '',
		},
		surffix: {
			type: Boolean,
			default: false,
		},
		text: {
			type: String,
			default: '',
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		className: {
			type: String,
			default: 'text-capitalize',
		},
		dark: {
			type: Boolean,
			default: true,
		},
	},
	created() {},
	data() {
		return {}
	},
}
</script>
