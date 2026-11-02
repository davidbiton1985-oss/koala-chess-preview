import{AgXToneMapping as Oe,ShaderChunk as me,Color as ee,CanvasTexture as qe,SRGBColorSpace as Pe,Group as Ce,BufferGeometry as ve,BufferAttribute as Z,Vector3 as H,ShaderMaterial as pe,AdditiveBlending as _e,Points as he,DynamicDrawUsage as Re,MathUtils as N,Matrix4 as ne,PerspectiveCamera as Ue,WebGLRenderTarget as Le,HalfFloatType as Be,LinearSRGBColorSpace as De,PlaneGeometry as Ee,Mesh as se,CylinderGeometry as ge,DoubleSide as ye,NormalBlending as Ge,Vector2 as Ke}from"./three.module-D5rf0S9N.js";import{bT as Ve,bU as re}from"./index-NDq2meRv.js";import{a as We}from"./flag-BCTPWmea.js";import{v as we,a as Me,l as be,c as Ne,G as Ie}from"./tier-DuHH4FWc.js";const xe={power:1.18,sat:1.1};let ke=!1;function He(o=xe.power,n=xe.sat){if(ke)return!0;const t=me.tonemapping_pars_fragment,s="vec3 AgXToneMapping( vec3 color ) {",e="// v = agxLook(v, look);";if(!t.includes(s)||!t.includes(e))return!1;const v=`
vec3 visAgxLook( vec3 v ) {
	const vec3 lw = vec3( 0.2126, 0.7152, 0.0722 );
	float luma = dot( v, lw );
	v = pow( max( v, vec3( 0.0 ) ), vec3( ${o.toFixed(3)} ) );
	return luma + ${n.toFixed(3)} * ( v - luma );
}
`;return me.tonemapping_pars_fragment=t.replace(s,v+s).replace(e,"color = visAgxLook( color );"),ke=!0,!0}const ze={key:1.3,sky:.62,rim:.9,shadow:.12,radius:1.25,env:.78,warm:-.035};function je(){if(typeof document>"u")return null;const o=document.createElement("canvas");o.width=o.height=128;const n=o.getContext("2d");if(!n)return null;const t=n.createRadialGradient(64,64,0,64,64,64);t.addColorStop(0,"rgba(10,7,4,1)"),t.addColorStop(.6,"rgba(10,7,4,.96)"),t.addColorStop(.68,"rgba(10,7,4,.74)"),t.addColorStop(.76,"rgba(10,7,4,.40)"),t.addColorStop(.86,"rgba(10,7,4,.14)"),t.addColorStop(.95,"rgba(10,7,4,.03)"),t.addColorStop(1,"rgba(10,7,4,0)"),n.fillStyle=t,n.fillRect(0,0,128,128);const s=new qe(o);return s.colorSpace=Pe,s}const Fe={curve:"neutral"};function Qe(o){const{renderer:n,rig:t,mats:s}=o,e=o.mood??ze,v=o.tone??Fe,g=n.toneMapping;v.curve==="agx"&&(He(v.power,v.sat),n.toneMapping=Oe);const P=t.apply,m=t.setQuality,u=()=>{t.key.intensity*=e.key,t.key.color.multiply(new ee(1,1-e.warm*.45,1-e.warm)),t.sky.intensity*=e.sky,t.rim.intensity*=e.rim,t.key.shadow.intensity=Math.min(1,t.key.shadow.intensity+e.shadow)},i=t.key.shadow.radius;t.apply=function(C){P.call(t,C),u()},t.setQuality=function(C){m.call(t,C),t.key.shadow.radius*=e.radius},u(),t.key.shadow.radius=i*e.radius;const f={sq:s.squares.roughness,fr:s.frame.roughness,ri:s.rim.roughness,blob:s.blob.map};s.squares.roughness=Math.max(f.sq,.6),s.frame.roughness=Math.max(f.fr,.64),s.rim.roughness=Math.max(f.ri,.64);const w=je();return w&&f.blob&&(s.blob.map=w),{refresh:u,dispose(){t.apply=P,t.setQuality=m,t.key.shadow.radius=i,n.toneMapping=g,s.squares.roughness=f.sq,s.frame.roughness=f.fr,s.rim.roughness=f.ri,w&&(s.blob.map=f.blob,w.dispose())}}}const Se={p:.55,n:.9,b:.7,r:.85,q:.9,k:.9},Xe=520,$e=Math.round(.82*.7*Xe);function Je(o,n=!1){const t=n?0:Ve(o.from,o.to,o.by),s=[{kind:"land",at:t,square:o.to,from:o.from,strength:Se[o.piece.type]*(o.flags.promotion?1.2:1),piece:o.piece.type}],e=o.capturedSquare??(o.captured||o.flags.capture?o.to:null);return e&&o.captured&&s.push({kind:"capture",at:Math.round(t*.5)+$e,square:e,strength:1.1+.3*(o.captured.type==="p"?0:1),piece:o.captured.type,dark:o.captured.color==="b"}),o.rookMove&&s.push({kind:"rook",at:90+Math.max(200,t),square:o.rookMove.to,from:o.rookMove.from,strength:Se.r*.8,piece:"r"}),s.sort((v,g)=>v.at-g.at)}const Ye=`
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
}`,J=640;function ot(o){const n=new Ce;n.name="vis-particles";const t=performance.now();let s=o.seed??49734321;const e=()=>(s=s*16807%2147483647,s/2147483647),v=200,g=new Float32Array(v*3),P=new Float32Array(v*4);for(let d=0;d<v;d++)g.set([e(),e(),e()],d*3),P.set([e(),e(),.034+.04*e()*e(),e()],d*4);const m=new ve;m.setAttribute("position",new Z(g,3)),m.setAttribute("aSeed",new Z(P,4));const u={uTime:{value:0},uCenter:{value:new H(0,2,-.6)},uHalf:{value:new H(5.6,1.6,5.2)},uScale:{value:900},uLive:{value:1},uColor:{value:new ee(1,.93,.8)},uOpacity:{value:.55}},i=new pe({vertexShader:Ye,fragmentShader:Ze,uniforms:u,transparent:!0,depthWrite:!1,blending:_e,toneMapped:!1}),f=new he(m,i);f.name="vis-motes",f.frustumCulled=!1,f.renderOrder=3,n.add(f);const w=d=>{const z=Math.max(0,Math.min(v,Math.round(d)));m.setDrawRange(0,z),f.visible=z>0};w(o.motes);const C=new Float32Array(J*3),R=new Float32Array(J*3),_=new Float32Array(J*4),B=new Float32Array(J*2);for(let d=0;d<J;d++)_[d*4]=-1e4;const h=new ve,A=new Z(C,3),E=new Z(R,3),U=new Z(_,4),c=new Z(B,2);for(const d of[A,E,U,c])d.setUsage(Re);h.setAttribute("position",A),h.setAttribute("aVel",E),h.setAttribute("aLife",U),h.setAttribute("aSpin",c);const l={uTime:{value:0},uScale:{value:900},uDust:{value:new ee(.7,.64,.55)},uChip:{value:new ee(.78,.7,.56)},uChipDark:{value:new ee(.2,.16,.13)},uOpacity:{value:.36}},M=new pe({vertexShader:et,fragmentShader:tt,uniforms:l,transparent:!0,depthWrite:!1,toneMapped:!1}),p=new he(h,M);p.name="vis-bursts",p.frustumCulled=!1,p.renderOrder=2,n.add(p);let y=0,I=0;const Y=()=>(performance.now()-t)/1e3;function Q(d,z,b,O,T,L,k,j,F,D,K,V=0,te=e()){C.set([z,b,O],d*3),R.set([T,L,k],d*3),_.set([j,F,D,K],d*4),B.set([V,te],d*2)}const G=(d,z)=>{for(const b of[A,E,U,c])b.needsUpdate=!0;I=Math.max(I,d+z),p.visible=!0};return{group:n,frame(d,z,b){const O=(d-t)/1e3;u.uTime.value=O,l.uTime.value=O;const T=b/(2*Math.tan(N.degToRad(z.fov)/2));u.uScale.value=T,l.uScale.value=T;const L=z.getWorldDirection(at),k=N.radToDeg(Math.asin(Math.min(1,Math.max(-1,-L.y))));u.uLive.value=N.smoothstep(68-k,0,16),p.visible=O<I},burst(d,z,b,O=0,T=.3,L=!1){const k=Y(),j=Math.round(14+12*b);for(let F=0;F<j;F++){const D=F/j*Math.PI*2+e()*.6,K=T*(.8+.3*e()),V=(1.3+1.5*e())*(.6+.5*b);Q(y,d+Math.cos(D)*K,.02+.03*e(),z+Math.sin(D)*K,Math.cos(D)*V,.06+.2*e()*b,Math.sin(D)*V,k+.015*e(),.6+.4*e(),(.12+.1*e())*(.65+.4*b),0),y=(y+1)%J}for(let F=0;F<O;F++){const D=e()*Math.PI*2,K=.8+1.6*e();Q(y,d+Math.cos(D)*T*.5,.18+.32*e(),z+Math.sin(D)*T*.5,Math.cos(D)*K,.9+1.3*e(),Math.sin(D)*K,k+.01*e(),1.3+.6*e(),.05+.07*e()*e(),L?2:1,(e()<.5?-1:1)*(1.2+2.4*e())),y=(y+1)%J}return G(k,2),2e3},leaves(d,z,b,O=1.6){const T=Y();for(let L=0;L<b;L++){const k=e()*Math.PI*2,j=.6+1.6*e();Q(y,d+Math.cos(k)*.2*O,.9+.8*e(),z+Math.sin(k)*.2*O,Math.cos(k)*j*O,1.8+2*e(),Math.sin(k)*j*O,T+.3*e(),3.4+1.8*e(),.22+.14*e(),3,(e()<.5?-1:1)*(.3+.9*e())),y=(y+1)%J}G(T,5.2)},setMotes:w,setColors(d){u.uColor.value.setRGB(d.mote[0],d.mote[1],d.mote[2]),u.uOpacity.value=d.moteOpacity,l.uDust.value.setRGB(d.dust[0],d.dust[1],d.dust[2]),l.uOpacity.value=d.dustOpacity,l.uChip.value.setRGB(d.dust[0]*.86,d.dust[1]*.8,d.dust[2]*.7)},dispose(){n.removeFromParent(),m.dispose(),i.dispose(),h.dispose(),M.dispose()}}}const at=new H;function nt(o,n){return o<0||o>.6?0:N.degToRad(3.4)*Math.min(1.2,n)*Math.sin(2*Math.PI*5.5*o)*Math.exp(-o/.12)}const Ae=.27;function st(o){const n=[],t=new ne,s=new ne,e=new ne,v=new ne,g=new H,P=()=>o.children.filter(m=>m.isInstancedMesh===!0&&m.material.isMeshStandardMaterial===!0);return{start(m){const u=Math.hypot(m.dx,m.dz),i=u>1e-4?{dx:m.dx/u,dz:m.dz/u}:{dx:0,dz:-1};for(let f=n.length-1;f>=0;f--)Math.abs(n[f].x-m.x)<.1&&Math.abs(n[f].z-m.z)<.1&&n.splice(f,1);n.push({...m,...i,t0:performance.now()})},apply(m){for(let i=n.length-1;i>=0;i--)(m-n[i].t0)/1e3>.6&&n.splice(i,1);if(!n.length)return!1;const u=P();for(const i of n){const f=nt((m-i.t0)/1e3,i.strength);if(Math.abs(f)<1e-5)continue;const w=f>0?1:-1,C=i.x+i.dx*Ae*w,R=i.z+i.dz*Ae*w;g.set(i.dz,0,-i.dx).normalize(),s.makeRotationAxis(g,f),e.makeTranslation(C,0,R),v.makeTranslation(-C,0,-R);for(const _ of u){let B=!1;for(let h=0;h<_.count;h++){_.getMatrixAt(h,t);const A=t.elements;Math.abs(A[12]-i.x)>.12||Math.abs(A[14]-i.z)>.12||A[13]>.03||(t.premultiply(v).premultiply(s).premultiply(e),_.setMatrixAt(h,t),B=!0)}B&&(_.instanceMatrix.needsUpdate=!0)}}return!0},clear(){n.length=0}}}const it=320,rt=140,ie=4.25,lt=450,ct=600,ut=1.4,dt=1.6;function ft(o,n,t,s){const e=new Ue(16,3,.5,600);let v=null,g=0,P=-1,m=0,u=null,i=null,f=null,w=null;new H;const C=new H,R=new H,_=[new H,new H];function B(){(!i||!i.parent)&&(i=o.getObjectByName("environment")??null),(!u||!u.parent||!u.userData.visWindow)&&(u=i?.getObjectByName("room-koala")??null),(!f||!f.parent)&&(f=i?.getObjectByName("koala-chair")??null),(!w||!w.parent)&&(w=i?.getObjectByName("room-tabletop")??null)}const h=()=>u?.userData?.visWindow??null;function A(c){const l=t.orientation()==="w"?-ie:ie;return _[0].set(-ie,.09,l).project(c),_[1].set(ie,.09,l).project(c),(Math.max(_[0].y,_[1].y)+1)/2}function E(c,l){const M=l>c*1.15,p=h();return M&&!!p&&(!!t.isFlat?.()||!!p.flat)}const U=()=>{const c=Number(s?.dataset.visCoverTop??0);return Number.isFinite(c)?N.clamp(c,0,.6):0};return{frame(c,l,M,p,y){B();const I=P<0?0:Math.min(100,c-P);P=c;const Q=E(M,p)?1:0;g=t.reducedMotion()?Q:N.clamp(g+(Q>g?I/it:-I/rt),0,1),g!==Q&&t.keepAwake(120);const G=h();if(G&&(G.live=g>.001),g<=.001||!G||!u)return null;const d=G.focus?1:0;m=t.reducedMotion()?0:N.clamp(m+(d>m?I/lt:-I/ct),0,1),m!==d&&!t.reducedMotion()&&t.keepAwake(120);const z=m*m*(3-2*m),b=A(l)+6/p,O=1-U();if(O-b<.07)return null;const T=Math.max(16,Math.round((O-b)*p*.8)),L=Math.max(16,Math.round(M*.8));(!v||v.width!==L||v.height!==T)&&(v?.dispose(),v=new Le(L,T,{type:Be,depthBuffer:!0,samples:0}),v.texture.colorSpace=De,v.isXRRenderTarget=!0),C.copy(G.eye),u.parent?.localToWorld(C),u.updateMatrixWorld(),u.geometry.boundingBox||u.geometry.computeBoundingBox();const k=(u.geometry.boundingBox?.max.y??1)*u.scale.y;u.getWorldPosition(R),R.y+=k*(.62+.08*z);const j=C.distanceTo(R);e.position.copy(C),e.up.set(0,1,0),e.lookAt(R),e.aspect=L/T;const F=(O-b)*p/Math.max(1,n.getPixelRatio()),K=Math.min(.81,170/Math.max(1,F))*(1+((F<140?dt:ut)-1)*z);e.fov=N.clamp(N.radToDeg(2*Math.atan(k*.5/K/Math.max(.5,j))),8-4*z,60),typeof location<"u"&&location.search.includes("q3debug")&&(G.qa={fov:+e.fov.toFixed(2),fill:+K.toFixed(3),fk:+m.toFixed(2),stripCss:Math.round(F)}),e.updateProjectionMatrix(),e.updateMatrixWorld();const V=[];for(const X of o.children)X.visible&&X!==i&&!X.isLight&&(X.visible=!1,V.push(X));const te=u.visible,oe=f?.visible??!1,$=w?.visible??!1,le=n.shadowMap.autoUpdate,ce=n.getRenderTarget();u.visible=!0,G.pass=!0,n.shadowMap.autoUpdate=!1,f&&f.children.length&&(f.visible=!0),w&&(w.visible=!0);try{n.setRenderTarget(v),n.clear(!0,!0,!1),y(o,e)}finally{G.pass=!1,u.visible=te,n.shadowMap.autoUpdate=le,f&&(f.visible=oe),w&&(w.visible=$),n.setRenderTarget(ce);for(const X of V)X.visible=!0}return{tex:v.texture,y0:b,y1:O,fade:Math.min(.12,(O-b)*.45),alpha:g*g*(3-2*g)}},amount:()=>g,dispose(){const c=h();c&&(c.live=!1,c.pass=!1),v?.dispose(),v=null}}}const pt="varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",mt=`
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
}`;function yt(){const o=new Ce;o.name="vis-moments";const n=(c,l,M,p={})=>new pe({vertexShader:pt,fragmentShader:c,transparent:!0,depthWrite:!1,toneMapped:!1,blending:M?_e:Ge,uniforms:{uColor:{value:new ee(l)},uK:{value:0},...p}}),t=new Ee(1,1).rotateX(-Math.PI/2),s=n(mt,14704698,!1,{uR:{value:.5},uW:{value:.12}}),e=new se(t,s);e.renderOrder=2,e.visible=!1,e.scale.setScalar(1.6);const v=n(vt,16769712,!0),g=new se(t,v);g.renderOrder=1,g.visible=!1,g.scale.setScalar(1.9);const P=new ge(.34,.42,3.2,32,1,!0).translate(0,1.6,0),m=n(ht,16771e3,!0);m.side=ye;const u=new se(P,m);u.renderOrder=3,u.visible=!1;const i=new ge(.42,1.55,11,48,1,!0).translate(0,5.5,0),f=n(gt,16771268,!0,{uT:{value:0}});f.side=ye;const w=new se(i,f);w.renderOrder=4,w.visible=!1,o.add(g,e,u,w);let C=0,R=0,_=null,B=null,h=null,A=-1e9,E=-1;const U=(c,l,M)=>{const p=re(l);c.position.set(p.x,M,p.z)};return{group:o,frame(c){const l=E<0?16:Math.min(80,c-E);E=c,C+=(R-C)*(1-Math.exp(-l/90)),v.uniforms.uK.value=C*.16,g.visible=C>.01;let M=Math.abs(R-C)>.01;if(_){const p=(c-_.t0)/900;if(p<0)e.visible=!1;else if(p>=1)_=null,e.visible=!1;else{const y=p*2%1;s.uniforms.uR.value=.25+.55*(1-Math.pow(1-y,3)),s.uniforms.uK.value=.75*(1-y),e.visible=!0}M=!0}if(B){const p=(c-B.t0)/1100;p<0?u.visible=!1:p>=1?(B=null,u.visible=!1):(m.uniforms.uK.value=Math.sin(Math.PI*Math.min(1,p*1.4))*(1-p*.4)*.55,u.scale.set(1-.25*p,.4+.8*Math.min(1,p*2),1-.25*p),u.visible=!0),M=!0}if(h){const p=(c-(h.t0+h.ms*.6))/3e3,y=p<0||p>1?0:Math.sin(Math.PI*Math.min(1,p*2.5))*(1-p*.6);f.uniforms.uK.value=y*.13,f.uniforms.uT.value=c/1e3,w.visible=y>.005}else w.visible=!1;return h&&c>h.t0+h.ms+3500&&(h=null),M||!!h||c-A<1400},pickUp(c){R=c?1:0,c&&U(g,c,.006)},check(c,l){U(e,c,.012),_={t0:l},A=l},promotion(c,l){U(u,c,0),B={t0:l}},tension(c){const l=(c-A)/1400;return l<0||l>1?0:Math.sin(Math.PI*Math.min(1,l*2.2))*(1-l)},glory(c){if(!h)return 0;const l=(c-(h.t0+h.ms*.6))/3e3;return l<0||l>1?0:Math.sin(Math.PI*Math.min(1,l*2.5))*(1-l*.6)},mateAt(c,l,M,p="w"){h={t0:c,ms:l},M&&(U(w,M,0),w.rotation.set(p==="w"?-.32:.32,0,.1))},dispose(){o.removeFromParent(),t.dispose(),P.dispose(),i.dispose(),s.dispose(),v.dispose(),m.dispose(),f.dispose()}}}function wt(o){try{const n=o.getContext(),t=n.getExtension("WEBGL_debug_renderer_info");return t?String(n.getParameter(t.UNMASKED_RENDERER_WEBGL)):void 0}catch{return}}function Mt(){const o={};try{const n=new URLSearchParams(location.search).get("vistune");for(const t of(n??"").split(",")){const[s,e]=t.split(":");s&&e!==void 0&&Number.isFinite(Number(e))&&(o[s]=Number(e))}}catch{}return o}function Te(o,n){const t={};for(const s of n)o[s]!==void 0&&(t[s]=o[s]);return t}function At(o,n={}){const t=o,s=t.q3Debug?.(),e=t.q3EnvHost?.();if(!s||!e||!s.renderer||!s.scene||!s.rig||!s.mats)return null;const{renderer:v,scene:g,camera:P}=s,m=t.q3CameraHost?.()??null,u=typeof location<"u"&&/[?&](qa|q3debug)\b/.test(location.search),i=u?Mt():{},f={...Fe,...i.curve!==void 0?{curve:i.curve?"agx":"neutral"}:{},...i.agxPow!==void 0?{power:i.agxPow}:{},...i.agxSat!==void 0?{sat:i.agxSat}:{}},w={...ze,...Te(i,["key","sky","rim","shadow","radius","env","warm"])},C=Qe({renderer:v,rig:s.rig,mats:s.mats,tone:f,mood:w}),R=wt(v),_=We(),B=navigator.deviceMemory;let h=we({boardTier:e.tier(),gpu:R,override:_,memoryGB:B}),A=Me(h);const E=new Ie(h);let U=n.room?.()??"classic";const c=a=>({...a,...Te(i,["exposure","bloom","threshold","knee","contrast","saturation","vignette","pool","grain"]),...i.lift!==void 0?{lift:[i.lift,i.lift,i.lift*1.2]}:{},...i.gamma!==void 0?{gamma:[i.gamma,i.gamma,i.gamma]}:{}});let l=c(be(U));const M=ot({motes:A.motes});g.add(M.group);const p=()=>M.setColors({mote:l.motes.color,moteOpacity:l.motes.opacity,dust:l.dust.color,dustOpacity:l.dust.opacity});p();const y=Ne(v,g,A,l,{timed:u}),I=ft(g,v,e,o);i.nowin||y.setWindow(I),y.setExposure(l.exposure),y.setEnvScale(w.env);let Y=[],Q="";const G=performance.now();function d(a){const r=g.getObjectByName("environment"),x=`${U}:${r?.children.length??0}`;x!==Q&&(Q=x,Y=[],r?.traverse(W=>{const S=W.material;S?.isShaderMaterial&&S.uniforms?.uLive&&Y.push(S)}));const q=!$;for(const W of Y)W.uniforms.uLive.value.set(q?l.live.water:0,q?l.live.sky:0),W.uniforms.uLiveT.value=(a-G)/1e3}const z=st(g),b=yt();g.add(b.group);const O=a=>{const[r="",x="w"]=a.split(" "),q=x==="w"?"K":"k",W=r.split("/");for(let S=0;S<8;S++){let ae=0;for(const fe of W[S]??""){if(/\d/.test(fe)){ae+=Number(fe);continue}if(fe===q)return"abcdefgh"[ae]+String(8-S);ae++}}return null},T={fwd:new H,pos:new H,t:-1},L=new H;let k=0;function j(a){L.set(0,0,-1).applyQuaternion(P.quaternion);const r=T.t<0?-1:(a-T.t)/1e3;if(r>0&&r<.25){const x=N.radToDeg(L.angleTo(T.fwd))/r,q=P.position.distanceTo(T.pos)/r,W=(m?.mode()??"idle")==="idle",S=A.dof&&!i.nodof&&W&&!e.reducedMotion()?N.smoothstep(Math.max(x/14,q/8),.3,1):0;k+=(S-k)*(1-Math.exp(-r/(S>k?.1:.3)))}else r>=.25&&(k=0);T.fwd.copy(L),T.pos.copy(P.position),T.t=a,k<.01&&(k=0),y.setDof(k),k>0&&e.keepAwake(350)}const F=[],D=new Ke;let K=0,V=0;function te(a){if(!V)return 0;const r=(a-K)/V;return r<0?0:r>1?(V=0,0):r<.2?N.smoothstep(r,0,.2):1-N.smoothstep(r,.35,1)}function oe(a){a!==h&&(h=a,A=Me(a),o.dataset.vis=a,y.setQuality(A),M.setMotes($?0:A.motes),e.invalidate())}let $=!1;const le=y.onFrame(a=>{const r=e.reducedMotion();r!==$&&($=r,M.setMotes(r?0:A.motes),y.setStill(r));const x=n.room?.()??U;for(x!==U&&(U=x,l=c(be(x)),y.setLook(l),y.setExposure(l.exposure),p());F.length&&F[0].due<=a;)X(F.shift().i);if(z.apply(a),j(a),b.frame(a)&&e.keepAwake(240),d(a),y.setMoment($?0:b.tension(a),$?0:Math.max(b.glory(a),te(a))),v.getDrawingBufferSize(D),M.frame(a,P,D.y),!_){const q=E.frame(a);q&&oe(q)}}),ce=e.onTier(a=>{const r=we({boardTier:a,gpu:R,override:_,memoryGB:B}),x={high:2,mid:1,low:0};oe(x[r]<x[E.current]?r:E.current)});function X(a){if(!e.alive())return;const r=re(a.square);if(a.kind==="capture")M.burst(r.x,r.z,a.strength,9,.36,!!a.dark),y.hold(60);else if(a.kind==="leaves")M.leaves(r.x,r.z,64,2.1),M.burst(r.x,r.z,1.5,0,.5);else{M.burst(r.x,r.z,a.strength,0,a.piece==="p"?.24:.3);const x=a.from?re(a.from):null;z.start({x:r.x,z:r.z,dx:x?r.x-x.x:0,dz:x?r.z-x.z:-1,strength:a.strength})}e.keepAwake(1500)}const ue={move(a,r){if(!A.puffs||e.reducedMotion())return;const x=performance.now(),q=Je(a,r);for(const S of q)F.push({due:x+S.at,i:S});const W=q.find(S=>S.kind==="land")?.at??0;if(a.flags.check&&!a.flags.mate){const S=O(a.fenAfter);S&&b.check(S,x+W+40)}a.flags.promotion&&b.promotion(a.to,x+W),F.sort((S,ae)=>S.due-ae.due),e.keepAwake(Math.max(...F.map(S=>S.due-x),0)+200)},celebrate(a,r){if(e.reducedMotion()||!r||a!=="checkmate"&&a!=="win")return;const x=performance.now(),q=Math.round(1800*.8);b.mateAt(x,q,r,e.orientation()),F.push({due:x+q,i:{kind:"leaves",at:q,square:r,strength:1.5,piece:"k"}}),F.sort((W,S)=>W.due-S.due),e.keepAwake(q+4e3)},selected(a){e.reducedMotion()||(b.pickUp(a),e.invalidate())},glory(a){e.reducedMotion()||(K=performance.now(),V=Math.max(200,a),e.keepAwake(V+100))},get tier(){return h},dispose(){le(),ce(),I.dispose(),y.dispose(),M.dispose(),C.dispose(),b.dispose(),F.length=0,z.clear(),delete o.dataset.vis,u&&window.qcVis===de&&delete window.qcVis}},de=u?{tier:()=>h,quality:()=>({...A}),look:()=>({...l}),room:()=>U,gpu:R,stats:()=>({...y.stats(),dof:Math.round(k*100)/100,window:Math.round(I.amount()*100)/100}),setTier:oe,setMix:a=>{y.setMix(a),e.invalidate()},burst:(a,r=1,x=0)=>{const q=re(a);M.burst(q.x,q.z,r,x),e.keepAwake(1500)},move:(a,r=!1)=>ue.move(a,r),celebrate:(a,r)=>ue.celebrate(a,r)}:null;return de&&(window.qcVis=de),o.dataset.vis=h,e.invalidate(),ue}export{At as attachVis};
