import { EditorElement } from "@/providers/editor/editor-providers"
import TextComponent from "./text";
import Container from "./container";

interface RecursiveProps {
    element:EditorElement
}

const Recursive = ({
    element
}:RecursiveProps) => {
  switch (element.type) {
    case "text":
        return <TextComponent element={element}/>
        
    case "container":
        return <Container element={element}/>
  
    default:
        return null
  }
}

export default Recursive