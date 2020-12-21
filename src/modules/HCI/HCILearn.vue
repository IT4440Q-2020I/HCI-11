<template>
	<div>
		<MainLayout :has-dark-theme="false">
			<div class="title">Chọn bài học</div>
			<div class="background pa-3">
				<BaseButton
					color="grey"
					icon="back"
					@click="$router.push('/hci-menu')"
					style="margin: 0  0 20px 0"
				/>
				<div class="d-flex flex-column align-center">
					<BaseButton
						@click="$router.push('/hci-learn/AmDau')"
						text="Học gõ âm đầu"
					/>

					<BaseButton
						@click="$router.push('/hci-learn/AmChinh')"
						text="Học gõ âm chính"
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
