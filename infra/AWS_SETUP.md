# EchoStream — AWS Infrastructure Setup

Complete step-by-step guide to provision all AWS resources for EchoStream.

---

## Prerequisites

- AWS CLI installed and configured (`aws configure`)
- Docker installed
- Node.js 22+ installed
- GitHub repository connected

---

## 1. S3 Bucket Setup

```bash
# Create the bucket (replace ap-southeast-1 with your region)
aws s3api create-bucket \
  --bucket echostream-media \
  --region ap-southeast-1 \
  --create-bucket-configuration LocationConstraint=ap-southeast-1

# Disable public access (CloudFront OAC handles access)
aws s3api put-public-access-block \
  --bucket echostream-media \
  --public-access-block-configuration \
    "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket echostream-media \
  --versioning-configuration Status=Enabled
```

**Expected folder structure** (for real S3 uploads):
```
s3://echostream-media/
  media/
    episodes/
      ep-001/
        index.m3u8
        segment000.ts
        segment001.ts
        ...
  thumbnails/
    ep-001.jpg
    ep-002.jpg
    ...
```

> **Demo note:** For this demo, public Mux test streams are used directly as `streamUrl`. To replace with real S3/CloudFront URLs, upload your HLS segments to the structure above, then update `streamUrl` in `api/src/data/episodes.ts` to point to your CloudFront domain (e.g. `https://d1234abcd.cloudfront.net/media/episodes/ep-001/index.m3u8`).

---

## 2. CloudFront Distribution

### Create Origin Access Control (OAC)

In the AWS Console:
1. Go to **CloudFront → Origin access → Create control setting**
2. Name: `echostream-oac`
3. Origin type: S3
4. Signing behaviour: Sign requests (recommended)

### Create Distribution

1. Go to **CloudFront → Create distribution**
2. **Origin:**
   - Origin domain: `echostream-media.s3.ap-southeast-1.amazonaws.com`
   - Origin access: Origin access control (select `echostream-oac`)
3. **Cache behaviours:**
   - Default (`*`): Cache policy — CachingOptimized
   - Add behaviour for `*.m3u8`:
     - TTL: min 0, default 30, max 30 (seconds)
     - Compress objects: Yes
   - Add behaviour for `*.ts`:
     - TTL: min 86400, default 86400, max 86400 (seconds — 24h)
     - Compress objects: No (already compressed)
4. **CORS:** Add response headers policy with `Access-Control-Allow-Origin: *`
5. **HTTPS:** Redirect HTTP to HTTPS

After creation, update the S3 bucket policy (CloudFront will prompt you):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontOAC",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::echostream-media/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::YOUR_ACCOUNT_ID:distribution/YOUR_DISTRIBUTION_ID"
        }
      }
    }
  ]
}
```

---

## 3. ECR Repository

```bash
# Create ECR repo
aws ecr create-repository \
  --repository-name echostream-api \
  --region ap-southeast-1 \
  --image-scanning-configuration scanOnPush=true

# Note the repositoryUri from the output — you'll need it for App Runner
```

---

## 4. App Runner Service

### Option A: Via AWS Console

1. Go to **App Runner → Create service**
2. Source: Container registry → Amazon ECR
3. ECR URI: `YOUR_ACCOUNT_ID.dkr.ecr.ap-southeast-1.amazonaws.com/echostream-api:latest`
4. Deployment trigger: Automatic
5. Configure build: Skip (pre-built image)
6. Service name: `echostream-api`
7. Port: `4000`
8. Environment variables:
   - `PORT=4000`
   - `FRONTEND_URL=https://YOUR_AMPLIFY_DOMAIN`
   - `NODE_ENV=production`
9. CPU: 1 vCPU, Memory: 2 GB
10. Create an **ECR access role** (App Runner needs permission to pull from ECR):
    - IAM → Create role → App Runner use case
    - Attach policy: `AmazonEC2ContainerRegistryReadOnly`
    - Name: `AppRunnerECRAccessRole`

### Option B: Via CLI (after first manual deploy)

