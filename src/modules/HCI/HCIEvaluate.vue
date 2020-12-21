<template>
	<MainLayout>
		<div class="pa-3">
			<div class="title">
				Bảng xếp hạng
			</div>
			<BaseButton
				color="grey"
				icon="back"
				@click="$router.push('/hci-menu')"
				style="margin: 0  0 20px 0"
			/>
		</div>
		<div>
			<v-data-table
				disable-sort
				:headers="headers"
				:items="item"
				class="elevation-1"
				:search="textSearch"
			>
				<template v-slot:[`item.name`]="{item}">
						{{ item.name }}
				</template>
			</v-data-table>
		</div>
	</MainLayout>
</template>
<script>
export default {
	props: {
		textSearch: String
	},
	data() {
		return {
			item: [
				{
					name: 'Vinh',
					percent: '2%',
					speed: '50 từ / phút',
					last: '06-11-2020 17:03:21'
				},
				{
					name: 'Bi',
					percent: '1%',
					speed: '50 từ / phút',
					last: '06-11-2020 13:03:21'
				},
				{
					name: 'Híp',
					percent: '2%',
					speed: '50 từ / phút',
					last: '03-11-2020 14:03:21'
				},
				{
					name: 'Hiệp',
					percent: '3%',
					speed: '50 từ / phút',
					last: '06-11-2020 17:03:23'
				},
			],
			headers: [
				{
					text: 'Người chơi',
					align: 'left',
					sortable: false,
					value: 'name',
					class: 'table-header',
					width: '20%'
				},
				{
					text: 'Tỉ lệ gõ đúng',
					value: 'percent',
					align: 'left',
					sortable: false,
					class: 'table-header',
					width: '20%'
				},
				{
					text: 'Tốc độ gõ',
					value: 'speed',
					sortable: false,
					align: 'left',
					class: 'table-header',
					width: '20%'
				},
					{
					text: 'Lần chơi gần nhất',
					value: 'last',
					sortable: false,
					align: 'left',
					class: 'table-header',
					width: '20%'
				},

			]
		}
	}
}
</script>
