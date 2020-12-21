import { Auth } from '@/api/repository/authRepository.js'
import mimeTypes from 'mime-types'
import axios from 'axios'

/**
 * Function upload video lên vimeos. sử dụng tus method để hỗ trợ upload và retry
 * @return: Promise
 */
async function uploadFile(file, link, onProgress) {
  const params = {
    key: link,
    contentType: mimeTypes.lookup(file.name)
  }
  let signedUrl = await Auth.getS3SignedToken(params)
  return await axios.put(signedUrl, file, {
    onUploadProgress: function (progressEvent) {
      let { loaded, total } = progressEvent
      onProgress({
        loaded,
        total,
        percent: (loaded / total) * 100
      })
    },
    headers: {
      'Content-Type': mimeTypes.lookup(file.name)
    }
  })
}

export default {
  uploadFile
}
