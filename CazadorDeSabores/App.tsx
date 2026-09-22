import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';

import { SQLiteProvider } from 'expo-sqlite';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { initDatabase } from './src/database/db';
import ListaScreen from './src/screens/ListaScreen';
import FormularioScreen from './src/screens/FormularioScreen';

const Stack = createNativeStackNavigator();

export default function App() {

  const [dbLista, setDbLista] = useState(false);
  useEffect(() => {
    const prepDb = async () => {
      await initDatabase();
      setDbLista(true)
    };
    prepDb();
  }, [])

  if (!dbLista) {
    return (
      <View>
        <ActivityIndicator size={'large'} color={'blue'} />
        <Text> Cargando base de datos</Text>
      </View>
    )
  }
  return (
    <SQLiteProvider databaseName='BaseDatos.db'>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name='Lista'
            component={ListaScreen}
            options={{ title: 'Lista' }}
          />
          <Stack.Screen
            name='Formulario'
            component={FormularioScreen}
            options={{ title: 'Formulario' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SQLiteProvider>
  );
}


