export default `
  precision mediump float;

  uniform int maxIterations;
  uniform int subSamples;
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
    vec2 pixelComplexWidth = (maxBounds - minBounds) / resolution;
    vec2 c = (gl_FragCoord.xy / resolution) * (maxBounds - minBounds) + minBounds;

    int iterationSum = 0;
    for (int i = 0; i < 100000; i++) {
      if (i == subSamples) break;
      vec2 subPixel = float(i + 1) * (pixelComplexWidth / float(subSamples + 1)) + c;
      iterationSum += calcEscapeValue(subPixel, maxIterations);
    }

    float escapeValue = float(iterationSum / subSamples);
    if (escapeValue == float(maxIterations)) {
      gl_FragColor = vec4(vec3(0), 1);
    } else {
      gl_FragColor = vec4(vec3(float(escapeValue) / float(maxIterations)), 1.0);
    }
  }
`;
