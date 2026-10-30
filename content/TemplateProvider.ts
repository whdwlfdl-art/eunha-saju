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
} from '@/content/templates';
import type {
  ContentProvider,
  ContentRequest,
  DailyFortune,
  DetailReading,
} from '@/content/types';

/**
 * Rule + template engine — primary ContentProvider for MVP.
 * Deterministic: same birth + day → same copy.
 */
export class TemplateProvider implements ContentProvider {
  readonly id = 'template';

  async getDailyFortune(request: ContentRequest): Promise<DailyFortune> {
    const asOf = request.asOf ?? new Date();
    const keys = deriveSajuKeys(request.birth, asOf);
    const k = keys.dailyKey;

    return {
      headline: DAILY_HEADLINES[pickIndex(`${k}:h`, DAILY_HEADLINES.length)],
      body: DAILY_BODIES[pickIndex(`${k}:b`, DAILY_BODIES.length)],
      tip: DAILY_TIPS[pickIndex(`${k}:t`, DAILY_TIPS.length)],
      keys,
      source: 'template',
    };
  }

  async getDetailReading(request: ContentRequest): Promise<DetailReading> {
    const asOf = request.asOf ?? new Date();
    const keys = deriveSajuKeys(request.birth, asOf);
    const k = keys.profileKey;

    return {
      summary: DETAIL_SUMMARIES[pickIndex(`${k}:sum`, DETAIL_SUMMARIES.length)],
      sections: [
        {
          id: 'personality',
          title: '성격',
          body: DETAIL_PERSONALITY[
            pickIndex(`${k}:per`, DETAIL_PERSONALITY.length)
          ],
        },
        {
          id: 'overview',
          title: '총운',
          body: DETAIL_OVERVIEW[pickIndex(`${k}:ov`, DETAIL_OVERVIEW.length)],
        },
        {
          id: 'wealth',
          title: '재물',
          body: DETAIL_WEALTH[pickIndex(`${k}:we`, DETAIL_WEALTH.length)],
        },
        {
          id: 'love',
          title: '연애·관계',
          body: DETAIL_LOVE[pickIndex(`${k}:lo`, DETAIL_LOVE.length)],
        },
        {
          id: 'yearFlow',
          title: '올해 흐름',
          body: DETAIL_YEAR_FLOW[pickIndex(`${k}:yf`, DETAIL_YEAR_FLOW.length)],
        },
      ],
      keys,
      source: 'template',
    };
  }
}
