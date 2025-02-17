const { R2 } = require("node-cloudflare-r2");
require("dotenv").config();

const r2 = new R2({
  accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
  accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID,
  secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY,
});

const bucket = r2.bucket(process.env.CLOUDFLARE_BUCKET_NAME);
bucket.provideBucketPublicUrl(process.env.CLOUDFLARE_BUCKET_PUBLIC_URL);

module.exports = { bucket };
