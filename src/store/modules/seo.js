import crypto from 'crypto'
const SEO_LOADED_PREFIX = 'loaded-seo::'

const state = {
  title: 'Loading...',
  titleTemplate: null,
  metas: []
}

const mutations = {
  setTitle(state, title) {
    state.title = title
  },
  setTitleTemplate(state, titleTemplate) {
    state.titleTemplate = titleTemplate
  },
  pushMeta(state, meta) {
    let findIndex = meta.vid
      ? state.metas.findIndex(m => m.vid === meta.vid)
      : state.metas.findIndex(m => m.name === meta.name && m.property === meta.property && m.itemprop === meta.itemprop)
    if (findIndex >= 0) {
      state.metas.splice(findIndex, 1, meta)
    } else {
      state.metas.push(meta)
    }
  }
}

const actions = {
  async change({ commit, dispatch }, option = {}) {
    let { title, metas = [], metaInfo = {}, titleTemplate } = option
    if (title) {
      metaInfo.title = title
    }
    metas = [...metas, ...(await _genMetaFromMetaInfo(metaInfo))]
    if (title) {
      commit('setTitle', title)
    }
    if (titleTemplate) {
      commit('setTitleTemplate', titleTemplate)
    }
    for (let meta of metas) {
      commit('pushMeta', meta)
    }
    return dispatch('writeToHead')
  },
  savePathLoadedSeo() {
    let currentPath = window.location.pathname
    let key = `${SEO_LOADED_PREFIX}${currentPath}`
    window[key] = true
    return key
  },
  writeToHead({ state, dispatch }) {
    let { title, titleTemplate, metas } = state
    let titleCompiled = titleTemplate
      ? titleTemplate.replace('%s', title)
      : title
    document.title = titleCompiled
    return Promise.all(metas.map(meta => dispatch('_writeMeta', meta)))
  },
  async _writeMeta({ dispatch }, meta) {
    let { vid, name = '', content = '', property = '', itemprop = '' } = meta
    if (!vid) {
      vid = _hashMd5(name + property + itemprop)
    }
    let metaTag = await dispatch('_findOrCreateMetaTag', vid)
    name ? metaTag.setAttribute('name', name) : metaTag.removeAttribute('name')
    property ? metaTag.setAttribute('property', property) : metaTag.removeAttribute('property')
    itemprop ? metaTag.setAttribute('itemprop', itemprop) : metaTag.removeAttribute('itemprop')
    content ? metaTag.setAttribute('content', content) : metaTag.removeAttribute('content')
    return metaTag
  },
  _findOrCreateMetaTag(context, vid) {
    let existedTag = document.querySelector(`head>meta[data-vid='${vid}']`)
    if (existedTag) {
      return existedTag
    }
    let newTag = document.createElement('meta')
    newTag.setAttribute('data-vid', vid)
    document.head.appendChild(newTag)
    return newTag
  }
}

const getters = {}

function _hashMd5(str) {
  return crypto.createHash('md5').update(str).digest('hex')
}

async function _genMetaFromMetaInfo(info = {}) {
  let { fbAppId, domain, url, description, title, type, locale, image, imageAlt, siteName } = info
  let metas = []
  if (fbAppId) {
    metas.push({ property: 'fb:app_id', content: fbAppId })
  }
  if (domain) {
    metas.push({ name: 'twitter:domain', content: domain })
  }
  if (url) {
    metas.push({ property: 'og:url', name: 'og:url', content: url })
    metas.push({ property: 'twitter:url', content: url })
    metas.push({ itemprop: 'url', content: url })
  }
  if (description) {
    metas.push({ name: 'description', content: description })
    metas.push({ property: 'og:description', name: 'og:description', content: description })
    metas.push({ name: 'twitter:description', content: description })
    metas.push({ itemprop: 'description', content: description })
  }
  if (title) {
    metas.push({ name: 'title', content: title })
    metas.push({ property: 'og:title', name: 'og:title', content: title })
    metas.push({ name: 'twitter:title', content: title })
  }
  if (type) {
    metas.push({ property: 'og:type', name: 'og:type', content: type })
  }
  if (locale) {
    metas.push({ property: 'og:locale', name: 'og:locale', content: locale })
  }
  if (image) {
    let { width, height } = await _tryGetImageWidthHeight(image)
    metas.push({ property: 'og:image', name: 'og:image', content: image })
    metas.push({ name: 'twitter:image', content: image })
    metas.push({ itemprop: 'image', content: image })
    metas.push({ property: 'og:image:width', name: 'og:image:width', content: width })
    metas.push({ property: 'og:image:height', name: 'og:image:height', content: height })
    metas.push({ property: 'og:image:alt', name: 'og:image:alt', content: imageAlt || 'IZTeach' })
  }
  if (siteName) {
    metas.push({ property: 'og:site_name', name: 'og:site_name', content: siteName })
  }
  return metas
}

const _cacheDimension = {}
function _tryGetImageWidthHeight(url) {
  return new Promise((resolve) => {
    if (_cacheDimension[url]) {
      resolve(_cacheDimension[url])
    } else {
      getImageWithHeight(url)
        .then(resolve)
        .catch(() => resolve({ width: 0, height: 0 }))
    }
  })
}

function getImageWithHeight(url) {
  return new Promise((resolve, reject) => {
    let image = new Image()
    image.src = url
    image.onload = function () {
      resolve({
        width: image.width,
        height: image.height
      })
    }
    image.onerror = reject
  })
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}