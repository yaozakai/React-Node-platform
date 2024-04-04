// import { poppinsRegular } from '@/app/ui/fonts';


import waltAvatar from "./images/Walt-avatar.png";


export default function Logo() {
  return (
    <div className={`flex flex-row items-center leading-none text-white`} >

        <img
          src={waltAvatar}
          className="block"
          alt="Screenshot of the dashboard project showing mobile version"
        />
        <p className="w-[100px] h-[88px] absolute left-[183.52px] top-[28.06px] text-[44px] text-left text-white mt-3">
          <span className="w-[100px] h-[88px] text-[44px] text-left text-white">Walt</span>
          <br />
          <span className="w-[100px] h-[88px] text-[44px] text-left text-white">Yao</span>
        </p>


    </div>
  );
}

export function LogoTop() {
  return (
    <div className={`top-3 w-100 absolute md:w-20 md:top-8 flex flex-row items-center leading-none text-white`} >

        <img
          src={waltAvatar}
          className="w-[70px] md:w-[100px] static md:absolute top-0 md:top-3 md:left-3"
          alt="Screenshot of the dashboard project showing mobile version"
        />
        <p className="absolute w-40 md:w-auto md:w-0 top-[20px] h-[88px] left-[80px] md:left-[90px] text-[44px] text-left text-white ">
          <span className=" text-[36px] text-left text-white">Walt Yao</span>
        </p>


    </div>
  );
}
