Vagrant.configure(2) do |config|

  config.vm.box = "ubuntu/trusty32"
  
  config.vm.network :private_network, ip: "10.10.10.61"
  
  config.vm.network "forwarded_port", guest: 4000, host: 4000

  config.vm.network "forwarded_port", guest: 3001, host: 3001

  config.vm.network "forwarded_port", guest: 5858, host: 5858

  config.vm.provision :shell, :path => "provision.sh"
  config.vm.provision :shell, :path => "install-node.sh", privileged: false
end