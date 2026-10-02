// Video (YouTube / Google Drive) o mapa (Google Maps) insertado en una página.
// La dirección ya llega validada contra una lista blanca en shared/content/page.js: aquí nunca se
// inserta HTML ni una dirección arbitraria.
export default function EmbedBlock({ kind, url, title }) {
  const label = title || (kind === "mapa" ? "Mapa" : "Video");
  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      {title && <h2 className="mb-6 text-3xl font-bold text-gray-800">{title}</h2>}
      <div className="overflow-hidden rounded-2xl shadow-xl">
        <iframe
          src={url}
          title={label}
          className={`w-full border-0 ${kind === "mapa" ? "h-96" : "aspect-video"}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allow={kind === "mapa" ? undefined : "accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"}
          allowFullScreen
        />
      </div>
    </section>
  );
}
