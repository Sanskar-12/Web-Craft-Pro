import { EditorElement } from "@/providers/editor/editor-providers";
import TextComponent from "./text";
import Container from "./container";
import VideoComponent from "./video";
import LinkComponent from "./link";
import ContactFormComponent from "./contact";

interface RecursiveProps {
  element: EditorElement;
}

const Recursive = ({ element }: RecursiveProps) => {
  console.log(element);
  switch (element.type) {
    case "text":
      return <TextComponent element={element} />;

    case "container":
      return <Container element={element} />;

    case "__body":
      return <Container element={element} />;

    case "video":
      return <VideoComponent element={element} />;

    case "2Col":
      return <Container element={element} />;

    case "link":
      return <LinkComponent element={element} />;

    case "contactForm":
      return <ContactFormComponent element={element} />;
    default:
      return null;
  }
};

export default Recursive;
