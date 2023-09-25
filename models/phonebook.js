const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
const url = process.env.MONGODB_URI;
console.log("Connecting to DB");

mongoose.connect(url).then((_) => {
  console.log("Connected");
})
.catch((error) => {
  console.log(error.message);
});

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String
});

phonebookSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  }
})

module.exports = mongoose.model("Phonebook", phonebookSchema);