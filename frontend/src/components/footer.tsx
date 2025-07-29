import Image from "next/image";
import type { FC, ReactNode } from "react";
import NewsLetterBox from "./molecules/newsleterbox";
import { Instagram, Twitter, Facebook, Linkedin } from "lucide-react";
import { Phone, Mail, MapPin } from "lucide-react";

const Footer: FC = (): ReactNode => {
  const currentYear: number = new Date().getFullYear();

  return (
    <footer className="bg-background2 border-t border-white/20 text-white relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-36 pt-9">
        {/* Newsletter Section */}
        <div className="flex justify-center">
          <NewsLetterBox />
        </div>

        {/* Main Footer Content */}
        <div className="py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr] gap-12 lg:gap-8">
            {/* Company Info */}
            <div>
              <Image
                width={116}
                height={86}
                alt="Next Models Nepal Logo"
                src="/logo.png"
              />
              <p className="text-base tracking-normal leading-loose">
                Nepal&rsquo;s No.1 Modeling Agency
              </p>
              <div className="flex items-center gap-4 pt-3">
                <Instagram className="bg-amber-500 w-8 h-8 p-1.5 text-black rounded-full hover:opacity-80 transition-opacity cursor-pointer" />
                <Twitter className="bg-amber-500 w-8 h-8 p-1.5 text-black rounded-full hover:opacity-80 transition-opacity cursor-pointer" />
                <Facebook className="bg-amber-500 w-8 h-8 p-1.5 text-black rounded-full hover:opacity-80 transition-opacity cursor-pointer" />
                <Linkedin className="bg-amber-500 w-8 h-8 p-1.5 text-black rounded-full hover:opacity-80 transition-opacity cursor-pointer" />
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h3 className="text-base font-semibold">Quick Links</h3>
              <nav className="space-y-6">
                {["Home", "About", "Services", "Contact"].map((link) => (
                  <div
                    key={link}
                    className="text-base font-light hover:text-orange-400 transition-colors cursor-pointer tracking-wider"
                  >
                    {link}
                  </div>
                ))}
              </nav>
            </div>

            {/* Events */}
            <div className="space-y-6">
              <h3 className="text-base font-semibold">Events</h3>
              <nav className="space-y-4">
                {[
                  { name: "Mr. Nepal", underline: true },
                  { name: "Miss. Nepal Peace", underline: true },
                  { name: "Models Hunt Nepal", underline: true },
                ].map((event) => (
                  <div
                    key={event.name}
                    className={
                      "text-base font-light hover:text-orange-400 transition-colors cursor-pointer underline tracking-wider"
                    }
                  >
                    {event.name}
                  </div>
                ))}
              </nav>
            </div>

            {/* Contact */}
            <div className="space-y-6">
              <h3 className="text-base font-semibold">Contact</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-white flex-shrink-0" />
                  <span className="text-base font-light hover:text-orange-400 transition-colors cursor-pointer ">
                    9819686790
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-white flex-shrink-0" />
                  <span className="text-base font-light hover:text-orange-400 transition-colors cursor-pointer ">
                    info@nextmodelsnepal.com
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-white flex-shrink-0" />
                  <span className="text-base font-light hover:text-orange-400 transition-colors cursor-pointer ">
                    Putalisadak, Kathmandu, Nepal
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-white/20 py-7">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm  font-light opacity-65">
              © {currentYear} Lift Media. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-[20px] font-[Urbanist]">
              <div className="text-base font-light hover:text-orange-400 transition-colors cursor-pointer underline tracking-wider">
                Terms & Conditions
              </div>
              <div className="underline text-base font-light hover:text-orange-400 transition-colors cursor-pointer tracking-wider">
                Privacy Policy
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
