import React, { useCallback, useEffect, useState } from 'react';
import { Text, View, FlatList, TouchableOpacity, TextInput } from 'react-native';
import estilos from './estilos';
import { pegarRepositorioDoUsuario } from '../../servicos/requisicoes/repositorios';
import { pegarRepositorioDoUsuarioPorNome } from '../../servicos/requisicoes/repositorios';
import { useIsFocused } from '@react-navigation/native';

export default function Repositorios({ route, navigation }) {
    const [repo, setRepo] = useState([]);
    const [nomeRepo, setNomeRepo] = useState('');
    const [todosRepositorios, setTodosRepositorios] = useState([]);
    const estaNaTela = useIsFocused()

    useEffect(async () => {
        const resultado = await pegarRepositorioDoUsuario(route.params.id)
        setRepo(resultado)
        setTodosRepositorios(resultado)
    }, [estaNaTela])

    useEffect(async () => {
        const resultado = await pegarRepositorioDoUsuarioPorNome(route.params.id, nomeRepo)
        console.log(resultado)
        if (resultado !== undefined){
            setRepo([resultado])
        }else{
            setRepo(await pegarRepositorioDoUsuario(route.params.id))
        }
    }, [nomeRepo])

    return (
        <View style={estilos.container}>
                <Text style={estilos.repositoriosTexto}>{repo.length} repositórios criados</Text>
                <TouchableOpacity 
                    style={estilos.botao}
                    onPress={() => navigation.navigate('CriarRepositorio', {id: route.params.id})}
                >
                    <Text style={estilos.textoBotao}>Adicionar novo repositório</Text>
                </TouchableOpacity>

                <TextInput
                    placeholder="Busque por um repositório"
                    autoCapitalize="none"
                    style={estilos.entrada}
                    value = {nomeRepo}
                    onChangeText={setNomeRepo}
                />

                <FlatList
                    data={repo}
                    style={{width: '100%'}}
                    keyExtractor={repo => repo.id}
                    renderItem={({item}) => (
                        <TouchableOpacity                             
                            style={estilos.repositorio}
                            onPress={() => navigation.navigate('InfoRepositorio', {item})}
                        >
                            
                            <Text style={estilos.repositorioNome}>{item.name}</Text>
                            <Text style={estilos.repositorioData}>Atualizado em {item.data}</Text>

                        </TouchableOpacity>
                    )}>

                </FlatList>
        </View>
    );
}
