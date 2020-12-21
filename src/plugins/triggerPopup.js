
import { popup } from '@/plugins/popup'

let eventHandleMap = {
  'show-success-popup': (message) => { popup.success(message) },
  'show-error-popup': (message) => { popup.error(message) }
}

export default {
  emit(eventName, payload) {
    eventHandleMap[eventName](payload)
  }
}
