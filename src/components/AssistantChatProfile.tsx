import blizbiSymbol from "@/assets/blizbi-symbol.svg";
import blobSvg from "@/assets/blizbi-blob.svg";

const AssistantChatProfile = ({ className }: AssistantChatProfileProps) => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <img
          src={blobSvg}
          alt="Loading..."
          className="w-20 h-20 relative"
          style={{ zIndex: 1 }}
        />
        <img
          src={blizbiSymbol}
          alt="Blizbi"
          style={{
            width: 12,
            height: "auto",
            filter: "hue-rotate(165deg) saturate(100%) brightness(37%)",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 2
          }}
          className={className}
        />
      </div>
    </div>
  );
};

interface AssistantChatProfileProps {
  className?: string;
}

export default AssistantChatProfile;
