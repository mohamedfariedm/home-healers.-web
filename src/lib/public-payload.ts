import { toSecureMediaUrl } from "@/lib/image-url";
import { getActiveServices } from "@/lib/slugs";

const TEXT_PREVIEW = 360;

function previewText(value: unknown, limit = TEXT_PREVIEW): string {
  if (typeof value !== "string") return "";
  const plain = value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return plain.length > limit ? `${plain.slice(0, limit)}…` : plain;
}

function slimImage(image: unknown) {
  if (!image) return [];
  const first = Array.isArray(image) ? image[0] : image;
  if (!first) return [];
  if (typeof first === "string") {
    const src = toSecureMediaUrl(first);
    return src ? [{ original: src, thumbnail: src }] : [];
  }
  const original = toSecureMediaUrl(
    first.original || first.converted || first.url || first.thumbnail || "",
  );
  const thumbnail = toSecureMediaUrl(
    first.thumbnail || first.converted || first.original || first.url || "",
  );
  return original ? [{ original, thumbnail: thumbnail || original }] : [];
}

/** Footer + floating contact only need business/social links, not full SEO/banners. */
export function slimSettingsForChrome(settings: unknown) {
  const setting = (settings as { data?: Array<{ setting?: Record<string, unknown> }> })
    ?.data?.[0]?.setting;
  if (!setting) return null;
  return {
    data: [
      {
        setting: {
          social: setting.social,
          ios_link: setting.ios_link,
          android_link: setting.android_link,
          business_info: setting.business_info,
        },
      },
    ],
  };
}

export function slimCategoryCard(category: any) {
  if (!category) return category;
  const services = getActiveServices(category.services);
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    image: slimImage(category.image),
    services: services.map((service: { id?: number; active?: unknown }) => ({
      id: service.id,
      active: service.active ?? 1,
    })),
  };
}

export function slimHomeSection(section: any, maxPosts = 8) {
  if (!section) return section;
  return {
    id: section.id,
    title: section.title,
    Posts: (section.Posts || []).slice(0, maxPosts).map((post: any) => ({
      id: post.id,
      title: post.title,
      description: post.description,
      attachment: Array.isArray(post.attachment)
        ? post.attachment.slice(0, 8).flatMap((item: unknown) => slimImage(item))
        : slimImage(post.attachment),
    })),
  };
}

export function slimBlogForHome(blog: any) {
  return {
    id: blog.id,
    name: blog.name,
    slug: blog.slug,
    date: blog.date,
    description: blog.description,
    image: slimImage(blog.image),
    show_in_home_page: blog.show_in_home_page,
  };
}

export function slimClientReview(review: any) {
  return {
    id: review.id,
    name: review.name,
    text: previewText(review.text, 280),
    image: slimImage(review.image),
    position: review.position,
    rate: review.rate,
    title: review.title,
  };
}

export function slimReservationReview(review: any) {
  return {
    id: review.id,
    doctor_rate: review.doctor_rate,
    doctor_comment: previewText(review.doctor_comment, 220),
    reservation_rate: review.reservation_rate,
    reservation_comment: previewText(review.reservation_comment, 220),
    client: review.client ? { id: review.client.id, name: review.client.name } : null,
    doctor: review.doctor ? { id: review.doctor.id, name: review.doctor.name } : null,
  };
}

export function slimOfferCard(offer: any) {
  if (!offer) return offer;
  return {
    id: offer.id,
    slug: offer.slug,
    name: offer.name,
    short_description: offer.short_description,
    image: slimImage(offer.image || offer.cover_image),
    cover_image: slimImage(offer.cover_image || offer.image),
    price: offer.price,
    old_price: offer.old_price,
    discount_percentage: offer.discount_percentage,
    savings_amount: offer.savings_amount,
    currency: offer.currency,
    sessions_count: offer.sessions_count,
    ends_at: offer.ends_at,
    starts_at: offer.starts_at,
    display_rating: offer.display_rating,
    display_reviews_count: offer.display_reviews_count,
    booked_count: offer.booked_count,
    is_featured: offer.is_featured,
    is_best_seller: offer.is_best_seller,
    is_most_popular: offer.is_most_popular,
    is_new: offer.is_new,
    is_active: offer.is_active,
    type: offer.type,
  };
}

export function slimDoctorCard(doctor: any) {
  if (!doctor) return doctor;
  return {
    id: doctor.id,
    name: doctor.name,
    doctor_role: doctor.doctor_role,
    session_price: doctor.session_price,
    rate: doctor.rate,
    experience: doctor.experience,
    specialized_in: doctor.specialized_in,
    specialist: doctor.specialist,
    degree: doctor.degree,
    languages_spoken: doctor.languages_spoken,
    department: doctor.department,
    classification: doctor.classification,
    medical_school: doctor.medical_school,
    awards: doctor.awards,
    certification: doctor.certification,
    gender: doctor.gender,
    city: doctor.city,
    image: slimImage(doctor.image),
    offers: [],
    addresses: [],
  };
}

export function slimBanner(banner: any) {
  if (!banner) return banner;
  return {
    id: banner.id,
    page: banner.page,
    type: banner.type,
    attachment: {
      original: toSecureMediaUrl(
        banner.attachment?.original || banner.attachment?.thumbnail || "",
      ),
      thumbnail: toSecureMediaUrl(
        banner.attachment?.thumbnail || banner.attachment?.original || "",
      ),
    },
  };
}
