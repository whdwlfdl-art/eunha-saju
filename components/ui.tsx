import { LinearGradient } from 'expo-linear-gradient';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Brand } from '@/constants/Colors';
import { Copy } from '@/constants/Copy';

type ScreenProps = ViewProps & {
  scroll?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

/** Paper base + soft sky wash — room for designer to swap visuals later. */
export function Screen({
  scroll,
  style,
  contentStyle,
  children,
  ...props
}: ScreenProps) {
  const insets = useSafeAreaInsets();
  const pad = {
    paddingTop: Math.max(insets.top, 16) + 12,
    paddingBottom: Math.max(insets.bottom, 16) + 16,
    paddingHorizontal: 24,
  };

  const inner = scroll ? (
    <ScrollView
      contentContainerStyle={[pad, styles.scrollContent, contentStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.fill, pad, contentStyle]}>{children}</View>
  );

  return (
    <View style={[styles.root, style]} {...props}>
      <LinearGradient
        colors={[Brand.paper, '#eef1f4', Brand.paperDeep]}
        locations={[0, 0.45, 1]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {/* Soft sky band — atmospheric, not purple glow */}
      <View pointerEvents="none" style={styles.skyWash} />
      {inner}
    </View>
  );
}

export function BrandMark() {
  return (
    <View style={styles.brandBlock}>
      <Text style={styles.brand}>{Copy.brand}</Text>
      <Text style={styles.brandEn}>{Copy.brandEn}</Text>
    </View>
  );
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

export function SectionLabel({ children }: { children: string }) {
  return <Text style={styles.sectionLabel}>{children}</Text>;
}

export function ResultBlock({
  title,
  body,
}: {
  title?: string;
  body: string;
}) {
  return (
    <View style={styles.resultBlock}>
      {title ? <Text style={styles.resultTitle}>{title}</Text> : null}
      <Text style={styles.resultBody}>{body}</Text>
    </View>
  );
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
    <View style={styles.adSlot} accessibilityLabel={Copy.adSlotLabel}>
      <Text style={styles.adSlotText}>{Copy.adSlotLabel}</Text>
    </View>
  );
}

export function KeyChipRow({
  items,
}: {
  items: { label: string; value: string }[];
}) {
  return (
    <View style={styles.chipRow}>
      {items.map((item) => (
        <View key={item.label} style={styles.keyChip}>
          <Text style={styles.keyChipLabel}>{item.label}</Text>
          <Text style={styles.keyChipValue}>{item.value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Brand.paper,
  },
  fill: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  skyWash: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 180,
    backgroundColor: Brand.sky,
    opacity: 0.06,
  },
  brandBlock: {
    marginBottom: 12,
  },
  brand: {
    fontSize: 40,
    fontWeight: '700',
    color: Brand.ink,
    letterSpacing: -1,
    lineHeight: 48,
  },
  brandEn: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '500',
    color: Brand.skySoft,
    letterSpacing: 0.6,
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
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Brand.sky,
    letterSpacing: 0.2,
    marginBottom: 8,
  },
  resultBlock: {
    paddingVertical: 4,
    gap: 8,
  },
  resultTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Brand.sky,
  },
  resultBody: {
    fontSize: 16,
    color: Brand.ink,
    lineHeight: 27,
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
    transform: [{ scale: 0.985 }],
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
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  keyChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: Brand.white,
    borderWidth: 1,
    borderColor: Brand.line,
    minWidth: 72,
  },
  keyChipLabel: {
    fontSize: 11,
    color: Brand.inkMuted,
    marginBottom: 2,
  },
  keyChipValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Brand.ink,
  },
});
