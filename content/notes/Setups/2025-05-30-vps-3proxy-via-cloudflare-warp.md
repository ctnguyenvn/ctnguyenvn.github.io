---
title: "VPS 3Proxy via Cloudflare WARP"
description: "This guide walks you through setting up a proxy server on a VPS and redirect its traffic through Cloudflare WARP using SOCKS5 and 3proxy."
summary: "Set up a lightweight proxy on your VPS that routes all traffic securely via Cloudflare WARP with minimal configuration."
date: 2025-05-28T02:00:00+07:00
lastmod: 2025-05-28T02:00:00+07:00
draft: false
weight: 810
toc: true
seo:
  title: "3Proxy on VPS via WARP"
  description: "How to configure a VPS proxy and route traffic through Cloudflare WARP using SOCKS5 and 3proxy."
  canonical: ""
  robots: ""
---

This guide will help you configure a proxy on your VPS and route the traffic through Cloudflare WARP using 3proxy and warp-cli. This setup enhances privacy, masks the server IP, and provides secure outbound connections.

#### 1. Enable IP Forwarding and Local Routing

```sh
echo "net.ipv4.ip_forward = 1" | sudo tee -a /etc/sysctl.conf
echo "net.ipv4.conf.all.route_localnet = 1" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

These settings allow the Linux kernel to forward IP packets and route traffic to localhost for NAT redirection.

#### 2. Install and Initialize Cloudflare WARP in Proxy Mode

```sh
curl -fsSL https://pkg.cloudflareclient.com/pubkey.gpg | sudo gpg --yes --dearmor --output /usr/share/keyrings/cloudflare-warp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/cloudflare-warp-archive-keyring.gpg] https://pkg.cloudflareclient.com/ $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/cloudflare-client.list
sudo apt-get update && sudo apt-get install cloudflare-warp
```

Initialize [WARP](https://pkg.cloudflareclient.com/) in proxy mode and set the proxy port (e.g., 40000):

```sh
warp-cli registration new
warp-cli mode proxy
warp-cli proxy port 40000
warp-cli connect
```

Ensure the WARP service is running:

```sh
sudo systemctl start warp-svc.service
```

#### 3. Install and configuration 3proxy

```sh
wget https://github.com/3proxy/3proxy/releases/download/0.9.5/3proxy-0.9.5.x86_64.deb
sudo dpkg -i 3proxy-0.9.5.x86_64.deb
```

Open `/etc/3proxy/3proxy.cfg` and update config below

```conf
nscache 65536
log /var/log/3proxy/3proxy-%y%m%d.log D
logformat "L%d-%m-%Y %H:%M:%S %N %U %C:%c %R:%r %O %I %T"
rotate 60

# ===== User account ===== 
users youruser:CL:yourpassword

# ===== Proxy to WARP: port 2246 =====
auth strong
allow youruser
parent 1000 socks5 127.0.0.1 40000
socks -n -a -p1089
flush
```

Ensure the 3proxy service is running:

```sh
sudo systemctl start 3proxy.service
```

#### 4. allow firewall/ufw

Open the Proxy Port in UFW

```sh
sudo ufw allow 1089/tcp
```

#### 5. Test connect proxy SOCKS5

Use `curl` to verify that the proxy is working correctly

```sh
curl -x socks5://youruser:yourpassword@your-public-ip:1089 https://ifconfig.me
```

You should see a Cloudflare WARP IP address instead of your VPS's real IP.
