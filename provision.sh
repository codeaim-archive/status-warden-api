# Set and persist enviroment variables

export API_DEBUG_PORT=$1 && echo "export API_DEBUG_PORT=$API_DEBUG_PORT" >> ~/.profile
export API_DEBUG_WEB_PORT=$2 && echo "export API_DEBUG_WEB_PORT=$API_DEBUG_WEB_PORT" >> ~/.profile
export API_PORT=$3 && echo "export API_PORT=$API_PORT" >> ~/.profile
export DATABASE_CONNECTION_STRING=$4 && echo "export DATABASE_CONNECTION_STRING=$DATABASE_CONNECTION_STRING" >> ~/.profile
export ENVIRONMENT=$5 && echo "export ENVIRONMENT=$ENVIRONMENT" >> ~/.profile
export ROOT_ADMIN_DISPLAY_NAME=$6 && echo "export ROOT_ADMIN_DISPLAY_NAME=$ROOT_ADMIN_DISPLAY_NAME" >> ~/.profile
export ROOT_ADMIN_EMAIL_ADDRESS=$7 && echo "export ROOT_ADMIN_EMAIL_ADDRESS=$ROOT_ADMIN_EMAIL_ADDRESS" >> ~/.profile
export ROOT_ADMIN_PASSWORD=$8 && echo "export ROOT_ADMIN_PASSWORD=$ROOT_ADMIN_PASSWORD" >> ~/.profile
export TOKEN_SECRET=$9 && echo "export TOKEN_SECRET=$TOKEN_SECRET" >> ~/.profile

# Install node.js & npm

sudo apt-get install -y curl build-essential
curl -sL https://deb.nodesource.com/setup_0.12 | sudo bash -
sudo apt-get install -y nodejs

# Copy service to box

if [ "$ENVIRONMENT" == "production" ]
then
    sudo mkdir -p /data/api /data/api/controller

    sudo cp /vagrant/package.json /data/api/package.json

    sudo cp /vagrant/config.js /data/api/config.js
    sudo cp /vagrant/logger.js /data/api/logger.js
    sudo cp /vagrant/main.js /data/api/main.js
    sudo cp /vagrant/seed.js /data/api/seed.js

    sudo cp -r /vagrant/controller/* /data/api/controller
fi

# Install required packages

sudo npm install pm2 -g
sudo npm install bunyan -g

if [ "$ENVIRONMENT" == "development" ]
then
    sudo npm install node-inspector -g
fi

if [ "$ENVIRONMENT" == "development" ]
then
    cd /vagrant
fi

if [ "$ENVIRONMENT" == "production" ]
then
    cd /data/api
fi

sudo npm install

# Start script based on environment, generate init.d script and restart service

if [ "$ENVIRONMENT" == "development" ]
then
    node-inspector --web-port=$API_DEBUG_WEB_PORT --debug-port=$API_DEBUG_PORT &
    pm2 start main.js --node-args="--debug=$API_DEBUG_PORT --trace-deprecation" --watch
fi

if [ "$ENVIRONMENT" == "production" ]
then
    pm2 start main.js
fi

sudo env PATH=$PATH:/usr/bin pm2 startup ubuntu -u vagrant
sudo pm2 save
