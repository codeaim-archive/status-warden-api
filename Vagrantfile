Vagrant.configure(2) do |config|
	config.vm.box = "hashicorp/precise64"
  	config.vm.provision "shell", path: "provision.sh", privileged: false, args: [ENV.fetch('API_DEBUG_PORT', 28102), ENV.fetch('API_DEBUG_WEB_PORT', 28202), ENV.fetch('API_PORT', 28002), ENV.fetch('DATABASE_CONNECTION_STRING', '10.0.2.2:28001/status-warden'), ENV.fetch('ENVIRONMENT', 'development'), ENV.fetch('ROOT_ADMIN_DISPLAY_NAME', 'admin'), ENV.fetch('ROOT_ADMIN_EMAIL_ADDRESS', 'admin@codeaim.com'), ENV.fetch('ROOT_ADMIN_PASSWORD', 'P@ssword'), ENV.fetch('TOKEN_SECRET', 'tokenSecret')]
  	config.vm.network "forwarded_port", guest: ENV.fetch('API_PORT', 28002), host: ENV.fetch('API_PORT', 28002)
    config.vm.network "forwarded_port", guest: ENV.fetch('API_DEBUG_PORT', 28102), host: ENV.fetch('API_DEBUG_PORT', 28102)
    config.vm.network "forwarded_port", guest: ENV.fetch('API_DEBUG_WEB_PORT', 28202), host: ENV.fetch('API_DEBUG_WEB_PORT', 28202)
end
