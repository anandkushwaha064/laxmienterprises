#!/bin/bash


function check_ssl_certificate() {

	echo -e "\e[37mChecking SSL certificate...\e[0m"

	# set cert file
	CERTFILE="/etc/ssl/certs/apache-self-signed.crt"
	# set privkey file
	PRIVKEY="/etc/ssl/certs/apache-self-signed.key"

	# check if all three files exist
	test ! -f ${CERTFILE} && CREATE_NEW=TRUE
	test ! -f ${PRIVKEY} && CREATE_NEW=TRUE
	
	# check if we need to create a new SSL certificate
	if [[ "${CREATE_NEW:-FALSE}" == "FALSE" ]]; then
		echo "SSL certificate exists ... checking expiration date"

		# check the expiration date for the cert file
		EXPIRATION_DATE_CERT=`date --date="$(openssl x509 -enddate -noout -in $CERTFILE |cut -d= -f 2)" +"%s"`
		# get current date
		CURRENT_DATE=`date +"%s"`
		# date difference between two dates
		DIFFERENCE_BETWEEN=$(($EXPIRATION_DATE_CERT-$CURRENT_DATE))

		echo "SSL certificate expires on:" $(date -d @${EXPIRATION_DATE_CERT} +"%Y-%m-%d")

		# number of days difference before considering it exipired
		DAYS_DIFFERENCE="10"
		# days difference in seconds
		DAYS_DIFFERENCE_SECONDS=$(($DAYS_DIFFERENCE*24*60*60))
		# check if certificate is valid
		if [[ $DIFFERENCE_BETWEEN -gt $DAYS_DIFFERENCE_SECONDS ]]; then
			echo "SSL Certificate is valid ... meaning it's not expiring in ${DAYS_DIFFERENCE} days."
			# do nothing certificate is valid
			return
		fi
	fi

	echo "Generating a new certificate..."
	# generate a new certificate
	openssl req -days 365 -nodes -x509 -newkey rsa:4096 -keyout ${PRIVKEY} -out ${CERTFILE} -sha256 -days 365 -subj '/CN=localhost'

	echo -e "\e[32mOK\e[0m"
}


function build_project(){
	# replace baseHref inside index.html before serving
	sed -i 's#<base href="/debug/" />#<base href="/" />#' /code/front/src/index.html
	# get uid and gid of user that owns content outside
	UIDGID=$(stat -c "%u:%g" /code)
	echo -e "\e[37mCompiling...\e[0m"
	npx ng build -c production >> output.log 2>&1
	# If building the App went wrong throw error on purpose
	if [ $? -ne 0 ]; then
		echo -e "\e[1;31mSomething went wrong while compiling the App, check output.log for more details...\e[0m"
		exit 1
	fi
	echo -e "\e[32mDone\e[0m"
	cat output.log

	echo -e "\e[37mCopying files to public folder...\e[0m"
	cp -a /code/front/dist/. /usr/local/apache2/htdocs/ >> output.log 2>&1

	# FIX me does not work in localhost
	echo "Fixing user permissions, setting uid and gid to: ${UIDGID}"
	chown -R ${UIDGID} /code/front
}

function serve_project() {
	# replace baseHref inside index.html before serving
	sed -i 's#<base href="/" />#<base href="/debug/" />#' /code/front/src/index.html
	# serve the project
	npx ng serve


install_openidc

# #########
# FIX SSL Certificate
# #########
check_ssl_certificate

# install_essentials
# install_angular
# serve_project

echo -e "\e[32mSuccessful\e[0m"

if [[ "${NORESTART:-FALSE}" == "FALSE" ]]; then
	# #########################################
	# Restart apache server
	# #########################################
	httpd -k restart

	find /proc -mindepth 2 -maxdepth 2 -name exe -exec ls -lh {} \; 2>/dev/null  | grep -q "/usr/bin/tail" || tail -f /usr/local/apache2/logs/error_log /usr/local/apache2/logs/access.log
fi
