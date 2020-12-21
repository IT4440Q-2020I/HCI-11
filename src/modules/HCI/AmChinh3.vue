<template>
	<div>
		<MainLayout :has-dark-theme="false">
			<div class="title">Âm chính là vần phức</div>
			<div class="background pa-3">
				<BaseButton
					color="grey"
					icon="back"
					@click="$router.push('/hci-learn/AmChinh')"
					style="margin: 0  0 20px 0"
				/>
				<div class="d-flex flex-column align-center">
					<img src="/img/AmChinh3.png">
				</div>
			</div>
		</MainLayout>
	</div>
</template>
