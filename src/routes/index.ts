import express from 'express'
import { Router } from "express";
import productsRouter from './productsRoute';
import categoriesRouter from './categoriesRoute'
const router: Router = express.Router()

router.use("/products", productsRouter)
router.use("/categories", categoriesRouter)

export default router