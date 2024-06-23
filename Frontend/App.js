import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Signup from './Signup';
import LoginScreen from './LoginScreen';
import AppIntro from './AppIntro';
import ForgetPassword from './ForgetPassword';
import Home from './Home';
import Admin from './Admin';
import ProductDetail from './ProductDetail';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AppIntro">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="AppIntro" component={AppIntro} />
        <Stack.Screen name='ProductDetail' component={ProductDetail}/>
        <Stack.Screen name="Admin" component={Admin} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Forget" component={ForgetPassword} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
