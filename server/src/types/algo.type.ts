export type Step = {
  currentNode?: number;
  visited?: number[];
  distances?: Record<number, number>;
};

export type PrimStep = {
  currentNode?: number;
  visited?: number[];
  mstEdges?: [number, number, number][];
  totalWeight?: number;
};

export type KruskalStep = {
  edge?: [number, number, number];
  mstEdges?: [number, number, number][];
  totalWeight?: number;
  accepted?: boolean;
};

export type BFSStep = {
  currentNode?: number;
  visited?: number[];
  queue?: number[];
};