declare module twgl {
    class ProgramInfo {
        program: WebGLProgram;
        uniformSetters: any;
        attribSetters: any;
    }

    class FramebufferInfo {
        width: number;
        height: number;
        framebuffer: WebGLFramebuffer;
        attachments: AttachmentOptions[];
    }

    class TextureOptions {
        target?: number;
        width?: number;
        height?: number;
        internalFormat?: number;
        type?: number;
        src?:
            | Function
            | string
            | string[]
            | HTMLElement
            | ArrayBufferView
            | number[];
        min?: number;
        mag?: number;
        wrap?: number;
        format?: number;
        auto?: boolean;
    }

    class AttachmentOptions {
        format: number;
        type?: number;
        min?: number;
        wrap?: number;
    }

    class BufferInfo {
        indices?: WebGLBuffer;
        numElements: number;
        elementType?: number;
    }

    function createProgramInfoFromProgram(
        gl: WebGLRenderingContext,
        program: WebGLProgram
    ): ProgramInfo;

    function getTypedArrayTypeForGLType(type: number): any;
    function getNumComponentsForFormat(format: number): number;
    function createTexture(
        gl: WebGLRenderingContext,
        options: TextureOptions,
        callback?: () => {}
    ): WebGLTexture;
    function createFramebufferInfo(
        gl: WebGLRenderingContext,
        attachments: AttachmentOptions[],
        width: number,
        height: number
    ): FramebufferInfo;
    function setTextureFromArray(
        gl: WebGLRenderingContext,
        tex: WebGLTexture,
        src: number[] | ArrayBufferView,
        options: any
    ): void;
    function bindFramebufferInfo(
        gl: WebGLRenderingContext,
        framebufferInfo?: FramebufferInfo,
        target?: number
    ): void;
    function setUniforms(setters: ProgramInfo | any, ...values: any): void;
    function drawBufferInfo(
        gl: WebGLRenderingContext,
        bufferInfo: BufferInfo,
        type?: number,
        count?: number,
        offset?: number,
        instanceCount?: number
    ): void;
    function getWebGLContext(
        canvas: HTMLCanvasElement,
        opt_attribs: WebGLContextAttributes
    ): WebGLRenderingContext;
    function createProgramInfo(
        gl: WebGLRenderingContext,
        shaderSources: string[],
        opt_attribs?: string[],
        opt_locations?: number[],
        opt_errorCallback?: any
    ): ProgramInfo;
    function createBufferInfoFromArrays(
        gl: WebGLRenderingContext,
        arrays: any
    ): BufferInfo;
    function resizeCanvasToDisplaySize(
        canvas: HTMLCanvasElement,
        multiplier?: number
    ): boolean;
    function setBuffersAndAttributes(
        gl: WebGLRenderingContext,
        programInfo: ProgramInfo,
        buffers: any
    ): void;

    module m4 {
        function identity(): Float32Array;
        function translation(v: number[], dst: Float32Array): void;
        function scale(m: Float32Array, v: number[], dst: Float32Array): void;
    }
}
