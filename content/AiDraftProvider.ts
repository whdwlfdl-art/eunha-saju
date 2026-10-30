import { deriveSajuKeys } from '@/content/keys';
import { TemplateProvider } from '@/content/TemplateProvider';
import type {
  AiContentDraft,
  ContentProvider,
  ContentRequest,
  DailyFortune,
  DetailReading,
  DraftKind,
  DraftReviewStatus,
  GenerateDraftInput,
} from '@/content/types';

const REVIEW_MARK = '[검수 대기]';

function draftId(kind: DraftKind, requestKey: string): string {
  return `draft:${kind}:${requestKey}`;
}

/**
 * Mock LLM draft source — no API keys required.
 *
 * Pipeline:
 * 1. `generateDraft` → status `pending_review` (draft string marked for 종철)
 * 2. `setDraftStatus` → `approved` | `rejected`
 * 3. `getDailyFortune` / `getDetailReading` return payload **only if approved**
 * 4. Otherwise null → CascadingContentProvider falls back to TemplateProvider
 *
 * Never auto-publishes pending or rejected drafts to the UI.
 */
export class AiDraftProvider implements ContentProvider {
  readonly id = 'ai-draft';

  private readonly drafts = new Map<string, AiContentDraft>();
  private readonly templates = new TemplateProvider();

  /**
   * Produce a mock AI draft for human review.
   * Does **not** ship to UI until `setDraftStatus(..., 'approved')`.
   */
  async generateDraft(input: GenerateDraftInput): Promise<AiContentDraft> {
    const asOf = input.request.asOf ?? new Date();
    const keys = deriveSajuKeys(input.request.birth, asOf);
    const requestKey =
      input.kind === 'daily' ? keys.dailyKey : keys.profileKey;

    const base =
      input.kind === 'daily'
        ? await this.templates.getDailyFortune(input.request)
        : await this.templates.getDetailReading(input.request);

    const draftText = this.buildMockDraftText(input.kind, base, keys.element);
    const payload =
      input.kind === 'daily'
        ? this.toDailyPayload(base as DailyFortune, draftText)
        : this.toDetailPayload(base as DetailReading, draftText);

    const record: AiContentDraft = {
      id: draftId(input.kind, requestKey),
      kind: input.kind,
      status: 'pending_review',
      requestKey,
      draftText,
      payload,
      createdAt: new Date().toISOString(),
    };

    this.drafts.set(record.id, record);
    return { ...record };
  }

  /** List all drafts (newest-ish insertion order). */
  listDrafts(): AiContentDraft[] {
    return Array.from(this.drafts.values()).map((d) => ({ ...d }));
  }

  getDraft(id: string): AiContentDraft | null {
    const d = this.drafts.get(id);
    return d ? { ...d } : null;
  }

  /**
   * Human review gate. Only `approved` drafts are returned by get* methods.
   */
  setDraftStatus(
    id: string,
    status: DraftReviewStatus,
    reviewNote?: string,
  ): AiContentDraft | null {
    const existing = this.drafts.get(id);
    if (!existing) return null;

    const next: AiContentDraft = {
      ...existing,
      status,
      reviewedAt: new Date().toISOString(),
      reviewNote: reviewNote?.trim() || existing.reviewNote,
    };
    this.drafts.set(id, next);
    return { ...next };
  }

  /** UI path: approved daily only; else null → template fallback. */
  async getDailyFortune(
    request: ContentRequest,
  ): Promise<DailyFortune | null> {
    const asOf = request.asOf ?? new Date();
    const keys = deriveSajuKeys(request.birth, asOf);
    const id = draftId('daily', keys.dailyKey);
    const draft = this.drafts.get(id);
    if (!draft || draft.status !== 'approved') return null;
    return { ...(draft.payload as DailyFortune), source: 'ai-draft' };
  }

  /** UI path: approved detail only; else null → template fallback. */
  async getDetailReading(
    request: ContentRequest,
  ): Promise<DetailReading | null> {
    const asOf = request.asOf ?? new Date();
    const keys = deriveSajuKeys(request.birth, asOf);
    const id = draftId('detail', keys.profileKey);
    const draft = this.drafts.get(id);
    if (!draft || draft.status !== 'approved') return null;
    return { ...(draft.payload as DetailReading), source: 'ai-draft' };
  }

  /** Clear in-memory queue (tests / local reset). */
  clearDrafts(): void {
    this.drafts.clear();
  }

  private buildMockDraftText(
    kind: DraftKind,
    base: DailyFortune | DetailReading,
    element: string,
  ): string {
    if (kind === 'daily') {
      const d = base as DailyFortune;
      return [
        REVIEW_MARK,
        'AI 목 초안 — 실제 LLM API 없음. 출고 전 문장·톤을 손봐 주세요.',
        `오행 힌트: ${element}`,
        `헤드라인: ${d.headline}`,
        `본문: ${d.body}`,
        `팁: ${d.tip}`,
        '검수 포인트: 과장·공포·단정 표현 제거, 무료 카드 길이 유지.',
      ].join('\n');
    }

    const r = base as DetailReading;
    const sectionLines = r.sections
      .map((s) => `- ${s.title}: ${s.body}`)
      .join('\n');
    return [
      REVIEW_MARK,
      'AI 목 초안 — 실제 LLM API 없음. 출고 전 섹션별로 다듬어 주세요.',
      `오행 힌트: ${element}`,
      `요약: ${r.summary}`,
      '섹션:',
      sectionLines,
      '검수 포인트: 섹션 구조 유지, 유료 길이·캐주얼 톤, 투자·의료 단정 금지.',
    ].join('\n');
  }

  private toDailyPayload(
    base: DailyFortune,
    draftText: string,
  ): DailyFortune {
    // Candidate payload mirrors template but tagged ai-draft; still gated by status.
    const headlineLine =
      draftText
        .split('\n')
        .find((l) => l.startsWith('헤드라인:'))
        ?.replace(/^헤드라인:\s*/, '')
        .trim() ?? base.headline;
    return {
      ...base,
      headline: headlineLine,
      source: 'ai-draft',
    };
  }

  private toDetailPayload(
    base: DetailReading,
    _draftText: string,
  ): DetailReading {
    return {
      ...base,
      source: 'ai-draft',
    };
  }
}
