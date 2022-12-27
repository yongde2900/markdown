var express = require('express');
const fs = require('fs')
var router = express.Router();
const formatToHtml = require('../formatToHtml')
const multer = require('multer')
const path = require('path')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const filePath = path.join(__dirname, '../tmp/my-uploads')
    cb(null, filePath)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const filedname = file.filename + '-' + uniqueSuffix
    cb(null, filedname)
  }
})
const upload = multer({ storage: storage })



/* GET home page. */
router.get('/', function (req, res, next) {
  const result = 'MarkDown 轉檔'
  res.render('index', { title: result });
});


router.post('/format/html', upload.any(), (req, res) => {
  const file = req.files[0]
  fs.readFile(file.path, (err, data) => {
    if (err) {
      console.log(err)
      res.send('error', err)
    }
    const formatedData = formatToHtml(data.toString())

    res.json({ formatedData, path: file.path, filename: file.filename })

  })

})


module.exports = router;
