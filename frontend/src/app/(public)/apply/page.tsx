import Image from "next/image";
import Link from "next/link";

export default function ApplyPage() {
  return (
    <section className="py-40 mdplus:py-20 flex flex-col">
      <div className="max-w-7xl px-6 mx-auto">
        <h1 className="pb-8 mdplus:pb-3 w-full mb-6">
          <div className=" flex gap-2 items-center justify-center w-full font-medium text-xl font-newsreader">
            <Image
              width={40}
              height={0}
              src="/small_star.svg"
              alt=""
              className="w-4 h-4"
            />
            <span>Select Your Desired Service</span>
          </div>
        </h1>

        <div className="flex flex-col mdplus:flex-row gap-8 text-primary">
          <Link href="/models" className="border border-gold-500 rounded-full w-72 h-16 flex items-center gap-6 cursor-pointer hover:text-white">
            <Image
              src="/bro_1.png"
              width={150}
              height={0}
              alt="sdfsd"
              className="w-25 h-full rounded-full object-cover"
            />
            <span className="flex gap-1 items-center">
              Hire a model
              <i className="ri-arrow-right-up-line text-lg " />
            </span>
          </Link>
          <Link href="/become-a-model" className="border  border-gold-500 rounded-full w-72 h-16 flex items-center gap-6 cursor-pointer hover:text-white">
            <Image
              src="/bro_1.png"
              width={150}
              height={0}
              alt="sdfsd"
              className="w-25 h-full rounded-full object-cover"
            />
            <span className="flex gap-1 items-center">
              Become a model
              <i className="ri-arrow-right-up-line text-lg" />
            </span>
          </Link >

        </div>

      </div>
    </section>
  );
};
