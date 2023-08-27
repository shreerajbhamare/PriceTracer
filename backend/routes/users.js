const validURL = require('valid-url');

const router = require('express').Router();
let User = require('../models/user');
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const sendMail = require('../utils/sendMailRegister');
var rand;


router.get('/', auth, async(req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route("/getuser/:id").get((req, res) => {
  User.findOne({_id: req.params.id})
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.post('/checkuser', async(req, res) => {
  console.log(req.body)
  User.findOne({email: req.body.email})
      .then(user => res.json(user))
      .catch(err => res.status(400).json('Error: ' + err));
});
// router.route("/getuser/:id").get((req, res) => {
//   User.findOne({_id: req.params.id})
//     .then((data) => res.json(data))
//     .catch((err) => res.status(400).json("Error: " + err));
// });

router.route('/adduser').post((req,res) => {
   
    const newUser = new User();
    newUser.password = newUser.generateHash(req.body.password);
    newUser.name = req.body.name;
    newUser.email = req.body.email;
    newUser.contactNo = req.body.contactNo;
    rand=Math.floor((Math.random() * 100) + 54);

    
    newUser.save()
        .then(() =>  {
          sendMail(rand,newUser.email)
          res.json("Please verify the account to login")
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/verify').get(async (req,res) => {
  console.log(req.protocol+":/"+req.get('host'));
  const host="http://localhost:5000";
  const loginLink = "http://localhost:3000"
  if((req.protocol+"://"+req.get('host'))==host)
  {
      console.log("Domain is matched. Information is from Authentic email");
      if(req.query.id==rand)
      {
        console.log("email is verified");
        const query = {"email": req.query.email}
        const update = {
          "$set": {
            "userVerified": true
          }
        };
        const options = { returnNewDocument: true , useFindAndModify: false};

        await User.findOneAndUpdate(query,update, options)
          .then(user => {
            if(user) {
              console.log("Verified");
              res.end("<h1>Email is been Successfully verified, <a href="+loginLink+">Click here to login</a><h1>")
            }
            else {
              console.log("No such user was found")
            }
          })
          .catch(err => res.status(400).json('Error: ' + err));
        // res.end();
      }
      else
      {
        console.log("Email is not verified");
        res.end("<h1>Bad Request</h1>");
      }
  }
  else
  {
      res.end("<h1>Request is from unknown source</h1>");
  }

})

const { JWT_SECRET } = require('../keys');
router.route('/login').post(async (req,res) => {
    await User.findOne({email:req.body.email})
    .then(user => {
        console.log("User", user)
        if(!user) {
            return res
            .status(400)
            .json({ msg: "No account with this email has been registered." });
        }
           
        const isMatch = user.comparePassword(req.body.password);
        const isValidUser = user.userVerified;
        console.log("In login "+isValidUser);
        if (!isValidUser) return res.status(400).json({ msg: "No account with this email has been registered." });
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });


        const token = jwt.sign({ id: user._id }, JWT_SECRET);
        console.log("token",token);
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    })
    .catch(err => res.status(500).json('Error: ' + err));
});

router.post("/tokenIsValid", async (req, res) => {
    try {
      const token = req.header("x-auth-token");
      if (!token) 
      {
        return res.json(false);
      }
      const verified = jwt.verify(token, JWT_SECRET);
      if (!verified) return res.json(false);
  
      const user = await User.findById(verified.id);
      if (!user) return res.json(false);
  
      return res.json(true);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });




module.exports = router;