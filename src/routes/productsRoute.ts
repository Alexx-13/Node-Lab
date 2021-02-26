import express, { Request } from 'express'
import { Response } from 'express/lib/response'
import { ProductsModel } from '../database/mongo/models'
import db from '../app'
const productRouter = express.Router()

productRouter.use("/", async (request: Request, response: Response) => {
    // const dataA = await ProductsModel.create({ 
    //     displayName: 'Game1',
    //     categoryIds: 'id1',
    //     createdAt: new Date(),
    //     totalRating: 1,
    //     price: 100
    // })
    // const dataB = await ProductsModel.create({ 
    //     displayName: 'Game2',
    //     categoryIds: 'id2',
    //     createdAt: new Date(),
    //     totalRating: 2,
    //     price: 200
    // })
    // response.send(dataA)
    // response.send(dataB)

    // db.default.collection('products').find({}, {projection: { 
    //     _id: 0,
    //     displayName: 'Game 2',
    //     }}).toArray((err, result) => {
    //     if (err) throw err;
    //     console.log(result);
    // })
    const queryDisplayName: string = request.query.displayName // products?displayName=Game2
    const queryMinRationg: Number = Number(request.query.minRating) // products?displayName=Game2&minRating=1


    let queryMinPrice: Number | undefined
    let queryMaxPrice: Number | undefined

    const queryPriceHandler = async () => { 
        // products?displayName=Game2&minRating=1&price=:200
        // products?displayName=Game2&minRating=1&price=200:
        // products?displayName=Game2&minRating=1&price=100:200
        let priceStr = request.query.price
        let priceArr = priceStr.split('')

        if( priceArr.includes(':') && priceArr[0] !== ':' && priceArr[priceArr.length - 1] !== ':' ){
            queryMinPrice = Number(priceStr.split(':')[0])
            queryMaxPrice = Number(priceStr.split(':')[1])
        } else if ( priceArr[0] === ':' && Number(priceArr[priceArr.length - 1]) || priceArr[priceArr.length - 1] === '0' ){
            queryMinPrice = Number(priceStr.split(':')[1])
        } else if ( Number(priceArr[0]) && priceArr[priceArr.length - 1] === ':' ){
            queryMaxPrice = Number(priceStr.split(':')[0])
        } else {
            queryMinPrice = undefined
            queryMaxPrice = undefined
        }
    }
    queryPriceHandler()  

    let queryFieldSortBy
    let queryDirectionSortBy

    const querySortByHandler = () => {
        // products?displayName=Game2&minRating=1&price=100:200&sortBy=createdAt:desc
        let sortByStr = request.query.sortBy
     
        queryFieldSortBy = sortByStr.split(':')[0]
        if(sortByStr.split(':')[1] === 'desc'){
            queryDirectionSortBy = 1
        } else if (sortByStr.split(':')[1] === 'asc'){
            queryDirectionSortBy = -1
        }
    }
    querySortByHandler()




    const query = {
        'displayName': queryDisplayName,
        'totalRating': { $gt : queryMinRationg},
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

    const sort = {
        queryFieldSortBy : queryDirectionSortBy
    }

    await db.default.collection('products').find(query).sort(sort).toArray((err, result) => {
        if (err) throw err;
        console.log(result)
    })

    
    
})

module.exports = productRouter