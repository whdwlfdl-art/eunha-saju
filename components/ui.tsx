import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
  type ViewProps,
} from 'react-native';

import { Brand } from '@/constants/Colors';

export function Screen({ style, ...props }: ViewProps) {
  return <View style={[styles.screen, style]} {...props} />;
}

export function BrandMark() {
  return <Text style={styles.brand}>{`은하사주`}</Text>;
}

export function Title({ children }: { children: string }) {
  return <Text style={styles.title}>{children}</Text>;
}

export function Body({ children }: { children: string }) {
  return <Text style={styles.body}>{children}</Text>;
}

export function Muted({ children }: { children: string }) {
  return <Text style={styles.muted}>{children}</Text>;
}

export function PrimaryButton({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.primaryBtn,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}>
      <Text style={styles.primaryBtnText}>{label}</Text>
    </Pressable>
  );
}

export function SecondaryButton({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.secondaryBtn,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}>
      <Text style={styles.secondaryBtnText}>{label}</Text>
    </Pressable>
  );
}

export function Field(props: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor={Brand.inkMuted}
      style={styles.field}
      {...props}
    />
  );
}

export function AdSlotPlaceholder() {
  return (
    <View style={styles.adSlot} accessibilityLabel="광고 자리">
      <Text style={styles.adSlotText}>광고 영역 (AdMob 자리)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Brand.paper,
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 32,
  },
  brand: {
    fontSize: 36,
    fontWeight: '700',
    color: Brand.ink,
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: Brand.ink,
    lineHeight: 30,
    marginBottom: 10,
  },
  body: {
    fontSize: 16,
    color: Brand.ink,
    lineHeight: 26,
  },
  muted: {
    fontSize: 14,
    color: Brand.inkMuted,
    lineHeight: 22,
  },
  primaryBtn: {
    backgroundColor: Brand.amber,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: Brand.white,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: Brand.line,
    backgroundColor: Brand.white,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: Brand.sky,
    fontSize: 16,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.88,
  },
  disabled: {
    opacity: 0.5,
  },
  field: {
    borderWidth: 1,
    borderColor: Brand.line,
    backgroundColor: Brand.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Brand.ink,
  },
  adSlot: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Brand.line,
    backgroundColor: Brand.paperDeep,
    borderRadius: 8,
    paddingVertical: 20,
    alignItems: 'center',
  },
  adSlotText: {
    color: Brand.inkMuted,
    fontSize: 13,
  },
});
