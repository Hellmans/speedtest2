import { motion } from 'framer-motion';
import { Download, Upload, Gauge, Activity } from 'lucide-react';

export const ResultCard = ({ type, value, unit, isActive = false }) => {
    const configs = {
        download: {
            icon: Download,
            label: 'Download',
            color: '#00F3FF',
            borderClass: 'download'
        },
        upload: {
            icon: Upload,
            label: 'Upload',
            color: '#BC13FE',
            borderClass: 'upload'
        },
        ping: {
            icon: Gauge,
            label: 'Ping',
            color: '#00FF94',
            borderClass: 'ping'
        },
        jitter: {
            icon: Activity,
            label: 'Jitter',
            color: '#FFC800',
            borderClass: 'jitter'
        }
    };
    
    const config = configs[type];
    const Icon = config.icon;
    
    return (
        <motion.div
            className={`result-card ${config.borderClass}`}
            data-testid={`result-card-${type}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
                borderColor: isActive ? config.color : undefined,
                boxShadow: isActive ? `0 0 30px ${config.color}30` : undefined
            }}
        >
            <div className="flex items-center gap-3 mb-3">
                <div
                    className="p-2 rounded-lg"
                    style={{
                        background: `${config.color}15`,
                        filter: isActive ? `drop-shadow(0 0 8px ${config.color})` : 'none'
                    }}
                >
                    <Icon
                        size={20}
                        style={{
                            color: config.color,
                            filter: `drop-shadow(0 0 4px ${config.color})`
                        }}
                    />
                </div>
                <span
                    className="font-rajdhani text-sm uppercase tracking-wider"
                    style={{ color: 'rgba(255, 255, 255, 0.6)' }}
                >
                    {config.label}
                </span>
            </div>
            
            <div className="flex items-baseline gap-2">
                <motion.span
                    className="font-orbitron text-3xl font-bold"
                    style={{
                        color: config.color,
                        textShadow: `0 0 10px ${config.color}70, 0 0 20px ${config.color}40`
                    }}
                    key={value}
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                >
                    {value !== null ? value.toFixed(1) : '--'}
                </motion.span>
                <span
                    className="font-rajdhani text-sm uppercase"
                    style={{ color: 'rgba(255, 255, 255, 0.5)' }}
                >
                    {unit}
                </span>
            </div>
            
            {isActive && (
                <motion.div
                    className="mt-3 h-1 rounded-full overflow-hidden"
                    style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                >
                    <motion.div
                        className="h-full rounded-full"
                        style={{ background: config.color }}
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{
                            duration: type === 'ping' || type === 'jitter' ? 2 : 8,
                            ease: 'linear'
                        }}
                    />
                </motion.div>
            )}
        </motion.div>
    );
};
