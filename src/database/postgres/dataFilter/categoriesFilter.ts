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
                if(this.requestStr.includeProducts.toLocaleLowerCase() === 'true'){
                    this.includeProducts = true
                } else if(this.requestStr.includeProducts.toLocaleLowerCase() === 'false'){
                    this.includeProducts = false
                }
            } catch(err){
                throw new err
            }
        }

        getIncludeTop3Products(){
            try{
                if(this.requestStr.includeTop3Products.toLocaleLowerCase() === 'top'){
                    this.includeTop3Products = 3
                }
            } catch(err){
                throw new err
            }
        }

        createFinalQuery(){
            this.getIncludeProducts()
            this.getIncludeTop3Products()
            
            if(this.includeProducts, this.includeTop3Products){
                this.finalQuery = `${this.finalQuery} INNER JOIN products ON categories.displayName = products.displayName`
            }
        }

        getFinalQuery(){
            return this.finalQuery
        }

        makeDBSearch(){
            this.createFinalQuery()

            db.default.query(this.getFinalQuery(), (error, results) => {
                if (error) throw error
                return response.send(results.rows)
            })
        }
    }

    let queryParams = new QueryParams()
    queryParams.makeDBSearch()
    
}

export default categoriesFilter