import{C as x,G as P,a1 as W,V as $,k as b,A as I,b as k,ae as B,af as te,s as O,ag as A,I as K,H as J}from"./three.module-mgnLR0Jt.js";import{aZ as D,bq as X,br as H}from"./index-fLcJXT9H.js";import{LIMITS as S,isMarkStyle as ae,isGlowStyle as ne,TRAIL_MS as Y}from"./api-Cz0zZ6n9.js";import"./game-BB7swOoV.js";import"./chess-Dz_znVVI.js";const M=.06,C=.22;function re(a,t){const e=Math.abs(X(t)-X(a)),r=Math.abs(H(t)-H(a));return e===1&&r===2||e===2&&r===1}const se=a=>Math.min(1.25,.32+.14*a);function ie(a,t){const e=D(a),r=D(t),l=r.x-e.x,o=r.z-e.z,n=Math.hypot(l,o)||1,s={x:e.x+l/n*C,y:M,z:e.z+o/n*C};if(!re(a,t)){const g=se(n),p={x:r.x,y:M,z:r.z};return{kind:"arc",points:[s,{x:e.x+l*.5,y:M+g,z:e.z+o*.5},p]}}const i=Math.abs(l)>Math.abs(o)?{x:r.x,z:e.z}:{x:e.x,z:r.z},u=.55,c=i.x-e.x,v=i.z-e.z,m=Math.hypot(c,v)||1;return{kind:"knight",points:[{x:e.x+c/m*C,y:M,z:e.z+v/m*C},{x:e.x+c*.55,y:M+u*.92,z:e.z+v*.55},{x:i.x,y:M+u,z:i.z},{x:i.x+(r.x-i.x)*.6,y:M+u*.6,z:i.z+(r.z-i.z)*.6},{x:r.x,y:M,z:r.z}]}}const w={gold:new x(15914378),cool:new x(10474751),threat:new x(16743014),defended:new x(8840117)},V=320,N=2200;function z(a){return a.traverse(t=>{t.castShadow=!1,t.receiveShadow=!1,t.userData.q3Overlay=!0,t.raycast=()=>{}}),a}const T=(a,t,e)=>e?1:Math.min(1,Math.max(0,(t-a)/V));function U(a){a.removeFromParent(),a.traverse(t=>{const e=t;if(!e.isMesh)return;e.geometry?.dispose();const r=e.material;Array.isArray(r)?r.forEach(l=>l.dispose()):r?.dispose()})}const q=`
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
}`,Z=`
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
}`,ce=`
uniform vec3 uColor;
uniform float uFade;
varying vec2 vUv;
varying vec3 vN;
varying vec3 vV;
void main() {
  float facing = abs(dot(normalize(vN), normalize(vV)));
  float a = uFade * 0.30 * pow(facing, 1.6) * smoothstep(0.0, 0.06, vUv.x);
  gl_FragColor = vec4(uColor * a, a);
}`,le={gold:w.gold,cool:w.cool,threat:w.threat};function de(a,t,e){const{points:r}=ie(t.from,t.to),l=new W(r.map(h=>new $(h.x,h.y,h.z)),!1,"centripetal"),o=l.getLength(),n=Math.max(24,Math.round(o*20)),s=le[t.style],f=t.style==="threat"?1:0,i=.24,u=Math.max(.5,1-i/o),c=new W(Array.from({length:33},(h,F)=>l.getPointAt(F/32*u)),!1,"centripetal"),v=()=>({uColor:{value:s.clone()},uFade:{value:0},uDash:{value:f},uLen:{value:o},uSpark:{value:0},uPhase:{value:0}}),m=new b({name:"q3-overlay-beam-core",uniforms:v(),vertexShader:q,fragmentShader:Z,transparent:!0,depthWrite:!1,toneMapped:!1}),d=new b({name:"q3-overlay-beam-shell",uniforms:v(),vertexShader:q,fragmentShader:ce,transparent:!0,depthWrite:!1,blending:I,toneMapped:!1}),g=new b({name:"q3-overlay-beam-head",uniforms:{...v(),uDash:{value:0}},vertexShader:q,fragmentShader:Z,transparent:!0,depthWrite:!1,toneMapped:!1}),p=new P;p.name=`overlay-beam-${t.id}`,p.add(new k(new B(c,n,.034,8,!1),m)),p.add(new k(new B(c,n,.1,10,!1),d));const y=new k(new te(.11,i,18),g),G=l.getPointAt(1),j=l.getPointAt(u);y.position.copy(j).lerp(G,.5),y.quaternion.setFromUnitVectors(new $(0,1,0),G.clone().sub(j).normalize()),p.add(y),p.children.forEach(h=>{h.renderOrder=3,h.frustumCulled=!1});const L=[m,d,g],_={spec:t,group:z(p),t0:e,mats:L},Q=()=>{const h=performance.now(),F=a.reducedMotion(),ee=T(_.t0,h,F),E=h-_.t0,oe=F||E>N?0:Math.min(1,(N-E)/400);for(const R of L)R.uniforms.uFade.value=ee,R.uniforms.uSpark.value=oe,R.uniforms.uPhase.value=E/900%1.2};return p.children.forEach(h=>{h.onBeforeRender=Q}),a.keepAwake(a.reducedMotion()?0:Math.max(V,N)+50),_}function ve(a){const t=new P;t.name="overlay-beams";const e=new Map;return{object:t,sync(r,l){const o=new Set(r.map(n=>n.id));for(const[n,s]of e)o.has(n)||(U(s.group),e.delete(n));for(const n of r){if(e.has(n.id))continue;const s=de(a,n,l);e.set(n.id,s),t.add(s.group)}},dispose(){for(const r of e.values())U(r.group);e.clear(),t.removeFromParent()}}}const fe=`
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
}`,ue={hint:w.gold,plan:w.cool};function pe(a){const t=new P;t.name="overlay-ghosts";const e=new Map,r=new Map,l=n=>{const s=n.piece.color+n.piece.type;if(!r.has(s)){const f=a.pieceGeometry(n.piece.type,n.piece.color);r.set(s,f?{geometry:f.geometry.clone(),scale:f.scale}:null)}return r.get(s)},o=n=>{n.mesh.removeFromParent(),n.mat.dispose()};return{object:t,sync(n,s){const f=new Set(n.map(i=>i.id));for(const[i,u]of e)f.has(i)||(o(u),e.delete(i));for(const i of n){if(e.has(i.id))continue;const u=l(i);if(!u)continue;const c=new b({name:"q3-overlay-ghost",uniforms:{uColor:{value:ue[i.style].clone()},uFade:{value:0}},vertexShader:q,fragmentShader:fe,transparent:!0,depthWrite:!1,toneMapped:!1}),v=z(new k(u.geometry,c));v.name=`overlay-ghost-${i.id}`;const m=a.squareToWorld(i.square);v.position.set(m.x,0,m.z),v.scale.setScalar(u.scale),i.piece.type==="n"&&i.piece.color==="b"&&(v.rotation.y=Math.PI),v.renderOrder=4;const d={spec:i,mesh:v,mat:c,t0:s};v.onBeforeRender=()=>{c.uniforms.uFade.value=T(d.t0,performance.now(),a.reducedMotion())},e.set(i.id,d),t.add(v),a.keepAwake(V+50)}},dispose(){for(const n of e.values())o(n);e.clear();for(const n of r.values())n?.geometry.dispose();r.clear(),t.removeFromParent()}}}const me=.0049,ge={"mark-from":0,"mark-to":1,"mark-check":2,"mark-focus":3,"mark-capture":4},he={"mark-from":new x(16447215),"mark-to":new x(16447215),"mark-check":new x(13941112),"mark-focus":new x(15985132),"mark-capture":new x(13941112)},ye=`
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
}`;function xe(a){const t=new O(1,1);t.rotateX(-Math.PI/2);const e=new A(new Float32Array(S.tiles*3),3),r=new A(new Float32Array(S.tiles),1);t.setAttribute("aColor",e),t.setAttribute("aShape",r);const l=new b({name:"q3-overlay-marks",uniforms:{uFade:{value:1}},vertexShader:we,fragmentShader:ye,transparent:!0,depthWrite:!1,toneMapped:!1}),o=z(new K(t,l,S.tiles));o.name="overlay-marks",o.count=0,o.visible=!1,o.frustumCulled=!1,o.renderOrder=3;let n=0,s="";const f=new J;return o.onBeforeRender=()=>{l.uniforms.uFade.value=T(n,performance.now(),a.reducedMotion())},{object:o,sync(i,u){const c=i.filter(d=>ae(d.style)),v=c.map(d=>d.square+d.style).join();if(v===s)return;const m=c.length>0&&s==="";s=v,c.forEach((d,g)=>{const p=a.squareToWorld(d.square);o.setMatrixAt(g,f.makeTranslation(p.x,me,p.z));const y=he[d.style];e.setXYZ(g,y.r,y.g,y.b),r.setX(g,ge[d.style])}),o.count=c.length,o.visible=c.length>0,o.instanceMatrix.needsUpdate=!0,e.needsUpdate=!0,r.needsUpdate=!0,m&&(n=u,a.keepAwake(400))},dispose(){o.removeFromParent(),t.dispose(),l.dispose(),o.dispose()}}}const Me=.0045,be={"glow-gold":0,"glow-cool":1,threat:2,defended:3},Se={"glow-gold":w.gold,"glow-cool":w.cool,threat:w.threat,defended:w.defended},ke=`
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
}`,ze=`
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
}`;function Fe(a){const t=new O(1,1);t.rotateX(-Math.PI/2);const e=new A(new Float32Array(S.tiles*3),3),r=new A(new Float32Array(S.tiles),1);t.setAttribute("aColor",e),t.setAttribute("aShape",r);const l=new b({name:"q3-overlay-tiles",uniforms:{uFade:{value:1}},vertexShader:ze,fragmentShader:ke,transparent:!0,depthWrite:!1,blending:I,toneMapped:!1}),o=z(new K(t,l,S.tiles));o.name="overlay-tiles",o.count=0,o.visible=!1,o.frustumCulled=!1,o.renderOrder=2;let n=0,s="";const f=new J;return o.onBeforeRender=()=>{l.uniforms.uFade.value=T(n,performance.now(),a.reducedMotion())},{object:o,sync(i,u){const c=i.filter(d=>ne(d.style)),v=c.map(d=>d.square+d.style).join();if(v===s)return;const m=c.length>0&&s==="";s=v,c.forEach((d,g)=>{const p=a.squareToWorld(d.square);o.setMatrixAt(g,f.makeTranslation(p.x,Me,p.z));const y=Se[d.style];e.setXYZ(g,y.r,y.g,y.b),r.setX(g,be[d.style])}),o.count=c.length,o.visible=c.length>0,o.instanceMatrix.needsUpdate=!0,e.needsUpdate=!0,r.needsUpdate=!0,m&&(n=u,a.keepAwake(Ce))},dispose(){o.removeFromParent(),t.dispose(),l.dispose(),o.dispose()}}}const Ce=400,qe=`
varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,Ae=`
uniform vec3 uColor;
uniform float uLife;
varying vec2 vUv;
void main() {
  float across = 1.0 - abs(vUv.y - 0.5) * 2.0;
  float a = uLife * vUv.x * smoothstep(0.0, 0.6, across) * 0.55;
  if (a < 0.003) discard;
  gl_FragColor = vec4(uColor * a, a);
}`;function Ue(a){const t=new P;t.name="overlay-trails";const e=new Map;return{object:t,sync(r){const l=new Set(r.map(o=>o.id));for(const[o,n]of e)l.has(o)||(U(n),e.delete(o));for(const o of r){if(e.has(o.id))continue;const n=a.squareToWorld(o.from),s=a.squareToWorld(o.to),f=Math.hypot(s.x-n.x,s.z-n.z),i=new O(f,.2);i.rotateX(-Math.PI/2);const u=new b({name:"q3-overlay-trail",uniforms:{uColor:{value:w.gold.clone()},uLife:{value:1}},vertexShader:qe,fragmentShader:Ae,transparent:!0,depthWrite:!1,blending:I,toneMapped:!1}),c=z(new k(i,u));c.name=`overlay-trail-${o.id}`,c.position.set((n.x+s.x)/2,.006,(n.z+s.z)/2),c.rotation.y=-Math.atan2(s.z-n.z,s.x-n.x),c.renderOrder=2,c.onBeforeRender=()=>{u.uniforms.uLife.value=Math.max(0,1-(performance.now()-o.at)/Y)},e.set(o.id,c),t.add(c),a.keepAwake(Y+50)}},dispose(){for(const r of e.values())U(r);e.clear(),t.removeFromParent()}}}function Ne(a){const t=Fe(a),e=ve(a),r=pe(a),l=Ue(a),o=xe(a);a.group.add(t.object,o.object,l.object,e.object,r.object);let n=!1;return{host:a,sync(s){if(n)return;const f=performance.now();t.sync(s.tiles,f),o.sync(s.tiles,f),l.sync(s.trails,f),e.sync(s.arrows,f),r.sync(s.ghosts,f),a.invalidate()},dispose(){n||(n=!0,t.dispose(),o.dispose(),l.dispose(),e.dispose(),r.dispose(),a.alive()&&a.invalidate())}}}export{Ne as createOverlayRenderer};
