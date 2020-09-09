import Top from "../classes/Top";
import {getPitch} from './functions'
export default  {
    getValue: function(data) {
        data.tops = new Array(data.fft_size);
        if (!data.lock_spec) {
            var fft = data.mic_fft;
            data.spectrum = fft.analyze('db');
            data.sample_rate = fft.input.context.sampleRate;
            var max_eng = 120;
            data.highest_index = 0;
            data.highest_eng = 0;
            data.ori_spectrum = new Array(data.spectrum.length);
            for (let i = 0; i < data.x_max; ++i) {
                let value = data.spectrum[i] + 140;
                data.ori_spectrum[i] = value;
                data.spectrum[i] = data.equal_loud.adjust(i, value);
                if (value > data.highest_eng) {
                    data.highest_eng = value;
                    data.highest_index = i;
                }
                max_eng = Math.max(max_eng, data.ori_spectrum[i]);
            }
            data.max_eng = max_eng;
            data.top_eng_range = (data.max_eng - data.min_eng) * data.top_eng_range_rate;
        }
    },
    guessPitch: function(data,s) {
        var spectrum = data.spectrum;
        data.pitch = null;
        data.max_top = null;
        // ====================== first loop
        {
            var last_up_index = 0;
            var low_eng = 1000;
            var last_top = null;
            for (var i = 0; i < spectrum.length; i++) {
                var eng = spectrum[i];
                if (i > 0) {
                    if (eng > spectrum[i - 1]) {
                        last_up_index = i;
                    } else if (eng < spectrum[i - 1] && last_up_index > 0) {
                        var top = null;
                        if (!data.tops[last_up_index]) {
                            top = new Top(last_up_index,data,s);
                            if (!top.valid) {
                                top = null;
                            }
                        }
                        // check invalid top
                        if (top) {
                            while (last_top) {
                                if (last_top.index * 2 <= top.index) break;

                                if (top.eng - low_eng >
                                    data.fake_top_rate * (last_top.eng - low_eng)) {
                                    // delete last top.
                                    for (var k = last_top.left_index; k <= last_top.right_index; ++k) {
                                        data.tops[k] = null;
                                    }
                                    low_eng = Math.min(low_eng, last_top.left_low_eng);
                                    last_top = last_top.left_top;
                                } else if (last_top.eng - low_eng >
                                    data.fake_top_rate * (top.eng - low_eng)) {
                                    top = null;
                                    break;
                                } else {
                                    break;
                                }
                            }
                        }


                        if (top) {
                            top.left_low_eng = low_eng;
                            top.left_top = last_top;
                            for (let k = top.left_index; k <= top.right_index; ++k) {
                                data.tops[k] = top;
                            }
                            last_up_index = 0;
                            last_top = top;
                            low_eng = top.eng;
                        }
                        if (eng < low_eng) {
                            low_eng = eng;
                        }

                    }
                }

            }
        }

        // Guess pitch.
        var max_top = null; {
            data.highest_top = data.tops[data.highest_index];
            if (data.highest_top) {
                max_top = data.highest_top;
                var max_top_eng = data.highest_top.calculate(1);
                var highest_total_eng = data.highest_top.total_eng;
                var highest_overtone_count = data.highest_top.overtone_count;

                data.accept_eng = 0; //(data.highest_top.eng - data.min_eng) / 4 + data.min_eng;
                for (let i = 2; i < 10; ++i) {
                    top = data.getTop(data.highest_top.left_index / i, data.highest_top.right_index / i);
                    if (!top) continue;
                    if (top.index <= 6) break;
                    var total_eng = top.calculate(i);
                    if (top.overtone_count <= highest_overtone_count) continue;
                    if (top.total_eng < highest_total_eng) continue;

                    if (total_eng > max_top_eng) {
                        max_top_eng = total_eng;
                        max_top = top;
                    }
                }
            }

            if (max_top) {
                var freq = max_top.index * data.sample_rate / 2 / data.fft_size;
                data.pitch = getPitch(freq);
                data.max_top = max_top;
            }
        }
    },
};