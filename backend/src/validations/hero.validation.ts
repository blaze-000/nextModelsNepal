import { z } from 'zod';

// Validation for creating a hero item
export const createHeroValidation = z.object({
  maintitle: z.string(),
  subtitle: z.string(),
  description: z.string(),
  // Images will be handled manually in controller, so we don't validate them here
  // titleImage is required but will be handled as file upload in controller
});

// Validation for updating a hero item
export const updateHeroValidation = createHeroValidation.partial().extend({
  id: z.string()
});