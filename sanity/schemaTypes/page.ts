import { defineField, defineType } from "sanity";
import { DocumentIcon } from "@sanity/icons/Document";

// SEO for the code-built static pages (home, blog index). Each document maps
// to one route via `key`; the frontend looks it up and falls back to code
// defaults when a document doesn't exist.
export const page = defineType({
  name: "page",
  title: "Page SEO",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({
      name: "title",
      title: "Internal title",
      description: "Only a label inside the Studio.",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "key",
      title: "Page",
      description: "Which route this SEO applies to.",
      type: "string",
      options: {
        list: [
          { title: "Home (/)", value: "home" },
          { title: "Blog index (/blog)", value: "blog" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "seo",
      title: "Meta data",
      type: "seo",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "key" },
  },
});
