/**
 * 래플 쇼룸 query keys
 */
export const RaffleShowroomQueryKeys = {
  all: [{ scope: 'raffle-showroom' }] as const,
  list: () => [{ ...RaffleShowroomQueryKeys.all[0], entity: 'list' }] as const,
} as const;
