<template>
	<div>
		<MainLayout :has-dark-theme="false">
			<div class="title">Chọn bài học</div>
			<div class="background pa-3">
				<BaseButton
					color="grey"
					icon="back"
					@click="$router.push('/hci-learn')"
					style="margin: 0  0 20px 0"
				/>
				<div class="d-flex flex-column align-center">
					<BaseButton
						@click="$router.push('/hci-learn/AmChinh/AmChinh1')"
						text="Có dấu thanh"
					/>

					<BaseButton
						@click="$router.push('/hci-learn/AmChinh/AmChinh2')"
						text="Không có dấu thanh"
					/>

					<BaseButton
						@click="$router.push('/hci-learn/AmChinh/AmChinh3')"
						text="Vần phức"
					/>
				</div>
			</div>
		</MainLayout>
	</div>
</template>
<style scoped>
button {
	width: 350px !important;
	margin: 10px;
	padding: 20px;
}
</style>
