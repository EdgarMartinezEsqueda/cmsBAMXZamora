import { FaPlay } from "react-icons/fa";

// media: { type: "video" | "image", src, alt? }. Las URLs llegan validadas desde shared/content/.
const MediaRenderer = ({ media, alt, title }) => {
  if (media.type === "video") {
    return (
      <div className="relative rounded-xl overflow-hidden shadow-lg group">
        <iframe
          src={media.src}
          className="w-full h-64 md:h-80 lg:h-96"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={title}
        />
        <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
          <FaPlay className="inline mr-2" />
          Video
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-xl overflow-hidden shadow-lg group">
      <img
        src={media.src}
        alt={alt}
        className="w-full h-64 md:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
};

export default MediaRenderer;