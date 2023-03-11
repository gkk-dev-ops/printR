const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('node:path');
const fs = require('fs');
const os = require('os');

const filesPayloadExists = require('./middleware/filesPayloadExists');
const fileExtLimiter = require('./middleware/fileExtLimiter');
const fileSizeLimiter = require('./middleware/fileSizeLimiter');

const printFile = require('./middleware/printMe');

const HOSTNAME = 'localhost'
const filesFolder = './files/';

function isEmpty(path) {
  return fs.readdirSync(path).length === 0;
}

if (!fs.existsSync(filesFolder)) {
  fs.mkdirSync(filesFolder);
}

const PORT = process.env.PORT || 3500;

const app = express();
app.use('/public', express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/upload',
    fileUpload({createParentPath: true}),
    filesPayloadExists,
    fileExtLimiter(['.png', '.jpg', '.jpeg', '.txt']),
    fileSizeLimiter,
    (req, res) => {
      const files = req.files;

      Object.keys(files).forEach((key) => {
        const filepath = path.join(__dirname, 'files', files[key].name);
        files[key].mv(filepath, (err) => {
          if (err) return res.status(500).json({status: 'error', message: err});
        });
      });

      if (!isEmpty(filesFolder)) {
        fs.readdir(filesFolder, (err, files) => {
          files.forEach((file) => {
            printFile(`./files/${file}`);
            console.log(file);
          });
        });
      }

      return res.json(
          {
            status: 'success',
            message: Object.keys(files).toString(),
          },
      );
    },
);

app.listen(PORT, () => console.log(`listening on port ${PORT}
http://${HOSTNAME}:${PORT}
`));
