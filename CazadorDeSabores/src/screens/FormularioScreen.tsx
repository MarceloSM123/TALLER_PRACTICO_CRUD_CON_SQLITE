import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ScrollView, Pressable,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSQLiteContext } from 'expo-sqlite';
import { Ionicons } from '@expo/vector-icons';
import { colores, sombra, radio } from '../theme';

export default function FormularioScreen({ navigation, route }: any) {
    const db = useSQLiteContext();

    const idEdicion = route.params?.id;
    const tituloEdicion = route.params?.tituloActual || '';
    const califEdicion = route.params?.calificacionActual?.toString() || '';
    const comenEdicion = route.params?.comentariosActuales || '';

    const [titulo, setTitulo] = useState(tituloEdicion);
    const [calificacion, setCalificacion] = useState(califEdicion);
    const [comentarios, setComentarios] = useState(comenEdicion);
    const [fotoPreview, setFotoPreview] = useState<string | null>(null);

    const abrirCamara = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            return Alert.alert('Permiso necesario', 'Necesitamos la cámara para fotografiar tu plato');
        }
        const result = await ImagePicker.launchCameraAsync({ base64: true, quality: 0.4 });
        if (!result.canceled && result.assets[0].base64) {
            setFotoPreview(result.assets[0].base64);
        }
    };

    const guardarRegistro = async () => {
        if (!titulo || !calificacion || !fotoPreview) {
            return Alert.alert('Faltan detalles', 'Completa el plato, la puntuación y toma una foto');
        }
        const fechaActual = new Date().toLocaleDateString();
        try {
            if (idEdicion) {
                await db.runAsync(
                    'UPDATE registros SET titulo=?, calificacion=?, comentarios=?, fotoBase64=?, fecha=? WHERE id=?',
                    [titulo, Number(calificacion), comentarios, fotoPreview, fechaActual, idEdicion],
                );
            } else {
                await db.runAsync(
                    'INSERT INTO registros(titulo, calificacion, comentarios, fotoBase64, fecha) VALUES(?,?,?,?,?)',
                    [titulo, Number(calificacion), comentarios, fotoPreview, fechaActual],
                );
            }
            Alert.alert('Guardado', 'Se guardo exitosamente');
            navigation.goBack();
        } catch (error) {
            Alert.alert('No se pudo guardar', 'Reintenta en unos segundos');
        }
    };

    return (
        <ScrollView
            style={estilos.pantalla}
            contentContainerStyle={estilos.contenido}
            keyboardShouldPersistTaps="handled"
        >
            <Text style={estilos.eyebrow}>{idEdicion ? 'Actualizar probada' : 'Nueva probada'}</Text>

            <Text style={estilos.etiqueta}>¿Qué o dónde probaste?</Text>
            <TextInput
                style={estilos.input}
                placeholder="Ej: encebollado en El Palacio"
                placeholderTextColor={colores.tintaSuave}
                value={titulo}
                onChangeText={setTitulo}
            />

            <Text style={estilos.etiqueta}>Puntuación</Text>
            <View style={estilos.chipsFila}>
                {Array.from({ length: 11 }, (_, i) => i).map((n) => {
                    const activo = calificacion === n.toString();
                    return (
                        <Pressable
                            key={n}
                            onPress={() => setCalificacion(n.toString())}
                            style={[estilos.chip, activo && estilos.chipActivo]}
                        >
                            <Text style={[estilos.chipTexto, activo && estilos.chipTextoActivo]}>{n}</Text>
                        </Pressable>
                    );
                })}
            </View>

            <Text style={estilos.etiqueta}>Notas de cata</Text>
            <TextInput
                style={[estilos.input, estilos.inputMultilinea]}
                placeholder="Sabor, textura, ambiente…"
                placeholderTextColor={colores.tintaSuave}
                multiline
                value={comentarios}
                onChangeText={setComentarios}
            />

            <Text style={estilos.etiqueta}>Fotografía</Text>
            <TouchableOpacity style={estilos.zonaFoto} onPress={abrirCamara}>
                {fotoPreview ? (
                    <Image
                        source={{ uri: `data:image/jpeg;base64,${fotoPreview}` }}
                        style={estilos.fotoPreview}
                        resizeMode="cover"
                    />
                ) : (
                    <>
                        <Ionicons name="camera-outline" size={40} color={colores.miel} />
                        <Text style={estilos.zonaFotoTexto}>Toca para fotografiar tu plato</Text>
                    </>
                )}
            </TouchableOpacity>

            <TouchableOpacity style={estilos.btnGuardar} onPress={guardarRegistro}>
                <Ionicons name="save-outline" size={20} color="#FFFFFF" />
                <Text style={estilos.btnGuardarTexto}>
                    {idEdicion ? 'Guardar cambios' : 'Guardar en mi libreta'}
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const estilos = StyleSheet.create({
    pantalla: { flex: 1, backgroundColor: colores.crema },
    contenido: { padding: 20, paddingBottom: 48 },
    eyebrow: {
        fontSize: 12,
        letterSpacing: 2,
        textTransform: 'uppercase',
        color: colores.pimenton,
        fontWeight: '700',
        marginBottom: 4,
    },
    etiqueta: {
        fontSize: 13,
        fontWeight: '700',
        color: colores.tinta,
        marginTop: 20,
        marginBottom: 8,
    },
    input: {
        backgroundColor: colores.superficie,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colores.borde,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 16,
        color: colores.tinta,
    },
    inputMultilinea: { minHeight: 90, textAlignVertical: 'top' },
    chipsFila: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colores.superficie,
        borderWidth: 1,
        borderColor: colores.borde,
        alignItems: 'center',
        justifyContent: 'center',
    },
    chipActivo: { backgroundColor: colores.pimenton, borderColor: colores.pimenton },
    chipTexto: { fontSize: 15, fontWeight: '700', color: colores.tintaSuave },
    chipTextoActivo: { color: '#FFFFFF' },
    zonaFoto: {
        borderWidth: 2,
        borderColor: colores.borde,
        borderStyle: 'dashed',
        borderRadius: radio,
        backgroundColor: colores.superficie,
        minHeight: 180,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    zonaFotoTexto: { marginTop: 10, fontSize: 14, color: colores.tintaSuave },
    fotoPreview: { width: '100%', height: 220 },
    btnGuardar: {
        marginTop: 28,
        backgroundColor: colores.pimenton,
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
        ...sombra,
    },
    btnGuardarTexto: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});