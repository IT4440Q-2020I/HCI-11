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
						@click="$router.push('/hci-learn/AmDau/AmDau1')"
						text="Đồng âm, đồng dạng"
					/>

					<BaseButton
						@click="$router.push('/hci-learn/AmDau/AmDau2')"
						text="Âm có cách phát âm gần giống nhau"
					/>

					<BaseButton
						@click="$router.push('/hci-learn/AmDau/AmDau3')"
						text="Âm viết gần giống nhau"
					/>

					<BaseButton
						@click="$router.push('/hci-learn/AmDau/AmDau4')"
						text="Âm ngoại lệ"
					/>
				</div>
			</div>
		</MainLayout>
	</div>
</template>
<style>
button {
	width: 350px !important;
	margin: 10px;
	padding: 20px;
}
</style>
