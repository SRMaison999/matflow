import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Article } from '@matflow/types';

export default function ArticleDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: article, isLoading } = useQuery<Article>({
    queryKey: ['article', id],
    queryFn: async () => {
      const response = await api.get(`/articles/${id}`);
      return response.data;
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return '#10b981';
      case 'RESERVED':
        return '#f59e0b';
      case 'IN_USE':
        return '#3b82f6';
      case 'IN_MAINTENANCE':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </SafeAreaView>
    );
  }

  if (!article) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <Ionicons name="alert-circle" size={64} color="#6b7280" />
        <Text className="text-gray-400 mt-4">{t('article.notFound')}</Text>
        <TouchableOpacity
          className="bg-primary-600 rounded-xl py-3 px-6 mt-6"
          onPress={() => router.back()}
        >
          <Text className="text-white font-semibold">{t('common.goBack')}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white font-semibold text-lg">
          {t('article.details')}
        </Text>
        <TouchableOpacity onPress={() => router.push(`/article/${id}/edit`)}>
          <Ionicons name="create" size={24} color="#3b82f6" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        {/* Image */}
        {article.images?.[0] ? (
          <Image
            source={{ uri: article.images[0] }}
            className="w-full h-64"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-64 bg-surface items-center justify-center">
            <Ionicons name="cube" size={64} color="#6b7280" />
          </View>
        )}

        {/* Main Info */}
        <View className="px-6 py-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-white text-2xl font-bold">{article.name}</Text>
              <Text className="text-gray-400 mt-1">{article.code}</Text>
            </View>
            <View
              className="px-4 py-2 rounded-full"
              style={{ backgroundColor: `${getStatusColor(article.status)}20` }}
            >
              <Text style={{ color: getStatusColor(article.status) }}>
                {t(`article.status.${article.status.toLowerCase()}`)}
              </Text>
            </View>
          </View>

          {article.description && (
            <Text className="text-gray-400 mt-4">{article.description}</Text>
          )}
        </View>

        {/* Details Cards */}
        <View className="px-6">
          {/* Category & Location */}
          <View className="bg-card rounded-xl p-4 mb-4">
            <View className="flex-row mb-4">
              <View className="flex-1">
                <Text className="text-gray-400 text-sm">{t('article.category')}</Text>
                <Text className="text-white font-medium mt-1">
                  {article.category?.name || '-'}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-400 text-sm">{t('article.location')}</Text>
                <Text className="text-white font-medium mt-1">
                  {article.location?.name || '-'}
                </Text>
              </View>
            </View>
            <View className="flex-row">
              <View className="flex-1">
                <Text className="text-gray-400 text-sm">{t('article.branch')}</Text>
                <Text className="text-white font-medium mt-1">
                  {article.branch?.name || '-'}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-400 text-sm">{t('article.type')}</Text>
                <Text className="text-white font-medium mt-1">
                  {t(`article.types.${article.type.toLowerCase()}`)}
                </Text>
              </View>
            </View>
          </View>

          {/* Serial & Barcode */}
          {(article.serialNumber || article.barcode) && (
            <View className="bg-card rounded-xl p-4 mb-4">
              {article.serialNumber && (
                <View className="mb-4">
                  <Text className="text-gray-400 text-sm">{t('article.serialNumber')}</Text>
                  <Text className="text-white font-mono mt-1">{article.serialNumber}</Text>
                </View>
              )}
              {article.barcode && (
                <View>
                  <Text className="text-gray-400 text-sm">{t('article.barcode')}</Text>
                  <Text className="text-white font-mono mt-1">{article.barcode}</Text>
                </View>
              )}
            </View>
          )}

          {/* Pricing */}
          <View className="bg-card rounded-xl p-4 mb-4">
            <Text className="text-gray-400 text-sm mb-3">{t('article.pricing')}</Text>
            <View className="flex-row">
              <View className="flex-1">
                <Text className="text-gray-500 text-xs">{t('article.purchasePrice')}</Text>
                <Text className="text-white font-semibold text-lg">
                  {article.purchasePrice ? `CHF ${article.purchasePrice.toFixed(2)}` : '-'}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-500 text-xs">{t('article.rentalPriceDaily')}</Text>
                <Text className="text-primary-400 font-semibold text-lg">
                  {article.rentalPriceDaily ? `CHF ${article.rentalPriceDaily.toFixed(2)}/j` : '-'}
                </Text>
              </View>
            </View>
          </View>

          {/* Maintenance Info */}
          {article.lastMaintenanceDate && (
            <View className="bg-card rounded-xl p-4 mb-4">
              <Text className="text-gray-400 text-sm mb-3">{t('article.maintenance')}</Text>
              <View className="flex-row">
                <View className="flex-1">
                  <Text className="text-gray-500 text-xs">{t('article.lastMaintenance')}</Text>
                  <Text className="text-white">
                    {new Date(article.lastMaintenanceDate).toLocaleDateString()}
                  </Text>
                </View>
                {article.nextMaintenanceDate && (
                  <View className="flex-1">
                    <Text className="text-gray-500 text-xs">{t('article.nextMaintenance')}</Text>
                    <Text className="text-white">
                      {new Date(article.nextMaintenanceDate).toLocaleDateString()}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View className="px-6 py-4 flex-row gap-4">
        <TouchableOpacity
          className="flex-1 bg-amber-500 rounded-xl py-4 flex-row items-center justify-center"
          onPress={() => router.push(`/maintenance/report?articleId=${id}`)}
        >
          <Ionicons name="construct" size={20} color="white" />
          <Text className="text-white font-semibold ml-2">
            {t('article.reportIssue')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 bg-primary-600 rounded-xl py-4 flex-row items-center justify-center"
          onPress={() => router.push(`/article/${id}/history`)}
        >
          <Ionicons name="time" size={20} color="white" />
          <Text className="text-white font-semibold ml-2">
            {t('article.history')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
