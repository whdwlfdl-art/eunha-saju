import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Brand } from '@/constants/Colors';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: '없네요' }} />
      <View style={styles.container}>
        <Text style={styles.title}>이 화면은 없어요</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>홈으로 돌아가기</Text>
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
    padding: 24,
    backgroundColor: Brand.paper,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Brand.ink,
  },
  link: {
    marginTop: 16,
    paddingVertical: 12,
  },
  linkText: {
    fontSize: 16,
    color: Brand.sky,
  },
});
