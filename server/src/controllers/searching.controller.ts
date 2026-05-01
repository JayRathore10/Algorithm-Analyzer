import { Request, Response, NextFunction } from "express";
import { BS_Steps, LS_Steps } from "../types/algo.type";

const binarySearchAlgo = (arr: number[], target: number) => {
  const steps: BS_Steps[] = [];

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

const linearSearchAlgo = (arr: number[], target: number) => {
  const steps: LS_Steps[] = [];

  for (let i = 0; i < arr.length; i++) {
    const found = arr[i] === target;

    steps.push({
      index: i,
      value: arr[i],
      found,
    });

    if (found) break;
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
        const sorted = [...arr].sort((a, b) => a - b);

        result = {
          steps: binarySearchAlgo(sorted, target),
          sortedArray: sorted,
          timeComplexity: "O(log n)",
          spaceComplexity: "O(1)",
        };
        break;
      }

      case "linear-search": {
        result = {
          steps: linearSearchAlgo(arr, target),
          timeComplexity: "O(n)",
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