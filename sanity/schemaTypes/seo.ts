import { defineField, defineType } from "sanity";
import { SearchIcon } from "@sanity/icons/Search";

// Reusable metadata object — document-specific, so an object (not a reference).
export const seo = defineType({
  name: "seo",
  title: "Meta data",
  type: "object",
  icon: SearchIcon,
  fields: [
    defineField({
      name: "metaTitle",
      title: "Title tag",
      type: "string",
      description:
        "Overrides the page title in search results and the browser tab.",
      validation: (rule) =>
        rule.max(60).warning("Title tags over ~60 characters get truncated."),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta description",
      type: "text",
      rows: 3,
      validation: (rule) =>
        rule
          .max(160)
          .warning("Meta descriptions over ~160 characters get truncated."),
    }),
    defineField({
      name: "noIndex",
      title: "Hide from search engines",
      description:
        "Turn on to add a noindex tag so search engines keep this page out of results.",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
