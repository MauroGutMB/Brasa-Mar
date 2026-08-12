import { getHours, getSettings } from "@/lib/data";
import { phoneE164, schemaHours, siteUrl } from "@/lib/site";

/**
 * JSON-LD de negócio local — é o que alimenta o painel do Google e a busca
 * "churrascaria perto de mim". Lê exatamente as mesmas configurações que a
 * página, então editar endereço ou horário no admin atualiza os dois juntos.
 */
export async function RestaurantJsonLd() {
  const [settings, hours] = await Promise.all([getSettings(), getHours()]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: settings.name,
    description: settings.description,
    url: siteUrl,
    image: settings.ogImageUrl.startsWith("http")
      ? settings.ogImageUrl
      : `${siteUrl}${settings.ogImageUrl}`,
    telephone: phoneE164(settings.phone),
    email: settings.email || undefined,
    servesCuisine: ["Churrasco", "Frutos do mar", "Brasileira"],
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: `${settings.street}, ${settings.number}`,
      addressLocality: settings.city,
      addressRegion: settings.state,
      postalCode: settings.zip || undefined,
      addressCountry: "BR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: settings.lat,
      longitude: settings.lng,
    },
    openingHoursSpecification: schemaHours(hours),
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
