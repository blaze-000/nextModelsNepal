import { motion } from "framer-motion";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";

const CTASection = () => {
  return (
    <section className="w-full">
      <div
        className="relative w-full flex items-center justify-center overflow-hidden h-screen max-h-[1067px] bg-no-repeat bg-cover bg-bottom"
        style={{ backgroundImage: "url('/runway/background-image.png')" }}
      >
        {/* Lamp and Beam Group */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center"
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0, duration: 1, ease: "easeOut" }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <Image src="/runway/lamp-off.svg" alt="" width={45} height={0} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <Image src="/runway/lamp-on.svg" alt="" width={45} height={0} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scaleY: 0 }}
            whileInView={{ opacity: 1, scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
            className="origin-top translate-x-[1px]"
          >
            <Image src="/runway/light-beam.svg" alt="" width={120} height={0} />
          </motion.div>
        </motion.div>

        {/* Circular Glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="absolute top-0"
        >
          <Image src="/runway/circular-glow.svg" alt="" width={800} height={0} />
        </motion.div>

        {/* Floor Glow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="absolute bottom-1/10"
        >
          <Image src="/runway/glow-on-floor.svg" alt="" width={400} height={0} />
        </motion.div>

        {/* Background Glow only visible in phone view */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="absolute bottom-1/10"
        >
          <Image src="/runway/glow-on-floor.svg" alt="" width={400} height={0} />
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="z-10 text-center py-16 md:py-0 px-4"
        >
          <div className="space-y-8">
            <div className="space-y-2">
              <div className="hidden lg:flex flex-row justify-center items-center gap-4">
                <h3 className="text-gold-500 text-6xl font-light font-newsreader text-nowrap">
                  The Runway
                </h3>
                <Image
                  src="/runway/title-image.jpg"
                  alt="Badge"
                  height={200}
                  width={200}
                  className="w-24 lg:w-36 h-12 lg:h-16 rounded-full border border-stone-300 object-cover"
                />
                <h3 className="text-gold-500 text-6xl font-light font-newsreader text-nowrap">
                  Is Waiting !!!
                </h3>
              </div>

              <div className="lg:hidden flex flex-col text-5xl font-light tracking-tight font-newsreader justify-center items-center gap-1">
                <h3 className="text-gold-500">The Runway is</h3>
                <h3 className="text-gold-500">Waiting!</h3>
                <h2 className="text-white">It is your time to</h2>
                <h2 className="text-white">step into the</h2>
                <h2 className="text-white">Limelight!</h2>
              </div>

              <h2 className="hidden lg:block text-white text-2xl lg:text-5xl font-light font-newsreader">
                It is Your Time to Step into the Limelight!
              </h2>
            </div>

            <p className="text-white text-base px-4 md:text-lg font-normal font-urbanist leading-normal tracking-tight max-w-3xl mx-auto">
              Embarking on a modeling career can be daunting. Don&rsquo;t let
              self-doubt hold you back. Our expert training and personalized
              guidance are designed to hone your skills and boost your
              confidence.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <Link href="/become-a-model"><Button variant="default" className="flex items-center gap-2 mx-auto text-sm lg:text-base">
                Become a model <i className="ri-arrow-right-up-line" />
              </Button></Link>
              
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
