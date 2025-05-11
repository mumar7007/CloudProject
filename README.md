# Deployment Guide (AWS Cloud-Native App)
This guide explains how to deploy the react-first-project cloud-native application with a React frontend, Node.js/Express backend, MySQL RDS database, and AWS S3 for media storage.

## Prerequisites
1. AWS Account
2. IAM user with appropriate permissions
3. AWS CLI configured (optional)
4. SSH client (e.g., PuTTY or terminal)

##  1. Backend Setup (Node.js) on EC2
1. Launch an EC2 instance (Amazon Linux 2023, t2.micro or t3.micro).
2. Add an inbound rule to EC2 Security Group:
     Port 22 (SSH) → Your IP
     Port 5000 → Anywhere
3. SSH into the EC2 instance:
   ssh -i <your-key.pem> ec2-user@<EC2-Public-IP>
4. Install Node.js, Git, and other dependencies.
  sudo yum update -y
  sudo yum install -y git nodejs npm
5. Clone your backend repository and install dependencies:
  git clone <your-backend-repo>
  cd <project-dir>
  npm install
6.Configure environment variables (.env) with:
  RDS Host, DB User/Pass
  AWS S3 Bucket details
7. Start the server:
   node index.js

##  2. S3 Bucket Setup (Media Uploads)
1.Create an S3 bucket (e.g., react-media-bucket).
2. Uncheck “Block all public access.”
3. Apply the following Bucket Policy for public read:
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::react-media-bucket/*"
  }]
}

##  3. RDS Setup (MySQL Database)
1. Launch an RDS instance (MySQL, Free Tier).
2. Configure:
  DB Name, Username, Password
  Public Access: No (use VPC & EC2 SG)
3. Create RDS Security Group:
  Inbound Rule: Port 3306 → Custom (EC2 SG)
4. Copy RDS Endpoint to use in backend .env.

##  4. IAM Role for EC2
1. Create IAM Role: ec2-s3-rds-role
  Attach Policies:
  AmazonS3FullAccess
  AmazonRDSFullAccess
2. CloudWatchLogsFullAccess
3. Attach the role to your EC2 instance via the EC2 dashboard.

##  5. Frontend Deployment via Elastic Beanstalk
1. Build React app:
  npm run build
2. Zip the contents of the /build directory (not the folder itself).
3. Create Elastic Beanstalk App (Platform: Node.js).
4. Upload the zip file and deploy.
5. Ensure Beanstalk Security Group allows HTTP (Port 80).

# Notes:
1. Be sure to update the frontend API endpoints based on your backend EC2 public IP.
2. Use PM2 or screen to keep your Node.js backend running in production.


