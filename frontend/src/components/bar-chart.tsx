"use client";

import Image from 'next/image';
import { motion } from "framer-motion";

type Contestant = {
  id: number;
  name: string;
  votes: number;
};

type CustomBarChartProps = {
  topThree: Contestant[];
};

export default function BarChart({ topThree }: CustomBarChartProps) {
  const first = topThree[0];
  const second = topThree[1];
  const third = topThree[2];

  // Determine heights based on tie conditions
  let centerHeight: number, leftHeight: number, rightHeight: number;
  const baseHeight = 400; // Base height unit in pixels

  if (first.votes === second.votes && second.votes === third.votes) {
    // All three tied - equal heights
    centerHeight = leftHeight = rightHeight = baseHeight;
  } else if (first.votes === second.votes) {
    // Top two tied - equal heights for first two
    centerHeight = leftHeight = baseHeight;
    rightHeight = 2 * baseHeight / 3;
  } else if (second.votes === third.votes) {
    // Second and third tied - equal heights for second and third
    centerHeight = baseHeight;
    leftHeight = rightHeight = 2 * baseHeight / 3;
  } else {
    // No ties - standard heights
    centerHeight = baseHeight;
    leftHeight = 4 * baseHeight / 5;
    rightHeight = 3 * baseHeight / 5;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className='bg-top w-full pt-16 sticky bottom-0 self-end'
      style={{ backgroundImage: `url('/runway/circular-glow.svg')` }}
    >
      <div className="max-w-3xl mx-auto mdplus:pl-6 flex items-end justify-evenly gap-4 font-newsreader bg-top">

        {/* Second place */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col justify-end items-center space-y-4 relative"
        >
          <div>
            <Image
              src="/contestant_2.jpg"
              alt=""
              width={200}
              height={0}
              className="object-cover object-top h-24 w-36 border-primary rounded-lg border-[2px]"
            />
            <p className="text-center">{second.name}</p>
          </div>
          <div
            className="w-20 xs:w-24 sm:w-36 lg:w-44 overflow-hidden bg-no-repeat bg-top transition-all duration-500 responsive-bar"
            style={{
              '--bar-height': `${leftHeight}px`,
              backgroundImage: `url('/bar.svg')`,
              backgroundSize: '100% auto',
            } as React.CSSProperties & { [key: string]: any }}
          />
        </motion.div>

        {/* First place */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center space-y-4 relative"
        >
          <div>
            <Image
              src="/contestant_1.jpg"
              alt=""
              width={200}
              height={0}
              className="object-cover object-top h-24 w-36 border-primary rounded-lg border-[2px]"
            />
            <p className="text-center">{first.name}</p>
          </div>
          <div
            className="w-20 xs:w-24 sm:w-36 lg:w-44 overflow-hidden bg-no-repeat bg-top transition-all duration-500 responsive-bar"
            style={{
              '--bar-height': `${centerHeight}px`,
              backgroundImage: `url('/bar.svg')`,
              backgroundSize: '100% auto',
            } as React.CSSProperties & { [key: string]: any }}
          />
        </motion.div>

        {/* Third place */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center space-y-4 relative"
        >
          <div>
            <Image
              src="/contestant_2.jpg"
              alt=""
              width={200}
              height={0}
              className="object-cover object-top h-24 w-36 border-primary rounded-lg border-[2px]"
            />
            <p className="text-center">{third.name}</p>
          </div>
          <div
            className="w-20 xs:w-24 sm:w-36 lg:w-44 overflow-hidden bg-no-repeat bg-top transition-all duration-500 responsive-bar"
            style={{
              '--bar-height': `${rightHeight}px`,
              backgroundImage: `url('/bar.svg')`,
              backgroundSize: '100% auto',
            } as React.CSSProperties & { [key: string]: any }}
          />
        </motion.div>
      </div>
    </motion.section>
  );
};