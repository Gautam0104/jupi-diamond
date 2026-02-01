export function generateSlug(
  name,
  additionalInfo = "",
  extra = "",
  metalColor = ""
) {
  const baseSlug = name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  let slug = baseSlug;

  if (additionalInfo) {
    slug += `-${additionalInfo.toLowerCase()}`;
  }

  if (metalColor) {
    slug += `-${metalColor.toLowerCase()}`;
  }

  if (extra) {
    slug += `-${extra}`;
  }

  return slug;
}

// export function generateSlug(
//   name,
//   additionalInfo = "",
//   extra = "",
//   metalColor = ""
// ) {
//   const baseSlug = name
//     .toLowerCase()
//     .replace(/\s+/g, "-")
//     .replace(/[^a-z0-9-]/g, "");
//   let slug = additionalInfo
//     ? `${baseSlug}-${additionalInfo.toLowerCase()}-${metalColor.toLowerCase()}`
//     : baseSlug;
//   if (extra) slug = `${slug}-${extra}`;

//   return slug;
// }

// Add this utility function to generate a unique slug
export async function generateUniqueSlug(baseSlug, prisma) {
  let slug = baseSlug;
  let count = 1;

  while (true) {
    const existing = await prisma.productVariant.findUnique({
      where: { productVariantSlug: slug },
    });

    if (!existing) break;

    slug = `${baseSlug}-${count}`;
    count++;
  }

  return slug;
}
