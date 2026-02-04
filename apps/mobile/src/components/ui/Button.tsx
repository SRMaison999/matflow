import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
}: ButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary-600';
      case 'secondary':
        return 'bg-surface';
      case 'outline':
        return 'bg-transparent border border-primary-600';
      case 'ghost':
        return 'bg-transparent';
      case 'danger':
        return 'bg-red-500';
      default:
        return 'bg-primary-600';
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'outline':
      case 'ghost':
        return 'text-primary-400';
      default:
        return 'text-white';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'py-2 px-4';
      case 'md':
        return 'py-3 px-6';
      case 'lg':
        return 'py-4 px-8';
      default:
        return 'py-3 px-6';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 16;
      case 'md':
        return 20;
      case 'lg':
        return 24;
      default:
        return 20;
    }
  };

  const iconColor = variant === 'outline' || variant === 'ghost' ? '#60a5fa' : 'white';

  return (
    <TouchableOpacity
      className={`rounded-xl flex-row items-center justify-center ${getVariantStyles()} ${getSizeStyles()} ${
        fullWidth ? 'w-full' : ''
      } ${disabled || loading ? 'opacity-50' : ''}`}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={iconColor} />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Ionicons name={icon} size={getIconSize()} color={iconColor} style={{ marginRight: 8 }} />
          )}
          <Text className={`font-semibold ${getTextColor()}`}>{title}</Text>
          {icon && iconPosition === 'right' && (
            <Ionicons name={icon} size={getIconSize()} color={iconColor} style={{ marginLeft: 8 }} />
          )}
        </>
      )}
    </TouchableOpacity>
  );
}
