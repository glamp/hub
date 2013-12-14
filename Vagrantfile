# -*- mode: ruby -*-
# vi: set ft=ruby :

BOX_NAME = ENV['BOX_NAME'] || "moontowerbox"
BOX_URI = ENV['BOX_URI'] || "https://bitbucket.org/Wballard/boxes/downloads/VagrantUbuntuLXC.box"
VF_BOX_URI = ENV['VF_BOX_URI'] || "https://bitbucket.org/Wballard/boxes/downloads/VagrantUbuntuLXC-vmware_fusion.box"

Vagrant::Config.run do |config|
# Setup virtual machine box. This VM configuration code is always executed.
  config.vm.customize ["modifyvm", :id, "--memory", 4096]
  config.vm.box = BOX_NAME
  config.vm.box_url = BOX_URI
end

Vagrant::VERSION >= "1.1.0" and Vagrant.configure("2") do |config|
  config.vm.hostname = "moontower-js"

  config.vm.provider :vmware_fusion do |f, override|
    override.vm.box_url = VF_BOX_URI
    override.vm.synced_folder ".", "/moontower"
    override.vm.synced_folder "../shellington", "/shellington"
    override.vm.synced_folder "~", "/hosthome"
    f.vmx["displayName"] = "moontower-js"
  end

  config.vm.provider :virtualbox do |f, override|
    override.vm.box_url = BOX_URI
    override.vm.synced_folder ".", "/moontower"
    override.vm.synced_folder "~", "/hosthome"
    f.vmx["displayName"] = "moontower-js"
  end

  config.vm.network "forwarded_port", guest: 80, host: 9090,
      auto_correct: true
end
