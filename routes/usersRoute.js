const Team = require('../models/teamModel');
const User = require('../models/usersModel');

const router = require('express').Router();

// const data = []; // Your dataset with 500 items

router.get('/get-users', async (req, res) => {
    try {
        let { page, limit, search, domain, gender, availability } = req.query;
        console.log("------", req.query)
        const query = {};

        // Case-insensitive search by name
        if (search) {
            query.first_name = { $regex: search, $options: 'i' };
        }

        // Additional filters
        if (domain) {
            query.domain = domain;
        }

        if (gender) {
            query.gender = gender;
        }

        if (availability) {
            query.availability = availability;
        }

        console.log("---------QQQQQQ----------", query);

        const users = await User.find(query).sort({ createdAt: -1 });

        // Set default values if not provided
        page = parseInt(page) || 1;
        limit = parseInt(limit) || itemsPerPage;

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const slicedData = users.slice(startIndex, endIndex);

        res.json({
            items: query.first_name ? users : slicedData,
            totalPages: Math.ceil(users.length),
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.post("/add-user", async (req, res) => {
    try {
        const newuser = new User(req.body);
        await newuser.save();
        res.send({
            success: true,
            message: "user created successfully"
        })

    } catch (error) {
        res.send({
            success: false,
            message: error.message
        })
    }
})

// router.get("/get-user",async(req,res)=>{
//     try {
//         const users = await User.find().sort({ createdAt: -1 });
//         res.send({
//             success: true,
//             data : users,
//             message: "user fetched successfully"
//         })

//     } catch (error) {
//         res.send({
//             success: false,
//             message: error.message
//         })
//     }
// }) 

//get user by Id
router.get("/get-user-by-id/:id", async (req, res) => {
    try {
        const id = req.params.id;
        console.log("id : ", id)
        const users = await User.findById(id);
        res.send({
            success: true,
            data: users,
            message: "Unit user fetched successfully"
        })

    } catch (error) {
        res.send({
            success: false,
            message: error.message
        })
    }
})

router.post('/team', async (req, res) => {
    const { userId, teamName, domain, availability } = req.body;

    try {
        // Check if a team with the specified teamName exists
        let existingTeam = await Team.findOne({ teamName });

        if (existingTeam) {
            // Team exists, add the user as a member
            existingTeam.members.push(userId);
            await existingTeam.save();
            res.json({ success: true, message: 'User added to existing team', data: existingTeam });
        } else {
            // Team doesn't exist, create a new team
            const newTeam = new Team({
                teamName,
                domain,
                availability,
                members: [userId],
            });

            // Save the new team to the database
            await newTeam.save();
            res.json({ success: true, message: 'New team created', data: newTeam });
        }
    } catch (error) {
        console.error('Error creating or updating team:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }

});

// GET /api/team/:id
router.get('/team/:id', async (req, res) => {
    try {
        // Find the team by ID and populate the members field with user details
        const team = await Team.findById(req.params.id).populate('members', 'first_name last_name email'); // Add more fields as needed
        if (!team) {
            return res.status(404).json({ success: false, message: 'Team not found' });
        }
        res.json({ success: true, data: team });
    } catch (error) {
        console.error('Error retrieving team:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
// update user by id api endpoint
router.put("/edit-user/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const updatedusers = await User.findByIdAndUpdate(id, req.body);
        res.send({
            success: true,
            message: `user #${id} has been updated successfully`,
        })

    } catch (error) {
        res.send({
            success: false,
            message: error.message
        })
    }
})
// update user by id api endpoint
router.delete("/delete-user/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const updatedusers = await User.findByIdAndDelete(id);
        res.send({
            success: true,
            message: `user has been deleted successfully`,
        })

    } catch (error) {
        res.send({
            success: false,
            message: error.message
        })
    }
})

module.exports = router;