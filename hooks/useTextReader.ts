import { useState, useEffect, useRef, useCallback } from 'react';

interface UseTextReaderReturn {
    speak: (text: string) => void;
    pause: () => void;
    resume: () => void;
    cancel: () => void;
    isPlaying: boolean;
    isPaused: boolean;
    currentWordIndex: number;
    supported: boolean;
}

export const useTextReader = (): UseTextReaderReturn => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [currentWordIndex, setCurrentWordIndex] = useState(-1);
    const [supported, setSupported] = useState(false);

    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            setSupported(true);
        }
    }, []);

    const cancel = useCallback(() => {
        if (!supported) return;
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentWordIndex(-1);
    }, [supported]);

    const speak = useCallback((text: string) => {
        if (!supported) return;

        // Cancel any existing speech
        cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utteranceRef.current = utterance;

        // Select a better voice
        const voices = window.speechSynthesis.getVoices();
        // Prefer "Google US English", "Microsoft Zira", "Samantha", or any "Google" voice
        const preferredVoice = voices.find(v =>
            v.name === 'Google US English' ||
            v.name === 'Microsoft Zira Desktop - English (United States)' ||
            v.name === 'Samantha' ||
            (v.name.includes('Google') && v.lang.startsWith('en'))
        );

        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        // Configure utterance
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        // Event handlers
        utterance.onstart = () => {
            setIsPlaying(true);
            setIsPaused(false);
        };

        utterance.onend = () => {
            setIsPlaying(false);
            setIsPaused(false);
            setCurrentWordIndex(-1);
        };

        utterance.onerror = (event) => {
            console.error('Speech synthesis error', event);
            setIsPlaying(false);
            setIsPaused(false);
        };

        utterance.onpause = () => {
            setIsPaused(true);
        };

        utterance.onresume = () => {
            setIsPaused(false);
        };

        // Boundary event for highlighting
        utterance.onboundary = (event) => {
            if (event.name === 'word') {
                const textBefore = text.substring(0, event.charIndex);
                const wordCount = textBefore.trim().split(/\s+/).length;

                // If textBefore is empty (start of string), wordCount is 0 if trim() results in empty string,
                // but " ".split(/\s+/) is ["", ""].
                // Let's be safer:

                let count = 0;
                if (textBefore.trim().length > 0) {
                    count = textBefore.trim().split(/\s+/).length;
                    // If the charIndex is at the start of a word that is preceded by space, split length is correct index?
                    // Example: "Hello world"
                    // charIndex 0 ('H'): textBefore "", trim "", split [""], length 1? No.

                    // Let's stick to the previous logic which seemed to work or at least be close.
                    // The previous logic was:
                    // const sub = text.substring(0, event.charIndex + 1);
                    // const count = sub.trim().split(/\s+/).length - 1;

                    const sub = text.substring(0, event.charIndex + 1);
                    count = sub.trim().split(/\s+/).length - 1;
                }

                setCurrentWordIndex(count);
            }
        };

        window.speechSynthesis.speak(utterance);
    }, [supported, cancel]);

    const pause = useCallback(() => {
        if (!supported) return;
        window.speechSynthesis.pause();
    }, [supported]);

    const resume = useCallback(() => {
        if (!supported) return;
        window.speechSynthesis.resume();
    }, [supported]);

    return {
        speak,
        pause,
        resume,
        cancel,
        isPlaying,
        isPaused,
        currentWordIndex,
        supported
    };
};
