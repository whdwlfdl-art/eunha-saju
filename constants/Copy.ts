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
  birthSubmitDetail: '상세 풀이로',
  birthDateError: '생년월일은 YYYY-MM-DD로 적어 주세요',
  birthTimeError: '시간은 HH:mm이거나 ‘모름’을 골라 주세요',

  fortuneHeader: '오늘 흐름, 한 줄로 보면 이래요',
  fortuneTipLabel: '오늘의 한 가지',
  fortuneKeyLabel: '사주 키',
  fortuneLoading: '오늘 흐름을 읽고 있어요…',
  fortuneEmpty: '아직 보여줄 흐름이 없어요. 생년월일을 다시 확인해 볼래요?',
  fortuneInputPrefix: '입력',
  adSlotLabel: '광고 자리 · 곧 AdMob으로 연결해요',
  paidCta: '내 사주, 자세히 읽어보기',

  productTitle: '상세 사주 풀이',
  productBody:
    '성격·재물·연애·올해 흐름을 차분히 풀어드려요. 한 번 결제하면 앱에서 다시 볼 수 있어요.',
  /** Locked MVP UI price (₩6,900) — matches store console KRW setting. */
  productPrice: '일회 결제',
  productPriceAmount: '₩6,900',
  productPreview: '받게 되는 항목',
  productPay: '₩6,900 결제하기',
  productPayLoading: '결제 진행 중…',
  productRestore: '구매 복원',
  productRestoreLoading: '복원 중…',
  productMockBadge: '지금은 개발용 목(mock) 결제예요 · 스토어는 아직 연결 전',
  productPaySuccessTitle: '결제 완료',
  productPaySuccessBody: '상세 사주 풀이를 열어둘게요.',
  productPaySuccessMockBody:
    '목(mock) 모드로 잠금을 해제했어요. 실제 스토어 결제는 개발 빌드 + 콘솔 상품 설정 후 가능해요.',
  productPayErrorTitle: '결제 안내',
  productPayErrorBody: '결제가 이어지지 않았어요. 잠시 뒤 다시 눌러볼래요?',
  productRestoreSuccessTitle: '복원 완료',
  productRestoreSuccessBody: '이전 구매를 확인했어요. 상세 풀이를 열어둘게요.',
  productRestoreSuccessMockBody:
    '목(mock) 모드로 구매를 복원(또는 개발용 잠금 부여)했어요.',
  productRestoreEmptyTitle: '복원할 구매가 없어요',
  productRestoreEmptyBody:
    '이 계정에서 상세 사주 구매를 찾지 못했어요. 결제한 Apple/Google 계정으로 다시 시도해 주세요.',
  detailLoading: '풀이를 준비하고 있어요…',
  purchaseHydrating: '구매 상태를 확인하고 있어요…',
  detailDisclaimer:
    '규칙·템플릿 결과예요. 전문 역술 정확도를 주장하지 않아요.',
  detailKeyLabel: '사주 키',
  backHome: '홈으로',
  privacyPolicy: '개인정보 처리방침',

  notFoundTitle: '이 화면은 없어요',
  notFoundLink: '홈으로 돌아가기',
} as const;
