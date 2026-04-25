import { Request, Response, NextFunction } from "express";

type AlgoInfo = {
  name: string;
  time: string;
  space: string;
};

type Step = {
  array?: number[];              
  comparing?: number[];

  nodes?: number[];              
  edges?: [number, number][];    

  currentNode?: number;
  visited?: number[];
  distances?: Record<number, number>;
};


export const bubbleSortAlgo = (array: number[]) => {
  let a = [...array];
  let steps: Step[] = [];

  let n = a.length;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {

      steps.push({
        array: [...a],
        comparing: [j, j + 1]
      });

      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];

        steps.push({
          array: [...a],
          comparing: [j, j + 1]
        });
      }
    }
  }

  return steps;
};


export const selectionSortAlgo = (array: number[]) => {
  let a = [...array];
  let steps: Step[] = [];

  for (let i = 0; i < a.length; i++) {
    let minIndex = i;

    for (let j = i + 1; j < a.length; j++) {

      steps.push({
        array: [...a],
        comparing: [j, minIndex]
      });

      if (a[j] < a[minIndex]) {
        minIndex = j;
      }
    }

    if (minIndex !== i) {
      [a[i], a[minIndex]] = [a[minIndex], a[i]];

      steps.push({
        array: [...a],
        comparing: [i, minIndex]
      });
    }
  }

  return steps;
};

export const insertionSortAlgo = (array: number[]) => {
  let a = [...array];
  let steps: Step[] = [];

  for (let i = 1; i < a.length; i++) {
    let key = a[i];
    let j = i - 1;

    while (j >= 0) {

      steps.push({
        array: [...a],
        comparing: [j, j + 1]
      });

      if (a[j] > key) {
        a[j + 1] = a[j];
        j--;
      } else break;

      steps.push({
        array: [...a],
        comparing: [j, j + 1]
      });
    }

    a[j + 1] = key;

    steps.push({
      array: [...a],
      comparing: [j + 1]
    });
  }

  return steps;
};


export const mergeSortAlgo = (array: number[]) => {
  let a = [...array];
  let steps: Step[] = [];

  const mergeSort = (l: number, r: number) => {
    if (l >= r) return;

    let mid = Math.floor((l + r) / 2);

    mergeSort(l, mid);
    mergeSort(mid + 1, r);
    merge(l, mid, r);
  };

  const merge = (l: number, m: number, r: number) => {
    let left = a.slice(l, m + 1);
    let right = a.slice(m + 1, r + 1);

    let i = 0, j = 0, k = l;

    while (i < left.length && j < right.length) {

      steps.push({
        array: [...a],
        comparing: [k]
      });

      if (left[i] <= right[j]) {
        a[k++] = left[i++];
      } else {
        a[k++] = right[j++];
      }

      steps.push({
        array: [...a],
        comparing: [k - 1]
      });
    }

    while (i < left.length) {
      a[k++] = left[i++];

      steps.push({
        array: [...a],
        comparing: [k - 1]
      });
    }

    while (j < right.length) {
      a[k++] = right[j++];

      steps.push({
        array: [...a],
        comparing: [k - 1]
      });
    }
  };

  mergeSort(0, a.length - 1);
  return steps;
};

export const quickSortAlgo = (array: number[]) => {
  let a = [...array];
  let steps: Step[] = [];

  const quickSort = (low: number, high: number) => {
    if (low < high) {
      let pi = partition(low, high);
      quickSort(low, pi - 1);
      quickSort(pi + 1, high);
    }
  };

  const partition = (low: number, high: number) => {
    let pivot = a[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {

      steps.push({
        array: [...a],
        comparing: [j, high]
      });

      if (a[j] < pivot) {
        i++;
        [a[i], a[j]] = [a[j], a[i]];

        steps.push({
          array: [...a],
          comparing: [i, j]
        });
      }
    }

    [a[i + 1], a[high]] = [a[high], a[i + 1]];

    steps.push({
      array: [...a],
      comparing: [i + 1, high]
    });

    return i + 1;
  };

  quickSort(0, a.length - 1);
  return steps;
};

const algoMap: Record<string, Function> = {
  "bubble-sort": bubbleSortAlgo,
  "selection-sort": selectionSortAlgo,
  "insertion-sort": insertionSortAlgo,
  "merge-sort": mergeSortAlgo,
  "quick-sort": quickSortAlgo,
};

const algoInfoMap: Record<string, AlgoInfo> = {
  "bubble-sort": {
    name: "Bubble Sort",
    time: "O(n²)",
    space: "O(1)",
  },
  "selection-sort": {
    name: "Selection Sort",
    time: "O(n²)",
    space: "O(1)",
  },
  "insertion-sort": {
    name: "Insertion Sort",
    time: "O(n²)",
    space: "O(1)",
  },
  "merge-sort": {
    name: "Merge Sort",
    time: "O(n log n)",
    space: "O(n)",
  },
  "quick-sort": {
    name: "Quick Sort",
    time: "O(n log n) avg, O(n²) worst",
    space: "O(log n)",
  },
};

export const sorting = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { array } = req.body;
    const { algo } = req.params;

    const sortFunction = algoMap[algo];

    if (!sortFunction) {
      throw new Error("Invalid algorithm");
    }

    const steps = sortFunction(array);

    return res.json({
      steps,
      sorted: steps[steps.length - 1] || array,
      timeComplexity: algoInfoMap[algo].time,
      spaceComplexity: algoInfoMap[algo].space
    });

  } catch (err) {
    next(err);
  }
}