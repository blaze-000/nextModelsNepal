import { ORPCError } from '@orpc/server';
import { z } from 'zod';
import { EventModel } from '../../models/events.model.js';
import { NavModel } from '../../models/nav.model.js';
import { baseProcedure } from '../base.js';
import { requireAdminMiddleware } from '../middleware/auth.middleware.js';

/**
 * ✅ ORPC Best Practice: Define schemas inline
 * All types are automatically inferred by ORPC
 */

// Inline Zod Schemas
const NavSettingsSchema = z.object({
  showVoting: z.boolean().default(true),
});

const NavMenuItemSchema = z.object({
  label: z.string(),
  slug: z.string(),
});

const NavMenuResponseSchema = z.object({
  showVoting: z.boolean(),
  selfEvents: z.array(NavMenuItemSchema),
  partnerEvents: z.array(NavMenuItemSchema),
});

// Inferred types for internal use
type NavSettings = z.infer<typeof NavSettingsSchema>;
type NavMenuItem = z.infer<typeof NavMenuItemSchema>;

type PopulatedSeason = {
  status?: string;
  year?: number;
  slug?: string;
};

type PopulatedEvent = {
  name?: string;
  managedBy?: string;
  seasons?: PopulatedSeason[];
};

const INTERNAL_ERROR = 'INTERNAL_SERVER_ERROR' as const;

export const navRouter = {
  getVotingState: baseProcedure.handler(async () => {
    try {
      return await resolveNavSettings();
    } catch (error) {
      throw toInternalError('Failed to load navigation settings', error);
    }
  }),

  setVotingState: baseProcedure
    .input(NavSettingsSchema)
    .use(requireAdminMiddleware)
    .handler(async ({ input }) => {
      try {
        await NavModel.deleteMany({});
        const created = await NavModel.create(input);
        return normalizeNavSettings(created);
      } catch (error) {
        throw toInternalError('Failed to update navigation settings', error);
      }
    }),

  getNavMenu: baseProcedure.handler(async () => {
    try {
      const settings = await resolveNavSettings();
      const events = await EventModel.find().populate('seasons').lean().exec();

      const { selfEvents, partnerEvents } = buildEventNavigation(events);

      return NavMenuResponseSchema.parse({
        showVoting: settings.showVoting,
        selfEvents,
        partnerEvents,
      });
    } catch (error) {
      throw toInternalError('Failed to load navigation menu', error);
    }
  }),
};

export type NavRouter = typeof navRouter;

async function resolveNavSettings(): Promise<NavSettings> {
  const navDoc = await NavModel.findOne().select('showVoting').lean().exec();

  if (!navDoc) {
    return NavSettingsSchema.parse({});
  }

  return NavSettingsSchema.parse(navDoc);
}

function normalizeNavSettings(document: { showVoting: boolean }): NavSettings {
  return NavSettingsSchema.parse({
    showVoting: document.showVoting,
  });
}

function buildEventNavigation(events: unknown[]): {
  selfEvents: NavMenuItem[];
  partnerEvents: NavMenuItem[];
} {
  const selfEvents: NavMenuItem[] = [];
  const partnerEvents: NavMenuItem[] = [];

  for (const event of events as PopulatedEvent[]) {
    if (!event?.seasons || event.seasons.length === 0 || !event.name) {
      continue;
    }

    const latestEndedSeason = [...event.seasons]
      .filter(season => season?.status === 'ended')
      .sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
      .at(0);

    if (!latestEndedSeason?.slug) {
      continue;
    }

    const navItem: NavMenuItem = {
      label: event.name,
      slug: latestEndedSeason.slug,
    };

    if (event.managedBy === 'self') {
      selfEvents.push(navItem);
    } else if (event.managedBy === 'partner') {
      partnerEvents.push(navItem);
    }
  }

  return { selfEvents, partnerEvents };
}

function toInternalError(message: string, error: unknown) {
  return new ORPCError(INTERNAL_ERROR, {
    message,
    cause: error instanceof Error ? error : undefined,
  });
}