```bash
aws apprunner update-service \
  --service-arn YOUR_SERVICE_ARN \
  --source-configuration '{
    "ImageRepository": {
      "ImageIdentifier": "YOUR_ACCOUNT_ID.dkr.ecr.ap-southeast-1.amazonaws.com/echostream-api:latest",
      "ImageRepositoryType": "ECR"
    }
  }'
```

---

## 5. AWS Amplify (Frontend)

1. Go to **Amplify → New app → Host web app**
2. Source: GitHub → select your repo
3. Branch: `main`
4. Build settings — override with:
   ```yaml
   version: 1
   applications:
     - frontend:
         phases:
           preBuild:
             commands:
               - cd frontend && npm ci
           build:
             commands:
               - npm run build
         artifacts:
           baseDirectory: frontend/.next
           files:
             - '**/*'
         cache:
           paths:
             - frontend/node_modules/**/*
       appRoot: frontend
   ```
5. Environment variables (in Amplify Console → Environment variables):
   - `NEXT_PUBLIC_API_URL` = `https://YOUR_APPRUNNER_SERVICE_URL`
6. Enable SSR: **Amplify → App settings → General → Platform → Web compute**

---

## 6. IAM Setup

### Deployment User (for GitHub Actions)

```bash
# Create user
aws iam create-user --user-name echostream-deploy

# Attach policies
aws iam put-user-policy \
  --user-name echostream-deploy \
  --policy-name EchoStreamDeployPolicy \
  --policy-document '{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:InitiateLayerUpload",
          "ecr:UploadLayerPart",
          "ecr:CompleteLayerUpload",
          "ecr:PutImage"
        ],
        "Resource": "*"
      },
      {
        "Effect": "Allow",
        "Action": [
          "apprunner:UpdateService",
          "apprunner:DescribeService"
        ],
        "Resource": "arn:aws:apprunner:*:YOUR_ACCOUNT_ID:service/echostream-api/*"
      },
      {
        "Effect": "Allow",
        "Action": [
          "amplify:StartJob",
          "amplify:GetJob"
        ],
        "Resource": "arn:aws:amplify:*:YOUR_ACCOUNT_ID:apps/YOUR_AMPLIFY_APP_ID/*"
      }
    ]
  }'

# Create access keys
aws iam create-access-key --user-name echostream-deploy
# Save the AccessKeyId and SecretAccessKey — you'll need them for GitHub Secrets
```

---

## 7. GitHub Secrets

Add these secrets in your GitHub repo under **Settings → Secrets and variables → Actions**:

| Secret | Description | How to get it |
|---|---|---|
| `AWS_ACCESS_KEY_ID` | IAM deploy user access key | From `create-access-key` above |
| `AWS_SECRET_ACCESS_KEY` | IAM deploy user secret | From `create-access-key` above |
| `AWS_REGION` | AWS region, e.g. `ap-southeast-1` | Your chosen region |
| `ECR_REPOSITORY` | ECR repo name, e.g. `echostream-api` | From ECR console |
| `APP_RUNNER_ROLE_ARN` | ARN of the App Runner ECR access role | From IAM console |
| `AMPLIFY_APP_ID` | Amplify app ID | From Amplify console URL |
| `API_URL` | App Runner public URL | From App Runner service details |

---

## Post-Setup Checklist

- [ ] S3 bucket created with versioning enabled
- [ ] CloudFront distribution deployed and serving S3 content
- [ ] ECR repository created
- [ ] First Docker image pushed manually: `cd api && docker build -t echostream-api . && docker tag echostream-api:latest YOUR_ECR_URI:latest && docker push YOUR_ECR_URI:latest`
- [ ] App Runner service running on port 4000
- [ ] Amplify app deployed with correct `NEXT_PUBLIC_API_URL`
- [ ] All 7 GitHub Secrets configured
- [ ] CI/CD: push to `main` with changes in `api/` triggers API deploy
- [ ] CI/CD: push to `main` with changes in `frontend/` triggers frontend deploy
