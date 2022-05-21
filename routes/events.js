const router = require('express').Router();
const crypto = require('crypto');
const EventModel = require('../models/Event');
const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_USERNAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// CREATE AN EVENT
router.post('/upload', async (req, res) => {
  if (req.files === null) {
    return res.status(400).json({
      error: true,
      message: 'Aucun evenement ajouter',
      data: null,
    });
  }
  const { event_name, event_description, creator_id } = req.body;
  const url_img = req.files.url_img;
  url_img.name = crypto.randomBytes(10).toString('hex');
  function imageUploader() {
    return new Promise(function (resolve, reject) {
      cloudinary.uploader.upload(url_img.tempFilePath, function (result, err) {
        if (err) {
          console.log(err);
        }
        resolve(result);
      });
    });
  }
  let imageData = await imageUploader();

  // **************************************************
  const event = new EventModel({
    event_name: event_name,
    event_description: event_description,
    creator: creator_id,
    url_img: imageData.url,
    start_date: new Date(),
    end_date: new Date(),
  });
  // **************************************************
  // const event = new EventModel({
  //   candidates: event_data.candidates,
  //   participants: event_data.participants,
  // });
  event.save(function (err) {
    return err;
  });
  res.send(event);
});

// DELETE AN EVENT
router.delete('/:id', async (req, res) => {
  const events = await EventModel.deleteOne({ _id: req.params.id });
  res.send(events);
});

// GET SPECIFIC EVENT
router.get('/:id', async (req, res) => {
  const event = await EventModel.find({ _id: req.params.id });
  res.send(event);
});

// GET ALL EVENTS
router.get('/', async (req, res) => {
  const events = await EventModel.find();
  if (events.length === 0) {
    return res.send({ error: 'Aucun évènement disponible' });
  }
  res.send(events);
});

// GET EVENTS OF A USER
router.post('/', async (req, res) => {
  const events = await EventModel.find({ creator: req.body.id });
  if (events.length === 0) {
    return res.send({ message: 'Aucun évènement pour cet utilisateur' });
  }
  res.send(events);
});

// UPDATE AN EVENT STATUS (set onLive to false)
router.put('/:id', async (req, res) => {
  const event = await EventModel.updateOne(
    { _id: req.params.id },
    { onLive: false }
  );
  res.send(event.acknowledged);
});

module.exports = router;
