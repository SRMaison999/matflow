import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { ReturnCheck } from '@matflow/types';

export default function ReturnsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: returnChecks, refetch } = useQuery<ReturnCheck[]>({
    queryKey: ['return-checks', searchQuery],
    queryFn: async () => {
      const response = await api.get('/return-checks', {
        params: { search: searchQuery, status: 'PENDING,IN_PROGRESS' },
      });
      return response.data.items;
    },
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return '#f59e0b';
      case 'IN_PROGRESS':
        return '#3b82f6';
      case 'COMPLETED':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="px-6 pt-4 pb-4">
        <Text className="text-white text-2xl font-bold mb-4">
          {t('returns.title')}
        </Text>

        {/* Search Bar */}
        <View className="flex-row items-center bg-surface rounded-xl px-4 py-3">
          <Ionicons name="search" size={20} color="#6b7280" />
          <TextInput
            className="flex-1 text-white ml-3"
            placeholder={t('returns.searchPlaceholder')}
            placeholderTextColor="#6b7280"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#6b7280" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Return Checks */}
      <ScrollView
        className="flex-1 px-6"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {returnChecks?.length === 0 ? (
          <View className="items-center justify-center py-12">
            <Ionicons name="return-down-back-outline" size={64} color="#6b7280" />
            <Text className="text-gray-400 mt-4 text-center">
              {t('returns.noReturns')}
            </Text>
          </View>
        ) : (
          returnChecks?.map((check) => (
            <TouchableOpacity
              key={check.id}
              className="bg-card rounded-xl p-4 mb-4"
              onPress={() => router.push(`/returns/${check.id}`)}
            >
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-white font-semibold text-lg">
                  {check.number}
                </Text>
                <View
                  className="px-3 py-1 rounded-full"
                  style={{ backgroundColor: `${getStatusColor(check.status)}20` }}
                >
                  <Text style={{ color: getStatusColor(check.status) }}>
                    {t(`returns.status.${check.status.toLowerCase()}`)}
                  </Text>
                </View>
              </View>

              <Text className="text-gray-400 mb-2">
                {check.reservation?.project?.name || t('returns.noProject')}
              </Text>

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Ionicons name="cube" size={16} color="#6b7280" />
                  <Text className="text-gray-400 ml-2">
                    {check.items?.length || 0} {t('returns.items')}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                  <Text className="text-green-400 ml-2">
                    {check.items?.filter((i: any) => i.checkedAt).length || 0}/
                    {check.items?.length || 0}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Scan Button */}
      <View className="px-6 pb-6">
        <TouchableOpacity
          className="bg-amber-500 rounded-xl py-4 flex-row items-center justify-center"
          onPress={() => router.push('/scanner?mode=return')}
        >
          <Ionicons name="scan" size={24} color="white" />
          <Text className="text-white font-semibold text-lg ml-2">
            {t('returns.scanToReturn')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
