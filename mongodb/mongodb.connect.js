const mongoose = require("mongoose");

async function connect() {
    try {
        await mongoose.connect(
            "mongodb+srv://UserPAI:userpai1@pai-aezrc.mongodb.net/test?retryWrites=true&w=majority",
            {useNewUrlParser: true, useUnifiedTopology: true}
        );
    } catch (err) {
        console.error(err);
        console.error("Error connecting to mongodb");
    }

}

module.exports = {connect};
