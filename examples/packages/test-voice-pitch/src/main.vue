<template>
    <div>
        <div @click="start">开始</div>
        <div @click="stop">停止</div>
        <div>{{getPitch}}</div>
        <div>{{getPureName}}</div>
        <div id="canvas" style="display: none"></div>
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
        props:{
            voiceType:{
                type:String,
                default:'man_high'
            }
        },
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
            drawCanvas(s) {
                top_model.getValue(this.voiceData);
                top_model.guessPitch(this.voiceData,s);
                this.$emit("onVoiceIn",this.voiceData.pitch,this.voiceData.max_top?this.voiceData.max_top.getPureName():'')
            },
            start() {
                if (!this.myp5) {
                    this.myp5 = new p5(this.script, "canvas");
                }
                this.context.resume();
                this.voiceData.mic.start()
            },
            stop() {
                this.voiceData.mic.stop()
            },
        },
        computed:{
            getPitch(){
                return this.voiceData.pitch
            },
            getPureName(){
                return this.voiceData.max_top?this.voiceData.max_top.getPureName():''
            }
        },
        watch:{
            voiceType(newData){
                this.voiceData.range_name = newData
            }
        }
    }
</script>

<style scoped>

</style>
