var express = require('express');
const fs = require('fs')
const { Blob } = require('buffer')
var router = express.Router();
const formatToHtml = require('../formatToHtml')
const multer = require('multer')
const path = require('path')
const htmlToPdf = require('html-pdf-node')
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
router.get('/', (req, res) => {
  res.redirect('/html')
})

router.get('/html', (req, res) => {
  const result = 'MarkDown 轉檔 HTML'
  res.render('index', { title: result });

});
router.get('/pdf', (req, res) => {
  const result = 'MarkDown 轉檔 PDF'
  res.render('pdf', { title: result })
})

router.post('/format/html', upload.any(), (req, res) => {
  let options = { format: 'A4' }
  const file = req.files[0]
  fs.readFile(file.path, (err, data) => {
    if (err) {
      console.log(err)
      res.send('error', err)
    }
    const formatedData = formatToHtml(data.toString())
    res.send({ filename: file.filename, formatedData })
  })

})

router.post('/format/pdf', upload.any(), (req, res) => {
  let options = { format: 'A4' }
  const file = req.files[0]
  fs.readFile(file.path, (err, data) => {
    if (err) {
      console.log(err)
      res.send('error', err)
    }
    const formatedData = formatToHtml(data.toString())
    htmlToPdf.generatePdf({ content: formatedData }, options)
      .then(pdfBuffer => {
        res.send({ filename: file.filename, formatedData,pdfBuffer })
      })
  })
})


module.exports = router;
