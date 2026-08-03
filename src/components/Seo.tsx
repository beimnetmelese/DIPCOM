import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import companyLogo from "../assets/logo.png";

const siteUrl = "https://dipcomtech.com";
const defaultImage = new URL(companyLogo, siteUrl).href;

type SeoProps = {
  title: string;
  description: string;
  noIndex?: boolean;
};

function setMeta(attribute: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

export function Seo({ title, description, noIndex = false }: SeoProps) {
  const location = useLocation();

  useEffect(() => {
    const pageUrl = `${siteUrl}${location.pathname}`;
    document.title = title;
    setMeta("name", "description", description);
    setMeta("name", "robots", noIndex ? "noindex, nofollow" : "index, follow");
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:url", pageUrl);
    setMeta("property", "og:image", defaultImage);
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = pageUrl;
  }, [description, location.pathname, noIndex, title]);

  return null;
}
