const cron = require('node-cron');

const collectionCleanUpHandlerMongo = (db, collectionName) => {
    console.log('Mongo cron task runs')
    cron.schedule('0 0 * * MON', () => {
        db.default.collection(collectionName).find().limit(10).toArray((err, results) => {
            if (err) {
                throw new err
            } else {
                db.collection.remove({_id:{$nin:results._id}})
            }
        })
    })
    
}

const collectionCleanUpHandlerPostgres = (db, collectionName) => {
    console.log('Postrges cron task runs')
    cron.schedule('0 0 * * MON', () => {
        db.default.query(
            `DELETE FROM ${collectionName}
             WHERE ctid IN (
                SELECT ctid
                FROM ${collectionName}
                ORDER BY timestamp
                LIMIT 10
            )`
        )
    })
}

export { collectionCleanUpHandlerMongo, collectionCleanUpHandlerPostgres }
