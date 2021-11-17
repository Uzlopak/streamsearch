export declare type MatchHandler = (isMatch: boolean, data?: Uint8Array) => void;
export interface StreamMatch {
    isMatch: boolean;
    data: Uint8Array;
}
export default class SBMH {
    private readonly _needle;
    private readonly _onInfo;
    maxMatches: number;
    matches: number;
    private _occ;
    private _lookbehind_size;
    private _bufpos;
    private _lookbehind;
    constructor(_needle: Uint8Array, _onInfo: MatchHandler);
    reset(): void;
    push(chunk: Uint8Array, pos?: number): number | undefined;
    private _sbmh_feed;
    private _sbmh_lookup_char;
    private _sbmh_memcmp;
}
