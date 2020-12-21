const LIST_ELEMENT_QUERY_HOMEPAGE = [
  {
    name: 'SectionCourseOnline',
    key: 'course-online'
  },
  {
    name: 'SectionCourseOffline',
    key: 'course-offline'
  },
  {
    name: 'SectionEventList',
    key: 'academic-event'
  },
  {
    name: 'SectionDepartment',
    key: 'academic-department'
  },
  {
    name: 'SectionEbook',
    key: 'book'
  }
]

const MENU_HEADER_HOMEPAGE = [
  {
    name: 'program',
    label: ('$vuetify.LEARNING_SYLLABUS'),
    children: [
      {
        label: ('$vuetify.ONLINE_COURSE.TITLE_SHORT'),
        href: '/course-online/',
      },
      {
        label: ('$vuetify.OFFLINE_COURSE.TITLE_SHORT'),
        href: '/course-offline/',
      },
      {
        label: ('$vuetify.FOOTER_BOOK'),
        href: '/book-list/',
      },
      {
        label: ('$vuetify.EVENT.TITLE_SHORT'),
        href: '/event-list/',
      },
    ],
  },
  {
    name: 'activeCourse',
    label: ('$vuetify.ACTIVATE'),
    href: '/active-course/',
  },
  {
    name: 'department',
    label: ('$vuetify.FOOTER_DEPARTMENT'),
    href: '/department/',
  },
  // {
  //   name: 'blog',    
  //   label: 'Blog',
  //   href: '/blog/',
  // },
  {
    name: 'aboutUs',
    label: ('$vuetify.ABOUT_US'),
    href: '/about-us/',
  },
  {
    name: 'policy',
    label: ('$vuetify.PRIVACY_POLICY'),
    href: '/privacy-policy/',
  },
]

const FOOTER_EDUCATON_CONTENT = [
  {
    name: "activeCourse",
    label: ('$vuetify.ACTIVATE_COURSE'),
    href: "/active-course",
  },
  {
    name: "courseOnline",
    label: ('$vuetify.ONLINE_COURSE.TITLE_SHORT'),
    href: "/course-online",
  },
  {
    name: "courseOffline",
    label: ('$vuetify.OFFLINE_COURSE.TITLE_SHORT'),
    href: "/course-offline",
  },
  {
    name: "event",
    label: ('$vuetify.EVENT.TITLE_SHORT'),
    href: "/event-list",
  },
  {
    name: "ebook",
    label: ('$vuetify.FOOTER_BOOK'),
    href: "/book-list",
  },
]

const FOOTER_INTRO_CONTENT = [
  {
    name: "aboutUs",
    label: ('$vuetify.ABOUT_US'),
    href: "/about-us",
  },
  {
    name: "policy",
    label: ('$vuetify.PRIVACY_POLICY'),
    href: "/privacy-policy",
  },
  {
    name: "blog",
    label: ('$vuetify.FOOTER_BLOG'),
    href: "/blog",
  },
  {
    name: "department",
    label: ('$vuetify.FOOTER_DEPARTMENT'),
    href: "/department",
  },
]

const QUERY_HOMEPAGE = {
  'course-online': {
    ids: [],
    fields: [
      'id',
      'vendorId',
      'createdAt',
      'status',
      'topics',
      'authors',
      'previewImg',
      'title',
      'shortDescription',
      'isFree',
      'price',
      'disablePurchasing',
      'video'
    ]
  },
  'course-offline': {
    ids: [],
    fields: [
      'id',
      'vendorId',
      'status',
      'topics',
      'authors',
      'metadata',
      'duration',
      'title',
      'price',
      'description',
      'shortDescription',
    ]
  },
  'academic-event': {
    ids: [],
    fields: [
      'id',
      'vendorId',
      'createdAt',
      'previewImage',
      'runningStartDate',
      'title',
      'runningStartHour',
      'center'
    ]
  },
  'academic-department': {
    ids: [],
    fields: ['id', 'vendorId', 'createdAt', 'previewImage', 'name']
  },
  book: {
    ids: [],
    fields: [
      'id',
      'vendorId',
      'createdAt',
      'previewImage',
      'authors',
      'title'
    ]
  }
}

const AWS_S3_ROOT_BUCKET_URL = process.env.VUE_APP_AWS_BUCKET_S3

const commentEnums = {
  countTypeEnums: {
    TOTAL: 'TOTAL',
    COMMENT: 'COMMENT',
    REPLY: 'REPLY',
  }
}

const DEFAULT_IMAGE = {
  avatarProfile: 'https://online-learning-izteach-3-test-aws-source-bucket.s3-ap-southeast-1.amazonaws.com/resource/images/23b0bfb0-c00b-11e9-a060-17d3861b7a5b/avatar.png',
  card: process.env.VUE_APP_AWS_BUCKET_S3_DEFAULT_DATA + '/SD-default-image.png',
  banner: process.env.VUE_APP_AWS_BUCKET_S3_DEFAULT_DATA + '/banner-default.jpg',
  avatar: process.env.VUE_APP_AWS_BUCKET_S3_DEFAULT_DATA + '/default-avatar.png',
  logo: process.env.VUE_APP_AWS_BUCKET_S3_DEFAULT_DATA + '/root-logo.png'
}

const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyDNpMx-mkQNh728jmVO55jmA-crwyjGQmc',
  authDomain: 'bigdat-fa688.firebaseapp.com',
  databaseURL: 'https://bigdat-fa688.firebaseio.com',
  projectId: 'bigdat-fa688',
  storageBucket: 'bigdat-fa688.appspot.com',
  messagingSenderId: '133775651035',
  appId: '1:133775651035:web:6fb0d57b374e0769041cfe'
}

export default {
  LIST_ELEMENT_QUERY_HOMEPAGE,
  QUERY_HOMEPAGE,
  MENU_HEADER_HOMEPAGE,
  FOOTER_EDUCATON_CONTENT,
  FOOTER_INTRO_CONTENT,
  DEFAULT_IMAGE,
  AWS_S3_ROOT_BUCKET_URL,
  commentEnums,
  FIREBASE_CONFIG
}