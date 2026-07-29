import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Navigations from '../AstolaMart/src/services/navigations'
import { persistor, store } from './src/store'
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Navigations />
      </PersistGate>
    </Provider>
  )
}

export default App

// const styles = StyleSheet.create({})