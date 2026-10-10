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
import AddProduct from '../screens/AddProduct';
import Orders from '../screens/Orders';
import AdminDashboard from '../screens/AdminDashboard';
import Categories from '../screens/Categories';
import AddCategory from '../screens/AddCategory';
import Subcategories from '../screens/Subcategories';
import VersionModal from '../components/VersionModal'
import { useEffect, useState } from 'react';
import {getForceUpdate} from '../services/remoteConfig'

const Stack = createNativeStackNavigator();
const Navigations = () => {
    const [updateMessage, setUpdateMessage] = useState(null);

    useEffect(() => {
        const checkVersion = async () => {
          const message = await getForceUpdate();
      
          console.log('Force update result =>', message);
      
          if (message) {
            console.log('Setting update message =>', message);
            setUpdateMessage(message);
          }
        };
      
        checkVersion();
      }, []);

      return (
        <>
          <NavigationContainer ref={navigationRef}>
            <Stack.Navigator
              initialRouteName="Login"
              screenOptions={{headerShown: false}}
            >
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Signup" component={Signup} />
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="Products" component={Products} />
              <Stack.Screen name="ProductDetail" component={ProductDetail} />
              <Stack.Screen name="Cart" component={Cart} />
              <Stack.Screen name="AddProduct" component={AddProduct} />
              <Stack.Screen name="Orders" component={Orders} />
              <Stack.Screen
                name="AdminDashboard"
                component={AdminDashboard}
              />
              <Stack.Screen name="Categories" component={Categories} />
              <Stack.Screen name="AddCategory" component={AddCategory} />
              <Stack.Screen name="Subcategories" component={Subcategories} />
            </Stack.Navigator>
          </NavigationContainer>
      
          <VersionModal
            visible={!!updateMessage}
            message={updateMessage || ''}
          />
        </>
      );
};

export default Navigations;