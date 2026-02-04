import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/authStore';
import { useTranslation } from 'react-i18next';

export default function LoginScreen() {
  const { t } = useTranslation();
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t('error'), t('auth.fillAllFields'));
      return;
    }

    try {
      await login(email, password);
    } catch (error: any) {
      Alert.alert(t('error'), error.message || t('auth.loginFailed'));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 justify-center px-6">
          {/* Logo */}
          <View className="items-center mb-12">
            <Text className="text-4xl font-bold text-white">MatFlow</Text>
            <Text className="text-muted-foreground mt-2">
              {t('auth.subtitle')}
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-4">
            <View>
              <Text className="text-white mb-2">{t('auth.email')}</Text>
              <TextInput
                className="bg-surface border border-gray-700 rounded-lg px-4 py-3 text-white"
                placeholder={t('auth.emailPlaceholder')}
                placeholderTextColor="#6b7280"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View>
              <Text className="text-white mb-2">{t('auth.password')}</Text>
              <TextInput
                className="bg-surface border border-gray-700 rounded-lg px-4 py-3 text-white"
                placeholder={t('auth.passwordPlaceholder')}
                placeholderTextColor="#6b7280"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              className="bg-primary-600 rounded-lg py-4 mt-4"
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center font-semibold text-lg">
                  {t('auth.login')}
                </Text>
              )}
            </TouchableOpacity>

            <Link href="/(auth)/forgot-password" asChild>
              <TouchableOpacity className="mt-4">
                <Text className="text-primary-400 text-center">
                  {t('auth.forgotPassword')}
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
