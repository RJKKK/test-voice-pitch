# test-voice-pitch

> 把一个测量人声音高网站的部分功能移植到vue组件。
>
> 源网站：https://bideyuanli.com/pp  作者：比的原理。感谢比的原理大佬。
>
> 线上demo：https://festive-hoover-d6537d.netlify.app

## 安装
```
npm i test-voice-pitch (yarn也可) 
```

### 使用示例
```vue
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
import test_voice_pitch  from 'test-voice-pitch'
export default {
  name: 'App',
    data(){
      return{
          pitch:{},
          pureName:''
      }
    },
    comments:{
        "TestVoicePitch":test_voice_pitch.component
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

</style>

```



### props

| 名称       | 作用                                                         | 可用值                                        |
| ---------- | ------------------------------------------------------------ | --------------------------------------------- |
| voice-type | 指定麦克风录入的人声类型，以使对其鉴别算法,默认值为‘man_high’(男高音) | 'man_high','man_low','woman_high','woman_low' |



### callbacks

| 名称       | 作用                                 | 回调参数                             |
| ---------- | ------------------------------------ | ------------------------------------ |
| onVoiceIn  | 麦克风开启时，实时回显声音的测量数据 | data:{pitch:Object，pureName:String} |
| beforeStop | 获取麦克风关闭前的一帧声音数据       | data:{pitch:Object，pureName:String} |



### 说明

#### 1.声音数据回显格式说明

```javascript
/*当没有声音被录入时，pitch的值为{}*/
pitch:{
  "inter": "Db6",//测定的音名
  "man": "^c''",//当音源为男声时测定的唱名(abcjs的表示法)
  "woman": "^c'",//当音源为女声时测定的唱名(abcjs的表示法)
  'man_voice': '#c4',//当音源为男声时测定的唱名
  'woman_voice': '#c3',//当音源为女声时测定的唱名
  "value": 1108.73 //音源频率
}

/*当没有声音被录入时,pureName的值为''*/
/*pureName可能返回的所有结果如下*/
pureName|1:['真声','混声','假声','假出翔','头声']
```

### 2.组件使用时必须指定ref

因为浏览器对媒体的安全限制，你需要在使用的页面中自定义录音的开始与关闭的方法。(具体见使用示例)



## 踩坑提示

1.部署到线上时，不可使用http协议地址。进行本地测试时，不可使用localhost，同时浏览器会禁止调用麦克风，可以通过如下方式绕过：https://medium.com/@Carmichaelize/enabling-the-microphone-camera-in-chrome-for-local-unsecure-origins-9c90c3149339

2.移植比较粗糙（基本是源码照搬，因为没看懂orz），不喜轻喷。如果觉得声音测量算法不准确，请联系比的原理大佬交流。

3.源码使用了低版本的p5.js框架，目前p5的最新版本有bug无法调用( https://github.com/processing/p5.js-sound/issues/512 )，因此p5的依赖暂时采用低版本。



### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
