// Example Team Model
const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    teamName: {
        type: String,
        required: true
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        }
    ], // Assuming your user model is named 'User'
    // ... other fields as needed
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
