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

export type DFSStep = {
  currentNode?: number;
  visited?: number[];
};

export type FWStep = {
  k: number;
  matrix: number[][];
};

export type BS_Steps={
  left: number;
  right: number;
  mid: number;
  value: number;
  found: boolean;
}

export type LS_Steps = {
  index: number;
  value: number;
  found: boolean;
};
