# 🚀 AI DOMINATOR - Deployment Guide

## 📋 Overview

هذا الدليل يشرح خطوات نشر **AI DOMINATOR** في بيئات مختلفة من التطوير المحلي إلى الإنتاج على السحابة.

---

## 🏗️ Pre-Deployment Checklist

### ✅ المتطلبات الأساسية

```bash
# 1. Node.js و npm
node --version  # >= 18.0.0
npm --version   # >= 9.0.0

# 2. Git
git --version   # >= 2.30.0

# 3. أدوات Build
npm install -g vite
```

### ✅ التحقق من البيئة

```bash
# Clone repository
git clone <repository-url>
cd ai-dominator

# Install dependencies
npm install

# Run local dev server
npm run dev

# Test production build
npm run build
npm run preview
```

---

## 🌐 Deployment Options

### Option 1: Static Hosting (أسرع وأسهل)

**مناسب لـ**: MVP, Testing, Demo

**الخدمات الموصى بها**:
- Vercel ⭐ (Recommended)
- Netlify
- GitHub Pages
- Cloudflare Pages

#### Deploy to Vercel

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy
vercel

# 4. Set production domain
vercel --prod
```

**Vercel Configuration** (`vercel.json`):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

#### Deploy to Netlify

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Login to Netlify
netlify login

# 3. Initialize site
netlify init

# 4. Deploy
netlify deploy --prod
```

**Netlify Configuration** (`netlify.toml`):
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### Option 2: Docker Container

**مناسب لـ**: Production, Scalability, Microservices

#### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/css application/javascript application/json;
    gzip_min_length 1000;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

#### Build and Run Docker

```bash
# Build image
docker build -t ai-dominator:latest .

# Run container
docker run -d -p 80:80 --name ai-dominator ai-dominator:latest

# View logs
docker logs -f ai-dominator

# Stop container
docker stop ai-dominator
```

---

### Option 3: AWS Deployment

**مناسب لـ**: Enterprise, High Availability, Global Scale

#### AWS S3 + CloudFront

```bash
# 1. Build application
npm run build

# 2. Create S3 bucket
aws s3 mb s3://ai-dominator-app

# 3. Upload files
aws s3 sync dist/ s3://ai-dominator-app --delete

# 4. Configure bucket as website
aws s3 website s3://ai-dominator-app \
  --index-document index.html \
  --error-document index.html

# 5. Create CloudFront distribution
aws cloudfront create-distribution \
  --origin-domain-name ai-dominator-app.s3.amazonaws.com \
  --default-root-object index.html
```

**AWS Configuration** (via Terraform):

```hcl
# s3.tf
resource "aws_s3_bucket" "app" {
  bucket = "ai-dominator-app"
  
  website {
    index_document = "index.html"
    error_document = "index.html"
  }
}

# cloudfront.tf
resource "aws_cloudfront_distribution" "app" {
  enabled = true
  default_root_object = "index.html"
  
  origin {
    domain_name = aws_s3_bucket.app.bucket_regional_domain_name
    origin_id   = "S3-ai-dominator"
  }
  
  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-ai-dominator"
    
    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
    
    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }
  
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
  
  viewer_certificate {
    cloudfront_default_certificate = true
  }
}
```

---

### Option 4: Kubernetes Deployment

**مناسب لـ**: Large Scale, Auto-scaling, Multi-region

#### Kubernetes Manifests

**deployment.yaml**:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ai-dominator
  labels:
    app: ai-dominator
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ai-dominator
  template:
    metadata:
      labels:
        app: ai-dominator
    spec:
      containers:
      - name: ai-dominator
        image: ai-dominator:latest
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: ai-dominator-service
spec:
  selector:
    app: ai-dominator
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
  type: LoadBalancer
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ai-dominator-ingress
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
  - hosts:
    - aidominator.com
    secretName: ai-dominator-tls
  rules:
  - host: aidominator.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: ai-dominator-service
            port:
              number: 80
```

**Deploy to Kubernetes**:
```bash
# Apply manifests
kubectl apply -f deployment.yaml

# Check deployment status
kubectl get deployments
kubectl get pods
kubectl get services

# Scale replicas
kubectl scale deployment ai-dominator --replicas=5

# Update image
kubectl set image deployment/ai-dominator \
  ai-dominator=ai-dominator:v2.0

