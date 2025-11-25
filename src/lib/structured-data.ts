/**
 * Utility functions for generating Schema.org structured data (JSON-LD)
 * @see https://schema.org/
 */

interface OrganizationSchemaOptions {
  name: string;
  url: string;
  logo: string;
  description?: string;
  contactPoint?: {
    telephone?: string;
    email?: string;
    contactType?: string;
  };
  address?: {
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
  sameAs?: string[];
}

interface WebsiteSchemaOptions {
  name: string;
  url: string;
  description?: string;
  searchUrl?: string;
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface ServiceSchemaOptions {
  name: string;
  description: string;
  provider: {
    name: string;
    url: string;
  };
  areaServed?: string;
  serviceType?: string;
}

/**
 * Creates Organization/LocalBusiness schema
 */
export function createOrganizationSchema(
  options: OrganizationSchemaOptions
): object {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: options.name,
    url: options.url,
    logo: options.logo,
  };

  if (options.description) {
    schema.description = options.description;
  }

  if (options.contactPoint) {
    schema.contactPoint = {
      "@type": "ContactPoint",
      ...options.contactPoint,
    };
  }

  if (options.address) {
    schema.address = {
      "@type": "PostalAddress",
      ...options.address,
    };
  }

  if (options.sameAs && options.sameAs.length > 0) {
    schema.sameAs = options.sameAs;
  }

  return schema;
}

/**
 * Creates WebSite schema with search functionality
 */
export function createWebsiteSchema(options: WebsiteSchemaOptions): object {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: options.name,
    url: options.url,
  };

  if (options.description) {
    schema.description = options.description;
  }

  if (options.searchUrl) {
    schema.potentialAction = {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${options.searchUrl}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    };
  }

  return schema;
}

/**
 * Creates BreadcrumbList schema
 */
export function createBreadcrumbSchema(items: BreadcrumbItem[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Creates Service schema
 */
export function createServiceSchema(options: ServiceSchemaOptions): object {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: options.name,
    description: options.description,
    provider: {
      "@type": "Organization",
      ...options.provider,
    },
  };

  if (options.areaServed) {
    schema.areaServed = options.areaServed;
  }

  if (options.serviceType) {
    schema.serviceType = options.serviceType;
  }

  return schema;
}

/**
 * Helper function to render JSON-LD script tag
 */
export function renderJsonLd(data: object): string {
  return JSON.stringify(data);
}

/**
 * Default organization data for Home Healers
 */
export const defaultOrganizationData: OrganizationSchemaOptions = {
  name: "Home Healers",
  url: "https://home-healers.com",
  logo: "https://home-healers.com/assets/images/logo.svg",
  description: "Home Healers - Professional healthcare services at your doorstep",
  contactPoint: {
    contactType: "Customer Service",
  },
  address: {
    addressCountry: "SA",
  },
  sameAs: [
    // Add social media URLs here
  ],
};
