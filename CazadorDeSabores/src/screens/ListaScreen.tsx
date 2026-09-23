import { View, Text, TouchableOpacity, Image, FlatList, StyleSheet, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSQLiteContext } from 'expo-sqlite'
import { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { colores, sombra, radio } from '../theme'

type Registro = {
    id: number;
    titulo: string;
    calificacion: number;
    comentarios: string;
    fotoBase64: string;
    fecha: string;
}

function Estrellas({ puntos }: { puntos: number }) {
    const enteras = Math.floor(puntos / 2);
    const mitad = puntos % 2 === 1;

    return (
        <View style={estilos.estrellas}>
            {[0, 1, 2, 3, 4].map((i) => (
                <Ionicons
                    key={i}
                    name={i < enteras ? 'star' : i === enteras && mitad ? 'star-half' : 'star-outline'}
                    size={14}
                    color={colores.miel}
                />
            ))}
            <Text style={estilos.puntos}>{puntos}/10</Text>
        </View>
    );
}

export default function ListaScreen({ navigation }: any) {
    const db = useSQLiteContext();
    const [registro, setRegistro] = useState<Registro[]>([]);

    const cargarRegistro = async () => {
        const resultado = await db.getAllAsync<Registro>('SELECT * FROM registros ORDER BY id DESC');
        setRegistro(resultado);
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => { cargarRegistro(); });
        return unsubscribe;
    }, [navigation]);

    const borrarRegistro = (id: number) => {
        Alert.alert('Eliminar cata', '¿Quitar esta probada de tu libreta?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Eliminar',
                style: 'destructive',
                onPress: async () => {
                    await db.runAsync('DELETE FROM registros WHERE id = ?', [id]);
                    cargarRegistro();
                },
            },
        ]);
    };

    const vacio = (
        <View style={estilos.vacio}>
            <Ionicons name="restaurant-outline" size={52} color={colores.miel} />
            <Text style={estilos.vacioTitulo}>Aún no has probado nada</Text>
            <Text style={estilos.vacioDesc}>
                Tu libreta de cata está vacía. Toca el botón + y guarda el primer plato que te sorprenda.
            </Text>
        </View>
    );

    return (
        <View style={estilos.pantalla}>
            <FlatList
                data={registro}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={estilos.lista}
                ListHeaderComponent={
                    <View style={estilos.cabecera}>
                        <Text style={estilos.eyebrow}>Cuaderno de cata</Text>
                        <Text style={estilos.tituloPantalla}>Mis degustaciones </Text>
                    </View>
                }
                ListEmptyComponent={vacio}
                renderItem={({ item }) => (
                    <View style={estilos.tarjeta}>
                        <Image
                            source={{ uri: `data:image/jpeg;base64,${item.fotoBase64}` }}
                            style={estilos.foto}
                        />
                        <View style={estilos.cuerpo}>
                            <Text style={estilos.nombrePlato} numberOfLines={1}>{item.titulo}</Text>
                            <Estrellas puntos={item.calificacion} />
                            {item.comentarios?.length > 0 && (
                                <Text style={estilos.comentarios} numberOfLines={2}>{item.comentarios}</Text>
                            )}
                            <View style={estilos.filaPie}>
                                <Text style={estilos.fecha}>{item.fecha}</Text>
                                <View style={estilos.acciones}>
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate('Formulario', {
                                            id: item.id,
                                            tituloActual: item.titulo,
                                            calificacionActual: item.calificacion,
                                            comentariosActuales: item.comentarios,
                                        })}
                                        style={estilos.botonAccion}
                                    >
                                        <Ionicons name="pencil" size={16} color={colores.aceituna} />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => borrarRegistro(item.id)}
                                        style={estilos.botonAccion}
                                    >
                                        <Ionicons name="trash-outline" size={16} color={colores.pimenton} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                )}
            />
            <SafeAreaView style={estilos.contenedorFlotante} edges={['bottom']} pointerEvents="box-none">
                <TouchableOpacity
                    style={estilos.botonFlotante}
                    onPress={() => navigation.navigate('Formulario')}
                >
                    <Ionicons name="add" size={32} color="#FFFFFF" />
                </TouchableOpacity>
            </SafeAreaView>
        </View>
    );
}

const estilos = StyleSheet.create({
    pantalla: { flex: 1, backgroundColor: colores.crema },
    lista: { padding: 16, paddingBottom: 100, flexGrow: 1 },
    cabecera: { marginBottom: 16 },
    eyebrow: {
        fontSize: 12,
        letterSpacing: 2,
        textTransform: 'uppercase',
        color: colores.pimenton,
        fontWeight: '700',
        marginBottom: 4,
    },
    tituloPantalla: {
        fontSize: 28,
        fontWeight: '800',
        color: colores.tinta,
    },
    tarjeta: {
        flexDirection: 'row',
        backgroundColor: colores.tarjeta,
        borderRadius: radio,
        padding: 12,
        marginBottom: 14,
        ...sombra,
    },
    foto: { width: 88, height: 88, borderRadius: 12, backgroundColor: colores.borde },
    cuerpo: { flex: 1, marginLeft: 12, justifyContent: 'space-between' },
    nombrePlato: { fontSize: 16, fontWeight: '700', color: colores.tinta, marginBottom: 6 },
    estrellas: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 2 },
    puntos: { marginLeft: 6, fontSize: 12, color: colores.tintaSuave, fontWeight: '600' },
    comentarios: { fontSize: 13, color: colores.tintaSuave, marginBottom: 6, lineHeight: 18 },
    filaPie: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    fecha: { fontSize: 12, color: colores.tintaSuave },
    acciones: { flexDirection: 'row', gap: 10 },
    botonAccion: { padding: 4 },
    contenedorFlotante: {
        position: 'absolute',
        right: 20,
        bottom: 0,
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        pointerEvents: 'box-none',
    },
    botonFlotante: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: colores.pimenton,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        shadowColor: colores.pimentonOscuro,
        shadowOpacity: 0.4,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 6 },
        elevation: 6,
    },
    vacio: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, paddingBottom: 60 },
    vacioTitulo: { fontSize: 18, fontWeight: '700', color: colores.tinta, marginTop: 12, textAlign: 'center' },
    vacioDesc: { fontSize: 14, color: colores.tintaSuave, marginTop: 6, textAlign: 'center', lineHeight: 20 },
});