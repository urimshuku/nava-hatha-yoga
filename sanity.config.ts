"use client";

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { apiVersion, dataset, projectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemaTypes";
import { SINGLETON_TYPES, structure } from "./sanity/structure";

export default defineConfig({
  basePath: "/studio",
  projectId: projectId || "placeholder",
  dataset,
  title: "Nava Hatha Yoga",
  schema: {
    types: schemaTypes,
    // Hide singletons from the global "Create new" menu.
    templates: (templates) =>
      templates.filter(({ schemaType }) => !SINGLETON_TYPES.has(schemaType)),
  },
  document: {
    // Singletons can only be edited/published, never duplicated or deleted.
    actions: (actions, { schemaType }) =>
      SINGLETON_TYPES.has(schemaType)
        ? actions.filter(
            ({ action }) =>
              action === "publish" ||
              action === "discardChanges" ||
              action === "restore",
          )
        : actions,
  },
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
