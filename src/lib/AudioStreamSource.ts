// @license audiosteamsource.js 0.0.2 Copyright (c) 2015, Gregg Tavares All Rights Reserved.
// Available via the MIT license.
// see: http://github.com/greggman/audiostreamsource.js for details

const silentMP3 =
    'data:audio/mp3;base64,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LpkVrc5yk0NnT5DN0r7ygGqp9SJxOeOSSTeJQgIRIKh6SBKLhsdFgnl4lic2AkshcfBYDR2PUjSDGiSttUZNSSMKkiMpyPz9XLaihbS6uJe0Qo39FI9RhJiijnMQAmqRJQnTnQQ9B6DATEFNRTMuOTkuNVW3U5Tx7Sg0GtNZay5wXQa29Bbl+W7LSqP/EUHXUMbiZZqWyph7iXH/eWVVovK8YFykUhfWpzKggb6B/o1f2ki9UxI8hDlinajtn1JsJGxmb0bOkuali0UaruYXWWcevHypyrfULvoUbdYW1ydMBPE6OqOplGZJbTRCQtDcrmVtVrK9TrpTM7lZijZ1rPtbwvvWbf69tPpZMVhe9GHEVuZt4rBdK5yT0a/ezMy4QrD60qtiTyZVsdUwnKE+b1TCOZnVrDRQnUywLHUnUVDV0sWVEFchCWZkNLiolpOD+bYTKfy5fmMlVyxZXCFrKmSTa5pRXM7w/+NoZPQfVjcEAGDPdiUsbg2ACN9MfSvcUWpFbTdensr6+XlZL8y/Po5TLn5WbBy75F8nmbTfY0s28yyHVD+sf9k12LpWSz6W5s3///z/+5XKktIqQbR9KBeCeS3IOBW1H8SjNCYt51CfMa4bXF+imtxZoDCxQn7gnVUpGN8+V2FLZxhxU7IrtJ0/pEusMbyRmzFckojzujKFkMshh9zKVEIefKGKtkQ47UVATb1NpRvVTEFNRTMuOTkuNVVVVVK4p5fWFEpWRCj+V5wkqN8pRbjZPAuJhHGS03lpEl5C+EiHGOknSnVMiqP1jOldLSGti0rTFErRp4SImoJTlbLYceic8+m2fv//q0Tj0SRezFPLbNGmJEStzv/5bZb/7LbLZTy2vlHFmJhICAxgUUkblWicXs5T5Wy+blS2y8tst/L/0WgkRAoSnKdtySvWwRrYL/MzNt5cdNuLmYmru702hWFoSR6KiC7/PHLEdTIeTAfhBKgfAiJ5ofbXWCcAkHREFxJcMjsfQmMAqHksE7TlQDYFhDCEGwVLOk1L5rDv50mqzbu1Jtsoa7Q7tlOaw7+d/+NoZPIbBjbsADzMbi1cbdSgGZ+gJsoa655Q1pH/DUGjUm1n5rDWEGdWNSaHeGqMxrDWGv/3ampNShrVh0mNasNZT5OU6J1zhpSwCYOBUAopIjCTonXvetz9xZoNJreumJdo0gxhIWZJ/O0NYEcfrmaKcMonqGGUfqwhq8tIavObpmTqJUiXMk/l2yO4uXrcznST43yaiTG4MYbp+IJWzK5rhxLvVMrzhL8izyJSbhelTEFNRTMuOTkuNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';

//var shittyBrowser = window.AudioContext === undefined && /iPhone|iPad|iPod/.test(navigator.userAgent);
const shittyBrowser = false; // /Android|iPhone|iPad|iPod/.test(navigator.userAgent);
let audio: HTMLAudioElement;
let g_micSource: any = null;
let g_audioSource: any = null;
function noGetUserMedia(
    options: any,
    successCallback: any,
    errorCallback: any
) {
    setTimeout(() => {
        errorCallback('no mic support on this browser/device');
    });
}
const getUserMedia =
    (navigator as any).getUserMedia ||
    (navigator as any).webkitGetUserMedia ||
    noGetUserMedia;

function addEventEmitter(self: any) {
    const _handlers = new Map<string, any>();
    self.on = function (event: string, handler: any) {
        _handlers.set(event, handler);
    };

    const emit = function (event: string, ...args: any[]) {
        const handler = _handlers.get(event);
        if (handler) {
            handler.apply(null, args);
        }
    };
    return emit;
}

function isMic(src: string) {
    return src === 'mic';
}

function getMicSource(
    context: AudioContext,
    callback: any,
    errorCallback: any
) {
    if (g_micSource) {
        setTimeout(() => {
            callback(g_micSource);
        });
    } else {
        getUserMedia.call(
            navigator,
            { audio: true },
            function (stream: MediaStream) {
                g_micSource = context.createMediaStreamSource(stream);
                callback(g_micSource);
            },
            errorCallback
        );
    }
}

interface iOpt {
    context: AudioContext;
    autoPlay: boolean;
    crossOrigin: string;
    loop: boolean;
}

class NonStreamedAudioSource {
    private emit: (event: string, ...args: any[]) => void;
    private context: AudioContext;
    private autoPlay: boolean;
    private crossOrigin: string;
    private loop: boolean;
    private source?: AudioBufferSourceNode;
    private dataBuffer?: AudioBuffer;
    private started: boolean = false;
    private startTime: number = 0;
    private stopTime: number = 0;
    private playing: boolean = false;

