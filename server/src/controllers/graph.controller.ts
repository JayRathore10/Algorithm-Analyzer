import { Request, Response, NextFunction } from "express";

type Step = {
  currentNode?: number;
  visited?: number[];
  distances?: Record<number, number>;
};

export const dijkstraAlgo = (
  n: number,
  edges: [number, number, number][],
  source: number
) => {
  const adj: Record<number, [number, number][]> = {};
  const steps: Step[] = [];

  // build graph
  for (let i = 0; i < n; i++) adj[i] = [];

  for (const [u, v, w] of edges) {
    adj[u].push([v, w]);
    adj[v].push([u, w]);
  }

  const dist: Record<number, number> = {};
  const visited: number[] = [];

  for (let i = 0; i < n; i++) dist[i] = Infinity;
  dist[source] = 0;

  const pq: [number, number][] = [[0, source]];

  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]);
    const [_, node] = pq.shift()!;

    if (visited.includes(node)) continue;

    visited.push(node);

    steps.push({
      currentNode: node,
      visited: [...visited],
      distances: { ...dist },
    });

    for (const [nei, w] of adj[node]) {
      if (dist[node] + w < dist[nei]) {
        dist[nei] = dist[node] + w;
        pq.push([dist[nei], nei]);

        steps.push({
          currentNode: node,
          visited: [...visited],
          distances: { ...dist },
        });
      }
    }
  }

  // final clean step
  steps.push({
    currentNode: -1,
    visited: [...visited],
    distances: { ...dist },
  });

  return steps;
};

export const graphAlgo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { n, edges, source } = req.body;

    if (!n || !edges || source === undefined) {
      throw new Error("Missing inputs");
    }

    const steps = dijkstraAlgo(n, edges, source);

    res.json({
      steps,
      timeComplexity: "O((V + E) log V)",
      spaceComplexity: "O(V)",
    });
  } catch (err) {
    next(err);
  }
};  