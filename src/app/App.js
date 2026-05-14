import { SafeAreaProvider } from 'react-native-safe-area-context'
import Navigator from './Navigator'

const App = () => {
    console.log('App component rendered at', new Date()?.toLocaleTimeString())
    return (
        <SafeAreaProvider>
            <Navigator />
        </SafeAreaProvider>
    )
}

export default App