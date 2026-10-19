const RIG_DEFAULT = true;
let rigCached = null;
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
const VS = `#version 300 es
precision highp float;
in vec2 aPos;
uniform sampler2D uW, uE, uA;
uniform float uS;
uniform vec2 uNeck, uHinge, uEarLb, uEarRb, uHeadC, uHeadR, uNose, uBreathP, uLip0, uLip1;
uniform float uRoll, uYaw, uPitch, uJaw, uEarL, uEarR, uBreath, uLift;
out vec2 vUv; out float vCav, vBelow;
vec2 rot(vec2 v, float a) { float c = cos(a), s = sin(a); return vec2(v.x * c - v.y * s, v.x * s + v.y * c); }
void main() {
  vec2 uv = aPos / uS;
  vec4 w = texture(uW, uv); vec4 e = texture(uE, uv); vec4 ax = texture(uA, uv);
  vec2 p = aPos;
  p = uHinge + rot(p - uHinge, -radians(uJaw) * w.g);
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
const FS = `#version 300 es
precision highp float;
in vec2 vUv; in float vCav, vBelow;
uniform sampler2D uRest, uE;
uniform float uBlinkL, uBlinkR, uLidH, uAlphaOut;
out vec4 o;
void main() {
  vec4 e = texture(uE, vUv);
  float b = e.r * uBlinkL + e.g * uBlinkR;
  vec4 c = texture(uRest, vUv - vec2(0.0, b * uLidH));
  c.rgb *= 1.0 - 0.18 * b;
  // the open mouth: deepest in the gap under the upper lip, the inner lower lip a dark wet red below it; a little of the
  // photo's own light kept, so the cavity is never a flat patch
  float low = smoothstep(5.0, 13.0, vBelow);
  vec3 cav = mix(vec3(0.05, 0.025, 0.025), vec3(0.36, 0.14, 0.13), low) * (0.75 + 0.5 * dot(c.rgb, vec3(0.3, 0.59, 0.11)));
  c.rgb = mix(c.rgb, cav, clamp(vCav * 0.95, 0.0, 0.92) * mix(1.0, 0.8, low));
  o = uAlphaOut > 0.5 ? vec4(vec3(c.a), 1.0) : vec4(c.rgb * c.a, c.a);
}`;
const QVS = `#version 300 es
precision highp float;
in vec2 aQ; uniform vec4 uBox; uniform float uS; out vec2 vQ;
void main() { vQ = aQ; vec2 p = uBox.xy + aQ * uBox.zw; gl_Position = vec4(p.x / uS * 2.0 - 1.0, 1.0 - p.y / uS * 2.0, 0.0, 1.0); }`;
const QFS = `#version 300 es
precision highp float;
in vec2 vQ; uniform sampler2D uG; uniform float uAlphaOut, uFade; out vec4 o;
void main() {
  vec3 c = texture(uG, vec2(vQ.x, vQ.y * 0.5)).rgb * uFade; float a = texture(uG, vec2(vQ.x, 0.5 + vQ.y * 0.5)).r * uFade;
  o = uAlphaOut > 0.5 ? vec4(vec3(a), a) : vec4(c, a);      // premultiplied
}`;
const img = (url) => new Promise((res, rej) => {
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
const smooth = (x) => x * x * (3 - 2 * x);
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
      v += 4.2 * Math.exp(-d * 5) * Math.sin(d * 17);
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
    let jaw = 0, lift = 0;
    if (speak) {
      const ls = t - speak.t0, tr = speak.track;
      const at = (x) => {
        const f = x * tr.fps, i = Math.floor(f);
        if (i < 0 || i >= tr.jaw.length) return 0;
        return tr.jaw[i] + (tr.jaw[Math.min(i + 1, tr.jaw.length - 1)] - tr.jaw[i]) * (f - i);
      };
      jaw = at(ls + 0.04);
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
    return { breath: breath * (0.35 + 0.65 * k), roll: roll * k, yaw: yaw * k, pitch: pitch * k, jaw, earL: (-sway + twitchAt(t, "L")) * k, earR: (sway + twitchAt(t, "R")) * k, blinkL: blink, blinkR: blink, lift: lift * k };
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
  const box = Array.isArray(rig.wave?.box) ? { box: rig.wave.box } : null;
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
  if (box) gl.uniform4f(gl.getUniformLocation(qp, "uBox"), box.box[0], box.box[1], box.box[2], box.box[2]);
  const qAlpha = gl.getUniformLocation(qp, "uAlphaOut"), qFade = gl.getUniformLocation(qp, "uFade");
  gl.useProgram(pr);
  gl.bindVertexArray(vao);
  let gsrc = null, gfade = 1;
  const drawGesture = (alphaOut) => {
    if (!gsrc || !box) return;
    gl.useProgram(qp);
    gl.bindVertexArray(qvao);
    gl.uniform1f(qAlpha, alphaOut);
    gl.uniform1f(qFade, gfade);
    gl.activeTexture(gl.TEXTURE4);
    gl.bindTexture(gl.TEXTURE_2D, gt);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, gsrc);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.useProgram(pr);
    gl.bindVertexArray(vao);
  };
  const pose = (p) => {
    for (const key of Object.keys(ul)) gl.uniform1f(ul[key], p[key] ?? 0);
  };
  return {
    gesture(src, fade = 1) {
      gsrc = src;
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
const trackCache = /* @__PURE__ */ new Map();
function rigTrack(base, land, lang, id) {
  const url = `${base}koala/rig/tracks/${land}/${lang}/${id}.json`;
  let p = trackCache.get(url);
  if (!p) {
    p = fetch(url).then((r) => r.ok ? r.json() : null).catch(() => null);
    trackCache.set(url, p);
  }
  return p;
}
let shared = null;
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
function rigWave(base) {
  const v = document.createElement("video");
  v.muted = true;
  v.playsInline = true;
  v.preload = "auto";
  v.crossOrigin = "anonymous";
  v.loop = false;
  let t0 = -1, ok = false;
  v.addEventListener("loadeddata", () => {
    ok = true;
  }, { once: true });
  void fetch(`${base}koala/rig/rig.json`).then((r) => r.json()).then((j) => {
    if (j.wave) v.src = `${base}koala/rig/wave.mp4`;
  }).catch(() => void 0);
  const LEAD = 0.3;
  return {
    get ready() {
      return ok;
    },
    start() {
      if (!ok) return;
      t0 = performance.now() / 1e3;
      window.setTimeout(() => {
        v.currentTime = 0;
        void v.play().catch(() => void 0);
      }, LEAD * 1e3);
    },
    hold(now) {
      if (t0 < 0) return 0;
      const d = Number.isFinite(v.duration) && v.duration > 0 ? v.duration : 5;
      const x = now / 1e3 - t0;
      if (x > LEAD + d + LEAD) {
        t0 = -1;
        return 0;
      }
      return Math.min(1, x / LEAD, (LEAD + d + LEAD - x) / LEAD);
    },
    frame() {
      return t0 >= 0 && !v.paused && v.readyState >= 2 ? v : null;
    },
    // the layer's first and last frames are the rest picture (a touch softer than the rig's photo): it blends in and out
    // over 150 ms there, two versions of one picture — measured 10-19, a hard switch was a 3.4-level step in the arm region
    fade() {
      const d = Number.isFinite(v.duration) && v.duration > 0 ? v.duration : 5, c = v.currentTime;
      return Math.min(1, c / 0.15, (d - c) / 0.15);
    }
  };
}
function rigSpeechFrom(base) {
  let cur = null;
  return (el) => {
    if (!el) return null;
    const src = el.currentSrc || el.src;
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
  RIG_DEFAULT,
  createRig,
  makeLife,
  rigEnabled,
  rigSource,
  rigSpeechFrom,
  rigTrack,
  rigWave
};
