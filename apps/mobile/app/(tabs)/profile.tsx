import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/authStore';

export default function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      t('profile.logoutConfirmTitle'),
      t('profile.logoutConfirmMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('profile.logout'),
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  const handleLanguageChange = () => {
    const languages = ['fr', 'de', 'en', 'it'];
    const currentIndex = languages.indexOf(i18n.language);
    const nextIndex = (currentIndex + 1) % languages.length;
    i18n.changeLanguage(languages[nextIndex]);
  };

  const menuItems = [
    {
      icon: 'person',
      title: t('profile.editProfile'),
      onPress: () => router.push('/profile/edit'),
    },
    {
      icon: 'notifications',
      title: t('profile.notifications'),
      onPress: () => router.push('/profile/notifications'),
    },
    {
      icon: 'language',
      title: t('profile.language'),
      value: i18n.language.toUpperCase(),
      onPress: handleLanguageChange,
    },
    {
      icon: 'moon',
      title: t('profile.darkMode'),
      value: t('common.enabled'),
      onPress: () => {},
    },
    {
      icon: 'shield-checkmark',
      title: t('profile.privacy'),
      onPress: () => router.push('/profile/privacy'),
    },
    {
      icon: 'help-circle',
      title: t('profile.help'),
      onPress: () => router.push('/profile/help'),
    },
    {
      icon: 'information-circle',
      title: t('profile.about'),
      onPress: () => router.push('/profile/about'),
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-6 pt-4 pb-6">
          <Text className="text-white text-2xl font-bold">
            {t('profile.title')}
          </Text>
        </View>

        {/* User Card */}
        <View className="px-6 mb-6">
          <View className="bg-card rounded-xl p-4 flex-row items-center">
            <View className="bg-primary-600 rounded-full w-16 h-16 items-center justify-center">
              <Text className="text-white text-2xl font-bold">
                {user?.firstName?.[0]}
                {user?.lastName?.[0]}
              </Text>
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-white text-lg font-semibold">
                {user?.firstName} {user?.lastName}
              </Text>
              <Text className="text-gray-400">{user?.email}</Text>
              <Text className="text-primary-400 text-sm mt-1">
                {t(`roles.${user?.role?.toLowerCase()}`)}
              </Text>
            </View>
          </View>
        </View>

        {/* Branch Info */}
        {user?.branch && (
          <View className="px-6 mb-6">
            <View className="bg-surface rounded-xl p-4 flex-row items-center">
              <View className="bg-green-500/20 rounded-full p-3">
                <Ionicons name="business" size={24} color="#10b981" />
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-gray-400 text-sm">
                  {t('profile.currentBranch')}
                </Text>
                <Text className="text-white font-semibold">
                  {user.branch.name}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Menu Items */}
        <View className="px-6">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="bg-card rounded-xl p-4 mb-3 flex-row items-center"
              onPress={item.onPress}
            >
              <View className="bg-surface rounded-full p-2 mr-4">
                <Ionicons name={item.icon as any} size={20} color="#3b82f6" />
              </View>
              <Text className="text-white flex-1">{item.title}</Text>
              {item.value && (
                <Text className="text-gray-400 mr-2">{item.value}</Text>
              )}
              <Ionicons name="chevron-forward" size={20} color="#6b7280" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <View className="px-6 mt-6 mb-8">
          <TouchableOpacity
            className="bg-red-500/20 rounded-xl p-4 flex-row items-center justify-center"
            onPress={handleLogout}
          >
            <Ionicons name="log-out" size={24} color="#ef4444" />
            <Text className="text-red-400 font-semibold ml-2">
              {t('profile.logout')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Version */}
        <View className="items-center pb-8">
          <Text className="text-gray-600">MatFlow v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
