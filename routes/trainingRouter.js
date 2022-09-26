const express = require("express");
const router = express.Router();
//const multer = require("multer");
//const fs = require("fs");
const { Training } = require("../models/trainingModel");
const upload = require("../utils/multer");
const { Video } = require("../models/videoModel");
const uploadVideo = require("../utils/multerVideo");
const cloudinary = require("../utils/cloudinary");
const auth = require("../middleware/auth");
const { User } = require("../models/userModel");

/*const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploadImages/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

const upload = multer({ storage: storage }); */

//Create Training Program
router.post("/create", auth, upload.single("image"), async (req, res) => {
  const user = await User.findById(req.user);
  const result = await cloudinary.uploader.upload(req.file.path);
  const training = new Training({
    programId: req.body.programId,
    title: req.body.title,
    targetArea: req.body.targetArea,
    equipment: req.body.equipment,
    description: req.body.description,
    imageURL: result.secure_url,
    cloudinary_id: result.public_id,
    userId: req.user,
    userName: user.name,
  });
  await training.save((err) => {
    if (err) return res.status(400).json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

//Create Guided WOrkout
router.post(
  "/uploadVideo",
  auth,
  uploadVideo.single("video"),
  async (req, res) => {
    try {
      const user = await User.findById(req.user);
      const result = await cloudinary.v2.uploader.upload(
        req.file.path,
        { resource_type: "video" },
        function (error, result) {
          console.log(result, error);
        }
      );

      console.log(result);
      const video = new Video({
        title: req.body.title,
        targetArea: req.body.targetArea,
        equipment: req.body.equipment,
        description: req.body.description,
        videoURL: result.secure_url,
        cloudinary_id: result.public_id,
        uploaderName: user.name,
        userId: req.user,
        userName: user.name,
      });
      await video.save((err) => {
        if (err) return res.status(400).json({ success: false, err });
        return res.status(200).json({ success: true });
      });
    } catch (err) {
      console.log(err);
    }
  }
);

//Get Guided Workouts for specific
router.get("/specific/getVideos", auth, async (req, res) => {
  await Video.find({ userId: req.user }, (err, doc) => {
    if (err) res.status(400).send(err);
    res.status(200).send(doc);
  });
});

//Get Guided Workouts
router.get("/getVideos", auth, async (req, res) => {
  await Video.find((err, doc) => {
    if (err) res.status(400).send(err);
    res.status(200).send(doc);
  });
});

//Get Guided WOrkout by id
router.get("/getVideos/:id", auth, async (req, res) => {
  await Video.findById(req.params.id).exec((err, doc) => {
    if (err) res.status(400).send(err);
    res.status(200).send(doc);
  });
});

//Delete Guided Workout
router.delete("/delete/guided/:id", auth, async (req, res) => {
  const video = await Video.findByIdAndDelete({ _id: req.params.id });
  await cloudinary.v2.uploader.destroy(
    video.cloudinary_id,
    { resource_type: "video" },
    function (error, result) {
      console.log(result, error);
    }
  );
  return res.send(video);
});

//Update Guided Workout
router.put("/update/guidedworkout/:id", auth, async (req, res) => {
  const video = await Video.findByIdAndUpdate({ _id: req.params.id });
  video.title = req.body.title;
  video.targetArea = req.body.targetArea;
  video.equipment = req.body.equipment;
  video.description = req.body.description;
  await video.save();
  return res.send(video);
});

//Add Schedule Guided Workout
router.post("/add/guided/detail/:id", auth, async (req, res) => {
  const training = await Video.findById(req.params.id);
  let detail = [];
  req.body.map((data) => {
    detail.push(data);
  });
  training.exercise = detail;
  await training.save((err, doc) => {
    if (err) {
      return res.status(400).status.json({ msg: "Program Scheduled Added" });
    } else {
      return res.status(200).send(doc);
    }
  });
});

//Update Guided Workout Schedule
router.put("/edit/guided/schedule/:id/:index", auth, async (req, res) => {
  const training = await Video.findByIdAndUpdate({ _id: req.params.id });
  training.exercise[req.params.index] = req.body;
  training.markModified("exercise");
  await training.save((err, doc) => {
    if (err) {
      return res.status(400).json({ msg: "Error Occured" });
    } else {
      return res.status(200).json({ msg: "Program Schedule updated" });
    }
  });
});

//Add Guided Workout List
router.post("/add/guided/workout/detail/:id", auth, async (req, res) => {
  const training = await Video.findById(req.params.id);
  let detail = [];
  req.body.map((data) => {
    detail.push(data);
  });
  training.workoutList = detail;
  await training.save((err, doc) => {
    if (err) {
      return res.status(400).status.json({ msg: "Program Workout Added" });
    } else {
      return res.status(200).send(doc);
    }
  });
});

//Update Guided Workout List
router.put("/edit/guided/workout/:id/:index", auth, async (req, res) => {
  const training = await Video.findByIdAndUpdate({ _id: req.params.id });
  training.workoutList[req.params.index] = req.body;
  training.markModified("workoutList");
  await training.save();
  return res.send(training);
});

module.exports = router;

//Get Traning Program
router.get("/get", auth, async (req, res) => {
  await Training.find({ userId: req.user }, (err, doc) => {
    if (err) res.status(400).send(err);
    res.status(200).send(doc);
  });
});
//Get all
router.get("/getAll", auth, async (req, res) => {
  await Training.find((err, doc) => {
    if (err) res.status(400).send(err);
    res.status(200).send(doc);
  });
});

//Get Training Program by id
router.get("/get/:id", auth, async (req, res) => {
  await Training.findById(req.params.id).exec((err, doc) => {
    if (err) res.status(400).send(err);
    res.status(200).send(doc);
  });
});

//Delete Training Program
router.delete("/delete/:id", auth, async (req, res) => {
  const training = await Training.findByIdAndDelete({ _id: req.params.id });
  await cloudinary.uploader.destroy(training.cloudinary_id);
  return res.send(training);

  /*fs.unlink(training.imagePath, (err) => {
    if (err) console.log(err); 
    console.log("file deleted from directory");
  });*/
});

//Update Training Program
router.put("/update/:id", auth, upload.single("image"), async (req, res) => {
  const training = await Training.findByIdAndUpdate({ _id: req.params.id });
  if (req.body.cloudinary_id === "") {
    await cloudinary.uploader.destroy(training.cloudinary_id);
    const result = await cloudinary.uploader.upload(req.file.path);
    (training.imageURL = result.secure_url),
      (training.cloudinary_id = result.public_id);
  }
  training.programId = req.body.programId;
  training.title = req.body.title;
  training.targetArea = req.body.targetArea;
  training.equipment = req.body.equipment;
  training.description = req.body.description;
  await training.save();
  return res.send(training);
});

//Add Program Details
router.post("/add/detail/:id", auth, async (req, res) => {
  const training = await Training.findById(req.params.id);
  let detail = [];
  req.body.map((data) => {
    detail.push(data);
  });
  training.exercise = detail;
  await training.save((err, doc) => {
    if (err) {
      return res.status(400).status.json({ msg: "Program Scheduled Added" });
    } else {
      return res.status(200).send(doc);
    }
  });
});

//Get Program Details
router.get("/get/detail", auth, async (req, res) => {
  const training = await Training.find((err, doc) => {
    if (err) res.status(400).send(err);
    res.status(200).send(training);
  });
});

//Update Program Schedule
router.put("/edit/schedule/:id/:index", auth, async (req, res) => {
  const training = await Training.findByIdAndUpdate({ _id: req.params.id });
  training.exercise[req.params.index] = req.body;
  training.markModified("exercise");
  await training.save((err, doc) => {
    if (err) {
      return res.status(400).json({ msg: "Error Occured" });
    } else {
      return res.status(200).json({ msg: "Program Schedule updated" });
    }
  });
});

//Add Workout List
router.post("/add/workout/detail/:id", auth, async (req, res) => {
  const training = await Training.findById(req.params.id);
  let detail = [];
  req.body.map((data) => {
    detail.push(data);
  });
  training.workoutList = detail;
  await training.save((err, doc) => {
    if (err) {
      return res.status(400).status.json({ msg: "Program Workout Added" });
    } else {
      return res.status(200).send(doc);
    }
  });
});

//Get Workout List
router.get("/get/workout/detail", auth, async (req, res) => {
  await Training.find((err, doc) => {
    if (err) res.status(400).send(err);
    res.status(200).send(doc);
  });
});

//Update Program Workout
router.put("/edit/workout/:id/:index", auth, async (req, res) => {
  const training = await Training.findByIdAndUpdate({ _id: req.params.id });
  training.workoutList[req.params.index] = req.body;
  training.markModified("workoutList");
  await training.save();
  return res.send(training);
});

module.exports = router;
