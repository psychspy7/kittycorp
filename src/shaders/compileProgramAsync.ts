/**
 * Asynchronously compiles and links a WebGL program using KHR_parallel_shader_compile
 * when available, falling back to synchronous validation. This prevents main-thread
 * frame drops during initial graphics initialization.
 */
export function compileProgramAsync(
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  vsSource: string,
  fsSource: string
): Promise<WebGLProgram> {
  return new Promise((resolve, reject) => {
    const ext = gl.getExtension("KHR_parallel_shader_compile");
    const program = gl.createProgram();
    if (!program) {
      reject(new Error("Unable to create WebGL program"));
      return;
    }

    const vs = gl.createShader(gl.VERTEX_SHADER);
    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    if (!vs || !fs) {
      reject(new Error("Unable to create WebGL shaders"));
      return;
    }

    gl.shaderSource(vs, vsSource);
    gl.compileShader(vs);

    gl.shaderSource(fs, fsSource);
    gl.compileShader(fs);

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!ext) {
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const info = gl.getProgramInfoLog(program) || "Shader link failed";
        gl.deleteProgram(program);
        reject(new Error(info));
      } else {
        resolve(program);
      }
      return;
    }

    const checkLink = () => {
      if (gl.getProgramParameter(program, (ext as unknown as { COMPLETION_STATUS_KHR: number }).COMPLETION_STATUS_KHR)) {
        if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
          resolve(program);
        } else {
          const info = gl.getProgramInfoLog(program) || "Shader link failed";
          gl.deleteProgram(program);
          reject(new Error(info));
        }
      } else {
        requestAnimationFrame(checkLink);
      }
    };
    requestAnimationFrame(checkLink);
  });
}
