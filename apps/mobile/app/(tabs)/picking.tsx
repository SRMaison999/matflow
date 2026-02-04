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
import type { PickingList } from '@matflow/types';

export default function PickingScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: pickingLists, refetch } = useQuery<PickingList[]>({
    queryKey: ['picking-lists', searchQuery],
    queryFn: async () => {
      const response = await api.get('/picking-lists', {
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
          {t('picking.title')}
        </Text>

        {/* Search Bar */}
        <View className="flex-row items-center bg-surface rounded-xl px-4 py-3">
          <Ionicons name="search" size={20} color="#6b7280" />
          <TextInput
            className="flex-1 text-white ml-3"
            placeholder={t('picking.searchPlaceholder')}
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

      {/* Picking Lists */}
      <ScrollView
        className="flex-1 px-6"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {pickingLists?.length === 0 ? (
          <View className="items-center justify-center py-12">
            <Ionicons name="cube-outline" size={64} color="#6b7280" />
            <Text className="text-gray-400 mt-4 text-center">
              {t('picking.noPickingLists')}
            </Text>
          </View>
        ) : (
          pickingLists?.map((list) => (
            <TouchableOpacity
              key={list.id}
              className="bg-card rounded-xl p-4 mb-4"
              onPress={() => router.push(`/picking/${list.id}`)}
            >
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-white font-semibold text-lg">
                  {list.number}
                </Text>
                <View
                  className="px-3 py-1 rounded-full"
                  style={{ backgroundColor: `${getStatusColor(list.status)}20` }}
                >
                  <Text style={{ color: getStatusColor(list.status) }}>
                    {t(`picking.status.${list.status.toLowerCase()}`)}
                  </Text>
                </View>
              </View>

              <Text className="text-gray-400 mb-2">
                {list.reservation?.project?.name || t('picking.noProject')}
              </Text>

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Ionicons name="cube" size={16} color="#6b7280" />
                  <Text className="text-gray-400 ml-2">
                    {list.items?.length || 0} {t('picking.items')}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                  <Text className="text-green-400 ml-2">
                    {list.items?.filter((i: any) => i.pickedQuantity === i.quantity).length || 0}/
                    {list.items?.length || 0}
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
          className="bg-primary-600 rounded-xl py-4 flex-row items-center justify-center"
          onPress={() => router.push('/scanner?mode=picking')}
        >
          <Ionicons name="scan" size={24} color="white" />
          <Text className="text-white font-semibold text-lg ml-2">
            {t('picking.scanToAdd')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