    constructor(options: iOpt) {
        this.emit = addEventEmitter(this);
        this.context = options.context;
        this.autoPlay = options.autoPlay;
        this.crossOrigin = options.crossOrigin;
        this.loop = options.loop;
    }

    private createBufferSource() {
        this.source = this.context.createBufferSource();
        this.source.buffer = this.dataBuffer!;
        this.source.loop = this.loop;
        this.started = false;
    }

    private handleEnded() {
        this.emit('ended');
    }

    public play() {
        if (this.source && this.source === g_micSource) {
            return;
        }
        if (this.dataBuffer) {
            if (this.started) {
                this.createBufferSource();
                this.emit('newSource', this.source);
            }
            this.started = true;
            this.source!.start(0);
            this.source!.onended = this.handleEnded.bind(this);
            this.startTime = Date.now();
            this.playing = true;
        }
    }

    public stop() {
        if (this.source && this.source === g_micSource) {
            return;
        }
        if (this.source && this.playing) {
            this.source.onended = null;
            this.source.stop(0);
            this.stopTime = Date.now();
        }
        this.playing = false;
    }

    public isPlaying() {
        return this.playing;
    }

    public getDuration() {
        return this.source && this.source !== g_micSource
            ? this.source.buffer!.duration
            : 0;
    }

    public getCurrentTime() {
        if (this.source && this.source !== g_micSource && this.playing) {
            const elapsedTime = (Date.now() - this.startTime) * 0.001;
            return elapsedTime % this.source.buffer!.duration;
        } else {
            return 0;
        }
    }

    public setSource(src: string, lofiSrc: string) {
        if (this.source) {
            this.stop();
            this.source.disconnect();
            this.source = undefined;
        }

        if (isMic(src)) {
            getMicSource(
                this.context,
                (micSource: any) => {
                    this.source = micSource;
                    this.emit('newSource', micSource);
                },
                (e: any) => this.emit('error', e)
            );
            return;
        }

        const req = new XMLHttpRequest();
        req.open('GET', lofiSrc || src, true);
        req.responseType = 'arraybuffer';
        if (this.crossOrigin) {
            req.withCredentials = true;
        }
        req.addEventListener('error', (e) => this.emit('error', e));
        req.addEventListener('load', () => {
            this.context.decodeAudioData(req.response, (decodedBuffer) => {
                this.dataBuffer = decodedBuffer;
                this.createBufferSource();
                if (this.autoPlay) {
                    this.play();
                }
                this.emit('newSource', this.source);
            });
        });
        req.send();
    }

    public init() {
        audio.src = silentMP3;
        audio.play();
    }
}

class StreamedAudioSource {
    private emit: (event: string, ...args: any[]) => void;
    private context: AudioContext;
    private autoPlay: boolean;

    private canPlayHandled: boolean = false;
    private playRequested: boolean = false;
    private source: any;
    private loop: boolean;
    private crossOrigin: string;

    constructor(options: iOpt) {
        this.emit = addEventEmitter(this);
        this.context = options.context;
        this.autoPlay = options.autoPlay;
        this.loop = options.loop;
        this.crossOrigin = options.crossOrigin;
    }

    public init() {
        audio.src = silentMP3;
        audio.play();
    }

    private mPlay() {
        this.playRequested = false;
        if (audio) {
            audio.play();
            audio.currentTime = 0;
        }
    }

    public play() {
        if (this.canPlayHandled) {
            this.mPlay();
        } else {
            this.playRequested = true;
        }
    }

    public stop() {
        if (audio) {
            audio.pause();
        }
    }

    public isPlaying() {
        return audio && !audio.paused;
    }

    private handleAudioError = (e: any) => {
        this.emit('error', e);
    };

    private handleCanplay: any = (unused: any, micSource: any) => {
        if (!this.canPlayHandled) {
            this.canPlayHandled = true;
            if (this.source) {
                this.source.disconnect();
            }
            if (micSource) {
                this.source = micSource;
            } else {
                if (this.autoPlay || this.playRequested) {
                    this.play();
                }
                if (!g_audioSource) {
                    g_audioSource =
                        this.context.createMediaElementSource(audio);
                }
                this.source = g_audioSource;
            }
            this.emit('newSource', this.source);
        }
    };

    private handleEnded = () => {
        this.emit('ended');
    };

    public setSource(src: string) {
        this.canPlayHandled = false;
        if (this.source) {
            this.source.disconnect();
        }
        if (this.isPlaying()) {
            audio.pause();
        }
        if (audio) {
            audio.removeEventListener('error', this.handleAudioError);
            audio.removeEventListener('canplay', this.handleCanplay);
            audio.removeEventListener('ended', this.handleEnded);
        }

        if (isMic(src)) {
            getMicSource(
                this.context,
                (micSource: any) => {
                    this.handleCanplay(null, micSource);
                },
                this.handleAudioError
            );
            return;
        }

        audio.loop = this.loop;
        audio.autoplay = this.autoPlay;
        if (this.crossOrigin) {
            audio.crossOrigin = 'anonymous';
        }
        audio.addEventListener('error', this.handleAudioError);
        audio.addEventListener('canplay', this.handleCanplay);
        audio.addEventListener('ended', this.handleEnded);
        audio.src = src;
        audio.load();
    }
}

export default function createAudioStreamSource(options: any) {
    if (!audio) {
        audio = (document.getElementById('audio') as any) || new Audio();
    }
    return new NonStreamedAudioSource(options);
    // return new (shittyBrowser ? NonStreamedAudioSource : StreamedAudioSource)(
    //     options
    // );
}
