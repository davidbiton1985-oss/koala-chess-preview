import{Vector3 as Z,BufferGeometry as $e,BufferAttribute as je,Mesh as Ke,Scene as Ne,OrthographicCamera as Ye,Vector2 as R,MeshDepthMaterial as Je,RGBADepthPacking as Ze,Color as We,ShaderMaterial as et,AdditiveBlending as tt,NoBlending as at,WebGLRenderTarget as z,LinearFilter as M,UnsignedByteType as Fe,SRGBColorSpace as lt,FramebufferTexture as ot,HalfFloatType as it,MathUtils as _e,NearestFilter as Le}from"./three.module-D5rf0S9N.js";import{G as st}from"./grade-BSuY6yDo.js";const nt=600,rt=`
varying vec2 vUv;
void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }`,Ie=`
vec3 visLin(vec3 c) { return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(0.04045, c)); }
vec3 visEnc(vec3 c) { c = max(c, vec3(0.0)); return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c)); }`,ut=`
uniform sampler2D tSrc; uniform vec2 uTexel; uniform float uThreshold; uniform float uKnee;
varying vec2 vUv;
${Ie}
void main() {
  vec3 c = visLin(texture2D(tSrc, vUv + uTexel * vec2(-1.0, -1.0)).rgb);
  c += visLin(texture2D(tSrc, vUv + uTexel * vec2(1.0, -1.0)).rgb);
  c += visLin(texture2D(tSrc, vUv + uTexel * vec2(-1.0, 1.0)).rgb);
  c += visLin(texture2D(tSrc, vUv + uTexel * vec2(1.0, 1.0)).rgb);
  c *= 0.25;
  float l = max(c.r, max(c.g, c.b));
  float soft = clamp(l - uThreshold + uKnee, 0.0, 2.0 * uKnee);
  soft = soft * soft / (4.0 * uKnee + 1e-5);
  float w = max(soft, l - uThreshold) / max(l, 1e-5);
  gl_FragColor = vec4(c * w, 1.0);
}`,ct=`
uniform sampler2D tSrc; uniform vec2 uTexel;
varying vec2 vUv;
void main() {
  vec3 s = texture2D(tSrc, vUv).rgb * 4.0;
  s += texture2D(tSrc, vUv + uTexel * vec2(-1.0, -1.0)).rgb;
  s += texture2D(tSrc, vUv + uTexel * vec2(1.0, -1.0)).rgb;
  s += texture2D(tSrc, vUv + uTexel * vec2(-1.0, 1.0)).rgb;
  s += texture2D(tSrc, vUv + uTexel * vec2(1.0, 1.0)).rgb;
  gl_FragColor = vec4(s * 0.125, 1.0);
}`,Pe=`
uniform sampler2D tSrc; uniform vec2 uTexel; uniform float uWeight;
varying vec2 vUv;
void main() {
  vec2 o = uTexel;
  vec3 s = texture2D(tSrc, vUv + vec2(-2.0 * o.x, 0.0)).rgb;
  s += texture2D(tSrc, vUv + vec2(-o.x, o.y)).rgb * 2.0;
  s += texture2D(tSrc, vUv + vec2(0.0, 2.0 * o.y)).rgb;
  s += texture2D(tSrc, vUv + vec2(o.x, o.y)).rgb * 2.0;
  s += texture2D(tSrc, vUv + vec2(2.0 * o.x, 0.0)).rgb;
  s += texture2D(tSrc, vUv + vec2(o.x, -o.y)).rgb * 2.0;
  s += texture2D(tSrc, vUv + vec2(0.0, -2.0 * o.y)).rgb;
  s += texture2D(tSrc, vUv + vec2(-o.x, -o.y)).rgb * 2.0;
  gl_FragColor = vec4(s * (uWeight / 12.0), 1.0);
}`,ft=`
uniform sampler2D tSrc; uniform vec2 uLight;
varying vec2 vUv;
void main() {
  vec2 d = (vUv - uLight) / 24.0;
  vec2 uv = vUv;
  vec3 acc = vec3(0.0); float w = 1.0, sum = 0.0;
  for (int i = 0; i < 24; i++) { acc += texture2D(tSrc, uv).rgb * w; sum += w; uv -= d; w *= 0.93; }
  gl_FragColor = vec4(acc / sum, 1.0);
}`,vt=`
uniform sampler2D tScene; uniform sampler2D tBloom;
uniform float uBloom; uniform float uHasBloom;
uniform float uVignette; uniform vec2 uAspect;
uniform float uGrain; uniform float uSeed;
uniform float uMix;
uniform sampler2D tSoft; uniform sampler2D tDepth; uniform float uDof; uniform vec2 uClip; uniform float uFocus;
uniform vec2 uCenter; uniform float uPool;
uniform sampler2D tWin; uniform vec3 uWin;   // the window (src/vis/window.ts): x where it starts (uv y), y its gradient, z its amount
uniform float uWinTop;                        // where it ends (uv y): 1, or a HUD's foot floating over the canvas
uniform float uTension; uniform float uGlory; uniform sampler2D tRays; uniform float uHasRays;
uniform float uPremul;   // 1: the canvas shows the page through (straight colour graded, the coverage kept)
uniform float uShafts; uniform float uShaftT;   // the glory's own shafts (phase 3): strength, a slow clock
varying vec2 vUv;
${Ie}
${st}
float visHash(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
#include <packing>
// MeshDepthMaterial's RGBA packing (three's own unpack: its byte order changed in r16x) → window depth → 1 / distance
// (0 at the far plane, where the room's dome is)
float visInvDist(vec2 uv) {
  float d = unpackRGBAToDepth(texture2D(tDepth, uv));
  if (d > 0.9999) return 0.0;
  float vz = (uClip.x * uClip.y) / ((uClip.y - uClip.x) * d - uClip.y);
  return 1.0 / max(-vz, 1e-3);
}
void main() {
  vec4 s = texture2D(tScene, vUv);
  float cover = s.a;
  if (uDof > 0.004 && (uPremul < 0.5 || cover > 0.99)) {
    // focus held on the board (the game's subject, wherever the frame's centre is), thin-lens blur ∝ |1/z − 1/focus|
    float coc = clamp(abs(visInvDist(vUv) - uFocus) * 13.0, 0.0, 1.0) * uDof;
    s.rgb = mix(s.rgb, texture2D(tSoft, vUv).rgb, smoothstep(0.0, 1.0, coc));
  }
  if (uPremul > 0.5) s.rgb = cover > 0.004 ? s.rgb / cover : vec3(0.0);
  vec3 lin = visLin(s.rgb);
  if (uWin.z > 0.0 && vUv.y > uWin.x) {
    // the room from the seat, over the strip the view from above spent on table: graded with the frame (below)
    vec3 wc = texture2D(tWin, vec2(vUv.x, clamp((vUv.y - uWin.x) / max(1e-4, uWinTop - uWin.x), 0.0, 1.0))).rgb;
    lin = mix(lin, wc, smoothstep(uWin.x, uWin.x + uWin.y, vUv.y) * uWin.z);
  }
  vec3 glow = vec3(0.0);
  if (uHasBloom > 0.5) glow += texture2D(tBloom, vUv).rgb * uBloom;
  // checkmate: the light breaks — shafts from the sky over the board and a warm lift (matte: light IN the air, not on
  // a surface)
  if (uHasRays > 0.5) glow += texture2D(tRays, vUv).rgb * vec3(1.0, 0.92, 0.78) * uGlory * 1.3;
  // a celebration over a picture with few highlights of its own (a painted plate under a see-through stage): soft shafts
  // fanning down from above the subject, turning slowly — light in the air, so they lie over the painting too
  if (uShafts > 0.0 && uGlory > 0.001) {
    vec2 d = (vUv - vec2(uCenter.x, 1.12)) * uAspect;
    float ang = atan(d.x, -d.y);
    float r = length(d);
    float f = 0.55 + 0.45 * sin(ang * 11.0 + uShaftT * 0.35) * sin(ang * 7.0 - 1.7 - uShaftT * 0.22);
    f = f * f * f;
    float fan = smoothstep(1.05, 0.0, abs(ang));
    float fall = smoothstep(2.2, 0.15, r) * smoothstep(0.02, 0.3, r);
    glow += vec3(1.0, 0.88, 0.66) * f * fan * fall * uGlory * uShafts;
  }
  lin += glow;
  lin *= 1.0 + vec3(0.14, 0.11, 0.06) * uGlory;
  vec3 g = visEnc(lin);
  vec3 raw = g;
  // the grade (vis/grade.ts: one pass, shared with the places' panoramas)
  float l;
  g = gradeLook(g, l);
  // vignette: round, aspect-correct, centred on the BOARD (it sits off the frame's centre when the HUD floats over one
  // side), with a little light pooled on it — the eye lands on the game, the room falls away into its corners
  vec2 q = (vUv - uCenter) * uAspect;
  float r = length(q);
  // (the window over a phone's view from above is spared most of it: the koala up there is the host, not a corner)
  float inWin = uWin.z * smoothstep(uWin.x, uWin.x + uWin.y, vUv.y);
  // (run-1101: a warm falloff: the blue goes first, the corners fall to a warm brown, never to grey)
  g *= (1.0 - uVignette * (1.0 + 0.9 * uTension) * (1.0 - 0.75 * inWin) * smoothstep(0.34 - 0.12 * uTension, 1.05, r) * vec3(0.8, 1.0, 1.2)) * (1.0 + uPool * (1.0 - smoothstep(0.0, 0.55, r)));
  // check: the frame cools and darkens a breath (the corners close in below)
  g = mix(g, g * vec3(0.88, 0.92, 1.0), uTension * 0.8);
  g = mix(raw, g, uMix);
  // film grain: strongest in the mids, a whisper in the blacks and the whites (triangular noise)
  float n = visHash(gl_FragCoord.xy + uSeed * 173.0) + visHash(gl_FragCoord.xy * 1.37 + uSeed * 91.0) - 1.0;
  float mid = 1.0 - abs(l - 0.5) * 1.6;
  g += n * uGrain * clamp(mid, 0.15, 1.0) * uMix;
  // 8-bit dither: the glow's long tails must not band
  g += (visHash(gl_FragCoord.yx + 0.5 + uSeed) - 0.5) / 255.0;
  g = clamp(g, 0.0, 1.0);
  if (uPremul > 0.5) {
    // what the scene covers keeps its coverage; the glow lights what shows through as well (a screen over the page)
    vec3 light = clamp(visEnc(glow), 0.0, 1.0);
    float oa = cover + max(light.r, max(light.g, light.b)) * (1.0 - cover);
    gl_FragColor = vec4(min(g * cover + light * (1.0 - cover), vec3(oa)), oa);
    return;
  }
  // the canvas is premultiplied: colour never exceeds its alpha (a glow over a see-through edge lifts the alpha with it)
  float a = max(s.a, uHasBloom > 0.5 ? min(1.0, max(g.r, max(g.g, g.b)) * step(s.a, 0.999)) : 0.0);
  gl_FragColor = vec4(min(g, vec3(max(a, s.a))), max(a, s.a));
}`,ht=t=>{const o=t.material;if(t.isPoints||t.isSprite||t.isLine)return!0;if(!o)return!1;const x=Array.isArray(o)?o[0]:o;return!!x&&(x.transparent||!x.depthWrite)},mt=new Z;function St(t,o,x,s,A={}){const L=t.render,D=(e,l)=>L.call(t,e,l),j=t.getContext(),he=t.capabilities.isWebGL2&&(t.extensions.has("EXT_color_buffer_half_float")||t.extensions.has("EXT_color_buffer_float")),me=A.subject??(()=>mt),ee=j.getContextAttributes(),te=!!ee&&ee.antialias===!1&&t.capabilities.isWebGL2,He=Math.max(0,Math.min(A.samples??4,t.capabilities.maxSamples||4));let g=null;const ae=new $e;ae.setAttribute("position",new je(new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),3));const le=new Ke(ae);le.frustumCulled=!1;const ge=new Ne;ge.add(le);const ke=new Ye(-1,1,1,-1,0,1),P=(e,l,i=!1)=>new et({vertexShader:rt,fragmentShader:e,uniforms:l,depthTest:!1,depthWrite:!1,toneMapped:!1,blending:i?tt:at}),Q={tSrc:{value:null},uTexel:{value:new R},uThreshold:{value:s.threshold},uKnee:{value:s.knee}},pe=P(ut,Q),W={tSrc:{value:null},uTexel:{value:new R}},K=P(ct,W),U={tSrc:{value:null},uTexel:{value:new R},uWeight:{value:1}},de=P(Pe,U,!0),S=e=>new Z(e[0],e[1],e[2]),a={tScene:{value:null},tBloom:{value:null},uBloom:{value:s.bloom},uHasBloom:{value:0},uLift:{value:S(s.lift)},uGamma:{value:S(s.gamma)},uGain:{value:S(s.gain)},uContrast:{value:s.contrast},uSat:{value:s.saturation},uShadowTint:{value:S(s.shadowTint)},uHighTint:{value:S(s.highTint)},uVignette:{value:s.vignette},uAspect:{value:new R(1,1)},uGrain:{value:s.grain},uSeed:{value:0},uMix:{value:1},tSoft:{value:null},tDepth:{value:null},uDof:{value:0},uClip:{value:new R(.1,100)},uFocus:{value:.06},uCenter:{value:new R(.5,.5)},uPool:{value:s.pool},tWin:{value:null},uWin:{value:new Z(1,.1,0)},uWinTop:{value:1},uTension:{value:0},uGlory:{value:0},tRays:{value:null},uHasRays:{value:0},uPremul:{value:A.premultiplied?1:0},uShafts:{value:0},uShaftT:{value:0}},xe=P(vt,a),we=P(Pe,U),ye=new Je({depthPacking:Ze});let oe=0,w=null,C=null,I=null;const be=new We,ze=new We(1,1,1),V=new Z;let n=x,r=s,Se=1,Te=1,Me=1,N=!1,ie=null,De=0,se=0,ne=0,B=null;const re={tSrc:{value:null},uLight:{value:new R(.5,1.1)}},Ue=P(ft,re);let y=null,f=[];const q=new R;let h=0,m=0,H="",Ce=0,Be=0;const F=A.timed&&t.capabilities.isWebGL2?j.getExtension("EXT_disjoint_timer_query_webgl2"):null,b=j,O=[],Y=[];function Qe(){for(;F&&O.length&&b.getQueryParameter(O[0],b.QUERY_RESULT_AVAILABLE);){const e=O.shift();b.getParameter(F.GPU_DISJOINT_EXT)||(Y.push(b.getQueryParameter(e,b.QUERY_RESULT)/1e6),Y.length>60&&Y.shift()),b.deleteQuery(e)}}const J=new Set,ue=t.info;let X=0;function $(){Q.uThreshold.value=r.threshold,Q.uKnee.value=r.knee,a.uBloom.value=r.bloom,a.uLift.value.copy(S(r.lift)),a.uGamma.value.copy(S(r.gamma)),a.uGain.value.copy(S(r.gain)),a.uContrast.value=r.contrast,a.uSat.value=r.saturation,a.uShadowTint.value.copy(S(r.shadowTint)),a.uHighTint.value.copy(S(r.highTint)),a.uVignette.value=r.vignette*n.vignette,a.uPool.value=r.pool,a.uGrain.value=r.grain*n.grain}$();let E=null;function Ve(e){if(!E)return;const l=E.next;if(N){E=null,n=l,H="",$();return}const i=Math.min(1,Math.max(0,(e-E.t0)/nt)),u=i*i*(3-2*i);a.uBloom.value=r.bloom*(l.bloom?1:1-u),a.uVignette.value=r.vignette*(n.vignette+(l.vignette-n.vignette)*u),a.uGrain.value=r.grain*(n.grain+(l.grain-n.grain)*u),i>=1&&(E=null,n=l,H="",$())}function Ee(){t.getDrawingBufferSize(q);const e=`${q.x}x${q.y}:${n.bloom}:${n.bloomScale}:${n.halfFloat&&he}`;if(e===H)return;H=e,h=q.x,m=q.y,y?.dispose(),y=null,g?.dispose(),g=null,te?(g=new z(h,m,{samples:He,type:Fe,depthBuffer:!0,stencilBuffer:!!ee?.stencil,resolveDepthBuffer:!1,resolveStencilBuffer:!1,minFilter:M,magFilter:M,generateMipmaps:!1}),g.texture.colorSpace=lt,g.texture.internalFormat="RGBA8",g.isXRRenderTarget=!0):(y=new ot(h,m),y.minFilter=M,y.magFilter=M,y.generateMipmaps=!1);for(const u of f)u.dispose();f=[];let l=Math.max(1,Math.round(h*n.bloomScale)),i=Math.max(1,Math.round(m*n.bloomScale));for(let u=0;u<n.bloom&&l>=4&&i>=4;u++)f.push(new z(l,i,{type:n.halfFloat&&he?it:Fe,minFilter:M,magFilter:M,depthBuffer:!1,stencilBuffer:!1,generateMipmaps:!1})),l=Math.max(1,l>>1),i=Math.max(1,i>>1);a.uAspect.value.set(h/Math.max(1,Math.min(h,m)),m/Math.max(1,Math.min(h,m))),w?.dispose(),C?.dispose(),I?.dispose(),w=C=I=null}function qe(){if(w)return;const e={minFilter:M,magFilter:M,depthBuffer:!1,stencilBuffer:!1,generateMipmaps:!1};w=new z(Math.max(1,h>>1),Math.max(1,m>>1),e),C=new z(Math.max(1,h>>2),Math.max(1,m>>2),e),I=new z(Math.max(1,h>>2),Math.max(1,m>>2),{minFilter:Le,magFilter:Le,depthBuffer:!0,stencilBuffer:!1,generateMipmaps:!1})}function Oe(e){const l=[];o.traverseVisible(d=>{d!==o&&ht(d)&&l.push(d)});for(const d of l)d.visible=!1;const i=o.overrideMaterial,u=t.shadowMap.autoUpdate,k=o.background;t.getClearColor(be);const p=t.getClearAlpha();o.overrideMaterial=ye,t.shadowMap.autoUpdate=!1,o.background=null;try{t.setRenderTarget(I),t.setClearColor(ze,1),t.clear(!0,!0,!1),D(o,e),X+=ue.render.calls}finally{o.overrideMaterial=i,t.shadowMap.autoUpdate=u,o.background=k,t.setClearColor(be,p),t.setRenderTarget(null);for(const d of l)d.visible=!0}const T=e;a.uClip.value.set(T.near??.1,T.far??100);const c=me();c&&(V.copy(c).applyMatrix4(e.matrixWorldInverse),a.uFocus.value=1/Math.max(.5,-V.z))}function G(e,l,i){le.material=e,t.setRenderTarget(l),i&&t.clear(!0,!0,!0),D(ge,ke),X++}let ce=!n.dof,fe=!1;function Xe(e){const l=performance.now();Ee();const i=g?g.texture:y;if(!i||h<2||m<2)return;let u=null;F&&(Qe(),O.length<8&&!b.getQuery(F.TIME_ELAPSED_EXT,b.CURRENT_QUERY)&&(u=b.createQuery(),b.beginQuery(F.TIME_ELAPSED_EXT,u))),y&&t.copyFramebufferToTexture(y);const k=t.autoClear;t.autoClear=!1;try{const p=oe>.004&&n.dof;(p||!ce)&&(ce=!0,qe(),Oe(e),W.tSrc.value=i,W.uTexel.value.set(1/h,1/m),G(K,w,!1),W.tSrc.value=w.texture,W.uTexel.value.set(1/w.width,1/w.height),G(K,C,!1),U.tSrc.value=C.texture,U.uTexel.value.set(1/C.width,1/C.height),U.uWeight.value=1,G(we,w,!1)),a.uDof.value=p?oe:0,a.tSoft.value=p?w.texture:null,a.tDepth.value=p?I.texture:null;const T=f.length>0&&r.bloom>0;if(T){Q.tSrc.value=i,Q.uTexel.value.set(1/h,1/m),G(pe,f[0],!1);for(let v=1;v<f.length;v++){const _=f[v-1];W.tSrc.value=_.texture,W.uTexel.value.set(1/_.width,1/_.height),G(K,f[v],!1)}for(let v=f.length-1;v>0;v--){const _=f[v];U.tSrc.value=_.texture,U.uTexel.value.set(1/_.width,1/_.height),U.uWeight.value=1,G(de,f[v-1],!1)}}const c=ie?ie.frame(performance.now(),e,h,m,D):null;c&&(X+=ue.render.calls),a.tWin.value=c?c.tex:null,a.uWin.value.set(c?c.y0:1,c?c.fade:.1,c?c.alpha:0),a.uWinTop.value=c?.y1??1;const d=me();d?(V.copy(d).project(e),a.uCenter.value.set(_e.clamp((V.x+1)/2,.3,.7),_e.clamp((V.y+1)/2,.3,.7))):a.uCenter.value.set(.5,.5);const ve=T&&se>.01;if(ve||T&&!fe){fe=!0;const v=f[0];(!B||B.width!==v.width||B.height!==v.height)&&(B?.dispose(),B=new z(v.width,v.height,{type:v.texture.type,minFilter:M,magFilter:M,depthBuffer:!1,stencilBuffer:!1,generateMipmaps:!1})),re.tSrc.value=v.texture,re.uLight.value.set(a.uCenter.value.x,1.15),G(Ue,B,!1)}a.tRays.value=ve?B.texture:null,a.uHasRays.value=ve?1:0,a.uTension.value=De,a.uGlory.value=se,a.uShaftT.value=performance.now()/1e3,a.tScene.value=i,a.tBloom.value=T?f[0].texture:null,a.uHasBloom.value=T?1:0,N||(a.uSeed.value=(a.uSeed.value+.6180339887)%1),a.uMix.value=Se,G(xe,null,!0)}finally{t.autoClear=k,t.setRenderTarget(null),F&&u&&(b.endQuery(F.TIME_ELAPSED_EXT),O.push(u))}Ce=performance.now()-l}const Ge=(e,l)=>{if(e!==o||t.getRenderTarget()!==null||j.isContextLost()){D(e,l);return}const i=performance.now();if(i<ne)return;for(const c of[...J])try{c(i)}catch(d){console.warn("[vis] frame hook failed",d)}Ve(i);const u=t.toneMappingExposure,k=o.environmentIntensity;t.toneMappingExposure=u*Te,o.environmentIntensity=k*Me,te&&Ee();try{g&&t.setRenderTarget(g),D(e,l)}finally{t.toneMappingExposure=u,o.environmentIntensity=k,g&&t.setRenderTarget(null)}const p=ue.render,T={calls:p.calls,triangles:p.triangles,points:p.points,lines:p.lines};X=0;try{Xe(l)}catch(c){console.warn("[vis] post failed, drawing the plain frame",c),Ae(),D(e,l);return}Be=X,Object.assign(p,T)};t.render=Ge;let Re=!1;function Ae(){if(!Re){Re=!0,t.render===Ge&&(t.render=L),y?.dispose(),y=null,g?.dispose(),g=null;for(const e of f)e.dispose();f=[],ae.dispose(),pe.dispose(),K.dispose(),de.dispose(),xe.dispose(),we.dispose(),ye.dispose(),Ue.dispose(),B?.dispose(),w?.dispose(),C?.dispose(),I?.dispose(),J.clear()}}return{setLook(e){r=e,$()},setQuality(e){if(!H||N){E=null,n=e,H="",$();return}E={t0:performance.now(),next:e}},get stepping(){return!!E},setMix(e){Se=Math.max(0,Math.min(1,e))},setExposure(e){Te=e},setEnvScale(e){Me=e},setDof(e){oe=Math.max(0,Math.min(1,e))},setStill(e){N=e},setWindow(e){ie=e},setMoment(e,l){De=e,se=l},hold(e){ne=Math.max(ne,performance.now()+e)},warm(){ce=!n.dof,fe=!1},setShafts(e){a.uShafts.value=Math.max(0,e)},onFrame(e){return J.add(e),()=>{J.delete(e)}},stats:()=>{const e=[...Y].sort((l,i)=>l-i);return{draws:Be,levels:f.length,w:h,h:m,ms:Math.round(Ce*100)/100,gpuMs:e.length?Math.round(e[e.length>>1]*1e3)/1e3:null,msaa:te?"chain":"canvas"}},dispose:Ae}}const gt={high:{tier:"high",bloom:5,bloomScale:.25,grain:1,vignette:1,motes:110,puffs:!0,dof:!0,halfFloat:!0,budgetMs:22},mid:{tier:"mid",bloom:4,bloomScale:.25,grain:.8,vignette:1,motes:60,puffs:!0,dof:!0,halfFloat:!0,budgetMs:31},low:{tier:"low",bloom:0,bloomScale:.25,grain:0,vignette:.85,motes:0,puffs:!0,dof:!1,halfFloat:!1,budgetMs:1/0}};function pt(t){return{...gt[t]}}const dt=/Mali-G5|Mali-T|Mali-4|Adreno \(TM\) [345]\d\d|Adreno [345]\d\d|Apple A1[0-2] GPU|PowerVR|SwiftShader|llvmpipe|Software/i,xt=/Apple GPU|Apple A1[3-9]|Apple M\d|Adreno \(TM\) [6-9]\d\d|Adreno [6-9]\d\d|Mali-G7\d|Mali-G6[1-9]\d|Mali-G[7-9]\d\d|Immortalis|Xclipse/i;function Tt(t){return t.override?t.override:t.gpu&&dt.test(t.gpu)||t.memoryGB!==void 0&&t.memoryGB<=2?"low":t.boardTier==="rich"?"high":(t.gpu&&xt.test(t.gpu),"mid")}function wt(t){return t==="high"?"mid":"low"}class Mt{constructor(o,x=48,s=120,A=3e3,L=4e3){this.tier=o,this.size=x,this.gapMs=s,this.coolMs=A,this.graceMs=L}last=-1;win=[];hold=0;start=-1;get current(){return this.tier}frame(o){if(this.start<0&&(this.start=o),o-this.start<this.graceMs)return this.last=o,null;const x=this.last<0?-1:o-this.last;if(this.last=o,x<0||x>this.gapMs)return this.win.length=0,null;if(this.win.push(x),this.win.length>this.size&&this.win.shift(),this.win.length<this.size||o<this.hold||this.tier==="low")return null;const s=[...this.win].sort((L,D)=>L-D);return s[s.length>>1]<=pt(this.tier).budgetMs?null:(this.tier=wt(this.tier),this.win.length=0,this.hold=o+this.coolMs,this.tier)}}export{Mt as G,nt as Q,pt as a,St as c,Tt as v};
