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
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    // match: /^()?\d{3,4}()?(-)d*$/,
    validate: {
      validator: function (v) {
        return /^()?\d{2,3}()?(-)\d*$/.test(v);
      },
      message: (props) => 'Invalid format: (123[4])-56789'
    },
    required: true,
  }
});

phonebookSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  }
})

module.exports = mongoose.model("Phonebook", phonebookSchema);