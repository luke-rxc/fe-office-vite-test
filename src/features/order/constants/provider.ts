/**
 * 입점사 query keys
 */
export const ProviderQueryKeys = {
  all: [{ scope: 'order-provider' }] as const,
  providerCombo: () => [{ ...ProviderQueryKeys.all[0], entity: 'provider-combo' }] as const,
} as const;
