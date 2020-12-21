<template>
  <div>
    <MainLayout :has-dark-theme="false">
      <div class="background">
        <div class="title d-flex justify-center">
           Màn hình menu gõ tốc ký
        </div>
        <div class="d-flex flex-column align-center">
          <BaseButton @click="$router.push('/hci-learn')" text="Học quy tắc gõ"/> 
          <BaseButton @click="$router.push('/hci-practice')" text="Luyện tập gõ"/>
          <BaseButton @click="$router.push('/hci-evaluate')" text="Đánh giá"/>
          <BaseButton @click="$router.push('/hci-setting')" text="Cài đặt"/>
        </div>
      </div>
    </MainLayout>
  </div>
</template>
<style>
button {
  width: 350px !important;
  margin: 10px;
  padding: 20px
}
.title {
  padding: 24px;
  text-align: center;
  color: black;
  font-weight: bold;
}
/* .background {
  background-image: url("background.jpg");
  background-size: contain;
  background-position: center;
} */
</style>