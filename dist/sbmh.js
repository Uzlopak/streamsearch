"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SBMH {
    constructor(_needle, _onInfo) {
        this._needle = _needle;
        this._onInfo = _onInfo;
        this.maxMatches = Infinity;
        this.matches = 0;
        this._occ = new Uint8Array(256);
        this._lookbehind_size = 0;
        this._bufpos = 0;
        this._lookbehind = new Uint8Array(_needle.length);
        const needleLen = this._needle.length;
        for (let j = 0; j < 256; ++j) {
            this._occ[j] = needleLen;
        }
        // Populate occurrence table with analysis of the needle,
        // ignoring last letter.
        for (let i = 0; i < needleLen - 1; ++i) {
            this._occ[this._needle[i]] = needleLen - 1 - i;
        }
    }
    reset() {
        this._lookbehind_size = 0;
        this.matches = 0;
        this._bufpos = 0;
    }
    push(chunk, pos = 0) {
        const chlen = chunk.length;
        this._bufpos = pos;
        let r;
        while (r !== chlen && this.matches < this.maxMatches) {
            r = this._sbmh_feed(chunk);
        }
        return r;
    }
    _sbmh_feed(data) {
        const len = data.length;
        const needle = this._needle;
        const needle_len = needle.length;
        // Positive: points to a position in `data`
        //           pos == 3 points to data[3]
        // Negative: points to a position in the lookbehind Uint8Array
        //           pos == -2 points to lookbehind[lookbehind_size - 2]
        let pos = -this._lookbehind_size;
        let last_needle_char = needle[needle_len - 1];
        let occ = this._occ;
        let lookbehind = this._lookbehind;
        let ch;
        if (pos < 0) {
            // Lookbehind Uint8Array is not empty. Perform Boyer-Moore-Horspool
            // search with character lookup code that considers both the
            // lookbehind Uint8Array and the current round's haystack data.
            //
            // Loop until
            //   there is a match.
            // or until
            //   we've moved past the position that requires the
            //   lookbehind Uint8Array. In this case we switch to the
            //   optimized loop.
            // or until
            //   the character to look at lies outside the haystack.
            while (pos < 0 && pos <= len - needle_len) {
                ch = this._sbmh_lookup_char(data, pos + needle_len - 1);
                if (ch === last_needle_char &&
                    this._sbmh_memcmp(data, pos, needle_len - 1)) {
                    this._lookbehind_size = 0;
                    ++this.matches;
                    if (pos > -this._lookbehind_size)
                        this._onInfo(true, lookbehind.subarray(0, this._lookbehind_size + pos));
                    else
                        this._onInfo(true);
                    return (this._bufpos = pos + needle_len);
                }
                else
                    pos += occ[ch];
            }
            // No match.
            if (pos < 0) {
                // There's too few data for Boyer-Moore-Horspool to run,
                // so let's use a different algorithm to skip as much as
                // we can.
                // Forward pos until
                //   the trailing part of lookbehind + data
                //   looks like the beginning of the needle
                // or until
                //   pos == 0
                while (pos < 0 && !this._sbmh_memcmp(data, pos, len - pos))
                    pos++;
            }
            if (pos >= 0) {
                // Discard lookbehind Uint8Array.
                this._onInfo(false, lookbehind.subarray(0, this._lookbehind_size));
                this._lookbehind_size = 0;
            }
            else {
                // Cut off part of the lookbehind Uint8Array that has
                // been processed and append the entire haystack
                // into it.
                const bytesToCutOff = this._lookbehind_size + pos;
                if (bytesToCutOff > 0) {
                    // The cut off data is guaranteed not to contain the needle.
                    this._onInfo(false, lookbehind.subarray(0, bytesToCutOff));
                }
                lookbehind.set(lookbehind.subarray(bytesToCutOff));
                this._lookbehind_size -= bytesToCutOff;
                lookbehind.set(data, this._lookbehind_size);
                this._lookbehind_size += len;
                this._bufpos = len;
                return len;
            }
        }
        if (pos >= 0)
            pos += this._bufpos;
        // Lookbehind Uint8Array is now empty. Perform Boyer-Moore-Horspool
        // search with optimized character lookup code that only considers
        // the current round's haystack data.
        while (pos <= len - needle_len) {
            ch = data[pos + needle_len - 1];
            if (ch === last_needle_char &&
                data[pos] === needle[0] &&
                jsmemcmp(needle, 0, data, pos, needle_len - 1)) {
                ++this.matches;
                if (pos > 0)
                    this._onInfo(true, data.subarray(this._bufpos, pos));
                else
                    this._onInfo(true);
                return (this._bufpos = pos + needle_len);
            }
            else
                pos += occ[ch];
        }
        // There was no match. If there's trailing haystack data that we cannot
        // match yet using the Boyer-Moore-Horspool algorithm (because the trailing
        // data is less than the needle size) then match using a modified
        // algorithm that starts matching from the beginning instead of the end.
        // Whatever trailing data is left after running this algorithm is added to
        // the lookbehind Uint8Array.
        if (pos < len) {
            while (pos < len &&
                (data[pos] !== needle[0] || !jsmemcmp(data, pos, needle, 0, len - pos))) {
                ++pos;
            }
            if (pos < len) {
                lookbehind.set(data.subarray(pos, pos + (len - pos)));
                this._lookbehind_size = len - pos;
            }
        }
        // Everything until pos is guaranteed not to contain needle data.
        if (pos > 0)
            this._onInfo(false, data.subarray(this._bufpos, pos < len ? pos : len));
        this._bufpos = len;
        return len;
    }
    _sbmh_lookup_char(data, pos) {
        if (pos < 0)
            return this._lookbehind[this._lookbehind_size + pos];
        else
            return data[pos];
    }
    _sbmh_memcmp(data, pos, len) {
        let i = 0;
        while (i < len) {
            if (this._sbmh_lookup_char(data, pos + i) === this._needle[i])
                ++i;
            else
                return false;
        }
        return true;
    }
}
exports.default = SBMH;
function jsmemcmp(buf1, pos1, buf2, pos2, num) {
    for (let i = 0; i < num; ++i, ++pos1, ++pos2) {
        if (buf1[pos1] !== buf2[pos2])
            return false;
    }
    return true;
}
//# sourceMappingURL=sbmh.js.map