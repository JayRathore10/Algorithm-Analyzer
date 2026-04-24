import { Request, Response, NextFunction } from "express";

type AlgoInfo = {
  name: string;
  time: string;
  space: string;
};

const bubbleSortAlgo = (array: number[]) => {
  let a = [...array];
  let steps = [];

  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        steps.push([...a]);
      }
    }
  }

  return steps;
}

const selectionSortAlgo = (array: number[]) => {
  let a = [...array];
  let steps = [];

  for (let i = 0; i < a.length; i++) {
    let minIndex = i;

    for (let j = i + 1; j < a.length; j++) {
      if (a[j] < a[minIndex]) {
        minIndex = j;
      }
    }

    if (minIndex !== i) {
      [a[i], a[minIndex]] = [a[minIndex], a[i]];
      steps.push([...a]);
    }
  }

  return steps;
}

const insertionSortAlgo = (array: number[]) => {
  let a = [...array];
  let steps = [];

  for (let i = 1; i < a.length; i++) {
    let key = a[i];
    let j = i - 1;

    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];
      j--;
      steps.push([...a]);
    }

    a[j + 1] = key;
    steps.push([...a]);
  }

  return steps;
}

const mergeSortAlgo = (array: number[]) => {
  let steps: number[][] = [];
  let a = [...array];

  const mergeSort = (arr: number[], l: number, r: number) => {
    if (l >= r) return;

    let mid = Math.floor((l + r) / 2);

    mergeSort(arr, l, mid);
    mergeSort(arr, mid + 1, r);
    merge(arr, l, mid, r);
  };

  const merge = (arr: number[], l: number, m: number, r: number) => {
    let left = arr.slice(l, m + 1);
    let right = arr.slice(m + 1, r + 1);

    let i = 0, j = 0, k = l;

    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) {
        arr[k++] = left[i++];
      } else {
        arr[k++] = right[j++];
      }
      steps.push([...arr]);
    }

    while (i < left.length) {
      arr[k++] = left[i++];
      steps.push([...arr]);
    }

    while (j < right.length) {
      arr[k++] = right[j++];
      steps.push([...arr]);
    }
  };

  mergeSort(a, 0, a.length - 1);
  return steps;
}

const quickSortAlgo = (array: number[]) => {
  let a = [...array];
  let steps: number[][] = [];

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
      if (a[j] < pivot) {
        i++;
        [a[i], a[j]] = [a[j], a[i]];
        steps.push([...a]);
      }
    }

    [a[i + 1], a[high]] = [a[high], a[i + 1]];
    steps.push([...a]);

    return i + 1;
  };

  quickSort(0, a.length - 1);
  return steps;
}

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

export const bubbleSort = async (req: Request, res: Response, next: NextFunction) => {
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
      timeComplexity : algoInfoMap[algo].time , 
      spaceComplexity : algoInfoMap[algo].space 
    });

  } catch (err) {
    next(err);
  }
}