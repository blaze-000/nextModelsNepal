import { z } from "zod";

// Card Item Schema
const cardItemSchema = z.object({
  index: z.string().optional(),
  criteriaTitle: z.string().min(1, "Criteria title is required"),
  criteria: z.string().min(1, "Criteria is required"),
  criteriaIcon:  z.string().min(1, "Title image is required"),
});

// Card Schema
const cardSchema = z.object({
  index: z.string().optional(),
  cardTitle: z.string().min(1, "Card title is required"),
  item: z.array(cardItemSchema).default([])
});

// Main Event Schema
export const nextEventSchema = z.object({
  tag: z.string().min(1, "Tag is required"),
  title: z.string().min(1, "Title is required"),
  titleImage: z.string().min(1, "Title image is required"),
  image: z.string().min(1, "Image is required"),
  description: z.string().min(1, "Description is required"),
  noticeName: z.string().min(1, "Notice name is required"),
  notice: z.array(z.string().min(1, "Notice item cannot be empty"))
    .min(1, "At least one notice is required"),
  card: z.array(cardSchema).default([])
});