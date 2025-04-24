FROM node:20

# Install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    python3 \
    build-essential \
    make \
    g++ \
    gcc \
    git \
    redis-server \
    && apt-get clean

# Install Ollama
# Install Ollama
RUN npm install -g ollama
RUN ollama run llama3.2:1b || true

# Clone the repository
WORKDIR /classing
RUN git clone https://github.com/career-yashaswee/classing-server-v2.git
WORKDIR /classing/classing-server-v2/

# NPM Install for classing-server-v2
RUN npm install

# Install Nodemon
RUN npm install -g nodemon
# Install dependencies
RUN npm install
# Expose port for the server
EXPOSE 3000
EXPOSE 8080

# Start Redis and Node server using bash
CMD redis-server --daemonize yes && npm run dev
