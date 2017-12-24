const restful = require('node-restful');
const bcrypt = require('bcrypt');

const { mongoose } = restful;

function User() {

}

/*
  User Schema
  Note: unique id will be generated by mongoose
*/
User.schema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  dob: { type: Date },
  address: { type: String },
  description: { type: String },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

// validate user password
User.schema.methods = {
  async isValidPassword(password) {
    try {
      return await bcrypt.compare(password, this.password);
    } catch (error) {
      throw new Error(error);
    }
  },
};

// Create hashed password
async function hashPassword(next) {
  try {
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (error) {
    next(error);
  }
}

User.schema.pre('save', hashPassword);

User.model = mongoose.model('user', User.schema);

module.exports = restful.model('Users', User.schema);
