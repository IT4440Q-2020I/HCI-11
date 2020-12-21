import moment from 'moment'
import vuetify from '@/plugins/vuetify'

const onDownloadSyllabus = (syllabus) => {
  const file = syllabus;
  if (!file) return;
  const { origin = {} } = file;
  let { link = "" } = origin;
  if (!link) return;
  if (!link.includes('http')) link = combineLinkWithBucket(link)
  window.open(convertURL(link), "_blank");
}

const combineLinkWithBucket = (linkResource) => {
  if (linkResource.includes('https')) return linkResource
  return process.env.VUE_APP_AWS_BUCKET_S3 + '/' + linkResource
}

const wrapperLinkImage = (image = {}) => {
  return {
    ...image,
    link: convertURL(combineLinkWithBucket(image.link)),
    origin: {
      ...image.origin,
      link: convertURL(combineLinkWithBucket(image.origin.link)),
    }
  }
}

const convertURL = (url, withoutCloudfront) => {
  if (!url) return url
  let convertedUrl = url;
  if (!url.includes('https') && url.includes('http')) {
    let urlWithHttps = url.replace('http', 'https');
    convertedUrl = urlWithHttps;
  }
  if (convertedUrl.includes(process.env.VUE_APP_AWS_BUCKET_S3) && !withoutCloudfront) {
    let urlCloudfront = convertedUrl.replace(process.env.VUE_APP_AWS_BUCKET_S3, process.env.VUE_APP_AWS_BUCKET_CLOUD_FRONT)
    convertedUrl = urlCloudfront;
  }
  return convertedUrl
}

const validateTimeForLesson = (setting) => {
  if (setting && setting.hasRangeTime) {
    const timeZone = moment().valueOf()
    const startTime = moment(
      `${setting.rangeTimeFromDate}T${setting.rangeTimeFromHour}:00.000+07:00`
    ).valueOf()
    const endTime = moment(
      `${setting.rangeTimeToDate}T${setting.rangeTimeToHour}:00.000+07:00`
    ).valueOf()
    return timeZone > startTime && timeZone < endTime
  } else return true
}

const getLinkWithoutCache = (link) => {
  const convertedLink = convertURL(link);
  return `${convertedLink}?time=${Date.now()}`;
}
const isImage = (extension) => {
  return (/\.(gif|jpe?g|tiff?|png|webp|bmp)/i).test(`.${extension}`)
}

const calculateTotalReactions = (item) => {
  let result = 0
  Object.keys(item).forEach(key => {
    if (key.startsWith("totalReaction")) {
      result += item[key]
    }
  })
  return result
}

const fakeMarkEvaluation = (mark) => {
  if(mark) {
    if (mark >= 9) {
      return vuetify.framework.lang.translator('$vuetify.LEARNING.SCORE_LABEL.EXCELLENT')
    } else if (mark < 9 && mark >= 7) {
      return vuetify.framework.lang.translator('$vuetify.LEARNING.SCORE_LABEL.GOOD')
    } else {
      return vuetify.framework.lang.translator('$vuetify.LEARNING.SCORE_LABEL.NEED_EFFORT')
    }
  } else {
    return vuetify.framework.lang.translator('$vuetify.LEARNING.SCORE_LABEL.NO_MARK')
  }
}

function getListAnswersFromSubmission(data) {
  let selectedAnswers = {};
  Object.keys(data).forEach(questionKey => {
    const result = data[questionKey];
    if (result) {
      if (result.answer && result.answer.length) {
        selectedAnswers[questionKey] = {
          questionId: questionKey,
          answer: result.answer
        };
      } else if (result.answerId && result.answerId.length) {
        selectedAnswers[questionKey] = {
          questionId: questionKey,
          answerId: result.answerId
        };
      } else if (result.answerIds && result.answerIds.length) {
        selectedAnswers[questionKey] = {
          questionId: questionKey,
          answerIds: result.answerIds
        };
      }
    }
  });
  return selectedAnswers
}

export default {
  combineLinkWithBucket,
  convertURL,
  onDownloadSyllabus,
  validateTimeForLesson,
  getLinkWithoutCache,
  isImage,
  wrapperLinkImage,
  calculateTotalReactions,
  fakeMarkEvaluation,
  getListAnswersFromSubmission,
}
