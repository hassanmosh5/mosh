import { CosRole } from "@/generated/prisma/enums";

/**
 * Permission model.
 *
 * Permissions are strings of the form `<resource>:<action>`. A role maps to a
 * flat set of permissions; `*` is a wildcard for a resource or for everything.
 * The check is deliberately simple and centralised so that both the HTTP layer
 * and the AI tool layer can enforce exactly the same rules.
 */
export type Permission =
  | "task:read" | "task:write" | "task:delete"
  | "project:read" | "project:write" | "project:delete"
  | "crm:read" | "crm:write" | "crm:delete"
  | "goal:read" | "goal:write" | "goal:delete"
  | "content:read" | "content:write" | "content:delete"
  | "product:read" | "product:write" | "product:delete"
  | "knowledge:read" | "knowledge:write" | "knowledge:delete"
  | "memory:read" | "memory:write" | "memory:delete"
  | "agent:read" | "agent:write" | "agent:run"
  | "automation:read" | "automation:write"
  | "finance:read" | "finance:write"
  | "analytics:read"
  | "report:read" | "report:write"
  | "notification:read" | "notification:write"
  | "audit:read"
  | "approval:read" | "approval:decide"
  | "settings:read" | "settings:write"
  | "integration:read" | "integration:write";

const READ_ONLY: Permission[] = [
  "task:read", "project:read", "crm:read", "goal:read", "content:read",
  "product:read", "knowledge:read", "memory:read", "agent:read",
  "automation:read", "analytics:read", "report:read", "notification:read",
  "settings:read", "integration:read",
];

const MEMBER: Permission[] = [
  ...READ_ONLY,
  "task:write",
  "content:write",
  "knowledge:write",
  "notification:write",
  "agent:run",
];

const MANAGER: Permission[] = [
  ...MEMBER,
  "task:delete",
  "project:write", "project:delete",
  "crm:write", "crm:delete",
  "goal:write", "goal:delete",
  "content:delete",
  "product:write", "product:delete",
  "knowledge:delete",
  "memory:read", "memory:write",
  "automation:write",
  "finance:read",
  "report:write",
  "approval:read",
];

const OWNER: Permission[] = [
  ...MANAGER,
  "memory:delete",
  "agent:write",
  "finance:write",
  "audit:read",
  "approval:decide",
  "settings:write",
  "integration:write",
];

/**
 * Clients only ever see data explicitly scoped to them. The scoping itself is
 * enforced by the query layer; this set just prevents any write.
 */
const CLIENT: Permission[] = ["project:read", "task:read", "report:read"];

export const ROLE_PERMISSIONS: Record<CosRole, ReadonlySet<Permission>> = {
  OWNER: new Set(OWNER),
  MANAGER: new Set(MANAGER),
  MEMBER: new Set(MEMBER),
  VIEWER: new Set(READ_ONLY),
  CLIENT: new Set(CLIENT),
};

export function roleHas(role: CosRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].has(permission);
}

/** Every permission granted to a role — used by the AI layer to filter tools. */
export function permissionsFor(role: CosRole): Permission[] {
  return [...ROLE_PERMISSIONS[role]];
}
