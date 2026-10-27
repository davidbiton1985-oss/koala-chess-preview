import{aT as Ne,aU as De,C as ne,v as $e,S as je,G as Ye,B as ge,a as ie,i as J,h as xe,A as Re,aj as ke,aR as Je,j as ee,M as Ze,f as et,O as tt,V as Z,aG as at,aH as ot,aV as st,aW as it,a6 as oe,s as fe,t as nt,aX as rt,a7 as Ee,F as de}from"./three.module-C8CjLFau.js";import{bM as lt,bJ as he}from"./index-Dj9ZBxAI.js";import{v as ut}from"./api-BxB3wf22.js";import"./game-BB7swOoV.js";import"./chess-Dz_znVVI.js";import"./landPack-DiUFYm7C.js";const _e={power:1.18,sat:1.1};let Ue=!1;function ct(e=_e.power,t=_e.sat){if(Ue)return!0;const a=De.tonemapping_pars_fragment,o="vec3 AgXToneMapping( vec3 color ) {",s="// v = agxLook(v, look);";if(!a.includes(o)||!a.includes(s))return!1;const v=`
vec3 visAgxLook( vec3 v ) {
	const vec3 lw = vec3( 0.2126, 0.7152, 0.0722 );
	float luma = dot( v, lw );
	v = pow( max( v, vec3( 0.0 ) ), vec3( ${e.toFixed(3)} ) );
	return luma + ${t.toFixed(3)} * ( v - luma );
}
`;return De.tonemapping_pars_fragment=a.replace(o,v+o).replace(s,"color = visAgxLook( color );"),Ue=!0,!0}const Oe={key:1.3,sky:.62,rim:.9,shadow:.12,radius:1.25,env:.78,warm:-.035};function ft(){if(typeof document>"u")return null;const e=document.createElement("canvas");e.width=e.height=128;const t=e.getContext("2d");if(!t)return null;const a=t.createRadialGradient(64,64,0,64,64,64);a.addColorStop(0,"rgba(10,7,4,1)"),a.addColorStop(.6,"rgba(10,7,4,.96)"),a.addColorStop(.68,"rgba(10,7,4,.74)"),a.addColorStop(.76,"rgba(10,7,4,.40)"),a.addColorStop(.86,"rgba(10,7,4,.14)"),a.addColorStop(.95,"rgba(10,7,4,.03)"),a.addColorStop(1,"rgba(10,7,4,0)"),t.fillStyle=a,t.fillRect(0,0,128,128);const o=new $e(e);return o.colorSpace=je,o}const qe={curve:"neutral"};function dt(e){const{renderer:t,rig:a,mats:o}=e,s=e.mood??Oe,v=e.tone??qe,S=t.toneMapping;v.curve==="agx"&&(ct(v.power,v.sat),t.toneMapping=Ne);const z=a.apply,f=a.setQuality,c=()=>{a.key.intensity*=s.key,a.key.color.multiply(new ne(1,1-s.warm*.45,1-s.warm)),a.sky.intensity*=s.sky,a.rim.intensity*=s.rim,a.key.shadow.intensity=Math.min(1,a.key.shadow.intensity+s.shadow)},p=a.key.shadow.radius;a.apply=function(A){z.call(a,A),c()},a.setQuality=function(A){f.call(a,A),a.key.shadow.radius*=s.radius},c(),a.key.shadow.radius=p*s.radius;const d={sq:o.squares.roughness,fr:o.frame.roughness,ri:o.rim.roughness,blob:o.blob.map};o.squares.roughness=Math.max(d.sq,.6),o.frame.roughness=Math.max(d.fr,.64),o.rim.roughness=Math.max(d.ri,.64);const O=ft();return O&&d.blob&&(o.blob.map=O),{refresh:c,dispose(){a.apply=z,a.setQuality=f,a.key.shadow.radius=p,t.toneMapping=S,o.squares.roughness=d.sq,o.frame.roughness=d.fr,o.rim.roughness=d.ri,O&&(o.blob.map=d.blob,O.dispose())}}}const ve={exposure:1,bloom:.36,threshold:.72,knee:.22,lift:[0,0,.004],gamma:[1,1,1],gain:[1,.995,.985],contrast:.3,saturation:1.03,shadowTint:[.975,.99,1.025],highTint:[1.012,1,.99],vignette:.38,pool:.04,grain:.022,motes:{color:[1,.95,.86],opacity:.42},dust:{color:[.93,.89,.82],opacity:.4}},pt={ocean:{bloom:.42,threshold:.7,highTint:[1.015,1,.988],shadowTint:[.97,.99,1.035],contrast:.32,saturation:1.03},library:{bloom:.5,threshold:.62,vignette:.34,highTint:[1.05,1,.93],shadowTint:[.95,.98,1.05]},cabin:{bloom:.46,threshold:.64,vignette:.3,highTint:[1.05,1,.93]},rooftop:{bloom:.5,threshold:.6,vignette:.32},falls:{bloom:.42,threshold:.68,highTint:[1.02,1.01,.96],shadowTint:[.97,1,1.02]},treehouse:{bloom:.4,threshold:.7},canyon:{bloom:.36,highTint:[1.05,1,.94],dust:{color:[.9,.8,.68],opacity:.42}},dunes:{bloom:.5,threshold:.62,vignette:.32},glacier:{bloom:.42,threshold:.7,highTint:[1,1,1.02],shadowTint:[.97,.99,1.04],dust:{color:[.92,.95,.98],opacity:.36}},observatory:{bloom:.52,threshold:.6,vignette:.34}};function Le(e){const t=e&&pt[e]||{};return{...ve,...t,motes:{...ve.motes,...t.motes},dust:{...ve.dust,...t.dust}}}const Fe={p:.55,n:.9,b:.7,r:.85,q:.9,k:.9},mt=520,ht=Math.round(.82*.7*mt);function vt(e,t=!1){const a=t?0:lt(e.from,e.to,e.by),o=[{kind:"land",at:a,square:e.to,from:e.from,strength:Fe[e.piece.type]*(e.flags.promotion?1.2:1),piece:e.piece.type}],s=e.capturedSquare??(e.captured||e.flags.capture?e.to:null);return s&&e.captured&&o.push({kind:"capture",at:Math.round(a*.5)+ht,square:s,strength:1.1+.3*(e.captured.type==="p"?0:1),piece:e.captured.type}),e.rookMove&&o.push({kind:"rook",at:90+Math.max(200,a),square:e.rookMove.to,from:e.rookMove.from,strength:Fe.r*.8,piece:"r"}),o.sort((v,S)=>v.at-S.at)}const gt=`
attribute vec4 aSeed;   // x: speed, y: phase, z: size (board units), w: twinkle phase
uniform float uTime; uniform vec3 uCenter; uniform vec3 uHalf; uniform float uScale; uniform float uLive;
varying float vA;
void main() {
  float t = uTime * (0.35 + 0.65 * aSeed.x);
  vec3 p = position;
  p.x = fract(p.x + t * 0.011 + 0.018 * sin(t * 0.37 + aSeed.y * 6.2832));
  p.y = fract(p.y + t * 0.006 + 0.022 * sin(t * 0.23 + aSeed.y * 4.1));
  p.z = fract(p.z - t * 0.008 + 0.018 * cos(t * 0.29 + aSeed.y * 5.3));
  vec3 e = smoothstep(vec3(0.0), vec3(0.12), p) * smoothstep(vec3(1.0), vec3(0.88), p);
  float tw = 0.55 + 0.45 * sin(uTime * (0.8 + aSeed.x) + aSeed.w * 6.2832);
  vec3 w = uCenter + (p * 2.0 - 1.0) * uHalf;
  vec4 mv = modelViewMatrix * vec4(w, 1.0);
  float d = -mv.z;
  vA = e.x * e.y * e.z * tw * uLive * smoothstep(2.5, 6.0, d);
  gl_PointSize = clamp(aSeed.z * uScale / max(d, 0.1), 0.0, 16.0);
  gl_Position = projectionMatrix * mv;
}`,xt=`
uniform vec3 uColor; uniform float uOpacity;
varying float vA;
void main() {
  float r = length(gl_PointCoord - 0.5) * 2.0;
  float a = 1.0 - smoothstep(0.0, 1.0, r);
  a *= a * vA * uOpacity;
  if (a < 0.002) discard;
  gl_FragColor = vec4(uColor, a);
}`,wt=`
attribute vec3 aVel; attribute vec4 aLife;   // aLife: x birth (s), y life (s), z size (units), w kind (0 dust, 1 chip)
uniform float uTime; uniform float uScale;
varying float vA; varying float vKind;
void main() {
  float age = uTime - aLife.x;
  float k = age / aLife.y;
  vec3 p = position;
  float size = aLife.z;
  vKind = aLife.w;
  if (aLife.w < 0.5) {
    // dust: pushed out along the board by the base, slowed by the air, rising a little, swelling as it thins
    float drag = 7.0;
    p += vec3(aVel.x, 0.0, aVel.z) * (1.0 - exp(-drag * max(age, 0.0))) / drag;
    p.y += aVel.y * (1.0 - exp(-2.2 * max(age, 0.0))) / 2.2;
    size *= 0.55 + 1.6 * sqrt(clamp(k, 0.0, 1.0));
    vA = (age < 0.0 || k >= 1.0) ? 0.0 : smoothstep(0.0, 0.06, k) * pow(1.0 - k, 1.7);
  } else {
    // a chip: a short ballistic arc, then it lies where it fell (the board is y = 0)
    float a = max(age, 0.0);
    p += vec3(aVel.x, 0.0, aVel.z) * min(a, 0.42);
    p.y = max(0.012, p.y + aVel.y * a - 4.6 * a * a);
    vA = (age < 0.0 || k >= 1.0) ? 0.0 : 1.0 - smoothstep(0.7, 1.0, k);
  }
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = clamp(size * uScale / max(-mv.z, 0.1), 0.0, 64.0);
  gl_Position = projectionMatrix * mv;
}`,yt=`
uniform vec3 uDust; uniform vec3 uChip; uniform float uOpacity;
varying float vA; varying float vKind;
void main() {
  float r = length(gl_PointCoord - 0.5) * 2.0;
  if (vKind < 0.5) {
    float a = pow(1.0 - smoothstep(0.0, 1.0, r), 1.5) * vA * uOpacity;
    if (a < 0.003) discard;
    gl_FragColor = vec4(uDust, a);
  } else {
    float a = (1.0 - smoothstep(0.55, 0.95, r)) * vA;
    if (a < 0.01) discard;
    gl_FragColor = vec4(uChip, a);
  }
}`,se=480;function bt(e){const t=new Ye;t.name="vis-particles";const a=performance.now();let o=e.seed??49734321;const s=()=>(o=o*16807%2147483647,o/2147483647),v=200,S=new Float32Array(v*3),z=new Float32Array(v*4);for(let n=0;n<v;n++)S.set([s(),s(),s()],n*3),z.set([s(),s(),.034+.04*s()*s(),s()],n*4);const f=new ge;f.setAttribute("position",new ie(S,3)),f.setAttribute("aSeed",new ie(z,4));const c={uTime:{value:0},uCenter:{value:new J(0,2,-.6)},uHalf:{value:new J(5.6,1.6,5.2)},uScale:{value:900},uLive:{value:1},uColor:{value:new ne(1,.93,.8)},uOpacity:{value:.55}},p=new xe({vertexShader:gt,fragmentShader:xt,uniforms:c,transparent:!0,depthWrite:!1,blending:Re,toneMapped:!1}),d=new ke(f,p);d.name="vis-motes",d.frustumCulled=!1,d.renderOrder=3,t.add(d);const O=n=>{const D=Math.max(0,Math.min(v,Math.round(n)));f.setDrawRange(0,D),d.visible=D>0};O(e.motes);const A=new Float32Array(se*3),G=new Float32Array(se*3),C=new Float32Array(se*4);for(let n=0;n<se;n++)C[n*4]=-1e4;const g=new ge,P=new ie(A,3),M=new ie(G,3),j=new ie(C,4);for(const n of[P,M,j])n.setUsage(Je);g.setAttribute("position",P),g.setAttribute("aVel",M),g.setAttribute("aLife",j);const m={uTime:{value:0},uScale:{value:900},uDust:{value:new ne(.7,.64,.55)},uChip:{value:new ne(.42,.37,.31)},uOpacity:{value:.36}},u=new xe({vertexShader:wt,fragmentShader:yt,uniforms:m,transparent:!0,depthWrite:!1,toneMapped:!1}),I=new ke(g,u);I.name="vis-bursts",I.frustumCulled=!1,I.renderOrder=2,t.add(I);let T=0,$=0;const V=()=>(performance.now()-a)/1e3;function U(n,D,k,W,L,x,w,R,B,H,Q){A.set([D,k,W],n*3),G.set([L,x,w],n*3),C.set([R,B,H,Q],n*4)}return{group:t,frame(n,D,k){const W=(n-a)/1e3;c.uTime.value=W,m.uTime.value=W;const L=k/(2*Math.tan(ee.degToRad(D.fov)/2));c.uScale.value=L,m.uScale.value=L;const x=D.getWorldDirection(Mt),w=ee.radToDeg(Math.asin(Math.min(1,Math.max(-1,-x.y))));c.uLive.value=ee.smoothstep(68-w,0,16),I.visible=W<$},burst(n,D,k,W=0,L=.3){const x=V(),w=Math.round(14+12*k);for(let R=0;R<w;R++){const B=R/w*Math.PI*2+s()*.6,H=L*(.8+.3*s()),Q=(1.3+1.5*s())*(.6+.5*k);U(T,n+Math.cos(B)*H,.02+.03*s(),D+Math.sin(B)*H,Math.cos(B)*Q,.06+.2*s()*k,Math.sin(B)*Q,x+.015*s(),.6+.4*s(),(.12+.1*s())*(.65+.4*k),0),T=(T+1)%se}for(let R=0;R<W;R++){const B=s()*Math.PI*2,H=.7+1.2*s();U(T,n+Math.cos(B)*L*.6,.12+.2*s(),D+Math.sin(B)*L*.6,Math.cos(B)*H,.6+.9*s(),Math.sin(B)*H,x,.9+.5*s(),.032+.022*s(),1),T=(T+1)%se}for(const R of[P,M,j])R.needsUpdate=!0;return $=Math.max($,x+1.5),I.visible=!0,1500},setMotes:O,setColors(n){c.uColor.value.setRGB(n.mote[0],n.mote[1],n.mote[2]),c.uOpacity.value=n.moteOpacity,m.uDust.value.setRGB(n.dust[0],n.dust[1],n.dust[2]),m.uOpacity.value=n.dustOpacity,m.uChip.value.setRGB(n.dust[0]*.6,n.dust[1]*.58,n.dust[2]*.56)},dispose(){t.removeFromParent(),f.dispose(),p.dispose(),g.dispose(),u.dispose()}}}const Mt=new J,St=`
varying vec2 vUv;
void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }`,Ve=`
vec3 visLin(vec3 c) { return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(0.04045, c)); }
vec3 visEnc(vec3 c) { c = max(c, vec3(0.0)); return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c)); }`,Tt=`
uniform sampler2D tSrc; uniform vec2 uTexel; uniform float uThreshold; uniform float uKnee;
varying vec2 vUv;
${Ve}
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
}`,At=`
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
}`,Ct=`
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
varying vec2 vUv;
${Ve}
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
  if (uDof > 0.004) {
    // focus held on the board (the game's subject, wherever the frame's centre is), thin-lens blur ∝ |1/z − 1/focus|
    float coc = clamp(abs(visInvDist(vUv) - uFocus) * 13.0, 0.0, 1.0) * uDof;
    s.rgb = mix(s.rgb, texture2D(tSoft, vUv).rgb, smoothstep(0.0, 1.0, coc));
  }
  vec3 lin = visLin(s.rgb);
  if (uHasBloom > 0.5) lin += texture2D(tBloom, vUv).rgb * uBloom;
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
  g *= (1.0 - uVignette * smoothstep(0.34, 1.05, r)) * (1.0 + uPool * (1.0 - smoothstep(0.0, 0.55, r)));
  g = mix(raw, g, uMix);
  // film grain: strongest in the mids, a whisper in the blacks and the whites (triangular noise)
  float n = visHash(gl_FragCoord.xy + uSeed * 173.0) + visHash(gl_FragCoord.xy * 1.37 + uSeed * 91.0) - 1.0;
  float mid = 1.0 - abs(l - 0.5) * 1.6;
  g += n * uGrain * clamp(mid, 0.15, 1.0) * uMix;
  // 8-bit dither: the glow's long tails must not band
  g += (visHash(gl_FragCoord.yx + 0.5 + uSeed) - 0.5) / 255.0;
  g = clamp(g, 0.0, 1.0);
  // the canvas is premultiplied: colour never exceeds its alpha (a glow over a see-through edge lifts the alpha with it)
  float a = max(s.a, uHasBloom > 0.5 ? min(1.0, max(g.r, max(g.g, g.b)) * step(s.a, 0.999)) : 0.0);
  gl_FragColor = vec4(min(g, vec3(max(a, s.a))), max(a, s.a));
}`,Dt=e=>{const t=e.material;if(e.isPoints||e.isSprite||e.isLine)return!0;if(!t)return!1;const a=Array.isArray(t)?t[0]:t;return!!a&&(a.transparent||!a.depthWrite)};function kt(e,t,a,o,s={}){const v=e.render,S=(i,b)=>v.call(e,i,b),z=e.getContext(),f=e.capabilities.isWebGL2&&(e.extensions.has("EXT_color_buffer_half_float")||e.extensions.has("EXT_color_buffer_float")),c=new ge;c.setAttribute("position",new ie(new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),3));const p=new Ze(c);p.frustumCulled=!1;const d=new et;d.add(p);const O=new tt(-1,1,1,-1,0,1),A=(i,b,E=!1)=>new xe({vertexShader:St,fragmentShader:i,uniforms:b,depthTest:!1,depthWrite:!1,toneMapped:!1,blending:E?Re:st}),G={tSrc:{value:null},uTexel:{value:new Z},uThreshold:{value:o.threshold},uKnee:{value:o.knee}},C=A(Tt,G),g={tSrc:{value:null},uTexel:{value:new Z}},P=A(At,g),M={tSrc:{value:null},uTexel:{value:new Z},uWeight:{value:1}},j=A(Pe,M,!0),m=i=>new J(i[0],i[1],i[2]),u={tScene:{value:null},tBloom:{value:null},uBloom:{value:o.bloom},uHasBloom:{value:0},uLift:{value:m(o.lift)},uGamma:{value:m(o.gamma)},uGain:{value:m(o.gain)},uContrast:{value:o.contrast},uSat:{value:o.saturation},uShadowTint:{value:m(o.shadowTint)},uHighTint:{value:m(o.highTint)},uVignette:{value:o.vignette},uAspect:{value:new Z(1,1)},uGrain:{value:o.grain},uSeed:{value:0},uMix:{value:1},tSoft:{value:null},tDepth:{value:null},uDof:{value:0},uClip:{value:new Z(.1,100)},uFocus:{value:.06},uCenter:{value:new Z(.5,.5)},uPool:{value:o.pool}},I=A(Ct,u),T=A(Pe,M),$=new at({depthPacking:ot});let V=0,U=null,n=null,D=null;const k=new ne,W=new ne(1,1,1),L=new J;let x=a,w=o,R=1,B=1,H=1,Q=!1,r=null,l=[];const y=new Z;let h=0,F=0,pe="",ye=0,be=0;const te=s.timed&&e.capabilities.isWebGL2?z.getExtension("EXT_disjoint_timer_query_webgl2"):null,K=z,re=[],le=[];function He(){for(;te&&re.length&&K.getQueryParameter(re[0],K.QUERY_RESULT_AVAILABLE);){const i=re.shift();K.getParameter(te.GPU_DISJOINT_EXT)||(le.push(K.getQueryParameter(i,K.QUERY_RESULT)/1e6),le.length>60&&le.shift()),K.deleteQuery(i)}}const ue=new Set,Me=e.info;let ce=0;function me(){G.uThreshold.value=w.threshold,G.uKnee.value=w.knee,u.uBloom.value=w.bloom,u.uLift.value.copy(m(w.lift)),u.uGamma.value.copy(m(w.gamma)),u.uGain.value.copy(m(w.gain)),u.uContrast.value=w.contrast,u.uSat.value=w.saturation,u.uShadowTint.value.copy(m(w.shadowTint)),u.uHighTint.value.copy(m(w.highTint)),u.uVignette.value=w.vignette*x.vignette,u.uPool.value=w.pool,u.uGrain.value=w.grain*x.grain}me();function Ie(){e.getDrawingBufferSize(y);const i=`${y.x}x${y.y}:${x.bloom}:${x.bloomScale}:${x.halfFloat&&f}`;if(i===pe)return;pe=i,h=y.x,F=y.y,r?.dispose(),r=new it(h,F),r.minFilter=oe,r.magFilter=oe,r.generateMipmaps=!1;for(const X of l)X.dispose();l=[];let b=Math.max(1,Math.round(h*x.bloomScale)),E=Math.max(1,Math.round(F*x.bloomScale));for(let X=0;X<x.bloom&&b>=4&&E>=4;X++)l.push(new fe(b,E,{type:x.halfFloat&&f?nt:rt,minFilter:oe,magFilter:oe,depthBuffer:!1,stencilBuffer:!1,generateMipmaps:!1})),b=Math.max(1,b>>1),E=Math.max(1,E>>1);u.uAspect.value.set(h/Math.max(1,Math.min(h,F)),F/Math.max(1,Math.min(h,F))),U?.dispose(),n?.dispose(),D?.dispose(),U=n=D=null}function We(){if(U)return;const i={minFilter:oe,magFilter:oe,depthBuffer:!1,stencilBuffer:!1,generateMipmaps:!1};U=new fe(Math.max(1,h>>1),Math.max(1,F>>1),i),n=new fe(Math.max(1,h>>2),Math.max(1,F>>2),i),D=new fe(Math.max(1,h>>2),Math.max(1,F>>2),{minFilter:Ee,magFilter:Ee,depthBuffer:!0,stencilBuffer:!1,generateMipmaps:!1})}function Qe(i){const b=[];t.traverseVisible(_=>{_!==t&&Dt(_)&&b.push(_)});for(const _ of b)_.visible=!1;const E=t.overrideMaterial,X=e.shadowMap.autoUpdate,Y=t.background;e.getClearColor(k);const N=e.getClearAlpha();t.overrideMaterial=$,e.shadowMap.autoUpdate=!1,t.background=null;try{e.setRenderTarget(D),e.setClearColor(W,1),e.clear(!0,!0,!1),S(t,i),ce+=Me.render.calls}finally{t.overrideMaterial=E,e.shadowMap.autoUpdate=X,t.background=Y,e.setClearColor(k,N),e.setRenderTarget(null);for(const _ of b)_.visible=!0}const q=i;u.uClip.value.set(q.near??.1,q.far??100),L.set(0,0,0).applyMatrix4(i.matrixWorldInverse),u.uFocus.value=1/Math.max(.5,-L.z)}function ae(i,b,E){p.material=i,e.setRenderTarget(b),E&&e.clear(!0,!0,!0),S(d,O),ce++}let Se=!x.dof;function Ke(i){const b=performance.now();if(Ie(),!r||h<2||F<2)return;let E=null;te&&(He(),re.length<8&&!K.getQuery(te.TIME_ELAPSED_EXT,K.CURRENT_QUERY)&&(E=K.createQuery(),K.beginQuery(te.TIME_ELAPSED_EXT,E))),e.copyFramebufferToTexture(r);const X=e.autoClear;e.autoClear=!1;try{const Y=V>.004&&x.dof;(Y||!Se)&&(Se=!0,We(),Qe(i),g.tSrc.value=r,g.uTexel.value.set(1/h,1/F),ae(P,U,!1),g.tSrc.value=U.texture,g.uTexel.value.set(1/U.width,1/U.height),ae(P,n,!1),M.tSrc.value=n.texture,M.uTexel.value.set(1/n.width,1/n.height),M.uWeight.value=1,ae(T,U,!1)),u.uDof.value=Y?V:0,u.tSoft.value=Y?U.texture:null,u.tDepth.value=Y?D.texture:null;const N=l.length>0&&w.bloom>0;if(N){G.tSrc.value=r,G.uTexel.value.set(1/h,1/F),ae(C,l[0],!1);for(let q=1;q<l.length;q++){const _=l[q-1];g.tSrc.value=_.texture,g.uTexel.value.set(1/_.width,1/_.height),ae(P,l[q],!1)}for(let q=l.length-1;q>0;q--){const _=l[q];M.tSrc.value=_.texture,M.uTexel.value.set(1/_.width,1/_.height),M.uWeight.value=1,ae(j,l[q-1],!1)}}L.set(0,0,0).project(i),u.uCenter.value.set(ee.clamp((L.x+1)/2,.3,.7),ee.clamp((L.y+1)/2,.3,.7)),u.tScene.value=r,u.tBloom.value=N?l[0].texture:null,u.uHasBloom.value=N?1:0,Q||(u.uSeed.value=(u.uSeed.value+.6180339887)%1),u.uMix.value=R,ae(I,null,!0)}finally{e.autoClear=X,e.setRenderTarget(null),te&&E&&(K.endQuery(te.TIME_ELAPSED_EXT),re.push(E))}ye=performance.now()-b}const Te=(i,b)=>{if(i!==t||e.getRenderTarget()!==null||z.isContextLost()){S(i,b);return}const E=performance.now();for(const _ of[...ue])try{_(E)}catch(Xe){console.warn("[vis] frame hook failed",Xe)}const X=e.toneMappingExposure,Y=t.environmentIntensity;e.toneMappingExposure=X*B,t.environmentIntensity=Y*H;try{S(i,b)}finally{e.toneMappingExposure=X,t.environmentIntensity=Y}const N=Me.render,q={calls:N.calls,triangles:N.triangles,points:N.points,lines:N.lines};ce=0;try{Ke(b)}catch(_){console.warn("[vis] post failed, drawing the plain frame",_),Ce(),S(i,b);return}be=ce,Object.assign(N,q)};e.render=Te;let Ae=!1;function Ce(){if(!Ae){Ae=!0,e.render===Te&&(e.render=v),r?.dispose(),r=null;for(const i of l)i.dispose();l=[],c.dispose(),C.dispose(),P.dispose(),j.dispose(),I.dispose(),T.dispose(),$.dispose(),U?.dispose(),n?.dispose(),D?.dispose(),ue.clear()}}return{setLook(i){w=i,me()},setQuality(i){x=i,pe="",me()},setMix(i){R=Math.max(0,Math.min(1,i))},setExposure(i){B=i},setEnvScale(i){H=i},setDof(i){V=Math.max(0,Math.min(1,i))},setStill(i){Q=i},onFrame(i){return ue.add(i),()=>{ue.delete(i)}},stats:()=>{const i=[...le].sort((b,E)=>b-E);return{draws:be,levels:l.length,w:h,h:F,ms:Math.round(ye*100)/100,gpuMs:i.length?Math.round(i[i.length>>1]*1e3)/1e3:null}},dispose:Ce}}function Et(e,t){return e<0||e>.6?0:ee.degToRad(3.4)*Math.min(1.2,t)*Math.sin(2*Math.PI*5.5*e)*Math.exp(-e/.12)}const ze=.27;function _t(e){const t=[],a=new de,o=new de,s=new de,v=new de,S=new J,z=()=>e.children.filter(f=>f.isInstancedMesh===!0&&f.material.isMeshStandardMaterial===!0);return{start(f){const c=Math.hypot(f.dx,f.dz),p=c>1e-4?{dx:f.dx/c,dz:f.dz/c}:{dx:0,dz:-1};for(let d=t.length-1;d>=0;d--)Math.abs(t[d].x-f.x)<.1&&Math.abs(t[d].z-f.z)<.1&&t.splice(d,1);t.push({...f,...p,t0:performance.now()})},apply(f){for(let p=t.length-1;p>=0;p--)(f-t[p].t0)/1e3>.6&&t.splice(p,1);if(!t.length)return!1;const c=z();for(const p of t){const d=Et((f-p.t0)/1e3,p.strength);if(Math.abs(d)<1e-5)continue;const O=d>0?1:-1,A=p.x+p.dx*ze*O,G=p.z+p.dz*ze*O;S.set(p.dz,0,-p.dx).normalize(),o.makeRotationAxis(S,d),s.makeTranslation(A,0,G),v.makeTranslation(-A,0,-G);for(const C of c){let g=!1;for(let P=0;P<C.count;P++){C.getMatrixAt(P,a);const M=a.elements;Math.abs(M[12]-p.x)>.12||Math.abs(M[14]-p.z)>.12||M[13]>.03||(a.premultiply(v).premultiply(o).premultiply(s),C.setMatrixAt(P,a),g=!0)}g&&(C.instanceMatrix.needsUpdate=!0)}}return!0},clear(){t.length=0}}}const Ut={high:{tier:"high",bloom:5,bloomScale:.25,grain:1,vignette:1,motes:110,puffs:!0,dof:!0,halfFloat:!0,budgetMs:22},mid:{tier:"mid",bloom:4,bloomScale:.25,grain:.8,vignette:1,motes:60,puffs:!0,dof:!0,halfFloat:!0,budgetMs:31},low:{tier:"low",bloom:0,bloomScale:.25,grain:0,vignette:.85,motes:0,puffs:!0,dof:!1,halfFloat:!1,budgetMs:1/0}};function we(e){return{...Ut[e]}}const Lt=/Mali-G5|Mali-T|Mali-4|Adreno \(TM\) [345]\d\d|Adreno [345]\d\d|Apple A1[0-2] GPU|PowerVR|SwiftShader|llvmpipe|Software/i,Ft=/Apple GPU|Apple A1[3-9]|Apple M\d|Adreno \(TM\) [6-9]\d\d|Adreno [6-9]\d\d|Mali-G7\d|Mali-G6[1-9]\d|Mali-G[7-9]\d\d|Immortalis|Xclipse/i;function Be(e){return e.override?e.override:e.gpu&&Lt.test(e.gpu)?"low":e.boardTier==="rich"?"high":(e.gpu&&Ft.test(e.gpu),"mid")}function Pt(e){return e==="high"?"mid":"low"}class zt{constructor(t,a=48,o=120,s=3e3,v=4e3){this.tier=t,this.size=a,this.gapMs=o,this.coolMs=s,this.graceMs=v}last=-1;win=[];hold=0;start=-1;get current(){return this.tier}frame(t){if(this.start<0&&(this.start=t),t-this.start<this.graceMs)return this.last=t,null;const a=this.last<0?-1:t-this.last;if(this.last=t,a<0||a>this.gapMs)return this.win.length=0,null;if(this.win.push(a),this.win.length>this.size&&this.win.shift(),this.win.length<this.size||t<this.hold||this.tier==="low")return null;const o=[...this.win].sort((v,S)=>v-S);return o[o.length>>1]<=we(this.tier).budgetMs?null:(this.tier=Pt(this.tier),this.win.length=0,this.hold=t+this.coolMs,this.tier)}}function Bt(e){try{const t=e.getContext(),a=t.getExtension("WEBGL_debug_renderer_info");return a?String(t.getParameter(a.UNMASKED_RENDERER_WEBGL)):void 0}catch{return}}function Gt(){const e={};try{const t=new URLSearchParams(location.search).get("vistune");for(const a of(t??"").split(",")){const[o,s]=a.split(":");o&&s!==void 0&&Number.isFinite(Number(s))&&(e[o]=Number(s))}}catch{}return e}function Ge(e,t){const a={};for(const o of t)e[o]!==void 0&&(a[o]=e[o]);return a}function Wt(e,t={}){const a=e,o=a.q3Debug?.(),s=a.q3EnvHost?.();if(!o||!s||!o.renderer||!o.scene||!o.rig||!o.mats)return null;const{renderer:v,scene:S,camera:z}=o,f=typeof location<"u"&&/[?&](qa|q3debug)\b/.test(location.search),c=f?Gt():{},p={...qe,...c.curve!==void 0?{curve:c.curve?"agx":"neutral"}:{},...c.agxPow!==void 0?{power:c.agxPow}:{},...c.agxSat!==void 0?{sat:c.agxSat}:{}},d={...Oe,...Ge(c,["key","sky","rim","shadow","radius","env","warm"])},O=dt({renderer:v,rig:o.rig,mats:o.mats,tone:p,mood:d}),A=Bt(v),G=ut();let C=Be({boardTier:s.tier(),gpu:A,override:G}),g=we(C);const P=new zt(C);let M=t.room?.()??"classic";const j=r=>({...r,...Ge(c,["exposure","bloom","threshold","knee","contrast","saturation","vignette","pool","grain"]),...c.lift!==void 0?{lift:[c.lift,c.lift,c.lift*1.2]}:{},...c.gamma!==void 0?{gamma:[c.gamma,c.gamma,c.gamma]}:{}});let m=j(Le(M));const u=bt({motes:g.motes});S.add(u.group);const I=()=>u.setColors({mote:m.motes.color,moteOpacity:m.motes.opacity,dust:m.dust.color,dustOpacity:m.dust.opacity});I();const T=kt(v,S,g,m,{timed:f});T.setExposure(m.exposure),T.setEnvScale(d.env);const $=_t(S),V={fwd:new J,pos:new J,t:-1},U=new J;let n=0;function D(r){U.set(0,0,-1).applyQuaternion(z.quaternion);const l=V.t<0?-1:(r-V.t)/1e3;if(l>0&&l<.25){const y=ee.radToDeg(U.angleTo(V.fwd))/l,h=z.position.distanceTo(V.pos)/l,F=g.dof&&!s.reducedMotion()?ee.smoothstep(Math.max(y/14,h/8),.3,1):0;n+=(F-n)*(1-Math.exp(-l/(F>n?.1:.3)))}else l>=.25&&(n=0);V.fwd.copy(U),V.pos.copy(z.position),V.t=r,n<.01&&(n=0),T.setDof(n),n>0&&s.keepAwake(350)}const k=[],W=new Z;function L(r){r!==C&&(C=r,g=we(r),e.dataset.vis=r,T.setQuality(g),u.setMotes(x?0:g.motes),s.invalidate())}let x=!1;const w=T.onFrame(r=>{const l=s.reducedMotion();l!==x&&(x=l,u.setMotes(l?0:g.motes),T.setStill(l));const y=t.room?.()??M;for(y!==M&&(M=y,m=j(Le(y)),T.setLook(m),T.setExposure(m.exposure),I());k.length&&k[0].due<=r;)B(k.shift().i);if($.apply(r),D(r),v.getDrawingBufferSize(W),u.frame(r,z,W.y),!G){const h=P.frame(r);h&&L(h)}}),R=s.onTier(r=>{const l=Be({boardTier:r,gpu:A,override:G}),y={high:2,mid:1,low:0};L(y[l]<y[P.current]?l:P.current)});function B(r){if(!s.alive())return;const l=he(r.square);if(r.kind==="capture")u.burst(l.x,l.z,r.strength,5,.36);else{u.burst(l.x,l.z,r.strength,0,r.piece==="p"?.24:.3);const y=r.from?he(r.from):null;$.start({x:l.x,z:l.z,dx:y?l.x-y.x:0,dz:y?l.z-y.z:-1,strength:r.strength})}s.keepAwake(1500)}const H={move(r,l){if(!g.puffs||s.reducedMotion())return;const y=performance.now();for(const h of vt(r,l))k.push({due:y+h.at,i:h});k.sort((h,F)=>h.due-F.due),s.keepAwake(Math.max(...k.map(h=>h.due-y),0)+200)},get tier(){return C},dispose(){w(),R(),T.dispose(),u.dispose(),O.dispose(),k.length=0,$.clear(),delete e.dataset.vis,f&&window.qcVis===Q&&delete window.qcVis}},Q=f?{tier:()=>C,quality:()=>({...g}),look:()=>({...m}),room:()=>M,gpu:A,stats:()=>({...T.stats(),dof:Math.round(n*100)/100}),setTier:L,setMix:r=>{T.setMix(r),s.invalidate()},burst:(r,l=1,y=0)=>{const h=he(r);u.burst(h.x,h.z,l,y),s.keepAwake(1500)},move:(r,l=!1)=>H.move(r,l)}:null;return Q&&(window.qcVis=Q),e.dataset.vis=C,s.invalidate(),H}export{Wt as attachVis};
