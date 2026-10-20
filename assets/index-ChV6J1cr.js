import{C as w,G as T,h as M,A as _,M as k,B as ne,r as $,i as B,aA as D,aS as re,g as G,$ as A,q as J,F as Q}from"./three.module-BIwBkfOU.js";import{bZ as X,b_ as H,b$ as Y}from"./index-DXUnxl5l.js";import{LIMITS as F,isMarkStyle as se,isGlowStyle as ie,TRAIL_MS as Z}from"./api-Daw6yhvC.js";import"./game-BB7swOoV.js";import"./chess-Dz_znVVI.js";import"./landPack-CVReR43G.js";const S=.06,q=.22;function le(a,t){const o=Math.abs(H(t)-H(a)),n=Math.abs(Y(t)-Y(a));return o===1&&n===2||o===2&&n===1}const ce=a=>Math.min(1.25,.32+.14*a);function de(a,t){const o=X(a),n=X(t),c=n.x-o.x,e=n.z-o.z,l=Math.hypot(c,e)||1,v={x:o.x+c/l*q,y:S,z:o.z+e/l*q};if(!le(a,t)){const p=ce(l),m={x:n.x,y:S,z:n.z};return{kind:"arc",points:[v,{x:o.x+c*.5,y:S+p,z:o.z+e*.5},m]}}const i=Math.abs(c)>Math.abs(e)?{x:n.x,z:o.z}:{x:o.x,z:n.z},u=.55,s=i.x-o.x,f=i.z-o.z,h=Math.hypot(s,f)||1;return{kind:"knight",points:[{x:o.x+s/h*q,y:S,z:o.z+f/h*q},{x:o.x+s*.55,y:S+u*.92,z:o.z+f*.55},{x:i.x,y:S+u,z:i.z},{x:i.x+(n.x-i.x)*.6,y:S+u*.6,z:i.z+(n.z-i.z)*.6},{x:n.x,y:S,z:n.z}]}}const x={gold:new w(15914378),cool:new w(10474751),threat:new w(16743014),defended:new w(8840117)},V=320,O=2200;function C(a){return a.traverse(t=>{t.castShadow=!1,t.receiveShadow=!1,t.userData.q3Overlay=!0,t.raycast=()=>{}}),a}const E=(a,t,o)=>o?1:Math.min(1,Math.max(0,(t-a)/V));function U(a){a.removeFromParent(),a.traverse(t=>{const o=t;if(!o.isMesh)return;o.geometry?.dispose();const n=o.material;Array.isArray(n)?n.forEach(c=>c.dispose()):n?.dispose()})}const b=`
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
  float s = uSpark * exp(-pow((vUv.x - uPhase) * 9.0, 2.0));
  float facing = abs(dot(normalize(vN), normalize(vV)));
  vec3 c = uColor * (0.85 + 0.35 * facing) + vec3(s * 0.9);
  gl_FragColor = vec4(c, uFade * (0.92));
}`,ee=`
uniform vec3 uColor;
uniform float uFade;
varying vec2 vUv;
varying vec3 vN;
varying vec3 vV;
void main() {
  float facing = abs(dot(normalize(vN), normalize(vV)));
  float a = uFade * 0.30 * pow(facing, 1.6) * smoothstep(0.0, 0.06, vUv.x);
  gl_FragColor = vec4(uColor * a, a);
}`,ve={gold:x.gold,cool:x.cool,threat:x.threat};function ue(a,t,o){const{points:n}=de(t.from,t.to),c=new $(n.map(g=>new B(g.x,g.y,g.z)),!1,"centripetal"),e=c.getLength(),l=Math.max(24,Math.round(e*20)),v=ve[t.style],r=t.style==="threat"?1:0,i=.24,u=Math.max(.5,1-i/e),s=new $(Array.from({length:33},(g,z)=>c.getPointAt(z/32*u)),!1,"centripetal"),f=()=>({uColor:{value:v.clone()},uFade:{value:0},uDash:{value:r},uLen:{value:e},uSpark:{value:0},uPhase:{value:0}}),h=new M({name:"q3-overlay-beam-core",uniforms:f(),vertexShader:b,fragmentShader:P,transparent:!0,depthWrite:!1,toneMapped:!1}),d=new M({name:"q3-overlay-beam-shell",uniforms:f(),vertexShader:b,fragmentShader:ee,transparent:!0,depthWrite:!1,blending:_,toneMapped:!1}),p=new M({name:"q3-overlay-beam-head",uniforms:{...f(),uDash:{value:0}},vertexShader:b,fragmentShader:P,transparent:!0,depthWrite:!1,toneMapped:!1}),m=new T;m.name=`overlay-beam-${t.id}`,m.add(new k(new D(s,l,.034,8,!1),h)),m.add(new k(new D(s,l,.1,10,!1),d));const y=new k(new re(.11,i,18),p),W=c.getPointAt(1),j=c.getPointAt(u);y.position.copy(j).lerp(W,.5),y.quaternion.setFromUnitVectors(new B(0,1,0),W.clone().sub(j).normalize()),m.add(y),m.children.forEach(g=>{g.renderOrder=3,g.frustumCulled=!1});const L=[h,d,p],R={spec:t,group:C(m),t0:o,mats:L},oe=()=>{const g=performance.now(),z=a.reducedMotion(),te=E(R.t0,g,z),N=g-R.t0,ae=z||N>O?0:Math.min(1,(O-N)/400);for(const I of L)I.uniforms.uFade.value=te,I.uniforms.uSpark.value=ae,I.uniforms.uPhase.value=N/900%1.2};return m.children.forEach(g=>{g.onBeforeRender=oe}),a.keepAwake(a.reducedMotion()?0:Math.max(V,O)+50),R}function fe(a){const t=new T;t.name="overlay-beams";const o=new Map,n={uColor:{value:new w},uFade:{value:0},uDash:{value:0},uLen:{value:1},uSpark:{value:0},uPhase:{value:0}},c=[new M({name:"q3-overlay-beam-core",uniforms:n,vertexShader:b,fragmentShader:P,transparent:!0,depthWrite:!1,toneMapped:!1}),new M({name:"q3-overlay-beam-shell",uniforms:n,vertexShader:b,fragmentShader:ee,transparent:!0,depthWrite:!1,blending:_,toneMapped:!1}),new M({name:"q3-overlay-beam-head",uniforms:n,vertexShader:b,fragmentShader:P,transparent:!0,depthWrite:!1,toneMapped:!1})].map(e=>{const l=new k(new ne,e);return l.name="overlay-beam-keeper",l.frustumCulled=!1,l});return t.add(...c),{object:t,sync(e,l){const v=new Set(e.map(r=>r.id));for(const[r,i]of o)v.has(r)||(U(i.group),o.delete(r));for(const r of e){if(o.has(r.id))continue;const i=ue(a,r,l);o.set(r.id,i),t.add(i.group)}},dispose(){for(const e of c)e.geometry.dispose(),e.material.dispose();for(const e of o.values())U(e.group);o.clear(),t.removeFromParent()}}}const me=`
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
}`,K={hint:x.gold,plan:x.cool};function pe(a){const t=new T;t.name="overlay-ghosts";const o=new Map,n=new Map,c=r=>{const i=r.piece.color+r.piece.type;if(!n.has(i)){const u=a.pieceGeometry(r.piece.type,r.piece.color);n.set(i,u?{geometry:u.geometry.clone(),scale:u.scale}:null)}return n.get(i)},e=[],l=r=>{r.mesh.removeFromParent(),e.push(r.mat)},v=r=>{const i=e.pop();return i?(i.uniforms.uColor.value.copy(K[r.style]),i.uniforms.uFade.value=0,i):new M({name:"q3-overlay-ghost",uniforms:{uColor:{value:K[r.style].clone()},uFade:{value:0}},vertexShader:b,fragmentShader:me,transparent:!0,depthWrite:!1,toneMapped:!1})};return{object:t,sync(r,i){const u=new Set(r.map(s=>s.id));for(const[s,f]of o)u.has(s)||(l(f),o.delete(s));for(const s of r){if(o.has(s.id))continue;const f=c(s);if(!f)continue;const h=v(s),d=C(new k(f.geometry,h));d.name=`overlay-ghost-${s.id}`;const p=a.squareToWorld(s.square);d.position.set(p.x,0,p.z),d.scale.setScalar(f.scale),s.piece.type==="n"&&s.piece.color==="b"&&(d.rotation.y=Math.PI),d.renderOrder=4;const m={spec:s,mesh:d,mat:h,t0:i};d.onBeforeRender=()=>{h.uniforms.uFade.value=E(m.t0,performance.now(),a.reducedMotion())},o.set(s.id,m),t.add(d),a.keepAwake(V+50)}},dispose(){for(const r of o.values())r.mesh.removeFromParent(),r.mat.dispose();o.clear();for(const r of e)r.dispose();e.length=0;for(const r of n.values())r?.geometry.dispose();n.clear(),t.removeFromParent()}}}const he=.0049,ge={"mark-from":0,"mark-to":1,"mark-check":2,"mark-focus":3,"mark-capture":4},ye={"mark-from":new w(16447215),"mark-to":new w(16447215),"mark-check":new w(13941112),"mark-focus":new w(15985132),"mark-capture":new w(13941112)},we=`
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
}`;function Me(a){const t=new G(1,1);t.rotateX(-Math.PI/2);const o=new A(new Float32Array(F.tiles*3),3),n=new A(new Float32Array(F.tiles),1);t.setAttribute("aColor",o),t.setAttribute("aShape",n);const c=new M({name:"q3-overlay-marks",uniforms:{uFade:{value:1}},vertexShader:xe,fragmentShader:we,transparent:!0,depthWrite:!1,toneMapped:!1}),e=C(new J(t,c,F.tiles));e.name="overlay-marks",e.count=0,e.visible=!1,e.frustumCulled=!1,e.renderOrder=3;let l=0,v="";const r=new Q;return e.onBeforeRender=()=>{c.uniforms.uFade.value=E(l,performance.now(),a.reducedMotion())},{object:e,sync(i,u){const s=i.filter(d=>se(d.style)),f=s.map(d=>d.square+d.style).join();if(f===v)return;const h=s.length>0&&v==="";v=f,s.forEach((d,p)=>{const m=a.squareToWorld(d.square);e.setMatrixAt(p,r.makeTranslation(m.x,he,m.z));const y=ye[d.style];o.setXYZ(p,y.r,y.g,y.b),n.setX(p,ge[d.style])}),e.count=s.length,e.visible=s.length>0,e.instanceMatrix.needsUpdate=!0,o.needsUpdate=!0,n.needsUpdate=!0,h&&(l=u,a.keepAwake(400))},dispose(){e.removeFromParent(),t.dispose(),c.dispose(),e.dispose()}}}const Se=.0045,be={"glow-gold":0,"glow-cool":1,threat:2,defended:3},ke={"glow-gold":x.gold,"glow-cool":x.cool,threat:x.threat,defended:x.defended},Fe=`
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
}`;function ze(a){const t=new G(1,1);t.rotateX(-Math.PI/2);const o=new A(new Float32Array(F.tiles*3),3),n=new A(new Float32Array(F.tiles),1);t.setAttribute("aColor",o),t.setAttribute("aShape",n);const c=new M({name:"q3-overlay-tiles",uniforms:{uFade:{value:1}},vertexShader:Ce,fragmentShader:Fe,transparent:!0,depthWrite:!1,blending:_,toneMapped:!1}),e=C(new J(t,c,F.tiles));e.name="overlay-tiles",e.count=0,e.visible=!1,e.frustumCulled=!1,e.renderOrder=2;let l=0,v="";const r=new Q;return e.onBeforeRender=()=>{c.uniforms.uFade.value=E(l,performance.now(),a.reducedMotion())},{object:e,sync(i,u){const s=i.filter(d=>ie(d.style)),f=s.map(d=>d.square+d.style).join();if(f===v)return;const h=s.length>0&&v==="";v=f,s.forEach((d,p)=>{const m=a.squareToWorld(d.square);e.setMatrixAt(p,r.makeTranslation(m.x,Se,m.z));const y=ke[d.style];o.setXYZ(p,y.r,y.g,y.b),n.setX(p,be[d.style])}),e.count=s.length,e.visible=s.length>0,e.instanceMatrix.needsUpdate=!0,o.needsUpdate=!0,n.needsUpdate=!0,h&&(l=u,a.keepAwake(qe))},dispose(){e.removeFromParent(),t.dispose(),c.dispose(),e.dispose()}}}const qe=400,Ae=`
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
}`;function Pe(a){const t=new T;t.name="overlay-trails";const o=new Map;return{object:t,sync(n){const c=new Set(n.map(e=>e.id));for(const[e,l]of o)c.has(e)||(U(l),o.delete(e));for(const e of n){if(o.has(e.id))continue;const l=a.squareToWorld(e.from),v=a.squareToWorld(e.to),r=Math.hypot(v.x-l.x,v.z-l.z),i=new G(r,.2);i.rotateX(-Math.PI/2);const u=new M({name:"q3-overlay-trail",uniforms:{uColor:{value:x.gold.clone()},uLife:{value:1}},vertexShader:Ae,fragmentShader:Ue,transparent:!0,depthWrite:!1,blending:_,toneMapped:!1}),s=C(new k(i,u));s.name=`overlay-trail-${e.id}`,s.position.set((l.x+v.x)/2,.006,(l.z+v.z)/2),s.rotation.y=-Math.atan2(v.z-l.z,v.x-l.x),s.renderOrder=2,s.onBeforeRender=()=>{u.uniforms.uLife.value=Math.max(0,1-(performance.now()-e.at)/Z)},o.set(e.id,s),t.add(s),a.keepAwake(Z+50)}},dispose(){for(const n of o.values())U(n);o.clear(),t.removeFromParent()}}}function Oe(a){const t=ze(a),o=fe(a),n=pe(a),c=Pe(a),e=Me(a);a.group.add(t.object,e.object,c.object,o.object,n.object);let l=!1;return{host:a,sync(v){if(l)return;const r=performance.now();t.sync(v.tiles,r),e.sync(v.tiles,r),c.sync(v.trails,r),o.sync(v.arrows,r),n.sync(v.ghosts,r),a.invalidate()},dispose(){l||(l=!0,t.dispose(),e.dispose(),c.dispose(),o.dispose(),n.dispose(),a.alive()&&a.invalidate())}}}export{Oe as createOverlayRenderer};
