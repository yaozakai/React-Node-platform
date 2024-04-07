import React, { useState, useRef, useEffect } from 'react';
import Icon from './icons';
import './styles.css'

const MediaPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play(); // Initiating playback when component mounts
      setIsPlaying(true);
    }
  }, []);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="absolute bottom-0 left-0 m-10 w-20 h-20">

        <button className={`playBorder ${isPlaying ? 'is--playing' : ''}`} justify-center align-center  onClick={handlePlayPause}>
            {isPlaying ? <Icon iconKey="faPause" /> : <Icon iconKey="faPlay" />}
        </button>
        <audio ref={audioRef} src="/song.mp3" />

    </div>
  );
};

export default MediaPlayer;
