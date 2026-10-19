// THE KOALA RIG (run-1019 decision: the koala at rest must BE the approved photo, moved by the game at the display's own
// rate — not AI video that re-draws his fur every frame). One WebGL mesh over the rest picture (koala/rig/rest.png);
// the vertex shader bends it with soft weight maps (koala_rig_build.py): breathing (chest), the head (a small turn with
// depth — the snout moves more than the ears — a tilt and a nod about the neck), the ears (springs), the jaw (rotated
// about its hinge by the voice's mouth track, koala_rig_track.py; the mouth band darkens as it opens) and blinks (the
// lid fur slides over the eye). Every frame is the same sharp photo, moved: nothing to hand over, nothing that boils.
// Deterministic: pose(t) is a pure function of time and the speaking line, so a test can render any instant.

const VS = `#version 300 es
precision highp float;
in vec2 aPos;                       // rest position, px of the 1024 frame
uniform sampler2D uW;               // R head, G jaw, B breath
uniform sampler2D uE;               // R left lid, G right lid, B mouth band
uniform sampler2D uA;               // R ears, G queen
uniform float uS;                   // 1024
uniform vec2 uNeck, uHinge, uEarLb, uEarRb, uHeadC, uHeadR, uNose, uBreathP;
uniform float uRoll, uYaw, uPitch, uJaw, uEarL, uEarR, uBreath, uLift;
out vec2 vUv; out float vCav;
vec2 rot(vec2 v, float a) { float c = cos(a), s = sin(a); return vec2(v.x * c - v.y * s, v.x * s + v.y * c); }
void main() {
  vec2 uv = aPos / uS;
  vec4 w = texture(uW, uv); vec4 e = texture(uE, uv); vec4 ax = texture(uA, uv);
  vec2 p = aPos;
  // jaw: the lower jaw swings down about its hinge (behind the mouth corner)
  float jr = radians(uJaw) * w.g;
  p = uHinge + rot(p - uHinge, -jr);
  // ears: each swings about its base (left ear left of the head centre)
  float left = step(p.x, uHeadC.x);
  vec2 eb = mix(uEarRb, uEarLb, left);
  float ea = radians(mix(uEarR, -uEarL, left)) * ax.r;
  p = eb + rot(p - eb, ea);
  // head: a small turn and nod with depth (an ellipsoid head + the snout), then a tilt about the neck
  vec2 q = (aPos - uHeadC) / uHeadR;
  float z = 0.55 * uHeadR.x * sqrt(max(0.0, 1.0 - dot(q, q))) + 34.0 * exp(-dot(aPos - uNose, aPos - uNose) / (2.0 * 46.0 * 46.0));
  p += w.r * z * vec2(sin(radians(uYaw)), sin(radians(uPitch)));
  p = uNeck + rot(p - uNeck, radians(uRoll) * w.r);
  p.y -= uLift * w.r;
  // breath: the chest swells about its base, the head rides up with it
  p += w.b * (p - uBreathP) * (0.0075 * uBreath);
  p.y -= 1.6 * uBreath * w.r;
  vUv = uv;
  vCav = e.b * clamp(uJaw / 9.0, 0.0, 1.0);
  gl_Position = vec4(p.x / uS * 2.0 - 1.0, 1.0 - p.y / uS * 2.0, 0.0, 1.0);
}`;

const FS = `#version 300 es
precision highp float;
in vec2 vUv; in float vCav;
uniform sampler2D uRest, uE;
uniform float uBlinkL, uBlinkR, uLidH;
out vec4 o;
void main() {
  vec4 e = texture(uE, vUv);
  // blink: the lid's fur slides down over the eye (sample from above, by the lid's mask)
  float b = e.r * uBlinkL + e.g * uBlinkR;
  vec2 uv = vUv - vec2(0.0, b * uLidH);
  vec4 c = texture(uRest, uv);
  c.rgb *= 1.0 - 0.18 * b;                                   // the closed lid's soft shadow
  // the mouth opening: the band under the upper lip darkens as the jaw opens
  c.rgb = mix(c.rgb, vec3(0.16, 0.07, 0.07), clamp(vCav * 0.85, 0.0, 0.85));
  o = vec4(c.rgb * c.a, c.a);                                // premultiplied
}`;

function sh(gl, type, src) {
  const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'shader');
  return s;
}
const img = (url) => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });

// deterministic noise for event times (blinks, ear twitches)
function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
const smooth = (x) => x * x * (3 - 2 * x);

