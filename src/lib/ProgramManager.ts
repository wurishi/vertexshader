interface iQueueItem {
    vsrc: string;
    fsrc: string;
    userData: any;
}

export default class ProgramManager {
    private _handlers: any = {};
    private _gl: WebGLRenderingContext;
    private _programInfo?: twgl.ProgramInfo;
    private _processing = false;
    private _vs?: WebGLShader;
    private _fs?: WebGLShader;
    private _prg?: WebGLProgram;
    private _src?: iQueueItem;
    private _queue: iQueueItem[] = [];
    private _timeout = 500;

    constructor(gl: WebGLRenderingContext) {
        this._gl = gl;
    }

    private emit(event: string, ...arg: any[]) {
        const handler = this._handlers[event];
        if (handler) {
            handler(...arg);
        }
    }

    private compileShader(type: number, src: string) {
        const shader = this._gl.createShader(type);
        this._gl.shaderSource(shader!, src);
        this._gl.compileShader(shader!);
        return shader!;
    }

    private linkProgram(vs: WebGLShader, fs: WebGLShader) {
        const prg = this._gl.createProgram();
        this._gl.attachShader(prg!, vs);
        this._gl.attachShader(prg!, fs);
        this._gl.linkProgram(prg!);
        return prg!;
    }

    private getShaderResults(shader: WebGLShader) {
        const success = this._gl.getShaderParameter(
            shader,
            this._gl.COMPILE_STATUS
        );
        if (!success) {
            const errors = this._gl.getShaderInfoLog(shader);
            console.error(errors);
            return errors;
        }
    }

    private getProgramResults(prg: WebGLProgram) {
        const success = this._gl.getProgramParameter(prg, this._gl.LINK_STATUS);
        if (!success) {
            const errors = this._gl.getProgramInfoLog(prg);
            console.error(errors);
            return errors;
        }
    }

    private checkResults() {
        this._processing = false;

        const vsErrors = this.getShaderResults(this._vs!);
        const fsErrors = this.getShaderResults(this._fs!);
        const prgErrors = this.getProgramResults(this._prg!);

        this._gl.deleteShader(this._fs!);
        this._gl.deleteShader(this._vs!);

        if (
            vsErrors === undefined &&
            fsErrors === undefined &&
            prgErrors === undefined
        ) {
            this.emit('success', this._src);
            if (this._programInfo) {
                this._gl.deleteProgram(this._programInfo.program);
            }
            this._programInfo = twgl.createProgramInfoFromProgram(
                this._gl,
                this._prg!
            );
        } else {
            this.emit(
                'failure',
                [vsErrors || '', fsErrors || '', prgErrors || ''].join('\n')
            );
            this._gl.deleteProgram(this._prg!);
        }
        this.processQueue();
    }

    private processQueue() {
        if (this._processing || !this._queue.length) {
            return;
        }
        this._processing = true;
        this._src = this._queue.shift();
        this._vs = this.compileShader(this._gl.VERTEX_SHADER, this._src!.vsrc);
        this._fs = this.compileShader(
            this._gl.FRAGMENT_SHADER,
            this._src!.fsrc
        );
        this._prg = this.linkProgram(this._vs!, this._fs!);
        this._gl.flush();

        setTimeout(() => {
            this.checkResults();
        }, this._timeout);
    }

    public on(event: string, handler: any) {
        this._handlers[event] = handler;
    }

    public compile(vsrc: string, fsrc: string, userData: any) {
        this._queue = [{ vsrc, fsrc, userData }];
        this.processQueue();
    }

    public getProgramInfo() {
        return this._programInfo;
    }

    public clear() {
        this._programInfo = undefined;
    }

    public isProcessing() {
        return this._processing;
    }
}
