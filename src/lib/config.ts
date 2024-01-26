import HistoryTexture from './HistoryTexture';
import ProgramManager from './ProgramManager';

interface iSet {
    num: number;
    mode: string;
    sound: string;
    lineSize: string;
    backgroundColor: number[];
    shader: string;
}

interface iConfig {
    screenshotCanvas: HTMLCanvasElement;
    restoreKey: string;
    show: boolean;
    inIframe: boolean;
    running: boolean;
    trackNdx: number;
    currentTrackNdx: number;
    playlist: string[];
    lockMusic: boolean;
    interruptMusic: boolean;
    audioStarted: boolean;

    historyProgramInfo?: twgl.ProgramInfo;
    rectProgramInfo?: twgl.ProgramInfo;
    waveProgramInfo?: twgl.ProgramInfo;

    quadBufferInfo?: twgl.BufferInfo;

    canUseFloat?: boolean;
    canFilterFloat?: boolean;
    canRenderToFloat?: boolean;

    sets?: { [key: string]: iSet };
    context?: AudioContext;
    analyser?: AnalyserNode;
    gainNode?: GainNode;
    processor?: ScriptProcessorNode;

    maxSample?: number;
    maxDif?: number;
    sum?: number;

    rectUniforms?: {
        u_color: number[];
        u_matrix: Float32Array;
    };

    numSoundSamples?: number;
    numHistorySamples?: number;

    volumeHistory?: HistoryTexture;
    soundHistory?: HistoryTexture;
    floatSoundHistory?: HistoryTexture;

    touchColumns?: number;
    touchHistory?: HistoryTexture;

    countBufferInfo?: twgl.BufferInfo;

    programManager?: ProgramManager;

    streamSource?: any;
}

let isMobile = false; //window.navigator.userAgent.match(/Android|iPhone|iPad|iPod|Windows Phone/i)
const s: iConfig = {
    screenshotCanvas: document.createElement('canvas'),
    restoreKey: 'restore',
    show: !isMobile,
    inIframe: window.self !== window.top,
    running: true,
    trackNdx: 0,
    currentTrackNdx: 0,
    playlist: [],
    lockMusic: false,
    interruptMusic: true,
    audioStarted: false,
};
s.screenshotCanvas.width = 600;
s.screenshotCanvas.height = 336;

export default function getConfig() {
    return s;
}
