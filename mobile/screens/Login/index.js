import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import api from '../../service/api';

export default function Login({ navigation }) {
  const [email, setEmail]       = useState('');
  const [senha, setSenha]       = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [carregando, setCarregando]     = useState(false);

  async function handleLogin() {
    if (!email || !senha) {
      Alert.alert('Atenção', 'Preencha e-mail e senha.');
      return;
    }

    try {
      setCarregando(true);
      const resposta = await api.post('/usuarios/login', { email, senha });

      await AsyncStorage.setItem('token', resposta.data.token);
      await AsyncStorage.setItem('usuario', JSON.stringify(resposta.data.usuario));

      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (err) {
      const mensagem = err.response?.data?.erro || 'Não foi possível fazer login.';
      Alert.alert('Erro', mensagem);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.inner}>

        {/* Logo / Título */}
        <View style={styles.header}>
          <View style={styles.iconePlaceholder} />
          <Text style={styles.titulo}>APPetite Book</Text>
          <Text style={styles.subtitulo}>Entre para ver suas receitas</Text>
        </View>

        {/* Formulário */}
        <View style={styles.form}>

          <Text style={styles.label}>E-mail</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="mail" size={18} color="#999" style={styles.inputIcone} />
            <TextInput
              style={styles.input}
              placeholder="seu@email.com"
              placeholderTextColor="#bbb"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <Text style={styles.label}>Senha</Text>
          <View style={styles.inputWrapper}>
            <AntDesign name="lock" size={18} color="#999" style={styles.inputIcone} />
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#bbb"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry={!senhaVisivel}
            />
            <TouchableOpacity onPress={() => setSenhaVisivel(!senhaVisivel)}>
              <AntDesign name={senhaVisivel ? "eye" : "eye-invisible"} size={18} color="#999" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.botao, carregando && styles.botaoDesabilitado]}
            onPress={handleLogin}
            disabled={carregando}
          >
            {carregando
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.botaoTexto}>Entrar</Text>
            }
          </TouchableOpacity>

        </View>

        {/* Rodapé */}
        <TouchableOpacity
          style={styles.linkCadastro}
          onPress={() => navigation.navigate('Cadastro')}
        >
          <Text style={styles.linkCadastroTexto}>
            Não tem conta?{' '}
            <Text style={styles.linkCadastroDestaque}>Cadastre-se</Text>
          </Text>
        </TouchableOpacity>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F5',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  header: {
    alignItems: 'center',
    marginBottom: 36,
  },
  iconePlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F2D9D0',
    marginBottom: 12,
  },
  titulo: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2B2B2B',
    letterSpacing: 0.5,
  },
  subtitulo: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  form: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444',
    marginBottom: 4,
    marginTop: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcone: {
    marginRight: 8,
  },
  inputIconePlaceholder: {
    width: 18,
    height: 18,
    borderRadius: 4,
    backgroundColor: '#E8E8E8',
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#2B2B2B',
  },
  botao: {
    backgroundColor: '#E8593A',
    borderRadius: 10,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  botaoDesabilitado: {
    opacity: 0.6,
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  linkCadastro: {
    alignItems: 'center',
    marginTop: 28,
  },
  linkCadastroTexto: {
    fontSize: 14,
    color: '#888',
  },
  linkCadastroDestaque: {
    color: '#E8593A',
    fontWeight: '600',
  },
});