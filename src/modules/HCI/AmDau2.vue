<template>
	<div>
		<MainLayout :has-dark-theme="false">
			<div class="title">Âm có cách phát âm gần giống nhau</div>
			<div class="background pa-3">
				<BaseButton
					color="grey"
					icon="back"
					@click="$router.push('/hci-learn/AmDau')"
					style="margin: 0  0 20px 0"
				/>
				<div class="d-flex flex-column align-center">
					<img src="/img/AmDau2.png">
				</div>
			</div>
		</MainLayout>
	</div>
</template>