/** the life of the rig at time t (s): pure, so a test can render any instant */
export function makeLife(seed = 7) {
  const r = rng(seed);
  const blinks = []; for (let t = 1.2; t < 600; t += 2.6 + r() * 4.2) { blinks.push(t); if (r() < 0.18) blinks.push(t + 0.32); }
  const twitches = []; for (let t = 3.5; t < 600; t += 5 + r() * 9) twitches.push([t, r() < 0.5 ? 'L' : 'R']);
  const blinkAt = (t) => {
    let v = 0;
    for (const b of blinks) {
      const d = t - b; if (d < 0) break; if (d > 0.3) continue;
      v = Math.max(v, d < 0.07 ? smooth(d / 0.07) : d < 0.11 ? 1 : 1 - smooth((d - 0.11) / 0.17));
    }
    return v;
  };
  const twitchAt = (t, side) => {
    let v = 0;
    for (const [tt, s] of twitches) {
      const d = t - tt; if (d < 0) break; if (s !== side || d > 0.9) continue;
      v += 5.5 * Math.exp(-d * 6) * Math.sin(d * 26);         // a quick flick that rings out
    }
    return v;
  };
  const S = (t, p, ph) => Math.sin((2 * Math.PI * t) / p + ph);
  return function pose(t, speak) {
    // breathing: a slow, slightly quicker inhale
    const ph = (t / 3.9) % 1, breath = ph < 0.42 ? -Math.cos(Math.PI * ph / 0.42) : Math.cos(Math.PI * (ph - 0.42) / 0.58);
    // a calm head: slow incommensurate drifts (no loop, never repeats exactly)
    let roll = 0.9 * S(t, 7.3, 1) + 0.35 * S(t, 3.1, 0.2);
    let yaw = 2.0 * S(t, 9.7, 0.0) + 0.7 * S(t, 4.3, 2.0);
    let pitch = 0.9 * S(t, 6.1, 0.5) + 0.3 * S(t, 2.7, 1.3);
    let jaw = 0, lift = 0;
    if (speak) {
      const ls = t - speak.t0, tr = speak.track;
      const i = Math.floor((ls + 0.04) * tr.fps);              // the mouth a hair ahead of the sound
      if (i >= 0 && i < tr.jaw.length) jaw = tr.jaw[i] + (tr.jaw[Math.min(i + 1, tr.jaw.length - 1)] - tr.jaw[i]) * (((ls + 0.04) * tr.fps) % 1);
      // while he talks: he looks a little more to you and nods with the words
      const on = smooth(Math.min(1, Math.max(0, Math.min(ls / 0.35, (tr.duration + 0.4 - ls) / 0.5))));
      yaw = yaw * (1 - 0.6 * on) + on * -1.2;
      pitch += 0.13 * Math.max(0, jaw);
      roll += 0.06 * jaw * S(t, 1.7, 0);
      lift = on * 1.5;
    }
    // ears: they lag the head (a spring on its tilt) and flick now and then
    const earL = -0.8 * (0.9 * Math.cos((2 * Math.PI * t) / 7.3 + 1)) + twitchAt(t, 'L');
    const earR = 0.8 * (0.9 * Math.cos((2 * Math.PI * t) / 7.3 + 1)) + twitchAt(t, 'R');
    const blink = blinkAt(t);
    return { breath, roll, yaw, pitch, jaw, earL, earR, blinkL: blink, blinkR: blink, lift };
  };
}

export async function createRig(canvas, base = '../../koala/rig/') {
  const gl = canvas.getContext('webgl2', { premultipliedAlpha: true, alpha: true, antialias: true, preserveDrawingBuffer: true });
  if (!gl) throw new Error('webgl2');
  const [rig, rest, w, e, ax] = await Promise.all([fetch(base + 'rig.json').then((r) => r.json()), img(base + 'rest.png'), img(base + 'weights.png'), img(base + 'eyes.png'), img(base + 'aux.png')]);
  const pr = gl.createProgram(); gl.attachShader(pr, sh(gl, gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl, gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(pr) || 'link');
  gl.useProgram(pr);
  const N = 192, S = rig.size;
  const pos = new Float32Array((N + 1) * (N + 1) * 2); let k = 0;
  for (let y = 0; y <= N; y++) for (let x = 0; x <= N; x++) { pos[k++] = (x / N) * S; pos[k++] = (y / N) * S; }
  const idx = new Uint32Array(N * N * 6); k = 0;
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const a = y * (N + 1) + x, b = a + 1, c = a + N + 1, d = c + 1; idx.set([a, b, c, b, d, c], k); k += 6; }
  const vao = gl.createVertexArray(); gl.bindVertexArray(vao);
  const vb = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, vb); gl.bufferData(gl.ARRAY_BUFFER, pos, gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, 'aPos'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const ib = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idx, gl.STATIC_DRAW);
  const tex = (unit, im, mip) => {
    const t = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false); gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im);
    if (mip) gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, mip ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  };
  tex(0, rest, true); tex(1, w, false); tex(2, e, false); tex(3, ax, false);
  const U = (n) => gl.getUniformLocation(pr, n);
  gl.uniform1i(U('uRest'), 0); gl.uniform1i(U('uW'), 1); gl.uniform1i(U('uE'), 2); gl.uniform1i(U('uA'), 3);
  gl.uniform1f(U('uS'), S);
  for (const [u, kk] of [['uNeck', 'neck'], ['uHinge', 'hinge'], ['uEarLb', 'earL_base'], ['uEarRb', 'earR_base'], ['uHeadC', 'head_c'], ['uHeadR', 'head_r'], ['uNose', 'nose'], ['uBreathP', 'breath_pivot']]) gl.uniform2f(U(u), rig[kk][0], rig[kk][1]);
  gl.uniform1f(U('uLidH'), 22 / S);
  gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  const names = { roll: 'uRoll', yaw: 'uYaw', pitch: 'uPitch', jaw: 'uJaw', earL: 'uEarL', earR: 'uEarR', breath: 'uBreath', blinkL: 'uBlinkL', blinkR: 'uBlinkR', lift: 'uLift' };
  const ul = Object.fromEntries(Object.entries(names).map(([k2, n]) => [k2, U(n)]));
  return {
    draw(p) {
      gl.viewport(0, 0, canvas.width, canvas.height); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      for (const [k2, l] of Object.entries(ul)) gl.uniform1f(l, p[k2] ?? 0);
      gl.drawElements(gl.TRIANGLES, idx.length, gl.UNSIGNED_INT, 0);
    },
  };
}
