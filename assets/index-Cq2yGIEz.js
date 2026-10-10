import{C as x,G as P,a1 as L,V as $,k as b,A as I,b as k,ae as B,af as ae,s as O,ag as q,I as J,H as Q}from"./three.module-DR2TPsxk.js";import{bt as X,bW as D,bX as H}from"./index-DRH3b4ws.js";import{LIMITS as S,isMarkStyle as ne,isGlowStyle as re,TRAIL_MS as Y}from"./api-B--6eL-J.js";import"./game-BB7swOoV.js";import"./chess-Dz_znVVI.js";const M=.06,C=.22;function se(a,t){const o=Math.abs(D(t)-D(a)),n=Math.abs(H(t)-H(a));return o===1&&n===2||o===2&&n===1}const ie=a=>Math.min(1.25,.32+.14*a);function ce(a,t){const o=X(a),n=X(t),d=n.x-o.x,e=n.z-o.z,s=Math.hypot(d,e)||1,c={x:o.x+d/s*C,y:M,z:o.z+e/s*C};if(!se(a,t)){const p=ie(s),m={x:n.x,y:M,z:n.z};return{kind:"arc",points:[c,{x:o.x+d*.5,y:M+p,z:o.z+e*.5},m]}}const v=Math.abs(d)>Math.abs(e)?{x:n.x,z:o.z}:{x:o.x,z:n.z},f=.55,r=v.x-o.x,u=v.z-o.z,g=Math.hypot(r,u)||1;return{kind:"knight",points:[{x:o.x+r/g*C,y:M,z:o.z+u/g*C},{x:o.x+r*.55,y:M+f*.92,z:o.z+u*.55},{x:v.x,y:M+f,z:v.z},{x:v.x+(n.x-v.x)*.6,y:M+f*.6,z:v.z+(n.z-v.z)*.6},{x:n.x,y:M,z:n.z}]}}const w={gold:new x(15914378),cool:new x(10474751),threat:new x(16743014),defended:new x(8840117)},V=320,N=2200;function F(a){return a.traverse(t=>{t.castShadow=!1,t.receiveShadow=!1,t.userData.q3Overlay=!0,t.raycast=()=>{}}),a}const T=(a,t,o)=>o?1:Math.min(1,Math.max(0,(t-a)/V));function U(a){a.removeFromParent(),a.traverse(t=>{const o=t;if(!o.isMesh)return;o.geometry?.dispose();const n=o.material;Array.isArray(n)?n.forEach(d=>d.dispose()):n?.dispose()})}const A=`
varying vec2 vUv;
varying vec3 vN;
varying vec3 vV;
void main() {
  vUv = uv;
  vec4 p = vec4(position, 1.0);
  vec3 n = normal;
#ifdef USE_INSTANCING
  p = instanceMatrix * p;
  n = mat3(instanceMatrix) * n;
#endif
  vec4 mv = modelViewMatrix * p;
  vN = normalize(normalMatrix * n);
  vV = -mv.xyz;
  gl_Position = projectionMatrix * mv;
}`,K=`
uniform vec3 uColor;
uniform float uFade;
uniform float uDash;
uniform float uLen;
uniform float uSpark;
uniform float uPhase;
varying vec2 vUv;
varying vec3 vN;
varying vec3 vV;
void main() {
  if (uDash > 0.5 && fract(vUv.x * uLen * 2.2) < 0.42) discard;
  float s = uSpark * exp(-pow((vUv.x - uPhase) * 9.0, 2.0));
  float facing = abs(dot(normalize(vN), normalize(vV)));
  vec3 c = uColor * (0.85 + 0.35 * facing) + vec3(s * 0.9);
  gl_FragColor = vec4(c, uFade * (0.92));
}`,le=`
uniform vec3 uColor;
uniform float uFade;
varying vec2 vUv;
varying vec3 vN;
varying vec3 vV;
void main() {
  float facing = abs(dot(normalize(vN), normalize(vV)));
  float a = uFade * 0.30 * pow(facing, 1.6) * smoothstep(0.0, 0.06, vUv.x);
  gl_FragColor = vec4(uColor * a, a);
}`,de={gold:w.gold,cool:w.cool,threat:w.threat};function ve(a,t,o){const{points:n}=ce(t.from,t.to),d=new L(n.map(h=>new $(h.x,h.y,h.z)),!1,"centripetal"),e=d.getLength(),s=Math.max(24,Math.round(e*20)),c=de[t.style],i=t.style==="threat"?1:0,v=.24,f=Math.max(.5,1-v/e),r=new L(Array.from({length:33},(h,z)=>d.getPointAt(z/32*f)),!1,"centripetal"),u=()=>({uColor:{value:c.clone()},uFade:{value:0},uDash:{value:i},uLen:{value:e},uSpark:{value:0},uPhase:{value:0}}),g=new b({name:"q3-overlay-beam-core",uniforms:u(),vertexShader:A,fragmentShader:K,transparent:!0,depthWrite:!1,toneMapped:!1}),l=new b({name:"q3-overlay-beam-shell",uniforms:u(),vertexShader:A,fragmentShader:le,transparent:!0,depthWrite:!1,blending:I,toneMapped:!1}),p=new b({name:"q3-overlay-beam-head",uniforms:{...u(),uDash:{value:0}},vertexShader:A,fragmentShader:K,transparent:!0,depthWrite:!1,toneMapped:!1}),m=new P;m.name=`overlay-beam-${t.id}`,m.add(new k(new B(r,s,.034,8,!1),g)),m.add(new k(new B(r,s,.1,10,!1),l));const y=new k(new ae(.11,v,18),p),G=d.getPointAt(1),j=d.getPointAt(f);y.position.copy(j).lerp(G,.5),y.quaternion.setFromUnitVectors(new $(0,1,0),G.clone().sub(j).normalize()),m.add(y),m.children.forEach(h=>{h.renderOrder=3,h.frustumCulled=!1});const W=[g,l,p],_={spec:t,group:F(m),t0:o,mats:W},ee=()=>{const h=performance.now(),z=a.reducedMotion(),oe=T(_.t0,h,z),E=h-_.t0,te=z||E>N?0:Math.min(1,(N-E)/400);for(const R of W)R.uniforms.uFade.value=oe,R.uniforms.uSpark.value=te,R.uniforms.uPhase.value=E/900%1.2};return m.children.forEach(h=>{h.onBeforeRender=ee}),a.keepAwake(a.reducedMotion()?0:Math.max(V,N)+50),_}function fe(a){const t=new P;t.name="overlay-beams";const o=new Map;return{object:t,sync(n,d){const e=new Set(n.map(s=>s.id));for(const[s,c]of o)e.has(s)||(U(c.group),o.delete(s));for(const s of n){if(o.has(s.id))continue;const c=ve(a,s,d);o.set(s.id,c),t.add(c.group)}},dispose(){for(const n of o.values())U(n.group);o.clear(),t.removeFromParent()}}}const ue=`
uniform vec3 uColor;
uniform float uFade;
varying vec2 vUv;
varying vec3 vN;
varying vec3 vV;
void main() {
  float facing = abs(dot(normalize(vN), normalize(vV)));
  float rim = pow(1.0 - facing, 2.0);
  float a = uFade * (0.16 + 0.62 * rim);
  gl_FragColor = vec4(uColor * (0.7 + 0.5 * rim), a);
}`,Z={hint:w.gold,plan:w.cool};function me(a){const t=new P;t.name="overlay-ghosts";const o=new Map,n=new Map,d=i=>{const v=i.piece.color+i.piece.type;if(!n.has(v)){const f=a.pieceGeometry(i.piece.type,i.piece.color);n.set(v,f?{geometry:f.geometry.clone(),scale:f.scale}:null)}return n.get(v)},e=[],s=i=>{i.mesh.removeFromParent(),e.push(i.mat)},c=i=>{const v=e.pop();return v?(v.uniforms.uColor.value.copy(Z[i.style]),v.uniforms.uFade.value=0,v):new b({name:"q3-overlay-ghost",uniforms:{uColor:{value:Z[i.style].clone()},uFade:{value:0}},vertexShader:A,fragmentShader:ue,transparent:!0,depthWrite:!1,toneMapped:!1})};return{object:t,sync(i,v){const f=new Set(i.map(r=>r.id));for(const[r,u]of o)f.has(r)||(s(u),o.delete(r));for(const r of i){if(o.has(r.id))continue;const u=d(r);if(!u)continue;const g=c(r),l=F(new k(u.geometry,g));l.name=`overlay-ghost-${r.id}`;const p=a.squareToWorld(r.square);l.position.set(p.x,0,p.z),l.scale.setScalar(u.scale),r.piece.type==="n"&&r.piece.color==="b"&&(l.rotation.y=Math.PI),l.renderOrder=4;const m={spec:r,mesh:l,mat:g,t0:v};l.onBeforeRender=()=>{g.uniforms.uFade.value=T(m.t0,performance.now(),a.reducedMotion())},o.set(r.id,m),t.add(l),a.keepAwake(V+50)}},dispose(){for(const i of o.values())i.mesh.removeFromParent(),i.mat.dispose();o.clear();for(const i of e)i.dispose();e.length=0;for(const i of n.values())i?.geometry.dispose();n.clear(),t.removeFromParent()}}}const pe=.0049,ge={"mark-from":0,"mark-to":1,"mark-check":2,"mark-focus":3,"mark-capture":4},he={"mark-from":new x(16447215),"mark-to":new x(16447215),"mark-check":new x(13941112),"mark-focus":new x(15985132),"mark-capture":new x(13941112)},ye=`
uniform float uFade;
varying vec2 vUv;
varying vec3 vColor;
varying float vShape;
// the shape's own mask for a given growth (grow > 0 widens it: the keyline is the grown mask minus the shape)
float shape(vec2 p, float grow) {
  vec2 q = abs(p);
  float d = max(q.x, q.y);
  if (vShape < 0.5) {                                   // hollow outline
    return step(0.395 - grow, d) * step(d, 0.455 + grow);
  } else if (vShape < 1.5) {                            // corner triangle (board-space a1 corner of the square)
    return step(p.x + p.y, -0.56 + grow * 1.4) * step(-0.475 - grow, min(p.x, p.y));
  } else if (vShape < 2.5) {                            // four notches, pointing in from each edge's middle
    // a triangle on each edge: base on the edge (±0.13 wide), apex 0.16 in towards the centre
    float ny = step(0.31 - grow, q.y) * step(q.y, 0.47 + grow) * step(q.x, (q.y - 0.31) * 0.8125 + grow);
    float nx = step(0.31 - grow, q.x) * step(q.x, 0.47 + grow) * step(q.y, (q.x - 0.31) * 0.8125 + grow);
    return clamp(nx + ny, 0.0, 1.0);
  } else if (vShape < 3.5) {                            // thick corner brackets
    return step(0.385 - grow, d) * step(d, 0.465 + grow) * step(0.24 - grow, min(q.x, q.y));
  }
  return step(0.415 - grow, d) * step(d, 0.462 + grow) * step(0.30 - grow, min(q.x, q.y));  // thin brackets
}
void main() {
  vec2 p = vUv - 0.5;
  float inner = shape(p, 0.0);
  float outer = shape(p, 0.018);
  float a = max(inner * 0.94, outer * 0.78) * uFade;
  if (a < 0.01) discard;
  vec3 ink = vec3(0.141, 0.090, 0.133);
  gl_FragColor = vec4(mix(ink, vColor, inner), a);
}`,we=`
attribute vec3 aColor;
attribute float aShape;
varying vec2 vUv;
varying vec3 vColor;
varying float vShape;
void main() {
  vUv = uv;
  vColor = aColor;
  vShape = aShape;
  vec4 p = vec4(position, 1.0);
#ifdef USE_INSTANCING
  p = instanceMatrix * p;
#endif
  gl_Position = projectionMatrix * modelViewMatrix * p;
}`;function xe(a){const t=new O(1,1);t.rotateX(-Math.PI/2);const o=new q(new Float32Array(S.tiles*3),3),n=new q(new Float32Array(S.tiles),1);t.setAttribute("aColor",o),t.setAttribute("aShape",n);const d=new b({name:"q3-overlay-marks",uniforms:{uFade:{value:1}},vertexShader:we,fragmentShader:ye,transparent:!0,depthWrite:!1,toneMapped:!1}),e=F(new J(t,d,S.tiles));e.name="overlay-marks",e.count=0,e.visible=!1,e.frustumCulled=!1,e.renderOrder=3;let s=0,c="";const i=new Q;return e.onBeforeRender=()=>{d.uniforms.uFade.value=T(s,performance.now(),a.reducedMotion())},{object:e,sync(v,f){const r=v.filter(l=>ne(l.style)),u=r.map(l=>l.square+l.style).join();if(u===c)return;const g=r.length>0&&c==="";c=u,r.forEach((l,p)=>{const m=a.squareToWorld(l.square);e.setMatrixAt(p,i.makeTranslation(m.x,pe,m.z));const y=he[l.style];o.setXYZ(p,y.r,y.g,y.b),n.setX(p,ge[l.style])}),e.count=r.length,e.visible=r.length>0,e.instanceMatrix.needsUpdate=!0,o.needsUpdate=!0,n.needsUpdate=!0,g&&(s=f,a.keepAwake(400))},dispose(){e.removeFromParent(),t.dispose(),d.dispose(),e.dispose()}}}const Me=.0045,be={"glow-gold":0,"glow-cool":1,threat:2,defended:3},Se={"glow-gold":w.gold,"glow-cool":w.cool,threat:w.threat,defended:w.defended},ke=`
uniform float uFade;
varying vec2 vUv;
varying vec3 vColor;
varying float vShape;
void main() {
  vec2 p = vUv - 0.5;
  vec2 q = abs(p);
  float d = max(q.x, q.y);                              // 0 at the centre, 0.5 at the square's edge
  float inside = 1.0 - smoothstep(0.455, 0.475, d);
  float a = 0.0;
  if (vShape < 0.5) {                                   // glow-gold
    float rim = smoothstep(0.36, 0.44, d) * inside;
    a = 0.20 * inside + 0.55 * rim;
  } else if (vShape < 1.5) {                            // glow-cool: ring only
    a = 0.75 * smoothstep(0.37, 0.41, d) * inside;
  } else if (vShape < 2.5) {                            // threat: corner brackets + hatch
    float br = step(0.39, d) * step(0.2, min(q.x, q.y)) * inside;
    float hatch = step(0.5, fract((p.x + p.y) * 7.0)) * step(d, 0.38);
    a = 0.85 * br + 0.16 * hatch;
  } else {                                              // defended: 3x3 dot grid
    vec2 g = fract((p + 0.5) * 3.0) - 0.5;
    float dot = 1.0 - smoothstep(0.13, 0.19, length(g));
    a = 0.7 * dot * step(d, 0.44) + 0.08 * inside;
  }
  a *= uFade;
  if (a < 0.003) discard;
  gl_FragColor = vec4(vColor * a, a);
}`,Fe=`
attribute vec3 aColor;
attribute float aShape;
varying vec2 vUv;
varying vec3 vColor;
varying float vShape;
void main() {
  vUv = uv;
  vColor = aColor;
  vShape = aShape;
  vec4 p = vec4(position, 1.0);
#ifdef USE_INSTANCING
  p = instanceMatrix * p;
#endif
  gl_Position = projectionMatrix * modelViewMatrix * p;
}`;function ze(a){const t=new O(1,1);t.rotateX(-Math.PI/2);const o=new q(new Float32Array(S.tiles*3),3),n=new q(new Float32Array(S.tiles),1);t.setAttribute("aColor",o),t.setAttribute("aShape",n);const d=new b({name:"q3-overlay-tiles",uniforms:{uFade:{value:1}},vertexShader:Fe,fragmentShader:ke,transparent:!0,depthWrite:!1,blending:I,toneMapped:!1}),e=F(new J(t,d,S.tiles));e.name="overlay-tiles",e.count=0,e.visible=!1,e.frustumCulled=!1,e.renderOrder=2;let s=0,c="";const i=new Q;return e.onBeforeRender=()=>{d.uniforms.uFade.value=T(s,performance.now(),a.reducedMotion())},{object:e,sync(v,f){const r=v.filter(l=>re(l.style)),u=r.map(l=>l.square+l.style).join();if(u===c)return;const g=r.length>0&&c==="";c=u,r.forEach((l,p)=>{const m=a.squareToWorld(l.square);e.setMatrixAt(p,i.makeTranslation(m.x,Me,m.z));const y=Se[l.style];o.setXYZ(p,y.r,y.g,y.b),n.setX(p,be[l.style])}),e.count=r.length,e.visible=r.length>0,e.instanceMatrix.needsUpdate=!0,o.needsUpdate=!0,n.needsUpdate=!0,g&&(s=f,a.keepAwake(Ce))},dispose(){e.removeFromParent(),t.dispose(),d.dispose(),e.dispose()}}}const Ce=400,Ae=`
varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,qe=`
uniform vec3 uColor;
uniform float uLife;
varying vec2 vUv;
void main() {
  float across = 1.0 - abs(vUv.y - 0.5) * 2.0;
  float a = uLife * vUv.x * smoothstep(0.0, 0.6, across) * 0.55;
  if (a < 0.003) discard;
  gl_FragColor = vec4(uColor * a, a);
}`;function Ue(a){const t=new P;t.name="overlay-trails";const o=new Map;return{object:t,sync(n){const d=new Set(n.map(e=>e.id));for(const[e,s]of o)d.has(e)||(U(s),o.delete(e));for(const e of n){if(o.has(e.id))continue;const s=a.squareToWorld(e.from),c=a.squareToWorld(e.to),i=Math.hypot(c.x-s.x,c.z-s.z),v=new O(i,.2);v.rotateX(-Math.PI/2);const f=new b({name:"q3-overlay-trail",uniforms:{uColor:{value:w.gold.clone()},uLife:{value:1}},vertexShader:Ae,fragmentShader:qe,transparent:!0,depthWrite:!1,blending:I,toneMapped:!1}),r=F(new k(v,f));r.name=`overlay-trail-${e.id}`,r.position.set((s.x+c.x)/2,.006,(s.z+c.z)/2),r.rotation.y=-Math.atan2(c.z-s.z,c.x-s.x),r.renderOrder=2,r.onBeforeRender=()=>{f.uniforms.uLife.value=Math.max(0,1-(performance.now()-e.at)/Y)},o.set(e.id,r),t.add(r),a.keepAwake(Y+50)}},dispose(){for(const n of o.values())U(n);o.clear(),t.removeFromParent()}}}function Ne(a){const t=ze(a),o=fe(a),n=me(a),d=Ue(a),e=xe(a);a.group.add(t.object,e.object,d.object,o.object,n.object);let s=!1;return{host:a,sync(c){if(s)return;const i=performance.now();t.sync(c.tiles,i),e.sync(c.tiles,i),d.sync(c.trails,i),o.sync(c.arrows,i),n.sync(c.ghosts,i),a.invalidate()},dispose(){s||(s=!0,t.dispose(),e.dispose(),d.dispose(),o.dispose(),n.dispose(),a.alive()&&a.invalidate())}}}export{Ne as createOverlayRenderer};
