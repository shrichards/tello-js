# Flying a Tello with JavaScript


[Google Slides presentation](https://docs.google.com/presentation/d/1b7frPTndVuLZrihE7BgxvAQxoaWlKInJdkACsIe7XuE/edit?usp=sharing)

## Demo 1
(Tello not used)

In first terminal window:
```shell
$ node ./demo-1/server.js
...
(output)
...
> <RETURN> # quits
```
In second terminal window:
```shell
$ node ./demo-1/client.js
...
(output)
...
> <RETURN> # quits
``` 

## Demo 2
Power on Tello
```shell
$ node ./demo-2/status.js
> <RETURN> # quits
```

## Demo 3
Power on Tello 
```shell
$ node ./demo-3/query.js
> t # queries time
0.01
> s # queries speed
10
> b # queries battery
67
> q # quits
```


## Demo 4
Power on Tello
```shell
$ node ./demo-4/fly.js
...
(output)
...
> <RETURN> # quits
```