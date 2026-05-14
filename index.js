/**
 * @format
 */

import './src/shared/utils/logger'
import { registerBackgroundHandler } from './src/shared/services/notifeeService';
registerBackgroundHandler();

import { AppRegistry } from 'react-native';
import App from './src/app/App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);