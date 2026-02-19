import { motion } from 'framer-motion';
import { Download, Upload, Gauge, Activity } from 'lucide-react';

export const ProgressBars = ({ phase, currentSpeed, results }) => {
    const bars = [
        {
            id: 'download',
            label: 'Download',
            icon: Download,
            color: '#00F3FF',
            unit: 'Mbps',
            maxValue: 500,
            value: phase === 'download' ? currentSpeed : results.download,
            isActive: phase === 'download'
        },
        {
            id: 'upload',
            label: 'Upload',
            icon: Upload,
            color: '#BC13FE',
            unit: 'Mbps',
            maxValue: 500,
            value: phase === 'upload' ? currentSpeed : results.upload,
            isActive: phase === 'upload'
        },
        {
            id: 'ping',
            label: 'Latência',
            icon: Gauge,
            color: '#00FF94',
            unit: 'ms',
            maxValue: 200,
            value: phase === 'ping' ? currentSpeed : results.ping,
            isActive: phase === 'ping',
            inverted: true // Lower is better
        },
        {
            id: 'jitter',
            label: 'Variação',
            icon: Activity,
            color: '#FFC800',
            unit: 'ms',
            maxValue: 100,
            value: phase === 'jitter' ? currentSpeed : results.jitter,
            isActive: phase === 'jitter',
            inverted: true // Lower is better
        }
    ];

    return (
        <div className="w-full space-y-6" data-testid="progress-bars">
            {bars.map((bar, index) => {
                const Icon = bar.icon;
                const displayValue = bar.value !== null ? bar.value : 0;
                const percentage = bar.inverted 
                    ? Math.max(0, 100 - (displayValue / bar.maxValue) * 100)
                    : Math.min(100, (displayValue / bar.maxValue) * 100);
                
                return (
                    <motion.div
                        key={bar.id}
                        className="space-y-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        data-testid={`progress-bar-${bar.id}`}
                    >
                        {/* Label row */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Icon 
                                    size={18} 
                                    style={{ 
                                        color: bar.color,
                                        filter: bar.isActive ? `drop-shadow(0 0 6px ${bar.color})` : 'none'
                                    }} 
                                />
                                <span 
                                    className="font-rajdhani text-sm uppercase tracking-wider"
                                    style={{ color: bar.isActive ? bar.color : 'rgba(255, 255, 255, 0.7)' }}
                                >
                                    {bar.label}
                                </span>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <motion.span
                                    className="font-orbitron text-xl font-bold"
                                    style={{ 
                                        color: bar.color,
                                        textShadow: bar.isActive ? `0 0 10px ${bar.color}` : 'none'
                                    }}
                                    key={displayValue}
                                    initial={{ opacity: 0.5 }}
                                    animate={{ opacity: 1 }}
                                >
                                    {bar.value !== null ? displayValue.toFixed(1) : '--'}
                                </motion.span>
                                <span className="font-rajdhani text-xs text-white/50">
                                    {bar.unit}
                                </span>
                            </div>
                        </div>
                        
                        {/* Progress bar */}
                        <div 
                            className="h-3 rounded-full overflow-hidden"
                            style={{ 
                                background: 'rgba(255, 255, 255, 0.08)',
                                border: `1px solid ${bar.isActive ? bar.color + '40' : 'rgba(255, 255, 255, 0.1)'}`
                            }}
                        >
                            <motion.div
                                className="h-full rounded-full"
                                style={{ 
                                    background: `linear-gradient(90deg, ${bar.color}90, ${bar.color})`,
                                    boxShadow: bar.isActive ? `0 0 20px ${bar.color}60` : 'none'
                                }}
                                initial={{ width: '0%' }}
                                animate={{ 
                                    width: bar.value !== null ? `${percentage}%` : '0%'
                                }}
                                transition={{ 
                                    duration: bar.isActive ? 0.1 : 0.5,
                                    ease: 'easeOut'
                                }}
                            />
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};
