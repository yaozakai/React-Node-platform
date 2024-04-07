import React, { useState, useEffect } from 'react';
import MediaPlayer from '../../components/mediaPlayer';
import './effects.scss'

const Captions: React.FC = () => {
    const [captionText, setCaptionText] = useState('');
    const [captionFade, setCaptionFade] = useState(false);
    const [captionShow, setCaptionShow] = useState(false);
    const [loadMediaPlayer, setLoadMediaPlayer] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setCaptionText("A 15 year journey.");
            setCaptionShow(true);
            setLoadMediaPlayer(true); // Set to true when "A 15 year journey." text appears
        }, 2000);

        setTimeout(() => {
            setCaptionText("The journey continues...");
        }, 6500);

        setTimeout(() => {
            setCaptionText("And another chapter begins.");
            setCaptionFade(true);
        }, 9000);

        setTimeout(() => {
            setTimeout(() => {
                window.location.href = '/homepage';
            }, 4000);
        }, 9500);
    }, []);

    return (
        <div className={`captions ${captionFade ? 'fadeOut' : captionShow ? '' : 'hidden'}`}>
            <div className={`flex justify-center align-center text-2xl`}>
                {captionText}
                {loadMediaPlayer && <MediaPlayer />}
            </div>
        </div>
    );
};

export default Captions;
