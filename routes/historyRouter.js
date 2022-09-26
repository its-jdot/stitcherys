const router = require("express").Router();
const auth=require("../middleware/auth");
const { History } = require("../models/historyModel");
const admin=require("../middleware/admin");

router.post("/add",auth,admin,async(req,res)=>{
    try{
    const history=new History({
        data:req.body
    });
    await history.save((err) => {
        if (err) return res.status(400).json({ success: false, err });
        return res.status(200).json({ success: true });
      });
    }catch(err){
        console.log(err);
    }
});
router.delete("/delete/:id",auth,admin, async (req, res) => {
    try{
     await History.findByIdAndDelete({ _id: req.params.id })
     return res.status(200).json({ success: true });
    }
    catch(err){
      console.log(err);
    }
  });
router.get("/get",auth,admin,async(req,res)=>{
    try{
    await History.find().exec((err,doc)=>{
        if (err) res.status(400).send(err);
    res.status(200).send(doc);
    });
}catch(err){
    console.log(err);
}
});

module.exports = router;