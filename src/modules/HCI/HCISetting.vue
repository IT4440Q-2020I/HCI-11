<template>
	<MainLayout>
		<div class="pa-3">
			<BaseButton
				color="grey"
				icon="back"
				@click="$router.push('/hci-menu')"
				style="margin: 0  0 20px 0"
			/>
		</div>
		<div>
			<BasePopup/>
		</div>
	</MainLayout>
</template>