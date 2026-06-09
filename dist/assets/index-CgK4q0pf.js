const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/ChatView-VDxONOsB.js","assets/marked.esm-DKjyhwJX.js","assets/purify.es-B_J904Nm.js","assets/bash-Cy3cnk2N.js","assets/HxTextarea-Coi_aNKv.js","assets/useToast-CyOO0Kr7.js","assets/useToolTrace-B0zYQSZI.js","assets/useContextCompression-7VI9QBNU.js","assets/ChatView-BpMxC8Ez.css","assets/BlueprintView-DeHBY6zt.js","assets/BlueprintView-Xzdzfc8n.css","assets/InboxView-BDDIEiXg.js","assets/HxCard-0z0K2t0E.js","assets/HxSpinner-BeOptG1V.js","assets/InboxView-B5sserH2.css","assets/HistoryView-BNDF7X__.js","assets/HxSelect.vue_vue_type_script_setup_true_lang-ByWez_6B.js","assets/HxEmpty-DQ_3iWQS.js","assets/HistoryView-Dqjta_Rl.css","assets/SkillStoreView-Ci-8j_-w.js","assets/HxBadge-DaVjMoee.js","assets/SkillStoreView-Btox92MM.css","assets/TasksView-BpyT-g2q.js","assets/TasksView-DsQiAmjJ.css","assets/FilesView-7qOTTFcV.js","assets/FilesView-ByQ0c9jW.css","assets/GroupChatView-xGbYjHq0.js","assets/GroupChatView-Btxk0Wde.css","assets/SettingsView-Bwqyz11N.js","assets/SettingsView-pMn52rHb.css"])))=>i.map(i=>d[i]);
(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function n(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=n(s);fetch(s.href,r)}})();/**
* @vue/shared v3.5.34
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/function Gf(t){const e=Object.create(null);for(const n of t.split(","))e[n]=1;return n=>n in e}const Ut={},Ur=[],Ai=()=>{},Hm=()=>!1,Il=t=>t.charCodeAt(0)===111&&t.charCodeAt(1)===110&&(t.charCodeAt(2)>122||t.charCodeAt(2)<97),Ll=t=>t.startsWith("onUpdate:"),Qt=Object.assign,Wf=(t,e)=>{const n=t.indexOf(e);n>-1&&t.splice(n,1)},vv=Object.prototype.hasOwnProperty,Mt=(t,e)=>vv.call(t,e),Xe=Array.isArray,Or=t=>ea(t)==="[object Map]",Dl=t=>ea(t)==="[object Set]",Jd=t=>ea(t)==="[object Date]",Je=t=>typeof t=="function",kt=t=>typeof t=="string",Gn=t=>typeof t=="symbol",St=t=>t!==null&&typeof t=="object",Gm=t=>(St(t)||Je(t))&&Je(t.then)&&Je(t.catch),Wm=Object.prototype.toString,ea=t=>Wm.call(t),xv=t=>ea(t).slice(8,-1),$m=t=>ea(t)==="[object Object]",Nl=t=>kt(t)&&t!=="NaN"&&t[0]!=="-"&&""+parseInt(t,10)===t,Io=Gf(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"),Ul=t=>{const e=Object.create(null);return(n=>e[n]||(e[n]=t(n)))},Sv=/-\w/g,Cn=Ul(t=>t.replace(Sv,e=>e.slice(1).toUpperCase())),yv=/\B([A-Z])/g,Ls=Ul(t=>t.replace(yv,"-$1").toLowerCase()),Ol=Ul(t=>t.charAt(0).toUpperCase()+t.slice(1)),$a=Ul(t=>t?`on${Ol(t)}`:""),ti=(t,e)=>!Object.is(t,e),Xa=(t,...e)=>{for(let n=0;n<t.length;n++)t[n](...e)},Xm=(t,e,n,i=!1)=>{Object.defineProperty(t,e,{configurable:!0,enumerable:!1,writable:i,value:n})},Fl=t=>{const e=parseFloat(t);return isNaN(e)?t:e},bv=t=>{const e=kt(t)?Number(t):NaN;return isNaN(e)?t:e};let Qd;const kl=()=>Qd||(Qd=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{});function Li(t){if(Xe(t)){const e={};for(let n=0;n<t.length;n++){const i=t[n],s=kt(i)?Av(i):Li(i);if(s)for(const r in s)e[r]=s[r]}return e}else if(kt(t)||St(t))return t}const Ev=/;(?![^(]*\))/g,Mv=/:([^]+)/,Tv=/\/\*[^]*?\*\//g;function Av(t){const e={};return t.replace(Tv,"").split(Ev).forEach(n=>{if(n){const i=n.split(Mv);i.length>1&&(e[i[0].trim()]=i[1].trim())}}),e}function At(t){let e="";if(kt(t))e=t;else if(Xe(t))for(let n=0;n<t.length;n++){const i=At(t[n]);i&&(e+=i+" ")}else if(St(t))for(const n in t)t[n]&&(e+=n+" ");return e.trim()}function wv(t){if(!t)return null;let{class:e,style:n}=t;return e&&!kt(e)&&(t.class=At(e)),n&&(t.style=Li(n)),t}const Cv="itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly",Rv=Gf(Cv);function qm(t){return!!t||t===""}function Pv(t,e){if(t.length!==e.length)return!1;let n=!0;for(let i=0;n&&i<t.length;i++)n=ta(t[i],e[i]);return n}function ta(t,e){if(t===e)return!0;let n=Jd(t),i=Jd(e);if(n||i)return n&&i?t.getTime()===e.getTime():!1;if(n=Gn(t),i=Gn(e),n||i)return t===e;if(n=Xe(t),i=Xe(e),n||i)return n&&i?Pv(t,e):!1;if(n=St(t),i=St(e),n||i){if(!n||!i)return!1;const s=Object.keys(t).length,r=Object.keys(e).length;if(s!==r)return!1;for(const o in t){const a=t.hasOwnProperty(o),l=e.hasOwnProperty(o);if(a&&!l||!a&&l||!ta(t[o],e[o]))return!1}}return String(t)===String(e)}function Iv(t,e){return t.findIndex(n=>ta(n,e))}const Km=t=>!!(t&&t.__v_isRef===!0),Ye=t=>kt(t)?t:t==null?"":Xe(t)||St(t)&&(t.toString===Wm||!Je(t.toString))?Km(t)?Ye(t.value):JSON.stringify(t,Ym,2):String(t),Ym=(t,e)=>Km(e)?Ym(t,e.value):Or(e)?{[`Map(${e.size})`]:[...e.entries()].reduce((n,[i,s],r)=>(n[uc(i,r)+" =>"]=s,n),{})}:Dl(e)?{[`Set(${e.size})`]:[...e.values()].map(n=>uc(n))}:Gn(e)?uc(e):St(e)&&!Xe(e)&&!$m(e)?String(e):e,uc=(t,e="")=>{var n;return Gn(t)?`Symbol(${(n=t.description)!=null?n:e})`:t};/**
* @vue/reactivity v3.5.34
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/let nn;class jm{constructor(e=!1){this.detached=e,this._active=!0,this._on=0,this.effects=[],this.cleanups=[],this._isPaused=!1,this._warnOnRun=!0,this.__v_skip=!0,!e&&nn&&(nn.active?(this.parent=nn,this.index=(nn.scopes||(nn.scopes=[])).push(this)-1):(this._active=!1,this._warnOnRun=!1))}get active(){return this._active}pause(){if(this._active){this._isPaused=!0;let e,n;if(this.scopes)for(e=0,n=this.scopes.length;e<n;e++)this.scopes[e].pause();for(e=0,n=this.effects.length;e<n;e++)this.effects[e].pause()}}resume(){if(this._active&&this._isPaused){this._isPaused=!1;let e,n;if(this.scopes)for(e=0,n=this.scopes.length;e<n;e++)this.scopes[e].resume();for(e=0,n=this.effects.length;e<n;e++)this.effects[e].resume()}}run(e){if(this._active){const n=nn;try{return nn=this,e()}finally{nn=n}}}on(){++this._on===1&&(this.prevScope=nn,nn=this)}off(){if(this._on>0&&--this._on===0){if(nn===this)nn=this.prevScope;else{let e=nn;for(;e;){if(e.prevScope===this){e.prevScope=this.prevScope;break}e=e.prevScope}}this.prevScope=void 0}}stop(e){if(this._active){this._active=!1;let n,i;for(n=0,i=this.effects.length;n<i;n++)this.effects[n].stop();for(this.effects.length=0,n=0,i=this.cleanups.length;n<i;n++)this.cleanups[n]();if(this.cleanups.length=0,this.scopes){for(n=0,i=this.scopes.length;n<i;n++)this.scopes[n].stop(!0);this.scopes.length=0}if(!this.detached&&this.parent&&!e){const s=this.parent.scopes.pop();s&&s!==this&&(this.parent.scopes[this.index]=s,s.index=this.index)}this.parent=void 0}}}function $f(t){return new jm(t)}function Xf(){return nn}function Zm(t,e=!1){nn&&nn.cleanups.push(t)}let Ft;const fc=new WeakSet;class Jm{constructor(e){this.fn=e,this.deps=void 0,this.depsTail=void 0,this.flags=5,this.next=void 0,this.cleanup=void 0,this.scheduler=void 0,nn&&(nn.active?nn.effects.push(this):this.flags&=-2)}pause(){this.flags|=64}resume(){this.flags&64&&(this.flags&=-65,fc.has(this)&&(fc.delete(this),this.trigger()))}notify(){this.flags&2&&!(this.flags&32)||this.flags&8||eg(this)}run(){if(!(this.flags&1))return this.fn();this.flags|=2,eh(this),tg(this);const e=Ft,n=si;Ft=this,si=!0;try{return this.fn()}finally{ng(this),Ft=e,si=n,this.flags&=-3}}stop(){if(this.flags&1){for(let e=this.deps;e;e=e.nextDep)Yf(e);this.deps=this.depsTail=void 0,eh(this),this.onStop&&this.onStop(),this.flags&=-2}}trigger(){this.flags&64?fc.add(this):this.scheduler?this.scheduler():this.runIfDirty()}runIfDirty(){hu(this)&&this.run()}get dirty(){return hu(this)}}let Qm=0,Lo,Do;function eg(t,e=!1){if(t.flags|=8,e){t.next=Do,Do=t;return}t.next=Lo,Lo=t}function qf(){Qm++}function Kf(){if(--Qm>0)return;if(Do){let e=Do;for(Do=void 0;e;){const n=e.next;e.next=void 0,e.flags&=-9,e=n}}let t;for(;Lo;){let e=Lo;for(Lo=void 0;e;){const n=e.next;if(e.next=void 0,e.flags&=-9,e.flags&1)try{e.trigger()}catch(i){t||(t=i)}e=n}}if(t)throw t}function tg(t){for(let e=t.deps;e;e=e.nextDep)e.version=-1,e.prevActiveLink=e.dep.activeLink,e.dep.activeLink=e}function ng(t){let e,n=t.depsTail,i=n;for(;i;){const s=i.prevDep;i.version===-1?(i===n&&(n=s),Yf(i),Lv(i)):e=i,i.dep.activeLink=i.prevActiveLink,i.prevActiveLink=void 0,i=s}t.deps=e,t.depsTail=n}function hu(t){for(let e=t.deps;e;e=e.nextDep)if(e.dep.version!==e.version||e.dep.computed&&(ig(e.dep.computed)||e.dep.version!==e.version))return!0;return!!t._dirty}function ig(t){if(t.flags&4&&!(t.flags&16)||(t.flags&=-17,t.globalVersion===Bo)||(t.globalVersion=Bo,!t.isSSR&&t.flags&128&&(!t.deps&&!t._dirty||!hu(t))))return;t.flags|=2;const e=t.dep,n=Ft,i=si;Ft=t,si=!0;try{tg(t);const s=t.fn(t._value);(e.version===0||ti(s,t._value))&&(t.flags|=128,t._value=s,e.version++)}catch(s){throw e.version++,s}finally{Ft=n,si=i,ng(t),t.flags&=-3}}function Yf(t,e=!1){const{dep:n,prevSub:i,nextSub:s}=t;if(i&&(i.nextSub=s,t.prevSub=void 0),s&&(s.prevSub=i,t.nextSub=void 0),n.subs===t&&(n.subs=i,!i&&n.computed)){n.computed.flags&=-5;for(let r=n.computed.deps;r;r=r.nextDep)Yf(r,!0)}!e&&!--n.sc&&n.map&&n.map.delete(n.key)}function Lv(t){const{prevDep:e,nextDep:n}=t;e&&(e.nextDep=n,t.prevDep=void 0),n&&(n.prevDep=e,t.nextDep=void 0)}let si=!0;const sg=[];function ns(){sg.push(si),si=!1}function is(){const t=sg.pop();si=t===void 0?!0:t}function eh(t){const{cleanup:e}=t;if(t.cleanup=void 0,e){const n=Ft;Ft=void 0;try{e()}finally{Ft=n}}}let Bo=0;class Dv{constructor(e,n){this.sub=e,this.dep=n,this.version=n.version,this.nextDep=this.prevDep=this.nextSub=this.prevSub=this.prevActiveLink=void 0}}class Bl{constructor(e){this.computed=e,this.version=0,this.activeLink=void 0,this.subs=void 0,this.map=void 0,this.key=void 0,this.sc=0,this.__v_skip=!0}track(e){if(!Ft||!si||Ft===this.computed)return;let n=this.activeLink;if(n===void 0||n.sub!==Ft)n=this.activeLink=new Dv(Ft,this),Ft.deps?(n.prevDep=Ft.depsTail,Ft.depsTail.nextDep=n,Ft.depsTail=n):Ft.deps=Ft.depsTail=n,rg(n);else if(n.version===-1&&(n.version=this.version,n.nextDep)){const i=n.nextDep;i.prevDep=n.prevDep,n.prevDep&&(n.prevDep.nextDep=i),n.prevDep=Ft.depsTail,n.nextDep=void 0,Ft.depsTail.nextDep=n,Ft.depsTail=n,Ft.deps===n&&(Ft.deps=i)}return n}trigger(e){this.version++,Bo++,this.notify(e)}notify(e){qf();try{for(let n=this.subs;n;n=n.prevSub)n.sub.notify()&&n.sub.dep.notify()}finally{Kf()}}}function rg(t){if(t.dep.sc++,t.sub.flags&4){const e=t.dep.computed;if(e&&!t.dep.subs){e.flags|=20;for(let i=e.deps;i;i=i.nextDep)rg(i)}const n=t.dep.subs;n!==t&&(t.prevSub=n,n&&(n.nextSub=t)),t.dep.subs=t}}const rl=new WeakMap,sr=Symbol(""),pu=Symbol(""),zo=Symbol("");function gn(t,e,n){if(si&&Ft){let i=rl.get(t);i||rl.set(t,i=new Map);let s=i.get(n);s||(i.set(n,s=new Bl),s.map=i,s.key=n),s.track()}}function qi(t,e,n,i,s,r){const o=rl.get(t);if(!o){Bo++;return}const a=l=>{l&&l.trigger()};if(qf(),e==="clear")o.forEach(a);else{const l=Xe(t),c=l&&Nl(n);if(l&&n==="length"){const u=Number(i);o.forEach((d,f)=>{(f==="length"||f===zo||!Gn(f)&&f>=u)&&a(d)})}else switch((n!==void 0||o.has(void 0))&&a(o.get(n)),c&&a(o.get(zo)),e){case"add":l?c&&a(o.get("length")):(a(o.get(sr)),Or(t)&&a(o.get(pu)));break;case"delete":l||(a(o.get(sr)),Or(t)&&a(o.get(pu)));break;case"set":Or(t)&&a(o.get(sr));break}}Kf()}function Nv(t,e){const n=rl.get(t);return n&&n.get(e)}function mr(t){const e=lt(t);return e===t?e:(gn(e,"iterate",zo),Bn(t)?e:e.map(ri))}function zl(t){return gn(t=lt(t),"iterate",zo),t}function yi(t,e){return ss(t)?Gr(wi(t)?ri(e):e):ri(e)}const Uv={__proto__:null,[Symbol.iterator](){return dc(this,Symbol.iterator,t=>yi(this,t))},concat(...t){return mr(this).concat(...t.map(e=>Xe(e)?mr(e):e))},entries(){return dc(this,"entries",t=>(t[1]=yi(this,t[1]),t))},every(t,e){return Oi(this,"every",t,e,void 0,arguments)},filter(t,e){return Oi(this,"filter",t,e,n=>n.map(i=>yi(this,i)),arguments)},find(t,e){return Oi(this,"find",t,e,n=>yi(this,n),arguments)},findIndex(t,e){return Oi(this,"findIndex",t,e,void 0,arguments)},findLast(t,e){return Oi(this,"findLast",t,e,n=>yi(this,n),arguments)},findLastIndex(t,e){return Oi(this,"findLastIndex",t,e,void 0,arguments)},forEach(t,e){return Oi(this,"forEach",t,e,void 0,arguments)},includes(...t){return hc(this,"includes",t)},indexOf(...t){return hc(this,"indexOf",t)},join(t){return mr(this).join(t)},lastIndexOf(...t){return hc(this,"lastIndexOf",t)},map(t,e){return Oi(this,"map",t,e,void 0,arguments)},pop(){return co(this,"pop")},push(...t){return co(this,"push",t)},reduce(t,...e){return th(this,"reduce",t,e)},reduceRight(t,...e){return th(this,"reduceRight",t,e)},shift(){return co(this,"shift")},some(t,e){return Oi(this,"some",t,e,void 0,arguments)},splice(...t){return co(this,"splice",t)},toReversed(){return mr(this).toReversed()},toSorted(t){return mr(this).toSorted(t)},toSpliced(...t){return mr(this).toSpliced(...t)},unshift(...t){return co(this,"unshift",t)},values(){return dc(this,"values",t=>yi(this,t))}};function dc(t,e,n){const i=zl(t),s=i[e]();return i!==t&&!Bn(t)&&(s._next=s.next,s.next=()=>{const r=s._next();return r.done||(r.value=n(r.value)),r}),s}const Ov=Array.prototype;function Oi(t,e,n,i,s,r){const o=zl(t),a=o!==t&&!Bn(t),l=o[e];if(l!==Ov[e]){const d=l.apply(t,r);return a?ri(d):d}let c=n;o!==t&&(a?c=function(d,f){return n.call(this,yi(t,d),f,t)}:n.length>2&&(c=function(d,f){return n.call(this,d,f,t)}));const u=l.call(o,c,i);return a&&s?s(u):u}function th(t,e,n,i){const s=zl(t),r=s!==t&&!Bn(t);let o=n,a=!1;s!==t&&(r?(a=i.length===0,o=function(c,u,d){return a&&(a=!1,c=yi(t,c)),n.call(this,c,yi(t,u),d,t)}):n.length>3&&(o=function(c,u,d){return n.call(this,c,u,d,t)}));const l=s[e](o,...i);return a?yi(t,l):l}function hc(t,e,n){const i=lt(t);gn(i,"iterate",zo);const s=i[e](...n);return(s===-1||s===!1)&&Vl(n[0])?(n[0]=lt(n[0]),i[e](...n)):s}function co(t,e,n=[]){ns(),qf();const i=lt(t)[e].apply(t,n);return Kf(),is(),i}const Fv=Gf("__proto__,__v_isRef,__isVue"),og=new Set(Object.getOwnPropertyNames(Symbol).filter(t=>t!=="arguments"&&t!=="caller").map(t=>Symbol[t]).filter(Gn));function kv(t){Gn(t)||(t=String(t));const e=lt(this);return gn(e,"has",t),e.hasOwnProperty(t)}class ag{constructor(e=!1,n=!1){this._isReadonly=e,this._isShallow=n}get(e,n,i){if(n==="__v_skip")return e.__v_skip;const s=this._isReadonly,r=this._isShallow;if(n==="__v_isReactive")return!s;if(n==="__v_isReadonly")return s;if(n==="__v_isShallow")return r;if(n==="__v_raw")return i===(s?r?Kv:fg:r?ug:cg).get(e)||Object.getPrototypeOf(e)===Object.getPrototypeOf(i)?e:void 0;const o=Xe(e);if(!s){let l;if(o&&(l=Uv[n]))return l;if(n==="hasOwnProperty")return kv}const a=Reflect.get(e,n,Bt(e)?e:i);if((Gn(n)?og.has(n):Fv(n))||(s||gn(e,"get",n),r))return a;if(Bt(a)){const l=o&&Nl(n)?a:a.value;return s&&St(l)?gu(l):l}return St(a)?s?gu(a):to(a):a}}class lg extends ag{constructor(e=!1){super(!1,e)}set(e,n,i,s){let r=e[n];const o=Xe(e)&&Nl(n);if(!this._isShallow){const c=ss(r);if(!Bn(i)&&!ss(i)&&(r=lt(r),i=lt(i)),!o&&Bt(r)&&!Bt(i))return c||(r.value=i),!0}const a=o?Number(n)<e.length:Mt(e,n),l=Reflect.set(e,n,i,Bt(e)?e:s);return e===lt(s)&&(a?ti(i,r)&&qi(e,"set",n,i):qi(e,"add",n,i)),l}deleteProperty(e,n){const i=Mt(e,n);e[n];const s=Reflect.deleteProperty(e,n);return s&&i&&qi(e,"delete",n,void 0),s}has(e,n){const i=Reflect.has(e,n);return(!Gn(n)||!og.has(n))&&gn(e,"has",n),i}ownKeys(e){return gn(e,"iterate",Xe(e)?"length":sr),Reflect.ownKeys(e)}}class Bv extends ag{constructor(e=!1){super(!0,e)}set(e,n){return!0}deleteProperty(e,n){return!0}}const zv=new lg,Vv=new Bv,Hv=new lg(!0);const mu=t=>t,fa=t=>Reflect.getPrototypeOf(t);function Gv(t,e,n){return function(...i){const s=this.__v_raw,r=lt(s),o=Or(r),a=t==="entries"||t===Symbol.iterator&&o,l=t==="keys"&&o,c=s[t](...i),u=n?mu:e?Gr:ri;return!e&&gn(r,"iterate",l?pu:sr),Qt(Object.create(c),{next(){const{value:d,done:f}=c.next();return f?{value:d,done:f}:{value:a?[u(d[0]),u(d[1])]:u(d),done:f}}})}}function da(t){return function(...e){return t==="delete"?!1:t==="clear"?void 0:this}}function Wv(t,e){const n={get(s){const r=this.__v_raw,o=lt(r),a=lt(s);t||(ti(s,a)&&gn(o,"get",s),gn(o,"get",a));const{has:l}=fa(o),c=e?mu:t?Gr:ri;if(l.call(o,s))return c(r.get(s));if(l.call(o,a))return c(r.get(a));r!==o&&r.get(s)},get size(){const s=this.__v_raw;return!t&&gn(lt(s),"iterate",sr),s.size},has(s){const r=this.__v_raw,o=lt(r),a=lt(s);return t||(ti(s,a)&&gn(o,"has",s),gn(o,"has",a)),s===a?r.has(s):r.has(s)||r.has(a)},forEach(s,r){const o=this,a=o.__v_raw,l=lt(a),c=e?mu:t?Gr:ri;return!t&&gn(l,"iterate",sr),a.forEach((u,d)=>s.call(r,c(u),c(d),o))}};return Qt(n,t?{add:da("add"),set:da("set"),delete:da("delete"),clear:da("clear")}:{add(s){const r=lt(this),o=fa(r),a=lt(s),l=!e&&!Bn(s)&&!ss(s)?a:s;return o.has.call(r,l)||ti(s,l)&&o.has.call(r,s)||ti(a,l)&&o.has.call(r,a)||(r.add(l),qi(r,"add",l,l)),this},set(s,r){!e&&!Bn(r)&&!ss(r)&&(r=lt(r));const o=lt(this),{has:a,get:l}=fa(o);let c=a.call(o,s);c||(s=lt(s),c=a.call(o,s));const u=l.call(o,s);return o.set(s,r),c?ti(r,u)&&qi(o,"set",s,r):qi(o,"add",s,r),this},delete(s){const r=lt(this),{has:o,get:a}=fa(r);let l=o.call(r,s);l||(s=lt(s),l=o.call(r,s)),a&&a.call(r,s);const c=r.delete(s);return l&&qi(r,"delete",s,void 0),c},clear(){const s=lt(this),r=s.size!==0,o=s.clear();return r&&qi(s,"clear",void 0,void 0),o}}),["keys","values","entries",Symbol.iterator].forEach(s=>{n[s]=Gv(s,t,e)}),n}function jf(t,e){const n=Wv(t,e);return(i,s,r)=>s==="__v_isReactive"?!t:s==="__v_isReadonly"?t:s==="__v_raw"?i:Reflect.get(Mt(n,s)&&s in i?n:i,s,r)}const $v={get:jf(!1,!1)},Xv={get:jf(!1,!0)},qv={get:jf(!0,!1)};const cg=new WeakMap,ug=new WeakMap,fg=new WeakMap,Kv=new WeakMap;function Yv(t){switch(t){case"Object":case"Array":return 1;case"Map":case"Set":case"WeakMap":case"WeakSet":return 2;default:return 0}}function jv(t){return t.__v_skip||!Object.isExtensible(t)?0:Yv(xv(t))}function to(t){return ss(t)?t:Jf(t,!1,zv,$v,cg)}function Zf(t){return Jf(t,!1,Hv,Xv,ug)}function gu(t){return Jf(t,!0,Vv,qv,fg)}function Jf(t,e,n,i,s){if(!St(t)||t.__v_raw&&!(e&&t.__v_isReactive))return t;const r=jv(t);if(r===0)return t;const o=s.get(t);if(o)return o;const a=new Proxy(t,r===2?i:n);return s.set(t,a),a}function wi(t){return ss(t)?wi(t.__v_raw):!!(t&&t.__v_isReactive)}function ss(t){return!!(t&&t.__v_isReadonly)}function Bn(t){return!!(t&&t.__v_isShallow)}function Vl(t){return t?!!t.__v_raw:!1}function lt(t){const e=t&&t.__v_raw;return e?lt(e):t}function Hl(t){return!Mt(t,"__v_skip")&&Object.isExtensible(t)&&Xm(t,"__v_skip",!0),t}const ri=t=>St(t)?to(t):t,Gr=t=>St(t)?gu(t):t;function Bt(t){return t?t.__v_isRef===!0:!1}function Ee(t){return hg(t,!1)}function dg(t){return hg(t,!0)}function hg(t,e){return Bt(t)?t:new Zv(t,e)}class Zv{constructor(e,n){this.dep=new Bl,this.__v_isRef=!0,this.__v_isShallow=!1,this._rawValue=n?e:lt(e),this._value=n?e:ri(e),this.__v_isShallow=n}get value(){return this.dep.track(),this._value}set value(e){const n=this._rawValue,i=this.__v_isShallow||Bn(e)||ss(e);e=i?e:lt(e),ti(e,n)&&(this._rawValue=e,this._value=i?e:ri(e),this.dep.trigger())}}function Oe(t){return Bt(t)?t.value:t}function WL(t){return Je(t)?t():Oe(t)}const Jv={get:(t,e,n)=>e==="__v_raw"?t:Oe(Reflect.get(t,e,n)),set:(t,e,n,i)=>{const s=t[e];return Bt(s)&&!Bt(n)?(s.value=n,!0):Reflect.set(t,e,n,i)}};function pg(t){return wi(t)?t:new Proxy(t,Jv)}class Qv{constructor(e){this.__v_isRef=!0,this._value=void 0;const n=this.dep=new Bl,{get:i,set:s}=e(n.track.bind(n),n.trigger.bind(n));this._get=i,this._set=s}get value(){return this._value=this._get()}set value(e){this._set(e)}}function $L(t){return new Qv(t)}function ex(t){const e=Xe(t)?new Array(t.length):{};for(const n in t)e[n]=mg(t,n);return e}class tx{constructor(e,n,i){this._object=e,this._defaultValue=i,this.__v_isRef=!0,this._value=void 0,this._key=Gn(n)?n:String(n),this._raw=lt(e);let s=!0,r=e;if(!Xe(e)||Gn(this._key)||!Nl(this._key))do s=!Vl(r)||Bn(r);while(s&&(r=r.__v_raw));this._shallow=s}get value(){let e=this._object[this._key];return this._shallow&&(e=Oe(e)),this._value=e===void 0?this._defaultValue:e}set value(e){if(this._shallow&&Bt(this._raw[this._key])){const n=this._object[this._key];if(Bt(n)){n.value=e;return}}this._object[this._key]=e}get dep(){return Nv(this._raw,this._key)}}class nx{constructor(e){this._getter=e,this.__v_isRef=!0,this.__v_isReadonly=!0,this._value=void 0}get value(){return this._value=this._getter()}}function ix(t,e,n){return Bt(t)?t:Je(t)?new nx(t):St(t)&&arguments.length>1?mg(t,e,n):Ee(t)}function mg(t,e,n){return new tx(t,e,n)}class sx{constructor(e,n,i){this.fn=e,this.setter=n,this._value=void 0,this.dep=new Bl(this),this.__v_isRef=!0,this.deps=void 0,this.depsTail=void 0,this.flags=16,this.globalVersion=Bo-1,this.next=void 0,this.effect=this,this.__v_isReadonly=!n,this.isSSR=i}notify(){if(this.flags|=16,!(this.flags&8)&&Ft!==this)return eg(this,!0),!0}get value(){const e=this.dep.track();return ig(this),e&&(e.version=this.dep.version),this._value}set value(e){this.setter&&this.setter(e)}}function rx(t,e,n=!1){let i,s;return Je(t)?i=t:(i=t.get,s=t.set),new sx(i,s,n)}const ha={},ol=new WeakMap;let Xs;function ox(t,e=!1,n=Xs){if(n){let i=ol.get(n);i||ol.set(n,i=[]),i.push(t)}}function ax(t,e,n=Ut){const{immediate:i,deep:s,once:r,scheduler:o,augmentJob:a,call:l}=n,c=x=>s?x:Bn(x)||s===!1||s===0?Ki(x,1):Ki(x);let u,d,f,p,g=!1,_=!1;if(Bt(t)?(d=()=>t.value,g=Bn(t)):wi(t)?(d=()=>c(t),g=!0):Xe(t)?(_=!0,g=t.some(x=>wi(x)||Bn(x)),d=()=>t.map(x=>{if(Bt(x))return x.value;if(wi(x))return c(x);if(Je(x))return l?l(x,2):x()})):Je(t)?e?d=l?()=>l(t,2):t:d=()=>{if(f){ns();try{f()}finally{is()}}const x=Xs;Xs=u;try{return l?l(t,3,[p]):t(p)}finally{Xs=x}}:d=Ai,e&&s){const x=d,D=s===!0?1/0:s;d=()=>Ki(x(),D)}const m=Xf(),h=()=>{u.stop(),m&&m.active&&Wf(m.effects,u)};if(r&&e){const x=e;e=(...D)=>{x(...D),h()}}let v=_?new Array(t.length).fill(ha):ha;const b=x=>{if(!(!(u.flags&1)||!u.dirty&&!x))if(e){const D=u.run();if(s||g||(_?D.some((C,R)=>ti(C,v[R])):ti(D,v))){f&&f();const C=Xs;Xs=u;try{const R=[D,v===ha?void 0:_&&v[0]===ha?[]:v,p];v=D,l?l(e,3,R):e(...R)}finally{Xs=C}}}else u.run()};return a&&a(b),u=new Jm(d),u.scheduler=o?()=>o(b,!1):b,p=x=>ox(x,!1,u),f=u.onStop=()=>{const x=ol.get(u);if(x){if(l)l(x,4);else for(const D of x)D();ol.delete(u)}},e?i?b(!0):v=u.run():o?o(b.bind(null,!0),!0):u.run(),h.pause=u.pause.bind(u),h.resume=u.resume.bind(u),h.stop=h,h}function Ki(t,e=1/0,n){if(e<=0||!St(t)||t.__v_skip||(n=n||new Map,(n.get(t)||0)>=e))return t;if(n.set(t,e),e--,Bt(t))Ki(t.value,e,n);else if(Xe(t))for(let i=0;i<t.length;i++)Ki(t[i],e,n);else if(Dl(t)||Or(t))t.forEach(i=>{Ki(i,e,n)});else if($m(t)){for(const i in t)Ki(t[i],e,n);for(const i of Object.getOwnPropertySymbols(t))Object.prototype.propertyIsEnumerable.call(t,i)&&Ki(t[i],e,n)}return t}/**
* @vue/runtime-core v3.5.34
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/function na(t,e,n,i){try{return i?t(...i):t()}catch(s){Gl(s,e,n)}}function oi(t,e,n,i){if(Je(t)){const s=na(t,e,n,i);return s&&Gm(s)&&s.catch(r=>{Gl(r,e,n)}),s}if(Xe(t)){const s=[];for(let r=0;r<t.length;r++)s.push(oi(t[r],e,n,i));return s}}function Gl(t,e,n,i=!0){const s=e?e.vnode:null,{errorHandler:r,throwUnhandledErrorInProduction:o}=e&&e.appContext.config||Ut;if(e){let a=e.parent;const l=e.proxy,c=`https://vuejs.org/error-reference/#runtime-${n}`;for(;a;){const u=a.ec;if(u){for(let d=0;d<u.length;d++)if(u[d](t,l,c)===!1)return}a=a.parent}if(r){ns(),na(r,null,10,[t,l,c]),is();return}}lx(t,n,s,i,o)}function lx(t,e,n,i=!0,s=!1){if(s)throw t;console.error(t)}const Tn=[];let xi=-1;const Fr=[];let Ms=null,Ir=0;const gg=Promise.resolve();let al=null;function ai(t){const e=al||gg;return t?e.then(this?t.bind(this):t):e}function cx(t){let e=xi+1,n=Tn.length;for(;e<n;){const i=e+n>>>1,s=Tn[i],r=Vo(s);r<t||r===t&&s.flags&2?e=i+1:n=i}return e}function Qf(t){if(!(t.flags&1)){const e=Vo(t),n=Tn[Tn.length-1];!n||!(t.flags&2)&&e>=Vo(n)?Tn.push(t):Tn.splice(cx(e),0,t),t.flags|=1,_g()}}function _g(){al||(al=gg.then(xg))}function ux(t){Xe(t)?Fr.push(...t):Ms&&t.id===-1?Ms.splice(Ir+1,0,t):t.flags&1||(Fr.push(t),t.flags|=1),_g()}function nh(t,e,n=xi+1){for(;n<Tn.length;n++){const i=Tn[n];if(i&&i.flags&2){if(t&&i.id!==t.uid)continue;Tn.splice(n,1),n--,i.flags&4&&(i.flags&=-2),i(),i.flags&4||(i.flags&=-2)}}}function vg(t){if(Fr.length){const e=[...new Set(Fr)].sort((n,i)=>Vo(n)-Vo(i));if(Fr.length=0,Ms){Ms.push(...e);return}for(Ms=e,Ir=0;Ir<Ms.length;Ir++){const n=Ms[Ir];n.flags&4&&(n.flags&=-2),n.flags&8||n(),n.flags&=-2}Ms=null,Ir=0}}const Vo=t=>t.id==null?t.flags&2?-1:1/0:t.id;function xg(t){try{for(xi=0;xi<Tn.length;xi++){const e=Tn[xi];e&&!(e.flags&8)&&(e.flags&4&&(e.flags&=-2),na(e,e.i,e.i?15:14),e.flags&4||(e.flags&=-2))}}finally{for(;xi<Tn.length;xi++){const e=Tn[xi];e&&(e.flags&=-2)}xi=-1,Tn.length=0,vg(),al=null,(Tn.length||Fr.length)&&xg()}}let un=null,Wl=null;function ll(t){const e=un;return un=t,Wl=t&&t.type.__scopeId||null,e}function fx(t){Wl=t}function dx(){Wl=null}const hx=t=>Et;function Et(t,e=un,n){if(!e||t._n)return t;const i=(...s)=>{i._d&&hl(-1);const r=ll(e);let o;try{o=t(...s)}finally{ll(r),i._d&&hl(1)}return o};return i._n=!0,i._c=!0,i._d=!0,i}function cl(t,e){if(un===null)return t;const n=Yl(un),i=t.dirs||(t.dirs=[]);for(let s=0;s<e.length;s++){let[r,o,a,l=Ut]=e[s];r&&(Je(r)&&(r={mounted:r,updated:r}),r.deep&&Ki(o),i.push({dir:r,instance:n,value:o,oldValue:void 0,arg:a,modifiers:l}))}return t}function ks(t,e,n,i){const s=t.dirs,r=e&&e.dirs;for(let o=0;o<s.length;o++){const a=s[o];r&&(a.oldValue=r[o].value);let l=a.dir[i];l&&(ns(),oi(l,n,8,[t.el,a,t,e]),is())}}function qa(t,e){if(vn){let n=vn.provides;const i=vn.parent&&vn.parent.provides;i===n&&(n=vn.provides=Object.create(i)),n[t]=e}}function zn(t,e,n=!1){const i=io();if(i||rr){let s=rr?rr._context.provides:i?i.parent==null||i.ce?i.vnode.appContext&&i.vnode.appContext.provides:i.parent.provides:void 0;if(s&&t in s)return s[t];if(arguments.length>1)return n&&Je(e)?e.call(i&&i.proxy):e}}function px(){return!!(io()||rr)}const mx=Symbol.for("v-scx"),gx=()=>zn(mx);function XL(t,e){return ed(t,null,e)}function Vn(t,e,n){return ed(t,e,n)}function ed(t,e,n=Ut){const{immediate:i,deep:s,flush:r,once:o}=n,a=Qt({},n),l=e&&i||!e&&r!=="post";let c;if($o){if(r==="sync"){const p=gx();c=p.__watcherHandles||(p.__watcherHandles=[])}else if(!l){const p=()=>{};return p.stop=Ai,p.resume=Ai,p.pause=Ai,p}}const u=vn;a.call=(p,g,_)=>oi(p,u,g,_);let d=!1;r==="post"?a.scheduler=p=>{En(p,u&&u.suspense)}:r!=="sync"&&(d=!0,a.scheduler=(p,g)=>{g?p():Qf(p)}),a.augmentJob=p=>{e&&(p.flags|=4),d&&(p.flags|=2,u&&(p.id=u.uid,p.i=u))};const f=ax(t,e,a);return $o&&(c?c.push(f):l&&f()),f}function _x(t,e,n){const i=this.proxy,s=kt(t)?t.includes(".")?Sg(i,t):()=>i[t]:t.bind(i,i);let r;Je(e)?r=e:(r=e.handler,n=e);const o=sa(this),a=ed(s,r.bind(i),n);return o(),a}function Sg(t,e){const n=e.split(".");return()=>{let i=t;for(let s=0;s<n.length&&i;s++)i=i[n[s]];return i}}const ys=new WeakMap,yg=Symbol("_vte"),bg=t=>t.__isTeleport,Ks=t=>t&&(t.disabled||t.disabled===""),vx=t=>t&&(t.defer||t.defer===""),ih=t=>typeof SVGElement<"u"&&t instanceof SVGElement,sh=t=>typeof MathMLElement=="function"&&t instanceof MathMLElement,_u=(t,e)=>{const n=t&&t.to;return kt(n)?e?e(n):null:n},xx={name:"Teleport",__isTeleport:!0,process(t,e,n,i,s,r,o,a,l,c){const{mc:u,pc:d,pbc:f,o:{insert:p,querySelector:g,createText:_,createComment:m,parentNode:h}}=c,v=Ks(e.props);let{dynamicChildren:b}=e;const x=(R,S,M)=>{R.shapeFlag&16&&u(R.children,S,M,s,r,o,a,l)},D=(R=e)=>{const S=Ks(R.props),M=R.target=_u(R.props,g),L=vu(M,R,_,p);M&&(o!=="svg"&&ih(M)?o="svg":o!=="mathml"&&sh(M)&&(o="mathml"),s&&s.isCE&&(s.ce._teleportTargets||(s.ce._teleportTargets=new Set)).add(M),S||(x(R,M,L),To(R,!1)))},C=R=>{const S=()=>{if(ys.get(R)===S){if(ys.delete(R),Ks(R.props)){const M=h(R.el)||n;x(R,M,R.anchor),To(R,!0)}D(R)}};ys.set(R,S),En(S,r)};if(t==null){const R=e.el=_(""),S=e.anchor=_("");if(p(R,n,i),p(S,n,i),vx(e.props)||r&&r.pendingBranch){C(e);return}v&&(x(e,n,S),To(e,!0)),D()}else{e.el=t.el;const R=e.anchor=t.anchor,S=ys.get(t);if(S){S.flags|=8,ys.delete(t),C(e);return}e.targetStart=t.targetStart;const M=e.target=t.target,L=e.targetAnchor=t.targetAnchor,E=Ks(t.props),P=E?n:M,B=E?R:L;if(o==="svg"||ih(M)?o="svg":(o==="mathml"||sh(M))&&(o="mathml"),b?(f(t.dynamicChildren,b,P,s,r,o,a),ad(t,e,!0)):l||d(t,e,P,B,s,r,o,a,!1),v)E?e.props&&t.props&&e.props.to!==t.props.to&&(e.props.to=t.props.to):pa(e,n,R,c,1);else if((e.props&&e.props.to)!==(t.props&&t.props.to)){const Z=e.target=_u(e.props,g);Z&&pa(e,Z,null,c,0)}else E&&pa(e,M,L,c,1);To(e,v)}},remove(t,e,n,{um:i,o:{remove:s}},r){const{shapeFlag:o,children:a,anchor:l,targetStart:c,targetAnchor:u,target:d,props:f}=t;let p=r||!Ks(f);const g=ys.get(t);if(g&&(g.flags|=8,ys.delete(t),p=!1),d&&(s(c),s(u)),r&&s(l),o&16)for(let _=0;_<a.length;_++){const m=a[_];i(m,e,n,p,!!m.dynamicChildren)}},move:pa,hydrate:Sx};function pa(t,e,n,{o:{insert:i},m:s},r=2){r===0&&i(t.targetAnchor,e,n);const{el:o,anchor:a,shapeFlag:l,children:c,props:u}=t,d=r===2;if(d&&i(o,e,n),!ys.has(t)&&(!d||Ks(u))&&l&16)for(let f=0;f<c.length;f++)s(c[f],e,n,2);d&&i(a,e,n)}function Sx(t,e,n,i,s,r,{o:{nextSibling:o,parentNode:a,querySelector:l,insert:c,createText:u}},d){function f(m,h){let v=h;for(;v;){if(v&&v.nodeType===8){if(v.data==="teleport start anchor")e.targetStart=v;else if(v.data==="teleport anchor"){e.targetAnchor=v,m._lpa=e.targetAnchor&&o(e.targetAnchor);break}}v=o(v)}}function p(m,h){h.anchor=d(o(m),h,a(m),n,i,s,r)}const g=e.target=_u(e.props,l),_=Ks(e.props);if(g){const m=g._lpa||g.firstChild;e.shapeFlag&16&&(_?(p(t,e),f(g,m),e.targetAnchor||vu(g,e,u,c,a(t)===g?t:null)):(e.anchor=o(t),f(g,m),e.targetAnchor||vu(g,e,u,c),d(m&&o(m),e,g,n,i,s,r))),To(e,_)}else _&&e.shapeFlag&16&&(p(t,e),e.targetStart=t,e.targetAnchor=o(t));return e.anchor&&o(e.anchor)}const td=xx;function To(t,e){const n=t.ctx;if(n&&n.ut){let i,s;for(e?(i=t.el,s=t.anchor):(i=t.targetStart,s=t.targetAnchor);i&&i!==s;)i.nodeType===1&&i.setAttribute("data-v-owner",n.uid),i=i.nextSibling;n.ut()}}function vu(t,e,n,i,s=null){const r=e.targetStart=n(""),o=e.targetAnchor=n("");return r[yg]=o,t&&(i(r,t,s),i(o,t,s)),o}const Si=Symbol("_leaveCb"),uo=Symbol("_enterCb");function Eg(){const t={isMounted:!1,isLeaving:!1,isUnmounting:!1,leavingVNodes:new Map};return Ds(()=>{t.isMounted=!0}),ql(()=>{t.isUnmounting=!0}),t}const $n=[Function,Array],Mg={mode:String,appear:Boolean,persisted:Boolean,onBeforeEnter:$n,onEnter:$n,onAfterEnter:$n,onEnterCancelled:$n,onBeforeLeave:$n,onLeave:$n,onAfterLeave:$n,onLeaveCancelled:$n,onBeforeAppear:$n,onAppear:$n,onAfterAppear:$n,onAppearCancelled:$n},Tg=t=>{const e=t.subTree;return e.component?Tg(e.component):e},yx={name:"BaseTransition",props:Mg,setup(t,{slots:e}){const n=io(),i=Eg();return()=>{const s=e.default&&nd(e.default(),!0),r=s&&s.length?Ag(s):n.subTree?Ze():void 0;if(!r)return;const o=lt(t),{mode:a}=o;if(i.isLeaving)return pc(r);const l=rh(r);if(!l)return pc(r);let c=Ho(l,o,i,n,d=>c=d);l.type!==_n&&ar(l,c);let u=n.subTree&&rh(n.subTree);if(u&&u.type!==_n&&!Ys(u,l)&&Tg(n).type!==_n){let d=Ho(u,o,i,n);if(ar(u,d),a==="out-in"&&l.type!==_n)return i.isLeaving=!0,d.afterLeave=()=>{i.isLeaving=!1,n.job.flags&8||n.update(),delete d.afterLeave,u=void 0},pc(r);a==="in-out"&&l.type!==_n?d.delayLeave=(f,p,g)=>{const _=wg(i,u);_[String(u.key)]=u,f[Si]=()=>{p(),f[Si]=void 0,delete c.delayedLeave,u=void 0},c.delayedLeave=()=>{g(),delete c.delayedLeave,u=void 0}}:u=void 0}else u&&(u=void 0);return r}}};function Ag(t){let e=t[0];if(t.length>1){for(const n of t)if(n.type!==_n){e=n;break}}return e}const bx=yx;function wg(t,e){const{leavingVNodes:n}=t;let i=n.get(e.type);return i||(i=Object.create(null),n.set(e.type,i)),i}function Ho(t,e,n,i,s){const{appear:r,mode:o,persisted:a=!1,onBeforeEnter:l,onEnter:c,onAfterEnter:u,onEnterCancelled:d,onBeforeLeave:f,onLeave:p,onAfterLeave:g,onLeaveCancelled:_,onBeforeAppear:m,onAppear:h,onAfterAppear:v,onAppearCancelled:b}=e,x=String(t.key),D=wg(n,t),C=(M,L)=>{M&&oi(M,i,9,L)},R=(M,L)=>{const E=L[1];C(M,L),Xe(M)?M.every(P=>P.length<=1)&&E():M.length<=1&&E()},S={mode:o,persisted:a,beforeEnter(M){let L=l;if(!n.isMounted)if(r)L=m||l;else return;M[Si]&&M[Si](!0);const E=D[x];E&&Ys(t,E)&&E.el[Si]&&E.el[Si](),C(L,[M])},enter(M){if(D[x]===t)return;let L=c,E=u,P=d;if(!n.isMounted)if(r)L=h||c,E=v||u,P=b||d;else return;let B=!1;M[uo]=G=>{B||(B=!0,G?C(P,[M]):C(E,[M]),S.delayedLeave&&S.delayedLeave(),M[uo]=void 0)};const Z=M[uo].bind(null,!1);L?R(L,[M,Z]):Z()},leave(M,L){const E=String(t.key);if(M[uo]&&M[uo](!0),n.isUnmounting)return L();C(f,[M]);let P=!1;M[Si]=Z=>{P||(P=!0,L(),Z?C(_,[M]):C(g,[M]),M[Si]=void 0,D[E]===t&&delete D[E])};const B=M[Si].bind(null,!1);D[E]=t,p?R(p,[M,B]):B()},clone(M){const L=Ho(M,e,n,i,s);return s&&s(L),L}};return S}function pc(t){if($l(t))return t=Rs(t),t.children=null,t}function rh(t){if(!$l(t))return bg(t.type)&&t.children?Ag(t.children):t;if(t.component)return t.component.subTree;const{shapeFlag:e,children:n}=t;if(n){if(e&16)return n[0];if(e&32&&Je(n.default))return n.default()}}function ar(t,e){t.shapeFlag&6&&t.component?(t.transition=e,ar(t.component.subTree,e)):t.shapeFlag&128?(t.ssContent.transition=e.clone(t.ssContent),t.ssFallback.transition=e.clone(t.ssFallback)):t.transition=e}function nd(t,e=!1,n){let i=[],s=0;for(let r=0;r<t.length;r++){let o=t[r];const a=n==null?o.key:String(n)+String(o.key!=null?o.key:r);o.type===wt?(o.patchFlag&128&&s++,i=i.concat(nd(o.children,e,a))):(e||o.type!==_n)&&i.push(a!=null?Rs(o,{key:a}):o)}if(s>1)for(let r=0;r<i.length;r++)i[r].patchFlag=-2;return i}function Vt(t,e){return Je(t)?Qt({name:t.name},e,{setup:t}):t}function Cg(t){t.ids=[t.ids[0]+t.ids[2]+++"-",0,0]}function oh(t,e){let n;return!!((n=Object.getOwnPropertyDescriptor(t,e))&&!n.configurable)}const ul=new WeakMap;function No(t,e,n,i,s=!1){if(Xe(t)){t.forEach((_,m)=>No(_,e&&(Xe(e)?e[m]:e),n,i,s));return}if(kr(i)&&!s){i.shapeFlag&512&&i.type.__asyncResolved&&i.component.subTree.component&&No(t,e,n,i.component.subTree);return}const r=i.shapeFlag&4?Yl(i.component):i.el,o=s?null:r,{i:a,r:l}=t,c=e&&e.r,u=a.refs===Ut?a.refs={}:a.refs,d=a.setupState,f=lt(d),p=d===Ut?Hm:_=>oh(u,_)?!1:Mt(f,_),g=(_,m)=>!(m&&oh(u,m));if(c!=null&&c!==l){if(ah(e),kt(c))u[c]=null,p(c)&&(d[c]=null);else if(Bt(c)){const _=e;g(c,_.k)&&(c.value=null),_.k&&(u[_.k]=null)}}if(Je(l))na(l,a,12,[o,u]);else{const _=kt(l),m=Bt(l);if(_||m){const h=()=>{if(t.f){const v=_?p(l)?d[l]:u[l]:g()||!t.k?l.value:u[t.k];if(s)Xe(v)&&Wf(v,r);else if(Xe(v))v.includes(r)||v.push(r);else if(_)u[l]=[r],p(l)&&(d[l]=u[l]);else{const b=[r];g(l,t.k)&&(l.value=b),t.k&&(u[t.k]=b)}}else _?(u[l]=o,p(l)&&(d[l]=o)):m&&(g(l,t.k)&&(l.value=o),t.k&&(u[t.k]=o))};if(o){const v=()=>{h(),ul.delete(t)};v.id=-1,ul.set(t,v),En(v,n)}else ah(t),h()}}}function ah(t){const e=ul.get(t);e&&(e.flags|=8,ul.delete(t))}kl().requestIdleCallback;kl().cancelIdleCallback;const kr=t=>!!t.type.__asyncLoader,$l=t=>t.type.__isKeepAlive;function Ex(t,e){Rg(t,"a",e)}function Mx(t,e){Rg(t,"da",e)}function Rg(t,e,n=vn){const i=t.__wdc||(t.__wdc=()=>{let s=n;for(;s;){if(s.isDeactivated)return;s=s.parent}return t()});if(Xl(e,i,n),n){let s=n.parent;for(;s&&s.parent;)$l(s.parent.vnode)&&Tx(i,e,n,s),s=s.parent}}function Tx(t,e,n,i){const s=Xl(e,t,i,!0);no(()=>{Wf(i[e],s)},n)}function Xl(t,e,n=vn,i=!1){if(n){const s=n[t]||(n[t]=[]),r=e.__weh||(e.__weh=(...o)=>{ns();const a=sa(n),l=oi(e,n,t,o);return a(),is(),l});return i?s.unshift(r):s.push(r),r}}const as=t=>(e,n=vn)=>{(!$o||t==="sp")&&Xl(t,(...i)=>e(...i),n)},Ax=as("bm"),Ds=as("m"),wx=as("bu"),Pg=as("u"),ql=as("bum"),no=as("um"),Cx=as("sp"),Rx=as("rtg"),Px=as("rtc");function Ix(t,e=vn){Xl("ec",t,e)}const id="components",Lx="directives";function fl(t,e){return sd(id,t,!0,e)||t}const Ig=Symbol.for("v-ndc");function Go(t){return kt(t)?sd(id,t,!1)||t:t||Ig}function Dx(t){return sd(Lx,t)}function sd(t,e,n=!0,i=!1){const s=un||vn;if(s){const r=s.type;if(t===id){const a=gS(r,!1);if(a&&(a===e||a===Cn(e)||a===Ol(Cn(e))))return r}const o=lh(s[t]||r[t],e)||lh(s.appContext[t],e);return!o&&i?r:o}}function lh(t,e){return t&&(t[e]||t[Cn(e)]||t[Ol(Cn(e))])}function Wr(t,e,n,i){let s;const r=n&&n[i],o=Xe(t);if(o||kt(t)){const a=o&&wi(t);let l=!1,c=!1;a&&(l=!Bn(t),c=ss(t),t=zl(t)),s=new Array(t.length);for(let u=0,d=t.length;u<d;u++)s[u]=e(l?c?Gr(ri(t[u])):ri(t[u]):t[u],u,void 0,r&&r[u])}else if(typeof t=="number"){s=new Array(t);for(let a=0;a<t;a++)s[a]=e(a+1,a,void 0,r&&r[a])}else if(St(t))if(t[Symbol.iterator])s=Array.from(t,(a,l)=>e(a,l,void 0,r&&r[l]));else{const a=Object.keys(t);s=new Array(a.length);for(let l=0,c=a.length;l<c;l++){const u=a[l];s[l]=e(t[u],u,l,r&&r[l])}}else s=[];return n&&(n[i]=s),s}function xn(t,e,n={},i,s){if(un.ce||un.parent&&kr(un.parent)&&un.parent.ce){const c=Object.keys(n).length>0;return e!=="default"&&(n.name=e),xe(),ln(wt,null,[qe("slot",n,i&&i())],c?-2:64)}let r=t[e];r&&r._c&&(r._d=!1),xe();const o=r&&Lg(r(n)),a=n.key||o&&o.key,l=ln(wt,{key:(a&&!Gn(a)?a:`_${e}`)+(!o&&i?"_fb":"")},o||(i?i():[]),o&&t._===1?64:-2);return!s&&l.scopeId&&(l.slotScopeIds=[l.scopeId+"-s"]),r&&r._c&&(r._d=!0),l}function Lg(t){return t.some(e=>Wo(e)?!(e.type===_n||e.type===wt&&!Lg(e.children)):!0)?t:null}function Nx(t,e){const n={};for(const i in t)n[e&&/[A-Z]/.test(i)?`on:${i}`:$a(i)]=t[i];return n}const xu=t=>t?Qg(t)?Yl(t):xu(t.parent):null,Uo=Qt(Object.create(null),{$:t=>t,$el:t=>t.vnode.el,$data:t=>t.data,$props:t=>t.props,$attrs:t=>t.attrs,$slots:t=>t.slots,$refs:t=>t.refs,$parent:t=>xu(t.parent),$root:t=>xu(t.root),$host:t=>t.ce,$emit:t=>t.emit,$options:t=>Ug(t),$forceUpdate:t=>t.f||(t.f=()=>{Qf(t.update)}),$nextTick:t=>t.n||(t.n=ai.bind(t.proxy)),$watch:t=>_x.bind(t)}),mc=(t,e)=>t!==Ut&&!t.__isScriptSetup&&Mt(t,e),Ux={get({_:t},e){if(e==="__v_skip")return!0;const{ctx:n,setupState:i,data:s,props:r,accessCache:o,type:a,appContext:l}=t;if(e[0]!=="$"){const f=o[e];if(f!==void 0)switch(f){case 1:return i[e];case 2:return s[e];case 4:return n[e];case 3:return r[e]}else{if(mc(i,e))return o[e]=1,i[e];if(s!==Ut&&Mt(s,e))return o[e]=2,s[e];if(Mt(r,e))return o[e]=3,r[e];if(n!==Ut&&Mt(n,e))return o[e]=4,n[e];Su&&(o[e]=0)}}const c=Uo[e];let u,d;if(c)return e==="$attrs"&&gn(t.attrs,"get",""),c(t);if((u=a.__cssModules)&&(u=u[e]))return u;if(n!==Ut&&Mt(n,e))return o[e]=4,n[e];if(d=l.config.globalProperties,Mt(d,e))return d[e]},set({_:t},e,n){const{data:i,setupState:s,ctx:r}=t;return mc(s,e)?(s[e]=n,!0):i!==Ut&&Mt(i,e)?(i[e]=n,!0):Mt(t.props,e)||e[0]==="$"&&e.slice(1)in t?!1:(r[e]=n,!0)},has({_:{data:t,setupState:e,accessCache:n,ctx:i,appContext:s,props:r,type:o}},a){let l;return!!(n[a]||t!==Ut&&a[0]!=="$"&&Mt(t,a)||mc(e,a)||Mt(r,a)||Mt(i,a)||Mt(Uo,a)||Mt(s.config.globalProperties,a)||(l=o.__cssModules)&&l[a])},defineProperty(t,e,n){return n.get!=null?t._.accessCache[e]=0:Mt(n,"value")&&this.set(t,e,n.value,null),Reflect.defineProperty(t,e,n)}};function Ox(){return Dg().slots}function qL(){return Dg().attrs}function Dg(t){const e=io();return e.setupContext||(e.setupContext=t_(e))}function ch(t){return Xe(t)?t.reduce((e,n)=>(e[n]=null,e),{}):t}function KL(t,e){const n={};for(const i in t)e.includes(i)||Object.defineProperty(n,i,{enumerable:!0,get:()=>t[i]});return n}let Su=!0;function Fx(t){const e=Ug(t),n=t.proxy,i=t.ctx;Su=!1,e.beforeCreate&&uh(e.beforeCreate,t,"bc");const{data:s,computed:r,methods:o,watch:a,provide:l,inject:c,created:u,beforeMount:d,mounted:f,beforeUpdate:p,updated:g,activated:_,deactivated:m,beforeDestroy:h,beforeUnmount:v,destroyed:b,unmounted:x,render:D,renderTracked:C,renderTriggered:R,errorCaptured:S,serverPrefetch:M,expose:L,inheritAttrs:E,components:P,directives:B,filters:Z}=e;if(c&&kx(c,i,null),o)for(const $ in o){const le=o[$];Je(le)&&(i[$]=le.bind(n))}if(s){const $=s.call(n,n);St($)&&(t.data=to($))}if(Su=!0,r)for(const $ in r){const le=r[$],me=Je(le)?le.bind(n,n):Je(le.get)?le.get.bind(n,n):Ai,Se=!Je(le)&&Je(le.set)?le.set.bind(n):Ai,Ce=rt({get:me,set:Se});Object.defineProperty(i,$,{enumerable:!0,configurable:!0,get:()=>Ce.value,set:Pe=>Ce.value=Pe})}if(a)for(const $ in a)Ng(a[$],i,n,$);if(l){const $=Je(l)?l.call(n):l;Reflect.ownKeys($).forEach(le=>{qa(le,$[le])})}u&&uh(u,t,"c");function X($,le){Xe(le)?le.forEach(me=>$(me.bind(n))):le&&$(le.bind(n))}if(X(Ax,d),X(Ds,f),X(wx,p),X(Pg,g),X(Ex,_),X(Mx,m),X(Ix,S),X(Px,C),X(Rx,R),X(ql,v),X(no,x),X(Cx,M),Xe(L))if(L.length){const $=t.exposed||(t.exposed={});L.forEach(le=>{Object.defineProperty($,le,{get:()=>n[le],set:me=>n[le]=me,enumerable:!0})})}else t.exposed||(t.exposed={});D&&t.render===Ai&&(t.render=D),E!=null&&(t.inheritAttrs=E),P&&(t.components=P),B&&(t.directives=B),M&&Cg(t)}function kx(t,e,n=Ai){Xe(t)&&(t=yu(t));for(const i in t){const s=t[i];let r;St(s)?"default"in s?r=zn(s.from||i,s.default,!0):r=zn(s.from||i):r=zn(s),Bt(r)?Object.defineProperty(e,i,{enumerable:!0,configurable:!0,get:()=>r.value,set:o=>r.value=o}):e[i]=r}}function uh(t,e,n){oi(Xe(t)?t.map(i=>i.bind(e.proxy)):t.bind(e.proxy),e,n)}function Ng(t,e,n,i){let s=i.includes(".")?Sg(n,i):()=>n[i];if(kt(t)){const r=e[t];Je(r)&&Vn(s,r)}else if(Je(t))Vn(s,t.bind(n));else if(St(t))if(Xe(t))t.forEach(r=>Ng(r,e,n,i));else{const r=Je(t.handler)?t.handler.bind(n):e[t.handler];Je(r)&&Vn(s,r,t)}}function Ug(t){const e=t.type,{mixins:n,extends:i}=e,{mixins:s,optionsCache:r,config:{optionMergeStrategies:o}}=t.appContext,a=r.get(e);let l;return a?l=a:!s.length&&!n&&!i?l=e:(l={},s.length&&s.forEach(c=>dl(l,c,o,!0)),dl(l,e,o)),St(e)&&r.set(e,l),l}function dl(t,e,n,i=!1){const{mixins:s,extends:r}=e;r&&dl(t,r,n,!0),s&&s.forEach(o=>dl(t,o,n,!0));for(const o in e)if(!(i&&o==="expose")){const a=Bx[o]||n&&n[o];t[o]=a?a(t[o],e[o]):e[o]}return t}const Bx={data:fh,props:dh,emits:dh,methods:Ao,computed:Ao,beforeCreate:yn,created:yn,beforeMount:yn,mounted:yn,beforeUpdate:yn,updated:yn,beforeDestroy:yn,beforeUnmount:yn,destroyed:yn,unmounted:yn,activated:yn,deactivated:yn,errorCaptured:yn,serverPrefetch:yn,components:Ao,directives:Ao,watch:Vx,provide:fh,inject:zx};function fh(t,e){return e?t?function(){return Qt(Je(t)?t.call(this,this):t,Je(e)?e.call(this,this):e)}:e:t}function zx(t,e){return Ao(yu(t),yu(e))}function yu(t){if(Xe(t)){const e={};for(let n=0;n<t.length;n++)e[t[n]]=t[n];return e}return t}function yn(t,e){return t?[...new Set([].concat(t,e))]:e}function Ao(t,e){return t?Qt(Object.create(null),t,e):e}function dh(t,e){return t?Xe(t)&&Xe(e)?[...new Set([...t,...e])]:Qt(Object.create(null),ch(t),ch(e??{})):e}function Vx(t,e){if(!t)return e;if(!e)return t;const n=Qt(Object.create(null),t);for(const i in e)n[i]=yn(t[i],e[i]);return n}function Og(){return{app:null,config:{isNativeTag:Hm,performance:!1,globalProperties:{},optionMergeStrategies:{},errorHandler:void 0,warnHandler:void 0,compilerOptions:{}},mixins:[],components:{},directives:{},provides:Object.create(null),optionsCache:new WeakMap,propsCache:new WeakMap,emitsCache:new WeakMap}}let Hx=0;function Gx(t,e){return function(i,s=null){Je(i)||(i=Qt({},i)),s!=null&&!St(s)&&(s=null);const r=Og(),o=new WeakSet,a=[];let l=!1;const c=r.app={_uid:Hx++,_component:i,_props:s,_container:null,_context:r,_instance:null,version:vS,get config(){return r.config},set config(u){},use(u,...d){return o.has(u)||(u&&Je(u.install)?(o.add(u),u.install(c,...d)):Je(u)&&(o.add(u),u(c,...d))),c},mixin(u){return r.mixins.includes(u)||r.mixins.push(u),c},component(u,d){return d?(r.components[u]=d,c):r.components[u]},directive(u,d){return d?(r.directives[u]=d,c):r.directives[u]},mount(u,d,f){if(!l){const p=c._ceVNode||qe(i,s);return p.appContext=r,f===!0?f="svg":f===!1&&(f=void 0),t(p,u,f),l=!0,c._container=u,u.__vue_app__=c,Yl(p.component)}},onUnmount(u){a.push(u)},unmount(){l&&(oi(a,c._instance,16),t(null,c._container),delete c._container.__vue_app__)},provide(u,d){return r.provides[u]=d,c},runWithContext(u){const d=rr;rr=c;try{return u()}finally{rr=d}}};return c}}let rr=null;const Wx=(t,e)=>e==="modelValue"||e==="model-value"?t.modelModifiers:t[`${e}Modifiers`]||t[`${Cn(e)}Modifiers`]||t[`${Ls(e)}Modifiers`];function $x(t,e,...n){if(t.isUnmounted)return;const i=t.vnode.props||Ut;let s=n;const r=e.startsWith("update:"),o=r&&Wx(i,e.slice(7));o&&(o.trim&&(s=n.map(u=>kt(u)?u.trim():u)),o.number&&(s=n.map(Fl)));let a,l=i[a=$a(e)]||i[a=$a(Cn(e))];!l&&r&&(l=i[a=$a(Ls(e))]),l&&oi(l,t,6,s);const c=i[a+"Once"];if(c){if(!t.emitted)t.emitted={};else if(t.emitted[a])return;t.emitted[a]=!0,oi(c,t,6,s)}}const Xx=new WeakMap;function Fg(t,e,n=!1){const i=n?Xx:e.emitsCache,s=i.get(t);if(s!==void 0)return s;const r=t.emits;let o={},a=!1;if(!Je(t)){const l=c=>{const u=Fg(c,e,!0);u&&(a=!0,Qt(o,u))};!n&&e.mixins.length&&e.mixins.forEach(l),t.extends&&l(t.extends),t.mixins&&t.mixins.forEach(l)}return!r&&!a?(St(t)&&i.set(t,null),null):(Xe(r)?r.forEach(l=>o[l]=null):Qt(o,r),St(t)&&i.set(t,o),o)}function Kl(t,e){return!t||!Il(e)?!1:(e=e.slice(2).replace(/Once$/,""),Mt(t,e[0].toLowerCase()+e.slice(1))||Mt(t,Ls(e))||Mt(t,e))}function hh(t){const{type:e,vnode:n,proxy:i,withProxy:s,propsOptions:[r],slots:o,attrs:a,emit:l,render:c,renderCache:u,props:d,data:f,setupState:p,ctx:g,inheritAttrs:_}=t,m=ll(t);let h,v;try{if(n.shapeFlag&4){const x=s||i,D=x;h=bi(c.call(D,x,u,d,p,f,g)),v=a}else{const x=e;h=bi(x.length>1?x(d,{attrs:a,slots:o,emit:l}):x(d,null)),v=e.props?a:qx(a)}}catch(x){Oo.length=0,Gl(x,t,1),h=qe(_n)}let b=h;if(v&&_!==!1){const x=Object.keys(v),{shapeFlag:D}=b;x.length&&D&7&&(r&&x.some(Ll)&&(v=Kx(v,r)),b=Rs(b,v,!1,!0))}return n.dirs&&(b=Rs(b,null,!1,!0),b.dirs=b.dirs?b.dirs.concat(n.dirs):n.dirs),n.transition&&ar(b,n.transition),h=b,ll(m),h}const qx=t=>{let e;for(const n in t)(n==="class"||n==="style"||Il(n))&&((e||(e={}))[n]=t[n]);return e},Kx=(t,e)=>{const n={};for(const i in t)(!Ll(i)||!(i.slice(9)in e))&&(n[i]=t[i]);return n};function Yx(t,e,n){const{props:i,children:s,component:r}=t,{props:o,children:a,patchFlag:l}=e,c=r.emitsOptions;if(e.dirs||e.transition)return!0;if(n&&l>=0){if(l&1024)return!0;if(l&16)return i?ph(i,o,c):!!o;if(l&8){const u=e.dynamicProps;for(let d=0;d<u.length;d++){const f=u[d];if(kg(o,i,f)&&!Kl(c,f))return!0}}}else return(s||a)&&(!a||!a.$stable)?!0:i===o?!1:i?o?ph(i,o,c):!0:!!o;return!1}function ph(t,e,n){const i=Object.keys(e);if(i.length!==Object.keys(t).length)return!0;for(let s=0;s<i.length;s++){const r=i[s];if(kg(e,t,r)&&!Kl(n,r))return!0}return!1}function kg(t,e,n){const i=t[n],s=e[n];return n==="style"&&St(i)&&St(s)?!ta(i,s):i!==s}function jx({vnode:t,parent:e,suspense:n},i){for(;e;){const s=e.subTree;if(s.suspense&&s.suspense.activeBranch===t&&(s.suspense.vnode.el=s.el=i,t=s),s===t)(t=e.vnode).el=i,e=e.parent;else break}n&&n.activeBranch===t&&(n.vnode.el=i)}const Bg={},zg=()=>Object.create(Bg),Vg=t=>Object.getPrototypeOf(t)===Bg;function Zx(t,e,n,i=!1){const s={},r=zg();t.propsDefaults=Object.create(null),Hg(t,e,s,r);for(const o in t.propsOptions[0])o in s||(s[o]=void 0);n?t.props=i?s:Zf(s):t.type.props?t.props=s:t.props=r,t.attrs=r}function Jx(t,e,n,i){const{props:s,attrs:r,vnode:{patchFlag:o}}=t,a=lt(s),[l]=t.propsOptions;let c=!1;if((i||o>0)&&!(o&16)){if(o&8){const u=t.vnode.dynamicProps;for(let d=0;d<u.length;d++){let f=u[d];if(Kl(t.emitsOptions,f))continue;const p=e[f];if(l)if(Mt(r,f))p!==r[f]&&(r[f]=p,c=!0);else{const g=Cn(f);s[g]=bu(l,a,g,p,t,!1)}else p!==r[f]&&(r[f]=p,c=!0)}}}else{Hg(t,e,s,r)&&(c=!0);let u;for(const d in a)(!e||!Mt(e,d)&&((u=Ls(d))===d||!Mt(e,u)))&&(l?n&&(n[d]!==void 0||n[u]!==void 0)&&(s[d]=bu(l,a,d,void 0,t,!0)):delete s[d]);if(r!==a)for(const d in r)(!e||!Mt(e,d))&&(delete r[d],c=!0)}c&&qi(t.attrs,"set","")}function Hg(t,e,n,i){const[s,r]=t.propsOptions;let o=!1,a;if(e)for(let l in e){if(Io(l))continue;const c=e[l];let u;s&&Mt(s,u=Cn(l))?!r||!r.includes(u)?n[u]=c:(a||(a={}))[u]=c:Kl(t.emitsOptions,l)||(!(l in i)||c!==i[l])&&(i[l]=c,o=!0)}if(r){const l=lt(n),c=a||Ut;for(let u=0;u<r.length;u++){const d=r[u];n[d]=bu(s,l,d,c[d],t,!Mt(c,d))}}return o}function bu(t,e,n,i,s,r){const o=t[n];if(o!=null){const a=Mt(o,"default");if(a&&i===void 0){const l=o.default;if(o.type!==Function&&!o.skipFactory&&Je(l)){const{propsDefaults:c}=s;if(n in c)i=c[n];else{const u=sa(s);i=c[n]=l.call(null,e),u()}}else i=l;s.ce&&s.ce._setProp(n,i)}o[0]&&(r&&!a?i=!1:o[1]&&(i===""||i===Ls(n))&&(i=!0))}return i}const Qx=new WeakMap;function Gg(t,e,n=!1){const i=n?Qx:e.propsCache,s=i.get(t);if(s)return s;const r=t.props,o={},a=[];let l=!1;if(!Je(t)){const u=d=>{l=!0;const[f,p]=Gg(d,e,!0);Qt(o,f),p&&a.push(...p)};!n&&e.mixins.length&&e.mixins.forEach(u),t.extends&&u(t.extends),t.mixins&&t.mixins.forEach(u)}if(!r&&!l)return St(t)&&i.set(t,Ur),Ur;if(Xe(r))for(let u=0;u<r.length;u++){const d=Cn(r[u]);mh(d)&&(o[d]=Ut)}else if(r)for(const u in r){const d=Cn(u);if(mh(d)){const f=r[u],p=o[d]=Xe(f)||Je(f)?{type:f}:Qt({},f),g=p.type;let _=!1,m=!0;if(Xe(g))for(let h=0;h<g.length;++h){const v=g[h],b=Je(v)&&v.name;if(b==="Boolean"){_=!0;break}else b==="String"&&(m=!1)}else _=Je(g)&&g.name==="Boolean";p[0]=_,p[1]=m,(_||Mt(p,"default"))&&a.push(d)}}const c=[o,a];return St(t)&&i.set(t,c),c}function mh(t){return t[0]!=="$"&&!Io(t)}const rd=t=>t==="_"||t==="_ctx"||t==="$stable",od=t=>Xe(t)?t.map(bi):[bi(t)],eS=(t,e,n)=>{if(e._n)return e;const i=Et((...s)=>od(e(...s)),n);return i._c=!1,i},Wg=(t,e,n)=>{const i=t._ctx;for(const s in t){if(rd(s))continue;const r=t[s];if(Je(r))e[s]=eS(s,r,i);else if(r!=null){const o=od(r);e[s]=()=>o}}},$g=(t,e)=>{const n=od(e);t.slots.default=()=>n},Xg=(t,e,n)=>{for(const i in e)(n||!rd(i))&&(t[i]=e[i])},tS=(t,e,n)=>{const i=t.slots=zg();if(t.vnode.shapeFlag&32){const s=e._;s?(Xg(i,e,n),n&&Xm(i,"_",s,!0)):Wg(e,i)}else e&&$g(t,e)},nS=(t,e,n)=>{const{vnode:i,slots:s}=t;let r=!0,o=Ut;if(i.shapeFlag&32){const a=e._;a?n&&a===1?r=!1:Xg(s,e,n):(r=!e.$stable,Wg(e,s)),o=e}else e&&($g(t,e),o={default:1});if(r)for(const a in s)!rd(a)&&o[a]==null&&delete s[a]},En=aS;function iS(t){return sS(t)}function sS(t,e){const n=kl();n.__VUE__=!0;const{insert:i,remove:s,patchProp:r,createElement:o,createText:a,createComment:l,setText:c,setElementText:u,parentNode:d,nextSibling:f,setScopeId:p=Ai,insertStaticContent:g}=t,_=(T,I,V,Y=null,J=null,ae=null,U=void 0,O=null,A=!!I.dynamicChildren)=>{if(T===I)return;T&&!Ys(T,I)&&(Y=j(T),Pe(T,J,ae,!0),T=null),I.patchFlag===-2&&(A=!1,I.dynamicChildren=null);const{type:k,ref:z,shapeFlag:ee}=I;switch(k){case ia:m(T,I,V,Y);break;case _n:h(T,I,V,Y);break;case Ka:T==null&&v(I,V,Y,U);break;case wt:P(T,I,V,Y,J,ae,U,O,A);break;default:ee&1?D(T,I,V,Y,J,ae,U,O,A):ee&6?B(T,I,V,Y,J,ae,U,O,A):(ee&64||ee&128)&&k.process(T,I,V,Y,J,ae,U,O,A,ge)}z!=null&&J?No(z,T&&T.ref,ae,I||T,!I):z==null&&T&&T.ref!=null&&No(T.ref,null,ae,T,!0)},m=(T,I,V,Y)=>{if(T==null)i(I.el=a(I.children),V,Y);else{const J=I.el=T.el;I.children!==T.children&&c(J,I.children)}},h=(T,I,V,Y)=>{T==null?i(I.el=l(I.children||""),V,Y):I.el=T.el},v=(T,I,V,Y)=>{[T.el,T.anchor]=g(T.children,I,V,Y,T.el,T.anchor)},b=({el:T,anchor:I},V,Y)=>{let J;for(;T&&T!==I;)J=f(T),i(T,V,Y),T=J;i(I,V,Y)},x=({el:T,anchor:I})=>{let V;for(;T&&T!==I;)V=f(T),s(T),T=V;s(I)},D=(T,I,V,Y,J,ae,U,O,A)=>{if(I.type==="svg"?U="svg":I.type==="math"&&(U="mathml"),T==null)C(I,V,Y,J,ae,U,O,A);else{const k=T.el&&T.el._isVueCE?T.el:null;try{k&&k._beginPatch(),M(T,I,J,ae,U,O,A)}finally{k&&k._endPatch()}}},C=(T,I,V,Y,J,ae,U,O)=>{let A,k;const{props:z,shapeFlag:ee,transition:F,dirs:K}=T;if(A=T.el=o(T.type,ae,z&&z.is,z),ee&8?u(A,T.children):ee&16&&S(T.children,A,null,Y,J,gc(T,ae),U,O),K&&ks(T,null,Y,"created"),R(A,T,T.scopeId,U,Y),z){for(const y in z)y!=="value"&&!Io(y)&&r(A,y,null,z[y],ae,Y);"value"in z&&r(A,"value",null,z.value,ae),(k=z.onVnodeBeforeMount)&&hi(k,Y,T)}K&&ks(T,null,Y,"beforeMount");const w=rS(J,F);w&&F.beforeEnter(A),i(A,I,V),((k=z&&z.onVnodeMounted)||w||K)&&En(()=>{try{k&&hi(k,Y,T),w&&F.enter(A),K&&ks(T,null,Y,"mounted")}finally{}},J)},R=(T,I,V,Y,J)=>{if(V&&p(T,V),Y)for(let ae=0;ae<Y.length;ae++)p(T,Y[ae]);if(J){let ae=J.subTree;if(I===ae||Yg(ae.type)&&(ae.ssContent===I||ae.ssFallback===I)){const U=J.vnode;R(T,U,U.scopeId,U.slotScopeIds,J.parent)}}},S=(T,I,V,Y,J,ae,U,O,A=0)=>{for(let k=A;k<T.length;k++){const z=T[k]=O?Xi(T[k]):bi(T[k]);_(null,z,I,V,Y,J,ae,U,O)}},M=(T,I,V,Y,J,ae,U)=>{const O=I.el=T.el;let{patchFlag:A,dynamicChildren:k,dirs:z}=I;A|=T.patchFlag&16;const ee=T.props||Ut,F=I.props||Ut;let K;if(V&&Bs(V,!1),(K=F.onVnodeBeforeUpdate)&&hi(K,V,I,T),z&&ks(I,T,V,"beforeUpdate"),V&&Bs(V,!0),(ee.innerHTML&&F.innerHTML==null||ee.textContent&&F.textContent==null)&&u(O,""),k?L(T.dynamicChildren,k,O,V,Y,gc(I,J),ae):U||le(T,I,O,null,V,Y,gc(I,J),ae,!1),A>0){if(A&16)E(O,ee,F,V,J);else if(A&2&&ee.class!==F.class&&r(O,"class",null,F.class,J),A&4&&r(O,"style",ee.style,F.style,J),A&8){const w=I.dynamicProps;for(let y=0;y<w.length;y++){const W=w[y],re=ee[W],de=F[W];(de!==re||W==="value")&&r(O,W,re,de,J,V)}}A&1&&T.children!==I.children&&u(O,I.children)}else!U&&k==null&&E(O,ee,F,V,J);((K=F.onVnodeUpdated)||z)&&En(()=>{K&&hi(K,V,I,T),z&&ks(I,T,V,"updated")},Y)},L=(T,I,V,Y,J,ae,U)=>{for(let O=0;O<I.length;O++){const A=T[O],k=I[O],z=A.el&&(A.type===wt||!Ys(A,k)||A.shapeFlag&198)?d(A.el):V;_(A,k,z,null,Y,J,ae,U,!0)}},E=(T,I,V,Y,J)=>{if(I!==V){if(I!==Ut)for(const ae in I)!Io(ae)&&!(ae in V)&&r(T,ae,I[ae],null,J,Y);for(const ae in V){if(Io(ae))continue;const U=V[ae],O=I[ae];U!==O&&ae!=="value"&&r(T,ae,O,U,J,Y)}"value"in V&&r(T,"value",I.value,V.value,J)}},P=(T,I,V,Y,J,ae,U,O,A)=>{const k=I.el=T?T.el:a(""),z=I.anchor=T?T.anchor:a("");let{patchFlag:ee,dynamicChildren:F,slotScopeIds:K}=I;K&&(O=O?O.concat(K):K),T==null?(i(k,V,Y),i(z,V,Y),S(I.children||[],V,z,J,ae,U,O,A)):ee>0&&ee&64&&F&&T.dynamicChildren&&T.dynamicChildren.length===F.length?(L(T.dynamicChildren,F,V,J,ae,U,O),(I.key!=null||J&&I===J.subTree)&&ad(T,I,!0)):le(T,I,V,z,J,ae,U,O,A)},B=(T,I,V,Y,J,ae,U,O,A)=>{I.slotScopeIds=O,T==null?I.shapeFlag&512?J.ctx.activate(I,V,Y,U,A):Z(I,V,Y,J,ae,U,A):G(T,I,A)},Z=(T,I,V,Y,J,ae,U)=>{const O=T.component=dS(T,Y,J);if($l(T)&&(O.ctx.renderer=ge),hS(O,!1,U),O.asyncDep){if(J&&J.registerDep(O,X,U),!T.el){const A=O.subTree=qe(_n);h(null,A,I,V),T.placeholder=A.el}}else X(O,T,I,V,J,ae,U)},G=(T,I,V)=>{const Y=I.component=T.component;if(Yx(T,I,V))if(Y.asyncDep&&!Y.asyncResolved){$(Y,I,V);return}else Y.next=I,Y.update();else I.el=T.el,Y.vnode=I},X=(T,I,V,Y,J,ae,U)=>{const O=()=>{if(T.isMounted){let{next:ee,bu:F,u:K,parent:w,vnode:y}=T;{const be=qg(T);if(be){ee&&(ee.el=y.el,$(T,ee,U)),be.asyncDep.then(()=>{En(()=>{T.isUnmounted||k()},J)});return}}let W=ee,re;Bs(T,!1),ee?(ee.el=y.el,$(T,ee,U)):ee=y,F&&Xa(F),(re=ee.props&&ee.props.onVnodeBeforeUpdate)&&hi(re,w,ee,y),Bs(T,!0);const de=hh(T),ve=T.subTree;T.subTree=de,_(ve,de,d(ve.el),j(ve),T,J,ae),ee.el=de.el,W===null&&jx(T,de.el),K&&En(K,J),(re=ee.props&&ee.props.onVnodeUpdated)&&En(()=>hi(re,w,ee,y),J)}else{let ee;const{el:F,props:K}=I,{bm:w,m:y,parent:W,root:re,type:de}=T,ve=kr(I);Bs(T,!1),w&&Xa(w),!ve&&(ee=K&&K.onVnodeBeforeMount)&&hi(ee,W,I),Bs(T,!0);{re.ce&&re.ce._hasShadowRoot()&&re.ce._injectChildStyle(de,T.parent?T.parent.type:void 0);const be=T.subTree=hh(T);_(null,be,V,Y,T,J,ae),I.el=be.el}if(y&&En(y,J),!ve&&(ee=K&&K.onVnodeMounted)){const be=I;En(()=>hi(ee,W,be),J)}(I.shapeFlag&256||W&&kr(W.vnode)&&W.vnode.shapeFlag&256)&&T.a&&En(T.a,J),T.isMounted=!0,I=V=Y=null}};T.scope.on();const A=T.effect=new Jm(O);T.scope.off();const k=T.update=A.run.bind(A),z=T.job=A.runIfDirty.bind(A);z.i=T,z.id=T.uid,A.scheduler=()=>Qf(z),Bs(T,!0),k()},$=(T,I,V)=>{I.component=T;const Y=T.vnode.props;T.vnode=I,T.next=null,Jx(T,I.props,Y,V),nS(T,I.children,V),ns(),nh(T),is()},le=(T,I,V,Y,J,ae,U,O,A=!1)=>{const k=T&&T.children,z=T?T.shapeFlag:0,ee=I.children,{patchFlag:F,shapeFlag:K}=I;if(F>0){if(F&128){Se(k,ee,V,Y,J,ae,U,O,A);return}else if(F&256){me(k,ee,V,Y,J,ae,U,O,A);return}}K&8?(z&16&&ue(k,J,ae),ee!==k&&u(V,ee)):z&16?K&16?Se(k,ee,V,Y,J,ae,U,O,A):ue(k,J,ae,!0):(z&8&&u(V,""),K&16&&S(ee,V,Y,J,ae,U,O,A))},me=(T,I,V,Y,J,ae,U,O,A)=>{T=T||Ur,I=I||Ur;const k=T.length,z=I.length,ee=Math.min(k,z);let F;for(F=0;F<ee;F++){const K=I[F]=A?Xi(I[F]):bi(I[F]);_(T[F],K,V,null,J,ae,U,O,A)}k>z?ue(T,J,ae,!0,!1,ee):S(I,V,Y,J,ae,U,O,A,ee)},Se=(T,I,V,Y,J,ae,U,O,A)=>{let k=0;const z=I.length;let ee=T.length-1,F=z-1;for(;k<=ee&&k<=F;){const K=T[k],w=I[k]=A?Xi(I[k]):bi(I[k]);if(Ys(K,w))_(K,w,V,null,J,ae,U,O,A);else break;k++}for(;k<=ee&&k<=F;){const K=T[ee],w=I[F]=A?Xi(I[F]):bi(I[F]);if(Ys(K,w))_(K,w,V,null,J,ae,U,O,A);else break;ee--,F--}if(k>ee){if(k<=F){const K=F+1,w=K<z?I[K].el:Y;for(;k<=F;)_(null,I[k]=A?Xi(I[k]):bi(I[k]),V,w,J,ae,U,O,A),k++}}else if(k>F)for(;k<=ee;)Pe(T[k],J,ae,!0),k++;else{const K=k,w=k,y=new Map;for(k=w;k<=F;k++){const Te=I[k]=A?Xi(I[k]):bi(I[k]);Te.key!=null&&y.set(Te.key,k)}let W,re=0;const de=F-w+1;let ve=!1,be=0;const ce=new Array(de);for(k=0;k<de;k++)ce[k]=0;for(k=K;k<=ee;k++){const Te=T[k];if(re>=de){Pe(Te,J,ae,!0);continue}let Le;if(Te.key!=null)Le=y.get(Te.key);else for(W=w;W<=F;W++)if(ce[W-w]===0&&Ys(Te,I[W])){Le=W;break}Le===void 0?Pe(Te,J,ae,!0):(ce[Le-w]=k+1,Le>=be?be=Le:ve=!0,_(Te,I[Le],V,null,J,ae,U,O,A),re++)}const pe=ve?oS(ce):Ur;for(W=pe.length-1,k=de-1;k>=0;k--){const Te=w+k,Le=I[Te],Ae=I[Te+1],Me=Te+1<z?Ae.el||Kg(Ae):Y;ce[k]===0?_(null,Le,V,Me,J,ae,U,O,A):ve&&(W<0||k!==pe[W]?Ce(Le,V,Me,2):W--)}}},Ce=(T,I,V,Y,J=null)=>{const{el:ae,type:U,transition:O,children:A,shapeFlag:k}=T;if(k&6){Ce(T.component.subTree,I,V,Y);return}if(k&128){T.suspense.move(I,V,Y);return}if(k&64){U.move(T,I,V,ge);return}if(U===wt){i(ae,I,V);for(let ee=0;ee<A.length;ee++)Ce(A[ee],I,V,Y);i(T.anchor,I,V);return}if(U===Ka){b(T,I,V);return}if(Y!==2&&k&1&&O)if(Y===0)O.beforeEnter(ae),i(ae,I,V),En(()=>O.enter(ae),J);else{const{leave:ee,delayLeave:F,afterLeave:K}=O,w=()=>{T.ctx.isUnmounted?s(ae):i(ae,I,V)},y=()=>{ae._isLeaving&&ae[Si](!0),ee(ae,()=>{w(),K&&K()})};F?F(ae,w,y):y()}else i(ae,I,V)},Pe=(T,I,V,Y=!1,J=!1)=>{const{type:ae,props:U,ref:O,children:A,dynamicChildren:k,shapeFlag:z,patchFlag:ee,dirs:F,cacheIndex:K,memo:w}=T;if(ee===-2&&(J=!1),O!=null&&(ns(),No(O,null,V,T,!0),is()),K!=null&&(I.renderCache[K]=void 0),z&256){I.ctx.deactivate(T);return}const y=z&1&&F,W=!kr(T);let re;if(W&&(re=U&&U.onVnodeBeforeUnmount)&&hi(re,I,T),z&6)Ge(T.component,V,Y);else{if(z&128){T.suspense.unmount(V,Y);return}y&&ks(T,null,I,"beforeUnmount"),z&64?T.type.remove(T,I,V,ge,Y):k&&!k.hasOnce&&(ae!==wt||ee>0&&ee&64)?ue(k,I,V,!1,!0):(ae===wt&&ee&384||!J&&z&16)&&ue(A,I,V),Y&&Ke(T)}const de=w!=null&&K==null;(W&&(re=U&&U.onVnodeUnmounted)||y||de)&&En(()=>{re&&hi(re,I,T),y&&ks(T,null,I,"unmounted"),de&&(T.el=null)},V)},Ke=T=>{const{type:I,el:V,anchor:Y,transition:J}=T;if(I===wt){Qe(V,Y);return}if(I===Ka){x(T);return}const ae=()=>{s(V),J&&!J.persisted&&J.afterLeave&&J.afterLeave()};if(T.shapeFlag&1&&J&&!J.persisted){const{leave:U,delayLeave:O}=J,A=()=>U(V,ae);O?O(T.el,ae,A):A()}else ae()},Qe=(T,I)=>{let V;for(;T!==I;)V=f(T),s(T),T=V;s(I)},Ge=(T,I,V)=>{const{bum:Y,scope:J,job:ae,subTree:U,um:O,m:A,a:k}=T;gh(A),gh(k),Y&&Xa(Y),J.stop(),ae&&(ae.flags|=8,Pe(U,T,I,V)),O&&En(O,I),En(()=>{T.isUnmounted=!0},I)},ue=(T,I,V,Y=!1,J=!1,ae=0)=>{for(let U=ae;U<T.length;U++)Pe(T[U],I,V,Y,J)},j=T=>{if(T.shapeFlag&6)return j(T.component.subTree);if(T.shapeFlag&128)return T.suspense.next();const I=f(T.anchor||T.el),V=I&&I[yg];return V?f(V):I};let te=!1;const fe=(T,I,V)=>{let Y;T==null?I._vnode&&(Pe(I._vnode,null,null,!0),Y=I._vnode.component):_(I._vnode||null,T,I,null,null,null,V),I._vnode=T,te||(te=!0,nh(Y),vg(),te=!1)},ge={p:_,um:Pe,m:Ce,r:Ke,mt:Z,mc:S,pc:le,pbc:L,n:j,o:t};return{render:fe,hydrate:void 0,createApp:Gx(fe)}}function gc({type:t,props:e},n){return n==="svg"&&t==="foreignObject"||n==="mathml"&&t==="annotation-xml"&&e&&e.encoding&&e.encoding.includes("html")?void 0:n}function Bs({effect:t,job:e},n){n?(t.flags|=32,e.flags|=4):(t.flags&=-33,e.flags&=-5)}function rS(t,e){return(!t||t&&!t.pendingBranch)&&e&&!e.persisted}function ad(t,e,n=!1){const i=t.children,s=e.children;if(Xe(i)&&Xe(s))for(let r=0;r<i.length;r++){const o=i[r];let a=s[r];a.shapeFlag&1&&!a.dynamicChildren&&((a.patchFlag<=0||a.patchFlag===32)&&(a=s[r]=Xi(s[r]),a.el=o.el),!n&&a.patchFlag!==-2&&ad(o,a)),a.type===ia&&(a.patchFlag===-1&&(a=s[r]=Xi(a)),a.el=o.el),a.type===_n&&!a.el&&(a.el=o.el)}}function oS(t){const e=t.slice(),n=[0];let i,s,r,o,a;const l=t.length;for(i=0;i<l;i++){const c=t[i];if(c!==0){if(s=n[n.length-1],t[s]<c){e[i]=s,n.push(i);continue}for(r=0,o=n.length-1;r<o;)a=r+o>>1,t[n[a]]<c?r=a+1:o=a;c<t[n[r]]&&(r>0&&(e[i]=n[r-1]),n[r]=i)}}for(r=n.length,o=n[r-1];r-- >0;)n[r]=o,o=e[o];return n}function qg(t){const e=t.subTree.component;if(e)return e.asyncDep&&!e.asyncResolved?e:qg(e)}function gh(t){if(t)for(let e=0;e<t.length;e++)t[e].flags|=8}function Kg(t){if(t.placeholder)return t.placeholder;const e=t.component;return e?Kg(e.subTree):null}const Yg=t=>t.__isSuspense;function aS(t,e){e&&e.pendingBranch?Xe(t)?e.effects.push(...t):e.effects.push(t):ux(t)}const wt=Symbol.for("v-fgt"),ia=Symbol.for("v-txt"),_n=Symbol.for("v-cmt"),Ka=Symbol.for("v-stc"),Oo=[];let wn=null;function xe(t=!1){Oo.push(wn=t?null:[])}function lS(){Oo.pop(),wn=Oo[Oo.length-1]||null}let $r=1;function hl(t,e=!1){$r+=t,t<0&&wn&&e&&(wn.hasOnce=!0)}function jg(t){return t.dynamicChildren=$r>0?wn||Ur:null,lS(),$r>0&&wn&&wn.push(t),t}function Ie(t,e,n,i,s,r){return jg(H(t,e,n,i,s,r,!0))}function ln(t,e,n,i,s){return jg(qe(t,e,n,i,s,!0))}function Wo(t){return t?t.__v_isVNode===!0:!1}function Ys(t,e){return t.type===e.type&&t.key===e.key}const Zg=({key:t})=>t??null,Ya=({ref:t,ref_key:e,ref_for:n})=>(typeof t=="number"&&(t=""+t),t!=null?kt(t)||Bt(t)||Je(t)?{i:un,r:t,k:e,f:!!n}:t:null);function H(t,e=null,n=null,i=0,s=null,r=t===wt?0:1,o=!1,a=!1){const l={__v_isVNode:!0,__v_skip:!0,type:t,props:e,key:e&&Zg(e),ref:e&&Ya(e),scopeId:Wl,slotScopeIds:null,children:n,component:null,suspense:null,ssContent:null,ssFallback:null,dirs:null,transition:null,el:null,anchor:null,target:null,targetStart:null,targetAnchor:null,staticCount:0,shapeFlag:r,patchFlag:i,dynamicProps:s,dynamicChildren:null,appContext:null,ctx:un};return a?(ld(l,n),r&128&&t.normalize(l)):n&&(l.shapeFlag|=kt(n)?8:16),$r>0&&!o&&wn&&(l.patchFlag>0||r&6)&&l.patchFlag!==32&&wn.push(l),l}const qe=cS;function cS(t,e=null,n=null,i=0,s=null,r=!1){if((!t||t===Ig)&&(t=_n),Wo(t)){const a=Rs(t,e,!0);return n&&ld(a,n),$r>0&&!r&&wn&&(a.shapeFlag&6?wn[wn.indexOf(t)]=a:wn.push(a)),a.patchFlag=-2,a}if(_S(t)&&(t=t.__vccOpts),e){e=Jg(e);let{class:a,style:l}=e;a&&!kt(a)&&(e.class=At(a)),St(l)&&(Vl(l)&&!Xe(l)&&(l=Qt({},l)),e.style=Li(l))}const o=kt(t)?1:Yg(t)?128:bg(t)?64:St(t)?4:Je(t)?2:0;return H(t,e,n,i,s,o,r,!0)}function Jg(t){return t?Vl(t)||Vg(t)?Qt({},t):t:null}function Rs(t,e,n=!1,i=!1){const{props:s,ref:r,patchFlag:o,children:a,transition:l}=t,c=e?cd(s||{},e):s,u={__v_isVNode:!0,__v_skip:!0,type:t.type,props:c,key:c&&Zg(c),ref:e&&e.ref?n&&r?Xe(r)?r.concat(Ya(e)):[r,Ya(e)]:Ya(e):r,scopeId:t.scopeId,slotScopeIds:t.slotScopeIds,children:a,target:t.target,targetStart:t.targetStart,targetAnchor:t.targetAnchor,staticCount:t.staticCount,shapeFlag:t.shapeFlag,patchFlag:e&&t.type!==wt?o===-1?16:o|16:o,dynamicProps:t.dynamicProps,dynamicChildren:t.dynamicChildren,appContext:t.appContext,dirs:t.dirs,transition:l,component:t.component,suspense:t.suspense,ssContent:t.ssContent&&Rs(t.ssContent),ssFallback:t.ssFallback&&Rs(t.ssFallback),placeholder:t.placeholder,el:t.el,anchor:t.anchor,ctx:t.ctx,ce:t.ce};return l&&i&&ar(u,l.clone(u)),u}function or(t=" ",e=0){return qe(ia,null,t,e)}function wo(t,e){const n=qe(Ka,null,t);return n.staticCount=e,n}function Ze(t="",e=!1){return e?(xe(),ln(_n,null,t)):qe(_n,null,t)}function bi(t){return t==null||typeof t=="boolean"?qe(_n):Xe(t)?qe(wt,null,t.slice()):Wo(t)?Xi(t):qe(ia,null,String(t))}function Xi(t){return t.el===null&&t.patchFlag!==-1||t.memo?t:Rs(t)}function ld(t,e){let n=0;const{shapeFlag:i}=t;if(e==null)e=null;else if(Xe(e))n=16;else if(typeof e=="object")if(i&65){const s=e.default;s&&(s._c&&(s._d=!1),ld(t,s()),s._c&&(s._d=!0));return}else{n=32;const s=e._;!s&&!Vg(e)?e._ctx=un:s===3&&un&&(un.slots._===1?e._=1:(e._=2,t.patchFlag|=1024))}else Je(e)?(e={default:e,_ctx:un},n=32):(e=String(e),i&64?(n=16,e=[or(e)]):n=8);t.children=e,t.shapeFlag|=n}function cd(...t){const e={};for(let n=0;n<t.length;n++){const i=t[n];for(const s in i)if(s==="class")e.class!==i.class&&(e.class=At([e.class,i.class]));else if(s==="style")e.style=Li([e.style,i.style]);else if(Il(s)){const r=e[s],o=i[s];o&&r!==o&&!(Xe(r)&&r.includes(o))?e[s]=r?[].concat(r,o):o:o==null&&r==null&&!Ll(s)&&(e[s]=o)}else s!==""&&(e[s]=i[s])}return e}function hi(t,e,n,i=null){oi(t,e,7,[n,i])}const uS=Og();let fS=0;function dS(t,e,n){const i=t.type,s=(e?e.appContext:t.appContext)||uS,r={uid:fS++,vnode:t,type:i,parent:e,appContext:s,root:null,next:null,subTree:null,effect:null,update:null,job:null,scope:new jm(!0),render:null,proxy:null,exposed:null,exposeProxy:null,withProxy:null,provides:e?e.provides:Object.create(s.provides),ids:e?e.ids:["",0,0],accessCache:null,renderCache:[],components:null,directives:null,propsOptions:Gg(i,s),emitsOptions:Fg(i,s),emit:null,emitted:null,propsDefaults:Ut,inheritAttrs:i.inheritAttrs,ctx:Ut,data:Ut,props:Ut,attrs:Ut,slots:Ut,refs:Ut,setupState:Ut,setupContext:null,suspense:n,suspenseId:n?n.pendingId:0,asyncDep:null,asyncResolved:!1,isMounted:!1,isUnmounted:!1,isDeactivated:!1,bc:null,c:null,bm:null,m:null,bu:null,u:null,um:null,bum:null,da:null,a:null,rtg:null,rtc:null,ec:null,sp:null};return r.ctx={_:r},r.root=e?e.root:r,r.emit=$x.bind(null,r),t.ce&&t.ce(r),r}let vn=null;const io=()=>vn||un;let pl,Eu;{const t=kl(),e=(n,i)=>{let s;return(s=t[n])||(s=t[n]=[]),s.push(i),r=>{s.length>1?s.forEach(o=>o(r)):s[0](r)}};pl=e("__VUE_INSTANCE_SETTERS__",n=>vn=n),Eu=e("__VUE_SSR_SETTERS__",n=>$o=n)}const sa=t=>{const e=vn;return pl(t),t.scope.on(),()=>{t.scope.off(),pl(e)}},_h=()=>{vn&&vn.scope.off(),pl(null)};function Qg(t){return t.vnode.shapeFlag&4}let $o=!1;function hS(t,e=!1,n=!1){e&&Eu(e);const{props:i,children:s}=t.vnode,r=Qg(t);Zx(t,i,r,e),tS(t,s,n||e);const o=r?pS(t,e):void 0;return e&&Eu(!1),o}function pS(t,e){const n=t.type;t.accessCache=Object.create(null),t.proxy=new Proxy(t.ctx,Ux);const{setup:i}=n;if(i){ns();const s=t.setupContext=i.length>1?t_(t):null,r=sa(t),o=na(i,t,0,[t.props,s]),a=Gm(o);if(is(),r(),(a||t.sp)&&!kr(t)&&Cg(t),a){if(o.then(_h,_h),e)return o.then(l=>{vh(t,l)}).catch(l=>{Gl(l,t,0)});t.asyncDep=o}else vh(t,o)}else e_(t)}function vh(t,e,n){Je(e)?t.type.__ssrInlineRender?t.ssrRender=e:t.render=e:St(e)&&(t.setupState=pg(e)),e_(t)}function e_(t,e,n){const i=t.type;t.render||(t.render=i.render||Ai);{const s=sa(t);ns();try{Fx(t)}finally{is(),s()}}}const mS={get(t,e){return gn(t,"get",""),t[e]}};function t_(t){const e=n=>{t.exposed=n||{}};return{attrs:new Proxy(t.attrs,mS),slots:t.slots,emit:t.emit,expose:e}}function Yl(t){return t.exposed?t.exposeProxy||(t.exposeProxy=new Proxy(pg(Hl(t.exposed)),{get(e,n){if(n in e)return e[n];if(n in Uo)return Uo[n](t)},has(e,n){return n in e||n in Uo}})):t.proxy}function gS(t,e=!0){return Je(t)?t.displayName||t.name:t.name||e&&t.__name}function _S(t){return Je(t)&&"__vccOpts"in t}const rt=(t,e)=>rx(t,e,$o);function Ps(t,e,n){try{hl(-1);const i=arguments.length;return i===2?St(e)&&!Xe(e)?Wo(e)?qe(t,null,[e]):qe(t,e):qe(t,null,e):(i>3?n=Array.prototype.slice.call(arguments,2):i===3&&Wo(n)&&(n=[n]),qe(t,e,n))}finally{hl(1)}}function YL(t,e){const n=t.memo;if(n.length!=e.length)return!1;for(let i=0;i<n.length;i++)if(ti(n[i],e[i]))return!1;return $r>0&&wn&&wn.push(t),!0}const vS="3.5.34";/**
* @vue/runtime-dom v3.5.34
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/let Mu;const xh=typeof window<"u"&&window.trustedTypes;if(xh)try{Mu=xh.createPolicy("vue",{createHTML:t=>t})}catch{}const n_=Mu?t=>Mu.createHTML(t):t=>t,xS="http://www.w3.org/2000/svg",SS="http://www.w3.org/1998/Math/MathML",$i=typeof document<"u"?document:null,Sh=$i&&$i.createElement("template"),yS={insert:(t,e,n)=>{e.insertBefore(t,n||null)},remove:t=>{const e=t.parentNode;e&&e.removeChild(t)},createElement:(t,e,n,i)=>{const s=e==="svg"?$i.createElementNS(xS,t):e==="mathml"?$i.createElementNS(SS,t):n?$i.createElement(t,{is:n}):$i.createElement(t);return t==="select"&&i&&i.multiple!=null&&s.setAttribute("multiple",i.multiple),s},createText:t=>$i.createTextNode(t),createComment:t=>$i.createComment(t),setText:(t,e)=>{t.nodeValue=e},setElementText:(t,e)=>{t.textContent=e},parentNode:t=>t.parentNode,nextSibling:t=>t.nextSibling,querySelector:t=>$i.querySelector(t),setScopeId(t,e){t.setAttribute(e,"")},insertStaticContent(t,e,n,i,s,r){const o=n?n.previousSibling:e.lastChild;if(s&&(s===r||s.nextSibling))for(;e.insertBefore(s.cloneNode(!0),n),!(s===r||!(s=s.nextSibling)););else{Sh.innerHTML=n_(i==="svg"?`<svg>${t}</svg>`:i==="mathml"?`<math>${t}</math>`:t);const a=Sh.content;if(i==="svg"||i==="mathml"){const l=a.firstChild;for(;l.firstChild;)a.appendChild(l.firstChild);a.removeChild(l)}e.insertBefore(a,n)}return[o?o.nextSibling:e.firstChild,n?n.previousSibling:e.lastChild]}},ds="transition",fo="animation",Xr=Symbol("_vtc"),i_={name:String,type:String,css:{type:Boolean,default:!0},duration:[String,Number,Object],enterFromClass:String,enterActiveClass:String,enterToClass:String,appearFromClass:String,appearActiveClass:String,appearToClass:String,leaveFromClass:String,leaveActiveClass:String,leaveToClass:String},s_=Qt({},Mg,i_),bS=t=>(t.displayName="Transition",t.props=s_,t),Br=bS((t,{slots:e})=>Ps(bx,r_(t),e)),zs=(t,e=[])=>{Xe(t)?t.forEach(n=>n(...e)):t&&t(...e)},yh=t=>t?Xe(t)?t.some(e=>e.length>1):t.length>1:!1;function r_(t){const e={};for(const P in t)P in i_||(e[P]=t[P]);if(t.css===!1)return e;const{name:n="v",type:i,duration:s,enterFromClass:r=`${n}-enter-from`,enterActiveClass:o=`${n}-enter-active`,enterToClass:a=`${n}-enter-to`,appearFromClass:l=r,appearActiveClass:c=o,appearToClass:u=a,leaveFromClass:d=`${n}-leave-from`,leaveActiveClass:f=`${n}-leave-active`,leaveToClass:p=`${n}-leave-to`}=t,g=ES(s),_=g&&g[0],m=g&&g[1],{onBeforeEnter:h,onEnter:v,onEnterCancelled:b,onLeave:x,onLeaveCancelled:D,onBeforeAppear:C=h,onAppear:R=v,onAppearCancelled:S=b}=e,M=(P,B,Z,G)=>{P._enterCancelled=G,bs(P,B?u:a),bs(P,B?c:o),Z&&Z()},L=(P,B)=>{P._isLeaving=!1,bs(P,d),bs(P,p),bs(P,f),B&&B()},E=P=>(B,Z)=>{const G=P?R:v,X=()=>M(B,P,Z);zs(G,[B,X]),bh(()=>{bs(B,P?l:r),vi(B,P?u:a),yh(G)||Eh(B,i,_,X)})};return Qt(e,{onBeforeEnter(P){zs(h,[P]),vi(P,r),vi(P,o)},onBeforeAppear(P){zs(C,[P]),vi(P,l),vi(P,c)},onEnter:E(!1),onAppear:E(!0),onLeave(P,B){P._isLeaving=!0;const Z=()=>L(P,B);vi(P,d),P._enterCancelled?(vi(P,f),Tu(P)):(Tu(P),vi(P,f)),bh(()=>{P._isLeaving&&(bs(P,d),vi(P,p),yh(x)||Eh(P,i,m,Z))}),zs(x,[P,Z])},onEnterCancelled(P){M(P,!1,void 0,!0),zs(b,[P])},onAppearCancelled(P){M(P,!0,void 0,!0),zs(S,[P])},onLeaveCancelled(P){L(P),zs(D,[P])}})}function ES(t){if(t==null)return null;if(St(t))return[_c(t.enter),_c(t.leave)];{const e=_c(t);return[e,e]}}function _c(t){return bv(t)}function vi(t,e){e.split(/\s+/).forEach(n=>n&&t.classList.add(n)),(t[Xr]||(t[Xr]=new Set)).add(e)}function bs(t,e){e.split(/\s+/).forEach(i=>i&&t.classList.remove(i));const n=t[Xr];n&&(n.delete(e),n.size||(t[Xr]=void 0))}function bh(t){requestAnimationFrame(()=>{requestAnimationFrame(t)})}let MS=0;function Eh(t,e,n,i){const s=t._endId=++MS,r=()=>{s===t._endId&&i()};if(n!=null)return setTimeout(r,n);const{type:o,timeout:a,propCount:l}=o_(t,e);if(!o)return i();const c=o+"end";let u=0;const d=()=>{t.removeEventListener(c,f),r()},f=p=>{p.target===t&&++u>=l&&d()};setTimeout(()=>{u<l&&d()},a+1),t.addEventListener(c,f)}function o_(t,e){const n=window.getComputedStyle(t),i=g=>(n[g]||"").split(", "),s=i(`${ds}Delay`),r=i(`${ds}Duration`),o=Mh(s,r),a=i(`${fo}Delay`),l=i(`${fo}Duration`),c=Mh(a,l);let u=null,d=0,f=0;e===ds?o>0&&(u=ds,d=o,f=r.length):e===fo?c>0&&(u=fo,d=c,f=l.length):(d=Math.max(o,c),u=d>0?o>c?ds:fo:null,f=u?u===ds?r.length:l.length:0);const p=u===ds&&/\b(?:transform|all)(?:,|$)/.test(i(`${ds}Property`).toString());return{type:u,timeout:d,propCount:f,hasTransform:p}}function Mh(t,e){for(;t.length<e.length;)t=t.concat(t);return Math.max(...e.map((n,i)=>Th(n)+Th(t[i])))}function Th(t){return t==="auto"?0:Number(t.slice(0,-1).replace(",","."))*1e3}function Tu(t){return(t?t.ownerDocument:document).body.offsetHeight}function TS(t,e,n){const i=t[Xr];i&&(e=(e?[e,...i]:[...i]).join(" ")),e==null?t.removeAttribute("class"):n?t.setAttribute("class",e):t.className=e}const ml=Symbol("_vod"),a_=Symbol("_vsh"),AS={name:"show",beforeMount(t,{value:e},{transition:n}){t[ml]=t.style.display==="none"?"":t.style.display,n&&e?n.beforeEnter(t):ho(t,e)},mounted(t,{value:e},{transition:n}){n&&e&&n.enter(t)},updated(t,{value:e,oldValue:n},{transition:i}){!e!=!n&&(i?e?(i.beforeEnter(t),ho(t,!0),i.enter(t)):i.leave(t,()=>{ho(t,!1)}):ho(t,e))},beforeUnmount(t,{value:e}){ho(t,e)}};function ho(t,e){t.style.display=e?t[ml]:"none",t[a_]=!e}const wS=Symbol(""),CS=/(?:^|;)\s*display\s*:/;function RS(t,e,n){const i=t.style,s=kt(n);let r=!1;if(n&&!s){if(e)if(kt(e))for(const o of e.split(";")){const a=o.slice(0,o.indexOf(":")).trim();n[a]==null&&Co(i,a,"")}else for(const o in e)n[o]==null&&Co(i,o,"");for(const o in n){o==="display"&&(r=!0);const a=n[o];a!=null?IS(t,o,!kt(e)&&e?e[o]:void 0,a)||Co(i,o,a):Co(i,o,"")}}else if(s){if(e!==n){const o=i[wS];o&&(n+=";"+o),i.cssText=n,r=CS.test(n)}}else e&&t.removeAttribute("style");ml in t&&(t[ml]=r?i.display:"",t[a_]&&(i.display="none"))}const Ah=/\s*!important$/;function Co(t,e,n){if(Xe(n))n.forEach(i=>Co(t,e,i));else if(n==null&&(n=""),e.startsWith("--"))t.setProperty(e,n);else{const i=PS(t,e);Ah.test(n)?t.setProperty(Ls(i),n.replace(Ah,""),"important"):t[i]=n}}const wh=["Webkit","Moz","ms"],vc={};function PS(t,e){const n=vc[e];if(n)return n;let i=Cn(e);if(i!=="filter"&&i in t)return vc[e]=i;i=Ol(i);for(let s=0;s<wh.length;s++){const r=wh[s]+i;if(r in t)return vc[e]=r}return e}function IS(t,e,n,i){return t.tagName==="TEXTAREA"&&(e==="width"||e==="height")&&kt(i)&&n===i}const Ch="http://www.w3.org/1999/xlink";function Rh(t,e,n,i,s,r=Rv(e)){i&&e.startsWith("xlink:")?n==null?t.removeAttributeNS(Ch,e.slice(6,e.length)):t.setAttributeNS(Ch,e,n):n==null||r&&!qm(n)?t.removeAttribute(e):t.setAttribute(e,r?"":Gn(n)?String(n):n)}function Ph(t,e,n,i,s){if(e==="innerHTML"||e==="textContent"){n!=null&&(t[e]=e==="innerHTML"?n_(n):n);return}const r=t.tagName;if(e==="value"&&r!=="PROGRESS"&&!r.includes("-")){const a=r==="OPTION"?t.getAttribute("value")||"":t.value,l=n==null?t.type==="checkbox"?"on":"":String(n);(a!==l||!("_value"in t))&&(t.value=l),n==null&&t.removeAttribute(e),t._value=n;return}let o=!1;if(n===""||n==null){const a=typeof t[e];a==="boolean"?n=qm(n):n==null&&a==="string"?(n="",o=!0):a==="number"&&(n=0,o=!0)}try{t[e]=n}catch{}o&&t.removeAttribute(s||e)}function js(t,e,n,i){t.addEventListener(e,n,i)}function LS(t,e,n,i){t.removeEventListener(e,n,i)}const Ih=Symbol("_vei");function DS(t,e,n,i,s=null){const r=t[Ih]||(t[Ih]={}),o=r[e];if(i&&o)o.value=i;else{const[a,l]=NS(e);if(i){const c=r[e]=FS(i,s);js(t,a,c,l)}else o&&(LS(t,a,o,l),r[e]=void 0)}}const Lh=/(?:Once|Passive|Capture)$/;function NS(t){let e;if(Lh.test(t)){e={};let i;for(;i=t.match(Lh);)t=t.slice(0,t.length-i[0].length),e[i[0].toLowerCase()]=!0}return[t[2]===":"?t.slice(3):Ls(t.slice(2)),e]}let xc=0;const US=Promise.resolve(),OS=()=>xc||(US.then(()=>xc=0),xc=Date.now());function FS(t,e){const n=i=>{if(!i._vts)i._vts=Date.now();else if(i._vts<=n.attached)return;oi(kS(i,n.value),e,5,[i])};return n.value=t,n.attached=OS(),n}function kS(t,e){if(Xe(e)){const n=t.stopImmediatePropagation;return t.stopImmediatePropagation=()=>{n.call(t),t._stopped=!0},e.map(i=>s=>!s._stopped&&i&&i(s))}else return e}const Dh=t=>t.charCodeAt(0)===111&&t.charCodeAt(1)===110&&t.charCodeAt(2)>96&&t.charCodeAt(2)<123,BS=(t,e,n,i,s,r)=>{const o=s==="svg";e==="class"?TS(t,i,o):e==="style"?RS(t,n,i):Il(e)?Ll(e)||DS(t,e,n,i,r):(e[0]==="."?(e=e.slice(1),!0):e[0]==="^"?(e=e.slice(1),!1):zS(t,e,i,o))?(Ph(t,e,i),!t.tagName.includes("-")&&(e==="value"||e==="checked"||e==="selected")&&Rh(t,e,i,o,r,e!=="value")):t._isVueCE&&(VS(t,e)||t._def.__asyncLoader&&(/[A-Z]/.test(e)||!kt(i)))?Ph(t,Cn(e),i,r,e):(e==="true-value"?t._trueValue=i:e==="false-value"&&(t._falseValue=i),Rh(t,e,i,o))};function zS(t,e,n,i){if(i)return!!(e==="innerHTML"||e==="textContent"||e in t&&Dh(e)&&Je(n));if(e==="spellcheck"||e==="draggable"||e==="translate"||e==="autocorrect"||e==="sandbox"&&t.tagName==="IFRAME"||e==="form"||e==="list"&&t.tagName==="INPUT"||e==="type"&&t.tagName==="TEXTAREA")return!1;if(e==="width"||e==="height"){const s=t.tagName;if(s==="IMG"||s==="VIDEO"||s==="CANVAS"||s==="SOURCE")return!1}return Dh(e)&&kt(n)?!1:e in t}function VS(t,e){const n=t._def.props;if(!n)return!1;const i=Cn(e);return Array.isArray(n)?n.some(s=>Cn(s)===i):Object.keys(n).some(s=>Cn(s)===i)}const l_=new WeakMap,c_=new WeakMap,gl=Symbol("_moveCb"),Nh=Symbol("_enterCb"),HS=t=>(delete t.props.mode,t),GS=HS({name:"TransitionGroup",props:Qt({},s_,{tag:String,moveClass:String}),setup(t,{slots:e}){const n=io(),i=Eg();let s,r;return Pg(()=>{if(!s.length)return;const o=t.moveClass||`${t.name||"v"}-move`;if(!qS(s[0].el,n.vnode.el,o)){s=[];return}s.forEach(WS),s.forEach($S);const a=s.filter(XS);Tu(n.vnode.el),a.forEach(l=>{const c=l.el,u=c.style;vi(c,o),u.transform=u.webkitTransform=u.transitionDuration="";const d=c[gl]=f=>{f&&f.target!==c||(!f||f.propertyName.endsWith("transform"))&&(c.removeEventListener("transitionend",d),c[gl]=null,bs(c,o))};c.addEventListener("transitionend",d)}),s=[]}),()=>{const o=lt(t),a=r_(o);let l=o.tag||wt;if(s=[],r)for(let c=0;c<r.length;c++){const u=r[c];u.el&&u.el instanceof Element&&(s.push(u),ar(u,Ho(u,a,i,n)),l_.set(u,f_(u.el)))}r=e.default?nd(e.default()):[];for(let c=0;c<r.length;c++){const u=r[c];u.key!=null&&ar(u,Ho(u,a,i,n))}return qe(l,null,r)}}}),u_=GS;function WS(t){const e=t.el;e[gl]&&e[gl](),e[Nh]&&e[Nh]()}function $S(t){c_.set(t,f_(t.el))}function XS(t){const e=l_.get(t),n=c_.get(t),i=e.left-n.left,s=e.top-n.top;if(i||s){const r=t.el,o=r.style,a=r.getBoundingClientRect();let l=1,c=1;return r.offsetWidth&&(l=a.width/r.offsetWidth),r.offsetHeight&&(c=a.height/r.offsetHeight),(!Number.isFinite(l)||l===0)&&(l=1),(!Number.isFinite(c)||c===0)&&(c=1),Math.abs(l-1)<.01&&(l=1),Math.abs(c-1)<.01&&(c=1),o.transform=o.webkitTransform=`translate(${i/l}px,${s/c}px)`,o.transitionDuration="0s",t}}function f_(t){const e=t.getBoundingClientRect();return{left:e.left,top:e.top}}function qS(t,e,n){const i=t.cloneNode(),s=t[Xr];s&&s.forEach(a=>{a.split(/\s+/).forEach(l=>l&&i.classList.remove(l))}),n.split(/\s+/).forEach(a=>a&&i.classList.add(a)),i.style.display="none";const r=e.nodeType===1?e:e.parentNode;r.appendChild(i);const{hasTransform:o}=o_(i);return r.removeChild(i),o}const _l=t=>{const e=t.props["onUpdate:modelValue"]||!1;return Xe(e)?n=>Xa(e,n):e};function KS(t){t.target.composing=!0}function Uh(t){const e=t.target;e.composing&&(e.composing=!1,e.dispatchEvent(new Event("input")))}const zr=Symbol("_assign");function Oh(t,e,n){return e&&(t=t.trim()),n&&(t=Fl(t)),t}const d_={created(t,{modifiers:{lazy:e,trim:n,number:i}},s){t[zr]=_l(s);const r=i||s.props&&s.props.type==="number";js(t,e?"change":"input",o=>{o.target.composing||t[zr](Oh(t.value,n,r))}),(n||r)&&js(t,"change",()=>{t.value=Oh(t.value,n,r)}),e||(js(t,"compositionstart",KS),js(t,"compositionend",Uh),js(t,"change",Uh))},mounted(t,{value:e}){t.value=e??""},beforeUpdate(t,{value:e,oldValue:n,modifiers:{lazy:i,trim:s,number:r}},o){if(t[zr]=_l(o),t.composing)return;const a=(r||t.type==="number")&&!/^0\d/.test(t.value)?Fl(t.value):t.value,l=e??"";if(a===l)return;const c=t.getRootNode();(c instanceof Document||c instanceof ShadowRoot)&&c.activeElement===t&&t.type!=="range"&&(i&&e===n||s&&t.value.trim()===l)||(t.value=l)}},jL={deep:!0,created(t,{value:e,modifiers:{number:n}},i){const s=Dl(e);js(t,"change",()=>{const r=Array.prototype.filter.call(t.options,o=>o.selected).map(o=>n?Fl(vl(o)):vl(o));t[zr](t.multiple?s?new Set(r):r:r[0]),t._assigning=!0,ai(()=>{t._assigning=!1})}),t[zr]=_l(i)},mounted(t,{value:e}){Fh(t,e)},beforeUpdate(t,e,n){t[zr]=_l(n)},updated(t,{value:e}){t._assigning||Fh(t,e)}};function Fh(t,e){const n=t.multiple,i=Xe(e);if(!(n&&!i&&!Dl(e))){for(let s=0,r=t.options.length;s<r;s++){const o=t.options[s],a=vl(o);if(n)if(i){const l=typeof a;l==="string"||l==="number"?o.selected=e.some(c=>String(c)===String(a)):o.selected=Iv(e,a)>-1}else o.selected=e.has(a);else if(ta(vl(o),e)){t.selectedIndex!==s&&(t.selectedIndex=s);return}}!n&&t.selectedIndex!==-1&&(t.selectedIndex=-1)}}function vl(t){return"_value"in t?t._value:t.value}const YS=["ctrl","shift","alt","meta"],jS={stop:t=>t.stopPropagation(),prevent:t=>t.preventDefault(),self:t=>t.target!==t.currentTarget,ctrl:t=>!t.ctrlKey,shift:t=>!t.shiftKey,alt:t=>!t.altKey,meta:t=>!t.metaKey,left:t=>"button"in t&&t.button!==0,middle:t=>"button"in t&&t.button!==1,right:t=>"button"in t&&t.button!==2,exact:(t,e)=>YS.some(n=>t[`${n}Key`]&&!e.includes(n))},Kt=(t,e)=>{if(!t)return t;const n=t._withMods||(t._withMods={}),i=e.join(".");return n[i]||(n[i]=((s,...r)=>{for(let o=0;o<e.length;o++){const a=jS[e[o]];if(a&&a(s,e))return}return t(s,...r)}))},ZS={esc:"escape",space:" ",up:"arrow-up",left:"arrow-left",right:"arrow-right",down:"arrow-down",delete:"backspace"},Qs=(t,e)=>{const n=t._withKeys||(t._withKeys={}),i=e.join(".");return n[i]||(n[i]=(s=>{if(!("key"in s))return;const r=Ls(s.key);if(e.some(o=>o===r||ZS[o]===r))return t(s)}))},JS=Qt({patchProp:BS},yS);let kh;function QS(){return kh||(kh=iS(JS))}const ey=((...t)=>{const e=QS().createApp(...t),{mount:n}=e;return e.mount=i=>{const s=ny(i);if(!s)return;const r=e._component;!Je(r)&&!r.render&&!r.template&&(r.template=s.innerHTML),s.nodeType===1&&(s.textContent="");const o=n(s,!1,ty(s));return s instanceof Element&&(s.removeAttribute("v-cloak"),s.setAttribute("data-v-app","")),o},e});function ty(t){if(t instanceof SVGElement)return"svg";if(typeof MathMLElement=="function"&&t instanceof MathMLElement)return"mathml"}function ny(t){return kt(t)?document.querySelector(t):t}/*!
 * pinia v2.3.1
 * (c) 2025 Eduardo San Martin Morote
 * @license MIT
 */let h_;const jl=t=>h_=t,p_=Symbol();function Au(t){return t&&typeof t=="object"&&Object.prototype.toString.call(t)==="[object Object]"&&typeof t.toJSON!="function"}var Fo;(function(t){t.direct="direct",t.patchObject="patch object",t.patchFunction="patch function"})(Fo||(Fo={}));function iy(){const t=$f(!0),e=t.run(()=>Ee({}));let n=[],i=[];const s=Hl({install(r){jl(s),s._a=r,r.provide(p_,s),r.config.globalProperties.$pinia=s,i.forEach(o=>n.push(o)),i=[]},use(r){return this._a?n.push(r):i.push(r),this},_p:n,_a:null,_e:t,_s:new Map,state:e});return s}const m_=()=>{};function Bh(t,e,n,i=m_){t.push(e);const s=()=>{const r=t.indexOf(e);r>-1&&(t.splice(r,1),i())};return!n&&Xf()&&Zm(s),s}function gr(t,...e){t.slice().forEach(n=>{n(...e)})}const sy=t=>t(),zh=Symbol(),Sc=Symbol();function wu(t,e){t instanceof Map&&e instanceof Map?e.forEach((n,i)=>t.set(i,n)):t instanceof Set&&e instanceof Set&&e.forEach(t.add,t);for(const n in e){if(!e.hasOwnProperty(n))continue;const i=e[n],s=t[n];Au(s)&&Au(i)&&t.hasOwnProperty(n)&&!Bt(i)&&!wi(i)?t[n]=wu(s,i):t[n]=i}return t}const ry=Symbol();function oy(t){return!Au(t)||!t.hasOwnProperty(ry)}const{assign:Es}=Object;function ay(t){return!!(Bt(t)&&t.effect)}function ly(t,e,n,i){const{state:s,actions:r,getters:o}=e,a=n.state.value[t];let l;function c(){a||(n.state.value[t]=s?s():{});const u=ex(n.state.value[t]);return Es(u,r,Object.keys(o||{}).reduce((d,f)=>(d[f]=Hl(rt(()=>{jl(n);const p=n._s.get(t);return o[f].call(p,p)})),d),{}))}return l=g_(t,c,e,n,i,!0),l}function g_(t,e,n={},i,s,r){let o;const a=Es({actions:{}},n),l={deep:!0};let c,u,d=[],f=[],p;const g=i.state.value[t];!r&&!g&&(i.state.value[t]={});let _;function m(S){let M;c=u=!1,typeof S=="function"?(S(i.state.value[t]),M={type:Fo.patchFunction,storeId:t,events:p}):(wu(i.state.value[t],S),M={type:Fo.patchObject,payload:S,storeId:t,events:p});const L=_=Symbol();ai().then(()=>{_===L&&(c=!0)}),u=!0,gr(d,M,i.state.value[t])}const h=r?function(){const{state:M}=n,L=M?M():{};this.$patch(E=>{Es(E,L)})}:m_;function v(){o.stop(),d=[],f=[],i._s.delete(t)}const b=(S,M="")=>{if(zh in S)return S[Sc]=M,S;const L=function(){jl(i);const E=Array.from(arguments),P=[],B=[];function Z($){P.push($)}function G($){B.push($)}gr(f,{args:E,name:L[Sc],store:D,after:Z,onError:G});let X;try{X=S.apply(this&&this.$id===t?this:D,E)}catch($){throw gr(B,$),$}return X instanceof Promise?X.then($=>(gr(P,$),$)).catch($=>(gr(B,$),Promise.reject($))):(gr(P,X),X)};return L[zh]=!0,L[Sc]=M,L},x={_p:i,$id:t,$onAction:Bh.bind(null,f),$patch:m,$reset:h,$subscribe(S,M={}){const L=Bh(d,S,M.detached,()=>E()),E=o.run(()=>Vn(()=>i.state.value[t],P=>{(M.flush==="sync"?u:c)&&S({storeId:t,type:Fo.direct,events:p},P)},Es({},l,M)));return L},$dispose:v},D=to(x);i._s.set(t,D);const R=(i._a&&i._a.runWithContext||sy)(()=>i._e.run(()=>(o=$f()).run(()=>e({action:b}))));for(const S in R){const M=R[S];if(Bt(M)&&!ay(M)||wi(M))r||(g&&oy(M)&&(Bt(M)?M.value=g[S]:wu(M,g[S])),i.state.value[t][S]=M);else if(typeof M=="function"){const L=b(M,S);R[S]=L,a.actions[S]=M}}return Es(D,R),Es(lt(D),R),Object.defineProperty(D,"$state",{get:()=>i.state.value[t],set:S=>{m(M=>{Es(M,S)})}}),i._p.forEach(S=>{Es(D,o.run(()=>S({store:D,app:i._a,pinia:i,options:a})))}),g&&r&&n.hydrate&&n.hydrate(D.$state,g),c=!0,u=!0,D}/*! #__NO_SIDE_EFFECTS__ */function Zl(t,e,n){let i,s;const r=typeof e=="function";typeof t=="string"?(i=t,s=r?n:e):(s=t,i=t.id);function o(a,l){const c=px();return a=a||(c?zn(p_,null):null),a&&jl(a),a=h_,a._s.has(i)||(r?g_(i,e,s,a):ly(i,s,a)),a._s.get(i)}return o.$id=i,o}function Vh(t){{const e=lt(t),n={};for(const i in e){const s=e[i];s.effect?n[i]=rt({get:()=>t[i],set(r){t[i]=r}}):(Bt(s)||wi(s))&&(n[i]=ix(t,i))}return n}}const cy="modulepreload",uy=function(t){return"/"+t},Hh={},cn=function(e,n,i){let s=Promise.resolve();if(n&&n.length>0){let o=function(c){return Promise.all(c.map(u=>Promise.resolve(u).then(d=>({status:"fulfilled",value:d}),d=>({status:"rejected",reason:d}))))};document.getElementsByTagName("link");const a=document.querySelector("meta[property=csp-nonce]"),l=(a==null?void 0:a.nonce)||(a==null?void 0:a.getAttribute("nonce"));s=o(n.map(c=>{if(c=uy(c),c in Hh)return;Hh[c]=!0;const u=c.endsWith(".css"),d=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${d}`))return;const f=document.createElement("link");if(f.rel=u?"stylesheet":cy,u||(f.as="script"),f.crossOrigin="",f.href=c,l&&f.setAttribute("nonce",l),document.head.appendChild(f),u)return new Promise((p,g)=>{f.addEventListener("load",p),f.addEventListener("error",()=>g(new Error(`Unable to preload CSS for ${c}`)))})}))}function r(o){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=o,window.dispatchEvent(a),!a.defaultPrevented)throw o}return s.then(o=>{for(const a of o||[])a.status==="rejected"&&r(a.reason);return e().catch(r)})};/*!
 * vue-router v4.6.4
 * (c) 2025 Eduardo San Martin Morote
 * @license MIT
 */const Lr=typeof document<"u";function __(t){return typeof t=="object"||"displayName"in t||"props"in t||"__vccOpts"in t}function fy(t){return t.__esModule||t[Symbol.toStringTag]==="Module"||t.default&&__(t.default)}const yt=Object.assign;function yc(t,e){const n={};for(const i in e){const s=e[i];n[i]=li(s)?s.map(t):t(s)}return n}const ko=()=>{},li=Array.isArray;function Gh(t,e){const n={};for(const i in t)n[i]=i in e?e[i]:t[i];return n}const v_=/#/g,dy=/&/g,hy=/\//g,py=/=/g,my=/\?/g,x_=/\+/g,gy=/%5B/g,_y=/%5D/g,S_=/%5E/g,vy=/%60/g,y_=/%7B/g,xy=/%7C/g,b_=/%7D/g,Sy=/%20/g;function ud(t){return t==null?"":encodeURI(""+t).replace(xy,"|").replace(gy,"[").replace(_y,"]")}function yy(t){return ud(t).replace(y_,"{").replace(b_,"}").replace(S_,"^")}function Cu(t){return ud(t).replace(x_,"%2B").replace(Sy,"+").replace(v_,"%23").replace(dy,"%26").replace(vy,"`").replace(y_,"{").replace(b_,"}").replace(S_,"^")}function by(t){return Cu(t).replace(py,"%3D")}function Ey(t){return ud(t).replace(v_,"%23").replace(my,"%3F")}function My(t){return Ey(t).replace(hy,"%2F")}function Xo(t){if(t==null)return null;try{return decodeURIComponent(""+t)}catch{}return""+t}const Ty=/\/$/,Ay=t=>t.replace(Ty,"");function bc(t,e,n="/"){let i,s={},r="",o="";const a=e.indexOf("#");let l=e.indexOf("?");return l=a>=0&&l>a?-1:l,l>=0&&(i=e.slice(0,l),r=e.slice(l,a>0?a:e.length),s=t(r.slice(1))),a>=0&&(i=i||e.slice(0,a),o=e.slice(a,e.length)),i=Py(i??e,n),{fullPath:i+r+o,path:i,query:s,hash:Xo(o)}}function wy(t,e){const n=e.query?t(e.query):"";return e.path+(n&&"?")+n+(e.hash||"")}function Wh(t,e){return!e||!t.toLowerCase().startsWith(e.toLowerCase())?t:t.slice(e.length)||"/"}function Cy(t,e,n){const i=e.matched.length-1,s=n.matched.length-1;return i>-1&&i===s&&qr(e.matched[i],n.matched[s])&&E_(e.params,n.params)&&t(e.query)===t(n.query)&&e.hash===n.hash}function qr(t,e){return(t.aliasOf||t)===(e.aliasOf||e)}function E_(t,e){if(Object.keys(t).length!==Object.keys(e).length)return!1;for(var n in t)if(!Ry(t[n],e[n]))return!1;return!0}function Ry(t,e){return li(t)?$h(t,e):li(e)?$h(e,t):(t==null?void 0:t.valueOf())===(e==null?void 0:e.valueOf())}function $h(t,e){return li(e)?t.length===e.length&&t.every((n,i)=>n===e[i]):t.length===1&&t[0]===e}function Py(t,e){if(t.startsWith("/"))return t;if(!t)return e;const n=e.split("/"),i=t.split("/"),s=i[i.length-1];(s===".."||s===".")&&i.push("");let r=n.length-1,o,a;for(o=0;o<i.length;o++)if(a=i[o],a!==".")if(a==="..")r>1&&r--;else break;return n.slice(0,r).join("/")+"/"+i.slice(o).join("/")}const hs={path:"/",name:void 0,params:{},query:{},hash:"",fullPath:"/",matched:[],meta:{},redirectedFrom:void 0};let Ru=(function(t){return t.pop="pop",t.push="push",t})({}),Ec=(function(t){return t.back="back",t.forward="forward",t.unknown="",t})({});function Iy(t){if(!t)if(Lr){const e=document.querySelector("base");t=e&&e.getAttribute("href")||"/",t=t.replace(/^\w+:\/\/[^\/]+/,"")}else t="/";return t[0]!=="/"&&t[0]!=="#"&&(t="/"+t),Ay(t)}const Ly=/^[^#]+#/;function Dy(t,e){return t.replace(Ly,"#")+e}function Ny(t,e){const n=document.documentElement.getBoundingClientRect(),i=t.getBoundingClientRect();return{behavior:e.behavior,left:i.left-n.left-(e.left||0),top:i.top-n.top-(e.top||0)}}const Jl=()=>({left:window.scrollX,top:window.scrollY});function Uy(t){let e;if("el"in t){const n=t.el,i=typeof n=="string"&&n.startsWith("#"),s=typeof n=="string"?i?document.getElementById(n.slice(1)):document.querySelector(n):n;if(!s)return;e=Ny(s,t)}else e=t;"scrollBehavior"in document.documentElement.style?window.scrollTo(e):window.scrollTo(e.left!=null?e.left:window.scrollX,e.top!=null?e.top:window.scrollY)}function Xh(t,e){return(history.state?history.state.position-e:-1)+t}const Pu=new Map;function Oy(t,e){Pu.set(t,e)}function Fy(t){const e=Pu.get(t);return Pu.delete(t),e}function ky(t){return typeof t=="string"||t&&typeof t=="object"}function M_(t){return typeof t=="string"||typeof t=="symbol"}let Gt=(function(t){return t[t.MATCHER_NOT_FOUND=1]="MATCHER_NOT_FOUND",t[t.NAVIGATION_GUARD_REDIRECT=2]="NAVIGATION_GUARD_REDIRECT",t[t.NAVIGATION_ABORTED=4]="NAVIGATION_ABORTED",t[t.NAVIGATION_CANCELLED=8]="NAVIGATION_CANCELLED",t[t.NAVIGATION_DUPLICATED=16]="NAVIGATION_DUPLICATED",t})({});const T_=Symbol("");Gt.MATCHER_NOT_FOUND+"",Gt.NAVIGATION_GUARD_REDIRECT+"",Gt.NAVIGATION_ABORTED+"",Gt.NAVIGATION_CANCELLED+"",Gt.NAVIGATION_DUPLICATED+"";function Kr(t,e){return yt(new Error,{type:t,[T_]:!0},e)}function Fi(t,e){return t instanceof Error&&T_ in t&&(e==null||!!(t.type&e))}const By=["params","query","hash"];function zy(t){if(typeof t=="string")return t;if(t.path!=null)return t.path;const e={};for(const n of By)n in t&&(e[n]=t[n]);return JSON.stringify(e,null,2)}function Vy(t){const e={};if(t===""||t==="?")return e;const n=(t[0]==="?"?t.slice(1):t).split("&");for(let i=0;i<n.length;++i){const s=n[i].replace(x_," "),r=s.indexOf("="),o=Xo(r<0?s:s.slice(0,r)),a=r<0?null:Xo(s.slice(r+1));if(o in e){let l=e[o];li(l)||(l=e[o]=[l]),l.push(a)}else e[o]=a}return e}function qh(t){let e="";for(let n in t){const i=t[n];if(n=by(n),i==null){i!==void 0&&(e+=(e.length?"&":"")+n);continue}(li(i)?i.map(s=>s&&Cu(s)):[i&&Cu(i)]).forEach(s=>{s!==void 0&&(e+=(e.length?"&":"")+n,s!=null&&(e+="="+s))})}return e}function Hy(t){const e={};for(const n in t){const i=t[n];i!==void 0&&(e[n]=li(i)?i.map(s=>s==null?null:""+s):i==null?i:""+i)}return e}const Gy=Symbol(""),Kh=Symbol(""),Ql=Symbol(""),fd=Symbol(""),Iu=Symbol("");function po(){let t=[];function e(i){return t.push(i),()=>{const s=t.indexOf(i);s>-1&&t.splice(s,1)}}function n(){t=[]}return{add:e,list:()=>t.slice(),reset:n}}function Ts(t,e,n,i,s,r=o=>o()){const o=i&&(i.enterCallbacks[s]=i.enterCallbacks[s]||[]);return()=>new Promise((a,l)=>{const c=f=>{f===!1?l(Kr(Gt.NAVIGATION_ABORTED,{from:n,to:e})):f instanceof Error?l(f):ky(f)?l(Kr(Gt.NAVIGATION_GUARD_REDIRECT,{from:e,to:f})):(o&&i.enterCallbacks[s]===o&&typeof f=="function"&&o.push(f),a())},u=r(()=>t.call(i&&i.instances[s],e,n,c));let d=Promise.resolve(u);t.length<3&&(d=d.then(c)),d.catch(f=>l(f))})}function Mc(t,e,n,i,s=r=>r()){const r=[];for(const o of t)for(const a in o.components){let l=o.components[a];if(!(e!=="beforeRouteEnter"&&!o.instances[a]))if(__(l)){const c=(l.__vccOpts||l)[e];c&&r.push(Ts(c,n,i,o,a,s))}else{let c=l();r.push(()=>c.then(u=>{if(!u)throw new Error(`Couldn't resolve component "${a}" at "${o.path}"`);const d=fy(u)?u.default:u;o.mods[a]=u,o.components[a]=d;const f=(d.__vccOpts||d)[e];return f&&Ts(f,n,i,o,a,s)()}))}}return r}function Wy(t,e){const n=[],i=[],s=[],r=Math.max(e.matched.length,t.matched.length);for(let o=0;o<r;o++){const a=e.matched[o];a&&(t.matched.find(c=>qr(c,a))?i.push(a):n.push(a));const l=t.matched[o];l&&(e.matched.find(c=>qr(c,l))||s.push(l))}return[n,i,s]}/*!
 * vue-router v4.6.4
 * (c) 2025 Eduardo San Martin Morote
 * @license MIT
 */let $y=()=>location.protocol+"//"+location.host;function A_(t,e){const{pathname:n,search:i,hash:s}=e,r=t.indexOf("#");if(r>-1){let o=s.includes(t.slice(r))?t.slice(r).length:1,a=s.slice(o);return a[0]!=="/"&&(a="/"+a),Wh(a,"")}return Wh(n,t)+i+s}function Xy(t,e,n,i){let s=[],r=[],o=null;const a=({state:f})=>{const p=A_(t,location),g=n.value,_=e.value;let m=0;if(f){if(n.value=p,e.value=f,o&&o===g){o=null;return}m=_?f.position-_.position:0}else i(p);s.forEach(h=>{h(n.value,g,{delta:m,type:Ru.pop,direction:m?m>0?Ec.forward:Ec.back:Ec.unknown})})};function l(){o=n.value}function c(f){s.push(f);const p=()=>{const g=s.indexOf(f);g>-1&&s.splice(g,1)};return r.push(p),p}function u(){if(document.visibilityState==="hidden"){const{history:f}=window;if(!f.state)return;f.replaceState(yt({},f.state,{scroll:Jl()}),"")}}function d(){for(const f of r)f();r=[],window.removeEventListener("popstate",a),window.removeEventListener("pagehide",u),document.removeEventListener("visibilitychange",u)}return window.addEventListener("popstate",a),window.addEventListener("pagehide",u),document.addEventListener("visibilitychange",u),{pauseListeners:l,listen:c,destroy:d}}function Yh(t,e,n,i=!1,s=!1){return{back:t,current:e,forward:n,replaced:i,position:window.history.length,scroll:s?Jl():null}}function qy(t){const{history:e,location:n}=window,i={value:A_(t,n)},s={value:e.state};s.value||r(i.value,{back:null,current:i.value,forward:null,position:e.length-1,replaced:!0,scroll:null},!0);function r(l,c,u){const d=t.indexOf("#"),f=d>-1?(n.host&&document.querySelector("base")?t:t.slice(d))+l:$y()+t+l;try{e[u?"replaceState":"pushState"](c,"",f),s.value=c}catch(p){console.error(p),n[u?"replace":"assign"](f)}}function o(l,c){r(l,yt({},e.state,Yh(s.value.back,l,s.value.forward,!0),c,{position:s.value.position}),!0),i.value=l}function a(l,c){const u=yt({},s.value,e.state,{forward:l,scroll:Jl()});r(u.current,u,!0),r(l,yt({},Yh(i.value,l,null),{position:u.position+1},c),!1),i.value=l}return{location:i,state:s,push:a,replace:o}}function Ky(t){t=Iy(t);const e=qy(t),n=Xy(t,e.state,e.location,e.replace);function i(r,o=!0){o||n.pauseListeners(),history.go(r)}const s=yt({location:"",base:t,go:i,createHref:Dy.bind(null,t)},e,n);return Object.defineProperty(s,"location",{enumerable:!0,get:()=>e.location.value}),Object.defineProperty(s,"state",{enumerable:!0,get:()=>e.state.value}),s}let er=(function(t){return t[t.Static=0]="Static",t[t.Param=1]="Param",t[t.Group=2]="Group",t})({});var tn=(function(t){return t[t.Static=0]="Static",t[t.Param=1]="Param",t[t.ParamRegExp=2]="ParamRegExp",t[t.ParamRegExpEnd=3]="ParamRegExpEnd",t[t.EscapeNext=4]="EscapeNext",t})(tn||{});const Yy={type:er.Static,value:""},jy=/[a-zA-Z0-9_]/;function Zy(t){if(!t)return[[]];if(t==="/")return[[Yy]];if(!t.startsWith("/"))throw new Error(`Invalid path "${t}"`);function e(p){throw new Error(`ERR (${n})/"${c}": ${p}`)}let n=tn.Static,i=n;const s=[];let r;function o(){r&&s.push(r),r=[]}let a=0,l,c="",u="";function d(){c&&(n===tn.Static?r.push({type:er.Static,value:c}):n===tn.Param||n===tn.ParamRegExp||n===tn.ParamRegExpEnd?(r.length>1&&(l==="*"||l==="+")&&e(`A repeatable param (${c}) must be alone in its segment. eg: '/:ids+.`),r.push({type:er.Param,value:c,regexp:u,repeatable:l==="*"||l==="+",optional:l==="*"||l==="?"})):e("Invalid state to consume buffer"),c="")}function f(){c+=l}for(;a<t.length;){if(l=t[a++],l==="\\"&&n!==tn.ParamRegExp){i=n,n=tn.EscapeNext;continue}switch(n){case tn.Static:l==="/"?(c&&d(),o()):l===":"?(d(),n=tn.Param):f();break;case tn.EscapeNext:f(),n=i;break;case tn.Param:l==="("?n=tn.ParamRegExp:jy.test(l)?f():(d(),n=tn.Static,l!=="*"&&l!=="?"&&l!=="+"&&a--);break;case tn.ParamRegExp:l===")"?u[u.length-1]=="\\"?u=u.slice(0,-1)+l:n=tn.ParamRegExpEnd:u+=l;break;case tn.ParamRegExpEnd:d(),n=tn.Static,l!=="*"&&l!=="?"&&l!=="+"&&a--,u="";break;default:e("Unknown state");break}}return n===tn.ParamRegExp&&e(`Unfinished custom RegExp for param "${c}"`),d(),o(),s}const jh="[^/]+?",Jy={sensitive:!1,strict:!1,start:!0,end:!0};var Mn=(function(t){return t[t._multiplier=10]="_multiplier",t[t.Root=90]="Root",t[t.Segment=40]="Segment",t[t.SubSegment=30]="SubSegment",t[t.Static=40]="Static",t[t.Dynamic=20]="Dynamic",t[t.BonusCustomRegExp=10]="BonusCustomRegExp",t[t.BonusWildcard=-50]="BonusWildcard",t[t.BonusRepeatable=-20]="BonusRepeatable",t[t.BonusOptional=-8]="BonusOptional",t[t.BonusStrict=.7000000000000001]="BonusStrict",t[t.BonusCaseSensitive=.25]="BonusCaseSensitive",t})(Mn||{});const Qy=/[.+*?^${}()[\]/\\]/g;function eb(t,e){const n=yt({},Jy,e),i=[];let s=n.start?"^":"";const r=[];for(const c of t){const u=c.length?[]:[Mn.Root];n.strict&&!c.length&&(s+="/");for(let d=0;d<c.length;d++){const f=c[d];let p=Mn.Segment+(n.sensitive?Mn.BonusCaseSensitive:0);if(f.type===er.Static)d||(s+="/"),s+=f.value.replace(Qy,"\\$&"),p+=Mn.Static;else if(f.type===er.Param){const{value:g,repeatable:_,optional:m,regexp:h}=f;r.push({name:g,repeatable:_,optional:m});const v=h||jh;if(v!==jh){p+=Mn.BonusCustomRegExp;try{`${v}`}catch(x){throw new Error(`Invalid custom RegExp for param "${g}" (${v}): `+x.message)}}let b=_?`((?:${v})(?:/(?:${v}))*)`:`(${v})`;d||(b=m&&c.length<2?`(?:/${b})`:"/"+b),m&&(b+="?"),s+=b,p+=Mn.Dynamic,m&&(p+=Mn.BonusOptional),_&&(p+=Mn.BonusRepeatable),v===".*"&&(p+=Mn.BonusWildcard)}u.push(p)}i.push(u)}if(n.strict&&n.end){const c=i.length-1;i[c][i[c].length-1]+=Mn.BonusStrict}n.strict||(s+="/?"),n.end?s+="$":n.strict&&!s.endsWith("/")&&(s+="(?:/|$)");const o=new RegExp(s,n.sensitive?"":"i");function a(c){const u=c.match(o),d={};if(!u)return null;for(let f=1;f<u.length;f++){const p=u[f]||"",g=r[f-1];d[g.name]=p&&g.repeatable?p.split("/"):p}return d}function l(c){let u="",d=!1;for(const f of t){(!d||!u.endsWith("/"))&&(u+="/"),d=!1;for(const p of f)if(p.type===er.Static)u+=p.value;else if(p.type===er.Param){const{value:g,repeatable:_,optional:m}=p,h=g in c?c[g]:"";if(li(h)&&!_)throw new Error(`Provided param "${g}" is an array but it is not repeatable (* or + modifiers)`);const v=li(h)?h.join("/"):h;if(!v)if(m)f.length<2&&(u.endsWith("/")?u=u.slice(0,-1):d=!0);else throw new Error(`Missing required param "${g}"`);u+=v}}return u||"/"}return{re:o,score:i,keys:r,parse:a,stringify:l}}function tb(t,e){let n=0;for(;n<t.length&&n<e.length;){const i=e[n]-t[n];if(i)return i;n++}return t.length<e.length?t.length===1&&t[0]===Mn.Static+Mn.Segment?-1:1:t.length>e.length?e.length===1&&e[0]===Mn.Static+Mn.Segment?1:-1:0}function w_(t,e){let n=0;const i=t.score,s=e.score;for(;n<i.length&&n<s.length;){const r=tb(i[n],s[n]);if(r)return r;n++}if(Math.abs(s.length-i.length)===1){if(Zh(i))return 1;if(Zh(s))return-1}return s.length-i.length}function Zh(t){const e=t[t.length-1];return t.length>0&&e[e.length-1]<0}const nb={strict:!1,end:!0,sensitive:!1};function ib(t,e,n){const i=eb(Zy(t.path),n),s=yt(i,{record:t,parent:e,children:[],alias:[]});return e&&!s.record.aliasOf==!e.record.aliasOf&&e.children.push(s),s}function sb(t,e){const n=[],i=new Map;e=Gh(nb,e);function s(d){return i.get(d)}function r(d,f,p){const g=!p,_=Qh(d);_.aliasOf=p&&p.record;const m=Gh(e,d),h=[_];if("alias"in d){const x=typeof d.alias=="string"?[d.alias]:d.alias;for(const D of x)h.push(Qh(yt({},_,{components:p?p.record.components:_.components,path:D,aliasOf:p?p.record:_})))}let v,b;for(const x of h){const{path:D}=x;if(f&&D[0]!=="/"){const C=f.record.path,R=C[C.length-1]==="/"?"":"/";x.path=f.record.path+(D&&R+D)}if(v=ib(x,f,m),p?p.alias.push(v):(b=b||v,b!==v&&b.alias.push(v),g&&d.name&&!ep(v)&&o(d.name)),C_(v)&&l(v),_.children){const C=_.children;for(let R=0;R<C.length;R++)r(C[R],v,p&&p.children[R])}p=p||v}return b?()=>{o(b)}:ko}function o(d){if(M_(d)){const f=i.get(d);f&&(i.delete(d),n.splice(n.indexOf(f),1),f.children.forEach(o),f.alias.forEach(o))}else{const f=n.indexOf(d);f>-1&&(n.splice(f,1),d.record.name&&i.delete(d.record.name),d.children.forEach(o),d.alias.forEach(o))}}function a(){return n}function l(d){const f=ab(d,n);n.splice(f,0,d),d.record.name&&!ep(d)&&i.set(d.record.name,d)}function c(d,f){let p,g={},_,m;if("name"in d&&d.name){if(p=i.get(d.name),!p)throw Kr(Gt.MATCHER_NOT_FOUND,{location:d});m=p.record.name,g=yt(Jh(f.params,p.keys.filter(b=>!b.optional).concat(p.parent?p.parent.keys.filter(b=>b.optional):[]).map(b=>b.name)),d.params&&Jh(d.params,p.keys.map(b=>b.name))),_=p.stringify(g)}else if(d.path!=null)_=d.path,p=n.find(b=>b.re.test(_)),p&&(g=p.parse(_),m=p.record.name);else{if(p=f.name?i.get(f.name):n.find(b=>b.re.test(f.path)),!p)throw Kr(Gt.MATCHER_NOT_FOUND,{location:d,currentLocation:f});m=p.record.name,g=yt({},f.params,d.params),_=p.stringify(g)}const h=[];let v=p;for(;v;)h.unshift(v.record),v=v.parent;return{name:m,path:_,params:g,matched:h,meta:ob(h)}}t.forEach(d=>r(d));function u(){n.length=0,i.clear()}return{addRoute:r,resolve:c,removeRoute:o,clearRoutes:u,getRoutes:a,getRecordMatcher:s}}function Jh(t,e){const n={};for(const i of e)i in t&&(n[i]=t[i]);return n}function Qh(t){const e={path:t.path,redirect:t.redirect,name:t.name,meta:t.meta||{},aliasOf:t.aliasOf,beforeEnter:t.beforeEnter,props:rb(t),children:t.children||[],instances:{},leaveGuards:new Set,updateGuards:new Set,enterCallbacks:{},components:"components"in t?t.components||null:t.component&&{default:t.component}};return Object.defineProperty(e,"mods",{value:{}}),e}function rb(t){const e={},n=t.props||!1;if("component"in t)e.default=n;else for(const i in t.components)e[i]=typeof n=="object"?n[i]:n;return e}function ep(t){for(;t;){if(t.record.aliasOf)return!0;t=t.parent}return!1}function ob(t){return t.reduce((e,n)=>yt(e,n.meta),{})}function ab(t,e){let n=0,i=e.length;for(;n!==i;){const r=n+i>>1;w_(t,e[r])<0?i=r:n=r+1}const s=lb(t);return s&&(i=e.lastIndexOf(s,i-1)),i}function lb(t){let e=t;for(;e=e.parent;)if(C_(e)&&w_(t,e)===0)return e}function C_({record:t}){return!!(t.name||t.components&&Object.keys(t.components).length||t.redirect)}function tp(t){const e=zn(Ql),n=zn(fd),i=rt(()=>{const l=Oe(t.to);return e.resolve(l)}),s=rt(()=>{const{matched:l}=i.value,{length:c}=l,u=l[c-1],d=n.matched;if(!u||!d.length)return-1;const f=d.findIndex(qr.bind(null,u));if(f>-1)return f;const p=np(l[c-2]);return c>1&&np(u)===p&&d[d.length-1].path!==p?d.findIndex(qr.bind(null,l[c-2])):f}),r=rt(()=>s.value>-1&&hb(n.params,i.value.params)),o=rt(()=>s.value>-1&&s.value===n.matched.length-1&&E_(n.params,i.value.params));function a(l={}){if(db(l)){const c=e[Oe(t.replace)?"replace":"push"](Oe(t.to)).catch(ko);return t.viewTransition&&typeof document<"u"&&"startViewTransition"in document&&document.startViewTransition(()=>c),c}return Promise.resolve()}return{route:i,href:rt(()=>i.value.href),isActive:r,isExactActive:o,navigate:a}}function cb(t){return t.length===1?t[0]:t}const ub=Vt({name:"RouterLink",compatConfig:{MODE:3},props:{to:{type:[String,Object],required:!0},replace:Boolean,activeClass:String,exactActiveClass:String,custom:Boolean,ariaCurrentValue:{type:String,default:"page"},viewTransition:Boolean},useLink:tp,setup(t,{slots:e}){const n=to(tp(t)),{options:i}=zn(Ql),s=rt(()=>({[ip(t.activeClass,i.linkActiveClass,"router-link-active")]:n.isActive,[ip(t.exactActiveClass,i.linkExactActiveClass,"router-link-exact-active")]:n.isExactActive}));return()=>{const r=e.default&&cb(e.default(n));return t.custom?r:Ps("a",{"aria-current":n.isExactActive?t.ariaCurrentValue:null,href:n.href,onClick:n.navigate,class:s.value},r)}}}),fb=ub;function db(t){if(!(t.metaKey||t.altKey||t.ctrlKey||t.shiftKey)&&!t.defaultPrevented&&!(t.button!==void 0&&t.button!==0)){if(t.currentTarget&&t.currentTarget.getAttribute){const e=t.currentTarget.getAttribute("target");if(/\b_blank\b/i.test(e))return}return t.preventDefault&&t.preventDefault(),!0}}function hb(t,e){for(const n in e){const i=e[n],s=t[n];if(typeof i=="string"){if(i!==s)return!1}else if(!li(s)||s.length!==i.length||i.some((r,o)=>r.valueOf()!==s[o].valueOf()))return!1}return!0}function np(t){return t?t.aliasOf?t.aliasOf.path:t.path:""}const ip=(t,e,n)=>t??e??n,pb=Vt({name:"RouterView",inheritAttrs:!1,props:{name:{type:String,default:"default"},route:Object},compatConfig:{MODE:3},setup(t,{attrs:e,slots:n}){const i=zn(Iu),s=rt(()=>t.route||i.value),r=zn(Kh,0),o=rt(()=>{let c=Oe(r);const{matched:u}=s.value;let d;for(;(d=u[c])&&!d.components;)c++;return c}),a=rt(()=>s.value.matched[o.value]);qa(Kh,rt(()=>o.value+1)),qa(Gy,a),qa(Iu,s);const l=Ee();return Vn(()=>[l.value,a.value,t.name],([c,u,d],[f,p,g])=>{u&&(u.instances[d]=c,p&&p!==u&&c&&c===f&&(u.leaveGuards.size||(u.leaveGuards=p.leaveGuards),u.updateGuards.size||(u.updateGuards=p.updateGuards))),c&&u&&(!p||!qr(u,p)||!f)&&(u.enterCallbacks[d]||[]).forEach(_=>_(c))},{flush:"post"}),()=>{const c=s.value,u=t.name,d=a.value,f=d&&d.components[u];if(!f)return sp(n.default,{Component:f,route:c});const p=d.props[u],g=p?p===!0?c.params:typeof p=="function"?p(c):p:null,m=Ps(f,yt({},g,e,{onVnodeUnmounted:h=>{h.component.isUnmounted&&(d.instances[u]=null)},ref:l}));return sp(n.default,{Component:m,route:c})||m}}});function sp(t,e){if(!t)return null;const n=t(e);return n.length===1?n[0]:n}const mb=pb;function gb(t){const e=sb(t.routes,t),n=t.parseQuery||Vy,i=t.stringifyQuery||qh,s=t.history,r=po(),o=po(),a=po(),l=dg(hs);let c=hs;Lr&&t.scrollBehavior&&"scrollRestoration"in history&&(history.scrollRestoration="manual");const u=yc.bind(null,j=>""+j),d=yc.bind(null,My),f=yc.bind(null,Xo);function p(j,te){let fe,ge;return M_(j)?(fe=e.getRecordMatcher(j),ge=te):ge=j,e.addRoute(ge,fe)}function g(j){const te=e.getRecordMatcher(j);te&&e.removeRoute(te)}function _(){return e.getRoutes().map(j=>j.record)}function m(j){return!!e.getRecordMatcher(j)}function h(j,te){if(te=yt({},te||l.value),typeof j=="string"){const V=bc(n,j,te.path),Y=e.resolve({path:V.path},te),J=s.createHref(V.fullPath);return yt(V,Y,{params:f(Y.params),hash:Xo(V.hash),redirectedFrom:void 0,href:J})}let fe;if(j.path!=null)fe=yt({},j,{path:bc(n,j.path,te.path).path});else{const V=yt({},j.params);for(const Y in V)V[Y]==null&&delete V[Y];fe=yt({},j,{params:d(V)}),te.params=d(te.params)}const ge=e.resolve(fe,te),ye=j.hash||"";ge.params=u(f(ge.params));const T=wy(i,yt({},j,{hash:yy(ye),path:ge.path})),I=s.createHref(T);return yt({fullPath:T,hash:ye,query:i===qh?Hy(j.query):j.query||{}},ge,{redirectedFrom:void 0,href:I})}function v(j){return typeof j=="string"?bc(n,j,l.value.path):yt({},j)}function b(j,te){if(c!==j)return Kr(Gt.NAVIGATION_CANCELLED,{from:te,to:j})}function x(j){return R(j)}function D(j){return x(yt(v(j),{replace:!0}))}function C(j,te){const fe=j.matched[j.matched.length-1];if(fe&&fe.redirect){const{redirect:ge}=fe;let ye=typeof ge=="function"?ge(j,te):ge;return typeof ye=="string"&&(ye=ye.includes("?")||ye.includes("#")?ye=v(ye):{path:ye},ye.params={}),yt({query:j.query,hash:j.hash,params:ye.path!=null?{}:j.params},ye)}}function R(j,te){const fe=c=h(j),ge=l.value,ye=j.state,T=j.force,I=j.replace===!0,V=C(fe,ge);if(V)return R(yt(v(V),{state:typeof V=="object"?yt({},ye,V.state):ye,force:T,replace:I}),te||fe);const Y=fe;Y.redirectedFrom=te;let J;return!T&&Cy(i,ge,fe)&&(J=Kr(Gt.NAVIGATION_DUPLICATED,{to:Y,from:ge}),Ce(ge,ge,!0,!1)),(J?Promise.resolve(J):L(Y,ge)).catch(ae=>Fi(ae)?Fi(ae,Gt.NAVIGATION_GUARD_REDIRECT)?ae:Se(ae):le(ae,Y,ge)).then(ae=>{if(ae){if(Fi(ae,Gt.NAVIGATION_GUARD_REDIRECT))return R(yt({replace:I},v(ae.to),{state:typeof ae.to=="object"?yt({},ye,ae.to.state):ye,force:T}),te||Y)}else ae=P(Y,ge,!0,I,ye);return E(Y,ge,ae),ae})}function S(j,te){const fe=b(j,te);return fe?Promise.reject(fe):Promise.resolve()}function M(j){const te=Qe.values().next().value;return te&&typeof te.runWithContext=="function"?te.runWithContext(j):j()}function L(j,te){let fe;const[ge,ye,T]=Wy(j,te);fe=Mc(ge.reverse(),"beforeRouteLeave",j,te);for(const V of ge)V.leaveGuards.forEach(Y=>{fe.push(Ts(Y,j,te))});const I=S.bind(null,j,te);return fe.push(I),ue(fe).then(()=>{fe=[];for(const V of r.list())fe.push(Ts(V,j,te));return fe.push(I),ue(fe)}).then(()=>{fe=Mc(ye,"beforeRouteUpdate",j,te);for(const V of ye)V.updateGuards.forEach(Y=>{fe.push(Ts(Y,j,te))});return fe.push(I),ue(fe)}).then(()=>{fe=[];for(const V of T)if(V.beforeEnter)if(li(V.beforeEnter))for(const Y of V.beforeEnter)fe.push(Ts(Y,j,te));else fe.push(Ts(V.beforeEnter,j,te));return fe.push(I),ue(fe)}).then(()=>(j.matched.forEach(V=>V.enterCallbacks={}),fe=Mc(T,"beforeRouteEnter",j,te,M),fe.push(I),ue(fe))).then(()=>{fe=[];for(const V of o.list())fe.push(Ts(V,j,te));return fe.push(I),ue(fe)}).catch(V=>Fi(V,Gt.NAVIGATION_CANCELLED)?V:Promise.reject(V))}function E(j,te,fe){a.list().forEach(ge=>M(()=>ge(j,te,fe)))}function P(j,te,fe,ge,ye){const T=b(j,te);if(T)return T;const I=te===hs,V=Lr?history.state:{};fe&&(ge||I?s.replace(j.fullPath,yt({scroll:I&&V&&V.scroll},ye)):s.push(j.fullPath,ye)),l.value=j,Ce(j,te,fe,I),Se()}let B;function Z(){B||(B=s.listen((j,te,fe)=>{if(!Ge.listening)return;const ge=h(j),ye=C(ge,Ge.currentRoute.value);if(ye){R(yt(ye,{replace:!0,force:!0}),ge).catch(ko);return}c=ge;const T=l.value;Lr&&Oy(Xh(T.fullPath,fe.delta),Jl()),L(ge,T).catch(I=>Fi(I,Gt.NAVIGATION_ABORTED|Gt.NAVIGATION_CANCELLED)?I:Fi(I,Gt.NAVIGATION_GUARD_REDIRECT)?(R(yt(v(I.to),{force:!0}),ge).then(V=>{Fi(V,Gt.NAVIGATION_ABORTED|Gt.NAVIGATION_DUPLICATED)&&!fe.delta&&fe.type===Ru.pop&&s.go(-1,!1)}).catch(ko),Promise.reject()):(fe.delta&&s.go(-fe.delta,!1),le(I,ge,T))).then(I=>{I=I||P(ge,T,!1),I&&(fe.delta&&!Fi(I,Gt.NAVIGATION_CANCELLED)?s.go(-fe.delta,!1):fe.type===Ru.pop&&Fi(I,Gt.NAVIGATION_ABORTED|Gt.NAVIGATION_DUPLICATED)&&s.go(-1,!1)),E(ge,T,I)}).catch(ko)}))}let G=po(),X=po(),$;function le(j,te,fe){Se(j);const ge=X.list();return ge.length?ge.forEach(ye=>ye(j,te,fe)):console.error(j),Promise.reject(j)}function me(){return $&&l.value!==hs?Promise.resolve():new Promise((j,te)=>{G.add([j,te])})}function Se(j){return $||($=!j,Z(),G.list().forEach(([te,fe])=>j?fe(j):te()),G.reset()),j}function Ce(j,te,fe,ge){const{scrollBehavior:ye}=t;if(!Lr||!ye)return Promise.resolve();const T=!fe&&Fy(Xh(j.fullPath,0))||(ge||!fe)&&history.state&&history.state.scroll||null;return ai().then(()=>ye(j,te,T)).then(I=>I&&Uy(I)).catch(I=>le(I,j,te))}const Pe=j=>s.go(j);let Ke;const Qe=new Set,Ge={currentRoute:l,listening:!0,addRoute:p,removeRoute:g,clearRoutes:e.clearRoutes,hasRoute:m,getRoutes:_,resolve:h,options:t,push:x,replace:D,go:Pe,back:()=>Pe(-1),forward:()=>Pe(1),beforeEach:r.add,beforeResolve:o.add,afterEach:a.add,onError:X.add,isReady:me,install(j){j.component("RouterLink",fb),j.component("RouterView",mb),j.config.globalProperties.$router=Ge,Object.defineProperty(j.config.globalProperties,"$route",{enumerable:!0,get:()=>Oe(l)}),Lr&&!Ke&&l.value===hs&&(Ke=!0,x(s.location).catch(ge=>{}));const te={};for(const ge in hs)Object.defineProperty(te,ge,{get:()=>l.value[ge],enumerable:!0});j.provide(Ql,Ge),j.provide(fd,Zf(te)),j.provide(Iu,l);const fe=j.unmount;Qe.add(j),j.unmount=function(){Qe.delete(j),Qe.size<1&&(c=hs,B&&B(),B=null,l.value=hs,Ke=!1,$=!1),fe()}}};function ue(j){return j.reduce((te,fe)=>te.then(()=>M(fe)),Promise.resolve())}return Ge}function R_(){return zn(Ql)}function ZL(t){return zn(fd)}/*!
  * shared v11.4.4
  * (c) 2026 kazuya kawaguchi
  * Released under the MIT License.
  */function _b(t,e){typeof console<"u"&&(console.warn("[intlify] "+t),e&&console.warn(e.stack))}const xl=typeof window<"u",Ns=(t,e=!1)=>e?Symbol.for(t):Symbol(t),vb=(t,e,n)=>xb({l:t,k:e,s:n}),xb=t=>JSON.stringify(t).replace(/\u2028/g,"\\u2028").replace(/\u2029/g,"\\u2029").replace(/\u0027/g,"\\u0027"),Zt=t=>typeof t=="number"&&isFinite(t),P_=t=>hd(t)==="[object Date]",Yr=t=>hd(t)==="[object RegExp]",ec=t=>dt(t)&&Object.keys(t).length===0,Jt=Object.assign,Sb=Object.create,Lt=(t=null)=>Sb(t);let rp;const tr=()=>rp||(rp=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:Lt());function op(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;").replace(/\//g,"&#x2F;").replace(/=/g,"&#x3D;")}function yb(t){return t.replace(/&(?![a-zA-Z0-9#]{2,6};)/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&apos;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}const bb=/^\s*javascript\s*(?::|&#0*58;?|&#x0*3a;?|&colon;?)/i,Eb=/^(?:href|src|action|formaction)$/i;function dd(t){return bb.test(t)}function Mb(t){const e=/url\s*\(/gi;let n="",i=0,s;for(;(s=e.exec(t))!==null;){const r=s.index,o=e.lastIndex-1;let a=o+1,l=1,c=null;for(;a<t.length;a++){const f=t[a];if(c){f===c&&(c=null);continue}if(f==='"'||f==="'")c=f;else if(f==="(")l++;else if(f===")"&&(l--,l===0))break}if(l!==0)break;const u=t.slice(o+1,a).trim(),d=u.startsWith('"')&&u.endsWith('"')||u.startsWith("'")&&u.endsWith("'")?u.slice(1,-1).trim():u;n+=t.slice(i,r),n+=dd(d)?"url(about:blank)":t.slice(r,a+1),i=a+1}return n+t.slice(i)}function ap(t,e){if(Eb.test(t)&&dd(e))return"about:blank";const n=t.toLowerCase()==="style"?Mb(e):e;return yb(n)}function Tb(t){return t=t.replace(/([\w:-]+)\s*=\s*"([^"]*)"/g,(n,i,s)=>`${i}="${ap(i,s)}"`),t=t.replace(/([\w:-]+)\s*=\s*'([^']*)'/g,(n,i,s)=>`${i}='${ap(i,s)}'`),/\s*on\w+\s*=\s*["']?[^"'>]+["']?/gi.test(t)&&(t=t.replace(/(\s+)(on)(\w+\s*=)/gi,"$1&#111;n$3")),t=t.replace(/(\s+(?:href|src|action|formaction)\s*=\s*)([^\s"'=<>`]+)/gi,(n,i,s)=>dd(s)?`${i}about:blank`:n),t}const Ab=Object.prototype.hasOwnProperty;function jn(t,e){return Ab.call(t,e)}const Wt=Array.isArray,zt=t=>typeof t=="function",ke=t=>typeof t=="string",_t=t=>typeof t=="boolean",xt=t=>t!==null&&typeof t=="object",wb=t=>xt(t)&&zt(t.then)&&zt(t.catch),I_=Object.prototype.toString,hd=t=>I_.call(t),dt=t=>hd(t)==="[object Object]",Cb=t=>t==null?"":Wt(t)||dt(t)&&t.toString===I_?JSON.stringify(t,null,2):String(t);function pd(t,e=""){return t.reduce((n,i,s)=>s===0?n+i:n+e+i,"")}const ma=t=>!xt(t)||Wt(t);function ja(t,e){if(ma(t)||ma(e))throw new Error("Invalid value");const n=[{src:t,des:e}];for(;n.length;){const{src:i,des:s}=n.pop();Object.keys(i).forEach(r=>{r!=="__proto__"&&(xt(i[r])&&!xt(s[r])&&(s[r]=Array.isArray(i[r])?[]:Lt()),ma(s[r])||ma(i[r])?s[r]=i[r]:n.push({src:i[r],des:s[r]}))})}}/*!
  * message-compiler v11.4.4
  * (c) 2026 kazuya kawaguchi
  * Released under the MIT License.
  */function Rb(t,e,n){return{line:t,column:e,offset:n}}function Lu(t,e,n){return{start:t,end:e}}const bt={EXPECTED_TOKEN:1,INVALID_TOKEN_IN_PLACEHOLDER:2,UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER:3,UNKNOWN_ESCAPE_SEQUENCE:4,INVALID_UNICODE_ESCAPE_SEQUENCE:5,UNBALANCED_CLOSING_BRACE:6,UNTERMINATED_CLOSING_BRACE:7,EMPTY_PLACEHOLDER:8,NOT_ALLOW_NEST_PLACEHOLDER:9,INVALID_LINKED_FORMAT:10,MUST_HAVE_MESSAGES_IN_PLURAL:11,UNEXPECTED_EMPTY_LINKED_MODIFIER:12,UNEXPECTED_EMPTY_LINKED_KEY:13,UNEXPECTED_LEXICAL_ANALYSIS:14},Pb=17;function tc(t,e,n={}){const{domain:i,messages:s,args:r}=n,o=t,a=new SyntaxError(String(o));return a.code=t,e&&(a.location=e),a.domain=i,a}function Ib(t){throw t}const pi=" ",Lb="\r",mn=`
`,Db="\u2028",Nb="\u2029";function Ub(t){const e=t;let n=0,i=1,s=1,r=0;const o=R=>e[R]===Lb&&e[R+1]===mn,a=R=>e[R]===mn,l=R=>e[R]===Nb,c=R=>e[R]===Db,u=R=>o(R)||a(R)||l(R)||c(R),d=()=>n,f=()=>i,p=()=>s,g=()=>r,_=R=>o(R)||l(R)||c(R)?mn:e[R],m=()=>_(n),h=()=>_(n+r);function v(){return r=0,u(n)&&(i++,s=0),o(n)&&n++,n++,s++,e[n]}function b(){return o(n+r)&&r++,r++,e[n+r]}function x(){n=0,i=1,s=1,r=0}function D(R=0){r=R}function C(){const R=n+r;for(;R!==n;)v();r=0}return{index:d,line:f,column:p,peekOffset:g,charAt:_,currentChar:m,currentPeek:h,next:v,peek:b,reset:x,resetPeek:D,skipToPeek:C}}const ki=void 0,Ob=".",lp="'",Fb="tokenizer";function kb(t,e={}){const n=e.location!==!1,i=Ub(t),s=()=>i.index(),r=()=>Rb(i.line(),i.column(),i.index()),o=r(),a=s(),l={currentType:13,offset:a,startLoc:o,endLoc:o,lastType:13,lastOffset:a,lastStartLoc:o,lastEndLoc:o,braceNest:0,inLinked:!1,text:""},c=()=>l,{onError:u}=e;function d(U,O,A,...k){const z=c();if(O.column+=A,O.offset+=A,u){const ee=n?Lu(z.startLoc,O):null,F=tc(U,ee,{domain:Fb,args:k});u(F)}}function f(U,O,A){U.endLoc=r(),U.currentType=O;const k={type:O};return n&&(k.loc=Lu(U.startLoc,U.endLoc)),A!=null&&(k.value=A),k}const p=U=>f(U,13);function g(U,O){return U.currentChar()===O?(U.next(),O):(d(bt.EXPECTED_TOKEN,r(),0,O),"")}function _(U){let O="";for(;U.currentPeek()===pi||U.currentPeek()===mn;)O+=U.currentPeek(),U.peek();return O}function m(U){const O=_(U);return U.skipToPeek(),O}function h(U){if(U===ki)return!1;const O=U.charCodeAt(0);return O>=97&&O<=122||O>=65&&O<=90||O===95}function v(U){if(U===ki)return!1;const O=U.charCodeAt(0);return O>=48&&O<=57}function b(U,O){const{currentType:A}=O;if(A!==2)return!1;_(U);const k=h(U.currentPeek());return U.resetPeek(),k}function x(U,O){const{currentType:A}=O;if(A!==2)return!1;_(U);const k=U.currentPeek()==="-"?U.peek():U.currentPeek(),z=v(k);return U.resetPeek(),z}function D(U,O){const{currentType:A}=O;if(A!==2)return!1;_(U);const k=U.currentPeek()===lp;return U.resetPeek(),k}function C(U,O){const{currentType:A}=O;if(A!==7)return!1;_(U);const k=U.currentPeek()===".";return U.resetPeek(),k}function R(U,O){const{currentType:A}=O;if(A!==8)return!1;_(U);const k=h(U.currentPeek());return U.resetPeek(),k}function S(U,O){const{currentType:A}=O;if(!(A===7||A===11))return!1;_(U);const k=U.currentPeek()===":";return U.resetPeek(),k}function M(U,O){const{currentType:A}=O;if(A!==9)return!1;const k=()=>{const ee=U.currentPeek();return ee==="{"?h(U.peek()):ee==="@"||ee==="|"||ee===":"||ee==="."||ee===pi||!ee?!1:ee===mn?(U.peek(),k()):E(U,!1)},z=k();return U.resetPeek(),z}function L(U){_(U);const O=U.currentPeek()==="|";return U.resetPeek(),O}function E(U,O=!0){const A=(z=!1,ee="")=>{const F=U.currentPeek();return F==="{"||F==="@"||!F?z:F==="|"?!(ee===pi||ee===mn):F===pi?(U.peek(),A(!0,pi)):F===mn?(U.peek(),A(!0,mn)):!0},k=A();return O&&U.resetPeek(),k}function P(U,O){const A=U.currentChar();return A===ki?ki:O(A)?(U.next(),A):null}function B(U){const O=U.charCodeAt(0);return O>=97&&O<=122||O>=65&&O<=90||O>=48&&O<=57||O===95||O===36}function Z(U){return P(U,B)}function G(U){const O=U.charCodeAt(0);return O>=97&&O<=122||O>=65&&O<=90||O>=48&&O<=57||O===95||O===36||O===45}function X(U){return P(U,G)}function $(U){const O=U.charCodeAt(0);return O>=48&&O<=57}function le(U){return P(U,$)}function me(U){const O=U.charCodeAt(0);return O>=48&&O<=57||O>=65&&O<=70||O>=97&&O<=102}function Se(U){return P(U,me)}function Ce(U){let O="",A="";for(;O=le(U);)A+=O;return A}function Pe(U){let O="";for(;;){const A=U.currentChar();if(A==="\\"){const k=U.peek();k==="{"||k==="}"||k==="@"||k==="|"||k==="\\"?(O+=A+k,U.next(),U.next()):(U.resetPeek(),O+=A,U.next())}else{if(A==="{"||A==="}"||A==="@"||A==="|"||!A)break;if(A===pi||A===mn)if(E(U))O+=A,U.next();else{if(L(U))break;O+=A,U.next()}else O+=A,U.next()}}return O}function Ke(U){m(U);let O="",A="";for(;O=X(U);)A+=O;const k=U.currentChar();if(k&&k!=="}"&&k!==ki&&k!==pi&&k!==mn&&k!=="　"){const z=ge(U);return d(bt.INVALID_TOKEN_IN_PLACEHOLDER,r(),0,A+z),A+z}return U.currentChar()===ki&&d(bt.UNTERMINATED_CLOSING_BRACE,r(),0),A}function Qe(U){m(U);let O="";return U.currentChar()==="-"?(U.next(),O+=`-${Ce(U)}`):O+=Ce(U),U.currentChar()===ki&&d(bt.UNTERMINATED_CLOSING_BRACE,r(),0),O}function Ge(U){return U!==lp&&U!==mn}function ue(U){m(U),g(U,"'");let O="",A="";for(;O=P(U,Ge);)O==="\\"?A+=j(U):A+=O;const k=U.currentChar();return k===mn||k===ki?(d(bt.UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER,r(),0),k===mn&&(U.next(),g(U,"'")),A):(g(U,"'"),A)}function j(U){const O=U.currentChar();switch(O){case"\\":case"'":return U.next(),`\\${O}`;case"u":return te(U,O,4);case"U":return te(U,O,6);default:return d(bt.UNKNOWN_ESCAPE_SEQUENCE,r(),0,O),""}}function te(U,O,A){g(U,O);let k="";for(let z=0;z<A;z++){const ee=Se(U);if(!ee){d(bt.INVALID_UNICODE_ESCAPE_SEQUENCE,r(),0,`\\${O}${k}${U.currentChar()}`);break}k+=ee}return`\\${O}${k}`}function fe(U){return U!=="{"&&U!=="}"&&U!==pi&&U!==mn}function ge(U){m(U);let O="",A="";for(;O=P(U,fe);)A+=O;return A}function ye(U){let O="",A="";for(;O=Z(U);)A+=O;return A}function T(U){const O=A=>{const k=U.currentChar();return k==="{"||k==="@"||k==="|"||k==="("||k===")"||!k||k===pi?A:(A+=k,U.next(),O(A))};return O("")}function I(U){m(U);const O=g(U,"|");return m(U),O}function V(U,O){let A=null;switch(U.currentChar()){case"{":return O.braceNest>=1&&d(bt.NOT_ALLOW_NEST_PLACEHOLDER,r(),0),U.next(),A=f(O,2,"{"),m(U),O.braceNest++,A;case"}":return O.braceNest>0&&O.currentType===2&&d(bt.EMPTY_PLACEHOLDER,r(),0),U.next(),A=f(O,3,"}"),O.braceNest--,O.braceNest>0&&m(U),O.inLinked&&O.braceNest===0&&(O.inLinked=!1),A;case"@":return O.braceNest>0&&d(bt.UNTERMINATED_CLOSING_BRACE,r(),0),A=Y(U,O)||p(O),O.braceNest=0,A;default:{let z=!0,ee=!0,F=!0;if(L(U))return O.braceNest>0&&d(bt.UNTERMINATED_CLOSING_BRACE,r(),0),A=f(O,1,I(U)),O.braceNest=0,O.inLinked=!1,A;if(O.braceNest>0&&(O.currentType===4||O.currentType===5||O.currentType===6))return d(bt.UNTERMINATED_CLOSING_BRACE,r(),0),O.braceNest=0,J(U,O);if(z=b(U,O))return A=f(O,4,Ke(U)),m(U),A;if(ee=x(U,O))return A=f(O,5,Qe(U)),m(U),A;if(F=D(U,O))return A=f(O,6,ue(U)),m(U),A;if(!z&&!ee&&!F)return A=f(O,12,ge(U)),d(bt.INVALID_TOKEN_IN_PLACEHOLDER,r(),0,A.value),m(U),A;break}}return A}function Y(U,O){const{currentType:A}=O;let k=null;const z=U.currentChar();switch((A===7||A===8||A===11||A===9)&&(z===mn||z===pi)&&d(bt.INVALID_LINKED_FORMAT,r(),0),z){case"@":return U.next(),k=f(O,7,"@"),O.inLinked=!0,k;case".":return m(U),U.next(),f(O,8,".");case":":return m(U),U.next(),f(O,9,":");default:return L(U)?(k=f(O,1,I(U)),O.braceNest=0,O.inLinked=!1,k):C(U,O)||S(U,O)?(m(U),Y(U,O)):R(U,O)?(m(U),f(O,11,ye(U))):M(U,O)?(m(U),z==="{"?V(U,O)||k:f(O,10,T(U))):(A===7&&d(bt.INVALID_LINKED_FORMAT,r(),0),O.braceNest=0,O.inLinked=!1,J(U,O))}}function J(U,O){let A={type:13};if(O.braceNest>0)return V(U,O)||p(O);if(O.inLinked)return Y(U,O)||p(O);switch(U.currentChar()){case"{":return V(U,O)||p(O);case"}":return d(bt.UNBALANCED_CLOSING_BRACE,r(),0),U.next(),f(O,3,"}");case"@":return Y(U,O)||p(O);default:{if(L(U))return A=f(O,1,I(U)),O.braceNest=0,O.inLinked=!1,A;if(E(U))return f(O,0,Pe(U));break}}return A}function ae(){const{currentType:U,offset:O,startLoc:A,endLoc:k}=l;return l.lastType=U,l.lastOffset=O,l.lastStartLoc=A,l.lastEndLoc=k,l.offset=s(),l.startLoc=r(),i.currentChar()===ki?f(l,13):J(i,l)}return{nextToken:ae,currentOffset:s,currentPosition:r,context:c}}const Bb="parser",zb=/(?:\\\\|\\'|\\u([0-9a-fA-F]{4})|\\U([0-9a-fA-F]{6}))/g,Vb=/\\([\\@{}|])/g;function Hb(t,e){return e}function Gb(t,e,n){switch(t){case"\\\\":return"\\";case"\\'":return"'";default:{const i=parseInt(e||n,16);return i<=55295||i>=57344?String.fromCodePoint(i):"�"}}}function Wb(t={}){const e=t.location!==!1,{onError:n}=t;function i(h,v,b,x,...D){const C=h.currentPosition();if(C.offset+=x,C.column+=x,n){const R=e?Lu(b,C):null,S=tc(v,R,{domain:Bb,args:D});n(S)}}function s(h,v,b){const x={type:h};return e&&(x.start=v,x.end=v,x.loc={start:b,end:b}),x}function r(h,v,b,x){e&&(h.end=v,h.loc&&(h.loc.end=b))}function o(h,v){const b=h.context(),x=s(3,b.offset,b.startLoc);return x.value=v.replace(Vb,Hb),r(x,h.currentOffset(),h.currentPosition()),x}function a(h,v){const b=h.context(),{lastOffset:x,lastStartLoc:D}=b,C=s(5,x,D);return C.index=parseInt(v,10),h.nextToken(),r(C,h.currentOffset(),h.currentPosition()),C}function l(h,v){const b=h.context(),{lastOffset:x,lastStartLoc:D}=b,C=s(4,x,D);return C.key=v,h.nextToken(),r(C,h.currentOffset(),h.currentPosition()),C}function c(h,v){const b=h.context(),{lastOffset:x,lastStartLoc:D}=b,C=s(9,x,D);return C.value=v.replace(zb,Gb),h.nextToken(),r(C,h.currentOffset(),h.currentPosition()),C}function u(h){const v=h.nextToken(),b=h.context(),{lastOffset:x,lastStartLoc:D}=b,C=s(8,x,D);return v.type!==11?(i(h,bt.UNEXPECTED_EMPTY_LINKED_MODIFIER,b.lastStartLoc,0),C.value="",r(C,x,D),{nextConsumeToken:v,node:C}):(v.value==null&&i(h,bt.UNEXPECTED_LEXICAL_ANALYSIS,b.lastStartLoc,0,mi(v)),C.value=v.value||"",r(C,h.currentOffset(),h.currentPosition()),{node:C})}function d(h,v){const b=h.context(),x=s(7,b.offset,b.startLoc);return x.value=v,r(x,h.currentOffset(),h.currentPosition()),x}function f(h){const v=h.context(),b=s(6,v.offset,v.startLoc);let x=h.nextToken();if(x.type===8){const D=u(h);b.modifier=D.node,x=D.nextConsumeToken||h.nextToken()}switch(x.type!==9&&i(h,bt.UNEXPECTED_LEXICAL_ANALYSIS,v.lastStartLoc,0,mi(x)),x=h.nextToken(),x.type===2&&(x=h.nextToken()),x.type){case 10:x.value==null&&i(h,bt.UNEXPECTED_LEXICAL_ANALYSIS,v.lastStartLoc,0,mi(x)),b.key=d(h,x.value||"");break;case 4:x.value==null&&i(h,bt.UNEXPECTED_LEXICAL_ANALYSIS,v.lastStartLoc,0,mi(x)),b.key=l(h,x.value||"");break;case 5:x.value==null&&i(h,bt.UNEXPECTED_LEXICAL_ANALYSIS,v.lastStartLoc,0,mi(x)),b.key=a(h,x.value||"");break;case 6:x.value==null&&i(h,bt.UNEXPECTED_LEXICAL_ANALYSIS,v.lastStartLoc,0,mi(x)),b.key=c(h,x.value||"");break;default:{i(h,bt.UNEXPECTED_EMPTY_LINKED_KEY,v.lastStartLoc,0);const D=h.context(),C=s(7,D.offset,D.startLoc);return C.value="",r(C,D.offset,D.startLoc),b.key=C,r(b,D.offset,D.startLoc),{nextConsumeToken:x,node:b}}}return r(b,h.currentOffset(),h.currentPosition()),{node:b}}function p(h){const v=h.context(),b=v.currentType===1?h.currentOffset():v.offset,x=v.currentType===1?v.endLoc:v.startLoc,D=s(2,b,x);D.items=[];let C=null;do{const M=C||h.nextToken();switch(C=null,M.type){case 0:M.value==null&&i(h,bt.UNEXPECTED_LEXICAL_ANALYSIS,v.lastStartLoc,0,mi(M)),D.items.push(o(h,M.value||""));break;case 5:M.value==null&&i(h,bt.UNEXPECTED_LEXICAL_ANALYSIS,v.lastStartLoc,0,mi(M)),D.items.push(a(h,M.value||""));break;case 4:M.value==null&&i(h,bt.UNEXPECTED_LEXICAL_ANALYSIS,v.lastStartLoc,0,mi(M)),D.items.push(l(h,M.value||""));break;case 6:M.value==null&&i(h,bt.UNEXPECTED_LEXICAL_ANALYSIS,v.lastStartLoc,0,mi(M)),D.items.push(c(h,M.value||""));break;case 7:{const L=f(h);D.items.push(L.node),C=L.nextConsumeToken||null;break}}}while(v.currentType!==13&&v.currentType!==1);const R=v.currentType===1?v.lastOffset:h.currentOffset(),S=v.currentType===1?v.lastEndLoc:h.currentPosition();return r(D,R,S),D}function g(h,v,b,x){const D=h.context();let C=x.items.length===0;const R=s(1,v,b);R.cases=[],R.cases.push(x);do{const S=p(h);C||(C=S.items.length===0),R.cases.push(S)}while(D.currentType!==13);return C&&i(h,bt.MUST_HAVE_MESSAGES_IN_PLURAL,b,0),r(R,h.currentOffset(),h.currentPosition()),R}function _(h){const v=h.context(),{offset:b,startLoc:x}=v,D=p(h);return v.currentType===13?D:g(h,b,x,D)}function m(h){const v=kb(h,Jt({},t)),b=v.context(),x=s(0,b.offset,b.startLoc);return e&&x.loc&&(x.loc.source=h),x.body=_(v),t.onCacheKey&&(x.cacheKey=t.onCacheKey(h)),b.currentType!==13&&i(v,bt.UNEXPECTED_LEXICAL_ANALYSIS,b.lastStartLoc,0,h[b.offset]||""),r(x,v.currentOffset(),v.currentPosition()),x}return{parse:m}}function mi(t){if(t.type===13)return"EOF";const e=(t.value||"").replace(/\r?\n/gu,"\\n");return e.length>10?e.slice(0,9)+"…":e}function $b(t,e={}){const n={ast:t,helpers:new Set};return{context:()=>n,helper:r=>(n.helpers.add(r),r)}}function cp(t,e){for(let n=0;n<t.length;n++)md(t[n],e)}function md(t,e){switch(t.type){case 1:cp(t.cases,e),e.helper("plural");break;case 2:cp(t.items,e);break;case 6:{md(t.key,e),e.helper("linked"),e.helper("type");break}case 5:e.helper("interpolate"),e.helper("list");break;case 4:e.helper("interpolate"),e.helper("named");break}}function Xb(t,e={}){const n=$b(t);n.helper("normalize"),t.body&&md(t.body,n);const i=n.context();t.helpers=Array.from(i.helpers)}function qb(t){const e=t.body;return e.type===2?up(e):e.cases.forEach(n=>up(n)),t}function up(t){if(t.items.length===1){const e=t.items[0];(e.type===3||e.type===9)&&(t.static=e.value,delete e.value)}else{const e=[];for(let n=0;n<t.items.length;n++){const i=t.items[n];if(!(i.type===3||i.type===9)||i.value==null)break;e.push(i.value)}if(e.length===t.items.length){t.static=pd(e);for(let n=0;n<t.items.length;n++){const i=t.items[n];(i.type===3||i.type===9)&&delete i.value}}}}function Dr(t){switch(t.t=t.type,t.type){case 0:{const e=t;Dr(e.body),e.b=e.body,delete e.body;break}case 1:{const e=t,n=e.cases;for(let i=0;i<n.length;i++)Dr(n[i]);e.c=n,delete e.cases;break}case 2:{const e=t,n=e.items;for(let i=0;i<n.length;i++)Dr(n[i]);e.i=n,delete e.items,e.static&&(e.s=e.static,delete e.static);break}case 3:case 9:case 8:case 7:{const e=t;e.value&&(e.v=e.value,delete e.value);break}case 6:{const e=t;Dr(e.key),e.k=e.key,delete e.key,e.modifier&&(Dr(e.modifier),e.m=e.modifier,delete e.modifier);break}case 5:{const e=t;e.i=e.index,delete e.index;break}case 4:{const e=t;e.k=e.key,delete e.key;break}}delete t.type}function Kb(t,e){const{filename:n,breakLineCode:i,needIndent:s}=e,r=e.location!==!1,o={filename:n,code:"",column:1,line:1,offset:0,map:void 0,breakLineCode:i,needIndent:s,indentLevel:0};r&&t.loc&&(o.source=t.loc.source);const a=()=>o;function l(_,m){o.code+=_}function c(_,m=!0){const h=m?i:"";l(s?h+"  ".repeat(_):h)}function u(_=!0){const m=++o.indentLevel;_&&c(m)}function d(_=!0){const m=--o.indentLevel;_&&c(m)}function f(){c(o.indentLevel)}return{context:a,push:l,indent:u,deindent:d,newline:f,helper:_=>`_${_}`,needIndent:()=>o.needIndent}}function Yb(t,e){const{helper:n}=t;t.push(`${n("linked")}(`),jr(t,e.key),e.modifier?(t.push(", "),jr(t,e.modifier),t.push(", _type")):t.push(", undefined, _type"),t.push(")")}function jb(t,e){const{helper:n,needIndent:i}=t;t.push(`${n("normalize")}([`),t.indent(i());const s=e.items.length;for(let r=0;r<s&&(jr(t,e.items[r]),r!==s-1);r++)t.push(", ");t.deindent(i()),t.push("])")}function Zb(t,e){const{helper:n,needIndent:i}=t;if(e.cases.length>1){t.push(`${n("plural")}([`),t.indent(i());const s=e.cases.length;for(let r=0;r<s&&(jr(t,e.cases[r]),r!==s-1);r++)t.push(", ");t.deindent(i()),t.push("])")}}function Jb(t,e){e.body?jr(t,e.body):t.push("null")}function jr(t,e){const{helper:n}=t;switch(e.type){case 0:Jb(t,e);break;case 1:Zb(t,e);break;case 2:jb(t,e);break;case 6:Yb(t,e);break;case 8:t.push(JSON.stringify(e.value),e);break;case 7:t.push(JSON.stringify(e.value),e);break;case 5:t.push(`${n("interpolate")}(${n("list")}(${e.index}))`,e);break;case 4:t.push(`${n("interpolate")}(${n("named")}(${JSON.stringify(e.key)}))`,e);break;case 9:t.push(JSON.stringify(e.value),e);break;case 3:t.push(JSON.stringify(e.value),e);break}}const Qb=(t,e={})=>{const n=ke(e.mode)?e.mode:"normal",i=ke(e.filename)?e.filename:"message.intl";e.sourceMap;const s=e.breakLineCode!=null?e.breakLineCode:n==="arrow"?";":`
`,r=e.needIndent?e.needIndent:n!=="arrow",o=t.helpers||[],a=Kb(t,{filename:i,breakLineCode:s,needIndent:r});a.push(n==="normal"?"function __msg__ (ctx) {":"(ctx) => {"),a.indent(r),o.length>0&&(a.push(`const { ${pd(o.map(u=>`${u}: _${u}`),", ")} } = ctx`),a.newline()),a.push("return "),jr(a,t),a.deindent(r),a.push("}"),delete t.helpers;const{code:l,map:c}=a.context();return{ast:t,code:l,map:c?c.toJSON():void 0}};function e1(t,e={}){const n=Jt({},e),i=!!n.jit,s=!!n.minify,r=n.optimize==null?!0:n.optimize,a=Wb(n).parse(t);return i?(r&&qb(a),s&&Dr(a),{ast:a,code:""}):(Xb(a,n),Qb(a,n))}/*!
  * core-base v11.4.4
  * (c) 2026 kazuya kawaguchi
  * Released under the MIT License.
  */function t1(){typeof __INTLIFY_PROD_DEVTOOLS__!="boolean"&&(tr().__INTLIFY_PROD_DEVTOOLS__=!1),typeof __INTLIFY_DROP_MESSAGE_COMPILER__!="boolean"&&(tr().__INTLIFY_DROP_MESSAGE_COMPILER__=!1)}function Ci(t){return xt(t)&&gd(t)===0&&(jn(t,"b")||jn(t,"body"))}const L_=["b","body"];function n1(t){return Us(t,L_)}const D_=["c","cases"];function i1(t){return Us(t,D_,[])}const N_=["s","static"];function s1(t){return Us(t,N_)}const U_=["i","items"];function r1(t){return Us(t,U_,[])}const O_=["t","type"];function gd(t){return Us(t,O_)}const F_=["v","value"];function ga(t,e){const n=Us(t,F_);if(n!=null)return n;throw qo(e)}const k_=["m","modifier"];function o1(t){return Us(t,k_)}const B_=["k","key"];function a1(t){const e=Us(t,B_);if(e)return e;throw qo(6)}function Us(t,e,n){for(let i=0;i<e.length;i++){const s=e[i];if(jn(t,s)&&t[s]!=null)return t[s]}return n}const z_=[...L_,...D_,...N_,...U_,...B_,...k_,...F_,...O_];function qo(t){return new Error(`unhandled node type: ${t}`)}function Tc(t){return n=>l1(n,t)}function l1(t,e){const n=n1(e);if(n==null)throw qo(0);if(gd(n)===1){const r=i1(n);return t.plural(r.reduce((o,a)=>[...o,fp(t,a)],[]))}else return fp(t,n)}function fp(t,e){const n=s1(e);if(n!=null)return t.type==="text"?n:t.normalize([n]);{const i=r1(e).reduce((s,r)=>[...s,Du(t,r)],[]);return t.normalize(i)}}function Du(t,e){const n=gd(e);switch(n){case 3:return ga(e,n);case 9:return ga(e,n);case 4:{const i=e;if(jn(i,"k")&&i.k)return t.interpolate(t.named(i.k));if(jn(i,"key")&&i.key)return t.interpolate(t.named(i.key));throw qo(n)}case 5:{const i=e;if(jn(i,"i")&&Zt(i.i))return t.interpolate(t.list(i.i));if(jn(i,"index")&&Zt(i.index))return t.interpolate(t.list(i.index));throw qo(n)}case 6:{const i=e,s=o1(i),r=a1(i);return t.linked(Du(t,r),s?Du(t,s):void 0,t.type)}case 7:return ga(e,n);case 8:return ga(e,n);default:throw new Error(`unhandled node on format message part: ${n}`)}}const c1=t=>t;let _a=Lt();function u1(t,e={}){let n=!1;const i=e.onError||Ib;return e.onError=s=>{n=!0,i(s)},{...e1(t,e),detectError:n}}function f1(t,e){if(!__INTLIFY_DROP_MESSAGE_COMPILER__&&ke(t)){_t(e.warnHtmlMessage)&&e.warnHtmlMessage;const i=(e.onCacheKey||c1)(t),s=_a[i];if(s)return s;const{ast:r,detectError:o}=u1(t,{...e,location:!1,jit:!0}),a=Tc(r);return o?a:_a[i]=a}else{const n=t.cacheKey;if(n){const i=_a[n];return i||(_a[n]=Tc(t))}else return Tc(t)}}let Ko=null;function d1(t){Ko=t}function h1(t,e,n){Ko&&Ko.emit("i18n:init",{timestamp:Date.now(),i18n:t,version:e,meta:n})}const p1=m1("function:translate");function m1(t){return e=>Ko&&Ko.emit(t,e)}const ji={INVALID_ARGUMENT:Pb,INVALID_DATE_ARGUMENT:18,INVALID_ISO_DATE_ARGUMENT:19,NOT_SUPPORT_LOCALE_PROMISE_VALUE:21,NOT_SUPPORT_LOCALE_ASYNC_FUNCTION:22,NOT_SUPPORT_LOCALE_TYPE:23},g1=24;function Zi(t){return tc(t,null,void 0)}function _d(t,e){return e.locale!=null?dp(e.locale):dp(t.locale)}let Ac;function dp(t){if(ke(t))return t;if(zt(t)){if(t.resolvedOnce&&Ac!=null)return Ac;if(t.constructor.name==="Function"){const e=t();if(wb(e))throw Zi(ji.NOT_SUPPORT_LOCALE_PROMISE_VALUE);return Ac=e}else throw Zi(ji.NOT_SUPPORT_LOCALE_ASYNC_FUNCTION)}else throw Zi(ji.NOT_SUPPORT_LOCALE_TYPE)}function _1(t,e,n){return[...new Set([n,...Wt(e)?e:xt(e)?Object.keys(e):ke(e)?[e]:[n]])]}function Nu(t,e,n){const i=ke(n)?n:Yo,s=t;s.__localeChainCache||(s.__localeChainCache=new Map);let r=s.__localeChainCache.get(i);if(!r){r=[];let o=[n];for(;Wt(o);)o=hp(r,o,e);const a=Wt(e)||!dt(e)?e:e.default?e.default:null;o=ke(a)?[a]:a,Wt(o)&&hp(r,o,!1),s.__localeChainCache.set(i,r)}return r}function hp(t,e,n){let i=!0;for(let s=0;s<e.length&&_t(i);s++){const r=e[s];ke(r)&&(i=v1(t,e[s],n))}return i}function v1(t,e,n){let i;const s=e.split("-");do{const r=s.join("-");i=x1(t,r,n),s.splice(-1,1)}while(s.length&&i===!0);return i}function x1(t,e,n){let i=!1;if(!t.includes(e)&&(i=!0,e)){i=e[e.length-1]!=="!";const s=e.replace(/!/g,"");t.push(s),(Wt(n)||dt(n))&&n[s]&&(i=n[s])}return i}const Os=[];Os[0]={w:[0],i:[3,0],"[":[4],o:[7]};Os[1]={w:[1],".":[2],"[":[4],o:[7]};Os[2]={w:[2],i:[3,0],0:[3,0]};Os[3]={i:[3,0],0:[3,0],w:[1,1],".":[2,1],"[":[4,1],o:[7,1]};Os[4]={"'":[5,0],'"':[6,0],"[":[4,2],"]":[1,3],o:8,l:[4,0]};Os[5]={"'":[4,0],o:8,l:[5,0]};Os[6]={'"':[4,0],o:8,l:[6,0]};const S1=/^\s?(?:true|false|-?[\d.]+|'[^']*'|"[^"]*")\s?$/;function y1(t){return S1.test(t)}function b1(t){const e=t.charCodeAt(0),n=t.charCodeAt(t.length-1);return e===n&&(e===34||e===39)?t.slice(1,-1):t}function E1(t){if(t==null)return"o";switch(t.charCodeAt(0)){case 91:case 93:case 46:case 34:case 39:return t;case 95:case 36:case 45:return"i";case 9:case 10:case 13:case 160:case 65279:case 8232:case 8233:return"w"}return"i"}function M1(t){const e=t.trim();return t.charAt(0)==="0"&&isNaN(parseInt(t))?!1:y1(e)?b1(e):"*"+e}function T1(t){const e=[];let n=-1,i=0,s=0,r,o,a,l,c,u,d;const f=[];f[0]=()=>{o===void 0?o=a:o+=a},f[1]=()=>{o!==void 0&&(e.push(o),o=void 0)},f[2]=()=>{f[0](),s++},f[3]=()=>{if(s>0)s--,i=4,f[0]();else{if(s=0,o===void 0||(o=M1(o),o===!1))return!1;f[1]()}};function p(){const g=t[n+1];if(i===5&&g==="'"||i===6&&g==='"')return n++,a="\\"+g,f[0](),!0}for(;i!==null;)if(n++,r=t[n],!(r==="\\"&&p())){if(l=E1(r),d=Os[i],c=d[l]||d.l||8,c===8||(i=c[0],c[1]!==void 0&&(u=f[c[1]],u&&(a=r,u()===!1))))return;if(i===7)return e}}const pp=new Map;function A1(t,e){return xt(t)?t[e]:null}function w1(t,e){if(!xt(t))return null;let n=pp.get(e);if(n||(n=T1(e),n&&pp.set(e,n)),!n)return null;const i=n.length;let s=t,r=0;for(;r<i;){const o=n[r];if(z_.includes(o)&&Ci(s)||!xt(s)||!jn(s,o))return null;const a=s[o];if(a===void 0||zt(s))return null;s=a,r++}return s}const C1="11.4.4",nc=-1,Yo="en-US",Sl="",mp=t=>`${t.charAt(0).toLocaleUpperCase()}${t.substr(1)}`;function R1(){return{upper:(t,e)=>e==="text"&&ke(t)?t.toUpperCase():e==="vnode"&&xt(t)&&"__v_isVNode"in t?t.children.toUpperCase():t,lower:(t,e)=>e==="text"&&ke(t)?t.toLowerCase():e==="vnode"&&xt(t)&&"__v_isVNode"in t?t.children.toLowerCase():t,capitalize:(t,e)=>e==="text"&&ke(t)?mp(t):e==="vnode"&&xt(t)&&"__v_isVNode"in t?mp(t.children):t}}let V_;function P1(t){V_=t}let H_;function I1(t){H_=t}let G_;function L1(t){G_=t}let W_=null;const D1=t=>{W_=t},N1=()=>W_;let $_=null;const gp=t=>{$_=t},U1=()=>$_;let _p=0;function O1(t={}){const e=zt(t.onWarn)?t.onWarn:_b,n=ke(t.version)?t.version:C1,i=ke(t.locale)||zt(t.locale)?t.locale:Yo,s=zt(i)?Yo:i,r=Wt(t.fallbackLocale)||dt(t.fallbackLocale)||ke(t.fallbackLocale)||t.fallbackLocale===!1?t.fallbackLocale:s,o=dt(t.messages)?t.messages:wc(s),a=dt(t.datetimeFormats)?t.datetimeFormats:wc(s),l=dt(t.numberFormats)?t.numberFormats:wc(s),c=Jt(Lt(),t.modifiers,R1()),u=t.pluralRules||Lt(),d=zt(t.missing)?t.missing:null,f=_t(t.missingWarn)||Yr(t.missingWarn)?t.missingWarn:!0,p=_t(t.fallbackWarn)||Yr(t.fallbackWarn)?t.fallbackWarn:!0,g=!!t.fallbackFormat,_=!!t.unresolving,m=zt(t.postTranslation)?t.postTranslation:null,h=dt(t.processor)?t.processor:null,v=_t(t.warnHtmlMessage)?t.warnHtmlMessage:!0,b=!!t.escapeParameter,x=zt(t.messageCompiler)?t.messageCompiler:V_,D=zt(t.messageResolver)?t.messageResolver:H_||A1,C=zt(t.localeFallbacker)?t.localeFallbacker:G_||_1,R=xt(t.fallbackContext)?t.fallbackContext:void 0,S=t,M=xt(S.__datetimeFormatters)?S.__datetimeFormatters:new Map,L=xt(S.__numberFormatters)?S.__numberFormatters:new Map,E=xt(S.__meta)?S.__meta:{};_p++;const P={version:n,cid:_p,locale:i,fallbackLocale:r,messages:o,modifiers:c,pluralRules:u,missing:d,missingWarn:f,fallbackWarn:p,fallbackFormat:g,unresolving:_,postTranslation:m,processor:h,warnHtmlMessage:v,escapeParameter:b,messageCompiler:x,messageResolver:D,localeFallbacker:C,fallbackContext:R,onWarn:e,__meta:E};return P.datetimeFormats=a,P.numberFormats=l,P.__datetimeFormatters=M,P.__numberFormatters=L,__INTLIFY_PROD_DEVTOOLS__&&h1(P,n,E),P}const wc=t=>({[t]:Lt()});function vd(t,e,n,i,s){const{missing:r,onWarn:o}=t;if(r!==null){const a=r(t,n,e,s);return ke(a)?a:e}else return e}function mo(t,e,n){const i=t;i.__localeChainCache=new Map,t.localeFallbacker(t,n,e)}function F1(t,e){return t===e?!1:t.split("-")[0]===e.split("-")[0]}function k1(t,e){const n=e.indexOf(t);if(n===-1)return!1;for(let i=n+1;i<e.length;i++)if(F1(t,e[i]))return!0;return!1}function vp(t,...e){const{datetimeFormats:n,unresolving:i,fallbackLocale:s,onWarn:r,localeFallbacker:o}=t,{__datetimeFormatters:a}=t;if(!ke(e[0])&&!P_(e[0])&&!Zt(e[0]))return Sl;const[l,c,u,d]=Uu(...e),f=_t(u.missingWarn)?u.missingWarn:t.missingWarn;_t(u.fallbackWarn)?u.fallbackWarn:t.fallbackWarn;const p=!!u.part,g=_d(t,u),_=o(t,s,g);if(!ke(l)||l==="")return new Intl.DateTimeFormat(g.replace(/!/g,""),d).format(c);let m={},h,v=null;const b="datetime format";for(let C=0;C<_.length&&(h=_[C],m=n[h]||{},v=m[l],!dt(v));C++)vd(t,l,h,f,b);if(!dt(v)||!ke(h))return i?nc:l;let x=`${h}__${l}`;ec(d)||(x=`${x}__${JSON.stringify(d)}`);let D=a.get(x);return D||(D=new Intl.DateTimeFormat(h,Jt({},v,d)),a.set(x,D)),p?D.formatToParts(c):D.format(c)}const X_=["localeMatcher","weekday","era","year","month","day","hour","minute","second","timeZoneName","formatMatcher","hour12","timeZone","dateStyle","timeStyle","calendar","dayPeriod","numberingSystem","hourCycle","fractionalSecondDigits"];function Uu(...t){const[e,n,i,s]=t,r=Lt();let o=Lt(),a;if(ke(e)){const l=e.match(/(\d{4}-\d{2}-\d{2})(T|\s)?(.*)/);if(!l)throw Zi(ji.INVALID_ISO_DATE_ARGUMENT);const c=l[3]?l[3].trim().startsWith("T")?`${l[1].trim()}${l[3].trim()}`:`${l[1].trim()}T${l[3].trim()}`:l[1].trim();a=new Date(c);try{a.toISOString()}catch{throw Zi(ji.INVALID_ISO_DATE_ARGUMENT)}}else if(P_(e)){if(isNaN(e.getTime()))throw Zi(ji.INVALID_DATE_ARGUMENT);a=e}else if(Zt(e))a=e;else throw Zi(ji.INVALID_ARGUMENT);return ke(n)?r.key=n:dt(n)&&Object.keys(n).forEach(l=>{X_.includes(l)?o[l]=n[l]:r[l]=n[l]}),ke(i)?r.locale=i:dt(i)&&(o=i),dt(s)&&(o=s),[r.key||"",a,r,o]}function xp(t,e,n){const i=t;for(const s in n){const r=`${e}__${s}`;i.__datetimeFormatters.has(r)&&i.__datetimeFormatters.delete(r)}}function Sp(t,...e){const{numberFormats:n,unresolving:i,fallbackLocale:s,onWarn:r,localeFallbacker:o}=t,{__numberFormatters:a}=t;if(!Zt(e[0]))return Sl;const[l,c,u,d]=Ou(...e),f=_t(u.missingWarn)?u.missingWarn:t.missingWarn;_t(u.fallbackWarn)?u.fallbackWarn:t.fallbackWarn;const p=!!u.part,g=_d(t,u),_=o(t,s,g);if(!ke(l)||l==="")return new Intl.NumberFormat(g.replace(/!/g,""),d).format(c);let m={},h,v=null;const b="number format";for(let C=0;C<_.length&&(h=_[C],m=n[h]||{},v=m[l],!dt(v));C++)vd(t,l,h,f,b);if(!dt(v)||!ke(h))return i?nc:l;let x=`${h}__${l}`;ec(d)||(x=`${x}__${JSON.stringify(d)}`);let D=a.get(x);return D||(D=new Intl.NumberFormat(h,Jt({},v,d)),a.set(x,D)),p?D.formatToParts(c):D.format(c)}const q_=["localeMatcher","style","currency","currencyDisplay","currencySign","useGrouping","minimumIntegerDigits","minimumFractionDigits","maximumFractionDigits","minimumSignificantDigits","maximumSignificantDigits","compactDisplay","notation","signDisplay","unit","unitDisplay","roundingMode","roundingPriority","roundingIncrement","trailingZeroDisplay"];function Ou(...t){const[e,n,i,s]=t,r=Lt();let o=Lt();if(!Zt(e))throw Zi(ji.INVALID_ARGUMENT);const a=e;return ke(n)?r.key=n:dt(n)&&Object.keys(n).forEach(l=>{q_.includes(l)?o[l]=n[l]:r[l]=n[l]}),ke(i)?r.locale=i:dt(i)&&(o=i),dt(s)&&(o=s),[r.key||"",a,r,o]}function yp(t,e,n){const i=t;for(const s in n){const r=`${e}__${s}`;i.__numberFormatters.has(r)&&i.__numberFormatters.delete(r)}}const B1=t=>t,z1=t=>"",V1="text",H1=t=>t.length===0?"":pd(t),G1=Cb;function Cc(t,e){return t=Math.abs(t),e===2?t===1?0:1:Math.min(t,2)}function W1(t){var n,i;const e=Zt(t.pluralIndex)?t.pluralIndex:-1;return Zt((n=t.named)==null?void 0:n.count)?t.named.count:Zt((i=t.named)==null?void 0:i.n)?t.named.n:e}function $1(t={}){var h,v,b,x;const e=t.locale,n=W1(t),i=ke(e)&&zt((h=t.pluralRules)==null?void 0:h[e])?t.pluralRules[e]:Cc,s=i===Cc?void 0:Cc,r=D=>D[i(n,D.length,s)],o=t.list||[],a=D=>o[D],l=t.named||Lt();Zt(t.pluralIndex)&&(l.count||(l.count=t.pluralIndex),l.n||(l.n=t.pluralIndex));const c=D=>l[D];function u(D,C){const R=zt(t.messages)?t.messages(D,!!C):xt(t.messages)?t.messages[D]:!1;return R||(t.parent?t.parent.message(D):z1)}const d=D=>t.modifiers?t.modifiers[D]:B1,f=zt((v=t.processor)==null?void 0:v.normalize)?t.processor.normalize:H1,p=zt((b=t.processor)==null?void 0:b.interpolate)?t.processor.interpolate:G1,g=ke((x=t.processor)==null?void 0:x.type)?t.processor.type:V1,m={list:a,named:c,plural:r,linked:(D,...C)=>{const[R,S]=C;let M="text",L="";C.length===1?xt(R)?(L=R.modifier||L,M=R.type||M):ke(R)&&(L=R||L):C.length===2&&(ke(R)&&(L=R||L),ke(S)&&(M=S||M));const E=u(D,!0)(m),P=E===""||E===void 0?D:E,B=M==="vnode"&&Wt(P)&&L?P[0]:P;return L?d(L)(B,M):B},message:u,type:g,interpolate:p,normalize:f,values:Jt(Lt(),o,l)};return m}const bp=()=>"",Kn=t=>zt(t);function Ep(t,...e){const{fallbackFormat:n,postTranslation:i,unresolving:s,messageCompiler:r,fallbackLocale:o,messages:a}=t,[l,c]=Fu(...e),u=_t(c.missingWarn)?c.missingWarn:t.missingWarn,d=_t(c.fallbackWarn)?c.fallbackWarn:t.fallbackWarn,f=_t(c.escapeParameter)?c.escapeParameter:t.escapeParameter,p=!!c.resolvedMessage,g=ke(c.default)||_t(c.default)?_t(c.default)?r?l:()=>l:c.default:n?r?l:()=>l:null,_=n||g!=null&&(ke(g)||zt(g)),m=_d(t,c);f&&X1(c);let[h,v,b]=p?[l,m,a[m]||Lt()]:K_(t,l,m,o,d,u),x=h,D=l;if(!p&&!(ke(x)||Ci(x)||Kn(x))&&_&&(x=g,D=x),!p&&(!(ke(x)||Ci(x)||Kn(x))||!ke(v)))return s?nc:l;let C=!1;const R=()=>{C=!0},S=Kn(x)?x:Y_(t,l,v,x,D,R);if(C)return x;const M=Y1(t,v,b,c),L=$1(M),E=q1(t,S,L);let P=i?i(E,l):E;if(f&&ke(P)&&(P=Tb(P)),__INTLIFY_PROD_DEVTOOLS__){const B={timestamp:Date.now(),key:ke(l)?l:Kn(x)?x.key:"",locale:v||(Kn(x)?x.locale:""),format:ke(x)?x:Kn(x)?x.source:"",message:P};B.meta=Jt({},t.__meta,N1()||{}),p1(B)}return P}function X1(t){Wt(t.list)?t.list=t.list.map(e=>ke(e)?op(e):e):xt(t.named)&&Object.keys(t.named).forEach(e=>{ke(t.named[e])&&(t.named[e]=op(t.named[e]))})}function K_(t,e,n,i,s,r){const{messages:o,onWarn:a,messageResolver:l,localeFallbacker:c}=t,u=c(t,i,n);let d=Lt(),f,p=null;const g="translate";for(let _=0;_<u.length&&(f=u[_],d=o[f]||Lt(),(p=l(d,e))===null&&(p=d[e]),!(ke(p)||Ci(p)||Kn(p)));_++)if(!k1(f,u)){const m=vd(t,e,f,r,g);m!==e&&(p=m)}return[p,f,d]}function Y_(t,e,n,i,s,r){const{messageCompiler:o,warnHtmlMessage:a}=t;if(Kn(i)){const c=i;return c.locale=c.locale||n,c.key=c.key||e,c}if(o==null){const c=(()=>i);return c.locale=n,c.key=e,c}const l=o(i,K1(t,n,s,i,a,r));return l.locale=n,l.key=e,l.source=i,l}function q1(t,e,n){return e(n)}function Fu(...t){const[e,n,i]=t,s=Lt();if(!ke(e)&&!Zt(e)&&!Kn(e)&&!Ci(e))throw Zi(ji.INVALID_ARGUMENT);const r=Zt(e)?String(e):(Kn(e),e);return Zt(n)?s.plural=n:ke(n)?s.default=n:dt(n)&&!ec(n)?s.named=n:Wt(n)&&(s.list=n),Zt(i)?s.plural=i:ke(i)?s.default=i:dt(i)&&Jt(s,i),[r,s]}function K1(t,e,n,i,s,r){return{locale:e,key:n,warnHtmlMessage:s,onError:o=>{throw r&&r(o),o},onCacheKey:o=>vb(e,n,o)}}function Y1(t,e,n,i){const{modifiers:s,pluralRules:r,messageResolver:o,fallbackLocale:a,fallbackWarn:l,missingWarn:c,fallbackContext:u}=t,f={locale:e,modifiers:s,pluralRules:r,messages:(p,g)=>{let _=o(n,p);if(_==null&&(u||g)){const[m,,h]=K_(u||t,p,e,a,l,c);_=m??o(h,p)}if(ke(_)||Ci(_)){let m=!1;const v=Y_(t,p,e,_,p,()=>{m=!0});return m?bp:v}else return Kn(_)?_:bp}};return t.processor&&(f.processor=t.processor),i.list&&(f.list=i.list),i.named&&(f.named=i.named),Zt(i.plural)&&(f.pluralIndex=i.plural),f}t1();/*!
  * vue-i18n v11.4.4
  * (c) 2026 kazuya kawaguchi
  * Released under the MIT License.
  */const j1="11.4.4";function Z1(){typeof __VUE_I18N_FULL_INSTALL__!="boolean"&&(tr().__VUE_I18N_FULL_INSTALL__=!0),typeof __VUE_I18N_LEGACY_API__!="boolean"&&(tr().__VUE_I18N_LEGACY_API__=!0),typeof __INTLIFY_DROP_MESSAGE_COMPILER__!="boolean"&&(tr().__INTLIFY_DROP_MESSAGE_COMPILER__=!1),typeof __INTLIFY_PROD_DEVTOOLS__!="boolean"&&(tr().__INTLIFY_PROD_DEVTOOLS__=!1)}const Rn={UNEXPECTED_RETURN_TYPE:g1,INVALID_ARGUMENT:25,MUST_BE_CALL_SETUP_TOP:26,NOT_INSTALLED:27,REQUIRED_VALUE:28,INVALID_VALUE:29,NOT_INSTALLED_WITH_PROVIDE:31,UNEXPECTED_ERROR:32,NOT_AVAILABLE_COMPOSITION_IN_LEGACY:34};function Ln(t,...e){return tc(t,null,void 0)}const ku=Ns("__translateVNode"),Bu=Ns("__datetimeParts"),zu=Ns("__numberParts"),j_=Ns("__setPluralRules"),Z_=Ns("__injectWithOption"),Nr=Ns("__dispose");function jo(t){if(!xt(t)||Ci(t))return t;for(const e in t)if(jn(t,e))if(!e.includes("."))xt(t[e])&&jo(t[e]);else{const n=e.split("."),i=n.length-1;let s=t,r=!1;for(let o=0;o<i;o++){if(n[o]==="__proto__")throw new Error(`unsafe key: ${n[o]}`);if(n[o]in s||(s[n[o]]=Lt()),!xt(s[n[o]])){r=!0;break}s=s[n[o]]}if(r||(Ci(s)?z_.includes(n[i])||delete t[e]:(s[n[i]]=t[e],delete t[e])),!Ci(s)){const o=s[n[i]];xt(o)&&jo(o)}}return t}function xd(t,e){const{messages:n,__i18n:i,messageResolver:s,flatJson:r}=e,o=dt(n)?n:Wt(i)?Lt():{[t]:Lt()};if(Wt(i)&&i.forEach(a=>{if("locale"in a&&"resource"in a){const{locale:l,resource:c}=a;l?(o[l]=o[l]||Lt(),ja(c,o[l])):ja(c,o)}else ke(a)&&ja(JSON.parse(a),o)}),s==null&&r)for(const a in o)jn(o,a)&&jo(o[a]);return o}function J_(t){return t.type}function Q_(t,e,n){let i=xt(e.messages)?e.messages:Lt();"__i18nGlobal"in n&&(i=xd(t.locale.value,{messages:i,__i18n:n.__i18nGlobal}));const s=Object.keys(i);s.length&&s.forEach(r=>{t.mergeLocaleMessage(r,i[r])});{if(xt(e.datetimeFormats)){const r=Object.keys(e.datetimeFormats);r.length&&r.forEach(o=>{t.mergeDateTimeFormat(o,e.datetimeFormats[o])})}if(xt(e.numberFormats)){const r=Object.keys(e.numberFormats);r.length&&r.forEach(o=>{t.mergeNumberFormat(o,e.numberFormats[o])})}}}function Mp(t){return qe(ia,null,t,0)}function Zo(){return io()}const Tp="__INTLIFY_META__",Ap=()=>[],J1=()=>!1;let wp=0;function Cp(t){return((e,n,i,s)=>t(n,i,Zo()||void 0,s))}const Q1=()=>{const t=Zo();let e=null;return t&&(e=J_(t)[Tp])?{[Tp]:e}:null};function yl(t={}){const{__root:e,__injectWithOption:n}=t,i=e===void 0,s=t.flatJson,r=xl?Ee:dg;let o=_t(t.inheritLocale)?t.inheritLocale:!0;const a=r(e&&o?e.locale.value:ke(t.locale)?t.locale:Yo),l=r(e&&o?e.fallbackLocale.value:ke(t.fallbackLocale)||Wt(t.fallbackLocale)||dt(t.fallbackLocale)||t.fallbackLocale===!1?t.fallbackLocale:a.value),c=r(xd(a.value,t)),u=r(dt(t.datetimeFormats)?t.datetimeFormats:{[a.value]:{}}),d=r(dt(t.numberFormats)?t.numberFormats:{[a.value]:{}});let f=e?e.missingWarn:_t(t.missingWarn)||Yr(t.missingWarn)?t.missingWarn:!0,p=e?e.fallbackWarn:_t(t.fallbackWarn)||Yr(t.fallbackWarn)?t.fallbackWarn:!0,g=e?e.fallbackRoot:_t(t.fallbackRoot)?t.fallbackRoot:!0,_=!!t.fallbackFormat,m=zt(t.missing)?t.missing:null,h=zt(t.missing)?Cp(t.missing):null,v=zt(t.postTranslation)?t.postTranslation:null,b=e?e.warnHtmlMessage:_t(t.warnHtmlMessage)?t.warnHtmlMessage:!0,x=!!t.escapeParameter;const D=e?e.modifiers:dt(t.modifiers)?t.modifiers:{};let C=t.pluralRules||e&&e.pluralRules,R;R=(()=>{i&&gp(null);const F={version:j1,locale:a.value,fallbackLocale:l.value,messages:c.value,modifiers:D,pluralRules:C,missing:h===null?void 0:h,missingWarn:f,fallbackWarn:p,fallbackFormat:_,unresolving:!0,postTranslation:v===null?void 0:v,warnHtmlMessage:b,escapeParameter:x,messageResolver:t.messageResolver,messageCompiler:t.messageCompiler,__meta:{framework:"vue"}};F.datetimeFormats=u.value,F.numberFormats=d.value,F.__datetimeFormatters=dt(R)?R.__datetimeFormatters:void 0,F.__numberFormatters=dt(R)?R.__numberFormatters:void 0;const K=O1(F);return i&&gp(K),K})(),mo(R,a.value,l.value);function M(){return[a.value,l.value,c.value,u.value,d.value]}const L=rt({get:()=>a.value,set:F=>{R.locale=F,a.value=F}}),E=rt({get:()=>l.value,set:F=>{R.fallbackLocale=F,l.value=F,mo(R,a.value,F)}}),P=rt(()=>c.value),B=rt(()=>u.value),Z=rt(()=>d.value);function G(){return zt(v)?v:null}function X(F){v=F,R.postTranslation=F}function $(){return m}function le(F){F!==null&&(h=Cp(F)),m=F,R.missing=h}const me=(F,K,w,y,W,re)=>{M();let de;try{__INTLIFY_PROD_DEVTOOLS__,i||(R.fallbackContext=e?U1():void 0),de=F(R)}finally{__INTLIFY_PROD_DEVTOOLS__,i||(R.fallbackContext=void 0)}if(w!=="translate exists"&&Zt(de)&&de===nc||w==="translate exists"&&!de){const[ve,be]=K();return e&&g?y(e):W(ve)}else{if(re(de))return de;throw Ln(Rn.UNEXPECTED_RETURN_TYPE)}};function Se(...F){return me(K=>Reflect.apply(Ep,null,[K,...F]),()=>Fu(...F),"translate",K=>Reflect.apply(K.t,K,[...F]),K=>K,K=>ke(K))}function Ce(...F){const[K,w,y]=F;if(y&&!xt(y))throw Ln(Rn.INVALID_ARGUMENT);return Se(K,w,Jt({resolvedMessage:!0},y||{}))}function Pe(...F){return me(K=>Reflect.apply(vp,null,[K,...F]),()=>Uu(...F),"datetime format",K=>Reflect.apply(K.d,K,[...F]),()=>Sl,K=>ke(K)||Wt(K))}function Ke(...F){return me(K=>Reflect.apply(Sp,null,[K,...F]),()=>Ou(...F),"number format",K=>Reflect.apply(K.n,K,[...F]),()=>Sl,K=>ke(K)||Wt(K))}function Qe(F){return F.map(K=>ke(K)||Zt(K)||_t(K)?Mp(String(K)):K)}const ue={normalize:Qe,interpolate:F=>F,type:"vnode"};function j(...F){return me(K=>{let w;const y=K;try{y.processor=ue,w=Reflect.apply(Ep,null,[y,...F])}finally{y.processor=null}return w},()=>Fu(...F),"translate",K=>K[ku](...F),K=>[Mp(K)],K=>Wt(K))}function te(...F){return me(K=>Reflect.apply(Sp,null,[K,...F]),()=>Ou(...F),"number format",K=>K[zu](...F),Ap,K=>ke(K)||Wt(K))}function fe(...F){return me(K=>Reflect.apply(vp,null,[K,...F]),()=>Uu(...F),"datetime format",K=>K[Bu](...F),Ap,K=>ke(K)||Wt(K))}function ge(F){C=F,R.pluralRules=C}function ye(F,K){return me(()=>{if(!F)return!1;const w=ke(K)?K:a.value,y=ke(K)?[w]:Nu(R,l.value,w);for(let W=0;W<y.length;W++){const re=V(y[W]);let de=R.messageResolver(re,F);if(de===null&&(de=re[F]),Ci(de)||Kn(de)||ke(de))return!0}return!1},()=>[F],"translate exists",w=>Reflect.apply(w.te,w,[F,K]),J1,w=>_t(w))}function T(F){let K=null;const w=Nu(R,l.value,a.value);for(let y=0;y<w.length;y++){const W=c.value[w[y]]||{},re=R.messageResolver(W,F);if(re!=null){K=re;break}}return K}function I(F){const K=T(F);return K??(e?e.tm(F)||{}:{})}function V(F){return c.value[F]||{}}function Y(F,K){if(s){const w={[F]:K};for(const y in w)jn(w,y)&&jo(w[y]);K=w[F]}c.value[F]=K,R.messages=c.value}function J(F,K){c.value[F]=c.value[F]||{};const w={[F]:K};if(s)for(const y in w)jn(w,y)&&jo(w[y]);K=w[F],ja(K,c.value[F]),R.messages=c.value}function ae(F){return u.value[F]||{}}function U(F,K){u.value[F]=K,R.datetimeFormats=u.value,xp(R,F,K)}function O(F,K){u.value[F]=Jt(u.value[F]||{},K),R.datetimeFormats=u.value,xp(R,F,K)}function A(F){return d.value[F]||{}}function k(F,K){d.value[F]=K,R.numberFormats=d.value,yp(R,F,K)}function z(F,K){d.value[F]=Jt(d.value[F]||{},K),R.numberFormats=d.value,yp(R,F,K)}wp++,e&&xl&&(Vn(e.locale,F=>{o&&(a.value=F,R.locale=F,mo(R,a.value,l.value))}),Vn(e.fallbackLocale,F=>{o&&(l.value=F,R.fallbackLocale=F,mo(R,a.value,l.value))}));const ee={id:wp,locale:L,fallbackLocale:E,get inheritLocale(){return o},set inheritLocale(F){o=F,F&&e&&(a.value=e.locale.value,l.value=e.fallbackLocale.value,mo(R,a.value,l.value))},get availableLocales(){return Object.keys(c.value).sort()},messages:P,get modifiers(){return D},get pluralRules(){return C||{}},get isGlobal(){return i},get missingWarn(){return f},set missingWarn(F){f=F,R.missingWarn=f},get fallbackWarn(){return p},set fallbackWarn(F){p=F,R.fallbackWarn=p},get fallbackRoot(){return g},set fallbackRoot(F){g=F},get fallbackFormat(){return _},set fallbackFormat(F){_=F,R.fallbackFormat=_},get warnHtmlMessage(){return b},set warnHtmlMessage(F){b=F,R.warnHtmlMessage=F},get escapeParameter(){return x},set escapeParameter(F){x=F,R.escapeParameter=F},t:Se,getLocaleMessage:V,setLocaleMessage:Y,mergeLocaleMessage:J,getPostTranslationHandler:G,setPostTranslationHandler:X,getMissingHandler:$,setMissingHandler:le,[j_]:ge};return ee.datetimeFormats=B,ee.numberFormats=Z,ee.rt=Ce,ee.te=ye,ee.tm=I,ee.d=Pe,ee.n=Ke,ee.getDateTimeFormat=ae,ee.setDateTimeFormat=U,ee.mergeDateTimeFormat=O,ee.getNumberFormat=A,ee.setNumberFormat=k,ee.mergeNumberFormat=z,ee[Z_]=n,ee[ku]=j,ee[Bu]=fe,ee[zu]=te,ee}function eE(t){const e=ke(t.locale)?t.locale:Yo,n=ke(t.fallbackLocale)||Wt(t.fallbackLocale)||dt(t.fallbackLocale)||t.fallbackLocale===!1?t.fallbackLocale:e,i=zt(t.missing)?t.missing:void 0,s=_t(t.silentTranslationWarn)||Yr(t.silentTranslationWarn)?!t.silentTranslationWarn:!0,r=_t(t.silentFallbackWarn)||Yr(t.silentFallbackWarn)?!t.silentFallbackWarn:!0,o=_t(t.fallbackRoot)?t.fallbackRoot:!0,a=!!t.formatFallbackMessages,l=dt(t.modifiers)?t.modifiers:{},c=t.pluralizationRules,u=zt(t.postTranslation)?t.postTranslation:void 0,d=ke(t.warnHtmlInMessage)?t.warnHtmlInMessage!=="off":!0,f=!!t.escapeParameterHtml,p=_t(t.sync)?t.sync:!0;let g=t.messages;if(dt(t.sharedMessages)){const D=t.sharedMessages;g=Object.keys(D).reduce((R,S)=>{const M=R[S]||(R[S]={});return Jt(M,D[S]),R},g||{})}const{__i18n:_,__root:m,__injectWithOption:h}=t,v=t.datetimeFormats,b=t.numberFormats,x=t.flatJson;return{locale:e,fallbackLocale:n,messages:g,flatJson:x,datetimeFormats:v,numberFormats:b,missing:i,missingWarn:s,fallbackWarn:r,fallbackRoot:o,fallbackFormat:a,modifiers:l,pluralRules:c,postTranslation:u,warnHtmlMessage:d,escapeParameter:f,messageResolver:t.messageResolver,inheritLocale:p,__i18n:_,__root:m,__injectWithOption:h}}function Vu(t={}){const e=yl(eE(t)),{__extender:n}=t,i={id:e.id,get locale(){return e.locale.value},set locale(s){e.locale.value=s},get fallbackLocale(){return e.fallbackLocale.value},set fallbackLocale(s){e.fallbackLocale.value=s},get messages(){return e.messages.value},get datetimeFormats(){return e.datetimeFormats.value},get numberFormats(){return e.numberFormats.value},get availableLocales(){return e.availableLocales},get missing(){return e.getMissingHandler()},set missing(s){e.setMissingHandler(s)},get silentTranslationWarn(){return _t(e.missingWarn)?!e.missingWarn:e.missingWarn},set silentTranslationWarn(s){e.missingWarn=_t(s)?!s:s},get silentFallbackWarn(){return _t(e.fallbackWarn)?!e.fallbackWarn:e.fallbackWarn},set silentFallbackWarn(s){e.fallbackWarn=_t(s)?!s:s},get modifiers(){return e.modifiers},get formatFallbackMessages(){return e.fallbackFormat},set formatFallbackMessages(s){e.fallbackFormat=s},get postTranslation(){return e.getPostTranslationHandler()},set postTranslation(s){e.setPostTranslationHandler(s)},get sync(){return e.inheritLocale},set sync(s){e.inheritLocale=s},get warnHtmlInMessage(){return e.warnHtmlMessage?"warn":"off"},set warnHtmlInMessage(s){e.warnHtmlMessage=s!=="off"},get escapeParameterHtml(){return e.escapeParameter},set escapeParameterHtml(s){e.escapeParameter=s},get pluralizationRules(){return e.pluralRules||{}},__composer:e,t(...s){return Reflect.apply(e.t,e,[...s])},rt(...s){return Reflect.apply(e.rt,e,[...s])},te(s,r){return e.te(s,r)},tm(s){return e.tm(s)},getLocaleMessage(s){return e.getLocaleMessage(s)},setLocaleMessage(s,r){e.setLocaleMessage(s,r)},mergeLocaleMessage(s,r){e.mergeLocaleMessage(s,r)},d(...s){return Reflect.apply(e.d,e,[...s])},getDateTimeFormat(s){return e.getDateTimeFormat(s)},setDateTimeFormat(s,r){e.setDateTimeFormat(s,r)},mergeDateTimeFormat(s,r){e.mergeDateTimeFormat(s,r)},n(...s){return Reflect.apply(e.n,e,[...s])},getNumberFormat(s){return e.getNumberFormat(s)},setNumberFormat(s,r){e.setNumberFormat(s,r)},mergeNumberFormat(s,r){e.mergeNumberFormat(s,r)}};return i.__extender=n,i}function tE(t,e,n){return{beforeCreate(){const i=Zo();if(!i)throw Ln(Rn.UNEXPECTED_ERROR);const s=this.$options;if(s.i18n){const r=s.i18n;if(s.__i18n&&(r.__i18n=s.__i18n),r.__root=e,this===this.$root)this.$i18n=Rp(t,r);else{r.__injectWithOption=!0,r.__extender=n.__vueI18nExtend,this.$i18n=Vu(r);const o=this.$i18n;o.__extender&&(o.__disposer=o.__extender(this.$i18n))}}else if(s.__i18n)if(this===this.$root)this.$i18n=Rp(t,s);else{this.$i18n=Vu({__i18n:s.__i18n,__injectWithOption:!0,__extender:n.__vueI18nExtend,__root:e});const r=this.$i18n;r.__extender&&(r.__disposer=r.__extender(this.$i18n))}else this.$i18n=t;s.__i18nGlobal&&Q_(e,s,s),this.$t=(...r)=>this.$i18n.t(...r),this.$rt=(...r)=>this.$i18n.rt(...r),this.$te=(r,o)=>this.$i18n.te(r,o),this.$d=(...r)=>this.$i18n.d(...r),this.$n=(...r)=>this.$i18n.n(...r),this.$tm=r=>this.$i18n.tm(r),n.__setInstance(i,this.$i18n)},mounted(){},unmounted(){const i=Zo();if(!i)throw Ln(Rn.UNEXPECTED_ERROR);const s=this.$i18n;delete this.$t,delete this.$rt,delete this.$te,delete this.$d,delete this.$n,delete this.$tm,s.__disposer&&(s.__disposer(),delete s.__disposer,delete s.__extender),n.__deleteInstance(i),delete this.$i18n}}}function Rp(t,e){t.locale=e.locale||t.locale,t.fallbackLocale=e.fallbackLocale||t.fallbackLocale,t.missing=e.missing||t.missing,t.silentTranslationWarn=e.silentTranslationWarn||t.silentFallbackWarn,t.silentFallbackWarn=e.silentFallbackWarn||t.silentFallbackWarn,t.formatFallbackMessages=e.formatFallbackMessages||t.formatFallbackMessages,t.postTranslation=e.postTranslation||t.postTranslation,t.warnHtmlInMessage=e.warnHtmlInMessage||t.warnHtmlInMessage,t.escapeParameterHtml=e.escapeParameterHtml||t.escapeParameterHtml,t.sync=e.sync||t.sync,t.__composer[j_](e.pluralizationRules||t.pluralizationRules);const n=xd(t.locale,{messages:e.messages,__i18n:e.__i18n});return Object.keys(n).forEach(i=>t.mergeLocaleMessage(i,n[i])),e.datetimeFormats&&Object.keys(e.datetimeFormats).forEach(i=>t.mergeDateTimeFormat(i,e.datetimeFormats[i])),e.numberFormats&&Object.keys(e.numberFormats).forEach(i=>t.mergeNumberFormat(i,e.numberFormats[i])),t}const Sd={tag:{type:[String,Object]},locale:{type:String},scope:{type:String,validator:t=>t==="parent"||t==="global",default:"parent"},i18n:{type:Object}};function nE({slots:t},e){return e.length===1&&e[0]==="default"?(t.default?t.default():[]).reduce((i,s)=>[...i,...s.type===wt?s.children:[s]],[]):e.reduce((n,i)=>{const s=t[i];return s&&(n[i]=s()),n},Lt())}function e0(){return wt}const iE=Vt({name:"i18n-t",props:Jt({keypath:{type:String,required:!0},plural:{type:[Number,String],validator:t=>Zt(t)||!isNaN(t)}},Sd),setup(t,e){const{slots:n,attrs:i}=e,s=t.i18n||fr({useScope:t.scope,__useComponent:!0});return()=>{const r=()=>{const l=Object.keys(n).filter(d=>d[0]!=="_"),c=Lt();t.locale&&(c.locale=t.locale),t.plural!==void 0&&(c.plural=ke(t.plural)?+t.plural:t.plural);const u=nE(e,l);return s[ku](t.keypath,u,c)},o=Jt(Lt(),i),a=ke(t.tag)||xt(t.tag)?t.tag:e0();return xt(a)?Ps(a,o,{default:r}):Ps(a,o,r())}}}),Pp=iE;function sE(t){return Wt(t)&&!ke(t[0])}function t0(t,e,n,i){const{slots:s,attrs:r}=e;return()=>{const o=()=>{const c={part:!0};let u=Lt();t.locale&&(c.locale=t.locale),ke(t.format)?c.key=t.format:xt(t.format)&&(ke(t.format.key)&&(c.key=t.format.key),u=Object.keys(t.format).reduce((p,g)=>n.includes(g)?Jt(Lt(),p,{[g]:t.format[g]}):p,Lt()));const d=i(t.value,c,u);let f=[c.key];return Wt(d)?f=d.map((p,g)=>{const _=s[p.type],m=_?_({[p.type]:p.value,index:g,parts:d}):[p.value];return sE(m)&&(m[0].key=`${p.type}-${g}`),m}):ke(d)&&(f=[d]),f},a=Jt(Lt(),r),l=ke(t.tag)||xt(t.tag)?t.tag:e0();return xt(l)?Ps(l,a,{default:o}):Ps(l,a,o())}}const rE=Vt({name:"i18n-n",props:Jt({value:{type:Number,required:!0},format:{type:[String,Object]}},Sd),setup(t,e){const n=t.i18n||fr({useScope:t.scope,__useComponent:!0});return t0(t,e,q_,(...i)=>n[zu](...i))}}),Ip=rE;function oE(t,e){const n=t;if(t.mode==="composition")return n.__getInstance(e)||t.global;{const i=n.__getInstance(e);return i!=null?i.__composer:t.global.__composer}}function aE(t){const e=o=>{const{instance:a,value:l}=o;if(!a||!a.$)throw Ln(Rn.UNEXPECTED_ERROR);const c=oE(t,a.$),u=Lp(l);return[Reflect.apply(c.t,c,[...Dp(u)]),c]};return{created:(o,a)=>{const[l,c]=e(a);xl&&(o.__i18nWatcher=Vn(c.locale,()=>{a.instance&&a.instance.$forceUpdate()})),o.__composer=c,o.textContent=l},unmounted:o=>{xl&&o.__i18nWatcher&&(o.__i18nWatcher(),o.__i18nWatcher=void 0,delete o.__i18nWatcher),o.__composer&&(o.__composer=void 0,delete o.__composer)},beforeUpdate:(o,{value:a})=>{if(o.__composer){const l=o.__composer,c=Lp(a);o.textContent=Reflect.apply(l.t,l,[...Dp(c)])}},getSSRProps:o=>{const[a]=e(o);return{textContent:a}}}}function Lp(t){if(ke(t))return{path:t};if(dt(t)){if(!("path"in t))throw Ln(Rn.REQUIRED_VALUE,"path");return t}else throw Ln(Rn.INVALID_VALUE)}function Dp(t){const{path:e,locale:n,args:i,choice:s,plural:r}=t,o={},a=i||{};return ke(n)&&(o.locale=n),Zt(s)&&(o.plural=s),Zt(r)&&(o.plural=r),[e,a,o]}function lE(t,e,...n){const i=dt(n[0])?n[0]:{};(_t(i.globalInstall)?i.globalInstall:!0)&&([Pp.name,"I18nT"].forEach(r=>t.component(r,Pp)),[Ip.name,"I18nN"].forEach(r=>t.component(r,Ip)),[Op.name,"I18nD"].forEach(r=>t.component(r,Op))),t.directive("t",aE(e))}const cE=Ns("global-vue-i18n");function uE(t={}){const e=__VUE_I18N_LEGACY_API__&&_t(t.legacy)?t.legacy:__VUE_I18N_LEGACY_API__,n=_t(t.globalInjection)?t.globalInjection:!0,i=new Map,[s,r]=fE(t,e),o=Ns("");function a(d){return i.get(d)||null}function l(d,f){i.set(d,f)}function c(d){i.delete(d)}const u={get mode(){return __VUE_I18N_LEGACY_API__&&e?"legacy":"composition"},async install(d,...f){if(d.__VUE_I18N_SYMBOL__=o,d.provide(d.__VUE_I18N_SYMBOL__,u),dt(f[0])){const _=f[0];u.__composerExtend=_.__composerExtend,u.__vueI18nExtend=_.__vueI18nExtend}let p=null;!e&&n&&(p=vE(d,u.global)),__VUE_I18N_FULL_INSTALL__&&lE(d,u,...f),__VUE_I18N_LEGACY_API__&&e&&d.mixin(tE(r,r.__composer,u));const g=d.unmount;d.unmount=()=>{p&&p(),u.dispose(),g()}},get global(){return r},dispose(){s.stop()},__instances:i,__getInstance:a,__setInstance:l,__deleteInstance:c};return u}function fr(t={}){const e=Zo();if(e==null)throw Ln(Rn.MUST_BE_CALL_SETUP_TOP);if(!e.isCE&&e.appContext.app!=null&&!e.appContext.app.__VUE_I18N_SYMBOL__)throw Ln(Rn.NOT_INSTALLED);const n=dE(e),i=pE(n),s=J_(e),r=hE(t,s);if(r==="global")return Q_(i,t,s),i;if(r==="parent"){let l=Np(n,e,t.__useComponent);return l==null&&(l=i),l}if(r==="isolated"){if(n.mode!=="composition")throw Ln(Rn.NOT_AVAILABLE_COMPOSITION_IN_LEGACY);const l=n,c=Jt({},t),u=Np(n,e);c.__root=u||i;const d=yl(c);return l.__composerExtend&&(d[Nr]=l.__composerExtend(d)),Xf()&&Zm(()=>{const p=d[Nr];p&&(p(),delete d[Nr])}),d}const o=n;let a=o.__getInstance(e);if(a==null){const l=Jt({},t);"__i18n"in s&&(l.__i18n=s.__i18n),i&&(l.__root=i),a=yl(l),o.__composerExtend&&(a[Nr]=o.__composerExtend(a)),gE(o,e,a),o.__setInstance(e,a)}return a}function fE(t,e){const n=$f(),i=__VUE_I18N_LEGACY_API__&&e?n.run(()=>Vu(t)):n.run(()=>yl(t));if(i==null)throw Ln(Rn.UNEXPECTED_ERROR);return[n,i]}function dE(t){const e=zn(t.isCE?cE:t.appContext.app.__VUE_I18N_SYMBOL__);if(!e)throw Ln(t.isCE?Rn.NOT_INSTALLED_WITH_PROVIDE:Rn.UNEXPECTED_ERROR);return e}function hE(t,e){return ec(t)?"__i18n"in e?"local":"global":t.useScope?t.useScope:"local"}function pE(t){return t.mode==="composition"?t.global:t.global.__composer}function Np(t,e,n=!1){let i=null;const s=e.root;let r=mE(e,n);for(;r!=null;){const o=t;if(t.mode==="composition")i=o.__getInstance(r);else if(__VUE_I18N_LEGACY_API__){const a=o.__getInstance(r);a!=null&&(i=a.__composer,n&&i&&!i[Z_]&&(i=null))}if(i!=null||s===r)break;r=r.parent}return i}function mE(t,e=!1){return t==null?null:e&&t.vnode.ctx||t.parent}function gE(t,e,n){Ds(()=>{},e),no(()=>{const i=n;t.__deleteInstance(e);const s=i[Nr];s&&(s(),delete i[Nr])},e)}const _E=["locale","fallbackLocale","availableLocales"],Up=["t","rt","d","n","tm","te"];function vE(t,e){const n=Object.create(null);return _E.forEach(s=>{const r=Object.getOwnPropertyDescriptor(e,s);if(!r)throw Ln(Rn.UNEXPECTED_ERROR);const o=Bt(r.value)?{get(){return r.value.value},set(a){r.value.value=a}}:{get(){return r.get&&r.get()}};Object.defineProperty(n,s,o)}),t.config.globalProperties.$i18n=n,Up.forEach(s=>{const r=Object.getOwnPropertyDescriptor(e,s);if(!r||!r.value)throw Ln(Rn.UNEXPECTED_ERROR);Object.defineProperty(t.config.globalProperties,`$${s}`,r)}),()=>{delete t.config.globalProperties.$i18n,Up.forEach(s=>{delete t.config.globalProperties[`$${s}`]})}}const xE=Vt({name:"i18n-d",props:Jt({value:{type:[Number,Date],required:!0},format:{type:[String,Object]}},Sd),setup(t,e){const n=t.i18n||fr({useScope:t.scope,__useComponent:!0});return t0(t,e,X_,(...i)=>n[Bu](...i))}}),Op=xE;Z1();P1(f1);I1(w1);L1(Nu);if(__INTLIFY_PROD_DEVTOOLS__){const t=tr();t.__INTLIFY__=!0,d1(t.__INTLIFY_DEVTOOLS_GLOBAL_HOOK__)}const SE={chat:"对话",skills:"技能商店",tasks:"任务中心",settings:"设置",blueprints:"蓝图",inbox:"收件箱",history:"历史",usage:"用量",profiles:"多配置",channels:"频道",files:"文件",groupChat:"群组聊天",codingAgents:"编程代理"},yE={confirm:"确认",cancel:"取消",save:"保存",delete:"删除",edit:"编辑",create:"创建",search:"搜索",loading:"加载中...",success:"成功",error:"错误",noData:"暂无数据",all:"全部",copy:"复制",close:"关闭",export:"导出",import:"导入",retry:"重试",approve:"批准",deny:"拒绝",reply:"回复",running:"执行中",completed:"完成",failed:"失败",denied:"已拒绝",timeout:"超时",pending:"待处理",approved:"已批准",rejected:"已拒绝",version:"版本"},bE={glass:"玻璃",comic:"漫画"},EE={title:"AI 对话",placeholder:"输入消息... (Shift+Enter 换行)",newSession:"新会话",approvalRequest:"命令审批请求",approvalDesc:"Agent 请求执行以下命令：",approveBtn:"批准执行",denyBtn:"拒绝",replyPlaceholder:"输入修改意见...",sendReply:"发送修改意见",backendDisconnected:"后端服务未连接 — 部分功能可能不可用",stopped:"已停止执行",tokenUsage:"输入 {in} / 输出 {out}",toolCalling:"工具调用",thinking:"思考中...",send:"发送",rename:"重命名",deleteSession:"删除会话",toolTrace:"工具追踪",toolTraceHint:"切换工具调用详情显示"},ME={title:"蓝图工作流",create:"新建蓝图",import:"导入蓝图",export:"导出蓝图",empty:"暂无蓝图，点击创建第一个工作流",addNode:"添加节点",disableNode:"禁用节点",enableNode:"启用节点",deleteNode:"删除节点",drawer:{title:"蓝图列表",search:"搜索蓝图…",sortRecent:"最近修改",sortName:"按名称",sortNodes:"按节点数",delete:"删除蓝图"},name:"蓝图名称",description:"描述",nodes:{agent:"Agent 节点",condition:"条件节点",loop:"循环节点",summary:"汇总节点",note:"备注",manager:"管理器",managerSlot:"管理槽",group:"分组"},nodeConfig:{prompt:"提示词",model:"模型",permission:"权限",timeout:"超时(秒)",approval:"需要审批",conditionExpr:"条件表达式",maxIterations:"最大迭代次数",summaryMode:"汇总模式",skills:"技能",noSkills:"暂无可用技能",instructions:"指令",portCount:"端口数",maxHandoffs:"最大交接",agentName:"代理名称",slot:"槽位",executionMode:"执行模式",parallelLanes:"并行通道",ports:"端口",handoffs:"交接",color:"颜色"},run:{start:"运行蓝图",stop:"停止运行",history:"运行历史",output:"运行输出",approve:"批准",reject:"拒绝",status:{queued:"排队中",running:"运行中",succeeded:"成功",failed:"失败",cancelled:"已取消",waiting_approval:"等待审批",skipped:"已跳过",idle:"空闲"}},exportFormat:"hixns.blueprint-package/v1"},TE={title:"收件箱",empty:"暂无待处理事项",emptyFilter:"该分类下暂无事项",emptyHint:"新的审批和通知会实时显示在这里",types:{approval:"审批请求",proposal:"蓝图提案",notification:"通知"},approve:"批准",reject:"拒绝",accept:"接受",reply:"回复",replyPlaceholder:"输入修改意见...",sendReply:"发送反馈",markRead:"标记已读",details:"详情",detailTitle:"收件事项详情",polling:"正在轮询更新...",justNow:"刚刚",minutesAgo:"{n}分钟前",hoursAgo:"{n}小时前",daysAgo:"{n}天前",fieldStatus:"状态",fieldType:"类型",fieldTitle:"标题",fieldContent:"内容",fieldCommand:"命令",fieldParams:"参数",fieldTime:"创建时间",fieldResolved:"处理时间",approvalContext:"审批上下文",riskLevel:"风险等级",references:"相关引用",blueprintRef:"蓝图",runRef:"运行",risk:{low:"低",medium:"中",high:"高",critical:"严重",unknown:"未知"}},AE={title:"设置",search:"搜索设置项...",language:"语言",theme:"主题",provider:"API 提供商",dark:"暗色",light:"亮色",system:"跟随系统",customProvider:"自定义提供商",gfwProvider:"GFW.NET",model:"模型",apiKey:"***",baseUrl:"Base URL",approvalMode:"审批模式",autoApprove:"自动批准",manualApprove:"手动审批",hermesPath:"Hermes 路径",modelProfiles:"模型配置",addModel:"添加模型",removeModel:"删除",switchModel:"切换",activeModel:"当前使用",modelName:"名称",modelProvider:"提供商",modelApiKey:"API Key",modelBaseUrl:"Base URL",modelDefault:"默认",modelSetDefault:"设为默认",account:"gfw.net 账户",email:"邮箱",password:"***",loggingIn:"登录中...",login:"登录",logout:"登出",gcoin:"G币",userGroup:"用户组",gfwBuiltIn:"GFW.NET 内置",builtInModelService:"内置模型服务",authMethod:"认证方式",accountLogin:"账户登录",manualKeyInput:"手动输入 Key",createNewKey:"创建新 Key",refreshing:"刷新中...",refresh:"刷新",noApiKey:"暂无 API Key，点击创建",getApiKeyHint:"在 gfw.net 控制台获取 API Key",pleaseLoginFirst:"请先登录后再选择模型",customApiProvider:"自定义 API 提供商",upstreamProvider:"上游提供商",manual:"手动",providerName:"提供商名称",testing:"测试中...",testConnection:"测试连接",syncing:"同步中...",sync:"同步",clickSyncHint:"点击「同步」获取提供商列表",all:"全部",inputModelName:"输入模型名称",contextLength:"上下文长度",contextLengthHint:"根据所选模型自动设置，可手动调整",saveSettings:"保存设置",settingsSaved:"设置已保存",editedUnsaved:"已编辑未保存",autoSaving:"正在自动保存",saved:"已保存",usageStats:"用量统计",totalRequests:"总请求",inputTokens:"输入 Tokens",outputTokens:"输出 Tokens",tokenTrend:"Tokens 用量趋势（近 {n} 天）",input:"输入",output:"输出",modelUsage:"各模型用量",modelCol:"模型",requestsCol:"请求数",inputTokensCol:"输入 Tokens",outputTokensCol:"输出 Tokens",totalCol:"合计",noChatRecords:"暂无对话记录",recentRequests:"近期请求记录",timeCol:"时间",roleCol:"角色",contentSummary:"内容摘要",tokensCol:"Tokens",durationCol:"耗时",question:"提问",reply:"回复",noRequestRecords:"暂无请求记录",recharge:"充值",gcoinUnit:"G币",bonus:"赠送",rechargeNow:"立即充值",currentModel:"当前模型",noModelSelected:"未选择模型，请在下方添加并切换",custom:"自定义",agentSettings:"Agent 设置",hermesAgentStatus:"Hermes Agent 状态",backendDisconnectedTitle:"后端未连接",backendDisconnectedDesc:"Hermes Agent 服务不可用，请检查后端是否启动",integrated:"已集成",notIntegrated:"未集成",version:"版本",unknown:"未知",mode:"模式",path:"路径",uptime:"运行时间",detecting:"检测中...",chatBehavior:"对话行为",maxTurns:"最大轮次",maxTurnsHint:"Agent 单次对话的最大工具调用轮次 (默认 90)",systemPrompt:"系统提示词",systemPromptHint:"追加到 Agent 默认系统提示词之后",contextCompression:"上下文压缩",maxRounds:"最大回合数",compressionThreshold:"压缩阈值",compressionTarget:"压缩目标",persistentMemory:"持久记忆",memorySystem:"记忆系统",userProfile:"用户画像",enabled:"已启用",disabled:"已禁用",terminalSettings:"终端设置",terminalBackend:"终端后端",commandExecutionEnv:"命令执行环境",workingDirectory:"工作目录",workingDirectoryHint:"Agent 的默认工作目录",commandTimeout:"命令超时 (秒)",commandTimeoutHint:"前台命令最大执行时间 (默认 180)",commandApproval:"命令审批",dangerousApprovalHint:"危险命令的审批方式",remoteConnectionConfig:"远程连接配置",host:"主机",port:"端口",keyPath:"密钥路径",containerConfig:"容器配置",image:"镜像",mountDirectory:"挂载目录",displaySettings:"显示设置",toolCallDetails:"工具调用详情",show:"显示",hide:"隐藏",toolCallHint:"是否显示工具调用的输入参数和输出结果",reasoningProcess:"推理过程",reasoningContentHint:"模型的 thinking/reasoning 内容",showCost:"显示费用",showCostHint:"在消息底部显示 token 用量和费用",markdownRender:"Markdown 渲染",plainText:"纯文本",syntaxHighlight:"代码高亮",voiceSettings:"语音设置",sttTitle:"STT · 语音转文字",enableStt:"启用 STT",sttProvider:"STT 提供商",whisperModel:"Whisper 模型",ttsTitle:"TTS · 文字转语音",ttsProvider:"TTS 提供商",securitySettings:"安全设置",keyRedaction:"密钥脱敏",keyRedactionHint:"自动遮盖工具输出中的 API Key、Token 等敏感信息",piiRedaction:"PII 脱敏",piiRedactionHint:"对用户 ID、手机号等个人信息进行哈希处理",websiteAccessRestriction:"网站 · 访问限制",websiteBlocklist:"网站黑名单",blocklistHint:"Agent 禁止访问的域名列表",blocklistPlaceholder:`每行一个域名，如：
example.com
malware.test`,toolPermissions:"工具 · 工具权限",createApiKey:"创建 API Key",keyName:"Key 名称",usageQuota:"使用限额",unlimited:"无限额",limited:"限额",quotaHint:"设置该 Key 可使用的最大 G 币额度，无限额则不限制",customUpstreamHint:"请将 {resource} 替换为您的 Azure OpenAI 资源名称",modelsFetched:"✓ 已获取 {n} 个模型，请选择",apiVerified:"✓ API 验证成功，已加载预设模型",fetching:"获取中..."},wE={title:"任务中心",cron:"定时任务",create:"创建任务",pause:"暂停",resume:"恢复",remove:"删除",run:"立即执行",schedule:"调度",prompt:"任务指令",taskCount:"个任务",createCron:"创建定时任务",taskName:"任务名称",executionPlan:"执行计划",scheduleHint:"支持: 30m, every 2h, cron表达式(0 9 * * *), ISO时间戳",skillsOptional:"技能 (可选)",selected:"已选",saveChanges:"保存修改",editTask:"编辑任务",deleteTask:"删除任务",confirmDelete:"确认删除",deleteConfirmPrefix:"确定要删除任务",deleteConfirmSuffix:"吗？此操作不可撤销。",executionHistory:"执行历史",createNew:"新建",emptyCron:"暂无定时任务",emptyCronHint:"点击「新建定时任务」创建你的第一个自动化任务",nextRun:"下次",lastRun:"上次",noRunningTasks:"没有正在运行的任务",noHistory:"暂无执行记录",clearAllTitle:"清空全部任务",clearAllConfirm:"确定要删除所有 {count} 个定时任务吗？此操作不可撤销。",clearAllBtn:"清空",clearAllSuccess:"已清空 {removed} 个任务",clearAllEmpty:"没有可清空的任务",output:"输出",execute:"执行",paused:"已暂停",executing:"执行中",taskNamePlaceholder:"例如: 每日数据报告",schedulePlaceholder:"30m / every 2h / 0 9 * * * / ISO时间",skillsSearchPlaceholder:"搜索或输入技能名称...",promptPlaceholder:"任务要执行的提示词内容"},CE={rename:"重命名",renameSession:"重命名会话",sessions:"会话",balance:"余额",noModels:"暂无模型",connectingBackend:"正在连接后端服务...",copy:"复制",paste:"粘贴",confirm:"确定",deleteSession:"删除会话",renamePlaceholder:"输入会话名称",backendDisconnected:"后端服务未连接 — 部分功能可能不可用",retry:"重试"},RE={title:"命令审批",dangerousCmd:"检测到危险命令",command:"命令",approve:"批准执行",deny:"拒绝执行",timeout:"审批超时",denied:"用户拒绝了命令执行",replySent:"修改意见已发送",multiTurn:"多轮审批"},PE={title:"运行历史",empty:"暂无执行历史",noMatch:"没有匹配的运行记录",emptyHint:"蓝图运行历史将显示在这里",allBlueprints:"全部蓝图",from:"起始",to:"结束",clearFilters:"清除",cancel:"取消",justNow:"刚刚",minutesAgo:"{n}分钟前",hoursAgo:"{n}小时前",daysAgo:"{n}天前",startedAt:"开始时间",finishedAt:"完成时间",duration:"持续时间",nodeTimeline:"节点执行时间线",noNodes:"暂无节点状态数据",noNodeRuns:"暂无节点运行数据",inputTokens:"输入 Tokens",outputTokens:"输出 Tokens",cost:"费用",nodeLabel:"节点",nodeInput:"输入",nodeOutput:"输出",nodeDuration:"耗时",nodeTokens:"Tokens",events:"事件",eventsTitle:"事件时间线",showInput:"查看输入",showOutput:"查看输出",hideDetails:"收起",errorDetails:"错误详情",status:{running:"运行中",succeeded:"成功",failed:"失败",cancelled:"已取消"},nodeStatus:{pending:"等待中",running:"运行中",succeeded:"成功",failed:"失败",skipped:"已跳过"}},IE={title:"技能商店",skillCount:"个技能",store:"商店",installed:"已安装",rateLimitWarning:"请求过于频繁，建议前往 设置 绑定 2x CLI Token 以解除限制",loading:"加载中...",noMatch:"未找到匹配「{query}」的技能",noSkills:"暂无技能数据",installedLabel:"已安装",install:"安装",installing:"安装中",installFailedRetry:"安装失败，重试",all:"全部",builtin:"内置",storeInstall:"商店安装",scanning:"扫描已安装技能...",noInstalledMatch:"未找到匹配的已安装技能",noInstalled:"暂无已安装技能",hasUpdate:"可更新",storeSource:"商店",builtinSource:"内置",filesUnit:"文件",update:"更新",uninstall:"卸载",downloads:"下载",favorites:"收藏",summary:"简介",detailedDescription:"详细描述",tags:"标签",capabilities:"能力",installSkill:"安装技能",uninstallSkill:"卸载技能",uninstallConfirm:"确定要卸载 {name} 吗？卸载后该技能将从本地移除。",confirmUninstall:"确认卸载",noQuota:"无限额",searchPlaceholder:"搜索技能名称、描述、标签...",installedSearch:"搜索已安装技能...",version:"版本",sortByDownloads:"下载量",sortByFavorites:"收藏量",sortByLatest:"最新",loadFailed:"加载技能失败",copy:"复制",copied:"已复制",installFailed:"安装失败",networkError:"网络错误"},LE={ready:"就绪",hermesIntegrated:"Hermes 已集成",connecting:"连接中...",backendDisconnected:"后端未连接",quickSort:"快速排序 · Python",tcpHandshake:"TCP 三次握手",codeReview:"代码审查 · 斐波那契",dockerfile:"Dockerfile · 多阶段构建",completed:"完成",failed:"失败",running:"运行中...",denied:"已拒绝",approvalTimeout:"审批超时",executing:"执行中...",inputLabel:"输入",outputLabel:"输出",authorizationRequired:"需要您的授权",allowExecution:"允许执行",deny:"拒绝",connectingLabel:"连接中",stop:"停止",exportMarkdown:"导出 Markdown",noModelSelected:"未选择模型",command:"命令",scrollDown:"滚动到底部",inputPlaceholder:"输入指令...",uploadFile:"上传文件",removeFile:"移除",copy:"复制",regenerate:"重新生成",thinking:"思考中...",agentStartFailed:"Agent 启动失败: ",userDenied:"用户拒绝了命令执行",userCancelled:"用户取消了执行",executionStopped:"已停止执行",copied:"已复制!",copiedToast:"已复制",fileTooLarge:'文件 "{name}" 超过 50MB 限制',fileTypeNotSupported:"文件类型不支持：{name}",filesAdded:"已添加 {n} 个文件",fileExtracted:"已提取文本",attachment:"附件",exportTime:"导出时间",exportSuccess:"导出成功",exportSaved:"对话已保存为 Markdown 文件",chatTitle:"对话",systemLabel:"系统",meLabel:"我",toolCalls:"工具调用",params:"参数",result:"结果",cut:"剪切",selectAll:"全选",paste:"粘贴",newSession:"新会话",replyFeedback:"回复修改意见",replyFeedbackPlaceholder:"输入修改意见，Agent 将根据反馈重新执行...",replyBtn:"回复修改",blueprintContext:"蓝图上下文",attachBlueprint:"关联蓝图运行",noBlueprintRuns:"暂无蓝图运行记录",generating:"生成中",timingTtft:"首 Token",timingTool:"工具调用",timingTotal:"总耗时"},DE={title:"用量分析",totalTokens:"总 Tokens",inputOutput:"输入 / 输出",estimatedCost:"预估费用",cacheHitRate:"缓存命中率",sessions:"会话数",perDay:"每天",dailyTrend:"每日趋势",inputTokens:"输入 Tokens",outputTokens:"输出 Tokens",modelDistribution:"模型分布"},NE={title:"搜索会话",placeholder:"按标题或内容搜索会话…",no_results:"未找到会话",sessions_count:"{n} 个会话",navigate:"导航",open:"打开",close:"关闭"},UE={title:"多配置",subtitle:"管理多个独立配置，各自拥有独立的设置和会话",create:"创建配置",namePlaceholder:"输入配置名称…",active:"当前",sessions:"个会话",switch:"切换",switchTitle:"切换配置",switchConfirm:"切换到配置「{name}」？当前会话可能会受影响。",deleteTitle:"删除配置",deleteConfirm:"确定要删除配置「{name}」吗？此操作不可撤销。",exportSuccess:"配置导出成功",importSuccess:"配置导入成功",empty:"暂无配置"},OE={title:"频道管理",subtitle:"配置各平台机器人连接与凭证",enabled:"已启用",disabled:"已禁用",save:"保存",saving:"保存中...",saved:"已保存",saveFailed:"保存失败",toggleEnable:"启用/禁用",expandConfig:"展开配置",collapseConfig:"收起",platforms:{telegram:"Telegram",discord:"Discord",slack:"Slack",whatsapp:"WhatsApp",matrix:"Matrix",feishu:"飞书",wechat:"微信",wecom:"企业微信"},fields:{TELEGRAM_BOT_TOKEN:"Bot Token",TELEGRAM_MENTION_CONTROL:"提及控制",DISCORD_BOT_TOKEN:"Bot Token",DISCORD_MENTION_CONTROL:"提及控制",DISCORD_AUTO_THREAD:"自动创建话题",SLACK_BOT_TOKEN:"Bot Token",SLACK_MENTION_CONTROL:"提及控制",WHATSAPP_ENABLED:"启用 WhatsApp",WHATSAPP_MENTION_CONTROL:"提及控制",MATRIX_ACCESS_TOKEN:"访问令牌",MATRIX_HOMESERVER:"主服务器",MATRIX_AUTO_THREAD:"自动创建话题",FEISHU_APP_ID:"App ID",FEISHU_APP_SECRET:"App Secret",FEISHU_MENTION_CONTROL:"提及控制",WECHAT_ENABLED:"启用微信",WECOM_BOT_ID:"Bot ID",WECOM_BOT_SECRET:"Bot Secret"}},FE={title:"文件浏览器",path:"路径",name:"名称",size:"大小",modified:"修改时间",permissions:"权限",type:"类型",upload:"上传",newFolder:"新建文件夹",delete:"删除",rename:"重命名",download:"下载",refresh:"刷新",empty:"此文件夹为空",loading:"加载中...",error:"错误",parentDir:"上级目录",preview:"预览",closePreview:"关闭预览",dropzone:"拖拽文件到此处或点击上传",folderName:"文件夹名称",createFolder:"创建文件夹",newName:"新名称",confirmDelete:"确认删除",deleteWarning:"确定要删除「{name}」吗？此操作不可撤销。",deleteFolderWarning:"确定要删除文件夹「{name}」及其所有内容吗？此操作不可撤销。",uploadSuccess:"文件上传成功",uploadError:"上传失败",createSuccess:"文件夹创建成功",createError:"创建文件夹失败",renameSuccess:"重命名成功",renameError:"重命名失败",deleteSuccess:"删除成功",deleteError:"删除失败",downloadError:"下载失败",fileTooLarge:"文件过大（预览最大 1MB）",binaryFile:"二进制文件 — 无法预览",bytes:"B",kilobytes:"KB",megabytes:"MB",gigabytes:"GB"},kE={title:"群组聊天",createGroup:"新建群组",groupName:"群组名称",groupNamePlaceholder:"输入群组名称...",agents:"智能体",addAgent:"添加智能体",agentName:"智能体名称",agentNamePlaceholder:"例如：分析师",agentModel:"模型",agentModelPlaceholder:"例如：gpt-4o",agentPrompt:"系统提示词",agentPromptPlaceholder:"输入该智能体的系统提示词...",agentColor:"颜色",noGroups:"暂无群组聊天",noGroupsHint:"创建一个群组，开始与多个智能体对话",noMessages:"暂无消息",noMessagesHint:"发送一条消息开始对话",typePlaceholder:"输入消息...（{'@'} 提及智能体）",send:"发送",sending:"发送中...",deleteGroup:"删除群组",removeAgent:"移除智能体",mentionAll:"所有智能体",you:"你",agentPanel:"智能体面板",confirmDeleteGroup:"确定要删除此群组吗？所有消息将丢失。",confirmRemoveAgent:"确定从此群组移除「{name}」？",createSuccess:"群组创建成功",createError:"创建群组失败",deleteSuccess:"群组已删除",deleteError:"删除群组失败",addAgentSuccess:"智能体已添加",addAgentError:"添加智能体失败",removeAgentSuccess:"智能体已移除",removeAgentError:"移除智能体失败",loadError:"加载群组聊天失败",sendError:"发送消息失败"},BE={title:"编程代理",subtitle:"启动和管理独立的编程代理实例",installed:"已安装",notFound:"未安装",running:"运行中",stopped:"已停止",launch:"启动",stop:"停止",viewLogs:"查看日志",logsTitle:"代理日志",noLogs:"暂无日志",close:"关闭",config:"配置",model:"模型",modelPlaceholder:"例如：claude-sonnet-4-20250514",workdir:"工作目录",workdirPlaceholder:"例如：/path/to/project",systemPrompt:"系统提示词",systemPromptPlaceholder:"输入该代理的系统提示词...",saveConfig:"保存配置",configSaved:"配置已保存",configSaveError:"保存配置失败",launchError:"启动代理失败",stopError:"停止代理失败",agentLaunched:"代理已启动 (PID: {pid})",agentStopped:"代理已停止",loading:"加载中...",refresh:"刷新"},zE={connectTitle:"连接到 Agent",connectDesc:"输入 Agent 服务器的认证令牌，或点击「自动连接」一键认证。",tokenPlaceholder:"在此粘贴认证令牌...",connect:"连接",autoConnect:"自动连接",invalidToken:"令牌无效，请检查后重试",connectFailed:"连接失败，Agent 服务器是否在运行？",autoFailed:"自动连接失败，请手动输入令牌"},VE={nav:SE,common:yE,theme:bE,chat:EE,blueprint:ME,inbox:TE,settings:AE,tasks:wE,app:CE,approval:RE,history:PE,skillStore:IE,chatView:LE,usage:DE,search:NE,profiles:UE,channels:OE,files:FE,groupChat:kE,codingAgents:BE,auth:zE},HE={chat:"Chat",skills:"Skill Store",tasks:"Tasks",settings:"Settings",blueprints:"Blueprints",inbox:"Inbox",history:"History",usage:"Usage",profiles:"Profiles",channels:"Channels",files:"Files",groupChat:"Group Chat",codingAgents:"Coding Agents"},GE={confirm:"Confirm",cancel:"Cancel",save:"Save",delete:"Delete",edit:"Edit",create:"Create",search:"Search",loading:"Loading...",success:"Success",error:"Error",noData:"No data",all:"All",copy:"Copy",close:"Close",export:"Export",import:"Import",retry:"Retry",approve:"Approve",deny:"Deny",reply:"Reply",running:"Running",completed:"Completed",failed:"Failed",denied:"Denied",timeout:"Timeout",pending:"Pending",approved:"Approved",rejected:"Rejected",version:"Version"},WE={glass:"Glass",comic:"Comic"},$E={title:"AI Chat",placeholder:"Type a message... (Shift+Enter for new line)",newSession:"New Session",approvalRequest:"Command Approval Request",approvalDesc:"Agent requests to execute the following command:",approveBtn:"Approve",denyBtn:"Deny",replyPlaceholder:"Enter modification feedback...",sendReply:"Send Feedback",backendDisconnected:"Backend disconnected - some features may be unavailable",stopped:"Execution stopped",tokenUsage:"In {in} / Out {out}",toolCalling:"Tool Call",thinking:"Thinking...",send:"Send",rename:"Rename",deleteSession:"Delete Session",toolTrace:"Tool Trace",toolTraceHint:"Toggle tool call details visibility"},XE={title:"Blueprint Workflow",create:"New Blueprint",import:"Import Blueprint",export:"Export Blueprint",empty:"No blueprints yet. Click to create your first workflow.",addNode:"Add Node",disableNode:"Disable Node",enableNode:"Enable Node",deleteNode:"Delete Node",drawer:{title:"Blueprint List",search:"Search blueprints…",sortRecent:"Recent",sortName:"By Name",sortNodes:"By Nodes",delete:"Delete Blueprint"},name:"Blueprint Name",description:"Description",nodes:{agent:"Agent Node",condition:"Condition Node",loop:"Loop Node",summary:"Summary Node",note:"Note",manager:"Manager",managerSlot:"Manager Slot",group:"Group"},nodeConfig:{prompt:"Prompt",model:"Model",permission:"Permission",timeout:"Timeout (sec)",approval:"Requires Approval",conditionExpr:"Condition Expression",maxIterations:"Max Iterations",summaryMode:"Summary Mode",template:"Template",skills:"Skills",noSkills:"No skills available",instructions:"Instructions",portCount:"Port Count",maxHandoffs:"Max Handoffs",agentName:"Agent Name",slot:"Slot",executionMode:"Execution Mode",parallelLanes:"Parallel Lanes",ports:"Ports",handoffs:"Handoffs",color:"Color"},run:{start:"Run Blueprint",stop:"Stop Run",history:"Run History",output:"Run Output",approve:"Approve",reject:"Reject",status:{queued:"Queued",running:"Running",succeeded:"Succeeded",failed:"Failed",cancelled:"Cancelled",waiting_approval:"Waiting Approval",skipped:"Skipped",idle:"Idle"}},exportFormat:"hixns.blueprint-package/v1"},qE={title:"Inbox",empty:"No pending items",emptyFilter:"No items in this category",emptyHint:"New approvals and notifications will appear here in real time",types:{approval:"Approval Request",proposal:"Blueprint Proposal",notification:"Notification"},approve:"Approve",reject:"Reject",accept:"Accept",reply:"Reply",replyPlaceholder:"Enter feedback...",sendReply:"Send Feedback",markRead:"Mark Read",details:"Details",detailTitle:"Item Details",polling:"Polling for updates...",justNow:"Just now",minutesAgo:"{n}m ago",hoursAgo:"{n}h ago",daysAgo:"{n}d ago",fieldStatus:"Status",fieldType:"Type",fieldTitle:"Title",fieldContent:"Content",fieldCommand:"Command",fieldParams:"Parameters",fieldTime:"Created",fieldResolved:"Resolved",approvalContext:"Approval Context",riskLevel:"Risk Level",references:"References",blueprintRef:"Blueprint",runRef:"Run",risk:{low:"Low",medium:"Medium",high:"High",critical:"Critical",unknown:"Unknown"}},KE={title:"Settings",search:"Search settings...",language:"Language",theme:"Theme",provider:"API Provider",dark:"Dark",light:"Light",system:"System",customProvider:"Custom Provider",gfwProvider:"GFW.NET",model:"Model",apiKey:"***",baseUrl:"Base URL",approvalMode:"Approval Mode",autoApprove:"Auto Approve",manualApprove:"Manual Approval",hermesPath:"Hermes Path",modelProfiles:"Model Profiles",editModelConfig:"Edit Model",clickProfileToEdit:"Click a profile card above to edit its configuration",addModel:"Add Model",removeModel:"Remove",switchModel:"Switch",activeModel:"Active",modelName:"Name",modelProvider:"Provider",modelApiKey:"API Key",modelBaseUrl:"Base URL",modelDefault:"Default",modelSetDefault:"Set Default",account:"gfw.net Account",email:"Email",password:"***",loggingIn:"Logging in...",login:"Login",logout:"Logout",gcoin:"G-Coins",userGroup:"User Group",gfwBuiltIn:"GFW.NET Built-in",builtInModelService:"Built-in Model Service",authMethod:"Authentication Method",accountLogin:"Account Login",manualKeyInput:"Enter Key Manually",createNewKey:"Create New Key",refreshing:"Refreshing...",refresh:"Refresh",noApiKey:"No API Key yet, click to create",getApiKeyHint:"Get your API Key from the gfw.net console",pleaseLoginFirst:"Please log in first to select a model",customApiProvider:"Custom API Provider",upstreamProvider:"Upstream Provider",manual:"Manual",providerName:"Provider Name",testing:"Testing...",testConnection:"Test Connection",syncing:"Syncing...",sync:"Sync",clickSyncHint:'Click "Sync" to fetch provider list',all:"All",inputModelName:"Enter model name",contextLength:"Context Length",contextLengthHint:"Auto-set based on model, adjustable manually",saveSettings:"Save Settings",settingsSaved:"Settings saved",editedUnsaved:"Edited, unsaved",autoSaving:"Auto-saving",saved:"Saved",usageStats:"Usage Statistics",totalRequests:"Total Requests",inputTokens:"Input Tokens",outputTokens:"Output Tokens",tokenTrend:"Token Usage Trend (Last {n} Days)",input:"Input",output:"Output",modelUsage:"Per-Model Usage",modelCol:"Model",requestsCol:"Requests",inputTokensCol:"Input Tokens",outputTokensCol:"Output Tokens",totalCol:"Total",noChatRecords:"No chat records",recentRequests:"Recent Requests",timeCol:"Time",roleCol:"Role",contentSummary:"Content Summary",tokensCol:"Tokens",durationCol:"Duration",question:"Question",reply:"Reply",noRequestRecords:"No request records",recharge:"Recharge",gcoinUnit:"G-Coins",bonus:"Bonus",rechargeNow:"Recharge Now",currentModel:"Current Model",noModelSelected:"No model selected, add and switch below",custom:"Custom",agentSettings:"Agent Settings",hermesAgentStatus:"Hermes Agent Status",backendDisconnectedTitle:"Backend Disconnected",backendDisconnectedDesc:"Hermes Agent service unavailable, please check if backend is running",integrated:"Integrated",notIntegrated:"Not Integrated",version:"Version",unknown:"Unknown",mode:"Mode",path:"Path",uptime:"Uptime",detecting:"Detecting...",chatBehavior:"Chat Behavior",maxTurns:"Max Turns",maxTurnsHint:"Maximum tool-call turns per conversation (default 90)",systemPrompt:"System Prompt",systemPromptHint:"Appended after the Agent's default system prompt",contextCompression:"Context Compression",maxRounds:"Max Rounds",compressionThreshold:"Compression Threshold",compressionTarget:"Compression Target",persistentMemory:"Persistent Memory",memorySystem:"Memory System",userProfile:"User Profile",enabled:"Enabled",disabled:"Disabled",terminalSettings:"Terminal Settings",terminalBackend:"Terminal Backend",commandExecutionEnv:"Command execution environment",workingDirectory:"Working Directory",workingDirectoryHint:"Default working directory for the Agent",commandTimeout:"Command Timeout (seconds)",commandTimeoutHint:"Maximum foreground command execution time (default 180)",commandApproval:"Command Approval",dangerousApprovalHint:"Approval method for dangerous commands",remoteConnectionConfig:"Remote Connection Config",host:"Host",port:"Port",keyPath:"Key Path",containerConfig:"Container Config",image:"Image",mountDirectory:"Mount Directory",displaySettings:"Display Settings",toolCallDetails:"Tool Call Details",show:"Show",hide:"Hide",toolCallHint:"Whether to show tool call input parameters and output results",reasoningProcess:"Reasoning Process",reasoningContentHint:"Model thinking/reasoning content",showCost:"Show Cost",showCostHint:"Show token usage and cost below messages",markdownRender:"Markdown Rendering",plainText:"Plain Text",syntaxHighlight:"Syntax Highlighting",voiceSettings:"Voice Settings",sttTitle:"STT · Speech to Text",enableStt:"Enable STT",sttProvider:"STT Provider",whisperModel:"Whisper Model",ttsTitle:"TTS · Text to Speech",ttsProvider:"TTS Provider",securitySettings:"Security Settings",keyRedaction:"Key Redaction",keyRedactionHint:"Automatically mask API Keys, Tokens and other sensitive info in tool output",piiRedaction:"PII Redaction",piiRedactionHint:"Hash user IDs, phone numbers and other personal information",websiteAccessRestriction:"Website · Access Restrictions",websiteBlocklist:"Website Blocklist",blocklistHint:"List of domains the Agent is forbidden to access",toolPermissions:"Tools · Permissions",createApiKey:"Create API Key",keyName:"Key Name",usageQuota:"Usage Quota",unlimited:"Unlimited",limited:"Limited",quotaHint:"Set the maximum G-coin quota for this Key; unlimited means no cap",customUpstreamHint:"Replace {resource} with your Azure OpenAI resource name",modelsFetched:"✓ {n} models fetched, please select",apiVerified:"✓ API verified, preset models loaded",fetching:"Fetching..."},YE={title:"Tasks",cron:"Scheduled Tasks",create:"Create Task",pause:"Pause",resume:"Resume",remove:"Remove",run:"Run Now",schedule:"Schedule",prompt:"Task Prompt",taskCount:"tasks",createCron:"Create Scheduled Task",taskName:"Task Name",executionPlan:"Execution Schedule",scheduleHint:"Supports: 30m, every 2h, cron expression (0 9 * * *), ISO timestamp",skillsOptional:"Skills (Optional)",selected:"Selected",saveChanges:"Save Changes",editTask:"Edit Task",deleteTask:"Delete Task",confirmDelete:"Confirm Delete",deleteConfirmPrefix:"Are you sure you want to delete task",deleteConfirmSuffix:"? This cannot be undone.",executionHistory:"Execution History",createNew:"Create New",emptyCron:"No scheduled tasks",emptyCronHint:'Click "Create Scheduled Task" to set up your first automation',nextRun:"Next",lastRun:"Last",noRunningTasks:"No running tasks",noHistory:"No execution records",clearAllTitle:"Clear All Tasks",clearAllConfirm:"Delete all {count} cron tasks? This cannot be undone.",clearAllBtn:"Clear",clearAllSuccess:"Cleared {removed} tasks",clearAllEmpty:"No tasks to clear",output:"Output",execute:"Execute",paused:"Paused",executing:"Executing",taskNamePlaceholder:"e.g.: Daily data report",schedulePlaceholder:"30m / every 2h / 0 9 * * * / ISO time",skillsSearchPlaceholder:"Search or enter skill name...",promptPlaceholder:"Prompt content for the task to execute"},jE={rename:"Rename",renameSession:"Rename Session",sessions:"Sessions",balance:"Balance",noModels:"No models available",connectingBackend:"Connecting to backend...",copy:"Copy",paste:"Paste",confirm:"Confirm",deleteSession:"Delete Session",renamePlaceholder:"Enter session name",backendDisconnected:"Backend disconnected — some features may be unavailable",retry:"Retry"},ZE={title:"Command Approval",dangerousCmd:"Dangerous command detected",command:"Command",approve:"Approve Execution",deny:"Deny Execution",timeout:"Approval timeout",denied:"User denied command execution",replySent:"Feedback sent",multiTurn:"Multi-turn approval"},JE={title:"Run History",empty:"No execution history",noMatch:"No matching run records",emptyHint:"Blueprint run history will appear here",allBlueprints:"All Blueprints",from:"From",to:"To",clearFilters:"Clear",cancel:"Cancel",justNow:"Just now",minutesAgo:"{n}m ago",hoursAgo:"{n}h ago",daysAgo:"{n}d ago",startedAt:"Started",finishedAt:"Finished",duration:"Duration",nodeTimeline:"Node Execution Timeline",noNodes:"No node status data",noNodeRuns:"No node run data",inputTokens:"Input Tokens",outputTokens:"Output Tokens",cost:"Cost",nodeLabel:"Node",nodeInput:"Input",nodeOutput:"Output",nodeDuration:"Duration",nodeTokens:"Tokens",events:"Events",eventsTitle:"Events Timeline",showInput:"View Input",showOutput:"View Output",hideDetails:"Collapse",errorDetails:"Error Details",status:{running:"Running",succeeded:"Succeeded",failed:"Failed",cancelled:"Cancelled"},nodeStatus:{pending:"Pending",running:"Running",succeeded:"Succeeded",failed:"Failed",skipped:"Skipped"}},QE={title:"Skill Store",skillCount:"skills",store:"Store",installed:"Installed",rateLimitWarning:"Too many requests. Go to Settings and bind 2x CLI Token to lift the limit.",loading:"Loading...",noMatch:'No skills matching "{query}"',noSkills:"No skill data yet",installedLabel:"Installed",install:"Install",installing:"Installing",installFailedRetry:"Install failed, retry",all:"All",builtin:"Built-in",storeInstall:"Store Install",scanning:"Scanning installed skills...",noInstalledMatch:"No matching installed skills",noInstalled:"No installed skills yet",hasUpdate:"Update available",storeSource:"Store",builtinSource:"Built-in",filesUnit:"files",update:"Update",uninstall:"Uninstall",downloads:"Downloads",favorites:"Favorites",summary:"Summary",detailedDescription:"Detailed Description",tags:"Tags",capabilities:"Capabilities",installSkill:"Install Skill",uninstallSkill:"Uninstall Skill",uninstallConfirm:"Are you sure you want to uninstall {name}? It will be removed from local.",confirmUninstall:"Confirm Uninstall",noQuota:"Unlimited",searchPlaceholder:"Search skill name, description, tags...",installedSearch:"Search installed skills...",version:"Version",sortByDownloads:"Downloads",sortByFavorites:"Favorites",sortByLatest:"Latest",loadFailed:"Failed to load skills",copy:"Copy",copied:"Copied",installFailed:"Install failed",networkError:"Network error"},eM={ready:"Ready",hermesIntegrated:"Hermes Integrated",connecting:"Connecting...",backendDisconnected:"Backend Disconnected",quickSort:"Quick Sort · Python",tcpHandshake:"TCP Three-way Handshake",codeReview:"Code Review · Fibonacci",dockerfile:"Dockerfile · Multi-stage Build",completed:"Completed",failed:"Failed",running:"Running...",denied:"Denied",approvalTimeout:"Approval Timeout",executing:"Executing...",inputLabel:"Input",outputLabel:"Output",authorizationRequired:"Authorization Required",allowExecution:"Allow Execution",deny:"Deny",connectingLabel:"Connecting",stop:"Stop",exportMarkdown:"Export Markdown",noModelSelected:"No Model Selected",command:"Command",scrollDown:"Scroll to Bottom",inputPlaceholder:"Enter command...",uploadFile:"Upload File",removeFile:"Remove",copy:"Copy",regenerate:"Regenerate",thinking:"Thinking...",agentStartFailed:"Agent start failed: ",userDenied:"User denied command execution",userCancelled:"User cancelled execution",executionStopped:"Execution stopped",copied:"Copied!",copiedToast:"Copied",fileTooLarge:'File "{name}" exceeds 50MB limit',fileTypeNotSupported:"File type not supported: {name}",filesAdded:"{n} file(s) added",fileExtracted:"Text extracted",attachment:"Attachment",exportTime:"Export Time",exportSuccess:"Export Successful",exportSaved:"Chat saved as Markdown file",chatTitle:"Chat",systemLabel:"System",meLabel:"Me",toolCalls:"Tool Calls",params:"Parameters",result:"Result",cut:"Cut",selectAll:"Select All",paste:"Paste",newSession:"New Session",replyFeedback:"Reply with Feedback",replyFeedbackPlaceholder:"Enter modification feedback, Agent will retry based on your input...",replyBtn:"Reply Feedback",blueprintContext:"Blueprint Context",attachBlueprint:"Attach Blueprint Run",noBlueprintRuns:"No blueprint runs available",generating:"Generating",timingTtft:"First Token",timingTool:"Tool Calls",timingTotal:"Total Time"},tM={title:"Usage Analytics",totalTokens:"Total Tokens",inputOutput:"Input / Output",estimatedCost:"Estimated Cost",cacheHitRate:"Cache Hit Rate",sessions:"Sessions",perDay:"per day",dailyTrend:"Daily Trend",inputTokens:"Input Tokens",outputTokens:"Output Tokens",modelDistribution:"Model Distribution"},nM={title:"Search Sessions",placeholder:"Search sessions by title or content…",no_results:"No sessions found",sessions_count:"{n} sessions",navigate:"Navigate",open:"Open",close:"Close"},iM={title:"Profiles",subtitle:"Manage multiple profiles with independent settings and sessions",create:"Create Profile",namePlaceholder:"Enter profile name…",active:"Active",sessions:"sessions",switch:"Switch",switchTitle:"Switch Profile",switchConfirm:'Switch to profile "{name}"? Current session may be affected.',deleteTitle:"Delete Profile",deleteConfirm:'Are you sure you want to delete profile "{name}"? This action cannot be undone.',exportSuccess:"Profile exported successfully",importSuccess:"Profile imported successfully",empty:"No profiles yet"},sM={title:"Channels",subtitle:"Configure platform bot connections and credentials",enabled:"Enabled",disabled:"Disabled",save:"Save",saving:"Saving...",saved:"Saved",saveFailed:"Save failed",toggleEnable:"Enable/Disable",expandConfig:"Expand Config",collapseConfig:"Collapse",platforms:{telegram:"Telegram",discord:"Discord",slack:"Slack",whatsapp:"WhatsApp",matrix:"Matrix",feishu:"Feishu (Lark)",wechat:"WeChat",wecom:"WeCom"},fields:{TELEGRAM_BOT_TOKEN:"Bot Token",TELEGRAM_MENTION_CONTROL:"Mention Control",DISCORD_BOT_TOKEN:"Bot Token",DISCORD_MENTION_CONTROL:"Mention Control",DISCORD_AUTO_THREAD:"Auto Thread",SLACK_BOT_TOKEN:"Bot Token",SLACK_MENTION_CONTROL:"Mention Control",WHATSAPP_ENABLED:"Enable WhatsApp",WHATSAPP_MENTION_CONTROL:"Mention Control",MATRIX_ACCESS_TOKEN:"Access Token",MATRIX_HOMESERVER:"Homeserver",MATRIX_AUTO_THREAD:"Auto Thread",FEISHU_APP_ID:"App ID",FEISHU_APP_SECRET:"App Secret",FEISHU_MENTION_CONTROL:"Mention Control",WECHAT_ENABLED:"Enable WeChat",WECOM_BOT_ID:"Bot ID",WECOM_BOT_SECRET:"Bot Secret"}},rM={title:"File Browser",path:"Path",name:"Name",size:"Size",modified:"Modified",permissions:"Permissions",type:"Type",upload:"Upload",newFolder:"New Folder",delete:"Delete",rename:"Rename",download:"Download",refresh:"Refresh",empty:"This folder is empty",loading:"Loading...",error:"Error",parentDir:"Parent Directory",preview:"Preview",closePreview:"Close Preview",dropzone:"Drop files here or click to upload",folderName:"Folder Name",createFolder:"Create Folder",newName:"New Name",confirmDelete:"Confirm Delete",deleteWarning:'Are you sure you want to delete "{name}"? This cannot be undone.',deleteFolderWarning:'Are you sure you want to delete folder "{name}" and all its contents? This cannot be undone.',uploadSuccess:"File uploaded successfully",uploadError:"Upload failed",createSuccess:"Folder created",createError:"Failed to create folder",renameSuccess:"Renamed successfully",renameError:"Rename failed",deleteSuccess:"Deleted successfully",deleteError:"Delete failed",downloadError:"Download failed",fileTooLarge:"File too large (max 1MB for preview)",binaryFile:"Binary file — preview not available",bytes:"B",kilobytes:"KB",megabytes:"MB",gigabytes:"GB"},oM={title:"Group Chat",createGroup:"New Group",groupName:"Group Name",groupNamePlaceholder:"Enter group name...",agents:"Agents",addAgent:"Add Agent",agentName:"Agent Name",agentNamePlaceholder:"e.g. Analyst",agentModel:"Model",agentModelPlaceholder:"e.g. gpt-4o",agentPrompt:"System Prompt",agentPromptPlaceholder:"Enter system prompt for this agent...",agentColor:"Color",noGroups:"No group chats yet",noGroupsHint:"Create a group to start chatting with multiple agents",noMessages:"No messages yet",noMessagesHint:"Send a message to start the conversation",typePlaceholder:"Type a message... ({'@'} to mention)",send:"Send",sending:"Sending...",deleteGroup:"Delete Group",removeAgent:"Remove Agent",mentionAll:"All Agents",you:"You",agentPanel:"Agent Panel",confirmDeleteGroup:"Are you sure you want to delete this group? All messages will be lost.",confirmRemoveAgent:"Remove {name} from this group?",createSuccess:"Group created",createError:"Failed to create group",deleteSuccess:"Group deleted",deleteError:"Failed to delete group",addAgentSuccess:"Agent added",addAgentError:"Failed to add agent",removeAgentSuccess:"Agent removed",removeAgentError:"Failed to remove agent",loadError:"Failed to load group chat",sendError:"Failed to send message"},aM={title:"Coding Agents",subtitle:"Launch and manage isolated coding agent instances",installed:"Installed",notFound:"Not Found",running:"Running",stopped:"Stopped",launch:"Launch",stop:"Stop",viewLogs:"View Logs",logsTitle:"Agent Logs",noLogs:"No logs available",close:"Close",config:"Configuration",model:"Model",modelPlaceholder:"e.g. claude-sonnet-4-20250514",workdir:"Working Directory",workdirPlaceholder:"e.g. /path/to/project",systemPrompt:"System Prompt",systemPromptPlaceholder:"Enter system prompt for this agent...",saveConfig:"Save Config",configSaved:"Configuration saved",configSaveError:"Failed to save configuration",launchError:"Failed to launch agent",stopError:"Failed to stop agent",agentLaunched:"Agent launched (PID: {pid})",agentStopped:"Agent stopped",loading:"Loading agents...",refresh:"Refresh"},lM={connectTitle:"Connect to Agent",connectDesc:"Enter the auth token from the agent server, or click Auto Connect to authenticate automatically.",tokenPlaceholder:"Paste auth token here...",connect:"Connect",autoConnect:"Auto Connect",invalidToken:"Invalid token. Please check and try again.",connectFailed:"Connection failed. Is the agent server running?",autoFailed:"Auto-connect failed. Please enter the token manually."},cM={nav:HE,common:GE,theme:WE,chat:$E,blueprint:XE,inbox:qE,settings:KE,tasks:YE,app:jE,approval:ZE,history:JE,skillStore:QE,chatView:eM,usage:tM,search:nM,profiles:iM,channels:sM,files:rM,groupChat:oM,codingAgents:aM,auth:lM},uM=localStorage.getItem("hixns-language")||"zh-CN",n0=uE({legacy:!1,locale:uM,fallbackLocale:"zh-CN",messages:{"zh-CN":VE,en:cM}});function fM(t){n0.global.locale.value=t,localStorage.setItem("hixns-language",t),document.documentElement.setAttribute("lang",t==="zh-CN"?"zh":"en")}async function Ct(t,e){return gM(t,e)}const Un="https://api.gfw.net/api/v1",dM="https://api.gfw.net/v1",Vs="/v1/store";let Hu=[],Gu=!0;function hM(t){Hu.push(t),Gu&&pM()}async function pM(){for(Gu=!1;Hu.length>0;)Hu.shift()(),await new Promise(e=>setTimeout(e,300));Gu=!0}async function go(t,e,n=2){return new Promise((i,s)=>{hM(async()=>{for(let r=0;r<=n;r++)try{const o=await fetch(t,e);if(o.status===429){if(r<n){await new Promise(l=>setTimeout(l,2e3*(r+1)));continue}i({_error:!0,_status:429});return}const a=await o.json();Wu(a),i(a);return}catch(o){if(r<n){await new Promise(a=>setTimeout(a,1e3*(r+1)));continue}s(o)}})})}function mM(t){if(Array.isArray(t))return t;if(typeof t!="string"||!t.startsWith("{"))return[];const e=t.slice(1,-1);if(!e)return[];const n=[];let i=0;for(;i<e.length;)if(e[i]==='"'){const s=e.indexOf('"',i+1);if(s===-1)break;for(n.push(e.slice(i+1,s)),i=s+1;i<e.length&&e[i]===",";)i++}else{const s=e.indexOf(",",i);if(s===-1){n.push(e.slice(i));break}n.push(e.slice(i,s)),i=s+1}return n}function Wu(t){if(!(!t||typeof t!="object")){if(Array.isArray(t)){for(const e of t)Wu(e);return}for(const e of["tags","capabilities","capability","requirements","platforms"])typeof t[e]=="string"&&(t[e]=mM(t[e]));for(const e of["data","skills","results","result"])t[e]&&Wu(t[e])}}let en=localStorage.getItem("gfw_jwt"),Fp=localStorage.getItem("gfw_api_key"),kp=localStorage.getItem("2x_token");async function gM(t,e){switch(t){case"gfw_login":{const i=await(await fetch(`${Un}/auth/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e==null?void 0:e.email,password:e==null?void 0:e.password})})).json();if(i.code!==0)throw new Error(i.message);return en=i.data.token,localStorage.setItem("gfw_jwt",en),localStorage.setItem("gfw_refresh_token",i.data.refresh_token),{token:i.data.token,user:i.data.user}}case"gfw_refresh_token":{const n=localStorage.getItem("gfw_refresh_token");if(!n)throw new Error("No refresh token");const s=await(await fetch(`${Un}/auth/refresh`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({refresh_token:n})})).json();if(s.code!==0)throw new Error(s.message);return en=s.data.token,localStorage.setItem("gfw_jwt",en),{token:s.data.token,user:s.data.user}}case"gfw_get_user_info":{if(!en)throw new Error("Not logged in");const i=await(await fetch(`${Un}/user`,{headers:{Authorization:`Bearer ${en}`}})).json();if(i.code!==0)throw new Error(i.message);return i.data}case"gfw_get_balance":{if(!en)throw new Error("Not logged in");return(await(await fetch(`${Un}/gcoin/balance`,{headers:{Authorization:`Bearer ${en}`}})).json()).data.balance}case"gfw_list_models":return(await(await fetch(`${Un}/models`)).json()).data.models;case"gfw_list_api_keys":{if(!en)throw new Error("Not logged in");return(await(await fetch(`${Un}/api-keys`,{headers:{Authorization:`Bearer ${en}`}})).json()).data.keys}case"gfw_create_api_key":{if(!en)throw new Error("Not logged in");const i=await(await fetch(`${Un}/api-keys`,{method:"POST",headers:{Authorization:`Bearer ${en}`,"Content-Type":"application/json"},body:JSON.stringify({name:e==null?void 0:e.name,gcoin_limit:e==null?void 0:e.gcoinLimit,rate_limit:e==null?void 0:e.rateLimit})})).json();if(i.code!==0)throw new Error(i.message);const s=i.data.key.id,a=(await(await fetch(`${Un}/api-keys/${s}/full`,{headers:{Authorization:`Bearer ${en}`}})).json()).data.key;return Fp=a,localStorage.setItem("gfw_api_key",a),{id:s,key:a,name:e==null?void 0:e.name}}case"gfw_get_full_key":{if(!en)throw new Error("Not logged in");return(await(await fetch(`${Un}/api-keys/${e==null?void 0:e.keyId}/full`,{headers:{Authorization:`Bearer ${en}`}})).json()).data.key}case"gfw_get_daily_usage":{if(!en)throw new Error("Not logged in");return(await(await fetch(`${Un}/usage/daily?days=${(e==null?void 0:e.days)||7}`,{headers:{Authorization:`Bearer ${en}`}})).json()).data.daily_usage}case"gfw_get_recharge_packages":return(await(await fetch(`${Un}/recharge/packages`)).json()).data.packages;case"gfw_create_recharge_order":{if(!en)throw new Error("Not logged in");return(await(await fetch(`${Un}/recharge/create`,{method:"POST",headers:{Authorization:`Bearer ${en}`,"Content-Type":"application/json"},body:JSON.stringify({package_id:e==null?void 0:e.packageId,pay_method:e==null?void 0:e.payMethod})})).json()).data}case"gfw_list_sr_providers":return(await(await fetch(`${Un}/sr/public/providers`)).json()).data.providers;case"skill_store_email_login":{const i=await(await fetch(`${Vs}/auth/email/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e==null?void 0:e.email,password:e==null?void 0:e.password})})).json();if(i.code!==0&&!i.data)throw new Error(i.message||"Login failed");return kp=i.data.token,localStorage.setItem("2x_token",kp),{token:i.data.token,user:i.data.user}}case"skill_store_get_skills":{let n=`${Vs}/skills/latest?limit=${(e==null?void 0:e.limit)||20}&offset=${(e==null?void 0:e.offset)||0}`;e!=null&&e.q&&(n+=`&q=${encodeURIComponent(e.q)}`),e!=null&&e.category&&(n+=`&category=${encodeURIComponent(e.category)}`),e!=null&&e.sort&&(n+=`&sort=${e.sort}`);const i=await go(n);return{skills:i.data||[],total:i.total||0}}case"skill_store_search_skills":return{skills:(await go(`${Vs}/skills/latest?q=${encodeURIComponent(e==null?void 0:e.query)}&limit=50`)).data||[]};case"skill_store_get_skill_detail":return(await go(`${Vs}/skills/${e==null?void 0:e.idOrSlug}`)).data;case"skill_store_get_popular_skills":return{skills:(await go(`${Vs}/skills/popular?limit=${(e==null?void 0:e.limit)||50}`)).data||[]};case"skill_store_get_rankings":return{rankings:(await go(`${Vs}/rankings/${e==null?void 0:e.rankingType}`)).skills||[]};case"skill_store_get_workflows":{let n=`${Vs}/workflow-market?page=${(e==null?void 0:e.page)||1}&limit=${(e==null?void 0:e.limit)||20}`;return e!=null&&e.category&&(n+=`&category=${encodeURIComponent(e.category)}`),e!=null&&e.q&&(n+=`&q=${encodeURIComponent(e.q)}`),{workflows:(await(await fetch(n)).json()).data||[]}}case"agent_start":return 0;case"agent_stop":return;case"agent_send_message":{if(!(Fp||localStorage.getItem("gfw_api_key")))throw new Error("No API Key. Please create one in Settings.");return}case"agent_cancel":return;case"config_get":return JSON.parse(localStorage.getItem(`config_${e==null?void 0:e.key}`)||"null");case"config_set":localStorage.setItem(`config_${e==null?void 0:e.key}`,JSON.stringify(e==null?void 0:e.value));return;case"config_get_all":return{};default:throw new Error(`Unknown command: ${t}`)}}async function i0(t,e){return Ct("gfw_login",{email:t,password:e})}async function s0(){return Ct("gfw_refresh_token")}async function $u(){return Ct("gfw_get_user_info")}async function r0(){return Ct("gfw_get_balance")}async function o0(){return Ct("gfw_list_models")}async function a0(){return Ct("gfw_list_api_keys")}async function l0(t,e,n){return Ct("gfw_create_api_key",{name:t,gcoinLimit:e,rateLimit:n})}async function _M(t){return Ct("gfw_get_full_key",{keyId:t})}async function c0(t=7){return Ct("gfw_get_daily_usage",{days:t})}async function u0(){return Ct("gfw_get_recharge_packages")}async function vM(t,e){return Ct("gfw_create_recharge_order",{packageId:t,payMethod:e})}async function xM(){return Ct("gfw_list_sr_providers")}async function SM(t,e){return Ct("skill_store_email_login",{email:t,password:e})}async function yM(t,e,n,i,s=20,r=0){return Ct("skill_store_get_skills",{q:t,category:e,sort:i,limit:s,offset:r})}async function bM(t){return Ct("skill_store_search_skills",{query:t})}async function EM(t){return Ct("skill_store_get_skill_detail",{idOrSlug:t})}async function MM(t=50){return Ct("skill_store_get_popular_skills",{limit:t})}async function TM(t){return Ct("skill_store_get_rankings",{rankingType:t})}async function AM(t=1,e=20,n,i,s){return Ct("skill_store_get_workflows",{page:t,limit:e,category:n,q:i,sort:s})}async function wM(t,e){return Ct("skill_store_email_login",{email:t,password:e})}async function CM(){return{username:"browser_user",nickname:"Browser User"}}async function RM(){return Ct("skill_store_get_skills",{limit:50,offset:0})}async function PM(){return Ct("skill_store_get_skills",{limit:50,offset:0})}async function IM(){return{downloads:[]}}async function LM(t){return!0}async function DM(t){return`https://api.2x.com.cn/api/v1/skills/${t}/download-file`}async function NM(t){return Ct("agent_start",{})}async function UM(){return Ct("agent_stop")}async function OM(t,e){return Ct("agent_send_message",{})}async function FM(t){return Ct("agent_cancel",{})}async function kM(t){return Ct("config_get",{key:t})}async function BM(t,e){return Ct("config_set",{key:t,value:e})}async function zM(){return Ct("config_get_all")}const so="",yd="hermes_auth_token";function ro(){return localStorage.getItem(yd)}function bl(t){localStorage.setItem(yd,t)}function f0(){localStorage.removeItem(yd)}async function An(t,e){const n=ro(),i={"Content-Type":"application/json",...(e==null?void 0:e.headers)||{}};n&&(i.Authorization=`Bearer ${n}`);const s=await fetch(`${so}${t}`,{...e,headers:i});if(s.status===401&&n&&f0(),!s.ok){const r=await s.text().catch(()=>"");throw new Error(`Agent 请求失败 (${s.status}): ${r||s.statusText}`)}return s}async function vt(t,e){return(await An(t,e)).json()}async function ft(t,e){return vt(t,{method:"POST",body:JSON.stringify(e)})}async function VM(t="~"){return vt(`/v1/agent/files?path=${encodeURIComponent(t)}`)}async function HM(t){return vt(`/v1/agent/files/read?path=${encodeURIComponent(t)}`)}async function GM(t,e){const n=ro(),i=new FormData;i.append("path",t),i.append("file",e);const s={};n&&(s.Authorization=`Bearer ${n}`);const r=await fetch(`${so}/v1/agent/files/upload`,{method:"POST",headers:s,body:i});if(!r.ok){const o=await r.text().catch(()=>"");throw new Error(`Upload failed (${r.status}): ${o||r.statusText}`)}return r.json()}async function WM(t){const e=ro(),n={};e&&(n.Authorization=`Bearer ${e}`);const i=await fetch(`${so}/v1/agent/files/download?path=${encodeURIComponent(t)}`,{headers:n});if(!i.ok)throw new Error(`Download failed (${i.status})`);const s=await i.blob(),r=URL.createObjectURL(s),o=document.createElement("a");o.href=r,o.download=t.split("/").pop()||"download",document.body.appendChild(o),o.click(),document.body.removeChild(o),URL.revokeObjectURL(r)}async function $M(t){return ft("/v1/agent/files/mkdir",{path:t})}async function XM(t,e){return ft("/v1/agent/files/rename",{path:t,new_name:e})}async function qM(t,e){return ft("/v1/agent/files/move",{path:t,dest:e})}async function KM(t){return vt(`/v1/agent/files?path=${encodeURIComponent(t)}`,{method:"DELETE"})}async function d0(t){const e=await fetch(`${so}/v1/agent/auth/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token:t})});if(!e.ok){if(e.status===401)return{success:!1};throw new Error(`Auth login failed (${e.status})`)}return e.json()}async function Xu(){const t=await fetch(`${so}/v1/agent/auth/status`);if(!t.ok)throw new Error(`Auth status failed (${t.status})`);return t.json()}async function bd(){try{const t=await fetch(`${so}/v1/agent/auth/auto-login`,{signal:AbortSignal.timeout(2e3)});return t.ok?t.json():{success:!1,error:`HTTP ${t.status}`}}catch(t){return{success:!1,error:(t==null?void 0:t.message)||"auto-login unavailable"}}}async function YM(){return(await An("/v1/agent/config")).text()}async function jM(t,e){return ft("/v1/agent/config/set",{key:t,value:e})}async function ZM(){return vt("/v1/agent/cron/list")}async function JM(t,e,n){return ft("/v1/agent/cron/create",{schedule:t,prompt:e,name:n})}async function QM(t){return ft("/v1/agent/cron/pause",{id:t})}async function e6(t){return ft("/v1/agent/cron/resume",{id:t})}async function t6(t){return ft("/v1/agent/cron/remove",{id:t})}async function n6(t){return ft("/v1/agent/cron/run",{id:t})}async function h0(t,e){return ft("/v1/agent/cron/edit",{id:t,...e})}async function i6(t,e){return h0(t,e)}async function s6(){return ft("/v1/agent/cron/clear",{})}async function r6(){return vt("/v1/agent/sessions/list")}async function o6(t){return ft("/v1/agent/sessions/delete",{id:t})}async function a6(t,e){return ft("/v1/agent/sessions/rename",{id:t,title:e})}async function l6(){return vt("/v1/agent/memory")}async function c6(t,e){return ft("/v1/agent/memory/edit",{target:t,content:e})}async function u6(){return vt("/v1/agent/tools/list")}async function f6(t){return ft("/v1/agent/tools/enable",{name:t})}async function d6(t){return ft("/v1/agent/tools/disable",{name:t})}async function h6(){return ft("/v1/agent/cancel",{})}async function p6(t="30d"){return vt(`/v1/agent/usage/summary?period=${t}`)}async function m6(){return vt("/v1/agent/usage/models")}async function g6(){return vt("/v1/agent/channels")}async function _6(t,e,n){return ft("/v1/agent/channels/update",{platform:t,config:e,enabled:n})}async function v6(t,e,n){var r,o,a,l;let i=n.baseUrl||dM;const s={Authorization:`Bearer ${n.apiKey}`,"Content-Type":"application/json"};try{const c=await fetch(`${i}/chat/completions`,{method:"POST",headers:s,body:JSON.stringify({model:n.model,messages:[{role:"system",content:"用5-10个中文字概括以下对话的主题，只输出标题本身，不要标点符号、引号或解释。"},{role:"user",content:`用户: ${t.substring(0,200)}
助手: ${e.substring(0,300)}`}],max_tokens:20,temperature:.3,stream:!1}),signal:AbortSignal.timeout(8e3)});return c.ok?(((l=(a=(o=(r=(await c.json()).choices)==null?void 0:r[0])==null?void 0:o.message)==null?void 0:a.content)==null?void 0:l.trim())||"").replace(/["""''「」『』]/g,"").substring(0,30):""}catch(c){return console.warn("[API] generateTitle failed:",c),""}}async function p0(){try{const t=await An("/v1/agent/status",{signal:AbortSignal.timeout(3e3)});return t.ok?await t.json():null}catch(t){return console.warn("[API] getAgentStatus failed:",t),null}}async function x6(){return vt("/v1/agent/group-chats")}async function S6(t,e){return ft("/v1/agent/group-chats",{name:t,agents:e})}async function y6(t){return vt(`/v1/agent/group-chats/${t}`)}async function b6(t){return vt(`/v1/agent/group-chats/${t}`,{method:"DELETE"})}async function E6(t,e){return ft(`/v1/agent/group-chats/${t}/agents`,e)}async function M6(t,e){return vt(`/v1/agent/group-chats/${t}/agents/${e}`,{method:"DELETE"})}async function T6(t,e=50,n=0){return vt(`/v1/agent/group-chats/${t}/messages?limit=${e}&offset=${n}`)}async function A6(t,e,n=[]){return An(`/v1/agent/group-chats/${t}/messages`,{method:"POST",body:JSON.stringify({content:e,mentions:n})})}async function m0(t,e=20,n=0){return vt(`/v1/agent/sessions/search?q=${encodeURIComponent(t)}&limit=${e}&offset=${n}`)}async function g0(t,e="json"){return(await An(`/v1/agent/sessions/export?session_id=${encodeURIComponent(t)}&format=${e}`)).blob()}async function w6(t=50,e=0){return vt(`/v1/agent/sessions/usage?limit=${t}&offset=${e}`)}async function _0(t){return ft("/v1/agent/sessions/batch-delete",{session_ids:t})}async function C6(){return vt("/v1/agent/available-models")}async function R6(){return vt("/v1/agent/model-context")}async function P6(){return vt("/v1/agent/profiles/runtime-statuses")}async function I6(t){return vt(`/v1/agent/profiles/${encodeURIComponent(t)}/runtime-status`)}async function L6(t){return ft(`/v1/agent/profiles/${encodeURIComponent(t)}/restart`,{})}async function D6(){return vt("/v1/agent/cron-history")}async function N6(t){return(await An("/v1/agent/config",{method:"PUT",headers:{"Content-Type":"text/yaml"},body:t})).json()}async function U6(){return(await An("/v1/agent/config/credentials",{method:"PUT",headers:{"Content-Type":"application/json"},body:"{}"})).json()}async function O6(t){return ft("/v1/agent/config/credentials",t)}async function F6(){return vt("/v1/agent/logs")}async function k6(t,e=100){return(await(await An(`/v1/agent/logs/${encodeURIComponent(t)}?lines=${e}`)).json()).content||""}async function B6(t){return ft("/v1/agent/skills/toggle",{name:t})}async function z6(t){return ft("/v1/agent/skills/pin",{name:t})}async function V6(){return vt("/v1/agent/skills/usage/stats")}async function H6(t,e){return ft("/v1/agent/files/copy",{src:t,dst:e})}async function G6(t,e){return(await An("/v1/agent/files/write",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({path:t,content:e})})).json()}async function W6(t){return vt(`/v1/agent/files/stat?path=${encodeURIComponent(t)}`)}async function $6(t,e){return ft("/v1/agent/tts",{text:t,voice:e})}const As=Object.freeze(Object.defineProperty({__proto__:null,agentCancel:FM,agentFetch:An,agentJson:vt,agentPost:ft,agentSendMessage:OM,agentStart:NM,agentStop:UM,availableModels:C6,clearAuthToken:f0,configGet:kM,configGetAll:zM,configSet:BM,cronHistory:D6,fileCopy:H6,fileStat:W6,fileWrite:G6,filesDelete:KM,filesDownload:WM,filesList:VM,filesMkdir:$M,filesMove:qM,filesRead:HM,filesRename:XM,filesUpload:GM,generateTitle:v6,getAgentStatus:p0,getAuthToken:ro,getCredentials:U6,gfwCreateApiKey:l0,gfwCreateRechargeOrder:vM,gfwGetBalance:r0,gfwGetDailyUsage:c0,gfwGetFullKey:_M,gfwGetRechargePackages:u0,gfwGetUserInfo:$u,gfwListApiKeys:a0,gfwListModels:o0,gfwListSrProviders:xM,gfwLogin:i0,gfwRefreshToken:s0,groupChatAddAgent:E6,groupChatDelete:b6,groupChatDetail:y6,groupChatMessages:T6,groupChatRemoveAgent:M6,groupChatSendMessage:A6,groupChatsCreate:S6,groupChatsList:x6,hermesAuthAutoLogin:bd,hermesAuthLogin:d0,hermesAuthStatus:Xu,hermesCancel:h6,hermesChannelsList:g6,hermesChannelsUpdate:_6,hermesConfigGet:YM,hermesConfigSet:jM,hermesCronClearAll:s6,hermesCronCreate:JM,hermesCronEdit:h0,hermesCronList:ZM,hermesCronPause:QM,hermesCronRemove:t6,hermesCronResume:e6,hermesCronRun:n6,hermesCronUpdate:i6,hermesMemoryEdit:c6,hermesMemoryGet:l6,hermesSessionsDelete:o6,hermesSessionsList:r6,hermesSessionsRename:a6,hermesToolsDisable:d6,hermesToolsEnable:f6,hermesToolsList:u6,hermesUsageModels:m6,hermesUsageSummary:p6,listLogs:F6,modelContext:R6,pinSkill:z6,profileRestart:L6,profileRuntimeStatus:I6,profilesRuntimeStatuses:P6,readLog:k6,sessionBatchDelete:_0,sessionExport:g0,sessionSearch:m0,sessionUsage:w6,setAuthToken:bl,skillsUsageStats:V6,textToSpeech:$6,toggleSkill:B6,twoXEmailLogin:SM,twoXGetDownloadUrl:DM,twoXGetDownloads:IM,twoXGetFavorites:PM,twoXGetMySkills:RM,twoXGetPopularSkills:MM,twoXGetProfile:CM,twoXGetRankings:TM,twoXGetSkillDetail:EM,twoXGetSkills:yM,twoXGetWorkflows:AM,twoXPhoneLogin:wM,twoXSearchSkills:bM,twoXToggleFavorite:LM,updateConfigYaml:N6,updateCredentials:O6},Symbol.toStringTag,{value:"Module"})),X6=Zl("gfw",()=>{const t=Ee(!1),e=Ee(null),n=Ee(0),i=Ee([]),s=Ee([]),r=Ee([]),o=Ee([]),a=Ee(!1),l=Ee(null),c=Ee(null),u=rt(()=>r.value.reduce((L,E)=>L+E.input_tokens+E.output_tokens,0)),d=rt(()=>r.value.reduce((L,E)=>L+E.total_cost,0)),f=rt(()=>i.value.filter(L=>L.is_featured&&L.is_available)),p=rt(()=>i.value.filter(L=>L.is_featured).slice(0,10));async function g(L,E){a.value=!0,l.value=null;try{const P=await i0(L,E);e.value=P.user,t.value=!0,n.value=P.user.gcoin_balance}catch(P){throw l.value=P instanceof Error?P.message:String(P),P}finally{a.value=!1}}async function _(){try{const L=await s0();e.value=L.user,t.value=!0}catch(L){throw t.value=!1,e.value=null,L}}async function m(){try{const L=await $u();e.value=L.user,n.value=L.user.gcoin_balance}catch(L){l.value=L instanceof Error?L.message:String(L)}}async function h(){try{n.value=await r0()}catch(L){l.value=L instanceof Error?L.message:String(L)}}async function v(L=!1){if(!(!L&&i.value.length>0)){a.value=!0;try{i.value=await o0(),c.value=new Date}catch(E){l.value=E instanceof Error?E.message:String(E)}finally{a.value=!1}}}async function b(){try{s.value=await a0()}catch(L){l.value=L instanceof Error?L.message:String(L)}}async function x(L,E,P){a.value=!0;try{const B=await l0(L,E,P);return await b(),B}catch(B){throw l.value=B instanceof Error?B.message:String(B),B}finally{a.value=!1}}async function D(L=7){try{r.value=await c0(L)}catch(E){l.value=E instanceof Error?E.message:String(E)}}async function C(){try{o.value=await u0()}catch(L){l.value=L instanceof Error?L.message:String(L)}}function R(L){return i.value.find(E=>E.id===L)}function S(){t.value=!1,e.value=null,n.value=0}async function M(L){localStorage.setItem("gfw_jwt",L);try{const E=await $u();e.value=E.user,t.value=!0,await h()}catch{throw localStorage.removeItem("gfw_jwt"),t.value=!1,e.value=null,new Error("Token 登录失败")}}return{isLoggedIn:t,user:e,balance:n,models:i,apiKeys:s,dailyUsage:r,rechargePackages:o,loading:a,error:l,lastRefreshed:c,totalTokens:u,totalCost:d,featuredModels:f,popularModels:p,login:g,loginWithToken:M,refreshToken:_,fetchUserInfo:m,fetchBalance:h,fetchModels:v,fetchApiKeys:b,createApiKey:x,fetchDailyUsage:D,fetchRechargePackages:C,getModelById:R,logout:S}}),Bp="https://api.gfw.net/v1",v0="hixns_sessions",Rc="hixns_active_session",x0="hixns_model_profiles",va="hixns_active_model";function q6(){return"id-"+Date.now()+"-"+Math.random().toString(36).substr(2,6)}function xa(){return"msg-"+Date.now()+"-"+Math.random().toString(36).substr(2,9)}function K6(){try{const t=localStorage.getItem(x0);if(t)return JSON.parse(t)}catch{}return[]}function Pc(t){try{localStorage.setItem(x0,JSON.stringify(t))}catch{}}function Sa(t="新会话"){const e=new Date().toISOString();return{id:q6(),title:t,messages:[],createdAt:e,updatedAt:e}}function Y6(){try{const t=localStorage.getItem(v0);if(t)return JSON.parse(t)}catch{}return[]}function j6(t){try{localStorage.setItem(v0,JSON.stringify(t))}catch{}}function Z6(t){const e=t.find(n=>n.role==="user");if(e){const n=e.content.trim();return n.length>30?n.substring(0,30)+"...":n}return"新会话"}const Ed=Zl("chat",()=>{const t=Ee(Y6()),e=Ee(localStorage.getItem(Rc)||"");if(t.value.length===0){const T=Sa();t.value.push(T),e.value=T.id}(!e.value||!t.value.find(T=>T.id===e.value))&&(e.value=t.value[0].id);const n=rt(()=>t.value.find(T=>T.id===e.value)||t.value[0]),i=rt(()=>{var T;return((T=n.value)==null?void 0:T.messages)||[]}),s=Ee(!1),r=Ee(""),o=Ee([]),a=Ee(0),l=Ee(0),c=Ee(0),u=Ee("gpt-4o-mini"),d=Ee(""),f=Ee(localStorage.getItem("hermes_provider_mode")||"gfw"),p=Ee({name:localStorage.getItem("hermes_custom_name")||"",baseUrl:localStorage.getItem("hermes_custom_base_url")||"",apiKey:localStorage.getItem("hermes_custom_api_key")||"",model:localStorage.getItem("hermes_custom_model")||""}),g=Ee(K6()),_=Ee(localStorage.getItem(va)||"");if(g.value.length>0&&!g.value.find(T=>T.id===_.value)){const T=g.value.find(I=>I.isDefault)||g.value[0];_.value=T.id}async function m(){const T=Sa();t.value.unshift(T),e.value=T.id,D();const I=await R(T.title);return I&&(T.serverId=I,D()),T}function h(T){if(t.value.find(I=>I.id===T)){e.value=T,localStorage.setItem(Rc,T);const I=t.value.find(V=>V.id===T);I&&I.serverId&&I.messages.length===0&&M(I)}}function v(T){const I=t.value.findIndex(Y=>Y.id===T);if(I<0)return;const V=t.value[I];if(t.value.splice(I,1),e.value===T)if(t.value.length===0){const Y=Sa();t.value.push(Y),e.value=Y.id}else e.value=t.value[0].id;D(),E(V)}function b(T,I){const V=t.value.find(Y=>Y.id===T);V&&(V.title=I,D(),L(T,I))}function x(){const T=Sa();t.value=[T],e.value=T.id,D()}function D(){j6(t.value),localStorage.setItem(Rc,e.value)}async function C(){try{const{agentJson:T}=await cn(async()=>{const{agentJson:Y}=await Promise.resolve().then(()=>As);return{agentJson:Y}},void 0),I=await T("/v1/agent/chat-sessions"),V=Array.isArray(I==null?void 0:I.sessions)?I.sessions:[];for(const Y of V){const J=t.value.find(ae=>ae.serverId===Y.id);J?(J.title=Y.title||J.title,J.updatedAt=Y.updated_at||J.updatedAt):t.value.push({id:"srv-"+Y.id,title:Y.title,messages:[],createdAt:Y.created_at,updatedAt:Y.updated_at,serverId:Y.id})}}catch(T){console.warn("[chat] fetchServerSessions failed, using localStorage only:",T)}}async function R(T){try{const{agentPost:I}=await cn(async()=>{const{agentPost:J}=await Promise.resolve().then(()=>As);return{agentPost:J}},void 0),V=await I("/v1/agent/chat-sessions",{title:T}),Y=(V==null?void 0:V.session)||V;return(Y==null?void 0:Y.id)||null}catch(I){return console.warn("[chat] createServerSession failed:",I),null}}async function S(T){const I=t.value.find(V=>V.id===T);if(!(!I||!I.serverId))try{const{agentPost:V}=await cn(async()=>{const{agentPost:J}=await Promise.resolve().then(()=>As);return{agentPost:J}},void 0),Y=I.messages.filter(J=>J.role==="user"||J.role==="assistant").map(J=>({role:J.role,content:J.content,timestamp:J.timestamp}));await V("/v1/agent/chat-sessions/messages",{session_id:I.serverId,messages:Y})}catch(V){console.warn("[chat] saveServerMessages failed:",V)}}async function M(T){if(T.serverId)try{const{agentJson:I}=await cn(async()=>{const{agentJson:J}=await Promise.resolve().then(()=>As);return{agentJson:J}},void 0),V=await I(`/v1/agent/chat-sessions/messages?session_id=${T.serverId}`),Y=Array.isArray(V==null?void 0:V.messages)?V.messages:[];Y.length>0&&T.messages.length===0&&(T.messages=Y.map((J,ae)=>({id:xa(),role:J.role,content:J.content||"",timestamp:J.timestamp||new Date().toISOString()})))}catch(I){console.warn("[chat] loadServerMessages failed:",I)}}async function L(T,I){const V=t.value.find(Y=>Y.id===T);if(V!=null&&V.serverId)try{const{agentPost:Y}=await cn(async()=>{const{agentPost:J}=await Promise.resolve().then(()=>As);return{agentPost:J}},void 0);await Y("/v1/agent/chat-sessions/rename",{id:V.serverId,title:I})}catch(Y){console.warn("[chat] renameServerSession failed:",Y)}}async function E(T){if(T.serverId)try{const{agentPost:I}=await cn(async()=>{const{agentPost:V}=await Promise.resolve().then(()=>As);return{agentPost:V}},void 0);await I("/v1/agent/chat-sessions/delete",{id:T.serverId})}catch(I){console.warn("[chat] deleteServerSession failed:",I)}}function P(){const T=g.value.find(V=>V.id===_.value),I=d.value||void 0;return T?{baseUrl:T.baseUrl||(T.provider==="gfw"?Bp:""),apiKey:T.apiKey,model:T.model||"gpt-4o-mini",profileName:T.name,blueprint_run_id:I}:f.value==="custom"&&p.value.baseUrl&&p.value.apiKey?{baseUrl:p.value.baseUrl,apiKey:p.value.apiKey,model:p.value.model||"gpt-4o-mini",blueprint_run_id:I}:{baseUrl:Bp,apiKey:localStorage.getItem("gfw_api_key")||"",model:u.value,blueprint_run_id:I}}function B(T){const I={...T,id:"mp-"+Date.now()+"-"+Math.random().toString(36).substr(2,6),createdAt:new Date().toISOString()};return I.isDefault&&g.value.forEach(V=>{V.isDefault=!1}),g.value.push(I),Pc(g.value),_.value||(_.value=I.id,localStorage.setItem(va,I.id)),I}function Z(T){const I=g.value.findIndex(V=>V.id===T);if(!(I<0)&&(g.value.splice(I,1),Pc(g.value),_.value===T)){const V=g.value.find(Y=>Y.isDefault)||g.value[0];_.value=(V==null?void 0:V.id)||"",localStorage.setItem(va,_.value)}}function G(T,I){const V=g.value.find(Y=>Y.id===T);V&&(I.isDefault&&g.value.forEach(Y=>{Y.isDefault=!1}),Object.assign(V,I),Pc(g.value))}function X(T){const I=g.value.find(V=>V.id===T);I&&(_.value=T,localStorage.setItem(va,T),I.provider==="gfw"?(f.value="gfw",localStorage.setItem("hermes_provider_mode","gfw")):(f.value="custom",localStorage.setItem("hermes_provider_mode","custom"),p.value={name:I.name,baseUrl:I.baseUrl,apiKey:I.apiKey,model:I.model},me(p.value)),u.value=I.model)}const $=rt(()=>g.value.find(T=>T.id===_.value)||null);function le(T){f.value=T,localStorage.setItem("hermes_provider_mode",T)}function me(T){p.value={...T},localStorage.setItem("hermes_custom_name",T.name),localStorage.setItem("hermes_custom_base_url",T.baseUrl),localStorage.setItem("hermes_custom_api_key",T.apiKey),localStorage.setItem("hermes_custom_model",T.model)}function Se(T){const I=n.value;I&&(I.messages.push({id:xa(),role:"user",content:T,timestamp:new Date().toISOString()}),I.messages.filter(V=>V.role==="user").length===1&&(I.title=Z6(I.messages)),I.updatedAt=new Date().toISOString(),D(),S(I.id))}function Ce(T){const I=n.value;I&&(I.messages.push({id:xa(),role:"system",content:T,timestamp:new Date().toISOString()}),D())}function Pe(){s.value=!0,r.value="",o.value=[],a.value=Date.now(),l.value=0,c.value=0}function Ke(T){r.value+=T,l.value||(l.value=Date.now())}function Qe(T,I){o.value.push({tool:T,input:I,status:"running",_startTime:Date.now()})}function Ge(T,I,V){if(o.value[T]){const Y=o.value[T];Y._startTime&&(c.value+=Date.now()-Y._startTime),o.value[T].output=I,o.value[T].status=V}}function ue(T,I,V,Y){const J=n.value;if(!J)return;const ae=Y||r.value;Y&&(r.value=Y),J.messages.push({id:xa(),role:"assistant",content:ae,timestamp:new Date().toISOString(),tool_calls:o.value.length>0?[...o.value]:void 0,token_usage:T,model:I,duration_ms:V,ttft_ms:l.value?l.value-a.value:void 0,tool_time_ms:c.value||void 0}),s.value=!1,r.value="",o.value=[],J.updatedAt=new Date().toISOString(),D(),S(J.id)}function j(){const T=n.value;T&&(T.messages=[],T.hermesSessionId=void 0,T.updatedAt=new Date().toISOString(),D())}function te(T){const I=n.value;I&&T>=0&&T<I.messages.length&&(I.messages.splice(T),I.updatedAt=new Date().toISOString(),D())}function fe(T){const I=n.value;I&&T&&(I.hermesSessionId=T,D())}function ge(){var T;return((T=n.value)==null?void 0:T.hermesSessionId)||""}const ye=rt(()=>[...t.value].sort((T,I)=>new Date(I.updatedAt).getTime()-new Date(T.updatedAt).getTime()));return{sessions:t,activeSessionId:e,currentSession:n,sortedSessions:ye,newSession:m,switchSession:h,deleteSession:v,renameSession:b,clearAllSessions:x,fetchServerSessions:C,messages:i,isStreaming:s,currentResponse:r,currentToolCalls:o,selectedModel:u,streamStartTime:a,firstTokenTime:l,streamToolTimeMs:c,blueprintRunId:d,providerMode:f,customProvider:p,getActiveConfig:P,setProviderMode:le,setCustomProvider:me,modelProfiles:g,activeModelId:_,activeModelProfile:$,addModelProfile:B,removeModelProfile:Z,updateModelProfile:G,switchModel:X,addUserMessage:Se,addSystemMessage:Ce,startAssistantResponse:Pe,appendToResponse:Ke,addToolCall:Qe,completeToolCall:Ge,finishResponse:ue,clearMessages:j,truncateMessages:te,setHermesSessionId:fe,getHermesSessionId:ge}}),J6=Zl("app",()=>{const t=Ee(!1),e=Ee(null),n=Ee(!1),i=Ee("chat"),s=Ee("disconnected"),r=Ee(null),o=Ee(""),a=localStorage.getItem("hermes_theme"),l=Ee(a||"system"),c=Ee(!1),u=rt(()=>r.value?r.value.hermes:null),d=rt(()=>{var b;if(!((b=r.value)!=null&&b.uptime))return"";const m=Math.floor(r.value.uptime),h=Math.floor(m/3600),v=Math.floor(m%3600/60);return h>0?`${h}h ${v}m`:`${v}m`});function f(){l.value==="system"?c.value=window.matchMedia("(prefers-color-scheme: dark)").matches:c.value=l.value==="dark",document.documentElement.setAttribute("data-theme",c.value?"dark":"light")}function p(m){l.value=m,localStorage.setItem("hermes_theme",m),f()}function g(){const m=c.value?"light":"dark";p(m),localStorage.setItem("hixns_theme_manual","1")}async function _(){s.value="connecting",o.value="";try{const m=await p0();m?(s.value="connected",r.value=m,t.value=!0):(s.value="disconnected",o.value="后端服务未响应")}catch(m){s.value="disconnected",o.value=(m==null?void 0:m.message)||"连接失败"}}return typeof window<"u"&&(window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>{l.value==="system"&&f()}),f()),{agentRunning:t,agentPort:e,sidebarCollapsed:n,currentView:i,themeMode:l,isDark:c,setTheme:p,toggleTheme:g,connectionState:s,agentStatus:r,connectionError:o,hermesStatus:u,uptimeText:d,checkConnection:_}}),Q6=Zl("blueprint",()=>{const t=Ee([]),e=Ee(null),n=Ee([]),i=Ee(null),s=Ee([]),r=Ee(!1),o=Ee(""),a=Ee([]);async function l(){try{const E=await vt("/v1/agent/skills");a.value=Array.isArray(E)?E:(E==null?void 0:E.skills)||(E==null?void 0:E.data)||[]}catch{}}async function c(){r.value=!0,o.value="";try{const E=await vt("/v1/agent/blueprints");t.value=Array.isArray(E)?E:(E==null?void 0:E.blueprints)||(E==null?void 0:E.data)||[]}catch(E){o.value=(E==null?void 0:E.message)||"Failed to fetch blueprints"}finally{r.value=!1}}async function u(E,P){r.value=!0,o.value="";try{const B=await ft("/v1/agent/blueprints",{name:E,description:P,nodes:[],edges:[]});return t.value.unshift(B),B}catch(B){return o.value=(B==null?void 0:B.message)||"Failed to create blueprint",null}finally{r.value=!1}}async function d(E,P){var B;r.value=!0,o.value="";try{const G=await(await An(`/v1/agent/blueprints/${E}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:E,...P})})).json(),X=t.value.findIndex($=>$.id===E);return X>=0&&(t.value[X]={...t.value[X],...G}),((B=e.value)==null?void 0:B.id)===E&&(e.value={...e.value,...G}),G}catch(Z){return o.value=(Z==null?void 0:Z.message)||"Failed to update blueprint",null}finally{r.value=!1}}async function f(E){var P;r.value=!0,o.value="";try{await An(`/v1/agent/blueprints/${E}`,{method:"DELETE"}),t.value=t.value.filter(B=>B.id!==E),((P=e.value)==null?void 0:P.id)===E&&(e.value=null)}catch(B){o.value=(B==null?void 0:B.message)||"Failed to delete blueprint"}finally{r.value=!1}}async function p(){r.value=!0,o.value="";try{const E=await vt("/v1/agent/runs");n.value=Array.isArray(E)?E:(E==null?void 0:E.runs)||(E==null?void 0:E.data)||[]}catch(E){o.value=(E==null?void 0:E.message)||"Failed to fetch runs"}finally{r.value=!1}}async function g(E){r.value=!0,o.value="";try{const P=await vt(`/v1/agent/blueprints/${E}/runs`);n.value=Array.isArray(P)?P:(P==null?void 0:P.runs)||(P==null?void 0:P.data)||[]}catch(P){o.value=(P==null?void 0:P.message)||"Failed to fetch runs"}finally{r.value=!1}}async function _(E){r.value=!0,o.value="";try{const B=await(await An(`/v1/agent/blueprints/${E}/runs`,{method:"POST",headers:{"Content-Type":"application/json"},body:"{}"})).json();return i.value=B,n.value.unshift(B),B}catch(P){return o.value=(P==null?void 0:P.message)||"Failed to run blueprint",null}finally{r.value=!1}}async function m(E){var P;r.value=!0,o.value="";try{await An(`/v1/agent/runs/${E}/cancel`,{method:"POST",headers:{"Content-Type":"application/json"},body:"{}"});const B=n.value.find(Z=>Z.id===E);B&&(B.status="cancelled"),((P=i.value)==null?void 0:P.id)===E&&(i.value.status="cancelled")}catch(B){o.value=(B==null?void 0:B.message)||"Failed to cancel run"}finally{r.value=!1}}async function h(){r.value=!0,o.value="";try{const E=await vt("/v1/agent/inbox");s.value=Array.isArray(E)?E:(E==null?void 0:E.items)||(E==null?void 0:E.data)||[]}catch(E){o.value=(E==null?void 0:E.message)||"Failed to fetch inbox"}finally{r.value=!1}}async function v(E){try{await ft(`/v1/agent/inbox/${E}/approve`,{});const P=s.value.find(B=>B.id===E);P&&(P.status="approved")}catch(P){o.value=(P==null?void 0:P.message)||"Failed to approve"}}async function b(E){try{await ft(`/v1/agent/inbox/${E}/reject`,{});const P=s.value.find(B=>B.id===E);P&&(P.status="rejected")}catch(P){o.value=(P==null?void 0:P.message)||"Failed to reject"}}async function x(E,P){try{await ft(`/v1/agent/inbox/${E}/reply`,{reply:P});const B=s.value.find(Z=>Z.id===E);B&&(B.status="approved")}catch(B){o.value=(B==null?void 0:B.message)||"Failed to reply"}}async function D(E){try{await ft(`/v1/agent/inbox/${E}/read`,{});const P=s.value.find(B=>B.id===E);P&&(P.status="read")}catch(P){o.value=(P==null?void 0:P.message)||"Failed to mark as read"}}async function C(E){try{const P=await ft("/v1/agent/inbox/create",E),B=(P==null?void 0:P.data)||P;return s.value.unshift(B),B}catch(P){return o.value=(P==null?void 0:P.message)||"Failed to create inbox item",null}}async function R(E){try{const B=await(await An(`/v1/agent/blueprints/${E}/export`)).blob(),Z=URL.createObjectURL(B),G=document.createElement("a");G.href=Z,G.download=`blueprint-${E}.json`,G.click(),URL.revokeObjectURL(Z)}catch(P){o.value=(P==null?void 0:P.message)||"Failed to export blueprint"}}async function S(E){r.value=!0,o.value="";try{const P=await E.text(),B=JSON.parse(P),Z=await ft("/v1/agent/blueprints/import",B),G=(Z==null?void 0:Z.data)||Z;return t.value.unshift(G),G}catch(P){return o.value=(P==null?void 0:P.message)||"Failed to import blueprint",null}finally{r.value=!1}}function M(E){e.value=E}function L(E){i.value=E}return{blueprints:t,currentBlueprint:e,runs:n,currentRun:i,inbox:s,loading:r,error:o,skills:a,fetchBlueprints:c,createBlueprint:u,updateBlueprint:d,deleteBlueprint:f,fetchAllRuns:p,fetchRuns:g,runBlueprint:_,cancelRun:m,fetchInbox:h,approveInbox:v,rejectInbox:b,replyInbox:x,markInboxRead:D,createInboxItem:C,exportBlueprint:R,importBlueprint:S,selectBlueprint:M,selectRun:L,fetchSkills:l}}),e3=["width","height"],t3=Vt({__name:"IconChat",props:{size:{default:24}},setup(t){return(e,n)=>(xe(),Ie("svg",{width:t.size,height:t.size,viewBox:"0 0 1024 1024",fill:"currentColor",xmlns:"http://www.w3.org/2000/svg"},[...n[0]||(n[0]=[H("path",{d:"M170.666667 85.333333C100.48 85.333333 42.666667 143.146667 42.666667 213.333333v694.826667c0 30.72 20.096 57.130667 45.013333 67.413333 24.874667 10.325333 57.856 5.973333 79.573333-15.744a42.666667 42.666667 0 0 0 0-0.085333l93.909334-93.909333A42.624 42.624 0 0 1 291.328 853.333333H853.333333c70.186667 0 128-57.813333 128-128V213.333333c0-70.186667-57.813333-128-128-128z m0 85.333334h682.666666c24.064 0 42.666667 18.602667 42.666667 42.666666v512c0 24.064-18.602667 42.666667-42.666667 42.666667H291.328c-33.92 0-66.517333 13.525333-90.496 37.504L128 878.336V213.333333c0-24.064 18.602667-42.666667 42.666667-42.666666z"},null,-1),H("path",{d:"M298.666667 426.666667a42.666667 42.666667 0 0 0-42.666667 42.666666 42.666667 42.666667 0 0 0 42.666667 42.666667h426.666666a42.666667 42.666667 0 0 0 42.666667-42.666667 42.666667 42.666667 0 0 0-42.666667-42.666666zM298.666667 597.333333a42.666667 42.666667 0 0 0-42.666667 42.666667 42.666667 42.666667 0 0 0 42.666667 42.666667h256a42.666667 42.666667 0 0 0 42.666666-42.666667 42.666667 42.666667 0 0 0-42.666666-42.666667zM298.666667 256a42.666667 42.666667 0 0 0-42.666667 42.666667 42.666667 42.666667 0 0 0 42.666667 42.666666h341.333333a42.666667 42.666667 0 0 0 42.666667-42.666666 42.666667 42.666667 0 0 0-42.666667-42.666667z"},null,-1)])],8,e3))}}),n3=["width","height"],i3=Vt({__name:"IconStore",props:{size:{default:24}},setup(t){return(e,n)=>(xe(),Ie("svg",{width:t.size,height:t.size,viewBox:"0 0 1024 1024",fill:"currentColor",xmlns:"http://www.w3.org/2000/svg"},[...n[0]||(n[0]=[H("path",{d:"M426.666667 597.333333c-46.634667 0-85.333333 38.698667-85.333334 85.333334v213.333333a42.666667 42.666667 0 0 0 42.666667 42.666667 42.666667 42.666667 0 0 0 42.666667-42.666667v-213.333333h170.666666v213.333333a42.666667 42.666667 0 0 0 42.666667 42.666667 42.666667 42.666667 0 0 0 42.666667-42.666667v-213.333333c0-46.634667-38.698667-85.333333-85.333334-85.333334zM298.666667 42.666667c-42.282667 0-81.92 20.992-105.770667 55.893333l-0.042667 0.085333-123.008 178.090667c-0.085333 0.085333-0.042667 0.170667-0.085333 0.256l-0.085333 0.085333c-48.64 69.461333-26.752 154.282667 24.832 198.741334 51.669333 44.544 139.093333 53.632 200.576-5.077334 2.304-2.176 4.778667-2.176 7.082666 0a42.666667 42.666667 0 0 0 0.085334 0 149.888 149.888 0 0 0 206.165333 0 42.666667 42.666667 0 0 0 0.085333 0c2.304-2.176 4.693333-2.176 6.997334 0a42.666667 42.666667 0 0 0 0.085333 0 149.973333 149.973333 0 0 0 206.165333 0c2.304-2.176 4.778667-2.176 7.082667 0a42.666667 42.666667 0 0 0 0.170667 0c61.44 58.709333 148.778667 49.792 200.533333 5.333334 51.712-44.501333 73.685333-129.578667 24.746667-199.168l0.213333 0.256L831.146667 98.56A128 128 0 0 0 725.333333 42.666667z m0 85.333333h426.666666c14.165333 0 27.306667 6.869333 35.242667 18.602667a42.666667 42.666667 0 0 0 0.170667 0.213333l123.52 178.858667a42.666667 42.666667 0 0 0 0.256 0.341333c25.301333 35.968 13.354667 64.682667-10.666667 85.333333-24.064 20.650667-54.272 28.16-86.016-2.261333a91.050667 91.050667 0 0 0-125.098667 0 63.402667 63.402667 0 0 1-88.234666-0.085333v0.085333a91.008 91.008 0 0 0-125.013334 0v-0.085333c-25.045333 23.893333-63.274667 23.893333-88.32 0v0.085333a91.050667 91.050667 0 0 0-125.098666 0c-31.744 30.208-61.952 22.784-85.888 2.133333-24.021333-20.650667-35.84-49.365333-10.538667-85.333333a42.666667 42.666667 0 0 0 0.170667-0.298667l123.264-178.602666a42.666667 42.666667 0 0 0 0.256-0.256A42.581333 42.581333 0 0 1 298.666667 128z"},null,-1),H("path",{d:"M170.666667 424.533333a42.666667 42.666667 0 0 0-42.666667 42.666667V810.666667c0 70.186667 57.813333 128 128 128h512c70.186667 0 128-57.813333 128-128v-343.466667a42.666667 42.666667 0 0 0-42.666667-42.666667 42.666667 42.666667 0 0 0-42.666666 42.666667V810.666667c0 24.064-18.602667 42.666667-42.666667 42.666666H256c-24.064 0-42.666667-18.602667-42.666667-42.666666v-343.466667a42.666667 42.666667 0 0 0-42.666666-42.666667z"},null,-1)])],8,n3))}}),s3=["width","height"],r3=Vt({__name:"IconSettings",props:{size:{default:24}},setup(t){return(e,n)=>(xe(),Ie("svg",{width:t.size,height:t.size,viewBox:"0 0 1024 1024",fill:"currentColor",xmlns:"http://www.w3.org/2000/svg"},[...n[0]||(n[0]=[H("path",{d:"M277.333333 105.6a42.666667 42.666667 0 0 0-15.573333 58.24l170.666667 295.68a42.666667 42.666667 0 0 0 58.24 15.658667 42.666667 42.666667 0 0 0 15.573333-58.325334l-170.666667-295.68A42.666667 42.666667 0 0 0 277.333333 105.6zM490.666667 548.821333a42.666667 42.666667 0 0 0-58.24 15.658667l-170.666667 295.68a42.666667 42.666667 0 0 0 15.573333 58.24 42.666667 42.666667 0 0 0 58.24-15.573333l170.666667-295.68a42.666667 42.666667 0 0 0-15.573333-58.325334zM512 810.666667a42.666667 42.666667 0 0 0-42.666667 42.666666v85.333334a42.666667 42.666667 0 0 0 42.666667 42.666666 42.666667 42.666667 0 0 0 42.666667-42.666666v-85.333334a42.666667 42.666667 0 0 0-42.666667-42.666666zM512 42.666667a42.666667 42.666667 0 0 0-42.666667 42.666666v85.333334a42.666667 42.666667 0 0 0 42.666667 42.666666 42.666667 42.666667 0 0 0 42.666667-42.666666V85.333333a42.666667 42.666667 0 0 0-42.666667-42.666666zM597.333333 469.333333a42.666667 42.666667 0 0 0-42.666666 42.666667 42.666667 42.666667 0 0 0 42.666666 42.666667h341.333334a42.666667 42.666667 0 0 0 42.666666-42.666667 42.666667 42.666667 0 0 0-42.666666-42.666667zM693.674667 766.506667a42.666667 42.666667 0 0 0-32.341334 4.266666 42.666667 42.666667 0 0 0-15.573333 58.24l42.666667 73.813334a42.666667 42.666667 0 0 0 58.24 15.573333 42.666667 42.666667 0 0 0 15.573333-58.24l-42.666667-73.813333a42.666667 42.666667 0 0 0-25.898666-19.84zM714.325333 101.248a42.666667 42.666667 0 0 0-25.898666 19.925333l-42.666667 73.813334a42.666667 42.666667 0 0 0 15.573333 58.282666 42.666667 42.666667 0 0 0 58.24-15.616l42.666667-73.813333a42.666667 42.666667 0 0 0-15.573333-58.24 42.666667 42.666667 0 0 0-32.341334-4.352zM85.333333 469.333333a42.666667 42.666667 0 0 0-42.666666 42.666667 42.666667 42.666667 0 0 0 42.666666 42.666667h85.333334a42.666667 42.666667 0 0 0 42.666666-42.666667 42.666667 42.666667 0 0 0-42.666666-42.666667zM796.672 641.408a42.666667 42.666667 0 0 0-25.941333 19.925333 42.666667 42.666667 0 0 0 15.616 58.24l73.813333 42.666667a42.666667 42.666667 0 0 0 58.24-15.573333 42.666667 42.666667 0 0 0-15.573333-58.24l-73.813334-42.666667a42.666667 42.666667 0 0 0-32.341333-4.352zM892.501333 257.408a42.666667 42.666667 0 0 0-32.341333 4.352l-73.813333 42.666667a42.666667 42.666667 0 0 0-15.616 58.24 42.666667 42.666667 0 0 0 58.282666 15.573333l73.813334-42.666667a42.666667 42.666667 0 0 0 15.573333-58.24 42.666667 42.666667 0 0 0-25.898667-19.925333zM194.986667 645.76l-73.813334 42.666667a42.666667 42.666667 0 0 0-15.573333 58.24 42.666667 42.666667 0 0 0 58.24 15.573333l73.813333-42.666667a42.666667 42.666667 0 0 0 15.616-58.24 42.666667 42.666667 0 0 0-58.282666-15.573333zM163.84 261.76a42.666667 42.666667 0 0 0-58.24 15.573333 42.666667 42.666667 0 0 0 15.573333 58.24l73.813334 42.666667A42.666667 42.666667 0 0 0 253.269333 362.666667a42.666667 42.666667 0 0 0-15.616-58.24z"},null,-1),H("path",{d:"M512 384c-70.186667 0-128 57.813333-128 128s57.813333 128 128 128 128-57.813333 128-128-57.813333-128-128-128z m0 85.333333c24.064 0 42.666667 18.602667 42.666667 42.666667 0 24.064-18.602667 42.666667-42.666667 42.666667-24.064 0-42.666667-18.602667-42.666667-42.666667 0-24.064 18.602667-42.666667 42.666667-42.666667z"},null,-1),H("path",{d:"M512 128c-211.584 0-384 172.416-384 384s172.416 384 384 384 384-172.416 384-384-172.416-384-384-384z m0 85.333333c165.461333 0 298.666667 133.205333 298.666667 298.666667s-133.205333 298.666667-298.666667 298.666667-298.666667-133.205333-298.666667-298.666667 133.205333-298.666667 298.666667-298.666667z"},null,-1)])],8,s3))}}),o3=["width","height"],a3=Vt({__name:"IconStar",props:{size:{default:24}},setup(t){return(e,n)=>(xe(),Ie("svg",{width:t.size,height:t.size,viewBox:"0 0 1024 1024",fill:"currentColor",xmlns:"http://www.w3.org/2000/svg"},[...n[0]||(n[0]=[H("path",{d:"M512 44.501333c-23.552 0-47.104 11.52-58.496 34.517334l-98.56 199.68a47.786667 47.786667 0 0 1-36.010667 26.154666l-220.16 32.128c-0.085333 0-0.042667 0.085333-0.085333 0.085334-50.986667 7.338667-73.258667 75.733333-36.181333 111.530666l159.317333 155.050667c11.349333 11.050667 16.426667 26.88 13.738667 42.453333l-37.546667 219.050667v0.085333c-8.832 50.730667 49.322667 93.013333 94.805333 68.949334l196.949334-103.594667a47.744 47.744 0 0 1 44.458666 0l196.864 103.509333c45.525333 24.234667 103.893333-18.176 94.890667-69.034666l-37.546667-219.050667a47.701333 47.701333 0 0 1 13.824-42.368l159.317334-155.221333a42.666667 42.666667 0 0 0 0.085333 0c36.778667-35.84 14.634667-103.936-36.181333-111.36h-0.085334l-220.330666-32.213334a47.786667 47.786667 0 0 1-35.968-26.197333l-98.56-199.68c-11.434667-22.954667-34.986667-34.474667-58.538667-34.474667z m0 108.757334l80.597333 163.157333a42.666667 42.666667 0 0 0 0 0.085333 133.248 133.248 0 0 0 100.053334 72.746667l180.352 26.453333-130.346667 126.805334a133.461333 133.461333 0 0 0-38.314667 117.930666l30.72 179.328-161.152-84.693333a133.290667 133.290667 0 0 0-123.818666 0 42.666667 42.666667 0 0 0-0.085334 0L288.853333 839.765333l30.762667-179.285333a133.418667 133.418667 0 0 0-38.314667-117.973333L150.997333 415.658667l180.266667-26.410667a133.333333 133.333333 0 0 0 100.266667-72.832z"},null,-1)])],8,o3))}}),l3=["width","height"],c3=Vt({__name:"IconSun",props:{size:{default:24}},setup(t){return(e,n)=>(xe(),Ie("svg",{width:t.size,height:t.size,viewBox:"0 0 1024 1024",fill:"currentColor",xmlns:"http://www.w3.org/2000/svg"},[...n[0]||(n[0]=[H("path",{d:"M512 298.666667c-117.333333 0-213.333333 96-213.333333 213.333333s96 213.333333 213.333333 213.333333 213.333333-96 213.333333-213.333333-96-213.333333-213.333333-213.333333z m0 85.333333c71.210667 0 128 56.789333 128 128s-56.789333 128-128 128-128-56.789333-128-128 56.789333-128 128-128zM512 42.666667a42.666667 42.666667 0 0 0-42.666667 42.666666v85.333334a42.666667 42.666667 0 0 0 42.666667 42.666666 42.666667 42.666667 0 0 0 42.666667-42.666666V85.333333a42.666667 42.666667 0 0 0-42.666667-42.666666zM512 810.666667a42.666667 42.666667 0 0 0-42.666667 42.666666v85.333334a42.666667 42.666667 0 0 0 42.666667 42.666666 42.666667 42.666667 0 0 0 42.666667-42.666666v-85.333334a42.666667 42.666667 0 0 0-42.666667-42.666666zM210.346667 167.68a42.666667 42.666667 0 0 0-30.165334 12.501333 42.666667 42.666667 0 0 0 0 60.330667l60.16 60.16a42.666667 42.666667 0 0 0 60.330667 0 42.666667 42.666667 0 0 0 0-60.330667l-60.16-60.16a42.666667 42.666667 0 0 0-30.165333-12.501333zM723.328 723.328a42.666667 42.666667 0 0 0 0 60.330667l60.16 60.16a42.666667 42.666667 0 0 0 60.330667 0 42.666667 42.666667 0 0 0 0-60.330667l-60.16-60.16a42.666667 42.666667 0 0 0-60.330667 0zM85.333333 469.333333a42.666667 42.666667 0 0 0-42.666666 42.666667 42.666667 42.666667 0 0 0 42.666666 42.666667h85.333334a42.666667 42.666667 0 0 0 42.666666-42.666667 42.666667 42.666667 0 0 0-42.666666-42.666667zM853.333333 469.333333a42.666667 42.666667 0 0 0-42.666666 42.666667 42.666667 42.666667 0 0 0 42.666666 42.666667h85.333334a42.666667 42.666667 0 0 0 42.666666-42.666667 42.666667 42.666667 0 0 0-42.666666-42.666667zM270.506667 710.826667a42.666667 42.666667 0 0 0-30.165334 12.501333l-60.16 60.16a42.666667 42.666667 0 0 0 0 60.330667 42.666667 42.666667 0 0 0 60.330667 0l60.16-60.16a42.666667 42.666667 0 0 0 0-60.330667 42.666667 42.666667 0 0 0-30.165333-12.501333zM783.488 180.181333l-60.16 60.16a42.666667 42.666667 0 0 0 0 60.330667 42.666667 42.666667 0 0 0 60.330667 0l60.16-60.16a42.666667 42.666667 0 0 0 0-60.330667 42.666667 42.666667 0 0 0-60.330667 0z"},null,-1)])],8,l3))}}),u3=["width","height"],f3=Vt({__name:"IconMoon",props:{size:{default:24}},setup(t){return(e,n)=>(xe(),Ie("svg",{width:t.size,height:t.size,viewBox:"0 0 1024 1024",fill:"currentColor",xmlns:"http://www.w3.org/2000/svg"},[...n[0]||(n[0]=[H("path",{d:"M488.832 86.016c-182.656 9.856-319.274667 127.104-375.338667 273.493333-56.021333 146.346667-32.597333 324.906667 96.768 454.229334 129.365333 129.365333 307.882667 152.832 454.229334 96.768 146.346667-56.064 263.594667-192.768 273.493333-375.338667v-0.085333-0.085334a42.666667 42.666667 0 0 0-0.085333-0.256c1.28-25.728-15.786667-49.621333-35.498667-59.008a66.133333 66.133333 0 0 0-63.914667 3.669334c-98.816 61.781333-198.656 35.242667-263.893333-29.994667-65.28-65.237333-91.861333-165.12-30.08-263.893333a66.133333 66.133333 0 0 0 3.669333-64c-9.472-19.797333-33.450667-36.906667-59.349333-35.498667z m-32.170667 92.629333c-54.613333 121.216-23.424 250.112 57.6 331.093334 80.981333 80.981333 209.792 112.256 331.008 57.685333-20.693333 128.597333-103.893333 222.208-211.285333 263.338667-117.888 45.141333-257.834667 28.16-363.392-77.354667-105.557333-105.514667-122.581333-245.504-77.44-363.392 41.130667-107.434667 134.826667-190.72 263.509333-211.370667z"},null,-1)])],8,u3))}}),d3=["width","height"],h3={id:"brand-g1",x1:"602.09",y1:"4.51",x2:"862.78",y2:"281.06",gradientUnits:"userSpaceOnUse"},p3={id:"brand-g2",x1:"704.31",y1:"30.08",x2:"704.31",y2:"247.87",gradientUnits:"userSpaceOnUse"},m3=["fill"],g3=["fill"],_3=["fill"],v3=["fill"],x3=["fill"],S3=["fill"],y3=["fill"],b3=["fill"],E3=Vt({__name:"IconBrandLogo",props:{width:{default:120},height:{default:24},dark:{type:Boolean,default:!1}},setup(t){const e=t,n=rt(()=>e.dark?"#FAFAFA":"#18181B");return(i,s)=>(xe(),Ie("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 1473.89 288.88",width:t.width,height:t.height},[H("defs",null,[H("linearGradient",h3,[t.dark?(xe(),Ie(wt,{key:0},[s[0]||(s[0]=wo('<stop offset=".21" stop-color="#fff"></stop><stop offset=".26" stop-color="#fbfbfb"></stop><stop offset=".3" stop-color="#f0f0f0"></stop><stop offset=".35" stop-color="#ddd"></stop><stop offset=".39" stop-color="#c3c3c3"></stop><stop offset=".44" stop-color="#a1a1a1"></stop><stop offset=".48" stop-color="#777"></stop><stop offset=".52" stop-color="#464646"></stop><stop offset=".56" stop-color="#0e0e0e"></stop><stop offset=".57" stop-color="#000"></stop><stop offset=".59" stop-color="#1e1e1e"></stop><stop offset=".64" stop-color="#616161"></stop><stop offset=".68" stop-color="#999"></stop><stop offset=".72" stop-color="#c5c5c5"></stop><stop offset=".75" stop-color="#e4e4e4"></stop><stop offset=".78" stop-color="#f8f8f8"></stop><stop offset=".8" stop-color="#fff"></stop>',17))],64)):(xe(),Ie(wt,{key:1},[s[1]||(s[1]=wo('<stop offset=".21" stop-color="#000"></stop><stop offset=".26" stop-color="#040404"></stop><stop offset=".3" stop-color="#0f0f0f"></stop><stop offset=".35" stop-color="#222"></stop><stop offset=".39" stop-color="#3c3c3c"></stop><stop offset=".44" stop-color="#5e5e5e"></stop><stop offset=".48" stop-color="#888"></stop><stop offset=".52" stop-color="#b9b9b9"></stop><stop offset=".56" stop-color="#f1f1f1"></stop><stop offset=".57" stop-color="#fff"></stop><stop offset=".59" stop-color="#e1e1e1"></stop><stop offset=".64" stop-color="#9e9e9e"></stop><stop offset=".68" stop-color="#666"></stop><stop offset=".72" stop-color="#3a3a3a"></stop><stop offset=".75" stop-color="#1b1b1b"></stop><stop offset=".78" stop-color="#070707"></stop><stop offset=".8" stop-color="#000"></stop>',17))],64))]),H("linearGradient",p3,[t.dark?(xe(),Ie(wt,{key:0},[s[2]||(s[2]=wo('<stop offset=".08" stop-color="#000"></stop><stop offset=".13" stop-color="#212121"></stop><stop offset=".22" stop-color="#545454"></stop><stop offset=".32" stop-color="#828282"></stop><stop offset=".42" stop-color="#a8a8a8"></stop><stop offset=".52" stop-color="#c8c8c8"></stop><stop offset=".62" stop-color="#e0e0e0"></stop><stop offset=".73" stop-color="#f1f1f1"></stop><stop offset=".85" stop-color="#fbfbfb"></stop><stop offset="1" stop-color="#fff"></stop>',10))],64)):(xe(),Ie(wt,{key:1},[s[3]||(s[3]=wo('<stop offset=".08" stop-color="#fff"></stop><stop offset=".13" stop-color="#dedede"></stop><stop offset=".22" stop-color="#ababab"></stop><stop offset=".32" stop-color="#7d7d7d"></stop><stop offset=".42" stop-color="#575757"></stop><stop offset=".52" stop-color="#373737"></stop><stop offset=".62" stop-color="#1f1f1f"></stop><stop offset=".73" stop-color="#0e0e0e"></stop><stop offset=".85" stop-color="#040404"></stop><stop offset="1" stop-color="#000"></stop>',10))],64))])]),H("path",{fill:n.value,d:"M189.49,280.93v-115.29H59.63v115.29H0V5.3h59.63v107.33h129.86V5.3h59.63v275.63s-59.63,0-59.63,0Z"},null,8,m3),H("circle",{fill:n.value,cx:"335.32",cy:"39.09",r:"33.13"},null,8,g3),H("rect",{fill:n.value,x:"305.56",y:"101.86",width:"59.52",height:"179.07"},null,8,_3),H("g",null,[H("polygon",{fill:n.value,points:"472.87 188.61 426.49 188.61 417.21 5.3 483.47 5.3 472.87 188.61"},null,8,v3),H("circle",{fill:n.value,cx:"450.34",cy:"249.12",r:"33.13"},null,8,x3)]),s[4]||(s[4]=H("path",{fill:"url(#brand-g1)",d:"M545.36,5.96l219.48,234.79c24.75,26.47,59.36,41.5,95.6,41.5h62.09l-227.02-242.23c-20.36-21.73-48.81-34.05-78.59-34.05h-71.57Z"},null,-1)),H("path",{fill:n.value,d:"M832.16,48.7c16.49-4.25,35.42-5.46,51.58-5.46l38.79-37.94h-59.81c-33.95,0-66.57,13.2-90.97,36.8l-129.21,124.99c27.2-20.07,50.76-37.46,71.32-52.03,46.73-33.11,80.19-56.55,118.29-66.36Z"},null,8,S3),s[5]||(s[5]=H("path",{fill:"url(#brand-g2)",d:"M832.16,48.7c-38.09,9.81-71.56,33.25-118.29,66.36-20.56,14.57-44.12,31.96-71.32,52.03l-73.39,71-44.28,42.84h64.01c33.21,0,65.1-13,88.84-36.22l10.94-10.7,195.06-190.77c-16.16,0-35.09,1.21-51.58,5.46Z"},null,-1)),H("path",{fill:n.value,d:"M1162.93,280.93l-135.8-186.84v186.84h-61.11V5.3h62.47l130.37,178.89V5.3h61.11v275.63h-57.04Z"},null,8,y3),H("path",{fill:n.value,d:"M1464.61,239.85c-6.63,10.6-14.58,19.88-25.18,27.83-10.6,7.95-22.53,13.25-37.1,15.9-14.58,3.98-29.15,5.3-45.05,5.3-14.58,0-27.83-1.33-39.75-3.98-11.93-2.65-22.53-6.63-31.8-10.6-9.28-3.98-17.23-9.28-23.85-14.58-6.63-5.3-11.93-10.6-17.23-15.9l34.45-39.75c2.65,2.65,5.3,6.63,10.6,11.93,5.3,3.98,10.6,9.28,17.23,13.25s14.58,7.95,22.53,10.6c7.95,2.65,17.23,3.98,25.18,3.98s14.58-1.33,21.2-2.65c6.63-1.33,11.93-3.98,17.23-6.63,5.3-2.65,9.28-6.63,11.93-10.6,2.65-3.98,3.98-9.28,3.98-15.9,0-9.28-5.3-18.55-15.9-23.85-10.6-6.63-26.5-11.93-47.7-14.58-18.55-2.65-34.45-7.95-47.7-13.25s-22.53-11.93-30.48-19.88c-7.95-7.95-13.25-15.9-15.9-25.18-2.65-9.28-3.98-18.55-3.98-27.83,0-10.6,2.65-21.2,7.95-31.8,5.3-10.6,11.93-19.88,22.53-26.5,9.28-7.95,21.2-13.25,34.45-18.55,13.25-5.3,27.83-6.63,43.73-6.63,14.58,0,26.5,1.33,38.43,3.98,11.93,2.65,21.2,5.3,30.48,9.28,9.28,3.98,15.9,7.95,22.53,13.25,6.63,5.3,11.93,9.28,17.23,14.58l-34.45,35.78c-3.98-3.98-7.95-7.95-13.25-11.93-5.3-3.98-10.6-6.63-17.23-9.28-6.63-2.65-13.25-5.3-19.88-6.63-6.63-1.33-13.25-2.65-19.88-2.65s-11.93,1.33-17.23,2.65c-5.3,1.33-10.6,3.98-14.58,6.63-3.98,2.65-7.95,6.63-10.6,10.6-2.65,3.98-3.98,9.28-3.98,15.9,0,9.28,3.98,15.9,13.25,21.2,9.28,5.3,22.53,9.28,41.08,11.93,15.9,2.65,30.48,6.63,43.73,10.6,13.25,3.98,23.85,9.28,33.13,17.23,9.28,6.63,15.9,15.9,21.2,25.18,5.3,9.28,7.95,22.53,7.95,35.78,0,10.6-2.65,23.85-9.28,35.78Z"},null,8,b3)],8,d3))}}),M3="/logo.svg";/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Md="184",T3=0,zp=1,A3=2,Za=1,w3=2,Ro=3,Is=0,Dn=1,Yi=2,Qi=0,Vr=1,Vp=2,Hp=3,Gp=4,C3=5,Zs=100,R3=101,P3=102,I3=103,L3=104,D3=200,N3=201,U3=202,O3=203,qu=204,Ku=205,F3=206,k3=207,B3=208,z3=209,V3=210,H3=211,G3=212,W3=213,$3=214,Yu=0,ju=1,Zu=2,Zr=3,Ju=4,Qu=5,ef=6,tf=7,S0=0,X3=1,q3=2,Ri=0,y0=1,b0=2,E0=3,M0=4,T0=5,A0=6,w0=7,C0=300,lr=301,Jr=302,Ic=303,Lc=304,ic=306,nf=1e3,Ji=1001,sf=1002,fn=1003,K3=1004,ya=1005,Sn=1006,Dc=1007,nr=1008,Yn=1009,R0=1010,P0=1011,Jo=1012,Td=1013,Di=1014,Mi=1015,rs=1016,Ad=1017,wd=1018,Qo=1020,I0=35902,L0=35899,D0=1021,N0=1022,ii=1023,os=1026,ir=1027,U0=1028,Cd=1029,cr=1030,Rd=1031,Pd=1033,Ja=33776,Qa=33777,el=33778,tl=33779,rf=35840,of=35841,af=35842,lf=35843,cf=36196,uf=37492,ff=37496,df=37488,hf=37489,El=37490,pf=37491,mf=37808,gf=37809,_f=37810,vf=37811,xf=37812,Sf=37813,yf=37814,bf=37815,Ef=37816,Mf=37817,Tf=37818,Af=37819,wf=37820,Cf=37821,Rf=36492,Pf=36494,If=36495,Lf=36283,Df=36284,Ml=36285,Nf=36286,Y3=3200,Wp=0,j3=1,ws="",kn="srgb",Tl="srgb-linear",Al="linear",Tt="srgb",_r=7680,$p=519,Z3=512,J3=513,Q3=514,Id=515,eT=516,tT=517,Ld=518,nT=519,Xp=35044,qp="300 es",Ti=2e3,wl=2001;function iT(t){for(let e=t.length-1;e>=0;--e)if(t[e]>=65535)return!0;return!1}function Cl(t){return document.createElementNS("http://www.w3.org/1999/xhtml",t)}function sT(){const t=Cl("canvas");return t.style.display="block",t}const Kp={};function Yp(...t){const e="THREE."+t.shift();console.log(e,...t)}function O0(t){const e=t[0];if(typeof e=="string"&&e.startsWith("TSL:")){const n=t[1];n&&n.isStackTrace?t[0]+=" "+n.getLocation():t[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return t}function je(...t){t=O0(t);const e="THREE."+t.shift();{const n=t[0];n&&n.isStackTrace?console.warn(n.getError(e)):console.warn(e,...t)}}function pt(...t){t=O0(t);const e="THREE."+t.shift();{const n=t[0];n&&n.isStackTrace?console.error(n.getError(e)):console.error(e,...t)}}function Uf(...t){const e=t.join(" ");e in Kp||(Kp[e]=!0,je(...t))}function rT(t,e,n){return new Promise(function(i,s){function r(){switch(t.clientWaitSync(e,t.SYNC_FLUSH_COMMANDS_BIT,0)){case t.WAIT_FAILED:s();break;case t.TIMEOUT_EXPIRED:setTimeout(r,n);break;default:i()}}setTimeout(r,n)})}const oT={[Yu]:ju,[Zu]:ef,[Ju]:tf,[Zr]:Qu,[ju]:Yu,[ef]:Zu,[tf]:Ju,[Qu]:Zr};class dr{addEventListener(e,n){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(n)===-1&&i[e].push(n)}hasEventListener(e,n){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(n)!==-1}removeEventListener(e,n){const i=this._listeners;if(i===void 0)return;const s=i[e];if(s!==void 0){const r=s.indexOf(n);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const n=this._listeners;if(n===void 0)return;const i=n[e.type];if(i!==void 0){e.target=this;const s=i.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}}const hn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Nc=Math.PI/180,Of=180/Math.PI;function ra(){const t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(hn[t&255]+hn[t>>8&255]+hn[t>>16&255]+hn[t>>24&255]+"-"+hn[e&255]+hn[e>>8&255]+"-"+hn[e>>16&15|64]+hn[e>>24&255]+"-"+hn[n&63|128]+hn[n>>8&255]+"-"+hn[n>>16&255]+hn[n>>24&255]+hn[i&255]+hn[i>>8&255]+hn[i>>16&255]+hn[i>>24&255]).toLowerCase()}function ut(t,e,n){return Math.max(e,Math.min(n,t))}function aT(t,e){return(t%e+e)%e}function Uc(t,e,n){return(1-n)*t+n*e}function _o(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return t/4294967295;case Uint16Array:return t/65535;case Uint8Array:return t/255;case Int32Array:return Math.max(t/2147483647,-1);case Int16Array:return Math.max(t/32767,-1);case Int8Array:return Math.max(t/127,-1);default:throw new Error("Invalid component type.")}}function In(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return Math.round(t*4294967295);case Uint16Array:return Math.round(t*65535);case Uint8Array:return Math.round(t*255);case Int32Array:return Math.round(t*2147483647);case Int16Array:return Math.round(t*32767);case Int8Array:return Math.round(t*127);default:throw new Error("Invalid component type.")}}const Bd=class Bd{constructor(e=0,n=0){this.x=e,this.y=n}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,n){return this.x=e,this.y=n,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const n=this.x,i=this.y,s=e.elements;return this.x=s[0]*n+s[3]*i+s[6],this.y=s[1]*n+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,n){return this.x=ut(this.x,e.x,n.x),this.y=ut(this.y,e.y,n.y),this}clampScalar(e,n){return this.x=ut(this.x,e,n),this.y=ut(this.y,e,n),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ut(i,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(ut(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y;return n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this}rotateAround(e,n){const i=Math.cos(n),s=Math.sin(n),r=this.x-e.x,o=this.y-e.y;return this.x=r*i-o*s+e.x,this.y=r*s+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Bd.prototype.isVector2=!0;let mt=Bd;class oo{constructor(e=0,n=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=n,this._z=i,this._w=s}static slerpFlat(e,n,i,s,r,o,a){let l=i[s+0],c=i[s+1],u=i[s+2],d=i[s+3],f=r[o+0],p=r[o+1],g=r[o+2],_=r[o+3];if(d!==_||l!==f||c!==p||u!==g){let m=l*f+c*p+u*g+d*_;m<0&&(f=-f,p=-p,g=-g,_=-_,m=-m);let h=1-a;if(m<.9995){const v=Math.acos(m),b=Math.sin(v);h=Math.sin(h*v)/b,a=Math.sin(a*v)/b,l=l*h+f*a,c=c*h+p*a,u=u*h+g*a,d=d*h+_*a}else{l=l*h+f*a,c=c*h+p*a,u=u*h+g*a,d=d*h+_*a;const v=1/Math.sqrt(l*l+c*c+u*u+d*d);l*=v,c*=v,u*=v,d*=v}}e[n]=l,e[n+1]=c,e[n+2]=u,e[n+3]=d}static multiplyQuaternionsFlat(e,n,i,s,r,o){const a=i[s],l=i[s+1],c=i[s+2],u=i[s+3],d=r[o],f=r[o+1],p=r[o+2],g=r[o+3];return e[n]=a*g+u*d+l*p-c*f,e[n+1]=l*g+u*f+c*d-a*p,e[n+2]=c*g+u*p+a*f-l*d,e[n+3]=u*g-a*d-l*f-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,n,i,s){return this._x=e,this._y=n,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,n=!0){const i=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(i/2),u=a(s/2),d=a(r/2),f=l(i/2),p=l(s/2),g=l(r/2);switch(o){case"XYZ":this._x=f*u*d+c*p*g,this._y=c*p*d-f*u*g,this._z=c*u*g+f*p*d,this._w=c*u*d-f*p*g;break;case"YXZ":this._x=f*u*d+c*p*g,this._y=c*p*d-f*u*g,this._z=c*u*g-f*p*d,this._w=c*u*d+f*p*g;break;case"ZXY":this._x=f*u*d-c*p*g,this._y=c*p*d+f*u*g,this._z=c*u*g+f*p*d,this._w=c*u*d-f*p*g;break;case"ZYX":this._x=f*u*d-c*p*g,this._y=c*p*d+f*u*g,this._z=c*u*g-f*p*d,this._w=c*u*d+f*p*g;break;case"YZX":this._x=f*u*d+c*p*g,this._y=c*p*d+f*u*g,this._z=c*u*g-f*p*d,this._w=c*u*d-f*p*g;break;case"XZY":this._x=f*u*d-c*p*g,this._y=c*p*d-f*u*g,this._z=c*u*g+f*p*d,this._w=c*u*d+f*p*g;break;default:je("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return n===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,n){const i=n/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const n=e.elements,i=n[0],s=n[4],r=n[8],o=n[1],a=n[5],l=n[9],c=n[2],u=n[6],d=n[10],f=i+a+d;if(f>0){const p=.5/Math.sqrt(f+1);this._w=.25/p,this._x=(u-l)*p,this._y=(r-c)*p,this._z=(o-s)*p}else if(i>a&&i>d){const p=2*Math.sqrt(1+i-a-d);this._w=(u-l)/p,this._x=.25*p,this._y=(s+o)/p,this._z=(r+c)/p}else if(a>d){const p=2*Math.sqrt(1+a-i-d);this._w=(r-c)/p,this._x=(s+o)/p,this._y=.25*p,this._z=(l+u)/p}else{const p=2*Math.sqrt(1+d-i-a);this._w=(o-s)/p,this._x=(r+c)/p,this._y=(l+u)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,n){let i=e.dot(n)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*n.z-e.z*n.y,this._y=e.z*n.x-e.x*n.z,this._z=e.x*n.y-e.y*n.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(ut(this.dot(e),-1,1)))}rotateTowards(e,n){const i=this.angleTo(e);if(i===0)return this;const s=Math.min(1,n/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,n){const i=e._x,s=e._y,r=e._z,o=e._w,a=n._x,l=n._y,c=n._z,u=n._w;return this._x=i*u+o*a+s*c-r*l,this._y=s*u+o*l+r*a-i*c,this._z=r*u+o*c+i*l-s*a,this._w=o*u-i*a-s*l-r*c,this._onChangeCallback(),this}slerp(e,n){let i=e._x,s=e._y,r=e._z,o=e._w,a=this.dot(e);a<0&&(i=-i,s=-s,r=-r,o=-o,a=-a);let l=1-n;if(a<.9995){const c=Math.acos(a),u=Math.sin(c);l=Math.sin(l*c)/u,n=Math.sin(n*c)/u,this._x=this._x*l+i*n,this._y=this._y*l+s*n,this._z=this._z*l+r*n,this._w=this._w*l+o*n,this._onChangeCallback()}else this._x=this._x*l+i*n,this._y=this._y*l+s*n,this._z=this._z*l+r*n,this._w=this._w*l+o*n,this.normalize();return this}slerpQuaternions(e,n,i){return this.copy(e).slerp(n,i)}random(){const e=2*Math.PI*Math.random(),n=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(n),r*Math.cos(n))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,n=0){return this._x=e[n],this._y=e[n+1],this._z=e[n+2],this._w=e[n+3],this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._w,e}fromBufferAttribute(e,n){return this._x=e.getX(n),this._y=e.getY(n),this._z=e.getZ(n),this._w=e.getW(n),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const zd=class zd{constructor(e=0,n=0,i=0){this.x=e,this.y=n,this.z=i}set(e,n,i){return i===void 0&&(i=this.z),this.x=e,this.y=n,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,n){return this.x=e.x*n.x,this.y=e.y*n.y,this.z=e.z*n.z,this}applyEuler(e){return this.applyQuaternion(jp.setFromEuler(e))}applyAxisAngle(e,n){return this.applyQuaternion(jp.setFromAxisAngle(e,n))}applyMatrix3(e){const n=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*n+r[3]*i+r[6]*s,this.y=r[1]*n+r[4]*i+r[7]*s,this.z=r[2]*n+r[5]*i+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const n=this.x,i=this.y,s=this.z,r=e.elements,o=1/(r[3]*n+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*n+r[4]*i+r[8]*s+r[12])*o,this.y=(r[1]*n+r[5]*i+r[9]*s+r[13])*o,this.z=(r[2]*n+r[6]*i+r[10]*s+r[14])*o,this}applyQuaternion(e){const n=this.x,i=this.y,s=this.z,r=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*s-a*i),u=2*(a*n-r*s),d=2*(r*i-o*n);return this.x=n+l*c+o*d-a*u,this.y=i+l*u+a*c-r*d,this.z=s+l*d+r*u-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const n=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*n+r[4]*i+r[8]*s,this.y=r[1]*n+r[5]*i+r[9]*s,this.z=r[2]*n+r[6]*i+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,n){return this.x=ut(this.x,e.x,n.x),this.y=ut(this.y,e.y,n.y),this.z=ut(this.z,e.z,n.z),this}clampScalar(e,n){return this.x=ut(this.x,e,n),this.y=ut(this.y,e,n),this.z=ut(this.z,e,n),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ut(i,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,n){const i=e.x,s=e.y,r=e.z,o=n.x,a=n.y,l=n.z;return this.x=s*l-r*a,this.y=r*o-i*l,this.z=i*a-s*o,this}projectOnVector(e){const n=e.lengthSq();if(n===0)return this.set(0,0,0);const i=e.dot(this)/n;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Oc.copy(this).projectOnVector(e),this.sub(Oc)}reflect(e){return this.sub(Oc.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(ut(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return n*n+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,n,i){const s=Math.sin(n)*e;return this.x=s*Math.sin(i),this.y=Math.cos(n)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,n,i){return this.x=e*Math.sin(n),this.y=i,this.z=e*Math.cos(n),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this}setFromMatrixScale(e){const n=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=n,this.y=i,this.z=s,this}setFromMatrixColumn(e,n){return this.fromArray(e.elements,n*4)}setFromMatrix3Column(e,n){return this.fromArray(e.elements,n*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,n=Math.random()*2-1,i=Math.sqrt(1-n*n);return this.x=i*Math.cos(e),this.y=n,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};zd.prototype.isVector3=!0;let se=zd;const Oc=new se,jp=new oo,Vd=class Vd{constructor(e,n,i,s,r,o,a,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,n,i,s,r,o,a,l,c)}set(e,n,i,s,r,o,a,l,c){const u=this.elements;return u[0]=e,u[1]=s,u[2]=a,u[3]=n,u[4]=r,u[5]=l,u[6]=i,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],this}extractBasis(e,n,i){return e.setFromMatrix3Column(this,0),n.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const n=e.elements;return this.set(n[0],n[4],n[8],n[1],n[5],n[9],n[2],n[6],n[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,s=n.elements,r=this.elements,o=i[0],a=i[3],l=i[6],c=i[1],u=i[4],d=i[7],f=i[2],p=i[5],g=i[8],_=s[0],m=s[3],h=s[6],v=s[1],b=s[4],x=s[7],D=s[2],C=s[5],R=s[8];return r[0]=o*_+a*v+l*D,r[3]=o*m+a*b+l*C,r[6]=o*h+a*x+l*R,r[1]=c*_+u*v+d*D,r[4]=c*m+u*b+d*C,r[7]=c*h+u*x+d*R,r[2]=f*_+p*v+g*D,r[5]=f*m+p*b+g*C,r[8]=f*h+p*x+g*R,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[3]*=e,n[6]*=e,n[1]*=e,n[4]*=e,n[7]*=e,n[2]*=e,n[5]*=e,n[8]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8];return n*o*u-n*a*c-i*r*u+i*a*l+s*r*c-s*o*l}invert(){const e=this.elements,n=e[0],i=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],d=u*o-a*c,f=a*l-u*r,p=c*r-o*l,g=n*d+i*f+s*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return e[0]=d*_,e[1]=(s*c-u*i)*_,e[2]=(a*i-s*o)*_,e[3]=f*_,e[4]=(u*n-s*l)*_,e[5]=(s*r-a*n)*_,e[6]=p*_,e[7]=(i*l-c*n)*_,e[8]=(o*n-i*r)*_,this}transpose(){let e;const n=this.elements;return e=n[1],n[1]=n[3],n[3]=e,e=n[2],n[2]=n[6],n[6]=e,e=n[5],n[5]=n[7],n[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const n=this.elements;return e[0]=n[0],e[1]=n[3],e[2]=n[6],e[3]=n[1],e[4]=n[4],e[5]=n[7],e[6]=n[2],e[7]=n[5],e[8]=n[8],this}setUvTransform(e,n,i,s,r,o,a){const l=Math.cos(r),c=Math.sin(r);return this.set(i*l,i*c,-i*(l*o+c*a)+o+e,-s*c,s*l,-s*(-c*o+l*a)+a+n,0,0,1),this}scale(e,n){return this.premultiply(Fc.makeScale(e,n)),this}rotate(e){return this.premultiply(Fc.makeRotation(-e)),this}translate(e,n){return this.premultiply(Fc.makeTranslation(e,n)),this}makeTranslation(e,n){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,n,0,0,1),this}makeRotation(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,i,n,0,0,0,1),this}makeScale(e,n){return this.set(e,0,0,0,n,0,0,0,1),this}equals(e){const n=this.elements,i=e.elements;for(let s=0;s<9;s++)if(n[s]!==i[s])return!1;return!0}fromArray(e,n=0){for(let i=0;i<9;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}};Vd.prototype.isMatrix3=!0;let tt=Vd;const Fc=new tt,Zp=new tt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Jp=new tt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function lT(){const t={enabled:!0,workingColorSpace:Tl,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===Tt&&(s.r=es(s.r),s.g=es(s.g),s.b=es(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===Tt&&(s.r=Hr(s.r),s.g=Hr(s.g),s.b=Hr(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===ws?Al:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Uf("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),t.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Uf("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),t.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],i=[.3127,.329];return t.define({[Tl]:{primaries:e,whitePoint:i,transfer:Al,toXYZ:Zp,fromXYZ:Jp,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:kn},outputColorSpaceConfig:{drawingBufferColorSpace:kn}},[kn]:{primaries:e,whitePoint:i,transfer:Tt,toXYZ:Zp,fromXYZ:Jp,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:kn}}}),t}const ct=lT();function es(t){return t<.04045?t*.0773993808:Math.pow(t*.9478672986+.0521327014,2.4)}function Hr(t){return t<.0031308?t*12.92:1.055*Math.pow(t,.41666)-.055}let vr;class cT{static getDataURL(e,n="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{vr===void 0&&(vr=Cl("canvas")),vr.width=e.width,vr.height=e.height;const s=vr.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=vr}return i.toDataURL(n)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const n=Cl("canvas");n.width=e.width,n.height=e.height;const i=n.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const s=i.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=es(r[o]/255)*255;return i.putImageData(s,0,0),n}else if(e.data){const n=e.data.slice(0);for(let i=0;i<n.length;i++)n instanceof Uint8Array||n instanceof Uint8ClampedArray?n[i]=Math.floor(es(n[i]/255)*255):n[i]=es(n[i]);return{data:n,width:e.width,height:e.height}}else return je("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let uT=0;class Dd{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:uT++}),this.uuid=ra(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const n=this.data;return typeof HTMLVideoElement<"u"&&n instanceof HTMLVideoElement?e.set(n.videoWidth,n.videoHeight,0):typeof VideoFrame<"u"&&n instanceof VideoFrame?e.set(n.displayWidth,n.displayHeight,0):n!==null?e.set(n.width,n.height,n.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(kc(s[o].image)):r.push(kc(s[o]))}else r=kc(s);i.url=r}return n||(e.images[this.uuid]=i),i}}function kc(t){return typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap?cT.getDataURL(t):t.data?{data:Array.from(t.data),width:t.width,height:t.height,type:t.data.constructor.name}:(je("Texture: Unable to serialize Texture."),{})}let fT=0;const Bc=new se;class Pn extends dr{constructor(e=Pn.DEFAULT_IMAGE,n=Pn.DEFAULT_MAPPING,i=Ji,s=Ji,r=Sn,o=nr,a=ii,l=Yn,c=Pn.DEFAULT_ANISOTROPY,u=ws){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:fT++}),this.uuid=ra(),this.name="",this.source=new Dd(e),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new mt(0,0),this.repeat=new mt(1,1),this.center=new mt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new tt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Bc).x}get height(){return this.source.getSize(Bc).y}get depth(){return this.source.getSize(Bc).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const n in e){const i=e[n];if(i===void 0){je(`Texture.setValues(): parameter '${n}' has value of undefined.`);continue}const s=this[n];if(s===void 0){je(`Texture.setValues(): property '${n}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[n]=i}}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),n||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==C0)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case nf:e.x=e.x-Math.floor(e.x);break;case Ji:e.x=e.x<0?0:1;break;case sf:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case nf:e.y=e.y-Math.floor(e.y);break;case Ji:e.y=e.y<0?0:1;break;case sf:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Pn.DEFAULT_IMAGE=null;Pn.DEFAULT_MAPPING=C0;Pn.DEFAULT_ANISOTROPY=1;const Hd=class Hd{constructor(e=0,n=0,i=0,s=1){this.x=e,this.y=n,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,n,i,s){return this.x=e,this.y=n,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;case 3:this.w=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this.w=e.w+n.w,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this.w+=e.w*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this.w=e.w-n.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const n=this.x,i=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*n+o[4]*i+o[8]*s+o[12]*r,this.y=o[1]*n+o[5]*i+o[9]*s+o[13]*r,this.z=o[2]*n+o[6]*i+o[10]*s+o[14]*r,this.w=o[3]*n+o[7]*i+o[11]*s+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const n=Math.sqrt(1-e.w*e.w);return n<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/n,this.y=e.y/n,this.z=e.z/n),this}setAxisAngleFromRotationMatrix(e){let n,i,s,r;const l=e.elements,c=l[0],u=l[4],d=l[8],f=l[1],p=l[5],g=l[9],_=l[2],m=l[6],h=l[10];if(Math.abs(u-f)<.01&&Math.abs(d-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+f)<.1&&Math.abs(d+_)<.1&&Math.abs(g+m)<.1&&Math.abs(c+p+h-3)<.1)return this.set(1,0,0,0),this;n=Math.PI;const b=(c+1)/2,x=(p+1)/2,D=(h+1)/2,C=(u+f)/4,R=(d+_)/4,S=(g+m)/4;return b>x&&b>D?b<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(b),s=C/i,r=R/i):x>D?x<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(x),i=C/s,r=S/s):D<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(D),i=R/r,s=S/r),this.set(i,s,r,n),this}let v=Math.sqrt((m-g)*(m-g)+(d-_)*(d-_)+(f-u)*(f-u));return Math.abs(v)<.001&&(v=1),this.x=(m-g)/v,this.y=(d-_)/v,this.z=(f-u)/v,this.w=Math.acos((c+p+h-1)/2),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this.w=n[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,n){return this.x=ut(this.x,e.x,n.x),this.y=ut(this.y,e.y,n.y),this.z=ut(this.z,e.z,n.z),this.w=ut(this.w,e.w,n.w),this}clampScalar(e,n){return this.x=ut(this.x,e,n),this.y=ut(this.y,e,n),this.z=ut(this.z,e,n),this.w=ut(this.w,e,n),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ut(i,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this.w+=(e.w-this.w)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this.w=e.w+(n.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this.w=e[n+3],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e[n+3]=this.w,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this.w=e.getW(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Hd.prototype.isVector4=!0;let Yt=Hd;class dT extends dr{constructor(e=1,n=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Sn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=n,this.depth=i.depth,this.scissor=new Yt(0,0,e,n),this.scissorTest=!1,this.viewport=new Yt(0,0,e,n),this.textures=[];const s={width:e,height:n,depth:i.depth},r=new Pn(s),o=i.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){const n={minFilter:Sn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(n.mapping=e.mapping),e.wrapS!==void 0&&(n.wrapS=e.wrapS),e.wrapT!==void 0&&(n.wrapT=e.wrapT),e.wrapR!==void 0&&(n.wrapR=e.wrapR),e.magFilter!==void 0&&(n.magFilter=e.magFilter),e.minFilter!==void 0&&(n.minFilter=e.minFilter),e.format!==void 0&&(n.format=e.format),e.type!==void 0&&(n.type=e.type),e.anisotropy!==void 0&&(n.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(n.colorSpace=e.colorSpace),e.flipY!==void 0&&(n.flipY=e.flipY),e.generateMipmaps!==void 0&&(n.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(n.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(n)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,n,i=1){if(this.width!==e||this.height!==n||this.depth!==i){this.width=e,this.height=n,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=n,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,n),this.scissor.set(0,0,e,n)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,i=e.textures.length;n<i;n++){this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0,this.textures[n].renderTarget=this;const s=Object.assign({},e.textures[n].image);this.textures[n].source=new Dd(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Pi extends dT{constructor(e=1,n=1,i={}){super(e,n,i),this.isWebGLRenderTarget=!0}}class F0 extends Pn{constructor(e=null,n=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:n,height:i,depth:s},this.magFilter=fn,this.minFilter=fn,this.wrapR=Ji,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class hT extends Pn{constructor(e=null,n=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:n,height:i,depth:s},this.magFilter=fn,this.minFilter=fn,this.wrapR=Ji,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Pl=class Pl{constructor(e,n,i,s,r,o,a,l,c,u,d,f,p,g,_,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,n,i,s,r,o,a,l,c,u,d,f,p,g,_,m)}set(e,n,i,s,r,o,a,l,c,u,d,f,p,g,_,m){const h=this.elements;return h[0]=e,h[4]=n,h[8]=i,h[12]=s,h[1]=r,h[5]=o,h[9]=a,h[13]=l,h[2]=c,h[6]=u,h[10]=d,h[14]=f,h[3]=p,h[7]=g,h[11]=_,h[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Pl().fromArray(this.elements)}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],n[9]=i[9],n[10]=i[10],n[11]=i[11],n[12]=i[12],n[13]=i[13],n[14]=i[14],n[15]=i[15],this}copyPosition(e){const n=this.elements,i=e.elements;return n[12]=i[12],n[13]=i[13],n[14]=i[14],this}setFromMatrix3(e){const n=e.elements;return this.set(n[0],n[3],n[6],0,n[1],n[4],n[7],0,n[2],n[5],n[8],0,0,0,0,1),this}extractBasis(e,n,i){return this.determinant()===0?(e.set(1,0,0),n.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),n.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,n,i){return this.set(e.x,n.x,i.x,0,e.y,n.y,i.y,0,e.z,n.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinant()===0)return this.identity();const n=this.elements,i=e.elements,s=1/xr.setFromMatrixColumn(e,0).length(),r=1/xr.setFromMatrixColumn(e,1).length(),o=1/xr.setFromMatrixColumn(e,2).length();return n[0]=i[0]*s,n[1]=i[1]*s,n[2]=i[2]*s,n[3]=0,n[4]=i[4]*r,n[5]=i[5]*r,n[6]=i[6]*r,n[7]=0,n[8]=i[8]*o,n[9]=i[9]*o,n[10]=i[10]*o,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromEuler(e){const n=this.elements,i=e.x,s=e.y,r=e.z,o=Math.cos(i),a=Math.sin(i),l=Math.cos(s),c=Math.sin(s),u=Math.cos(r),d=Math.sin(r);if(e.order==="XYZ"){const f=o*u,p=o*d,g=a*u,_=a*d;n[0]=l*u,n[4]=-l*d,n[8]=c,n[1]=p+g*c,n[5]=f-_*c,n[9]=-a*l,n[2]=_-f*c,n[6]=g+p*c,n[10]=o*l}else if(e.order==="YXZ"){const f=l*u,p=l*d,g=c*u,_=c*d;n[0]=f+_*a,n[4]=g*a-p,n[8]=o*c,n[1]=o*d,n[5]=o*u,n[9]=-a,n[2]=p*a-g,n[6]=_+f*a,n[10]=o*l}else if(e.order==="ZXY"){const f=l*u,p=l*d,g=c*u,_=c*d;n[0]=f-_*a,n[4]=-o*d,n[8]=g+p*a,n[1]=p+g*a,n[5]=o*u,n[9]=_-f*a,n[2]=-o*c,n[6]=a,n[10]=o*l}else if(e.order==="ZYX"){const f=o*u,p=o*d,g=a*u,_=a*d;n[0]=l*u,n[4]=g*c-p,n[8]=f*c+_,n[1]=l*d,n[5]=_*c+f,n[9]=p*c-g,n[2]=-c,n[6]=a*l,n[10]=o*l}else if(e.order==="YZX"){const f=o*l,p=o*c,g=a*l,_=a*c;n[0]=l*u,n[4]=_-f*d,n[8]=g*d+p,n[1]=d,n[5]=o*u,n[9]=-a*u,n[2]=-c*u,n[6]=p*d+g,n[10]=f-_*d}else if(e.order==="XZY"){const f=o*l,p=o*c,g=a*l,_=a*c;n[0]=l*u,n[4]=-d,n[8]=c*u,n[1]=f*d+_,n[5]=o*u,n[9]=p*d-g,n[2]=g*d-p,n[6]=a*u,n[10]=_*d+f}return n[3]=0,n[7]=0,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromQuaternion(e){return this.compose(pT,e,mT)}lookAt(e,n,i){const s=this.elements;return On.subVectors(e,n),On.lengthSq()===0&&(On.z=1),On.normalize(),ps.crossVectors(i,On),ps.lengthSq()===0&&(Math.abs(i.z)===1?On.x+=1e-4:On.z+=1e-4,On.normalize(),ps.crossVectors(i,On)),ps.normalize(),ba.crossVectors(On,ps),s[0]=ps.x,s[4]=ba.x,s[8]=On.x,s[1]=ps.y,s[5]=ba.y,s[9]=On.y,s[2]=ps.z,s[6]=ba.z,s[10]=On.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,s=n.elements,r=this.elements,o=i[0],a=i[4],l=i[8],c=i[12],u=i[1],d=i[5],f=i[9],p=i[13],g=i[2],_=i[6],m=i[10],h=i[14],v=i[3],b=i[7],x=i[11],D=i[15],C=s[0],R=s[4],S=s[8],M=s[12],L=s[1],E=s[5],P=s[9],B=s[13],Z=s[2],G=s[6],X=s[10],$=s[14],le=s[3],me=s[7],Se=s[11],Ce=s[15];return r[0]=o*C+a*L+l*Z+c*le,r[4]=o*R+a*E+l*G+c*me,r[8]=o*S+a*P+l*X+c*Se,r[12]=o*M+a*B+l*$+c*Ce,r[1]=u*C+d*L+f*Z+p*le,r[5]=u*R+d*E+f*G+p*me,r[9]=u*S+d*P+f*X+p*Se,r[13]=u*M+d*B+f*$+p*Ce,r[2]=g*C+_*L+m*Z+h*le,r[6]=g*R+_*E+m*G+h*me,r[10]=g*S+_*P+m*X+h*Se,r[14]=g*M+_*B+m*$+h*Ce,r[3]=v*C+b*L+x*Z+D*le,r[7]=v*R+b*E+x*G+D*me,r[11]=v*S+b*P+x*X+D*Se,r[15]=v*M+b*B+x*$+D*Ce,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[4]*=e,n[8]*=e,n[12]*=e,n[1]*=e,n[5]*=e,n[9]*=e,n[13]*=e,n[2]*=e,n[6]*=e,n[10]*=e,n[14]*=e,n[3]*=e,n[7]*=e,n[11]*=e,n[15]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[4],s=e[8],r=e[12],o=e[1],a=e[5],l=e[9],c=e[13],u=e[2],d=e[6],f=e[10],p=e[14],g=e[3],_=e[7],m=e[11],h=e[15],v=l*p-c*f,b=a*p-c*d,x=a*f-l*d,D=o*p-c*u,C=o*f-l*u,R=o*d-a*u;return n*(_*v-m*b+h*x)-i*(g*v-m*D+h*C)+s*(g*b-_*D+h*R)-r*(g*x-_*C+m*R)}transpose(){const e=this.elements;let n;return n=e[1],e[1]=e[4],e[4]=n,n=e[2],e[2]=e[8],e[8]=n,n=e[6],e[6]=e[9],e[9]=n,n=e[3],e[3]=e[12],e[12]=n,n=e[7],e[7]=e[13],e[13]=n,n=e[11],e[11]=e[14],e[14]=n,this}setPosition(e,n,i){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=n,s[14]=i),this}invert(){const e=this.elements,n=e[0],i=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],d=e[9],f=e[10],p=e[11],g=e[12],_=e[13],m=e[14],h=e[15],v=n*a-i*o,b=n*l-s*o,x=n*c-r*o,D=i*l-s*a,C=i*c-r*a,R=s*c-r*l,S=u*_-d*g,M=u*m-f*g,L=u*h-p*g,E=d*m-f*_,P=d*h-p*_,B=f*h-p*m,Z=v*B-b*P+x*E+D*L-C*M+R*S;if(Z===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const G=1/Z;return e[0]=(a*B-l*P+c*E)*G,e[1]=(s*P-i*B-r*E)*G,e[2]=(_*R-m*C+h*D)*G,e[3]=(f*C-d*R-p*D)*G,e[4]=(l*L-o*B-c*M)*G,e[5]=(n*B-s*L+r*M)*G,e[6]=(m*x-g*R-h*b)*G,e[7]=(u*R-f*x+p*b)*G,e[8]=(o*P-a*L+c*S)*G,e[9]=(i*L-n*P-r*S)*G,e[10]=(g*C-_*x+h*v)*G,e[11]=(d*x-u*C-p*v)*G,e[12]=(a*M-o*E-l*S)*G,e[13]=(n*E-i*M+s*S)*G,e[14]=(_*b-g*D-m*v)*G,e[15]=(u*D-d*b+f*v)*G,this}scale(e){const n=this.elements,i=e.x,s=e.y,r=e.z;return n[0]*=i,n[4]*=s,n[8]*=r,n[1]*=i,n[5]*=s,n[9]*=r,n[2]*=i,n[6]*=s,n[10]*=r,n[3]*=i,n[7]*=s,n[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,n=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(n,i,s))}makeTranslation(e,n,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,n,0,0,1,i,0,0,0,1),this}makeRotationX(e){const n=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,n,-i,0,0,i,n,0,0,0,0,1),this}makeRotationY(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,0,i,0,0,1,0,0,-i,0,n,0,0,0,0,1),this}makeRotationZ(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,0,i,n,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,n){const i=Math.cos(n),s=Math.sin(n),r=1-i,o=e.x,a=e.y,l=e.z,c=r*o,u=r*a;return this.set(c*o+i,c*a-s*l,c*l+s*a,0,c*a+s*l,u*a+i,u*l-s*o,0,c*l-s*a,u*l+s*o,r*l*l+i,0,0,0,0,1),this}makeScale(e,n,i){return this.set(e,0,0,0,0,n,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,n,i,s,r,o){return this.set(1,i,r,0,e,1,o,0,n,s,1,0,0,0,0,1),this}compose(e,n,i){const s=this.elements,r=n._x,o=n._y,a=n._z,l=n._w,c=r+r,u=o+o,d=a+a,f=r*c,p=r*u,g=r*d,_=o*u,m=o*d,h=a*d,v=l*c,b=l*u,x=l*d,D=i.x,C=i.y,R=i.z;return s[0]=(1-(_+h))*D,s[1]=(p+x)*D,s[2]=(g-b)*D,s[3]=0,s[4]=(p-x)*C,s[5]=(1-(f+h))*C,s[6]=(m+v)*C,s[7]=0,s[8]=(g+b)*R,s[9]=(m-v)*R,s[10]=(1-(f+_))*R,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,n,i){const s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];const r=this.determinant();if(r===0)return i.set(1,1,1),n.identity(),this;let o=xr.set(s[0],s[1],s[2]).length();const a=xr.set(s[4],s[5],s[6]).length(),l=xr.set(s[8],s[9],s[10]).length();r<0&&(o=-o),Zn.copy(this);const c=1/o,u=1/a,d=1/l;return Zn.elements[0]*=c,Zn.elements[1]*=c,Zn.elements[2]*=c,Zn.elements[4]*=u,Zn.elements[5]*=u,Zn.elements[6]*=u,Zn.elements[8]*=d,Zn.elements[9]*=d,Zn.elements[10]*=d,n.setFromRotationMatrix(Zn),i.x=o,i.y=a,i.z=l,this}makePerspective(e,n,i,s,r,o,a=Ti,l=!1){const c=this.elements,u=2*r/(n-e),d=2*r/(i-s),f=(n+e)/(n-e),p=(i+s)/(i-s);let g,_;if(l)g=r/(o-r),_=o*r/(o-r);else if(a===Ti)g=-(o+r)/(o-r),_=-2*o*r/(o-r);else if(a===wl)g=-o/(o-r),_=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=d,c[9]=p,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,n,i,s,r,o,a=Ti,l=!1){const c=this.elements,u=2/(n-e),d=2/(i-s),f=-(n+e)/(n-e),p=-(i+s)/(i-s);let g,_;if(l)g=1/(o-r),_=o/(o-r);else if(a===Ti)g=-2/(o-r),_=-(o+r)/(o-r);else if(a===wl)g=-1/(o-r),_=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=0,c[12]=f,c[1]=0,c[5]=d,c[9]=0,c[13]=p,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const n=this.elements,i=e.elements;for(let s=0;s<16;s++)if(n[s]!==i[s])return!1;return!0}fromArray(e,n=0){for(let i=0;i<16;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e[n+9]=i[9],e[n+10]=i[10],e[n+11]=i[11],e[n+12]=i[12],e[n+13]=i[13],e[n+14]=i[14],e[n+15]=i[15],e}};Pl.prototype.isMatrix4=!0;let sn=Pl;const xr=new se,Zn=new sn,pT=new se(0,0,0),mT=new se(1,1,1),ps=new se,ba=new se,On=new se,Qp=new sn,em=new oo;class ur{constructor(e=0,n=0,i=0,s=ur.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=n,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,n,i,s=this._order){return this._x=e,this._y=n,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,n=this._order,i=!0){const s=e.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],u=s[9],d=s[2],f=s[6],p=s[10];switch(n){case"XYZ":this._y=Math.asin(ut(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,p),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ut(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(ut(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-d,p),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-ut(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(f,p),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(ut(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-ut(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-u,p),this._y=0);break;default:je("Euler: .setFromRotationMatrix() encountered an unknown order: "+n)}return this._order=n,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,n,i){return Qp.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Qp,n,i)}setFromVector3(e,n=this._order){return this.set(e.x,e.y,e.z,n)}reorder(e){return em.setFromEuler(this),this.setFromQuaternion(em,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}ur.DEFAULT_ORDER="XYZ";class k0{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let gT=0;const tm=new se,Sr=new oo,Bi=new sn,Ea=new se,vo=new se,_T=new se,vT=new oo,nm=new se(1,0,0),im=new se(0,1,0),sm=new se(0,0,1),rm={type:"added"},xT={type:"removed"},yr={type:"childadded",child:null},zc={type:"childremoved",child:null};class Hn extends dr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:gT++}),this.uuid=ra(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Hn.DEFAULT_UP.clone();const e=new se,n=new ur,i=new oo,s=new se(1,1,1);function r(){i.setFromEuler(n,!1)}function o(){n.setFromQuaternion(i,void 0,!1)}n._onChange(r),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new sn},normalMatrix:{value:new tt}}),this.matrix=new sn,this.matrixWorld=new sn,this.matrixAutoUpdate=Hn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Hn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new k0,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,n){this.quaternion.setFromAxisAngle(e,n)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,n){return Sr.setFromAxisAngle(e,n),this.quaternion.multiply(Sr),this}rotateOnWorldAxis(e,n){return Sr.setFromAxisAngle(e,n),this.quaternion.premultiply(Sr),this}rotateX(e){return this.rotateOnAxis(nm,e)}rotateY(e){return this.rotateOnAxis(im,e)}rotateZ(e){return this.rotateOnAxis(sm,e)}translateOnAxis(e,n){return tm.copy(e).applyQuaternion(this.quaternion),this.position.add(tm.multiplyScalar(n)),this}translateX(e){return this.translateOnAxis(nm,e)}translateY(e){return this.translateOnAxis(im,e)}translateZ(e){return this.translateOnAxis(sm,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Bi.copy(this.matrixWorld).invert())}lookAt(e,n,i){e.isVector3?Ea.copy(e):Ea.set(e,n,i);const s=this.parent;this.updateWorldMatrix(!0,!1),vo.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Bi.lookAt(vo,Ea,this.up):Bi.lookAt(Ea,vo,this.up),this.quaternion.setFromRotationMatrix(Bi),s&&(Bi.extractRotation(s.matrixWorld),Sr.setFromRotationMatrix(Bi),this.quaternion.premultiply(Sr.invert()))}add(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.add(arguments[n]);return this}return e===this?(pt("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(rm),yr.child=e,this.dispatchEvent(yr),yr.child=null):pt("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const n=this.children.indexOf(e);return n!==-1&&(e.parent=null,this.children.splice(n,1),e.dispatchEvent(xT),zc.child=e,this.dispatchEvent(zc),zc.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Bi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Bi.multiply(e.parent.matrixWorld)),e.applyMatrix4(Bi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(rm),yr.child=e,this.dispatchEvent(yr),yr.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,n){if(this[e]===n)return this;for(let i=0,s=this.children.length;i<s;i++){const o=this.children[i].getObjectByProperty(e,n);if(o!==void 0)return o}}getObjectsByProperty(e,n,i=[]){this[e]===n&&i.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,n,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(vo,e,_T),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(vo,vT,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const n=this.matrixWorld.elements;return e.set(n[8],n[9],n[10]).normalize()}raycast(){}traverse(e){e(this);const n=this.children;for(let i=0,s=n.length;i<s;i++)n[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const n=this.children;for(let i=0,s=n.length;i<s;i++)n[i].traverseVisible(e)}traverseAncestors(e){const n=this.parent;n!==null&&(e(n),n.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const n=e.x,i=e.y,s=e.z,r=this.matrix.elements;r[12]+=n-r[0]*n-r[4]*i-r[8]*s,r[13]+=i-r[1]*n-r[5]*i-r[9]*s,r[14]+=s-r[2]*n-r[6]*i-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const n=this.children;for(let i=0,s=n.length;i<s;i++)n[i].updateMatrixWorld(e)}updateWorldMatrix(e,n){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),n===!0){const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){const n=e===void 0||typeof e=="string",i={};n&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),this.static!==!1&&(s.static=this.static),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const d=l[c];r(e.shapes,d)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(e.materials,this.material[l]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];s.animations.push(r(e.animations,l))}}if(n){const a=o(e.geometries),l=o(e.materials),c=o(e.textures),u=o(e.images),d=o(e.shapes),f=o(e.skeletons),p=o(e.animations),g=o(e.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),d.length>0&&(i.shapes=d),f.length>0&&(i.skeletons=f),p.length>0&&(i.animations=p),g.length>0&&(i.nodes=g)}return i.object=s,i;function o(a){const l=[];for(const c in a){const u=a[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,n=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),n===!0)for(let i=0;i<e.children.length;i++){const s=e.children[i];this.add(s.clone())}return this}}Hn.DEFAULT_UP=new se(0,1,0);Hn.DEFAULT_MATRIX_AUTO_UPDATE=!0;Hn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Ma extends Hn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const ST={type:"move"};class Vc{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ma,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ma,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new se,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new se),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ma,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new se,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new se,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const n=this._hand;if(n)for(const i of e.hand.values())this._getHandJoint(n,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,n,i){let s=null,r=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(e&&n.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(const _ of e.hand.values()){const m=n.getJointPose(_,i),h=this._getHandJoint(c,_);m!==null&&(h.matrix.fromArray(m.transform.matrix),h.matrix.decompose(h.position,h.rotation,h.scale),h.matrixWorldNeedsUpdate=!0,h.jointRadius=m.radius),h.visible=m!==null}const u=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],f=u.position.distanceTo(d.position),p=.02,g=.005;c.inputState.pinching&&f>p+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=p-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=n.getPose(e.gripSpace,i),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));a!==null&&(s=n.getPose(e.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(ST)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,n){if(e.joints[n.jointName]===void 0){const i=new Ma;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[n.jointName]=i,e.add(i)}return e.joints[n.jointName]}}const B0={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ms={h:0,s:0,l:0},Ta={h:0,s:0,l:0};function Hc(t,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?t+(e-t)*6*n:n<1/2?e:n<2/3?t+(e-t)*6*(2/3-n):t}class It{constructor(e,n,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,n,i)}set(e,n,i){if(n===void 0&&i===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,n,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,n=kn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,ct.colorSpaceToWorking(this,n),this}setRGB(e,n,i,s=ct.workingColorSpace){return this.r=e,this.g=n,this.b=i,ct.colorSpaceToWorking(this,s),this}setHSL(e,n,i,s=ct.workingColorSpace){if(e=aT(e,1),n=ut(n,0,1),i=ut(i,0,1),n===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+n):i+n-i*n,o=2*i-r;this.r=Hc(o,r,e+1/3),this.g=Hc(o,r,e),this.b=Hc(o,r,e-1/3)}return ct.colorSpaceToWorking(this,s),this}setStyle(e,n=kn){function i(r){r!==void 0&&parseFloat(r)<1&&je("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,n);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,n);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,n);break;default:je("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,n);if(o===6)return this.setHex(parseInt(r,16),n);je("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,n);return this}setColorName(e,n=kn){const i=B0[e.toLowerCase()];return i!==void 0?this.setHex(i,n):je("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=es(e.r),this.g=es(e.g),this.b=es(e.b),this}copyLinearToSRGB(e){return this.r=Hr(e.r),this.g=Hr(e.g),this.b=Hr(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=kn){return ct.workingToColorSpace(pn.copy(this),e),Math.round(ut(pn.r*255,0,255))*65536+Math.round(ut(pn.g*255,0,255))*256+Math.round(ut(pn.b*255,0,255))}getHexString(e=kn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,n=ct.workingColorSpace){ct.workingToColorSpace(pn.copy(this),n);const i=pn.r,s=pn.g,r=pn.b,o=Math.max(i,s,r),a=Math.min(i,s,r);let l,c;const u=(a+o)/2;if(a===o)l=0,c=0;else{const d=o-a;switch(c=u<=.5?d/(o+a):d/(2-o-a),o){case i:l=(s-r)/d+(s<r?6:0);break;case s:l=(r-i)/d+2;break;case r:l=(i-s)/d+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,n=ct.workingColorSpace){return ct.workingToColorSpace(pn.copy(this),n),e.r=pn.r,e.g=pn.g,e.b=pn.b,e}getStyle(e=kn){ct.workingToColorSpace(pn.copy(this),e);const n=pn.r,i=pn.g,s=pn.b;return e!==kn?`color(${e} ${n.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(n*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,n,i){return this.getHSL(ms),this.setHSL(ms.h+e,ms.s+n,ms.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,n){return this.r=e.r+n.r,this.g=e.g+n.g,this.b=e.b+n.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,n){return this.r+=(e.r-this.r)*n,this.g+=(e.g-this.g)*n,this.b+=(e.b-this.b)*n,this}lerpColors(e,n,i){return this.r=e.r+(n.r-e.r)*i,this.g=e.g+(n.g-e.g)*i,this.b=e.b+(n.b-e.b)*i,this}lerpHSL(e,n){this.getHSL(ms),e.getHSL(Ta);const i=Uc(ms.h,Ta.h,n),s=Uc(ms.s,Ta.s,n),r=Uc(ms.l,Ta.l,n);return this.setHSL(i,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const n=this.r,i=this.g,s=this.b,r=e.elements;return this.r=r[0]*n+r[3]*i+r[6]*s,this.g=r[1]*n+r[4]*i+r[7]*s,this.b=r[2]*n+r[5]*i+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,n=0){return this.r=e[n],this.g=e[n+1],this.b=e[n+2],this}toArray(e=[],n=0){return e[n]=this.r,e[n+1]=this.g,e[n+2]=this.b,e}fromBufferAttribute(e,n){return this.r=e.getX(n),this.g=e.getY(n),this.b=e.getZ(n),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const pn=new It;It.NAMES=B0;class yT extends Hn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ur,this.environmentIntensity=1,this.environmentRotation=new ur,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,n){return super.copy(e,n),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const n=super.toJSON(e);return this.fog!==null&&(n.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(n.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(n.object.backgroundIntensity=this.backgroundIntensity),n.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(n.object.environmentIntensity=this.environmentIntensity),n.object.environmentRotation=this.environmentRotation.toArray(),n}}const Jn=new se,zi=new se,Gc=new se,Vi=new se,br=new se,Er=new se,om=new se,Wc=new se,$c=new se,Xc=new se,qc=new Yt,Kc=new Yt,Yc=new Yt;class ni{constructor(e=new se,n=new se,i=new se){this.a=e,this.b=n,this.c=i}static getNormal(e,n,i,s){s.subVectors(i,n),Jn.subVectors(e,n),s.cross(Jn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,n,i,s,r){Jn.subVectors(s,n),zi.subVectors(i,n),Gc.subVectors(e,n);const o=Jn.dot(Jn),a=Jn.dot(zi),l=Jn.dot(Gc),c=zi.dot(zi),u=zi.dot(Gc),d=o*c-a*a;if(d===0)return r.set(0,0,0),null;const f=1/d,p=(c*l-a*u)*f,g=(o*u-a*l)*f;return r.set(1-p-g,g,p)}static containsPoint(e,n,i,s){return this.getBarycoord(e,n,i,s,Vi)===null?!1:Vi.x>=0&&Vi.y>=0&&Vi.x+Vi.y<=1}static getInterpolation(e,n,i,s,r,o,a,l){return this.getBarycoord(e,n,i,s,Vi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Vi.x),l.addScaledVector(o,Vi.y),l.addScaledVector(a,Vi.z),l)}static getInterpolatedAttribute(e,n,i,s,r,o){return qc.setScalar(0),Kc.setScalar(0),Yc.setScalar(0),qc.fromBufferAttribute(e,n),Kc.fromBufferAttribute(e,i),Yc.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(qc,r.x),o.addScaledVector(Kc,r.y),o.addScaledVector(Yc,r.z),o}static isFrontFacing(e,n,i,s){return Jn.subVectors(i,n),zi.subVectors(e,n),Jn.cross(zi).dot(s)<0}set(e,n,i){return this.a.copy(e),this.b.copy(n),this.c.copy(i),this}setFromPointsAndIndices(e,n,i,s){return this.a.copy(e[n]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,n,i,s){return this.a.fromBufferAttribute(e,n),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Jn.subVectors(this.c,this.b),zi.subVectors(this.a,this.b),Jn.cross(zi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return ni.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,n){return ni.getBarycoord(e,this.a,this.b,this.c,n)}getInterpolation(e,n,i,s,r){return ni.getInterpolation(e,this.a,this.b,this.c,n,i,s,r)}containsPoint(e){return ni.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return ni.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,n){const i=this.a,s=this.b,r=this.c;let o,a;br.subVectors(s,i),Er.subVectors(r,i),Wc.subVectors(e,i);const l=br.dot(Wc),c=Er.dot(Wc);if(l<=0&&c<=0)return n.copy(i);$c.subVectors(e,s);const u=br.dot($c),d=Er.dot($c);if(u>=0&&d<=u)return n.copy(s);const f=l*d-u*c;if(f<=0&&l>=0&&u<=0)return o=l/(l-u),n.copy(i).addScaledVector(br,o);Xc.subVectors(e,r);const p=br.dot(Xc),g=Er.dot(Xc);if(g>=0&&p<=g)return n.copy(r);const _=p*c-l*g;if(_<=0&&c>=0&&g<=0)return a=c/(c-g),n.copy(i).addScaledVector(Er,a);const m=u*g-p*d;if(m<=0&&d-u>=0&&p-g>=0)return om.subVectors(r,s),a=(d-u)/(d-u+(p-g)),n.copy(s).addScaledVector(om,a);const h=1/(m+_+f);return o=_*h,a=f*h,n.copy(i).addScaledVector(br,o).addScaledVector(Er,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class oa{constructor(e=new se(1/0,1/0,1/0),n=new se(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=n}set(e,n){return this.min.copy(e),this.max.copy(n),this}setFromArray(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n+=3)this.expandByPoint(Qn.fromArray(e,n));return this}setFromBufferAttribute(e){this.makeEmpty();for(let n=0,i=e.count;n<i;n++)this.expandByPoint(Qn.fromBufferAttribute(e,n));return this}setFromPoints(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n++)this.expandByPoint(e[n]);return this}setFromCenterAndSize(e,n){const i=Qn.copy(n).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,n=!1){return this.makeEmpty(),this.expandByObject(e,n)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,n=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const r=i.getAttribute("position");if(n===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,Qn):Qn.fromBufferAttribute(r,o),Qn.applyMatrix4(e.matrixWorld),this.expandByPoint(Qn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Aa.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Aa.copy(i.boundingBox)),Aa.applyMatrix4(e.matrixWorld),this.union(Aa)}const s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],n);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,n){return n.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Qn),Qn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let n,i;return e.normal.x>0?(n=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(n=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(n+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(n+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(n+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(n+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),n<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(xo),wa.subVectors(this.max,xo),Mr.subVectors(e.a,xo),Tr.subVectors(e.b,xo),Ar.subVectors(e.c,xo),gs.subVectors(Tr,Mr),_s.subVectors(Ar,Tr),Hs.subVectors(Mr,Ar);let n=[0,-gs.z,gs.y,0,-_s.z,_s.y,0,-Hs.z,Hs.y,gs.z,0,-gs.x,_s.z,0,-_s.x,Hs.z,0,-Hs.x,-gs.y,gs.x,0,-_s.y,_s.x,0,-Hs.y,Hs.x,0];return!jc(n,Mr,Tr,Ar,wa)||(n=[1,0,0,0,1,0,0,0,1],!jc(n,Mr,Tr,Ar,wa))?!1:(Ca.crossVectors(gs,_s),n=[Ca.x,Ca.y,Ca.z],jc(n,Mr,Tr,Ar,wa))}clampPoint(e,n){return n.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Qn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Qn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Hi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Hi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Hi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Hi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Hi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Hi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Hi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Hi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Hi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Hi=[new se,new se,new se,new se,new se,new se,new se,new se],Qn=new se,Aa=new oa,Mr=new se,Tr=new se,Ar=new se,gs=new se,_s=new se,Hs=new se,xo=new se,wa=new se,Ca=new se,Gs=new se;function jc(t,e,n,i,s){for(let r=0,o=t.length-3;r<=o;r+=3){Gs.fromArray(t,r);const a=s.x*Math.abs(Gs.x)+s.y*Math.abs(Gs.y)+s.z*Math.abs(Gs.z),l=e.dot(Gs),c=n.dot(Gs),u=i.dot(Gs);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}const jt=new se,Ra=new mt;let bT=0;class Ii extends dr{constructor(e,n,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:bT++}),this.name="",this.array=e,this.itemSize=n,this.count=e!==void 0?e.length/n:0,this.normalized=i,this.usage=Xp,this.updateRanges=[],this.gpuType=Mi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,n,i){e*=this.itemSize,i*=n.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=n.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let n=0,i=this.count;n<i;n++)Ra.fromBufferAttribute(this,n),Ra.applyMatrix3(e),this.setXY(n,Ra.x,Ra.y);else if(this.itemSize===3)for(let n=0,i=this.count;n<i;n++)jt.fromBufferAttribute(this,n),jt.applyMatrix3(e),this.setXYZ(n,jt.x,jt.y,jt.z);return this}applyMatrix4(e){for(let n=0,i=this.count;n<i;n++)jt.fromBufferAttribute(this,n),jt.applyMatrix4(e),this.setXYZ(n,jt.x,jt.y,jt.z);return this}applyNormalMatrix(e){for(let n=0,i=this.count;n<i;n++)jt.fromBufferAttribute(this,n),jt.applyNormalMatrix(e),this.setXYZ(n,jt.x,jt.y,jt.z);return this}transformDirection(e){for(let n=0,i=this.count;n<i;n++)jt.fromBufferAttribute(this,n),jt.transformDirection(e),this.setXYZ(n,jt.x,jt.y,jt.z);return this}set(e,n=0){return this.array.set(e,n),this}getComponent(e,n){let i=this.array[e*this.itemSize+n];return this.normalized&&(i=_o(i,this.array)),i}setComponent(e,n,i){return this.normalized&&(i=In(i,this.array)),this.array[e*this.itemSize+n]=i,this}getX(e){let n=this.array[e*this.itemSize];return this.normalized&&(n=_o(n,this.array)),n}setX(e,n){return this.normalized&&(n=In(n,this.array)),this.array[e*this.itemSize]=n,this}getY(e){let n=this.array[e*this.itemSize+1];return this.normalized&&(n=_o(n,this.array)),n}setY(e,n){return this.normalized&&(n=In(n,this.array)),this.array[e*this.itemSize+1]=n,this}getZ(e){let n=this.array[e*this.itemSize+2];return this.normalized&&(n=_o(n,this.array)),n}setZ(e,n){return this.normalized&&(n=In(n,this.array)),this.array[e*this.itemSize+2]=n,this}getW(e){let n=this.array[e*this.itemSize+3];return this.normalized&&(n=_o(n,this.array)),n}setW(e,n){return this.normalized&&(n=In(n,this.array)),this.array[e*this.itemSize+3]=n,this}setXY(e,n,i){return e*=this.itemSize,this.normalized&&(n=In(n,this.array),i=In(i,this.array)),this.array[e+0]=n,this.array[e+1]=i,this}setXYZ(e,n,i,s){return e*=this.itemSize,this.normalized&&(n=In(n,this.array),i=In(i,this.array),s=In(s,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,n,i,s,r){return e*=this.itemSize,this.normalized&&(n=In(n,this.array),i=In(i,this.array),s=In(s,this.array),r=In(r,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Xp&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:"dispose"})}}class z0 extends Ii{constructor(e,n,i){super(new Uint16Array(e),n,i)}}class V0 extends Ii{constructor(e,n,i){super(new Uint32Array(e),n,i)}}class ts extends Ii{constructor(e,n,i){super(new Float32Array(e),n,i)}}const ET=new oa,So=new se,Zc=new se;class Nd{constructor(e=new se,n=-1){this.isSphere=!0,this.center=e,this.radius=n}set(e,n){return this.center.copy(e),this.radius=n,this}setFromPoints(e,n){const i=this.center;n!==void 0?i.copy(n):ET.setFromPoints(e).getCenter(i);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const n=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=n*n}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,n){const i=this.center.distanceToSquared(e);return n.copy(e),i>this.radius*this.radius&&(n.sub(this.center).normalize(),n.multiplyScalar(this.radius).add(this.center)),n}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;So.subVectors(e,this.center);const n=So.lengthSq();if(n>this.radius*this.radius){const i=Math.sqrt(n),s=(i-this.radius)*.5;this.center.addScaledVector(So,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Zc.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(So.copy(e.center).add(Zc)),this.expandByPoint(So.copy(e.center).sub(Zc))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let MT=0;const Xn=new sn,Jc=new Hn,wr=new se,Fn=new oa,yo=new oa,an=new se;class ls extends dr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:MT++}),this.uuid=ra(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(iT(e)?V0:z0)(e,1):this.index=e,this}setIndirect(e,n=0){return this.indirect=e,this.indirectOffset=n,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,n){return this.attributes[e]=n,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,n,i=0){this.groups.push({start:e,count:n,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,n){this.drawRange.start=e,this.drawRange.count=n}applyMatrix4(e){const n=this.attributes.position;n!==void 0&&(n.applyMatrix4(e),n.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new tt().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Xn.makeRotationFromQuaternion(e),this.applyMatrix4(Xn),this}rotateX(e){return Xn.makeRotationX(e),this.applyMatrix4(Xn),this}rotateY(e){return Xn.makeRotationY(e),this.applyMatrix4(Xn),this}rotateZ(e){return Xn.makeRotationZ(e),this.applyMatrix4(Xn),this}translate(e,n,i){return Xn.makeTranslation(e,n,i),this.applyMatrix4(Xn),this}scale(e,n,i){return Xn.makeScale(e,n,i),this.applyMatrix4(Xn),this}lookAt(e){return Jc.lookAt(e),Jc.updateMatrix(),this.applyMatrix4(Jc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(wr).negate(),this.translate(wr.x,wr.y,wr.z),this}setFromPoints(e){const n=this.getAttribute("position");if(n===void 0){const i=[];for(let s=0,r=e.length;s<r;s++){const o=e[s];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new ts(i,3))}else{const i=Math.min(e.length,n.count);for(let s=0;s<i;s++){const r=e[s];n.setXYZ(s,r.x,r.y,r.z||0)}e.length>n.count&&je("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),n.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new oa);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){pt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new se(-1/0,-1/0,-1/0),new se(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),n)for(let i=0,s=n.length;i<s;i++){const r=n[i];Fn.setFromBufferAttribute(r),this.morphTargetsRelative?(an.addVectors(this.boundingBox.min,Fn.min),this.boundingBox.expandByPoint(an),an.addVectors(this.boundingBox.max,Fn.max),this.boundingBox.expandByPoint(an)):(this.boundingBox.expandByPoint(Fn.min),this.boundingBox.expandByPoint(Fn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&pt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Nd);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){pt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new se,1/0);return}if(e){const i=this.boundingSphere.center;if(Fn.setFromBufferAttribute(e),n)for(let r=0,o=n.length;r<o;r++){const a=n[r];yo.setFromBufferAttribute(a),this.morphTargetsRelative?(an.addVectors(Fn.min,yo.min),Fn.expandByPoint(an),an.addVectors(Fn.max,yo.max),Fn.expandByPoint(an)):(Fn.expandByPoint(yo.min),Fn.expandByPoint(yo.max))}Fn.getCenter(i);let s=0;for(let r=0,o=e.count;r<o;r++)an.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(an));if(n)for(let r=0,o=n.length;r<o;r++){const a=n[r],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)an.fromBufferAttribute(a,c),l&&(wr.fromBufferAttribute(e,c),an.add(wr)),s=Math.max(s,i.distanceToSquared(an))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&pt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,n=this.attributes;if(e===null||n.position===void 0||n.normal===void 0||n.uv===void 0){pt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=n.position,s=n.normal,r=n.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ii(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let S=0;S<i.count;S++)a[S]=new se,l[S]=new se;const c=new se,u=new se,d=new se,f=new mt,p=new mt,g=new mt,_=new se,m=new se;function h(S,M,L){c.fromBufferAttribute(i,S),u.fromBufferAttribute(i,M),d.fromBufferAttribute(i,L),f.fromBufferAttribute(r,S),p.fromBufferAttribute(r,M),g.fromBufferAttribute(r,L),u.sub(c),d.sub(c),p.sub(f),g.sub(f);const E=1/(p.x*g.y-g.x*p.y);isFinite(E)&&(_.copy(u).multiplyScalar(g.y).addScaledVector(d,-p.y).multiplyScalar(E),m.copy(d).multiplyScalar(p.x).addScaledVector(u,-g.x).multiplyScalar(E),a[S].add(_),a[M].add(_),a[L].add(_),l[S].add(m),l[M].add(m),l[L].add(m))}let v=this.groups;v.length===0&&(v=[{start:0,count:e.count}]);for(let S=0,M=v.length;S<M;++S){const L=v[S],E=L.start,P=L.count;for(let B=E,Z=E+P;B<Z;B+=3)h(e.getX(B+0),e.getX(B+1),e.getX(B+2))}const b=new se,x=new se,D=new se,C=new se;function R(S){D.fromBufferAttribute(s,S),C.copy(D);const M=a[S];b.copy(M),b.sub(D.multiplyScalar(D.dot(M))).normalize(),x.crossVectors(C,M);const E=x.dot(l[S])<0?-1:1;o.setXYZW(S,b.x,b.y,b.z,E)}for(let S=0,M=v.length;S<M;++S){const L=v[S],E=L.start,P=L.count;for(let B=E,Z=E+P;B<Z;B+=3)R(e.getX(B+0)),R(e.getX(B+1)),R(e.getX(B+2))}}computeVertexNormals(){const e=this.index,n=this.getAttribute("position");if(n!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Ii(new Float32Array(n.count*3),3),this.setAttribute("normal",i);else for(let f=0,p=i.count;f<p;f++)i.setXYZ(f,0,0,0);const s=new se,r=new se,o=new se,a=new se,l=new se,c=new se,u=new se,d=new se;if(e)for(let f=0,p=e.count;f<p;f+=3){const g=e.getX(f+0),_=e.getX(f+1),m=e.getX(f+2);s.fromBufferAttribute(n,g),r.fromBufferAttribute(n,_),o.fromBufferAttribute(n,m),u.subVectors(o,r),d.subVectors(s,r),u.cross(d),a.fromBufferAttribute(i,g),l.fromBufferAttribute(i,_),c.fromBufferAttribute(i,m),a.add(u),l.add(u),c.add(u),i.setXYZ(g,a.x,a.y,a.z),i.setXYZ(_,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let f=0,p=n.count;f<p;f+=3)s.fromBufferAttribute(n,f+0),r.fromBufferAttribute(n,f+1),o.fromBufferAttribute(n,f+2),u.subVectors(o,r),d.subVectors(s,r),u.cross(d),i.setXYZ(f+0,u.x,u.y,u.z),i.setXYZ(f+1,u.x,u.y,u.z),i.setXYZ(f+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let n=0,i=e.count;n<i;n++)an.fromBufferAttribute(e,n),an.normalize(),e.setXYZ(n,an.x,an.y,an.z)}toNonIndexed(){function e(a,l){const c=a.array,u=a.itemSize,d=a.normalized,f=new c.constructor(l.length*u);let p=0,g=0;for(let _=0,m=l.length;_<m;_++){a.isInterleavedBufferAttribute?p=l[_]*a.data.stride+a.offset:p=l[_]*u;for(let h=0;h<u;h++)f[g++]=c[p++]}return new Ii(f,u,d)}if(this.index===null)return je("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const n=new ls,i=this.index.array,s=this.attributes;for(const a in s){const l=s[a],c=e(l,i);n.setAttribute(a,c)}const r=this.morphAttributes;for(const a in r){const l=[],c=r[a];for(let u=0,d=c.length;u<d;u++){const f=c[u],p=e(f,i);l.push(p)}n.morphAttributes[a]=l}n.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];n.addGroup(c.start,c.count,c.materialIndex)}return n}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const n=this.index;n!==null&&(e.data.index={type:n.array.constructor.name,array:Array.prototype.slice.call(n.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let d=0,f=c.length;d<f;d++){const p=c[d];u.push(p.toJSON(e.data))}u.length>0&&(s[l]=u,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const n={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const s=e.attributes;for(const c in s){const u=s[c];this.setAttribute(c,u.clone(n))}const r=e.morphAttributes;for(const c in r){const u=[],d=r[c];for(let f=0,p=d.length;f<p;f++)u.push(d[f].clone(n));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let c=0,u=o.length;c<u;c++){const d=o[c];this.addGroup(d.start,d.count,d.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}let TT=0;class sc extends dr{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:TT++}),this.uuid=ra(),this.name="",this.type="Material",this.blending=Vr,this.side=Is,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=qu,this.blendDst=Ku,this.blendEquation=Zs,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new It(0,0,0),this.blendAlpha=0,this.depthFunc=Zr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=$p,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=_r,this.stencilZFail=_r,this.stencilZPass=_r,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const n in e){const i=e[n];if(i===void 0){je(`Material: parameter '${n}' has value of undefined.`);continue}const s=this[n];if(s===void 0){je(`Material: '${n}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[n]=i}}toJSON(e){const n=e===void 0||typeof e=="string";n&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Vr&&(i.blending=this.blending),this.side!==Is&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==qu&&(i.blendSrc=this.blendSrc),this.blendDst!==Ku&&(i.blendDst=this.blendDst),this.blendEquation!==Zs&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Zr&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==$p&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==_r&&(i.stencilFail=this.stencilFail),this.stencilZFail!==_r&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==_r&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.allowOverride===!1&&(i.allowOverride=!1),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){const o=[];for(const a in r){const l=r[a];delete l.metadata,o.push(l)}return o}if(n){const r=s(e.textures),o=s(e.images);r.length>0&&(i.textures=r),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const n=e.clippingPlanes;let i=null;if(n!==null){const s=n.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=n[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const Gi=new se,Qc=new se,Pa=new se,vs=new se,eu=new se,Ia=new se,tu=new se;class AT{constructor(e=new se,n=new se(0,0,-1)){this.origin=e,this.direction=n}set(e,n){return this.origin.copy(e),this.direction.copy(n),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,n){return n.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Gi)),this}closestPointToPoint(e,n){n.subVectors(e,this.origin);const i=n.dot(this.direction);return i<0?n.copy(this.origin):n.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const n=Gi.subVectors(e,this.origin).dot(this.direction);return n<0?this.origin.distanceToSquared(e):(Gi.copy(this.origin).addScaledVector(this.direction,n),Gi.distanceToSquared(e))}distanceSqToSegment(e,n,i,s){Qc.copy(e).add(n).multiplyScalar(.5),Pa.copy(n).sub(e).normalize(),vs.copy(this.origin).sub(Qc);const r=e.distanceTo(n)*.5,o=-this.direction.dot(Pa),a=vs.dot(this.direction),l=-vs.dot(Pa),c=vs.lengthSq(),u=Math.abs(1-o*o);let d,f,p,g;if(u>0)if(d=o*l-a,f=o*a-l,g=r*u,d>=0)if(f>=-g)if(f<=g){const _=1/u;d*=_,f*=_,p=d*(d+o*f+2*a)+f*(o*d+f+2*l)+c}else f=r,d=Math.max(0,-(o*f+a)),p=-d*d+f*(f+2*l)+c;else f=-r,d=Math.max(0,-(o*f+a)),p=-d*d+f*(f+2*l)+c;else f<=-g?(d=Math.max(0,-(-o*r+a)),f=d>0?-r:Math.min(Math.max(-r,-l),r),p=-d*d+f*(f+2*l)+c):f<=g?(d=0,f=Math.min(Math.max(-r,-l),r),p=f*(f+2*l)+c):(d=Math.max(0,-(o*r+a)),f=d>0?r:Math.min(Math.max(-r,-l),r),p=-d*d+f*(f+2*l)+c);else f=o>0?-r:r,d=Math.max(0,-(o*f+a)),p=-d*d+f*(f+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(Qc).addScaledVector(Pa,f),p}intersectSphere(e,n){Gi.subVectors(e.center,this.origin);const i=Gi.dot(this.direction),s=Gi.dot(Gi)-i*i,r=e.radius*e.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=i-o,l=i+o;return l<0?null:a<0?this.at(l,n):this.at(a,n)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const n=e.normal.dot(this.direction);if(n===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/n;return i>=0?i:null}intersectPlane(e,n){const i=this.distanceToPlane(e);return i===null?null:this.at(i,n)}intersectsPlane(e){const n=e.distanceToPoint(this.origin);return n===0||e.normal.dot(this.direction)*n<0}intersectBox(e,n){let i,s,r,o,a,l;const c=1/this.direction.x,u=1/this.direction.y,d=1/this.direction.z,f=this.origin;return c>=0?(i=(e.min.x-f.x)*c,s=(e.max.x-f.x)*c):(i=(e.max.x-f.x)*c,s=(e.min.x-f.x)*c),u>=0?(r=(e.min.y-f.y)*u,o=(e.max.y-f.y)*u):(r=(e.max.y-f.y)*u,o=(e.min.y-f.y)*u),i>o||r>s||((r>i||isNaN(i))&&(i=r),(o<s||isNaN(s))&&(s=o),d>=0?(a=(e.min.z-f.z)*d,l=(e.max.z-f.z)*d):(a=(e.max.z-f.z)*d,l=(e.min.z-f.z)*d),i>l||a>s)||((a>i||i!==i)&&(i=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,n)}intersectsBox(e){return this.intersectBox(e,Gi)!==null}intersectTriangle(e,n,i,s,r){eu.subVectors(n,e),Ia.subVectors(i,e),tu.crossVectors(eu,Ia);let o=this.direction.dot(tu),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;vs.subVectors(this.origin,e);const l=a*this.direction.dot(Ia.crossVectors(vs,Ia));if(l<0)return null;const c=a*this.direction.dot(eu.cross(vs));if(c<0||l+c>o)return null;const u=-a*vs.dot(tu);return u<0?null:this.at(u/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class H0 extends sc{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new It(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ur,this.combine=S0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const am=new sn,Ws=new AT,La=new Nd,lm=new se,Da=new se,Na=new se,Ua=new se,nu=new se,Oa=new se,cm=new se,Fa=new se;class Ni extends Hn{constructor(e=new ls,n=new H0){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=n,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const s=n[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,n){const i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,o=i.morphTargetsRelative;n.fromBufferAttribute(s,e);const a=this.morphTargetInfluences;if(r&&a){Oa.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const u=a[l],d=r[l];u!==0&&(nu.fromBufferAttribute(d,e),o?Oa.addScaledVector(nu,u):Oa.addScaledVector(nu.sub(n),u))}n.add(Oa)}return n}raycast(e,n){const i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),La.copy(i.boundingSphere),La.applyMatrix4(r),Ws.copy(e.ray).recast(e.near),!(La.containsPoint(Ws.origin)===!1&&(Ws.intersectSphere(La,lm)===null||Ws.origin.distanceToSquared(lm)>(e.far-e.near)**2))&&(am.copy(r).invert(),Ws.copy(e.ray).applyMatrix4(am),!(i.boundingBox!==null&&Ws.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,n,Ws)))}_computeIntersections(e,n,i){let s;const r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,d=r.attributes.normal,f=r.groups,p=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=f.length;g<_;g++){const m=f[g],h=o[m.materialIndex],v=Math.max(m.start,p.start),b=Math.min(a.count,Math.min(m.start+m.count,p.start+p.count));for(let x=v,D=b;x<D;x+=3){const C=a.getX(x),R=a.getX(x+1),S=a.getX(x+2);s=ka(this,h,e,i,c,u,d,C,R,S),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=m.materialIndex,n.push(s))}}else{const g=Math.max(0,p.start),_=Math.min(a.count,p.start+p.count);for(let m=g,h=_;m<h;m+=3){const v=a.getX(m),b=a.getX(m+1),x=a.getX(m+2);s=ka(this,o,e,i,c,u,d,v,b,x),s&&(s.faceIndex=Math.floor(m/3),n.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,_=f.length;g<_;g++){const m=f[g],h=o[m.materialIndex],v=Math.max(m.start,p.start),b=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let x=v,D=b;x<D;x+=3){const C=x,R=x+1,S=x+2;s=ka(this,h,e,i,c,u,d,C,R,S),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=m.materialIndex,n.push(s))}}else{const g=Math.max(0,p.start),_=Math.min(l.count,p.start+p.count);for(let m=g,h=_;m<h;m+=3){const v=m,b=m+1,x=m+2;s=ka(this,o,e,i,c,u,d,v,b,x),s&&(s.faceIndex=Math.floor(m/3),n.push(s))}}}}function wT(t,e,n,i,s,r,o,a){let l;if(e.side===Dn?l=i.intersectTriangle(o,r,s,!0,a):l=i.intersectTriangle(s,r,o,e.side===Is,a),l===null)return null;Fa.copy(a),Fa.applyMatrix4(t.matrixWorld);const c=n.ray.origin.distanceTo(Fa);return c<n.near||c>n.far?null:{distance:c,point:Fa.clone(),object:t}}function ka(t,e,n,i,s,r,o,a,l,c){t.getVertexPosition(a,Da),t.getVertexPosition(l,Na),t.getVertexPosition(c,Ua);const u=wT(t,e,n,i,Da,Na,Ua,cm);if(u){const d=new se;ni.getBarycoord(cm,Da,Na,Ua,d),s&&(u.uv=ni.getInterpolatedAttribute(s,a,l,c,d,new mt)),r&&(u.uv1=ni.getInterpolatedAttribute(r,a,l,c,d,new mt)),o&&(u.normal=ni.getInterpolatedAttribute(o,a,l,c,d,new se),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const f={a,b:l,c,normal:new se,materialIndex:0};ni.getNormal(Da,Na,Ua,f.normal),u.face=f,u.barycoord=d}return u}class CT extends Pn{constructor(e=null,n=1,i=1,s,r,o,a,l,c=fn,u=fn,d,f){super(null,o,a,l,c,u,s,r,d,f),this.isDataTexture=!0,this.image={data:e,width:n,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const iu=new se,RT=new se,PT=new tt;class qs{constructor(e=new se(1,0,0),n=0){this.isPlane=!0,this.normal=e,this.constant=n}set(e,n){return this.normal.copy(e),this.constant=n,this}setComponents(e,n,i,s){return this.normal.set(e,n,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,n){return this.normal.copy(e),this.constant=-n.dot(this.normal),this}setFromCoplanarPoints(e,n,i){const s=iu.subVectors(i,n).cross(RT.subVectors(e,n)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,n){return n.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,n,i=!0){const s=e.delta(iu),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?n.copy(e.start):null;const o=-(e.start.dot(this.normal)+this.constant)/r;return i===!0&&(o<0||o>1)?null:n.copy(e.start).addScaledVector(s,o)}intersectsLine(e){const n=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return n<0&&i>0||i<0&&n>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,n){const i=n||PT.getNormalMatrix(e),s=this.coplanarPoint(iu).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const $s=new Nd,IT=new mt(.5,.5),Ba=new se;class G0{constructor(e=new qs,n=new qs,i=new qs,s=new qs,r=new qs,o=new qs){this.planes=[e,n,i,s,r,o]}set(e,n,i,s,r,o){const a=this.planes;return a[0].copy(e),a[1].copy(n),a[2].copy(i),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){const n=this.planes;for(let i=0;i<6;i++)n[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,n=Ti,i=!1){const s=this.planes,r=e.elements,o=r[0],a=r[1],l=r[2],c=r[3],u=r[4],d=r[5],f=r[6],p=r[7],g=r[8],_=r[9],m=r[10],h=r[11],v=r[12],b=r[13],x=r[14],D=r[15];if(s[0].setComponents(c-o,p-u,h-g,D-v).normalize(),s[1].setComponents(c+o,p+u,h+g,D+v).normalize(),s[2].setComponents(c+a,p+d,h+_,D+b).normalize(),s[3].setComponents(c-a,p-d,h-_,D-b).normalize(),i)s[4].setComponents(l,f,m,x).normalize(),s[5].setComponents(c-l,p-f,h-m,D-x).normalize();else if(s[4].setComponents(c-l,p-f,h-m,D-x).normalize(),n===Ti)s[5].setComponents(c+l,p+f,h+m,D+x).normalize();else if(n===wl)s[5].setComponents(l,f,m,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+n);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),$s.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const n=e.geometry;n.boundingSphere===null&&n.computeBoundingSphere(),$s.copy(n.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere($s)}intersectsSprite(e){$s.center.set(0,0,0);const n=IT.distanceTo(e.center);return $s.radius=.7071067811865476+n,$s.applyMatrix4(e.matrixWorld),this.intersectsSphere($s)}intersectsSphere(e){const n=this.planes,i=e.center,s=-e.radius;for(let r=0;r<6;r++)if(n[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){const n=this.planes;for(let i=0;i<6;i++){const s=n[i];if(Ba.x=s.normal.x>0?e.max.x:e.min.x,Ba.y=s.normal.y>0?e.max.y:e.min.y,Ba.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Ba)<0)return!1}return!0}containsPoint(e){const n=this.planes;for(let i=0;i<6;i++)if(n[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class W0 extends Pn{constructor(e=[],n=lr,i,s,r,o,a,l,c,u){super(e,n,i,s,r,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Qr extends Pn{constructor(e,n,i=Di,s,r,o,a=fn,l=fn,c,u=os,d=1){if(u!==os&&u!==ir)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const f={width:e,height:n,depth:d};super(f,s,r,o,a,l,u,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Dd(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const n=super.toJSON(e);return this.compareFunction!==null&&(n.compareFunction=this.compareFunction),n}}class LT extends Qr{constructor(e,n=Di,i=lr,s,r,o=fn,a=fn,l,c=os){const u={width:e,height:e,depth:1},d=[u,u,u,u,u,u];super(e,e,n,i,s,r,o,a,l,c),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class $0 extends Pn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class aa extends ls{constructor(e=1,n=1,i=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:n,depth:i,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const l=[],c=[],u=[],d=[];let f=0,p=0;g("z","y","x",-1,-1,i,n,e,o,r,0),g("z","y","x",1,-1,i,n,-e,o,r,1),g("x","z","y",1,1,e,i,n,s,o,2),g("x","z","y",1,-1,e,i,-n,s,o,3),g("x","y","z",1,-1,e,n,i,s,r,4),g("x","y","z",-1,-1,e,n,-i,s,r,5),this.setIndex(l),this.setAttribute("position",new ts(c,3)),this.setAttribute("normal",new ts(u,3)),this.setAttribute("uv",new ts(d,2));function g(_,m,h,v,b,x,D,C,R,S,M){const L=x/R,E=D/S,P=x/2,B=D/2,Z=C/2,G=R+1,X=S+1;let $=0,le=0;const me=new se;for(let Se=0;Se<X;Se++){const Ce=Se*E-B;for(let Pe=0;Pe<G;Pe++){const Ke=Pe*L-P;me[_]=Ke*v,me[m]=Ce*b,me[h]=Z,c.push(me.x,me.y,me.z),me[_]=0,me[m]=0,me[h]=C>0?1:-1,u.push(me.x,me.y,me.z),d.push(Pe/R),d.push(1-Se/S),$+=1}}for(let Se=0;Se<S;Se++)for(let Ce=0;Ce<R;Ce++){const Pe=f+Ce+G*Se,Ke=f+Ce+G*(Se+1),Qe=f+(Ce+1)+G*(Se+1),Ge=f+(Ce+1)+G*Se;l.push(Pe,Ke,Ge),l.push(Ke,Qe,Ge),le+=6}a.addGroup(p,le,M),p+=le,f+=$}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new aa(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class la extends ls{constructor(e=1,n=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:n,widthSegments:i,heightSegments:s};const r=e/2,o=n/2,a=Math.floor(i),l=Math.floor(s),c=a+1,u=l+1,d=e/a,f=n/l,p=[],g=[],_=[],m=[];for(let h=0;h<u;h++){const v=h*f-o;for(let b=0;b<c;b++){const x=b*d-r;g.push(x,-v,0),_.push(0,0,1),m.push(b/a),m.push(1-h/l)}}for(let h=0;h<l;h++)for(let v=0;v<a;v++){const b=v+c*h,x=v+c*(h+1),D=v+1+c*(h+1),C=v+1+c*h;p.push(b,x,C),p.push(x,D,C)}this.setIndex(p),this.setAttribute("position",new ts(g,3)),this.setAttribute("normal",new ts(_,3)),this.setAttribute("uv",new ts(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new la(e.width,e.height,e.widthSegments,e.heightSegments)}}function eo(t){const e={};for(const n in t){e[n]={};for(const i in t[n]){const s=t[n][i];if(um(s))s.isRenderTargetTexture?(je("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[n][i]=null):e[n][i]=s.clone();else if(Array.isArray(s))if(um(s[0])){const r=[];for(let o=0,a=s.length;o<a;o++)r[o]=s[o].clone();e[n][i]=r}else e[n][i]=s.slice();else e[n][i]=s}}return e}function bn(t){const e={};for(let n=0;n<t.length;n++){const i=eo(t[n]);for(const s in i)e[s]=i[s]}return e}function um(t){return t&&(t.isColor||t.isMatrix3||t.isMatrix4||t.isVector2||t.isVector3||t.isVector4||t.isTexture||t.isQuaternion)}function DT(t){const e=[];for(let n=0;n<t.length;n++)e.push(t[n].clone());return e}function X0(t){const e=t.getRenderTarget();return e===null?t.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:ct.workingColorSpace}const NT={clone:eo,merge:bn};var UT=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,OT=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ci extends sc{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=UT,this.fragmentShader=OT,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=eo(e.uniforms),this.uniformsGroups=DT(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const n=super.toJSON(e);n.glslVersion=this.glslVersion,n.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?n.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?n.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?n.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?n.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?n.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?n.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?n.uniforms[s]={type:"m4",value:o.toArray()}:n.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(n.defines=this.defines),n.vertexShader=this.vertexShader,n.fragmentShader=this.fragmentShader,n.lights=this.lights,n.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(n.extensions=i),n}}class FT extends ci{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class kT extends sc{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Y3,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class BT extends sc{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const za=new se,Va=new oo,gi=new se;class q0 extends Hn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new sn,this.projectionMatrix=new sn,this.projectionMatrixInverse=new sn,this.coordinateSystem=Ti,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,n){return super.copy(e,n),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(za,Va,gi),gi.x===1&&gi.y===1&&gi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(za,Va,gi.set(1,1,1)).invert()}updateWorldMatrix(e,n){super.updateWorldMatrix(e,n),this.matrixWorld.decompose(za,Va,gi),gi.x===1&&gi.y===1&&gi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(za,Va,gi.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const xs=new se,fm=new mt,dm=new mt;class ei extends q0{constructor(e=50,n=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=n,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const n=.5*this.getFilmHeight()/e;this.fov=Of*2*Math.atan(n),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Nc*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Of*2*Math.atan(Math.tan(Nc*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,n,i){xs.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(xs.x,xs.y).multiplyScalar(-e/xs.z),xs.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(xs.x,xs.y).multiplyScalar(-e/xs.z)}getViewSize(e,n){return this.getViewBounds(e,fm,dm),n.subVectors(dm,fm)}setViewOffset(e,n,i,s,r,o){this.aspect=e/n,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let n=e*Math.tan(Nc*.5*this.fov)/this.zoom,i=2*n,s=this.aspect*i,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,n-=o.offsetY*i/c,s*=o.width/l,i*=o.height/c}const a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,n,n-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.fov=this.fov,n.object.zoom=this.zoom,n.object.near=this.near,n.object.far=this.far,n.object.focus=this.focus,n.object.aspect=this.aspect,this.view!==null&&(n.object.view=Object.assign({},this.view)),n.object.filmGauge=this.filmGauge,n.object.filmOffset=this.filmOffset,n}}class Ud extends q0{constructor(e=-1,n=1,i=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=n,this.top=i,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,n,i,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),n=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=i-e,o=i+e,a=s+n,l=s-n;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.zoom=this.zoom,n.object.left=this.left,n.object.right=this.right,n.object.top=this.top,n.object.bottom=this.bottom,n.object.near=this.near,n.object.far=this.far,this.view!==null&&(n.object.view=Object.assign({},this.view)),n}}const Cr=-90,Rr=1;class zT extends Hn{constructor(e,n,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new ei(Cr,Rr,e,n);s.layers=this.layers,this.add(s);const r=new ei(Cr,Rr,e,n);r.layers=this.layers,this.add(r);const o=new ei(Cr,Rr,e,n);o.layers=this.layers,this.add(o);const a=new ei(Cr,Rr,e,n);a.layers=this.layers,this.add(a);const l=new ei(Cr,Rr,e,n);l.layers=this.layers,this.add(l);const c=new ei(Cr,Rr,e,n);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,n=this.children.concat(),[i,s,r,o,a,l]=n;for(const c of n)this.remove(c);if(e===Ti)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===wl)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of n)this.add(c),c.updateMatrixWorld()}update(e,n){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,l,c,u]=this.children,d=e.getRenderTarget(),f=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let m=!1;e.isWebGLRenderer===!0?m=e.state.buffers.depth.getReversed():m=e.reversedDepthBuffer,e.setRenderTarget(i,0,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(n,r),e.setRenderTarget(i,1,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(n,o),e.setRenderTarget(i,2,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(n,a),e.setRenderTarget(i,3,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(n,l),e.setRenderTarget(i,4,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(n,c),i.texture.generateMipmaps=_,e.setRenderTarget(i,5,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(n,u),e.setRenderTarget(d,f,p),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class VT extends ei{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const Gd=class Gd{constructor(e,n,i,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,n,i,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,n=0){for(let i=0;i<4;i++)this.elements[i]=e[i+n];return this}set(e,n,i,s){const r=this.elements;return r[0]=e,r[2]=n,r[1]=i,r[3]=s,this}};Gd.prototype.isMatrix2=!0;let hm=Gd;function pm(t,e,n,i){const s=HT(i);switch(n){case D0:return t*e;case U0:return t*e/s.components*s.byteLength;case Cd:return t*e/s.components*s.byteLength;case cr:return t*e*2/s.components*s.byteLength;case Rd:return t*e*2/s.components*s.byteLength;case N0:return t*e*3/s.components*s.byteLength;case ii:return t*e*4/s.components*s.byteLength;case Pd:return t*e*4/s.components*s.byteLength;case Ja:case Qa:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case el:case tl:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case of:case lf:return Math.max(t,16)*Math.max(e,8)/4;case rf:case af:return Math.max(t,8)*Math.max(e,8)/2;case cf:case uf:case df:case hf:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case ff:case El:case pf:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case mf:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case gf:return Math.floor((t+4)/5)*Math.floor((e+3)/4)*16;case _f:return Math.floor((t+4)/5)*Math.floor((e+4)/5)*16;case vf:return Math.floor((t+5)/6)*Math.floor((e+4)/5)*16;case xf:return Math.floor((t+5)/6)*Math.floor((e+5)/6)*16;case Sf:return Math.floor((t+7)/8)*Math.floor((e+4)/5)*16;case yf:return Math.floor((t+7)/8)*Math.floor((e+5)/6)*16;case bf:return Math.floor((t+7)/8)*Math.floor((e+7)/8)*16;case Ef:return Math.floor((t+9)/10)*Math.floor((e+4)/5)*16;case Mf:return Math.floor((t+9)/10)*Math.floor((e+5)/6)*16;case Tf:return Math.floor((t+9)/10)*Math.floor((e+7)/8)*16;case Af:return Math.floor((t+9)/10)*Math.floor((e+9)/10)*16;case wf:return Math.floor((t+11)/12)*Math.floor((e+9)/10)*16;case Cf:return Math.floor((t+11)/12)*Math.floor((e+11)/12)*16;case Rf:case Pf:case If:return Math.ceil(t/4)*Math.ceil(e/4)*16;case Lf:case Df:return Math.ceil(t/4)*Math.ceil(e/4)*8;case Ml:case Nf:return Math.ceil(t/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${n} format.`)}function HT(t){switch(t){case Yn:case R0:return{byteLength:1,components:1};case Jo:case P0:case rs:return{byteLength:2,components:1};case Ad:case wd:return{byteLength:2,components:4};case Di:case Td:case Mi:return{byteLength:4,components:1};case I0:case L0:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${t}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Md}}));typeof window<"u"&&(window.__THREE__?je("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Md);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function K0(){let t=null,e=!1,n=null,i=null;function s(r,o){n(r,o),i=t.requestAnimationFrame(s)}return{start:function(){e!==!0&&n!==null&&t!==null&&(i=t.requestAnimationFrame(s),e=!0)},stop:function(){t!==null&&t.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){n=r},setContext:function(r){t=r}}}function GT(t){const e=new WeakMap;function n(a,l){const c=a.array,u=a.usage,d=c.byteLength,f=t.createBuffer();t.bindBuffer(l,f),t.bufferData(l,c,u),a.onUploadCallback();let p;if(c instanceof Float32Array)p=t.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)p=t.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?p=t.HALF_FLOAT:p=t.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=t.SHORT;else if(c instanceof Uint32Array)p=t.UNSIGNED_INT;else if(c instanceof Int32Array)p=t.INT;else if(c instanceof Int8Array)p=t.BYTE;else if(c instanceof Uint8Array)p=t.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=t.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:d}}function i(a,l,c){const u=l.array,d=l.updateRanges;if(t.bindBuffer(c,a),d.length===0)t.bufferSubData(c,0,u);else{d.sort((p,g)=>p.start-g.start);let f=0;for(let p=1;p<d.length;p++){const g=d[f],_=d[p];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++f,d[f]=_)}d.length=f+1;for(let p=0,g=d.length;p<g;p++){const _=d[p];t.bufferSubData(c,_.start*u.BYTES_PER_ELEMENT,u,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=e.get(a);l&&(t.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=e.get(a);if(c===void 0)e.set(a,n(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var WT=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,$T=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,XT=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,qT=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,KT=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,YT=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,jT=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,ZT=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,JT=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,QT=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,eA=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,tA=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,nA=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iA=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,sA=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,rA=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,oA=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,aA=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,lA=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,cA=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,uA=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,fA=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,dA=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,hA=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,pA=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,mA=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,gA=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,_A=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,vA=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,xA=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,SA="gl_FragColor = linearToOutputTexel( gl_FragColor );",yA=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,bA=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,EA=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,MA=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,TA=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,AA=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,wA=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,CA=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,RA=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,PA=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,IA=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,LA=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,DA=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,NA=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,UA=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,OA=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,FA=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,kA=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,BA=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,zA=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,VA=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,HA=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,GA=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = inverseTransformDirection( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,WA=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,$A=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,XA=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,qA=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,KA=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,YA=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,jA=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,ZA=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,JA=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,QA=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,ew=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,tw=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,nw=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,iw=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,sw=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,rw=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ow=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,aw=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,lw=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,cw=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,uw=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,fw=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,dw=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,hw=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,pw=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,mw=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,gw=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,_w=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,vw=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,xw=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,Sw=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,yw=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,bw=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Ew=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Mw=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Tw=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Aw=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,ww=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Cw=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Rw=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Pw=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Iw=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Lw=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Dw=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Nw=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Uw=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Ow=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Fw=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,kw=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Bw=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,zw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Vw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Hw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Gw=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Ww=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,$w=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Xw=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,qw=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Kw=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Yw=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,jw=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Zw=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Jw=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Qw=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,e2=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,t2=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,n2=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,i2=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,s2=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,r2=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,o2=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,a2=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,l2=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,c2=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,u2=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,f2=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,d2=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,h2=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,p2=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,m2=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,g2=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,_2=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,v2=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,x2=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,S2=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,y2=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,b2=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,E2=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,ot={alphahash_fragment:WT,alphahash_pars_fragment:$T,alphamap_fragment:XT,alphamap_pars_fragment:qT,alphatest_fragment:KT,alphatest_pars_fragment:YT,aomap_fragment:jT,aomap_pars_fragment:ZT,batching_pars_vertex:JT,batching_vertex:QT,begin_vertex:eA,beginnormal_vertex:tA,bsdfs:nA,iridescence_fragment:iA,bumpmap_pars_fragment:sA,clipping_planes_fragment:rA,clipping_planes_pars_fragment:oA,clipping_planes_pars_vertex:aA,clipping_planes_vertex:lA,color_fragment:cA,color_pars_fragment:uA,color_pars_vertex:fA,color_vertex:dA,common:hA,cube_uv_reflection_fragment:pA,defaultnormal_vertex:mA,displacementmap_pars_vertex:gA,displacementmap_vertex:_A,emissivemap_fragment:vA,emissivemap_pars_fragment:xA,colorspace_fragment:SA,colorspace_pars_fragment:yA,envmap_fragment:bA,envmap_common_pars_fragment:EA,envmap_pars_fragment:MA,envmap_pars_vertex:TA,envmap_physical_pars_fragment:OA,envmap_vertex:AA,fog_vertex:wA,fog_pars_vertex:CA,fog_fragment:RA,fog_pars_fragment:PA,gradientmap_pars_fragment:IA,lightmap_pars_fragment:LA,lights_lambert_fragment:DA,lights_lambert_pars_fragment:NA,lights_pars_begin:UA,lights_toon_fragment:FA,lights_toon_pars_fragment:kA,lights_phong_fragment:BA,lights_phong_pars_fragment:zA,lights_physical_fragment:VA,lights_physical_pars_fragment:HA,lights_fragment_begin:GA,lights_fragment_maps:WA,lights_fragment_end:$A,lightprobes_pars_fragment:XA,logdepthbuf_fragment:qA,logdepthbuf_pars_fragment:KA,logdepthbuf_pars_vertex:YA,logdepthbuf_vertex:jA,map_fragment:ZA,map_pars_fragment:JA,map_particle_fragment:QA,map_particle_pars_fragment:ew,metalnessmap_fragment:tw,metalnessmap_pars_fragment:nw,morphinstance_vertex:iw,morphcolor_vertex:sw,morphnormal_vertex:rw,morphtarget_pars_vertex:ow,morphtarget_vertex:aw,normal_fragment_begin:lw,normal_fragment_maps:cw,normal_pars_fragment:uw,normal_pars_vertex:fw,normal_vertex:dw,normalmap_pars_fragment:hw,clearcoat_normal_fragment_begin:pw,clearcoat_normal_fragment_maps:mw,clearcoat_pars_fragment:gw,iridescence_pars_fragment:_w,opaque_fragment:vw,packing:xw,premultiplied_alpha_fragment:Sw,project_vertex:yw,dithering_fragment:bw,dithering_pars_fragment:Ew,roughnessmap_fragment:Mw,roughnessmap_pars_fragment:Tw,shadowmap_pars_fragment:Aw,shadowmap_pars_vertex:ww,shadowmap_vertex:Cw,shadowmask_pars_fragment:Rw,skinbase_vertex:Pw,skinning_pars_vertex:Iw,skinning_vertex:Lw,skinnormal_vertex:Dw,specularmap_fragment:Nw,specularmap_pars_fragment:Uw,tonemapping_fragment:Ow,tonemapping_pars_fragment:Fw,transmission_fragment:kw,transmission_pars_fragment:Bw,uv_pars_fragment:zw,uv_pars_vertex:Vw,uv_vertex:Hw,worldpos_vertex:Gw,background_vert:Ww,background_frag:$w,backgroundCube_vert:Xw,backgroundCube_frag:qw,cube_vert:Kw,cube_frag:Yw,depth_vert:jw,depth_frag:Zw,distance_vert:Jw,distance_frag:Qw,equirect_vert:e2,equirect_frag:t2,linedashed_vert:n2,linedashed_frag:i2,meshbasic_vert:s2,meshbasic_frag:r2,meshlambert_vert:o2,meshlambert_frag:a2,meshmatcap_vert:l2,meshmatcap_frag:c2,meshnormal_vert:u2,meshnormal_frag:f2,meshphong_vert:d2,meshphong_frag:h2,meshphysical_vert:p2,meshphysical_frag:m2,meshtoon_vert:g2,meshtoon_frag:_2,points_vert:v2,points_frag:x2,shadow_vert:S2,shadow_frag:y2,sprite_vert:b2,sprite_frag:E2},De={common:{diffuse:{value:new It(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new tt},alphaMap:{value:null},alphaMapTransform:{value:new tt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new tt}},envmap:{envMap:{value:null},envMapRotation:{value:new tt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new tt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new tt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new tt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new tt},normalScale:{value:new mt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new tt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new tt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new tt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new tt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new It(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new se},probesMax:{value:new se},probesResolution:{value:new se}},points:{diffuse:{value:new It(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new tt},alphaTest:{value:0},uvTransform:{value:new tt}},sprite:{diffuse:{value:new It(16777215)},opacity:{value:1},center:{value:new mt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new tt},alphaMap:{value:null},alphaMapTransform:{value:new tt},alphaTest:{value:0}}},Ei={basic:{uniforms:bn([De.common,De.specularmap,De.envmap,De.aomap,De.lightmap,De.fog]),vertexShader:ot.meshbasic_vert,fragmentShader:ot.meshbasic_frag},lambert:{uniforms:bn([De.common,De.specularmap,De.envmap,De.aomap,De.lightmap,De.emissivemap,De.bumpmap,De.normalmap,De.displacementmap,De.fog,De.lights,{emissive:{value:new It(0)},envMapIntensity:{value:1}}]),vertexShader:ot.meshlambert_vert,fragmentShader:ot.meshlambert_frag},phong:{uniforms:bn([De.common,De.specularmap,De.envmap,De.aomap,De.lightmap,De.emissivemap,De.bumpmap,De.normalmap,De.displacementmap,De.fog,De.lights,{emissive:{value:new It(0)},specular:{value:new It(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:ot.meshphong_vert,fragmentShader:ot.meshphong_frag},standard:{uniforms:bn([De.common,De.envmap,De.aomap,De.lightmap,De.emissivemap,De.bumpmap,De.normalmap,De.displacementmap,De.roughnessmap,De.metalnessmap,De.fog,De.lights,{emissive:{value:new It(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ot.meshphysical_vert,fragmentShader:ot.meshphysical_frag},toon:{uniforms:bn([De.common,De.aomap,De.lightmap,De.emissivemap,De.bumpmap,De.normalmap,De.displacementmap,De.gradientmap,De.fog,De.lights,{emissive:{value:new It(0)}}]),vertexShader:ot.meshtoon_vert,fragmentShader:ot.meshtoon_frag},matcap:{uniforms:bn([De.common,De.bumpmap,De.normalmap,De.displacementmap,De.fog,{matcap:{value:null}}]),vertexShader:ot.meshmatcap_vert,fragmentShader:ot.meshmatcap_frag},points:{uniforms:bn([De.points,De.fog]),vertexShader:ot.points_vert,fragmentShader:ot.points_frag},dashed:{uniforms:bn([De.common,De.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ot.linedashed_vert,fragmentShader:ot.linedashed_frag},depth:{uniforms:bn([De.common,De.displacementmap]),vertexShader:ot.depth_vert,fragmentShader:ot.depth_frag},normal:{uniforms:bn([De.common,De.bumpmap,De.normalmap,De.displacementmap,{opacity:{value:1}}]),vertexShader:ot.meshnormal_vert,fragmentShader:ot.meshnormal_frag},sprite:{uniforms:bn([De.sprite,De.fog]),vertexShader:ot.sprite_vert,fragmentShader:ot.sprite_frag},background:{uniforms:{uvTransform:{value:new tt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ot.background_vert,fragmentShader:ot.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new tt}},vertexShader:ot.backgroundCube_vert,fragmentShader:ot.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ot.cube_vert,fragmentShader:ot.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ot.equirect_vert,fragmentShader:ot.equirect_frag},distance:{uniforms:bn([De.common,De.displacementmap,{referencePosition:{value:new se},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ot.distance_vert,fragmentShader:ot.distance_frag},shadow:{uniforms:bn([De.lights,De.fog,{color:{value:new It(0)},opacity:{value:1}}]),vertexShader:ot.shadow_vert,fragmentShader:ot.shadow_frag}};Ei.physical={uniforms:bn([Ei.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new tt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new tt},clearcoatNormalScale:{value:new mt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new tt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new tt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new tt},sheen:{value:0},sheenColor:{value:new It(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new tt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new tt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new tt},transmissionSamplerSize:{value:new mt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new tt},attenuationDistance:{value:0},attenuationColor:{value:new It(0)},specularColor:{value:new It(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new tt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new tt},anisotropyVector:{value:new mt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new tt}}]),vertexShader:ot.meshphysical_vert,fragmentShader:ot.meshphysical_frag};const Ha={r:0,b:0,g:0},M2=new sn,Y0=new tt;Y0.set(-1,0,0,0,1,0,0,0,1);function T2(t,e,n,i,s,r){const o=new It(0);let a=s===!0?0:1,l,c,u=null,d=0,f=null;function p(v){let b=v.isScene===!0?v.background:null;if(b&&b.isTexture){const x=v.backgroundBlurriness>0;b=e.get(b,x)}return b}function g(v){let b=!1;const x=p(v);x===null?m(o,a):x&&x.isColor&&(m(x,1),b=!0);const D=t.xr.getEnvironmentBlendMode();D==="additive"?n.buffers.color.setClear(0,0,0,1,r):D==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,r),(t.autoClear||b)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil))}function _(v,b){const x=p(b);x&&(x.isCubeTexture||x.mapping===ic)?(c===void 0&&(c=new Ni(new aa(1,1,1),new ci({name:"BackgroundCubeMaterial",uniforms:eo(Ei.backgroundCube.uniforms),vertexShader:Ei.backgroundCube.vertexShader,fragmentShader:Ei.backgroundCube.fragmentShader,side:Dn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(D,C,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),c.material.uniforms.envMap.value=x,c.material.uniforms.backgroundBlurriness.value=b.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(M2.makeRotationFromEuler(b.backgroundRotation)).transpose(),x.isCubeTexture&&x.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Y0),c.material.toneMapped=ct.getTransfer(x.colorSpace)!==Tt,(u!==x||d!==x.version||f!==t.toneMapping)&&(c.material.needsUpdate=!0,u=x,d=x.version,f=t.toneMapping),c.layers.enableAll(),v.unshift(c,c.geometry,c.material,0,0,null)):x&&x.isTexture&&(l===void 0&&(l=new Ni(new la(2,2),new ci({name:"BackgroundMaterial",uniforms:eo(Ei.background.uniforms),vertexShader:Ei.background.vertexShader,fragmentShader:Ei.background.fragmentShader,side:Is,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=x,l.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,l.material.toneMapped=ct.getTransfer(x.colorSpace)!==Tt,x.matrixAutoUpdate===!0&&x.updateMatrix(),l.material.uniforms.uvTransform.value.copy(x.matrix),(u!==x||d!==x.version||f!==t.toneMapping)&&(l.material.needsUpdate=!0,u=x,d=x.version,f=t.toneMapping),l.layers.enableAll(),v.unshift(l,l.geometry,l.material,0,0,null))}function m(v,b){v.getRGB(Ha,X0(t)),n.buffers.color.setClear(Ha.r,Ha.g,Ha.b,b,r)}function h(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(v,b=1){o.set(v),a=b,m(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(v){a=v,m(o,a)},render:g,addToRenderList:_,dispose:h}}function A2(t,e){const n=t.getParameter(t.MAX_VERTEX_ATTRIBS),i={},s=f(null);let r=s,o=!1;function a(E,P,B,Z,G){let X=!1;const $=d(E,Z,B,P);r!==$&&(r=$,c(r.object)),X=p(E,Z,B,G),X&&g(E,Z,B,G),G!==null&&e.update(G,t.ELEMENT_ARRAY_BUFFER),(X||o)&&(o=!1,x(E,P,B,Z),G!==null&&t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,e.get(G).buffer))}function l(){return t.createVertexArray()}function c(E){return t.bindVertexArray(E)}function u(E){return t.deleteVertexArray(E)}function d(E,P,B,Z){const G=Z.wireframe===!0;let X=i[P.id];X===void 0&&(X={},i[P.id]=X);const $=E.isInstancedMesh===!0?E.id:0;let le=X[$];le===void 0&&(le={},X[$]=le);let me=le[B.id];me===void 0&&(me={},le[B.id]=me);let Se=me[G];return Se===void 0&&(Se=f(l()),me[G]=Se),Se}function f(E){const P=[],B=[],Z=[];for(let G=0;G<n;G++)P[G]=0,B[G]=0,Z[G]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:B,attributeDivisors:Z,object:E,attributes:{},index:null}}function p(E,P,B,Z){const G=r.attributes,X=P.attributes;let $=0;const le=B.getAttributes();for(const me in le)if(le[me].location>=0){const Ce=G[me];let Pe=X[me];if(Pe===void 0&&(me==="instanceMatrix"&&E.instanceMatrix&&(Pe=E.instanceMatrix),me==="instanceColor"&&E.instanceColor&&(Pe=E.instanceColor)),Ce===void 0||Ce.attribute!==Pe||Pe&&Ce.data!==Pe.data)return!0;$++}return r.attributesNum!==$||r.index!==Z}function g(E,P,B,Z){const G={},X=P.attributes;let $=0;const le=B.getAttributes();for(const me in le)if(le[me].location>=0){let Ce=X[me];Ce===void 0&&(me==="instanceMatrix"&&E.instanceMatrix&&(Ce=E.instanceMatrix),me==="instanceColor"&&E.instanceColor&&(Ce=E.instanceColor));const Pe={};Pe.attribute=Ce,Ce&&Ce.data&&(Pe.data=Ce.data),G[me]=Pe,$++}r.attributes=G,r.attributesNum=$,r.index=Z}function _(){const E=r.newAttributes;for(let P=0,B=E.length;P<B;P++)E[P]=0}function m(E){h(E,0)}function h(E,P){const B=r.newAttributes,Z=r.enabledAttributes,G=r.attributeDivisors;B[E]=1,Z[E]===0&&(t.enableVertexAttribArray(E),Z[E]=1),G[E]!==P&&(t.vertexAttribDivisor(E,P),G[E]=P)}function v(){const E=r.newAttributes,P=r.enabledAttributes;for(let B=0,Z=P.length;B<Z;B++)P[B]!==E[B]&&(t.disableVertexAttribArray(B),P[B]=0)}function b(E,P,B,Z,G,X,$){$===!0?t.vertexAttribIPointer(E,P,B,G,X):t.vertexAttribPointer(E,P,B,Z,G,X)}function x(E,P,B,Z){_();const G=Z.attributes,X=B.getAttributes(),$=P.defaultAttributeValues;for(const le in X){const me=X[le];if(me.location>=0){let Se=G[le];if(Se===void 0&&(le==="instanceMatrix"&&E.instanceMatrix&&(Se=E.instanceMatrix),le==="instanceColor"&&E.instanceColor&&(Se=E.instanceColor)),Se!==void 0){const Ce=Se.normalized,Pe=Se.itemSize,Ke=e.get(Se);if(Ke===void 0)continue;const Qe=Ke.buffer,Ge=Ke.type,ue=Ke.bytesPerElement,j=Ge===t.INT||Ge===t.UNSIGNED_INT||Se.gpuType===Td;if(Se.isInterleavedBufferAttribute){const te=Se.data,fe=te.stride,ge=Se.offset;if(te.isInstancedInterleavedBuffer){for(let ye=0;ye<me.locationSize;ye++)h(me.location+ye,te.meshPerAttribute);E.isInstancedMesh!==!0&&Z._maxInstanceCount===void 0&&(Z._maxInstanceCount=te.meshPerAttribute*te.count)}else for(let ye=0;ye<me.locationSize;ye++)m(me.location+ye);t.bindBuffer(t.ARRAY_BUFFER,Qe);for(let ye=0;ye<me.locationSize;ye++)b(me.location+ye,Pe/me.locationSize,Ge,Ce,fe*ue,(ge+Pe/me.locationSize*ye)*ue,j)}else{if(Se.isInstancedBufferAttribute){for(let te=0;te<me.locationSize;te++)h(me.location+te,Se.meshPerAttribute);E.isInstancedMesh!==!0&&Z._maxInstanceCount===void 0&&(Z._maxInstanceCount=Se.meshPerAttribute*Se.count)}else for(let te=0;te<me.locationSize;te++)m(me.location+te);t.bindBuffer(t.ARRAY_BUFFER,Qe);for(let te=0;te<me.locationSize;te++)b(me.location+te,Pe/me.locationSize,Ge,Ce,Pe*ue,Pe/me.locationSize*te*ue,j)}}else if($!==void 0){const Ce=$[le];if(Ce!==void 0)switch(Ce.length){case 2:t.vertexAttrib2fv(me.location,Ce);break;case 3:t.vertexAttrib3fv(me.location,Ce);break;case 4:t.vertexAttrib4fv(me.location,Ce);break;default:t.vertexAttrib1fv(me.location,Ce)}}}}v()}function D(){M();for(const E in i){const P=i[E];for(const B in P){const Z=P[B];for(const G in Z){const X=Z[G];for(const $ in X)u(X[$].object),delete X[$];delete Z[G]}}delete i[E]}}function C(E){if(i[E.id]===void 0)return;const P=i[E.id];for(const B in P){const Z=P[B];for(const G in Z){const X=Z[G];for(const $ in X)u(X[$].object),delete X[$];delete Z[G]}}delete i[E.id]}function R(E){for(const P in i){const B=i[P];for(const Z in B){const G=B[Z];if(G[E.id]===void 0)continue;const X=G[E.id];for(const $ in X)u(X[$].object),delete X[$];delete G[E.id]}}}function S(E){for(const P in i){const B=i[P],Z=E.isInstancedMesh===!0?E.id:0,G=B[Z];if(G!==void 0){for(const X in G){const $=G[X];for(const le in $)u($[le].object),delete $[le];delete G[X]}delete B[Z],Object.keys(B).length===0&&delete i[P]}}}function M(){L(),o=!0,r!==s&&(r=s,c(r.object))}function L(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:M,resetDefaultState:L,dispose:D,releaseStatesOfGeometry:C,releaseStatesOfObject:S,releaseStatesOfProgram:R,initAttributes:_,enableAttribute:m,disableUnusedAttributes:v}}function w2(t,e,n){let i;function s(l){i=l}function r(l,c){t.drawArrays(i,l,c),n.update(c,i,1)}function o(l,c,u){u!==0&&(t.drawArraysInstanced(i,l,c,u),n.update(c,i,u))}function a(l,c,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,c,0,u);let f=0;for(let p=0;p<u;p++)f+=c[p];n.update(f,i,1)}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a}function C2(t,e,n,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const R=e.get("EXT_texture_filter_anisotropic");s=t.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(R){return!(R!==ii&&i.convert(R)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(R){const S=R===rs&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==Yn&&i.convert(R)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==Mi&&!S)}function l(R){if(R==="highp"){if(t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.HIGH_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.MEDIUM_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=n.precision!==void 0?n.precision:"highp";const u=l(c);u!==c&&(je("WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const d=n.logarithmicDepthBuffer===!0,f=n.reversedDepthBuffer===!0&&e.has("EXT_clip_control");n.reversedDepthBuffer===!0&&f===!1&&je("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const p=t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS),g=t.getParameter(t.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=t.getParameter(t.MAX_TEXTURE_SIZE),m=t.getParameter(t.MAX_CUBE_MAP_TEXTURE_SIZE),h=t.getParameter(t.MAX_VERTEX_ATTRIBS),v=t.getParameter(t.MAX_VERTEX_UNIFORM_VECTORS),b=t.getParameter(t.MAX_VARYING_VECTORS),x=t.getParameter(t.MAX_FRAGMENT_UNIFORM_VECTORS),D=t.getParameter(t.MAX_SAMPLES),C=t.getParameter(t.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:h,maxVertexUniforms:v,maxVaryings:b,maxFragmentUniforms:x,maxSamples:D,samples:C}}function R2(t){const e=this;let n=null,i=0,s=!1,r=!1;const o=new qs,a=new tt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,f){const p=d.length!==0||f||i!==0||s;return s=f,i=d.length,p},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,f){n=u(d,f,0)},this.setState=function(d,f,p){const g=d.clippingPlanes,_=d.clipIntersection,m=d.clipShadows,h=t.get(d);if(!s||g===null||g.length===0||r&&!m)r?u(null):c();else{const v=r?0:i,b=v*4;let x=h.clippingState||null;l.value=x,x=u(g,f,b,p);for(let D=0;D!==b;++D)x[D]=n[D];h.clippingState=x,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=v}};function c(){l.value!==n&&(l.value=n,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(d,f,p,g){const _=d!==null?d.length:0;let m=null;if(_!==0){if(m=l.value,g!==!0||m===null){const h=p+_*4,v=f.matrixWorldInverse;a.getNormalMatrix(v),(m===null||m.length<h)&&(m=new Float32Array(h));for(let b=0,x=p;b!==_;++b,x+=4)o.copy(d[b]).applyMatrix4(v,a),o.normal.toArray(m,x),m[x+3]=o.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,m}}const Cs=4,mm=[.125,.215,.35,.446,.526,.582],Js=20,P2=256,bo=new Ud,gm=new It;let su=null,ru=0,ou=0,au=!1;const I2=new se;class _m{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,n=0,i=.1,s=100,r={}){const{size:o=256,position:a=I2}=r;su=this._renderer.getRenderTarget(),ru=this._renderer.getActiveCubeFace(),ou=this._renderer.getActiveMipmapLevel(),au=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,s,l,a),n>0&&this._blur(l,0,0,n),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,n=null){return this._fromTexture(e,n)}fromCubemap(e,n=null){return this._fromTexture(e,n)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Sm(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=xm(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(su,ru,ou),this._renderer.xr.enabled=au,e.scissorTest=!1,Pr(e,0,0,e.width,e.height)}_fromTexture(e,n){e.mapping===lr||e.mapping===Jr?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),su=this._renderer.getRenderTarget(),ru=this._renderer.getActiveCubeFace(),ou=this._renderer.getActiveMipmapLevel(),au=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=n||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),n=4*this._cubeSize,i={magFilter:Sn,minFilter:Sn,generateMipmaps:!1,type:rs,format:ii,colorSpace:Tl,depthBuffer:!1},s=vm(e,n,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==n){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=vm(e,n,i);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=L2(r)),this._blurMaterial=N2(r,e,n),this._ggxMaterial=D2(r,e,n)}return s}_compileMaterial(e){const n=new Ni(new ls,e);this._renderer.compile(n,bo)}_sceneToCubeUV(e,n,i,s,r){const l=new ei(90,1,n,i),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],d=this._renderer,f=d.autoClear,p=d.toneMapping;d.getClearColor(gm),d.toneMapping=Ri,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(s),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Ni(new aa,new H0({name:"PMREM.Background",side:Dn,depthWrite:!1,depthTest:!1})));const _=this._backgroundBox,m=_.material;let h=!1;const v=e.background;v?v.isColor&&(m.color.copy(v),e.background=null,h=!0):(m.color.copy(gm),h=!0);for(let b=0;b<6;b++){const x=b%3;x===0?(l.up.set(0,c[b],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+u[b],r.y,r.z)):x===1?(l.up.set(0,0,c[b]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+u[b],r.z)):(l.up.set(0,c[b],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+u[b]));const D=this._cubeSize;Pr(s,x*D,b>2?D:0,D,D),d.setRenderTarget(s),h&&d.render(_,l),d.render(e,l)}d.toneMapping=p,d.autoClear=f,e.background=v}_textureToCubeUV(e,n){const i=this._renderer,s=e.mapping===lr||e.mapping===Jr;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Sm()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=xm());const r=s?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=r;const a=r.uniforms;a.envMap.value=e;const l=this._cubeSize;Pr(n,0,0,3*l,2*l),i.setRenderTarget(n),i.render(o,bo)}_applyPMREM(e){const n=this._renderer,i=n.autoClear;n.autoClear=!1;const s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);n.autoClear=i}_applyGGXFilter(e,n,i){const s=this._renderer,r=this._pingPongRenderTarget,o=this._ggxMaterial,a=this._lodMeshes[i];a.material=o;const l=o.uniforms,c=i/(this._lodMeshes.length-1),u=n/(this._lodMeshes.length-1),d=Math.sqrt(c*c-u*u),f=0+c*1.25,p=d*f,{_lodMax:g}=this,_=this._sizeLods[i],m=3*_*(i>g-Cs?i-g+Cs:0),h=4*(this._cubeSize-_);l.envMap.value=e.texture,l.roughness.value=p,l.mipInt.value=g-n,Pr(r,m,h,3*_,2*_),s.setRenderTarget(r),s.render(a,bo),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=g-i,Pr(e,m,h,3*_,2*_),s.setRenderTarget(e),s.render(a,bo)}_blur(e,n,i,s,r){const o=this._pingPongRenderTarget;this._halfBlur(e,o,n,i,s,"latitudinal",r),this._halfBlur(o,e,i,i,s,"longitudinal",r)}_halfBlur(e,n,i,s,r,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&pt("blur direction must be either latitudinal or longitudinal!");const u=3,d=this._lodMeshes[s];d.material=c;const f=c.uniforms,p=this._sizeLods[i]-1,g=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*Js-1),_=r/g,m=isFinite(r)?1+Math.floor(u*_):Js;m>Js&&je(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Js}`);const h=[];let v=0;for(let R=0;R<Js;++R){const S=R/_,M=Math.exp(-S*S/2);h.push(M),R===0?v+=M:R<m&&(v+=2*M)}for(let R=0;R<h.length;R++)h[R]=h[R]/v;f.envMap.value=e.texture,f.samples.value=m,f.weights.value=h,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);const{_lodMax:b}=this;f.dTheta.value=g,f.mipInt.value=b-i;const x=this._sizeLods[s],D=3*x*(s>b-Cs?s-b+Cs:0),C=4*(this._cubeSize-x);Pr(n,D,C,3*x,2*x),l.setRenderTarget(n),l.render(d,bo)}}function L2(t){const e=[],n=[],i=[];let s=t;const r=t-Cs+1+mm.length;for(let o=0;o<r;o++){const a=Math.pow(2,s);e.push(a);let l=1/a;o>t-Cs?l=mm[o-t+Cs-1]:o===0&&(l=0),n.push(l);const c=1/(a-2),u=-c,d=1+c,f=[u,u,d,u,d,d,u,u,d,d,u,d],p=6,g=6,_=3,m=2,h=1,v=new Float32Array(_*g*p),b=new Float32Array(m*g*p),x=new Float32Array(h*g*p);for(let C=0;C<p;C++){const R=C%3*2/3-1,S=C>2?0:-1,M=[R,S,0,R+2/3,S,0,R+2/3,S+1,0,R,S,0,R+2/3,S+1,0,R,S+1,0];v.set(M,_*g*C),b.set(f,m*g*C);const L=[C,C,C,C,C,C];x.set(L,h*g*C)}const D=new ls;D.setAttribute("position",new Ii(v,_)),D.setAttribute("uv",new Ii(b,m)),D.setAttribute("faceIndex",new Ii(x,h)),i.push(new Ni(D,null)),s>Cs&&s--}return{lodMeshes:i,sizeLods:e,sigmas:n}}function vm(t,e,n){const i=new Pi(t,e,n);return i.texture.mapping=ic,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Pr(t,e,n,i,s){t.viewport.set(e,n,i,s),t.scissor.set(e,n,i,s)}function D2(t,e,n){return new ci({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:P2,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:rc(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Qi,depthTest:!1,depthWrite:!1})}function N2(t,e,n){const i=new Float32Array(Js),s=new se(0,1,0);return new ci({name:"SphericalGaussianBlur",defines:{n:Js,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:rc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Qi,depthTest:!1,depthWrite:!1})}function xm(){return new ci({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:rc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Qi,depthTest:!1,depthWrite:!1})}function Sm(){return new ci({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:rc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Qi,depthTest:!1,depthWrite:!1})}function rc(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}class j0 extends Pi{constructor(e=1,n={}){super(e,e,n),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new W0(s),this._setTextureOptions(n),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new aa(5,5,5),r=new ci({name:"CubemapFromEquirect",uniforms:eo(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Dn,blending:Qi});r.uniforms.tEquirect.value=n;const o=new Ni(s,r),a=n.minFilter;return n.minFilter===nr&&(n.minFilter=Sn),new zT(1,10,this).update(e,o),n.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,n=!0,i=!0,s=!0){const r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(n,i,s);e.setRenderTarget(r)}}function U2(t){let e=new WeakMap,n=new WeakMap,i=null;function s(f,p=!1){return f==null?null:p?o(f):r(f)}function r(f){if(f&&f.isTexture){const p=f.mapping;if(p===Ic||p===Lc)if(e.has(f)){const g=e.get(f).texture;return a(g,f.mapping)}else{const g=f.image;if(g&&g.height>0){const _=new j0(g.height);return _.fromEquirectangularTexture(t,f),e.set(f,_),f.addEventListener("dispose",c),a(_.texture,f.mapping)}else return null}}return f}function o(f){if(f&&f.isTexture){const p=f.mapping,g=p===Ic||p===Lc,_=p===lr||p===Jr;if(g||_){let m=n.get(f);const h=m!==void 0?m.texture.pmremVersion:0;if(f.isRenderTargetTexture&&f.pmremVersion!==h)return i===null&&(i=new _m(t)),m=g?i.fromEquirectangular(f,m):i.fromCubemap(f,m),m.texture.pmremVersion=f.pmremVersion,n.set(f,m),m.texture;if(m!==void 0)return m.texture;{const v=f.image;return g&&v&&v.height>0||_&&v&&l(v)?(i===null&&(i=new _m(t)),m=g?i.fromEquirectangular(f):i.fromCubemap(f),m.texture.pmremVersion=f.pmremVersion,n.set(f,m),f.addEventListener("dispose",u),m.texture):null}}}return f}function a(f,p){return p===Ic?f.mapping=lr:p===Lc&&(f.mapping=Jr),f}function l(f){let p=0;const g=6;for(let _=0;_<g;_++)f[_]!==void 0&&p++;return p===g}function c(f){const p=f.target;p.removeEventListener("dispose",c);const g=e.get(p);g!==void 0&&(e.delete(p),g.dispose())}function u(f){const p=f.target;p.removeEventListener("dispose",u);const g=n.get(p);g!==void 0&&(n.delete(p),g.dispose())}function d(){e=new WeakMap,n=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:s,dispose:d}}function O2(t){const e={};function n(i){if(e[i]!==void 0)return e[i];const s=t.getExtension(i);return e[i]=s,s}return{has:function(i){return n(i)!==null},init:function(){n("EXT_color_buffer_float"),n("WEBGL_clip_cull_distance"),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture"),n("WEBGL_render_shared_exponent")},get:function(i){const s=n(i);return s===null&&Uf("WebGLRenderer: "+i+" extension not supported."),s}}}function F2(t,e,n,i){const s={},r=new WeakMap;function o(d){const f=d.target;f.index!==null&&e.remove(f.index);for(const g in f.attributes)e.remove(f.attributes[g]);f.removeEventListener("dispose",o),delete s[f.id];const p=r.get(f);p&&(e.remove(p),r.delete(f)),i.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,n.memory.geometries--}function a(d,f){return s[f.id]===!0||(f.addEventListener("dispose",o),s[f.id]=!0,n.memory.geometries++),f}function l(d){const f=d.attributes;for(const p in f)e.update(f[p],t.ARRAY_BUFFER)}function c(d){const f=[],p=d.index,g=d.attributes.position;let _=0;if(g===void 0)return;if(p!==null){const v=p.array;_=p.version;for(let b=0,x=v.length;b<x;b+=3){const D=v[b+0],C=v[b+1],R=v[b+2];f.push(D,C,C,R,R,D)}}else{const v=g.array;_=g.version;for(let b=0,x=v.length/3-1;b<x;b+=3){const D=b+0,C=b+1,R=b+2;f.push(D,C,C,R,R,D)}}const m=new(g.count>=65535?V0:z0)(f,1);m.version=_;const h=r.get(d);h&&e.remove(h),r.set(d,m)}function u(d){const f=r.get(d);if(f){const p=d.index;p!==null&&f.version<p.version&&c(d)}else c(d);return r.get(d)}return{get:a,update:l,getWireframeAttribute:u}}function k2(t,e,n){let i;function s(d){i=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function l(d,f){t.drawElements(i,f,r,d*o),n.update(f,i,1)}function c(d,f,p){p!==0&&(t.drawElementsInstanced(i,f,r,d*o,p),n.update(f,i,p))}function u(d,f,p){if(p===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,f,0,r,d,0,p);let _=0;for(let m=0;m<p;m++)_+=f[m];n.update(_,i,1)}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u}function B2(t){const e={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,o,a){switch(n.calls++,o){case t.TRIANGLES:n.triangles+=a*(r/3);break;case t.LINES:n.lines+=a*(r/2);break;case t.LINE_STRIP:n.lines+=a*(r-1);break;case t.LINE_LOOP:n.lines+=a*r;break;case t.POINTS:n.points+=a*r;break;default:pt("WebGLInfo: Unknown draw mode:",o);break}}function s(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:e,render:n,programs:null,autoReset:!0,reset:s,update:i}}function z2(t,e,n){const i=new WeakMap,s=new Yt;function r(o,a,l){const c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,d=u!==void 0?u.length:0;let f=i.get(a);if(f===void 0||f.count!==d){let M=function(){R.dispose(),i.delete(a),a.removeEventListener("dispose",M)};f!==void 0&&f.texture.dispose();const p=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,_=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],h=a.morphAttributes.normal||[],v=a.morphAttributes.color||[];let b=0;p===!0&&(b=1),g===!0&&(b=2),_===!0&&(b=3);let x=a.attributes.position.count*b,D=1;x>e.maxTextureSize&&(D=Math.ceil(x/e.maxTextureSize),x=e.maxTextureSize);const C=new Float32Array(x*D*4*d),R=new F0(C,x,D,d);R.type=Mi,R.needsUpdate=!0;const S=b*4;for(let L=0;L<d;L++){const E=m[L],P=h[L],B=v[L],Z=x*D*4*L;for(let G=0;G<E.count;G++){const X=G*S;p===!0&&(s.fromBufferAttribute(E,G),C[Z+X+0]=s.x,C[Z+X+1]=s.y,C[Z+X+2]=s.z,C[Z+X+3]=0),g===!0&&(s.fromBufferAttribute(P,G),C[Z+X+4]=s.x,C[Z+X+5]=s.y,C[Z+X+6]=s.z,C[Z+X+7]=0),_===!0&&(s.fromBufferAttribute(B,G),C[Z+X+8]=s.x,C[Z+X+9]=s.y,C[Z+X+10]=s.z,C[Z+X+11]=B.itemSize===4?s.w:1)}}f={count:d,texture:R,size:new mt(x,D)},i.set(a,f),a.addEventListener("dispose",M)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(t,"morphTexture",o.morphTexture,n);else{let p=0;for(let _=0;_<c.length;_++)p+=c[_];const g=a.morphTargetsRelative?1:1-p;l.getUniforms().setValue(t,"morphTargetBaseInfluence",g),l.getUniforms().setValue(t,"morphTargetInfluences",c)}l.getUniforms().setValue(t,"morphTargetsTexture",f.texture,n),l.getUniforms().setValue(t,"morphTargetsTextureSize",f.size)}return{update:r}}function V2(t,e,n,i,s){let r=new WeakMap;function o(c){const u=s.render.frame,d=c.geometry,f=e.get(c,d);if(r.get(f)!==u&&(e.update(f),r.set(f,u)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==u&&(n.update(c.instanceMatrix,t.ARRAY_BUFFER),c.instanceColor!==null&&n.update(c.instanceColor,t.ARRAY_BUFFER),r.set(c,u))),c.isSkinnedMesh){const p=c.skeleton;r.get(p)!==u&&(p.update(),r.set(p,u))}return f}function a(){r=new WeakMap}function l(c){const u=c.target;u.removeEventListener("dispose",l),i.releaseStatesOfObject(u),n.remove(u.instanceMatrix),u.instanceColor!==null&&n.remove(u.instanceColor)}return{update:o,dispose:a}}const H2={[y0]:"LINEAR_TONE_MAPPING",[b0]:"REINHARD_TONE_MAPPING",[E0]:"CINEON_TONE_MAPPING",[M0]:"ACES_FILMIC_TONE_MAPPING",[A0]:"AGX_TONE_MAPPING",[w0]:"NEUTRAL_TONE_MAPPING",[T0]:"CUSTOM_TONE_MAPPING"};function G2(t,e,n,i,s){const r=new Pi(e,n,{type:t,depthBuffer:i,stencilBuffer:s,depthTexture:i?new Qr(e,n):void 0}),o=new Pi(e,n,{type:rs,depthBuffer:!1,stencilBuffer:!1}),a=new ls;a.setAttribute("position",new ts([-1,3,0,-1,-1,0,3,-1,0],3)),a.setAttribute("uv",new ts([0,2,0,0,2,0],2));const l=new FT({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),c=new Ni(a,l),u=new Ud(-1,1,1,-1,0,1);let d=null,f=null,p=!1,g,_=null,m=[],h=!1;this.setSize=function(v,b){r.setSize(v,b),o.setSize(v,b);for(let x=0;x<m.length;x++){const D=m[x];D.setSize&&D.setSize(v,b)}},this.setEffects=function(v){m=v,h=m.length>0&&m[0].isRenderPass===!0;const b=r.width,x=r.height;for(let D=0;D<m.length;D++){const C=m[D];C.setSize&&C.setSize(b,x)}},this.begin=function(v,b){if(p||v.toneMapping===Ri&&m.length===0)return!1;if(_=b,b!==null){const x=b.width,D=b.height;(r.width!==x||r.height!==D)&&this.setSize(x,D)}return h===!1&&v.setRenderTarget(r),g=v.toneMapping,v.toneMapping=Ri,!0},this.hasRenderPass=function(){return h},this.end=function(v,b){v.toneMapping=g,p=!0;let x=r,D=o;for(let C=0;C<m.length;C++){const R=m[C];if(R.enabled!==!1&&(R.render(v,D,x,b),R.needsSwap!==!1)){const S=x;x=D,D=S}}if(d!==v.outputColorSpace||f!==v.toneMapping){d=v.outputColorSpace,f=v.toneMapping,l.defines={},ct.getTransfer(d)===Tt&&(l.defines.SRGB_TRANSFER="");const C=H2[f];C&&(l.defines[C]=""),l.needsUpdate=!0}l.uniforms.tDiffuse.value=x.texture,v.setRenderTarget(_),v.render(c,u),_=null,p=!1},this.isCompositing=function(){return p},this.dispose=function(){r.depthTexture&&r.depthTexture.dispose(),r.dispose(),o.dispose(),a.dispose(),l.dispose()}}const Z0=new Pn,Ff=new Qr(1,1),J0=new F0,Q0=new hT,ev=new W0,ym=[],bm=[],Em=new Float32Array(16),Mm=new Float32Array(9),Tm=new Float32Array(4);function ao(t,e,n){const i=t[0];if(i<=0||i>0)return t;const s=e*n;let r=ym[s];if(r===void 0&&(r=new Float32Array(s),ym[s]=r),e!==0){i.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=n,t[o].toArray(r,a)}return r}function rn(t,e){if(t.length!==e.length)return!1;for(let n=0,i=t.length;n<i;n++)if(t[n]!==e[n])return!1;return!0}function on(t,e){for(let n=0,i=e.length;n<i;n++)t[n]=e[n]}function oc(t,e){let n=bm[e];n===void 0&&(n=new Int32Array(e),bm[e]=n);for(let i=0;i!==e;++i)n[i]=t.allocateTextureUnit();return n}function W2(t,e){const n=this.cache;n[0]!==e&&(t.uniform1f(this.addr,e),n[0]=e)}function $2(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2f(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(rn(n,e))return;t.uniform2fv(this.addr,e),on(n,e)}}function X2(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3f(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else if(e.r!==void 0)(n[0]!==e.r||n[1]!==e.g||n[2]!==e.b)&&(t.uniform3f(this.addr,e.r,e.g,e.b),n[0]=e.r,n[1]=e.g,n[2]=e.b);else{if(rn(n,e))return;t.uniform3fv(this.addr,e),on(n,e)}}function q2(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4f(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(rn(n,e))return;t.uniform4fv(this.addr,e),on(n,e)}}function K2(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(rn(n,e))return;t.uniformMatrix2fv(this.addr,!1,e),on(n,e)}else{if(rn(n,i))return;Tm.set(i),t.uniformMatrix2fv(this.addr,!1,Tm),on(n,i)}}function Y2(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(rn(n,e))return;t.uniformMatrix3fv(this.addr,!1,e),on(n,e)}else{if(rn(n,i))return;Mm.set(i),t.uniformMatrix3fv(this.addr,!1,Mm),on(n,i)}}function j2(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(rn(n,e))return;t.uniformMatrix4fv(this.addr,!1,e),on(n,e)}else{if(rn(n,i))return;Em.set(i),t.uniformMatrix4fv(this.addr,!1,Em),on(n,i)}}function Z2(t,e){const n=this.cache;n[0]!==e&&(t.uniform1i(this.addr,e),n[0]=e)}function J2(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2i(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(rn(n,e))return;t.uniform2iv(this.addr,e),on(n,e)}}function Q2(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3i(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(rn(n,e))return;t.uniform3iv(this.addr,e),on(n,e)}}function eC(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4i(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(rn(n,e))return;t.uniform4iv(this.addr,e),on(n,e)}}function tC(t,e){const n=this.cache;n[0]!==e&&(t.uniform1ui(this.addr,e),n[0]=e)}function nC(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2ui(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(rn(n,e))return;t.uniform2uiv(this.addr,e),on(n,e)}}function iC(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3ui(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(rn(n,e))return;t.uniform3uiv(this.addr,e),on(n,e)}}function sC(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4ui(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(rn(n,e))return;t.uniform4uiv(this.addr,e),on(n,e)}}function rC(t,e,n){const i=this.cache,s=n.allocateTextureUnit();i[0]!==s&&(t.uniform1i(this.addr,s),i[0]=s);let r;this.type===t.SAMPLER_2D_SHADOW?(Ff.compareFunction=n.isReversedDepthBuffer()?Ld:Id,r=Ff):r=Z0,n.setTexture2D(e||r,s)}function oC(t,e,n){const i=this.cache,s=n.allocateTextureUnit();i[0]!==s&&(t.uniform1i(this.addr,s),i[0]=s),n.setTexture3D(e||Q0,s)}function aC(t,e,n){const i=this.cache,s=n.allocateTextureUnit();i[0]!==s&&(t.uniform1i(this.addr,s),i[0]=s),n.setTextureCube(e||ev,s)}function lC(t,e,n){const i=this.cache,s=n.allocateTextureUnit();i[0]!==s&&(t.uniform1i(this.addr,s),i[0]=s),n.setTexture2DArray(e||J0,s)}function cC(t){switch(t){case 5126:return W2;case 35664:return $2;case 35665:return X2;case 35666:return q2;case 35674:return K2;case 35675:return Y2;case 35676:return j2;case 5124:case 35670:return Z2;case 35667:case 35671:return J2;case 35668:case 35672:return Q2;case 35669:case 35673:return eC;case 5125:return tC;case 36294:return nC;case 36295:return iC;case 36296:return sC;case 35678:case 36198:case 36298:case 36306:case 35682:return rC;case 35679:case 36299:case 36307:return oC;case 35680:case 36300:case 36308:case 36293:return aC;case 36289:case 36303:case 36311:case 36292:return lC}}function uC(t,e){t.uniform1fv(this.addr,e)}function fC(t,e){const n=ao(e,this.size,2);t.uniform2fv(this.addr,n)}function dC(t,e){const n=ao(e,this.size,3);t.uniform3fv(this.addr,n)}function hC(t,e){const n=ao(e,this.size,4);t.uniform4fv(this.addr,n)}function pC(t,e){const n=ao(e,this.size,4);t.uniformMatrix2fv(this.addr,!1,n)}function mC(t,e){const n=ao(e,this.size,9);t.uniformMatrix3fv(this.addr,!1,n)}function gC(t,e){const n=ao(e,this.size,16);t.uniformMatrix4fv(this.addr,!1,n)}function _C(t,e){t.uniform1iv(this.addr,e)}function vC(t,e){t.uniform2iv(this.addr,e)}function xC(t,e){t.uniform3iv(this.addr,e)}function SC(t,e){t.uniform4iv(this.addr,e)}function yC(t,e){t.uniform1uiv(this.addr,e)}function bC(t,e){t.uniform2uiv(this.addr,e)}function EC(t,e){t.uniform3uiv(this.addr,e)}function MC(t,e){t.uniform4uiv(this.addr,e)}function TC(t,e,n){const i=this.cache,s=e.length,r=oc(n,s);rn(i,r)||(t.uniform1iv(this.addr,r),on(i,r));let o;this.type===t.SAMPLER_2D_SHADOW?o=Ff:o=Z0;for(let a=0;a!==s;++a)n.setTexture2D(e[a]||o,r[a])}function AC(t,e,n){const i=this.cache,s=e.length,r=oc(n,s);rn(i,r)||(t.uniform1iv(this.addr,r),on(i,r));for(let o=0;o!==s;++o)n.setTexture3D(e[o]||Q0,r[o])}function wC(t,e,n){const i=this.cache,s=e.length,r=oc(n,s);rn(i,r)||(t.uniform1iv(this.addr,r),on(i,r));for(let o=0;o!==s;++o)n.setTextureCube(e[o]||ev,r[o])}function CC(t,e,n){const i=this.cache,s=e.length,r=oc(n,s);rn(i,r)||(t.uniform1iv(this.addr,r),on(i,r));for(let o=0;o!==s;++o)n.setTexture2DArray(e[o]||J0,r[o])}function RC(t){switch(t){case 5126:return uC;case 35664:return fC;case 35665:return dC;case 35666:return hC;case 35674:return pC;case 35675:return mC;case 35676:return gC;case 5124:case 35670:return _C;case 35667:case 35671:return vC;case 35668:case 35672:return xC;case 35669:case 35673:return SC;case 5125:return yC;case 36294:return bC;case 36295:return EC;case 36296:return MC;case 35678:case 36198:case 36298:case 36306:case 35682:return TC;case 35679:case 36299:case 36307:return AC;case 35680:case 36300:case 36308:case 36293:return wC;case 36289:case 36303:case 36311:case 36292:return CC}}class PC{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.setValue=cC(n.type)}}class IC{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.size=n.size,this.setValue=RC(n.type)}}class LC{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,n,i){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(e,n[a.id],i)}}}const lu=/(\w+)(\])?(\[|\.)?/g;function Am(t,e){t.seq.push(e),t.map[e.id]=e}function DC(t,e,n){const i=t.name,s=i.length;for(lu.lastIndex=0;;){const r=lu.exec(i),o=lu.lastIndex;let a=r[1];const l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){Am(n,c===void 0?new PC(a,t,e):new IC(a,t,e));break}else{let d=n.map[a];d===void 0&&(d=new LC(a),Am(n,d)),n=d}}}class nl{constructor(e,n){this.seq=[],this.map={};const i=e.getProgramParameter(n,e.ACTIVE_UNIFORMS);for(let o=0;o<i;++o){const a=e.getActiveUniform(n,o),l=e.getUniformLocation(n,a.name);DC(a,l,this)}const s=[],r=[];for(const o of this.seq)o.type===e.SAMPLER_2D_SHADOW||o.type===e.SAMPLER_CUBE_SHADOW||o.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(o):r.push(o);s.length>0&&(this.seq=s.concat(r))}setValue(e,n,i,s){const r=this.map[n];r!==void 0&&r.setValue(e,i,s)}setOptional(e,n,i){const s=n[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,n,i,s){for(let r=0,o=n.length;r!==o;++r){const a=n[r],l=i[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,s)}}static seqWithValue(e,n){const i=[];for(let s=0,r=e.length;s!==r;++s){const o=e[s];o.id in n&&i.push(o)}return i}}function wm(t,e,n){const i=t.createShader(e);return t.shaderSource(i,n),t.compileShader(i),i}const NC=37297;let UC=0;function OC(t,e){const n=t.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,n.length);for(let o=s;o<r;o++){const a=o+1;i.push(`${a===e?">":" "} ${a}: ${n[o]}`)}return i.join(`
`)}const Cm=new tt;function FC(t){ct._getMatrix(Cm,ct.workingColorSpace,t);const e=`mat3( ${Cm.elements.map(n=>n.toFixed(4))} )`;switch(ct.getTransfer(t)){case Al:return[e,"LinearTransferOETF"];case Tt:return[e,"sRGBTransferOETF"];default:return je("WebGLProgram: Unsupported color space: ",t),[e,"LinearTransferOETF"]}}function Rm(t,e,n){const i=t.getShaderParameter(e,t.COMPILE_STATUS),r=(t.getShaderInfoLog(e)||"").trim();if(i&&r==="")return"";const o=/ERROR: 0:(\d+)/.exec(r);if(o){const a=parseInt(o[1]);return n.toUpperCase()+`

`+r+`

`+OC(t.getShaderSource(e),a)}else return r}function kC(t,e){const n=FC(e);return[`vec4 ${t}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,"}"].join(`
`)}const BC={[y0]:"Linear",[b0]:"Reinhard",[E0]:"Cineon",[M0]:"ACESFilmic",[A0]:"AgX",[w0]:"Neutral",[T0]:"Custom"};function zC(t,e){const n=BC[e];return n===void 0?(je("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+t+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+t+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}const Ga=new se;function VC(){ct.getLuminanceCoefficients(Ga);const t=Ga.x.toFixed(4),e=Ga.y.toFixed(4),n=Ga.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${t}, ${e}, ${n} );`,"	return dot( weights, rgb );","}"].join(`
`)}function HC(t){return[t.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",t.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Po).join(`
`)}function GC(t){const e=[];for(const n in t){const i=t[n];i!==!1&&e.push("#define "+n+" "+i)}return e.join(`
`)}function WC(t,e){const n={},i=t.getProgramParameter(e,t.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const r=t.getActiveAttrib(e,s),o=r.name;let a=1;r.type===t.FLOAT_MAT2&&(a=2),r.type===t.FLOAT_MAT3&&(a=3),r.type===t.FLOAT_MAT4&&(a=4),n[o]={type:r.type,location:t.getAttribLocation(e,o),locationSize:a}}return n}function Po(t){return t!==""}function Pm(t,e){const n=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return t.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Im(t,e){return t.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const $C=/^[ \t]*#include +<([\w\d./]+)>/gm;function kf(t){return t.replace($C,qC)}const XC=new Map;function qC(t,e){let n=ot[e];if(n===void 0){const i=XC.get(e);if(i!==void 0)n=ot[i],je('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return kf(n)}const KC=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Lm(t){return t.replace(KC,YC)}function YC(t,e,n,i){let s="";for(let r=parseInt(e);r<parseInt(n);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Dm(t){let e=`precision ${t.precision} float;
	precision ${t.precision} int;
	precision ${t.precision} sampler2D;
	precision ${t.precision} samplerCube;
	precision ${t.precision} sampler3D;
	precision ${t.precision} sampler2DArray;
	precision ${t.precision} sampler2DShadow;
	precision ${t.precision} samplerCubeShadow;
	precision ${t.precision} sampler2DArrayShadow;
	precision ${t.precision} isampler2D;
	precision ${t.precision} isampler3D;
	precision ${t.precision} isamplerCube;
	precision ${t.precision} isampler2DArray;
	precision ${t.precision} usampler2D;
	precision ${t.precision} usampler3D;
	precision ${t.precision} usamplerCube;
	precision ${t.precision} usampler2DArray;
	`;return t.precision==="highp"?e+=`
#define HIGH_PRECISION`:t.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:t.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const jC={[Za]:"SHADOWMAP_TYPE_PCF",[Ro]:"SHADOWMAP_TYPE_VSM"};function ZC(t){return jC[t.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const JC={[lr]:"ENVMAP_TYPE_CUBE",[Jr]:"ENVMAP_TYPE_CUBE",[ic]:"ENVMAP_TYPE_CUBE_UV"};function QC(t){return t.envMap===!1?"ENVMAP_TYPE_CUBE":JC[t.envMapMode]||"ENVMAP_TYPE_CUBE"}const eR={[Jr]:"ENVMAP_MODE_REFRACTION"};function tR(t){return t.envMap===!1?"ENVMAP_MODE_REFLECTION":eR[t.envMapMode]||"ENVMAP_MODE_REFLECTION"}const nR={[S0]:"ENVMAP_BLENDING_MULTIPLY",[X3]:"ENVMAP_BLENDING_MIX",[q3]:"ENVMAP_BLENDING_ADD"};function iR(t){return t.envMap===!1?"ENVMAP_BLENDING_NONE":nR[t.combine]||"ENVMAP_BLENDING_NONE"}function sR(t){const e=t.envMapCubeUVHeight;if(e===null)return null;const n=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,n),112)),texelHeight:i,maxMip:n}}function rR(t,e,n,i){const s=t.getContext(),r=n.defines;let o=n.vertexShader,a=n.fragmentShader;const l=ZC(n),c=QC(n),u=tR(n),d=iR(n),f=sR(n),p=HC(n),g=GC(r),_=s.createProgram();let m,h,v=n.glslVersion?"#version "+n.glslVersion+`
`:"";n.isRawShaderMaterial?(m=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,g].filter(Po).join(`
`),m.length>0&&(m+=`
`),h=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,g].filter(Po).join(`
`),h.length>0&&(h+=`
`)):(m=[Dm(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,g,n.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",n.batching?"#define USE_BATCHING":"",n.batchingColor?"#define USE_BATCHING_COLOR":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.instancingMorph?"#define USE_INSTANCING_MORPH":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+u:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexNormals?"#define HAS_NORMAL":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Po).join(`
`),h=[Dm(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,g,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+c:"",n.envMap?"#define "+u:"",n.envMap?"#define "+d:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.dispersion?"#define USE_DISPERSION":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor?"#define USE_COLOR":"",n.vertexAlphas||n.batchingColor?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==Ri?"#define TONE_MAPPING":"",n.toneMapping!==Ri?ot.tonemapping_pars_fragment:"",n.toneMapping!==Ri?zC("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",ot.colorspace_pars_fragment,kC("linearToOutputTexel",n.outputColorSpace),VC(),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(Po).join(`
`)),o=kf(o),o=Pm(o,n),o=Im(o,n),a=kf(a),a=Pm(a,n),a=Im(a,n),o=Lm(o),a=Lm(a),n.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,h=["#define varying in",n.glslVersion===qp?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===qp?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+h);const b=v+m+o,x=v+h+a,D=wm(s,s.VERTEX_SHADER,b),C=wm(s,s.FRAGMENT_SHADER,x);s.attachShader(_,D),s.attachShader(_,C),n.index0AttributeName!==void 0?s.bindAttribLocation(_,0,n.index0AttributeName):n.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function R(E){if(t.debug.checkShaderErrors){const P=s.getProgramInfoLog(_)||"",B=s.getShaderInfoLog(D)||"",Z=s.getShaderInfoLog(C)||"",G=P.trim(),X=B.trim(),$=Z.trim();let le=!0,me=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(le=!1,typeof t.debug.onShaderError=="function")t.debug.onShaderError(s,_,D,C);else{const Se=Rm(s,D,"vertex"),Ce=Rm(s,C,"fragment");pt("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+E.name+`
Material Type: `+E.type+`

Program Info Log: `+G+`
`+Se+`
`+Ce)}else G!==""?je("WebGLProgram: Program Info Log:",G):(X===""||$==="")&&(me=!1);me&&(E.diagnostics={runnable:le,programLog:G,vertexShader:{log:X,prefix:m},fragmentShader:{log:$,prefix:h}})}s.deleteShader(D),s.deleteShader(C),S=new nl(s,_),M=WC(s,_)}let S;this.getUniforms=function(){return S===void 0&&R(this),S};let M;this.getAttributes=function(){return M===void 0&&R(this),M};let L=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return L===!1&&(L=s.getProgramParameter(_,NC)),L},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=UC++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=D,this.fragmentShader=C,this}let oR=0;class aR{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const n=e.vertexShader,i=e.fragmentShader,s=this._getShaderStage(n),r=this._getShaderStage(i),o=this._getShaderCacheForMaterial(e);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){const n=this.materialCache.get(e);for(const i of n)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const n=this.materialCache;let i=n.get(e);return i===void 0&&(i=new Set,n.set(e,i)),i}_getShaderStage(e){const n=this.shaderCache;let i=n.get(e);return i===void 0&&(i=new lR(e),n.set(e,i)),i}}class lR{constructor(e){this.id=oR++,this.code=e,this.usedTimes=0}}function cR(t){return t===cr||t===El||t===Ml}function uR(t,e,n,i,s,r){const o=new k0,a=new aR,l=new Set,c=[],u=new Map,d=i.logarithmicDepthBuffer;let f=i.precision;const p={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(S){return l.add(S),S===0?"uv":`uv${S}`}function _(S,M,L,E,P,B){const Z=E.fog,G=P.geometry,X=S.isMeshStandardMaterial||S.isMeshLambertMaterial||S.isMeshPhongMaterial?E.environment:null,$=S.isMeshStandardMaterial||S.isMeshLambertMaterial&&!S.envMap||S.isMeshPhongMaterial&&!S.envMap,le=e.get(S.envMap||X,$),me=le&&le.mapping===ic?le.image.height:null,Se=p[S.type];S.precision!==null&&(f=i.getMaxPrecision(S.precision),f!==S.precision&&je("WebGLProgram.getParameters:",S.precision,"not supported, using",f,"instead."));const Ce=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,Pe=Ce!==void 0?Ce.length:0;let Ke=0;G.morphAttributes.position!==void 0&&(Ke=1),G.morphAttributes.normal!==void 0&&(Ke=2),G.morphAttributes.color!==void 0&&(Ke=3);let Qe,Ge,ue,j;if(Se){const nt=Ei[Se];Qe=nt.vertexShader,Ge=nt.fragmentShader}else Qe=S.vertexShader,Ge=S.fragmentShader,a.update(S),ue=a.getVertexShaderID(S),j=a.getFragmentShaderID(S);const te=t.getRenderTarget(),fe=t.state.buffers.depth.getReversed(),ge=P.isInstancedMesh===!0,ye=P.isBatchedMesh===!0,T=!!S.map,I=!!S.matcap,V=!!le,Y=!!S.aoMap,J=!!S.lightMap,ae=!!S.bumpMap,U=!!S.normalMap,O=!!S.displacementMap,A=!!S.emissiveMap,k=!!S.metalnessMap,z=!!S.roughnessMap,ee=S.anisotropy>0,F=S.clearcoat>0,K=S.dispersion>0,w=S.iridescence>0,y=S.sheen>0,W=S.transmission>0,re=ee&&!!S.anisotropyMap,de=F&&!!S.clearcoatMap,ve=F&&!!S.clearcoatNormalMap,be=F&&!!S.clearcoatRoughnessMap,ce=w&&!!S.iridescenceMap,pe=w&&!!S.iridescenceThicknessMap,Te=y&&!!S.sheenColorMap,Le=y&&!!S.sheenRoughnessMap,Ae=!!S.specularMap,Me=!!S.specularColorMap,et=!!S.specularIntensityMap,st=W&&!!S.transmissionMap,gt=W&&!!S.thicknessMap,q=!!S.gradientMap,we=!!S.alphaMap,he=S.alphaTest>0,Fe=!!S.alphaHash,Re=!!S.extensions;let _e=Ri;S.toneMapped&&(te===null||te.isXRRenderTarget===!0)&&(_e=t.toneMapping);const He={shaderID:Se,shaderType:S.type,shaderName:S.name,vertexShader:Qe,fragmentShader:Ge,defines:S.defines,customVertexShaderID:ue,customFragmentShaderID:j,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:f,batching:ye,batchingColor:ye&&P._colorsTexture!==null,instancing:ge,instancingColor:ge&&P.instanceColor!==null,instancingMorph:ge&&P.morphTexture!==null,outputColorSpace:te===null?t.outputColorSpace:te.isXRRenderTarget===!0?te.texture.colorSpace:ct.workingColorSpace,alphaToCoverage:!!S.alphaToCoverage,map:T,matcap:I,envMap:V,envMapMode:V&&le.mapping,envMapCubeUVHeight:me,aoMap:Y,lightMap:J,bumpMap:ae,normalMap:U,displacementMap:O,emissiveMap:A,normalMapObjectSpace:U&&S.normalMapType===j3,normalMapTangentSpace:U&&S.normalMapType===Wp,packedNormalMap:U&&S.normalMapType===Wp&&cR(S.normalMap.format),metalnessMap:k,roughnessMap:z,anisotropy:ee,anisotropyMap:re,clearcoat:F,clearcoatMap:de,clearcoatNormalMap:ve,clearcoatRoughnessMap:be,dispersion:K,iridescence:w,iridescenceMap:ce,iridescenceThicknessMap:pe,sheen:y,sheenColorMap:Te,sheenRoughnessMap:Le,specularMap:Ae,specularColorMap:Me,specularIntensityMap:et,transmission:W,transmissionMap:st,thicknessMap:gt,gradientMap:q,opaque:S.transparent===!1&&S.blending===Vr&&S.alphaToCoverage===!1,alphaMap:we,alphaTest:he,alphaHash:Fe,combine:S.combine,mapUv:T&&g(S.map.channel),aoMapUv:Y&&g(S.aoMap.channel),lightMapUv:J&&g(S.lightMap.channel),bumpMapUv:ae&&g(S.bumpMap.channel),normalMapUv:U&&g(S.normalMap.channel),displacementMapUv:O&&g(S.displacementMap.channel),emissiveMapUv:A&&g(S.emissiveMap.channel),metalnessMapUv:k&&g(S.metalnessMap.channel),roughnessMapUv:z&&g(S.roughnessMap.channel),anisotropyMapUv:re&&g(S.anisotropyMap.channel),clearcoatMapUv:de&&g(S.clearcoatMap.channel),clearcoatNormalMapUv:ve&&g(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:be&&g(S.clearcoatRoughnessMap.channel),iridescenceMapUv:ce&&g(S.iridescenceMap.channel),iridescenceThicknessMapUv:pe&&g(S.iridescenceThicknessMap.channel),sheenColorMapUv:Te&&g(S.sheenColorMap.channel),sheenRoughnessMapUv:Le&&g(S.sheenRoughnessMap.channel),specularMapUv:Ae&&g(S.specularMap.channel),specularColorMapUv:Me&&g(S.specularColorMap.channel),specularIntensityMapUv:et&&g(S.specularIntensityMap.channel),transmissionMapUv:st&&g(S.transmissionMap.channel),thicknessMapUv:gt&&g(S.thicknessMap.channel),alphaMapUv:we&&g(S.alphaMap.channel),vertexTangents:!!G.attributes.tangent&&(U||ee),vertexNormals:!!G.attributes.normal,vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,pointsUvs:P.isPoints===!0&&!!G.attributes.uv&&(T||we),fog:!!Z,useFog:S.fog===!0,fogExp2:!!Z&&Z.isFogExp2,flatShading:S.wireframe===!1&&(S.flatShading===!0||G.attributes.normal===void 0&&U===!1&&(S.isMeshLambertMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isMeshPhysicalMaterial)),sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:fe,skinning:P.isSkinnedMesh===!0,morphTargets:G.morphAttributes.position!==void 0,morphNormals:G.morphAttributes.normal!==void 0,morphColors:G.morphAttributes.color!==void 0,morphTargetsCount:Pe,morphTextureStride:Ke,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numLightProbeGrids:B.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:S.dithering,shadowMapEnabled:t.shadowMap.enabled&&L.length>0,shadowMapType:t.shadowMap.type,toneMapping:_e,decodeVideoTexture:T&&S.map.isVideoTexture===!0&&ct.getTransfer(S.map.colorSpace)===Tt,decodeVideoTextureEmissive:A&&S.emissiveMap.isVideoTexture===!0&&ct.getTransfer(S.emissiveMap.colorSpace)===Tt,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===Yi,flipSided:S.side===Dn,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:Re&&S.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Re&&S.extensions.multiDraw===!0||ye)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return He.vertexUv1s=l.has(1),He.vertexUv2s=l.has(2),He.vertexUv3s=l.has(3),l.clear(),He}function m(S){const M=[];if(S.shaderID?M.push(S.shaderID):(M.push(S.customVertexShaderID),M.push(S.customFragmentShaderID)),S.defines!==void 0)for(const L in S.defines)M.push(L),M.push(S.defines[L]);return S.isRawShaderMaterial===!1&&(h(M,S),v(M,S),M.push(t.outputColorSpace)),M.push(S.customProgramCacheKey),M.join()}function h(S,M){S.push(M.precision),S.push(M.outputColorSpace),S.push(M.envMapMode),S.push(M.envMapCubeUVHeight),S.push(M.mapUv),S.push(M.alphaMapUv),S.push(M.lightMapUv),S.push(M.aoMapUv),S.push(M.bumpMapUv),S.push(M.normalMapUv),S.push(M.displacementMapUv),S.push(M.emissiveMapUv),S.push(M.metalnessMapUv),S.push(M.roughnessMapUv),S.push(M.anisotropyMapUv),S.push(M.clearcoatMapUv),S.push(M.clearcoatNormalMapUv),S.push(M.clearcoatRoughnessMapUv),S.push(M.iridescenceMapUv),S.push(M.iridescenceThicknessMapUv),S.push(M.sheenColorMapUv),S.push(M.sheenRoughnessMapUv),S.push(M.specularMapUv),S.push(M.specularColorMapUv),S.push(M.specularIntensityMapUv),S.push(M.transmissionMapUv),S.push(M.thicknessMapUv),S.push(M.combine),S.push(M.fogExp2),S.push(M.sizeAttenuation),S.push(M.morphTargetsCount),S.push(M.morphAttributeCount),S.push(M.numDirLights),S.push(M.numPointLights),S.push(M.numSpotLights),S.push(M.numSpotLightMaps),S.push(M.numHemiLights),S.push(M.numRectAreaLights),S.push(M.numDirLightShadows),S.push(M.numPointLightShadows),S.push(M.numSpotLightShadows),S.push(M.numSpotLightShadowsWithMaps),S.push(M.numLightProbes),S.push(M.shadowMapType),S.push(M.toneMapping),S.push(M.numClippingPlanes),S.push(M.numClipIntersection),S.push(M.depthPacking)}function v(S,M){o.disableAll(),M.instancing&&o.enable(0),M.instancingColor&&o.enable(1),M.instancingMorph&&o.enable(2),M.matcap&&o.enable(3),M.envMap&&o.enable(4),M.normalMapObjectSpace&&o.enable(5),M.normalMapTangentSpace&&o.enable(6),M.clearcoat&&o.enable(7),M.iridescence&&o.enable(8),M.alphaTest&&o.enable(9),M.vertexColors&&o.enable(10),M.vertexAlphas&&o.enable(11),M.vertexUv1s&&o.enable(12),M.vertexUv2s&&o.enable(13),M.vertexUv3s&&o.enable(14),M.vertexTangents&&o.enable(15),M.anisotropy&&o.enable(16),M.alphaHash&&o.enable(17),M.batching&&o.enable(18),M.dispersion&&o.enable(19),M.batchingColor&&o.enable(20),M.gradientMap&&o.enable(21),M.packedNormalMap&&o.enable(22),M.vertexNormals&&o.enable(23),S.push(o.mask),o.disableAll(),M.fog&&o.enable(0),M.useFog&&o.enable(1),M.flatShading&&o.enable(2),M.logarithmicDepthBuffer&&o.enable(3),M.reversedDepthBuffer&&o.enable(4),M.skinning&&o.enable(5),M.morphTargets&&o.enable(6),M.morphNormals&&o.enable(7),M.morphColors&&o.enable(8),M.premultipliedAlpha&&o.enable(9),M.shadowMapEnabled&&o.enable(10),M.doubleSided&&o.enable(11),M.flipSided&&o.enable(12),M.useDepthPacking&&o.enable(13),M.dithering&&o.enable(14),M.transmission&&o.enable(15),M.sheen&&o.enable(16),M.opaque&&o.enable(17),M.pointsUvs&&o.enable(18),M.decodeVideoTexture&&o.enable(19),M.decodeVideoTextureEmissive&&o.enable(20),M.alphaToCoverage&&o.enable(21),M.numLightProbeGrids>0&&o.enable(22),S.push(o.mask)}function b(S){const M=p[S.type];let L;if(M){const E=Ei[M];L=NT.clone(E.uniforms)}else L=S.uniforms;return L}function x(S,M){let L=u.get(M);return L!==void 0?++L.usedTimes:(L=new rR(t,M,S,s),c.push(L),u.set(M,L)),L}function D(S){if(--S.usedTimes===0){const M=c.indexOf(S);c[M]=c[c.length-1],c.pop(),u.delete(S.cacheKey),S.destroy()}}function C(S){a.remove(S)}function R(){a.dispose()}return{getParameters:_,getProgramCacheKey:m,getUniforms:b,acquireProgram:x,releaseProgram:D,releaseShaderCache:C,programs:c,dispose:R}}function fR(){let t=new WeakMap;function e(o){return t.has(o)}function n(o){let a=t.get(o);return a===void 0&&(a={},t.set(o,a)),a}function i(o){t.delete(o)}function s(o,a,l){t.get(o)[a]=l}function r(){t=new WeakMap}return{has:e,get:n,remove:i,update:s,dispose:r}}function dR(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.material.id!==e.material.id?t.material.id-e.material.id:t.materialVariant!==e.materialVariant?t.materialVariant-e.materialVariant:t.z!==e.z?t.z-e.z:t.id-e.id}function Nm(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.z!==e.z?e.z-t.z:t.id-e.id}function Um(){const t=[];let e=0;const n=[],i=[],s=[];function r(){e=0,n.length=0,i.length=0,s.length=0}function o(f){let p=0;return f.isInstancedMesh&&(p+=2),f.isSkinnedMesh&&(p+=1),p}function a(f,p,g,_,m,h){let v=t[e];return v===void 0?(v={id:f.id,object:f,geometry:p,material:g,materialVariant:o(f),groupOrder:_,renderOrder:f.renderOrder,z:m,group:h},t[e]=v):(v.id=f.id,v.object=f,v.geometry=p,v.material=g,v.materialVariant=o(f),v.groupOrder=_,v.renderOrder=f.renderOrder,v.z=m,v.group=h),e++,v}function l(f,p,g,_,m,h){const v=a(f,p,g,_,m,h);g.transmission>0?i.push(v):g.transparent===!0?s.push(v):n.push(v)}function c(f,p,g,_,m,h){const v=a(f,p,g,_,m,h);g.transmission>0?i.unshift(v):g.transparent===!0?s.unshift(v):n.unshift(v)}function u(f,p){n.length>1&&n.sort(f||dR),i.length>1&&i.sort(p||Nm),s.length>1&&s.sort(p||Nm)}function d(){for(let f=e,p=t.length;f<p;f++){const g=t[f];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:n,transmissive:i,transparent:s,init:r,push:l,unshift:c,finish:d,sort:u}}function hR(){let t=new WeakMap;function e(i,s){const r=t.get(i);let o;return r===void 0?(o=new Um,t.set(i,[o])):s>=r.length?(o=new Um,r.push(o)):o=r[s],o}function n(){t=new WeakMap}return{get:e,dispose:n}}function pR(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={direction:new se,color:new It};break;case"SpotLight":n={position:new se,direction:new se,color:new It,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new se,color:new It,distance:0,decay:0};break;case"HemisphereLight":n={direction:new se,skyColor:new It,groundColor:new It};break;case"RectAreaLight":n={color:new It,position:new se,halfWidth:new se,halfHeight:new se};break}return t[e.id]=n,n}}}function mR(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new mt};break;case"SpotLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new mt};break;case"PointLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new mt,shadowCameraNear:1,shadowCameraFar:1e3};break}return t[e.id]=n,n}}}let gR=0;function _R(t,e){return(e.castShadow?2:0)-(t.castShadow?2:0)+(e.map?1:0)-(t.map?1:0)}function vR(t){const e=new pR,n=mR(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new se);const s=new se,r=new sn,o=new sn;function a(c){let u=0,d=0,f=0;for(let M=0;M<9;M++)i.probe[M].set(0,0,0);let p=0,g=0,_=0,m=0,h=0,v=0,b=0,x=0,D=0,C=0,R=0;c.sort(_R);for(let M=0,L=c.length;M<L;M++){const E=c[M],P=E.color,B=E.intensity,Z=E.distance;let G=null;if(E.shadow&&E.shadow.map&&(E.shadow.map.texture.format===cr?G=E.shadow.map.texture:G=E.shadow.map.depthTexture||E.shadow.map.texture),E.isAmbientLight)u+=P.r*B,d+=P.g*B,f+=P.b*B;else if(E.isLightProbe){for(let X=0;X<9;X++)i.probe[X].addScaledVector(E.sh.coefficients[X],B);R++}else if(E.isDirectionalLight){const X=e.get(E);if(X.color.copy(E.color).multiplyScalar(E.intensity),E.castShadow){const $=E.shadow,le=n.get(E);le.shadowIntensity=$.intensity,le.shadowBias=$.bias,le.shadowNormalBias=$.normalBias,le.shadowRadius=$.radius,le.shadowMapSize=$.mapSize,i.directionalShadow[p]=le,i.directionalShadowMap[p]=G,i.directionalShadowMatrix[p]=E.shadow.matrix,v++}i.directional[p]=X,p++}else if(E.isSpotLight){const X=e.get(E);X.position.setFromMatrixPosition(E.matrixWorld),X.color.copy(P).multiplyScalar(B),X.distance=Z,X.coneCos=Math.cos(E.angle),X.penumbraCos=Math.cos(E.angle*(1-E.penumbra)),X.decay=E.decay,i.spot[_]=X;const $=E.shadow;if(E.map&&(i.spotLightMap[D]=E.map,D++,$.updateMatrices(E),E.castShadow&&C++),i.spotLightMatrix[_]=$.matrix,E.castShadow){const le=n.get(E);le.shadowIntensity=$.intensity,le.shadowBias=$.bias,le.shadowNormalBias=$.normalBias,le.shadowRadius=$.radius,le.shadowMapSize=$.mapSize,i.spotShadow[_]=le,i.spotShadowMap[_]=G,x++}_++}else if(E.isRectAreaLight){const X=e.get(E);X.color.copy(P).multiplyScalar(B),X.halfWidth.set(E.width*.5,0,0),X.halfHeight.set(0,E.height*.5,0),i.rectArea[m]=X,m++}else if(E.isPointLight){const X=e.get(E);if(X.color.copy(E.color).multiplyScalar(E.intensity),X.distance=E.distance,X.decay=E.decay,E.castShadow){const $=E.shadow,le=n.get(E);le.shadowIntensity=$.intensity,le.shadowBias=$.bias,le.shadowNormalBias=$.normalBias,le.shadowRadius=$.radius,le.shadowMapSize=$.mapSize,le.shadowCameraNear=$.camera.near,le.shadowCameraFar=$.camera.far,i.pointShadow[g]=le,i.pointShadowMap[g]=G,i.pointShadowMatrix[g]=E.shadow.matrix,b++}i.point[g]=X,g++}else if(E.isHemisphereLight){const X=e.get(E);X.skyColor.copy(E.color).multiplyScalar(B),X.groundColor.copy(E.groundColor).multiplyScalar(B),i.hemi[h]=X,h++}}m>0&&(t.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=De.LTC_FLOAT_1,i.rectAreaLTC2=De.LTC_FLOAT_2):(i.rectAreaLTC1=De.LTC_HALF_1,i.rectAreaLTC2=De.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=d,i.ambient[2]=f;const S=i.hash;(S.directionalLength!==p||S.pointLength!==g||S.spotLength!==_||S.rectAreaLength!==m||S.hemiLength!==h||S.numDirectionalShadows!==v||S.numPointShadows!==b||S.numSpotShadows!==x||S.numSpotMaps!==D||S.numLightProbes!==R)&&(i.directional.length=p,i.spot.length=_,i.rectArea.length=m,i.point.length=g,i.hemi.length=h,i.directionalShadow.length=v,i.directionalShadowMap.length=v,i.pointShadow.length=b,i.pointShadowMap.length=b,i.spotShadow.length=x,i.spotShadowMap.length=x,i.directionalShadowMatrix.length=v,i.pointShadowMatrix.length=b,i.spotLightMatrix.length=x+D-C,i.spotLightMap.length=D,i.numSpotLightShadowsWithMaps=C,i.numLightProbes=R,S.directionalLength=p,S.pointLength=g,S.spotLength=_,S.rectAreaLength=m,S.hemiLength=h,S.numDirectionalShadows=v,S.numPointShadows=b,S.numSpotShadows=x,S.numSpotMaps=D,S.numLightProbes=R,i.version=gR++)}function l(c,u){let d=0,f=0,p=0,g=0,_=0;const m=u.matrixWorldInverse;for(let h=0,v=c.length;h<v;h++){const b=c[h];if(b.isDirectionalLight){const x=i.directional[d];x.direction.setFromMatrixPosition(b.matrixWorld),s.setFromMatrixPosition(b.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(m),d++}else if(b.isSpotLight){const x=i.spot[p];x.position.setFromMatrixPosition(b.matrixWorld),x.position.applyMatrix4(m),x.direction.setFromMatrixPosition(b.matrixWorld),s.setFromMatrixPosition(b.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(m),p++}else if(b.isRectAreaLight){const x=i.rectArea[g];x.position.setFromMatrixPosition(b.matrixWorld),x.position.applyMatrix4(m),o.identity(),r.copy(b.matrixWorld),r.premultiply(m),o.extractRotation(r),x.halfWidth.set(b.width*.5,0,0),x.halfHeight.set(0,b.height*.5,0),x.halfWidth.applyMatrix4(o),x.halfHeight.applyMatrix4(o),g++}else if(b.isPointLight){const x=i.point[f];x.position.setFromMatrixPosition(b.matrixWorld),x.position.applyMatrix4(m),f++}else if(b.isHemisphereLight){const x=i.hemi[_];x.direction.setFromMatrixPosition(b.matrixWorld),x.direction.transformDirection(m),_++}}}return{setup:a,setupView:l,state:i}}function Om(t){const e=new vR(t),n=[],i=[],s=[];function r(f){d.camera=f,n.length=0,i.length=0,s.length=0}function o(f){n.push(f)}function a(f){i.push(f)}function l(f){s.push(f)}function c(){e.setup(n)}function u(f){e.setupView(n,f)}const d={lightsArray:n,shadowsArray:i,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:d,setupLights:c,setupLightsView:u,pushLight:o,pushShadow:a,pushLightProbeGrid:l}}function xR(t){let e=new WeakMap;function n(s,r=0){const o=e.get(s);let a;return o===void 0?(a=new Om(t),e.set(s,[a])):r>=o.length?(a=new Om(t),o.push(a)):a=o[r],a}function i(){e=new WeakMap}return{get:n,dispose:i}}const SR=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,yR=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,bR=[new se(1,0,0),new se(-1,0,0),new se(0,1,0),new se(0,-1,0),new se(0,0,1),new se(0,0,-1)],ER=[new se(0,-1,0),new se(0,-1,0),new se(0,0,1),new se(0,0,-1),new se(0,-1,0),new se(0,-1,0)],Fm=new sn,Eo=new se,cu=new se;function MR(t,e,n){let i=new G0;const s=new mt,r=new mt,o=new Yt,a=new kT,l=new BT,c={},u=n.maxTextureSize,d={[Is]:Dn,[Dn]:Is,[Yi]:Yi},f=new ci({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new mt},radius:{value:4}},vertexShader:SR,fragmentShader:yR}),p=f.clone();p.defines.HORIZONTAL_PASS=1;const g=new ls;g.setAttribute("position",new Ii(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new Ni(g,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Za;let h=this.type;this.render=function(C,R,S){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||C.length===0)return;this.type===w3&&(je("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=Za);const M=t.getRenderTarget(),L=t.getActiveCubeFace(),E=t.getActiveMipmapLevel(),P=t.state;P.setBlending(Qi),P.buffers.depth.getReversed()===!0?P.buffers.color.setClear(0,0,0,0):P.buffers.color.setClear(1,1,1,1),P.buffers.depth.setTest(!0),P.setScissorTest(!1);const B=h!==this.type;B&&R.traverse(function(Z){Z.material&&(Array.isArray(Z.material)?Z.material.forEach(G=>G.needsUpdate=!0):Z.material.needsUpdate=!0)});for(let Z=0,G=C.length;Z<G;Z++){const X=C[Z],$=X.shadow;if($===void 0){je("WebGLShadowMap:",X,"has no shadow.");continue}if($.autoUpdate===!1&&$.needsUpdate===!1)continue;s.copy($.mapSize);const le=$.getFrameExtents();s.multiply(le),r.copy($.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/le.x),s.x=r.x*le.x,$.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/le.y),s.y=r.y*le.y,$.mapSize.y=r.y));const me=t.state.buffers.depth.getReversed();if($.camera._reversedDepth=me,$.map===null||B===!0){if($.map!==null&&($.map.depthTexture!==null&&($.map.depthTexture.dispose(),$.map.depthTexture=null),$.map.dispose()),this.type===Ro){if(X.isPointLight){je("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}$.map=new Pi(s.x,s.y,{format:cr,type:rs,minFilter:Sn,magFilter:Sn,generateMipmaps:!1}),$.map.texture.name=X.name+".shadowMap",$.map.depthTexture=new Qr(s.x,s.y,Mi),$.map.depthTexture.name=X.name+".shadowMapDepth",$.map.depthTexture.format=os,$.map.depthTexture.compareFunction=null,$.map.depthTexture.minFilter=fn,$.map.depthTexture.magFilter=fn}else X.isPointLight?($.map=new j0(s.x),$.map.depthTexture=new LT(s.x,Di)):($.map=new Pi(s.x,s.y),$.map.depthTexture=new Qr(s.x,s.y,Di)),$.map.depthTexture.name=X.name+".shadowMap",$.map.depthTexture.format=os,this.type===Za?($.map.depthTexture.compareFunction=me?Ld:Id,$.map.depthTexture.minFilter=Sn,$.map.depthTexture.magFilter=Sn):($.map.depthTexture.compareFunction=null,$.map.depthTexture.minFilter=fn,$.map.depthTexture.magFilter=fn);$.camera.updateProjectionMatrix()}const Se=$.map.isWebGLCubeRenderTarget?6:1;for(let Ce=0;Ce<Se;Ce++){if($.map.isWebGLCubeRenderTarget)t.setRenderTarget($.map,Ce),t.clear();else{Ce===0&&(t.setRenderTarget($.map),t.clear());const Pe=$.getViewport(Ce);o.set(r.x*Pe.x,r.y*Pe.y,r.x*Pe.z,r.y*Pe.w),P.viewport(o)}if(X.isPointLight){const Pe=$.camera,Ke=$.matrix,Qe=X.distance||Pe.far;Qe!==Pe.far&&(Pe.far=Qe,Pe.updateProjectionMatrix()),Eo.setFromMatrixPosition(X.matrixWorld),Pe.position.copy(Eo),cu.copy(Pe.position),cu.add(bR[Ce]),Pe.up.copy(ER[Ce]),Pe.lookAt(cu),Pe.updateMatrixWorld(),Ke.makeTranslation(-Eo.x,-Eo.y,-Eo.z),Fm.multiplyMatrices(Pe.projectionMatrix,Pe.matrixWorldInverse),$._frustum.setFromProjectionMatrix(Fm,Pe.coordinateSystem,Pe.reversedDepth)}else $.updateMatrices(X);i=$.getFrustum(),x(R,S,$.camera,X,this.type)}$.isPointLightShadow!==!0&&this.type===Ro&&v($,S),$.needsUpdate=!1}h=this.type,m.needsUpdate=!1,t.setRenderTarget(M,L,E)};function v(C,R){const S=e.update(_);f.defines.VSM_SAMPLES!==C.blurSamples&&(f.defines.VSM_SAMPLES=C.blurSamples,p.defines.VSM_SAMPLES=C.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),C.mapPass===null&&(C.mapPass=new Pi(s.x,s.y,{format:cr,type:rs})),f.uniforms.shadow_pass.value=C.map.depthTexture,f.uniforms.resolution.value=C.mapSize,f.uniforms.radius.value=C.radius,t.setRenderTarget(C.mapPass),t.clear(),t.renderBufferDirect(R,null,S,f,_,null),p.uniforms.shadow_pass.value=C.mapPass.texture,p.uniforms.resolution.value=C.mapSize,p.uniforms.radius.value=C.radius,t.setRenderTarget(C.map),t.clear(),t.renderBufferDirect(R,null,S,p,_,null)}function b(C,R,S,M){let L=null;const E=S.isPointLight===!0?C.customDistanceMaterial:C.customDepthMaterial;if(E!==void 0)L=E;else if(L=S.isPointLight===!0?l:a,t.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){const P=L.uuid,B=R.uuid;let Z=c[P];Z===void 0&&(Z={},c[P]=Z);let G=Z[B];G===void 0&&(G=L.clone(),Z[B]=G,R.addEventListener("dispose",D)),L=G}if(L.visible=R.visible,L.wireframe=R.wireframe,M===Ro?L.side=R.shadowSide!==null?R.shadowSide:R.side:L.side=R.shadowSide!==null?R.shadowSide:d[R.side],L.alphaMap=R.alphaMap,L.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,L.map=R.map,L.clipShadows=R.clipShadows,L.clippingPlanes=R.clippingPlanes,L.clipIntersection=R.clipIntersection,L.displacementMap=R.displacementMap,L.displacementScale=R.displacementScale,L.displacementBias=R.displacementBias,L.wireframeLinewidth=R.wireframeLinewidth,L.linewidth=R.linewidth,S.isPointLight===!0&&L.isMeshDistanceMaterial===!0){const P=t.properties.get(L);P.light=S}return L}function x(C,R,S,M,L){if(C.visible===!1)return;if(C.layers.test(R.layers)&&(C.isMesh||C.isLine||C.isPoints)&&(C.castShadow||C.receiveShadow&&L===Ro)&&(!C.frustumCulled||i.intersectsObject(C))){C.modelViewMatrix.multiplyMatrices(S.matrixWorldInverse,C.matrixWorld);const B=e.update(C),Z=C.material;if(Array.isArray(Z)){const G=B.groups;for(let X=0,$=G.length;X<$;X++){const le=G[X],me=Z[le.materialIndex];if(me&&me.visible){const Se=b(C,me,M,L);C.onBeforeShadow(t,C,R,S,B,Se,le),t.renderBufferDirect(S,null,B,Se,C,le),C.onAfterShadow(t,C,R,S,B,Se,le)}}}else if(Z.visible){const G=b(C,Z,M,L);C.onBeforeShadow(t,C,R,S,B,G,null),t.renderBufferDirect(S,null,B,G,C,null),C.onAfterShadow(t,C,R,S,B,G,null)}}const P=C.children;for(let B=0,Z=P.length;B<Z;B++)x(P[B],R,S,M,L)}function D(C){C.target.removeEventListener("dispose",D);for(const S in c){const M=c[S],L=C.target.uuid;L in M&&(M[L].dispose(),delete M[L])}}}function TR(t,e){function n(){let q=!1;const we=new Yt;let he=null;const Fe=new Yt(0,0,0,0);return{setMask:function(Re){he!==Re&&!q&&(t.colorMask(Re,Re,Re,Re),he=Re)},setLocked:function(Re){q=Re},setClear:function(Re,_e,He,nt,$t){$t===!0&&(Re*=nt,_e*=nt,He*=nt),we.set(Re,_e,He,nt),Fe.equals(we)===!1&&(t.clearColor(Re,_e,He,nt),Fe.copy(we))},reset:function(){q=!1,he=null,Fe.set(-1,0,0,0)}}}function i(){let q=!1,we=!1,he=null,Fe=null,Re=null;return{setReversed:function(_e){if(we!==_e){const He=e.get("EXT_clip_control");_e?He.clipControlEXT(He.LOWER_LEFT_EXT,He.ZERO_TO_ONE_EXT):He.clipControlEXT(He.LOWER_LEFT_EXT,He.NEGATIVE_ONE_TO_ONE_EXT),we=_e;const nt=Re;Re=null,this.setClear(nt)}},getReversed:function(){return we},setTest:function(_e){_e?te(t.DEPTH_TEST):fe(t.DEPTH_TEST)},setMask:function(_e){he!==_e&&!q&&(t.depthMask(_e),he=_e)},setFunc:function(_e){if(we&&(_e=oT[_e]),Fe!==_e){switch(_e){case Yu:t.depthFunc(t.NEVER);break;case ju:t.depthFunc(t.ALWAYS);break;case Zu:t.depthFunc(t.LESS);break;case Zr:t.depthFunc(t.LEQUAL);break;case Ju:t.depthFunc(t.EQUAL);break;case Qu:t.depthFunc(t.GEQUAL);break;case ef:t.depthFunc(t.GREATER);break;case tf:t.depthFunc(t.NOTEQUAL);break;default:t.depthFunc(t.LEQUAL)}Fe=_e}},setLocked:function(_e){q=_e},setClear:function(_e){Re!==_e&&(Re=_e,we&&(_e=1-_e),t.clearDepth(_e))},reset:function(){q=!1,he=null,Fe=null,Re=null,we=!1}}}function s(){let q=!1,we=null,he=null,Fe=null,Re=null,_e=null,He=null,nt=null,$t=null;return{setTest:function(Rt){q||(Rt?te(t.STENCIL_TEST):fe(t.STENCIL_TEST))},setMask:function(Rt){we!==Rt&&!q&&(t.stencilMask(Rt),we=Rt)},setFunc:function(Rt,Ui,fi){(he!==Rt||Fe!==Ui||Re!==fi)&&(t.stencilFunc(Rt,Ui,fi),he=Rt,Fe=Ui,Re=fi)},setOp:function(Rt,Ui,fi){(_e!==Rt||He!==Ui||nt!==fi)&&(t.stencilOp(Rt,Ui,fi),_e=Rt,He=Ui,nt=fi)},setLocked:function(Rt){q=Rt},setClear:function(Rt){$t!==Rt&&(t.clearStencil(Rt),$t=Rt)},reset:function(){q=!1,we=null,he=null,Fe=null,Re=null,_e=null,He=null,nt=null,$t=null}}}const r=new n,o=new i,a=new s,l=new WeakMap,c=new WeakMap;let u={},d={},f={},p=new WeakMap,g=[],_=null,m=!1,h=null,v=null,b=null,x=null,D=null,C=null,R=null,S=new It(0,0,0),M=0,L=!1,E=null,P=null,B=null,Z=null,G=null;const X=t.getParameter(t.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let $=!1,le=0;const me=t.getParameter(t.VERSION);me.indexOf("WebGL")!==-1?(le=parseFloat(/^WebGL (\d)/.exec(me)[1]),$=le>=1):me.indexOf("OpenGL ES")!==-1&&(le=parseFloat(/^OpenGL ES (\d)/.exec(me)[1]),$=le>=2);let Se=null,Ce={};const Pe=t.getParameter(t.SCISSOR_BOX),Ke=t.getParameter(t.VIEWPORT),Qe=new Yt().fromArray(Pe),Ge=new Yt().fromArray(Ke);function ue(q,we,he,Fe){const Re=new Uint8Array(4),_e=t.createTexture();t.bindTexture(q,_e),t.texParameteri(q,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(q,t.TEXTURE_MAG_FILTER,t.NEAREST);for(let He=0;He<he;He++)q===t.TEXTURE_3D||q===t.TEXTURE_2D_ARRAY?t.texImage3D(we,0,t.RGBA,1,1,Fe,0,t.RGBA,t.UNSIGNED_BYTE,Re):t.texImage2D(we+He,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,Re);return _e}const j={};j[t.TEXTURE_2D]=ue(t.TEXTURE_2D,t.TEXTURE_2D,1),j[t.TEXTURE_CUBE_MAP]=ue(t.TEXTURE_CUBE_MAP,t.TEXTURE_CUBE_MAP_POSITIVE_X,6),j[t.TEXTURE_2D_ARRAY]=ue(t.TEXTURE_2D_ARRAY,t.TEXTURE_2D_ARRAY,1,1),j[t.TEXTURE_3D]=ue(t.TEXTURE_3D,t.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),te(t.DEPTH_TEST),o.setFunc(Zr),ae(!1),U(zp),te(t.CULL_FACE),Y(Qi);function te(q){u[q]!==!0&&(t.enable(q),u[q]=!0)}function fe(q){u[q]!==!1&&(t.disable(q),u[q]=!1)}function ge(q,we){return f[q]!==we?(t.bindFramebuffer(q,we),f[q]=we,q===t.DRAW_FRAMEBUFFER&&(f[t.FRAMEBUFFER]=we),q===t.FRAMEBUFFER&&(f[t.DRAW_FRAMEBUFFER]=we),!0):!1}function ye(q,we){let he=g,Fe=!1;if(q){he=p.get(we),he===void 0&&(he=[],p.set(we,he));const Re=q.textures;if(he.length!==Re.length||he[0]!==t.COLOR_ATTACHMENT0){for(let _e=0,He=Re.length;_e<He;_e++)he[_e]=t.COLOR_ATTACHMENT0+_e;he.length=Re.length,Fe=!0}}else he[0]!==t.BACK&&(he[0]=t.BACK,Fe=!0);Fe&&t.drawBuffers(he)}function T(q){return _!==q?(t.useProgram(q),_=q,!0):!1}const I={[Zs]:t.FUNC_ADD,[R3]:t.FUNC_SUBTRACT,[P3]:t.FUNC_REVERSE_SUBTRACT};I[I3]=t.MIN,I[L3]=t.MAX;const V={[D3]:t.ZERO,[N3]:t.ONE,[U3]:t.SRC_COLOR,[qu]:t.SRC_ALPHA,[V3]:t.SRC_ALPHA_SATURATE,[B3]:t.DST_COLOR,[F3]:t.DST_ALPHA,[O3]:t.ONE_MINUS_SRC_COLOR,[Ku]:t.ONE_MINUS_SRC_ALPHA,[z3]:t.ONE_MINUS_DST_COLOR,[k3]:t.ONE_MINUS_DST_ALPHA,[H3]:t.CONSTANT_COLOR,[G3]:t.ONE_MINUS_CONSTANT_COLOR,[W3]:t.CONSTANT_ALPHA,[$3]:t.ONE_MINUS_CONSTANT_ALPHA};function Y(q,we,he,Fe,Re,_e,He,nt,$t,Rt){if(q===Qi){m===!0&&(fe(t.BLEND),m=!1);return}if(m===!1&&(te(t.BLEND),m=!0),q!==C3){if(q!==h||Rt!==L){if((v!==Zs||D!==Zs)&&(t.blendEquation(t.FUNC_ADD),v=Zs,D=Zs),Rt)switch(q){case Vr:t.blendFuncSeparate(t.ONE,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case Vp:t.blendFunc(t.ONE,t.ONE);break;case Hp:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case Gp:t.blendFuncSeparate(t.DST_COLOR,t.ONE_MINUS_SRC_ALPHA,t.ZERO,t.ONE);break;default:pt("WebGLState: Invalid blending: ",q);break}else switch(q){case Vr:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case Vp:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE,t.ONE,t.ONE);break;case Hp:pt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Gp:pt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:pt("WebGLState: Invalid blending: ",q);break}b=null,x=null,C=null,R=null,S.set(0,0,0),M=0,h=q,L=Rt}return}Re=Re||we,_e=_e||he,He=He||Fe,(we!==v||Re!==D)&&(t.blendEquationSeparate(I[we],I[Re]),v=we,D=Re),(he!==b||Fe!==x||_e!==C||He!==R)&&(t.blendFuncSeparate(V[he],V[Fe],V[_e],V[He]),b=he,x=Fe,C=_e,R=He),(nt.equals(S)===!1||$t!==M)&&(t.blendColor(nt.r,nt.g,nt.b,$t),S.copy(nt),M=$t),h=q,L=!1}function J(q,we){q.side===Yi?fe(t.CULL_FACE):te(t.CULL_FACE);let he=q.side===Dn;we&&(he=!he),ae(he),q.blending===Vr&&q.transparent===!1?Y(Qi):Y(q.blending,q.blendEquation,q.blendSrc,q.blendDst,q.blendEquationAlpha,q.blendSrcAlpha,q.blendDstAlpha,q.blendColor,q.blendAlpha,q.premultipliedAlpha),o.setFunc(q.depthFunc),o.setTest(q.depthTest),o.setMask(q.depthWrite),r.setMask(q.colorWrite);const Fe=q.stencilWrite;a.setTest(Fe),Fe&&(a.setMask(q.stencilWriteMask),a.setFunc(q.stencilFunc,q.stencilRef,q.stencilFuncMask),a.setOp(q.stencilFail,q.stencilZFail,q.stencilZPass)),A(q.polygonOffset,q.polygonOffsetFactor,q.polygonOffsetUnits),q.alphaToCoverage===!0?te(t.SAMPLE_ALPHA_TO_COVERAGE):fe(t.SAMPLE_ALPHA_TO_COVERAGE)}function ae(q){E!==q&&(q?t.frontFace(t.CW):t.frontFace(t.CCW),E=q)}function U(q){q!==T3?(te(t.CULL_FACE),q!==P&&(q===zp?t.cullFace(t.BACK):q===A3?t.cullFace(t.FRONT):t.cullFace(t.FRONT_AND_BACK))):fe(t.CULL_FACE),P=q}function O(q){q!==B&&($&&t.lineWidth(q),B=q)}function A(q,we,he){q?(te(t.POLYGON_OFFSET_FILL),(Z!==we||G!==he)&&(Z=we,G=he,o.getReversed()&&(we=-we),t.polygonOffset(we,he))):fe(t.POLYGON_OFFSET_FILL)}function k(q){q?te(t.SCISSOR_TEST):fe(t.SCISSOR_TEST)}function z(q){q===void 0&&(q=t.TEXTURE0+X-1),Se!==q&&(t.activeTexture(q),Se=q)}function ee(q,we,he){he===void 0&&(Se===null?he=t.TEXTURE0+X-1:he=Se);let Fe=Ce[he];Fe===void 0&&(Fe={type:void 0,texture:void 0},Ce[he]=Fe),(Fe.type!==q||Fe.texture!==we)&&(Se!==he&&(t.activeTexture(he),Se=he),t.bindTexture(q,we||j[q]),Fe.type=q,Fe.texture=we)}function F(){const q=Ce[Se];q!==void 0&&q.type!==void 0&&(t.bindTexture(q.type,null),q.type=void 0,q.texture=void 0)}function K(){try{t.compressedTexImage2D(...arguments)}catch(q){pt("WebGLState:",q)}}function w(){try{t.compressedTexImage3D(...arguments)}catch(q){pt("WebGLState:",q)}}function y(){try{t.texSubImage2D(...arguments)}catch(q){pt("WebGLState:",q)}}function W(){try{t.texSubImage3D(...arguments)}catch(q){pt("WebGLState:",q)}}function re(){try{t.compressedTexSubImage2D(...arguments)}catch(q){pt("WebGLState:",q)}}function de(){try{t.compressedTexSubImage3D(...arguments)}catch(q){pt("WebGLState:",q)}}function ve(){try{t.texStorage2D(...arguments)}catch(q){pt("WebGLState:",q)}}function be(){try{t.texStorage3D(...arguments)}catch(q){pt("WebGLState:",q)}}function ce(){try{t.texImage2D(...arguments)}catch(q){pt("WebGLState:",q)}}function pe(){try{t.texImage3D(...arguments)}catch(q){pt("WebGLState:",q)}}function Te(q){return d[q]!==void 0?d[q]:t.getParameter(q)}function Le(q,we){d[q]!==we&&(t.pixelStorei(q,we),d[q]=we)}function Ae(q){Qe.equals(q)===!1&&(t.scissor(q.x,q.y,q.z,q.w),Qe.copy(q))}function Me(q){Ge.equals(q)===!1&&(t.viewport(q.x,q.y,q.z,q.w),Ge.copy(q))}function et(q,we){let he=c.get(we);he===void 0&&(he=new WeakMap,c.set(we,he));let Fe=he.get(q);Fe===void 0&&(Fe=t.getUniformBlockIndex(we,q.name),he.set(q,Fe))}function st(q,we){const Fe=c.get(we).get(q);l.get(we)!==Fe&&(t.uniformBlockBinding(we,Fe,q.__bindingPointIndex),l.set(we,Fe))}function gt(){t.disable(t.BLEND),t.disable(t.CULL_FACE),t.disable(t.DEPTH_TEST),t.disable(t.POLYGON_OFFSET_FILL),t.disable(t.SCISSOR_TEST),t.disable(t.STENCIL_TEST),t.disable(t.SAMPLE_ALPHA_TO_COVERAGE),t.blendEquation(t.FUNC_ADD),t.blendFunc(t.ONE,t.ZERO),t.blendFuncSeparate(t.ONE,t.ZERO,t.ONE,t.ZERO),t.blendColor(0,0,0,0),t.colorMask(!0,!0,!0,!0),t.clearColor(0,0,0,0),t.depthMask(!0),t.depthFunc(t.LESS),o.setReversed(!1),t.clearDepth(1),t.stencilMask(4294967295),t.stencilFunc(t.ALWAYS,0,4294967295),t.stencilOp(t.KEEP,t.KEEP,t.KEEP),t.clearStencil(0),t.cullFace(t.BACK),t.frontFace(t.CCW),t.polygonOffset(0,0),t.activeTexture(t.TEXTURE0),t.bindFramebuffer(t.FRAMEBUFFER,null),t.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),t.bindFramebuffer(t.READ_FRAMEBUFFER,null),t.useProgram(null),t.lineWidth(1),t.scissor(0,0,t.canvas.width,t.canvas.height),t.viewport(0,0,t.canvas.width,t.canvas.height),t.pixelStorei(t.PACK_ALIGNMENT,4),t.pixelStorei(t.UNPACK_ALIGNMENT,4),t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,!1),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,t.BROWSER_DEFAULT_WEBGL),t.pixelStorei(t.PACK_ROW_LENGTH,0),t.pixelStorei(t.PACK_SKIP_PIXELS,0),t.pixelStorei(t.PACK_SKIP_ROWS,0),t.pixelStorei(t.UNPACK_ROW_LENGTH,0),t.pixelStorei(t.UNPACK_IMAGE_HEIGHT,0),t.pixelStorei(t.UNPACK_SKIP_PIXELS,0),t.pixelStorei(t.UNPACK_SKIP_ROWS,0),t.pixelStorei(t.UNPACK_SKIP_IMAGES,0),u={},d={},Se=null,Ce={},f={},p=new WeakMap,g=[],_=null,m=!1,h=null,v=null,b=null,x=null,D=null,C=null,R=null,S=new It(0,0,0),M=0,L=!1,E=null,P=null,B=null,Z=null,G=null,Qe.set(0,0,t.canvas.width,t.canvas.height),Ge.set(0,0,t.canvas.width,t.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:te,disable:fe,bindFramebuffer:ge,drawBuffers:ye,useProgram:T,setBlending:Y,setMaterial:J,setFlipSided:ae,setCullFace:U,setLineWidth:O,setPolygonOffset:A,setScissorTest:k,activeTexture:z,bindTexture:ee,unbindTexture:F,compressedTexImage2D:K,compressedTexImage3D:w,texImage2D:ce,texImage3D:pe,pixelStorei:Le,getParameter:Te,updateUBOMapping:et,uniformBlockBinding:st,texStorage2D:ve,texStorage3D:be,texSubImage2D:y,texSubImage3D:W,compressedTexSubImage2D:re,compressedTexSubImage3D:de,scissor:Ae,viewport:Me,reset:gt}}function AR(t,e,n,i,s,r,o){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new mt,u=new WeakMap,d=new Set;let f;const p=new WeakMap;let g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(w,y){return g?new OffscreenCanvas(w,y):Cl("canvas")}function m(w,y,W){let re=1;const de=K(w);if((de.width>W||de.height>W)&&(re=W/Math.max(de.width,de.height)),re<1)if(typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&w instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&w instanceof ImageBitmap||typeof VideoFrame<"u"&&w instanceof VideoFrame){const ve=Math.floor(re*de.width),be=Math.floor(re*de.height);f===void 0&&(f=_(ve,be));const ce=y?_(ve,be):f;return ce.width=ve,ce.height=be,ce.getContext("2d").drawImage(w,0,0,ve,be),je("WebGLRenderer: Texture has been resized from ("+de.width+"x"+de.height+") to ("+ve+"x"+be+")."),ce}else return"data"in w&&je("WebGLRenderer: Image in DataTexture is too big ("+de.width+"x"+de.height+")."),w;return w}function h(w){return w.generateMipmaps}function v(w){t.generateMipmap(w)}function b(w){return w.isWebGLCubeRenderTarget?t.TEXTURE_CUBE_MAP:w.isWebGL3DRenderTarget?t.TEXTURE_3D:w.isWebGLArrayRenderTarget||w.isCompressedArrayTexture?t.TEXTURE_2D_ARRAY:t.TEXTURE_2D}function x(w,y,W,re,de,ve=!1){if(w!==null){if(t[w]!==void 0)return t[w];je("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let be;re&&(be=e.get("EXT_texture_norm16"),be||je("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let ce=y;if(y===t.RED&&(W===t.FLOAT&&(ce=t.R32F),W===t.HALF_FLOAT&&(ce=t.R16F),W===t.UNSIGNED_BYTE&&(ce=t.R8),W===t.UNSIGNED_SHORT&&be&&(ce=be.R16_EXT),W===t.SHORT&&be&&(ce=be.R16_SNORM_EXT)),y===t.RED_INTEGER&&(W===t.UNSIGNED_BYTE&&(ce=t.R8UI),W===t.UNSIGNED_SHORT&&(ce=t.R16UI),W===t.UNSIGNED_INT&&(ce=t.R32UI),W===t.BYTE&&(ce=t.R8I),W===t.SHORT&&(ce=t.R16I),W===t.INT&&(ce=t.R32I)),y===t.RG&&(W===t.FLOAT&&(ce=t.RG32F),W===t.HALF_FLOAT&&(ce=t.RG16F),W===t.UNSIGNED_BYTE&&(ce=t.RG8),W===t.UNSIGNED_SHORT&&be&&(ce=be.RG16_EXT),W===t.SHORT&&be&&(ce=be.RG16_SNORM_EXT)),y===t.RG_INTEGER&&(W===t.UNSIGNED_BYTE&&(ce=t.RG8UI),W===t.UNSIGNED_SHORT&&(ce=t.RG16UI),W===t.UNSIGNED_INT&&(ce=t.RG32UI),W===t.BYTE&&(ce=t.RG8I),W===t.SHORT&&(ce=t.RG16I),W===t.INT&&(ce=t.RG32I)),y===t.RGB_INTEGER&&(W===t.UNSIGNED_BYTE&&(ce=t.RGB8UI),W===t.UNSIGNED_SHORT&&(ce=t.RGB16UI),W===t.UNSIGNED_INT&&(ce=t.RGB32UI),W===t.BYTE&&(ce=t.RGB8I),W===t.SHORT&&(ce=t.RGB16I),W===t.INT&&(ce=t.RGB32I)),y===t.RGBA_INTEGER&&(W===t.UNSIGNED_BYTE&&(ce=t.RGBA8UI),W===t.UNSIGNED_SHORT&&(ce=t.RGBA16UI),W===t.UNSIGNED_INT&&(ce=t.RGBA32UI),W===t.BYTE&&(ce=t.RGBA8I),W===t.SHORT&&(ce=t.RGBA16I),W===t.INT&&(ce=t.RGBA32I)),y===t.RGB&&(W===t.UNSIGNED_SHORT&&be&&(ce=be.RGB16_EXT),W===t.SHORT&&be&&(ce=be.RGB16_SNORM_EXT),W===t.UNSIGNED_INT_5_9_9_9_REV&&(ce=t.RGB9_E5),W===t.UNSIGNED_INT_10F_11F_11F_REV&&(ce=t.R11F_G11F_B10F)),y===t.RGBA){const pe=ve?Al:ct.getTransfer(de);W===t.FLOAT&&(ce=t.RGBA32F),W===t.HALF_FLOAT&&(ce=t.RGBA16F),W===t.UNSIGNED_BYTE&&(ce=pe===Tt?t.SRGB8_ALPHA8:t.RGBA8),W===t.UNSIGNED_SHORT&&be&&(ce=be.RGBA16_EXT),W===t.SHORT&&be&&(ce=be.RGBA16_SNORM_EXT),W===t.UNSIGNED_SHORT_4_4_4_4&&(ce=t.RGBA4),W===t.UNSIGNED_SHORT_5_5_5_1&&(ce=t.RGB5_A1)}return(ce===t.R16F||ce===t.R32F||ce===t.RG16F||ce===t.RG32F||ce===t.RGBA16F||ce===t.RGBA32F)&&e.get("EXT_color_buffer_float"),ce}function D(w,y){let W;return w?y===null||y===Di||y===Qo?W=t.DEPTH24_STENCIL8:y===Mi?W=t.DEPTH32F_STENCIL8:y===Jo&&(W=t.DEPTH24_STENCIL8,je("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):y===null||y===Di||y===Qo?W=t.DEPTH_COMPONENT24:y===Mi?W=t.DEPTH_COMPONENT32F:y===Jo&&(W=t.DEPTH_COMPONENT16),W}function C(w,y){return h(w)===!0||w.isFramebufferTexture&&w.minFilter!==fn&&w.minFilter!==Sn?Math.log2(Math.max(y.width,y.height))+1:w.mipmaps!==void 0&&w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?y.mipmaps.length:1}function R(w){const y=w.target;y.removeEventListener("dispose",R),M(y),y.isVideoTexture&&u.delete(y),y.isHTMLTexture&&d.delete(y)}function S(w){const y=w.target;y.removeEventListener("dispose",S),E(y)}function M(w){const y=i.get(w);if(y.__webglInit===void 0)return;const W=w.source,re=p.get(W);if(re){const de=re[y.__cacheKey];de.usedTimes--,de.usedTimes===0&&L(w),Object.keys(re).length===0&&p.delete(W)}i.remove(w)}function L(w){const y=i.get(w);t.deleteTexture(y.__webglTexture);const W=w.source,re=p.get(W);delete re[y.__cacheKey],o.memory.textures--}function E(w){const y=i.get(w);if(w.depthTexture&&(w.depthTexture.dispose(),i.remove(w.depthTexture)),w.isWebGLCubeRenderTarget)for(let re=0;re<6;re++){if(Array.isArray(y.__webglFramebuffer[re]))for(let de=0;de<y.__webglFramebuffer[re].length;de++)t.deleteFramebuffer(y.__webglFramebuffer[re][de]);else t.deleteFramebuffer(y.__webglFramebuffer[re]);y.__webglDepthbuffer&&t.deleteRenderbuffer(y.__webglDepthbuffer[re])}else{if(Array.isArray(y.__webglFramebuffer))for(let re=0;re<y.__webglFramebuffer.length;re++)t.deleteFramebuffer(y.__webglFramebuffer[re]);else t.deleteFramebuffer(y.__webglFramebuffer);if(y.__webglDepthbuffer&&t.deleteRenderbuffer(y.__webglDepthbuffer),y.__webglMultisampledFramebuffer&&t.deleteFramebuffer(y.__webglMultisampledFramebuffer),y.__webglColorRenderbuffer)for(let re=0;re<y.__webglColorRenderbuffer.length;re++)y.__webglColorRenderbuffer[re]&&t.deleteRenderbuffer(y.__webglColorRenderbuffer[re]);y.__webglDepthRenderbuffer&&t.deleteRenderbuffer(y.__webglDepthRenderbuffer)}const W=w.textures;for(let re=0,de=W.length;re<de;re++){const ve=i.get(W[re]);ve.__webglTexture&&(t.deleteTexture(ve.__webglTexture),o.memory.textures--),i.remove(W[re])}i.remove(w)}let P=0;function B(){P=0}function Z(){return P}function G(w){P=w}function X(){const w=P;return w>=s.maxTextures&&je("WebGLTextures: Trying to use "+w+" texture units while this GPU supports only "+s.maxTextures),P+=1,w}function $(w){const y=[];return y.push(w.wrapS),y.push(w.wrapT),y.push(w.wrapR||0),y.push(w.magFilter),y.push(w.minFilter),y.push(w.anisotropy),y.push(w.internalFormat),y.push(w.format),y.push(w.type),y.push(w.generateMipmaps),y.push(w.premultiplyAlpha),y.push(w.flipY),y.push(w.unpackAlignment),y.push(w.colorSpace),y.join()}function le(w,y){const W=i.get(w);if(w.isVideoTexture&&ee(w),w.isRenderTargetTexture===!1&&w.isExternalTexture!==!0&&w.version>0&&W.__version!==w.version){const re=w.image;if(re===null)je("WebGLRenderer: Texture marked for update but no image data found.");else if(re.complete===!1)je("WebGLRenderer: Texture marked for update but image is incomplete");else{fe(W,w,y);return}}else w.isExternalTexture&&(W.__webglTexture=w.sourceTexture?w.sourceTexture:null);n.bindTexture(t.TEXTURE_2D,W.__webglTexture,t.TEXTURE0+y)}function me(w,y){const W=i.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&W.__version!==w.version){fe(W,w,y);return}else w.isExternalTexture&&(W.__webglTexture=w.sourceTexture?w.sourceTexture:null);n.bindTexture(t.TEXTURE_2D_ARRAY,W.__webglTexture,t.TEXTURE0+y)}function Se(w,y){const W=i.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&W.__version!==w.version){fe(W,w,y);return}n.bindTexture(t.TEXTURE_3D,W.__webglTexture,t.TEXTURE0+y)}function Ce(w,y){const W=i.get(w);if(w.isCubeDepthTexture!==!0&&w.version>0&&W.__version!==w.version){ge(W,w,y);return}n.bindTexture(t.TEXTURE_CUBE_MAP,W.__webglTexture,t.TEXTURE0+y)}const Pe={[nf]:t.REPEAT,[Ji]:t.CLAMP_TO_EDGE,[sf]:t.MIRRORED_REPEAT},Ke={[fn]:t.NEAREST,[K3]:t.NEAREST_MIPMAP_NEAREST,[ya]:t.NEAREST_MIPMAP_LINEAR,[Sn]:t.LINEAR,[Dc]:t.LINEAR_MIPMAP_NEAREST,[nr]:t.LINEAR_MIPMAP_LINEAR},Qe={[Z3]:t.NEVER,[nT]:t.ALWAYS,[J3]:t.LESS,[Id]:t.LEQUAL,[Q3]:t.EQUAL,[Ld]:t.GEQUAL,[eT]:t.GREATER,[tT]:t.NOTEQUAL};function Ge(w,y){if(y.type===Mi&&e.has("OES_texture_float_linear")===!1&&(y.magFilter===Sn||y.magFilter===Dc||y.magFilter===ya||y.magFilter===nr||y.minFilter===Sn||y.minFilter===Dc||y.minFilter===ya||y.minFilter===nr)&&je("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),t.texParameteri(w,t.TEXTURE_WRAP_S,Pe[y.wrapS]),t.texParameteri(w,t.TEXTURE_WRAP_T,Pe[y.wrapT]),(w===t.TEXTURE_3D||w===t.TEXTURE_2D_ARRAY)&&t.texParameteri(w,t.TEXTURE_WRAP_R,Pe[y.wrapR]),t.texParameteri(w,t.TEXTURE_MAG_FILTER,Ke[y.magFilter]),t.texParameteri(w,t.TEXTURE_MIN_FILTER,Ke[y.minFilter]),y.compareFunction&&(t.texParameteri(w,t.TEXTURE_COMPARE_MODE,t.COMPARE_REF_TO_TEXTURE),t.texParameteri(w,t.TEXTURE_COMPARE_FUNC,Qe[y.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(y.magFilter===fn||y.minFilter!==ya&&y.minFilter!==nr||y.type===Mi&&e.has("OES_texture_float_linear")===!1)return;if(y.anisotropy>1||i.get(y).__currentAnisotropy){const W=e.get("EXT_texture_filter_anisotropic");t.texParameterf(w,W.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(y.anisotropy,s.getMaxAnisotropy())),i.get(y).__currentAnisotropy=y.anisotropy}}}function ue(w,y){let W=!1;w.__webglInit===void 0&&(w.__webglInit=!0,y.addEventListener("dispose",R));const re=y.source;let de=p.get(re);de===void 0&&(de={},p.set(re,de));const ve=$(y);if(ve!==w.__cacheKey){de[ve]===void 0&&(de[ve]={texture:t.createTexture(),usedTimes:0},o.memory.textures++,W=!0),de[ve].usedTimes++;const be=de[w.__cacheKey];be!==void 0&&(de[w.__cacheKey].usedTimes--,be.usedTimes===0&&L(y)),w.__cacheKey=ve,w.__webglTexture=de[ve].texture}return W}function j(w,y,W){return Math.floor(Math.floor(w/W)/y)}function te(w,y,W,re){const ve=w.updateRanges;if(ve.length===0)n.texSubImage2D(t.TEXTURE_2D,0,0,0,y.width,y.height,W,re,y.data);else{ve.sort((Le,Ae)=>Le.start-Ae.start);let be=0;for(let Le=1;Le<ve.length;Le++){const Ae=ve[be],Me=ve[Le],et=Ae.start+Ae.count,st=j(Me.start,y.width,4),gt=j(Ae.start,y.width,4);Me.start<=et+1&&st===gt&&j(Me.start+Me.count-1,y.width,4)===st?Ae.count=Math.max(Ae.count,Me.start+Me.count-Ae.start):(++be,ve[be]=Me)}ve.length=be+1;const ce=n.getParameter(t.UNPACK_ROW_LENGTH),pe=n.getParameter(t.UNPACK_SKIP_PIXELS),Te=n.getParameter(t.UNPACK_SKIP_ROWS);n.pixelStorei(t.UNPACK_ROW_LENGTH,y.width);for(let Le=0,Ae=ve.length;Le<Ae;Le++){const Me=ve[Le],et=Math.floor(Me.start/4),st=Math.ceil(Me.count/4),gt=et%y.width,q=Math.floor(et/y.width),we=st,he=1;n.pixelStorei(t.UNPACK_SKIP_PIXELS,gt),n.pixelStorei(t.UNPACK_SKIP_ROWS,q),n.texSubImage2D(t.TEXTURE_2D,0,gt,q,we,he,W,re,y.data)}w.clearUpdateRanges(),n.pixelStorei(t.UNPACK_ROW_LENGTH,ce),n.pixelStorei(t.UNPACK_SKIP_PIXELS,pe),n.pixelStorei(t.UNPACK_SKIP_ROWS,Te)}}function fe(w,y,W){let re=t.TEXTURE_2D;(y.isDataArrayTexture||y.isCompressedArrayTexture)&&(re=t.TEXTURE_2D_ARRAY),y.isData3DTexture&&(re=t.TEXTURE_3D);const de=ue(w,y),ve=y.source;n.bindTexture(re,w.__webglTexture,t.TEXTURE0+W);const be=i.get(ve);if(ve.version!==be.__version||de===!0){if(n.activeTexture(t.TEXTURE0+W),(typeof ImageBitmap<"u"&&y.image instanceof ImageBitmap)===!1){const he=ct.getPrimaries(ct.workingColorSpace),Fe=y.colorSpace===ws?null:ct.getPrimaries(y.colorSpace),Re=y.colorSpace===ws||he===Fe?t.NONE:t.BROWSER_DEFAULT_WEBGL;n.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,y.flipY),n.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),n.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,Re)}n.pixelStorei(t.UNPACK_ALIGNMENT,y.unpackAlignment);let pe=m(y.image,!1,s.maxTextureSize);pe=F(y,pe);const Te=r.convert(y.format,y.colorSpace),Le=r.convert(y.type);let Ae=x(y.internalFormat,Te,Le,y.normalized,y.colorSpace,y.isVideoTexture);Ge(re,y);let Me;const et=y.mipmaps,st=y.isVideoTexture!==!0,gt=be.__version===void 0||de===!0,q=ve.dataReady,we=C(y,pe);if(y.isDepthTexture)Ae=D(y.format===ir,y.type),gt&&(st?n.texStorage2D(t.TEXTURE_2D,1,Ae,pe.width,pe.height):n.texImage2D(t.TEXTURE_2D,0,Ae,pe.width,pe.height,0,Te,Le,null));else if(y.isDataTexture)if(et.length>0){st&&gt&&n.texStorage2D(t.TEXTURE_2D,we,Ae,et[0].width,et[0].height);for(let he=0,Fe=et.length;he<Fe;he++)Me=et[he],st?q&&n.texSubImage2D(t.TEXTURE_2D,he,0,0,Me.width,Me.height,Te,Le,Me.data):n.texImage2D(t.TEXTURE_2D,he,Ae,Me.width,Me.height,0,Te,Le,Me.data);y.generateMipmaps=!1}else st?(gt&&n.texStorage2D(t.TEXTURE_2D,we,Ae,pe.width,pe.height),q&&te(y,pe,Te,Le)):n.texImage2D(t.TEXTURE_2D,0,Ae,pe.width,pe.height,0,Te,Le,pe.data);else if(y.isCompressedTexture)if(y.isCompressedArrayTexture){st&&gt&&n.texStorage3D(t.TEXTURE_2D_ARRAY,we,Ae,et[0].width,et[0].height,pe.depth);for(let he=0,Fe=et.length;he<Fe;he++)if(Me=et[he],y.format!==ii)if(Te!==null)if(st){if(q)if(y.layerUpdates.size>0){const Re=pm(Me.width,Me.height,y.format,y.type);for(const _e of y.layerUpdates){const He=Me.data.subarray(_e*Re/Me.data.BYTES_PER_ELEMENT,(_e+1)*Re/Me.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,he,0,0,_e,Me.width,Me.height,1,Te,He)}y.clearLayerUpdates()}else n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,he,0,0,0,Me.width,Me.height,pe.depth,Te,Me.data)}else n.compressedTexImage3D(t.TEXTURE_2D_ARRAY,he,Ae,Me.width,Me.height,pe.depth,0,Me.data,0,0);else je("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else st?q&&n.texSubImage3D(t.TEXTURE_2D_ARRAY,he,0,0,0,Me.width,Me.height,pe.depth,Te,Le,Me.data):n.texImage3D(t.TEXTURE_2D_ARRAY,he,Ae,Me.width,Me.height,pe.depth,0,Te,Le,Me.data)}else{st&&gt&&n.texStorage2D(t.TEXTURE_2D,we,Ae,et[0].width,et[0].height);for(let he=0,Fe=et.length;he<Fe;he++)Me=et[he],y.format!==ii?Te!==null?st?q&&n.compressedTexSubImage2D(t.TEXTURE_2D,he,0,0,Me.width,Me.height,Te,Me.data):n.compressedTexImage2D(t.TEXTURE_2D,he,Ae,Me.width,Me.height,0,Me.data):je("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):st?q&&n.texSubImage2D(t.TEXTURE_2D,he,0,0,Me.width,Me.height,Te,Le,Me.data):n.texImage2D(t.TEXTURE_2D,he,Ae,Me.width,Me.height,0,Te,Le,Me.data)}else if(y.isDataArrayTexture)if(st){if(gt&&n.texStorage3D(t.TEXTURE_2D_ARRAY,we,Ae,pe.width,pe.height,pe.depth),q)if(y.layerUpdates.size>0){const he=pm(pe.width,pe.height,y.format,y.type);for(const Fe of y.layerUpdates){const Re=pe.data.subarray(Fe*he/pe.data.BYTES_PER_ELEMENT,(Fe+1)*he/pe.data.BYTES_PER_ELEMENT);n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,Fe,pe.width,pe.height,1,Te,Le,Re)}y.clearLayerUpdates()}else n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,0,pe.width,pe.height,pe.depth,Te,Le,pe.data)}else n.texImage3D(t.TEXTURE_2D_ARRAY,0,Ae,pe.width,pe.height,pe.depth,0,Te,Le,pe.data);else if(y.isData3DTexture)st?(gt&&n.texStorage3D(t.TEXTURE_3D,we,Ae,pe.width,pe.height,pe.depth),q&&n.texSubImage3D(t.TEXTURE_3D,0,0,0,0,pe.width,pe.height,pe.depth,Te,Le,pe.data)):n.texImage3D(t.TEXTURE_3D,0,Ae,pe.width,pe.height,pe.depth,0,Te,Le,pe.data);else if(y.isFramebufferTexture){if(gt)if(st)n.texStorage2D(t.TEXTURE_2D,we,Ae,pe.width,pe.height);else{let he=pe.width,Fe=pe.height;for(let Re=0;Re<we;Re++)n.texImage2D(t.TEXTURE_2D,Re,Ae,he,Fe,0,Te,Le,null),he>>=1,Fe>>=1}}else if(y.isHTMLTexture){if("texElementImage2D"in t){const he=t.canvas;if(he.hasAttribute("layoutsubtree")||he.setAttribute("layoutsubtree","true"),pe.parentNode!==he){he.appendChild(pe),d.add(y),he.onpaint=nt=>{const $t=nt.changedElements;for(const Rt of d)$t.includes(Rt.image)&&(Rt.needsUpdate=!0)},he.requestPaint();return}const Fe=0,Re=t.RGBA,_e=t.RGBA,He=t.UNSIGNED_BYTE;t.texElementImage2D(t.TEXTURE_2D,Fe,Re,_e,He,pe),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE)}}else if(et.length>0){if(st&&gt){const he=K(et[0]);n.texStorage2D(t.TEXTURE_2D,we,Ae,he.width,he.height)}for(let he=0,Fe=et.length;he<Fe;he++)Me=et[he],st?q&&n.texSubImage2D(t.TEXTURE_2D,he,0,0,Te,Le,Me):n.texImage2D(t.TEXTURE_2D,he,Ae,Te,Le,Me);y.generateMipmaps=!1}else if(st){if(gt){const he=K(pe);n.texStorage2D(t.TEXTURE_2D,we,Ae,he.width,he.height)}q&&n.texSubImage2D(t.TEXTURE_2D,0,0,0,Te,Le,pe)}else n.texImage2D(t.TEXTURE_2D,0,Ae,Te,Le,pe);h(y)&&v(re),be.__version=ve.version,y.onUpdate&&y.onUpdate(y)}w.__version=y.version}function ge(w,y,W){if(y.image.length!==6)return;const re=ue(w,y),de=y.source;n.bindTexture(t.TEXTURE_CUBE_MAP,w.__webglTexture,t.TEXTURE0+W);const ve=i.get(de);if(de.version!==ve.__version||re===!0){n.activeTexture(t.TEXTURE0+W);const be=ct.getPrimaries(ct.workingColorSpace),ce=y.colorSpace===ws?null:ct.getPrimaries(y.colorSpace),pe=y.colorSpace===ws||be===ce?t.NONE:t.BROWSER_DEFAULT_WEBGL;n.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,y.flipY),n.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),n.pixelStorei(t.UNPACK_ALIGNMENT,y.unpackAlignment),n.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,pe);const Te=y.isCompressedTexture||y.image[0].isCompressedTexture,Le=y.image[0]&&y.image[0].isDataTexture,Ae=[];for(let _e=0;_e<6;_e++)!Te&&!Le?Ae[_e]=m(y.image[_e],!0,s.maxCubemapSize):Ae[_e]=Le?y.image[_e].image:y.image[_e],Ae[_e]=F(y,Ae[_e]);const Me=Ae[0],et=r.convert(y.format,y.colorSpace),st=r.convert(y.type),gt=x(y.internalFormat,et,st,y.normalized,y.colorSpace),q=y.isVideoTexture!==!0,we=ve.__version===void 0||re===!0,he=de.dataReady;let Fe=C(y,Me);Ge(t.TEXTURE_CUBE_MAP,y);let Re;if(Te){q&&we&&n.texStorage2D(t.TEXTURE_CUBE_MAP,Fe,gt,Me.width,Me.height);for(let _e=0;_e<6;_e++){Re=Ae[_e].mipmaps;for(let He=0;He<Re.length;He++){const nt=Re[He];y.format!==ii?et!==null?q?he&&n.compressedTexSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+_e,He,0,0,nt.width,nt.height,et,nt.data):n.compressedTexImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+_e,He,gt,nt.width,nt.height,0,nt.data):je("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):q?he&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+_e,He,0,0,nt.width,nt.height,et,st,nt.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+_e,He,gt,nt.width,nt.height,0,et,st,nt.data)}}}else{if(Re=y.mipmaps,q&&we){Re.length>0&&Fe++;const _e=K(Ae[0]);n.texStorage2D(t.TEXTURE_CUBE_MAP,Fe,gt,_e.width,_e.height)}for(let _e=0;_e<6;_e++)if(Le){q?he&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+_e,0,0,0,Ae[_e].width,Ae[_e].height,et,st,Ae[_e].data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+_e,0,gt,Ae[_e].width,Ae[_e].height,0,et,st,Ae[_e].data);for(let He=0;He<Re.length;He++){const $t=Re[He].image[_e].image;q?he&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+_e,He+1,0,0,$t.width,$t.height,et,st,$t.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+_e,He+1,gt,$t.width,$t.height,0,et,st,$t.data)}}else{q?he&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+_e,0,0,0,et,st,Ae[_e]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+_e,0,gt,et,st,Ae[_e]);for(let He=0;He<Re.length;He++){const nt=Re[He];q?he&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+_e,He+1,0,0,et,st,nt.image[_e]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+_e,He+1,gt,et,st,nt.image[_e])}}}h(y)&&v(t.TEXTURE_CUBE_MAP),ve.__version=de.version,y.onUpdate&&y.onUpdate(y)}w.__version=y.version}function ye(w,y,W,re,de,ve){const be=r.convert(W.format,W.colorSpace),ce=r.convert(W.type),pe=x(W.internalFormat,be,ce,W.normalized,W.colorSpace),Te=i.get(y),Le=i.get(W);if(Le.__renderTarget=y,!Te.__hasExternalTextures){const Ae=Math.max(1,y.width>>ve),Me=Math.max(1,y.height>>ve);de===t.TEXTURE_3D||de===t.TEXTURE_2D_ARRAY?n.texImage3D(de,ve,pe,Ae,Me,y.depth,0,be,ce,null):n.texImage2D(de,ve,pe,Ae,Me,0,be,ce,null)}n.bindFramebuffer(t.FRAMEBUFFER,w),z(y)?a.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,re,de,Le.__webglTexture,0,k(y)):(de===t.TEXTURE_2D||de>=t.TEXTURE_CUBE_MAP_POSITIVE_X&&de<=t.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&t.framebufferTexture2D(t.FRAMEBUFFER,re,de,Le.__webglTexture,ve),n.bindFramebuffer(t.FRAMEBUFFER,null)}function T(w,y,W){if(t.bindRenderbuffer(t.RENDERBUFFER,w),y.depthBuffer){const re=y.depthTexture,de=re&&re.isDepthTexture?re.type:null,ve=D(y.stencilBuffer,de),be=y.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;z(y)?a.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,k(y),ve,y.width,y.height):W?t.renderbufferStorageMultisample(t.RENDERBUFFER,k(y),ve,y.width,y.height):t.renderbufferStorage(t.RENDERBUFFER,ve,y.width,y.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,be,t.RENDERBUFFER,w)}else{const re=y.textures;for(let de=0;de<re.length;de++){const ve=re[de],be=r.convert(ve.format,ve.colorSpace),ce=r.convert(ve.type),pe=x(ve.internalFormat,be,ce,ve.normalized,ve.colorSpace);z(y)?a.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,k(y),pe,y.width,y.height):W?t.renderbufferStorageMultisample(t.RENDERBUFFER,k(y),pe,y.width,y.height):t.renderbufferStorage(t.RENDERBUFFER,pe,y.width,y.height)}}t.bindRenderbuffer(t.RENDERBUFFER,null)}function I(w,y,W){const re=y.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(t.FRAMEBUFFER,w),!(y.depthTexture&&y.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const de=i.get(y.depthTexture);if(de.__renderTarget=y,(!de.__webglTexture||y.depthTexture.image.width!==y.width||y.depthTexture.image.height!==y.height)&&(y.depthTexture.image.width=y.width,y.depthTexture.image.height=y.height,y.depthTexture.needsUpdate=!0),re){if(de.__webglInit===void 0&&(de.__webglInit=!0,y.depthTexture.addEventListener("dispose",R)),de.__webglTexture===void 0){de.__webglTexture=t.createTexture(),n.bindTexture(t.TEXTURE_CUBE_MAP,de.__webglTexture),Ge(t.TEXTURE_CUBE_MAP,y.depthTexture);const Te=r.convert(y.depthTexture.format),Le=r.convert(y.depthTexture.type);let Ae;y.depthTexture.format===os?Ae=t.DEPTH_COMPONENT24:y.depthTexture.format===ir&&(Ae=t.DEPTH24_STENCIL8);for(let Me=0;Me<6;Me++)t.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Me,0,Ae,y.width,y.height,0,Te,Le,null)}}else le(y.depthTexture,0);const ve=de.__webglTexture,be=k(y),ce=re?t.TEXTURE_CUBE_MAP_POSITIVE_X+W:t.TEXTURE_2D,pe=y.depthTexture.format===ir?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;if(y.depthTexture.format===os)z(y)?a.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,pe,ce,ve,0,be):t.framebufferTexture2D(t.FRAMEBUFFER,pe,ce,ve,0);else if(y.depthTexture.format===ir)z(y)?a.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,pe,ce,ve,0,be):t.framebufferTexture2D(t.FRAMEBUFFER,pe,ce,ve,0);else throw new Error("Unknown depthTexture format")}function V(w){const y=i.get(w),W=w.isWebGLCubeRenderTarget===!0;if(y.__boundDepthTexture!==w.depthTexture){const re=w.depthTexture;if(y.__depthDisposeCallback&&y.__depthDisposeCallback(),re){const de=()=>{delete y.__boundDepthTexture,delete y.__depthDisposeCallback,re.removeEventListener("dispose",de)};re.addEventListener("dispose",de),y.__depthDisposeCallback=de}y.__boundDepthTexture=re}if(w.depthTexture&&!y.__autoAllocateDepthBuffer)if(W)for(let re=0;re<6;re++)I(y.__webglFramebuffer[re],w,re);else{const re=w.texture.mipmaps;re&&re.length>0?I(y.__webglFramebuffer[0],w,0):I(y.__webglFramebuffer,w,0)}else if(W){y.__webglDepthbuffer=[];for(let re=0;re<6;re++)if(n.bindFramebuffer(t.FRAMEBUFFER,y.__webglFramebuffer[re]),y.__webglDepthbuffer[re]===void 0)y.__webglDepthbuffer[re]=t.createRenderbuffer(),T(y.__webglDepthbuffer[re],w,!1);else{const de=w.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,ve=y.__webglDepthbuffer[re];t.bindRenderbuffer(t.RENDERBUFFER,ve),t.framebufferRenderbuffer(t.FRAMEBUFFER,de,t.RENDERBUFFER,ve)}}else{const re=w.texture.mipmaps;if(re&&re.length>0?n.bindFramebuffer(t.FRAMEBUFFER,y.__webglFramebuffer[0]):n.bindFramebuffer(t.FRAMEBUFFER,y.__webglFramebuffer),y.__webglDepthbuffer===void 0)y.__webglDepthbuffer=t.createRenderbuffer(),T(y.__webglDepthbuffer,w,!1);else{const de=w.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,ve=y.__webglDepthbuffer;t.bindRenderbuffer(t.RENDERBUFFER,ve),t.framebufferRenderbuffer(t.FRAMEBUFFER,de,t.RENDERBUFFER,ve)}}n.bindFramebuffer(t.FRAMEBUFFER,null)}function Y(w,y,W){const re=i.get(w);y!==void 0&&ye(re.__webglFramebuffer,w,w.texture,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,0),W!==void 0&&V(w)}function J(w){const y=w.texture,W=i.get(w),re=i.get(y);w.addEventListener("dispose",S);const de=w.textures,ve=w.isWebGLCubeRenderTarget===!0,be=de.length>1;if(be||(re.__webglTexture===void 0&&(re.__webglTexture=t.createTexture()),re.__version=y.version,o.memory.textures++),ve){W.__webglFramebuffer=[];for(let ce=0;ce<6;ce++)if(y.mipmaps&&y.mipmaps.length>0){W.__webglFramebuffer[ce]=[];for(let pe=0;pe<y.mipmaps.length;pe++)W.__webglFramebuffer[ce][pe]=t.createFramebuffer()}else W.__webglFramebuffer[ce]=t.createFramebuffer()}else{if(y.mipmaps&&y.mipmaps.length>0){W.__webglFramebuffer=[];for(let ce=0;ce<y.mipmaps.length;ce++)W.__webglFramebuffer[ce]=t.createFramebuffer()}else W.__webglFramebuffer=t.createFramebuffer();if(be)for(let ce=0,pe=de.length;ce<pe;ce++){const Te=i.get(de[ce]);Te.__webglTexture===void 0&&(Te.__webglTexture=t.createTexture(),o.memory.textures++)}if(w.samples>0&&z(w)===!1){W.__webglMultisampledFramebuffer=t.createFramebuffer(),W.__webglColorRenderbuffer=[],n.bindFramebuffer(t.FRAMEBUFFER,W.__webglMultisampledFramebuffer);for(let ce=0;ce<de.length;ce++){const pe=de[ce];W.__webglColorRenderbuffer[ce]=t.createRenderbuffer(),t.bindRenderbuffer(t.RENDERBUFFER,W.__webglColorRenderbuffer[ce]);const Te=r.convert(pe.format,pe.colorSpace),Le=r.convert(pe.type),Ae=x(pe.internalFormat,Te,Le,pe.normalized,pe.colorSpace,w.isXRRenderTarget===!0),Me=k(w);t.renderbufferStorageMultisample(t.RENDERBUFFER,Me,Ae,w.width,w.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+ce,t.RENDERBUFFER,W.__webglColorRenderbuffer[ce])}t.bindRenderbuffer(t.RENDERBUFFER,null),w.depthBuffer&&(W.__webglDepthRenderbuffer=t.createRenderbuffer(),T(W.__webglDepthRenderbuffer,w,!0)),n.bindFramebuffer(t.FRAMEBUFFER,null)}}if(ve){n.bindTexture(t.TEXTURE_CUBE_MAP,re.__webglTexture),Ge(t.TEXTURE_CUBE_MAP,y);for(let ce=0;ce<6;ce++)if(y.mipmaps&&y.mipmaps.length>0)for(let pe=0;pe<y.mipmaps.length;pe++)ye(W.__webglFramebuffer[ce][pe],w,y,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+ce,pe);else ye(W.__webglFramebuffer[ce],w,y,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+ce,0);h(y)&&v(t.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(be){for(let ce=0,pe=de.length;ce<pe;ce++){const Te=de[ce],Le=i.get(Te);let Ae=t.TEXTURE_2D;(w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(Ae=w.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),n.bindTexture(Ae,Le.__webglTexture),Ge(Ae,Te),ye(W.__webglFramebuffer,w,Te,t.COLOR_ATTACHMENT0+ce,Ae,0),h(Te)&&v(Ae)}n.unbindTexture()}else{let ce=t.TEXTURE_2D;if((w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(ce=w.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),n.bindTexture(ce,re.__webglTexture),Ge(ce,y),y.mipmaps&&y.mipmaps.length>0)for(let pe=0;pe<y.mipmaps.length;pe++)ye(W.__webglFramebuffer[pe],w,y,t.COLOR_ATTACHMENT0,ce,pe);else ye(W.__webglFramebuffer,w,y,t.COLOR_ATTACHMENT0,ce,0);h(y)&&v(ce),n.unbindTexture()}w.depthBuffer&&V(w)}function ae(w){const y=w.textures;for(let W=0,re=y.length;W<re;W++){const de=y[W];if(h(de)){const ve=b(w),be=i.get(de).__webglTexture;n.bindTexture(ve,be),v(ve),n.unbindTexture()}}}const U=[],O=[];function A(w){if(w.samples>0){if(z(w)===!1){const y=w.textures,W=w.width,re=w.height;let de=t.COLOR_BUFFER_BIT;const ve=w.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,be=i.get(w),ce=y.length>1;if(ce)for(let Te=0;Te<y.length;Te++)n.bindFramebuffer(t.FRAMEBUFFER,be.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+Te,t.RENDERBUFFER,null),n.bindFramebuffer(t.FRAMEBUFFER,be.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+Te,t.TEXTURE_2D,null,0);n.bindFramebuffer(t.READ_FRAMEBUFFER,be.__webglMultisampledFramebuffer);const pe=w.texture.mipmaps;pe&&pe.length>0?n.bindFramebuffer(t.DRAW_FRAMEBUFFER,be.__webglFramebuffer[0]):n.bindFramebuffer(t.DRAW_FRAMEBUFFER,be.__webglFramebuffer);for(let Te=0;Te<y.length;Te++){if(w.resolveDepthBuffer&&(w.depthBuffer&&(de|=t.DEPTH_BUFFER_BIT),w.stencilBuffer&&w.resolveStencilBuffer&&(de|=t.STENCIL_BUFFER_BIT)),ce){t.framebufferRenderbuffer(t.READ_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.RENDERBUFFER,be.__webglColorRenderbuffer[Te]);const Le=i.get(y[Te]).__webglTexture;t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,Le,0)}t.blitFramebuffer(0,0,W,re,0,0,W,re,de,t.NEAREST),l===!0&&(U.length=0,O.length=0,U.push(t.COLOR_ATTACHMENT0+Te),w.depthBuffer&&w.resolveDepthBuffer===!1&&(U.push(ve),O.push(ve),t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,O)),t.invalidateFramebuffer(t.READ_FRAMEBUFFER,U))}if(n.bindFramebuffer(t.READ_FRAMEBUFFER,null),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),ce)for(let Te=0;Te<y.length;Te++){n.bindFramebuffer(t.FRAMEBUFFER,be.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+Te,t.RENDERBUFFER,be.__webglColorRenderbuffer[Te]);const Le=i.get(y[Te]).__webglTexture;n.bindFramebuffer(t.FRAMEBUFFER,be.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+Te,t.TEXTURE_2D,Le,0)}n.bindFramebuffer(t.DRAW_FRAMEBUFFER,be.__webglMultisampledFramebuffer)}else if(w.depthBuffer&&w.resolveDepthBuffer===!1&&l){const y=w.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,[y])}}}function k(w){return Math.min(s.maxSamples,w.samples)}function z(w){const y=i.get(w);return w.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&y.__useRenderToTexture!==!1}function ee(w){const y=o.render.frame;u.get(w)!==y&&(u.set(w,y),w.update())}function F(w,y){const W=w.colorSpace,re=w.format,de=w.type;return w.isCompressedTexture===!0||w.isVideoTexture===!0||W!==Tl&&W!==ws&&(ct.getTransfer(W)===Tt?(re!==ii||de!==Yn)&&je("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):pt("WebGLTextures: Unsupported texture color space:",W)),y}function K(w){return typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement?(c.width=w.naturalWidth||w.width,c.height=w.naturalHeight||w.height):typeof VideoFrame<"u"&&w instanceof VideoFrame?(c.width=w.displayWidth,c.height=w.displayHeight):(c.width=w.width,c.height=w.height),c}this.allocateTextureUnit=X,this.resetTextureUnits=B,this.getTextureUnits=Z,this.setTextureUnits=G,this.setTexture2D=le,this.setTexture2DArray=me,this.setTexture3D=Se,this.setTextureCube=Ce,this.rebindTextures=Y,this.setupRenderTarget=J,this.updateRenderTargetMipmap=ae,this.updateMultisampleRenderTarget=A,this.setupDepthRenderbuffer=V,this.setupFrameBufferTexture=ye,this.useMultisampledRTT=z,this.isReversedDepthBuffer=function(){return n.buffers.depth.getReversed()}}function wR(t,e){function n(i,s=ws){let r;const o=ct.getTransfer(s);if(i===Yn)return t.UNSIGNED_BYTE;if(i===Ad)return t.UNSIGNED_SHORT_4_4_4_4;if(i===wd)return t.UNSIGNED_SHORT_5_5_5_1;if(i===I0)return t.UNSIGNED_INT_5_9_9_9_REV;if(i===L0)return t.UNSIGNED_INT_10F_11F_11F_REV;if(i===R0)return t.BYTE;if(i===P0)return t.SHORT;if(i===Jo)return t.UNSIGNED_SHORT;if(i===Td)return t.INT;if(i===Di)return t.UNSIGNED_INT;if(i===Mi)return t.FLOAT;if(i===rs)return t.HALF_FLOAT;if(i===D0)return t.ALPHA;if(i===N0)return t.RGB;if(i===ii)return t.RGBA;if(i===os)return t.DEPTH_COMPONENT;if(i===ir)return t.DEPTH_STENCIL;if(i===U0)return t.RED;if(i===Cd)return t.RED_INTEGER;if(i===cr)return t.RG;if(i===Rd)return t.RG_INTEGER;if(i===Pd)return t.RGBA_INTEGER;if(i===Ja||i===Qa||i===el||i===tl)if(o===Tt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===Ja)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Qa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===el)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===tl)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===Ja)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Qa)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===el)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===tl)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===rf||i===of||i===af||i===lf)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===rf)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===of)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===af)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===lf)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===cf||i===uf||i===ff||i===df||i===hf||i===El||i===pf)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===cf||i===uf)return o===Tt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===ff)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(i===df)return r.COMPRESSED_R11_EAC;if(i===hf)return r.COMPRESSED_SIGNED_R11_EAC;if(i===El)return r.COMPRESSED_RG11_EAC;if(i===pf)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===mf||i===gf||i===_f||i===vf||i===xf||i===Sf||i===yf||i===bf||i===Ef||i===Mf||i===Tf||i===Af||i===wf||i===Cf)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===mf)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===gf)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===_f)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===vf)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===xf)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Sf)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===yf)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===bf)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Ef)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Mf)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Tf)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Af)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===wf)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Cf)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Rf||i===Pf||i===If)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===Rf)return o===Tt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Pf)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===If)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Lf||i===Df||i===Ml||i===Nf)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===Lf)return r.COMPRESSED_RED_RGTC1_EXT;if(i===Df)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Ml)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Nf)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Qo?t.UNSIGNED_INT_24_8:t[i]!==void 0?t[i]:null}return{convert:n}}const CR=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,RR=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class PR{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,n){if(this.texture===null){const i=new $0(e.texture);(e.depthNear!==n.depthNear||e.depthFar!==n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const n=e.cameras[0].viewport,i=new ci({vertexShader:CR,fragmentShader:RR,uniforms:{depthColor:{value:this.texture},depthWidth:{value:n.z},depthHeight:{value:n.w}}});this.mesh=new Ni(new la(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class IR extends dr{constructor(e,n){super();const i=this;let s=null,r=1,o=null,a="local-floor",l=1,c=null,u=null,d=null,f=null,p=null,g=null;const _=typeof XRWebGLBinding<"u",m=new PR,h={},v=n.getContextAttributes();let b=null,x=null;const D=[],C=[],R=new mt;let S=null;const M=new ei;M.viewport=new Yt;const L=new ei;L.viewport=new Yt;const E=[M,L],P=new VT;let B=null,Z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(ue){let j=D[ue];return j===void 0&&(j=new Vc,D[ue]=j),j.getTargetRaySpace()},this.getControllerGrip=function(ue){let j=D[ue];return j===void 0&&(j=new Vc,D[ue]=j),j.getGripSpace()},this.getHand=function(ue){let j=D[ue];return j===void 0&&(j=new Vc,D[ue]=j),j.getHandSpace()};function G(ue){const j=C.indexOf(ue.inputSource);if(j===-1)return;const te=D[j];te!==void 0&&(te.update(ue.inputSource,ue.frame,c||o),te.dispatchEvent({type:ue.type,data:ue.inputSource}))}function X(){s.removeEventListener("select",G),s.removeEventListener("selectstart",G),s.removeEventListener("selectend",G),s.removeEventListener("squeeze",G),s.removeEventListener("squeezestart",G),s.removeEventListener("squeezeend",G),s.removeEventListener("end",X),s.removeEventListener("inputsourceschange",$);for(let ue=0;ue<D.length;ue++){const j=C[ue];j!==null&&(C[ue]=null,D[ue].disconnect(j))}B=null,Z=null,m.reset();for(const ue in h)delete h[ue];e.setRenderTarget(b),p=null,f=null,d=null,s=null,x=null,Ge.stop(),i.isPresenting=!1,e.setPixelRatio(S),e.setSize(R.width,R.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(ue){r=ue,i.isPresenting===!0&&je("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(ue){a=ue,i.isPresenting===!0&&je("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(ue){c=ue},this.getBaseLayer=function(){return f!==null?f:p},this.getBinding=function(){return d===null&&_&&(d=new XRWebGLBinding(s,n)),d},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(ue){if(s=ue,s!==null){if(b=e.getRenderTarget(),s.addEventListener("select",G),s.addEventListener("selectstart",G),s.addEventListener("selectend",G),s.addEventListener("squeeze",G),s.addEventListener("squeezestart",G),s.addEventListener("squeezeend",G),s.addEventListener("end",X),s.addEventListener("inputsourceschange",$),v.xrCompatible!==!0&&await n.makeXRCompatible(),S=e.getPixelRatio(),e.getSize(R),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let te=null,fe=null,ge=null;v.depth&&(ge=v.stencil?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT24,te=v.stencil?ir:os,fe=v.stencil?Qo:Di);const ye={colorFormat:n.RGBA8,depthFormat:ge,scaleFactor:r};d=this.getBinding(),f=d.createProjectionLayer(ye),s.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),x=new Pi(f.textureWidth,f.textureHeight,{format:ii,type:Yn,depthTexture:new Qr(f.textureWidth,f.textureHeight,fe,void 0,void 0,void 0,void 0,void 0,void 0,te),stencilBuffer:v.stencil,colorSpace:e.outputColorSpace,samples:v.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{const te={antialias:v.antialias,alpha:!0,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,n,te),s.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),x=new Pi(p.framebufferWidth,p.framebufferHeight,{format:ii,type:Yn,colorSpace:e.outputColorSpace,stencilBuffer:v.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),Ge.setContext(s),Ge.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function $(ue){for(let j=0;j<ue.removed.length;j++){const te=ue.removed[j],fe=C.indexOf(te);fe>=0&&(C[fe]=null,D[fe].disconnect(te))}for(let j=0;j<ue.added.length;j++){const te=ue.added[j];let fe=C.indexOf(te);if(fe===-1){for(let ye=0;ye<D.length;ye++)if(ye>=C.length){C.push(te),fe=ye;break}else if(C[ye]===null){C[ye]=te,fe=ye;break}if(fe===-1)break}const ge=D[fe];ge&&ge.connect(te)}}const le=new se,me=new se;function Se(ue,j,te){le.setFromMatrixPosition(j.matrixWorld),me.setFromMatrixPosition(te.matrixWorld);const fe=le.distanceTo(me),ge=j.projectionMatrix.elements,ye=te.projectionMatrix.elements,T=ge[14]/(ge[10]-1),I=ge[14]/(ge[10]+1),V=(ge[9]+1)/ge[5],Y=(ge[9]-1)/ge[5],J=(ge[8]-1)/ge[0],ae=(ye[8]+1)/ye[0],U=T*J,O=T*ae,A=fe/(-J+ae),k=A*-J;if(j.matrixWorld.decompose(ue.position,ue.quaternion,ue.scale),ue.translateX(k),ue.translateZ(A),ue.matrixWorld.compose(ue.position,ue.quaternion,ue.scale),ue.matrixWorldInverse.copy(ue.matrixWorld).invert(),ge[10]===-1)ue.projectionMatrix.copy(j.projectionMatrix),ue.projectionMatrixInverse.copy(j.projectionMatrixInverse);else{const z=T+A,ee=I+A,F=U-k,K=O+(fe-k),w=V*I/ee*z,y=Y*I/ee*z;ue.projectionMatrix.makePerspective(F,K,w,y,z,ee),ue.projectionMatrixInverse.copy(ue.projectionMatrix).invert()}}function Ce(ue,j){j===null?ue.matrixWorld.copy(ue.matrix):ue.matrixWorld.multiplyMatrices(j.matrixWorld,ue.matrix),ue.matrixWorldInverse.copy(ue.matrixWorld).invert()}this.updateCamera=function(ue){if(s===null)return;let j=ue.near,te=ue.far;m.texture!==null&&(m.depthNear>0&&(j=m.depthNear),m.depthFar>0&&(te=m.depthFar)),P.near=L.near=M.near=j,P.far=L.far=M.far=te,(B!==P.near||Z!==P.far)&&(s.updateRenderState({depthNear:P.near,depthFar:P.far}),B=P.near,Z=P.far),P.layers.mask=ue.layers.mask|6,M.layers.mask=P.layers.mask&-5,L.layers.mask=P.layers.mask&-3;const fe=ue.parent,ge=P.cameras;Ce(P,fe);for(let ye=0;ye<ge.length;ye++)Ce(ge[ye],fe);ge.length===2?Se(P,M,L):P.projectionMatrix.copy(M.projectionMatrix),Pe(ue,P,fe)};function Pe(ue,j,te){te===null?ue.matrix.copy(j.matrixWorld):(ue.matrix.copy(te.matrixWorld),ue.matrix.invert(),ue.matrix.multiply(j.matrixWorld)),ue.matrix.decompose(ue.position,ue.quaternion,ue.scale),ue.updateMatrixWorld(!0),ue.projectionMatrix.copy(j.projectionMatrix),ue.projectionMatrixInverse.copy(j.projectionMatrixInverse),ue.isPerspectiveCamera&&(ue.fov=Of*2*Math.atan(1/ue.projectionMatrix.elements[5]),ue.zoom=1)}this.getCamera=function(){return P},this.getFoveation=function(){if(!(f===null&&p===null))return l},this.setFoveation=function(ue){l=ue,f!==null&&(f.fixedFoveation=ue),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=ue)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(P)},this.getCameraTexture=function(ue){return h[ue]};let Ke=null;function Qe(ue,j){if(u=j.getViewerPose(c||o),g=j,u!==null){const te=u.views;p!==null&&(e.setRenderTargetFramebuffer(x,p.framebuffer),e.setRenderTarget(x));let fe=!1;te.length!==P.cameras.length&&(P.cameras.length=0,fe=!0);for(let I=0;I<te.length;I++){const V=te[I];let Y=null;if(p!==null)Y=p.getViewport(V);else{const ae=d.getViewSubImage(f,V);Y=ae.viewport,I===0&&(e.setRenderTargetTextures(x,ae.colorTexture,ae.depthStencilTexture),e.setRenderTarget(x))}let J=E[I];J===void 0&&(J=new ei,J.layers.enable(I),J.viewport=new Yt,E[I]=J),J.matrix.fromArray(V.transform.matrix),J.matrix.decompose(J.position,J.quaternion,J.scale),J.projectionMatrix.fromArray(V.projectionMatrix),J.projectionMatrixInverse.copy(J.projectionMatrix).invert(),J.viewport.set(Y.x,Y.y,Y.width,Y.height),I===0&&(P.matrix.copy(J.matrix),P.matrix.decompose(P.position,P.quaternion,P.scale)),fe===!0&&P.cameras.push(J)}const ge=s.enabledFeatures;if(ge&&ge.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&_){d=i.getBinding();const I=d.getDepthInformation(te[0]);I&&I.isValid&&I.texture&&m.init(I,s.renderState)}if(ge&&ge.includes("camera-access")&&_){e.state.unbindTexture(),d=i.getBinding();for(let I=0;I<te.length;I++){const V=te[I].camera;if(V){let Y=h[V];Y||(Y=new $0,h[V]=Y);const J=d.getCameraImage(V);Y.sourceTexture=J}}}}for(let te=0;te<D.length;te++){const fe=C[te],ge=D[te];fe!==null&&ge!==void 0&&ge.update(fe,j,c||o)}Ke&&Ke(ue,j),j.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:j}),g=null}const Ge=new K0;Ge.setAnimationLoop(Qe),this.setAnimationLoop=function(ue){Ke=ue},this.dispose=function(){}}}const LR=new sn,tv=new tt;tv.set(-1,0,0,0,1,0,0,0,1);function DR(t,e){function n(m,h){m.matrixAutoUpdate===!0&&m.updateMatrix(),h.value.copy(m.matrix)}function i(m,h){h.color.getRGB(m.fogColor.value,X0(t)),h.isFog?(m.fogNear.value=h.near,m.fogFar.value=h.far):h.isFogExp2&&(m.fogDensity.value=h.density)}function s(m,h,v,b,x){h.isNodeMaterial?h.uniformsNeedUpdate=!1:h.isMeshBasicMaterial?r(m,h):h.isMeshLambertMaterial?(r(m,h),h.envMap&&(m.envMapIntensity.value=h.envMapIntensity)):h.isMeshToonMaterial?(r(m,h),d(m,h)):h.isMeshPhongMaterial?(r(m,h),u(m,h),h.envMap&&(m.envMapIntensity.value=h.envMapIntensity)):h.isMeshStandardMaterial?(r(m,h),f(m,h),h.isMeshPhysicalMaterial&&p(m,h,x)):h.isMeshMatcapMaterial?(r(m,h),g(m,h)):h.isMeshDepthMaterial?r(m,h):h.isMeshDistanceMaterial?(r(m,h),_(m,h)):h.isMeshNormalMaterial?r(m,h):h.isLineBasicMaterial?(o(m,h),h.isLineDashedMaterial&&a(m,h)):h.isPointsMaterial?l(m,h,v,b):h.isSpriteMaterial?c(m,h):h.isShadowMaterial?(m.color.value.copy(h.color),m.opacity.value=h.opacity):h.isShaderMaterial&&(h.uniformsNeedUpdate=!1)}function r(m,h){m.opacity.value=h.opacity,h.color&&m.diffuse.value.copy(h.color),h.emissive&&m.emissive.value.copy(h.emissive).multiplyScalar(h.emissiveIntensity),h.map&&(m.map.value=h.map,n(h.map,m.mapTransform)),h.alphaMap&&(m.alphaMap.value=h.alphaMap,n(h.alphaMap,m.alphaMapTransform)),h.bumpMap&&(m.bumpMap.value=h.bumpMap,n(h.bumpMap,m.bumpMapTransform),m.bumpScale.value=h.bumpScale,h.side===Dn&&(m.bumpScale.value*=-1)),h.normalMap&&(m.normalMap.value=h.normalMap,n(h.normalMap,m.normalMapTransform),m.normalScale.value.copy(h.normalScale),h.side===Dn&&m.normalScale.value.negate()),h.displacementMap&&(m.displacementMap.value=h.displacementMap,n(h.displacementMap,m.displacementMapTransform),m.displacementScale.value=h.displacementScale,m.displacementBias.value=h.displacementBias),h.emissiveMap&&(m.emissiveMap.value=h.emissiveMap,n(h.emissiveMap,m.emissiveMapTransform)),h.specularMap&&(m.specularMap.value=h.specularMap,n(h.specularMap,m.specularMapTransform)),h.alphaTest>0&&(m.alphaTest.value=h.alphaTest);const v=e.get(h),b=v.envMap,x=v.envMapRotation;b&&(m.envMap.value=b,m.envMapRotation.value.setFromMatrix4(LR.makeRotationFromEuler(x)).transpose(),b.isCubeTexture&&b.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(tv),m.reflectivity.value=h.reflectivity,m.ior.value=h.ior,m.refractionRatio.value=h.refractionRatio),h.lightMap&&(m.lightMap.value=h.lightMap,m.lightMapIntensity.value=h.lightMapIntensity,n(h.lightMap,m.lightMapTransform)),h.aoMap&&(m.aoMap.value=h.aoMap,m.aoMapIntensity.value=h.aoMapIntensity,n(h.aoMap,m.aoMapTransform))}function o(m,h){m.diffuse.value.copy(h.color),m.opacity.value=h.opacity,h.map&&(m.map.value=h.map,n(h.map,m.mapTransform))}function a(m,h){m.dashSize.value=h.dashSize,m.totalSize.value=h.dashSize+h.gapSize,m.scale.value=h.scale}function l(m,h,v,b){m.diffuse.value.copy(h.color),m.opacity.value=h.opacity,m.size.value=h.size*v,m.scale.value=b*.5,h.map&&(m.map.value=h.map,n(h.map,m.uvTransform)),h.alphaMap&&(m.alphaMap.value=h.alphaMap,n(h.alphaMap,m.alphaMapTransform)),h.alphaTest>0&&(m.alphaTest.value=h.alphaTest)}function c(m,h){m.diffuse.value.copy(h.color),m.opacity.value=h.opacity,m.rotation.value=h.rotation,h.map&&(m.map.value=h.map,n(h.map,m.mapTransform)),h.alphaMap&&(m.alphaMap.value=h.alphaMap,n(h.alphaMap,m.alphaMapTransform)),h.alphaTest>0&&(m.alphaTest.value=h.alphaTest)}function u(m,h){m.specular.value.copy(h.specular),m.shininess.value=Math.max(h.shininess,1e-4)}function d(m,h){h.gradientMap&&(m.gradientMap.value=h.gradientMap)}function f(m,h){m.metalness.value=h.metalness,h.metalnessMap&&(m.metalnessMap.value=h.metalnessMap,n(h.metalnessMap,m.metalnessMapTransform)),m.roughness.value=h.roughness,h.roughnessMap&&(m.roughnessMap.value=h.roughnessMap,n(h.roughnessMap,m.roughnessMapTransform)),h.envMap&&(m.envMapIntensity.value=h.envMapIntensity)}function p(m,h,v){m.ior.value=h.ior,h.sheen>0&&(m.sheenColor.value.copy(h.sheenColor).multiplyScalar(h.sheen),m.sheenRoughness.value=h.sheenRoughness,h.sheenColorMap&&(m.sheenColorMap.value=h.sheenColorMap,n(h.sheenColorMap,m.sheenColorMapTransform)),h.sheenRoughnessMap&&(m.sheenRoughnessMap.value=h.sheenRoughnessMap,n(h.sheenRoughnessMap,m.sheenRoughnessMapTransform))),h.clearcoat>0&&(m.clearcoat.value=h.clearcoat,m.clearcoatRoughness.value=h.clearcoatRoughness,h.clearcoatMap&&(m.clearcoatMap.value=h.clearcoatMap,n(h.clearcoatMap,m.clearcoatMapTransform)),h.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=h.clearcoatRoughnessMap,n(h.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),h.clearcoatNormalMap&&(m.clearcoatNormalMap.value=h.clearcoatNormalMap,n(h.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(h.clearcoatNormalScale),h.side===Dn&&m.clearcoatNormalScale.value.negate())),h.dispersion>0&&(m.dispersion.value=h.dispersion),h.iridescence>0&&(m.iridescence.value=h.iridescence,m.iridescenceIOR.value=h.iridescenceIOR,m.iridescenceThicknessMinimum.value=h.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=h.iridescenceThicknessRange[1],h.iridescenceMap&&(m.iridescenceMap.value=h.iridescenceMap,n(h.iridescenceMap,m.iridescenceMapTransform)),h.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=h.iridescenceThicknessMap,n(h.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),h.transmission>0&&(m.transmission.value=h.transmission,m.transmissionSamplerMap.value=v.texture,m.transmissionSamplerSize.value.set(v.width,v.height),h.transmissionMap&&(m.transmissionMap.value=h.transmissionMap,n(h.transmissionMap,m.transmissionMapTransform)),m.thickness.value=h.thickness,h.thicknessMap&&(m.thicknessMap.value=h.thicknessMap,n(h.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=h.attenuationDistance,m.attenuationColor.value.copy(h.attenuationColor)),h.anisotropy>0&&(m.anisotropyVector.value.set(h.anisotropy*Math.cos(h.anisotropyRotation),h.anisotropy*Math.sin(h.anisotropyRotation)),h.anisotropyMap&&(m.anisotropyMap.value=h.anisotropyMap,n(h.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=h.specularIntensity,m.specularColor.value.copy(h.specularColor),h.specularColorMap&&(m.specularColorMap.value=h.specularColorMap,n(h.specularColorMap,m.specularColorMapTransform)),h.specularIntensityMap&&(m.specularIntensityMap.value=h.specularIntensityMap,n(h.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,h){h.matcap&&(m.matcap.value=h.matcap)}function _(m,h){const v=e.get(h).light;m.referencePosition.value.setFromMatrixPosition(v.matrixWorld),m.nearDistance.value=v.shadow.camera.near,m.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function NR(t,e,n,i){let s={},r={},o=[];const a=t.getParameter(t.MAX_UNIFORM_BUFFER_BINDINGS);function l(v,b){const x=b.program;i.uniformBlockBinding(v,x)}function c(v,b){let x=s[v.id];x===void 0&&(g(v),x=u(v),s[v.id]=x,v.addEventListener("dispose",m));const D=b.program;i.updateUBOMapping(v,D);const C=e.render.frame;r[v.id]!==C&&(f(v),r[v.id]=C)}function u(v){const b=d();v.__bindingPointIndex=b;const x=t.createBuffer(),D=v.__size,C=v.usage;return t.bindBuffer(t.UNIFORM_BUFFER,x),t.bufferData(t.UNIFORM_BUFFER,D,C),t.bindBuffer(t.UNIFORM_BUFFER,null),t.bindBufferBase(t.UNIFORM_BUFFER,b,x),x}function d(){for(let v=0;v<a;v++)if(o.indexOf(v)===-1)return o.push(v),v;return pt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(v){const b=s[v.id],x=v.uniforms,D=v.__cache;t.bindBuffer(t.UNIFORM_BUFFER,b);for(let C=0,R=x.length;C<R;C++){const S=Array.isArray(x[C])?x[C]:[x[C]];for(let M=0,L=S.length;M<L;M++){const E=S[M];if(p(E,C,M,D)===!0){const P=E.__offset,B=Array.isArray(E.value)?E.value:[E.value];let Z=0;for(let G=0;G<B.length;G++){const X=B[G],$=_(X);typeof X=="number"||typeof X=="boolean"?(E.__data[0]=X,t.bufferSubData(t.UNIFORM_BUFFER,P+Z,E.__data)):X.isMatrix3?(E.__data[0]=X.elements[0],E.__data[1]=X.elements[1],E.__data[2]=X.elements[2],E.__data[3]=0,E.__data[4]=X.elements[3],E.__data[5]=X.elements[4],E.__data[6]=X.elements[5],E.__data[7]=0,E.__data[8]=X.elements[6],E.__data[9]=X.elements[7],E.__data[10]=X.elements[8],E.__data[11]=0):ArrayBuffer.isView(X)?E.__data.set(new X.constructor(X.buffer,X.byteOffset,E.__data.length)):(X.toArray(E.__data,Z),Z+=$.storage/Float32Array.BYTES_PER_ELEMENT)}t.bufferSubData(t.UNIFORM_BUFFER,P,E.__data)}}}t.bindBuffer(t.UNIFORM_BUFFER,null)}function p(v,b,x,D){const C=v.value,R=b+"_"+x;if(D[R]===void 0)return typeof C=="number"||typeof C=="boolean"?D[R]=C:ArrayBuffer.isView(C)?D[R]=C.slice():D[R]=C.clone(),!0;{const S=D[R];if(typeof C=="number"||typeof C=="boolean"){if(S!==C)return D[R]=C,!0}else{if(ArrayBuffer.isView(C))return!0;if(S.equals(C)===!1)return S.copy(C),!0}}return!1}function g(v){const b=v.uniforms;let x=0;const D=16;for(let R=0,S=b.length;R<S;R++){const M=Array.isArray(b[R])?b[R]:[b[R]];for(let L=0,E=M.length;L<E;L++){const P=M[L],B=Array.isArray(P.value)?P.value:[P.value];for(let Z=0,G=B.length;Z<G;Z++){const X=B[Z],$=_(X),le=x%D,me=le%$.boundary,Se=le+me;x+=me,Se!==0&&D-Se<$.storage&&(x+=D-Se),P.__data=new Float32Array($.storage/Float32Array.BYTES_PER_ELEMENT),P.__offset=x,x+=$.storage}}}const C=x%D;return C>0&&(x+=D-C),v.__size=x,v.__cache={},this}function _(v){const b={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(b.boundary=4,b.storage=4):v.isVector2?(b.boundary=8,b.storage=8):v.isVector3||v.isColor?(b.boundary=16,b.storage=12):v.isVector4?(b.boundary=16,b.storage=16):v.isMatrix3?(b.boundary=48,b.storage=48):v.isMatrix4?(b.boundary=64,b.storage=64):v.isTexture?je("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(v)?(b.boundary=16,b.storage=v.byteLength):je("WebGLRenderer: Unsupported uniform value type.",v),b}function m(v){const b=v.target;b.removeEventListener("dispose",m);const x=o.indexOf(b.__bindingPointIndex);o.splice(x,1),t.deleteBuffer(s[b.id]),delete s[b.id],delete r[b.id]}function h(){for(const v in s)t.deleteBuffer(s[v]);o=[],s={},r={}}return{bind:l,update:c,dispose:h}}const UR=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let _i=null;function OR(){return _i===null&&(_i=new CT(UR,16,16,cr,rs),_i.name="DFG_LUT",_i.minFilter=Sn,_i.magFilter=Sn,_i.wrapS=Ji,_i.wrapT=Ji,_i.generateMipmaps=!1,_i.needsUpdate=!0),_i}class FR{constructor(e={}){const{canvas:n=sT(),context:i=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:f=!1,outputBufferType:p=Yn}=e;this.isWebGLRenderer=!0;let g;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=i.getContextAttributes().alpha}else g=o;const _=p,m=new Set([Pd,Rd,Cd]),h=new Set([Yn,Di,Jo,Qo,Ad,wd]),v=new Uint32Array(4),b=new Int32Array(4),x=new se;let D=null,C=null;const R=[],S=[];let M=null;this.domElement=n,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Ri,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const L=this;let E=!1,P=null;this._outputColorSpace=kn;let B=0,Z=0,G=null,X=-1,$=null;const le=new Yt,me=new Yt;let Se=null;const Ce=new It(0);let Pe=0,Ke=n.width,Qe=n.height,Ge=1,ue=null,j=null;const te=new Yt(0,0,Ke,Qe),fe=new Yt(0,0,Ke,Qe);let ge=!1;const ye=new G0;let T=!1,I=!1;const V=new sn,Y=new se,J=new Yt,ae={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let U=!1;function O(){return G===null?Ge:1}let A=i;function k(N,Q){return n.getContext(N,Q)}try{const N={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:d};if("setAttribute"in n&&n.setAttribute("data-engine",`three.js r${Md}`),n.addEventListener("webglcontextlost",_e,!1),n.addEventListener("webglcontextrestored",He,!1),n.addEventListener("webglcontextcreationerror",nt,!1),A===null){const Q="webgl2";if(A=k(Q,N),A===null)throw k(Q)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(N){throw pt("WebGLRenderer: "+N.message),N}let z,ee,F,K,w,y,W,re,de,ve,be,ce,pe,Te,Le,Ae,Me,et,st,gt,q,we,he;function Fe(){z=new O2(A),z.init(),q=new wR(A,z),ee=new C2(A,z,e,q),F=new TR(A,z),ee.reversedDepthBuffer&&f&&F.buffers.depth.setReversed(!0),K=new B2(A),w=new fR,y=new AR(A,z,F,w,ee,q,K),W=new U2(L),re=new GT(A),we=new A2(A,re),de=new F2(A,re,K,we),ve=new V2(A,de,re,we,K),et=new z2(A,ee,y),Le=new R2(w),be=new uR(L,W,z,ee,we,Le),ce=new DR(L,w),pe=new hR,Te=new xR(z),Me=new T2(L,W,F,ve,g,l),Ae=new MR(L,ve,ee),he=new NR(A,K,ee,F),st=new w2(A,z,K),gt=new k2(A,z,K),K.programs=be.programs,L.capabilities=ee,L.extensions=z,L.properties=w,L.renderLists=pe,L.shadowMap=Ae,L.state=F,L.info=K}Fe(),_!==Yn&&(M=new G2(_,n.width,n.height,s,r));const Re=new IR(L,A);this.xr=Re,this.getContext=function(){return A},this.getContextAttributes=function(){return A.getContextAttributes()},this.forceContextLoss=function(){const N=z.get("WEBGL_lose_context");N&&N.loseContext()},this.forceContextRestore=function(){const N=z.get("WEBGL_lose_context");N&&N.restoreContext()},this.getPixelRatio=function(){return Ge},this.setPixelRatio=function(N){N!==void 0&&(Ge=N,this.setSize(Ke,Qe,!1))},this.getSize=function(N){return N.set(Ke,Qe)},this.setSize=function(N,Q,oe=!0){if(Re.isPresenting){je("WebGLRenderer: Can't change size while VR device is presenting.");return}Ke=N,Qe=Q,n.width=Math.floor(N*Ge),n.height=Math.floor(Q*Ge),oe===!0&&(n.style.width=N+"px",n.style.height=Q+"px"),M!==null&&M.setSize(n.width,n.height),this.setViewport(0,0,N,Q)},this.getDrawingBufferSize=function(N){return N.set(Ke*Ge,Qe*Ge).floor()},this.setDrawingBufferSize=function(N,Q,oe){Ke=N,Qe=Q,Ge=oe,n.width=Math.floor(N*oe),n.height=Math.floor(Q*oe),this.setViewport(0,0,N,Q)},this.setEffects=function(N){if(_===Yn){pt("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(N){for(let Q=0;Q<N.length;Q++)if(N[Q].isOutputPass===!0){je("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}M.setEffects(N||[])},this.getCurrentViewport=function(N){return N.copy(le)},this.getViewport=function(N){return N.copy(te)},this.setViewport=function(N,Q,oe,ne){N.isVector4?te.set(N.x,N.y,N.z,N.w):te.set(N,Q,oe,ne),F.viewport(le.copy(te).multiplyScalar(Ge).round())},this.getScissor=function(N){return N.copy(fe)},this.setScissor=function(N,Q,oe,ne){N.isVector4?fe.set(N.x,N.y,N.z,N.w):fe.set(N,Q,oe,ne),F.scissor(me.copy(fe).multiplyScalar(Ge).round())},this.getScissorTest=function(){return ge},this.setScissorTest=function(N){F.setScissorTest(ge=N)},this.setOpaqueSort=function(N){ue=N},this.setTransparentSort=function(N){j=N},this.getClearColor=function(N){return N.copy(Me.getClearColor())},this.setClearColor=function(){Me.setClearColor(...arguments)},this.getClearAlpha=function(){return Me.getClearAlpha()},this.setClearAlpha=function(){Me.setClearAlpha(...arguments)},this.clear=function(N=!0,Q=!0,oe=!0){let ne=0;if(N){let ie=!1;if(G!==null){const Ue=G.texture.format;ie=m.has(Ue)}if(ie){const Ue=G.texture.type,ze=h.has(Ue),Ne=Me.getClearColor(),Ve=Me.getClearAlpha(),We=Ne.r,it=Ne.g,at=Ne.b;ze?(v[0]=We,v[1]=it,v[2]=at,v[3]=Ve,A.clearBufferuiv(A.COLOR,0,v)):(b[0]=We,b[1]=it,b[2]=at,b[3]=Ve,A.clearBufferiv(A.COLOR,0,b))}else ne|=A.COLOR_BUFFER_BIT}Q&&(ne|=A.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),oe&&(ne|=A.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),ne!==0&&A.clear(ne)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(N){N.setRenderer(this),P=N},this.dispose=function(){n.removeEventListener("webglcontextlost",_e,!1),n.removeEventListener("webglcontextrestored",He,!1),n.removeEventListener("webglcontextcreationerror",nt,!1),Me.dispose(),pe.dispose(),Te.dispose(),w.dispose(),W.dispose(),ve.dispose(),we.dispose(),he.dispose(),be.dispose(),Re.dispose(),Re.removeEventListener("sessionstart",Wd),Re.removeEventListener("sessionend",$d),Fs.stop()};function _e(N){N.preventDefault(),Yp("WebGLRenderer: Context Lost."),E=!0}function He(){Yp("WebGLRenderer: Context Restored."),E=!1;const N=K.autoReset,Q=Ae.enabled,oe=Ae.autoUpdate,ne=Ae.needsUpdate,ie=Ae.type;Fe(),K.autoReset=N,Ae.enabled=Q,Ae.autoUpdate=oe,Ae.needsUpdate=ne,Ae.type=ie}function nt(N){pt("WebGLRenderer: A WebGL context could not be created. Reason: ",N.statusMessage)}function $t(N){const Q=N.target;Q.removeEventListener("dispose",$t),Rt(Q)}function Rt(N){Ui(N),w.remove(N)}function Ui(N){const Q=w.get(N).programs;Q!==void 0&&(Q.forEach(function(oe){be.releaseProgram(oe)}),N.isShaderMaterial&&be.releaseShaderCache(N))}this.renderBufferDirect=function(N,Q,oe,ne,ie,Ue){Q===null&&(Q=ae);const ze=ie.isMesh&&ie.matrixWorld.determinant()<0,Ne=dv(N,Q,oe,ne,ie);F.setMaterial(ne,ze);let Ve=oe.index,We=1;if(ne.wireframe===!0){if(Ve=de.getWireframeAttribute(oe),Ve===void 0)return;We=2}const it=oe.drawRange,at=oe.attributes.position;let $e=it.start*We,Pt=(it.start+it.count)*We;Ue!==null&&($e=Math.max($e,Ue.start*We),Pt=Math.min(Pt,(Ue.start+Ue.count)*We)),Ve!==null?($e=Math.max($e,0),Pt=Math.min(Pt,Ve.count)):at!=null&&($e=Math.max($e,0),Pt=Math.min(Pt,at.count));const Xt=Pt-$e;if(Xt<0||Xt===1/0)return;we.setup(ie,ne,Ne,oe,Ve);let Ht,Dt=st;if(Ve!==null&&(Ht=re.get(Ve),Dt=gt,Dt.setIndex(Ht)),ie.isMesh)ne.wireframe===!0?(F.setLineWidth(ne.wireframeLinewidth*O()),Dt.setMode(A.LINES)):Dt.setMode(A.TRIANGLES);else if(ie.isLine){let dn=ne.linewidth;dn===void 0&&(dn=1),F.setLineWidth(dn*O()),ie.isLineSegments?Dt.setMode(A.LINES):ie.isLineLoop?Dt.setMode(A.LINE_LOOP):Dt.setMode(A.LINE_STRIP)}else ie.isPoints?Dt.setMode(A.POINTS):ie.isSprite&&Dt.setMode(A.TRIANGLES);if(ie.isBatchedMesh)if(z.get("WEBGL_multi_draw"))Dt.renderMultiDraw(ie._multiDrawStarts,ie._multiDrawCounts,ie._multiDrawCount);else{const dn=ie._multiDrawStarts,Be=ie._multiDrawCounts,Nn=ie._multiDrawCount,ht=Ve?re.get(Ve).bytesPerElement:1,Wn=w.get(ne).currentProgram.getUniforms();for(let di=0;di<Nn;di++)Wn.setValue(A,"_gl_DrawID",di),Dt.render(dn[di]/ht,Be[di])}else if(ie.isInstancedMesh)Dt.renderInstances($e,Xt,ie.count);else if(oe.isInstancedBufferGeometry){const dn=oe._maxInstanceCount!==void 0?oe._maxInstanceCount:1/0,Be=Math.min(oe.instanceCount,dn);Dt.renderInstances($e,Xt,Be)}else Dt.render($e,Xt)};function fi(N,Q,oe){N.transparent===!0&&N.side===Yi&&N.forceSinglePass===!1?(N.side=Dn,N.needsUpdate=!0,ua(N,Q,oe),N.side=Is,N.needsUpdate=!0,ua(N,Q,oe),N.side=Yi):ua(N,Q,oe)}this.compile=function(N,Q,oe=null){oe===null&&(oe=N),C=Te.get(oe),C.init(Q),S.push(C),oe.traverseVisible(function(ie){ie.isLight&&ie.layers.test(Q.layers)&&(C.pushLight(ie),ie.castShadow&&C.pushShadow(ie))}),N!==oe&&N.traverseVisible(function(ie){ie.isLight&&ie.layers.test(Q.layers)&&(C.pushLight(ie),ie.castShadow&&C.pushShadow(ie))}),C.setupLights();const ne=new Set;return N.traverse(function(ie){if(!(ie.isMesh||ie.isPoints||ie.isLine||ie.isSprite))return;const Ue=ie.material;if(Ue)if(Array.isArray(Ue))for(let ze=0;ze<Ue.length;ze++){const Ne=Ue[ze];fi(Ne,oe,ie),ne.add(Ne)}else fi(Ue,oe,ie),ne.add(Ue)}),C=S.pop(),ne},this.compileAsync=function(N,Q,oe=null){const ne=this.compile(N,Q,oe);return new Promise(ie=>{function Ue(){if(ne.forEach(function(ze){w.get(ze).currentProgram.isReady()&&ne.delete(ze)}),ne.size===0){ie(N);return}setTimeout(Ue,10)}z.get("KHR_parallel_shader_compile")!==null?Ue():setTimeout(Ue,10)})};let lc=null;function uv(N){lc&&lc(N)}function Wd(){Fs.stop()}function $d(){Fs.start()}const Fs=new K0;Fs.setAnimationLoop(uv),typeof self<"u"&&Fs.setContext(self),this.setAnimationLoop=function(N){lc=N,Re.setAnimationLoop(N),N===null?Fs.stop():Fs.start()},Re.addEventListener("sessionstart",Wd),Re.addEventListener("sessionend",$d),this.render=function(N,Q){if(Q!==void 0&&Q.isCamera!==!0){pt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(E===!0)return;P!==null&&P.renderStart(N,Q);const oe=Re.enabled===!0&&Re.isPresenting===!0,ne=M!==null&&(G===null||oe)&&M.begin(L,G);if(N.matrixWorldAutoUpdate===!0&&N.updateMatrixWorld(),Q.parent===null&&Q.matrixWorldAutoUpdate===!0&&Q.updateMatrixWorld(),Re.enabled===!0&&Re.isPresenting===!0&&(M===null||M.isCompositing()===!1)&&(Re.cameraAutoUpdate===!0&&Re.updateCamera(Q),Q=Re.getCamera()),N.isScene===!0&&N.onBeforeRender(L,N,Q,G),C=Te.get(N,S.length),C.init(Q),C.state.textureUnits=y.getTextureUnits(),S.push(C),V.multiplyMatrices(Q.projectionMatrix,Q.matrixWorldInverse),ye.setFromProjectionMatrix(V,Ti,Q.reversedDepth),I=this.localClippingEnabled,T=Le.init(this.clippingPlanes,I),D=pe.get(N,R.length),D.init(),R.push(D),Re.enabled===!0&&Re.isPresenting===!0){const ze=L.xr.getDepthSensingMesh();ze!==null&&cc(ze,Q,-1/0,L.sortObjects)}cc(N,Q,0,L.sortObjects),D.finish(),L.sortObjects===!0&&D.sort(ue,j),U=Re.enabled===!1||Re.isPresenting===!1||Re.hasDepthSensing()===!1,U&&Me.addToRenderList(D,N),this.info.render.frame++,T===!0&&Le.beginShadows();const ie=C.state.shadowsArray;if(Ae.render(ie,N,Q),T===!0&&Le.endShadows(),this.info.autoReset===!0&&this.info.reset(),(ne&&M.hasRenderPass())===!1){const ze=D.opaque,Ne=D.transmissive;if(C.setupLights(),Q.isArrayCamera){const Ve=Q.cameras;if(Ne.length>0)for(let We=0,it=Ve.length;We<it;We++){const at=Ve[We];qd(ze,Ne,N,at)}U&&Me.render(N);for(let We=0,it=Ve.length;We<it;We++){const at=Ve[We];Xd(D,N,at,at.viewport)}}else Ne.length>0&&qd(ze,Ne,N,Q),U&&Me.render(N),Xd(D,N,Q)}G!==null&&Z===0&&(y.updateMultisampleRenderTarget(G),y.updateRenderTargetMipmap(G)),ne&&M.end(L),N.isScene===!0&&N.onAfterRender(L,N,Q),we.resetDefaultState(),X=-1,$=null,S.pop(),S.length>0?(C=S[S.length-1],y.setTextureUnits(C.state.textureUnits),T===!0&&Le.setGlobalState(L.clippingPlanes,C.state.camera)):C=null,R.pop(),R.length>0?D=R[R.length-1]:D=null,P!==null&&P.renderEnd()};function cc(N,Q,oe,ne){if(N.visible===!1)return;if(N.layers.test(Q.layers)){if(N.isGroup)oe=N.renderOrder;else if(N.isLOD)N.autoUpdate===!0&&N.update(Q);else if(N.isLightProbeGrid)C.pushLightProbeGrid(N);else if(N.isLight)C.pushLight(N),N.castShadow&&C.pushShadow(N);else if(N.isSprite){if(!N.frustumCulled||ye.intersectsSprite(N)){ne&&J.setFromMatrixPosition(N.matrixWorld).applyMatrix4(V);const ze=ve.update(N),Ne=N.material;Ne.visible&&D.push(N,ze,Ne,oe,J.z,null)}}else if((N.isMesh||N.isLine||N.isPoints)&&(!N.frustumCulled||ye.intersectsObject(N))){const ze=ve.update(N),Ne=N.material;if(ne&&(N.boundingSphere!==void 0?(N.boundingSphere===null&&N.computeBoundingSphere(),J.copy(N.boundingSphere.center)):(ze.boundingSphere===null&&ze.computeBoundingSphere(),J.copy(ze.boundingSphere.center)),J.applyMatrix4(N.matrixWorld).applyMatrix4(V)),Array.isArray(Ne)){const Ve=ze.groups;for(let We=0,it=Ve.length;We<it;We++){const at=Ve[We],$e=Ne[at.materialIndex];$e&&$e.visible&&D.push(N,ze,$e,oe,J.z,at)}}else Ne.visible&&D.push(N,ze,Ne,oe,J.z,null)}}const Ue=N.children;for(let ze=0,Ne=Ue.length;ze<Ne;ze++)cc(Ue[ze],Q,oe,ne)}function Xd(N,Q,oe,ne){const{opaque:ie,transmissive:Ue,transparent:ze}=N;C.setupLightsView(oe),T===!0&&Le.setGlobalState(L.clippingPlanes,oe),ne&&F.viewport(le.copy(ne)),ie.length>0&&ca(ie,Q,oe),Ue.length>0&&ca(Ue,Q,oe),ze.length>0&&ca(ze,Q,oe),F.buffers.depth.setTest(!0),F.buffers.depth.setMask(!0),F.buffers.color.setMask(!0),F.setPolygonOffset(!1)}function qd(N,Q,oe,ne){if((oe.isScene===!0?oe.overrideMaterial:null)!==null)return;if(C.state.transmissionRenderTarget[ne.id]===void 0){const $e=z.has("EXT_color_buffer_half_float")||z.has("EXT_color_buffer_float");C.state.transmissionRenderTarget[ne.id]=new Pi(1,1,{generateMipmaps:!0,type:$e?rs:Yn,minFilter:nr,samples:Math.max(4,ee.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ct.workingColorSpace})}const Ue=C.state.transmissionRenderTarget[ne.id],ze=ne.viewport||le;Ue.setSize(ze.z*L.transmissionResolutionScale,ze.w*L.transmissionResolutionScale);const Ne=L.getRenderTarget(),Ve=L.getActiveCubeFace(),We=L.getActiveMipmapLevel();L.setRenderTarget(Ue),L.getClearColor(Ce),Pe=L.getClearAlpha(),Pe<1&&L.setClearColor(16777215,.5),L.clear(),U&&Me.render(oe);const it=L.toneMapping;L.toneMapping=Ri;const at=ne.viewport;if(ne.viewport!==void 0&&(ne.viewport=void 0),C.setupLightsView(ne),T===!0&&Le.setGlobalState(L.clippingPlanes,ne),ca(N,oe,ne),y.updateMultisampleRenderTarget(Ue),y.updateRenderTargetMipmap(Ue),z.has("WEBGL_multisampled_render_to_texture")===!1){let $e=!1;for(let Pt=0,Xt=Q.length;Pt<Xt;Pt++){const Ht=Q[Pt],{object:Dt,geometry:dn,material:Be,group:Nn}=Ht;if(Be.side===Yi&&Dt.layers.test(ne.layers)){const ht=Be.side;Be.side=Dn,Be.needsUpdate=!0,Kd(Dt,oe,ne,dn,Be,Nn),Be.side=ht,Be.needsUpdate=!0,$e=!0}}$e===!0&&(y.updateMultisampleRenderTarget(Ue),y.updateRenderTargetMipmap(Ue))}L.setRenderTarget(Ne,Ve,We),L.setClearColor(Ce,Pe),at!==void 0&&(ne.viewport=at),L.toneMapping=it}function ca(N,Q,oe){const ne=Q.isScene===!0?Q.overrideMaterial:null;for(let ie=0,Ue=N.length;ie<Ue;ie++){const ze=N[ie],{object:Ne,geometry:Ve,group:We}=ze;let it=ze.material;it.allowOverride===!0&&ne!==null&&(it=ne),Ne.layers.test(oe.layers)&&Kd(Ne,Q,oe,Ve,it,We)}}function Kd(N,Q,oe,ne,ie,Ue){N.onBeforeRender(L,Q,oe,ne,ie,Ue),N.modelViewMatrix.multiplyMatrices(oe.matrixWorldInverse,N.matrixWorld),N.normalMatrix.getNormalMatrix(N.modelViewMatrix),ie.onBeforeRender(L,Q,oe,ne,N,Ue),ie.transparent===!0&&ie.side===Yi&&ie.forceSinglePass===!1?(ie.side=Dn,ie.needsUpdate=!0,L.renderBufferDirect(oe,Q,ne,ie,N,Ue),ie.side=Is,ie.needsUpdate=!0,L.renderBufferDirect(oe,Q,ne,ie,N,Ue),ie.side=Yi):L.renderBufferDirect(oe,Q,ne,ie,N,Ue),N.onAfterRender(L,Q,oe,ne,ie,Ue)}function ua(N,Q,oe){Q.isScene!==!0&&(Q=ae);const ne=w.get(N),ie=C.state.lights,Ue=C.state.shadowsArray,ze=ie.state.version,Ne=be.getParameters(N,ie.state,Ue,Q,oe,C.state.lightProbeGridArray),Ve=be.getProgramCacheKey(Ne);let We=ne.programs;ne.environment=N.isMeshStandardMaterial||N.isMeshLambertMaterial||N.isMeshPhongMaterial?Q.environment:null,ne.fog=Q.fog;const it=N.isMeshStandardMaterial||N.isMeshLambertMaterial&&!N.envMap||N.isMeshPhongMaterial&&!N.envMap;ne.envMap=W.get(N.envMap||ne.environment,it),ne.envMapRotation=ne.environment!==null&&N.envMap===null?Q.environmentRotation:N.envMapRotation,We===void 0&&(N.addEventListener("dispose",$t),We=new Map,ne.programs=We);let at=We.get(Ve);if(at!==void 0){if(ne.currentProgram===at&&ne.lightsStateVersion===ze)return jd(N,Ne),at}else Ne.uniforms=be.getUniforms(N),P!==null&&N.isNodeMaterial&&P.build(N,oe,Ne),N.onBeforeCompile(Ne,L),at=be.acquireProgram(Ne,Ve),We.set(Ve,at),ne.uniforms=Ne.uniforms;const $e=ne.uniforms;return(!N.isShaderMaterial&&!N.isRawShaderMaterial||N.clipping===!0)&&($e.clippingPlanes=Le.uniform),jd(N,Ne),ne.needsLights=pv(N),ne.lightsStateVersion=ze,ne.needsLights&&($e.ambientLightColor.value=ie.state.ambient,$e.lightProbe.value=ie.state.probe,$e.directionalLights.value=ie.state.directional,$e.directionalLightShadows.value=ie.state.directionalShadow,$e.spotLights.value=ie.state.spot,$e.spotLightShadows.value=ie.state.spotShadow,$e.rectAreaLights.value=ie.state.rectArea,$e.ltc_1.value=ie.state.rectAreaLTC1,$e.ltc_2.value=ie.state.rectAreaLTC2,$e.pointLights.value=ie.state.point,$e.pointLightShadows.value=ie.state.pointShadow,$e.hemisphereLights.value=ie.state.hemi,$e.directionalShadowMatrix.value=ie.state.directionalShadowMatrix,$e.spotLightMatrix.value=ie.state.spotLightMatrix,$e.spotLightMap.value=ie.state.spotLightMap,$e.pointShadowMatrix.value=ie.state.pointShadowMatrix),ne.lightProbeGrid=C.state.lightProbeGridArray.length>0,ne.currentProgram=at,ne.uniformsList=null,at}function Yd(N){if(N.uniformsList===null){const Q=N.currentProgram.getUniforms();N.uniformsList=nl.seqWithValue(Q.seq,N.uniforms)}return N.uniformsList}function jd(N,Q){const oe=w.get(N);oe.outputColorSpace=Q.outputColorSpace,oe.batching=Q.batching,oe.batchingColor=Q.batchingColor,oe.instancing=Q.instancing,oe.instancingColor=Q.instancingColor,oe.instancingMorph=Q.instancingMorph,oe.skinning=Q.skinning,oe.morphTargets=Q.morphTargets,oe.morphNormals=Q.morphNormals,oe.morphColors=Q.morphColors,oe.morphTargetsCount=Q.morphTargetsCount,oe.numClippingPlanes=Q.numClippingPlanes,oe.numIntersection=Q.numClipIntersection,oe.vertexAlphas=Q.vertexAlphas,oe.vertexTangents=Q.vertexTangents,oe.toneMapping=Q.toneMapping}function fv(N,Q){if(N.length===0)return null;if(N.length===1)return N[0].texture!==null?N[0]:null;x.setFromMatrixPosition(Q.matrixWorld);for(let oe=0,ne=N.length;oe<ne;oe++){const ie=N[oe];if(ie.texture!==null&&ie.boundingBox.containsPoint(x))return ie}return null}function dv(N,Q,oe,ne,ie){Q.isScene!==!0&&(Q=ae),y.resetTextureUnits();const Ue=Q.fog,ze=ne.isMeshStandardMaterial||ne.isMeshLambertMaterial||ne.isMeshPhongMaterial?Q.environment:null,Ne=G===null?L.outputColorSpace:G.isXRRenderTarget===!0?G.texture.colorSpace:ct.workingColorSpace,Ve=ne.isMeshStandardMaterial||ne.isMeshLambertMaterial&&!ne.envMap||ne.isMeshPhongMaterial&&!ne.envMap,We=W.get(ne.envMap||ze,Ve),it=ne.vertexColors===!0&&!!oe.attributes.color&&oe.attributes.color.itemSize===4,at=!!oe.attributes.tangent&&(!!ne.normalMap||ne.anisotropy>0),$e=!!oe.morphAttributes.position,Pt=!!oe.morphAttributes.normal,Xt=!!oe.morphAttributes.color;let Ht=Ri;ne.toneMapped&&(G===null||G.isXRRenderTarget===!0)&&(Ht=L.toneMapping);const Dt=oe.morphAttributes.position||oe.morphAttributes.normal||oe.morphAttributes.color,dn=Dt!==void 0?Dt.length:0,Be=w.get(ne),Nn=C.state.lights;if(T===!0&&(I===!0||N!==$)){const Ot=N===$&&ne.id===X;Le.setState(ne,N,Ot)}let ht=!1;ne.version===Be.__version?(Be.needsLights&&Be.lightsStateVersion!==Nn.state.version||Be.outputColorSpace!==Ne||ie.isBatchedMesh&&Be.batching===!1||!ie.isBatchedMesh&&Be.batching===!0||ie.isBatchedMesh&&Be.batchingColor===!0&&ie.colorTexture===null||ie.isBatchedMesh&&Be.batchingColor===!1&&ie.colorTexture!==null||ie.isInstancedMesh&&Be.instancing===!1||!ie.isInstancedMesh&&Be.instancing===!0||ie.isSkinnedMesh&&Be.skinning===!1||!ie.isSkinnedMesh&&Be.skinning===!0||ie.isInstancedMesh&&Be.instancingColor===!0&&ie.instanceColor===null||ie.isInstancedMesh&&Be.instancingColor===!1&&ie.instanceColor!==null||ie.isInstancedMesh&&Be.instancingMorph===!0&&ie.morphTexture===null||ie.isInstancedMesh&&Be.instancingMorph===!1&&ie.morphTexture!==null||Be.envMap!==We||ne.fog===!0&&Be.fog!==Ue||Be.numClippingPlanes!==void 0&&(Be.numClippingPlanes!==Le.numPlanes||Be.numIntersection!==Le.numIntersection)||Be.vertexAlphas!==it||Be.vertexTangents!==at||Be.morphTargets!==$e||Be.morphNormals!==Pt||Be.morphColors!==Xt||Be.toneMapping!==Ht||Be.morphTargetsCount!==dn||!!Be.lightProbeGrid!=C.state.lightProbeGridArray.length>0)&&(ht=!0):(ht=!0,Be.__version=ne.version);let Wn=Be.currentProgram;ht===!0&&(Wn=ua(ne,Q,ie),P&&ne.isNodeMaterial&&P.onUpdateProgram(ne,Wn,Be));let di=!1,cs=!1,hr=!1;const Nt=Wn.getUniforms(),qt=Be.uniforms;if(F.useProgram(Wn.program)&&(di=!0,cs=!0,hr=!0),ne.id!==X&&(X=ne.id,cs=!0),Be.needsLights){const Ot=fv(C.state.lightProbeGridArray,ie);Be.lightProbeGrid!==Ot&&(Be.lightProbeGrid=Ot,cs=!0)}if(di||$!==N){F.buffers.depth.getReversed()&&N.reversedDepth!==!0&&(N._reversedDepth=!0,N.updateProjectionMatrix()),Nt.setValue(A,"projectionMatrix",N.projectionMatrix),Nt.setValue(A,"viewMatrix",N.matrixWorldInverse);const fs=Nt.map.cameraPosition;fs!==void 0&&fs.setValue(A,Y.setFromMatrixPosition(N.matrixWorld)),ee.logarithmicDepthBuffer&&Nt.setValue(A,"logDepthBufFC",2/(Math.log(N.far+1)/Math.LN2)),(ne.isMeshPhongMaterial||ne.isMeshToonMaterial||ne.isMeshLambertMaterial||ne.isMeshBasicMaterial||ne.isMeshStandardMaterial||ne.isShaderMaterial)&&Nt.setValue(A,"isOrthographic",N.isOrthographicCamera===!0),$!==N&&($=N,cs=!0,hr=!0)}if(Be.needsLights&&(Nn.state.directionalShadowMap.length>0&&Nt.setValue(A,"directionalShadowMap",Nn.state.directionalShadowMap,y),Nn.state.spotShadowMap.length>0&&Nt.setValue(A,"spotShadowMap",Nn.state.spotShadowMap,y),Nn.state.pointShadowMap.length>0&&Nt.setValue(A,"pointShadowMap",Nn.state.pointShadowMap,y)),ie.isSkinnedMesh){Nt.setOptional(A,ie,"bindMatrix"),Nt.setOptional(A,ie,"bindMatrixInverse");const Ot=ie.skeleton;Ot&&(Ot.boneTexture===null&&Ot.computeBoneTexture(),Nt.setValue(A,"boneTexture",Ot.boneTexture,y))}ie.isBatchedMesh&&(Nt.setOptional(A,ie,"batchingTexture"),Nt.setValue(A,"batchingTexture",ie._matricesTexture,y),Nt.setOptional(A,ie,"batchingIdTexture"),Nt.setValue(A,"batchingIdTexture",ie._indirectTexture,y),Nt.setOptional(A,ie,"batchingColorTexture"),ie._colorsTexture!==null&&Nt.setValue(A,"batchingColorTexture",ie._colorsTexture,y));const us=oe.morphAttributes;if((us.position!==void 0||us.normal!==void 0||us.color!==void 0)&&et.update(ie,oe,Wn),(cs||Be.receiveShadow!==ie.receiveShadow)&&(Be.receiveShadow=ie.receiveShadow,Nt.setValue(A,"receiveShadow",ie.receiveShadow)),(ne.isMeshStandardMaterial||ne.isMeshLambertMaterial||ne.isMeshPhongMaterial)&&ne.envMap===null&&Q.environment!==null&&(qt.envMapIntensity.value=Q.environmentIntensity),qt.dfgLUT!==void 0&&(qt.dfgLUT.value=OR()),cs){if(Nt.setValue(A,"toneMappingExposure",L.toneMappingExposure),Be.needsLights&&hv(qt,hr),Ue&&ne.fog===!0&&ce.refreshFogUniforms(qt,Ue),ce.refreshMaterialUniforms(qt,ne,Ge,Qe,C.state.transmissionRenderTarget[N.id]),Be.needsLights&&Be.lightProbeGrid){const Ot=Be.lightProbeGrid;qt.probesSH.value=Ot.texture,qt.probesMin.value.copy(Ot.boundingBox.min),qt.probesMax.value.copy(Ot.boundingBox.max),qt.probesResolution.value.copy(Ot.resolution)}nl.upload(A,Yd(Be),qt,y)}if(ne.isShaderMaterial&&ne.uniformsNeedUpdate===!0&&(nl.upload(A,Yd(Be),qt,y),ne.uniformsNeedUpdate=!1),ne.isSpriteMaterial&&Nt.setValue(A,"center",ie.center),Nt.setValue(A,"modelViewMatrix",ie.modelViewMatrix),Nt.setValue(A,"normalMatrix",ie.normalMatrix),Nt.setValue(A,"modelMatrix",ie.matrixWorld),ne.uniformsGroups!==void 0){const Ot=ne.uniformsGroups;for(let fs=0,pr=Ot.length;fs<pr;fs++){const Zd=Ot[fs];he.update(Zd,Wn),he.bind(Zd,Wn)}}return Wn}function hv(N,Q){N.ambientLightColor.needsUpdate=Q,N.lightProbe.needsUpdate=Q,N.directionalLights.needsUpdate=Q,N.directionalLightShadows.needsUpdate=Q,N.pointLights.needsUpdate=Q,N.pointLightShadows.needsUpdate=Q,N.spotLights.needsUpdate=Q,N.spotLightShadows.needsUpdate=Q,N.rectAreaLights.needsUpdate=Q,N.hemisphereLights.needsUpdate=Q}function pv(N){return N.isMeshLambertMaterial||N.isMeshToonMaterial||N.isMeshPhongMaterial||N.isMeshStandardMaterial||N.isShadowMaterial||N.isShaderMaterial&&N.lights===!0}this.getActiveCubeFace=function(){return B},this.getActiveMipmapLevel=function(){return Z},this.getRenderTarget=function(){return G},this.setRenderTargetTextures=function(N,Q,oe){const ne=w.get(N);ne.__autoAllocateDepthBuffer=N.resolveDepthBuffer===!1,ne.__autoAllocateDepthBuffer===!1&&(ne.__useRenderToTexture=!1),w.get(N.texture).__webglTexture=Q,w.get(N.depthTexture).__webglTexture=ne.__autoAllocateDepthBuffer?void 0:oe,ne.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(N,Q){const oe=w.get(N);oe.__webglFramebuffer=Q,oe.__useDefaultFramebuffer=Q===void 0};const mv=A.createFramebuffer();this.setRenderTarget=function(N,Q=0,oe=0){G=N,B=Q,Z=oe;let ne=null,ie=!1,Ue=!1;if(N){const Ne=w.get(N);if(Ne.__useDefaultFramebuffer!==void 0){F.bindFramebuffer(A.FRAMEBUFFER,Ne.__webglFramebuffer),le.copy(N.viewport),me.copy(N.scissor),Se=N.scissorTest,F.viewport(le),F.scissor(me),F.setScissorTest(Se),X=-1;return}else if(Ne.__webglFramebuffer===void 0)y.setupRenderTarget(N);else if(Ne.__hasExternalTextures)y.rebindTextures(N,w.get(N.texture).__webglTexture,w.get(N.depthTexture).__webglTexture);else if(N.depthBuffer){const it=N.depthTexture;if(Ne.__boundDepthTexture!==it){if(it!==null&&w.has(it)&&(N.width!==it.image.width||N.height!==it.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");y.setupDepthRenderbuffer(N)}}const Ve=N.texture;(Ve.isData3DTexture||Ve.isDataArrayTexture||Ve.isCompressedArrayTexture)&&(Ue=!0);const We=w.get(N).__webglFramebuffer;N.isWebGLCubeRenderTarget?(Array.isArray(We[Q])?ne=We[Q][oe]:ne=We[Q],ie=!0):N.samples>0&&y.useMultisampledRTT(N)===!1?ne=w.get(N).__webglMultisampledFramebuffer:Array.isArray(We)?ne=We[oe]:ne=We,le.copy(N.viewport),me.copy(N.scissor),Se=N.scissorTest}else le.copy(te).multiplyScalar(Ge).floor(),me.copy(fe).multiplyScalar(Ge).floor(),Se=ge;if(oe!==0&&(ne=mv),F.bindFramebuffer(A.FRAMEBUFFER,ne)&&F.drawBuffers(N,ne),F.viewport(le),F.scissor(me),F.setScissorTest(Se),ie){const Ne=w.get(N.texture);A.framebufferTexture2D(A.FRAMEBUFFER,A.COLOR_ATTACHMENT0,A.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Ne.__webglTexture,oe)}else if(Ue){const Ne=Q;for(let Ve=0;Ve<N.textures.length;Ve++){const We=w.get(N.textures[Ve]);A.framebufferTextureLayer(A.FRAMEBUFFER,A.COLOR_ATTACHMENT0+Ve,We.__webglTexture,oe,Ne)}}else if(N!==null&&oe!==0){const Ne=w.get(N.texture);A.framebufferTexture2D(A.FRAMEBUFFER,A.COLOR_ATTACHMENT0,A.TEXTURE_2D,Ne.__webglTexture,oe)}X=-1},this.readRenderTargetPixels=function(N,Q,oe,ne,ie,Ue,ze,Ne=0){if(!(N&&N.isWebGLRenderTarget)){pt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ve=w.get(N).__webglFramebuffer;if(N.isWebGLCubeRenderTarget&&ze!==void 0&&(Ve=Ve[ze]),Ve){F.bindFramebuffer(A.FRAMEBUFFER,Ve);try{const We=N.textures[Ne],it=We.format,at=We.type;if(N.textures.length>1&&A.readBuffer(A.COLOR_ATTACHMENT0+Ne),!ee.textureFormatReadable(it)){pt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ee.textureTypeReadable(at)){pt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}Q>=0&&Q<=N.width-ne&&oe>=0&&oe<=N.height-ie&&A.readPixels(Q,oe,ne,ie,q.convert(it),q.convert(at),Ue)}finally{const We=G!==null?w.get(G).__webglFramebuffer:null;F.bindFramebuffer(A.FRAMEBUFFER,We)}}},this.readRenderTargetPixelsAsync=async function(N,Q,oe,ne,ie,Ue,ze,Ne=0){if(!(N&&N.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ve=w.get(N).__webglFramebuffer;if(N.isWebGLCubeRenderTarget&&ze!==void 0&&(Ve=Ve[ze]),Ve)if(Q>=0&&Q<=N.width-ne&&oe>=0&&oe<=N.height-ie){F.bindFramebuffer(A.FRAMEBUFFER,Ve);const We=N.textures[Ne],it=We.format,at=We.type;if(N.textures.length>1&&A.readBuffer(A.COLOR_ATTACHMENT0+Ne),!ee.textureFormatReadable(it))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ee.textureTypeReadable(at))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const $e=A.createBuffer();A.bindBuffer(A.PIXEL_PACK_BUFFER,$e),A.bufferData(A.PIXEL_PACK_BUFFER,Ue.byteLength,A.STREAM_READ),A.readPixels(Q,oe,ne,ie,q.convert(it),q.convert(at),0);const Pt=G!==null?w.get(G).__webglFramebuffer:null;F.bindFramebuffer(A.FRAMEBUFFER,Pt);const Xt=A.fenceSync(A.SYNC_GPU_COMMANDS_COMPLETE,0);return A.flush(),await rT(A,Xt,4),A.bindBuffer(A.PIXEL_PACK_BUFFER,$e),A.getBufferSubData(A.PIXEL_PACK_BUFFER,0,Ue),A.deleteBuffer($e),A.deleteSync(Xt),Ue}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(N,Q=null,oe=0){const ne=Math.pow(2,-oe),ie=Math.floor(N.image.width*ne),Ue=Math.floor(N.image.height*ne),ze=Q!==null?Q.x:0,Ne=Q!==null?Q.y:0;y.setTexture2D(N,0),A.copyTexSubImage2D(A.TEXTURE_2D,oe,0,0,ze,Ne,ie,Ue),F.unbindTexture()};const gv=A.createFramebuffer(),_v=A.createFramebuffer();this.copyTextureToTexture=function(N,Q,oe=null,ne=null,ie=0,Ue=0){let ze,Ne,Ve,We,it,at,$e,Pt,Xt;const Ht=N.isCompressedTexture?N.mipmaps[Ue]:N.image;if(oe!==null)ze=oe.max.x-oe.min.x,Ne=oe.max.y-oe.min.y,Ve=oe.isBox3?oe.max.z-oe.min.z:1,We=oe.min.x,it=oe.min.y,at=oe.isBox3?oe.min.z:0;else{const qt=Math.pow(2,-ie);ze=Math.floor(Ht.width*qt),Ne=Math.floor(Ht.height*qt),N.isDataArrayTexture?Ve=Ht.depth:N.isData3DTexture?Ve=Math.floor(Ht.depth*qt):Ve=1,We=0,it=0,at=0}ne!==null?($e=ne.x,Pt=ne.y,Xt=ne.z):($e=0,Pt=0,Xt=0);const Dt=q.convert(Q.format),dn=q.convert(Q.type);let Be;Q.isData3DTexture?(y.setTexture3D(Q,0),Be=A.TEXTURE_3D):Q.isDataArrayTexture||Q.isCompressedArrayTexture?(y.setTexture2DArray(Q,0),Be=A.TEXTURE_2D_ARRAY):(y.setTexture2D(Q,0),Be=A.TEXTURE_2D),F.activeTexture(A.TEXTURE0),F.pixelStorei(A.UNPACK_FLIP_Y_WEBGL,Q.flipY),F.pixelStorei(A.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Q.premultiplyAlpha),F.pixelStorei(A.UNPACK_ALIGNMENT,Q.unpackAlignment);const Nn=F.getParameter(A.UNPACK_ROW_LENGTH),ht=F.getParameter(A.UNPACK_IMAGE_HEIGHT),Wn=F.getParameter(A.UNPACK_SKIP_PIXELS),di=F.getParameter(A.UNPACK_SKIP_ROWS),cs=F.getParameter(A.UNPACK_SKIP_IMAGES);F.pixelStorei(A.UNPACK_ROW_LENGTH,Ht.width),F.pixelStorei(A.UNPACK_IMAGE_HEIGHT,Ht.height),F.pixelStorei(A.UNPACK_SKIP_PIXELS,We),F.pixelStorei(A.UNPACK_SKIP_ROWS,it),F.pixelStorei(A.UNPACK_SKIP_IMAGES,at);const hr=N.isDataArrayTexture||N.isData3DTexture,Nt=Q.isDataArrayTexture||Q.isData3DTexture;if(N.isDepthTexture){const qt=w.get(N),us=w.get(Q),Ot=w.get(qt.__renderTarget),fs=w.get(us.__renderTarget);F.bindFramebuffer(A.READ_FRAMEBUFFER,Ot.__webglFramebuffer),F.bindFramebuffer(A.DRAW_FRAMEBUFFER,fs.__webglFramebuffer);for(let pr=0;pr<Ve;pr++)hr&&(A.framebufferTextureLayer(A.READ_FRAMEBUFFER,A.COLOR_ATTACHMENT0,w.get(N).__webglTexture,ie,at+pr),A.framebufferTextureLayer(A.DRAW_FRAMEBUFFER,A.COLOR_ATTACHMENT0,w.get(Q).__webglTexture,Ue,Xt+pr)),A.blitFramebuffer(We,it,ze,Ne,$e,Pt,ze,Ne,A.DEPTH_BUFFER_BIT,A.NEAREST);F.bindFramebuffer(A.READ_FRAMEBUFFER,null),F.bindFramebuffer(A.DRAW_FRAMEBUFFER,null)}else if(ie!==0||N.isRenderTargetTexture||w.has(N)){const qt=w.get(N),us=w.get(Q);F.bindFramebuffer(A.READ_FRAMEBUFFER,gv),F.bindFramebuffer(A.DRAW_FRAMEBUFFER,_v);for(let Ot=0;Ot<Ve;Ot++)hr?A.framebufferTextureLayer(A.READ_FRAMEBUFFER,A.COLOR_ATTACHMENT0,qt.__webglTexture,ie,at+Ot):A.framebufferTexture2D(A.READ_FRAMEBUFFER,A.COLOR_ATTACHMENT0,A.TEXTURE_2D,qt.__webglTexture,ie),Nt?A.framebufferTextureLayer(A.DRAW_FRAMEBUFFER,A.COLOR_ATTACHMENT0,us.__webglTexture,Ue,Xt+Ot):A.framebufferTexture2D(A.DRAW_FRAMEBUFFER,A.COLOR_ATTACHMENT0,A.TEXTURE_2D,us.__webglTexture,Ue),ie!==0?A.blitFramebuffer(We,it,ze,Ne,$e,Pt,ze,Ne,A.COLOR_BUFFER_BIT,A.NEAREST):Nt?A.copyTexSubImage3D(Be,Ue,$e,Pt,Xt+Ot,We,it,ze,Ne):A.copyTexSubImage2D(Be,Ue,$e,Pt,We,it,ze,Ne);F.bindFramebuffer(A.READ_FRAMEBUFFER,null),F.bindFramebuffer(A.DRAW_FRAMEBUFFER,null)}else Nt?N.isDataTexture||N.isData3DTexture?A.texSubImage3D(Be,Ue,$e,Pt,Xt,ze,Ne,Ve,Dt,dn,Ht.data):Q.isCompressedArrayTexture?A.compressedTexSubImage3D(Be,Ue,$e,Pt,Xt,ze,Ne,Ve,Dt,Ht.data):A.texSubImage3D(Be,Ue,$e,Pt,Xt,ze,Ne,Ve,Dt,dn,Ht):N.isDataTexture?A.texSubImage2D(A.TEXTURE_2D,Ue,$e,Pt,ze,Ne,Dt,dn,Ht.data):N.isCompressedTexture?A.compressedTexSubImage2D(A.TEXTURE_2D,Ue,$e,Pt,Ht.width,Ht.height,Dt,Ht.data):A.texSubImage2D(A.TEXTURE_2D,Ue,$e,Pt,ze,Ne,Dt,dn,Ht);F.pixelStorei(A.UNPACK_ROW_LENGTH,Nn),F.pixelStorei(A.UNPACK_IMAGE_HEIGHT,ht),F.pixelStorei(A.UNPACK_SKIP_PIXELS,Wn),F.pixelStorei(A.UNPACK_SKIP_ROWS,di),F.pixelStorei(A.UNPACK_SKIP_IMAGES,cs),Ue===0&&Q.generateMipmaps&&A.generateMipmap(Be),F.unbindTexture()},this.initRenderTarget=function(N){w.get(N).__webglFramebuffer===void 0&&y.setupRenderTarget(N)},this.initTexture=function(N){N.isCubeTexture?y.setTextureCube(N,0):N.isData3DTexture?y.setTexture3D(N,0):N.isDataArrayTexture||N.isCompressedArrayTexture?y.setTexture2DArray(N,0):y.setTexture2D(N,0),F.unbindTexture()},this.resetState=function(){B=0,Z=0,G=null,F.reset(),we.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ti}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const n=this.getContext();n.drawingBufferColorSpace=ct._getDrawingBufferColorSpace(e),n.unpackColorSpace=ct._getUnpackColorSpace()}}const Wa=8,kR=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`,BR=Vt({__name:"VueBitsColorBends",props:{className:{},style:{},rotation:{default:45},speed:{default:.2},colors:{default:()=>["#0A84FF","#BF5AF2","#30D158"]},transparent:{type:Boolean,default:!0},autoRotate:{default:0},scale:{default:1},frequency:{default:1},warpStrength:{default:1},mouseInfluence:{default:1},parallax:{default:.5},noise:{default:.1}},setup(t){const e=`
#define MAX_COLORS ${Wa}
uniform vec2 uCanvas;
uniform float uTime;
uniform float uSpeed;
uniform vec2 uRot;
uniform int uColorCount;
uniform vec3 uColors[MAX_COLORS];
uniform int uTransparent;
uniform float uScale;
uniform float uFrequency;
uniform float uWarpStrength;
uniform vec2 uPointer;
uniform float uMouseInfluence;
uniform float uParallax;
uniform float uNoise;
varying vec2 vUv;

void main() {
  float t = uTime * uSpeed;
  vec2 p = vUv * 2.0 - 1.0;
  p += uPointer * uParallax * 0.1;
  vec2 rp = vec2(p.x * uRot.x - p.y * uRot.y, p.x * uRot.y + p.y * uRot.x);
  vec2 q = vec2(rp.x * (uCanvas.x / uCanvas.y), rp.y);
  q /= max(uScale, 0.0001);
  q /= 0.5 + 0.2 * dot(q, q);
  q += 0.2 * cos(t) - 7.56;
  vec2 toward = (uPointer - rp);
  q += toward * uMouseInfluence * 0.2;

  vec3 col = vec3(0.0);
  float a = 1.0;

  if (uColorCount > 0) {
    vec2 s = q;
    vec3 sumCol = vec3(0.0);
    float cover = 0.0;
    for (int i = 0; i < MAX_COLORS; ++i) {
      if (i >= uColorCount) break;
      s -= 0.01;
      vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));
      float m0 = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(i)) / 4.0);
      float kBelow = clamp(uWarpStrength, 0.0, 1.0);
      float kMix = pow(kBelow, 0.3);
      float gain = 1.0 + max(uWarpStrength - 1.0, 0.0);
      vec2 disp = (r - s) * kBelow;
      vec2 warped = s + disp * gain;
      float m1 = length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(i)) / 4.0);
      float m = mix(m0, m1, kMix);
      float w = 1.0 - exp(-6.0 / exp(6.0 * m));
      sumCol += uColors[i] * w;
      cover = max(cover, w);
    }
    col = clamp(sumCol, 0.0, 1.0);
    a = uTransparent > 0 ? cover : 1.0;
  } else {
    vec2 s = q;
    for (int k = 0; k < 3; ++k) {
      s -= 0.01;
      vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));
      float m0 = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(k)) / 4.0);
      float kBelow = clamp(uWarpStrength, 0.0, 1.0);
      float kMix = pow(kBelow, 0.3);
      float gain = 1.0 + max(uWarpStrength - 1.0, 0.0);
      vec2 disp = (r - s) * kBelow;
      vec2 warped = s + disp * gain;
      float m1 = length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(k)) / 4.0);
      float m = mix(m0, m1, kMix);
      col[k] = 1.0 - exp(-6.0 / exp(6.0 * m));
    }
    a = uTransparent > 0 ? max(max(col.r, col.g), col.b) : 1.0;
  }

  if (uNoise > 0.0001) {
    float n = fract(sin(dot(gl_FragCoord.xy + vec2(uTime), vec2(12.9898, 78.233))) * 43758.5453123);
    col += (n - 0.5) * uNoise;
    col = clamp(col, 0.0, 1.0);
  }

  vec3 rgb = (uTransparent > 0) ? col * a : col;
  gl_FragColor = vec4(rgb, a);
}
`,n=t,i=Ee(null),s=Ee(null),r=Ee(null),o=Ee(null),a=Ee(null),l=Ee(n.rotation),c=Ee(n.autoRotate),u=Ee(new mt(0,0)),d=Ee(new mt(0,0)),f=Ee(8);let p=null;return Ds(()=>{const _=i.value;if(!_)return;const m=new yT,h=new Ud(-1,1,1,-1,0,1),v=new la(2,2),b=Array.from({length:Wa},()=>new se(0,0,0)),x=new ci({vertexShader:kR,fragmentShader:e,uniforms:{uCanvas:{value:new mt(1,1)},uTime:{value:0},uSpeed:{value:n.speed},uRot:{value:new mt(1,0)},uColorCount:{value:0},uColors:{value:b},uTransparent:{value:n.transparent?1:0},uScale:{value:n.scale},uFrequency:{value:n.frequency},uWarpStrength:{value:n.warpStrength},uPointer:{value:new mt(0,0)},uMouseInfluence:{value:n.mouseInfluence},uParallax:{value:n.parallax},uNoise:{value:n.noise}},premultipliedAlpha:!0,transparent:!0});o.value=x;const D=new Ni(v,x);m.add(D);const C=new FR({antialias:!1,powerPreference:"high-performance",alpha:!0});s.value=C;const R=kn;C.outputColorSpace=R,C.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),C.setClearColor(0,n.transparent?0:1),C.domElement.style.width="100%",C.domElement.style.height="100%",C.domElement.style.display="block",_.appendChild(C.domElement);const S=performance.now();let M=S;const L=()=>{const B=_.clientWidth||1,Z=_.clientHeight||1;C.setSize(B,Z,!1),x.uniforms.uCanvas.value.set(B,Z)};if(L(),"ResizeObserver"in window){const B=new ResizeObserver(L);B.observe(_),a.value=B}else window.addEventListener("resize",L);const E=()=>{const B=performance.now(),Z=(B-M)/1e3,G=(B-S)/1e3;M=B,x.uniforms.uTime.value=G;const $=(l.value%360+c.value*G)*Math.PI/180,le=Math.cos($),me=Math.sin($);x.uniforms.uRot.value.set(le,me);const Se=d.value,Ce=u.value,Pe=Math.min(1,Z*f.value);Se.lerp(Ce,Pe),x.uniforms.uPointer.value.copy(Se),C.render(m,h),r.value=requestAnimationFrame(E)};r.value=requestAnimationFrame(E);const P=B=>{const Z=_.getBoundingClientRect(),G=(B.clientX-Z.left)/Z.width*2-1,X=-((B.clientY-Z.top)/Z.height*2-1);u.value.set(G,X)};_.addEventListener("pointermove",P),p=()=>{r.value!==null&&cancelAnimationFrame(r.value),a.value?a.value.disconnect():window.removeEventListener("resize",L),_.removeEventListener("pointermove",P),v.dispose(),x.dispose(),C.dispose(),C.domElement&&C.domElement.parentElement===_&&_.removeChild(C.domElement)}}),ql(()=>p==null?void 0:p()),Vn(()=>({...n}),()=>{const _=o.value,m=s.value;if(!_)return;l.value=n.rotation,c.value=n.autoRotate,_.uniforms.uSpeed.value=n.speed,_.uniforms.uScale.value=n.scale,_.uniforms.uFrequency.value=n.frequency,_.uniforms.uWarpStrength.value=n.warpStrength,_.uniforms.uMouseInfluence.value=n.mouseInfluence,_.uniforms.uParallax.value=n.parallax,_.uniforms.uNoise.value=n.noise;const h=b=>{const x=b.replace("#","").trim(),D=x.length===3?[parseInt(x[0]+x[0],16),parseInt(x[1]+x[1],16),parseInt(x[2]+x[2],16)]:[parseInt(x.slice(0,2),16),parseInt(x.slice(2,4),16),parseInt(x.slice(4,6),16)];return new se(D[0]/255,D[1]/255,D[2]/255)},v=(n.colors||[]).filter(Boolean).slice(0,Wa).map(h);for(let b=0;b<Wa;b++){const x=_.uniforms.uColors.value[b];b<v.length?x.copy(v[b]):x.set(0,0,0)}_.uniforms.uColorCount.value=v.length,_.uniforms.uTransparent.value=n.transparent?1:0,m&&m.setClearColor(0,n.transparent?0:1)},{deep:!0}),(_,m)=>(xe(),Ie("div",{ref_key:"containerRef",ref:i,class:"vue-bits-color-bends"},null,512))}}),ui=(t,e)=>{const n=t.__vccOpts||t;for(const[i,s]of e)n[i]=s;return n},zR=ui(BR,[["__scopeId","data-v-0acfb9db"]]),VR={key:0,class:"splash-screen"},HR={class:"splash-content"},GR={class:"splash-status"},WR=Vt({__name:"SplashScreen",props:{duration:{default:2800}},emits:["done"],setup(t,{emit:e}){const n=t,i=e,s=Ee(!0),r=Ee(!1),o=Ee(!1),a=Ee(!1),l=Ee("正在初始化...");return Ds(()=>{setTimeout(()=>{r.value=!0},100),setTimeout(()=>{o.value=!0},400),setTimeout(()=>{a.value=!0,l.value="加载组件..."},700),setTimeout(()=>{l.value="连接服务..."},1400),setTimeout(()=>{l.value="准备就绪"},2e3),setTimeout(()=>{s.value=!1,setTimeout(()=>i("done"),500)},n.duration)}),(c,u)=>(xe(),ln(Br,{name:"splash-fade"},{default:Et(()=>[s.value?(xe(),Ie("div",VR,[qe(zR,{colors:["#0A84FF","#BF5AF2","#30D158","#FF9F0A"],rotation:0,"auto-rotate":5,speed:.5,scale:1.5,frequency:1.2,"warp-strength":1.5,"mouse-influence":0,parallax:0,noise:.05,transparent:!1}),H("div",HR,[H("div",{class:At(["splash-logo",{"logo-enter":r.value}])},[...u[0]||(u[0]=[H("img",{src:M3,alt:"Hi!XNS",class:"splash-logo-img"},null,-1)])],2),H("div",{class:At(["splash-brand",{"brand-enter":o.value}])},[...u[1]||(u[1]=[H("span",{class:"splash-title"},"Hi!XNS",-1),H("span",{class:"splash-subtitle"},"AI Agent",-1)])],2),H("div",{class:At(["splash-loader",{"loader-enter":a.value}])},[u[2]||(u[2]=H("div",{class:"splash-loader-track"},[H("div",{class:"splash-loader-bar"})],-1)),H("span",GR,Ye(l.value),1)],2)]),u[3]||(u[3]=H("div",{class:"splash-version"},"v0.5.0",-1))])):Ze("",!0)]),_:1}))}}),$R=ui(WR,[["__scopeId","data-v-7334c68a"]]),XR={class:"titlebar-buttons"},qR=["title"],KR={key:0,width:"10",height:"10",viewBox:"0 0 10 10"},YR={key:1,width:"10",height:"10",viewBox:"0 0 10 10"},jR=Vt({__name:"TitleBar",setup(t){const e=Ee(!1);function n(){var r,o;(o=(r=window.runtime)==null?void 0:r.WindowMinimise)==null||o.call(r)}function i(){var r,o;e.value=!e.value,(o=(r=window.runtime)==null?void 0:r.WindowToggleMaximise)==null||o.call(r)}function s(){var r,o;(o=(r=window.runtime)==null?void 0:r.Quit)==null||o.call(r)}return(r,o)=>(xe(),Ie(wt,null,[o[4]||(o[4]=H("div",{class:"titlebar-drag-region"},null,-1)),H("div",XR,[H("button",{class:"tb-btn tb-minimize",onClick:n,title:"最小化"},[...o[0]||(o[0]=[H("svg",{width:"10",height:"1",viewBox:"0 0 10 1"},[H("rect",{width:"10",height:"1",fill:"currentColor"})],-1)])]),H("button",{class:"tb-btn tb-maximize",onClick:i,title:e.value?"还原":"最大化"},[e.value?(xe(),Ie("svg",YR,[...o[2]||(o[2]=[H("rect",{x:"2.5",y:"0.5",width:"7",height:"7",rx:"1",fill:"none",stroke:"currentColor","stroke-width":"1"},null,-1),H("rect",{x:"0.5",y:"2.5",width:"7",height:"7",rx:"1",fill:"none",stroke:"currentColor","stroke-width":"1"},null,-1)])])):(xe(),Ie("svg",KR,[...o[1]||(o[1]=[H("rect",{x:"0.5",y:"0.5",width:"9",height:"9",rx:"1.5",fill:"none",stroke:"currentColor","stroke-width":"1"},null,-1)])]))],8,qR),H("button",{class:"tb-btn tb-close",onClick:s,title:"关闭"},[...o[3]||(o[3]=[H("svg",{width:"10",height:"10",viewBox:"0 0 10 10"},[H("line",{x1:"1",y1:"1",x2:"9",y2:"9",stroke:"currentColor","stroke-width":"1.2","stroke-linecap":"round"}),H("line",{x1:"9",y1:"1",x2:"1",y2:"9",stroke:"currentColor","stroke-width":"1.2","stroke-linecap":"round"})],-1)])])])],64))}}),ZR=ui(jR,[["__scopeId","data-v-234f3df7"]]),JR={class:"vuebits-bg"},QR={class:"vuebits-bg__particles"},eP=Vt({__name:"VueBitsBg",setup(t){const e=Ee([]);function n(){const s=[];for(let r=0;r<35;r++)s.push({id:r,x:Math.random()*100,y:Math.random()*100,size:Math.random()*3+1,delay:Math.random()*5,duration:Math.random()*10+10});e.value=s}return Ds(()=>{n()}),no(()=>{e.value=[]}),(i,s)=>(xe(),Ie("div",JR,[s[0]||(s[0]=H("div",{class:"vuebits-bg__grid-layer"},[H("div",{class:"vuebits-bg__grid"}),H("div",{class:"vuebits-bg__grid vuebits-bg__grid--alt"})],-1)),H("div",QR,[(xe(!0),Ie(wt,null,Wr(e.value,r=>(xe(),Ie("div",{key:r.id,class:"vuebits-bg__particle",style:Li({left:r.x+"%",top:r.y+"%",width:r.size+"px",height:r.size+"px",animationDelay:r.delay+"s",animationDuration:r.duration+"s"})},null,4))),128))]),s[1]||(s[1]=wo('<div class="vuebits-bg__glow-layer" data-v-7a84eb09><div class="vuebits-bg__orb vuebits-bg__orb--1" data-v-7a84eb09></div><div class="vuebits-bg__orb vuebits-bg__orb--2" data-v-7a84eb09></div><div class="vuebits-bg__orb vuebits-bg__orb--3" data-v-7a84eb09></div></div><div class="vuebits-bg__scanlines" data-v-7a84eb09></div>',2)),xn(i.$slots,"default",{},void 0,!0)]))}}),tP=ui(eP,[["__scopeId","data-v-7a84eb09"]]),nP={key:0,class:"btn-spinner"},iP={key:1,class:"btn-icon"},sP={class:"btn-content"},rP=Vt({__name:"HxButton",props:{variant:{default:"primary"},size:{default:"md"},disabled:{type:Boolean,default:!1},loading:{type:Boolean,default:!1},fullWidth:{type:Boolean,default:!1},tag:{default:"button"},icon:{type:Boolean,default:!1}},emits:["click"],setup(t,{emit:e}){const n=Ox(),i=t,s=e,r=rt(()=>["hixns-btn",`hixns-btn--${i.variant}`,`hixns-btn--${i.size}`,{"hixns-btn--disabled":i.disabled,"hixns-btn--loading":i.loading,"hixns-btn--full":i.fullWidth,"hixns-btn--icon":i.icon||!!n.icon}]);function o(a){!i.disabled&&!i.loading&&s("click",a)}return(a,l)=>(xe(),ln(Go(t.tag),{class:At(r.value),disabled:t.disabled||t.loading,onClick:o},{default:Et(()=>[t.loading?(xe(),Ie("span",nP)):Ze("",!0),a.$slots.icon||t.icon?(xe(),Ie("span",iP,[xn(a.$slots,"icon",{},void 0,!0)])):Ze("",!0),H("span",sP,[xn(a.$slots,"default",{},void 0,!0)])]),_:3},8,["class","disabled"]))}}),km=ui(rP,[["__scopeId","data-v-1a6d130c"]]),oP={key:0,class:"hixns-input__icon"},aP={key:0},lP=["type","value","placeholder","disabled"],cP={key:2,class:"hixns-input__number-controls"},uP=["disabled"],fP=["disabled"],dP={key:4,class:"hixns-input__icon"},hP={key:0},pP=Vt({__name:"HxInput",props:{modelValue:{default:""},type:{default:"text"},placeholder:{default:""},disabled:{type:Boolean,default:!1},clearable:{type:Boolean,default:!1},leftIcon:{default:""},rightIcon:{default:""},rows:{default:3},error:{default:""},autofocus:{type:Boolean,default:!1},min:{default:null},max:{default:null},step:{default:1},showNumberControls:{type:Boolean,default:!0}},emits:["update:modelValue","focus","blur","enter","clear"],setup(t,{expose:e,emit:n}){const i=t,s=n,r=Ee(null),o=Ee(null),a=rt(()=>i.clearable&&i.modelValue);function l(_){const m=_.target;s("update:modelValue",i.type==="number"?Number(m.value):m.value)}function c(_){s("focus",_)}function u(_){s("blur",_)}function d(_){s("enter",_)}function f(){s("update:modelValue",""),s("clear"),ai(()=>{r.value&&r.value.focus(),o.value&&o.value.focus()})}function p(){if(i.type==="number"){const m=(Number(i.modelValue)||0)+i.step;(i.max===null||m<=i.max)&&s("update:modelValue",m)}}function g(){if(i.type==="number"){const m=(Number(i.modelValue)||0)-i.step;(i.min===null||m>=i.min)&&s("update:modelValue",m)}}return e({focus:()=>{r.value&&r.value.focus(),o.value&&o.value.focus()},blur:()=>{r.value&&r.value.blur(),o.value&&o.value.blur()}}),(_,m)=>(xe(),Ie("div",{class:At(["hixns-input",[{"hixns-input--error":t.error},{"hixns-input--number":t.type==="number"}]])},[_.$slots.left||t.leftIcon?(xe(),Ie("span",oP,[xn(_.$slots,"left",{},()=>[t.leftIcon?(xe(),Ie("span",aP,Ye(t.leftIcon),1)):Ze("",!0)],!0)])):Ze("",!0),t.type!=="textarea"?(xe(),Ie("input",{key:1,ref_key:"inputRef",ref:r,type:t.type,value:t.modelValue,placeholder:t.placeholder,disabled:t.disabled,class:At(["hixns-input__field",{"hixns-input__field--has-right":a.value||_.$slots.right||t.showNumberControls}]),onInput:l,onFocus:c,onBlur:u,onKeydown:Qs(d,["enter"])},null,42,lP)):Ze("",!0),t.type==="number"&&t.showNumberControls?(xe(),Ie("div",cP,[H("button",{type:"button",class:"hixns-input__number-btn",onClick:g,disabled:t.disabled||t.min!==null&&Number(t.modelValue)<=t.min},[...m[0]||(m[0]=[H("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"3"},[H("line",{x1:"5",y1:"12",x2:"19",y2:"12"})],-1)])],8,uP),H("button",{type:"button",class:"hixns-input__number-btn",onClick:p,disabled:t.disabled||t.max!==null&&Number(t.modelValue)>=t.max},[...m[1]||(m[1]=[H("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"3"},[H("line",{x1:"12",y1:"5",x2:"12",y2:"19"}),H("line",{x1:"5",y1:"12",x2:"19",y2:"12"})],-1)])],8,fP)])):Ze("",!0),a.value&&t.modelValue?(xe(),Ie("button",{key:3,type:"button",class:"hixns-input__clear",onClick:f},[...m[2]||(m[2]=[H("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2.5"},[H("line",{x1:"18",y1:"6",x2:"6",y2:"18"}),H("line",{x1:"6",y1:"6",x2:"18",y2:"18"})],-1)])])):Ze("",!0),_.$slots.right||t.rightIcon?(xe(),Ie("span",dP,[xn(_.$slots,"right",{},()=>[t.rightIcon?(xe(),Ie("span",hP,Ye(t.rightIcon),1)):Ze("",!0)],!0)])):Ze("",!0)],2))}}),mP=ui(pP,[["__scopeId","data-v-277afc4c"]]),gP={key:0,class:"hixns-modal-header"},_P={class:"hixns-modal-title-row"},vP=["innerHTML"],xP={class:"hixns-modal-title"},SP=["title"],yP={class:"hixns-modal-body"},bP={key:1,class:"hixns-modal-footer"},EP=Vt({__name:"HxModal",props:{modelValue:{type:Boolean,default:!1},title:{},icon:{},iconColor:{},iconBg:{},closable:{type:Boolean,default:!0},size:{default:"md"},width:{}},emits:["update:modelValue","close"],setup(t,{emit:e}){const{t:n}=fr(),i=t,s=e,r=rt(()=>`hixns-modal--${i.size}`),o=rt(()=>i.width?{"--modal-width":i.width}:{});function a(){s("update:modelValue",!1),s("close")}const l=rt(()=>{const d={};return i.iconColor&&(d.color=i.iconColor),i.iconBg&&(d.background=i.iconBg),d}),c={plus:'<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',edit:'<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',trash:'<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>',key:'<path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>',"alert-triangle":'<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',info:'<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>'},u=rt(()=>c[i.icon||""]||i.icon||"");return(d,f)=>(xe(),ln(td,{to:"body"},[qe(Br,{name:"hixns-modal"},{default:Et(()=>[t.modelValue?(xe(),Ie("div",{key:0,class:"hixns-modal-overlay",onClick:Kt(a,["self"])},[H("div",{class:At(["hixns-modal",r.value]),style:Li(o.value)},[t.title||t.icon||d.$slots.header?(xe(),Ie("div",gP,[xn(d.$slots,"header",{},()=>[H("div",_P,[t.icon?(xe(),Ie("div",{key:0,class:"hixns-modal-icon",style:Li(l.value)},[typeof t.icon=="object"?(xe(),ln(Go(t.icon),{key:0})):(xe(),Ie("svg",{key:1,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"1.5",innerHTML:u.value},null,8,vP))],4)):Ze("",!0),H("h2",xP,Ye(t.title),1)])],!0),t.closable?(xe(),Ie("button",{key:0,class:"hixns-modal-close",onClick:a,title:Oe(n)("common.close")},[...f[0]||(f[0]=[H("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round"},[H("line",{x1:"18",y1:"6",x2:"6",y2:"18"}),H("line",{x1:"6",y1:"6",x2:"18",y2:"18"})],-1)])],8,SP)):Ze("",!0)])):Ze("",!0),H("div",yP,[xn(d.$slots,"default",{},void 0,!0)]),d.$slots.footer?(xe(),Ie("div",bP,[xn(d.$slots,"footer",{},void 0,!0)])):Ze("",!0)],6)])):Ze("",!0)]),_:3})]))}}),MP=ui(EP,[["__scopeId","data-v-89272564"]]),TP={class:"hixns-toast-container"},AP=["onMouseenter","onMouseleave"],wP=["innerHTML"],CP={class:"hixns-toast-body"},RP={class:"hixns-toast-title"},PP={key:0,class:"hixns-toast-message"},IP=["onClick"],LP=Vt({__name:"HxToast",setup(t,{expose:e}){const n=Ee([]);let i=0;const s=new Map;function r(_){const m=++i,h={id:m,..._};return n.value.push(h),a(m,h.duration),m}function o(_){n.value=n.value.filter(m=>m.id!==_),clearTimeout(s.get(_)),s.delete(_)}function a(_,m){if(m<=0)return;const h=setTimeout(()=>o(_),m);s.set(_,h)}function l(_){clearTimeout(s.get(_))}function c(_){const m=n.value.find(h=>h.id===_);m&&a(_,m.duration)}function u(_,m,h=4e3){return r({title:_,message:m,variant:"success",duration:h})}function d(_,m,h=5e3){return r({title:_,message:m,variant:"error",duration:h})}function f(_,m,h=4e3){return r({title:_,message:m,variant:"warning",duration:h})}function p(_,m,h=3e3){return r({title:_,message:m,variant:"info",duration:h})}function g(_){switch(_){case"success":return'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>';case"error":return'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';case"warning":return'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';case"info":return'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';default:return""}}return ql(()=>{s.forEach(_=>clearTimeout(_)),s.clear()}),e({show:r,remove:o,success:u,error:d,warning:f,info:p}),(_,m)=>(xe(),ln(td,{to:"body"},[H("div",TP,[qe(u_,{name:"toast"},{default:Et(()=>[(xe(!0),Ie(wt,null,Wr(n.value,h=>(xe(),Ie("div",{key:h.id,class:At(["hixns-toast",`hixns-toast--${h.variant}`]),onMouseenter:v=>l(h.id),onMouseleave:v=>c(h.id)},[H("span",{class:"hixns-toast-icon",innerHTML:g(h.variant)},null,8,wP),H("div",CP,[H("div",RP,Ye(h.title),1),h.message?(xe(),Ie("div",PP,Ye(h.message),1)):Ze("",!0)]),H("button",{class:"hixns-toast-close",onClick:v=>o(h.id)},[...m[0]||(m[0]=[H("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2.5","stroke-linecap":"round"},[H("line",{x1:"18",y1:"6",x2:"6",y2:"18"}),H("line",{x1:"6",y1:"6",x2:"18",y2:"18"})],-1)])],8,IP)],42,AP))),128))]),_:1})])]))}}),DP=ui(LP,[["__scopeId","data-v-1a74ccea"]]),NP={class:"login-modal-body"},UP={class:"login-description"},OP={key:0,class:"login-error"},FP={class:"login-actions"},kP=Vt({__name:"LoginModal",emits:["connected"],setup(t,{expose:e,emit:n}){const{t:i}=fr(),s=n,r=Ee(!1),o=Ee(""),a=Ee(""),l=Ee(!1),c=Ee(!1);function u(){const g=ro();g&&(o.value=g),a.value="",r.value=!0}function d(){r.value=!1}async function f(){c.value=!0,a.value="";try{const g=await bd();g.success&&g.token?(bl(g.token),o.value=g.token,d(),s("connected")):a.value=i("auth.autoFailed")}catch(g){a.value=(g==null?void 0:g.message)||i("auth.autoFailed")}finally{c.value=!1}}async function p(){if(o.value.trim()){a.value="",l.value=!0;try{(await d0(o.value.trim())).success?(bl(o.value.trim()),d(),s("connected")):a.value=i("auth.invalidToken")}catch(g){a.value=(g==null?void 0:g.message)||i("auth.connectFailed")}finally{l.value=!1}}}return e({show:u,hide:d}),(g,_)=>(xe(),ln(MP,{modelValue:r.value,"onUpdate:modelValue":_[1]||(_[1]=m=>r.value=m),title:Oe(i)("auth.connectTitle"),icon:"key",closable:!1,size:"sm"},{default:Et(()=>[H("div",NP,[H("p",UP,Ye(Oe(i)("auth.connectDesc")),1),qe(mP,{modelValue:o.value,"onUpdate:modelValue":_[0]||(_[0]=m=>o.value=m),type:"password",placeholder:Oe(i)("auth.tokenPlaceholder"),error:a.value,onEnter:p},null,8,["modelValue","placeholder","error"]),a.value?(xe(),Ie("div",OP,Ye(a.value),1)):Ze("",!0),H("div",FP,[qe(km,{variant:"ghost",onClick:f,loading:c.value},{default:Et(()=>[or(Ye(Oe(i)("auth.autoConnect")),1)]),_:1},8,["loading"]),qe(km,{variant:"primary",loading:l.value,disabled:!o.value.trim(),onClick:p},{default:Et(()=>[or(Ye(Oe(i)("auth.connect")),1)]),_:1},8,["loading","disabled"])])])]),_:1},8,["modelValue","title"]))}}),BP=ui(kP,[["__scopeId","data-v-ec9b15d8"]]),Mo=Ee(!1),uu=Ee(""),Ss=Ee([]),fu=Ee(!1),qn=Ee(0);let Wi=null;function zP(){const t=Ed(),e=rt(()=>Ss.value);async function n(f){const p=f.trim();if(!p){Ss.value=t.sortedSessions.map(g=>({session:g,preview:i(g),matchType:"title"})),qn.value=0;return}fu.value=!0;try{try{const h=await m0(p,20,0);if(h.sessions&&h.sessions.length>0){const v=[];for(const b of h.sessions){const D=t.sortedSessions.find(C=>C.serverId===b.id||C.id===b.id)||{id:b.id,serverId:b.id,title:b.title||"",messages:[],createdAt:b.started_at,updatedAt:b.started_at};v.push({session:D,preview:b.snippet||b.title||"",matchType:b.snippet?"content":"title"})}Ss.value=v,qn.value=0;return}}catch{}const g=p.toLowerCase();try{await t.fetchServerSessions()}catch{}const _=t.sortedSessions,m=[];for(const h of _){const v=h.title.toLowerCase().includes(g),b=h.messages.some(x=>x.content.toLowerCase().includes(g));(v||b)&&m.push({session:h,preview:i(h),matchType:v?"title":"content"})}Ss.value=m,qn.value=0}finally{fu.value=!1}}function i(f){const p=f.messages;if(p.length===0)return"";const _=p[p.length-1].content.trim();return _.length>80?_.substring(0,80)+"...":_}function s(f){Wi&&clearTimeout(Wi),Wi=setTimeout(()=>{n(f)},300)}function r(){Mo.value=!0,uu.value="",Ss.value=[],qn.value=0,n("")}function o(){Mo.value=!1,uu.value="",Ss.value=[],qn.value=0,Wi&&(clearTimeout(Wi),Wi=null)}function a(f){qn.value=f}function l(){qn.value>0&&qn.value--}function c(){qn.value<Ss.value.length-1&&qn.value++}function u(){const f=Ss.value[qn.value];return f?f.session:null}function d(f){(f.ctrlKey||f.metaKey)&&f.key==="k"&&(f.preventDefault(),f.stopPropagation(),Mo.value?o():r()),f.key==="Escape"&&Mo.value&&(f.preventDefault(),o())}return Ds(()=>{window.addEventListener("keydown",d)}),no(()=>{window.removeEventListener("keydown",d),Wi&&(clearTimeout(Wi),Wi=null)}),{isOpen:Mo,query:uu,results:e,loading:fu,selectedIndex:qn,openSearch:r,closeSearch:o,debouncedSearch:s,selectResult:a,navigateUp:l,navigateDown:c,confirmSelection:u}}const VP=["width","height"],Bm=Vt({__name:"IconSearch",props:{size:{default:24}},setup(t){return(e,n)=>(xe(),Ie("svg",{width:t.size,height:t.size,viewBox:"0 0 1024 1024",fill:"currentColor",xmlns:"http://www.w3.org/2000/svg"},[...n[0]||(n[0]=[H("path",{d:"M128 170.666667a42.666667 42.666667 0 0 0-42.666667 42.666666 42.666667 42.666667 0 0 0 42.666667 42.666667h768a42.666667 42.666667 0 0 0 42.666667-42.666667 42.666667 42.666667 0 0 0-42.666667-42.666666zM128 469.333333a42.666667 42.666667 0 0 0-42.666667 42.666667 42.666667 42.666667 0 0 0 42.666667 42.666667h298.666667a42.666667 42.666667 0 0 0 42.666666-42.666667 42.666667 42.666667 0 0 0-42.666666-42.666667zM128 768a42.666667 42.666667 0 0 0-42.666667 42.666667 42.666667 42.666667 0 0 0 42.666667 42.666666h298.666667a42.666667 42.666667 0 0 0 42.666666-42.666666 42.666667 42.666667 0 0 0-42.666666-42.666667zM725.333333 469.333333c-93.738667 0-170.666667 76.928-170.666666 170.666667s76.928 170.666667 170.666666 170.666667 170.666667-76.928 170.666667-170.666667-76.928-170.666667-170.666667-170.666667z m0 85.333334c47.616 0 85.333333 37.717333 85.333334 85.333333s-37.717333 85.333333-85.333334 85.333333-85.333333-37.717333-85.333333-85.333333 37.717333-85.333333 85.333333-85.333333z"},null,-1),H("path",{d:"M784.768 699.434667a42.666667 42.666667 0 0 0 0 60.330666l81.066667 81.066667a42.666667 42.666667 0 0 0 60.330666 0 42.666667 42.666667 0 0 0 0-60.330667l-81.066666-81.066666a42.666667 42.666667 0 0 0-60.330667 0z"},null,-1)])],8,VP))}}),HP={class:"session-search-modal"},GP={class:"search-input-wrap"},WP=["placeholder","onKeydown"],$P={key:0,class:"search-empty"},XP={key:1,class:"search-empty"},qP={key:2},KP={class:"results-header"},YP={class:"results-count"},jP=["onClick","onMouseenter"],ZP={class:"result-main"},JP={class:"result-title-row"},QP={class:"result-title"},eI={key:0,class:"result-model-badge"},tI={key:0,class:"result-preview"},nI={class:"result-meta"},iI={class:"result-date"},sI={class:"result-count"},rI={key:3,class:"search-empty"},oI={class:"search-footer"},aI={class:"search-hint"},lI=Vt({__name:"SessionSearchModal",setup(t){const{t:e}=fr(),n=R_(),i=Ed(),{isOpen:s,query:r,results:o,loading:a,selectedIndex:l,closeSearch:c,debouncedSearch:u,selectResult:d,navigateUp:f,navigateDown:p,confirmSelection:g}=zP(),_=Ee(null),m=Ee(null),h=Ee("");Vn(r,S=>{S!==h.value&&(h.value=S)}),Vn(s,S=>{S&&(h.value=r.value,ai(()=>{var M;(M=_.value)==null||M.focus()}))});function v(){u(h.value)}function b(){const S=g();S&&D(S)}function x(S){i.switchSession(S.session.id),n.push("/"),c()}function D(S){i.switchSession(S.id),n.push("/"),c()}function C(S){const M=S.messages||[];for(let L=M.length-1;L>=0;L--)if(M[L].role==="assistant"&&M[L].model)return M[L].model.split("/").pop()||M[L].model;return""}function R(S){if(!S)return"";const M=new Date(S),E=new Date().getTime()-M.getTime(),P=Math.floor(E/6e4),B=Math.floor(E/36e5),Z=Math.floor(E/864e5);return P<1?e("inbox.justNow","Just now"):P<60?e("inbox.minutesAgo","{n}m ago").replace("{n}",String(P)):B<24?e("inbox.hoursAgo","{n}h ago").replace("{n}",String(B)):Z<7?e("inbox.daysAgo","{n}d ago").replace("{n}",String(Z)):M.toLocaleDateString()}return Vn(l,()=>{ai(()=>{if(!m.value)return;const S=m.value.querySelector(".search-result-item.active");S&&S.scrollIntoView({block:"nearest",behavior:"smooth"})})}),(S,M)=>(xe(),ln(td,{to:"body"},[qe(Br,{name:"search-modal"},{default:Et(()=>[Oe(s)?(xe(),Ie("div",{key:0,class:"session-search-overlay",onClick:M[4]||(M[4]=Kt((...L)=>Oe(c)&&Oe(c)(...L),["self"]))},[H("div",HP,[H("div",GP,[qe(Bm,{size:20,class:"search-icon"}),cl(H("input",{ref_key:"searchInputRef",ref:_,"onUpdate:modelValue":M[0]||(M[0]=L=>h.value=L),type:"text",class:"search-input",placeholder:Oe(e)("search.placeholder"),onInput:v,onKeydown:[M[1]||(M[1]=Qs(Kt((...L)=>Oe(p)&&Oe(p)(...L),["prevent"]),["down"])),M[2]||(M[2]=Qs(Kt((...L)=>Oe(f)&&Oe(f)(...L),["prevent"]),["up"])),Qs(Kt(b,["prevent"]),["enter"]),M[3]||(M[3]=Qs(Kt((...L)=>Oe(c)&&Oe(c)(...L),["prevent"]),["escape"]))]},null,40,WP),[[d_,h.value]]),M[5]||(M[5]=H("kbd",{class:"search-kbd"},"ESC",-1))]),H("div",{class:"search-results",ref_key:"resultsRef",ref:m},[Oe(a)?(xe(),Ie("div",$P,[M[6]||(M[6]=H("div",{class:"search-spinner"},null,-1)),H("span",null,Ye(Oe(e)("common.loading")),1)])):Oe(o).length===0&&h.value.trim()?(xe(),Ie("div",XP,[qe(Bm,{size:32,class:"search-empty-icon"}),H("span",null,Ye(Oe(e)("search.no_results")),1)])):Oe(o).length>0?(xe(),Ie("div",qP,[H("div",KP,[H("span",YP,Ye(Oe(e)("search.sessions_count",{n:Oe(o).length})),1)]),(xe(!0),Ie(wt,null,Wr(Oe(o),(L,E)=>(xe(),Ie("div",{key:L.session.id,class:At(["search-result-item",{active:E===Oe(l)}]),onClick:P=>x(L),onMouseenter:P=>Oe(d)(E)},[H("div",ZP,[H("div",JP,[H("span",QP,Ye(L.session.title||Oe(e)("app.renamePlaceholder")),1),L.session.messages.length>0?(xe(),Ie("span",eI,Ye(C(L.session)),1)):Ze("",!0)]),L.preview?(xe(),Ie("div",tI,Ye(L.preview),1)):Ze("",!0)]),H("div",nI,[H("span",iI,Ye(R(L.session.updatedAt)),1),H("span",sI,Ye(L.session.messages.filter(P=>P.role==="user").length),1)])],42,jP))),128))])):h.value.trim()?Ze("",!0):(xe(),Ie("div",rI,[H("span",null,Ye(Oe(e)("search.no_results")),1)]))],512),H("div",oI,[H("span",aI,[M[7]||(M[7]=H("kbd",null,"↑↓",-1)),or(" "+Ye(Oe(e)("search.navigate","Navigate"))+" ",1),M[8]||(M[8]=H("kbd",null,"↵",-1)),or(" "+Ye(Oe(e)("search.open","Open"))+" ",1),M[9]||(M[9]=H("kbd",null,"Esc",-1)),or(" "+Ye(Oe(e)("search.close","Close")),1)])])])])):Ze("",!0)]),_:1})]))}}),cI=ui(lI,[["__scopeId","data-v-52d5bf6a"]]),Od="hixns_theme_variant";function uI(){try{const t=localStorage.getItem(Od);if(t==="glass"||t==="comic")return t}catch{}return"glass"}function nv(t){const e=document.documentElement;e.classList.remove("theme-glass","theme-comic"),e.classList.add(`theme-${t}`)}const Rl=Ee(uI());typeof document<"u"&&nv(Rl.value);Vn(Rl,t=>{try{localStorage.setItem(Od,t)}catch{}nv(t)});typeof window<"u"&&window.addEventListener("storage",t=>{if(t.key===Od&&t.newValue!==null){const e=t.newValue;(e==="glass"||e==="comic")&&Rl.value!==e&&(Rl.value=e)}});const fI={class:"app"},dI={class:"rename-title"},hI=["placeholder"],pI={class:"sidebar-brand"},mI={class:"brand-version"},gI={class:"sidebar-nav"},_I={class:"nav-icon"},vI={class:"nav-label"},xI={class:"nav-label"},SI={class:"nav-icon"},yI={key:0,class:"nav-badge"},bI={class:"nav-label"},EI={class:"nav-icon"},MI={key:0,class:"nav-badge nav-badge--running"},TI={class:"nav-label"},AI={class:"nav-icon"},wI={class:"nav-label"},CI={class:"nav-icon"},RI={class:"nav-label"},PI={class:"nav-label"},II={class:"nav-label"},LI={class:"nav-icon"},DI={class:"nav-label"},NI={class:"session-list"},UI={class:"session-list-header"},OI={class:"session-list-actions"},FI=["title"],kI={width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2"},BI={key:0,d:"M9 11l3 3L22 4"},zI=["disabled"],VI={key:0},HI={class:"session-items"},GI=["onClick","onContextmenu"],WI=["checked","onChange"],$I={class:"session-item-title"},XI={class:"session-item-actions"},qI={class:"session-item-count"},KI=["onClick"],YI=["onClick"],jI={class:"sidebar-footer"},ZI={class:"session-block"},JI={class:"session-row"},QI={class:"session-label"},eL={key:0,class:"balance-line"},tL={class:"model-select-wrap"},nL={class:"model-dropdown-value"},iL=["onClick"],sL={class:"model-item-name"},rL={key:0,width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2.5"},oL={key:0,class:"model-dropdown-empty"},aL={class:"theme-row"},lL=["title"],cL=["title"],uL={class:"main-content"},fL={key:0,class:"connection-banner disconnected"},dL={class:"banner-content"},hL={key:0,class:"connection-banner connecting"},pL=Vt({__name:"App",setup(t){const e=R_(),n=X6(),i=Ed(),s=J6(),r=Q6(),{t:o,locale:a}=fr(),{balance:l}=Vh(n),c=rt(()=>r.inbox.filter(k=>k.status==="pending").length),u=Ee(0),d=Ee(null);async function f(){try{const{agentJson:k}=await cn(async()=>{const{agentJson:F}=await Promise.resolve().then(()=>As);return{agentJson:F}},void 0),z=await k("/v1/agent/runs"),ee=Array.isArray(z)?z:(z==null?void 0:z.runs)||(z==null?void 0:z.data)||[];u.value=ee.filter(F=>F.status==="running"||F.status==="queued").length}catch(k){console.warn("[App] Failed to fetch history runs:",k),u.value=0}}const p=Ee(null);function g(){i.fetchServerSessions(),f()}async function _(){var ee;const k=await bd();if(k.success&&k.token){bl(k.token),console.log("[App] Auto-login success");return}if(ro())try{if((await Xu()).token_configured){const{agentJson:K}=await cn(async()=>{const{agentJson:w}=await Promise.resolve().then(()=>As);return{agentJson:w}},void 0);await K("/v1/agent/health");return}}catch{}try{(await Xu()).token_configured&&((ee=p.value)==null||ee.show())}catch(F){console.warn("[App] Auth status check failed:",F)}}Ds(()=>{window.addEventListener("keydown",fe),window.addEventListener("click",ye),n.fetchBalance(),n.fetchModels(),s.checkConnection(),_(),f(),d.value=setInterval(f,5e3),i.fetchServerSessions()}),no(()=>{window.removeEventListener("keydown",fe),window.removeEventListener("click",ye),document.removeEventListener("click",P),d.value&&clearInterval(d.value)});const m=__APP_VERSION__;function h(){const k=a.value==="zh-CN"?"en":"zh-CN";fM(k)}const v=Ee(!0),b=Ee(""),x=Ee(!1),D=Ee(new Set),C=Ee(!1),R=Ee({visible:!1,x:0,y:0,sessionId:""}),S=Ee({visible:!1}),M=Ee(""),L=Ee(null),E=to({show:!1,x:0,y:0,hasSelection:!1}),P=()=>{E.show=!1};function B(k){const z=L.value;E.hasSelection=!!(z&&z.selectionStart!==z.selectionEnd),E.x=k.clientX,E.y=k.clientY,E.show=!0,ai(()=>{document.addEventListener("click",P,{once:!0})})}function Z(){try{document.execCommand("copy")}catch{}E.show=!1}function G(){var z;const k=L.value;k&&(E.show=!1,(z=navigator.clipboard)!=null&&z.readText&&navigator.clipboard.readText().then(ee=>{if(ee){k.focus();const F=k.selectionStart||0,K=k.selectionEnd||0,w=M.value;M.value=w.substring(0,F)+ee+w.substring(K),ai(()=>{k.selectionStart=k.selectionEnd=F+ee.length})}}).catch(()=>{}))}const{selectedModel:X,providerMode:$,customProvider:le}=Vh(i),me=rt(()=>{if($.value==="custom")return le.value.model||"选择模型";const k=n.models.find(z=>z.model_code===X.value);return k?k.model_name:X.value||"选择模型"}),Se=rt(()=>$.value==="custom"?Qe.value:n.models);function Ce(k){return $.value==="custom"?le.value.model===k:X.value===k}function Pe(k){$.value==="custom"?i.setCustomProvider({...le.value,model:k}):X.value=k,C.value=!1}function Ke(){C.value=!C.value,C.value&&($.value==="custom"?ue():n.fetchModels(!0))}const Qe=Ee([]),Ge=Ee(!1);async function ue(){if($.value!=="custom")return;const k=le.value;if(!(!k.baseUrl||!k.apiKey)){Ge.value=!0;try{const z=k.baseUrl.replace(/\/$/,""),ee={Authorization:"Bearer "+k.apiKey};let F=z+"/models";if(z.startsWith("http"))try{new URL(z).origin!==window.location.origin&&(ee["x-proxy-target"]=z,F="/proxy/custom/models")}catch(W){console.warn("[App] URL parse failed for custom provider:",W)}const w=await(await fetch(F,{headers:ee})).json(),y=w.data||w||[];Qe.value=(Array.isArray(y)?y:[]).map(W=>({model_code:W.id||W.model||"",model_name:W.id||W.model||""})).filter(W=>W.model_code)}catch(z){console.warn("[App] Failed to fetch custom models:",z),Qe.value=[]}Ge.value=!1}}const j=rt(()=>$.value==="custom"?le.value.name||"自定义 API":"G网（GFW.NET）"),te=k=>k?k.length>18?k.slice(0,18)+"...":k:"新会话";function fe(k){if(!(k.target&&k.target.tagName==="INPUT")&&!(k.target&&k.target.tagName==="TEXTAREA"))switch(k.key){case"1":e.push("/");break;case"2":e.push("/skills");break;case"3":e.push("/tasks");break;case"4":e.push("/settings");break}}function ge(k,z){R.value={visible:!0,x:Math.min(k.clientX,window.innerWidth-160),y:Math.min(k.clientY,window.innerHeight-80),sessionId:z.id}}function ye(){R.value.visible=!1}function T(){const k=i.sessions.find(z=>z.id===R.value.sessionId);k&&(M.value=k.title,S.value.visible=!0,R.value.visible=!1,setTimeout(()=>{var z;return(z=L.value)==null?void 0:z.focus()},100))}function I(){S.value.visible=!1,M.value=""}function V(){M.value.trim()&&i.renameSession(R.value.sessionId,M.value.trim()),I()}function Y(){R.value.sessionId&&i.sessions.length>1&&i.deleteSession(R.value.sessionId),ye()}const J=rt(()=>i.sessions.length>0&&D.value.size===i.sessions.length);function ae(){J.value?D.value=new Set:D.value=new Set(i.sessions.map(k=>k.id))}function U(k){const z=new Set(D.value);z.has(k)?z.delete(k):z.add(k),D.value=z}async function O(){if(D.value.size===0)return;const k=Array.from(D.value),z=i.sessions.filter(ee=>k.includes(ee.id)&&ee.serverId).map(ee=>ee.serverId);for(const ee of k){if(i.sessions.length<=1)break;i.deleteSession(ee)}if(z.length>0)try{await _0(z)}catch(ee){console.warn("[batch-delete] server batch delete failed:",ee)}x.value=!1,D.value=new Set}async function A(){const k=R.value.sessionId;if(k)try{const z=await g0(k,"markdown"),ee=URL.createObjectURL(z),F=document.createElement("a");F.href=ee,F.download=`session_${k}.md`,document.body.appendChild(F),F.click(),document.body.removeChild(F),URL.revokeObjectURL(ee),ye()}catch(z){alert("导出失败: "+(z.message||String(z)))}}return(k,z)=>{const ee=fl("router-link"),F=fl("router-view");return xe(),Ie(wt,null,[v.value?(xe(),ln($R,{key:0,onDone:z[0]||(z[0]=K=>v.value=!1)})):Ze("",!0),qe(BP,{ref_key:"loginModalRef",ref:p,onConnected:g},null,512),qe(cI),cl(H("div",fI,[z[48]||(z[48]=H("div",{class:"window-drag-area"},null,-1)),qe(ZR),qe(tP),qe(Oe(DP),{ref:"toastRef"},null,512),R.value.visible?(xe(),Ie("div",{key:0,class:"context-menu",style:Li({top:R.value.y+"px",left:R.value.x+"px"}),onClick:z[1]||(z[1]=Kt(()=>{},["stop"]))},[H("div",{class:"context-menu-item",onClick:T},[z[17]||(z[17]=H("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2"},[H("path",{d:"M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"}),H("path",{d:"M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"})],-1)),H("span",null,Ye(Oe(o)("app.rename")),1)]),H("div",{class:"context-menu-item",onClick:A},[...z[18]||(z[18]=[H("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2"},[H("path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}),H("polyline",{points:"7 10 12 15 17 10"}),H("line",{x1:"12",y1:"15",x2:"12",y2:"3"})],-1),H("span",null,"导出",-1)])]),H("div",{class:"context-menu-item danger",onClick:Y},[z[19]||(z[19]=H("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2"},[H("path",{d:"M3 6h18"}),H("path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"}),H("path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"})],-1)),H("span",null,Ye(Oe(o)("common.delete")),1)])],4)):Ze("",!0),R.value.visible?(xe(),Ie("div",{key:1,class:"context-menu-overlay",onClick:ye})):Ze("",!0),S.value.visible?(xe(),Ie("div",{key:2,class:"rename-modal-overlay",onClick:I,onContextmenu:z[6]||(z[6]=Kt(()=>{},["prevent"]))},[H("div",{class:"rename-modal",onClick:z[5]||(z[5]=Kt(()=>{},["stop"]))},[H("h3",dI,Ye(Oe(o)("app.renameSession")),1),cl(H("input",{ref_key:"renameInputRef",ref:L,"onUpdate:modelValue":z[2]||(z[2]=K=>M.value=K),type:"text",class:"rename-input",placeholder:Oe(o)("app.renamePlaceholder"),onKeydown:[Qs(V,["enter"]),Qs(I,["escape"])],onContextmenu:Kt(B,["prevent"])},null,40,hI),[[d_,M.value]]),E.show?(xe(),Ie("div",{key:0,class:"ctx-menu",style:Li({top:E.y+"px",left:E.x+"px"}),onClick:z[3]||(z[3]=Kt(()=>{},["stop"])),onContextmenu:z[4]||(z[4]=Kt(()=>{},["prevent"]))},[E.hasSelection?(xe(),Ie("button",{key:0,onClick:Z,class:"ctx-item"},"复制")):Ze("",!0),H("button",{onClick:G,class:"ctx-item"},"粘贴")],36)):Ze("",!0),H("div",{class:"rename-actions"},[H("button",{class:"rename-cancel",onClick:I},"取消"),H("button",{class:"rename-confirm",onClick:V},"确定")])])],32)):Ze("",!0),H("aside",{class:"sidebar glass",onContextmenu:z[15]||(z[15]=Kt(()=>{},["prevent"]))},[H("div",pI,[qe(E3,{width:120,height:24,dark:Oe(s).isDark},null,8,["dark"]),H("span",mI,Ye(Oe(m)),1)]),H("nav",gI,[qe(ee,{to:"/",class:At(["nav-item",{active:k.$route.path==="/"}])},{default:Et(()=>[H("span",_I,[qe(t3,{size:18})]),H("span",vI,Ye(k.$t("nav.chat")),1),z[20]||(z[20]=H("kbd",{class:"nav-shortcut"},"1",-1))]),_:1},8,["class"]),qe(ee,{to:"/blueprints",class:At(["nav-item",{active:k.$route.path==="/blueprints"}])},{default:Et(()=>[z[21]||(z[21]=H("span",{class:"nav-icon"},[H("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2"},[H("path",{d:"M12 2L2 7l10 5 10-5-10-5z"}),H("path",{d:"M2 17l10 5 10-5"}),H("path",{d:"M2 12l10 5 10-5"})])],-1)),H("span",xI,Ye(k.$t("nav.blueprints")),1),z[22]||(z[22]=H("kbd",{class:"nav-shortcut"},"2",-1))]),_:1},8,["class"]),qe(ee,{to:"/inbox",class:At(["nav-item",{active:k.$route.path==="/inbox"}])},{default:Et(()=>[H("span",SI,[z[23]||(z[23]=H("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2"},[H("polyline",{points:"22 12 16 12 14 15 10 15 8 12 2 12"}),H("path",{d:"M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"})],-1)),c.value>0?(xe(),Ie("span",yI,Ye(c.value>99?"99+":c.value),1)):Ze("",!0)]),H("span",bI,Ye(k.$t("nav.inbox")),1),z[24]||(z[24]=H("kbd",{class:"nav-shortcut"},"3",-1))]),_:1},8,["class"]),qe(ee,{to:"/history",class:At(["nav-item",{active:k.$route.path==="/history"}])},{default:Et(()=>[H("span",EI,[z[25]||(z[25]=H("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round"},[H("circle",{cx:"12",cy:"12",r:"10"}),H("polyline",{points:"12 6 12 12 16 14"})],-1)),u.value>0?(xe(),Ie("span",MI,Ye(u.value>99?"99+":u.value),1)):Ze("",!0)]),H("span",TI,Ye(k.$t("nav.history")),1),z[26]||(z[26]=H("kbd",{class:"nav-shortcut"},"4",-1))]),_:1},8,["class"]),qe(ee,{to:"/skills",class:At(["nav-item",{active:k.$route.path==="/skills"}])},{default:Et(()=>[H("span",AI,[qe(i3,{size:18})]),H("span",wI,Ye(k.$t("nav.skills")),1),z[27]||(z[27]=H("kbd",{class:"nav-shortcut"},"5",-1))]),_:1},8,["class"]),qe(ee,{to:"/tasks",class:At(["nav-item",{active:k.$route.path==="/tasks"}])},{default:Et(()=>[H("span",CI,[qe(a3,{size:18})]),H("span",RI,Ye(k.$t("nav.tasks")),1),z[28]||(z[28]=H("kbd",{class:"nav-shortcut"},"6",-1))]),_:1},8,["class"]),qe(ee,{to:"/files",class:At(["nav-item",{active:k.$route.path==="/files"}])},{default:Et(()=>[z[29]||(z[29]=H("span",{class:"nav-icon"},[H("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round"},[H("path",{d:"M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"})])],-1)),H("span",PI,Ye(k.$t("nav.files")),1)]),_:1},8,["class"]),qe(ee,{to:"/group-chat",class:At(["nav-item",{active:k.$route.path==="/group-chat"}])},{default:Et(()=>[z[30]||(z[30]=H("span",{class:"nav-icon"},[H("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round"},[H("path",{d:"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"}),H("circle",{cx:"9",cy:"7",r:"4"}),H("path",{d:"M23 21v-2a4 4 0 0 0-3-3.87"}),H("path",{d:"M16 3.13a4 4 0 0 1 0 7.75"})])],-1)),H("span",II,Ye(k.$t("nav.groupChat")),1)]),_:1},8,["class"]),qe(ee,{to:"/settings",class:At(["nav-item",{active:k.$route.path==="/settings"}])},{default:Et(()=>[H("span",LI,[qe(r3,{size:18})]),H("span",DI,Ye(k.$t("nav.settings")),1),z[31]||(z[31]=H("kbd",{class:"nav-shortcut"},"9",-1))]),_:1},8,["class"])]),H("div",NI,[H("div",UI,[z[37]||(z[37]=H("span",{class:"session-list-title"},"会话",-1)),H("div",OI,[x.value?Ze("",!0):(xe(),Ie("button",{key:0,class:"new-session-btn",onClick:z[7]||(z[7]=K=>{Oe(i).newSession(),Oe(e).push("/")}),title:"新建会话"},[...z[32]||(z[32]=[H("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2.5"},[H("line",{x1:"12",y1:"5",x2:"12",y2:"19"}),H("line",{x1:"5",y1:"12",x2:"19",y2:"12"})],-1)])])),x.value?Ze("",!0):(xe(),Ie("button",{key:1,class:"batch-mode-btn",onClick:z[8]||(z[8]=K=>{x.value=!0,D.value=new Set}),title:"批量管理"},[...z[33]||(z[33]=[H("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2"},[H("path",{d:"M9 11l3 3L22 4"}),H("path",{d:"M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"})],-1)])])),x.value?(xe(),Ie(wt,{key:2},[H("button",{class:"batch-select-all-btn",onClick:ae,title:J.value?"取消全选":"全选"},[(xe(),Ie("svg",kI,[J.value?(xe(),Ie("path",BI)):Ze("",!0),z[34]||(z[34]=H("rect",{x:"3",y:"3",width:"18",height:"18",rx:"2"},null,-1))])),H("span",null,Ye(J.value?"取消":"全选"),1)],8,FI),H("button",{class:"batch-delete-btn",disabled:D.value.size===0,onClick:O,title:"删除选中"},[z[35]||(z[35]=H("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2"},[H("path",{d:"M3 6h18"}),H("path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"}),H("path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"})],-1)),D.value.size?(xe(),Ie("span",VI,Ye(D.value.size),1)):Ze("",!0)],8,zI),H("button",{class:"batch-cancel-btn",onClick:z[9]||(z[9]=K=>{x.value=!1,D.value=new Set}),title:"取消"},[...z[36]||(z[36]=[H("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2"},[H("line",{x1:"18",y1:"6",x2:"6",y2:"18"}),H("line",{x1:"6",y1:"6",x2:"18",y2:"18"})],-1)])])],64)):Ze("",!0)])]),H("div",HI,[qe(u_,{name:"session-anim",tag:"div"},{default:Et(()=>[(xe(!0),Ie(wt,null,Wr(Oe(i).sortedSessions,K=>(xe(),Ie("div",{key:K.id,class:At(["session-item",{active:K.id===Oe(i).activeSessionId,"batch-selected":D.value.has(K.id)}]),onClick:w=>x.value?U(K.id):(Oe(i).switchSession(K.id),Oe(e).push("/")),onContextmenu:Kt(w=>x.value?null:ge(w,K),["prevent"])},[x.value?(xe(),Ie("label",{key:0,class:"batch-checkbox",onClick:z[10]||(z[10]=Kt(()=>{},["stop"]))},[H("input",{type:"checkbox",checked:D.value.has(K.id),onChange:w=>U(K.id)},null,40,WI),z[38]||(z[38]=H("span",{class:"checkmark"},null,-1))])):Ze("",!0),H("span",$I,Ye(te(K.title)),1),H("div",XI,[H("span",qI,Ye(K.messages.filter(w=>w.role==="user").length),1),Oe(i).sessions.length>1&&b.value!==K.id?(xe(),Ie("button",{key:0,class:"session-delete-btn",onClick:Kt(w=>b.value=K.id,["stop"]),title:"删除会话"},[...z[39]||(z[39]=[H("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2.5"},[H("path",{d:"M3 6h18"}),H("path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"}),H("path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"})],-1)])],8,KI)):Ze("",!0)]),b.value===K.id?(xe(),Ie("span",{key:1,class:"confirm-delete",onClick:z[12]||(z[12]=Kt(()=>{},["stop"]))},[H("button",{class:"confirm-yes",onClick:Kt(w=>{Oe(i).deleteSession(K.id),b.value=""},["stop"])},"删除",8,YI),H("button",{class:"confirm-no",onClick:z[11]||(z[11]=Kt(w=>b.value="",["stop"]))},"取消")])):Ze("",!0)],42,GI))),128))]),_:1})])]),H("div",jI,[H("div",ZI,[H("div",JI,[H("span",{class:At(["session-dot",Oe(i).providerMode==="custom"?"dot-blue":"dot-green"])},null,2),H("span",QI,Ye(j.value),1)])]),Oe(i).providerMode!=="custom"?(xe(),Ie("div",eL,[z[40]||(z[40]=H("span",{class:"balance-label"},"余额",-1)),H("span",{class:At(["balance-value",{"balance-loading":Oe(s).connectionState==="connecting"}])},Ye(Oe(s).connectionState==="connecting"?"...":Oe(s).connectionState==="disconnected"||Oe(l)<=0?"--":Oe(l).toFixed(2)+" G"),3)])):Ze("",!0),H("div",tL,[H("div",{class:At(["model-dropdown",{open:C.value}])},[H("button",{class:"model-dropdown-trigger",onClick:Kt(Ke,["stop"])},[H("span",nL,Ye(me.value),1),z[41]||(z[41]=H("svg",{class:"model-dropdown-arrow",width:"10",height:"10",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2"},[H("polyline",{points:"6 9 12 15 18 9"})],-1))]),C.value?(xe(),Ie("div",{key:0,class:"model-dropdown-panel",onClick:z[13]||(z[13]=Kt(()=>{},["stop"]))},[(xe(!0),Ie(wt,null,Wr(Se.value,K=>(xe(),Ie("div",{key:K.model_code,class:At(["model-dropdown-item",{active:Ce(K.model_code)}]),onClick:w=>Pe(K.model_code)},[H("span",sL,Ye(K.model_name),1),Ce(K.model_code)?(xe(),Ie("svg",rL,[...z[42]||(z[42]=[H("polyline",{points:"20 6 9 17 4 12"},null,-1)])])):Ze("",!0)],10,iL))),128)),Se.value.length?Ze("",!0):(xe(),Ie("div",oL,"暂无模型"))])):Ze("",!0)],2)]),H("div",aL,[H("button",{class:"theme-btn",onClick:z[14]||(z[14]=(...K)=>Oe(s).toggleTheme&&Oe(s).toggleTheme(...K)),title:Oe(s).isDark?k.$t("settings.light"):k.$t("settings.dark")},[Oe(s).isDark?(xe(),ln(c3,{key:0,size:14})):(xe(),ln(f3,{key:1,size:14})),H("span",null,Ye(Oe(s).isDark?k.$t("settings.light"):k.$t("settings.dark")),1)],8,lL),H("button",{class:"theme-btn",onClick:h,title:Oe(a)==="zh-CN"?"English":"中文"},[z[43]||(z[43]=H("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2"},[H("circle",{cx:"12",cy:"12",r:"10"}),H("line",{x1:"2",y1:"12",x2:"22",y2:"12"}),H("path",{d:"M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"})],-1)),H("span",null,Ye(Oe(a)==="zh-CN"?"EN":"中"),1)],8,cL)])])],32),H("main",uL,[qe(Br,{name:"banner-slide"},{default:Et(()=>[Oe(s).connectionState==="disconnected"?(xe(),Ie("div",fL,[H("div",dL,[z[45]||(z[45]=H("svg",{class:"icon",viewBox:"0 0 1024 1024",version:"1.1",xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"currentColor"},[H("path",{d:"M511.914667 85.333333c-235.52 0-426.666667 191.146667-426.666667 426.666667s191.146667 426.666667 426.666667 426.666667 426.666667-191.146667 426.666666-426.666667-191.146667-426.666667-426.666666-426.666667z m0 768c-188.586667 0-341.333333-152.746667-341.333334-341.333333s152.746667-341.333333 341.333334-341.333333 341.333333 152.746667 341.333333 341.333333-152.746667 341.333333-341.333333 341.333333z"}),H("path",{d:"M512 640c-35.2 0-64 28.8-64 64S476.8 768 512 768s64-28.8 64-64S547.2 640 512 640z"}),H("path",{d:"M512 256c-36.906667 0-66.176 29.269333-63.872 63.872l15.616 234.88c1.621333 23.936 22.741333 42.581333 48.256 42.581333s46.634667-18.645333 48.213333-42.581333l15.658667-234.88C578.176 285.269333 548.906667 256 512 256z"})],-1)),z[46]||(z[46]=H("span",null,"后端服务未连接 — 部分功能可能不可用",-1)),H("button",{class:"banner-retry",onClick:z[16]||(z[16]=K=>Oe(s).checkConnection())},[...z[44]||(z[44]=[H("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2"},[H("polyline",{points:"23 4 23 10 17 10"}),H("path",{d:"M20.49 15a9 9 0 1 1-2.12-9.36L23 10"})],-1),or(" 重试 ",-1)])])])])):Ze("",!0)]),_:1}),qe(Br,{name:"banner-slide"},{default:Et(()=>[Oe(s).connectionState==="connecting"?(xe(),Ie("div",hL,[...z[47]||(z[47]=[H("div",{class:"banner-content"},[H("div",{class:"banner-spinner"}),H("span",null,"正在连接后端服务...")],-1)])])):Ze("",!0)]),_:1}),qe(F,null,{default:Et(({Component:K})=>[qe(Br,{name:"page-fade",mode:"out-in"},{default:Et(()=>[(xe(),ln(Go(K)))]),_:2},1024)]),_:1})])],512),[[AS,!v.value]])],64)}}}),mL=ui(pL,[["__scopeId","data-v-bd2f1f1c"]]),gL=gb({history:Ky(),routes:[{path:"/",component:()=>cn(()=>import("./ChatView-VDxONOsB.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8]))},{path:"/blueprints",component:()=>cn(()=>import("./BlueprintView-DeHBY6zt.js"),__vite__mapDeps([9,5,6,10]))},{path:"/inbox",component:()=>cn(()=>import("./InboxView-BDDIEiXg.js"),__vite__mapDeps([11,4,12,13,14]))},{path:"/history",component:()=>cn(()=>import("./HistoryView-BNDF7X__.js"),__vite__mapDeps([15,16,17,18]))},{path:"/skills",component:()=>cn(()=>import("./SkillStoreView-Ci-8j_-w.js"),__vite__mapDeps([19,1,2,20,16,13,17,5,21]))},{path:"/tasks",component:()=>cn(()=>import("./TasksView-BpyT-g2q.js"),__vite__mapDeps([22,4,12,20,17,5,23]))},{path:"/files",component:()=>cn(()=>import("./FilesView-7qOTTFcV.js"),__vite__mapDeps([24,5,25]))},{path:"/group-chat",component:()=>cn(()=>import("./GroupChatView-xGbYjHq0.js"),__vite__mapDeps([26,4,17,5,1,3,27]))},{path:"/settings",component:()=>cn(()=>import("./SettingsView-Bwqyz11N.js"),__vite__mapDeps([28,4,12,16,13,17,5,7,29]))},{path:"/profiles",redirect:"/settings"},{path:"/channels",redirect:"/settings"},{path:"/usage",redirect:"/settings"}]});function _L(){var t=window.navigator.userAgent,e=t.indexOf("MSIE ");if(e>0)return parseInt(t.substring(e+5,t.indexOf(".",e)),10);var n=t.indexOf("Trident/");if(n>0){var i=t.indexOf("rv:");return parseInt(t.substring(i+3,t.indexOf(".",i)),10)}var s=t.indexOf("Edge/");return s>0?parseInt(t.substring(s+5,t.indexOf(".",s)),10):-1}let il;function Bf(){Bf.init||(Bf.init=!0,il=_L()!==-1)}var ac={name:"ResizeObserver",props:{emitOnMount:{type:Boolean,default:!1},ignoreWidth:{type:Boolean,default:!1},ignoreHeight:{type:Boolean,default:!1}},emits:["notify"],mounted(){Bf(),ai(()=>{this._w=this.$el.offsetWidth,this._h=this.$el.offsetHeight,this.emitOnMount&&this.emitSize()});const t=document.createElement("object");this._resizeObject=t,t.setAttribute("aria-hidden","true"),t.setAttribute("tabindex",-1),t.onload=this.addResizeHandlers,t.type="text/html",il&&this.$el.appendChild(t),t.data="about:blank",il||this.$el.appendChild(t)},beforeUnmount(){this.removeResizeHandlers()},methods:{compareAndNotify(){(!this.ignoreWidth&&this._w!==this.$el.offsetWidth||!this.ignoreHeight&&this._h!==this.$el.offsetHeight)&&(this._w=this.$el.offsetWidth,this._h=this.$el.offsetHeight,this.emitSize())},emitSize(){this.$emit("notify",{width:this._w,height:this._h})},addResizeHandlers(){this._resizeObject.contentDocument.defaultView.addEventListener("resize",this.compareAndNotify),this.compareAndNotify()},removeResizeHandlers(){this._resizeObject&&this._resizeObject.onload&&(!il&&this._resizeObject.contentDocument&&this._resizeObject.contentDocument.defaultView.removeEventListener("resize",this.compareAndNotify),this.$el.removeChild(this._resizeObject),this._resizeObject.onload=null,this._resizeObject=null)}}};const vL=hx();fx("data-v-b329ee4c");const xL={class:"resize-observer",tabindex:"-1"};dx();const SL=vL((t,e,n,i,s,r)=>(xe(),ln("div",xL)));ac.render=SL;ac.__scopeId="data-v-b329ee4c";ac.__file="src/components/ResizeObserver.vue";function sl(t){"@babel/helpers - typeof";return typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?sl=function(e){return typeof e}:sl=function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},sl(t)}function yL(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function bL(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function EL(t,e,n){return e&&bL(t.prototype,e),t}function zm(t){return ML(t)||TL(t)||AL(t)||wL()}function ML(t){if(Array.isArray(t))return zf(t)}function TL(t){if(typeof Symbol<"u"&&Symbol.iterator in Object(t))return Array.from(t)}function AL(t,e){if(t){if(typeof t=="string")return zf(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);if(n==="Object"&&t.constructor&&(n=t.constructor.name),n==="Map"||n==="Set")return Array.from(t);if(n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return zf(t,e)}}function zf(t,e){(e==null||e>t.length)&&(e=t.length);for(var n=0,i=new Array(e);n<e;n++)i[n]=t[n];return i}function wL(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function CL(t){var e;return typeof t=="function"?e={callback:t}:e=t,e}function RL(t,e){var n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{},i,s,r,o=function(l){for(var c=arguments.length,u=new Array(c>1?c-1:0),d=1;d<c;d++)u[d-1]=arguments[d];if(r=u,!(i&&l===s)){var f=n.leading;typeof f=="function"&&(f=f(l,s)),(!i||l!==s)&&f&&t.apply(void 0,[l].concat(zm(r))),s=l,clearTimeout(i),i=setTimeout(function(){t.apply(void 0,[l].concat(zm(r))),i=0},e)}};return o._clear=function(){clearTimeout(i),i=null},o}function iv(t,e){if(t===e)return!0;if(sl(t)==="object"){for(var n in t)if(!iv(t[n],e[n]))return!1;return!0}return!1}var PL=(function(){function t(e,n,i){yL(this,t),this.el=e,this.observer=null,this.frozen=!1,this.createObserver(n,i)}return EL(t,[{key:"createObserver",value:function(n,i){var s=this;if(this.observer&&this.destroyObserver(),!this.frozen){if(this.options=CL(n),this.callback=function(a,l){s.options.callback(a,l),a&&s.options.once&&(s.frozen=!0,s.destroyObserver())},this.callback&&this.options.throttle){var r=this.options.throttleOptions||{},o=r.leading;this.callback=RL(this.callback,this.options.throttle,{leading:function(l){return o==="both"||o==="visible"&&l||o==="hidden"&&!l}})}this.oldResult=void 0,this.observer=new IntersectionObserver(function(a){var l=a[0];if(a.length>1){var c=a.find(function(d){return d.isIntersecting});c&&(l=c)}if(s.callback){var u=l.isIntersecting&&l.intersectionRatio>=s.threshold;if(u===s.oldResult)return;s.oldResult=u,s.callback(u,l)}},this.options.intersection),ai(function(){s.observer&&s.observer.observe(s.el)})}}},{key:"destroyObserver",value:function(){this.observer&&(this.observer.disconnect(),this.observer=null),this.callback&&this.callback._clear&&(this.callback._clear(),this.callback=null)}},{key:"threshold",get:function(){return this.options.intersection&&typeof this.options.intersection.threshold=="number"?this.options.intersection.threshold:0}}]),t})();function sv(t,e,n){var i=e.value;if(i)if(typeof IntersectionObserver>"u")console.warn("[vue-observe-visibility] IntersectionObserver API is not available in your browser. Please install this polyfill: https://github.com/w3c/IntersectionObserver/tree/master/polyfill");else{var s=new PL(t,i,n);t._vue_visibilityState=s}}function IL(t,e,n){var i=e.value,s=e.oldValue;if(!iv(i,s)){var r=t._vue_visibilityState;if(!i){rv(t);return}r?r.createObserver(i,n):sv(t,{value:i},n)}}function rv(t){var e=t._vue_visibilityState;e&&(e.destroyObserver(),delete t._vue_visibilityState)}var LL={beforeMount:sv,updated:IL,unmounted:rv};function DL(t){return{all:t=t||new Map,on:function(e,n){var i=t.get(e);i&&i.push(n)||t.set(e,[n])},off:function(e,n){var i=t.get(e);i&&i.splice(i.indexOf(n)>>>0,1)},emit:function(e,n){(t.get(e)||[]).slice().map(function(i){i(n)}),(t.get("*")||[]).slice().map(function(i){i(e,n)})}}}var NL={itemsLimit:1e3},UL=/(auto|scroll)/;function ov(t,e){return t.parentNode===null?e:ov(t.parentNode,e.concat([t]))}var du=function(e,n){return getComputedStyle(e,null).getPropertyValue(n)},OL=function(e){return du(e,"overflow")+du(e,"overflow-y")+du(e,"overflow-x")},FL=function(e){return UL.test(OL(e))};function Vm(t){if(t instanceof HTMLElement||t instanceof SVGElement){for(var e=ov(t.parentNode,[]),n=0;n<e.length;n+=1)if(FL(e[n]))return e[n];return document.scrollingElement||document.documentElement}}function Vf(t){"@babel/helpers - typeof";return Vf=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(e){return typeof e}:function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},Vf(t)}var av={items:{type:Array,required:!0},keyField:{type:String,default:"id"},direction:{type:String,default:"vertical",validator:function(e){return["vertical","horizontal"].includes(e)}},listTag:{type:String,default:"div"},itemTag:{type:String,default:"div"}};function lv(){return this.items.length&&Vf(this.items[0])!=="object"}var Hf=!1;if(typeof window<"u"){Hf=!1;try{var kL=Object.defineProperty({},"passive",{get:function(){Hf=!0}});window.addEventListener("test",null,kL)}catch{}}let BL=0;var Fd={name:"RecycleScroller",components:{ResizeObserver:ac},directives:{ObserveVisibility:LL},props:{...av,itemSize:{type:Number,default:null},gridItems:{type:Number,default:void 0},itemSecondarySize:{type:Number,default:void 0},minItemSize:{type:[Number,String],default:null},sizeField:{type:String,default:"size"},typeField:{type:String,default:"type"},buffer:{type:Number,default:200},pageMode:{type:Boolean,default:!1},prerender:{type:Number,default:0},emitUpdate:{type:Boolean,default:!1},updateInterval:{type:Number,default:0},skipHover:{type:Boolean,default:!1},listTag:{type:String,default:"div"},itemTag:{type:String,default:"div"},listClass:{type:[String,Object,Array],default:""},itemClass:{type:[String,Object,Array],default:""}},emits:["resize","visible","hidden","update","scroll-start","scroll-end"],data(){return{pool:[],totalSize:0,ready:!1,hoverKey:null}},computed:{sizes(){if(this.itemSize===null){const t={"-1":{accumulator:0}},e=this.items,n=this.sizeField,i=this.minItemSize;let s=1e4,r=0,o;for(let a=0,l=e.length;a<l;a++)o=e[a][n]||i,o<s&&(s=o),r+=o,t[a]={accumulator:r,size:o};return this.$_computedMinItemSize=s,t}return[]},simpleArray:lv,itemIndexByKey(){const{keyField:t,items:e}=this,n={};for(let i=0,s=e.length;i<s;i++)n[e[i][t]]=i;return n}},watch:{items(){this.updateVisibleItems(!0)},pageMode(){this.applyPageMode(),this.updateVisibleItems(!1)},sizes:{handler(){this.updateVisibleItems(!1)},deep:!0},gridItems(){this.updateVisibleItems(!0)},itemSecondarySize(){this.updateVisibleItems(!0)}},created(){this.$_startIndex=0,this.$_endIndex=0,this.$_views=new Map,this.$_unusedViews=new Map,this.$_scrollDirty=!1,this.$_lastUpdateScrollPosition=0,this.prerender&&(this.$_prerender=!0,this.updateVisibleItems(!1)),this.gridItems&&!this.itemSize&&console.error("[vue-recycle-scroller] You must provide an itemSize when using gridItems")},mounted(){this.applyPageMode(),this.$nextTick(()=>{this.$_prerender=!1,this.updateVisibleItems(!0),this.ready=!0})},activated(){const t=this.$_lastUpdateScrollPosition;typeof t=="number"&&this.$nextTick(()=>{this.scrollToPosition(t)})},beforeUnmount(){this.removeListeners()},methods:{addView(t,e,n,i,s){const r=Hl({id:BL++,index:e,used:!0,key:i,type:s}),o=Zf({item:n,position:0,nr:r});return t.push(o),o},unuseView(t,e=!1){const n=this.$_unusedViews,i=t.nr.type;let s=n.get(i);s||(s=[],n.set(i,s)),s.push(t),e||(t.nr.used=!1,t.position=-9999)},handleResize(){this.$emit("resize"),this.ready&&this.updateVisibleItems(!1)},handleScroll(t){if(!this.$_scrollDirty){if(this.$_scrollDirty=!0,this.$_updateTimeout)return;const e=()=>requestAnimationFrame(()=>{this.$_scrollDirty=!1;const{continuous:n}=this.updateVisibleItems(!1,!0);n||(clearTimeout(this.$_refreshTimout),this.$_refreshTimout=setTimeout(this.handleScroll,this.updateInterval+100))});e(),this.updateInterval&&(this.$_updateTimeout=setTimeout(()=>{this.$_updateTimeout=0,this.$_scrollDirty&&e()},this.updateInterval))}},handleVisibilityChange(t,e){this.ready&&(t||e.boundingClientRect.width!==0||e.boundingClientRect.height!==0?(this.$emit("visible"),requestAnimationFrame(()=>{this.updateVisibleItems(!1)})):this.$emit("hidden"))},updateVisibleItems(t,e=!1){const n=this.itemSize,i=this.gridItems||1,s=this.itemSecondarySize||n,r=this.$_computedMinItemSize,o=this.typeField,a=this.simpleArray?null:this.keyField,l=this.items,c=l.length,u=this.sizes,d=this.$_views,f=this.$_unusedViews,p=this.pool,g=this.itemIndexByKey;let _,m,h,v,b;if(!c)_=m=v=b=h=0;else if(this.$_prerender)_=v=0,m=b=Math.min(this.prerender,l.length),h=null;else{const L=this.getScroll();if(e){let B=L.start-this.$_lastUpdateScrollPosition;if(B<0&&(B=-B),n===null&&B<r||B<n)return{continuous:!0}}this.$_lastUpdateScrollPosition=L.start;const E=this.buffer;L.start-=E,L.end+=E;let P=0;if(this.$refs.before&&(P=this.$refs.before.scrollHeight,L.start-=P),this.$refs.after){const B=this.$refs.after.scrollHeight;L.end+=B}if(n===null){let B,Z=0,G=c-1,X=~~(c/2),$;do $=X,B=u[X].accumulator,B<L.start?Z=X:X<c-1&&u[X+1].accumulator>L.start&&(G=X),X=~~((Z+G)/2);while(X!==$);for(X<0&&(X=0),_=X,h=u[c-1].accumulator,m=X;m<c&&u[m].accumulator<L.end;m++);for(m===-1?m=l.length-1:(m++,m>c&&(m=c)),v=_;v<c&&P+u[v].accumulator<L.start;v++);for(b=v;b<c&&P+u[b].accumulator<L.end;b++);}else{_=~~(L.start/n*i);const B=_%i;_-=B,m=Math.ceil(L.end/n*i),v=Math.max(0,Math.floor((L.start-P)/n*i)),b=Math.floor((L.end-P)/n*i),_<0&&(_=0),m>c&&(m=c),v<0&&(v=0),b>c&&(b=c),h=Math.ceil(c/i)*n}}m-_>NL.itemsLimit&&this.itemsLimitError(),this.totalSize=h;let x;const D=_<=this.$_endIndex&&m>=this.$_startIndex;if(D)for(let L=0,E=p.length;L<E;L++)x=p[L],x.nr.used&&(t&&(x.nr.index=g[x.item[a]]),(x.nr.index==null||x.nr.index<_||x.nr.index>=m)&&this.unuseView(x));const C=D?null:new Map;let R,S,M;for(let L=_;L<m;L++){R=l[L];const E=a?R[a]:R;if(E==null)throw new Error(`Key is ${E} on item (keyField is '${a}')`);if(x=d.get(E),!n&&!u[L].size){x&&this.unuseView(x);continue}S=R[o];let P=f.get(S),B=!1;if(!x)D?P&&P.length?x=P.pop():x=this.addView(p,L,R,E,S):(M=C.get(S)||0,(!P||M>=P.length)&&(x=this.addView(p,L,R,E,S),this.unuseView(x,!0),P=f.get(S)),x=P[M],C.set(S,M+1)),d.delete(x.nr.key),x.nr.used=!0,x.nr.index=L,x.nr.key=E,x.nr.type=S,d.set(E,x),B=!0;else if(!x.nr.used&&(x.nr.used=!0,B=!0,P)){const Z=P.indexOf(x);Z!==-1&&P.splice(Z,1)}x.item=R,B&&(L===l.length-1&&this.$emit("scroll-end"),L===0&&this.$emit("scroll-start")),n===null?(x.position=u[L-1].accumulator,x.offset=0):(x.position=Math.floor(L/i)*n,x.offset=L%i*s)}return this.$_startIndex=_,this.$_endIndex=m,this.emitUpdate&&this.$emit("update",_,m,v,b),clearTimeout(this.$_sortTimer),this.$_sortTimer=setTimeout(this.sortViews,this.updateInterval+300),{continuous:D}},getListenerTarget(){let t=Vm(this.$el);return window.document&&(t===window.document.documentElement||t===window.document.body)&&(t=window),t},getScroll(){const{$el:t,direction:e}=this,n=e==="vertical";let i;if(this.pageMode){const s=t.getBoundingClientRect(),r=n?s.height:s.width;let o=-(n?s.top:s.left),a=n?window.innerHeight:window.innerWidth;o<0&&(a+=o,o=0),o+a>r&&(a=r-o),i={start:o,end:o+a}}else n?i={start:t.scrollTop,end:t.scrollTop+t.clientHeight}:i={start:t.scrollLeft,end:t.scrollLeft+t.clientWidth};return i},applyPageMode(){this.pageMode?this.addListeners():this.removeListeners()},addListeners(){this.listenerTarget=this.getListenerTarget(),this.listenerTarget.addEventListener("scroll",this.handleScroll,Hf?{passive:!0}:!1),this.listenerTarget.addEventListener("resize",this.handleResize)},removeListeners(){this.listenerTarget&&(this.listenerTarget.removeEventListener("scroll",this.handleScroll),this.listenerTarget.removeEventListener("resize",this.handleResize),this.listenerTarget=null)},scrollToItem(t){let e;const n=this.gridItems||1;this.itemSize===null?e=t>0?this.sizes[t-1].accumulator:0:e=Math.floor(t/n)*this.itemSize,this.scrollToPosition(e)},scrollToPosition(t){const e=this.direction==="vertical"?{scroll:"scrollTop",start:"top"}:{scroll:"scrollLeft",start:"left"};let n,i,s;if(this.pageMode){const r=Vm(this.$el),o=r.tagName==="HTML"?0:r[e.scroll],a=r.getBoundingClientRect(),c=this.$el.getBoundingClientRect()[e.start]-a[e.start];n=r,i=e.scroll,s=t+o+c}else n=this.$el,i=e.scroll,s=t;n[i]=s},itemsLimitError(){throw setTimeout(()=>{console.log("It seems the scroller element isn't scrolling, so it tries to render all the items at once.","Scroller:",this.$el),console.log("Make sure the scroller has a fixed height (or width) and 'overflow-y' (or 'overflow-x') set to 'auto' so it can scroll correctly and only render the items visible in the scroll viewport.")}),new Error("Rendered items limit reached")},sortViews(){this.pool.sort((t,e)=>t.nr.index-e.nr.index)}}};const zL={key:0,ref:"before",class:"vue-recycle-scroller__slot"},VL={key:1,ref:"after",class:"vue-recycle-scroller__slot"};function HL(t,e,n,i,s,r){const o=fl("ResizeObserver"),a=Dx("observe-visibility");return cl((xe(),Ie("div",{class:At(["vue-recycle-scroller",{ready:s.ready,"page-mode":n.pageMode,[`direction-${t.direction}`]:!0}]),onScrollPassive:e[0]||(e[0]=(...l)=>r.handleScroll&&r.handleScroll(...l))},[t.$slots.before?(xe(),Ie("div",zL,[xn(t.$slots,"before")],512)):Ze("v-if",!0),(xe(),ln(Go(n.listTag),{ref:"wrapper",style:Li({[t.direction==="vertical"?"minHeight":"minWidth"]:s.totalSize+"px"}),class:At(["vue-recycle-scroller__item-wrapper",n.listClass])},{default:Et(()=>[(xe(!0),Ie(wt,null,Wr(s.pool,l=>(xe(),ln(Go(n.itemTag),cd({key:l.nr.id,style:s.ready?{transform:`translate${t.direction==="vertical"?"Y":"X"}(${l.position}px) translate${t.direction==="vertical"?"X":"Y"}(${l.offset}px)`,width:n.gridItems?`${t.direction==="vertical"&&n.itemSecondarySize||n.itemSize}px`:void 0,height:n.gridItems?`${t.direction==="horizontal"&&n.itemSecondarySize||n.itemSize}px`:void 0}:null,class:["vue-recycle-scroller__item-view",[n.itemClass,{hover:!n.skipHover&&s.hoverKey===l.nr.key}]]},Nx(n.skipHover?{}:{mouseenter:()=>{s.hoverKey=l.nr.key},mouseleave:()=>{s.hoverKey=null}})),{default:Et(()=>[xn(t.$slots,"default",{item:l.item,index:l.nr.index,active:l.nr.used})]),_:2},1040,["style","class"]))),128)),xn(t.$slots,"empty")]),_:3},8,["style","class"])),t.$slots.after?(xe(),Ie("div",VL,[xn(t.$slots,"after")],512)):Ze("v-if",!0),qe(o,{onNotify:r.handleResize},null,8,["onNotify"])],34)),[[a,r.handleVisibilityChange]])}Fd.render=HL;Fd.__file="src/components/RecycleScroller.vue";var kd={name:"DynamicScroller",components:{RecycleScroller:Fd},provide(){return typeof ResizeObserver<"u"&&(this.$_resizeObserver=new ResizeObserver(t=>{requestAnimationFrame(()=>{if(Array.isArray(t)){for(const e of t)if(e.target&&e.target.$_vs_onResize){let n,i;if(e.borderBoxSize){const s=e.borderBoxSize[0];n=s.inlineSize,i=s.blockSize}else n=e.contentRect.width,i=e.contentRect.height;e.target.$_vs_onResize(e.target.$_vs_id,n,i)}}})})),{vscrollData:this.vscrollData,vscrollParent:this,vscrollResizeObserver:this.$_resizeObserver}},inheritAttrs:!1,props:{...av,minItemSize:{type:[Number,String],required:!0}},emits:["resize","visible"],data(){return{vscrollData:{active:!0,sizes:{},keyField:this.keyField,simpleArray:!1}}},computed:{simpleArray:lv,itemsWithSize(){const t=[],{items:e,keyField:n,simpleArray:i}=this,s=this.vscrollData.sizes,r=e.length;for(let o=0;o<r;o++){const a=e[o],l=i?o:a[n];let c=s[l];typeof c>"u"&&!this.$_undefinedMap[l]&&(c=0),t.push({item:a,id:l,size:c})}return t}},watch:{items(){this.forceUpdate()},simpleArray:{handler(t){this.vscrollData.simpleArray=t},immediate:!0},direction(t){this.forceUpdate(!0)},itemsWithSize(t,e){const n=this.$el.scrollTop;let i=0,s=0;const r=Math.min(t.length,e.length);for(let a=0;a<r&&!(i>=n);a++)i+=e[a].size||this.minItemSize,s+=t[a].size||this.minItemSize;const o=s-i;o!==0&&(this.$el.scrollTop+=o)}},beforeCreate(){this.$_updates=[],this.$_undefinedSizes=0,this.$_undefinedMap={},this.$_events=DL()},activated(){this.vscrollData.active=!0},deactivated(){this.vscrollData.active=!1},unmounted(){this.$_events.all.clear()},methods:{onScrollerResize(){this.$refs.scroller&&this.forceUpdate(),this.$emit("resize")},onScrollerVisible(){this.$_events.emit("vscroll:update",{force:!1}),this.$emit("visible")},forceUpdate(t=!1){(t||this.simpleArray)&&(this.vscrollData.sizes={}),this.$_events.emit("vscroll:update",{force:!0})},scrollToItem(t){const e=this.$refs.scroller;e&&e.scrollToItem(t)},getItemSize(t,e=void 0){const n=this.simpleArray?e??this.items.indexOf(t):t[this.keyField];return this.vscrollData.sizes[n]||0},scrollToBottom(){if(this.$_scrollingToBottom)return;this.$_scrollingToBottom=!0;const t=this.$el;this.$nextTick(()=>{t.scrollTop=t.scrollHeight+5e3;const e=()=>{t.scrollTop=t.scrollHeight+5e3,requestAnimationFrame(()=>{t.scrollTop=t.scrollHeight+5e3,this.$_undefinedSizes===0?this.$_scrollingToBottom=!1:requestAnimationFrame(e)})};requestAnimationFrame(e)})}}};function GL(t,e,n,i,s,r){const o=fl("RecycleScroller");return xe(),ln(o,cd({ref:"scroller",items:r.itemsWithSize,"min-item-size":n.minItemSize,direction:t.direction,"key-field":"id","list-tag":t.listTag,"item-tag":t.itemTag},t.$attrs,{onResize:r.onScrollerResize,onVisible:r.onScrollerVisible}),{default:Et(({item:a,index:l,active:c})=>[xn(t.$slots,"default",wv(Jg({item:a.item,index:l,active:c,itemWithSize:a})))]),before:Et(()=>[xn(t.$slots,"before")]),after:Et(()=>[xn(t.$slots,"after")]),empty:Et(()=>[xn(t.$slots,"empty")]),_:3},16,["items","min-item-size","direction","list-tag","item-tag","onResize","onVisible"])}kd.render=GL;kd.__file="src/components/DynamicScroller.vue";var cv={name:"DynamicScrollerItem",inject:["vscrollData","vscrollParent","vscrollResizeObserver"],props:{item:{required:!0},watchData:{type:Boolean,default:!1},active:{type:Boolean,required:!0},index:{type:Number,default:void 0},sizeDependencies:{type:[Array,Object],default:null},emitResize:{type:Boolean,default:!1},tag:{type:String,default:"div"}},emits:["resize"],computed:{id(){if(this.vscrollData.simpleArray)return this.index;if(this.vscrollData.keyField in this.item)return this.item[this.vscrollData.keyField];throw new Error(`keyField '${this.vscrollData.keyField}' not found in your item. You should set a valid keyField prop on your Scroller`)},size(){return this.vscrollData.sizes[this.id]||0},finalActive(){return this.active&&this.vscrollData.active}},watch:{watchData:"updateWatchData",id(t,e){if(this.$el.$_vs_id=this.id,this.size||this.onDataUpdate(),this.$_sizeObserved){const n=this.vscrollData.sizes[e],i=this.vscrollData.sizes[t];n!=null&&n!==i&&this.applySize(n)}},finalActive(t){this.size||(t?this.vscrollParent.$_undefinedMap[this.id]||(this.vscrollParent.$_undefinedSizes++,this.vscrollParent.$_undefinedMap[this.id]=!0):this.vscrollParent.$_undefinedMap[this.id]&&(this.vscrollParent.$_undefinedSizes--,this.vscrollParent.$_undefinedMap[this.id]=!1)),this.vscrollResizeObserver?t?this.observeSize():this.unobserveSize():t&&this.$_pendingVScrollUpdate===this.id&&this.updateSize()}},created(){if(!this.$isServer&&(this.$_forceNextVScrollUpdate=null,this.updateWatchData(),!this.vscrollResizeObserver)){for(const t in this.sizeDependencies)this.$watch(()=>this.sizeDependencies[t],this.onDataUpdate);this.vscrollParent.$_events.on("vscroll:update",this.onVscrollUpdate)}},mounted(){this.finalActive&&(this.updateSize(),this.observeSize())},beforeUnmount(){this.vscrollParent.$_events.off("vscroll:update",this.onVscrollUpdate),this.unobserveSize()},methods:{updateSize(){this.finalActive?this.$_pendingSizeUpdate!==this.id&&(this.$_pendingSizeUpdate=this.id,this.$_forceNextVScrollUpdate=null,this.$_pendingVScrollUpdate=null,this.computeSize(this.id)):this.$_forceNextVScrollUpdate=this.id},updateWatchData(){this.watchData&&!this.vscrollResizeObserver?this.$_watchData=this.$watch("item",()=>{this.onDataUpdate()},{deep:!0}):this.$_watchData&&(this.$_watchData(),this.$_watchData=null)},onVscrollUpdate({force:t}){!this.finalActive&&t&&(this.$_pendingVScrollUpdate=this.id),(this.$_forceNextVScrollUpdate===this.id||t||!this.size)&&this.updateSize()},onDataUpdate(){this.updateSize()},computeSize(t){this.$nextTick(()=>{if(this.id===t){const e=this.$el.offsetWidth,n=this.$el.offsetHeight;this.applyWidthHeight(e,n)}this.$_pendingSizeUpdate=null})},applyWidthHeight(t,e){const n=~~(this.vscrollParent.direction==="vertical"?e:t);n&&this.size!==n&&this.applySize(n)},applySize(t){this.vscrollParent.$_undefinedMap[this.id]&&(this.vscrollParent.$_undefinedSizes--,this.vscrollParent.$_undefinedMap[this.id]=void 0),this.vscrollData.sizes[this.id]=t,this.emitResize&&this.$emit("resize",this.id)},observeSize(){this.vscrollResizeObserver&&(this.$_sizeObserved||(this.vscrollResizeObserver.observe(this.$el),this.$el.$_vs_id=this.id,this.$el.$_vs_onResize=this.onResize,this.$_sizeObserved=!0))},unobserveSize(){this.vscrollResizeObserver&&this.$_sizeObserved&&(this.vscrollResizeObserver.unobserve(this.$el),this.$el.$_vs_onResize=void 0,this.$_sizeObserved=!1)},onResize(t,e,n){this.id===t&&this.applyWidthHeight(e,n)}},render(){return Ps(this.tag,this.$slots.default())}};cv.__file="src/components/DynamicScrollerItem.vue";const lo=ey(mL);lo.use(iy());lo.use(gL);lo.use(n0);lo.component("DynamicScroller",kd);lo.component("DynamicScrollerItem",cv);lo.mount("#app");export{ex as $,Et as A,Kt as B,Wr as C,Li as D,rt as E,wt as F,to as G,fl as H,or as I,Bt as J,xe as K,$f as L,Ox as M,no as N,xn as O,KL as P,ix as Q,io as R,Xf as S,Br as T,zn as U,Zm as V,Ax as W,YL as X,ln as Y,dg as Z,ui as _,J6 as a,f6 as a$,$L as a0,qa as a1,Ps as a2,WL as a3,Hl as a4,gu as a5,qL as a6,cd as a7,Go as a8,XL as a9,W6 as aA,WM as aB,Qs as aC,HM as aD,$M as aE,G6 as aF,XM as aG,KM as aH,H6 as aI,Zl as aJ,x6 as aK,S6 as aL,y6 as aM,b6 as aN,E6 as aO,M6 as aP,A6 as aQ,T6 as aR,g6 as aS,_6 as aT,P6 as aU,L6 as aV,ZL as aW,U6 as aX,w6 as aY,F6 as aZ,jM as a_,wv as aa,An as ab,wo as ac,vt as ad,d_ as ae,jL as af,u_ as ag,MP as ah,km as ai,R_ as aj,mP as ak,yM as al,EM as am,Bm as an,V6 as ao,D6 as ap,ZM as aq,JM as ar,t6 as as,s6 as at,i6 as au,n6 as av,QM as aw,e6 as ax,VM as ay,GM as az,ft as b,d6 as b0,u6 as b1,YM as b2,$6 as b3,k6 as b4,O6 as b5,td as b6,NM as c,OM as d,Vt as e,fr as f,v6 as g,h6 as h,X6 as i,Q6 as j,Ds as k,Ie as l,Oe as m,ai as n,ql as o,H as p,At as q,Ee as r,Vh as s,Ye as t,Ed as u,Ze as v,Vn as w,cl as x,AS as y,qe as z};
