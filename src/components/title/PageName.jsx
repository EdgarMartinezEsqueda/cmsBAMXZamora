import { useEffect } from "react";

const PageMeta = ({ title, description, image="https://bamxzamora.org/assets/images/preview.jpg", children }) => {
  useEffect(() => {
    // Cambiar título
    document.title = `${title} | BAMX Zamora`;

    // Cambiar meta tags
    const updateMetaTag = (property, content) => {
      let element = document.querySelector(`meta[property="${property}"]`);
      if (element) {
        element.setAttribute("content", content);
      }
    };

    updateMetaTag("og:title", `${title} | BAMX Zamora`);
    updateMetaTag("og:description", description);
    updateMetaTag("og:image", image);
    
    updateMetaTag("twitter:title", `${title} | BAMX Zamora`);
    updateMetaTag("twitter:description", description);
    updateMetaTag("twitter:image", image);

  }, [title, description, image]);

  return children;
};

export default PageMeta;