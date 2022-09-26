const express = require("express");
const { Size } = require("../models/sizeModel");
const router = express.Router();
const { User } = require("../models/userModel");

router.post("/create",async(req,res)=>{
    const user=await User.findById(req.body.userId);

    if(user==null)
    {
        console.log(user)
        res.status(400).send("User not exists");
    }
    else
    {
        check = await Size.find({userId: req.body.userId})
        if (check!=null) {res.send("Size already exists against the user").status(400)} 
        const size = new Size({
            userId: req.body.userId,
            chest: req.body.chest,
            collar: req.body.collar,
            neck: req.body.neck,
            shoulderWidth: req.body.shoulderWidth,
            armLength: req.body.armLength,
            Inseam: req.body.Inseam,
          });
          size.save()
          res.send(size)
    }



})

router.get("/get/:id",async(req,res)=>{
    const size = await Size.find({userId: req.body.userId})
    res.send(size).status(200)
})

router.put("/update/:id",async (req, res) => {
        const size = await Size.findByIdAndUpdate({ _id: req.params.id });
        size.userId = req.body.userId;
        size.chest = req.body.chest;
        size.collar = req.body.collar;
        size.neck = req.body.neck;
        size.shoulderWidth = req.body.shoulderWidth;
        size.armLength = req.body.armLength;
        size.Inseam = req.body.Inseam;
        await size.save();
        res.send("saved")
     
    }
  );

module.exports = router;
