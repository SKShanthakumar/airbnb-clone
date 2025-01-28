import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve('uploads/temp'));
  },
  filename: function (req, file, cb) {
    cb(null, req.user.name + "-profile-" + Date.now() + path.extname(file.originalname));
  },
});

const uploadProfile = multer({ storage: storage });

export default uploadProfile;