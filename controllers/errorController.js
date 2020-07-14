exports.pageNotFound = (req, res) => {
    res.status(404).send('The requested endpoint was not found.');
}
exports.internalServerError = (error, req, res, next) => {
    console.log(`There was an internal server error: ${error.stack}`);
    res.status(500).send("Sorry, there is an internal server error");
}