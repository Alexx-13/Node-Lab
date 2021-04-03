import express, { Router } from 'express'
import productsRouter from './productsRoute'
import categoriesRouter from './categoriesRoute'
import registerRouter from './account/registerRoute'
import authenticateRouter from './account/authenticateRoute'
import profileRouter from './account/profileRoute'
import profilePasswordRouter from './account/profilePasswordRoute'
import tokenRouter from './account/tokenRoute'
import adminProductsRouter from './admin/adminProductsRouter'
import adminCategoriesRouter from './admin/adminCategoriesRouter'
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('../../swagger.json')

const router: Router = express.Router()

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
router.use("/products", productsRouter)
router.use("/categories", categoriesRouter)
router.use("/register", registerRouter)
router.use("/authenticate", authenticateRouter)
router.use("/profile", profileRouter)
router.use("/profile/password", profilePasswordRouter)
router.use("/token", tokenRouter)
router.use("/admin/products", adminProductsRouter)
router.use("/admin/categories", adminCategoriesRouter)

export default router