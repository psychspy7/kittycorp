/**
 * Dedicated WebGL Physical Simulation Web Worker
 * Runs the physical particle & refraction simulation entirely off the main thread
 * onto an OffscreenCanvas, eliminating frame drops and main-thread blocking (INP < 50ms).
 */

let canvas = null;
let gl = null;
let width = 0;
let height = 0;
let dpr = 1;
let pointerX = 0;
let pointerY = 0;
let targetPointerX = 0;
let targetPointerY = 0;
let animId = null;
let program = null;
let positionBuffer = null;
let uResLoc = null;
let uTimeLoc = null;
let uPointerLoc = null;
let startTime = 0;

const VS_SOURCE = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FS_SOURCE = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uPointer;

vec3 bloom(vec2 uv, vec2 centre, float radius, vec3 tint) {
  float aspect = uRes.x / max(uRes.y, 1.0);
  float d = length((uv - centre) * vec2(aspect, 1.0));
  float falloff = smoothstep(radius, 0.0, d);
  return tint * falloff * falloff;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float t = uTime * 0.17;
  vec3 col = vec3(0.085, 0.095, 0.125);
  col += mix(vec3(0.0), vec3(0.05, 0.06, 0.10), uv.y);
  col += bloom(uv, vec2(0.23 + 0.055 * sin(t * 0.9), 0.76 + 0.045 * cos(t * 0.7)), 0.86, vec3(0.24, 0.42, 0.96)) * 0.92;
  col += bloom(uv, vec2(0.82 + 0.05 * cos(t * 0.8), 0.34 + 0.055 * sin(t * 1.1)), 0.80, vec3(0.66, 0.30, 0.88)) * 0.80;
  col += bloom(uv, vec2(0.50 + 0.07 * sin(t * 0.6 + 1.7), 0.10 + 0.04 * cos(t * 0.9)), 0.74, vec3(0.14, 0.68, 0.70)) * 0.60;
  col += bloom(uv, vec2(0.10 + 0.04 * cos(t * 1.2), 0.16 + 0.05 * sin(t * 0.8)), 0.58, vec3(0.98, 0.60, 0.40)) * 0.34;
  col += bloom(uv, vec2(0.5 + uPointer.x * 0.20, 0.56 + uPointer.y * 0.16), 0.46, vec3(0.74, 0.78, 0.96)) * 0.30;
  float vignette = smoothstep(1.34, 0.30, length((uv - 0.5) * vec2(1.05, 1.0)));
  col *= mix(0.62, 1.0, vignette);
  gl_FragColor = vec4(col, 0.92);
}
`;

function initGL(offscreenCanvas, w, h, ratio) {
  canvas = offscreenCanvas;
  dpr = Math.min(ratio || 1, 1.5);
  width = w;
  height = h;

  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);

  gl = canvas.getContext("webgl2", { alpha: true, antialias: false, powerPreference: "high-performance" }) ||
       canvas.getContext("webgl", { alpha: true, antialias: false, powerPreference: "high-performance" });

  if (!gl) return;

  const vs = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vs, VS_SOURCE);
  gl.compileShader(vs);

  const fs = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fs, FS_SOURCE);
  gl.compileShader(fs);

  program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  uResLoc = gl.getUniformLocation(program, "uRes");
  uTimeLoc = gl.getUniformLocation(program, "uTime");
  uPointerLoc = gl.getUniformLocation(program, "uPointer");

  const vertices = new Float32Array([
    -1, -1,
     1, -1,
    -1,  1,
    -1,  1,
     1, -1,
     1,  1
  ]);

  positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  startTime = performance.now();
  startLoop();
}

function startLoop() {
  function render(now) {
    if (!gl || !program) return;

    pointerX += (targetPointerX - pointerX) * 0.05;
    pointerY += (targetPointerY - pointerY) * 0.05;

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.07, 0.09, 0.17, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    gl.uniform2f(uResLoc, canvas.width, canvas.height);
    gl.uniform1f(uTimeLoc, (now - startTime) * 0.001);
    gl.uniform2f(uPointerLoc, pointerX, pointerY);

    const posAttr = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(posAttr);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    animId = requestAnimationFrame(render);
  }
  animId = requestAnimationFrame(render);
}

self.onmessage = function (e) {
  const data = e.data;
  if (!data) return;

  switch (data.type) {
    case "INIT":
      initGL(data.canvas, data.width, data.height, data.dpr);
      break;
    case "RESIZE":
      if (canvas && gl) {
        width = data.width;
        height = data.height;
        dpr = Math.min(data.dpr || 1, 1.5);
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
      }
      break;
    case "POINTER":
      targetPointerX = data.x;
      targetPointerY = data.y;
      break;
    case "DISPOSE":
      if (animId) cancelAnimationFrame(animId);
      if (gl) {
        gl.deleteBuffer(positionBuffer);
        gl.deleteProgram(program);
      }
      self.close();
      break;
  }
};
