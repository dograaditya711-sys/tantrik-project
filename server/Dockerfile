FROM node:18-alpine

WORKDIR /app

# Package files copy karein
COPY package*.json ./

# Dependencies install karein
RUN npm install --production

# Baaki code copy karein
COPY . .

# Port expose karein
EXPOSE 5000

# Server start karein
CMD ["node", "index.js"]