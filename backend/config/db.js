const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
// Connect to the MongoDB database
mongoose
  .connect(
    `mongodb+srv://shreedhar:shreedhar@cluster0.urmb4ef.mongodb.net/fuldflo?retryWrites=true&w=majority`
  )
  .then(() => console.log(`mongodb database connected`))
  .catch((error) => console.log(error));
