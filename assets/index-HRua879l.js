import{Color as w,Group as T,ShaderMaterial as S,AdditiveBlending as _,Mesh as k,BufferGeometry as re,CatmullRomCurve3 as $,Vector3 as B,TubeGeometry as D,ConeGeometry as ne,PlaneGeometry as V,InstancedBufferAttribute as A,InstancedMesh as J,Matrix4 as Q}from"./three.module-D5rf0S9N.js";import{ci as X,aQ as H,aR as Y}from"./index-D5Yuo11p.js";import{LIMITS as F,isMarkStyle as se,isGlowStyle as ie,TRAIL_MS as K}from"./api-IfK9m5t7.js";import"./game-BB7swOoV.js";import"./chess-Dz_znVVI.js";import"./landPack-DiUFYm7C.js";import"./flag-i-AwC2b9.js";const b=.06,q=.22;function le(a,t){const o=Math.abs(H(t)-H(a)),r=Math.abs(Y(t)-Y(a));return o===1&&r===2||o===2&&r===1}const ce=a=>Math.min(1.25,.32+.14*a);function de(a,t){const o=X(a),r=X(t),c=r.x-o.x,e=r.z-o.z,l=Math.hypot(c,e)||1,u={x:o.x+c/l*q,y:b,z:o.z+e/l*q};if(!le(a,t)){const p=ce(l),m={x:r.x,y:b,z:r.z};return{kind:"arc",points:[u,{x:o.x+c*.5,y:b+p,z:o.z+e*.5},m]}}const i=Math.abs(c)>Math.abs(e)?{x:r.x,z:o.z}:{x:o.x,z:r.z},f=.55,s=i.x-o.x,v=i.z-o.z,h=Math.hypot(s,v)||1;return{kind:"knight",points:[{x:o.x+s/h*q,y:b,z:o.z+v/h*q},{x:o.x+s*.55,y:b+f*.92,z:o.z+v*.55},{x:i.x,y:b+f,z:i.z},{x:i.x+(r.x-i.x)*.6,y:b+f*.6,z:i.z+(r.z-i.z)*.6},{x:r.x,y:b,z:r.z}]}}const x={gold:new w(15914378),cool:new w(10474751),threat:new w(16743014),defended:new w(8840117)},W=320,O=2200;function C(a){return a.traverse(t=>{t.castShadow=!1,t.receiveShadow=!1,t.userData.q3Overlay=!0,t.raycast=()=>{}}),a}const R=(a,t,o)=>o?1:Math.min(1,Math.max(0,(t-a)/W));function U(a){a.removeFromParent(),a.traverse(t=>{const o=t;if(!o.isMesh)return;o.geometry?.dispose();const r=o.material;Array.isArray(r)?r.forEach(c=>c.dispose()):r?.dispose()})}const M=`
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
}`,P=`
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
  // run-1101: the travelling light is a comet — a bright head and a soft tail drawn out behind it toward the man
  float d = uPhase - vUv.x;
  float s = uSpark * (d < 0.0 ? exp(d * 26.0) : exp(-d * 4.5) * 0.75 + exp(-d * 24.0) * 0.25);
  float facing = abs(dot(normalize(vN), normalize(vV)));
  vec3 c = uColor * (0.85 + 0.35 * facing) + vec3(s * 0.9);
  gl_FragColor = vec4(c, uFade * (0.92));
}`,ee=`
uniform vec3 uColor;
uniform float uFade;
uniform float uSpark;
uniform float uPhase;
varying vec2 vUv;
varying vec3 vN;
varying vec3 vV;
void main() {
  float facing = abs(dot(normalize(vN), normalize(vV)));
  // run-1101: the comet's glow swells the soft shell around it, a trail of light that drains behind the head
  float d = uPhase - vUv.x;
  float trail = uSpark * (d < 0.0 ? exp(d * 22.0) : exp(-d * 3.8));
  float a = uFade * (0.30 + 0.55 * trail) * pow(facing, 1.6) * smoothstep(0.0, 0.06, vUv.x);
  gl_FragColor = vec4(uColor * a, a);
}`,ue={gold:x.gold,cool:x.cool,threat:x.threat};function fe(a,t,o){const{points:r}=de(t.from,t.to),c=new $(r.map(g=>new B(g.x,g.y,g.z)),!1,"centripetal"),e=c.getLength(),l=Math.max(24,Math.round(e*20)),u=ue[t.style],n=t.style==="threat"?1:0,i=.24,f=Math.max(.5,1-i/e),s=new $(Array.from({length:33},(g,z)=>c.getPointAt(z/32*f)),!1,"centripetal"),v=()=>({uColor:{value:u.clone()},uFade:{value:0},uDash:{value:n},uLen:{value:e},uSpark:{value:0},uPhase:{value:0}}),h=new S({name:"q3-overlay-beam-core",uniforms:v(),vertexShader:M,fragmentShader:P,transparent:!0,depthWrite:!1,toneMapped:!1}),d=new S({name:"q3-overlay-beam-shell",uniforms:v(),vertexShader:M,fragmentShader:ee,transparent:!0,depthWrite:!1,blending:_,toneMapped:!1}),p=new S({name:"q3-overlay-beam-head",uniforms:{...v(),uDash:{value:0}},vertexShader:M,fragmentShader:P,transparent:!0,depthWrite:!1,toneMapped:!1}),m=new T;m.name=`overlay-beam-${t.id}`,m.add(new k(new D(s,l,.034,8,!1),h)),m.add(new k(new D(s,l,.1,10,!1),d));const y=new k(new ne(.11,i,18),p),G=c.getPointAt(1),j=c.getPointAt(f);y.position.copy(j).lerp(G,.5),y.quaternion.setFromUnitVectors(new B(0,1,0),G.clone().sub(j).normalize()),m.add(y),m.children.forEach(g=>{g.renderOrder=3,g.frustumCulled=!1});const L=[h,d,p],E={spec:t,group:C(m),t0:o,mats:L},oe=()=>{const g=performance.now(),z=a.reducedMotion(),te=R(E.t0,g,z),N=g-E.t0,ae=z||N>O?0:Math.min(1,(O-N)/400);for(const I of L)I.uniforms.uFade.value=te,I.uniforms.uSpark.value=ae,I.uniforms.uPhase.value=N/900%1.2};return m.children.forEach(g=>{g.onBeforeRender=oe}),a.keepAwake(a.reducedMotion()?0:Math.max(W,O)+50),E}function ve(a){const t=new T;t.name="overlay-beams";const o=new Map,r={uColor:{value:new w},uFade:{value:0},uDash:{value:0},uLen:{value:1},uSpark:{value:0},uPhase:{value:0}},c=[new S({name:"q3-overlay-beam-core",uniforms:r,vertexShader:M,fragmentShader:P,transparent:!0,depthWrite:!1,toneMapped:!1}),new S({name:"q3-overlay-beam-shell",uniforms:r,vertexShader:M,fragmentShader:ee,transparent:!0,depthWrite:!1,blending:_,toneMapped:!1}),new S({name:"q3-overlay-beam-head",uniforms:r,vertexShader:M,fragmentShader:P,transparent:!0,depthWrite:!1,toneMapped:!1})].map(e=>{const l=new k(new re,e);return l.name="overlay-beam-keeper",l.frustumCulled=!1,l});return t.add(...c),{object:t,sync(e,l){const u=new Set(e.map(n=>n.id));for(const[n,i]of o)u.has(n)||(U(i.group),o.delete(n));for(const n of e){if(o.has(n.id))continue;const i=fe(a,n,l);o.set(n.id,i),t.add(i.group)}},dispose(){for(const e of c)e.geometry.dispose(),e.material.dispose();for(const e of o.values())U(e.group);o.clear(),t.removeFromParent()}}}const me=`
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
}`,Z={hint:x.gold,plan:x.cool};function pe(a){const t=new T;t.name="overlay-ghosts";const o=new Map,r=new Map,c=n=>{const i=n.piece.color+n.piece.type;if(!r.has(i)){const f=a.pieceGeometry(n.piece.type,n.piece.color);r.set(i,f?{geometry:f.geometry.clone(),scale:f.scale}:null)}return r.get(i)},e=[],l=n=>{n.mesh.removeFromParent(),e.push(n.mat)},u=n=>{const i=e.pop();return i?(i.uniforms.uColor.value.copy(Z[n.style]),i.uniforms.uFade.value=0,i):new S({name:"q3-overlay-ghost",uniforms:{uColor:{value:Z[n.style].clone()},uFade:{value:0}},vertexShader:M,fragmentShader:me,transparent:!0,depthWrite:!1,toneMapped:!1})};return{object:t,sync(n,i){const f=new Set(n.map(s=>s.id));for(const[s,v]of o)f.has(s)||(l(v),o.delete(s));for(const s of n){if(o.has(s.id))continue;const v=c(s);if(!v)continue;const h=u(s),d=C(new k(v.geometry,h));d.name=`overlay-ghost-${s.id}`;const p=a.squareToWorld(s.square);d.position.set(p.x,0,p.z),d.scale.setScalar(v.scale),s.piece.type==="n"&&s.piece.color==="b"&&(d.rotation.y=Math.PI),d.renderOrder=4;const m={spec:s,mesh:d,mat:h,t0:i};d.onBeforeRender=()=>{h.uniforms.uFade.value=R(m.t0,performance.now(),a.reducedMotion())},o.set(s.id,m),t.add(d),a.keepAwake(W+50)}},dispose(){for(const n of o.values())n.mesh.removeFromParent(),n.mat.dispose();o.clear();for(const n of e)n.dispose();e.length=0;for(const n of r.values())n?.geometry.dispose();r.clear(),t.removeFromParent()}}}const he=.0049,ge={"mark-from":0,"mark-to":1,"mark-check":2,"mark-focus":3,"mark-capture":4},ye={"mark-from":new w(16447215),"mark-to":new w(16447215),"mark-check":new w(13941112),"mark-focus":new w(15985132),"mark-capture":new w(13941112)},we=`
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
  } else if (vShape < 1.5) {                            // bold outline: twice the hollow one's width, same outer edge
    return step(0.345 - grow, d) * step(d, 0.455 + grow);
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
}`,xe=`
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
}`;function Se(a){const t=new V(1,1);t.rotateX(-Math.PI/2);const o=new A(new Float32Array(F.tiles*3),3),r=new A(new Float32Array(F.tiles),1);t.setAttribute("aColor",o),t.setAttribute("aShape",r);const c=new S({name:"q3-overlay-marks",uniforms:{uFade:{value:1}},vertexShader:xe,fragmentShader:we,transparent:!0,depthWrite:!1,toneMapped:!1}),e=C(new J(t,c,F.tiles));e.name="overlay-marks",e.count=0,e.visible=!1,e.frustumCulled=!1,e.renderOrder=3;let l=0,u="";const n=new Q;return e.onBeforeRender=()=>{c.uniforms.uFade.value=R(l,performance.now(),a.reducedMotion())},{object:e,sync(i,f){const s=i.filter(d=>se(d.style)),v=s.map(d=>d.square+d.style).join();if(v===u)return;const h=s.length>0&&u==="";u=v,s.forEach((d,p)=>{const m=a.squareToWorld(d.square);e.setMatrixAt(p,n.makeTranslation(m.x,he,m.z));const y=ye[d.style];o.setXYZ(p,y.r,y.g,y.b),r.setX(p,ge[d.style])}),e.count=s.length,e.visible=s.length>0,e.instanceMatrix.needsUpdate=!0,o.needsUpdate=!0,r.needsUpdate=!0,h&&(l=f,a.keepAwake(400))},dispose(){e.removeFromParent(),t.dispose(),c.dispose(),e.dispose()}}}const be=.0045,Me={"glow-gold":0,"glow-cool":1,threat:2,defended:3},ke={"glow-gold":x.gold,"glow-cool":x.cool,threat:x.threat,defended:x.defended},Fe=`
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
}`,Ce=`
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
}`;function ze(a){const t=new V(1,1);t.rotateX(-Math.PI/2);const o=new A(new Float32Array(F.tiles*3),3),r=new A(new Float32Array(F.tiles),1);t.setAttribute("aColor",o),t.setAttribute("aShape",r);const c=new S({name:"q3-overlay-tiles",uniforms:{uFade:{value:1}},vertexShader:Ce,fragmentShader:Fe,transparent:!0,depthWrite:!1,blending:_,toneMapped:!1}),e=C(new J(t,c,F.tiles));e.name="overlay-tiles",e.count=0,e.visible=!1,e.frustumCulled=!1,e.renderOrder=2;let l=0,u="";const n=new Q;return e.onBeforeRender=()=>{c.uniforms.uFade.value=R(l,performance.now(),a.reducedMotion())},{object:e,sync(i,f){const s=i.filter(d=>ie(d.style)),v=s.map(d=>d.square+d.style).join();if(v===u)return;const h=s.length>0&&u==="";u=v,s.forEach((d,p)=>{const m=a.squareToWorld(d.square);e.setMatrixAt(p,n.makeTranslation(m.x,be,m.z));const y=ke[d.style];o.setXYZ(p,y.r,y.g,y.b),r.setX(p,Me[d.style])}),e.count=s.length,e.visible=s.length>0,e.instanceMatrix.needsUpdate=!0,o.needsUpdate=!0,r.needsUpdate=!0,h&&(l=f,a.keepAwake(qe))},dispose(){e.removeFromParent(),t.dispose(),c.dispose(),e.dispose()}}}const qe=400,Ae=`
varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,Ue=`
uniform vec3 uColor;
uniform float uLife;
varying vec2 vUv;
void main() {
  float across = 1.0 - abs(vUv.y - 0.5) * 2.0;
  float a = uLife * vUv.x * smoothstep(0.0, 0.6, across) * 0.55;
  if (a < 0.003) discard;
  gl_FragColor = vec4(uColor * a, a);
}`;function Pe(a){const t=new T;t.name="overlay-trails";const o=new Map;return{object:t,sync(r){const c=new Set(r.map(e=>e.id));for(const[e,l]of o)c.has(e)||(U(l),o.delete(e));for(const e of r){if(o.has(e.id))continue;const l=a.squareToWorld(e.from),u=a.squareToWorld(e.to),n=Math.hypot(u.x-l.x,u.z-l.z),i=new V(n,.2);i.rotateX(-Math.PI/2);const f=new S({name:"q3-overlay-trail",uniforms:{uColor:{value:x.gold.clone()},uLife:{value:1}},vertexShader:Ae,fragmentShader:Ue,transparent:!0,depthWrite:!1,blending:_,toneMapped:!1}),s=C(new k(i,f));s.name=`overlay-trail-${e.id}`,s.position.set((l.x+u.x)/2,.006,(l.z+u.z)/2),s.rotation.y=-Math.atan2(u.z-l.z,u.x-l.x),s.renderOrder=2,s.onBeforeRender=()=>{f.uniforms.uLife.value=Math.max(0,1-(performance.now()-e.at)/K)},o.set(e.id,s),t.add(s),a.keepAwake(K+50)}},dispose(){for(const r of o.values())U(r);o.clear(),t.removeFromParent()}}}function Ve(a){const t=ze(a),o=ve(a),r=pe(a),c=Pe(a),e=Se(a);a.group.add(t.object,e.object,c.object,o.object,r.object);let l=!1;return{host:a,sync(u){if(l)return;const n=performance.now();t.sync(u.tiles,n),e.sync(u.tiles,n),c.sync(u.trails,n),o.sync(u.arrows,n),r.sync(u.ghosts,n),a.invalidate()},dispose(){l||(l=!0,t.dispose(),e.dispose(),c.dispose(),o.dispose(),r.dispose(),a.alive()&&a.invalidate())}}}export{Ve as createOverlayRenderer};
