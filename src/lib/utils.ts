export function checkCanUseFloat(gl: WebGLRenderingContext) {
    return gl.getExtension('OES_texture_float') ? true : false;
}

export function checkCanRenderToFloat(gl: WebGLRenderingContext) {
    const testAttachments = [
        {
            format: gl.RGBA,
            type: gl.FLOAT,
            mag: gl.NEAREST,
            min: gl.NEAREST,
            wrap: gl.CLAMP_TO_EDGE,
        },
    ];
    const testFBI = twgl.createFramebufferInfo(gl, testAttachments, 1, 1);
    gl.bindFramebuffer(gl.FRAMEBUFFER, testFBI.framebuffer);
    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    return status === gl.FRAMEBUFFER_COMPLETE;
}
