// import { poppinsRegular } from '@/app/ui/fonts';
import '../../css/glow.css';


import waltAvatar from "./images/Walt-avatar.png";


export default function Start() {
  return (

    <div className="rainglow flex h-20 w-[350px] items-end rounded-lg bg-blue-500 p-3 h-44 -mt-32">
      <div className="text-white">
        <div className={`flex flex-row items-center leading-none text-white`} >
          <img
              src={waltAvatar}
              className="absolute w-[200px] pb-32 -left-[20px]"
              alt="Screenshot of the dashboard project showing mobile version"
          />
          <p className="absolute left-[200px] top-[10px] text-[44px] text-left text-white mt-3">
              <span className="text-[44px] text-left text-white">Walt</span>
              <br />
              <span className="text-[44px] text-left text-white">Yao</span>
          </p>
          <button className="bg-yellow-500 relative left-[190px] text-white font-semibold px-6 py-2 rounded min-w-[120px]">
              Let&apos;s go!
          </button>
      </div>
    </div>
  </div>
    

  );
}


