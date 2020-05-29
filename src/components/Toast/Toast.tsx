/**
 * Toast 默认无蒙层
 */
import { Toast, Portal } from "@ant-design/react-native";

enum ToastType {
  success = 'success',
  fail = 'fail',
  info = 'info',
  loading = 'loading',
  offline = 'offline',
}

class CustomToast {

  static show = (content: string, mask?: boolean = false, duration?: number = 1, onClose?: () => void | undefined, ) => {
    Toast.info(content, duration, onClose, mask)
  }

  static info = (content: string, mask?: boolean = false, duration?: number = 1, onClose?: () => void | undefined, ) => {
    Toast.info(content, duration, onClose, mask)
  }

  static success = (content: string, mask?: boolean = false, duration?: number = 1, onClose?: () => void | undefined, ) => {
    Toast.success(content, duration, onClose, mask)
  }

  static fail = (content: string, mask?: boolean = false, duration?: number = 1, onClose?: () => void | undefined, ) => {
    Toast.fail(content, duration, onClose, mask)
  }

  static loading = (content?: string, mask?: boolean = false, duration?: number = 1, onClose?: () => void | undefined, ) => {
    Toast.loading(content, duration, onClose, mask)
  }

  static offline = (content: string, mask?: boolean = false, duration?: number = 1, onClose?: () => void | undefined, ) => {
    Toast.offline(content, duration, onClose, mask)
  }

  static remove = (t: any) => {
    Portal.remove(t)
  }
}


export {CustomToast}