const path = require('path');
const multer = require('multer')
const fs = require('fs').promises;
const uploadDir = path.join(process.cwd(), 'tmp')
const storeImage = path.join(process.cwd(), 'public/avatars')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
  limits: {
    fileSize: 1048576,
  },
});
  
const upload = multer({
  storage: storage,
});
 
const isAccessible = path => {
  return fs
    .access(path)
    .then(() => true)
    .catch(() => false);
};
  
const createFolderIsNotExist = async folder => {
  if (!(await isAccessible(folder))) {
    await fs.mkdir(folder);
  }
};

module.exports = { isAccessible, createFolderIsNotExist, uploadDir, storeImage, upload };