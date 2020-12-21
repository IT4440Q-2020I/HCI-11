import { RepositoryFactory } from '@/api/factory/repositoryFactory'
const ResourceRepository = RepositoryFactory.get('resource')
import uploader from '@/plugins/s3Uploader.js'
import vendor from '@/store/modules/vendor.js'
import mimeTypes from 'mime-types'
const namespaced = true

const state = {
  documents: {},
  document: {},
  image: {},
  count: 0
}
const actions = {
  async uploadHomework({ commit }, { file, onProgress }) {
    const link = `resource/homeworks/${vendor.state.vendor.vendorId}/${new Date().getTime()}-${file.name}`
    const res = await uploader.uploadFile(file, link, ({ percent }) => {
      onProgress({ percent })
    })
    if (res.status === 200) {
      const document = await ResourceRepository.create(
        generateDocument(file, {
          link,
          subType: 'file',
          type: 'homework',
          provider: 'S3',
          bucket: process.env.VUE_APP_AWS_BUCKET_S3
        })
      )
      commit('addDocument', document.data)
      return document.data
    } else {
      throw new Error('Upload Failed')
    }
  },
  async uploadImage({ commit }, { file, onProgress }) {
    const link = `resource/images/${vendor.state.vendor.vendorId}/${file.name}`;
    const res = await uploader.uploadFile(file, link, ({ percent }) => {
      onProgress({ percent });
    });
    if (res.status === 200) {
      const image = await ResourceRepository.create(
        generateDocument(file, {
          link,
          subType: "img",
          type: "image",
          provider: "S3",
          bucket: process.env.VUE_APP_AWS_BUCKET_S3,
        })
      );
      commit('setImage', res.data)
      return image.data;
    } else {
      throw new Error("Upload Failed");
    }
  },
}

const mutations = {
  addDocument(state, document) {
    state.count = state.count + 1
    return (state.documents = {
      [document.id]: document,
      ...state.documents
    })
  },
  setImage(state, image) {
    state.image = image;
  },
}

const getters = {
  documents: (state) => {
    return Object.values(state.documents)
  },
  count: (state) => {
    return state.count
  },
  document: (state) => {
    return state.document
  },
  image: (state) => {
    return state.image
  },
}

const generateDocument = (file, { link, subType, provider, html, bucket, type }) => {
  return {
    title: file.name,
    size: file.size,
    dataType: 'resource',
    link,
    html,
    provider,
    type,
    origin: {
      link,
      size: file.size,
      type,
      html,
      mimeType: mimeTypes.lookup(file.name),
      bucket
    },
    subType
  }
}

export default {
  namespaced,
  state,
  actions,
  mutations,
  getters
}
