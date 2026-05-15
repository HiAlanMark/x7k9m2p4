<template>
  <div ref="container" class="fx-aurora" />
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { Renderer, Program, Mesh, Triangle } from 'ogl'

const props = withDefaults(defineProps<{
  color1?: string
  color2?: string
  speed?: number
  brightness?: number
  scale?: number
  bandHeight?: number
}>(), {
  color1: '#3b82f6',
  color2: '#8b5cf6',
  speed: 0.5,
  brightness: 0.8,
  scale: 1.5,
  bandHeight: 0.5
})

const container = ref<HTMLElement>()
let cleanup: (() => void) | null = null

function hex2vec(h: string): [number, number, number] {
  const c = h.replace('#', '')
  return [parseInt(c.slice(0,2),16)/255, parseInt(c.slice(2,4),16)/255, parseInt(c.slice(4,6),16)/255]
}

const VERT = `attribute vec2 position;void main(){gl_Position=vec4(position,0,1);}`

const FRAG = `precision highp float;
uniform float uTime;
uniform vec3 uRes;
uniform float uSpeed,uScale,uBright,uBandH;
uniform vec3 uC1,uC2;

vec3 perm(vec3 x){return mod(((x*34.)+1.)*x,289.);}
float snoise(vec2 v){
  const vec4 C=vec4(.211325,.366025,-.577350,.024390);
  vec2 i=floor(v+dot(v,C.yy)),x0=v-i+dot(i,C.xx);
  vec2 i1=x0.x>x0.y?vec2(1,0):vec2(0,1);
  vec4 x12=x0.xyxy+C.xxzz;x12.xy-=i1;i=mod(i,289.);
  vec3 p=perm(perm(i.y+vec3(0,i1.y,1))+i.x+vec3(0,i1.x,1));
  vec3 m=max(.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.);
  m=m*m;m=m*m;
  vec3 x=2.*fract(p*C.www)-1.,h=abs(x)-.5,ox=floor(x+.5),a0=x-ox;
  m*=1.7928-0.8537*(a0*a0+h*h);
  vec3 g;g.x=a0.x*x0.x+h.x*x0.y;g.yz=a0.yz*x12.xz+h.yz*x12.yw;
  return 130.*dot(m,g);
}

void main(){
  vec2 uv=gl_FragCoord.xy/uRes.xy;
  float t=uTime*uSpeed*.1;
  float n=snoise(vec2(uv.x*2.+t,t*.25))*.5*1.2;
  n=exp(n);
  float h=uv.y*2.-n+.2;
  float band=.6*max(exp(1.2*(1.-1.1*abs(n+h*10.-uBandH*10.))),0.);

  vec3 col=vec3(0.);
  float cx=uv.x+uTime*uSpeed*.02;
  vec3 g1=.5+.5*cos(6.283*(cx+vec3(.3,.2,.2)));
  vec3 g2=.5+.5*cos(6.283*(cx*.5+vec3(.5,.2,.25)));
  col+=.99*band*g1*uC1;
  col+=.99*band*g2*uC2;
  col*=uBright;
  float a=clamp(length(col),0.,1.);
  gl_FragColor=vec4(col,a*.6);
}`

function init() {
  const el = container.value
  if (!el) return

  const renderer = new Renderer({ alpha: true, premultipliedAlpha: false })
  const gl = renderer.gl
  gl.clearColor(0,0,0,0)
  gl.enable(gl.BLEND)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

  renderer.setSize(el.offsetWidth, el.offsetHeight)
  const geo = new Triangle(gl)
  if (geo.attributes.uv) delete (geo.attributes as any).uv

  const prog = new Program(gl, {
    vertex: VERT,
    fragment: FRAG,
    uniforms: {
      uTime: { value: 0 },
      uRes: { value: [gl.canvas.width, gl.canvas.height, 1] },
      uSpeed: { value: props.speed },
      uScale: { value: props.scale },
      uBright: { value: props.brightness },
      uBandH: { value: props.bandHeight },
      uC1: { value: hex2vec(props.color1) },
      uC2: { value: hex2vec(props.color2) },
    }
  })

  const mesh = new Mesh(gl, { geometry: geo, program: prog })
  el.appendChild(gl.canvas)

  const resize = () => {
    renderer.setSize(el.offsetWidth, el.offsetHeight)
    prog.uniforms.uRes.value = [gl.canvas.width, gl.canvas.height, 1]
  }
  window.addEventListener('resize', resize)

  let raf = 0
  const tick = (t: number) => {
    raf = requestAnimationFrame(tick)
    prog.uniforms.uTime.value = t * 0.001
    prog.uniforms.uSpeed.value = props.speed
    prog.uniforms.uBright.value = props.brightness
    prog.uniforms.uC1.value = hex2vec(props.color1)
    prog.uniforms.uC2.value = hex2vec(props.color2)
    renderer.render({ scene: mesh })
  }
  raf = requestAnimationFrame(tick)

  cleanup = () => {
    cancelAnimationFrame(raf)
    window.removeEventListener('resize', resize)
    if (gl.canvas.parentNode === el) el.removeChild(gl.canvas)
    gl.getExtension('WEBGL_lose_context')?.loseContext()
  }
}

onMounted(init)
onBeforeUnmount(() => cleanup?.())
watch(() => [props.speed, props.brightness, props.color1, props.color2], () => {
  cleanup?.()
  init()
})
</script>

<style scoped>
.fx-aurora {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}
.fx-aurora :deep(canvas) {
  position: absolute;
  inset: 0;
  width: 100% !important;
  height: 100% !important;
  display: block;
}
</style>
