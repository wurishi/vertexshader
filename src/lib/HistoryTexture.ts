import getConfig from './config';

const s = getConfig();

export default class HistoryTexture {
    private _gl: WebGLRenderingContext;
    private _tex: WebGLTexture;
    private _width: number;
    private _srcFBI: twgl.FramebufferInfo;
    private _dstFBI: twgl.FramebufferInfo;
    private _texSpec: twgl.TextureOptions;
    private _length: number;
    private _historyUniforms: {
        u_mix: number;
        u_mult: number;
        u_matrix: Float32Array;
        u_texture?: any;
    };
    private _format: number;
    buffer: any;

    constructor(
        gl: WebGLRenderingContext,
        options: {
            width: number;
            type?: number;
            format?: number;
            min?: number;
            mag?: number;
            length: number;
            historyFormat?: number;
        }
    ) {
        this._gl = gl;
        this._width = options.width;
        const type = options.type || gl.UNSIGNED_BYTE;
        this._format = options.format || gl.RGBA;
        const Ctor = twgl.getTypedArrayTypeForGLType(type);
        const numComponents = twgl.getNumComponentsForFormat(this._format);
        const size = this._width * numComponents;
        const _buffer = new Ctor(size);
        this._texSpec = {
            src: _buffer,
            height: 1,
            min: options.min || gl.LINEAR,
            mag: options.mag || gl.LINEAR,
            wrap: gl.CLAMP_TO_EDGE,
            format: this._format,
            auto: false, // don't set tex params or call genmipmap
        };
        this._tex = twgl.createTexture(gl, this._texSpec);

        this._length = options.length;
        const _historyAttachments = [
            {
                format: options.historyFormat || gl.RGBA,
                type,
                mag: options.mag || gl.LINEAR,
                min: options.min || gl.LINEAR,
                wrap: gl.CLAMP_TO_EDGE,
            },
        ];

        this._srcFBI = twgl.createFramebufferInfo(
            gl,
            _historyAttachments,
            this._width,
            this._length
        );
        this._dstFBI = twgl.createFramebufferInfo(
            gl,
            _historyAttachments,
            this._width,
            this._length
        );

        this._historyUniforms = {
            u_mix: 0,
            u_mult: 1,
            u_matrix: twgl.m4.identity(),
        };

        this.buffer = _buffer;
    }

    public update() {
        const temp = this._srcFBI;
        this._srcFBI = this._dstFBI;
        this._dstFBI = temp;

        twgl.setTextureFromArray(
            this._gl,
            this._tex,
            this._texSpec.src as any,
            this._texSpec
        );

        this._gl.useProgram(s.historyProgramInfo!.program);
        twgl.bindFramebufferInfo(this._gl, this._dstFBI);

        twgl.m4.translation(
            [0, 2 / this._length, 0],
            this._historyUniforms.u_matrix
        );
        this._historyUniforms.u_mix = 1;
        this._historyUniforms.u_texture = this._srcFBI.attachments[0];

        twgl.setUniforms(s.historyProgramInfo, this._historyUniforms);
        twgl.drawBufferInfo(this._gl, s.quadBufferInfo!);

        this._historyUniforms.u_mix = this._format === this._gl.ALPHA ? 0 : 1;
        this._historyUniforms.u_texture = this._tex;
        twgl.m4.translation(
            [0, -(this._length - 0.5) / this._length, 0],
            this._historyUniforms.u_matrix
        );
        twgl.m4.scale(
            this._historyUniforms.u_matrix,
            [1, 1 / this._length, 1],
            this._historyUniforms.u_matrix
        );
        twgl.setUniforms(s.historyProgramInfo, this._historyUniforms);
        twgl.drawBufferInfo(this._gl, s.quadBufferInfo!);
    }

    public getTexture(): WebGLTexture {
        return this._dstFBI.attachments[0] as any;
    }
}
