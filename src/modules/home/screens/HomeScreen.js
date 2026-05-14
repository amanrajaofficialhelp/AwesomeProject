import { useEffect } from 'react';
import { Button, StatusBar, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    cancelAllTriggerNotifications,
    getAllTriggerNotifications,
    getBadgeCount,
    onCreateAlarmNotification,
    onCreateIntervalTriggerNotification,
    onCreateTriggerNotification,
    onDisplayNotification,
    setupForegroundHandler
} from '../../../shared/services/notifeeService';

const HomeScreen = () => {
    console.log('Home component rendered at', new Date()?.toLocaleTimeString())

    const safeAreaInsets = useSafeAreaInsets();

    // Subscribe to events
    useEffect(() => {
        getAllTriggerNotifications()
        getBadgeCount()
        const unsubscribe = setupForegroundHandler();
        return () => unsubscribe();
    }, []);

    return (
        <View style={[styles.container, { paddingTop: safeAreaInsets.top + 20, paddingHorizontal: 20 }]}>
            <StatusBar barStyle={'dark-content'} backgroundColor='white' />

            <Button title="Display Notification" onPress={onDisplayNotification} />
            <Button title="Create Trigger Notification" onPress={() => onCreateTriggerNotification()} />
            <Button title="Create Trigger Alarm Manager Notification" onPress={() => onCreateTriggerNotification(true)} />
            <Button title="Create Interval Trigger (15 minutes)" onPress={() => onCreateIntervalTriggerNotification()} />
            <Button title='Cancle all trigger notification' onPress={cancelAllTriggerNotifications} />

            <Button title="Create Alarm Notification" onPress={onCreateAlarmNotification} />
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    resultContainer: {
        marginTop: 30,
        padding: 15,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
});