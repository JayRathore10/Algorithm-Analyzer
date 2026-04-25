import { Request , Response , NextFunction } from "express";

type Step = {
  array?: number[];              
  comparing?: number[];

  nodes?: number[];              
  edges?: [number, number][];    

  currentNode?: number;
  visited?: number[];
  distances?: Record<number, number>;
};

export const dijkstraAlgo = (
  n: number,
  edges: [number, number, number][],
  source: number
) => {
  let adj: Record<number, [number, number][]> = {};

  // build graph
  for (let i = 0; i < n; i++) adj[i] = [];

  for (let [u, v, w] of edges) {
    adj[u].push([v, w]);
    adj[v].push([u, w]); // remove if directed
  }

  let dist: Record<number, number> = {};
  let visited: number[] = [];
  let steps: Step[] = [];

  for (let i = 0; i < n; i++) dist[i] = Infinity;
  dist[source] = 0;

  let pq: [number, number][] = [[0, source]];

  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]); // simple PQ
    let [d, node] = pq.shift()!;

    if (visited.includes(node)) continue;

    visited.push(node);

    steps.push({
      currentNode: node,
      visited: [...visited],
      distances: { ...dist }
    });

    for (let [nei, w] of adj[node]) {
      if (dist[node] + w < dist[nei]) {
        dist[nei] = dist[node] + w;
        pq.push([dist[nei], nei]);

        steps.push({
          currentNode: node,
          visited: [...visited],
          distances: { ...dist }
        });
      }
    }
  }

  return steps;
};

const algoMap: Record<string, Function> ={
  "dijkstra" : dijkstraAlgo
};

export const graphAlgo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { algo } = req.params;

    const graphFunction = algoMap[algo];

    if (!graphFunction) {
      throw new Error("Invalid algorithm");
    }

    const { n, edges, source } = req.body;

    // basic validation
    if (!n || !edges || source === undefined) {
      throw new Error("Missing graph inputs (n, edges, source)");
    }

    const steps = graphFunction(n, edges, source);

    return res.json({
      steps,
      result: steps[steps.length - 1] || {},
      timeComplexity: "O((V + E) log V)",   // Dijkstra
      spaceComplexity: "O(V)"
    });

  } catch (err) {
    next(err);
  }
};