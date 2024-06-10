FROM ubuntu:22.04

# Install necessary dependencies
RUN apt-get update && apt-get clean && \
    apt-get install -y curl jq git build-essential

# Install Rust (recommended installation)
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y

# Add Rust to PATH
ENV PATH="/root/.cargo/bin:$PATH"

# Install Foundry
RUN curl -L https://foundry.paradigm.xyz | bash

# Add Foundry to PATH
ENV PATH="/root/.foundry/bin:$PATH"

# Run foundryup to install all the underlying packages of Foundry
RUN foundryup

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

# Install Python and pip
RUN apt-get update && apt-get install -y python3 python3-pip

# Install Halmos
RUN pip install halmos

# Create a directory for the action code
RUN mkdir -p /usr/src/app

# Set the working directory inside the container.
WORKDIR /usr/src/app

# Copy the rest of the repository contents
COPY . .

# Run the specified command within the container
ENTRYPOINT ["node", "/usr/src/app/dist/index.js"]
