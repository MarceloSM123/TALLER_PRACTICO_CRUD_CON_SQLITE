import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';

import { SQLiteProvider } from 'expo-sqlite';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { Suspense } from 'react';
import { initDatabase } from './src/database/db';
import ListaScreen from './src/screens/ListaScreen';
import FormularioScreen from './src/screens/FormularioScreen';
import { colores } from './src/theme';

const Stack = createNativeStackNavigator();

const temaNavegacion = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colores.crema,
    card: colores.crema,
    text: colores.tinta,
    primary: colores.pimenton,
    border: colores.borde,
  },
};

export default function App() {
  return (
    <Suspense
      fallback={
        <View style={estilos.carga}>
          <StatusBar style="dark" />
          <ActivityIndicator size="large" color={colores.pimenton} />
          <Text style={estilos.cargaTexto}>Abriendo la libreta de cata…</Text>
        </View>
      }
    >
      <SQLiteProvider databaseName="BaseDatos.db" onInit={initDatabase} useSuspense>
        <NavigationContainer theme={temaNavegacion}>
          <Stack.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: colores.crema },
              headerTitleStyle: { color: colores.tinta, fontWeight: '700' },
              headerTintColor: colores.pimenton,
              headerShadowVisible: false,
              contentStyle: { backgroundColor: colores.crema },
            }}
          >
            <Stack.Screen
              name="Lista"
              component={ListaScreen}
              options={{ title: 'Cazador de Sabores' }}
            />
            <Stack.Screen
              name="Formulario"
              component={FormularioScreen}
              options={{ title: 'Nueva degustacion' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SQLiteProvider>
    </Suspense>
  );
}

const estilos = StyleSheet.create({
  carga: {
    flex: 1,
    backgroundColor: colores.crema,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  cargaTexto: {
    color: colores.tintaSuave,
    fontSize: 15,
  },
});