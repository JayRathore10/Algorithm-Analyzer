import { Request  , Response , NextFunction } from "express";

type Step = {
  left: number;
  right: number;
  mid: number;
  value: number;
  found: boolean;
};

const binarySearchAlgo = (arr: number[], target: number) => {
  const steps: Step[] = [];

  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    steps.push({
      left,
      right,
      mid,
      value: arr[mid],
      found: arr[mid] === target,
    });

    if (arr[mid] === target) break;
    else if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }

  return steps;
};

export const searching = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { algo } = req.params;
    const { arr, target } = req.body;

    if (!arr || target === undefined) {
      throw new Error("Missing input");
    }

    let result;

    switch (algo) {
      case "binary-search": {
        // ensure sorted array
        const sorted = [...arr].sort((a, b) => a - b);

        result = {
          steps: binarySearchAlgo(sorted, target),
          sortedArray: sorted,
          timeComplexity: "O(log n)",
          spaceComplexity: "O(1)",
        };
        break;
      }

      default:
        throw new Error("Invalid searching algorithm");
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
};