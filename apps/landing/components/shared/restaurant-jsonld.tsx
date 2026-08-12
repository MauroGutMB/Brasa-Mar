import { address, contact, openingHours, siteConfig } from "@/lib/site";

const schemaDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/**
 * JSON-LD de negócio local — é o que alimenta o painel do Google e a busca
 * "churrascaria perto de mim". Mantido em sincronia com lib/site.ts.
 */
export function RestaurantJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    image: `${siteConfig.url}${siteConfig.ogImage}`,
    telephone: `+55${contact.phone.replace(/\D/g, "")}`,
    servesCuisine: ["Churrasco", "Frutos do mar", "Brasileira"],
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: `${address.street}, ${address.number}`,
      addressLocality: address.city,
      addressRegion: address.state,
      postalCode: address.zip || undefined,
      addressCountry: "BR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: address.lat,
      longitude: address.lng,
    },
    openingHoursSpecification: openingHours
      .filter((hour) => !hour.closed)
      .map((hour) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: schemaDays[hour.weekday],
        opens: hour.opensAt,
        closes: hour.closesAt,
      })),
  };

  return (
    <script
      type="application/ld+json"
      // Conteúdo próprio, mas o escape de "<" evita fechar a tag por acidente.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}
