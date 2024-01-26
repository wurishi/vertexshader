import './style.css';
import shaders from './lib/shader';
import getConfig from './lib/config';
import { checkCanRenderToFloat, checkCanUseFloat } from './lib/utils';
import HistoryTexture from './lib/HistoryTexture';
import ProgramManager from './lib/ProgramManager';
import createAudioStreamSource from './lib/AudioStreamSource';
import { GUI } from 'dat.gui';
const arts = import.meta.glob('./art/*.ts');
import nameLib from './name';
import ListenerManager from './lib/ListenerManager';
import { getAssetsUrl } from './proxy.js'

const s = getConfig();

const q = {
    showWave: false,
};

const settings = {
    num: 256,
    mode: 'POINTS',
    sound: '',
    lineSize: 'NATIVE',
    mouse: false,
    backgroundColor: [0, 0, 0, 1],
    shader: [
        '// -----[ shader missing! ] -----',
        '',
        '#define NUM 15.0',
        'void main() {',
        '  gl_PointSize = 64.0;',
        '  float col = mod(vertexId, NUM + 1.0);',
        '  float row = mod(floor(vertexId / NUM), NUM + 1.0); ',
        '  float x = col / NUM * 2.0 - 1.0;',
        '  float y = row / NUM * 2.0 - 1.0;',
        '  gl_Position = vec4(x, y, 0, 1);',
        '  v_color = vec4(fract(time + col / NUM + row / NUM), 0, 0, 1);',
        '}',
    ].join('\n'),
};

function getShader(id: string) {
    return (shaders as any)[id];
}

let gl: WebGLRenderingContext;

let resetMouseInfo: any = null;

class VS {
    g: {
        maxCount: number;
        mode?: number;
        time: number;
        mouse: number[];
        shaderSuccess: boolean;
        vsHeader: any;
        fSource: any;
        errorLines: never[];
        origSettings: { shader: string };
        pauseOnBlur: boolean;
        saveable: boolean;
        pause: boolean;
        touches: never[];
        animRects: never[];
        errorLineNumberOffset: number;
        requestId?: number;
        then?: number;
        wasRendered?: boolean;
    };

    uniforms = {
        time: 0,
        vertexCount: 0,
        resolution: [1, 1],
        background: [0, 0, 0, 1],
        mouse: [0, 0],
        sound: undefined,
        floatSound: undefined,
        soundRes: [],
        _dontUseDirectly_pointSize: 1,

        volume: undefined,
        touch: undefined,
    };

    historyUniforms = {
        u_mix: 0,
        u_matrix: twgl.m4.identity(),
        u_texture: undefined,
    };

