# Workflow Compiler Server

## Instructions 
To get started, just run `docker run --rm -p 3000:3000 eosrapid/adappt:1.5.0`

## Note: If you want to run on a port other than 3000 you can pass the environmental variable CORS_PORT to indicate which port to allow.
### For example, if i want to expose the port 8080 on my host machine:
```bash
docker run --rm -e CORS_PORT=8080 -p 8080:3000 eosrapid/adappt:1.5.0
```


### To build your EOS Smart Contract, click on the gold crown located at the top of the page next to your project's name!
![How to Compile Contract](/screenshots/crownshow.jpg)

### Todo
- Add debugging tab
- Add cc.fo tab


