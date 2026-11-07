const o={exposure:1,bloom:.36,threshold:.82,knee:.18,lift:[.03,.02,.01],gamma:[1.1,1.08,1.04],gain:[1,.99,.97],contrast:.18,saturation:1.05,shadowTint:[1.015,.995,.97],highTint:[1.01,1,.985],vignette:.2,pool:.04,grain:.022,motes:{color:[1,.95,.86],opacity:.42},dust:{color:[.93,.89,.82],opacity:.4},live:{water:0,sky:0},paint:0},e={harbour:{live:{water:1,sky:1}},lighthouse:{live:{water:1,sky:1}},sky:{live:{water:0,sky:1}},gardens:{live:{water:0,sky:1}},fields:{live:{water:1,sky:1}},zen:{live:{water:0,sky:1},gain:[.99,.99,1.04]},ocean:{live:{water:1,sky:1},bloom:.42,threshold:.82,saturation:1.06},library:{bloom:.5,threshold:.82,vignette:.24,highTint:[1.02,1,.97]},cabin:{bloom:.46,threshold:.82,vignette:.22,gain:[.98,.99,1.06]},rooftop:{bloom:.5,threshold:.82,vignette:.22},falls:{bloom:.42,threshold:.82,highTint:[1.02,1.01,.96]},treehouse:{bloom:.4,threshold:.82},canyon:{live:{water:0,sky:1},exposure:.93,lift:[.05,.032,.018],gamma:[1.22,1.17,1.1],bloom:.36,highTint:[1.04,1,.95],dust:{color:[.9,.8,.68],opacity:.42}},dunes:{bloom:.5,threshold:.82,vignette:.22},glacier:{live:{water:0,sky:1},bloom:.42,threshold:.82,highTint:[1.01,1,.99],shadowTint:[1,.99,.98],dust:{color:[.92,.95,.98],opacity:.36}},observatory:{bloom:.52,threshold:.82,vignette:.24},"place-table":{lift:[.03,.02,.012],gamma:[1.36,1.32,1.24],gain:[1,.985,.94],contrast:.22,saturation:1.2,vignette:.22,paint:.6},"place-room":{lift:[.03,.02,.012],gamma:[1.34,1.3,1.22],gain:[1,.985,.94],contrast:.22,saturation:1.2,vignette:.22,paint:.6},"place-observatory":{lift:[.04,.02,.035],gamma:[1.6,1.46,1.42],gain:[1,.96,.93],contrast:.2,saturation:1.3,vignette:.2,paint:.7},"place-lookout":{lift:[.03,.02,.012],gamma:[1.24,1.2,1.1],gain:[1.03,.985,.9],contrast:.22,saturation:1.44,vignette:.22,paint:.6},"stage-falls":{bloom:.5,threshold:.64,knee:.24,contrast:.24,saturation:1.04,highTint:[1.025,1.005,.96],shadowTint:[.97,1,1.02],vignette:.32,pool:.03,grain:.018},"world-knight":{exposure:.97,bloom:.26,threshold:.88,knee:.1,contrast:.2,saturation:1.02,highTint:[1.008,1,.985],shadowTint:[.97,1,1.02],vignette:.34,pool:0},map:{bloom:.3,threshold:.76,knee:.2,contrast:.12,saturation:1.02,lift:[0,0,0],gain:[1,1,1],shadowTint:[.99,.995,1.01],highTint:[1.008,1,.995],vignette:.1,pool:0,grain:.012}};function i(a){const t=a&&(e[a]??(a.startsWith("stage-")?e["stage-falls"]:void 0))||{};return{...o,...t,motes:{...o.motes,...t.motes},dust:{...o.dust,...t.dust},live:{...o.live,...t.live}}}const n=`
uniform vec3 uLift; uniform vec3 uGamma; uniform vec3 uGain;
uniform float uContrast; uniform float uSat;
uniform vec3 uShadowTint; uniform vec3 uHighTint;
const vec3 GRADE_LUMA = vec3(0.2126, 0.7152, 0.0722);
// g: display-referred colour. l: its luminance after the S, before the tint (the grain's weight in post.ts)
vec3 gradeLook(vec3 g, out float l) {
  // primaries
  g = uGain * (g + uLift * (1.0 - g));
  g = pow(max(g, vec3(0.0)), 1.0 / uGamma);
  // a soft S around the middle (no clipping: it is a blend toward smoothstep, which keeps 0 and 1)
  vec3 gc = clamp(g, 0.0, 1.0);
  g = mix(g, gc * gc * (3.0 - 2.0 * gc), uContrast);
  // split tone by luminance
  l = dot(clamp(g, 0.0, 1.0), GRADE_LUMA);
  g *= mix(uShadowTint, uHighTint, smoothstep(0.08, 0.82, l));
  // saturation, gentler on what is already saturated (a vibrance)
  float l2 = dot(g, GRADE_LUMA);
  float chroma = max(g.r, max(g.g, g.b)) - min(g.r, min(g.g, g.b));
  return mix(vec3(l2), g, mix(uSat, 1.0, clamp(chroma * 1.4, 0.0, 1.0) * step(1.0, uSat)));
}`;export{n as G,i as l};
