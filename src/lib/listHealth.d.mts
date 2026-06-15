export type Tier = 'reach' | 'target' | 'likely' | 'safety';
export type TierOrUnknown = Tier | 'unknown';

export interface ChanceInput {
  admitRate?: number | null;
  studentSat?: number | null;
  studentAct?: number | null;
  satP25?: number | null;
  satP75?: number | null;
  actP25?: number | null;
  actP75?: number | null;
}

export interface ChanceResult {
  tier: TierOrUnknown;
  projected: number | null;
  projectedLabel: string;
  basis: string;
}

export interface GradeResult {
  counts: Record<TierOrUnknown, number>;
  total: number;
  balanced: boolean;
  verdict: string;
  suggestions: string[];
}

export function classifyAdmissionChance(input?: ChanceInput): ChanceResult;
export function gradeList(items?: { tier: TierOrUnknown }[]): GradeResult;
export function scorePosition(
  score?: number | null,
  p25?: number | null,
  p75?: number | null
): 'high' | 'mid' | 'low' | null;
export const TIERS: Tier[];
