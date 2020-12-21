<template>
	<form>
		<div class="mb-3">
			<h4>{{ $vuetify.lang.t('$vuetify.BASIC_INFORMATION') }}</h4>
		</div>
		<Input
			class="mb-5"
			ref="name"
			required
			:rules="[$rules.required, $rules.maxLength(25)]"
			:placeholder="$vuetify.lang.t('$vuetify.EXAMPLE', 'Nguyễn Thị B')"
			:label="$vuetify.lang.t('$vuetify.INPUT.FULLNAME')"
			:defaultValue="data.name"
			v-model="data.name"
		/>
		<Input
			class="mb-5"
			ref="phone"
			required
			:rules="[$rules.required, $rules.phone]"
			:placeholder="$vuetify.lang.t('$vuetify.EXAMPLE', '0987654321')"
			:label="$vuetify.lang.t('$vuetify.INPUT.PHONE')"
			:defaultValue="data.phone"
			v-model="data.phone"
		/>
		<Input
			class="mb-5"
			ref="birth-date"
			:rules="data.birthdate ? [$rules.date] : [(v) => !v]"
			:placeholder="$vuetify.lang.t('$vuetify.EXAMPLE', '02/02/2000')"
			:label="$vuetify.lang.t('$vuetify.INPUT.DOB')"
			:defaultValue="data.birthdate"
			v-model="data.birthdate"
		/>
		<Input
			:placeholder="
				$vuetify.lang.t('$vuetify.EXAMPLE', 'Số 248 Khâm Thiên, Hà Nội')
			"
			:label="$vuetify.lang.t('$vuetify.INPUT.CONTACT_ADDRESS')"
			:defaultValue="data.address"
			v-model="data.address"
		/>
	</form>
</template>
<script>
import moment from 'moment'
export default {
	data() {
		return {
			data: {
				address: '',
				name: '',
				birthdate: '',
				phone: '',
			},
		}
	},
	props: {
		profile: {
			type: Object,
			default: () => {},
		},
	},
	methods: {
		validate() {
			this.$refs['name'].runValidate()
			this.$refs['phone'].runValidate()
			this.$refs['birth-date'].runValidate()
			if (
				this.$refs['name'].isValid &&
				this.$refs['phone'].isValid &&
				(this.$refs['birth-date'].isValid ||
					this.$refs['birth-date'].isValid === null)
			) {
				return true
			} else return false
		},
		getData() {
			return this.data
		},
	},
	watch: {
		profile: {
			handler(val) {
				if (val) {
					this.data.name = val.name ? val.name : ''
					this.data.phone = val.phone ? val.phone : ''
					this.data.birthdate = val.birthdate
						? moment(val.birthdate).format('DD/MM/YYYY')
						: ''
					this.data.address = val.address ? val.address : ''
				}
			},
			immediate: true,
		},
	},
}
</script>