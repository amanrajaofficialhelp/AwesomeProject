import notifee, { AlarmType, AndroidCategory, AndroidImportance, AndroidNotificationSetting, AndroidVisibility, EventType, RepeatFrequency, TimeUnit, TriggerType } from '@notifee/react-native';

const initializeNotifications = async () => {
    // Request permissions (required for iOS)
    await notifee.requestPermission({ sound: true, alert: true, badge: true });

    // Create a channel (required for Android)
    return await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        vibration: true,
        sound: 'default',
        importance: AndroidImportance.HIGH,
        bypassDnd: true,
        badge: true,
        // visibility: AndroidVisibility.PUBLIC,
    });
};

export const onDisplayNotification = async () => {
    const channelId = await initializeNotifications();

    // Display a notification
    await notifee.displayNotification({
        title: 'Notification Title',
        body: 'This is display notification.',
        android: {
            channelId,
            smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
            pressAction: {
                id: 'default',
            },
        },
    });
};

export const getBadgeCount = async () => {
    const count = await notifee.getBadgeCount();
    console.log('Current badge count: ', count);
    return count;
};

export const getAllTriggerNotifications = async () => {
    const ids = await notifee.getTriggerNotificationIds();
    console.log('All trigger notifications: ', ids);
    return ids;
};

export const cancelAllTriggerNotifications = async () => {
    await notifee.cancelTriggerNotifications();
    await getAllTriggerNotifications();
};

export const onCreateTriggerNotification = async (useAlarmManager = false) => {
    const channelId = await initializeNotifications();

    // Check if the app has permission to create trigger notifications
    if (useAlarmManager) {
        const settings = await notifee.getNotificationSettings();
        if (settings.android.alarm !== AndroidNotificationSetting.ENABLED) {
            await notifee.openAlarmPermissionSettings();
            return;
        }
    }

    const date = new Date(Date.now());
    date.setSeconds(date.getSeconds() + 10);

    // Create a time-based trigger
    const trigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: date.getTime(),
        // repeatFrequency: RepeatFrequency.HOURLY,

        // On Android, you have the option to create your trigger notification with Android's AlarmManger API:
        alarmManager: useAlarmManager ? {
            type: AlarmType.SET_EXACT_AND_ALLOW_WHILE_IDLE,
            allowWhileIdle: true,
        } : false,
    };

    // Create a trigger notification
    await notifee.createTriggerNotification(
        {
            title: 'Timestamp Trigger Notification',
            body: 'This notification was triggered 10 seconds after being set.',
            android: {
                channelId: channelId,
            },
        },
        trigger,
    );
};

export const onCreateIntervalTriggerNotification = async () => {
    const channelId = await initializeNotifications();

    // Create an interval-based trigger
    const trigger = {
        type: TriggerType.INTERVAL,
        interval: 15,
        timeUnit: TimeUnit.MINUTES,
    };

    // Create a trigger notification
    await notifee.createTriggerNotification(
        {
            title: 'Interval Trigger Notification',
            body: 'This notification repeats every 15 minutes',
            android: {
                channelId: channelId,
            },
        },
        trigger,
    );
};

export const onCreateAlarmNotification = async () => {
    const channelId = await initializeNotifications();

    // Check Alarm Permission (Android 12+)
    const settings = await notifee.getNotificationSettings();
    if (settings.android.alarm !== AndroidNotificationSetting.ENABLED) {
        await notifee.openAlarmPermissionSettings();
        return;
    }

    const date = new Date(Date.now());
    date.setSeconds(date.getSeconds() + 10); // Alarm triggers in 10 seconds

    const trigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: date.getTime(),
        alarmManager: {
            type: AlarmType.SET_EXACT_AND_ALLOW_WHILE_IDLE,
        },
    };

    await notifee.createTriggerNotification(
        {
            title: '⏰ Alarm!',
            body: 'This is your alarm. Tap "Stop" to silence it.',
            android: {
                channelId,
                category: AndroidCategory.ALARM,
                importance: AndroidImportance.HIGH,
                loopSound: true, // Keep ringing
                ongoing: true,   // Prevent swiping away
                fullScreenAction: {
                    id: 'default',
                },
                actions: [
                    {
                        title: 'Stop Alarm',
                        pressAction: {
                            id: 'stop',
                        },
                    },
                ],
            },
        },
        trigger,
    );
};

export const cancelNotification = async (notificationId) => {
    await notifee.cancelNotification(notificationId);
};

export const setupForegroundHandler = () => {
    return notifee.onForegroundEvent(async ({ type, detail }) => {
        switch (type) {
            case EventType.DISMISSED:
                console.log('User dismissed foreground notification', detail.notification);
                break;
            case EventType.PRESS:
                console.log('User pressed foreground notification', detail.notification);
                break;
            case EventType.ACTION_PRESS:
                if (detail.pressAction.id === 'stop') {
                    await notifee.cancelNotification(detail.notification.id);
                }
                break;
            case EventType.TRIGGER_NOTIFICATION_CREATED:
                console.log('Trigger notification created in foreground', detail.notification);
                break;
            case EventType.DELIVERED:
                console.log('Trigger notification delivered in foreground', detail.notification);
                break;
            default:
                console.log('User triggered other event in foreground', type, detail.notification);
                break;
        }
    });
};

export const registerBackgroundHandler = () => {
    notifee.onBackgroundEvent(async ({ type, detail }) => {
        switch (type) {
            case EventType.DISMISSED:
                console.log('User dismissed background notification', detail.notification);
                break;
            case EventType.PRESS:
                console.log('User pressed background notification', detail.notification);
                break;
            case EventType.ACTION_PRESS:
                if (detail.pressAction.id === 'stop') {
                    await notifee.cancelNotification(detail.notification.id);
                }
                break;
            case EventType.DELIVERED:
                console.log('Trigger notification delivered in background', detail.notification);
                break;
            default:
                console.log('User triggered other event in background', type, detail.notification);
                break;
        }
    });
};