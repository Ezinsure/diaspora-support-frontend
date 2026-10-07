import FooterPage from "@/src/components/marketing/footer/page";
import SiteHeader from "@/src/components/marketing/header/page";
import WhatsAppFloat from "@/src/components/marketing/WhatsappFloat";


export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Lets keyboard users jump past the menu */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-title focus:shadow"
      >
        Skip to content
      </a>

      <SiteHeader />
      <div id="main-content">{children}</div>
      <FooterPage />
      <WhatsAppFloat />
    </>
  );
}