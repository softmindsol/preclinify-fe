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

# Check if the build directory exists
if [ -d "dist" ]; then
  echo "Build directory exists."
else
  echo "Build directory does not exist." >&2
  exit 1
fi

# Remove the existing build directory if it exists
if [ -d "/var/www/html/preclinify-fe-build" ]; then
  echo "Removing old build directory..."
  echo $sudo_pass | sudo -S rm -rf /var/www/html/preclinify-fe-build
  echo "Old build directory removed."
else
  echo "No existing build directory to remove."
fi

# Copy the new build directory to the deployment location
echo "Copying new build directory..."
echo $sudo_pass | sudo -S cp -r dist /var/www/html/preclinify-fe-build
echo "New build directory copied to /var/www/html/preclinify-fe-build."

# Check if the PM2 process exists
if pm2 list | grep -q 'preclinify-fe'; then
    echo "Restarting existing PM2 process..."
    pm2 restart preclinify-fe || { echo "Failed to restart PM2 process."; exit 1; }
else
    echo "Creating new PM2 process..."
    pm2 start npm --name "preclinify-fe" -- run start || { echo "Failed to create PM2 process."; exit 1; }
fi

# Restart Nginx to apply changes
# Read the password from the file and restart Nginx
echo "Restarting Nginx service..."
sudo_pass=$(<~/.sudo_pass)
echo $sudo_pass | sudo -S systemctl restart nginx || { echo "Failed to restart Nginx"; exit 1; }

# Deployment completed message
echo "Deployment completed successfully."
