import express, { Request, Response, NextFunction } from "express";
import { RequestInfo, RequestInit } from "node-fetch";

const fetch = (url: RequestInfo, init?: RequestInit) =>
  import("node-fetch").then(({ default: fetch }) => fetch(url, init));

const app = express();

const userUrl = process.env.SEARCH_USERS as string;
const postUrl = process.env.POST_USERS  as string;

const option = {
  method: "GET",
};
class UserAccount {
  public async Search(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await fetch(userUrl, option);
      const SearchedData: any = await response.json();
      const searches = req.query;
      const searched = SearchedData.data.filter((item: any) => {
        let isValid = true;
        for (let key in searches) {
          isValid = isValid && item[key] == searches[key];
        }
        return isValid;
      });
      res.send(searched);
    } catch (err: any) {
      next(err);
    }
  }

  public async Filter(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await fetch(userUrl, option);
      const filterdData: any = await response.json();
      const filters = req.query;
      const filtered = filterdData.data.filter((item: any) => {
        let isValid = true;
        for (let key in filters) {
          isValid = isValid && item[key] == filters[key];
        }
        return isValid;
      });
      res.send(filtered);
    } catch (err: any) {
      next(err);
    }
  }

  public async Engagement(req: Request, res: Response, next: NextFunction) {
    try {
      const userPost = req.params.id;
      const response = await fetch(`postUrl ${postId}`);
      
     const engageData:any = await response.json();

            const comments = engageData.data.length
      // const engages = req.query;
      // const engaged = engagedData.data.filter((item: any) => {
      //     let isValid = true;
      //     for (let key in filters) {
      //         isValid = isValid && item[key] == filters[key];
      //     }
      //     return isValid;
      // })
      console.log(engageData)
      res.send(engageData);

    } catch (err: any) {
      next(err);
    }
  }

  /**
 * 
getData();
  
        async function getData() {
            const response = await fetch(
'https://datausa.io/api/data?drilldowns=Nation&measures=Population');
            console.log(response);
            const data = await response.json();
            console.log(data);
            length = data.data.length;
            console.log(length);
  
            labels = [];
            values = [];
            for (i = 0; i < length; i++) {
                labels.push(data.data[i].Year);
                values.push(data.data[i].Population);
            }
  
 */
  // public async Engagement(){
  //     try{
  //         const postId = req.params.id;
  //         const response = await fetch(`http://3.129.240.142:3106/post/${postId}`);
  //         console.log(response);
  //      // call comment
  //      // csll post
  //      //csll puddle
  //      // csll
  //      fetch
  //     }
  //     catch(err:any) {
  //         next(err)
  //     }

  // }

  // public async barChart(req: Request, res: Response, next: NextFunction){
  //     try {
  //         const response = await fetch(, option);
  //         })
  //         res.send(barChart);
  //     } catch(err) {
  //         console.log(err)
  //     }
}

export default UserAccount;
