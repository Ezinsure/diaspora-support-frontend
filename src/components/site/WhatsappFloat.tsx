import { WHATSAPP_URL } from "@/src/lib/site";
import { WhatsAppIcon } from "../icons/WhatsAppIcon";


const WhatsAppFloat=() =>{
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-green-700 text-white shadow-[0_10px_30px_-8px_rgba(0,0,0,0.35)] transition-colors hover:bg-green-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-700/30 sm:hidden"
      style={{ bottom: "calc(1rem + env(safe-area-inset-bottom, 0px))" }}
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
export default WhatsAppFloat;