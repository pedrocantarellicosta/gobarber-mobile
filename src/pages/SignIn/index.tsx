import React, { useCallback, useRef } from 'react';
import { Image, View, ScrollView, KeyboardAvoidingView, Platform, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { useAuth } from '../../hooks/auth';

import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

import LogoImg from '../../assets/logo.png';

import { Container, Title, ForgotPassword, ForgotPasswordText, CreateAccountButton, CreateAccountButtonText } from './styles';

interface SignInFormData {
    email: string;
    password: string;
}

const SignIn: React.FC = () => {
    const navigation = useNavigation();
    const formRef = useRef<FormHandles>(null);
    const passwordInputRef = useRef<TextInput>(null);

    const { signIn, user } = useAuth();
    console.log(user);

    const handleSignIn = useCallback(
        async (data: SignInFormData) => {
          try {
            const schema = Yup.object().shape({
              email: Yup.string()
                .required('Email Obrigatório')
                .email('Digite um e-mail válido'),
              password: Yup.string().required('Senha obrigatória'),
            });
            await schema.validate(data, {
              abortEarly: false,
            });
    
            await signIn({
              email: data.email,
              password: data.password,
            });
    
        } catch (err) {
            if (err instanceof Yup.ValidationError) {
              const errors = getValidationErrors(err);
              // eslint-disable-next-line no-unused-expressions
              formRef.current?.setErrors(errors);
    
              return;
            }
            
            Alert.alert(
                'Erro na autenticação',
                'Ocorreu um erro ao fazer login, cheque as credenciais'
            );

           
          }
        },
        [],
      );
    return (
        <>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                enabled
            >
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ flex: 1 }}
                >
                    <Container>
                        <Image source={LogoImg} />
                        <View>
                            <Title>Faça seu logon</Title>
                        </View>
                        <Form ref={formRef} onSubmit={handleSignIn}>
                            <Input 
                                autoCorrect={false} 
                                autoCapitalize="none" 
                                returnKeyType="next"
                                onSubmitEditing={()=>{
                                    passwordInputRef.current?.focus();
                                }}
                                keyboardType="email-address" 
                                name="email" 
                                icon="mail" 
                                placeholder="E-mail" 
                            />
                            <Input 
                                ref={passwordInputRef}
                                secureTextEntry
                                returnKeyType="send"
                                onSubmitEditing={() => { formRef.current?.submitForm(); }}
                                name="password" 
                                icon="lock" 
                                placeholder="Password" 
                            />

                            <Button onPress={() => { formRef.current?.submitForm(); }} >Entrar</Button>
                        </Form>
                        <ForgotPassword onPress={() => { console.log("deu") }}>
                            <ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
                        </ForgotPassword>
                    </Container>
                </ScrollView>
            </KeyboardAvoidingView>
            <CreateAccountButton onPress={() => { navigation.navigate('SignUp') }}>
                <Icon name="log-in" size={20} color="#ff9000" />
                <CreateAccountButtonText>Criar uma Conta</CreateAccountButtonText>
            </CreateAccountButton>
        </>
    )
};

export default SignIn;