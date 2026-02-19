import { useState, useCallback, useRef } from 'react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const useSpeedTest = () => {
    const [phase, setPhase] = useState('idle');
    const [currentSpeed, setCurrentSpeed] = useState(0);
    const [results, setResults] = useState({
        ping: null,
        jitter: null,
        download: null,
        upload: null
    });
    const [isRunning, setIsRunning] = useState(false);
    const abortRef = useRef(null);
    
    const measurePing = useCallback(async () => {
        const pings = [];
        
        for (let i = 0; i < 5; i++) {
            const start = performance.now();
            await fetch(`${API}/ping?_=${Date.now()}`);
            pings.push(performance.now() - start);
            await new Promise(r => setTimeout(r, 100));
        }
        
        pings.sort((a, b) => a - b);
        const avg = pings.slice(1, -1).reduce((a, b) => a + b, 0) / 3;
        setCurrentSpeed(avg);
        return avg;
    }, []);
    
    const measureJitter = useCallback(async () => {
        const pings = [];
        
        for (let i = 0; i < 5; i++) {
            const start = performance.now();
            await fetch(`${API}/ping?_=${Date.now()}`);
            pings.push(performance.now() - start);
            await new Promise(r => setTimeout(r, 100));
        }
        
        let jitter = 0;
        for (let i = 1; i < pings.length; i++) {
            jitter += Math.abs(pings[i] - pings[i-1]);
        }
        jitter /= (pings.length - 1);
        setCurrentSpeed(jitter);
        return jitter;
    }, []);
    
    const measureDownload = useCallback(async () => {
        const startTime = performance.now();
        let totalBytes = 0;
        let lastUpdate = startTime;
        let lastBytes = 0;
        
        abortRef.current = new AbortController();
        
        try {
            const response = await fetch(`${API}/download?_=${Date.now()}`, {
                signal: abortRef.current.signal
            });
            
            const reader = response.body.getReader();
            
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                totalBytes += value.length;
                
                const now = performance.now();
                if (now - lastUpdate >= 200) {
                    const mbps = ((totalBytes - lastBytes) * 8) / ((now - lastUpdate) / 1000) / 1000000;
                    setCurrentSpeed(mbps);
                    lastUpdate = now;
                    lastBytes = totalBytes;
                }
            }
        } catch (e) {
            if (e.name !== 'AbortError') console.error(e);
        }
        
        const duration = (performance.now() - startTime) / 1000;
        return (totalBytes * 8) / duration / 1000000;
    }, []);
    
    const measureUpload = useCallback(async () => {
        const chunkSize = 2 * 1024 * 1024; // 2MB
        const testDuration = 5000;
        const startTime = performance.now();
        let totalBytes = 0;
        let lastUpdate = startTime;
        let lastBytes = 0;
        
        const chunk = new Uint8Array(chunkSize);
        
        while (performance.now() - startTime < testDuration) {
            await fetch(`${API}/upload`, {
                method: 'POST',
                body: chunk
            });
            
            totalBytes += chunkSize;
            
            const now = performance.now();
            if (now - lastUpdate >= 200) {
                const mbps = ((totalBytes - lastBytes) * 8) / ((now - lastUpdate) / 1000) / 1000000;
                setCurrentSpeed(mbps);
                lastUpdate = now;
                lastBytes = totalBytes;
            }
        }
        
        const duration = (performance.now() - startTime) / 1000;
        return (totalBytes * 8) / duration / 1000000;
    }, []);
    
    const startTest = useCallback(async () => {
        setIsRunning(true);
        setResults({ ping: null, jitter: null, download: null, upload: null });
        
        try {
            setPhase('ping');
            const ping = await measurePing();
            setResults(r => ({ ...r, ping }));
            
            setPhase('jitter');
            const jitter = await measureJitter();
            setResults(r => ({ ...r, jitter }));
            
            setPhase('download');
            setCurrentSpeed(0);
            const download = await measureDownload();
            setResults(r => ({ ...r, download }));
            
            setPhase('upload');
            setCurrentSpeed(0);
            const upload = await measureUpload();
            setResults(r => ({ ...r, upload }));
            
            setPhase('complete');
            setCurrentSpeed(0);
        } catch (e) {
            console.error(e);
            setPhase('idle');
        }
        
        setIsRunning(false);
    }, [measurePing, measureJitter, measureDownload, measureUpload]);
    
    const resetTest = useCallback(() => {
        if (abortRef.current) abortRef.current.abort();
        setPhase('idle');
        setCurrentSpeed(0);
        setResults({ ping: null, jitter: null, download: null, upload: null });
        setIsRunning(false);
    }, []);
    
    return { phase, currentSpeed, results, isRunning, startTest, resetTest };
};
