import { Request, Response } from 'express'
import db from '../../../app'

const categoriesFilter = async (request: Request, response: Response) => {
    interface IQueryParams {
        id: number
        includeProducts?: boolean
        includeTop3Products?: string
    }

    class QueryParams implements IQueryParams {
        readonly requestStr = request.query
        readonly paginationCondition: string = `AND id > 20 LIMIT 20`

        public finalQuery: string = `SELECT * FROM categories`
        public id
        public includeProducts
        public includeTop3Products

        getId(){
            try{
                this.id = this.requestStr.id
            } catch(err){
                throw new err
            }
        }

        getIncludeProducts(){
            try{
                this.includeProducts = this.requestStr.inculdeProducts
            } catch(err){
                throw new err
            }
        }

        getIncludeTop3Products(){
            try{
                this.includeTop3Products = this.requestStr.includeTop3Products
            } catch(err){
                throw new err
            }
        }

        createFinalQuery(){
            this.getIncludeProducts()
            if(this.includeProducts){
                this.finalQuery = `${this.finalQuery} `
            }
        }
    }

    let queryParams = new QueryParams()
    console.log()
}