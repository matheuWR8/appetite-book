import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  ActivityIndicator, Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import api from '../../service/api';
import CardReceita from '../../components/CardReceita';

export default function Home({ navigation }) {
  const [receitas, setReceitas]     = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Recarrega a lista toda vez que a tela recebe foco
  // (cobre o caso de voltar após criar ou editar uma receita)
  useFocusEffect(
    useCallback(() => {
      carregarReceitas();
    }, [])
  );

  async function carregarReceitas() {
    try {
      setCarregando(true);
      const resposta = await api.get('/receitas');
      setReceitas(resposta.data);
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível carregar as receitas.');
    } finally {
      setCarregando(false);
    }
  }

  async function handleLogout() {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('usuario');
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  }

  // Botão de logout no header (lado direito)
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleLogout} style={styles.botaoLogout}>
          <MaterialCommunityIcons name="logout" size={22} color="#E8593A" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  function ListaVazia() {
    return (
      <View style={styles.listaVazia}>
        <MaterialCommunityIcons name="food-variant-off" size={56} color="#F2D9D0" />
        <Text style={styles.listaVaziaTexto}>Nenhuma receita ainda.</Text>
        <Text style={styles.listaVaziaSubtexto}>
          Toque no botão abaixo para adicionar a primeira!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {carregando ? (
        <ActivityIndicator
          size="large"
          color="#E8593A"
          style={styles.loading}
        />
      ) : (
        <FlatList
          data={receitas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <CardReceita
              receita={item}
              onPress={() => navigation.navigate('Detalhes', { id: item.id })}
            />
          )}
          ListEmptyComponent={ListaVazia}
          contentContainerStyle={[
            styles.lista,
            receitas.length === 0 && styles.listaFlex,
          ]}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Botão flutuante — nova receita */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('FormReceita', { inclusao: true })}
        activeOpacity={0.85}
      >
        <MaterialCommunityIcons name="plus-box-outline" size={28} color="#fff" />
        <View style={styles.fabIconePlaceholder} />
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F5',
  },
  loading: {
    flex: 1,
  },
  lista: {
    padding: 16,
  },
  listaFlex: {
    flexGrow: 1,
  },
  listaVazia: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    gap: 10,
  },
  listaVaziaIcone: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F2D9D0',
    marginBottom: 8,
  },
  listaVaziaTexto: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2B2B2B',
  },
  listaVaziaSubtexto: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  botaoLogout: {
    marginRight: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#E8593A',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#E8593A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },

});