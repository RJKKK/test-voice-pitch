export default {
    mic: null,
    audio: null,
    fft: null,
    spectrum: null,
    tops: null,
    pitch:null,
    no_mic: false,
    sample_rate: 44100,
    fft_size: 1024,
    max_db: 140,
    lock_spec: false,
    width: 800,
    padding_right: 50,
    x_max: 1000,
    avg_spec: 0,
    min_eng: 60,
    max_eng: 140,
    eng_delta: 20,
    image_scale: 1,
    fft_scale: 2,
    smooth: 0.01,
    fps: 5,

    overtone_count: 5,
    overtone_accept_count: 3,
    overtone_accept_percent: 0.99,
    mix_overtone: false,
    top_eng_range_rate: 0.03,
    fake_top_rate: 4,
    max_top:null,
    pitch_name: 'inter',
    range_name: 'man_high',

    getTop: function(left, right) {
        var max_eng = 0;
        var max_top = null;
        left = Math.floor(left);
        right = Math.ceil(right);
        for (var i = left; i <= right; ++i) {
            var top = this.tops[i];
            if (top && top.eng > max_eng) {
                max_eng = top.eng;
                max_top = top;
            }
        }
        return max_top;
    },

    init: function() {
        if (!window.navigator.getUserMedia) {
            this.no_mic = true;
        }

        var is_safari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);

        if (!is_safari) {
            this.fft_size = 2048;
            this.fft_scale = 1;
        }
        this.line_value /= this.fft_size / 1024 * this.fft_scale;

    },
    indexToFreq:function(i,s) {
        return s.map(i, 0, this.fft_size, 0, this.sample_rate / 2);
    }
};