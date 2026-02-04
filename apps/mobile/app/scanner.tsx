import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Vibration } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import { api } from '@/lib/api';

type ScanMode = 'article' | 'picking' | 'return' | 'inventory' | 'maintenance';

export default function ScannerScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{ mode: ScanMode }>();
  const mode = params.mode || 'article';

  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [torch, setTorch] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, []);

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    if (scanned || data === lastScannedCode) return;

    setScanned(true);
    setLastScannedCode(data);

    // Haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Vibration.vibrate(100);

    try {
      switch (mode) {
        case 'article':
          await handleArticleScan(data);
          break;
        case 'picking':
          await handlePickingScan(data);
          break;
        case 'return':
          await handleReturnScan(data);
          break;
        case 'inventory':
          await handleInventoryScan(data);
          break;
        case 'maintenance':
          await handleMaintenanceScan(data);
          break;
      }
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        t('scanner.error'),
        error.message || t('scanner.scanFailed'),
        [{ text: t('common.ok'), onPress: () => setScanned(false) }]
      );
    }
  };

  const handleArticleScan = async (code: string) => {
    const response = await api.get(`/articles/by-code/${code}`);
    if (response.data) {
      router.replace(`/article/${response.data.id}`);
    } else {
      Alert.alert(t('scanner.articleNotFound'), t('scanner.articleNotFoundDesc'));
      setScanned(false);
    }
  };

  const handlePickingScan = async (code: string) => {
    const response = await api.post('/picking/scan', { code });
    if (response.data.success) {
      Alert.alert(
        t('scanner.itemPicked'),
        t('scanner.itemPickedDesc', { name: response.data.article.name }),
        [
          { text: t('scanner.continue'), onPress: () => setScanned(false) },
          { text: t('common.done'), onPress: () => router.back() },
        ]
      );
    }
  };

  const handleReturnScan = async (code: string) => {
    const response = await api.post('/returns/scan', { code });
    if (response.data.success) {
      router.push({
        pathname: '/returns/check',
        params: { articleId: response.data.article.id, code },
      });
    }
  };

  const handleInventoryScan = async (code: string) => {
    const response = await api.post('/inventory/scan', { code });
    Alert.alert(
      t('scanner.itemScanned'),
      t('scanner.itemScannedDesc', { name: response.data.article.name }),
      [
        { text: t('scanner.continue'), onPress: () => setScanned(false) },
        { text: t('common.done'), onPress: () => router.back() },
      ]
    );
  };

  const handleMaintenanceScan = async (code: string) => {
    const response = await api.get(`/articles/by-code/${code}`);
    if (response.data) {
      router.push({
        pathname: '/maintenance/report',
        params: { articleId: response.data.id },
      });
    }
  };

  const getModeConfig = () => {
    switch (mode) {
      case 'article':
        return {
          title: t('scanner.modes.article'),
          color: '#3b82f6',
          icon: 'search',
        };
      case 'picking':
        return {
          title: t('scanner.modes.picking'),
          color: '#10b981',
          icon: 'cube',
        };
      case 'return':
        return {
          title: t('scanner.modes.return'),
          color: '#f59e0b',
          icon: 'return-down-back',
        };
      case 'inventory':
        return {
          title: t('scanner.modes.inventory'),
          color: '#8b5cf6',
          icon: 'clipboard',
        };
      case 'maintenance':
        return {
          title: t('scanner.modes.maintenance'),
          color: '#ef4444',
          icon: 'construct',
        };
      default:
        return {
          title: t('scanner.title'),
          color: '#3b82f6',
          icon: 'qr-code',
        };
    }
  };

  const modeConfig = getModeConfig();

  if (!permission) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <Text className="text-white">{t('scanner.requestingPermission')}</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 bg-black items-center justify-center px-6">
        <Ionicons name="camera-off" size={64} color="#6b7280" />
        <Text className="text-white text-lg mt-4 text-center">
          {t('scanner.permissionRequired')}
        </Text>
        <TouchableOpacity
          className="bg-primary-600 rounded-xl py-3 px-6 mt-6"
          onPress={requestPermission}
        >
          <Text className="text-white font-semibold">
            {t('scanner.grantPermission')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="mt-4" onPress={() => router.back()}>
          <Text className="text-gray-400">{t('common.goBack')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        enableTorch={torch}
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'ean13', 'ean8', 'code128', 'code39', 'code93'],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />

      {/* Header */}
      <View className="absolute top-0 left-0 right-0 pt-12 pb-4 px-6 flex-row items-center justify-between bg-black/50">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="white" />
        </TouchableOpacity>
        <View className="flex-row items-center">
          <View
            className="rounded-full p-2 mr-2"
            style={{ backgroundColor: `${modeConfig.color}40` }}
          >
            <Ionicons name={modeConfig.icon as any} size={20} color={modeConfig.color} />
          </View>
          <Text className="text-white font-semibold">{modeConfig.title}</Text>
        </View>
        <TouchableOpacity onPress={() => setTorch(!torch)}>
          <Ionicons
            name={torch ? 'flash' : 'flash-off'}
            size={28}
            color={torch ? '#fbbf24' : 'white'}
          />
        </TouchableOpacity>
      </View>

      {/* Scan Frame */}
      <View className="flex-1 items-center justify-center">
        <View className="w-72 h-72 relative">
          {/* Corners */}
          <View className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 rounded-tl-xl" style={{ borderColor: modeConfig.color }} />
          <View className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 rounded-tr-xl" style={{ borderColor: modeConfig.color }} />
          <View className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 rounded-bl-xl" style={{ borderColor: modeConfig.color }} />
          <View className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 rounded-br-xl" style={{ borderColor: modeConfig.color }} />
        </View>
      </View>

      {/* Footer */}
      <View className="absolute bottom-0 left-0 right-0 pb-12 pt-4 px-6 bg-black/50">
        <Text className="text-white text-center mb-4">
          {t('scanner.instruction')}
        </Text>
        {scanned && (
          <TouchableOpacity
            className="bg-white/20 rounded-xl py-3"
            onPress={() => setScanned(false)}
          >
            <Text className="text-white text-center font-semibold">
              {t('scanner.scanAgain')}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
