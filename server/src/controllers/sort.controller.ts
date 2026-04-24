import { Request, Response, NextFunction } from "express";

// const bubbleSortAlgo = (array : [number])=>{
//   let a = [...array];

//   for(let i = 0;i < a.length ; i++){
//     for(let j = 0 ;j <a.length - i - 1 ; j++){
//       if(a[j] > a[j+1]){
//         [a[j], a[j+1]] = [a[j+1] , a[j]];
//       }
//     }
//   }
//   return a;
// }

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

export const bubbleSort = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { array } = req.body;
    let start = Date.now();

    const steps = bubbleSortAlgo(array);
    let end = Date.now();

    return res.json({
      steps,
      sorted: steps[steps.length - 1] || array ,
      time: end - start
    });


  } catch (err) {
    next(err);
  }
}