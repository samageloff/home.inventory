// All configuration options

module.exports.port = 3000; // App's port
module.exports.aws_key = "AKIAIEGMWVURXXVT3MMA"; // AWS Key
module.exports.aws_secret = "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"; // AWS Secret
module.exports.aws_bucket = "home-inventory-items"; // AWS Bucket
module.exports.redirect_host = "http://localhost:3000/"; // Host to redirect after uploading
module.exports.host = "s3.amazonaws.com"; // S3 provider host
module.exports.bucket_dir = "/uploads";
module.exports.max_filesize = 20971520; // Max filesize in bytes (default 20MB)