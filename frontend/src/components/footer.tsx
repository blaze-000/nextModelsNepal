import Image from "next/image";
import type { FC, ReactNode } from "react";
import NewsLetterBox from "./molecules/newsleterbox";

const Footer: FC = (): ReactNode => {
  const currentYear: number = new Date().getFullYear();
  return (
    <footer className=" relative bg-background2 border-t border-white/20 h-[682px] overflow-hidden text-left text-[20px] text-white font-[Urbanist]">
      <div className="container mx-auto">
        <div className="absolute top-[274px] left-[190px] flex flex-row items-start justify-start gap-[145px]">
          <div className="w- flex flex-col items-start justify-start gap-[25px]">
            <Image className="w-[148px] max-h-full object-cover relative" width={148} height={123} alt="" src="/logo 1.png" />
            <div className="tracking-[0.02em] leading-[30px]">Nepal&apos;s No.1 Modeling Agency</div>
            <div className="h-[32px] flex flex-row items-center gap-[25px]">
              {[1, 2, 3, 4].map((i) => (
                <Image key={i} className="w-[32px] h-[32px] rounded-[20px] overflow-hidden" width={32} height={32} alt="" src="/instagram-line.svg" />
              ))}
            </div>
          </div>

          <div className="w- flex flex-row justify-between">
            {/* Quick Links */}
            <div className="w- flex flex-col gap-[32px]">
              <b className="tracking-[0.02em] leading-[30px]">Quick Links</b>
              <div className="flex flex-col items-start gap-[15px]">
                <div className="tracking-[0.02em] leading-[40px]">Home</div>
                <div className="tracking-[0.02em] leading-[40px]">About</div>
                <div className="tracking-[0.02em] leading-[40px]">Services</div>
                <div className="tracking-[0.02em] leading-[40px]">Contact</div>
              </div>
            </div>

            {/* Events */}
            <div className="w- flex flex-col gap-[32px]">
              <b className="tracking-[0.02em] leading-[30px]">Events</b>
              <div className="flex flex-col items-start gap-[15px]">
                <div className="underline tracking-[0.02em] leading-[40px]">Mr. Nepal</div>
                <div className="underline tracking-[0.02em] leading-[40px]">Miss. Nepal Peace</div>
                <div className="underline tracking-[0.02em] leading-[40px]">Models Hunt Nepal</div>
              </div>
            </div>

            {/* Contact */}
            <div className="w- flex flex-col gap-[32px]">
              <b className="tracking-[0.02em] leading-[30px]">Contact</b>
              <div className="flex flex-col gap-[15px]">
                <div className="flex flex-row items-center gap-[7px]">
                  <Image className="w- h-[24px]" width={24} height={24} alt="" src="/phone-line.svg" />
                  <div className="tracking-[0.02em] leading-[40px]">9819686790</div>
                </div>
                <div className="flex flex-row items-center gap-[7px]">
                  <Image className="w- h-[24px]" width={24} height={24} alt="" src="/mail-line.svg" />
                  <div className="tracking-[0.02em] leading-[40px]">info@nextmoelsnepal.com</div>
                </div>
                <div className="flex flex-row items-center gap-[7px]">
                  <Image className="w- h-[24px]" width={24} height={24} alt="" src="/map-pin-line.svg" />
                  <div className="tracking-[0.02em] leading-[40px]">Putalisadak, Kathmandu, Nepal</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-[584.5px] left-[189.5px] border-t border-white/0 w-[1541px] h-px" />

        <div className="absolute top-[620px] left-[190px] w-[1540px] flex flex-row justify-between text-[16px] font-[Poppins]">
          <div className="leading-[26.67px] opacity-65">© {currentYear} Lift Media. All rights reserved.</div>
          <div className="flex flex-row items-center gap-[22px] text-[20px] font-[Urbanist]">
            <div className="underline tracking-[0.02em] leading-[30px]">Terms & Conditions</div>
            <div className="underline tracking-[0.02em] leading-[30px]">Privacy Policy</div>
          </div>
        </div>
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
          <NewsLetterBox />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
