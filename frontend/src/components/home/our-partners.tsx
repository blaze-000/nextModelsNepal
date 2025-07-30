'use client';
import Image from 'next/image';
import React from 'react';

const partners = [
	'/news_1.jpg',
	'/news_1.jpg',
	'/news_1.jpg',
	'/news_1.jpg',
	'/news_1.jpg',
	'/news_1.jpg',
	'/news_1.jpg',
	'/news_1.jpg',
	'/news_1.jpg'
];

const OurPartners = () => {
	return (
		<section className="w-full py-16 overflow-hidden">
			<div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
				{/* Left Section */}
				<div className="flex flex-col gap-3 font-newsreader">
					<h2 className="text-5xl  font-extralight tracking-tight">Our Strategic</h2>
					<div className="flex items-center gap-4 ">
						<Image
							src="/handshake.jpg"
							alt=""
							width={187}
							height={80}
							className="rounded-[38px] w-36 h-16 object-cover"
						/>
						<span className='text-gold-500 text-6xl font-light tracking-tighter'>Partners</span>
					</div>
				</div>

				{/* Right Description */}
				<p className="text-base text-right max-w-md font-light font-urbanist">
					The Creative Forces Behind Iconic Campaigns: Celebrating the Partners Who Drive Success
					for Leading Brands
				</p>
			</div>

			{/* Scrolling Partner Logos */}
			<div className="relative mt-12 overflow-hidden">
				<div className="animate-scroll whitespace-nowrap flex gap-16">
					{[...partners, ...partners].map((src, idx) => (
						<Image
							key={idx}
							src={src}
							alt={`Partner ${idx + 1}`}
							width={120}
							height={80}
							className="object-contain inline-block"
						/>
					))}
				</div>
			</div>
		</section>
	);
};

export default OurPartners;
