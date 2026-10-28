import{AgXToneMapping as Pe,ShaderChunk as de,Color as ee,CanvasTexture as Re,SRGBColorSpace as Fe,Group as Se,BufferGeometry as fe,BufferAttribute as Z,Vector3 as I,ShaderMaterial as ue,AdditiveBlending as Ae,Points as pe,DynamicDrawUsage as Oe,MathUtils as j,Matrix4 as ae,PerspectiveCamera as Le,WebGLRenderTarget as Ue,HalfFloatType as Be,LinearSRGBColorSpace as De,PlaneGeometry as Ee,Mesh as ne,CylinderGeometry as me,DoubleSide as ve,NormalBlending as Ge,Vector2 as Ke}from"./three.module-D5rf0S9N.js";import{bQ as Ve,bR as ie}from"./index-dvhUhZEm.js";import{a as We}from"./flag-uizQ1TcI.js";import{v as he,a as ge,l as ye,c as Ne,G as Ie}from"./tier-DuHH4FWc.js";const we={power:1.18,sat:1.1};let Me=!1;function je(o=we.power,n=we.sat){if(Me)return!0;const t=de.tonemapping_pars_fragment,i="vec3 AgXToneMapping( vec3 color ) {",e="// v = agxLook(v, look);";if(!t.includes(i)||!t.includes(e))return!1;const m=`
vec3 visAgxLook( vec3 v ) {
	const vec3 lw = vec3( 0.2126, 0.7152, 0.0722 );
	float luma = dot( v, lw );
	v = pow( max( v, vec3( 0.0 ) ), vec3( ${o.toFixed(3)} ) );
	return luma + ${n.toFixed(3)} * ( v - luma );
}
`;return de.tonemapping_pars_fragment=t.replace(i,m+i).replace(e,"color = visAgxLook( color );"),Me=!0,!0}const Te={key:1.3,sky:.62,rim:.9,shadow:.12,radius:1.25,env:.78,warm:-.035};function He(){if(typeof document>"u")return null;const o=document.createElement("canvas");o.width=o.height=128;const n=o.getContext("2d");if(!n)return null;const t=n.createRadialGradient(64,64,0,64,64,64);t.addColorStop(0,"rgba(10,7,4,1)"),t.addColorStop(.6,"rgba(10,7,4,.96)"),t.addColorStop(.68,"rgba(10,7,4,.74)"),t.addColorStop(.76,"rgba(10,7,4,.40)"),t.addColorStop(.86,"rgba(10,7,4,.14)"),t.addColorStop(.95,"rgba(10,7,4,.03)"),t.addColorStop(1,"rgba(10,7,4,0)"),n.fillStyle=t,n.fillRect(0,0,128,128);const i=new Re(o);return i.colorSpace=Fe,i}const Ce={curve:"neutral"};function Qe(o){const{renderer:n,rig:t,mats:i}=o,e=o.mood??Te,m=o.tone??Ce,h=n.toneMapping;m.curve==="agx"&&(je(m.power,m.sat),n.toneMapping=Pe);const R=t.apply,c=t.setQuality,p=()=>{t.key.intensity*=e.key,t.key.color.multiply(new ee(1,1-e.warm*.45,1-e.warm)),t.sky.intensity*=e.sky,t.rim.intensity*=e.rim,t.key.shadow.intensity=Math.min(1,t.key.shadow.intensity+e.shadow)},s=t.key.shadow.radius;t.apply=function(C){R.call(t,C),p()},t.setQuality=function(C){c.call(t,C),t.key.shadow.radius*=e.radius},p(),t.key.shadow.radius=s*e.radius;const d={sq:i.squares.roughness,fr:i.frame.roughness,ri:i.rim.roughness,blob:i.blob.map};i.squares.roughness=Math.max(d.sq,.6),i.frame.roughness=Math.max(d.fr,.64),i.rim.roughness=Math.max(d.ri,.64);const x=He();return x&&d.blob&&(i.blob.map=x),{refresh:p,dispose(){t.apply=R,t.setQuality=c,t.key.shadow.radius=s,n.toneMapping=h,i.squares.roughness=d.sq,i.frame.roughness=d.fr,i.rim.roughness=d.ri,x&&(i.blob.map=d.blob,x.dispose())}}}const be={p:.55,n:.9,b:.7,r:.85,q:.9,k:.9},Xe=520,$e=Math.round(.82*.7*Xe);function Je(o,n=!1){const t=n?0:Ve(o.from,o.to,o.by),i=[{kind:"land",at:t,square:o.to,from:o.from,strength:be[o.piece.type]*(o.flags.promotion?1.2:1),piece:o.piece.type}],e=o.capturedSquare??(o.captured||o.flags.capture?o.to:null);return e&&o.captured&&i.push({kind:"capture",at:Math.round(t*.5)+$e,square:e,strength:1.1+.3*(o.captured.type==="p"?0:1),piece:o.captured.type,dark:o.captured.color==="b"}),o.rookMove&&i.push({kind:"rook",at:90+Math.max(200,t),square:o.rookMove.to,from:o.rookMove.from,strength:be.r*.8,piece:"r"}),i.sort((m,h)=>m.at-h.at)}const Ye=`
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
}`,J=640;function ot(o){const n=new Se;n.name="vis-particles";const t=performance.now();let i=o.seed??49734321;const e=()=>(i=i*16807%2147483647,i/2147483647),m=200,h=new Float32Array(m*3),R=new Float32Array(m*4);for(let u=0;u<m;u++)h.set([e(),e(),e()],u*3),R.set([e(),e(),.034+.04*e()*e(),e()],u*4);const c=new fe;c.setAttribute("position",new Z(h,3)),c.setAttribute("aSeed",new Z(R,4));const p={uTime:{value:0},uCenter:{value:new I(0,2,-.6)},uHalf:{value:new I(5.6,1.6,5.2)},uScale:{value:900},uLive:{value:1},uColor:{value:new ee(1,.93,.8)},uOpacity:{value:.55}},s=new ue({vertexShader:Ye,fragmentShader:Ze,uniforms:p,transparent:!0,depthWrite:!1,blending:Ae,toneMapped:!1}),d=new pe(c,s);d.name="vis-motes",d.frustumCulled=!1,d.renderOrder=3,n.add(d);const x=u=>{const z=Math.max(0,Math.min(m,Math.round(u)));c.setDrawRange(0,z),d.visible=z>0};x(o.motes);const C=new Float32Array(J*3),O=new Float32Array(J*3),F=new Float32Array(J*4),L=new Float32Array(J*2);for(let u=0;u<J;u++)F[u*4]=-1e4;const g=new fe,T=new Z(C,3),E=new Z(O,3),M=new Z(F,4),f=new Z(L,2);for(const u of[T,E,M,f])u.setUsage(Oe);g.setAttribute("position",T),g.setAttribute("aVel",E),g.setAttribute("aLife",M),g.setAttribute("aSpin",f);const l={uTime:{value:0},uScale:{value:900},uDust:{value:new ee(.7,.64,.55)},uChip:{value:new ee(.78,.7,.56)},uChipDark:{value:new ee(.2,.16,.13)},uOpacity:{value:.36}},y=new ue({vertexShader:et,fragmentShader:tt,uniforms:l,transparent:!0,depthWrite:!1,toneMapped:!1}),v=new pe(g,y);v.name="vis-bursts",v.frustumCulled=!1,v.renderOrder=2,n.add(v);let w=0,$=0;const Q=()=>(performance.now()-t)/1e3;function G(u,z,k,U,_,D,A,V,q,B,W,N=0,te=e()){C.set([z,k,U],u*3),O.set([_,D,A],u*3),F.set([V,q,B,W],u*4),L.set([N,te],u*2)}const X=(u,z)=>{for(const k of[T,E,M,f])k.needsUpdate=!0;$=Math.max($,u+z),v.visible=!0};return{group:n,frame(u,z,k){const U=(u-t)/1e3;p.uTime.value=U,l.uTime.value=U;const _=k/(2*Math.tan(j.degToRad(z.fov)/2));p.uScale.value=_,l.uScale.value=_;const D=z.getWorldDirection(at),A=j.radToDeg(Math.asin(Math.min(1,Math.max(-1,-D.y))));p.uLive.value=j.smoothstep(68-A,0,16),v.visible=U<$},burst(u,z,k,U=0,_=.3,D=!1){const A=Q(),V=Math.round(14+12*k);for(let q=0;q<V;q++){const B=q/V*Math.PI*2+e()*.6,W=_*(.8+.3*e()),N=(1.3+1.5*e())*(.6+.5*k);G(w,u+Math.cos(B)*W,.02+.03*e(),z+Math.sin(B)*W,Math.cos(B)*N,.06+.2*e()*k,Math.sin(B)*N,A+.015*e(),.6+.4*e(),(.12+.1*e())*(.65+.4*k),0),w=(w+1)%J}for(let q=0;q<U;q++){const B=e()*Math.PI*2,W=.8+1.6*e();G(w,u+Math.cos(B)*_*.5,.18+.32*e(),z+Math.sin(B)*_*.5,Math.cos(B)*W,.9+1.3*e(),Math.sin(B)*W,A+.01*e(),1.3+.6*e(),.05+.07*e()*e(),D?2:1,(e()<.5?-1:1)*(1.2+2.4*e())),w=(w+1)%J}return X(A,2),2e3},leaves(u,z,k,U=1.6){const _=Q();for(let D=0;D<k;D++){const A=e()*Math.PI*2,V=.6+1.6*e();G(w,u+Math.cos(A)*.2*U,.9+.8*e(),z+Math.sin(A)*.2*U,Math.cos(A)*V*U,1.8+2*e(),Math.sin(A)*V*U,_+.3*e(),3.4+1.8*e(),.22+.14*e(),3,(e()<.5?-1:1)*(.3+.9*e())),w=(w+1)%J}X(_,5.2)},setMotes:x,setColors(u){p.uColor.value.setRGB(u.mote[0],u.mote[1],u.mote[2]),p.uOpacity.value=u.moteOpacity,l.uDust.value.setRGB(u.dust[0],u.dust[1],u.dust[2]),l.uOpacity.value=u.dustOpacity,l.uChip.value.setRGB(u.dust[0]*.86,u.dust[1]*.8,u.dust[2]*.7)},dispose(){n.removeFromParent(),c.dispose(),s.dispose(),g.dispose(),y.dispose()}}}const at=new I;function nt(o,n){return o<0||o>.6?0:j.degToRad(3.4)*Math.min(1.2,n)*Math.sin(2*Math.PI*5.5*o)*Math.exp(-o/.12)}const xe=.27;function st(o){const n=[],t=new ae,i=new ae,e=new ae,m=new ae,h=new I,R=()=>o.children.filter(c=>c.isInstancedMesh===!0&&c.material.isMeshStandardMaterial===!0);return{start(c){const p=Math.hypot(c.dx,c.dz),s=p>1e-4?{dx:c.dx/p,dz:c.dz/p}:{dx:0,dz:-1};for(let d=n.length-1;d>=0;d--)Math.abs(n[d].x-c.x)<.1&&Math.abs(n[d].z-c.z)<.1&&n.splice(d,1);n.push({...c,...s,t0:performance.now()})},apply(c){for(let s=n.length-1;s>=0;s--)(c-n[s].t0)/1e3>.6&&n.splice(s,1);if(!n.length)return!1;const p=R();for(const s of n){const d=nt((c-s.t0)/1e3,s.strength);if(Math.abs(d)<1e-5)continue;const x=d>0?1:-1,C=s.x+s.dx*xe*x,O=s.z+s.dz*xe*x;h.set(s.dz,0,-s.dx).normalize(),i.makeRotationAxis(h,d),e.makeTranslation(C,0,O),m.makeTranslation(-C,0,-O);for(const F of p){let L=!1;for(let g=0;g<F.count;g++){F.getMatrixAt(g,t);const T=t.elements;Math.abs(T[12]-s.x)>.12||Math.abs(T[14]-s.z)>.12||T[13]>.03||(t.premultiply(m).premultiply(i).premultiply(e),F.setMatrixAt(g,t),L=!0)}L&&(F.instanceMatrix.needsUpdate=!0)}}return!0},clear(){n.length=0}}}const it=320,rt=140,se=4.25;function lt(o,n,t,i){const e=new Le(16,3,.5,600);let m=null,h=0,R=-1,c=null,p=null,s=null,d=null;new I;const x=new I,C=new I,O=[new I,new I];function F(){(!p||!p.parent)&&(p=o.getObjectByName("environment")??null),(!c||!c.parent||!c.userData.visWindow)&&(c=p?.getObjectByName("room-koala")??null),(!s||!s.parent)&&(s=p?.getObjectByName("koala-chair")??null),(!d||!d.parent)&&(d=p?.getObjectByName("room-tabletop")??null)}const L=()=>c?.userData?.visWindow??null;function g(M){const f=t.orientation()==="w"?-se:se;return O[0].set(-se,.09,f).project(M),O[1].set(se,.09,f).project(M),(Math.max(O[0].y,O[1].y)+1)/2}function T(M,f){const l=f>M*1.15,y=L();return l&&!!y&&(!!t.isFlat?.()||!!y.flat)}const E=()=>{const M=Number(i?.dataset.visCoverTop??0);return Number.isFinite(M)?j.clamp(M,0,.6):0};return{frame(M,f,l,y,v){F();const w=R<0?0:Math.min(100,M-R);R=M;const Q=T(l,y)?1:0;h=t.reducedMotion()?Q:j.clamp(h+(Q>h?w/it:-w/rt),0,1),h!==Q&&t.keepAwake(120);const G=L();if(G&&(G.live=h>.001),h<=.001||!G||!c)return null;const X=g(f)+6/y,u=1-E();if(u-X<.07)return null;const z=Math.max(16,Math.round((u-X)*y*.8)),k=Math.max(16,Math.round(l*.8));(!m||m.width!==k||m.height!==z)&&(m?.dispose(),m=new Ue(k,z,{type:Be,depthBuffer:!0,samples:0}),m.texture.colorSpace=De,m.isXRRenderTarget=!0),x.copy(G.eye),c.parent?.localToWorld(x),c.updateMatrixWorld(),c.geometry.boundingBox||c.geometry.computeBoundingBox();const U=(c.geometry.boundingBox?.max.y??1)*c.scale.y;c.getWorldPosition(C),C.y+=U*.62;const _=x.distanceTo(C);e.position.copy(x),e.up.set(0,1,0),e.lookAt(C),e.aspect=k/z;const D=(u-X)*y/Math.max(1,n.getPixelRatio()),A=Math.min(.81,170/Math.max(1,D));e.fov=j.clamp(j.radToDeg(2*Math.atan(U*.5/A/Math.max(.5,_))),8,60),e.updateProjectionMatrix(),e.updateMatrixWorld();const V=[];for(const H of o.children)H.visible&&H!==p&&!H.isLight&&(H.visible=!1,V.push(H));const q=c.visible,B=s?.visible??!1,W=d?.visible??!1,N=n.shadowMap.autoUpdate,te=n.getRenderTarget();c.visible=!0,G.pass=!0,n.shadowMap.autoUpdate=!1,s&&s.children.length&&(s.visible=!0),d&&(d.visible=!0);try{n.setRenderTarget(m),n.clear(!0,!0,!1),v(o,e)}finally{G.pass=!1,c.visible=q,n.shadowMap.autoUpdate=N,s&&(s.visible=B),d&&(d.visible=W),n.setRenderTarget(te);for(const H of V)H.visible=!0}return{tex:m.texture,y0:X,y1:u,fade:Math.min(.12,(u-X)*.45),alpha:h*h*(3-2*h)}},amount:()=>h,dispose(){const M=L();M&&(M.live=!1,M.pass=!1),m?.dispose(),m=null}}}const ct="varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",ut=`
uniform vec3 uColor; uniform float uK; uniform float uR; uniform float uW;
varying vec2 vUv;
void main() {
  float r = length(vUv - 0.5) * 2.0;
  float a = exp(-pow((r - uR) / uW, 2.0)) * uK;
  if (a < 0.003) discard;
  gl_FragColor = vec4(uColor, a);
}`,dt=`
uniform vec3 uColor; uniform float uK;
varying vec2 vUv;
void main() {
  float r = length(vUv - 0.5) * 2.0;
  float a = pow(max(0.0, 1.0 - r), 2.2) * uK;
  if (a < 0.003) discard;
  gl_FragColor = vec4(uColor, a);
}`,ft=`
uniform vec3 uColor; uniform float uK;
varying vec2 vUv;
void main() {
  float h = vUv.y;
  float a = (1.0 - smoothstep(0.0, 1.0, h)) * (0.35 + 0.65 * (1.0 - h)) * uK;
  if (a < 0.003) discard;
  gl_FragColor = vec4(uColor * (0.7 + 0.6 * (1.0 - h)), a);
}`,pt=`
uniform vec3 uColor; uniform float uK; uniform float uT;
varying vec2 vUv;
void main() {
  float h = vUv.y;                                                   // 0 at the board, 1 at the source
  float streak = 0.5 + 0.5 * sin(vUv.x * 6.2832 * 7.0 + uT * 0.35) * sin(vUv.x * 6.2832 * 3.0 - uT * 0.21 + 1.3);
  float a = uK * (0.35 + 0.65 * streak) * smoothstep(0.0, 0.18, h) * (1.0 - smoothstep(0.45, 1.0, h));
  if (a < 0.002) discard;
  gl_FragColor = vec4(uColor, a);
}`;function mt(){const o=new Se;o.name="vis-moments";const n=(f,l,y,v={})=>new ue({vertexShader:ct,fragmentShader:f,transparent:!0,depthWrite:!1,toneMapped:!1,blending:y?Ae:Ge,uniforms:{uColor:{value:new ee(l)},uK:{value:0},...v}}),t=new Ee(1,1).rotateX(-Math.PI/2),i=n(ut,14704698,!1,{uR:{value:.5},uW:{value:.12}}),e=new ne(t,i);e.renderOrder=2,e.visible=!1,e.scale.setScalar(1.6);const m=n(dt,16769712,!0),h=new ne(t,m);h.renderOrder=1,h.visible=!1,h.scale.setScalar(1.9);const R=new me(.34,.42,3.2,32,1,!0).translate(0,1.6,0),c=n(ft,16771e3,!0);c.side=ve;const p=new ne(R,c);p.renderOrder=3,p.visible=!1;const s=new me(.42,1.55,11,48,1,!0).translate(0,5.5,0),d=n(pt,16771268,!0,{uT:{value:0}});d.side=ve;const x=new ne(s,d);x.renderOrder=4,x.visible=!1,o.add(h,e,p,x);let C=0,O=0,F=null,L=null,g=null,T=-1e9,E=-1;const M=(f,l,y)=>{const v=ie(l);f.position.set(v.x,y,v.z)};return{group:o,frame(f){const l=E<0?16:Math.min(80,f-E);E=f,C+=(O-C)*(1-Math.exp(-l/90)),m.uniforms.uK.value=C*.16,h.visible=C>.01;let y=Math.abs(O-C)>.01;if(F){const v=(f-F.t0)/900;if(v<0)e.visible=!1;else if(v>=1)F=null,e.visible=!1;else{const w=v*2%1;i.uniforms.uR.value=.25+.55*(1-Math.pow(1-w,3)),i.uniforms.uK.value=.75*(1-w),e.visible=!0}y=!0}if(L){const v=(f-L.t0)/1100;v<0?p.visible=!1:v>=1?(L=null,p.visible=!1):(c.uniforms.uK.value=Math.sin(Math.PI*Math.min(1,v*1.4))*(1-v*.4)*.55,p.scale.set(1-.25*v,.4+.8*Math.min(1,v*2),1-.25*v),p.visible=!0),y=!0}if(g){const v=(f-(g.t0+g.ms*.6))/3e3,w=v<0||v>1?0:Math.sin(Math.PI*Math.min(1,v*2.5))*(1-v*.6);d.uniforms.uK.value=w*.13,d.uniforms.uT.value=f/1e3,x.visible=w>.005}else x.visible=!1;return g&&f>g.t0+g.ms+3500&&(g=null),y||!!g||f-T<1400},pickUp(f){O=f?1:0,f&&M(h,f,.006)},check(f,l){M(e,f,.012),F={t0:l},T=l},promotion(f,l){M(p,f,0),L={t0:l}},tension(f){const l=(f-T)/1400;return l<0||l>1?0:Math.sin(Math.PI*Math.min(1,l*2.2))*(1-l)},glory(f){if(!g)return 0;const l=(f-(g.t0+g.ms*.6))/3e3;return l<0||l>1?0:Math.sin(Math.PI*Math.min(1,l*2.5))*(1-l*.6)},mateAt(f,l,y,v="w"){g={t0:f,ms:l},y&&(M(x,y,0),x.rotation.set(v==="w"?-.32:.32,0,.1))},dispose(){o.removeFromParent(),t.dispose(),R.dispose(),s.dispose(),i.dispose(),m.dispose(),c.dispose(),d.dispose()}}}function vt(o){try{const n=o.getContext(),t=n.getExtension("WEBGL_debug_renderer_info");return t?String(n.getParameter(t.UNMASKED_RENDERER_WEBGL)):void 0}catch{return}}function ht(){const o={};try{const n=new URLSearchParams(location.search).get("vistune");for(const t of(n??"").split(",")){const[i,e]=t.split(":");i&&e!==void 0&&Number.isFinite(Number(e))&&(o[i]=Number(e))}}catch{}return o}function ke(o,n){const t={};for(const i of n)o[i]!==void 0&&(t[i]=o[i]);return t}function bt(o,n={}){const t=o,i=t.q3Debug?.(),e=t.q3EnvHost?.();if(!i||!e||!i.renderer||!i.scene||!i.rig||!i.mats)return null;const{renderer:m,scene:h,camera:R}=i,c=t.q3CameraHost?.()??null,p=typeof location<"u"&&/[?&](qa|q3debug)\b/.test(location.search),s=p?ht():{},d={...Ce,...s.curve!==void 0?{curve:s.curve?"agx":"neutral"}:{},...s.agxPow!==void 0?{power:s.agxPow}:{},...s.agxSat!==void 0?{sat:s.agxSat}:{}},x={...Te,...ke(s,["key","sky","rim","shadow","radius","env","warm"])},C=Qe({renderer:m,rig:i.rig,mats:i.mats,tone:d,mood:x}),O=vt(m),F=We(),L=navigator.deviceMemory;let g=he({boardTier:e.tier(),gpu:O,override:F,memoryGB:L}),T=ge(g);const E=new Ie(g);let M=n.room?.()??"classic";const f=a=>({...a,...ke(s,["exposure","bloom","threshold","knee","contrast","saturation","vignette","pool","grain"]),...s.lift!==void 0?{lift:[s.lift,s.lift,s.lift*1.2]}:{},...s.gamma!==void 0?{gamma:[s.gamma,s.gamma,s.gamma]}:{}});let l=f(ye(M));const y=ot({motes:T.motes});h.add(y.group);const v=()=>y.setColors({mote:l.motes.color,moteOpacity:l.motes.opacity,dust:l.dust.color,dustOpacity:l.dust.opacity});v();const w=Ne(m,h,T,l,{timed:p}),$=lt(h,m,e,o);s.nowin||w.setWindow($),w.setExposure(l.exposure),w.setEnvScale(x.env);let Q=[],G="";const X=performance.now();function u(a){const r=h.getObjectByName("environment"),b=`${M}:${r?.children.length??0}`;b!==G&&(G=b,Q=[],r?.traverse(K=>{const S=K.material;S?.isShaderMaterial&&S.uniforms?.uLive&&Q.push(S)}));const P=!Y;for(const K of Q)K.uniforms.uLive.value.set(P?l.live.water:0,P?l.live.sky:0),K.uniforms.uLiveT.value=(a-X)/1e3}const z=st(h),k=mt();h.add(k.group);const U=a=>{const[r="",b="w"]=a.split(" "),P=b==="w"?"K":"k",K=r.split("/");for(let S=0;S<8;S++){let oe=0;for(const ce of K[S]??""){if(/\d/.test(ce)){oe+=Number(ce);continue}if(ce===P)return"abcdefgh"[oe]+String(8-S);oe++}}return null},_={fwd:new I,pos:new I,t:-1},D=new I;let A=0;function V(a){D.set(0,0,-1).applyQuaternion(R.quaternion);const r=_.t<0?-1:(a-_.t)/1e3;if(r>0&&r<.25){const b=j.radToDeg(D.angleTo(_.fwd))/r,P=R.position.distanceTo(_.pos)/r,K=(c?.mode()??"idle")==="idle",S=T.dof&&!s.nodof&&K&&!e.reducedMotion()?j.smoothstep(Math.max(b/14,P/8),.3,1):0;A+=(S-A)*(1-Math.exp(-r/(S>A?.1:.3)))}else r>=.25&&(A=0);_.fwd.copy(D),_.pos.copy(R.position),_.t=a,A<.01&&(A=0),w.setDof(A),A>0&&e.keepAwake(350)}const q=[],B=new Ke;let W=0,N=0;function te(a){if(!N)return 0;const r=(a-W)/N;return r<0?0:r>1?(N=0,0):r<.2?j.smoothstep(r,0,.2):1-j.smoothstep(r,.35,1)}function H(a){a!==g&&(g=a,T=ge(a),o.dataset.vis=a,w.setQuality(T),y.setMotes(Y?0:T.motes),e.invalidate())}let Y=!1;const ze=w.onFrame(a=>{const r=e.reducedMotion();r!==Y&&(Y=r,y.setMotes(r?0:T.motes),w.setStill(r));const b=n.room?.()??M;for(b!==M&&(M=b,l=f(ye(b)),w.setLook(l),w.setExposure(l.exposure),v());q.length&&q[0].due<=a;)qe(q.shift().i);if(z.apply(a),V(a),k.frame(a)&&e.keepAwake(240),u(a),w.setMoment(Y?0:k.tension(a),Y?0:Math.max(k.glory(a),te(a))),m.getDrawingBufferSize(B),y.frame(a,R,B.y),!F){const P=E.frame(a);P&&H(P)}}),_e=e.onTier(a=>{const r=he({boardTier:a,gpu:O,override:F,memoryGB:L}),b={high:2,mid:1,low:0};H(b[r]<b[E.current]?r:E.current)});function qe(a){if(!e.alive())return;const r=ie(a.square);if(a.kind==="capture")y.burst(r.x,r.z,a.strength,9,.36,!!a.dark),w.hold(60);else if(a.kind==="leaves")y.leaves(r.x,r.z,64,2.1),y.burst(r.x,r.z,1.5,0,.5);else{y.burst(r.x,r.z,a.strength,0,a.piece==="p"?.24:.3);const b=a.from?ie(a.from):null;z.start({x:r.x,z:r.z,dx:b?r.x-b.x:0,dz:b?r.z-b.z:-1,strength:a.strength})}e.keepAwake(1500)}const re={move(a,r){if(!T.puffs||e.reducedMotion())return;const b=performance.now(),P=Je(a,r);for(const S of P)q.push({due:b+S.at,i:S});const K=P.find(S=>S.kind==="land")?.at??0;if(a.flags.check&&!a.flags.mate){const S=U(a.fenAfter);S&&k.check(S,b+K+40)}a.flags.promotion&&k.promotion(a.to,b+K),q.sort((S,oe)=>S.due-oe.due),e.keepAwake(Math.max(...q.map(S=>S.due-b),0)+200)},celebrate(a,r){if(e.reducedMotion()||!r||a!=="checkmate"&&a!=="win")return;const b=performance.now(),P=Math.round(1800*.8);k.mateAt(b,P,r,e.orientation()),q.push({due:b+P,i:{kind:"leaves",at:P,square:r,strength:1.5,piece:"k"}}),q.sort((K,S)=>K.due-S.due),e.keepAwake(P+4e3)},selected(a){e.reducedMotion()||(k.pickUp(a),e.invalidate())},glory(a){e.reducedMotion()||(W=performance.now(),N=Math.max(200,a),e.keepAwake(N+100))},get tier(){return g},dispose(){ze(),_e(),$.dispose(),w.dispose(),y.dispose(),C.dispose(),k.dispose(),q.length=0,z.clear(),delete o.dataset.vis,p&&window.qcVis===le&&delete window.qcVis}},le=p?{tier:()=>g,quality:()=>({...T}),look:()=>({...l}),room:()=>M,gpu:O,stats:()=>({...w.stats(),dof:Math.round(A*100)/100,window:Math.round($.amount()*100)/100}),setTier:H,setMix:a=>{w.setMix(a),e.invalidate()},burst:(a,r=1,b=0)=>{const P=ie(a);y.burst(P.x,P.z,r,b),e.keepAwake(1500)},move:(a,r=!1)=>re.move(a,r),celebrate:(a,r)=>re.celebrate(a,r)}:null;return le&&(window.qcVis=le),o.dataset.vis=g,e.invalidate(),re}export{bt as attachVis};