    static mainRE = /(void[ \t\n\r]+main[ \t\n\r]*\([ \t\n\r]*\)[ \t\n\r]\{)/g;

    constructor() {
        this.g = {
            maxCount: 100000,
            time: 0,
            mouse: [0, 0],
            shaderSuccess: false,
            vsHeader: getShader('vs-header'),
            fSource: getShader('fs'),
            errorLines: [],
            origSettings: { shader: '' },
            pauseOnBlur: window.location.hostname === 'localhost',
            saveable: false,
            pause: false,
            touches: [],
            animRects: [],
            errorLineNumberOffset: 0,
        };
        this.g.errorLineNumberOffset = -this.g.vsHeader.split('\n').length;

        // TODO: 517 fullScreen

        if (gl) {
        } else {
            const canvas = document.createElement('canvas');
            canvas.width = 800;
            canvas.height = 600;
            gl = twgl.getWebGLContext(canvas, {
                alpha: false,
            });
            if (!gl) {
                console.error('nogl');
            }
            s.canUseFloat = checkCanUseFloat(gl);
            s.canFilterFloat =
                s.canUseFloat && !!gl.getExtension('OES_texture_float_linear');
            s.canRenderToFloat = checkCanRenderToFloat(gl);

            console.log(
                'can ' +
                (s.canUseFloat ? '' : 'not ') +
                'use floating point textures'
            );
            console.log(
                'can ' +
                (s.canRenderToFloat ? '' : 'not ') +
                'render to floating point textures'
            );
            if (s.canUseFloat) {
                console.log(
                    'can ' +
                    (s.canFilterFloat ? '' : 'not ') +
                    'filter floating point textures'
                );
            }

            s.sets = {
                default: {
                    num: 10000,
                    mode: 'LINES',
                    sound: '',
                    lineSize: 'NATIVE',
                    backgroundColor: [0, 0, 0, 1],
                    shader: getShader('vs').trim(),
                },
                audio: {
                    num: 5000,
                    mode: 'LINES',
                    sound: 'https://soundcloud.com/caseandpoint/case-point-upgrade-free-download',
                    lineSize: 'NATIVE',
                    backgroundColor: [0, 0, 0, 1],
                    shader: getShader('vs2').trim(),
                },
                audio2: {
                    num: 16384,
                    mode: 'LINES',
                    sound: 'https://soundcloud.com/chibi-tech/lolitazia-season',
                    lineSize: 'NATIVE',
                    backgroundColor: [0, 0, 0, 1],
                    shader: getShader('vs3').trim(),
                },
                spiro: {
                    num: 20000,
                    mode: 'LINES',
                    sound: '',
                    lineSize: 'NATIVE',
                    backgroundColor: [1, 1, 1, 1],
                    shader: getShader('vs4').trim(),
                },
            };

            this.g.mode = gl.LINES;

            s.context = new (window.AudioContext ||
                (window as any).webkitAudioContext)();
            s.analyser = s.context!.createAnalyser();
            s.gainNode = s.context!.createGain();
            s.processor = s.context!.createScriptProcessor(1024, 1, 1);

            s.analyser.connect(s.gainNode);
            s.gainNode.connect(s.context.destination);
            s.analyser.connect(s.processor);
            s.processor.onaudioprocess = saveMaxSample;
            s.processor.connect(s.context.destination);

            function saveMaxSample(e: AudioProcessingEvent) {
                const buf = e.inputBuffer.getChannelData(0);
                const len = buf.length;
                const last = buf[0];
                const max = buf[0];
                let maxDif = 0;
                let sum = 0;
                for (let ii = 1; ii < len; ii++) {
                    let v = buf[ii];
                    if (v > max) {
                        v = max;
                    }
                    const dif = Math.abs(v - last);
                    if (dif > maxDif) {
                        maxDif = dif;
                    }
                    sum += v * v;
                }
                s.maxSample = max;
                s.maxDif = maxDif;
                s.sum = Math.sqrt(sum / len);
            }

            s.rectProgramInfo = twgl.createProgramInfo(gl, [
                getShader('rect-vs'),
                getShader('rect-fs'),
            ]);

            s.historyProgramInfo = twgl.createProgramInfo(gl, [
                getShader('history-vs'),
                getShader('history-fs'),
            ]);

            s.waveProgramInfo = twgl.createProgramInfo(gl, [
                this.applyTemplateToShader(getShader('wave-vs')),
                getShader('fs'),
            ]);

            s.rectUniforms = {
                u_color: [0, 0, 0, 0.7],
                u_matrix: twgl.m4.identity(),
            };

            // TODO: 623 save

            const maxTexutreSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
            s.numSoundSamples = Math.min(
                maxTexutreSize,
                s.analyser.frequencyBinCount
            );
            s.numHistorySamples = 60 * 4; // 4 seconds

            s.volumeHistory = new HistoryTexture(gl, {
                width: 4,
                length: s.numHistorySamples,
                format: gl.ALPHA,
            });

            s.soundHistory = new HistoryTexture(gl, {
                width: s.numSoundSamples,
                length: s.numHistorySamples,
                format: gl.ALPHA,
            });

            if (s.canUseFloat && s.canRenderToFloat) {
                const floatFilter = s.canFilterFloat ? gl.LINEAR : gl.NEAREST;
                s.floatSoundHistory = new HistoryTexture(gl, {
                    width: s.numSoundSamples,
                    length: s.numHistorySamples,
                    min: floatFilter,
                    mag: floatFilter,
                    format: gl.ALPHA,
                    type: gl.FLOAT,
                });
            }

            s.touchColumns = 32;
            // TODO: s.canRenderToFlat ? HistoryTexture : CPUHistoryTexture
            s.touchHistory = new HistoryTexture(gl, {
                width: s.touchColumns,
                length: s.numHistorySamples,
                type: s.canUseFloat ? gl.FLOAT : gl.UNSIGNED_BYTE,
                min: gl.NEAREST,
                mag: gl.NEAREST,
            });

            const count = new Float32Array(this.g.maxCount);
            for (let ii = 0; ii < count.length; ii++) {
                count[ii] = ii;
            }
            const arrays = {
                vertexId: { data: count, numComponents: 1 },
            };
            s.countBufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
            s.quadBufferInfo = twgl.createBufferInfoFromArrays(gl, {
                position: {
                    numComponents: 2,
                    data: [-1, -1, 1, -1, -1, 1, 1, 1],
                },
                texcoord: [0, 0, 1, 0, 0, 1, 1, 1],
                indices: [0, 1, 2, 2, 1, 3],
            });

            // TODO: 688 sc

            s.streamSource = createAudioStreamSource({
                context: s.context,
                autoPlay: true,
                crossOrigin: 'anonymouse',
            });

            s.streamSource.on('error', (err: any) => {
                console.error(err);
            });
            s.streamSource.on(
                'newSource',
                (source: MediaStreamAudioSourceNode) => {
                    source.connect(s.analyser!);
                }
            );
            s.streamSource.on('ended', () => {
                // console.log('end');
                s.streamSource.play();
            });

            s.programManager = new ProgramManager(gl);

            document.body.appendChild(gl.canvas);
            this.queueRender();

            const addTouchPosition = (column: number, x: number, y: number) => {
                x = x * 2 - 1;
                y = y * -2 + 1;

                if (!s.canUseFloat) {
                    x = Math.max(0, (x * 255) | 0);
                    y = Math.max(0, (y * 255) | 0);
                }
                const offset = column * 4;
                s.touchHistory!.buffer[offset + 0] = x;
                s.touchHistory!.buffer[offset + 1] = y;
            };

            const addTouchPressure = (column: number, pressure: number) => {
                if (!s.canUseFloat) {
                    pressure = Math.max(0, (pressure * 255) | 0);
                }
                const offset = column * 4;
                s.touchHistory!.buffer[offset + 2] = pressure;
            };

            const listener = new ListenerManager();
            listener.on(window as any, 'mousemove', (e: MouseEvent) => {
                if (!settings.mouse) {
                    return;
                }
                const rect = gl.canvas.getBoundingClientRect();
                const w = gl.canvas.clientWidth;
                const h = gl.canvas.clientHeight;
                const x = (e.clientX - rect.left) / w;
                const y = (e.clientY - rect.top) / h;

                this.g.mouse[0] = x * 2 - 1;
                this.g.mouse[1] = y * -2 + 1;
                addTouchPosition(0, x, y);
            });
            resetMouseInfo = () => {
                this.g.mouse[0] = 0;
                this.g.mouse[1] = 0;
                addTouchPosition(0, 0, 0);
                addTouchPressure(0, 0);
            };
            listener.on(window as any, 'mousedown', () => {
                if (!settings.mouse) {
                    return;
                }
                addTouchPressure(0, 1);
            });
            listener.on(window as any, 'mouseup', () => {
                if (!settings.mouse) {
                    return;
                }
                addTouchPressure(0, 0);
            });
        }
    }

    public applyTemplateToShader(src: string) {
        let vsrc = this.g.vsHeader + src;
        vsrc = vsrc.replace(VS.mainRE, (m) => m + 'gl_PointSize=1.0;');
        const lastBraceNdx = vsrc.lastIndexOf('}');
        if (lastBraceNdx >= 0) {
            const before = vsrc.substr(0, lastBraceNdx);
            const after = vsrc.substr(lastBraceNdx);
            vsrc =
                before +
                ';gl_PointSize = max(0., gl_PointSize*_dontUseDirectly_pointSize);' +
                after;
        }
        return vsrc;
    }

    public queueRender(force?: boolean) {
        if (
            (!this.g.requestId &&
                (force ||
                    !this.g.wasRendered ||
                    (s.running && !this.g.pause))) ||
            this.g.animRects.length
        ) {
            this.g.requestId = requestAnimationFrame((time) =>
                this.render(time)
            );
        }
    }

    public render(time: number) {
        this.g.requestId = undefined;
        time *= 0.001;
        const now = time;
        const elapsed = now - (this.g.then || 0);
        this.g.then = now;
        this.g.time += elapsed;

        twgl.resizeCanvasToDisplaySize(gl.canvas);

        this.updateSoundAndTouchHistory();

        const volumeHistoryTex = s.volumeHistory!.getTexture();
        const touchHistoryTex = s.touchHistory!.getTexture();
        const historyTex = s.soundHistory!.getTexture();
        const floatHistoryTex = s.floatSoundHistory
            ? s.floatSoundHistory.getTexture()
            : historyTex;
        this.renderScene(
            volumeHistoryTex,
            touchHistoryTex,
            historyTex,
            floatHistoryTex,
            this.g.time,
            settings.lineSize,
            this.g.mouse
        );

        // TODO: 1864 renderHistory

        this.updateSoundTime();

        this.renderAnimRects();

        this.queueRender();
    }

    private updateSoundAndTouchHistory() {
        s.analyser?.getByteFrequencyData(s.soundHistory?.buffer);

        {
            const buf = s.soundHistory?.buffer;
            const len = buf.length;
            let max = 0;
            for (let ii = 0; ii < len; ii++) {
                const v = buf[ii];
                if (v > max) {
                    max = v;
                }
            }
            s.volumeHistory!.buffer[3] = max;
        }
        s.volumeHistory!.buffer[0] = Math.abs(s.maxSample!) * 255;
        s.volumeHistory!.buffer[1] = s.sum! * 255;
        s.volumeHistory!.buffer[2] = s.maxDif! * 127;

        if (s.floatSoundHistory) {
            s.analyser?.getFloatFrequencyData(s.floatSoundHistory!.buffer);
        }

        // update time
        for (let ii = 0; ii < s.touchColumns!; ii++) {
            const offset = ii * 4;
            s.touchHistory!.buffer[offset + 3] = this.g.time;
        }

        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.BLEND);

        twgl.setBuffersAndAttributes(
            gl,
            s.historyProgramInfo!,
            s.quadBufferInfo
        );

        s.volumeHistory?.update();
        s.soundHistory?.update();
        s.floatSoundHistory?.update();
        s.touchHistory?.update();
    }

