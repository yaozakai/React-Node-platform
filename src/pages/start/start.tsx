import React, { useState, useEffect } from 'react';
import waltAvatar from "./images/Walt-avatar.png";
import './effects.scss';
import Socials from './socials';
import Captions from './captions';
import { useNavigate } from 'react-router-dom'; // Import useHistory hook
import  { Navigate } from 'react-router-dom'


export default function Start() {
    const [imageClicked, setImageClicked] = useState(false);
    const [captionText, setCaptionText] = useState('');
    const [captionFade, setCaptionFade] = useState(false);
    const [captionShow, setCaptionShow] = useState(false);

    // const navigate = useNavigate(); // Initialize useHistory hook


    const handleClick = () => {
        setImageClicked(true);

        // Update caption text with delays
        setTimeout(() => {
            setCaptionText("A 15 year journey.");
            setCaptionShow(true);
        }, 2000); // 2 seconds delay

        setTimeout(() => {
            setCaptionText("The journey continues...");
        }, 4000); // 2 seconds delay after the first caption

        setTimeout(() => {
            setCaptionText("And another chapter begins.");
        }, 6000); // 2 seconds delay after the second caption

        setTimeout(() => {
            setCaptionFade(true);
            // Redirect to /homepage after the last caption
            setTimeout(() => {
                setCaptionShow(false);
                window.location.href = '/homepage';
            }, 3000); // Add a delay before redirecting
        }, 8000)
    };

    return (
        <>
            <Captions show={captionShow} textToShow={captionText} fadeOut={captionFade} />
            <div className={`h-[200px] startBox rainglow flex w-[350px] items-end rounded-lg bg-blue-500 p-3 -mt-32 ${imageClicked ? 'shrinkFade' : ''}`}>
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
                            <div className="m-3"><Socials /></div>
                            <button
                                className={`rainGlowButton bg-yellow-500 relative  h-10 font-semibold px-6 py-2 rounded min-w-[120px] mb-2`}
                                onClick={handleClick}
                            >
                                <span className={`z-1000 absolute top-0 left-0 w-full h-full flex items-center justify-center`}>Let's go!</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
