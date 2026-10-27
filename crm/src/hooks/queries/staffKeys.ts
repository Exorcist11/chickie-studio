import { StaffQueryParams } from "../../types/staff";

export const staffKeys = {
  all: ["staffs"] as const,
  lists: () => [...staffKeys.all, "list"] as const,
  list: (params?: StaffQueryParams) => [...staffKeys.lists(), params] as const,
  details: () => [...staffKeys.all, "detail"] as const,
  detail: (id: number) => [...staffKeys.details(), id] as const,
};
