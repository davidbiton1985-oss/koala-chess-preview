import{AgXToneMapping as qe,ShaderChunk as de,Color as Z,CanvasTexture as Fe,SRGBColorSpace as Re,Group as Se,BufferGeometry as fe,BufferAttribute as Y,Vector3 as I,ShaderMaterial as ue,AdditiveBlending as Ae,Points as pe,DynamicDrawUsage as Oe,MathUtils as N,Matrix4 as te,PerspectiveCamera as Le,WebGLRenderTarget as Ue,HalfFloatType as Be,LinearSRGBColorSpace as De,PlaneGeometry as Ee,Mesh as oe,CylinderGeometry as me,DoubleSide as ve,NormalBlending as Ge,Vector2 as Ke}from"./three.module-D5rf0S9N.js";import{bP as Ve,bQ as ne}from"./index-CrEAvb_9.js";import{a as We}from"./flag-DbFr3TG9.js";import{v as he,a as ge,l as ye,c as Ie,G as Ne}from"./tier-DuHH4FWc.js";const we={power:1.18,sat:1.1};let Me=!1;function He(o=we.power,n=we.sat){if(Me)return!0;const t=de.tonemapping_pars_fragment,s="vec3 AgXToneMapping( vec3 color ) {",e="// v = agxLook(v, look);";if(!t.includes(s)||!t.includes(e))return!1;const f=`
vec3 visAgxLook( vec3 v ) {
	const vec3 lw = vec3( 0.2126, 0.7152, 0.0722 );
	float luma = dot( v, lw );
	v = pow( max( v, vec3( 0.0 ) ), vec3( ${o.toFixed(3)} ) );
	return luma + ${n.toFixed(3)} * ( v - luma );
}
`;return de.tonemapping_pars_fragment=t.replace(s,f+s).replace(e,"color = visAgxLook( color );"),Me=!0,!0}const Te={key:1.3,sky:.62,rim:.9,shadow:.12,radius:1.25,env:.78,warm:-.035};function je(){if(typeof document>"u")return null;const o=document.createElement("canvas");o.width=o.height=128;const n=o.getContext("2d");if(!n)return null;const t=n.createRadialGradient(64,64,0,64,64,64);t.addColorStop(0,"rgba(10,7,4,1)"),t.addColorStop(.6,"rgba(10,7,4,.96)"),t.addColorStop(.68,"rgba(10,7,4,.74)"),t.addColorStop(.76,"rgba(10,7,4,.40)"),t.addColorStop(.86,"rgba(10,7,4,.14)"),t.addColorStop(.95,"rgba(10,7,4,.03)"),t.addColorStop(1,"rgba(10,7,4,0)"),n.fillStyle=t,n.fillRect(0,0,128,128);const s=new Fe(o);return s.colorSpace=Re,s}const Ce={curve:"neutral"};function Qe(o){const{renderer:n,rig:t,mats:s}=o,e=o.mood??Te,f=o.tone??Ce,h=n.toneMapping;f.curve==="agx"&&(He(f.power,f.sat),n.toneMapping=qe);const F=t.apply,l=t.setQuality,m=()=>{t.key.intensity*=e.key,t.key.color.multiply(new Z(1,1-e.warm*.45,1-e.warm)),t.sky.intensity*=e.sky,t.rim.intensity*=e.rim,t.key.shadow.intensity=Math.min(1,t.key.shadow.intensity+e.shadow)},r=t.key.shadow.radius;t.apply=function(R){F.call(t,R),m()},t.setQuality=function(R){l.call(t,R),t.key.shadow.radius*=e.radius},m(),t.key.shadow.radius=r*e.radius;const p={sq:s.squares.roughness,fr:s.frame.roughness,ri:s.rim.roughness,blob:s.blob.map};s.squares.roughness=Math.max(p.sq,.6),s.frame.roughness=Math.max(p.fr,.64),s.rim.roughness=Math.max(p.ri,.64);const x=je();return x&&p.blob&&(s.blob.map=x),{refresh:m,dispose(){t.apply=F,t.setQuality=l,t.key.shadow.radius=r,n.toneMapping=h,s.squares.roughness=p.sq,s.frame.roughness=p.fr,s.rim.roughness=p.ri,x&&(s.blob.map=p.blob,x.dispose())}}}const be={p:.55,n:.9,b:.7,r:.85,q:.9,k:.9},Xe=520,$e=Math.round(.82*.7*Xe);function Je(o,n=!1){const t=n?0:Ve(o.from,o.to,o.by),s=[{kind:"land",at:t,square:o.to,from:o.from,strength:be[o.piece.type]*(o.flags.promotion?1.2:1),piece:o.piece.type}],e=o.capturedSquare??(o.captured||o.flags.capture?o.to:null);return e&&o.captured&&s.push({kind:"capture",at:Math.round(t*.5)+$e,square:e,strength:1.1+.3*(o.captured.type==="p"?0:1),piece:o.captured.type,dark:o.captured.color==="b"}),o.rookMove&&s.push({kind:"rook",at:90+Math.max(200,t),square:o.rookMove.to,from:o.rookMove.from,strength:be.r*.8,piece:"r"}),s.sort((f,h)=>f.at-h.at)}const Ye=`
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
}`,$=640;function ot(o){const n=new Se;n.name="vis-particles";const t=performance.now();let s=o.seed??49734321;const e=()=>(s=s*16807%2147483647,s/2147483647),f=200,h=new Float32Array(f*3),F=new Float32Array(f*4);for(let u=0;u<f;u++)h.set([e(),e(),e()],u*3),F.set([e(),e(),.034+.04*e()*e(),e()],u*4);const l=new fe;l.setAttribute("position",new Y(h,3)),l.setAttribute("aSeed",new Y(F,4));const m={uTime:{value:0},uCenter:{value:new I(0,2,-.6)},uHalf:{value:new I(5.6,1.6,5.2)},uScale:{value:900},uLive:{value:1},uColor:{value:new Z(1,.93,.8)},uOpacity:{value:.55}},r=new ue({vertexShader:Ye,fragmentShader:Ze,uniforms:m,transparent:!0,depthWrite:!1,blending:Ae,toneMapped:!1}),p=new pe(l,r);p.name="vis-motes",p.frustumCulled=!1,p.renderOrder=3,n.add(p);const x=u=>{const C=Math.max(0,Math.min(f,Math.round(u)));l.setDrawRange(0,C),p.visible=C>0};x(o.motes);const R=new Float32Array($*3),U=new Float32Array($*3),O=new Float32Array($*4),D=new Float32Array($*2);for(let u=0;u<$;u++)O[u*4]=-1e4;const g=new fe,v=new Y(R,3),L=new Y(U,3),_=new Y(O,4),d=new Y(D,2);for(const u of[v,L,_,d])u.setUsage(Oe);g.setAttribute("position",v),g.setAttribute("aVel",L),g.setAttribute("aLife",_),g.setAttribute("aSpin",d);const c={uTime:{value:0},uScale:{value:900},uDust:{value:new Z(.7,.64,.55)},uChip:{value:new Z(.78,.7,.56)},uChipDark:{value:new Z(.2,.16,.13)},uOpacity:{value:.36}},M=new ue({vertexShader:et,fragmentShader:tt,uniforms:c,transparent:!0,depthWrite:!1,toneMapped:!1}),y=new pe(g,M);y.name="vis-bursts",y.frustumCulled=!1,y.renderOrder=2,n.add(y);let w=0,G=0;const V=()=>(performance.now()-t)/1e3;function W(u,C,S,B,z,E,A,H,P,T,j,Q=0,se=e()){R.set([C,S,B],u*3),U.set([z,E,A],u*3),O.set([H,P,T,j],u*4),D.set([Q,se],u*2)}const X=(u,C)=>{for(const S of[v,L,_,d])S.needsUpdate=!0;G=Math.max(G,u+C),y.visible=!0};return{group:n,frame(u,C,S){const B=(u-t)/1e3;m.uTime.value=B,c.uTime.value=B;const z=S/(2*Math.tan(N.degToRad(C.fov)/2));m.uScale.value=z,c.uScale.value=z;const E=C.getWorldDirection(at),A=N.radToDeg(Math.asin(Math.min(1,Math.max(-1,-E.y))));m.uLive.value=N.smoothstep(68-A,0,16),y.visible=B<G},burst(u,C,S,B=0,z=.3,E=!1){const A=V(),H=Math.round(14+12*S);for(let P=0;P<H;P++){const T=P/H*Math.PI*2+e()*.6,j=z*(.8+.3*e()),Q=(1.3+1.5*e())*(.6+.5*S);W(w,u+Math.cos(T)*j,.02+.03*e(),C+Math.sin(T)*j,Math.cos(T)*Q,.06+.2*e()*S,Math.sin(T)*Q,A+.015*e(),.6+.4*e(),(.12+.1*e())*(.65+.4*S),0),w=(w+1)%$}for(let P=0;P<B;P++){const T=e()*Math.PI*2,j=.8+1.6*e();W(w,u+Math.cos(T)*z*.5,.18+.32*e(),C+Math.sin(T)*z*.5,Math.cos(T)*j,.9+1.3*e(),Math.sin(T)*j,A+.01*e(),1.3+.6*e(),.05+.07*e()*e(),E?2:1,(e()<.5?-1:1)*(1.2+2.4*e())),w=(w+1)%$}return X(A,2),2e3},leaves(u,C,S,B=1.6){const z=V();for(let E=0;E<S;E++){const A=e()*Math.PI*2,H=.6+1.6*e();W(w,u+Math.cos(A)*.2*B,.9+.8*e(),C+Math.sin(A)*.2*B,Math.cos(A)*H*B,1.8+2*e(),Math.sin(A)*H*B,z+.3*e(),3.4+1.8*e(),.22+.14*e(),3,(e()<.5?-1:1)*(.3+.9*e())),w=(w+1)%$}X(z,5.2)},setMotes:x,setColors(u){m.uColor.value.setRGB(u.mote[0],u.mote[1],u.mote[2]),m.uOpacity.value=u.moteOpacity,c.uDust.value.setRGB(u.dust[0],u.dust[1],u.dust[2]),c.uOpacity.value=u.dustOpacity,c.uChip.value.setRGB(u.dust[0]*.86,u.dust[1]*.8,u.dust[2]*.7)},dispose(){n.removeFromParent(),l.dispose(),r.dispose(),g.dispose(),M.dispose()}}}const at=new I;function nt(o,n){return o<0||o>.6?0:N.degToRad(3.4)*Math.min(1.2,n)*Math.sin(2*Math.PI*5.5*o)*Math.exp(-o/.12)}const xe=.27;function st(o){const n=[],t=new te,s=new te,e=new te,f=new te,h=new I,F=()=>o.children.filter(l=>l.isInstancedMesh===!0&&l.material.isMeshStandardMaterial===!0);return{start(l){const m=Math.hypot(l.dx,l.dz),r=m>1e-4?{dx:l.dx/m,dz:l.dz/m}:{dx:0,dz:-1};for(let p=n.length-1;p>=0;p--)Math.abs(n[p].x-l.x)<.1&&Math.abs(n[p].z-l.z)<.1&&n.splice(p,1);n.push({...l,...r,t0:performance.now()})},apply(l){for(let r=n.length-1;r>=0;r--)(l-n[r].t0)/1e3>.6&&n.splice(r,1);if(!n.length)return!1;const m=F();for(const r of n){const p=nt((l-r.t0)/1e3,r.strength);if(Math.abs(p)<1e-5)continue;const x=p>0?1:-1,R=r.x+r.dx*xe*x,U=r.z+r.dz*xe*x;h.set(r.dz,0,-r.dx).normalize(),s.makeRotationAxis(h,p),e.makeTranslation(R,0,U),f.makeTranslation(-R,0,-U);for(const O of m){let D=!1;for(let g=0;g<O.count;g++){O.getMatrixAt(g,t);const v=t.elements;Math.abs(v[12]-r.x)>.12||Math.abs(v[14]-r.z)>.12||v[13]>.03||(t.premultiply(f).premultiply(s).premultiply(e),O.setMatrixAt(g,t),D=!0)}D&&(O.instanceMatrix.needsUpdate=!0)}}return!0},clear(){n.length=0}}}const rt=320,it=140,ae=4.25;function lt(o,n,t,s){const e=new Le(16,3,.5,600);let f=null,h=0,F=-1,l=null,m=null;new I;const r=new I,p=new I,x=[new I,new I];function R(){(!m||!m.parent)&&(m=o.getObjectByName("environment")??null),(!l||!l.parent||!l.userData.visWindow)&&(l=m?.getObjectByName("room-koala")??null)}const U=()=>l?.userData?.visWindow??null;function O(v){const L=t.orientation()==="w"?-ae:ae;return x[0].set(-ae,.09,L).project(v),x[1].set(ae,.09,L).project(v),(Math.max(x[0].y,x[1].y)+1)/2}function D(v,L){const _=L>v*1.15,d=U();return _&&!!d&&(!!t.isFlat?.()||!!d.flat)}const g=()=>{const v=Number(s?.dataset.visCoverTop??0);return Number.isFinite(v)?N.clamp(v,0,.6):0};return{frame(v,L,_,d,c){R();const M=F<0?0:Math.min(100,v-F);F=v;const w=D(_,d)?1:0;h=t.reducedMotion()?w:N.clamp(h+(w>h?M/rt:-M/it),0,1),h!==w&&t.keepAwake(120);const G=U();if(G&&(G.live=h>.001),h<=.001||!G||!l)return null;const V=O(L)+6/d,W=1-g();if(W-V<.07)return null;const X=Math.max(16,Math.round((W-V)*d*.8)),u=Math.max(16,Math.round(_*.8));(!f||f.width!==u||f.height!==X)&&(f?.dispose(),f=new Ue(u,X,{type:Be,depthBuffer:!0,samples:0}),f.texture.colorSpace=De,f.isXRRenderTarget=!0),r.copy(G.eye),l.parent?.localToWorld(r),l.updateMatrixWorld(),l.geometry.boundingBox||l.geometry.computeBoundingBox();const C=(l.geometry.boundingBox?.max.y??1)*l.scale.y;l.getWorldPosition(p),p.y+=C*.62;const S=r.distanceTo(p);e.position.copy(r),e.up.set(0,1,0),e.lookAt(p),e.aspect=u/X;const B=(W-V)*d/Math.max(1,n.getPixelRatio()),z=Math.min(.81,170/Math.max(1,B));e.fov=N.clamp(N.radToDeg(2*Math.atan(C*.5/z/Math.max(.5,S))),8,60),e.updateProjectionMatrix(),e.updateMatrixWorld();const E=[];for(const T of o.children)T.visible&&T!==m&&!T.isLight&&(T.visible=!1,E.push(T));const A=l.visible,H=n.shadowMap.autoUpdate,P=n.getRenderTarget();l.visible=!0,G.pass=!0,n.shadowMap.autoUpdate=!1;try{n.setRenderTarget(f),n.clear(!0,!0,!1),c(o,e)}finally{G.pass=!1,l.visible=A,n.shadowMap.autoUpdate=H,n.setRenderTarget(P);for(const T of E)T.visible=!0}return{tex:f.texture,y0:V,y1:W,fade:Math.min(.12,(W-V)*.45),alpha:h*h*(3-2*h)}},amount:()=>h,dispose(){const v=U();v&&(v.live=!1,v.pass=!1),f?.dispose(),f=null}}}const ct="varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",ut=`
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
}`;function mt(){const o=new Se;o.name="vis-moments";const n=(d,c,M,y={})=>new ue({vertexShader:ct,fragmentShader:d,transparent:!0,depthWrite:!1,toneMapped:!1,blending:M?Ae:Ge,uniforms:{uColor:{value:new Z(c)},uK:{value:0},...y}}),t=new Ee(1,1).rotateX(-Math.PI/2),s=n(ut,14704698,!1,{uR:{value:.5},uW:{value:.12}}),e=new oe(t,s);e.renderOrder=2,e.visible=!1,e.scale.setScalar(1.6);const f=n(dt,16769712,!0),h=new oe(t,f);h.renderOrder=1,h.visible=!1,h.scale.setScalar(1.9);const F=new me(.34,.42,3.2,32,1,!0).translate(0,1.6,0),l=n(ft,16771e3,!0);l.side=ve;const m=new oe(F,l);m.renderOrder=3,m.visible=!1;const r=new me(.42,1.55,11,48,1,!0).translate(0,5.5,0),p=n(pt,16771268,!0,{uT:{value:0}});p.side=ve;const x=new oe(r,p);x.renderOrder=4,x.visible=!1,o.add(h,e,m,x);let R=0,U=0,O=null,D=null,g=null,v=-1e9,L=-1;const _=(d,c,M)=>{const y=ne(c);d.position.set(y.x,M,y.z)};return{group:o,frame(d){const c=L<0?16:Math.min(80,d-L);L=d,R+=(U-R)*(1-Math.exp(-c/90)),f.uniforms.uK.value=R*.16,h.visible=R>.01;let M=Math.abs(U-R)>.01;if(O){const y=(d-O.t0)/900;if(y<0)e.visible=!1;else if(y>=1)O=null,e.visible=!1;else{const w=y*2%1;s.uniforms.uR.value=.25+.55*(1-Math.pow(1-w,3)),s.uniforms.uK.value=.75*(1-w),e.visible=!0}M=!0}if(D){const y=(d-D.t0)/1100;y<0?m.visible=!1:y>=1?(D=null,m.visible=!1):(l.uniforms.uK.value=Math.sin(Math.PI*Math.min(1,y*1.4))*(1-y*.4)*.55,m.scale.set(1-.25*y,.4+.8*Math.min(1,y*2),1-.25*y),m.visible=!0),M=!0}if(g){const y=(d-(g.t0+g.ms*.6))/3e3,w=y<0||y>1?0:Math.sin(Math.PI*Math.min(1,y*2.5))*(1-y*.6);p.uniforms.uK.value=w*.13,p.uniforms.uT.value=d/1e3,x.visible=w>.005}else x.visible=!1;return g&&d>g.t0+g.ms+3500&&(g=null),M||!!g||d-v<1400},pickUp(d){U=d?1:0,d&&_(h,d,.006)},check(d,c){_(e,d,.012),O={t0:c},v=c},promotion(d,c){_(m,d,0),D={t0:c}},tension(d){const c=(d-v)/1400;return c<0||c>1?0:Math.sin(Math.PI*Math.min(1,c*2.2))*(1-c)},glory(d){if(!g)return 0;const c=(d-(g.t0+g.ms*.6))/3e3;return c<0||c>1?0:Math.sin(Math.PI*Math.min(1,c*2.5))*(1-c*.6)},mateAt(d,c,M,y="w"){g={t0:d,ms:c},M&&(_(x,M,0),x.rotation.set(y==="w"?-.32:.32,0,.1))},dispose(){o.removeFromParent(),t.dispose(),F.dispose(),r.dispose(),s.dispose(),f.dispose(),l.dispose(),p.dispose()}}}function vt(o){try{const n=o.getContext(),t=n.getExtension("WEBGL_debug_renderer_info");return t?String(n.getParameter(t.UNMASKED_RENDERER_WEBGL)):void 0}catch{return}}function ht(){const o={};try{const n=new URLSearchParams(location.search).get("vistune");for(const t of(n??"").split(",")){const[s,e]=t.split(":");s&&e!==void 0&&Number.isFinite(Number(e))&&(o[s]=Number(e))}}catch{}return o}function ke(o,n){const t={};for(const s of n)o[s]!==void 0&&(t[s]=o[s]);return t}function bt(o,n={}){const t=o,s=t.q3Debug?.(),e=t.q3EnvHost?.();if(!s||!e||!s.renderer||!s.scene||!s.rig||!s.mats)return null;const{renderer:f,scene:h,camera:F}=s,l=t.q3CameraHost?.()??null,m=typeof location<"u"&&/[?&](qa|q3debug)\b/.test(location.search),r=m?ht():{},p={...Ce,...r.curve!==void 0?{curve:r.curve?"agx":"neutral"}:{},...r.agxPow!==void 0?{power:r.agxPow}:{},...r.agxSat!==void 0?{sat:r.agxSat}:{}},x={...Te,...ke(r,["key","sky","rim","shadow","radius","env","warm"])},R=Qe({renderer:f,rig:s.rig,mats:s.mats,tone:p,mood:x}),U=vt(f),O=We(),D=navigator.deviceMemory;let g=he({boardTier:e.tier(),gpu:U,override:O,memoryGB:D}),v=ge(g);const L=new Ne(g);let _=n.room?.()??"classic";const d=a=>({...a,...ke(r,["exposure","bloom","threshold","knee","contrast","saturation","vignette","pool","grain"]),...r.lift!==void 0?{lift:[r.lift,r.lift,r.lift*1.2]}:{},...r.gamma!==void 0?{gamma:[r.gamma,r.gamma,r.gamma]}:{}});let c=d(ye(_));const M=ot({motes:v.motes});h.add(M.group);const y=()=>M.setColors({mote:c.motes.color,moteOpacity:c.motes.opacity,dust:c.dust.color,dustOpacity:c.dust.opacity});y();const w=Ie(f,h,v,c,{timed:m}),G=lt(h,f,e,o);r.nowin||w.setWindow(G),w.setExposure(c.exposure),w.setEnvScale(x.env);let V=[],W="";const X=performance.now();function u(a){const i=h.getObjectByName("environment"),b=`${_}:${i?.children.length??0}`;b!==W&&(W=b,V=[],i?.traverse(K=>{const k=K.material;k?.isShaderMaterial&&k.uniforms?.uLive&&V.push(k)}));const q=!J;for(const K of V)K.uniforms.uLive.value.set(q?c.live.water:0,q?c.live.sky:0),K.uniforms.uLiveT.value=(a-X)/1e3}const C=st(h),S=mt();h.add(S.group);const B=a=>{const[i="",b="w"]=a.split(" "),q=b==="w"?"K":"k",K=i.split("/");for(let k=0;k<8;k++){let ee=0;for(const ce of K[k]??""){if(/\d/.test(ce)){ee+=Number(ce);continue}if(ce===q)return"abcdefgh"[ee]+String(8-k);ee++}}return null},z={fwd:new I,pos:new I,t:-1},E=new I;let A=0;function H(a){E.set(0,0,-1).applyQuaternion(F.quaternion);const i=z.t<0?-1:(a-z.t)/1e3;if(i>0&&i<.25){const b=N.radToDeg(E.angleTo(z.fwd))/i,q=F.position.distanceTo(z.pos)/i,K=(l?.mode()??"idle")==="idle",k=v.dof&&!r.nodof&&K&&!e.reducedMotion()?N.smoothstep(Math.max(b/14,q/8),.3,1):0;A+=(k-A)*(1-Math.exp(-i/(k>A?.1:.3)))}else i>=.25&&(A=0);z.fwd.copy(E),z.pos.copy(F.position),z.t=a,A<.01&&(A=0),w.setDof(A),A>0&&e.keepAwake(350)}const P=[],T=new Ke;let j=0,Q=0;function se(a){if(!Q)return 0;const i=(a-j)/Q;return i<0?0:i>1?(Q=0,0):i<.2?N.smoothstep(i,0,.2):1-N.smoothstep(i,.35,1)}function re(a){a!==g&&(g=a,v=ge(a),o.dataset.vis=a,w.setQuality(v),M.setMotes(J?0:v.motes),e.invalidate())}let J=!1;const ze=w.onFrame(a=>{const i=e.reducedMotion();i!==J&&(J=i,M.setMotes(i?0:v.motes),w.setStill(i));const b=n.room?.()??_;for(b!==_&&(_=b,c=d(ye(b)),w.setLook(c),w.setExposure(c.exposure),y());P.length&&P[0].due<=a;)Pe(P.shift().i);if(C.apply(a),H(a),S.frame(a)&&e.keepAwake(240),u(a),w.setMoment(J?0:S.tension(a),J?0:Math.max(S.glory(a),se(a))),f.getDrawingBufferSize(T),M.frame(a,F,T.y),!O){const q=L.frame(a);q&&re(q)}}),_e=e.onTier(a=>{const i=he({boardTier:a,gpu:U,override:O,memoryGB:D}),b={high:2,mid:1,low:0};re(b[i]<b[L.current]?i:L.current)});function Pe(a){if(!e.alive())return;const i=ne(a.square);if(a.kind==="capture")M.burst(i.x,i.z,a.strength,9,.36,!!a.dark),w.hold(60);else if(a.kind==="leaves")M.leaves(i.x,i.z,64,2.1),M.burst(i.x,i.z,1.5,0,.5);else{M.burst(i.x,i.z,a.strength,0,a.piece==="p"?.24:.3);const b=a.from?ne(a.from):null;C.start({x:i.x,z:i.z,dx:b?i.x-b.x:0,dz:b?i.z-b.z:-1,strength:a.strength})}e.keepAwake(1500)}const ie={move(a,i){if(!v.puffs||e.reducedMotion())return;const b=performance.now(),q=Je(a,i);for(const k of q)P.push({due:b+k.at,i:k});const K=q.find(k=>k.kind==="land")?.at??0;if(a.flags.check&&!a.flags.mate){const k=B(a.fenAfter);k&&S.check(k,b+K+40)}a.flags.promotion&&S.promotion(a.to,b+K),P.sort((k,ee)=>k.due-ee.due),e.keepAwake(Math.max(...P.map(k=>k.due-b),0)+200)},celebrate(a,i){if(e.reducedMotion()||!i||a!=="checkmate"&&a!=="win")return;const b=performance.now(),q=Math.round(1800*.8);S.mateAt(b,q,i,e.orientation()),P.push({due:b+q,i:{kind:"leaves",at:q,square:i,strength:1.5,piece:"k"}}),P.sort((K,k)=>K.due-k.due),e.keepAwake(q+4e3)},selected(a){e.reducedMotion()||(S.pickUp(a),e.invalidate())},glory(a){e.reducedMotion()||(j=performance.now(),Q=Math.max(200,a),e.keepAwake(Q+100))},get tier(){return g},dispose(){ze(),_e(),G.dispose(),w.dispose(),M.dispose(),R.dispose(),S.dispose(),P.length=0,C.clear(),delete o.dataset.vis,m&&window.qcVis===le&&delete window.qcVis}},le=m?{tier:()=>g,quality:()=>({...v}),look:()=>({...c}),room:()=>_,gpu:U,stats:()=>({...w.stats(),dof:Math.round(A*100)/100,window:Math.round(G.amount()*100)/100}),setTier:re,setMix:a=>{w.setMix(a),e.invalidate()},burst:(a,i=1,b=0)=>{const q=ne(a);M.burst(q.x,q.z,i,b),e.keepAwake(1500)},move:(a,i=!1)=>ie.move(a,i),celebrate:(a,i)=>ie.celebrate(a,i)}:null;return le&&(window.qcVis=le),o.dataset.vis=g,e.invalidate(),ie}export{bt as attachVis};
