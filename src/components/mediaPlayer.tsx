import React, { useState, useRef } from 'react';
import Icon from './icons';
import './styles.css';

const MediaPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            // Playback started successfully
          }).catch(error => {
            console.error('Failed to start playback:', error);
          });
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="absolute bottom-0 left-0 m-10 w-20 h-20">

      <button className={`playBorder ${isPlaying ? 'is--playing' : ''}`} justify-center align-center onClick={handlePlayPause}>
        {isPlaying ? <Icon iconKey="faPause" /> : <Icon iconKey="faPlay" />}
      </button>
      <audio ref={audioRef} src="/song.mp3" autoPlay />

    </div>
  );
};

export default MediaPlayer;
