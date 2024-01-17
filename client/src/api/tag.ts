import { Tag } from "@/types/api";

import { apiInstance } from "./instance";

function getMany() {
  return apiInstance.get<Tag[]>("/tags");
}

export const tag = { getMany };
