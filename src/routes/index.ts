import express from 'express'
import { Router } from "express";
const productsRouter = require('./productsRoute')
const categoriesRouter = require('./categoriesRoute')
const router: Router = express.Router()

router.use("/products", productsRouter)
router.use("/categories", categoriesRouter)

export default router