    public renderScene(
        volumeHistoryTex: WebGLTexture,
        touchHistoryTex: WebGLTexture,
        soundHistoryTex: WebGLTexture,
        floatSoundHistoryTex: WebGLTexture,
        time: number,
        lineSize: string,
        mouse: number[]
    ) {
        twgl.bindFramebufferInfo(gl);

        // const size = lineSize === 'NATIVE' ? 1 : window.devicePixelRatio || 1;
        const size =
            settings.lineSize === 'NATIVE' ? 1 : Number(settings.lineSize);
        gl.lineWidth(size);

        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        gl.clearColor.apply(
            gl,
            q.showWave ? [0, 0, 0, 1] : (settings.backgroundColor as any)
        );
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // TODO: 1719 const programInfo = q.showWave ? s.waveProgramInfo : s.programManager
        const programInfo = s.programManager?.getProgramInfo();
        // console.log(programInfo)
        if (programInfo) {
            this.g.wasRendered = true;

            const num = q.showWave ? 7000 : settings.num;
            const mode = q.showWave ? gl.LINES : this.g.mode;
            this.uniforms.soundRes = [
                s.numSoundSamples,
                s.numHistorySamples,
            ] as any;
            this.uniforms.time = time;
            this.uniforms.vertexCount = num;
            this.uniforms.resolution[0] = gl.canvas.width;
            this.uniforms.resolution[1] = gl.canvas.height;
            this.uniforms.background = settings.backgroundColor;
            this.uniforms.mouse = mouse;
            this.uniforms._dontUseDirectly_pointSize = size;
            this.uniforms.volume = volumeHistoryTex as any;
            this.uniforms.sound = soundHistoryTex as any;
            this.uniforms.floatSound = floatSoundHistoryTex as any;
            this.uniforms.touch = touchHistoryTex as any;

            gl.useProgram(programInfo.program);
            twgl.setBuffersAndAttributes(gl, programInfo, s.countBufferInfo);
            twgl.setUniforms(programInfo, this.uniforms);
            twgl.drawBufferInfo(gl, s.countBufferInfo!, mode, num);
        }
    }

