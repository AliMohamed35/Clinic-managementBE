import { ForbiddenError } from "../ExceptionHandler/customErrors.ts";

export function checkOwnership(
  resourceOwnerId: number,
  currentUserId: number,
  message: string = "You can only access your data",
): void {
  if (resourceOwnerId !== currentUserId) {
    throw new ForbiddenError(message);
  }
}
