export default `
  precision mediump float;

  uniform int maxIterations;
  uniform vec2 resolution;
  uniform vec2 maxBounds;
  uniform vec2 minBounds;

  int calcEscapeValue(vec2 c, int maxIterations) {
    vec2 z = vec2(0.0);
    for (int n = 0; n < 100000; n++) {
      if (n == maxIterations || length(z) > 2.0) return n;
      z = vec2(z.x * z.x - z.y * z.y, z.x * z.y * 2.0) + c;
    }
  }

  void main() {
    vec2 c = (gl_FragCoord.xy / resolution) * (maxBounds - minBounds) + minBounds;
    int escapeValue = calcEscapeValue(c, maxIterations);
    if (escapeValue == maxIterations) {
      gl_FragColor = vec4(vec3(0), 1);
    } else {
      gl_FragColor = vec4(vec3(float(escapeValue) / float(maxIterations)), 1.0);
    }
  }
`;
