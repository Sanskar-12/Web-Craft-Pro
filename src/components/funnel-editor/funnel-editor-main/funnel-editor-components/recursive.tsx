import { EditorElement } from "@/providers/editor/editor-providers";
import TextComponent from "./text";
import Container from "./container";
import VideoComponent from "./video";

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

    default:
      return null;
  }
};

export default Recursive;
