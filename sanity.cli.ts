import { defineCliConfig } from "sanity/cli";
import { dataset, projectId } from "./sanity/env";

export default defineCliConfig({
  api: { projectId, dataset },
  /**
   * Studio is embedded in the Next.js app at /studio, so Next serves it —
   * autoUpdates only applies to standalone `sanity deploy` builds.
   */
  autoUpdates: false,
});
