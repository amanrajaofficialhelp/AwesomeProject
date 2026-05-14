import { Platform } from 'react-native';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { startSpeechToText as nativeStartSpeechToText } from 'react-native-voice-to-text';

/** Helper function */
const askPermission = async (perm) => {
    const status = await check(perm);

    if (status === RESULTS.GRANTED) return true;
    if (status === RESULTS.BLOCKED || status === RESULTS.UNAVAILABLE) return false;

    const req = await request(perm);
    return req === RESULTS.GRANTED;
};

const requestMicrophonePermission = () => {
    return askPermission(
        Platform.OS === 'android'
            ? PERMISSIONS.ANDROID.RECORD_AUDIO
            : PERMISSIONS.IOS.MICROPHONE
    );
};

const startSpeechToText = async () => {
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) {
        throw new Error('Microphone permission not granted');
    }
    return nativeStartSpeechToText();
};

/**
 * Example Usage in a React Component:
 * 
 * import { useState } from 'react';
 * import { Button, Text, View } from 'react-native';
 * import { startSpeechToText } from 'path/to/rnVoiceToTextService';
 * 
 * const VoiceComponent = () => {
 *     const [results, setResults] = useState('');
 *     const [isListening, setIsListening] = useState(false);
 * 
 *     const handleSpeechPress = async () => {
 *         try {
 *             setIsListening(true);
 *             setResults(''); 
 *             const text = await startSpeechToText();
 *             setResults(text);
 *         } catch (error) {
 *             console.error('Speech error:', error);
 *         } finally {
 *             setIsListening(false);
 *         }
 *     };
 * 
 *     return (
 *         <View>
 *             <Button 
 *                 title={isListening ? 'Listening...' : 'Start'} 
 *                 onPress={handleSpeechPress} 
 *                 disabled={isListening} 
 *             />
 *             <Text>{results}</Text>
 *         </View>
 *     );
 * };
 */

export {
    requestMicrophonePermission,
    startSpeechToText
}