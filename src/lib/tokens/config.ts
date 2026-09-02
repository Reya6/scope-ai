export const TOKEN_CONFIG = {
  "4-month": {
    priceUsd: 2000,
    aiBudgetPercent: 20,
    totalTokens: 40000,
  },

  "6-month": {
    priceUsd: 3000,
    aiBudgetPercent: 20,
    totalTokens: 60000,
  },

  "9-month": {
    priceUsd: 4275,
    aiBudgetPercent: 20,
    totalTokens: 85500,
  },

  "12-month": {
    priceUsd: 5400,
    aiBudgetPercent: 20,
    totalTokens: 108000,
  },
} as const;

export type TokenPlan = keyof typeof TOKEN_CONFIG;

export const SCOPE_TOKEN_VALUE_USD = 0.01;

export function getPlanTokenAllocation(plan: string) {
  if (!(plan in TOKEN_CONFIG)) {
    throw new Error(`Invalid token plan: ${plan}`);
  }

  return TOKEN_CONFIG[plan as TokenPlan];
}