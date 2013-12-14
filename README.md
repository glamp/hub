# moontower.js


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
```
