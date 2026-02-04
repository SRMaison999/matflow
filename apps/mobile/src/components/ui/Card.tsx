import { View, TouchableOpacity, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  onPress?: () => void;
  variant?: 'default' | 'surface';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
  children,
  onPress,
  variant = 'default',
  padding = 'md',
  className = '',
  ...props
}: CardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'surface':
        return 'bg-surface';
      default:
        return 'bg-card';
    }
  };

  const getPaddingStyles = () => {
    switch (padding) {
      case 'none':
        return '';
      case 'sm':
        return 'p-2';
      case 'md':
        return 'p-4';
      case 'lg':
        return 'p-6';
      default:
        return 'p-4';
    }
  };

  const styles = `rounded-xl ${getVariantStyles()} ${getPaddingStyles()} ${className}`;

  if (onPress) {
    return (
      <TouchableOpacity className={styles} onPress={onPress} {...props}>
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View className={styles} {...props}>
      {children}
    </View>
  );
}
