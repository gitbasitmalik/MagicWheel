import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Signup from './Signup';
import LoginScreen from './LoginScreen';
import AppIntro from './AppIntro';
import ForgetPassword from './ForgetPassword';
import Home from './Home';
import ProductDetail from './ProductDetail';
import Cart from './Cart';
import AdminNavigator from './Admin/AdminNavigator';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AppIntro" screenOptions={{ headerShown: false }}>
         <Stack.Screen name="Login" component={LoginScreen} screenOptions={{ headerShown: true }} />
        <Stack.Screen name="AppIntro" component={AppIntro} />
        <Stack.Screen name='ProductDetail' component={ProductDetail}/>
        <Stack.Screen name="Admin" component={AdminNavigator} /> 
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Cart" component={Cart} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Forget" component={ForgetPassword} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
