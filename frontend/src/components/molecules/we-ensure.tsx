import Image from "next/image"
export default function WeEnsure() {
  return (
    <section className='h-[379px] bg-background2 relative '>
      <div className="max-w-7xl mx-auto flex flex-col gap-20">
        <div className="text-center font-[300] text-[60px] not-italic leading-[normal] tracking-[-0.075em] pt-20">
          <h2>At Next Models Nepal
            <span className='text-gold-500'> We Ensure</span>,
          </h2>
        </div>

        <div className="flex justify-between">
          <div className="flex gap-2 relative">
            <div>
              <Image
                alt="star"
                src="/star.svg"
                height={52}
                width={52}
              />
            </div>
            <div className="flex flex-col">
              <h4 className="font-[400] text-[28px] not-italic leading-[normal] tracking-[0.0175em]">Professionalism</h4>
              <p className="font-[400] text-[20px] not-italic leading-[30px] tracking-[0.025em]">Backed by experts & mentors</p>
            </div>
            <div className="absolute bottom-[159px] h-[78px] text-9xl font-bold leading-none">
              01
            </div>

          </div>

          <div className="flex gap-2">
            <div>
              <Image
                alt="star"
                src="/star.svg"
                height={52}
                width={52}
              />
            </div>
            <div className="flex flex-col">
              <h4 className="font-[400] text-[28px] not-italic leading-[normal] tracking-[0.0175em]">Passion</h4>
              <p className="font-[400] text-[20px] not-italic leading-[30px] tracking-[0.025em]">Empowering talent with dedication</p>

            </div>
          </div>

          <div className="flex gap-2">
            <div>
              <Image
                alt="star"
                src="/star.svg"
                height={52}
                width={52}
              />
            </div>
            <div className="flex flex-col">
              <h4 className="font-[400] text-[28px] not-italic leading-[normal] tracking-[0.0175em]">Prestige</h4>
              <p className="font-[400] text-[20px] not-italic leading-[30px] tracking-[0.025em]">Nepal&rsquo;s most recognized modeling brand</p>

            </div>
          </div>

        </div>

      </div>

    </section>


  )
}
