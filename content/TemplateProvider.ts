import { deriveSajuKeys, pickIndex } from '@/content/keys';
import {
  DAILY_BODIES,
  DAILY_HEADLINES,
  DAILY_TIPS,
  DETAIL_LOVE,
  DETAIL_OVERVIEW,
  DETAIL_PERSONALITY,
  DETAIL_SUMMARIES,
  DETAIL_WEALTH,
  DETAIL_YEAR_FLOW,
  ELEMENT_FLAVORS,
  type ElementLabel,
} from '@/content/templates';
import type {
  ContentProvider,
  ContentRequest,
  DailyFortune,
  DetailReading,
} from '@/content/types';

function elementFlavor(element: string, salt: string): string {
  const label = (element in ELEMENT_FLAVORS ? element : '흙') as ElementLabel;
  const pool = ELEMENT_FLAVORS[label];
  return pool[pickIndex(`${salt}:ef`, pool.length)];
}

/**
 * Rule + template engine — primary ContentProvider for MVP.
 * Deterministic: same birth + day → same copy.
 * Variety: large pools + 오행 flavor salted by dayStem / dailyKey / profileKey.
 */
export class TemplateProvider implements ContentProvider {
  readonly id = 'template';

  async getDailyFortune(request: ContentRequest): Promise<DailyFortune> {
    const asOf = request.asOf ?? new Date();
    const keys = deriveSajuKeys(request.birth, asOf);
    const k = keys.dailyKey;
    const stemSalt = `${k}:${keys.dayStem}:${keys.dayBranch}`;

    const tipBase = DAILY_TIPS[pickIndex(`${stemSalt}:t`, DAILY_TIPS.length)];
    const flavor = elementFlavor(keys.element, stemSalt);
    // Keep tip card-short: base tip, then soft 오행 결
    const tip = `${tipBase} ${flavor}`;

    return {
      headline: DAILY_HEADLINES[pickIndex(`${stemSalt}:h`, DAILY_HEADLINES.length)],
      body: DAILY_BODIES[pickIndex(`${stemSalt}:b`, DAILY_BODIES.length)],
      tip,
      keys,
      source: 'template',
    };
  }

  async getDetailReading(request: ContentRequest): Promise<DetailReading> {
    const asOf = request.asOf ?? new Date();
    const keys = deriveSajuKeys(request.birth, asOf);
    const k = keys.profileKey;
    const salt = `${k}:${keys.element}:${keys.zodiac}`;

    const yearFlavor = elementFlavor(keys.element, `${salt}:yf`);
    const yearBody =
      DETAIL_YEAR_FLOW[pickIndex(`${salt}:yf`, DETAIL_YEAR_FLOW.length)];

    return {
      summary: DETAIL_SUMMARIES[pickIndex(`${salt}:sum`, DETAIL_SUMMARIES.length)],
      sections: [
        {
          id: 'personality',
          title: '성격',
          body: DETAIL_PERSONALITY[
            pickIndex(`${salt}:per`, DETAIL_PERSONALITY.length)
          ],
        },
        {
          id: 'overview',
          title: '총운',
          body: DETAIL_OVERVIEW[pickIndex(`${salt}:ov`, DETAIL_OVERVIEW.length)],
        },
        {
          id: 'wealth',
          title: '재물',
          body: DETAIL_WEALTH[pickIndex(`${salt}:we`, DETAIL_WEALTH.length)],
        },
        {
          id: 'love',
          title: '연애·관계',
          body: DETAIL_LOVE[pickIndex(`${salt}:lo`, DETAIL_LOVE.length)],
        },
        {
          id: 'yearFlow',
          title: '올해 흐름',
          body: `${yearBody} ${yearFlavor}`,
        },
      ],
      keys,
      source: 'template',
    };
  }
}
