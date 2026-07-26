import type { SchemaTypeDefinition } from "sanity";
import { post } from "./post";
import { author } from "./author";
import { page } from "./page";
import { seo } from "./seo";

export const schemaTypes: SchemaTypeDefinition[] = [post, author, page, seo];
