export const PADDLE_PRICES = {
  "4-month": "pri_01kzh8jmf33yg6ek3qk656h0fe",
  "6-month": "pri_01kzh8ws07r2j1fckgtjx36s50",
  "9-month": "pri_01kzh8vbvtjf51nq2vyc8f3365",
  "12-month": "pri_01kzh8sgcv25qjswbdfxeajzaj",
} as const;

export type PaddlePlan = keyof typeof PADDLE_PRICES;
