import express, { Router } from 'express'
import productsRouter from './productsRoute'
import categoriesRouter from './categoriesRoute'
import registerRouter from './account/registerRoute'
import authenticateRouter from './account/authenticateRoute'
import profileRouter from './account/profileRoute'

const router: Router = express.Router()

router.use("/products", productsRouter)
router.use("/categories", categoriesRouter)
router.use("/register", registerRouter)
router.use("/authenticate", authenticateRouter)
router.use("/profile", profileRouter)

export default router