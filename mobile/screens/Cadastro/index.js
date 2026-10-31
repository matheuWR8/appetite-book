import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView,
  Platform, ScrollView,
} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import api from '../../service/api';

export default function Cadastro({ navigation }) {
  const [nome, setNome]   = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [carregando, setCarregando]     = useState(false);

  async function handleCadastro() {
    if (!nome || !email || !senha) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }
    if (senha.length < 6) {
      Alert.alert('Atenção', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    try {
      setCarregando(true);
      await api.post('/usuarios', { nome, email, senha });
      Alert.alert('Sucesso', 'Conta criada! Faça login para continuar.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (err) {
      const mensagem = err.response?.data?.erro || 'Não foi possível criar a conta.';
      console.log(err)
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
      <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">

        {/* Cabeçalho */}
        <View style={styles.header}>
          <AntDesign name="user-add" size={48} color="#E8593A" />
          <View style={styles.iconePlaceholder} />
          <Text style={styles.titulo}>Criar conta</Text>
          <Text style={styles.subtitulo}>Cadastre-se para publicar receitas</Text>
        </View>

        {/* Formulário */}
        <View style={styles.form}>

          <Text style={styles.label}>Nome</Text>
          <View style={styles.inputWrapper}>
            <View style={styles.inputIconePlaceholder} />
            <TextInput
              style={styles.input}
              placeholder="Seu nome completo"
              placeholderTextColor="#bbb"
              value={nome}
              onChangeText={setNome}
              autoCapitalize="words"
            />
          </View>

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
              placeholder="Mínimo 6 caracteres"
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
            onPress={handleCadastro}
            disabled={carregando}
          >
            {carregando
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.botaoTexto}>Criar conta</Text>
            }
          </TouchableOpacity>

        </View>

        {/* Rodapé */}
        <TouchableOpacity
          style={styles.linkLogin}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.linkLoginTexto}>
            Já tem conta?{' '}
            <Text style={styles.linkLoginDestaque}>Fazer login</Text>
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F5',
  },
  inner: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  titulo: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2B2B2B',
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
  linkLogin: {
    alignItems: 'center',
    marginTop: 28,
  },
  linkLoginTexto: {
    fontSize: 14,
    color: '#888',
  },
  linkLoginDestaque: {
    color: '#E8593A',
    fontWeight: '600',
  },
});