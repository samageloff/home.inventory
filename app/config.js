// All configuration options

module.exports.port = 3001; // App's port
module.exports.aws_key = ""; // AWS Key
module.exports.aws_secret = ""; // AWS Secret
module.exports.aws_bucket = ""; // AWS Bucket
module.exports.redirect_host = "http://localhost:3001/"; // Host to redirect after uploading
module.exports.host = "s3.amazonaws.com"; // S3 provider host
module.exports.bucket_dir = "uploads/";
module.exports.max_filesize = 20971520; // Max filesize in bytes (default 20MB)