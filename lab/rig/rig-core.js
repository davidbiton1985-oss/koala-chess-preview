// src/koala/rig.ts
var RIG_DEFAULT = true;
var rigCached = null;
function rigEnabled() {
  if (rigCached !== null) return rigCached;
  const q = typeof location !== "undefined" ? new URLSearchParams(location.search).get("koala") : null;
  if (q === "video" || q === "v2" || typeof document === "undefined") return rigCached = false;
  let gl2 = false;
  try {
    const c = document.createElement("canvas").getContext("webgl2");
    gl2 = !!c;
    c?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
  }
  return rigCached = gl2 && (q === "rig" || RIG_DEFAULT);
}
var MOUTH_SHAPES = "XABCDEF";
var MOUTH_XF = 0.06;
var MOUTH_JAW = [0, 0, 2.5, 5.5, 10, 5, 2];
var MOUTH_PUCKER = [0, 0, 0, 0, 0, 0.55, 1];
var MOUTH_LEAD = 0.03;
function mouthAt(cues, ls) {
  const t = ls + MOUTH_LEAD;
  let lo = 0, hi = cues.length;
  while (lo < hi) {
    const m = lo + hi >> 1;
    if (cues[m][0] <= t) lo = m + 1;
    else hi = m;
  }
  const i = lo - 1;
  const ix = (k) => Math.max(0, MOUTH_SHAPES.indexOf(k >= 0 && k < cues.length ? cues[k][1] : "X"));
  if (i < 0) return [0, 0, 0];
  return [ix(i - 1), ix(i), smooth(Math.min(1, (t - cues[i][0]) / MOUTH_XF))];
}
var VS = `#version 300 es
precision highp float;
in vec2 aPos;
uniform sampler2D uW, uE, uA;
uniform float uS;
uniform vec2 uNeck, uHinge, uEarLb, uEarRb, uHeadC, uHeadR, uNose, uBreathP, uLip0, uLip1, uMouthC, uMouthR;
uniform float uRoll, uYaw, uPitch, uJaw, uEarL, uEarR, uBreath, uLift, uPucker;
out vec2 vUv; out float vCav, vBelow;
vec2 rot(vec2 v, float a) { float c = cos(a), s = sin(a); return vec2(v.x * c - v.y * s, v.x * s + v.y * c); }
void main() {
  vec2 uv = aPos / uS;
  vec4 w = texture(uW, uv); vec4 e = texture(uE, uv); vec4 ax = texture(uA, uv);
  vec2 p = aPos;
  p = uHinge + rot(p - uHinge, -radians(uJaw) * w.g);
  // the pucker (run-1020 'oh' / 'oo'): the lips' corners drawn in, a little forward-and-down, about the mouth's middle
  vec2 mq = (aPos - uMouthC) / uMouthR; float mw = exp(-dot(mq, mq) * 1.6);
  p.x = uMouthC.x + (p.x - uMouthC.x) * (1.0 - 0.22 * uPucker * mw);
  p.y += 2.5 * uPucker * mw;
  float left = step(p.x, uHeadC.x);
  vec2 eb = mix(uEarRb, uEarLb, left);
  p = eb + rot(p - eb, radians(mix(uEarR, -uEarL, left)) * ax.r);
  vec2 q = (aPos - uHeadC) / uHeadR;
  float z = 0.55 * uHeadR.x * sqrt(max(0.0, 1.0 - dot(q, q))) + 34.0 * exp(-dot(aPos - uNose, aPos - uNose) / (2.0 * 46.0 * 46.0));
  p += w.r * z * vec2(sin(radians(uYaw)), sin(radians(uPitch)));
  p = uNeck + rot(p - uNeck, radians(uRoll) * w.r);
  p.y -= uLift * w.r;
  p += w.b * (p - uBreathP) * (0.0075 * uBreath);
  p.y -= 1.6 * uBreath * w.r;
  vUv = uv;
  vCav = e.b * clamp(uJaw / 8.0, 0.0, 1.0);
  vec2 dl = uLip1 - uLip0; vBelow = dot(aPos - uLip0, vec2(-dl.y, dl.x) / length(dl));   // rest px below the upper-lip line
  gl_Position = vec4(p.x / uS * 2.0 - 1.0, 1.0 - p.y / uS * 2.0, 0.0, 1.0);
}`;
var FS = `#version 300 es
precision highp float;
in vec2 vUv; in float vCav, vBelow;
uniform sampler2D uRest, uE, uM;
uniform float uBlinkL, uBlinkR, uLidH, uAlphaOut, uMA, uMB, uMMix, uMOn, uMN;
uniform vec4 uMBox;
out vec4 o;
void main() {
  vec4 e = texture(uE, vUv);
  float b = e.r * uBlinkL + e.g * uBlinkR;
  vec4 c = texture(uRest, vUv - vec2(0.0, b * uLidH));
  c.rgb *= 1.0 - 0.18 * b;
  // the mouth picture (run-1020 lip-sync): its box of the rest frame, the shape dissolving from uMA to uMB; each tile's
  // alpha is its soft mask (zero at the tile's edge, so the linear filter never reads a neighbour)
  vec2 mq = (vUv - uMBox.xy) / uMBox.zw;
  if (uMOn > 0.5 && mq.x >= 0.0 && mq.y >= 0.0 && mq.x <= 1.0 && mq.y <= 1.0) {
    vec4 ma = texture(uM, vec2((uMA + mq.x) / uMN, mq.y)), mb = texture(uM, vec2((uMB + mq.x) / uMN, mq.y));
    vec4 m = mix(ma, mb, uMMix);
    c.rgb = mix(c.rgb, m.rgb, m.a);
  }
  // the open mouth: deepest in the gap under the upper lip, the inner lower lip a dark wet red below it; a little of the
  // photo's own light kept, so the cavity is never a flat patch
  float low = smoothstep(5.0, 13.0, vBelow);
  vec3 cav = mix(vec3(0.05, 0.025, 0.025), vec3(0.36, 0.14, 0.13), low) * (0.75 + 0.5 * dot(c.rgb, vec3(0.3, 0.59, 0.11)));
  c.rgb = mix(c.rgb, cav, clamp(vCav * 0.95, 0.0, 0.92) * mix(1.0, 0.8, low));
  o = uAlphaOut > 0.5 ? vec4(vec3(c.a), 1.0) : vec4(c.rgb * c.a, c.a);
}`;
var QVS = `#version 300 es
precision highp float;
in vec2 aQ; uniform vec4 uBox; uniform float uS; out vec2 vQ;
void main() { vQ = aQ; vec2 p = uBox.xy + aQ * uBox.zw; gl_Position = vec4(p.x / uS * 2.0 - 1.0, 1.0 - p.y / uS * 2.0, 0.0, 1.0); }`;
var QFS = `#version 300 es
precision highp float;
in vec2 vQ; uniform sampler2D uG; uniform float uAlphaOut, uFade; out vec4 o;
void main() {
  vec3 c = texture(uG, vec2(vQ.x, vQ.y * 0.5)).rgb * uFade; float a = texture(uG, vec2(vQ.x, 0.5 + vQ.y * 0.5)).r * uFade;
  o = uAlphaOut > 0.5 ? vec4(vec3(a), a) : vec4(c, a);      // premultiplied
}`;
var SVS = `#version 300 es
precision highp float;
in vec2 aQ; uniform vec4 uBox; uniform float uS, uFore, uPaw, uW1, uW2; uniform vec2 uElbow, uWrist; out vec2 vQ;
vec2 rot(vec2 v, float a) { float c = cos(a), s = sin(a); return vec2(v.x * c - v.y * s, v.x * s + v.y * c); }
void main() {
  vQ = aQ;
  vec2 p = uBox.xy + aQ * uBox.zw;
  vec2 ax = uWrist - uElbow; float L = length(ax); vec2 d = ax / L;
  vec2 q = p - uElbow; float s = dot(q, d) / L; float lat = abs(q.x * d.y - q.y * d.x);
  float wf = smoothstep(-0.08, 0.28, s) * (1.0 - smoothstep(uW1, uW1 * 1.45, lat));
  float wp = smoothstep(0.80, 1.04, s) * (1.0 - smoothstep(uW2, uW2 * 1.4, lat));
  vec2 wr = uElbow + rot(ax, radians(uFore));
  vec2 p1 = uElbow + rot(q, radians(uFore) * wf);
  p1 = mix(p1, wr + rot(p1 - wr, radians(uPaw)), wp);
  gl_Position = vec4(p1.x / uS * 2.0 - 1.0, 1.0 - p1.y / uS * 2.0, 0.0, 1.0);
}`;
var SFS = `#version 300 es
precision highp float;
in vec2 vQ; uniform sampler2D uG; uniform float uAlphaOut, uFade; out vec4 o;
void main() { vec4 c = texture(uG, vQ); float a = c.a * uFade; o = uAlphaOut > 0.5 ? vec4(vec3(a), a) : vec4(c.rgb * a, a); }`;
var img = (url) => new Promise((res, rej) => {
  const i = new Image();
  i.crossOrigin = "anonymous";
  i.onload = () => res(i);
  i.onerror = rej;
  i.src = url;
});
function rng(seed) {
  let s = seed >>> 0;
  return () => (s = Math.imul(s, 1664525) + 1013904223 >>> 0) / 4294967296;
}
var smooth = (x) => x * x * (3 - 2 * x);
function makeLife(seed = 7) {
  const r = rng(seed);
  const blinks = [];
  for (let t = 1.2; t < 3600; t += 2.6 + r() * 4.2) {
    blinks.push(t);
    if (r() < 0.18) blinks.push(t + 0.32);
  }
  const twitches = [];
  for (let t = 3.5; t < 3600; t += 5 + r() * 9) twitches.push([t, r() < 0.5 ? "L" : "R"]);
  const from = (a, t) => {
    let lo = 0, hi = a.length;
    while (lo < hi) {
      const m = lo + hi >> 1;
      if (a[m] < t) lo = m + 1;
      else hi = m;
    }
    return lo;
  };
  const twT = twitches.map((x) => x[0]);
  const blinkAt = (t) => {
    let v = 0;
    for (let i = Math.max(0, from(blinks, t - 0.3)); i < blinks.length && blinks[i] <= t; i++) {
      const d = t - blinks[i];
      v = Math.max(v, d < 0.07 ? smooth(d / 0.07) : d < 0.11 ? 1 : 1 - smooth(Math.min(1, (d - 0.11) / 0.17)));
    }
    return v;
  };
  const twitchAt = (t, side) => {
    let v = 0;
    for (let i = Math.max(0, from(twT, t - 0.9)); i < twitches.length && twitches[i][0] <= t; i++) {
      const [tt, s] = twitches[i];
      if (s !== side) continue;
      const d = t - tt;
      v += 4.2 * (1 - Math.exp(-d / 0.025)) * Math.exp(-d * 5) * Math.sin(d * 17);
    }
    return v;
  };
  const S = (t, p, ph) => Math.sin(2 * Math.PI * t / p + ph);
  const looks = [[0, 0, 0], [-5.5, 1.2, -1.2], [4.5, -0.8, 1], [2, 3, 1.4], [-3, -1.6, -0.6], [6, 1.5, 1.8], [0, 2.4, 0]];
  const glances = [];
  for (let t = 2.2, last = 0; t < 3600; t += 2.4 + r() * 4.6) {
    let k = Math.floor(r() * looks.length);
    if (k === last) k = 0;
    glances.push({ t, to: looks[k], dur: 0.7 + r() * 0.5 });
    last = k;
  }
  const gT = glances.map((g) => g.t);
  const minJerk = (x) => x * x * x * (10 - 15 * x + 6 * x * x);
  const lookAt = (t) => {
    const i = from(gT, t + 1e-9) - 1;
    if (i < 0) return [0, 0, 0];
    const g = glances[i], prev = i > 0 ? glances[i - 1].to : [0, 0, 0];
    const u = minJerk(Math.min(1, (t - g.t) / g.dur));
    return [prev[0] + (g.to[0] - prev[0]) * u, prev[1] + (g.to[1] - prev[1]) * u, prev[2] + (g.to[2] - prev[2]) * u];
  };
  return (t, speak, hold = 0, look = 0, react = null) => {
    const ph = t / 3.9 % 1;
    const breath = ph < 0.42 ? -Math.cos(Math.PI * ph / 0.42) : Math.cos(Math.PI * (ph - 0.42) / 0.58);
    let [gy, gp, gr] = lookAt(t);
    const lk = smooth(Math.min(1, Math.max(0, look)));
    gy = gy * (1 - lk) - 5 * lk;
    gp = gp * (1 - lk) + 3.2 * lk;
    gr = gr * (1 - lk) - 1.2 * lk;
    let roll = gr + 0.25 * S(t, 7.3, 1);
    let yaw = gy + 0.35 * S(t, 9.7, 0);
    let pitch = gp + 0.3 * S(t, 6.1, 0.5) - 0.25 * breath;
    let jaw = 0, lift = 0, mA = 0, mB = 0, mMix = 0, mOn = 0;
    if (speak) {
      const ls = t - speak.t0, tr = speak.track;
      const at = (x) => {
        const f = x * tr.fps, i = Math.floor(f);
        if (i < 0 || i >= tr.jaw.length) return 0;
        return tr.jaw[i] + (tr.jaw[Math.min(i + 1, tr.jaw.length - 1)] - tr.jaw[i]) * (f - i);
      };
      jaw = at(ls + 0.04);
      if (tr.cues?.length) {
        [mA, mB, mMix] = mouthAt(tr.cues, ls);
        mOn = 1;
      }
      let sl = 0;
      for (let k2 = 0; k2 < 7; k2++) sl += Math.max(0, at(ls - 0.03 * k2));
      sl /= 7;
      const on = smooth(Math.min(1, Math.max(0, Math.min(ls / 0.35, (tr.duration + 0.4 - ls) / 0.5))));
      yaw = yaw * (1 - 0.7 * on) - 2 * on;
      pitch += 0.2 * sl;
      roll += 0.05 * sl * S(t, 1.7, 0);
      lift = 1.5 * on;
    }
    if (react) {
      const d = t - react.t0;
      if (react.kind === "nod" && d >= 0 && d < 0.9) pitch += 3.2 * Math.sin(Math.PI * Math.min(1, d / 0.45)) * (d < 0.45 ? 1 : Math.max(0, 1 - (d - 0.45) / 0.45)) + 1.6 * (d > 0.45 ? Math.sin(Math.PI * (d - 0.45) / 0.45) : 0);
      if (react.kind === "cheer" && d >= 0 && d < 1.4) {
        const e = Math.sin(Math.PI * d / 1.4);
        lift += 5 * e;
        pitch -= 2.2 * e;
        roll += 2.4 * Math.sin(d * 9) * e;
      }
      if (react.kind === "think" && d >= 0 && d < 2.6) {
        const e = smooth(Math.min(1, d / 0.5)) * smooth(Math.min(1, (2.6 - d) / 0.5));
        yaw = yaw * (1 - e) + 4.5 * e;
        pitch = pitch * (1 - e) - 1.5 * e;
        roll = roll * (1 - e) + 2 * e;
      }
    }
    const sway = 0.5 * Math.cos(2 * Math.PI * t / 7.3 + 1);
    const blink = blinkAt(t);
    const k = 1 - smooth(Math.min(1, Math.max(0, hold)));
    return { breath: breath * (0.35 + 0.65 * k), roll: roll * k, yaw: yaw * k, pitch: pitch * k, jaw, earL: (-sway + twitchAt(t, "L")) * k, earR: (sway + twitchAt(t, "R")) * k, blinkL: blink, blinkR: blink, lift: lift * k, mA, mB, mMix, mOn };
  };
}
async function createRig(gl, base) {
  const [rig, rest, w, e, ax] = await Promise.all([
    fetch(`${base}koala/rig/rig.json`).then((r) => r.json()),
    img(`${base}koala/rig/rest.png`),
    img(`${base}koala/rig/weights.png`),
    img(`${base}koala/rig/eyes.png`),
    img(`${base}koala/rig/aux.png`)
  ]).catch(() => [null, null, null, null, null]);
  if (!rig || !rest || !w || !e || !ax || gl.isContextLost()) return null;
  const sh = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const pr = gl.createProgram();
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS));
  gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) {
    console.warn("[rig] link", gl.getProgramInfoLog(pr));
    return null;
  }
  gl.useProgram(pr);
  const N = 192, S = rig.size;
  const pos = new Float32Array((N + 1) * (N + 1) * 2);
  let k = 0;
  for (let y = 0; y <= N; y++) for (let x = 0; x <= N; x++) {
    pos[k++] = x / N * S;
    pos[k++] = y / N * S;
  }
  const idx = new Uint32Array(N * N * 6);
  k = 0;
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const a = y * (N + 1) + x, b = a + 1, c = a + N + 1, d = c + 1;
    idx.set([a, b, c, b, d, c], k);
    k += 6;
  }
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const vb = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vb);
  gl.bufferData(gl.ARRAY_BUFFER, pos, gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, "aPos");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const ib = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idx, gl.STATIC_DRAW);
  const texs = [];
  const tex = (unit, im, mip) => {
    const t = gl.createTexture();
    texs.push(t);
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im);
    if (mip) gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, mip ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  };
  tex(0, rest, true);
  tex(1, w, false);
  tex(2, e, false);
  tex(3, ax, false);
  const U = (n) => gl.getUniformLocation(pr, n);
  gl.uniform1i(U("uRest"), 0);
  gl.uniform1i(U("uW"), 1);
  gl.uniform1i(U("uE"), 2);
  gl.uniform1i(U("uA"), 3);
  gl.uniform1f(U("uS"), S);
  for (const [u, kk] of [["uNeck", "neck"], ["uHinge", "hinge"], ["uEarLb", "earL_base"], ["uEarRb", "earR_base"], ["uHeadC", "head_c"], ["uHeadR", "head_r"], ["uNose", "nose"], ["uBreathP", "breath_pivot"], ["uLip0", "lip0"], ["uLip1", "lip1"]]) {
    const v = rig[kk];
    gl.uniform2f(U(u), v[0], v[1]);
  }
  gl.uniform1f(U("uLidH"), 22 / S);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);
  const ul = {
    roll: U("uRoll"),
    yaw: U("uYaw"),
    pitch: U("uPitch"),
    jaw: U("uJaw"),
    earL: U("uEarL"),
    earR: U("uEarR"),
    breath: U("uBreath"),
    blinkL: U("uBlinkL"),
    blinkR: U("uBlinkR"),
    lift: U("uLift")
  };
  const uAlphaOut = U("uAlphaOut");
  const um = { a: U("uMA"), b: U("uMB"), mix: U("uMMix"), on: U("uMOn") };
  const uPucker = U("uPucker");
  {
    const mc = rig.mouth_c, mr = rig.mouth_r;
    gl.uniform2f(U("uMouthC"), mc[0], mc[1]);
    gl.uniform2f(U("uMouthR"), mr[0], mr[1]);
  }
  const mj = rig.mouth;
  let mouthOk = false;
  if (mj?.box && mj.shapes === MOUTH_SHAPES) {
    gl.uniform1i(U("uM"), 6);
    gl.uniform1f(U("uMN"), MOUTH_SHAPES.length);
    gl.uniform4f(U("uMBox"), mj.box[0] / S, mj.box[1] / S, mj.box[2] / S, mj.box[3] / S);
    void img(`${base}koala/rig/mouth.webp?v=${mj.v ?? 1}`).then((im) => {
      if (gl.isContextLost()) return;
      const t = gl.createTexture();
      texs.push(t);
      gl.activeTexture(gl.TEXTURE6);
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im);
      for (const [k2, v] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]]) gl.texParameteri(gl.TEXTURE_2D, k2, v);
      mouthOk = true;
    }).catch(() => void 0);
  }
  const wj = rig.wave;
  const bx = Array.isArray(wj?.box) ? wj.box : null;
  const box = bx ? [bx[0], bx[1], bx[2], bx[3] ?? bx[2]] : null;
  const qp = gl.createProgram();
  gl.attachShader(qp, sh(gl.VERTEX_SHADER, QVS));
  gl.attachShader(qp, sh(gl.FRAGMENT_SHADER, QFS));
  gl.linkProgram(qp);
  const qvao = gl.createVertexArray();
  gl.bindVertexArray(qvao);
  const qb = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, qb);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), gl.STATIC_DRAW);
  const ql = gl.getAttribLocation(qp, "aQ");
  gl.enableVertexAttribArray(ql);
  gl.vertexAttribPointer(ql, 2, gl.FLOAT, false, 0, 0);
  const gt = gl.createTexture();
  texs.push(gt);
  gl.activeTexture(gl.TEXTURE4);
  gl.bindTexture(gl.TEXTURE_2D, gt);
  for (const [k2, v] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]]) gl.texParameteri(gl.TEXTURE_2D, k2, v);
  gl.useProgram(qp);
  gl.uniform1i(gl.getUniformLocation(qp, "uG"), 4);
  gl.uniform1f(gl.getUniformLocation(qp, "uS"), S);
  if (box) gl.uniform4f(gl.getUniformLocation(qp, "uBox"), box[0], box[1], box[2], box[3]);
  const qAlpha = gl.getUniformLocation(qp, "uAlphaOut"), qFade = gl.getUniformLocation(qp, "uFade");
  const sp = gl.createProgram();
  gl.attachShader(sp, sh(gl.VERTEX_SHADER, SVS));
  gl.attachShader(sp, sh(gl.FRAGMENT_SHADER, SFS));
  gl.linkProgram(sp);
  const SN = 48, sg = new Float32Array((SN + 1) * (SN + 1) * 2);
  let si = 0;
  for (let y = 0; y <= SN; y++) for (let x = 0; x <= SN; x++) {
    sg[si++] = x / SN;
    sg[si++] = y / SN;
  }
  const sidx = new Uint16Array(SN * SN * 6);
  si = 0;
  for (let y = 0; y < SN; y++) for (let x = 0; x < SN; x++) {
    const a0 = y * (SN + 1) + x, b0 = a0 + 1, c0 = a0 + SN + 1, d0 = c0 + 1;
    sidx.set([a0, b0, c0, b0, d0, c0], si);
    si += 6;
  }
  const svao = gl.createVertexArray();
  gl.bindVertexArray(svao);
  const sb = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, sb);
  gl.bufferData(gl.ARRAY_BUFFER, sg, gl.STATIC_DRAW);
  const sl = gl.getAttribLocation(sp, "aQ");
  gl.enableVertexAttribArray(sl);
  gl.vertexAttribPointer(sl, 2, gl.FLOAT, false, 0, 0);
  const sib = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sib);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, sidx, gl.STATIC_DRAW);
  gl.useProgram(sp);
  gl.uniform1i(gl.getUniformLocation(sp, "uG"), 5);
  gl.uniform1f(gl.getUniformLocation(sp, "uS"), S);
  if (box) gl.uniform4f(gl.getUniformLocation(sp, "uBox"), box[0], box[1], box[2], box[3]);
  const el = wj?.elbow ?? [0, 0], wr = wj?.wrist ?? [0, 1];
  gl.uniform2f(gl.getUniformLocation(sp, "uElbow"), el[0], el[1]);
  gl.uniform2f(gl.getUniformLocation(sp, "uWrist"), wr[0], wr[1]);
  gl.uniform1f(gl.getUniformLocation(sp, "uW1"), wj?.fore_w ?? 78);
  gl.uniform1f(gl.getUniformLocation(sp, "uW2"), wj?.paw_w ?? 95);
  const sAlpha = gl.getUniformLocation(sp, "uAlphaOut"), sFade = gl.getUniformLocation(sp, "uFade"), sFore = gl.getUniformLocation(sp, "uFore"), sPaw = gl.getUniformLocation(sp, "uPaw");
  const st = gl.createTexture();
  texs.push(st);
  gl.activeTexture(gl.TEXTURE5);
  gl.bindTexture(gl.TEXTURE_2D, st);
  for (const [k2, v] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]]) gl.texParameteri(gl.TEXTURE_2D, k2, v);
  let stillOf = null;
  gl.useProgram(pr);
  gl.bindVertexArray(vao);
  let glayer = null, gfade = 1, gfresh = false;
  const drawGesture = (alphaOut) => {
    if (!glayer || !box) return;
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    if (glayer.kind === "video") {
      gl.useProgram(qp);
      gl.bindVertexArray(qvao);
      gl.uniform1f(qAlpha, alphaOut);
      gl.uniform1f(qFade, gfade);
      gl.activeTexture(gl.TEXTURE4);
      gl.bindTexture(gl.TEXTURE_2D, gt);
      if (gfresh) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, glayer.src);
        gfresh = false;
      }
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    } else {
      gl.useProgram(sp);
      gl.bindVertexArray(svao);
      gl.uniform1f(sAlpha, alphaOut);
      gl.uniform1f(sFade, gfade * (glayer.fade ?? 1));
      gl.uniform1f(sFore, glayer.fore);
      gl.uniform1f(sPaw, glayer.paw);
      gl.activeTexture(gl.TEXTURE5);
      gl.bindTexture(gl.TEXTURE_2D, st);
      if (stillOf !== glayer.src) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, glayer.src);
        stillOf = glayer.src;
      }
      gl.drawElements(gl.TRIANGLES, sidx.length, gl.UNSIGNED_SHORT, 0);
    }
    gl.useProgram(pr);
    gl.bindVertexArray(vao);
  };
  const pose = (p) => {
    const on = mouthOk && !!p.mOn;
    const ma = p.mA ?? 0, mb = p.mB ?? 0, mx = p.mMix ?? 0;
    const jaw = on ? MOUTH_JAW[ma] + (MOUTH_JAW[mb] - MOUTH_JAW[ma]) * mx : p.jaw;
    gl.uniform1f(uPucker, on ? MOUTH_PUCKER[ma] + (MOUTH_PUCKER[mb] - MOUTH_PUCKER[ma]) * mx : 0);
    for (const key of Object.keys(ul)) gl.uniform1f(ul[key], key === "jaw" ? jaw : p[key] ?? 0);
    gl.uniform1f(um.on, on ? 1 : 0);
    gl.uniform1f(um.a, p.mA ?? 0);
    gl.uniform1f(um.b, p.mB ?? 0);
    gl.uniform1f(um.mix, p.mMix ?? 0);
  };
  return {
    gesture(layer, fade = 1) {
      glayer = layer;
      gfresh = true;
      gfade = Math.max(0, Math.min(1, fade));
    },
    headPoint(p, x, y) {
      const hc = rig.head_c, hr = rig.head_r, no = rig.nose, nk = rig.neck;
      const qx = (x - hc[0]) / hr[0], qy = (y - hc[1]) / hr[1];
      const z = 0.55 * hr[0] * Math.sqrt(Math.max(0, 1 - qx * qx - qy * qy)) + 34 * Math.exp(-((x - no[0]) ** 2 + (y - no[1]) ** 2) / (2 * 46 * 46));
      let px = x + z * Math.sin(p.yaw * Math.PI / 180), py = y + z * Math.sin(p.pitch * Math.PI / 180);
      const r = p.roll * Math.PI / 180, dx = px - nk[0], dy = py - nk[1];
      px = nk[0] + dx * Math.cos(r) - dy * Math.sin(r);
      py = nk[1] + dx * Math.sin(r) + dy * Math.cos(r);
      return [px, py - p.lift - 1.6 * p.breath, p.roll];
    },
    draw(p) {
      if (gl.isContextLost()) return;
      gl.useProgram(pr);
      gl.bindVertexArray(vao);
      gl.uniform1f(uAlphaOut, 0);
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.clear(gl.COLOR_BUFFER_BIT);
      pose(p);
      gl.drawElements(gl.TRIANGLES, idx.length, gl.UNSIGNED_INT, 0);
      drawGesture(0);
    },
    drawPacked(p) {
      if (gl.isContextLost()) return;
      const w2 = gl.drawingBufferWidth, h = gl.drawingBufferHeight / 2;
      gl.useProgram(pr);
      gl.bindVertexArray(vao);
      pose(p);
      gl.viewport(0, 0, w2, h * 2);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.clearColor(0, 0, 0, 0);
      gl.disable(gl.BLEND);
      gl.viewport(0, h, w2, h);
      gl.uniform1f(uAlphaOut, 0);
      gl.drawElements(gl.TRIANGLES, idx.length, gl.UNSIGNED_INT, 0);
      drawGesture(0);
      gl.disable(gl.BLEND);
      gl.useProgram(pr);
      gl.bindVertexArray(vao);
      gl.viewport(0, 0, w2, h);
      gl.uniform1f(uAlphaOut, 1);
      gl.drawElements(gl.TRIANGLES, idx.length, gl.UNSIGNED_INT, 0);
      drawGesture(1);
      gl.enable(gl.BLEND);
    },
    destroy() {
      if (gl.isContextLost()) return;
      for (const t of texs) gl.deleteTexture(t);
      gl.deleteBuffer(vb);
      gl.deleteBuffer(ib);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(pr);
    }
  };
}
var trackCache = /* @__PURE__ */ new Map();
function rigTrack(base, land, lang, id) {
  const url = `${base}koala/rig/tracks/${land}/${lang}/${id}.json`;
  let p = trackCache.get(url);
  if (!p) {
    p = fetch(url).then((r) => r.ok ? r.json() : null).catch(() => null);
    trackCache.set(url, p);
  }
  return p;
}
var shared = null;
function rigSource(base, size = 512) {
  if (shared) return shared;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size * 2;
  const gl = canvas.getContext("webgl2", { premultipliedAlpha: false, alpha: false, antialias: true, preserveDrawingBuffer: true });
  let rig = null;
  const life = makeLife(5);
  const ready = gl ? createRig(gl, base).then((r) => {
    rig = r;
    return !!r;
  }) : Promise.resolve(false);
  let last = -1, reaction = null;
  shared = {
    canvas,
    ready,
    get ok() {
      return !!rig;
    },
    react(kind) {
      reaction = { t0: performance.now() / 1e3, kind };
      const ms = kind === "think" ? 2600 : kind === "cheer" ? 1400 : 900;
      return new Promise((r) => window.setTimeout(() => {
        reaction = null;
        r();
      }, ms));
    },
    frame(speak) {
      const now = performance.now();
      if (!rig || now - last < 4) return;
      last = now;
      rig.drawPacked(life(now / 1e3, speak, 0, 0, reaction));
    }
  };
  return shared;
}
function waveBend(tw, dur) {
  if (tw <= 0 || tw >= dur) return { fore: 0, paw: 0 };
  const env = smooth(Math.min(1, tw / 0.35)) * smooth(Math.min(1, (dur - tw) / 0.45));
  const w = 2 * Math.PI * 1.55 * tw;
  return { fore: 6 * env * Math.sin(w), paw: 12 * env * Math.sin(w - 0.9) };
}
function rigWave(base) {
  const mk = (src) => {
    const v = document.createElement("video");
    v.muted = true;
    v.playsInline = true;
    v.preload = "auto";
    v.crossOrigin = "anonymous";
    v.loop = false;
    v.src = src;
    return v;
  };
  let up = null, down = null, still = null;
  let ok = 0;
  const LEAD = 0.3;
  let rdur = 0.8, ldur = 0.9;
  void fetch(`${base}koala/rig/rig.json`).then((r) => r.json()).then((j) => {
    if (j.wave?.v !== 2) return;
    rdur = j.wave.rdur ?? rdur;
    ldur = j.wave.ldur ?? ldur;
    up = mk(`${base}koala/rig/wave_raise.mp4`);
    down = mk(`${base}koala/rig/wave_lower.mp4`);
    for (const v of [up, down]) v.addEventListener("canplaythrough", () => {
      ok++;
    }, { once: true });
    still = new Image();
    still.crossOrigin = "anonymous";
    still.onload = () => {
      ok++;
    };
    still.src = `${base}koala/rig/wave_still.webp`;
  }).catch(() => void 0);
  let ph = "idle", at = 0, wdur = 1.7, outFrom = 0;
  const now_ = () => performance.now() / 1e3;
  const playing = (v) => v.readyState >= 2 && v.currentTime > 0 && !v.ended;
  const done = (v, d) => v.ended || v.currentTime >= d - 0.5 / 60;
  const go = (p, t) => {
    ph = p;
    at = t;
  };
  return {
    get ready() {
      return ok >= 3;
    },
    get busy() {
      return ph !== "idle";
    },
    get phase() {
      return ph;
    },
    start(lineDur) {
      if (ok < 3 || ph !== "idle") return;
      wdur = Math.max(1.2, Math.min(2.4, (lineDur ?? 3.7) - rdur - ldur - 0.3));
      go("lead", now_());
    },
    // he left the screen mid-wave: back to rest, so he never comes back with the paw up
    cancel() {
      ph = "idle";
      up?.pause();
      down?.pause();
    },
    hold(nowMs) {
      const t = nowMs / 1e3;
      if (ph === "idle") return 0;
      if (ph === "lead") return smooth(Math.min(1, (t - at) / LEAD));
      if (ph === "tail") return 1 - smooth(Math.min(1, (t - at) / LEAD));
      return 1;
    },
    layer(nowMs) {
      const t = nowMs / 1e3;
      if (!up || !down || !still) return null;
      switch (ph) {
        case "idle":
          return null;
        case "lead":
          if (t - at < LEAD) return null;
          up.currentTime = 0;
          void up.play().catch(() => void 0);
          go("raise", t);
          return null;
        case "raise":
          if (done(up, rdur)) {
            go("wave", t);
            return { kind: "still", src: still, fore: 0, paw: 0 };
          }
          if (playing(up)) return { kind: "video", src: up };
          if (t - at > 0.8) go("tail", t);
          return null;
        case "wave": {
          const x = t - at;
          if (x >= wdur) {
            down.currentTime = 0;
            void down.play().catch(() => void 0);
            go("lower", t);
            return { kind: "still", src: still, fore: 0, paw: 0 };
          }
          return { kind: "still", src: still, ...waveBend(x, wdur) };
        }
        case "lower":
          if (done(down, ldur)) {
            go("tail", t);
            return null;
          }
          if (playing(down)) return { kind: "video", src: down };
          if (t - at > 0.8) {
            go("out", t);
            outFrom = t;
          }
          return { kind: "still", src: still, fore: 0, paw: 0 };
        case "out": {
          const f = 1 - (t - outFrom) / 0.4;
          if (f <= 0) {
            go("tail", t);
            return null;
          }
          return { kind: "still", src: still, fore: 0, paw: 0, fade: f };
        }
        case "tail":
          if (t - at >= LEAD) ph = "idle";
          return null;
      }
      return null;
    }
  };
}
var voiceSrc = (el) => el.dataset.clip || el.currentSrc || el.src;
function rigSpeechFrom(base) {
  let cur = null;
  return (el) => {
    if (!el) return null;
    const src = voiceSrc(el);
    if (!src || el.paused || el.currentTime <= 0) return null;
    if (cur?.src !== src) {
      cur = { src, track: null };
      const m = /adventure\/([^/]+)\/voice\/(he|en)\/([^/?#]+)\.m4a/.exec(src);
      if (m) {
        const mine = cur;
        void rigTrack(base, m[1], m[2], m[3]).then((t) => {
          mine.track = t;
        });
      }
    }
    return cur.track ? { t0: performance.now() / 1e3 - el.currentTime, track: cur.track } : null;
  };
}
export {
  MOUTH_JAW,
  MOUTH_PUCKER,
  MOUTH_SHAPES,
  RIG_DEFAULT,
  createRig,
  makeLife,
  mouthAt,
  rigEnabled,
  rigSource,
  rigSpeechFrom,
  rigTrack,
  rigWave,
  voiceSrc,
  waveBend
};
