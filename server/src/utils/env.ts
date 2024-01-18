import * as env from "@/constants/env";

export function processEnv() {
  const ignoredKeys = !env.IS_SINGLE_DB ? ["DB_URI", "DB_NAME", "DATA_SIZE", "IS_SINGLE_DB"] : [];

  for (const [key, value] of Object.entries(env)) {
    if (ignoredKeys.includes(key)) continue;

    if (!value) {
      throw new Error(`${key} environment variable value is invalid`);
    }
  }

  return env;
}
