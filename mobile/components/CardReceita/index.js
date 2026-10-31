import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Image,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import api from '../../service/api';

export default function CardReceita({ receita, onPress }) {
  const imagemUri = receita.imagem
    ? `${api.defaults.baseURL}/uploads/${receita.imagem}`
    : null;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>

      {/* Imagem ou placeholder */}
      {imagemUri ? (
        <Image source={{ uri: imagemUri }} style={styles.imagem} resizeMode="cover" />
      ) : (
        <View style={styles.imagemPlaceholder}>
          <MaterialCommunityIcons name="image" size={32} color="#D9BFB7" />
        </View>
      )}

      {/* Informações */}
      <View style={styles.info}>
        <Text style={styles.titulo} numberOfLines={1}>{receita.titulo}</Text>

        <View style={styles.linha}>
          <MaterialCommunityIcons name="chef-hat" size={13} color="#999" style={styles.icone} />
          <Text style={styles.detalhe}>{receita.categoria}</Text>
        </View>

        <View style={styles.linha}>
          <MaterialCommunityIcons name="clock-time-four-outline" size={13} color="#999" style={styles.icone} />
          <Text style={styles.detalhe}>{receita.tempo}</Text>
        </View>
      </View>

      {/* Seta */}
      <View style={styles.seta}>
        <MaterialCommunityIcons name="arrow-right-circle-outline" size={18} color="#CCC" />
      </View>

    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0E8E4',
    overflow: 'hidden',
  },
  imagem: {
    width: 90,
    height: 90,
  },
  imagemPlaceholder: {
    width: 90,
    height: 90,
    backgroundColor: '#FDF0EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconePlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F2D9D0',
  },
  iconePequeno: {
    width: 13,
    height: 13,
    borderRadius: 3,
    backgroundColor: '#E0D8D5',
    marginRight: 5,
  },
  info: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 5,
  },
  titulo: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2B2B2B',
    marginBottom: 2,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icone: {
    marginRight: 5,
  },
  detalhe: {
    fontSize: 13,
    color: '#888',
  },
  seta: {
    paddingRight: 14,
  },
});