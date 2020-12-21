<template>
	<v-textarea
		class="body-2"
		outlined
		dense
		:label="label"
		:rules="rules"
		:type="type"
		v-model="data"
		:placeholder="placeholder"
		:hint="hint"
		:persistent-hint="persistentHint"
	></v-textarea>
</template>
<script>
export default {
	props: {
		rules: {
			type: Array,
			default: () => [],
		},
		label: {
			type: String,
			default: '',
		},
		type: {
			type: String,
			default: 'text',
		},
		placeholder: {
			type: String,
			default: '',
		},
		value: {
			type: String || Number,
			default: '',
		},
		hint: {
			type: String,
			default: '',
		},
		persistentHint: {
			type: Boolean,
			default: false,
		}
	},
	data() {
		return {
			data: '',
		}
	},
	mounted() {
		this.data = this.value
	},
	watch: {
		data() {
			this.$emit('input', this.data)
		},
		value() {
			this.data = this.value
		},
	},
}
</script>
