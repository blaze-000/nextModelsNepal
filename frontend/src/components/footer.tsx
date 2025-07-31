import Image from "next/image";
import type { FC, ReactNode } from "react";
import NewsLetterBox from "./molecules/newsleterbox";

const Footer: FC = (): ReactNode => {
  const currentYear: number = new Date().getFullYear();

  const quickLinks = ["Home", "About", "Services", "Contact"];
  const events = ["Mr. Nepal", "Miss. Nepal Peace", "Models Hunt Nepal"];

  return (
    <footer className="w-full bg-background2 border-t border-white/20 text-white relative">
      <div className="sm:px-6 pt-9 max-w-7xl mx-auto px-4 md:px-8">
        {/* Newsletter Section */}
        <div className="flex justify-center">
          <NewsLetterBox />
        </div>

        {/* Main Footer Content */}
        <div className="py-10 px-4">
          <div className="grid grid-cols-[1fr_1.4fr] md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr] gap-12 lg:gap-8">
            {/* Company Info - Mobile: centered, Desktop: left aligned */}
            <div className="text-center md:text-left col-span-2 md:col-span-1">
              <Image
                width={116}
                height={86}
                alt="Next Models Nepal Logo"
                src="/logo.png"
                className="mx-auto md:mx-0"
              />
              <p className="text-base tracking-normal leading-loose">
                Nepal&rsquo;s No.1 Modeling Agency
              </p>
              <div className="flex items-center gap-4 pt-3 justify-center md:justify-start">
                <i className="bg-gold-500 w-8 h-8 p-1.5 text-black rounded-full hover:opacity-80 transition-opacity cursor-pointer ri-instagram-line" />
                <i className="bg-gold-500 w-8 h-8 p-1.5 text-black rounded-full hover:opacity-80 transition-opacity cursor-pointer ri-twitter-x-line" />
                <i className="bg-gold-500 w-8 h-8 p-1.5 text-black rounded-full hover:opacity-80 transition-opacity cursor-pointer ri-facebook-circle-line" />
                <i className="bg-gold-500 w-8 h-8 p-1.5 text-black rounded-full hover:opacity-80 transition-opacity cursor-pointer ri-linkedin-box-line" />
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-8 md:space-y-6 col-span-1">
              <h3 className="text-base font-semibold">Quick Links</h3>
              <nav className="space-y-6">
                {quickLinks.map((link) => (
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
            <div className=" space-y-8 md:space-y-6 col-span-1">
              <h3 className="text-base font-semibold">Events</h3>
              <nav className="space-y-4">
                {events.map((event) => (
                  <div
                    key={event}
                    className="text-base font-light hover:text-orange-400 transition-colors cursor-pointer underline tracking-wider"
                  >
                    {event}
                  </div>
                ))}
              </nav>
            </div>

            {/* Contact */}
            <div className="space-y-8 md:space-y-6 col-span-2 md:col-span-1">
              <h3 className="text-base font-semibold">Contact</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <i className="w-5 h-5 text-white flex-shrink-0 ri-phone-line" />
                  <span className="text-base font-light hover:text-orange-400 transition-colors cursor-pointer">
                    9819686790
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <i className="w-5 h-5 text-white flex-shrink-0 ri-mail-line" />
                  <span className="text-base font-light hover:text-orange-400 transition-colors cursor-pointer">
                    info@nextmodelsnepal.com
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <i className="w-5 h-5 text-white flex-shrink-0 ri-map-pin-line" />
                  <span className="text-base font-light hover:text-orange-400 transition-colors cursor-pointer">
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
            <div className="text-sm font-light opacity-65">
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