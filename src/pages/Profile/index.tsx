import React, { useRef, useCallback, useState } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'react-native-image-picker/src';
import Modal from 'react-native-modal';
import {
  Image,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
  Button as ButtonRN,
} from 'react-native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import {
  UserAvatarButton,
  UserAvatar,
  BackButton,
  UploadButton,
  Container,
  Title,
} from './styles';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';
import Input from '../../components/Input';
import Button from '../../components/Button';

import { useAuth } from '../../hooks/auth';

interface ProfileFormData {
  name: string;
  email: string;
  password: string;
  old_password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const { user, signOut, updateUser } = useAuth();

  const formRef = useRef<FormHandles>(null);
  const navigation = useNavigation();
  const [showModalUpdateAvatar, setShowModalUpdateAvatar] = useState(false);

  const emailInputRef = useRef<TextInput>(null);
  const oldPasswordInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);

  const handleSignUp = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          password: Yup.string().when('old_password', {
            is: val => !!val.length,
            then: Yup.string().required('Campo obrigatótio'),
            otherwise: Yup.string(),
          }),
          old_password: Yup.string(),
          password_confirmation: Yup.string()
            .when('old_password', {
              is: val => !!val.length,
              then: Yup.string().required('Campo obrigatótio'),
              otherwise: Yup.string(),
            })
            .oneOf([Yup.ref('password'), undefined], 'Confirmação incorreta'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const {
          name,
          email,
          old_password,
          password,
          password_confirmation,
        } = data;

        const formData = {
          name,
          email,
          ...(old_password
            ? {
                old_password,
                password,
                password_confirmation,
              }
            : {}),
        };

        const response = await api.put('/profile', formData);

        updateUser(response.data);

        Alert.alert('Perfil atualizado com sucesso!');
        // navigation.navigate('SignIn');
        navigation.goBack();

        // history.push('/');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);

          return;
        }

        Alert.alert(
          'Erro na atualização do perfil',
          'Ocorreu um erro ao atualizar seu perfil, tente novamente',
        );
      }
    },
    [navigation, updateUser],
  );

  const toggleModal = useCallback(() => {
    setShowModalUpdateAvatar(!showModalUpdateAvatar);
  }, [showModalUpdateAvatar]);

  const updatePhotoFromCamera = useCallback(() => {
    ImagePicker.launchCamera(
      {
        mediaType: 'photo',
        saveToPhotos: true,
        quality: 0.5,
      },
      async response => {
        const data = new FormData();

        data.append('avatar', {
          type: 'image/jpeg',
          name: `${user.id}.jpg`,
          uri: response.uri,
        });

        const apiResponse = await api.patch('users/avatar', data);

        await updateUser(apiResponse.data);
        toggleModal();
      },
    );
  }, [toggleModal, updateUser, user.id]);

  const updatePhotoFromGallery = useCallback(() => {
    ImagePicker.launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.5,
      },
      async response => {
        const data = new FormData();

        data.append('avatar', {
          type: 'image/jpeg',
          name: `${user.id}.jpg`,
          uri: response.uri,
        });

        const apiResponse = await api.patch('users/avatar', data);

        await updateUser(apiResponse.data);
        toggleModal();
      },
    );
  }, [toggleModal, updateUser, user.id]);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleSignOut = useCallback(() => {
    signOut();
  }, [signOut]);

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          // contentContainerStyle={{ flex: 1 }}
          style={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
          scrollEnabled
        >
          <Container>
            <BackButton onPress={handleGoBack}>
              <Icon name="chevron-left" size={24} color="#999591" />
            </BackButton>
            <UserAvatarButton onPress={toggleModal}>
              <UserAvatar source={{ uri: user.avatar_url }} />
            </UserAvatarButton>
            <View>
              <Title>Meu perfil</Title>
            </View>

            <Form initialData={user} ref={formRef} onSubmit={handleSignUp}>
              <Input
                autoCapitalize="words"
                name="name"
                icon="user"
                placeholder="Nome"
                returnKeyType="next"
                onSubmitEditing={() => {
                  // eslint-disable-next-line no-unused-expressions
                  emailInputRef.current?.focus();
                }}
              />
              <Input
                ref={emailInputRef}
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="email-address"
                name="email"
                icon="mail"
                placeholder="E-mail"
                returnKeyType="next"
                onSubmitEditing={() => {
                  oldPasswordInputRef.current?.focus();
                }}
              />
              <Input
                ref={oldPasswordInputRef}
                secureTextEntry
                name="old_password"
                icon="lock"
                placeholder="Senha atual"
                containerStyle={{ marginTop: 16 }}
                returnKeyType="next"
                onSubmitEditing={() => passwordInputRef.current?.focus()}
              />
              <Input
                ref={passwordInputRef}
                secureTextEntry
                name="password"
                icon="lock"
                placeholder="Nova senha"
                returnKeyType="next"
                onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
              />
              <Input
                ref={confirmPasswordInputRef}
                secureTextEntry
                name="password_confirmation"
                icon="lock"
                placeholder="Confirme a nova senha"
                returnKeyType="send"
                onSubmitEditing={() => formRef.current?.submitForm()}
              />

              <Button onPress={() => formRef.current?.submitForm()}>
                Confirmar mudanças
              </Button>
              <Button isCancelButton onPress={handleSignOut}>
                Sair
              </Button>
            </Form>
          </Container>
        </ScrollView>

        <Modal
          isVisible={showModalUpdateAvatar}
          backdropOpacity={0.9}
          backdropColor="#3e3b47"
        >
          <UploadButton>
            <ButtonRN title="Usar câmera" onPress={updatePhotoFromCamera} />
          </UploadButton>
          <UploadButton>
            <ButtonRN
              title="Selecionar da galera"
              onPress={updatePhotoFromGallery}
            />
          </UploadButton>
          <UploadButton>
            <ButtonRN title="Cancelar" onPress={toggleModal} color="red" />
          </UploadButton>
        </Modal>
      </KeyboardAvoidingView>
    </>
  );
};

export default Profile;
