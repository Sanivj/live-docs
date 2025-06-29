import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

type EditorReadyPluginProps = {
  onReady: () => void;
};

export default function EditorReadyPlugin({ onReady }: EditorReadyPluginProps) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Editor instance is now available
    onReady();
  }, [editor]);

  return null;
}
