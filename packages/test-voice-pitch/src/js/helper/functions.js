import {RANGE_DATA,PITCH_DATA,Locale} from '../../data'
export function getPitch(freq) {
    'use strict';
    var minIndex = 0;
    var maxIndex = PITCH_DATA.length - 1;
    var currentIndex;
    var currentElement;
    if (freq > PITCH_DATA[maxIndex].value)
        return PITCH_DATA[maxIndex];
    // return maxIndex

    while (minIndex <= maxIndex) {
        currentIndex = (minIndex + maxIndex) / 2 | 0;
        currentElement = PITCH_DATA[currentIndex];

        if (currentElement.value < freq) {
            minIndex = currentIndex + 1;
        } else if (currentIndex < maxIndex) {
            maxIndex = currentIndex;
        } else {
            if (currentIndex > 0 && Math.abs(PITCH_DATA[currentIndex].value - freq) >
                Math.abs(PITCH_DATA[currentIndex - 1].value - freq)) {
                return PITCH_DATA[currentIndex - 1];
            }
            return currentElement;
        }
    }
    // console.log(0)
    // return null
    return PITCH_DATA[0];
}
export function getRange(name) {
    var range = RANGE_DATA[name];
    if (range && !range.name) {
        for (var i = 0; i < PITCH_DATA.length; ++i) {
            var pitch = PITCH_DATA[i];
            if (pitch.inter == range.low) {
                range.low = pitch;
            } else if (pitch.inter == range.high) {
                range.high = pitch;
            }
        }
        range.name = Locale.get(name);
    }
    return range;
}