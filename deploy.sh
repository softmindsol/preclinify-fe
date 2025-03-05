#!/bin/bash

# Password file ka path
PASSWORD_FILE=~/.sudo_pass

# Check agar password file exist karti hai aur password ko ek baar read karein
if [ -f "$PASSWORD_FILE" ]; then
  sudo_pass=$(<"$PASSWORD_FILE")
else
  echo "Password file $PASSWORD_FILE doesn't exist." >&2
  exit 1
fi

# Check if the PM2 process exists
if pm2 list | grep -q 'preclinify-fe'; then
    echo "Restarting existing PM2 process..."
    pm2 restart preclinify-fe-staging || { echo "Failed to restart PM2 process."; exit 1; }
else
    echo "Creating new PM2 process..."
    pm2 start npm --name "preclinify-fe-staging" -- run start:staging || { echo "Failed to create PM2 process."; exit 1; }
fi

# Restart Nginx to apply changes
# Read the password from the file and restart Nginx
echo "Restarting Nginx service..."
sudo_pass=$(<~/.sudo_pass)
echo $sudo_pass | sudo -S systemctl restart nginx || { echo "Failed to restart Nginx"; exit 1; }

# Deployment completed message
echo "Deployment completed successfully."
