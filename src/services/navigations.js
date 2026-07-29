//Libraries
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { navigationRef } from './navigationServices';
import Login from '../screens/Login';
import Signup from '../screens/Signup';
import Home from '../screens/Home';
import Products from '../screens/Products';
import ProductDetail from '../screens/ProductDetail';
import Cart from '../screens/Cart';

const Stack = createNativeStackNavigator();
const Navigations = () => {

    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator
                initialRouteName={'Login'}
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen
                    name={'Login'}
                    component={Login}
                />

                <Stack.Screen
                    name={'Signup'}
                    component={Signup}
                />

                <Stack.Screen
                    name={'Home'}
                    component={Home}
                />

                <Stack.Screen
                    name={'Products'}
                    component={Products}
                />

                <Stack.Screen
                    name={'ProductDetail'}
                    component={ProductDetail}
                />

                <Stack.Screen
                    name={'Cart'}
                    component={Cart}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Navigations;