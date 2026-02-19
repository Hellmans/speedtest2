import { RefreshCw, Activity } from 'lucide-react';
import "@/App.css";
import { ResultCard } from './components/ResultCard';
import { useSpeedTest } from './hooks/useSpeedTest';

const SpeedTestApp = () => {
    const { phase, currentSpeed, results, isRunning, startTest, resetTest } = useSpeedTest();
    
    const phaseLabels = {
        ping: 'Medindo Ping...',
        jitter: 'Medindo Jitter...',
        download: 'Testando Download...',
        upload: 'Testando Upload...',
        complete: 'Teste Completo',
        idle: 'Pronto'
    };
    
    const phaseColors = {
        download: '#00F3FF',
        upload: '#BC13FE',
        ping: '#00FF94',
        jitter: '#FFC800'
    };

    return (
        <div className="min-h-screen bg-[#030305] text-white" data-testid="speed-test-app">
            {/* Header */}
            <header className="py-6 px-6">
                <div className="flex items-center justify-center gap-3">
                    <div className="p-2 rounded-lg bg-[#00F3FF]/10 border border-[#00F3FF]/30">
                        <Activity size={24} className="text-[#00F3FF]" />
                    </div>
                    <div>
                        <h1 className="font-orbitron text-xl font-bold">
                            TESTE DE <span className="text-[#00F3FF]">VELOCIDADE</span>
                        </h1>
                        <p className="font-rajdhani text-xs text-white/50 uppercase tracking-widest">
                            Medidor de Conexão
                        </p>
                    </div>
                </div>
            </header>
            
            {/* Main */}
            <main className="flex flex-col items-center px-6 py-8">
                <div className="w-full max-w-3xl">
                    {/* Phase indicator */}
                    <div className="flex justify-center mb-6">
                        <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10">
                            <span className="font-rajdhani text-sm text-white/70">
                                {isRunning && <span className="inline-block w-2 h-2 rounded-full bg-[#00F3FF] mr-2 animate-pulse" />}
                                {phaseLabels[phase]}
                            </span>
                        </div>
                    </div>
                    
                    {/* Speed display */}
                    {phase !== 'idle' && phase !== 'complete' && (
                        <div className="text-center mb-8">
                            <span 
                                className="font-orbitron text-7xl font-bold"
                                style={{ 
                                    color: phaseColors[phase] || '#00F3FF',
                                    textShadow: `0 0 40px ${phaseColors[phase] || '#00F3FF'}60`
                                }}
                            >
                                {currentSpeed.toFixed(1)}
                            </span>
                            <span className="font-rajdhani text-2xl text-white/50 ml-2">
                                {phase === 'ping' || phase === 'jitter' ? 'ms' : 'Mbps'}
                            </span>
                        </div>
                    )}
                    
                    {/* Button */}
                    <div className="flex justify-center mb-10">
                        {phase === 'complete' ? (
                            <button
                                onClick={resetTest}
                                className="flex items-center gap-3 px-8 py-3 font-orbitron font-bold text-[#00F3FF] border-2 border-[#00F3FF] rounded-full hover:bg-[#00F3FF] hover:text-black transition-colors"
                                data-testid="reset-button"
                            >
                                <RefreshCw size={20} />
                                TESTAR NOVAMENTE
                            </button>
                        ) : (
                            <button
                                onClick={startTest}
                                disabled={isRunning}
                                className="px-10 py-4 font-orbitron font-bold text-lg text-[#00F3FF] border-2 border-[#00F3FF] rounded-full hover:bg-[#00F3FF] hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                data-testid="start-button"
                            >
                                {isRunning ? 'TESTANDO...' : 'INICIAR TESTE'}
                            </button>
                        )}
                    </div>
                    
                    {/* Results */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" data-testid="results-grid">
                        <ResultCard type="ping" value={results.ping} unit="ms" isActive={phase === 'ping'} />
                        <ResultCard type="jitter" value={results.jitter} unit="ms" isActive={phase === 'jitter'} />
                        <ResultCard type="download" value={results.download} unit="Mbps" isActive={phase === 'download'} />
                        <ResultCard type="upload" value={results.upload} unit="Mbps" isActive={phase === 'upload'} />
                    </div>
                </div>
            </main>
            
            {/* Footer */}
            <footer className="py-6 text-center">
                <p className="font-rajdhani text-sm text-white/30">Compatível com XAMPP/NGINX</p>
            </footer>
        </div>
    );
};

export default function App() {
    return <SpeedTestApp />;
}
