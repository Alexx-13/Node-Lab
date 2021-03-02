import { Request, Response } from 'express'
import db from '../../../app'

const dataFilter = async (request: Request, response: Response) => {
    const paginationCondition: string = `AND id > 20 LIMIT 20`
    let sortCondition: string
    const createIndex = `
    CREATE UNIQUE INDEX _id on products (id)
    `;

    const createTable = `
    CREATE TABLE products (
        id int,
        categoryIds varchar,
        displayName varchar,
        createdAt Date,
        minRating int,
        price varchar
    );
    `;

    db.default
    .query(createTable)
    .then(res => {
        console.log(res)
        console.log('Table is successfully created');
    })
    .catch(err => {
        console.error(err);
    })
    .finally(() => {
        db.default.end();
    });

    // const displayName: string | undefined = request.query.displayName
    // const minRating: number | undefined = parseInt(request.query.minRating)

    const queryDisplayNameHandler = () => {
        try{
            if(request.query.displayName){
                const queryDisplayName: string = request.query.displayName // products?displayName=Game2
                return queryDisplayName
            }
        } catch(err){
            throw new err
        }
    }

    const queryMinRating = () => {
        try{
            if(request.query.minRating){
                const queryMinRationg: number = Number(request.query.minRating) // products?displayName=Game2&minRating=1
                return queryMinRationg
            }
        } catch(err){
            throw new err
        }
    }


    let queryMinPrice: number | string | undefined
    let queryMaxPrice: number | string | undefined


    const queryPriceHandler = () => {
           // products?displayName=Game2&minRating=1&price=100:200&sortBy=createdAt:desc
        try{
            console.log(request.query.price)
            if(request.query.price){
                let priceStr: string | number | undefined = request.query.price
                let priceArr: Array<string> | Array<number> | undefined 
        
                if(priceStr !== undefined){
                    priceArr = priceStr.split('')
                    if( priceArr.includes(':') && priceArr[0] !== ':' && priceArr[priceArr.length - 1] !== ':' ){
                        queryMinPrice = priceStr.split(':')[0]
                        queryMaxPrice = priceStr.split(':')[1]
                        return `price <= ${queryMaxPrice} AND price >= ${queryMinPrice}`
                    } else if ( priceArr[0] === ':' && parseInt(priceArr[priceArr.length - 1]) || priceArr[priceArr.length - 1] === '0' ){
                        queryMinPrice = priceStr.split(':')[1]
                        return `price >= ${queryMinPrice}`
                    } else if ( parseInt(priceArr[0]) && priceArr[priceArr.length - 1] === ':' ){
                        queryMaxPrice = priceStr.split(':')[0]
                        return `price <= ${queryMaxPrice}`
                    } else {
                        queryMinPrice = undefined
                        queryMaxPrice = undefined
                    }
                }
            }
        } catch(err){  
            throw new err
        }
        return `price <= 20 AND price >= 10`
    }

    let querySortBy: string

    const querySortByHandler = () => {
        try{
            if(request.query.sortBy){
                console.log(request.query.sortBy)
                let sortByStr: number | string = request.query.sortBy
                querySortBy = sortByStr.split(':')[1]

                if(sortByStr.split(':')[1].toLocaleLowerCase() === 'desc'){
                    sortCondition = 'desc'
                } else if (sortByStr.split(':')[1].toLocaleLowerCase() === 'asc'){
                    sortCondition = 'asc'
                }
            } 
        } catch(err){
            throw new err
        }
    }
    querySortByHandler()

    if(queryDisplayNameHandler && !queryMinRating && !queryPriceHandler){
        db.default.query(`SELECT * FROM products WHERE displayName = $1 ${paginationCondition}`, [queryDisplayNameHandler], (error, results) => {
            if (error) {
              throw error
            }
            console.log(results.rows)
            return results.rows
        })
    } else if (queryDisplayNameHandler && queryMinRating && !queryPriceHandler){
        db.default.query(`SELECT * FROM products WHERE displayName = $1 AND minRating = $2 ${paginationCondition}`, [queryDisplayNameHandler, queryMinRating], (error, results) => {
            if (error) {
              throw error
            }
            console.log(results.rows)
            return results.rows
        })
    } else if (queryDisplayNameHandler && queryPriceHandler && !queryMinRating){
        db.default.query(`SELECT * FROM products WHERE displayName = $1 AND price = $2 ${paginationCondition}`, [queryDisplayNameHandler, queryPriceHandler], (error, results) => {
            if (error) {
              throw error
            }
            console.log(results.rows)
            return results.rows
        })
    } else if(queryDisplayNameHandler && queryMinRating && queryPriceHandler){
        db.default.query(`SELECT * FROM products WHERE displayName = $1 AND minRating = $2 AND price = $3  ${paginationCondition}`, [queryDisplayNameHandler, queryMinRating, queryPriceHandler], (error, results) => {
            if (error) {
              throw error
            }
            console.log(results.rows)
            return results.rows
        })
    }
}

export default dataFilter