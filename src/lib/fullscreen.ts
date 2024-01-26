export function requestFullScreen(element: any) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    } else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen((Element as any).ALLOW_KEYBOARD_INPUT);
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen((Element as any).ALLOW_KEYBOARD_INPUT);
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.mozRequestFullscreen) {
        element.mozRequestFullscreen();
    }
}

const d: any = document;

const noop = function () {};

export const cancelFullScreen = (
    d.exitFullscreen ||
    d.exitFullScreen ||
    d.exitFullScreen ||
    d.msExitFullscreen ||
    d.msExitFullScreen ||
    d.webkitCancelFullscreen ||
    d.webkitCancelFullScreen ||
    d.mozCancelFullScreen ||
    d.mozCancelFullscreen ||
    noop
).bind(document);

export function isFullScreen() {
    const f =
        d.fullscreenElement ||
        d.fullScreenElement ||
        d.webkitFullscreenElement ||
        d.mozFullScreenElement ||
        d.webkitIsFullScreen;
    return f !== undefined && f !== null && f !== false;
}

export function onFullScreenChange(
    element: HTMLElement,
    callback: (isFull: boolean) => void
) {
    document.addEventListener('fullscreenchange', () =>
        callback(isFullScreen())
    );
    element.addEventListener('webkitfullscreenchange', () =>
        callback(isFullScreen())
    );
    document.addEventListener('mozfullscreenchange', () =>
        callback(isFullScreen())
    );
}

export function canGoFullScreen() {
    const body: any = window.document.body || {};
    const r =
        body.requestFullscreen ||
        body.requestFullScreen ||
        body.msRequestFullscreen ||
        body.msRequestFullScreen ||
        body.webkitRequestFullScreen ||
        body.webkitRequestFullscreen ||
        body.mozRequestFullScreen ||
        body.mozRequestFullscreen;

    return r !== undefined && r !== null;
}
