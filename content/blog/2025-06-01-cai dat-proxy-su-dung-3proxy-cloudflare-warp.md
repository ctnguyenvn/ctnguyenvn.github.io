---
title: "Triển Khai SOCKS5 Proxy sử dụng 3Proxy và Cloudflare WARP"
description: "Hướng dẫn này sẽ giúp bạn thiết lập máy chủ proxy trên VPS và chuyển hướng lưu lượng của nó qua Cloudflare WARP bằng SOCKS5 và 3proxy."
summary: "Thiết lập một proxy nhẹ trên VPS của bạn để chuyển toàn bộ lưu lượng một cách an toàn qua Cloudflare WARP với cấu hình tối giản."
date: 2025-06-01T00:27:22+07:00
lastmod: 2025-06-01T00:27:22+07:00
draft: false
weight: 50
categories: ["setup"]
tags: ["proxy"]
contributors: []
pinned: false
homepage: false
seo:
  title: "3Proxy on VPS via WARP"
  description: "Cách cấu hình proxy trên VPS và định tuyến lưu lượng qua Cloudflare WARP bằng SOCKS5 và 3proxy."
  canonical: ""
  robots: ""
---

Hướng dẫn này sẽ giúp bạn cấu hình một proxy trên VPS và định tuyến lưu lượng thông qua Cloudflare WARP bằng cách sử dụng 3proxy và warp-svc. Cách thiết lập này giúp tăng cường quyền riêng tư, ẩn IP của máy chủ và cung cấp kết nối ra ngoài một cách an toàn.

#### 1. Bật chuyển tiếp IP và định tuyến cục bộ

```sh
echo "net.ipv4.ip_forward = 1" | sudo tee -a /etc/sysctl.conf
echo "net.ipv4.conf.all.route_localnet = 1" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

Các thiết lập này cho phép kernel của Linux chuyển tiếp gói IP và định tuyến lưu lượng tới địa chỉ localhost để phục vụ cho việc chuyển hướng NAT.

#### 2. Cài đặt và khởi tạo Cloudflare WARP ở chế độ proxy

```sh
curl -fsSL https://pkg.cloudflareclient.com/pubkey.gpg | sudo gpg --yes --dearmor --output /usr/share/keyrings/cloudflare-warp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/cloudflare-warp-archive-keyring.gpg] https://pkg.cloudflareclient.com/ $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/cloudflare-client.list
sudo apt-get update && sudo apt-get install cloudflare-warp
```

Khởi tạo [WARP](https://pkg.cloudflareclient.com/) ở chế độ proxy và đặt cổng proxy (ví dụ: 40000):

```sh
warp-cli registration new
warp-cli mode proxy
warp-cli proxy port 40000
warp-cli connect
```

Đảm bảo dịch vụ WARP đang chạy:

```sh
sudo systemctl start warp-svc.service
```

#### 3. Cài đặt và cấu hình 3proxy

Tải và cài đặt 3proxy

```sh
wget https://github.com/3proxy/3proxy/releases/download/0.9.5/3proxy-0.9.5.x86_64.deb
sudo dpkg -i 3proxy-0.9.5.x86_64.deb
```

Mở file cấu hình `/etc/3proxy/3proxy.cfg` và chỉnh sửa như sau:

```txt
nscache 65536
log /var/log/3proxy/3proxy-%y%m%d.log D
logformat "L%d-%m-%Y %H:%M:%S %N %U %C:%c %R:%r %O %I %T"
rotate 60

# ===== User account ===== 
users youruser:CL:yourpassword

# ===== Proxy to WARP: port 1089 =====
auth strong
allow youruser
parent 1000 socks5 127.0.0.1 40000
socks -n -a -p1089
flush
```

Khởi động dịch vụ 3proxy:

```sh
sudo systemctl start 3proxy.service
```

#### 4. Mở cổng trong tường lửa (ufw)

Mở cổng proxy trên UFW:

```sh
sudo ufw allow 1089/tcp
```

#### 5. Kiểm tra kết nối proxy SOCKS5

Sử dụng `curl` để kiểm tra proxy hoạt động chính xác:

```sh
curl -x socks5://youruser:yourpassword@your-public-ip:1089 https://ifconfig.me
```

Kết quả bạn nhận được là một địa chỉ IP của Cloudflare WARP thay vì IP thật của VPS (có hỗ trợ xác thực đối với socks5 proxy).
