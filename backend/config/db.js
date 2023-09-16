const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
// Connect to the MongoDB database
mongoose
  .connect(`mongodb://localhost:27017/contact`)
  .then(() => console.log(`mongodb database connected`))
  .catch((error) => console.log(error));
