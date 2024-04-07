import React, { useState, useEffect } from 'react';
import waltAvatar from '../../images/Walt-avatar.png';
import './effects.scss';
import Icon from '../../components/icons';
import Captions from './captions';

export default function Start() {
    const [imageClicked, setImageClicked] = useState(false);
    const [captionShow, setCaptionShow] = useState(false);


    const handleClick = () => {
        setTimeout(() => {
            setCaptionShow(true);
        }, 2000);

        setImageClicked(true);
    };

    return (
        <>
            <div className={`${captionShow ? '' : 'hidden'}`}>
                <Captions />
            </div>
            <div className={`h-[200px] startBox rainglow flex w-[350px] items-end rounded-lg bg-blue-500 p-3 -mt-32 ${captionShow ? 'hidden' : ''} ${imageClicked ? 'shrinkFade' : ''}`}>
                <div className="text-white">
                    <div className={`flex flex-row items-center leading-none text-white`} >
                        <img
                            src={waltAvatar}
                            className={`z-10 absolute w-[200px] pb-44 -left-[20px] ${imageClicked ? 'spinShrink' : ''}`}
                            alt="Screenshot of the dashboard project showing mobile version"
                        />
                        <div className="absolute left-[190px] top-0">
                            <p className="text-[44px] text-left text-white mt-3">
                                <span className="text-[44px] text-left text-white">Walt</span>
                                <br />
                                <span className="text-[44px] text-left text-white">Yao</span>
                            </p>
                            <div className="m-3">
                                {/* Render individual icons here */}
                                <Icon iconKey="faHouse" href="mailto:walt.yao@gmail.com" />
                                <Icon iconKey="faLine" href="https://line.me/ti/p/2xe4zhsoin" />
                                <Icon iconKey="faLinkedin" href="https://www.linkedin.com/in/waltyao" />
                                <Icon iconKey="faGithub" href="https://github.com/yaozakai" />
                            </div>
                            <button
                                className={`rainGlowButton bg-yellow-500 relative  h-10 font-semibold px-6 py-2 rounded min-w-[120px] mb-2`}
                                onClick={handleClick}
                            >
                                <span className={`text-black absolute top-0 left-0 w-full h-full flex items-center justify-center`}>Let's go!</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
