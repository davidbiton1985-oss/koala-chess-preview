import{Vector3 as $,BufferGeometry as Xe,BufferAttribute as je,Mesh as Ne,Scene as $e,OrthographicCamera as Ye,Vector2 as E,MeshDepthMaterial as Je,RGBADepthPacking as Ze,Color as Fe,ShaderMaterial as et,AdditiveBlending as tt,NoBlending as at,WebGLRenderTarget as H,LinearFilter as M,UnsignedByteType as Ae,SRGBColorSpace as ot,FramebufferTexture as lt,HalfFloatType as it,MathUtils as _e,NearestFilter as Le}from"./three.module-D5rf0S9N.js";const N={exposure:1,bloom:.36,threshold:.72,knee:.22,lift:[0,0,.004],gamma:[1,1,1],gain:[1,.995,.985],contrast:.3,saturation:1.03,shadowTint:[.975,.99,1.025],highTint:[1.012,1,.99],vignette:.38,pool:.04,grain:.022,motes:{color:[1,.95,.86],opacity:.42},dust:{color:[.93,.89,.82],opacity:.4},live:{water:0,sky:0}},Pe={harbour:{live:{water:1,sky:1}},lighthouse:{live:{water:1,sky:1}},sky:{live:{water:0,sky:1}},gardens:{live:{water:0,sky:1}},fields:{live:{water:1,sky:1}},zen:{live:{water:0,sky:1}},ocean:{live:{water:1,sky:1},bloom:.42,threshold:.7,highTint:[1.015,1,.988],shadowTint:[.97,.99,1.035],contrast:.32,saturation:1.03},library:{bloom:.5,threshold:.62,vignette:.34,highTint:[1.05,1,.93],shadowTint:[.95,.98,1.05]},cabin:{bloom:.46,threshold:.64,vignette:.3,highTint:[1.05,1,.93]},rooftop:{bloom:.5,threshold:.6,vignette:.32},falls:{bloom:.42,threshold:.68,highTint:[1.02,1.01,.96],shadowTint:[.97,1,1.02]},treehouse:{bloom:.4,threshold:.7},canyon:{live:{water:0,sky:1},bloom:.36,highTint:[1.05,1,.94],dust:{color:[.9,.8,.68],opacity:.42}},dunes:{bloom:.5,threshold:.62,vignette:.32},glacier:{live:{water:0,sky:1},bloom:.42,threshold:.7,highTint:[1,1,1.02],shadowTint:[.97,.99,1.04],dust:{color:[.92,.95,.98],opacity:.36}},observatory:{bloom:.52,threshold:.6,vignette:.34},"stage-falls":{bloom:.5,threshold:.64,knee:.24,contrast:.24,saturation:1.04,highTint:[1.025,1.005,.96],shadowTint:[.97,1,1.02],vignette:.32,pool:.03,grain:.018},"world-knight":{exposure:.97,bloom:.26,threshold:.88,knee:.1,contrast:.2,saturation:1.02,highTint:[1.008,1,.985],shadowTint:[.97,1,1.02],vignette:.34,pool:0},map:{bloom:.3,threshold:.76,knee:.2,contrast:.12,saturation:1.02,lift:[0,0,0],gain:[1,1,1],shadowTint:[.99,.995,1.01],highTint:[1.008,1,.995],vignette:.1,pool:0,grain:.012}};function wt(t){const o=t&&(Pe[t]??(t.startsWith("stage-")?Pe["stage-falls"]:void 0))||{};return{...N,...o,motes:{...N.motes,...o.motes},dust:{...N.dust,...o.dust},live:{...N.live,...o.live}}}const st=`
varying vec2 vUv;
void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }`,He=`
vec3 visLin(vec3 c) { return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(0.04045, c)); }
vec3 visEnc(vec3 c) { c = max(c, vec3(0.0)); return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c)); }`,nt=`
uniform sampler2D tSrc; uniform vec2 uTexel; uniform float uThreshold; uniform float uKnee;
varying vec2 vUv;
${He}
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
}`,rt=`
uniform sampler2D tSrc; uniform vec2 uTexel;
varying vec2 vUv;
void main() {
  vec3 s = texture2D(tSrc, vUv).rgb * 4.0;
  s += texture2D(tSrc, vUv + uTexel * vec2(-1.0, -1.0)).rgb;
  s += texture2D(tSrc, vUv + uTexel * vec2(1.0, -1.0)).rgb;
  s += texture2D(tSrc, vUv + uTexel * vec2(-1.0, 1.0)).rgb;
  s += texture2D(tSrc, vUv + uTexel * vec2(1.0, 1.0)).rgb;
  gl_FragColor = vec4(s * 0.125, 1.0);
}`,ke=`
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
}`,ut=`
uniform sampler2D tSrc; uniform vec2 uLight;
varying vec2 vUv;
void main() {
  vec2 d = (vUv - uLight) / 24.0;
  vec2 uv = vUv;
  vec3 acc = vec3(0.0); float w = 1.0, sum = 0.0;
  for (int i = 0; i < 24; i++) { acc += texture2D(tSrc, uv).rgb * w; sum += w; uv -= d; w *= 0.93; }
  gl_FragColor = vec4(acc / sum, 1.0);
}`,ct=`
uniform sampler2D tScene; uniform sampler2D tBloom;
uniform float uBloom; uniform float uHasBloom;
uniform vec3 uLift; uniform vec3 uGamma; uniform vec3 uGain;
uniform float uContrast; uniform float uSat;
uniform vec3 uShadowTint; uniform vec3 uHighTint;
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
${He}
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
  // primaries
  g = uGain * (g + uLift * (1.0 - g));
  g = pow(max(g, vec3(0.0)), 1.0 / uGamma);
  // a soft S around the middle (no clipping: it is a blend toward smoothstep, which keeps 0 and 1)
  vec3 gc = clamp(g, 0.0, 1.0);
  g = mix(g, gc * gc * (3.0 - 2.0 * gc), uContrast);
  // split tone by luminance
  const vec3 W = vec3(0.2126, 0.7152, 0.0722);
  float l = dot(clamp(g, 0.0, 1.0), W);
  g *= mix(uShadowTint, uHighTint, smoothstep(0.08, 0.82, l));
  // saturation, gentler on what is already saturated (a vibrance)
  float l2 = dot(g, W);
  float chroma = max(g.r, max(g.g, g.b)) - min(g.r, min(g.g, g.b));
  g = mix(vec3(l2), g, mix(uSat, 1.0, clamp(chroma * 1.4, 0.0, 1.0) * step(1.0, uSat)));
  // vignette: round, aspect-correct, centred on the BOARD (it sits off the frame's centre when the HUD floats over one
  // side), with a little light pooled on it — the eye lands on the game, the room falls away into its corners
  vec2 q = (vUv - uCenter) * uAspect;
  float r = length(q);
  // (the window over a phone's view from above is spared most of it: the koala up there is the host, not a corner)
  float inWin = uWin.z * smoothstep(uWin.x, uWin.x + uWin.y, vUv.y);
  g *= (1.0 - uVignette * (1.0 + 0.9 * uTension) * (1.0 - 0.75 * inWin) * smoothstep(0.34 - 0.12 * uTension, 1.05, r)) * (1.0 + uPool * (1.0 - smoothstep(0.0, 0.55, r)));
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
}`,ht=t=>{const o=t.material;if(t.isPoints||t.isSprite||t.isLine)return!0;if(!o)return!1;const x=Array.isArray(o)?o[0]:o;return!!x&&(x.transparent||!x.depthWrite)},ft=new $;function yt(t,o,x,s,G={}){const _=t.render,D=(e,l)=>_.call(t,e,l),q=t.getContext(),fe=t.capabilities.isWebGL2&&(t.extensions.has("EXT_color_buffer_half_float")||t.extensions.has("EXT_color_buffer_float")),ve=G.subject??(()=>ft),Y=q.getContextAttributes(),J=!!Y&&Y.antialias===!1&&t.capabilities.isWebGL2,Ie=Math.max(0,Math.min(G.samples??4,t.capabilities.maxSamples||4));let g=null;const Z=new Xe;Z.setAttribute("position",new je(new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),3));const ee=new Ne(Z);ee.frustumCulled=!1;const ge=new $e;ge.add(ee);const ze=new Ye(-1,1,1,-1,0,1),L=(e,l,i=!1)=>new et({vertexShader:st,fragmentShader:e,uniforms:l,depthTest:!1,depthWrite:!1,toneMapped:!1,blending:i?tt:at}),I={tSrc:{value:null},uTexel:{value:new E},uThreshold:{value:s.threshold},uKnee:{value:s.knee}},me=L(nt,I),R={tSrc:{value:null},uTexel:{value:new E}},K=L(rt,R),U={tSrc:{value:null},uTexel:{value:new E},uWeight:{value:1}},pe=L(ke,U,!0),T=e=>new $(e[0],e[1],e[2]),a={tScene:{value:null},tBloom:{value:null},uBloom:{value:s.bloom},uHasBloom:{value:0},uLift:{value:T(s.lift)},uGamma:{value:T(s.gamma)},uGain:{value:T(s.gain)},uContrast:{value:s.contrast},uSat:{value:s.saturation},uShadowTint:{value:T(s.shadowTint)},uHighTint:{value:T(s.highTint)},uVignette:{value:s.vignette},uAspect:{value:new E(1,1)},uGrain:{value:s.grain},uSeed:{value:0},uMix:{value:1},tSoft:{value:null},tDepth:{value:null},uDof:{value:0},uClip:{value:new E(.1,100)},uFocus:{value:.06},uCenter:{value:new E(.5,.5)},uPool:{value:s.pool},tWin:{value:null},uWin:{value:new $(1,.1,0)},uWinTop:{value:1},uTension:{value:0},uGlory:{value:0},tRays:{value:null},uHasRays:{value:0},uPremul:{value:G.premultiplied?1:0},uShafts:{value:0},uShaftT:{value:0}},de=L(ct,a),xe=L(ke,U),we=new Je({depthPacking:Ze});let te=0,w=null,C=null,P=null;const ye=new Fe,Oe=new Fe(1,1,1),z=new $;let m=x,c=s,be=1,Te=1,Se=1,Me=!1,ae=null,De=0,oe=0,le=0,W=null;const ie={tSrc:{value:null},uLight:{value:new E(.5,1.1)}},Ue=L(ut,ie);let y=null,r=[];const O=new E;let h=0,f=0,se="",Ce=0,We=0;const F=G.timed&&t.capabilities.isWebGL2?q.getExtension("EXT_disjoint_timer_query_webgl2"):null,b=q,Q=[],X=[];function Qe(){for(;F&&Q.length&&b.getQueryParameter(Q[0],b.QUERY_RESULT_AVAILABLE);){const e=Q.shift();b.getParameter(F.GPU_DISJOINT_EXT)||(X.push(b.getQueryParameter(e,b.QUERY_RESULT)/1e6),X.length>60&&X.shift()),b.deleteQuery(e)}}const j=new Set,ne=t.info;let V=0;function re(){I.uThreshold.value=c.threshold,I.uKnee.value=c.knee,a.uBloom.value=c.bloom,a.uLift.value.copy(T(c.lift)),a.uGamma.value.copy(T(c.gamma)),a.uGain.value.copy(T(c.gain)),a.uContrast.value=c.contrast,a.uSat.value=c.saturation,a.uShadowTint.value.copy(T(c.shadowTint)),a.uHighTint.value.copy(T(c.highTint)),a.uVignette.value=c.vignette*m.vignette,a.uPool.value=c.pool,a.uGrain.value=c.grain*m.grain}re();function Be(){t.getDrawingBufferSize(O);const e=`${O.x}x${O.y}:${m.bloom}:${m.bloomScale}:${m.halfFloat&&fe}`;if(e===se)return;se=e,h=O.x,f=O.y,y?.dispose(),y=null,g?.dispose(),g=null,J?(g=new H(h,f,{samples:Ie,type:Ae,depthBuffer:!0,stencilBuffer:!!Y?.stencil,resolveDepthBuffer:!1,resolveStencilBuffer:!1,minFilter:M,magFilter:M,generateMipmaps:!1}),g.texture.colorSpace=ot,g.texture.internalFormat="RGBA8",g.isXRRenderTarget=!0):(y=new lt(h,f),y.minFilter=M,y.magFilter=M,y.generateMipmaps=!1);for(const v of r)v.dispose();r=[];let l=Math.max(1,Math.round(h*m.bloomScale)),i=Math.max(1,Math.round(f*m.bloomScale));for(let v=0;v<m.bloom&&l>=4&&i>=4;v++)r.push(new H(l,i,{type:m.halfFloat&&fe?it:Ae,minFilter:M,magFilter:M,depthBuffer:!1,stencilBuffer:!1,generateMipmaps:!1})),l=Math.max(1,l>>1),i=Math.max(1,i>>1);a.uAspect.value.set(h/Math.max(1,Math.min(h,f)),f/Math.max(1,Math.min(h,f))),w?.dispose(),C?.dispose(),P?.dispose(),w=C=P=null}function Ve(){if(w)return;const e={minFilter:M,magFilter:M,depthBuffer:!1,stencilBuffer:!1,generateMipmaps:!1};w=new H(Math.max(1,h>>1),Math.max(1,f>>1),e),C=new H(Math.max(1,h>>2),Math.max(1,f>>2),e),P=new H(Math.max(1,h>>2),Math.max(1,f>>2),{minFilter:Le,magFilter:Le,depthBuffer:!0,stencilBuffer:!1,generateMipmaps:!1})}function qe(e){const l=[];o.traverseVisible(d=>{d!==o&&ht(d)&&l.push(d)});for(const d of l)d.visible=!1;const i=o.overrideMaterial,v=t.shadowMap.autoUpdate,k=o.background;t.getClearColor(ye);const p=t.getClearAlpha();o.overrideMaterial=we,t.shadowMap.autoUpdate=!1,o.background=null;try{t.setRenderTarget(P),t.setClearColor(Oe,1),t.clear(!0,!0,!1),D(o,e),V+=ne.render.calls}finally{o.overrideMaterial=i,t.shadowMap.autoUpdate=v,o.background=k,t.setClearColor(ye,p),t.setRenderTarget(null);for(const d of l)d.visible=!0}const S=e;a.uClip.value.set(S.near??.1,S.far??100);const n=ve();n&&(z.copy(n).applyMatrix4(e.matrixWorldInverse),a.uFocus.value=1/Math.max(.5,-z.z))}function B(e,l,i){ee.material=e,t.setRenderTarget(l),i&&t.clear(!0,!0,!0),D(ge,ze),V++}let ue=!m.dof,ce=!1;function Ke(e){const l=performance.now();Be();const i=g?g.texture:y;if(!i||h<2||f<2)return;let v=null;F&&(Qe(),Q.length<8&&!b.getQuery(F.TIME_ELAPSED_EXT,b.CURRENT_QUERY)&&(v=b.createQuery(),b.beginQuery(F.TIME_ELAPSED_EXT,v))),y&&t.copyFramebufferToTexture(y);const k=t.autoClear;t.autoClear=!1;try{const p=te>.004&&m.dof;(p||!ue)&&(ue=!0,Ve(),qe(e),R.tSrc.value=i,R.uTexel.value.set(1/h,1/f),B(K,w,!1),R.tSrc.value=w.texture,R.uTexel.value.set(1/w.width,1/w.height),B(K,C,!1),U.tSrc.value=C.texture,U.uTexel.value.set(1/C.width,1/C.height),U.uWeight.value=1,B(xe,w,!1)),a.uDof.value=p?te:0,a.tSoft.value=p?w.texture:null,a.tDepth.value=p?P.texture:null;const S=r.length>0&&c.bloom>0;if(S){I.tSrc.value=i,I.uTexel.value.set(1/h,1/f),B(me,r[0],!1);for(let u=1;u<r.length;u++){const A=r[u-1];R.tSrc.value=A.texture,R.uTexel.value.set(1/A.width,1/A.height),B(K,r[u],!1)}for(let u=r.length-1;u>0;u--){const A=r[u];U.tSrc.value=A.texture,U.uTexel.value.set(1/A.width,1/A.height),U.uWeight.value=1,B(pe,r[u-1],!1)}}const n=ae?ae.frame(performance.now(),e,h,f,D):null;n&&(V+=ne.render.calls),a.tWin.value=n?n.tex:null,a.uWin.value.set(n?n.y0:1,n?n.fade:.1,n?n.alpha:0),a.uWinTop.value=n?.y1??1;const d=ve();d?(z.copy(d).project(e),a.uCenter.value.set(_e.clamp((z.x+1)/2,.3,.7),_e.clamp((z.y+1)/2,.3,.7))):a.uCenter.value.set(.5,.5);const he=S&&oe>.01;if(he||S&&!ce){ce=!0;const u=r[0];(!W||W.width!==u.width||W.height!==u.height)&&(W?.dispose(),W=new H(u.width,u.height,{type:u.texture.type,minFilter:M,magFilter:M,depthBuffer:!1,stencilBuffer:!1,generateMipmaps:!1})),ie.tSrc.value=u.texture,ie.uLight.value.set(a.uCenter.value.x,1.15),B(Ue,W,!1)}a.tRays.value=he?W.texture:null,a.uHasRays.value=he?1:0,a.uTension.value=De,a.uGlory.value=oe,a.uShaftT.value=performance.now()/1e3,a.tScene.value=i,a.tBloom.value=S?r[0].texture:null,a.uHasBloom.value=S?1:0,Me||(a.uSeed.value=(a.uSeed.value+.6180339887)%1),a.uMix.value=be,B(de,null,!0)}finally{t.autoClear=k,t.setRenderTarget(null),F&&v&&(b.endQuery(F.TIME_ELAPSED_EXT),Q.push(v))}Ce=performance.now()-l}const Ee=(e,l)=>{if(e!==o||t.getRenderTarget()!==null||q.isContextLost()){D(e,l);return}const i=performance.now();if(i<le)return;for(const n of[...j])try{n(i)}catch(d){console.warn("[vis] frame hook failed",d)}const v=t.toneMappingExposure,k=o.environmentIntensity;t.toneMappingExposure=v*Te,o.environmentIntensity=k*Se,J&&Be();try{g&&t.setRenderTarget(g),D(e,l)}finally{t.toneMappingExposure=v,o.environmentIntensity=k,g&&t.setRenderTarget(null)}const p=ne.render,S={calls:p.calls,triangles:p.triangles,points:p.points,lines:p.lines};V=0;try{Ke(l)}catch(n){console.warn("[vis] post failed, drawing the plain frame",n),Re(),D(e,l);return}We=V,Object.assign(p,S)};t.render=Ee;let Ge=!1;function Re(){if(!Ge){Ge=!0,t.render===Ee&&(t.render=_),y?.dispose(),y=null,g?.dispose(),g=null;for(const e of r)e.dispose();r=[],Z.dispose(),me.dispose(),K.dispose(),pe.dispose(),de.dispose(),xe.dispose(),we.dispose(),Ue.dispose(),W?.dispose(),w?.dispose(),C?.dispose(),P?.dispose(),j.clear()}}return{setLook(e){c=e,re()},setQuality(e){m=e,se="",re()},setMix(e){be=Math.max(0,Math.min(1,e))},setExposure(e){Te=e},setEnvScale(e){Se=e},setDof(e){te=Math.max(0,Math.min(1,e))},setStill(e){Me=e},setWindow(e){ae=e},setMoment(e,l){De=e,oe=l},hold(e){le=Math.max(le,performance.now()+e)},warm(){ue=!m.dof,ce=!1},setShafts(e){a.uShafts.value=Math.max(0,e)},onFrame(e){return j.add(e),()=>{j.delete(e)}},stats:()=>{const e=[...X].sort((l,i)=>l-i);return{draws:We,levels:r.length,w:h,h:f,ms:Math.round(Ce*100)/100,gpuMs:e.length?Math.round(e[e.length>>1]*1e3)/1e3:null,msaa:J?"chain":"canvas"}},dispose:Re}}const vt={high:{tier:"high",bloom:5,bloomScale:.25,grain:1,vignette:1,motes:110,puffs:!0,dof:!0,halfFloat:!0,budgetMs:22},mid:{tier:"mid",bloom:4,bloomScale:.25,grain:.8,vignette:1,motes:60,puffs:!0,dof:!0,halfFloat:!0,budgetMs:31},low:{tier:"low",bloom:0,bloomScale:.25,grain:0,vignette:.85,motes:0,puffs:!0,dof:!1,halfFloat:!1,budgetMs:1/0}};function gt(t){return{...vt[t]}}const mt=/Mali-G5|Mali-T|Mali-4|Adreno \(TM\) [345]\d\d|Adreno [345]\d\d|Apple A1[0-2] GPU|PowerVR|SwiftShader|llvmpipe|Software/i,pt=/Apple GPU|Apple A1[3-9]|Apple M\d|Adreno \(TM\) [6-9]\d\d|Adreno [6-9]\d\d|Mali-G7\d|Mali-G6[1-9]\d|Mali-G[7-9]\d\d|Immortalis|Xclipse/i;function bt(t){return t.override?t.override:t.gpu&&mt.test(t.gpu)||t.memoryGB!==void 0&&t.memoryGB<=2?"low":t.boardTier==="rich"?"high":(t.gpu&&pt.test(t.gpu),"mid")}function dt(t){return t==="high"?"mid":"low"}class Tt{constructor(o,x=48,s=120,G=3e3,_=4e3){this.tier=o,this.size=x,this.gapMs=s,this.coolMs=G,this.graceMs=_}last=-1;win=[];hold=0;start=-1;get current(){return this.tier}frame(o){if(this.start<0&&(this.start=o),o-this.start<this.graceMs)return this.last=o,null;const x=this.last<0?-1:o-this.last;if(this.last=o,x<0||x>this.gapMs)return this.win.length=0,null;if(this.win.push(x),this.win.length>this.size&&this.win.shift(),this.win.length<this.size||o<this.hold||this.tier==="low")return null;const s=[...this.win].sort((_,D)=>_-D);return s[s.length>>1]<=gt(this.tier).budgetMs?null:(this.tier=dt(this.tier),this.win.length=0,this.hold=o+this.coolMs,this.tier)}}export{Tt as G,gt as a,yt as c,wt as l,bt as v};
