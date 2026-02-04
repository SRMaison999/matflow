import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

export default function ScanScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const scanModes = [
    {
      id: 'article',
      icon: 'search',
      title: t('scan.articleInfo'),
      description: t('scan.articleInfoDesc'),
      color: '#3b82f6',
    },
    {
      id: 'picking',
      icon: 'cube',
      title: t('scan.picking'),
      description: t('scan.pickingDesc'),
      color: '#10b981',
    },
    {
      id: 'return',
      icon: 'return-down-back',
      title: t('scan.return'),
      description: t('scan.returnDesc'),
      color: '#f59e0b',
    },
    {
      id: 'inventory',
      icon: 'clipboard',
      title: t('scan.inventory'),
      description: t('scan.inventoryDesc'),
      color: '#8b5cf6',
    },
    {
      id: 'maintenance',
      icon: 'construct',
      title: t('scan.maintenance'),
      description: t('scan.maintenanceDesc'),
      color: '#ef4444',
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-6 pt-4 pb-4">
        <Text className="text-white text-2xl font-bold mb-2">
          {t('scan.title')}
        </Text>
        <Text className="text-gray-400">
          {t('scan.subtitle')}
        </Text>
      </View>

      <View className="flex-1 px-6">
        {scanModes.map((mode) => (
          <TouchableOpacity
            key={mode.id}
            className="bg-card rounded-xl p-4 mb-4 flex-row items-center"
            onPress={() => router.push(`/scanner?mode=${mode.id}`)}
          >
            <View
              className="rounded-full p-4 mr-4"
              style={{ backgroundColor: `${mode.color}20` }}
            >
              <Ionicons name={mode.icon as any} size={28} color={mode.color} />
            </View>
            <View className="flex-1">
              <Text className="text-white font-semibold text-lg">
                {mode.title}
              </Text>
              <Text className="text-gray-400 mt-1">{mode.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#6b7280" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Quick Scan Button */}
      <View className="px-6 pb-6">
        <TouchableOpacity
          className="bg-primary-600 rounded-xl py-4 flex-row items-center justify-center"
          onPress={() => router.push('/scanner?mode=article')}
        >
          <Ionicons name="qr-code" size={24} color="white" />
          <Text className="text-white font-semibold text-lg ml-2">
            {t('scan.quickScan')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
