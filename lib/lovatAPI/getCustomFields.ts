import { z } from "zod";
import { get } from "./lovatAPI";

export const customFieldTypeSchema = z.enum([
  "TEXT",
  "NUMBER",
  "SINGLE_SELECT",
  "MULTI_SELECT",
]);

export type CustomFieldType = z.infer<typeof customFieldTypeSchema>;

export const customFieldSchema = z.object({
  uuid: z.string(),
  name: z.string(),
  type: customFieldTypeSchema,
  options: z.array(z.string()),
});

export type CustomField = z.infer<typeof customFieldSchema>;

const customFieldsManifestSchema = z.object({
  hash: z.string(),
  data: z.array(customFieldSchema),
});

export type CustomFieldsManifest = z.infer<typeof customFieldsManifestSchema>;

export const getCustomFields = async (): Promise<CustomFieldsManifest> => {
  const response = await get("/v1/manager/customfields/manifest");

  if (response.status === 404) {
    // Older servers don't have custom fields; treat the feature as absent
    return { hash: "", data: [] };
  }

  if (!response.ok) {
    throw new Error("Error fetching custom fields");
  }

  return customFieldsManifestSchema.parse(await response.json());
};
