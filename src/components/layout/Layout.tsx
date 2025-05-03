
import { ReactNode, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import GTM from "./GTM";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  // For demonstration, we're using a hardcoded GTM ID
  // In production, this would come from an environment variable
  const gtmId = "GTM-XXXXXXX"; // Replace with your actual GTM ID when deploying
  
  useEffect(() => {
    // This effect handles the insertion of the noscript GTM tag at the top of the body
    const noscriptTag = document.getElementById("gtm-noscript");
    if (noscriptTag && document.body.firstChild) {
      document.body.insertBefore(noscriptTag, document.body.firstChild);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <GTM id={gtmId} />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