# Rollback
kubectl rollout undo deployment/ai-dominator
```

---

## 🔐 Environment Configuration

### Environment Variables

**Development** (`.env.development`):
```bash
VITE_APP_ENV=development
VITE_API_URL=http://localhost:3000
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_SENTRY=false
```

**Production** (`.env.production`):
```bash
VITE_APP_ENV=production
VITE_API_URL=https://api.aidominator.com
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_SENTRY=true
VITE_SENTRY_DSN=https://...
VITE_GA_TRACKING_ID=UA-...
```

### Accessing Environment Variables

```typescript
// In code
const apiUrl = import.meta.env.VITE_API_URL;
const isProduction = import.meta.env.VITE_APP_ENV === 'production';
```

---

## 📊 Monitoring & Analytics

### Google Analytics Integration

```typescript
// src/services/analytics.ts
export const initAnalytics = () => {
  if (import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
    // Load GA script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${import.meta.env.VITE_GA_TRACKING_ID}`;
    document.head.appendChild(script);

    // Initialize GA
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    gtag('js', new Date());
    gtag('config', import.meta.env.VITE_GA_TRACKING_ID);
  }
};

export const trackEvent = (eventName: string, params?: any) => {
  if (window.gtag) {
    window.gtag('event', eventName, params);
  }
};
```

### Sentry Error Tracking

```typescript
// src/services/errorTracking.ts
import * as Sentry from "@sentry/react";

export const initSentry = () => {
  if (import.meta.env.VITE_ENABLE_SENTRY === 'true') {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.VITE_APP_ENV,
      tracesSampleRate: 1.0,
    });
  }
};
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

**.github/workflows/deploy.yml**:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build application
      run: npm run build
      env:
        VITE_API_URL: ${{ secrets.API_URL }}
        VITE_GA_TRACKING_ID: ${{ secrets.GA_TRACKING_ID }}
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

---

## 🛡️ Security Best Practices

### 1. Content Security Policy (CSP)

Add to `index.html`:
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
               style-src 'self' 'unsafe-inline';
               img-src 'self' data: https:;
               connect-src 'self' https://api.aidominator.com;">
```

### 2. HTTPS Enforcement

```nginx
# Force HTTPS
server {
    listen 80;
    server_name aidominator.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name aidominator.com;
    
    ssl_certificate /etc/ssl/certs/aidominator.crt;
    ssl_certificate_key /etc/ssl/private/aidominator.key;
    
    # ... rest of config
}
```

### 3. Rate Limiting

```nginx
# Rate limiting
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

location /api/ {
    limit_req zone=api_limit burst=20 nodelay;
    # ... proxy config
}
```

---

## 📈 Performance Optimization

### Build Optimization

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          services: ['./src/services/visionAI', './src/services/dnaEngine']
        }
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
});
```

### CDN Configuration

```html
<!-- Preconnect to CDN -->
<link rel="preconnect" href="https://cdn.aidominator.com">
<link rel="dns-prefetch" href="https://cdn.aidominator.com">

<!-- Load critical CSS inline -->
<style>
  /* Critical CSS here */
</style>
```

---

## 🔍 Health Checks

### Kubernetes Health Checks

```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 80
  initialDelaySeconds: 30
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 3

readinessProbe:
  httpGet:
    path: /ready
    port: 80
  initialDelaySeconds: 5
  periodSeconds: 5
  timeoutSeconds: 3
  failureThreshold: 3
```

---

## 📞 Support & Troubleshooting

### Common Issues

**Issue**: White screen after deployment
```bash
# Solution: Check console for errors
# Verify all environment variables are set
# Clear browser cache
```

**Issue**: 404 on routes
```bash
# Solution: Ensure SPA routing is configured
# Check nginx/server configuration
```

**Issue**: Slow initial load
```bash
# Solution: Enable Gzip compression
# Use CDN for static assets
# Implement code splitting
```

---

## ✅ Post-Deployment Checklist

- [ ] Application loads successfully
- [ ] All routes work correctly
- [ ] Forms submit without errors
- [ ] Analytics tracking verified
- [ ] Error tracking configured
- [ ] SSL certificate valid
- [ ] Performance metrics acceptable (Lighthouse > 90)
- [ ] Security headers configured
- [ ] Backup strategy implemented
- [ ] Monitoring alerts set up

---

**Deployment Guide Version**: 1.0  
**Last Updated**: 2024  
**Maintained By**: AI DOMINATOR DevOps Team 🚀
