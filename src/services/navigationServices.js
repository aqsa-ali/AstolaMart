//Libraries
import { StackActions } from '@react-navigation/routers';
import { CommonActions } from '@react-navigation/native';
import * as React from 'react';
import { Keyboard } from 'react-native';

//Store
import { updateLoading } from '../store/User';
import { store } from '../store';

export const navigationRef = React.createRef();

export function navigate(name, params) {
    Keyboard.dismiss();
    // store.dispatch(updateLoading(false));
    navigationRef.current?.navigate(name, params);
}
export function goBack(params) {
    Keyboard.dismiss();
    // store.dispatch(updateLoading(false));
    return navigationRef.current?.goBack(params);
} 