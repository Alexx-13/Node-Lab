interface IProducts {
    _id: number
    categoryIds: string
    displayName: string
    createdAt: Date
    minRating: number
    price: number
    ratings: Array<number>
}

export default IProducts