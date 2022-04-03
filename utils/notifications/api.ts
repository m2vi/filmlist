import { ReactText } from 'react';
import { toast, ToastContent } from 'react-toastify';

class Notifications {
  info(content: ToastContent): ReactText {
    return toast(content, { type: 'info', icon: false, closeButton: false, toastId: content?.toString() });
  }

  error(content: ToastContent): ReactText {
    return toast(content, { type: 'error', icon: false, closeButton: false, toastId: content?.toString() });
  }
}

export const notifications = new Notifications();
export default notifications;
