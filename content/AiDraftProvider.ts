import type {
  ContentProvider,
  ContentRequest,
  DailyFortune,
  DetailReading,
} from '@/content/types';

/**
 * Stub for future LLM drafts.
 *
 * TODO: Wire real API (env key, never commit secrets).
 * TODO: Queue drafts for human review (종철) before shipping — never auto-publish.
 * Returns null so callers fall back to TemplateProvider.
 */
export class AiDraftProvider implements ContentProvider {
  readonly id = 'ai-draft';

  async getDailyFortune(
    _request: ContentRequest,
  ): Promise<DailyFortune | null> {
    // Marked draft path reserved — no generation in this PR.
    return null;
  }

  async getDetailReading(
    _request: ContentRequest,
  ): Promise<DetailReading | null> {
    return null;
  }
}
