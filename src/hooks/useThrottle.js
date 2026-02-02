import { useCallback, useEffect, useRef } from "react";

const useThrottle = (callback, delay) => {
    const callbackRef = useRef(callback);
    const lastCallRef = useRef(0);
    const lastArgsRef = useRef(null);
    const timeoutRef = useRef(null);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        };
    }, []);

    return useCallback(
        (...args) => {
            const now = Date.now();
            const timeSinceLastCall = now - lastCallRef.current;

            lastArgsRef.current = args;

            if (timeSinceLastCall >= delay) {
                lastCallRef.current = now;
                callbackRef.current(...args);
            } else if (!timeoutRef.current) {
                const remainingTime = delay - timeSinceLastCall;
                timeoutRef.current = setTimeout(() => {
                    lastCallRef.current = Date.now();
                    callbackRef.current(...lastArgsRef.current);
                    timeoutRef.current = null;
                }, remainingTime);
            }
        },
        [delay]
    );
};

export default useThrottle;
