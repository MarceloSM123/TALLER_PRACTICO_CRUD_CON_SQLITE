import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSQLiteContext } from 'expo-sqlite';
import { Ionicons } from '@expo/vector-icons';



export default function FormularioScreen({ navigation, route }: any) {
    const db = useSQLiteContext();
    // Extraemos los parmetros de forma segura (usando ? por si estan vacios)
    const idEdicion = route.params?.id;
    const tituloEdicion = route.params?.tituloActual || '';
    const califEdicion = route.params?.calificacionActual?.toString()
        || '';
    const comenEdicion = route.params?.comentariosActuales || '';
    // Inicializamos los estados con esos valores (Estarn vacos si estamos creando uno nuevo)
    const [titulo, setTitulo] = useState(tituloEdicion);
    const [calificacion, setCalificacion] = useState(califEdicion);
    const [comentarios, setComentarios] = useState(comenEdicion);

    const [fotoPreview, setFotoPreview] = useState<string | null>(null);

    const abrirCamara = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();

        if (status !== 'granted') return Alert.alert('Error', 'Permiso denegado')

        const result = await ImagePicker.launchCameraAsync({
            base64: true,
            quality: 0.3
        })

        if (!result.canceled && result.assets[0].base64) {
            setFotoPreview(result.assets[0].base64)
        }
    }

    const guardarRegistro=async()=>{
    if(!titulo || !fotoPreview||!calificacion){
        return Alert.alert("Error", "Falta el titulo, calificacion o una foto")
    }

    const fechaActual = new Date().toLocaleDateString();
    try {
    
    !idEdicion ?await db.runAsync(
        'INSERT INTO registros(titulo, calificacion, comentarios,fotoBase64,fecha) VALUES(?,?,?,?,?)'
        ,[titulo, Number(calificacion), comentarios,fotoPreview, fechaActual]
    ):await db.runAsync(
      'UPDATE registros SET titulo=?, calificacion=?, comentarios=?, fotoBase64=?, fecha=? WHERE id=?',
      [titulo, Number(calificacion), comentarios, fotoPreview, fechaActual, idEdicion]);

    Alert.alert("Exito", "Viaje Guardado con Exito")
    navigation.goBack();
} catch (error) {
    Alert.alert('Error', 'No se pudo guardar');
}
    }



    return (
        <View>
<Text>Cuentanos cazador de sabores</Text>
<TextInput
    placeholder="Ej: El palacio del encebollado"
    value={titulo}
    onChangeText={setTitulo}
/>
<TextInput
    value={comentarios}
    onChangeText={setComentarios}
/>
<TextInput
placeholder="minimo 0 maximo 10"
keyboardType="numeric"
    value={calificacion}
    onChangeText={setCalificacion}
/>

<TouchableOpacity onPress={abrirCamara} >
    <Ionicons name='camera' size={25}/>
</TouchableOpacity>
{fotoPreview && (
    <Image source={{uri:`data:image/jpeg;base64,${fotoPreview}`}} />
)}
<TouchableOpacity onPress={guardarRegistro} >
    <Ionicons name='save' size={20}/>
</TouchableOpacity>
        </View>
    )
}