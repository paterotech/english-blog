import { useEffect } from "react";

const SITE_NAME = "English Blog";

const setMeta = (attribute, key, content) => {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
};

export const stripHtml = (html = "") =>
  html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const usePageMeta = ({ title, description, image, type = "website", noIndex = false }) => {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME;
    document.title = fullTitle;
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:type", type);
    setMeta("property", "og:site_name", SITE_NAME);
    setMeta("property", "og:url", window.location.href);

    if (description) {
      setMeta("name", "description", description);
      setMeta("property", "og:description", description);
    }
    if (image) setMeta("property", "og:image", image);
    if (noIndex) setMeta("name", "robots", "noindex");
  }, [title, description, image, type, noIndex]);
};

export default usePageMeta;
