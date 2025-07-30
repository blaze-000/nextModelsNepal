'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import profileImage from '../../../public/news_1.jpg';

interface Testimonial {
	quote: string;
	name: string;
	image: any;
}

const dummyTestimonials: Testimonial[] = [
	{
		quote: "Next Model Nepal is a game-changer in the modeling industry. Their commitment to nurturing talent and providing a platform for models to shine is commendable. The events are well-organized, and the networking opportunities are immense. I've learned and grown so much since joining, and I highly recommend it to any aspiring model.",
		name: "Ronish Khadgi",
		image: profileImage,
	},
	{
		quote: "As a model for Next Model Nepal, I've had an incredible experience. The opportunities provided by this platform are unparalleled, and the exposure I've gained has significantly boosted my career. The team is professional, supportive, and always strives to bring out the best in us. I'm proud to be associated with such a prestigious organization.",
		name: "Bikram Aditya Mahaseth",
		image: profileImage,
	},
	{
		quote: "Being a part of Next Model Nepal has been a transformative experience for me. The platform offers excellent training, exposure, and opportunities that have helped me advance my modeling career and grow as a model. The team's dedication to excellence is evident in every aspect of their work.",
		name: "Samrat Pratap Singh",
		image: profileImage,
	},
	{
		quote: "Next Model Nepal is a game-changer in the modeling industry. Their commitment to nurturing talent and providing a platform for models to shine is commendable. The events are well-organized, and the networking opportunities are immense. I've learned and grown so much since joining, and I highly recommend it to any aspiring model.",
		name: "Monika Adhikary",
		image: profileImage,
	},
	{
		quote: "As a model for Next Model Nepal, I've had an incredible experience. The opportunities provided by this platform are unparalleled, and the exposure I've gained has significantly boosted my career. The team is professional, supportive, and always strives to bring out the best in us. I'm proud to be associated with such a prestigious organization.",
		name: "Bikram Aditya Mahaseth",
		image: profileImage,
	},
	{
		quote: "Next Model Nepal is a game-changer in the modeling industry. Their commitment to nurturing talent and providing a platform for models to shine is commendable. The events are well-organized, and the networking opportunities are immense. I've learned and grown so much since joining, and I highly recommend it to any aspiring model.",
		name: "Ronish Khadgi",
		image: profileImage,
	},
	{
		quote: "Next Model Nepal is a game-changer in the modeling industry. Their commitment to nurturing talent and providing a platform for models to shine is commendable. The events are well-organized, and the networking opportunities are immense. I've learned and grown so much since joining, and I highly recommend it to any aspiring model.",
		name: "Monika Adhikary",
		image: profileImage,
	},
	{
		quote: "Being a part of Next Model Nepal has been a transformative experience for me. The platform offers excellent training, exposure, and opportunities that have helped me advance my modeling career and grow as a model. The team's dedication to excellence is evident in every aspect of their work.",
		name: "Samrat Pratap Singh",
		image: profileImage,
	},
];

const TestimonialSection: React.FC = () => {
	const itemsPerPage = 4;
	const [page, setPage] = useState(0);

	const maxPage = Math.ceil(dummyTestimonials.length / itemsPerPage) - 1;

	const handlePrev = () => {
		setPage((p) => (p > 0 ? p - 1 : p));
	};

	const handleNext = () => {
		setPage((p) => (p < maxPage ? p + 1 : p));
	};

	const currentTestimonials = dummyTestimonials.slice(
		page * itemsPerPage,
		page * itemsPerPage + itemsPerPage
	);

	return (
		<section className=" py-28 px-6 md:px-12 lg:px-24 mb-20">
			<h2 className="text-center text-4xl lg:text-5xl tracking-tight font-light font-newsreader mb-10 flex justify-center items-center gap-2">
				What our
				<div className="text-gold-500 relative">
					shining stars
					<Image src='/star.svg'
						alt=''
						height={12}
						width={12}
						className='w-5 h-5 absolute -top-3 left-1/2'
					/>
				</div>
				have to say
			</h2>
			<div className="max-w-7xl mx-auto">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					{currentTestimonials.map((testimonial, index) => (
						<div key={index} className="bg-muted-background p-6 px-10">
							<i className="ri-double-quotes-l text-gold-500 w-10 h-10 text-2xl" />
							<p className="text-neutral-300 leading-relaxed mb-4">{testimonial.quote}</p>
							<div className="flex items-center">
								<div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
									<Image
										src={testimonial.image}
										alt={testimonial.name}
										layout="fill"
										objectFit="cover"
										quality={75}
									/>
								</div>
								<p className="text-neutral-100 font-semibold">{testimonial.name}</p>
							</div>
						</div>
					))}
				</div>
				<div className="flex justify-end mt-6 text-gray-50">
					<button
						onClick={handlePrev}
						className={`bg-gray-600 rounded-full w-10 h-10 flex items-center justify-center mr-4 ${page === 0 ? 'opacity-50 cursor-not-allowed' : ''
							}`}
						aria-label="Previous Testimonial"
						disabled={page === 0}
					>
						<i className="ri-arrow-left-line text-xl" />
					</button>
					<button
						onClick={handleNext}
						className={`bg-gray-600 rounded-full w-10 h-10 flex items-center justify-center ${page === maxPage ? 'opacity-50 cursor-not-allowed' : ''
							}`}
						aria-label="Next Testimonial"
						disabled={page === maxPage}
					>
						<i className="ri-arrow-right-line text-xl" />
					</button>
				</div>
			</div>

		</section>
	);
};

export default TestimonialSection;
