import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { api } from '@/lib/api';

export default function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert(t('error'), t('auth.enterEmail'));
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setIsSent(true);
    } catch (error: any) {
      Alert.alert(t('error'), error.message || t('auth.resetFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 justify-center items-center px-6">
          <View className="bg-green-500/20 rounded-full p-6 mb-6">
            <Ionicons name="mail" size={48} color="#22c55e" />
          </View>
          <Text className="text-white text-2xl font-bold text-center mb-4">
            {t('auth.checkEmail')}
          </Text>
          <Text className="text-gray-400 text-center mb-8">
            {t('auth.resetEmailSent', { email })}
          </Text>
          <TouchableOpacity
            className="bg-primary-600 rounded-lg py-4 px-8"
            onPress={() => router.back()}
          >
            <Text className="text-white font-semibold">
              {t('auth.backToLogin')}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-6">
        {/* Header */}
        <TouchableOpacity
          className="mt-4 flex-row items-center"
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
          <Text className="text-white ml-2">{t('common.back')}</Text>
        </TouchableOpacity>

        {/* Content */}
        <View className="flex-1 justify-center">
          <Text className="text-white text-3xl font-bold mb-4">
            {t('auth.resetPassword')}
          </Text>
          <Text className="text-gray-400 mb-8">
            {t('auth.resetPasswordDescription')}
          </Text>

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

          <TouchableOpacity
            className="bg-primary-600 rounded-lg py-4 mt-6"
            onPress={handleResetPassword}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-semibold text-lg">
                {t('auth.sendResetLink')}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
