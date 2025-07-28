import Image from "next/image"
export default function Navbar() {
  return (
    <div className="inline-flex justify-between items-center">
      <Image
        alt="logo"
        src="/logo.png"
        width={98}
        height={82}
        style={{ objectFit: 'cover' }}
      />
      <div className="flex justify-end items-center gap-20">
        <div className="flex justify-start items-center gap-12">
          <div className="justify-center text-white text-xl font-medium font-['Urbanist'] leading-loose tracking-tight">Home </div>
          <div className="flex justify-start items-center gap-[5px]">
            <div className="justify-center text-white text-xl font-medium font-['Urbanist'] leading-loose tracking-tight">Events</div>
            <div className="w-6 h-6 relative overflow-hidden">
              <div className="w-2 h-1.5 left-[7.76px] top-[9.34px] absolute bg-white" />
            </div>
          </div>
          <div className="justify-center text-white text-xl font-medium font-['Urbanist'] leading-loose tracking-tight">Voting</div>
          <div className="justify-center text-white text-xl font-medium font-['Urbanist'] leading-loose tracking-tight">About Us</div>
          <div className="justify-center text-white text-xl font-medium font-['Urbanist'] leading-loose tracking-tight">Contact Us</div>
          <div className="flex justify-start items-center gap-[5px]">
            <div className="justify-center text-white text-xl font-medium font-['Urbanist'] leading-loose tracking-tight">Event Details</div>
            <div className="w-6 h-6 relative overflow-hidden">
              <div className="w-2 h-1.5 left-[7.76px] top-[9.34px] absolute bg-white" />
            </div>
          </div>
        </div>
        <div data-property-1="Default" className="w-32 h-14 relative bg-amber-500 rounded-[40px] overflow-hidden">
          <div className="left-[40px] top-[15px] absolute justify-center text-yellow-950 text-xl font-bold font-['Urbanist'] leading-loose tracking-tight">Apply</div>
          <div className="left-[-65px] top-[15px] absolute justify-center text-yellow-950 text-xl font-bold font-['Urbanist'] leading-loose tracking-tight">Login</div>
        </div>
      </div>
    </div>
  )
}