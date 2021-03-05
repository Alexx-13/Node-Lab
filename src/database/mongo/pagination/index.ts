const paginationHandler = (model) => {
    return async (request, response, next) => {
        const page = parseInt(request.query.page)
        const limit = parseInt(request.query.limit)
    
        const startIndex: number = (page - 1) * limit
        const endIndex: number = page * limit
    
        const results: any = {}
    
        if (endIndex < await model.countDocuments().exec()) {
          results.next = {
            page: page + 1,
            limit: limit
          }
        }
        
        if (startIndex > 0) {
          results.previous = {
            page: page - 1,
            limit: limit
          }
        }
        try {
          results.results = await model.find().limit(limit).skip(startIndex).exec()
          response.paginationHandler = results
          next()
        } catch (e) {
            response.status(500).json({ message: e.message })
        }
      }
}

export default paginationHandler