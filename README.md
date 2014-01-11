# moontower.js

<blockquote>
Party at the Moon Tower!
</blockquote>

<img src="public/moontower.jpg">


## Build

```bash
KEY=$(cat ~/.ssh/id_rsa)
vagrant up
vagrant ssh -c"
    echo ${KEY} > .ssh/id_rsa
    chmod 600 .ssh/id_rsa
    git clone git@github.com:glamp/shellington.git
    sudo docker build -t base/shellington ~/shellington
"
# redirect port 3000
sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3000
cd /moontower
sudo node app.js
```
