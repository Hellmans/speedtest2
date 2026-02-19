import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export const Speedometer = ({ value = 0, maxValue = 500, phase = 'idle' }) => {
    const [displayValue, setDisplayValue] = useState(0);
    
    // Animate the display value with scramble effect
    useEffect(() => {
        if (phase === 'idle') {
            setDisplayValue(0);
            return;
        }
        
        const target = Math.round(value * 10) / 10;
        const duration = 100;
        const steps = 5;
        const stepDuration = duration / steps;
        
        let currentStep = 0;
        const interval = setInterval(() => {
            currentStep++;
            if (currentStep >= steps) {
                setDisplayValue(target);
                clearInterval(interval);
            } else {
                // Add slight randomness for scramble effect
                setDisplayValue(target + (Math.random() - 0.5) * 2);
            }
        }, stepDuration);
        
        return () => clearInterval(interval);
    }, [value, phase]);
    
    // Calculate needle rotation (0 to 270 degrees, starting from -135)
    const normalizedValue = Math.min(value / maxValue, 1);
    const rotation = -135 + (normalizedValue * 270);
    
    // Generate arc ticks
    const ticks = [];
    const tickCount = 27;
    for (let i = 0; i <= tickCount; i++) {
        const angle = -135 + (i * 270 / tickCount);
        const radian = (angle * Math.PI) / 180;
        const innerRadius = 120;
        const outerRadius = i % 3 === 0 ? 135 : 128;
        
        const x1 = 160 + innerRadius * Math.cos(radian);
        const y1 = 160 + innerRadius * Math.sin(radian);
        const x2 = 160 + outerRadius * Math.cos(radian);
        const y2 = 160 + outerRadius * Math.sin(radian);
        
        const isActive = (i / tickCount) <= normalizedValue;
        
        ticks.push(
            <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isActive ? '#00F3FF' : 'rgba(255, 255, 255, 0.2)'}
                strokeWidth={i % 3 === 0 ? 3 : 2}
                strokeLinecap="round"
                style={{
                    filter: isActive ? 'drop-shadow(0 0 4px rgba(0, 243, 255, 0.8))' : 'none',
                    transition: 'stroke 0.1s ease, filter 0.1s ease'
                }}
            />
        );
    }
    
    // Generate speed labels
    const labels = [0, 100, 200, 300, 400, 500];
    const labelElements = labels.map((label, index) => {
        const angle = -135 + (index * 270 / (labels.length - 1));
        const radian = (angle * Math.PI) / 180;
        const radius = 100;
        const x = 160 + radius * Math.cos(radian);
        const y = 160 + radius * Math.sin(radian);
        
        return (
            <text
                key={label}
                x={x}
                y={y}
                fill="rgba(255, 255, 255, 0.5)"
                fontSize="12"
                fontFamily="Orbitron, sans-serif"
                textAnchor="middle"
                dominantBaseline="middle"
            >
                {label}
            </text>
        );
    });
    
    // Get phase color
    const getPhaseColor = () => {
        switch (phase) {
            case 'download': return '#00F3FF';
            case 'upload': return '#BC13FE';
            case 'ping': return '#00FF94';
            case 'jitter': return '#FFC800';
            default: return '#00F3FF';
        }
    };
    
    const phaseColor = getPhaseColor();
    
    // Get unit based on phase
    const getUnit = () => {
        switch (phase) {
            case 'ping':
            case 'jitter':
                return 'ms';
            default:
                return 'Mbps';
        }
    };

    return (
        <div className="speedometer-container relative">
            <svg
                viewBox="0 0 320 320"
                className="w-full h-full speedometer-glow"
            >
                {/* Outer glow ring */}
                <circle
                    cx="160"
                    cy="160"
                    r="150"
                    fill="none"
                    stroke={phaseColor}
                    strokeWidth="2"
                    opacity="0.2"
                    style={{
                        filter: `drop-shadow(0 0 10px ${phaseColor})`
                    }}
                />
                
                {/* Background arc */}
                <path
                    d="M 40 200 A 120 120 0 1 1 280 200"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="20"
                    strokeLinecap="round"
                />
                
                {/* Active arc */}
                <motion.path
                    d="M 40 200 A 120 120 0 1 1 280 200"
                    fill="none"
                    stroke={phaseColor}
                    strokeWidth="20"
                    strokeLinecap="round"
                    strokeDasharray="565"
                    initial={{ strokeDashoffset: 565 }}
                    animate={{ strokeDashoffset: 565 - (normalizedValue * 565) }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    style={{
                        filter: `drop-shadow(0 0 15px ${phaseColor})`
                    }}
                />
                
                {/* Tick marks */}
                {ticks}
                
                {/* Speed labels */}
                {labelElements}
                
                {/* Center circle */}
                <circle
                    cx="160"
                    cy="160"
                    r="60"
                    fill="#0A0A0F"
                    stroke={phaseColor}
                    strokeWidth="2"
                    opacity="0.8"
                />
                
                {/* Needle */}
                <motion.g
                    initial={{ rotate: -135 }}
                    animate={{ rotate: rotation }}
                    transition={{ type: 'spring', stiffness: 60, damping: 15 }}
                    style={{ transformOrigin: '160px 160px' }}
                >
                    {/* Needle glow trail */}
                    <line
                        x1="160"
                        y1="160"
                        x2="260"
                        y2="160"
                        stroke={phaseColor}
                        strokeWidth="4"
                        strokeLinecap="round"
                        opacity="0.3"
                        style={{
                            filter: `blur(4px)`
                        }}
                    />
                    {/* Main needle */}
                    <line
                        x1="160"
                        y1="160"
                        x2="250"
                        y2="160"
                        stroke={phaseColor}
                        strokeWidth="3"
                        strokeLinecap="round"
                        style={{
                            filter: `drop-shadow(0 0 8px ${phaseColor})`
                        }}
                    />
                    {/* Needle tip */}
                    <circle
                        cx="250"
                        cy="160"
                        r="6"
                        fill={phaseColor}
                        style={{
                            filter: `drop-shadow(0 0 10px ${phaseColor})`
                        }}
                    />
                </motion.g>
                
                {/* Center dot */}
                <circle
                    cx="160"
                    cy="160"
                    r="8"
                    fill={phaseColor}
                    style={{
                        filter: `drop-shadow(0 0 10px ${phaseColor})`
                    }}
                />
            </svg>
            
            {/* Speed display in center */}
            <div className="speed-display">
                <motion.div
                    className="speed-value"
                    style={{ color: phaseColor }}
                    key={displayValue}
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.1 }}
                >
                    {phase === 'idle' ? '0' : displayValue.toFixed(1)}
                </motion.div>
                <div className="speed-unit">{getUnit()}</div>
            </div>
        </div>
    );
};
