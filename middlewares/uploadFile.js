const multer = require("multer");
const { bucket } = require("../config/cloudflare.config");
const db = require("../models");

const storage = multer.memoryStorage();
const uploader = multer({ storage: storage });

const uploadFile = uploader.array("image", 20);

const uploadToR2 = async (req, res, next) => {
  if (!req.files) return next();
  try {
    const mediaList = [];
    for (const file of req.files) {
      const { originalname, buffer } = file;
      const uploadResult = await bucket.uploadStream(buffer, originalname);
      const mediaUrl = uploadResult.publicUrl;
      mediaList.push(mediaUrl);
    }
    req.body.media_list = mediaList;
    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteAvatarOnR2 = async (avatarUrl) => {
  try {
    const mediaUrl = new URL(avatarUrl);
    const objectKey = mediaUrl.pathname.substring(1);
    await bucket.deleteObject(objectKey);
    console.log("Delete avatar successfully!");
  } catch (error) {
    console.log(error);
  }
};

const deleteFileOnR2 = async (req, res, next) => {
  const { id } = req.params;
  const post = await db.Post.findByPk(id);
  if (!post) {
    return res.status(200).json({
      success: false,
      message: "Cann't found post!",
    });
  }

  const postMedias = await db.PostMedia.findAll({ where: { post_id: id } });
  if (!postMedias || postMedias.length === 0) return next();
  for (const media of postMedias) {
    try {
      const mediaUrl = new URL(media.media_url);
      const objectKey = mediaUrl.pathname.substring(1);
      await bucket.deleteObject(objectKey);
    } catch (error) {
      console.log(error);
    }
  }

  next();
};

module.exports = { uploadFile, uploadToR2, deleteFileOnR2, deleteAvatarOnR2 };
