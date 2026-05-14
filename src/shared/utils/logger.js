import Config from 'react-native-config'

/**
 * Console Suppression Utility
 * ----------------------------
 * This utility silences all console logs if ENABLE_LOGS is set to "false" 
 * in the current environment's .env file.
 * 
 * It should be imported as early as possible in the app's entry point.
 */

if (Config.ENABLE_LOGS === 'false') {
    console.log = () => { }
    console.info = () => { }
    console.warn = () => { }
    console.error = () => { }
    console.debug = () => { }

    // Optionally suppress other console methods if needed
    // console.table = () => { }
    // console.group = () => { }
    // console.groupEnd = () => { }
}
