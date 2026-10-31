import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Image,
  ScrollView, StyleSheet, ActivityIndicator, Alert,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import api from '../../service/api';

export default function FormReceita({ route, navigation }) {
  const inclusao = route.params?.inclusao ?? true;
  const receitaParam = route.params?.receita ?? null;

  const [titulo, setTitulo]           = useState('');
  const [categoria, setCategoria]     = useState('');
  const [ingredientes, setIngredientes] = useState('');
  const [preparo, setPreparo]         = useState('');
  const [tempo, setTempo]             = useState('');
  const [imagem, setImagem]           = useState(null);
  // imagem: { uri, fileName, type } para nova foto
  // ou string com o nome do arquivo já salvo no servidor
  const [carregando, setCarregando]   = useState(false);

  // Preenche os campos ao editar
  useEffect(() => {
    if (!inclusao && receitaParam) {
      setTitulo(receitaParam.titulo);
      setCategoria(receitaParam.categoria);
      setIngredientes(receitaParam.ingredientes);
      setPreparo(receitaParam.preparo);
      setTempo(receitaParam.tempo);
      if (receitaParam.imagem) {
        setImagem({ salva: true, filename: receitaParam.imagem });
      }
    }
  }, []);

  async function handleEscolherImagem() {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert('Permissão necessária', 'Permita o acesso à galeria para adicionar uma foto.');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!resultado.canceled) {
      const foto = resultado.assets[0];
      setImagem({
        salva: false,
        uri: foto.uri,
        fileName: foto.fileName || `foto_${Date.now()}.jpg`,
        type: foto.mimeType || 'image/jpeg',
      });
    }
  }

  function validar() {
    if (!titulo.trim())       { Alert.alert('Atenção', 'Informe o título da receita.');   return false; }
    if (!categoria.trim())    { Alert.alert('Atenção', 'Informe a categoria.');           return false; }
    if (!ingredientes.trim()) { Alert.alert('Atenção', 'Informe os ingredientes.');       return false; }
    if (!preparo.trim())      { Alert.alert('Atenção', 'Informe o modo de preparo.');     return false; }
    if (!tempo.trim())        { Alert.alert('Atenção', 'Informe o tempo de preparo.');    return false; }
    return true;
  }

  function montarFormData() {
    const form = new FormData();
    form.append('titulo',       titulo.trim());
    form.append('categoria',    categoria.trim());
    form.append('ingredientes', ingredientes.trim());
    form.append('preparo',      preparo.trim());
    form.append('tempo',        tempo.trim());

    // Só envia o campo imagem se o usuário escolheu uma foto nova
    if (imagem && !imagem.salva) {
      form.append('imagem', {
        uri:  imagem.uri,
        name: imagem.fileName,
        type: imagem.type,
      });
    }

    return form;
  }

  async function handleSalvar() {
    if (!validar()) return;

    try {
      setCarregando(true);
      const form = montarFormData();

      if (inclusao) {
        await api.post('/receitas', form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        Alert.alert('Sucesso', 'Receita criada com sucesso!', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        await api.put(`/receitas/${receitaParam.id}`, form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        Alert.alert('Sucesso', 'Receita atualizada com sucesso!', [
          { text: 'OK', onPress: () => navigation.navigate('Home') },
        ]);
      }
    } catch (err) {
      const mensagem = err.response?.data?.erro || 'Não foi possível salvar a receita.';
      Alert.alert('Erro', mensagem);
    } finally {
      setCarregando(false);
    }
  }

  // URI de preview: foto nova (local) ou foto já salva (servidor)
  function getPreviewUri() {
    if (!imagem) return null;
    if (!imagem.salva) return imagem.uri;
    return `${api.defaults.baseURL}/uploads/${imagem.filename}`;
  }

  const previewUri = getPreviewUri();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.inner}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* Upload de imagem */}
        <TouchableOpacity
          style={styles.imagemContainer}
          onPress={handleEscolherImagem}
          activeOpacity={0.85}
        >
          {previewUri ? (
            <>
              <Image
                source={{ uri: previewUri }}
                style={styles.imagemPreview}
                resizeMode="cover"
              />
              <View style={styles.imagemOverlay}>
                <MaterialCommunityIcons name="image-edit-outline" size={22} color="#fff" />
                <Text style={styles.imagemOverlayTexto}>Trocar foto</Text>
              </View>
            </>
          ) : (
            <View style={styles.imagemVazia}>
              <MaterialCommunityIcons name="image-plus-outline" size={40} color="#D9BFB7" />
              <Text style={styles.imagemVaziaTexto}>Toque para adicionar foto</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Campos */}
        <View style={styles.form}>

          <Text style={styles.label}>Título da receita</Text>
          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons name="food-turkey" size={18} color="#999" style={styles.inputIcone} />
            <TextInput
              style={styles.input}
              placeholder="Ex: Lasanha à bolonhesa"
              placeholderTextColor="#bbb"
              value={titulo}
              onChangeText={setTitulo}
            />
          </View>

          <Text style={styles.label}>Categoria</Text>
          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons name="chef-hat" size={18} color="#999" style={styles.inputIcone} />
            <TextInput
              style={styles.input}
              placeholder="Ex: Massas, Sobremesas, Carnes..."
              placeholderTextColor="#bbb"
              value={categoria}
              onChangeText={setCategoria}
            />
          </View>

          <Text style={styles.label}>Tempo de preparo</Text>
          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons name="clock-time-four-outline" size={18} color="#999" style={styles.inputIcone} />
            <TextInput
              style={styles.input}
              placeholder="Ex: 40 min"
              placeholderTextColor="#bbb"
              value={tempo}
              onChangeText={setTempo}
            />
          </View>

          <Text style={styles.label}>Ingredientes</Text>
          <View style={[styles.inputWrapper, styles.inputWrapperMultiline]}>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              placeholder="Liste os ingredientes, um por linha..."
              placeholderTextColor="#bbb"
              value={ingredientes}
              onChangeText={setIngredientes}
              multiline
              textAlignVertical="top"
            />
          </View>

          <Text style={styles.label}>Modo de preparo</Text>
          <View style={[styles.inputWrapper, styles.inputWrapperMultiline]}>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              placeholder="Descreva o passo a passo..."
              placeholderTextColor="#bbb"
              value={preparo}
              onChangeText={setPreparo}
              multiline
              textAlignVertical="top"
            />
          </View>

        </View>

        {/* Botão salvar */}
        <TouchableOpacity
          style={[styles.botao, carregando && styles.botaoDesabilitado]}
          onPress={handleSalvar}
          disabled={carregando}
          activeOpacity={0.85}
        >
          {carregando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <MaterialCommunityIcons name="content-save" size={20} color="#fff" style={styles.botaoIcone} />
              <Text style={styles.botaoTexto}>
                {inclusao ? 'Publicar receita' : 'Salvar alterações'}
              </Text>
            </>
          )}
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
    padding: 20,
    paddingBottom: 40,
  },

  // Imagem
  imagemContainer: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F0E8E4',
  },
  imagemPreview: {
    width: '100%',
    height: '100%',
  },
  imagemOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 8,
  },
  imagemOverlayTexto: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  imagemVazia: {
    flex: 1,
    backgroundColor: '#FDF0EB',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  imagemVaziaIcone: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F2D9D0',
  },
  imagemVaziaTexto: {
    fontSize: 14,
    color: '#C4A89E',
  },

  // Formulário
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
  inputWrapperMultiline: {
    height: 120,
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  inputIcone: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#2B2B2B',
  },
  inputMultiline: {
    height: '100%',
  },

  // Botão
  botao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8593A',
    borderRadius: 10,
    height: 52,
    marginTop: 28,
    gap: 8,
  },
  botaoDesabilitado: {
    opacity: 0.6,
  },
  botaoIcone: {
    marginRight: 2,
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});