import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import { useState } from 'react';

interface DashboardStats {
  pendingPickings: number;
  pendingReturns: number;
  todayReservations: number;
  lowStockAlerts: number;
}

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);

  const { data: stats, refetch } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await api.get('/dashboard/stats');
      return response.data;
    },
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const quickActions = [
    {
      icon: 'scan',
      label: t('home.quickScan'),
      color: '#3b82f6',
      onPress: () => router.push('/scanner'),
    },
    {
      icon: 'cube',
      label: t('home.newPicking'),
      color: '#10b981',
      onPress: () => router.push('/(tabs)/picking'),
    },
    {
      icon: 'return-down-back',
      label: t('home.newReturn'),
      color: '#f59e0b',
      onPress: () => router.push('/(tabs)/returns'),
    },
    {
      icon: 'search',
      label: t('home.searchArticle'),
      color: '#8b5cf6',
      onPress: () => router.push('/search'),
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View className="px-6 pt-4 pb-6">
          <Text className="text-gray-400">{t('home.welcome')}</Text>
          <Text className="text-white text-2xl font-bold">
            {user?.firstName} {user?.lastName}
          </Text>
        </View>

        {/* Stats Cards */}
        <View className="px-6 mb-6">
          <View className="flex-row flex-wrap -mx-2">
            <View className="w-1/2 px-2 mb-4">
              <View className="bg-card rounded-xl p-4">
                <View className="flex-row items-center justify-between">
                  <View className="bg-blue-500/20 rounded-full p-2">
                    <Ionicons name="cube" size={20} color="#3b82f6" />
                  </View>
                  <Text className="text-blue-400 text-2xl font-bold">
                    {stats?.pendingPickings || 0}
                  </Text>
                </View>
                <Text className="text-gray-400 mt-2 text-sm">
                  {t('home.pendingPickings')}
                </Text>
              </View>
            </View>

            <View className="w-1/2 px-2 mb-4">
              <View className="bg-card rounded-xl p-4">
                <View className="flex-row items-center justify-between">
                  <View className="bg-amber-500/20 rounded-full p-2">
                    <Ionicons name="return-down-back" size={20} color="#f59e0b" />
                  </View>
                  <Text className="text-amber-400 text-2xl font-bold">
                    {stats?.pendingReturns || 0}
                  </Text>
                </View>
                <Text className="text-gray-400 mt-2 text-sm">
                  {t('home.pendingReturns')}
                </Text>
              </View>
            </View>

            <View className="w-1/2 px-2 mb-4">
              <View className="bg-card rounded-xl p-4">
                <View className="flex-row items-center justify-between">
                  <View className="bg-green-500/20 rounded-full p-2">
                    <Ionicons name="calendar" size={20} color="#10b981" />
                  </View>
                  <Text className="text-green-400 text-2xl font-bold">
                    {stats?.todayReservations || 0}
                  </Text>
                </View>
                <Text className="text-gray-400 mt-2 text-sm">
                  {t('home.todayReservations')}
                </Text>
              </View>
            </View>

            <View className="w-1/2 px-2 mb-4">
              <View className="bg-card rounded-xl p-4">
                <View className="flex-row items-center justify-between">
                  <View className="bg-red-500/20 rounded-full p-2">
                    <Ionicons name="warning" size={20} color="#ef4444" />
                  </View>
                  <Text className="text-red-400 text-2xl font-bold">
                    {stats?.lowStockAlerts || 0}
                  </Text>
                </View>
                <Text className="text-gray-400 mt-2 text-sm">
                  {t('home.stockAlerts')}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-6 mb-6">
          <Text className="text-white text-lg font-semibold mb-4">
            {t('home.quickActions')}
          </Text>
          <View className="flex-row flex-wrap -mx-2">
            {quickActions.map((action, index) => (
              <View key={index} className="w-1/2 px-2 mb-4">
                <TouchableOpacity
                  className="bg-surface rounded-xl p-4 flex-row items-center"
                  onPress={action.onPress}
                >
                  <View
                    className="rounded-full p-3 mr-3"
                    style={{ backgroundColor: `${action.color}20` }}
                  >
                    <Ionicons
                      name={action.icon as any}
                      size={24}
                      color={action.color}
                    />
                  </View>
                  <Text className="text-white font-medium flex-1">
                    {action.label}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
