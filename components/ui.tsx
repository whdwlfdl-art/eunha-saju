import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, type ReactNode } from 'react';
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
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Brand } from '@/constants/Colors';
import { Copy } from '@/constants/Copy';
import { Font } from '@/constants/Typography';

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
    paddingBottom: Math.max(insets.bottom, 16) + 20,
    paddingHorizontal: 28,
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
        locations={[0, 0.42, 1]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View pointerEvents="none" style={styles.skyWash} />
      {inner}
    </View>
  );
}

/** Soft rise + fade for result sections (1 of the intentional motions). */
export function FadeIn({
  children,
  delay = 0,
  style,
}: {
  children: ReactNode;
  delay?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const opacity = useSharedValue(0);
  const rise = useSharedValue(12);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 440 }));
    rise.value = withDelay(delay, withTiming(0, { duration: 440 }));
  }, [delay, opacity, rise]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: rise.value }],
  }));

  return <Animated.View style={[animStyle, style]}>{children}</Animated.View>;
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

/** Lowest CTA weight — for dismiss / home, not competing with pay. */
export function TextButton({
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
        styles.textBtn,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}>
      <Text style={styles.textBtnLabel}>{label}</Text>
    </Pressable>
  );
}

/** ₩6,900 price hierarchy — amount first, quiet caption under. */
export function PriceHighlight({
  amount,
  caption,
}: {
  amount: string;
  caption: string;
}) {
  return (
    <View style={styles.priceBlock}>
      <Text style={styles.priceAmount}>{amount}</Text>
      <Text style={styles.priceCaption}>{caption}</Text>
    </View>
  );
}

export function Field({ style, ...props }: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor={Brand.inkMuted}
      style={[styles.field, style]}
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

/** Quiet key meta — text row instead of pill chips. */
export function KeyMeta({
  items,
}: {
  items: { label: string; value: string }[];
}) {
  return (
    <Text style={styles.keyMeta}>
      {items.map((item, i) => (
        <Text key={item.label}>
          {i > 0 ? '  ·  ' : ''}
          <Text style={styles.keyMetaLabel}>{item.label} </Text>
          <Text style={styles.keyMetaValue}>{item.value}</Text>
        </Text>
      ))}
    </Text>
  );
}

/** @deprecated Prefer KeyMeta — kept name alias for call sites during polish. */
export function KeyChipRow(props: {
  items: { label: string; value: string }[];
}) {
  return <KeyMeta {...props} />;
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
    height: 200,
    backgroundColor: Brand.sky,
    opacity: 0.05,
  },
  brandBlock: {
    marginBottom: 16,
  },
  brand: {
    fontFamily: Font.display,
    fontSize: 44,
    color: Brand.ink,
    letterSpacing: -1.2,
    lineHeight: 54,
  },
  brandEn: {
    marginTop: 6,
    fontFamily: Font.sansMedium,
    fontSize: 13,
    color: Brand.skySoft,
    letterSpacing: 0.8,
  },
  title: {
    fontFamily: Font.displaySemi,
    fontSize: 24,
    color: Brand.ink,
    lineHeight: 34,
    marginBottom: 12,
  },
  body: {
    fontFamily: Font.sans,
    fontSize: 16,
    color: Brand.ink,
    lineHeight: 27,
  },
  muted: {
    fontFamily: Font.sans,
    fontSize: 14,
    color: Brand.inkMuted,
    lineHeight: 22,
  },
  sectionLabel: {
    fontFamily: Font.sansSemi,
    fontSize: 13,
    color: Brand.sky,
    letterSpacing: 0.3,
    marginBottom: 10,
  },
  resultBlock: {
    paddingVertical: 2,
    gap: 10,
  },
  resultTitle: {
    fontFamily: Font.sansSemi,
    fontSize: 16,
    color: Brand.sky,
    lineHeight: 24,
  },
  resultBody: {
    fontFamily: Font.sans,
    fontSize: 16,
    color: Brand.ink,
    lineHeight: 28,
  },
  primaryBtn: {
    backgroundColor: Brand.amber,
    paddingVertical: 17,
    paddingHorizontal: 22,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryBtnText: {
    fontFamily: Font.sansSemi,
    color: Brand.white,
    fontSize: 16,
  },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: Brand.line,
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 22,
    borderRadius: 10,
    alignItems: 'center',
  },
  secondaryBtnText: {
    fontFamily: Font.sansSemi,
    color: Brand.sky,
    fontSize: 16,
  },
  textBtn: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  textBtnLabel: {
    fontFamily: Font.sansMedium,
    color: Brand.inkMuted,
    fontSize: 15,
  },
  priceBlock: {
    marginTop: 20,
    marginBottom: 4,
    gap: 4,
  },
  priceAmount: {
    fontFamily: Font.display,
    fontSize: 36,
    color: Brand.ink,
    letterSpacing: -0.8,
    lineHeight: 44,
  },
  priceCaption: {
    fontFamily: Font.sans,
    fontSize: 14,
    color: Brand.inkMuted,
    lineHeight: 20,
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
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: Font.sans,
    fontSize: 16,
    color: Brand.ink,
  },
  adSlot: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Brand.line,
    backgroundColor: 'transparent',
    borderRadius: 8,
    paddingVertical: 18,
    alignItems: 'center',
  },
  adSlotText: {
    fontFamily: Font.sans,
    color: Brand.inkMuted,
    fontSize: 13,
  },
  keyMeta: {
    fontFamily: Font.sans,
    fontSize: 13,
    lineHeight: 22,
    color: Brand.inkMuted,
  },
  keyMetaLabel: {
    fontFamily: Font.sans,
    color: Brand.skySoft,
  },
  keyMetaValue: {
    fontFamily: Font.sansMedium,
    color: Brand.ink,
  },
});
