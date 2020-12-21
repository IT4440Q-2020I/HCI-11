import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
function lazyLoad(view) {
	return () => import(`@/pages/${view}.vue`)
}

const routes = [
	{
		path: '/',
		name: 'Home',
		component: lazyLoad('HCIMenu'),
		meta: {
			title: 'Trang chủ'
		}
	},
	{
		path: '/view-profile',
		name: 'ViewProfile',
		component: lazyLoad('ViewProfile'),
		meta: {
			title: 'Thông tin cá nhân'
		}
	},
	{
		path: '/active-course',
		name: 'ActiveCode',
		component: lazyLoad('ActiveCode'),
		meta: {
			title: 'Kích hoạt khoá học'
		}
	},
	{
		path: '/department',
		name: 'DepartmentList',
		component: lazyLoad('DepartmentList'),
		meta: {
			title: 'Danh sách cơ sở'
		}
	},
	{
		path: '/checkoutCart',
		name: 'Checkout',
		component: lazyLoad('Checkout'),
		meta: {
			title: 'Đơn hàng và thanh toán'
		}
	},
	{
		path: '/purchased',
		name: 'MyLearning',
		component: lazyLoad('MyLearning'),
		meta: {
			title: 'Khoá học của tôi'
		}
	},
	{
		path: '/course-online-detail/:id',
		name: 'course-online-detail',
		component: lazyLoad('DetailCourseOnline')
	},
	{
		path: '/course-online',
		name: 'OnlineCourseList',
		component: lazyLoad('OnlineCourseList'),
		meta: {
			title: 'Danh sách khóa học online'
		}
	},
	{
		path: '/about',
		name: 'About',
		component: lazyLoad('About'),
		meta: {
			title: 'Về chúng tôi'
		}
	},
	{
		path: '/about-us',
		name: 'About Us',
		component: lazyLoad('AboutUs'),
		meta: {
			title: 'Về chúng tôi'
		}
	},
	{
		path: '/privacy-policy',
		name: 'Privacy Policy',
		component: lazyLoad('PrivacyPolicy'),
		meta: {
			title: 'Chính sách và bảo mật'
		}
	},
	{
		path: '/recruitment',
		name: 'Recruitment',
		component: lazyLoad('Recruitment'),
		meta: {
			title: 'Trở thành giảng viên'
		}
	},
	{
		path: '/confirm-sign-up',
		name: 'ConfirmSignUp',
		component: lazyLoad('ConfirmSignUp'),
		meta: {
			title: 'Xác thực đăng ký'
		}
	},
	{
		path: '/teacher-detail/:id',
		name: 'TeacherDetail',
		component: lazyLoad('TeacherDetail'),
		meta: {
			title: 'Thông tin chi tiết giáo viên'
		}
	},
	{
		path: '/course-offline/:id',
		name: 'offline-course-detail',
		component: lazyLoad('OfflineCourseDetail')
	},
	{
		path: '/course-online-learning/:courseId/:sectionId/:unitId',
		name: 'course-online-learning',
		component: lazyLoad('Learning'),
		meta: {
			title: 'Trang học'
		}
	},
	{
		path: '/course-offline/',
		name: 'OfflineCourse',
		component: lazyLoad('OfflineCourseList'),
		meta: {
			title: 'Danh sách khóa học Offline'
		}
	},
	{
		path: '/event-list/',
		name: 'Event',
		component: lazyLoad('EventList'),
		meta: {
			title: 'Danh sách các sự kiện'
		}
	},
	{
		path: '/event-detail/:id',
		name: 'eventDetail',
		component: lazyLoad('EventDetail')
	},
	{
		path: '/book-list/',
		name: 'Ebook',
		component: lazyLoad('Ebook'),
		meta: {
			title: 'Danh sách tài liệu điện tử'
		}
	},
	{
		path: '/notification',
		name: 'Thông báo',
		component: lazyLoad('NotificationList'),
		meta: {
			title: 'Danh sách thông báo'
		}
	},
	{
		path: '/ebook-detail/:id',
		name: 'EbookDetail',
		component: lazyLoad('EbookDetail')
	},
	{
		path: '/view-book/:id',
		name: 'ViewBook',
		component: lazyLoad('ViewBook')
	},
	{
		path: '/blog-detail/:id',
		name: 'BlogDetail',
		component: lazyLoad('BlogDetail'),
		meta: {
			title: 'Chi tiết bài viết'
		}
	},
	{
		path: '/blog',
		name: 'BlogList',
		component: lazyLoad('BlogList'),
		meta: {
			title: 'Danh sách các bài viết'
		}
	},
	{
		path: '/certificate-detail/:id',
		name: 'CertificateDetail',
		component: lazyLoad('CertificateDetail'),
		meta: {
			title: 'Chứng chỉ của tôi'
		}
	},
	{
		path: '/hci-menu',
		name: 'Menu',
		component: lazyLoad('HCIMenu'),
		meta: {
			title: 'Menu'
		}
	},
	{
		path: '/hci-learn',
		name: 'Learn',
		component: lazyLoad('HCILearn'),
		meta: {
			title: 'Learn'
		}
	},
	{
		path: '/hci-learn/AmChinh',
		name: 'Learn',
		component: lazyLoad('HCIAmChinh'),
		meta: {
			title: 'Learn'
		}
	},
	{
		path: '/hci-learn/AmChinh/AmChinh1',
		name: 'Learn',
		component: lazyLoad('AmChinh1'),
		meta: {
			title: 'Learn'
		}
	},
	{
		path: '/hci-learn/AmChinh/AmChinh2',
		name: 'Learn',
		component: lazyLoad('AmChinh2'),
		meta: {
			title: 'Learn'
		}
	},
	{
		path: '/hci-learn/AmChinh/AmChinh3',
		name: 'Learn',
		component: lazyLoad('AmChinh3'),
		meta: {
			title: 'Learn'
		}
	},
	{
		path: '/hci-learn/AmDau',
		name: 'Learn',
		component: lazyLoad('HCIFirstSound'),
		meta: {
			title: 'Learn'
		}
	},
	{
		path: '/hci-learn/AmDau/AmDau1',
		name: 'Learn',
		component: lazyLoad('AmDau1'),
		meta: {
			title: 'Learn'
		}
	},
	{
		path: '/hci-learn/AmDau/AmDau2',
		name: 'Learn',
		component: lazyLoad('AmDau2'),
		meta: {
			title: 'Learn'
		}
	},
	{
		path: '/hci-learn/AmDau/AmDau3',
		name: 'Learn',
		component: lazyLoad('AmDau3'),
		meta: {
			title: 'Learn'
		}
	},
	{
		path: '/hci-learn/AmDau/AmDau4',
		name: 'Learn',
		component: lazyLoad('AmDau4'),
		meta: {
			title: 'Learn'
		}
	},
	{
		path: '/hci-practice',
		name: 'Practice',
		component: lazyLoad('HCIPractice'),
		meta: {
			title: 'Practice'
		}
	},
	{
		path: '/hci-evaluate',
		name: 'Evaluate',
		component: lazyLoad('HCIEvaluate'),
		meta: {
			title: 'Evaluate'
		}
	},
	{
		path: '/hci-setting',
		name: 'Setting',
		component: lazyLoad('HCISetting'),
		meta: {
			title: 'Setting'
		}
	}
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	scrollBehavior() {
		return {x: 0, y: 0}
	},
	routes
})

export default router
