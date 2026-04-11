/**
 * Whether a doctor belongs to a category: explicit categories[] or services[].category_id.
 * Used for booking doctor lists (filter by category, not by selected service id).
 */
export function doctorMatchesCategoryId(
  doc: any,
  categoryId: number | string
): boolean {
  const idStr = String(categoryId);
  if (
    Array.isArray(doc?.categories) &&
    doc.categories.some((c: any) => String(c?.id) === idStr)
  ) {
    return true;
  }
  if (
    Array.isArray(doc?.services) &&
    doc.services.some((s: any) => String(s?.category_id) === idStr)
  ) {
    return true;
  }
  return false;
}
