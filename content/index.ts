import { AiDraftProvider } from '@/content/AiDraftProvider';
import { TemplateProvider } from '@/content/TemplateProvider';
import type {
  ContentProvider,
  ContentRequest,
  DailyFortune,
  DetailReading,
} from '@/content/types';

export type {
  BirthInput,
  ContentProvider,
  ContentRequest,
  DailyFortune,
  DetailReading,
  DetailSection,
  DetailSectionId,
  Gender,
  SajuKeys,
} from '@/content/types';

export {
  deriveSajuKeys,
  isValidBirthDate,
  isValidBirthTime,
} from '@/content/keys';
export { TemplateProvider } from '@/content/TemplateProvider';
export { AiDraftProvider } from '@/content/AiDraftProvider';

/**
 * Prefer AI draft only when non-null (future reviewed drafts).
 * MVP: AiDraftProvider always returns null → TemplateProvider wins.
 */
export class CascadingContentProvider implements ContentProvider {
  readonly id = 'cascade';

  constructor(
    private readonly primary: ContentProvider,
    private readonly fallback: ContentProvider,
  ) {}

  async getDailyFortune(request: ContentRequest): Promise<DailyFortune | null> {
    const draft = await this.primary.getDailyFortune(request);
    if (draft) return draft;
    return this.fallback.getDailyFortune(request);
  }

  async getDetailReading(
    request: ContentRequest,
  ): Promise<DetailReading | null> {
    const draft = await this.primary.getDetailReading(request);
    if (draft) return draft;
    return this.fallback.getDetailReading(request);
  }
}

let defaultProvider: ContentProvider | null = null;

/** App-wide content source — template engine; AI stubbed behind interface. */
export function getContentProvider(): ContentProvider {
  if (!defaultProvider) {
    defaultProvider = new CascadingContentProvider(
      new AiDraftProvider(),
      new TemplateProvider(),
    );
  }
  return defaultProvider;
}

export async function loadDailyFortune(
  request: ContentRequest,
): Promise<DailyFortune> {
  const result = await getContentProvider().getDailyFortune(request);
  if (!result) {
    // Should not happen with TemplateProvider fallback
    return new TemplateProvider().getDailyFortune(request);
  }
  return result;
}

export async function loadDetailReading(
  request: ContentRequest,
): Promise<DetailReading> {
  const result = await getContentProvider().getDetailReading(request);
  if (!result) {
    return new TemplateProvider().getDetailReading(request);
  }
  return result;
}
