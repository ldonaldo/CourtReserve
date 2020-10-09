import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as StoreProvider } from 'react-redux';
import { StyleSheet, Text, View } from 'react-native';
import App from './App'

export default function Main() {
  return(
      <PaperProvider>
        <App />
      </PaperProvider>
  )  
}