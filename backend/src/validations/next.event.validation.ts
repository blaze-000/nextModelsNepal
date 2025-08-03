import { z } from "zod";

export const nextEventSchema = z.object({
    title: z.string().optional(),
    heading: z.string().optional(),
    description: z.string().optional(),
    images: z.array(z.string()).optional(),

    subtitle: z
        .array(
            z.object({
                index: z.string().optional(),
                name: z.string("Subtitle name is required."),
                icon: z.array(z.string()).optional(),

                items: z
                    .array(
                        z.object({
                            index: z.string().optional(),
                            tag: z.string().optional(),
                            tagContent: z.string().optional(),
                            tagIcon: z.array(z.string()).optional(),
                        })
                    )
                    .optional()
                    .default([]),
            })
        )
        .optional()
        .default([]),

    notice: z.array(z.string()).optional().default([]),
});
