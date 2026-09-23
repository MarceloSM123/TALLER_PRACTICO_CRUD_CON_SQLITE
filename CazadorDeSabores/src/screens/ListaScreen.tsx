import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native'
import { useSQLiteContext } from 'expo-sqlite'
import { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import FormularioScreen from './FormularioScreen'

type Registro = {
    id: number,
    titulo: string,
    calificacion: number,
    comentarios: string,
    fotoBase64: string,
    fecha: string
}

export default function ListaScreen({ navigation }: any) {

    const db = useSQLiteContext();
    const [registro, setRegistro] = useState<Registro[]>([]);

    const cargarRegistro = async () => {
        const resultado = await db.getAllAsync<Registro>('SELECT * FROM registros ORDER BY id DESC');
        setRegistro(resultado)
    }

    useEffect(() => {
        const unsuscribe = navigation.addListener("focus", () => {
            cargarRegistro();
            
        })
        return unsuscribe
    }, [navigation])

    const borrarRegistro = async (id: number) => {
        await db.runAsync("DELETE FROM registros WHERE id=?", [id]);
        cargarRegistro();
    }
return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={registro}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (

                    <View>
                        <View>
                            <Image
                                source={{ uri: `data:image/jpeg;base64,${item.fotoBase64}` }}
                                style={{ width: 80, height: 80 }}
                            />
                        </View>
                        <Text>{item.titulo}</Text>
                        <Text>{item.calificacion}</Text>
                        <Text>{item.comentarios}</Text>
                        <TouchableOpacity onPress={() => borrarRegistro(item.id)}>
                            <Ionicons name='trash' size={24} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Formulario', {
                            id: item.id,
                            tituloActual: item.titulo,
                            calificacionActual: item.calificacion,
                            comentariosActuales: item.comentarios
                        })}>
                            <Ionicons name='pencil' size={24} />
                        </TouchableOpacity>

                    </View>
                )}
            />
            <TouchableOpacity
                onPress={() => navigation.navigate('Formulario')}
                style={{
                    position: 'absolute',
                    right: 20,
                    bottom: 20,
                    backgroundColor: '#2196F3',
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    alignItems: 'center',
                    justifyContent: 'center',
                    elevation: 5,
                    shadowColor: '#000',
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    shadowOffset: { width: 0, height: 2 },
                }}
            >
                <Ionicons name='add' size={32} color='white' />
            </TouchableOpacity>
        </View>
    )
}