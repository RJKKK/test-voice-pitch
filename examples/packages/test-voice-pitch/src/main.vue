<template>
    <div>
        <div @touchstart="start" @touchend="stop" class="voiceBtn">点击</div>
        <div id="canvas"></div>
    </div>
</template>

<script>
    import  p5 from "p5";
    import "p5/lib/addons/p5.sound";
    import data from './js/helper/data'
    import {Locale} from './data'
    import EqualLoud from './js/classes/EqualLoud'
    import top_model from './js/helper/top_model'
    export default {
        name: "TestVoicePitch",
        data(){
            return{
                voiceData:data,
                script:null,
                myp5:null
            }
        },
        mounted(){
            const vm = this;
            this.script = function(s) {
                s.setup = () => {
                    vm.setupCanvas(s);
                };
                s.draw = () => {
                    vm.drawCanvas(s);
                };

            };
        },
        methods:{
            setupCanvas(s) {
                s.createCanvas(0, 0);
                if (!window.AudioContext) {
                    window.alert(Locale.get('no_support'));
                }
                this.voiceData.init();
                this.voiceData.equal_loud = new EqualLoud(s,this.voiceData);
                this.voiceData.fft = new p5.FFT(this.voiceData.smooth, this.voiceData.fft_size);
                if (!this.voiceData.no_mic) {
                    //创建音频频谱分析对象
                    this.voiceData.mic_fft = new p5.FFT(this.voiceData.smooth, this.voiceData.fft_size);
                    //从麦克风中获取声音
                    this.voiceData.mic = new p5.AudioIn();
                    this.context = s.getAudioContext();
                    //data.mic_fft为音频频谱分析对象
                    //setInput：把声源放到分析器中
                    this.voiceData.mic_fft.setInput(this.voiceData.mic);
                }
            },
            drawCanvas() {
                top_model.getValue(this.voiceData);
                top_model.guessPitch(this.voiceData);
                console.log(this.voiceData.pitch)
            },
            start() {
                if (!this.myp5) {
                    this.myp5 = new p5(this.script, "canvas");
                    console.log( this.myp5)
                }
                this.context.resume();
                this.voiceData.mic.start()
            },
            stop() {
                this.voiceData.mic.stop()
            }
        }
    }
</script>

<style scoped>

</style>
