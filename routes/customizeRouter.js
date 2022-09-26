const express = require("express");
const { Customize } = require("../models/customizeModel");
const router = express.Router();

router.post("/create",async(req,res)=>{

        const customize = new Customize({
            model: req.body.model,
            collar: req.body.collar,
            cuff: req.body.cuff,
            sleeves: req.body.sleeves,
            color: req.body.color,
          });
          customize.save()
          res.send(customize)
    });

module.exports = router;
