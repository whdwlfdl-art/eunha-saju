import { AiDraftProvider } from '@/content/AiDraftProvider';
import { TemplateProvider } from '@/content/TemplateProvider';
import type {
  AiContentDraft,
  ContentProvider,
  ContentRequest,
  DailyFortune,
  DetailReading,
  DraftReviewStatus,
  GenerateDraftInput,
} from '@/content/types';

export type {
  AiContentDraft,
  BirthInput,
  ContentProvider,
  ContentRequest,
  DailyFortune,
  DetailReading,
  DetailSection,
  DetailSectionId,
  DraftKind,
  DraftReviewStatus,
  Gender,
  GenerateDraftInput,
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
 * Prefer AI draft only when non-null (= approved).
 * MVP default: no approved drafts → TemplateProvider wins.
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

let aiDraftSingleton: AiDraftProvider | null = null;
let defaultProvider: ContentProvider | null = null;

/** Shared AI draft queue (in-memory mock). */
export function getAiDraftProvider(): AiDraftProvider {
  if (!aiDraftSingleton) {
    aiDraftSingleton = new AiDraftProvider();
  }
  return aiDraftSingleton;
}

/** App-wide content source — approved AI first, else templates. */
export function getContentProvider(): ContentProvider {
  if (!defaultProvider) {
    defaultProvider = new CascadingContentProvider(
      getAiDraftProvider(),
      new TemplateProvider(),
    );
  }
  return defaultProvider;
}

/** Create a mock draft marked `pending_review` (does not ship to UI). */
export function generateContentDraft(
  input: GenerateDraftInput,
): Promise<AiContentDraft> {
  return getAiDraftProvider().generateDraft(input);
}

/** Approve / reject a draft after human review. */
export function reviewContentDraft(
  id: string,
  status: Exclude<DraftReviewStatus, 'pending_review'>,
  reviewNote?: string,
): AiContentDraft | null {
  return getAiDraftProvider().setDraftStatus(id, status, reviewNote);
}

export function listContentDrafts(): AiContentDraft[] {
  return getAiDraftProvider().listDrafts();
}

export async function loadDailyFortune(
  request: ContentRequest,
): Promise<DailyFortune> {
  const result = await getContentProvider().getDailyFortune(request);
  if (!result) {
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

/** Test helper — reset cascade singletons. */
export function __resetContentProvidersForTests(): void {
  getAiDraftProvider().clearDrafts();
  aiDraftSingleton = null;
  defaultProvider = null;
}
