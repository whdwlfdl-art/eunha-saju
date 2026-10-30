/** User-facing Korean microcopy — brand tone: modern casual. */
export const Copy = {
  brand: '은하사주',
  brandEn: 'Eunha Saju',
  tagline: '밤하늘처럼 맑게, 오늘의 흐름을 편하게 읽어요.',
  homeCtaFortune: '오늘의 운세 보기',
  homeCtaSaju: '내 사주 풀이',

  birthTitle: '생년월일을 알려주세요',
  birthHint: '태어난 시간을 모르면 ‘모름’으로 두세요',
  birthDateLabel: '생년월일',
  birthDatePlaceholder: '예: 1990-05-12',
  birthTimeLabel: '태어난 시간',
  birthTimePlaceholder: '예: 14:30',
  birthGender: '성별',
  birthGenderFemale: '여',
  birthGenderMale: '남',
  birthGenderOther: '기타',
  birthTimeUnknown: '시간 모름',
  birthSubmit: '운세 보기',
  birthDateError: '생년월일을 YYYY-MM-DD 형식으로 입력해 주세요',
  birthTimeError: '시간은 HH:mm 형식으로 입력하거나 ‘모름’을 선택해 주세요',

  fortuneHeader: '오늘 흐름, 한 줄로 보면 이래요',
  fortuneTipLabel: '오늘의 한 가지',
  fortuneKeyLabel: '사주 키 (참고)',
  adSlotLabel: '광고 영역 (AdMob 자리)',
  paidCta: '내 사주, 자세히 읽어보기',

  productTitle: '상세 사주 풀이',
  productBody:
    '성격·재물·연애·올해 흐름을 차분히 풀어드려요. 한 번 결제하면 앱에서 다시 볼 수 있어요.',
  /** Locked MVP UI price (₩6,900) — matches store console KRW setting. */
  productPrice: '일회 결제 · ₩6,900',
  productPreview: '미리보기 — 아래에서 항목을 확인할 수 있어요',
  productPay: '₩6,900 결제하기',
  productPayLoading: '결제 진행 중…',
  productRestore: '구매 복원',
  productRestoreLoading: '복원 중…',
  productMockBadge: '개발용 목(mock) 결제 — 스토어 미연결',
  productPaySuccessTitle: '결제 완료',
  productPaySuccessBody: '상세 사주 풀이를 열어둘게요.',
  productPaySuccessMockBody:
    '목(mock) 모드로 잠금을 해제했어요. 실제 스토어 결제는 개발 빌드 + 콘솔 상품 설정 후 가능해요.',
  productPayErrorTitle: '결제 안내',
  productRestoreSuccessTitle: '복원 완료',
  productRestoreSuccessBody: '이전 구매를 확인했어요. 상세 풀이를 열어둘게요.',
  productRestoreSuccessMockBody:
    '목(mock) 모드로 구매를 복원(또는 개발용 잠금 부여)했어요.',
  productRestoreEmptyTitle: '복원할 구매 없음',
  productRestoreEmptyBody:
    '이 계정에서 상세 사주 구매 내역을 찾지 못했어요. 결제한 Apple/Google 계정으로 다시 시도해 주세요.',
  detailDisclaimer:
    'MVP 규칙·템플릿 결과예요. 전문 역술 정확도를 주장하지 않아요.',
  backHome: '홈으로',
} as const;
