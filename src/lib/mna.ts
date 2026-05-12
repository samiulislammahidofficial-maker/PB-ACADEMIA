export function solveMNA(
  nets: number, // number of nets (excluding ground 0)
  resistors: { n1: number; n2: number; R: number }[],
  voltageSources: { n1: number; n2: number; V: number }[],
  currentSources: { n1: number; n2: number; I: number }[]
) {
  const m = voltageSources.length;
  const n = nets;
  const dim = n + m;
  
  if (dim === 0) return { voltages: Array(nets + 1).fill(0), currents: [] };

  // Create (n+m) x (n+m) matrix A, and (n+m) vector b
  const A: number[][] = Array(dim).fill(0).map(() => Array(dim).fill(0));
  const b: number[] = Array(dim).fill(0);

  // G matrix (n x n)
  for (const res of resistors) {
    const g = 1.0 / res.R;
    if (res.n1 !== 0) {
      A[res.n1 - 1][res.n1 - 1] += g;
    }
    if (res.n2 !== 0) {
      A[res.n2 - 1][res.n2 - 1] += g;
    }
    if (res.n1 !== 0 && res.n2 !== 0) {
      A[res.n1 - 1][res.n2 - 1] -= g;
      A[res.n2 - 1][res.n1 - 1] -= g;
    }
  }

  // Current sources -> b
  for (const cs of currentSources) {
    // Current flows from n1 to n2
    if (cs.n1 !== 0) b[cs.n1 - 1] -= cs.I;
    if (cs.n2 !== 0) b[cs.n2 - 1] += cs.I;
  }

  // Voltage sources (B and C matrices, plus b vector)
  for (let k = 0; k < m; k++) {
    const vs = voltageSources[k];
    const row = n + k;
    if (vs.n1 !== 0) {
      A[vs.n1 - 1][row] += 1;
      A[row][vs.n1 - 1] += 1;
    }
    if (vs.n2 !== 0) {
      A[vs.n2 - 1][row] -= 1;
      A[row][vs.n2 - 1] -= 1;
    }
    b[row] = vs.V;
  }

  // Add small epsilon to diagonal to prevent singular matrix for floating parts
  for (let i = 0; i < n; i++) {
    A[i][i] += 1e-9;
  }

  // Solve Ax = b using Gauss-Jordan
  for (let i = 0; i < dim; i++) {
    let maxEl = Math.abs(A[i][i]);
    let maxRow = i;
    for (let k = i + 1; k < dim; k++) {
      if (Math.abs(A[k][i]) > maxEl) {
        maxEl = Math.abs(A[k][i]);
        maxRow = k;
      }
    }

    if (maxRow !== i) {
      const temp = A[maxRow];
      A[maxRow] = A[i];
      A[i] = temp;
      const t = b[maxRow];
      b[maxRow] = b[i];
      b[i] = t;
    }

    const diag = A[i][i] || 1e-12;
    for (let k = i + 1; k < dim; k++) {
      const c = -A[k][i] / diag;
      for (let j = i; j < dim; j++) {
        if (i === j) {
          A[k][j] = 0;
        } else {
          A[k][j] += c * A[i][j];
        }
      }
      b[k] += c * b[i];
    }
  }

  const x = Array(dim).fill(0);
  for (let i = dim - 1; i >= 0; i--) {
    let sum = 0;
    for (let j = i + 1; j < dim; j++) {
      sum += A[i][j] * x[j];
    }
    x[i] = (b[i] - sum) / (A[i][i] || 1e-12);
  }

  const voltages = [0, ...x.slice(0, n)]; // Net 0 is 0V
  const currents = x.slice(n, n + m); // Current through voltage sources

  return { voltages, currents };
}
