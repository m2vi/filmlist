import notifications from '@utils/notifications/api';
import { useEffect } from 'react';

const NotificationWrapper = () => {
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);

    if (searchParams.get('e')) console.log(notifications.error(searchParams.get('e')));
  }, []);

  return null;
};

export default NotificationWrapper;
