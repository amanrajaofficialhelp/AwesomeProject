import HomeScreen from '../modules/home/screens/HomeScreen'

const Navigator = () => {
    console.log('Navigator component rendered at', new Date()?.toLocaleTimeString())
    return (
        <HomeScreen />
    )
}

export default Navigator