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

type KruskalStep = {
  edge?: [number, number, number];
  mstEdges?: [number, number, number][];
  totalWeight?: number;
  accepted?: boolean;
};

export const kruskalAlgo = (
  n: number,
  edges: [number, number, number][]
) => {
  const steps: KruskalStep[] = [];

  edges.sort((a, b) => a[2] - b[2]);

  const parent = Array.from({ length: n }, (_, i) => i);
  const rank = Array(n).fill(0);

  const find = (x: number): number => {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  };

  const union = (x: number, y: number): boolean => {
    const px = find(x);
    const py = find(y);

    if (px === py) return false;

    if (rank[px] < rank[py]) parent[px] = py;
    else if (rank[px] > rank[py]) parent[py] = px;
    else {
      parent[py] = px;
      rank[px]++;
    }

    return true;
  };

  const mstEdges: [number, number, number][] = [];
  let totalWeight = 0;

  for (const edge of edges) {
    const [u, v, w] = edge;

    const accepted = union(u, v);

    if (accepted) {
      mstEdges.push(edge);
      totalWeight += w;
    }

    steps.push({
      edge,
      mstEdges: [...mstEdges],
      totalWeight,
      accepted, 
    });
  }

  steps.push({
    mstEdges: [...mstEdges],
    totalWeight,
  });

  return steps;
};

export const graphAlgo = async (req: Request , res: Response , next: NextFunction) => {
  try {
    const { n, edges, source } = req.body;
    const {algo} = req.params;
    if (!n || !edges) {
      throw new Error("Missing inputs");
    }

    let result;

    if (algo === "dijkstra") {
      if (source === undefined) throw new Error("Source required");
      result = {
        steps: dijkstraAlgo(n, edges, source),
        timeComplexity: "O((V + E) log V)",
        spaceComplexity: "O(V)",
      };
    } else if (algo === "kruskal") {
      result = {
        steps: kruskalAlgo(n, edges),
        timeComplexity: "O(E log E)",
        spaceComplexity: "O(V)",
      };
    } else {
      throw new Error("Invalid algorithm type");
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
};