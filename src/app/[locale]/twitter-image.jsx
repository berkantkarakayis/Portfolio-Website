import OpenGraphImage, { alt, size, contentType } from "./opengraph-image";

export { alt, size, contentType };

export default function TwitterImage(props) {
  return OpenGraphImage(props);
}
