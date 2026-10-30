import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Brand } from '@/constants/Colors';
import { Copy } from '@/constants/Copy';
import { Font } from '@/constants/Typography';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: '없네요' }} />
      <View style={styles.container}>
        <Text style={styles.title}>{Copy.notFoundTitle}</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>{Copy.notFoundLink}</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
    backgroundColor: Brand.paper,
  },
  title: {
    fontFamily: Font.displaySemi,
    fontSize: 22,
    color: Brand.ink,
    lineHeight: 30,
  },
  link: {
    marginTop: 18,
    paddingVertical: 12,
  },
  linkText: {
    fontFamily: Font.sansMedium,
    fontSize: 16,
    color: Brand.sky,
  },
});
