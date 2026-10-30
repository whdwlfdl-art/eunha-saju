/** Korean 천간·지지·띠·오행 tables for MVP key mapping. */

export const DAY_STEMS = [
  '갑',
  '을',
  '병',
  '정',
  '무',
  '기',
  '경',
  '신',
  '임',
  '계',
] as const;

export const BRANCHES = [
  '자',
  '축',
  '인',
  '묘',
  '진',
  '사',
  '오',
  '미',
  '신',
  '유',
  '술',
  '해',
] as const;

export const ZODIACS = [
  '쥐',
  '소',
  '호랑이',
  '토끼',
  '용',
  '뱀',
  '말',
  '양',
  '원숭이',
  '닭',
  '개',
  '돼지',
] as const;

/** 오행 mapped from 천간 (갑을木, 병정火, 무기土, 경신金, 임계水). */
export const STEM_ELEMENTS = [
  '목',
  '목',
  '화',
  '화',
  '토',
  '토',
  '금',
  '금',
  '수',
  '수',
] as const;

export const ELEMENT_LABEL: Record<(typeof STEM_ELEMENTS)[number], string> = {
  목: '나무',
  화: '불',
  토: '흙',
  금: '쇠',
  수: '물',
};
