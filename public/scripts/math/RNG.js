/**
 * CREDITS: orip 
 * https://stackoverflow.com/questions/424292/seedable-javascript-random-number-generator
*/

class RNG {

    constructor(seed) {
        // LCG using GCC's constants
        this.m = 0x80000000; // 2**31;
        this.a = 1103515245;
        this.c = 12345;

        this.state = seed ? seed : Math.floor(Math.random() * (this.m - 1));
    }

    next_int() {
        this.state = (this.a * this.state + this.c) % this.m;
        return this.state;
    }

    next_float() {
        // returns in range [0,1]
        return this.next_int() / (this.m - 1);
    }

    next_range(start, end) {
        // returns in range [start, end): including start, excluding end
        // can't modulu nextInt because of weak randomness in lower bits
        var rangeSize = end - start;
        var randomUnder1 = this.next_int() / this.m;
        return start + Math.floor(randomUnder1 * rangeSize);
    }

    choice(array) {
        return array[this.next_range(0, array.length)];
    }

}