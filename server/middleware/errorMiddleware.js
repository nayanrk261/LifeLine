const errorHandler = (err, req, res, next) => {
    console.error(err);

    if (err.name === "CastError" && err.kind === "ObjectId") {
        return res.status(400).json({
            message: "Invalid application ID"
        });
    }

    res.status(500).json({
        message: "Internal server error"
    });
};

module.exports = errorHandler;