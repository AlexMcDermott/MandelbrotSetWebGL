export default `
  precision mediump float;

  uniform float iRange;
  uniform int maxIterations;
  uniform vec2 resolution;

  void main() {
    int iterations = 0;

    vec2 u = (gl_FragCoord.xy / resolution) - 0.5;
    u.x = u.x * (resolution.x / resolution.y);
    vec2 c = iRange * u - vec2(0.5, 0.0);
    vec2 z = vec2(0.0);

    for (int n = 0; n < 100000; n++) {
      if (n == maxIterations) break;
      if (length(z) > 2.0) break;
      z = vec2(z.x * z.x - z.y * z.y, z.x * z.y * 2.0) + c;
      iterations++;
    }

    if (iterations == maxIterations) {
      gl_FragColor = vec4(vec3(0.0), 1);
    } else {
      gl_FragColor = vec4(vec3(float(iterations) / float(maxIterations - 1)), 1.0);
    }
  }
`;
