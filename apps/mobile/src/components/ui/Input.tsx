import { View, Text, TextInput, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { forwardRef } from 'react';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, icon, rightIcon, onRightIconPress, ...props }, ref) => {
    return (
      <View className="mb-4">
        {label && (
          <Text className="text-white mb-2 font-medium">{label}</Text>
        )}
        <View
          className={`flex-row items-center bg-surface border rounded-xl px-4 py-3 ${
            error ? 'border-red-500' : 'border-gray-700'
          }`}
        >
          {icon && (
            <Ionicons
              name={icon}
              size={20}
              color="#6b7280"
              style={{ marginRight: 12 }}
            />
          )}
          <TextInput
            ref={ref}
            className="flex-1 text-white"
            placeholderTextColor="#6b7280"
            {...props}
          />
          {rightIcon && (
            <Ionicons
              name={rightIcon}
              size={20}
              color="#6b7280"
              onPress={onRightIconPress}
            />
          )}
        </View>
        {error && (
          <Text className="text-red-400 text-sm mt-1">{error}</Text>
        )}
      </View>
    );
  }
);

Input.displayName = 'Input';
