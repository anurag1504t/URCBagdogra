module.exports = {
    'secretKey': process.env.SECRET || "12345-67890-09876-54321",
    'mongoUrl' : process.env.MONGODB_URI || "mongodb+srv://ankitm:ankitm@db-xlqmm.gcp.mongodb.net/data?retryWrites=true&w=majority",
    'pagesize' : 24
}