import { RefObject, useEffect, useState } from "react";

const useAudio = (url: string, ref: RefObject<HTMLAudioElement>) => {
    const [audio] = useState(new Audio(url));
    const [playing, setPlaying] = useState(false);

    const toggle = () => setPlaying(!playing);

    useEffect(() => {
        if (ref.current) ref.current.loop = true;
        playing ? ref.current?.play() : ref.current?.pause();
    },
        [audio, playing]
    );

    useEffect(() => {
        audio.addEventListener('ended', () => setPlaying(false));
        return () => {
            audio.removeEventListener('ended', () => setPlaying(false));
        };
    }, []);

    return { playing, toggle };
};

export default useAudio;