export default `
  precision mediump float;

  uniform vec2 resolution;
  uniform float time;

  void main() {
    float iRange = 2.5;
    const int maxIterations = 50;
    int iter = maxIterations;

    vec2 u = iRange * (gl_FragCoord.xy / resolution) - (iRange / 2.0);
    vec2 c = vec2(u.x * (resolution.x / resolution.y), u.y);
    vec2 z = vec2(0.0, 0.0);

    for (int n = 0; n < maxIterations; n++) {
      if (length(z) >= 2.0) {
        iter = n;
        break;
      } else {
        z = vec2(z.x * z.x - z.y * z.y, z.x * z.y * 2.0) + c;
      }
    }

    if (iter == maxIterations || iter <= 1) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 1);
    } else {
      gl_FragColor = vec4(vec3(float(iter) / float(maxIterations)), 1.0);
    }
  }
`;

// precision mediump float;

// uniform vec2 resolution;

// void main() {
//   float iRange = 2.5;
//   vec2 c = (iRange * (gl_FragCoord.xy / resolution)) - (iRange / 2.0);
//   c = vec2(c.x * (resolution.x / resolution.y), c.y);
//   vec2 z = vec2(0.0, 0.0);

//   const int maxIterations = 50;
//   int iter = maxIterations;

//   for (int n = 0; n < maxIterations; n++) {
//     if (length(z) >= 2.0) {
//       iter = n;
//       break;
//     } else {
//       z = vec2(z.x * z.x - z.y * z.y, z.x * z.y * 2.0) + c;
//     }
//   }

//   if (iter == maxIterations || iter <= 1) {
//     gl_FragColor = vec4(0, 0, 0, 1);
//   } else {
//     float colour = (float(iter) / float(maxIterations));
//     gl_FragColor = vec4(vec3(colour), 1.0);
//   }
// }
