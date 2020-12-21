<template>
	<MainLayout>
		<DepartmentList
			v-if="listDepartment && listDepartment.length"
			:items="listDepartment"
		/>
	</MainLayout>
</template>
<script>
import MainLayout from '@/templates/layout/MainLayout.vue'
import {mapActions, mapGetters} from 'vuex'
export default {
	components: {
		MainLayout,
	},
	async mounted() {
		await this.fetchDepartments()
	},
	computed: {
		...mapGetters({
			departments: 'department/getDepartments',
		}),
		listDepartment() {
			return this.departments.map((department) => {
				return {
					...department,
					previewImage:
						department.previewImage &&
						typeof department.previewImage === 'object'
							? this.$utils.wrapperLinkImage(department.previewImage)
							: undefined,
				}
			})
		},
	},
	methods: {
		...mapActions({
			fetchDepartments: 'department/fetchDepartments',
		}),
	},
}
</script>