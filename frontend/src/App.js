import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Activity } from 'lucide-react';
import "@/App.css";
import { ResultCard } from './components/ResultCard';
import { useSpeedTest } from './hooks/useSpeedTest';

const SpeedTestApp = () => {
    const {
        phase,
        currentSpeed,
        results,
        isRunning,
        startTest,
        resetTest
    } = useSpeedTest();
    
    const getPhaseLabel = () => {
        switch (phase) {
            case 'ping': return 'Medindo Ping...';
            case 'jitter': return 'Medindo Jitter...';
            case 'download': return 'Testando Download...';
            case 'upload': return 'Testando Upload...';
            case 'complete': return 'Teste Completo';
            default: return 'Pronto';
        }
    };

    return (
        <div className="speed-test-app min-h-screen" data-testid="speed-test-app">
            {/* Main content */}
            <div className="relative z-10 min-h-screen flex flex-col">
                {/* Header */}
                <motion.header
                    className="py-6 px-6 lg:px-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center justify-center max-w-7xl mx-auto">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg glass neon-box">
                                <Activity 
                                    size={24} 
                                    className="text-[#00F3FF]"
                                    style={{ filter: 'drop-shadow(0 0 8px rgba(0, 243, 255, 0.8))' }}
                                />
                            </div>
                            <div>
                                <h1 className="font-orbitron text-xl lg:text-2xl font-bold text-white">
                                    TESTE DE <span className="text-[#00F3FF] neon-text">VELOCIDADE</span>
                                </h1>
                                <p className="font-rajdhani text-xs text-white/50 uppercase tracking-widest">
                                    Medidor de Conexão
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.header>
                
                {/* Main section */}
                <main className="flex-1 flex flex-col items-center justify-center px-6 py-8 lg:py-12">
                    <div className="w-full max-w-4xl">
                        {/* Progress Bars section */}
                        <motion.div
                            className="flex flex-col items-center mb-12"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            {/* Phase indicator */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={phase}
                                    className="phase-indicator mb-8"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    data-testid="phase-indicator"
                                >
                                    {isRunning && <div className="phase-dot" />}
                                    <span className="text-white/80">{getPhaseLabel()}</span>
                                </motion.div>
                            </AnimatePresence>
                            
                            {/* Current Speed Display */}
                            {phase !== 'idle' && phase !== 'complete' && (
                                <motion.div 
                                    className="text-center mb-4"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <motion.span 
                                        className="font-orbitron text-6xl lg:text-7xl font-bold"
                                        style={{ 
                                            color: phase === 'download' ? '#00F3FF' : 
                                                   phase === 'upload' ? '#BC13FE' : 
                                                   phase === 'ping' ? '#00FF94' : '#FFC800',
                                            textShadow: `0 0 30px currentColor`
                                        }}
                                        key={currentSpeed}
                                        initial={{ opacity: 0.5 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        {currentSpeed.toFixed(1)}
                                    </motion.span>
                                    <span className="font-rajdhani text-xl text-white/60 ml-2">
                                        {phase === 'ping' || phase === 'jitter' ? 'ms' : 'Mbps'}
                                    </span>
                                </motion.div>
                            )}
                            
                            {/* Start/Reset button */}
                            <motion.div
                                className="mt-10"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                            >
                                {phase === 'complete' ? (
                                    <button
                                        className="start-button glitch-hover flex items-center gap-3"
                                        onClick={resetTest}
                                        data-testid="reset-button"
                                    >
                                        <RefreshCw size={20} />
                                        <span>TESTAR NOVAMENTE</span>
                                    </button>
                                ) : (
                                    <button
                                        className={`start-button glitch-hover ${isRunning ? 'pulse-neon' : ''}`}
                                        onClick={startTest}
                                        disabled={isRunning}
                                        data-testid="start-button"
                                    >
                                        {isRunning ? 'TESTANDO...' : 'INICIAR TESTE'}
                                    </button>
                                )}
                            </motion.div>
                        </motion.div>
                        
                        {/* Results grid */}
                        <motion.div
                            className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            data-testid="results-grid"
                        >
                            <ResultCard
                                type="ping"
                                value={results.ping}
                                unit="ms"
                                isActive={phase === 'ping'}
                            />
                            <ResultCard
                                type="jitter"
                                value={results.jitter}
                                unit="ms"
                                isActive={phase === 'jitter'}
                            />
                            <ResultCard
                                type="download"
                                value={results.download}
                                unit="Mbps"
                                isActive={phase === 'download'}
                            />
                            <ResultCard
                                type="upload"
                                value={results.upload}
                                unit="Mbps"
                                isActive={phase === 'upload'}
                            />
                        </motion.div>
                    </div>
                </main>
                
                {/* Footer */}
                <motion.footer
                    className="py-6 px-6 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    <p className="font-rajdhani text-sm text-white/30">
                        Compatível com XAMPP/NGINX
                    </p>
                </motion.footer>
            </div>
        </div>
    );
};

function App() {
    return <SpeedTestApp />;
}

export default App;
