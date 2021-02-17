import { Document } from "mongoose";

export interface Product {
    name: Document<String>;
}