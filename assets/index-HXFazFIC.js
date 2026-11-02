import{AgXToneMapping as qe,ShaderChunk as me,Color as te,CanvasTexture as Oe,SRGBColorSpace as Pe,Group as Te,BufferGeometry as ve,BufferAttribute as ee,Vector3 as H,ShaderMaterial as pe,AdditiveBlending as ze,Points as he,DynamicDrawUsage as Re,MathUtils as N,Matrix4 as ie,PerspectiveCamera as Ue,WebGLRenderTarget as Le,HalfFloatType as Be,LinearSRGBColorSpace as Ge,PlaneGeometry as Ke,Mesh as re,CylinderGeometry as ge,DoubleSide as ye,NormalBlending as De,Vector2 as Ve}from"./three.module-D5rf0S9N.js";import{c9 as se}from"./index-CXKyTubZ.js";import{a as We}from"./flag-mfbUKmin.js";import{v as we,a as Me,l as be,c as Ee,G as Ne}from"./tier-DuHH4FWc.js";import{g as Ie,c as He,a as je}from"./feel-BBy4ZPyH.js";const xe={power:1.18,sat:1.1};let ke=!1;function Qe(o=xe.power,n=xe.sat){if(ke)return!0;const t=me.tonemapping_pars_fragment,i="vec3 AgXToneMapping( vec3 color ) {",e="// v = agxLook(v, look);";if(!t.includes(i)||!t.includes(e))return!1;const f=`
vec3 visAgxLook( vec3 v ) {
	const vec3 lw = vec3( 0.2126, 0.7152, 0.0722 );
	float luma = dot( v, lw );
	v = pow( max( v, vec3( 0.0 ) ), vec3( ${o.toFixed(3)} ) );
	return luma + ${n.toFixed(3)} * ( v - luma );
}
`;return me.tonemapping_pars_fragment=t.replace(i,f+i).replace(e,"color = visAgxLook( color );"),ke=!0,!0}const _e={key:1.3,sky:.62,rim:.9,shadow:.12,radius:1.25,env:.78,warm:-.035};function Xe(){if(typeof document>"u")return null;const o=document.createElement("canvas");o.width=o.height=128;const n=o.getContext("2d");if(!n)return null;const t=n.createRadialGradient(64,64,0,64,64,64);t.addColorStop(0,"rgba(10,7,4,1)"),t.addColorStop(.6,"rgba(10,7,4,.96)"),t.addColorStop(.68,"rgba(10,7,4,.74)"),t.addColorStop(.76,"rgba(10,7,4,.40)"),t.addColorStop(.86,"rgba(10,7,4,.14)"),t.addColorStop(.95,"rgba(10,7,4,.03)"),t.addColorStop(1,"rgba(10,7,4,0)"),n.fillStyle=t,n.fillRect(0,0,128,128);const i=new Oe(o);return i.colorSpace=Pe,i}const Fe={curve:"neutral"};function $e(o){const{renderer:n,rig:t,mats:i}=o,e=o.mood??_e,f=o.tone??Fe,h=n.toneMapping;f.curve==="agx"&&(Qe(f.power,f.sat),n.toneMapping=qe);const R=t.apply,v=t.setQuality,u=()=>{t.key.intensity*=e.key,t.key.color.multiply(new te(1,1-e.warm*.45,1-e.warm)),t.sky.intensity*=e.sky,t.rim.intensity*=e.rim,t.key.shadow.intensity=Math.min(1,t.key.shadow.intensity+e.shadow)},r=t.key.shadow.radius;t.apply=function(F){R.call(t,F),u()},t.setQuality=function(F){v.call(t,F),t.key.shadow.radius*=e.radius},u(),t.key.shadow.radius=r*e.radius;const p={sq:i.squares.roughness,fr:i.frame.roughness,ri:i.rim.roughness,blob:i.blob.map};i.squares.roughness=Math.max(p.sq,.6),i.frame.roughness=Math.max(p.fr,.64),i.rim.roughness=Math.max(p.ri,.64);const b=Xe();return b&&p.blob&&(i.blob.map=b),{refresh:u,dispose(){t.apply=R,t.setQuality=v,t.key.shadow.radius=r,n.toneMapping=h,i.squares.roughness=p.sq,i.frame.roughness=p.fr,i.rim.roughness=p.ri,b&&(i.blob.map=p.blob,b.dispose())}}}const Se={p:.55,n:.9,b:.7,r:.85,q:.9,k:.9};function Je(o,n=!1){const t=Ie(o,n),i=[{kind:"land",at:t,square:o.to,from:o.from,strength:Se[o.piece.type]*(o.flags.promotion?1.2:o.flags.mate?1.5:1),piece:o.piece.type}],e=o.capturedSquare??(o.captured||o.flags.capture?o.to:null);if(e&&o.captured){const f=He({...o,captured:o.captured},n),h=o.captured.color==="b";i.push({kind:"contact",at:f.contact,square:e,strength:f.strength,piece:o.captured.type,dark:h}),i.push({kind:"capture",at:f.strike,square:e,from:o.from,strength:1.1+.3*(o.captured.type==="p"?0:1),piece:o.captured.type,dark:h})}if(o.rookMove){const f=je(t);i.push({kind:"rook",at:f.delay+f.dur,square:o.rookMove.to,from:o.rookMove.from,strength:Se.r*.8,piece:"r"})}return i.sort((f,h)=>f.at-h.at)}const Ye=`
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
}`,Ze=`
uniform vec3 uColor; uniform float uOpacity;
varying float vA;
void main() {
  float r = length(gl_PointCoord - 0.5) * 2.0;
  float a = 1.0 - smoothstep(0.0, 1.0, r);
  a *= a * vA * uOpacity;
  if (a < 0.002) discard;
  gl_FragColor = vec4(uColor, a);
}`,et=`
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
}`,tt=`
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
}`,$=640;function ot(o){const n=new Te;n.name="vis-particles";const t=performance.now();let i=o.seed??49734321;const e=()=>(i=i*16807%2147483647,i/2147483647),f=200,h=new Float32Array(f*3),R=new Float32Array(f*4);for(let d=0;d<f;d++)h.set([e(),e(),e()],d*3),R.set([e(),e(),.034+.04*e()*e(),e()],d*4);const v=new ve;v.setAttribute("position",new ee(h,3)),v.setAttribute("aSeed",new ee(R,4));const u={uTime:{value:0},uCenter:{value:new H(0,2,-.6)},uHalf:{value:new H(5.6,1.6,5.2)},uScale:{value:900},uLive:{value:1},uColor:{value:new te(1,.93,.8)},uOpacity:{value:.55}},r=new pe({vertexShader:Ye,fragmentShader:Ze,uniforms:u,transparent:!0,depthWrite:!1,blending:ze,toneMapped:!1}),p=new he(v,r);p.name="vis-motes",p.frustumCulled=!1,p.renderOrder=3,n.add(p);const b=d=>{const C=Math.max(0,Math.min(f,Math.round(d)));v.setDrawRange(0,C),p.visible=C>0};b(o.motes);const F=new Float32Array($*3),U=new Float32Array($*3),q=new Float32Array($*4),G=new Float32Array($*2);for(let d=0;d<$;d++)q[d*4]=-1e4;const g=new ve,T=new ee(F,3),V=new ee(U,3),L=new ee(q,4),c=new ee(G,2);for(const d of[T,V,L,c])d.setUsage(Re);g.setAttribute("position",T),g.setAttribute("aVel",V),g.setAttribute("aLife",L),g.setAttribute("aSpin",c);const l={uTime:{value:0},uScale:{value:900},uDust:{value:new te(.7,.64,.55)},uChip:{value:new te(.78,.7,.56)},uChipDark:{value:new te(.2,.16,.13)},uOpacity:{value:.36}},M=new pe({vertexShader:et,fragmentShader:tt,uniforms:l,transparent:!0,depthWrite:!1,toneMapped:!1}),m=new he(g,M);m.name="vis-bursts",m.frustumCulled=!1,m.renderOrder=2,n.add(m);let y=0,I=0;const J=()=>(performance.now()-t)/1e3;function j(d,C,x,z,A,P,k,Q,O,K,W,E=0,oe=e()){F.set([C,x,z],d*3),U.set([A,P,k],d*3),q.set([Q,O,K,W],d*4),G.set([E,oe],d*2)}const D=(d,C)=>{for(const x of[T,V,L,c])x.needsUpdate=!0;I=Math.max(I,d+C),m.visible=!0};return{group:n,frame(d,C,x){const z=(d-t)/1e3;u.uTime.value=z,l.uTime.value=z;const A=x/(2*Math.tan(N.degToRad(C.fov)/2));u.uScale.value=A,l.uScale.value=A;const P=C.getWorldDirection(at),k=N.radToDeg(Math.asin(Math.min(1,Math.max(-1,-P.y))));u.uLive.value=N.smoothstep(68-k,0,16),m.visible=z<I},burst(d,C,x,z=0,A=.3,P=!1){const k=J(),Q=Math.round(14+12*x);for(let O=0;O<Q;O++){const K=O/Q*Math.PI*2+e()*.6,W=A*(.8+.3*e()),E=(1.3+1.5*e())*(.6+.5*x);j(y,d+Math.cos(K)*W,.02+.03*e(),C+Math.sin(K)*W,Math.cos(K)*E,.06+.2*e()*x,Math.sin(K)*E,k+.015*e(),.6+.4*e(),(.12+.1*e())*(.65+.4*x),0),y=(y+1)%$}for(let O=0;O<z;O++){const K=e()*Math.PI*2,W=.8+1.6*e();j(y,d+Math.cos(K)*A*.5,.18+.32*e(),C+Math.sin(K)*A*.5,Math.cos(K)*W,.9+1.3*e(),Math.sin(K)*W,k+.01*e(),1.3+.6*e(),.05+.07*e()*e(),P?2:1,(e()<.5?-1:1)*(1.2+2.4*e())),y=(y+1)%$}return D(k,2),2e3},leaves(d,C,x,z=1.6){const A=J();for(let P=0;P<x;P++){const k=e()*Math.PI*2,Q=.6+1.6*e();j(y,d+Math.cos(k)*.2*z,.9+.8*e(),C+Math.sin(k)*.2*z,Math.cos(k)*Q*z,1.8+2*e(),Math.sin(k)*Q*z,A+.3*e(),3.4+1.8*e(),.22+.14*e(),3,(e()<.5?-1:1)*(.3+.9*e())),y=(y+1)%$}D(A,5.2)},bloom(d,C,x){const z=J();for(let A=0;A<x;A++){const P=e()*Math.PI*2,k=.4+1.7*e()*e();j(y,d+Math.cos(P)*.15,.25+.4*e(),C+Math.sin(P)*.15,Math.cos(P)*k,3.2+2.6*e(),Math.sin(P)*k,z+.45*e()*e(),3.6+2*e(),.11+.08*e(),4,(e()<.5?-1:1)*(.6+1.4*e())),y=(y+1)%$}D(z,6.2)},setMotes:b,setColors(d){u.uColor.value.setRGB(d.mote[0],d.mote[1],d.mote[2]),u.uOpacity.value=d.moteOpacity,l.uDust.value.setRGB(d.dust[0],d.dust[1],d.dust[2]),l.uOpacity.value=d.dustOpacity,l.uChip.value.setRGB(d.dust[0]*.86,d.dust[1]*.8,d.dust[2]*.7)},dispose(){n.removeFromParent(),v.dispose(),r.dispose(),g.dispose(),M.dispose()}}}const at=new H;function nt(o,n){return o<0||o>.6?0:N.degToRad(3.4)*Math.min(1.2,n)*Math.sin(2*Math.PI*5.5*o)*Math.exp(-o/.12)}const Ae=.27;function st(o){const n=[],t=new ie,i=new ie,e=new ie,f=new ie,h=new H,R=()=>o.children.filter(v=>v.isInstancedMesh===!0&&v.material.isMeshStandardMaterial===!0);return{start(v){const u=Math.hypot(v.dx,v.dz),r=u>1e-4?{dx:v.dx/u,dz:v.dz/u}:{dx:0,dz:-1};for(let p=n.length-1;p>=0;p--)Math.abs(n[p].x-v.x)<.1&&Math.abs(n[p].z-v.z)<.1&&n.splice(p,1);n.push({...v,...r,t0:performance.now()})},apply(v){for(let r=n.length-1;r>=0;r--)(v-n[r].t0)/1e3>.6&&n.splice(r,1);if(!n.length)return!1;const u=R();for(const r of n){const p=nt((v-r.t0)/1e3,r.strength);if(Math.abs(p)<1e-5)continue;const b=p>0?1:-1,F=r.x+r.dx*Ae*b,U=r.z+r.dz*Ae*b;h.set(r.dz,0,-r.dx).normalize(),i.makeRotationAxis(h,p),e.makeTranslation(F,0,U),f.makeTranslation(-F,0,-U);for(const q of u){let G=!1;for(let g=0;g<q.count;g++){q.getMatrixAt(g,t);const T=t.elements;Math.abs(T[12]-r.x)>.12||Math.abs(T[14]-r.z)>.12||T[13]>.03||(t.premultiply(f).premultiply(i).premultiply(e),q.setMatrixAt(g,t),G=!0)}G&&(q.instanceMatrix.needsUpdate=!0)}}return!0},clear(){n.length=0}}}const it=320,rt=140,le=4.25,lt=450,ct=600,ut=1.4,dt=1.6;function ft(o,n,t,i){const e=new Ue(16,3,.5,600);let f=null,h=0,R=-1,v=0,u=null,r=null,p=null,b=null;new H;const F=new H,U=new H,q=[new H,new H];function G(){(!r||!r.parent)&&(r=o.getObjectByName("environment")??null),(!u||!u.parent||!u.userData.visWindow)&&(u=r?.getObjectByName("room-koala")??null),(!p||!p.parent)&&(p=r?.getObjectByName("koala-chair")??null),(!b||!b.parent)&&(b=r?.getObjectByName("room-tabletop")??null)}const g=()=>u?.userData?.visWindow??null;function T(c){const l=t.orientation()==="w"?-le:le;return q[0].set(-le,.09,l).project(c),q[1].set(le,.09,l).project(c),(Math.max(q[0].y,q[1].y)+1)/2}function V(c,l){const M=l>c*1.15,m=g();return M&&!!m&&(!!t.isFlat?.()||!!m.flat)}const L=()=>{const c=Number(i?.dataset.visCoverTop??0);return Number.isFinite(c)?N.clamp(c,0,.6):0};return{frame(c,l,M,m,y){G();const I=R<0?0:Math.min(100,c-R);R=c;const j=V(M,m)?1:0;h=t.reducedMotion()?j:N.clamp(h+(j>h?I/it:-I/rt),0,1),h!==j&&t.keepAwake(120);const D=g();if(D&&(D.live=h>.001),h<=.001||!D||!u)return null;const d=D.focus?1:0;v=t.reducedMotion()?0:N.clamp(v+(d>v?I/lt:-I/ct),0,1),v!==d&&!t.reducedMotion()&&t.keepAwake(120);const C=v*v*(3-2*v),x=T(l)+6/m,z=1-L();if(z-x<.07)return null;const A=Math.max(16,Math.round((z-x)*m*.8)),P=Math.max(16,Math.round(M*.8));(!f||f.width!==P||f.height!==A)&&(f?.dispose(),f=new Le(P,A,{type:Be,depthBuffer:!0,samples:0}),f.texture.colorSpace=Ge,f.isXRRenderTarget=!0),F.copy(D.eye),u.parent?.localToWorld(F),u.updateMatrixWorld(),u.geometry.boundingBox||u.geometry.computeBoundingBox();const k=(u.geometry.boundingBox?.max.y??1)*u.scale.y;u.getWorldPosition(U),U.y+=k*(.62+.08*C);const Q=F.distanceTo(U);e.position.copy(F),e.up.set(0,1,0),e.lookAt(U),e.aspect=P/A;const O=(z-x)*m/Math.max(1,n.getPixelRatio()),W=Math.min(.81,170/Math.max(1,O))*(1+((O<140?dt:ut)-1)*C);e.fov=N.clamp(N.radToDeg(2*Math.atan(k*.5/W/Math.max(.5,Q))),8-4*C,60),typeof location<"u"&&location.search.includes("q3debug")&&(D.qa={fov:+e.fov.toFixed(2),fill:+W.toFixed(3),fk:+v.toFixed(2),stripCss:Math.round(O)}),e.updateProjectionMatrix(),e.updateMatrixWorld();const E=[];for(const X of o.children)X.visible&&X!==r&&!X.isLight&&(X.visible=!1,E.push(X));const oe=u.visible,ae=p?.visible??!1,Y=b?.visible??!1,ce=n.shadowMap.autoUpdate,ue=n.getRenderTarget();u.visible=!0,D.pass=!0,n.shadowMap.autoUpdate=!1,p&&p.children.length&&(p.visible=!0),b&&(b.visible=!0);try{n.setRenderTarget(f),n.clear(!0,!0,!1),y(o,e)}finally{D.pass=!1,u.visible=oe,n.shadowMap.autoUpdate=ce,p&&(p.visible=ae),b&&(b.visible=Y),n.setRenderTarget(ue);for(const X of E)X.visible=!0}return{tex:f.texture,y0:x,y1:z,fade:Math.min(.12,(z-x)*.45),alpha:h*h*(3-2*h)}},amount:()=>h,dispose(){const c=g();c&&(c.live=!1,c.pass=!1),f?.dispose(),f=null}}}const pt="varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",mt=`
uniform vec3 uColor; uniform float uK; uniform float uR; uniform float uW;
varying vec2 vUv;
void main() {
  float r = length(vUv - 0.5) * 2.0;
  float a = exp(-pow((r - uR) / uW, 2.0)) * uK;
  if (a < 0.003) discard;
  gl_FragColor = vec4(uColor, a);
}`,vt=`
uniform vec3 uColor; uniform float uK;
varying vec2 vUv;
void main() {
  float r = length(vUv - 0.5) * 2.0;
  float a = pow(max(0.0, 1.0 - r), 2.2) * uK;
  if (a < 0.003) discard;
  gl_FragColor = vec4(uColor, a);
}`,ht=`
uniform vec3 uColor; uniform float uK;
varying vec2 vUv;
void main() {
  float h = vUv.y;
  float a = (1.0 - smoothstep(0.0, 1.0, h)) * (0.35 + 0.65 * (1.0 - h)) * uK;
  if (a < 0.003) discard;
  gl_FragColor = vec4(uColor * (0.7 + 0.6 * (1.0 - h)), a);
}`,gt=`
uniform vec3 uColor; uniform float uK; uniform float uT;
varying vec2 vUv;
void main() {
  float h = vUv.y;                                                   // 0 at the board, 1 at the source
  float streak = 0.5 + 0.5 * sin(vUv.x * 6.2832 * 7.0 + uT * 0.35) * sin(vUv.x * 6.2832 * 3.0 - uT * 0.21 + 1.3);
  float a = uK * (0.35 + 0.65 * streak) * smoothstep(0.0, 0.18, h) * (1.0 - smoothstep(0.45, 1.0, h));
  if (a < 0.002) discard;
  gl_FragColor = vec4(uColor, a);
}`;function yt(){const o=new Te;o.name="vis-moments";const n=(c,l,M,m={})=>new pe({vertexShader:pt,fragmentShader:c,transparent:!0,depthWrite:!1,toneMapped:!1,blending:M?ze:De,uniforms:{uColor:{value:new te(l)},uK:{value:0},...m}}),t=new Ke(1,1).rotateX(-Math.PI/2),i=n(mt,14704698,!1,{uR:{value:.5},uW:{value:.12}}),e=new re(t,i);e.renderOrder=2,e.visible=!1,e.scale.setScalar(1.6);const f=n(vt,16769712,!0),h=new re(t,f);h.renderOrder=1,h.visible=!1,h.scale.setScalar(1.9);const R=new ge(.34,.42,3.2,32,1,!0).translate(0,1.6,0),v=n(ht,16771e3,!0);v.side=ye;const u=new re(R,v);u.renderOrder=3,u.visible=!1;const r=new ge(.42,1.55,11,48,1,!0).translate(0,5.5,0),p=n(gt,16771268,!0,{uT:{value:0}});p.side=ye;const b=new re(r,p);b.renderOrder=4,b.visible=!1,o.add(h,e,u,b);let F=0,U=0,q=null,G=null,g=null,T=-1e9,V=-1;const L=(c,l,M)=>{const m=se(l);c.position.set(m.x,M,m.z)};return{group:o,frame(c){const l=V<0?16:Math.min(80,c-V);V=c,F+=(U-F)*(1-Math.exp(-l/90)),f.uniforms.uK.value=F*.16,h.visible=F>.01;let M=Math.abs(U-F)>.01;if(q){const m=(c-q.t0)/900;if(m<0)e.visible=!1;else if(m>=1)q=null,e.visible=!1;else{const y=m*2%1;i.uniforms.uR.value=.25+.55*(1-Math.pow(1-y,3)),i.uniforms.uK.value=.75*(1-y),e.visible=!0}M=!0}if(G){const m=(c-G.t0)/1100;m<0?u.visible=!1:m>=1?(G=null,u.visible=!1):(v.uniforms.uK.value=Math.sin(Math.PI*Math.min(1,m*1.4))*(1-m*.4)*.55,u.scale.set(1-.25*m,.4+.8*Math.min(1,m*2),1-.25*m),u.visible=!0),M=!0}if(g){const m=(c-(g.t0+g.ms*.6))/3e3,y=m<0||m>1?0:Math.sin(Math.PI*Math.min(1,m*2.5))*(1-m*.6);p.uniforms.uK.value=y*.13,p.uniforms.uT.value=c/1e3,b.visible=y>.005}else b.visible=!1;return g&&c>g.t0+g.ms+3500&&(g=null),M||!!g||c-T<1400},pickUp(c){U=c?1:0,c&&L(h,c,.006)},check(c,l){L(e,c,.012),q={t0:l},T=l},promotion(c,l){L(u,c,0),G={t0:l}},tension(c){const l=(c-T)/1400;return l<0||l>1?0:Math.sin(Math.PI*Math.min(1,l*2.2))*(1-l)},glory(c){if(!g)return 0;const l=(c-(g.t0+g.ms*.6))/3e3;return l<0||l>1?0:Math.sin(Math.PI*Math.min(1,l*2.5))*(1-l*.6)},mateAt(c,l,M,m="w"){g={t0:c,ms:l},M&&(L(b,M,0),b.rotation.set(m==="w"?-.32:.32,0,.1))},dispose(){o.removeFromParent(),t.dispose(),R.dispose(),r.dispose(),i.dispose(),f.dispose(),v.dispose(),p.dispose()}}}function wt(o){try{const n=o.getContext(),t=n.getExtension("WEBGL_debug_renderer_info");return t?String(n.getParameter(t.UNMASKED_RENDERER_WEBGL)):void 0}catch{return}}function Mt(){const o={};try{const n=new URLSearchParams(location.search).get("vistune");for(const t of(n??"").split(",")){const[i,e]=t.split(":");i&&e!==void 0&&Number.isFinite(Number(e))&&(o[i]=Number(e))}}catch{}return o}function Ce(o,n){const t={};for(const i of n)o[i]!==void 0&&(t[i]=o[i]);return t}function Ct(o,n={}){const t=o,i=t.q3Debug?.(),e=t.q3EnvHost?.();if(!i||!e||!i.renderer||!i.scene||!i.rig||!i.mats)return null;const{renderer:f,scene:h,camera:R}=i,v=t.q3CameraHost?.()??null,u=typeof location<"u"&&/[?&](qa|q3debug)\b/.test(location.search),r=u?Mt():{},p={...Fe,...r.curve!==void 0?{curve:r.curve?"agx":"neutral"}:{},...r.agxPow!==void 0?{power:r.agxPow}:{},...r.agxSat!==void 0?{sat:r.agxSat}:{}},b={..._e,...Ce(r,["key","sky","rim","shadow","radius","env","warm"])},F=$e({renderer:f,rig:i.rig,mats:i.mats,tone:p,mood:b}),U=wt(f),q=We(),G=navigator.deviceMemory;let g=we({boardTier:e.tier(),gpu:U,override:q,memoryGB:G}),T=Me(g);const V=new Ne(g);let L=n.room?.()??"classic";const c=a=>({...a,...Ce(r,["exposure","bloom","threshold","knee","contrast","saturation","vignette","pool","grain"]),...r.lift!==void 0?{lift:[r.lift,r.lift,r.lift*1.2]}:{},...r.gamma!==void 0?{gamma:[r.gamma,r.gamma,r.gamma]}:{}});let l=c(be(L));const M=ot({motes:T.motes});h.add(M.group);const m=()=>M.setColors({mote:l.motes.color,moteOpacity:l.motes.opacity,dust:l.dust.color,dustOpacity:l.dust.opacity});m();const y=Ee(f,h,T,l,{timed:u}),I=ft(h,f,e,o);r.nowin||y.setWindow(I),y.setExposure(l.exposure),y.setEnvScale(b.env);let J=[],j="";const D=performance.now();function d(a){const s=h.getObjectByName("environment"),w=`${L}:${s?.children.length??0}`;w!==j&&(j=w,J=[],s?.traverse(B=>{const S=B.material;S?.isShaderMaterial&&S.uniforms?.uLive&&J.push(S)}));const _=!Y;for(const B of J)B.uniforms.uLive.value.set(_?l.live.water:0,_?l.live.sky:0),B.uniforms.uLiveT.value=(a-D)/1e3}const C=st(h),x=yt();h.add(x.group);const z=a=>{const[s="",w="w"]=a.split(" "),_=w==="w"?"K":"k",B=s.split("/");for(let S=0;S<8;S++){let Z=0;for(const ne of B[S]??""){if(/\d/.test(ne)){Z+=Number(ne);continue}if(ne===_)return"abcdefgh"[Z]+String(8-S);Z++}}return null},A={fwd:new H,pos:new H,t:-1},P=new H;let k=0;function Q(a){P.set(0,0,-1).applyQuaternion(R.quaternion);const s=A.t<0?-1:(a-A.t)/1e3;if(s>0&&s<.25){const w=N.radToDeg(P.angleTo(A.fwd))/s,_=R.position.distanceTo(A.pos)/s,B=(v?.mode()??"idle")==="idle",S=T.dof&&!r.nodof&&B&&!e.reducedMotion()?N.smoothstep(Math.max(w/14,_/8),.3,1):0;k+=(S-k)*(1-Math.exp(-s/(S>k?.1:.3)))}else s>=.25&&(k=0);A.fwd.copy(P),A.pos.copy(R.position),A.t=a,k<.01&&(k=0),y.setDof(k),k>0&&e.keepAwake(350)}const O=[],K=new Ve;let W=0,E=0;function oe(a){if(!E)return 0;const s=(a-W)/E;return s<0?0:s>1?(E=0,0):s<.2?N.smoothstep(s,0,.2):1-N.smoothstep(s,.35,1)}function ae(a){a!==g&&(g=a,T=Me(a),o.dataset.vis=a,y.setQuality(T),M.setMotes(Y?0:T.motes),e.invalidate())}let Y=!1;const ce=y.onFrame(a=>{const s=e.reducedMotion();s!==Y&&(Y=s,M.setMotes(s?0:T.motes),y.setStill(s));const w=n.room?.()??L;for(w!==L&&(L=w,l=c(be(w)),y.setLook(l),y.setExposure(l.exposure),m());O.length&&O[0].due<=a;)X(O.shift().i);if(C.apply(a),Q(a),x.frame(a)&&e.keepAwake(240),d(a),y.setMoment(Y?0:x.tension(a),Y?0:Math.max(x.glory(a),oe(a))),f.getDrawingBufferSize(K),M.frame(a,R,K.y),!q){const _=V.frame(a);_&&ae(_)}}),ue=e.onTier(a=>{const s=we({boardTier:a,gpu:U,override:q,memoryGB:G}),w={high:2,mid:1,low:0};ae(w[s]<w[V.current]?s:V.current)});function X(a){if(!e.alive())return;const s=se(a.square);if(a.kind==="contact")y.hold(55),M.burst(s.x,s.z,.5,0,.26);else if(a.kind==="capture"){const w=a.from?se(a.from):null,_=w?s.x-w.x:0,B=w?s.z-w.z:0,S=Math.hypot(_,B)||1,Z=s.x+_/S*(w?.55:0),ne=s.z+B/S*(w?.55:0);M.burst(Z,ne,a.strength,9,.36,!!a.dark)}else if(a.kind==="leaves")M.leaves(s.x,s.z,64,2.1),M.burst(s.x,s.z,1.5,0,.5),M.bloom(s.x,s.z,90);else{M.burst(s.x,s.z,a.strength,0,a.piece==="p"?.24:.3);const w=a.from?se(a.from):null;C.start({x:s.x,z:s.z,dx:w?s.x-w.x:0,dz:w?s.z-w.z:-1,strength:a.strength})}e.keepAwake(1500)}const de={move(a,s){if(!T.puffs||e.reducedMotion())return;const w=performance.now(),_=Je(a,s);for(const S of _)O.push({due:w+S.at,i:S});const B=_.find(S=>S.kind==="land")?.at??0;if(a.flags.check&&!a.flags.mate){const S=z(a.fenAfter);S&&x.check(S,w+B+40)}a.flags.promotion&&x.promotion(a.to,w+B),O.sort((S,Z)=>S.due-Z.due),e.keepAwake(Math.max(...O.map(S=>S.due-w),0)+200)},celebrate(a,s){if(e.reducedMotion()||!s||a!=="checkmate"&&a!=="win")return;const w=performance.now(),_=Math.round(1800*.8);x.mateAt(w,_,s,e.orientation()),O.push({due:w+_,i:{kind:"leaves",at:_,square:s,strength:1.5,piece:"k"}}),O.sort((B,S)=>B.due-S.due),e.keepAwake(_+4e3)},selected(a){e.reducedMotion()||(x.pickUp(a),e.invalidate())},glory(a){e.reducedMotion()||(W=performance.now(),E=Math.max(200,a),e.keepAwake(E+100))},get tier(){return g},dispose(){ce(),ue(),I.dispose(),y.dispose(),M.dispose(),F.dispose(),x.dispose(),O.length=0,C.clear(),delete o.dataset.vis,u&&window.qcVis===fe&&delete window.qcVis}},fe=u?{tier:()=>g,quality:()=>({...T}),look:()=>({...l}),room:()=>L,gpu:U,stats:()=>({...y.stats(),dof:Math.round(k*100)/100,window:Math.round(I.amount()*100)/100}),setTier:ae,setMix:a=>{y.setMix(a),e.invalidate()},burst:(a,s=1,w=0)=>{const _=se(a);M.burst(_.x,_.z,s,w),e.keepAwake(1500)},move:(a,s=!1)=>de.move(a,s),celebrate:(a,s)=>de.celebrate(a,s)}:null;return fe&&(window.qcVis=fe),o.dataset.vis=g,e.invalidate(),de}export{Ct as attachVis};
