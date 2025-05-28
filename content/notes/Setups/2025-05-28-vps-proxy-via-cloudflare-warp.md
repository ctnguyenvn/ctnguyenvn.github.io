---
title: "VPS Proxy via Cloudflare WARP"
description: "This guide walks you through setting up a proxy server on a VPS and routing its traffic through Cloudflare WARP using SOCKS5 and iptables."
summary: "Set up a lightweight proxy on your VPS that routes all traffic securely via Cloudflare WARP with minimal configuration."
date: 2025-05-28T02:00:00+07:00
lastmod: 2025-05-28T02:00:00+07:00
draft: false
weight: 810
toc: true
seo:
  title: "Proxy on VPS via WARP"
  description: "How to configure a VPS proxy and route traffic through Cloudflare WARP using SOCKS5 and iptables."
  canonical: ""
  robots: ""
---

This guide will help you configure a proxy on your VPS and route the traffic through Cloudflare WARP using iptables and warp-cli. This setup enhances privacy, masks the server IP, and provides secure outbound connections.


#### 1. Enable IP Forwarding and Local Routing

```sh
echo "net.ipv4.ip_forward = 1" | sudo tee -a /etc/sysctl.conf
echo "net.ipv4.conf.all.route_localnet = 1" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

These settings allow the Linux kernel to forward IP packets and route traffic to localhost for NAT redirection.

#### 2. Install and Initialize Cloudflare WARP in Proxy Mode

```sh
sudo apt install cloudflare-warp
```

Initialize WARP in proxy mode and set the proxy port (e.g., 40000):

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

#### 3. Configure iptables for Port Redirection

Redirect traffic coming to your VPS on port 1089 to the WARP proxy running locally:

```sh
sudo iptables -t nat -A PREROUTING \
  -i eth0 \                   # Input interface eth0
  -p tcp \                    # TCP protocol
  --dport 1089 \              # Destination port 1089
  -j DNAT \                   # Jump to DNAT target
  --to-destination 127.0.0.1:40000  # Redirect to localhost:5556 by warp-svc listening
```

Make the rule persistent:

```sh
sudo apt update
sudo apt install iptables-persistent
sudo netfilter-persistent save
```

#### 4. allow firewall/ufw

Open the Proxy Port in UFW

```sh
sudo ufw allow 1089/tcp
```

#### 5. Test connect proxy SOCKS5

Use `curl` to verify that the proxy is working correctly

```sh
curl -x socks5://your-public-ip:1089 https://ifconfig.me
```

You should see a Cloudflare WARP IP address instead of your VPS's real IP.


