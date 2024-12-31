#!/bin/bash
set -e

apt-get update && \
    apt-get install -y \
    curl \
    libjansson4 \
    libcurl4-openssl-dev \
    libapache2-mod-auth-openidc \
    libssl-dev \
    apache2-dev \
    make \
    gcc \
    git \

apt-get update
apt-get install -y pkg-config make gcc gdb lcov valgrind vim curl iputils-ping wget
apt-get install -y autoconf automake libtool
apt-get install -y libssl-dev libjansson-dev libcurl4-openssl-dev check
apt-get install -y libpcre3-dev zlib1g-dev libcjose0 libcjose-dev
apt-get install -y libapache2-mod-security2
    
# Manually enable necessary Apache modules
echo "LoadModule ssl_module /usr/local/apache2/modules/mod_ssl.so" >> /usr/local/apache2/conf/httpd.conf

# Include the OIDC configuration in the main Apache configuration
echo 'PassEnv OIDC_PROVIDER_URL' >> /usr/local/apache2/conf/httpd.conf
echo 'PassEnv OIDC_CLIENT_ID' >> /usr/local/apache2/conf/httpd.conf
echo 'PassEnv OIDC_CLIENT_SECRET' >> /usr/local/apache2/conf/httpd.conf
echo 'PassEnv OIDC_CRYPTO_PASSPHRASE' >> /usr/local/apache2/conf/httpd.conf
echo 'Include conf/extra/oidc.conf' >> /usr/local/apache2/conf/httpd.conf

# Enable necessary Apache modules
# set cert file
CERTFILE="/usr/local/apache2/conf/server.crt"
# set privkey file
PRIVKEY="/usr/local/apache2/conf/server.key"
openssl req -days 365 -nodes -x509 -newkey rsa:4096 -keyout ${PRIVKEY} -out ${CERTFILE} -sha256 -days 365 -subj '/CN=localhost'

# Start Apache in the foreground
apachectl -D FOREGROUND
