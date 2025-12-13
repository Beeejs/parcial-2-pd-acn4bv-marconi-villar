import { z } from "zod";

export const createProductSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  description: z.string().min(1, "La descripción es obligatoria"),
  price: z.number().min(0, "El precio debe ser mayor o igual a 0"),
  platform: z.string().optional().nullable(),
  category: z.enum(["games", "consoles"], {
    errorMap: () => ({ message: "Categoría inválida" }),
  }),
  genre: z.string().optional().nullable(),
  status: z.boolean().default(true),
  topSell: z.boolean().default(false),
  img: z.string().optional().nullable(),
}).superRefine((data, ctx) => {
  if (data.category === "games") {
    if (!data.platform) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["platform"],
        message: "La plataforma es obligatoria para juegos",
      });
    }
    if (!data.genre) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["genre"],
        message: "El género es obligatorio para juegos",
      });
    }
  }
});

export const updateProductSchema = createProductSchema.partial();
