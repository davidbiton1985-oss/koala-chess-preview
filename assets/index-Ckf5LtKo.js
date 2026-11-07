import{AgXToneMapping as Re,ShaderChunk as he,Color as Z,CanvasTexture as Ue,SRGBColorSpace as Le,Group as Fe,BufferGeometry as ge,BufferAttribute as ae,Vector3 as V,ShaderMaterial as ve,AdditiveBlending as qe,Points as ye,DynamicDrawUsage as Be,MathUtils as N,Matrix4 as le,PerspectiveCamera as Ge,WebGLRenderTarget as Ke,HalfFloatType as We,LinearSRGBColorSpace as De,PlaneGeometry as Ee,Mesh as ce,CylinderGeometry as we,DoubleSide as Me,NormalBlending as Ve,Vector2 as Ne}from"./three.module-D5rf0S9N.js";import{ci as re}from"./index-CSImASqk.js";import{a as Ie}from"./flag-C_07jK1B.js";import{l as be}from"./grade-BSuY6yDo.js";import{g as He,c as je,a as Qe}from"./feel-DUwpubzA.js";import{v as xe,a as ke,c as Xe,G as $e,Q as Ye}from"./tier-L4U8tzMV.js";const Se={power:1.18,sat:1.1};let Ae=!1;function Je(o=Se.power,n=Se.sat){if(Ae)return!0;const t=he.tonemapping_pars_fragment,r="vec3 AgXToneMapping( vec3 color ) {",e="// v = agxLook(v, look);";if(!t.includes(r)||!t.includes(e))return!1;const f=`
vec3 visAgxLook( vec3 v ) {
	const vec3 lw = vec3( 0.2126, 0.7152, 0.0722 );
	float luma = dot( v, lw );
	v = pow( max( v, vec3( 0.0 ) ), vec3( ${o.toFixed(3)} ) );
	return luma + ${n.toFixed(3)} * ( v - luma );
}
`;return he.tonemapping_pars_fragment=t.replace(r,f+r).replace(e,"color = visAgxLook( color );"),Ae=!0,!0}const ue={key:new Z(16773080),sky:new Z(16180424),rim:new Z(15915702)},Oe={key:1.3,sky:.62,rim:.9,shadow:-.1,radius:1.25,env:.78,warm:-.035,oneSun:.7};function Ze(){if(typeof document>"u")return null;const o=document.createElement("canvas");o.width=o.height=128;const n=o.getContext("2d");if(!n)return null;const t=n.createRadialGradient(64,64,0,64,64,64);t.addColorStop(0,"rgba(10,7,4,1)"),t.addColorStop(.6,"rgba(10,7,4,.96)"),t.addColorStop(.68,"rgba(10,7,4,.74)"),t.addColorStop(.76,"rgba(10,7,4,.40)"),t.addColorStop(.86,"rgba(10,7,4,.14)"),t.addColorStop(.95,"rgba(10,7,4,.03)"),t.addColorStop(1,"rgba(10,7,4,0)"),n.fillStyle=t,n.fillRect(0,0,128,128);const r=new Ue(o);return r.colorSpace=Le,r}const Pe={curve:"neutral"};function et(o){const{renderer:n,rig:t,mats:r}=o,e=o.mood??Oe,f=o.tone??Pe,h=n.toneMapping;f.curve==="agx"&&(Je(f.power,f.sat),n.toneMapping=Re);const R=t.apply,m=t.setQuality,u=()=>{t.key.intensity*=e.key,t.key.color.lerp(ue.key,e.oneSun),t.sky.color.lerp(ue.sky,e.oneSun),t.sky.groundColor.lerp(ue.sky,e.oneSun*.3),t.rim.color.lerp(ue.rim,e.oneSun),t.key.color.multiply(new Z(1,1-e.warm*.45,1-e.warm)),t.sky.intensity*=e.sky,t.rim.intensity*=e.rim,t.key.shadow.intensity=Math.min(1,t.key.shadow.intensity+e.shadow)},l=t.key.shadow.radius;t.apply=function(O){R.call(t,O),u()},t.setQuality=function(O){m.call(t,O),t.key.shadow.radius*=e.radius},u(),t.key.shadow.radius=l*e.radius;const p={sq:r.squares.roughness,fr:r.frame.roughness,ri:r.rim.roughness,blob:r.blob.map};r.squares.roughness=Math.max(p.sq,.6),r.frame.roughness=Math.max(p.fr,.64),r.rim.roughness=Math.max(p.ri,.64);const b=Ze();return b&&p.blob&&(r.blob.map=b),{refresh:u,dispose(){t.apply=R,t.setQuality=m,t.key.shadow.radius=l,n.toneMapping=h,r.squares.roughness=p.sq,r.frame.roughness=p.fr,r.rim.roughness=p.ri,b&&(r.blob.map=p.blob,b.dispose())}}}const Te={p:.55,n:.9,b:.7,r:.85,q:.9,k:.9};function tt(o,n=!1){const t=He(o,n),r=[{kind:"land",at:t,square:o.to,from:o.from,strength:Te[o.piece.type]*(o.flags.promotion?1.2:o.flags.mate?1.5:1),piece:o.piece.type}],e=o.capturedSquare??(o.captured||o.flags.capture?o.to:null);if(e&&o.captured){const f=je({...o,captured:o.captured},n),h=o.captured.color==="b";r.push({kind:"contact",at:f.contact,square:e,strength:f.strength,piece:o.captured.type,dark:h}),r.push({kind:"capture",at:f.strike,square:e,from:o.from,strength:1.1+.3*(o.captured.type==="p"?0:1),piece:o.captured.type,dark:h})}if(o.rookMove){const f=Qe(t);r.push({kind:"rook",at:f.delay+f.dur,square:o.rookMove.to,from:o.rookMove.from,strength:Te.r*.8,piece:"r"})}return r.sort((f,h)=>f.at-h.at)}const ot=`
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
}`,at=`
uniform vec3 uColor; uniform float uOpacity;
varying float vA;
void main() {
  float r = length(gl_PointCoord - 0.5) * 2.0;
  float a = 1.0 - smoothstep(0.0, 1.0, r);
  a *= a * vA * uOpacity;
  if (a < 0.002) discard;
  gl_FragColor = vec4(uColor, a);
}`,nt=`
attribute vec3 aVel; attribute vec4 aLife;   // aLife: x birth (s), y life (s), z size (units), w kind
attribute vec2 aSpin;                         // x: spin speed (turns/s, signed), y: phase / colour seed (0..1)
uniform float uTime; uniform float uScale;
varying float vA; varying float vKind; varying float vAng; varying float vSeed;
void main() {
  float age = uTime - aLife.x;
  float k = age / aLife.y;
  vec3 p = position;
  float size = aLife.z;
  float kind = aLife.w;
  vKind = kind; vSeed = aSpin.y;
  float a = max(age, 0.0);
  vAng = aSpin.y * 6.2832 + aSpin.x * 6.2832 * a;
  if (kind < 0.5) {
    // dust: pushed out along the board by the base, slowed by the air, rising a little, swelling as it thins
    float drag = 7.0;
    p += vec3(aVel.x, 0.0, aVel.z) * (1.0 - exp(-drag * a)) / drag;
    p.y += aVel.y * (1.0 - exp(-2.2 * a)) / 2.2;
    size *= 0.55 + 1.6 * sqrt(clamp(k, 0.0, 1.0));
    vA = (age < 0.0 || k >= 1.0) ? 0.0 : smoothstep(0.0, 0.06, k) * pow(1.0 - k, 1.7);
  } else if (kind < 2.5) {
    // a shard of the fallen man's stone: thrown up and out, tumbling, then lying where it fell (the board is y = 0)
    float t = min(a, 0.55);
    p += vec3(aVel.x, 0.0, aVel.z) * t * (1.0 - 0.45 * t);
    float y = p.y + aVel.y * a - 4.9 * a * a;
    if (y < 0.015) { y = 0.015; vAng = aSpin.y * 6.2832 + aSpin.x * 6.2832 * 0.35; }   // landed: it stops turning
    p.y = y;
    vA = (age < 0.0 || k >= 1.0) ? 0.0 : 1.0 - smoothstep(0.72, 1.0, k);
  } else if (kind > 3.5) {
    // run-1101: a flake of matte gold leaf (the mate's bloom): thrown up in a fountain, then it flutters down — slower
    // than a leaf, swaying wider, turning over and over (its colour follows the turn: matte, never a highlight)
    float drag = 2.1;
    vec3 v = aVel * (1.0 - exp(-drag * a)) / drag;
    p += v;
    p.y -= 0.3 * a * a / (1.0 + 1.3 * a);
    p.x += 0.24 * sin(a * (2.6 + aSpin.y * 2.1) + aSpin.y * 11.0) * min(a, 1.0);
    p.z += 0.2 * cos(a * (2.3 + aSpin.y * 1.6) + aSpin.y * 5.0) * min(a, 1.0);
    p.y = max(p.y, 0.02);
    vA = (age < 0.0 || k >= 1.0) ? 0.0 : smoothstep(0.0, 0.04, k) * (1.0 - smoothstep(0.7, 1.0, k));
  } else {
    // a leaf: a burst up and out, then the air takes it — a slow fall, a sway, a tumble
    float drag = 2.6;
    vec3 v = aVel * (1.0 - exp(-drag * a)) / drag;
    p += v;
    p.y -= 0.42 * a * a / (1.0 + 0.9 * a);                         // terminal velocity: leaves fall slowly
    p.x += 0.18 * sin(a * (2.2 + aSpin.y * 1.7) + aSpin.y * 9.0) * min(a, 1.0);
    p.z += 0.14 * cos(a * (1.9 + aSpin.y * 1.3) + aSpin.y * 7.0) * min(a, 1.0);
    p.y = max(p.y, 0.02);
    vA = (age < 0.0 || k >= 1.0) ? 0.0 : smoothstep(0.0, 0.05, k) * (1.0 - smoothstep(0.75, 1.0, k));
  }
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = clamp(size * uScale / max(-mv.z, 0.1), 0.0, 72.0);
  gl_Position = projectionMatrix * mv;
}`,st=`
uniform vec3 uDust; uniform vec3 uChip; uniform vec3 uChipDark; uniform float uOpacity;
varying float vA; varying float vKind; varying float vAng; varying float vSeed;
vec2 visRot(vec2 q, float a) { float c = cos(a), s = sin(a); return vec2(c * q.x - s * q.y, s * q.x + c * q.y); }
void main() {
  vec2 c = gl_PointCoord - 0.5;
  if (vKind < 0.5) {
    float r = length(c) * 2.0;
    float a = pow(1.0 - smoothstep(0.0, 1.0, r), 1.5) * vA * uOpacity;
    if (a < 0.003) discard;
    gl_FragColor = vec4(uDust, a);
  } else if (vKind < 2.5) {
    // an irregular facet (three half-planes), lit by how it is turned: matte stone, never a highlight
    vec2 q = visRot(c, vAng);
    float e1 = dot(q, vec2(0.0, -1.0)) - 0.30;
    float e2 = dot(q, normalize(vec2(0.87, 0.5 + 0.3 * vSeed))) - 0.27;
    float e3 = dot(q, normalize(vec2(-0.87, 0.45))) - 0.25;
    float d = max(e1, max(e2, e3));
    if (d > 0.0) discard;
    float lit = 0.62 + 0.38 * (0.5 + 0.5 * cos(vAng * 1.7 + vSeed * 4.0));
    vec3 col = (vKind < 1.5 ? uChip : uChipDark) * lit * mix(0.86, 1.0, smoothstep(-0.05, -0.22, d));
    gl_FragColor = vec4(col, vA);
  } else if (vKind > 3.5) {
    // a gold flake: a small rounded square turning over (it narrows as it turns edge-on), matte gold, lit by its turn
    float turn = cos(vAng * 1.9 + vSeed * 6.0);
    vec2 q = visRot(c, vAng) * vec2(1.0, 1.0 / max(0.18, abs(turn)));
    vec2 d2 = abs(q) - vec2(0.26);
    float d = length(max(d2, 0.0)) + min(max(d2.x, d2.y), 0.0) - 0.08;
    if (d > 0.0) discard;
    vec3 gold = mix(vec3(0.70, 0.55, 0.30), vec3(0.86, 0.73, 0.48), vSeed);   // matte leaf gold, never a yellow highlight
    vec3 col = gold * (0.6 + 0.36 * abs(turn));
    gl_FragColor = vec4(col, vA * smoothstep(0.0, -0.04, d));
  } else {
    // a leaf: a pointed ellipse with a midrib, eucalyptus green to gold
    vec2 q = visRot(c, vAng) * vec2(2.25, 1.0);
    float r = length(q);
    float body = 1.0 - smoothstep(0.40, 0.46, r + 0.12 * abs(q.y) * 4.0 * smoothstep(0.1, 0.5, abs(q.y)));
    if (body < 0.02) discard;
    float rib = 1.0 - smoothstep(0.0, 0.035, abs(q.x));
    vec3 green = mix(vec3(0.36, 0.52, 0.30), vec3(0.55, 0.62, 0.34), vSeed);
    vec3 gold = vec3(0.86, 0.68, 0.32);
    vec3 col = mix(green, gold, smoothstep(0.62, 0.95, vSeed)) * (0.85 + 0.15 * cos(vAng));
    col = mix(col, col * 1.25, rib * 0.5);
    gl_FragColor = vec4(col, body * vA);
  }
}`,J=640;function it(o){const n=new Fe;n.name="vis-particles";const t=performance.now();let r=o.seed??49734321;const e=()=>(r=r*16807%2147483647,r/2147483647),f=200,h=new Float32Array(f*3),R=new Float32Array(f*4);for(let c=0;c<f;c++)h.set([e(),e(),e()],c*3),R.set([e(),e(),.034+.04*e()*e(),e()],c*4);const m=new ge;m.setAttribute("position",new ae(h,3)),m.setAttribute("aSeed",new ae(R,4));const u={uTime:{value:0},uCenter:{value:new V(0,2,-.6)},uHalf:{value:new V(5.6,1.6,5.2)},uScale:{value:900},uLive:{value:1},uColor:{value:new Z(1,.93,.8)},uOpacity:{value:.55}},l=new ve({vertexShader:ot,fragmentShader:at,uniforms:u,transparent:!0,depthWrite:!1,blending:qe,toneMapped:!1}),p=new ye(m,l);p.name="vis-motes",p.frustumCulled=!1,p.renderOrder=3,n.add(p);const b=c=>{const z=Math.max(0,Math.min(f,Math.round(c)));m.setDrawRange(0,z),p.visible=z>0};b(o.motes);const O=new Float32Array(J*3),U=new Float32Array(J*3),F=new Float32Array(J*4),L=new Float32Array(J*2);for(let c=0;c<J;c++)F[c*4]=-1e4;const M=new ge,T=new ae(O,3),W=new ae(U,3),G=new ae(F,4),g=new ae(L,2);for(const c of[T,W,G,g])c.setUsage(Be);M.setAttribute("position",T),M.setAttribute("aVel",W),M.setAttribute("aLife",G),M.setAttribute("aSpin",g);const i={uTime:{value:0},uScale:{value:900},uDust:{value:new Z(.7,.64,.55)},uChip:{value:new Z(.78,.7,.56)},uChipDark:{value:new Z(.2,.16,.13)},uOpacity:{value:.36}},y=new ve({vertexShader:nt,fragmentShader:st,uniforms:i,transparent:!0,depthWrite:!1,toneMapped:!1}),v=new ye(M,y);v.name="vis-bursts",v.frustumCulled=!1,v.renderOrder=2,n.add(v);let d=0,$=0;const j=()=>(performance.now()-t)/1e3;function ee(c,z,S,_,x,q,k,E,P,B,I,D=0,oe=e()){O.set([z,S,_],c*3),U.set([x,q,k],c*3),F.set([E,P,B,I],c*4),L.set([D,oe],c*2)}const Q=(c,z)=>{for(const S of[T,W,G,g])S.needsUpdate=!0;$=Math.max($,c+z),v.visible=!0};return{group:n,frame(c,z,S){const _=(c-t)/1e3;u.uTime.value=_,i.uTime.value=_;const x=S/(2*Math.tan(N.degToRad(z.fov)/2));u.uScale.value=x,i.uScale.value=x;const q=z.getWorldDirection(rt),k=N.radToDeg(Math.asin(Math.min(1,Math.max(-1,-q.y))));u.uLive.value=N.smoothstep(68-k,0,16),v.visible=_<$},burst(c,z,S,_=0,x=.3,q=!1){const k=j(),E=Math.round(14+12*S);for(let P=0;P<E;P++){const B=P/E*Math.PI*2+e()*.6,I=x*(.8+.3*e()),D=(1.3+1.5*e())*(.6+.5*S);ee(d,c+Math.cos(B)*I,.02+.03*e(),z+Math.sin(B)*I,Math.cos(B)*D,.06+.2*e()*S,Math.sin(B)*D,k+.015*e(),.6+.4*e(),(.12+.1*e())*(.65+.4*S),0),d=(d+1)%J}for(let P=0;P<_;P++){const B=e()*Math.PI*2,I=.8+1.6*e();ee(d,c+Math.cos(B)*x*.5,.18+.32*e(),z+Math.sin(B)*x*.5,Math.cos(B)*I,.9+1.3*e(),Math.sin(B)*I,k+.01*e(),1.3+.6*e(),.05+.07*e()*e(),q?2:1,(e()<.5?-1:1)*(1.2+2.4*e())),d=(d+1)%J}return Q(k,2),2e3},leaves(c,z,S,_=1.6){const x=j();for(let q=0;q<S;q++){const k=e()*Math.PI*2,E=.6+1.6*e();ee(d,c+Math.cos(k)*.2*_,.9+.8*e(),z+Math.sin(k)*.2*_,Math.cos(k)*E*_,1.8+2*e(),Math.sin(k)*E*_,x+.3*e(),3.4+1.8*e(),.22+.14*e(),3,(e()<.5?-1:1)*(.3+.9*e())),d=(d+1)%J}Q(x,5.2)},bloom(c,z,S){const _=j();for(let x=0;x<S;x++){const q=e()*Math.PI*2,k=.4+1.7*e()*e();ee(d,c+Math.cos(q)*.15,.25+.4*e(),z+Math.sin(q)*.15,Math.cos(q)*k,3.2+2.6*e(),Math.sin(q)*k,_+.45*e()*e(),3.6+2*e(),.11+.08*e(),4,(e()<.5?-1:1)*(.6+1.4*e())),d=(d+1)%J}Q(_,6.2)},setMotes:b,setColors(c){u.uColor.value.setRGB(c.mote[0],c.mote[1],c.mote[2]),u.uOpacity.value=c.moteOpacity,i.uDust.value.setRGB(c.dust[0],c.dust[1],c.dust[2]),i.uOpacity.value=c.dustOpacity,i.uChip.value.setRGB(c.dust[0]*.86,c.dust[1]*.8,c.dust[2]*.7)},dispose(){n.removeFromParent(),m.dispose(),l.dispose(),M.dispose(),y.dispose()}}}const rt=new V;function lt(o,n){return o<0||o>.6?0:N.degToRad(3.4)*Math.min(1.2,n)*Math.sin(2*Math.PI*5.5*o)*Math.exp(-o/.12)}const Ce=.27;function ct(o){const n=[],t=new le,r=new le,e=new le,f=new le,h=new V,R=()=>o.children.filter(m=>m.isInstancedMesh===!0&&m.material.isMeshStandardMaterial===!0);return{start(m){const u=Math.hypot(m.dx,m.dz),l=u>1e-4?{dx:m.dx/u,dz:m.dz/u}:{dx:0,dz:-1};for(let p=n.length-1;p>=0;p--)Math.abs(n[p].x-m.x)<.1&&Math.abs(n[p].z-m.z)<.1&&n.splice(p,1);n.push({...m,...l,t0:performance.now()})},apply(m){for(let l=n.length-1;l>=0;l--)(m-n[l].t0)/1e3>.6&&n.splice(l,1);if(!n.length)return!1;const u=R();for(const l of n){const p=lt((m-l.t0)/1e3,l.strength);if(Math.abs(p)<1e-5)continue;const b=p>0?1:-1,O=l.x+l.dx*Ce*b,U=l.z+l.dz*Ce*b;h.set(l.dz,0,-l.dx).normalize(),r.makeRotationAxis(h,p),e.makeTranslation(O,0,U),f.makeTranslation(-O,0,-U);for(const F of u){let L=!1;for(let M=0;M<F.count;M++){F.getMatrixAt(M,t);const T=t.elements;Math.abs(T[12]-l.x)>.12||Math.abs(T[14]-l.z)>.12||T[13]>.03||(t.premultiply(f).premultiply(r).premultiply(e),F.setMatrixAt(M,t),L=!0)}L&&(F.instanceMatrix.needsUpdate=!0)}}return!0},clear(){n.length=0}}}const ut=320,dt=140,ze=(o,n,t)=>o<n?Math.min(n,o+t):Math.max(n,o-t),de=4.25,ft=450,pt=600,mt=1.4,vt=1.6;function ht(o,n,t,r){const e=new Ge(16,3,.5,600);let f=null,h=0,R=-1,m=0,u=null,l=null,p=null,b=null;const O=new V,U=new V,F=new V,L=[new V,new V];function M(){(!l||!l.parent)&&(l=o.getObjectByName("environment")??null),(!u||!u.parent||!u.userData.visWindow)&&(u=l?.getObjectByName("room-koala")??null),(!p||!p.parent)&&(p=l?.getObjectByName("koala-chair")??null),(!b||!b.parent)&&(b=l?.getObjectByName("room-tabletop")??null)}const T=()=>u?.userData?.visWindow??null;function W(i){const y=t.orientation()==="w"?-de:de;return L[0].set(-de,.09,y).project(i),L[1].set(de,.09,y).project(i),(Math.max(L[0].y,L[1].y)+1)/2}function G(i,y){const v=y>i*1.15,d=T();return v&&!!d&&!d.off&&(!!t.isFlat?.()||!!d.flat)}const g=()=>{const i=Number(r?.dataset.visCoverTop??0);return Number.isFinite(i)?N.clamp(i,0,.6):0};return{frame(i,y,v,d,$){M();const j=R<0?0:Math.min(100,i-R);R=i;const Q=G(v,d)?1:0;h=t.reducedMotion()?Q:ze(h,Q,j/(Q>h?ut:dt)),h!==Q&&t.keepAwake(120);const c=T();if(c&&(c.live=h>.001),h<=.001||!c||!u)return null;const z=c.focus?1:0;m=t.reducedMotion()?0:ze(m,z,j/(z>m?ft:pt)),m!==z&&!t.reducedMotion()&&t.keepAwake(120);const S=m*m*(3-2*m),_=W(y)+6/d,x=1-g();if(x-_<.07)return null;const q=Math.max(16,Math.round((x-_)*d*.8)),k=Math.max(16,Math.round(v*.8));(!f||f.width!==k||f.height!==q)&&(f?.dispose(),f=new Ke(k,q,{type:We,depthBuffer:!0,samples:0}),f.texture.colorSpace=De,f.isXRRenderTarget=!0),U.copy(c.eye),u.parent?.localToWorld(U),c.place?.(),u.updateMatrixWorld(),u.geometry.boundingBox||u.geometry.computeBoundingBox();const E=(u.geometry.boundingBox?.max.y??1)*u.scale.y;u.getWorldPosition(F),F.y+=E*(.62+.08*S);const P=U.distanceTo(F);e.position.copy(U),e.up.set(0,1,0),e.lookAt(F),e.aspect=k/q;const B=(x-_)*d/Math.max(1,n.getPixelRatio()),D=Math.min(.81,170/Math.max(1,B))*(1+((B<140?vt:mt)-1)*S);e.fov=N.clamp(N.radToDeg(2*Math.atan(E*.5/D/Math.max(.5,P))),8-4*S,60),typeof location<"u"&&location.search.includes("q3debug")&&(c.qa={fov:+e.fov.toFixed(2),fill:+D.toFixed(3),fk:+m.toFixed(2),stripCss:Math.round(B)}),e.updateProjectionMatrix(),e.updateMatrixWorld();const oe=[];for(const H of o.children)H.visible&&H!==l&&!H.isLight&&(H.visible=!1,oe.push(H));const ne=u.visible,Y=p?.visible??!1,X=b?.visible??!1,fe=n.shadowMap.autoUpdate,pe=n.getRenderTarget();u.visible=!0,c.pass=!0,n.shadowMap.autoUpdate=!1,p&&p.children.length&&(p.visible=!0),b&&(b.visible=!0);try{n.setRenderTarget(f),n.clear(!0,!0,!1),$(o,e)}finally{c.pass=!1,u.visible=ne,n.shadowMap.autoUpdate=fe,p&&(p.visible=Y),b&&(b.visible=X),n.setRenderTarget(pe);for(const H of oe)H.visible=!0}u.getWorldPosition(O).project(e);const me=N.clamp((O.y+1)/2,0,1)*(x-_),se=Math.max(4/d,Math.min(.05,(x-_)*.2,me*.9));return{tex:f.texture,y0:_,y1:x,fade:se,alpha:h*h*(3-2*h)}},amount:()=>h,dispose(){const i=T();i&&(i.live=!1,i.pass=!1),f?.dispose(),f=null}}}const gt="varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",yt=`
uniform vec3 uColor; uniform float uK; uniform float uR; uniform float uW;
varying vec2 vUv;
void main() {
  float r = length(vUv - 0.5) * 2.0;
  float a = exp(-pow((r - uR) / uW, 2.0)) * uK;
  if (a < 0.003) discard;
  gl_FragColor = vec4(uColor, a);
}`,wt=`
uniform vec3 uColor; uniform float uK;
varying vec2 vUv;
void main() {
  float r = length(vUv - 0.5) * 2.0;
  float a = pow(max(0.0, 1.0 - r), 2.2) * uK;
  if (a < 0.003) discard;
  gl_FragColor = vec4(uColor, a);
}`,Mt=`
uniform vec3 uColor; uniform float uK;
varying vec2 vUv;
void main() {
  float h = vUv.y;
  float a = (1.0 - smoothstep(0.0, 1.0, h)) * (0.35 + 0.65 * (1.0 - h)) * uK;
  if (a < 0.003) discard;
  gl_FragColor = vec4(uColor * (0.7 + 0.6 * (1.0 - h)), a);
}`,bt=`
uniform vec3 uColor; uniform float uK; uniform float uT;
varying vec2 vUv;
void main() {
  float h = vUv.y;                                                   // 0 at the board, 1 at the source
  float streak = 0.5 + 0.5 * sin(vUv.x * 6.2832 * 7.0 + uT * 0.35) * sin(vUv.x * 6.2832 * 3.0 - uT * 0.21 + 1.3);
  float a = uK * (0.35 + 0.65 * streak) * smoothstep(0.0, 0.18, h) * (1.0 - smoothstep(0.45, 1.0, h));
  if (a < 0.002) discard;
  gl_FragColor = vec4(uColor, a);
}`;function xt(){const o=new Fe;o.name="vis-moments";const n=(g,i,y,v={})=>new ve({vertexShader:gt,fragmentShader:g,transparent:!0,depthWrite:!1,toneMapped:!1,blending:y?qe:Ve,uniforms:{uColor:{value:new Z(i)},uK:{value:0},...v}}),t=new Ee(1,1).rotateX(-Math.PI/2),r=n(yt,14704698,!1,{uR:{value:.5},uW:{value:.12}}),e=new ce(t,r);e.renderOrder=2,e.visible=!1,e.scale.setScalar(1.6);const f=n(wt,16769712,!0),h=new ce(t,f);h.renderOrder=1,h.visible=!1,h.scale.setScalar(1.9);const R=new we(.34,.42,3.2,32,1,!0).translate(0,1.6,0),m=n(Mt,16771e3,!0);m.side=Me;const u=new ce(R,m);u.renderOrder=3,u.visible=!1;const l=new we(.42,1.55,11,48,1,!0).translate(0,5.5,0),p=n(bt,16771268,!0,{uT:{value:0}});p.side=Me;const b=new ce(l,p);b.renderOrder=4,b.visible=!1,o.add(h,e,u,b);let O=0,U=0,F=null,L=null,M=null,T=-1e9,W=-1;const G=(g,i,y)=>{const v=re(i);g.position.set(v.x,y,v.z)};return{group:o,frame(g){const i=W<0?16:Math.min(80,g-W);W=g,O+=(U-O)*(1-Math.exp(-i/90)),f.uniforms.uK.value=O*.16,h.visible=O>.01;let y=Math.abs(U-O)>.01;if(F){const v=(g-F.t0)/900;if(v<0)e.visible=!1;else if(v>=1)F=null,e.visible=!1;else{const d=v*2%1;r.uniforms.uR.value=.25+.55*(1-Math.pow(1-d,3)),r.uniforms.uK.value=.75*(1-d),e.visible=!0}y=!0}if(L){const v=(g-L.t0)/1100;v<0?u.visible=!1:v>=1?(L=null,u.visible=!1):(m.uniforms.uK.value=Math.sin(Math.PI*Math.min(1,v*1.4))*(1-v*.4)*.55,u.scale.set(1-.25*v,.4+.8*Math.min(1,v*2),1-.25*v),u.visible=!0),y=!0}if(M){const v=(g-(M.t0+M.ms*.6))/3e3,d=v<0||v>1?0:Math.sin(Math.PI*Math.min(1,v*2.5))*(1-v*.6);p.uniforms.uK.value=d*.13,p.uniforms.uT.value=g/1e3,b.visible=d>.005}else b.visible=!1;return M&&g>M.t0+M.ms+3500&&(M=null),y||!!M||g-T<1400},pickUp(g){U=g?1:0,g&&G(h,g,.006)},check(g,i){G(e,g,.012),F={t0:i},T=i},promotion(g,i){G(u,g,0),L={t0:i}},tension(g){const i=(g-T)/1400;return i<0||i>1?0:Math.sin(Math.PI*Math.min(1,i*2.2))*(1-i)},glory(g){if(!M)return 0;const i=(g-(M.t0+M.ms*.6))/3e3;return i<0||i>1?0:Math.sin(Math.PI*Math.min(1,i*2.5))*(1-i*.6)},mateAt(g,i,y,v="w"){M={t0:g,ms:i},y&&(G(b,y,0),b.rotation.set(v==="w"?-.32:.32,0,.1))},dispose(){o.removeFromParent(),t.dispose(),R.dispose(),l.dispose(),r.dispose(),f.dispose(),m.dispose(),p.dispose()}}}function kt(o){try{const n=o.getContext(),t=n.getExtension("WEBGL_debug_renderer_info");return t?String(n.getParameter(t.UNMASKED_RENDERER_WEBGL)):void 0}catch{return}}function St(){const o={};try{const n=new URLSearchParams(location.search).get("vistune");for(const t of(n??"").split(",")){const[r,e]=t.split(":");r&&e!==void 0&&Number.isFinite(Number(e))&&(o[r]=Number(e))}}catch{}return o}function _e(o,n){const t={};for(const r of n)o[r]!==void 0&&(t[r]=o[r]);return t}function qt(o,n={}){const t=o,r=t.q3Debug?.(),e=t.q3EnvHost?.();if(!r||!e||!r.renderer||!r.scene||!r.rig||!r.mats)return null;const{renderer:f,scene:h,camera:R}=r,m=t.q3CameraHost?.()??null,u=typeof location<"u"&&/[?&](qa|q3debug)\b/.test(location.search),l=u?St():{},p={...Pe,...l.curve!==void 0?{curve:l.curve?"agx":"neutral"}:{},...l.agxPow!==void 0?{power:l.agxPow}:{},...l.agxSat!==void 0?{sat:l.agxSat}:{}},b={...Oe,..._e(l,["key","sky","rim","shadow","radius","env","warm"])},O=et({renderer:f,rig:r.rig,mats:r.mats,tone:p,mood:b}),U=kt(f),F=Ie(),L=navigator.deviceMemory;let M=xe({boardTier:e.tier(),gpu:U,override:F,memoryGB:L}),T=ke(M);const W=new $e(M);let G=n.room?.()??"classic";const g=a=>({...a,..._e(l,["exposure","bloom","threshold","knee","contrast","saturation","vignette","pool","grain"]),...l.lift!==void 0?{lift:[l.lift,l.lift,l.lift*1.2]}:{},...l.gamma!==void 0?{gamma:[l.gamma,l.gamma,l.gamma]}:{}});let i=g(be(G));const y=it({motes:T.motes});h.add(y.group);const v=()=>y.setColors({mote:i.motes.color,moteOpacity:i.motes.opacity,dust:i.dust.color,dustOpacity:i.dust.opacity});v();const d=Xe(f,h,T,i,{timed:u}),$=ht(h,f,e,o);l.nowin||d.setWindow($),d.setExposure(i.exposure),d.setEnvScale(b.env);let j=[],ee="";const Q=performance.now();function c(a){const s=h.getObjectByName("environment"),w=`${G}:${s?.children.length??0}`;w!==ee&&(ee=w,j=[],s?.traverse(K=>{const A=K.material;A?.isShaderMaterial&&A.uniforms?.uLive&&j.push(A)}));const C=!Y;for(const K of j)K.uniforms.uLive.value.set(C?i.live.water:0,C?i.live.sky:0),K.uniforms.uLiveT.value=(a-Q)/1e3}const z=ct(h),S=xt();h.add(S.group);const _=a=>{const[s="",w="w"]=a.split(" "),C=w==="w"?"K":"k",K=s.split("/");for(let A=0;A<8;A++){let te=0;for(const ie of K[A]??""){if(/\d/.test(ie)){te+=Number(ie);continue}if(ie===C)return"abcdefgh"[te]+String(8-A);te++}}return null},x={fwd:new V,pos:new V,t:-1},q=new V;let k=0;function E(a){q.set(0,0,-1).applyQuaternion(R.quaternion);const s=x.t<0?-1:(a-x.t)/1e3;if(s>0&&s<.25){const w=N.radToDeg(q.angleTo(x.fwd))/s,C=R.position.distanceTo(x.pos)/s,K=(m?.mode()??"idle")==="idle",A=T.dof&&!l.nodof&&K&&!e.reducedMotion()?N.smoothstep(Math.max(w/14,C/8),.3,1):0;k+=(A-k)*(1-Math.exp(-s/(A>k?.1:.3)))}else s>=.25&&(k=0);x.fwd.copy(q),x.pos.copy(R.position),x.t=a,k<.01&&(k=0),d.setDof(k),k>0&&e.keepAwake(350)}const P=[],B=new Ne;let I=0,D=0;function oe(a){if(!D)return 0;const s=(a-I)/D;return s<0?0:s>1?(D=0,0):s<.2?N.smoothstep(s,0,.2):1-N.smoothstep(s,.35,1)}function ne(a){if(a===M)return;const s=T.motes;M=a,T=ke(a),o.dataset.vis=a,d.setQuality(T),X=Y||!d.stepping?null:{t0:performance.now(),from:s,to:T.motes},X||y.setMotes(Y?0:T.motes),e.invalidate()}let Y=!1,X=null;const fe=d.onFrame(a=>{if(X){const C=Math.min(1,(a-X.t0)/Ye);y.setMotes(X.from+(X.to-X.from)*C),C>=1&&(X=null)}const s=e.reducedMotion();s!==Y&&(Y=s,y.setMotes(s?0:T.motes),d.setStill(s));const w=n.room?.()??G;for(w!==G&&(G=w,i=g(be(w)),d.setLook(i),d.setExposure(i.exposure),v());P.length&&P[0].due<=a;)me(P.shift().i);if(z.apply(a),E(a),S.frame(a)&&e.keepAwake(240),c(a),d.setMoment(Y?0:S.tension(a),Y?0:Math.max(S.glory(a),oe(a))),f.getDrawingBufferSize(B),y.frame(a,R,B.y),!F){const C=W.frame(a);C&&ne(C)}d.stepping&&e.keepAwake(120)}),pe=e.onTier(a=>{const s=xe({boardTier:a,gpu:U,override:F,memoryGB:L}),w={high:2,mid:1,low:0};ne(w[s]<w[W.current]?s:W.current)});function me(a){if(!e.alive())return;const s=re(a.square);if(a.kind==="contact")d.hold(55),y.burst(s.x,s.z,.5,0,.26);else if(a.kind==="capture"){const w=a.from?re(a.from):null,C=w?s.x-w.x:0,K=w?s.z-w.z:0,A=Math.hypot(C,K)||1,te=s.x+C/A*(w?.55:0),ie=s.z+K/A*(w?.55:0);y.burst(te,ie,a.strength,9,.36,!!a.dark)}else if(a.kind==="leaves")y.leaves(s.x,s.z,64,2.1),y.burst(s.x,s.z,1.5,0,.5),y.bloom(s.x,s.z,90);else{y.burst(s.x,s.z,a.strength,0,a.piece==="p"?.24:.3);const w=a.from?re(a.from):null;z.start({x:s.x,z:s.z,dx:w?s.x-w.x:0,dz:w?s.z-w.z:-1,strength:a.strength})}e.keepAwake(1500)}const se={move(a,s){if(!T.puffs||e.reducedMotion())return;const w=performance.now(),C=tt(a,s);for(const A of C)P.push({due:w+A.at,i:A});const K=C.find(A=>A.kind==="land")?.at??0;if(a.flags.check&&!a.flags.mate){const A=_(a.fenAfter);A&&S.check(A,w+K+40)}a.flags.promotion&&S.promotion(a.to,w+K),P.sort((A,te)=>A.due-te.due),e.keepAwake(Math.max(...P.map(A=>A.due-w),0)+200)},celebrate(a,s){if(e.reducedMotion()||!s||a!=="checkmate"&&a!=="win")return;const w=performance.now(),C=Math.round(1800*.8);S.mateAt(w,C,s,e.orientation()),P.push({due:w+C,i:{kind:"leaves",at:C,square:s,strength:1.5,piece:"k"}}),P.sort((K,A)=>K.due-A.due),e.keepAwake(C+4e3)},selected(a){e.reducedMotion()||(S.pickUp(a),e.invalidate())},glory(a){e.reducedMotion()||(I=performance.now(),D=Math.max(200,a),e.keepAwake(D+100))},get tier(){return M},dispose(){fe(),pe(),$.dispose(),d.dispose(),y.dispose(),O.dispose(),S.dispose(),P.length=0,z.clear(),delete o.dataset.vis,u&&window.qcVis===H&&delete window.qcVis}},H=u?{tier:()=>M,quality:()=>({...T}),look:()=>({...i}),room:()=>G,gpu:U,stats:()=>({...d.stats(),dof:Math.round(k*100)/100,window:Math.round($.amount()*100)/100}),setTier:ne,setMix:a=>{d.setMix(a),e.invalidate()},burst:(a,s=1,w=0)=>{const C=re(a);y.burst(C.x,C.z,s,w),e.keepAwake(1500)},move:(a,s=!1)=>se.move(a,s),celebrate:(a,s)=>se.celebrate(a,s)}:null;return H&&(window.qcVis=H),o.dataset.vis=M,e.invalidate(),se}export{qt as attachVis};
