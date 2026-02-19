import { useState, useCallback, useRef } from 'react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const useSpeedTest = () => {
    const [phase, setPhase] = useState('idle'); // idle, ping, jitter, download, upload, complete
    const [currentSpeed, setCurrentSpeed] = useState(0);
    const [results, setResults] = useState({
        ping: null,
        jitter: null,
        download: null,
        upload: null
    });
    const [isRunning, setIsRunning] = useState(false);
    const abortControllerRef = useRef(null);
    
    const measurePing = useCallback(async () => {
        const pings = [];
        const iterations = 10;
        
        for (let i = 0; i < iterations; i++) {
            try {
                const start = performance.now();
                await fetch(`${API}/ping?t=${Date.now()}`, { 
                    cache: 'no-store',
                    method: 'GET'
                });
                const end = performance.now();
                const ping = end - start;
                pings.push(ping);
                setCurrentSpeed(ping);
                
                // Small delay between pings
                await new Promise(resolve => setTimeout(resolve, 100));
            } catch (error) {
                console.error('Ping error:', error);
            }
        }
        
        // Calculate average ping (excluding outliers)
        pings.sort((a, b) => a - b);
        const trimmedPings = pings.slice(1, -1); // Remove highest and lowest
        const avgPing = trimmedPings.reduce((a, b) => a + b, 0) / trimmedPings.length;
        
        return avgPing;
    }, []);
    
    const measureJitter = useCallback(async (basePing) => {
        const pings = [];
        const iterations = 10;
        
        for (let i = 0; i < iterations; i++) {
            try {
                const start = performance.now();
                await fetch(`${API}/ping?t=${Date.now()}`, { 
                    cache: 'no-store',
                    method: 'GET'
                });
                const end = performance.now();
                pings.push(end - start);
                
                // Calculate running jitter
                if (pings.length > 1) {
                    const variations = [];
                    for (let j = 1; j < pings.length; j++) {
                        variations.push(Math.abs(pings[j] - pings[j - 1]));
                    }
                    const currentJitter = variations.reduce((a, b) => a + b, 0) / variations.length;
                    setCurrentSpeed(currentJitter);
                }
                
                await new Promise(resolve => setTimeout(resolve, 100));
            } catch (error) {
                console.error('Jitter measurement error:', error);
            }
        }
        
        // Calculate jitter (average variation between consecutive pings)
        const variations = [];
        for (let i = 1; i < pings.length; i++) {
            variations.push(Math.abs(pings[i] - pings[i - 1]));
        }
        const jitter = variations.reduce((a, b) => a + b, 0) / variations.length;
        
        return jitter;
    }, []);
    
    const measureDownload = useCallback(async () => {
        const testDuration = 8000; // 8 seconds
        const startTime = performance.now();
        let totalBytes = 0;
        let lastUpdate = startTime;
        let lastBytes = 0;
        
        abortControllerRef.current = new AbortController();
        
        try {
            while (performance.now() - startTime < testDuration) {
                const response = await fetch(`${API}/download?t=${Date.now()}`, {
                    cache: 'no-store',
                    signal: abortControllerRef.current.signal
                });
                
                const reader = response.body.getReader();
                
                while (true) {
                    const { done, value } = await reader.read();
                    
                    if (done) break;
                    
                    totalBytes += value.length;
                    
                    // Update speed every 100ms
                    const now = performance.now();
                    if (now - lastUpdate >= 100) {
                        const elapsed = (now - lastUpdate) / 1000;
                        const bytesInInterval = totalBytes - lastBytes;
                        const speedMbps = (bytesInInterval * 8) / (elapsed * 1000000);
                        setCurrentSpeed(speedMbps);
                        lastUpdate = now;
                        lastBytes = totalBytes;
                    }
                    
                    if (performance.now() - startTime >= testDuration) break;
                }
                
                if (performance.now() - startTime >= testDuration) break;
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Download test error:', error);
            }
        }
        
        // Calculate final average speed
        const totalDuration = (performance.now() - startTime) / 1000;
        const avgSpeedMbps = (totalBytes * 8) / (totalDuration * 1000000);
        
        return avgSpeedMbps;
    }, []);
    
    const measureUpload = useCallback(async () => {
        const testDuration = 8000; // 8 seconds
        const chunkSize = 1024 * 1024; // 1MB chunks
        const startTime = performance.now();
        let totalBytes = 0;
        let lastUpdate = startTime;
        let lastBytes = 0;
        
        // Generate random data for upload
        const generateChunk = () => {
            const array = new Uint8Array(chunkSize);
            for (let i = 0; i < chunkSize; i++) {
                array[i] = Math.floor(Math.random() * 256);
            }
            return array;
        };
        
        try {
            while (performance.now() - startTime < testDuration) {
                const chunk = generateChunk();
                
                await fetch(`${API}/upload-test`, {
                    method: 'POST',
                    body: chunk,
                    headers: {
                        'Content-Type': 'application/octet-stream'
                    }
                });
                
                totalBytes += chunkSize;
                
                // Update speed every 100ms
                const now = performance.now();
                if (now - lastUpdate >= 100) {
                    const elapsed = (now - lastUpdate) / 1000;
                    const bytesInInterval = totalBytes - lastBytes;
                    const speedMbps = (bytesInInterval * 8) / (elapsed * 1000000);
                    setCurrentSpeed(speedMbps);
                    lastUpdate = now;
                    lastBytes = totalBytes;
                }
            }
        } catch (error) {
            console.error('Upload test error:', error);
        }
        
        // Calculate final average speed
        const totalDuration = (performance.now() - startTime) / 1000;
        const avgSpeedMbps = (totalBytes * 8) / (totalDuration * 1000000);
        
        return avgSpeedMbps;
    }, []);
    
    const startTest = useCallback(async () => {
        setIsRunning(true);
        setResults({ ping: null, jitter: null, download: null, upload: null });
        
        try {
            // Phase 1: Ping
            setPhase('ping');
            setCurrentSpeed(0);
            const pingResult = await measurePing();
            setResults(prev => ({ ...prev, ping: pingResult }));
            
            // Phase 2: Jitter
            setPhase('jitter');
            setCurrentSpeed(0);
            const jitterResult = await measureJitter(pingResult);
            setResults(prev => ({ ...prev, jitter: jitterResult }));
            
            // Phase 3: Download
            setPhase('download');
            setCurrentSpeed(0);
            const downloadResult = await measureDownload();
            setResults(prev => ({ ...prev, download: downloadResult }));
            
            // Phase 4: Upload
            setPhase('upload');
            setCurrentSpeed(0);
            const uploadResult = await measureUpload();
            setResults(prev => ({ ...prev, upload: uploadResult }));
            
            // Complete
            setPhase('complete');
            setCurrentSpeed(0);
            
        } catch (error) {
            console.error('Speed test error:', error);
            setPhase('idle');
        } finally {
            setIsRunning(false);
        }
    }, [measurePing, measureJitter, measureDownload, measureUpload]);
    
    const stopTest = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        setPhase('idle');
        setIsRunning(false);
        setCurrentSpeed(0);
    }, []);
    
    const resetTest = useCallback(() => {
        setPhase('idle');
        setCurrentSpeed(0);
        setResults({ ping: null, jitter: null, download: null, upload: null });
        setIsRunning(false);
    }, []);
    
    return {
        phase,
        currentSpeed,
        results,
        isRunning,
        startTest,
        stopTest,
        resetTest
    };
};
