import { Download, Upload, Gauge, Activity } from 'lucide-react';

export const ResultCard = ({ type, value, unit, isActive = false }) => {
    const configs = {
        download: { icon: Download, label: 'Download', color: '#00F3FF' },
        upload: { icon: Upload, label: 'Upload', color: '#BC13FE' },
        ping: { icon: Gauge, label: 'Latência', color: '#00FF94' },
        jitter: { icon: Activity, label: 'Jitter', color: '#FFC800' }
    };
    
    const config = configs[type];
    const Icon = config.icon;
    
    return (
        <div
            className="p-5 rounded-xl"
            data-testid={`result-card-${type}`}
            style={{
                background: 'rgba(10, 10, 15, 0.7)',
                border: `1px solid ${isActive ? config.color : 'rgba(255,255,255,0.1)'}`,
                boxShadow: isActive ? `0 0 30px ${config.color}40` : 'none',
                transition: 'border-color 0.3s, box-shadow 0.3s'
            }}
        >
            <div className="flex items-center gap-3 mb-3">
                <div
                    className="p-2 rounded-lg"
                    style={{ background: `${config.color}20` }}
                >
                    <Icon size={20} style={{ color: config.color }} />
                </div>
                <span className="font-rajdhani text-sm uppercase tracking-wider text-white/60">
                    {config.label}
                </span>
            </div>
            
            <div className="flex items-baseline gap-2">
                <span
                    className="font-orbitron text-4xl font-bold"
                    style={{
                        color: config.color,
                        textShadow: value !== null ? `0 0 20px ${config.color}80` : 'none'
                    }}
                >
                    {value !== null ? value.toFixed(1) : '--'}
                </span>
                <span className="font-rajdhani text-sm text-white/50 uppercase">
                    {unit}
                </span>
            </div>
            
            {isActive && (
                <div className="mt-3 h-1 rounded-full overflow-hidden bg-white/10">
                    <div
                        className="h-full rounded-full animate-progress"
                        style={{ background: config.color }}
                    />
                </div>
            )}
        </div>
    );
};
