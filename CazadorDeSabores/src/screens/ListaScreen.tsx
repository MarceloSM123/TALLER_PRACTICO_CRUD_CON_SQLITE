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
            return unsuscribe
        })
    }, [navigation])

    const borrarRegistro = async (id: number) => {
        await db.runAsync("DELETE FROM registros WHERE id=?", [id]);
        cargarRegistro();
    }
    return (
        <View>
            <FlatList
                data={registro}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (

                    <View>
                        <View>
                            <Image
                                source={{ uri: `data: image/jpeg;base64, ${item.fotoBase64}` }}
                                style={{ width: 80, height: 80 }}
                            />
                        </View>
                        <Text>{item.titulo}</Text>
                        <Text>{item.calificacion}</Text>
                        <Text>{item.comentarios}</Text>
                        <TouchableOpacity onPress={() => borrarRegistro}>
                            <Ionicons name='trash' size={24} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('FormularioScreen')}>
                            <Ionicons name='add' size={24} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('FormularioScreen')}>
                            <Ionicons name='pencil' size={24} />
                        </TouchableOpacity>

                    </View>
                )}
            />
        </View>
    )
}