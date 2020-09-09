<template>
  <div id="app">
    <TestVoicePitch voice-type="woman_low"
                    @onVoiceIn="getData"
                    @beforeStop="beforeStop"
                    ref="test"></TestVoicePitch>
      <p>您传入的声音为:{{pitch.inter||'未检测到声音'}}</p>
      <p>系统判断您的声音为：{{pitch.woman_voice||'未检测到声音'}}</p>
      <p>系统觉得您的声音：{{pureName}}</p>
     <button @click="start">start</button>
      <button @click="stop">stop</button>
  </div>
</template>

<script>
export default {
  name: 'App',
    data(){
      return{
          pitch:{},
          pureName:''
      }
    },
    methods:{
      start(){
          this.$refs['test'].start();
      },
        stop(){
            this.$refs['test'].stop();
        },
        getData(data){
            this.pitch = data.pitch;
            this.pureName = data.pureName;
        },
        beforeStop(data){
          console.log(data)
        }
    }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