    public updateSoundTime() {
        const pixels = 0;
        // TODO:
    }

    public renderAnimRects() {
        gl.disable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.useProgram(s.rectProgramInfo!.program);
        twgl.setBuffersAndAttributes(gl, s.rectProgramInfo!, s.quadBufferInfo);
        for (let ii = 0; ii < this.g.animRects.length;) {
            if (this.renderAnimRect(this.g.animRects[ii])) {
                this.g.animRects.splice(ii, 1);
            } else {
                ++ii;
            }
        }
    }

    public renderAnimRect(animRect: any) {
        let l = (this.g.time - animRect.startTime) / animRect.duration;
        if (l > 1) {
            return true;
        }
    }

    public tryNewProgram(text: string) {
        const vsrc = this.applyTemplateToShader(text);
        this.setShaderSuccessStatus(false);
        s.programManager?.compile(vsrc, this.g.fSource, text);
    }

    public setShaderSuccessStatus(success: boolean) {
        // TODO: 1184
        this.g.shaderSuccess = success;
    }
}

let vs: VS;

function init() {
    if (!vs) {
        vs = new VS();

        const gui = new GUI();
        const f = gui.addFolder('settings');
        f.open();
        const modeUI = f.add(vs.g, 'mode', {
            POINTS: gl.POINTS,
            LINES: gl.LINES,
            LINE_LOOP: gl.LINE_LOOP,
            LINE_STRIP: gl.LINE_STRIP,
            TRIANGLES: gl.TRIANGLES,
            TRIANGLE_FAN: gl.TRIANGLE_FAN,
            TRIANGLE_STRIP: gl.TRIANGLE_STRIP,
        });
        const numUI = f.add(settings, 'num', 256, 100000);
        const lineSize = f.add(settings, 'lineSize', ['NATIVE', 2, 5, 10]);
        let playFlag = false;
        const page = window.localStorage.getItem('PAGE') || '0';
        const ui: any = {
            play: false,
            art: '',
            url: 'audio1.mp3',
            bg: 0x000000,
            alpha: 1,
            page: +page,
        };
        f.add(ui, 'play')
            .name('Music')
            .onChange((v) => {
                if (!playFlag) {
                    playFlag = true;
                    s.streamSource.init();
                    s.streamSource.setSource(getAssetsUrl('/audio1.mp3'));
                } else {
                    if (v) {
                        s.streamSource.play();
                    } else {
                        s.streamSource.stop();
                    }
                }
            });
        f.add(ui, 'url', ['audio1.mp3', '128.mp3', 'mic'])
            .name('Audio')
            .onChange((v) => {
                if (!playFlag) {
                    playFlag = true;
                    s.streamSource.init();
                }
                if (v === 'mic') {
                    s.streamSource.setSource(v);
                } else {
                    s.streamSource.setSource(getAssetsUrl(v));
                }
            });
        f.add(settings, 'mouse')
            .name('Mouse')
            .onChange((v) => {
                if (!v) {
                    resetMouseInfo && resetMouseInfo();
                }
            });

        const bgUI = f
            .addColor(ui, 'bg')
            .name('Background')
            .onChange((v) => {
                let hex = v.toString(16);
                const rgb: number[] = [0, 0, 0, 1];
                if (hex.length < 6) {
                    const tmp = 6 - hex.length;
                    for (let i = 0; i < tmp; i++) {
                        hex = '0' + hex;
                    }
                }
                rgb[0] = Number('0x' + hex[0] + hex[1]) / 255;
                rgb[1] = Number('0x' + hex[2] + hex[3]) / 255;
                rgb[2] = Number('0x' + hex[4] + hex[5]) / 255;
                settings.backgroundColor = rgb;
            });
        // f.add(ui, 'alpha', 0, 1);

        const waitSortList: any[] = [];
        const artList: any = {};
        let count = 0;
        Object.keys(arts).forEach((key) => {
            const arr = key.split('/');
            let name = arr[arr.length - 1].split('.')[0];
            let sort = -1;
            if ((nameLib as any)[name]) {
                name = (nameLib as any)[name];
                sort = Number(name.split('.')[0]);
            } else {
                name = '🐯' + name;
            }
            // artList[name] = key;
            count++;

            waitSortList.push([name, key, sort]);
        });
        waitSortList.sort((a, b) => {
            const [, , sortA] = a;
            const [, , sortB] = b;
            return sortA - sortB;
        });
        waitSortList.forEach(([name, mk]) => {
            artList[name] = mk;
        });
        f.name = 'Count: ' + count;
        const artChange = (v: string) => {
            let tmp = '';
            Object.keys(artList).find((key) => {
                if (artList[key] === v) {
                    tmp = key;
                    return true;
                }
            });
            arts[v]().then((module) => {
                const {
                    name = '',
                    mode = WebGLRenderingContext.POINTS,
                    num = 10000,
                    text,
                    bg = 0x000000,
                } = module.default;
                if (text) {
                    numUI.setValue(num);
                    modeUI.setValue(mode);
                    bgUI.setValue(bg);
                    vs.tryNewProgram(text);
                    const app = document.getElementById('app');
                    app &&
                        (app.innerHTML = `${name}
                    <hr />
                    ${v}`);
                }

                if (tmp) {
                    const t = tmp.indexOf('🐯') === 0 ? tmp.substr(2) : tmp;
                    copyToClipboard(
                        `'${t}': ` + '`' + count + '. ' + name + '`,'
                    );
                } else {
                    copyToClipboard('');
                }
            });
        };
        let artUI = f.add(ui, 'art', artList).onChange(artChange);
        const pageList: any = {};
        for (let i = 0; i < Math.ceil(count / 100); i++) {
            const name = i * 100 + 1 + '-' + (i + 1) * 100;
            pageList[name] = i + 1;
        }
        f.add(ui, 'page', pageList)
            .onChange((v) => {
                if (v <= 0) {
                    return;
                }
                window.localStorage.setItem('PAGE', v);
                const options: any = {};
                const page = +v * 100;
                const m = page - 100;
                Object.keys(artList).forEach((key) => {
                    const arr = key.split('.');
                    const num = +arr[0];
                    if (isNaN(num)) {
                        options[key] = artList[key];
                    } else if (num > m && num <= page) {
                        options[key] = artList[key];
                    }
                });
                artUI.remove();
                artUI = f.add(ui, 'art', options).onChange(artChange);
            })
            .setValue(ui.page);

        vs.tryNewProgram(`
        #define NUM_SEGMENTS 128.0
        #define NUM_POINTS (NUM_SEGMENTS * 2.0)
        
        vec3 hsv2rgb(vec3 c) {
          c = vec3(c.x, clamp(c.yz, 0.0, 1.0));
          vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
          vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
          return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
        }
        
        void main() {
          float numLinesDown = floor(vertexCount / NUM_POINTS);
          // produces 0,1, 1,2, 2,3, ...
          float point = floor(mod(vertexId, NUM_POINTS) / 2.0) + mod(vertexId, 2.0);
          // line count
          float count = floor(vertexId / NUM_POINTS);
        
          float u = point / NUM_SEGMENTS;  // 0 <-> 1 across line
          float v = count / numLinesDown;  // 0 <-> 1 by line
          float invV = 1.0 - v;
        
          // Only use the left most 1/4th of the sound texture
          // because there's no action on the right
          float historyX = u * 0.25;
          // Match each line to a specific row in the sound texture
          float historyV = (v * numLinesDown + 0.5) / soundRes.y;
          float snd = texture2D(sound, vec2(historyX, historyV)).a;
        
          float x = u * 2.0 - 1.0;
          float y = v * 2.0 - 1.0;
          vec2 xy = vec2(
              x * mix(0.5, 1.0, invV),
              y + pow(snd, 5.0) * 1.0) / (v + 0.5);
          gl_Position = vec4(xy * 0.5, 0, 1);
        
          float hue = u;
          float sat = invV;
          float val = invV;
          v_color = mix(vec4(hsv2rgb(vec3(hue, sat, val)), 1), background, v * v);
        }`);
    }
}

function copyToClipboard(s: string) {
    if ('clipboardData' in window) {
        (window as any).clipboardData.setData('text', s);
    } else {
        document.oncopy = (e) => {
            e.clipboardData?.setData('text', s);
            e.preventDefault();
            document.oncopy = null;
        };
        document.execCommand('Copy');
    }
}

(function () {
    init();
})();
