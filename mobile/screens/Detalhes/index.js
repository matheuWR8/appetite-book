import React, { useState, useEffect } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import api from '../../service/api';

export default function Detalhes({ route, navigation }) {
  const { id } = route.params;

  const [receita, setReceita]       = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [usuarioId, setUsuarioId]   = useState(null);

  useEffect(() => {
    carregarReceita();
    carregarUsuario();
  }, []);

  async function carregarReceita() {
    try {
      const resposta = await api.get(`/receitas/${id}`);
      setReceita(resposta.data);
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível carregar a receita.');
      navigation.goBack();
    } finally {
      setCarregando(false);
    }
  }

  async function carregarUsuario() {
    const dados = await AsyncStorage.getItem('usuario');
    if (dados) {
      const usuario = JSON.parse(dados);
      setUsuarioId(usuario.id);
    }
  }

  async function handleExcluir() {
    Alert.alert(
      'Excluir receita',
      `Tem certeza que deseja excluir "${receita.titulo}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/receitas/${id}`);
              navigation.goBack();
            } catch (err) {
              const mensagem = err.response?.data?.erro || 'Erro ao excluir receita.';
              Alert.alert('Erro', mensagem);
            }
          },
        },
      ]
    );
  }

  if (carregando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E8593A" />
      </View>
    );
  }

  if (!receita) return null;

  const imagemUri = receita.imagem
    ? `${api.defaults.baseURL}/uploads/${receita.imagem}`
    : null;

  const ehDono = receita.usuario_id === usuarioId;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Imagem */}
        {imagemUri ? (
          <Image
            source={{ uri: imagemUri }}
            style={styles.imagem}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagemPlaceholder}>
            <MaterialCommunityIcons name="image-off-outline" size={56} color="#D9BFB7" />
            <Text style={styles.imagemPlaceholderTexto}>Sem imagem</Text>
          </View>
        )}

        <View style={styles.corpo}>

          {/* Título e categoria */}
          <Text style={styles.titulo}>{receita.titulo}</Text>

          <View style={styles.tagRow}>
            <View style={styles.tag}>
              <MaterialCommunityIcons name="chef-hat" size={13} color="#E8593A" style={styles.tagIcone} />
              <Text style={styles.tagTexto}>{receita.categoria}</Text>
            </View>
            <View style={styles.tag}>
              <MaterialCommunityIcons name="clock-time-four-outline" size={13} color="#E8593A" style={styles.tagIcone} />
              <Text style={styles.tagTexto}>{receita.tempo}</Text>
            </View>
          </View>

          {/* Divisor */}
          <View style={styles.divisor} />

          {/* Ingredientes */}
          <View style={styles.secao}>
            <View style={styles.secaoTituloRow}>
              <MaterialCommunityIcons name="food-variant" size={18} color="#E8593A" />
              <Text style={styles.secaoTitulo}>Ingredientes</Text>
            </View>
            <Text style={styles.secaoTexto}>{receita.ingredientes}</Text>
          </View>

          {/* Divisor */}
          <View style={styles.divisor} />

          {/* Modo de preparo */}
          <View style={styles.secao}>
            <View style={styles.secaoTituloRow}>
              <FontAwesome6 name="kitchen-set" size={18} color="#E8593A" />
              <Text style={styles.secaoTitulo}>Modo de preparo</Text>
            </View>
            <Text style={styles.secaoTexto}>{receita.preparo}</Text>
          </View>

          {/* Botões — visíveis só para o dono */}
          {ehDono && (
            <View style={styles.botoes}>
              <TouchableOpacity
                style={styles.botaoEditar}
                onPress={() => navigation.navigate('FormReceita', {
                  inclusao: false,
                  receita,
                })}
                activeOpacity={0.85}
              >
                <FontAwesome6 name="edit" size={18} color="#fff" style={styles.botaoIcone} />
                <Text style={styles.botaoTexto}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.botaoExcluir}
                onPress={handleExcluir}
                activeOpacity={0.85}
              >
                <MaterialCommunityIcons name="delete-forever" size={18} color="#fff" style={styles.botaoIcone} />
                <Text style={styles.botaoTexto}>Excluir</Text>
              </TouchableOpacity>
            </View>
          )}

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F5',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF8F5',
  },
  imagem: {
    width: '100%',
    height: 260,
  },
  imagemPlaceholder: {
    width: '100%',
    height: 220,
    backgroundColor: '#FDF0EB',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  imagemPlaceholderTexto: {
    fontSize: 14,
    color: '#C4A89E',
  },
  corpo: {
    padding: 22,
  },
  titulo: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2B2B2B',
    marginBottom: 12,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDF0EB',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#F2D9D0',
  },
  tagIcone: {
    marginRight: 5,
  },
  tagTexto: {
    fontSize: 13,
    color: '#E8593A',
    fontWeight: '500',
  },
  divisor: {
    height: 1,
    backgroundColor: '#F0E8E4',
    marginVertical: 20,
  },
  secao: {
    gap: 10,
  },
  secaoTituloRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  secaoTitulo: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2B2B2B',
  },
  secaoTexto: {
    fontSize: 15,
    color: '#555',
    lineHeight: 24,
  },
  botoes: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
    marginBottom: 16,
  },
  botaoEditar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8593A',
    borderRadius: 10,
    height: 48,
    gap: 8,
  },
  botaoExcluir: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C0392B',
    borderRadius: 10,
    height: 48,
    gap: 8,
  },
  botaoIcone: {
    marginRight: 2,
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});