import { Request, Response } from 'express'
import db from '../../../app'

const dataFilter = async (request: Request, response: Response) => {
    /* Schemas creation snippets */
    // const dataA = await ProductsModel.create({ 
    //     displayName: 'Game1',
    //     categoryIds: 'id1',
    //     createdAt: new Date(),
    //     minRating: 1,
    //     price: 100
    // })
    // const dataB = await ProductsModel.create({ 
    //     displayName: 'Game2',
    //     categoryIds: 'id2',
    //     createdAt: new Date(),
    //     minRating: 2,
    //     price: 200
    // })
    // response.send(dataA)
    // response.send(dataB)

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


    let queryMinPrice: number | undefined
    let queryMaxPrice: number | undefined

    const queryPriceHandler = async () => { 
        // products?displayName=Game2&minRating=1&price=:200
        // products?displayName=Game2&minRating=1&price=200:
        // products?displayName=Game2&minRating=1&price=100:200
        try{
            if(request.query.price){
                let priceStr: string | number = request.query.price
                let priceArr: Array<string> | Array<number> | undefined 
        
                if(priceStr !== undefined){
                    priceArr = priceStr.split('')
                    if( priceArr.includes(':') && priceArr[0] !== ':' && priceArr[priceArr.length - 1] !== ':' ){
                        queryMinPrice = parseInt(priceStr.split(':')[0])
                        queryMaxPrice = parseInt(priceStr.split(':')[1])
                    } else if ( priceArr[0] === ':' && parseInt(priceArr[priceArr.length - 1]) || priceArr[priceArr.length - 1] === '0' ){
                        queryMinPrice = parseInt(priceStr.split(':')[1])
                    } else if ( parseInt(priceArr[0]) && priceArr[priceArr.length - 1] === ':' ){
                        queryMaxPrice = parseInt(priceStr.split(':')[0])
                    } else {
                        queryMinPrice = undefined
                        queryMaxPrice = undefined
                    }
                    return queryMinPrice && queryMaxPrice
                }
            }
        } catch(err){  
            throw new err
        }
    }
    queryPriceHandler()  

    const query = {
        'displayName': queryDisplayNameHandler(),
        'minRating': { $gt : queryMinRating()},
        'price': (queryMinPrice, queryMaxPrice) => {
            if (queryMinPrice && queryMaxPrice){
                return { $gte : queryMinPrice, $lte : queryMaxPrice } 
            } else if (queryMinPrice && queryMaxPrice === undefined){
                return { $gte : queryMinPrice }
            } else if (queryMaxPrice && queryMinPrice === undefined){
                return { $lte : queryMaxPrice }
            }
        }
    }

    let queryFieldSortBy: any
    let queryDirectionSortBy: number | undefined

    const querySortByHandler = () => {
        // products?displayName=Game2&minRating=1&price=100:200&sortBy=createdAt:desc
        try{
            if(request.query.sortBy){
                let sortByStr: number | string = request.query.sortBy
                queryFieldSortBy = sortByStr.split(':')[0]

                if(sortByStr.split(':')[1].toLocaleLowerCase() === 'desc'){
                    queryDirectionSortBy = 1
                } else if (sortByStr.split(':')[1].toLocaleLowerCase() === 'asc'){
                    queryDirectionSortBy = -1
                }
            }
        } catch(err){
            throw new err
        }
    }
    querySortByHandler()

    const sort = {
        queryFieldSortBy : queryDirectionSortBy
    }
 
    if(sort.queryFieldSortBy === undefined){
        return await db.default.collection('products').find(query).toArray((err, result) => {
            if (err) throw err;
            console.log(result)
        })
    } else {
        return await db.default.collection('products').find(query).sort(sort).toArray((err, result) => {
            if (err) throw err;
            console.log(result)
        })
    }
}

export default dataFilter