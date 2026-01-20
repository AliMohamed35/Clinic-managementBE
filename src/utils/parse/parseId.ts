export function parseId(id: string | undefined): number {
  if (id == undefined) {
    throw new Error("Id parameter is required");
  }
  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId)) {
    throw new Error("Id must be a valid number");
  }

  return parsedId;
}