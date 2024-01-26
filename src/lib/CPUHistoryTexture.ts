export default class CPUHistoryTexture {
    private _width: number;
    private _gl: WebGLRenderingContext;
    private _texSpec: {
        src: any;
        height: number;
        min: number;
        mag: number;
        wrap: number;
        format: number;
        auto: boolean;
    };
    private _tex: WebGLTexture;
    private _buffer: any;
    private _rowSize: number;
    private _size: number;
    buffer: any;

    constructor(
        gl: WebGLRenderingContext,
        options: {
            width: number;
            type?: number;
            format?: number;
            length: number;
            min?: number;
            mag?: number;
        }
    ) {
        this._gl = gl;
        this._width = options.width;
        const type = options.type || gl.UNSIGNED_BYTE;
        const format = options.format || gl.RGBA;
        const Ctor = twgl.getTypedArrayTypeForGLType(type);
        const numComponents = twgl.getNumComponentsForFormat(format);
        const _length = options.length;
        this._rowSize = this._width * numComponents;
        this._size = this._rowSize * _length;
        this._buffer = new Ctor(this._size);
        this._texSpec = {
            src: this._buffer,
            height: _length,
            min: options.min || gl.LINEAR,
            mag: options.mag || gl.LINEAR,
            wrap: gl.CLAMP_TO_EDGE,
            format: format,
            auto: false,
        };
        this._tex = twgl.createTexture(gl, this._texSpec);
        this.buffer = this._buffer;
    }

    public update() {
        twgl.setTextureFromArray(
            this._gl,
            this._tex,
            this._texSpec.src,
            this._texSpec
        );

        this._buffer.copyWithin(this._rowSize, 0, this._size - this._rowSize);
    }

    public getTexture() {
        return this._tex;
    }
}
