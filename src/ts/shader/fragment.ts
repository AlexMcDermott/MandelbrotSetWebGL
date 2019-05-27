export default `
  precision mediump float;

  uniform int maxIterations;
  uniform float range;
  uniform vec2 resolution;
  uniform int subSamples;

  vec2 frag2complex(vec2 coord, vec2 resolution, float range) {
    vec2 u = coord / resolution - 0.5;
    u.x *= resolution.x / resolution.y;
    return range * u - vec2(0.5, 0.0);
  }

  int calcEscapeValue(vec2 c, int maxIterations) {
    vec2 z = vec2(0.0);
    for (int n = 0; n < 100000; n++) {
      if (n == maxIterations || length(z) > 2.0) return n;
      z = vec2(z.x * z.x - z.y * z.y, z.x * z.y * 2.0) + c;
    }
  }

  void main() {
    vec2 p1 = frag2complex(vec2(0), resolution, range);
    vec2 p2 = frag2complex(vec2(1), resolution, range);
    vec2 pixelComplexWidth = p2 - p1;
    vec2 c = frag2complex(gl_FragCoord.xy, resolution, range);
    int iterationSum = 0;

    for (int i = 0; i < 100000; i++) {
      if (i == subSamples) break;
      vec2 subPixel = float(i + 1) * (pixelComplexWidth / float(subSamples + 1)) + c;
      iterationSum += calcEscapeValue(subPixel, maxIterations);
    }

    float escapeValue = float(iterationSum) / float(subSamples);
    if (escapeValue == float(maxIterations)) {
      gl_FragColor = vec4(vec3(0.0), 1);
    } else {
      gl_FragColor = vec4(vec3(escapeValue / float(maxIterations - 1)), 1.0);
    }
  }
`;
