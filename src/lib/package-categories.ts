import type { Category, Package } from "@/types/booking";

export type PackageWithCategories = Package & {
  category_ids?: number[] | null;
  categories?: Category[];
};

/**
 * Returns categories scoped to a package, or null to show all categories
 * when the package has no linked categories.
 */
export function getPackageCategoryList(
  pkg: PackageWithCategories | null | undefined,
  allCategories: Category[]
): Category[] | null {
  if (!pkg) return null;

  const embedded = pkg.categories;
  if (Array.isArray(embedded) && embedded.length > 0) {
    return embedded.map((pc) => {
      const full = allCategories.find((c) => c.id === pc.id);
      return full ? { ...full, ...pc } : pc;
    });
  }

  const ids = pkg.category_ids;
  if (Array.isArray(ids) && ids.length > 0) {
    return allCategories.filter((c) => ids.includes(c.id));
  }

  return null;
}
