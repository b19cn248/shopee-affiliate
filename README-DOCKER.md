# Docker Setup for Shopee Affiliate Frontend

## 🚀 Quick Start

### Development Mode (với Hot Reload)

```bash
# Di chuyển đến thư mục frontend
cd /mnt/c/Users/Windows/workspace/shopee-affiliate/shopee-affiliate-fe

# Start frontend với hot reload
docker-compose up shopee-affiliate-fe-dev

# Hoặc start ở background
docker-compose up -d shopee-affiliate-fe-dev

# Xem logs
docker-compose logs -f shopee-affiliate-fe-dev
```

**Access:** http://localhost:3007

### Production Mode

```bash
# Build và start production
docker-compose --profile production up shopee-affiliate-fe-prod -d

# Hoặc sử dụng docker run trực tiếp
docker build -t shopee-affiliate-fe:prod .
docker run -d -p 3007:3007 --name shopee-affiliate-fe shopee-affiliate-fe:prod
```

## 🏗️ Build Options

### Option 1: Chỉ Frontend
```bash
cd shopee-affiliate-fe
docker-compose up -d
```

### Option 2: Full Stack (DB + BE + FE)
```bash
cd /mnt/c/Users/Windows/workspace/shopee-affiliate
docker-compose -f docker-compose.full.yml up -d
```

## 📦 Configurations

### Development Mode
- **Port:** 3007 (host) → 3000 (container)
- **Hot Reload:** Enabled
- **Source:** Mounted as volumes
- **Dockerfile:** `Dockerfile.dev`

### Production Mode
- **Port:** 3007 (host) → 3007 (container)
- **Server:** Nginx
- **Build:** Optimized production build
- **Dockerfile:** `Dockerfile`

## 🛠️ Common Commands

### Container Management
```bash
# Start container
docker-compose up -d shopee-affiliate-fe-dev

# Stop container
docker-compose stop shopee-affiliate-fe-dev

# Restart container
docker-compose restart shopee-affiliate-fe-dev

# Remove container
docker-compose down
```

### Debugging
```bash
# View logs
docker-compose logs -f shopee-affiliate-fe-dev

# Access container shell
docker exec -it shopee-affiliate-fe-dev sh

# Check running processes
docker-compose ps

# View resource usage
docker stats shopee-affiliate-fe-dev
```

### Build Management
```bash
# Rebuild image
docker-compose build shopee-affiliate-fe-dev

# Rebuild without cache
docker-compose build --no-cache shopee-affiliate-fe-dev

# Remove unused images
docker image prune -a
```

## 🔧 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| REACT_APP_API_URL | http://localhost:8080/api | Backend API URL |
| PORT | 3000 | Development server port |
| CHOKIDAR_USEPOLLING | true | Enable file watching in Docker |
| WDS_SOCKET_PORT | 3007 | WebSocket port for hot reload |

## 📝 Custom Configuration

### Thay đổi port
Trong `docker-compose.yml`:
```yaml
ports:
  - "3008:3000"  # Đổi 3007 thành 3008
```

### Thay đổi API URL
```yaml
environment:
  REACT_APP_API_URL: http://your-api-server.com/api
```

### Mount thêm files
```yaml
volumes:
  - ./src:/app/src
  - ./public:/app/public
  - ./.env:/app/.env  # Thêm env file
```

## 🐛 Troubleshooting

### Hot reload không hoạt động
```bash
# Kiểm tra CHOKIDAR_USEPOLLING
docker exec shopee-affiliate-fe-dev env | grep CHOKIDAR

# Restart container
docker-compose restart shopee-affiliate-fe-dev
```

### Port đã được sử dụng
```bash
# Kiểm tra port 3007
netstat -an | grep 3007
lsof -i :3007

# Kill process đang dùng port
kill -9 $(lsof -t -i:3007)
```

### Build lỗi
```bash
# Clear cache và rebuild
docker-compose down
docker system prune -a
docker-compose build --no-cache
docker-compose up
```

### Node modules issues
```bash
# Remove node_modules và reinstall
docker exec shopee-affiliate-fe-dev rm -rf node_modules
docker exec shopee-affiliate-fe-dev npm install
docker-compose restart shopee-affiliate-fe-dev
```

## 🚢 Production Deployment

### Build production image
```bash
# Build image
docker build -t shopee-affiliate-fe:latest .

# Tag for registry
docker tag shopee-affiliate-fe:latest your-registry/shopee-affiliate-fe:latest

# Push to registry
docker push your-registry/shopee-affiliate-fe:latest
```

### Deploy với Docker Swarm
```bash
docker service create \
  --name shopee-affiliate-fe \
  --publish 3007:3007 \
  --replicas 3 \
  your-registry/shopee-affiliate-fe:latest
```

### Deploy với Kubernetes
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: shopee-affiliate-fe
spec:
  replicas: 3
  selector:
    matchLabels:
      app: shopee-affiliate-fe
  template:
    metadata:
      labels:
        app: shopee-affiliate-fe
    spec:
      containers:
      - name: frontend
        image: your-registry/shopee-affiliate-fe:latest
        ports:
        - containerPort: 3007
```

## 📊 Monitoring

### Health check
```bash
# Check if container is running
docker ps | grep shopee-affiliate-fe

# Check nginx status (production)
docker exec shopee-affiliate-fe-prod nginx -t

# Check node process (development)
docker exec shopee-affiliate-fe-dev ps aux | grep node
```

### Performance monitoring
```bash
# CPU and Memory usage
docker stats shopee-affiliate-fe-dev

# Network statistics
docker exec shopee-affiliate-fe-dev netstat -tulpn

# Disk usage
docker exec shopee-affiliate-fe-dev df -h
```