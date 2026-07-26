import type { SchemaTypeDefinition } from "sanity";
import { post } from "./post";
import { author } from "./author";
import { seo } from "./seo";

export const schemaTypes: SchemaTypeDefinition[] = [post, author, seo];
