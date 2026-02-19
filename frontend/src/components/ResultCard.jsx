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
            label: 'Latência',
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
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1,
                borderColor: isActive ? config.color : undefined,
                boxShadow: isActive ? `0 0 40px ${config.color}40, inset 0 0 20px ${config.color}10` : undefined
            }}
            transition={{ 
                duration: 0.5,
                type: "spring",
                stiffness: 100
            }}
            whileHover={{ 
                scale: 1.03,
                boxShadow: `0 0 30px ${config.color}30`
            }}
        >
            {/* Icon and Label */}
            <div className="flex items-center gap-3 mb-4">
                <motion.div
                    className="p-2.5 rounded-xl"
                    style={{
                        background: `${config.color}15`,
                    }}
                    animate={{
                        boxShadow: isActive ? `0 0 20px ${config.color}60` : `0 0 0px ${config.color}00`
                    }}
                    transition={{ duration: 0.3 }}
                >
                    <Icon
                        size={22}
                        style={{
                            color: config.color,
                            filter: `drop-shadow(0 0 6px ${config.color})`
                        }}
                    />
                </motion.div>
                <span
                    className="font-rajdhani text-sm uppercase tracking-wider font-medium"
                    style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                >
                    {config.label}
                </span>
            </div>
            
            {/* Value Display */}
            <div className="flex items-baseline gap-2">
                <motion.span
                    className="font-orbitron text-4xl font-bold"
                    style={{
                        color: config.color,
                        textShadow: value !== null ? `0 0 20px ${config.color}80, 0 0 40px ${config.color}40` : 'none'
                    }}
                    key={value}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {value !== null ? value.toFixed(1) : '--'}
                </motion.span>
                <span
                    className="font-rajdhani text-base uppercase tracking-wide"
                    style={{ color: 'rgba(255, 255, 255, 0.5)' }}
                >
                    {unit}
                </span>
            </div>
            
            {/* Progress bar when active */}
            {isActive && (
                <motion.div
                    className="mt-4 h-1.5 rounded-full overflow-hidden"
                    style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <motion.div
                        className="h-full rounded-full"
                        style={{ 
                            background: `linear-gradient(90deg, ${config.color}80, ${config.color})`,
                            boxShadow: `0 0 10px ${config.color}`
                        }}
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
