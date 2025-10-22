import { NAV_PROCEDURE_KEYS } from '@nextmodels/shared-types';

export const orpcQueryKeys = {
  nav: {
    votingState: () => [NAV_PROCEDURE_KEYS.getVotingState] as const,
    menu: () => [NAV_PROCEDURE_KEYS.getNavMenu] as const,
  },
} as const;
