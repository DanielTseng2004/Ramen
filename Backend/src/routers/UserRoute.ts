import { Route } from "../abstract/Route"
import { UserController } from "../controller/UserController";
import { logger } from "../middlewares/log";

export class UserRoute extends Route {
    
    protected url: string;
    protected Contorller = new UserController();

    constructor() {
        super()
        this.url = '/api/v1/user/'
        this.setRoutes()
    }

    protected setRoutes(): void {
        // 獲取所有餐廳列表
        this.router.get(`${this.url}findAll`, (req, res) => {
            this.Contorller.findAll(req, res);
        })

        /**
         * 新增餐廳
         * request body {
         *  name: string,
         *  location: string,
         *  category: string,
         *  rating: string
         * } 
         * @returns resp<restaurant>
         */
        this.router.post(`${this.url}insertOne`, (req, res) => {
            this.Contorller.insertOne(req, res);
        })

        /**
         * 根據餐廳名稱刪除
         * query parameters {
         *  name: string
         * }
         */
        this.router.delete(`${this.url}deleteByName`, (req, res) => {
            this.Contorller.deleteByName(req, res);
        })

        /**
         * 更新餐廳名稱
         * query parameters {
         *  oldName: string,
         *  newName: string
         * }
         */
        this.router.put(`${this.url}updateName`, (req, res) => {
            this.Contorller.updateName(req, res);
        })

        /**
         * 根據名稱查找餐廳
         * query parameters {
         *  name: string
         * }
         */
        this.router.get(`${this.url}search`, (req, res) => {
            this.Contorller.findOneByName(req, res);
        })
    }
}