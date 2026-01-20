---
title: "Create an Internal Reverse Proxy Using Nginx Proxy Manager, Pi-hole, and Docker"
date: 2025-01-21T11:30:27-05:00
draft: false
---

## Requirements
* A domain
* A device to host our docker containers (ex: Raspberry Pi)
* A static IP set to the docker host

## Step 1: Install Docker
Using your distribution's package manager, install the `docker` and `docker-compose` packages.

To avoid having to use `sudo` each time you run a docker command, follow Docker's post-install instructions [here](https://docs.docker.com/engine/install/linux-postinstall/#manage-docker-as-a-non-root-user). 

## Step 2: Set-up the Structure
For this example, we'll be creating Nginx Proxy Manager and Pi-hole with Unbound containers. Create the docker folder, this will hold all our containers.
```sh
mkdir docker && cd docker
```
Now create a folder for each container. 
```sh
mkdir nginx-proxy-manager && mkdir pihole-unbound
``` 
Next we'll create the `nginx` network. This will allow all of our containers to communicate with each other, and will allow nginx to resolve their container names. 
```sh
docker network create nginx
```
Finally, we'll create our docker compose files for each of our containers. Use the text editor of your choice to create a docker-compose.yml file in each directory, and copy the docker compose files I've created here:
* Nginx Proxy Manager: [GitHub Gist](https://gist.github.com/ajleitzke/4364cadfb17516fe2351b531ccf81e15)
* Pihole & Unbound: [GitHub Gist](https://gist.github.com/ajleitzke/ebef87501130a7a21f5c0fce4b5e8a46)

For the Pi-hole web interface, we'll also need to create a `.env` file in the `pihole-unbound` directory, which will contain our password to the Pi-hole web interface.
```sh
cd pihole-unbound
```
Example `.env` file below:
```env
PIHOLE_PASSWORD=yourpasswordhere
```

## Step 3: First Run
To start our containers, we'll need to run `docker compose up -d` in each directory. 

## Step 4: Create Custom DNS Record in Pi-hole
Navigate to the Pi-hole web interface, which should be located at `http://YOURIP:8081`. Log in using the Pi-hole web password saved in the `.env` file. 

Select "Settings" from the menu, then "Local DNS Records". Enter the domain you'd like to use when accessing the Pi-hole web interface (ex: pihole.domain.tld). Enter the Docker host's IP in the Associated IP field. Click the + icon to add this record. 
![Pi-hole Local DNS Records](localdns.png)
These steps can be repeated as needed to add local DNS records for any additional services. 

## Step 5: Generating SSL Certificates
Navigate to the Nginx Proxy Manager interface, which will be available at `http://YOURIP:81`. Replace `YOURIP` with the static IP you set. 
![Nginx Proxy Manager Dashboard](npm.png)
Follow the steps to create an account, then once on the Nginx Proxy Manager dashboard, navigate to the Certificates tab. 
![Certificates Tab](certificates.png)
Click the Add Certificate button and select Let's Encrypt via DNS.

***Note**: By using Let's Encrypt via DNS, rather than Let's Encrypt via HTTP, our SSL certificates will be updated without having to expose ports on our router.*

Enter the domain you would like to generate a certificate for. I suggest generating a wildcard certificate (ex: `*.domain.tld`), as this will simplify adding proxy hosts. 

Select your DNS provider (this example uses Cloudflare). Create a Cloudflare API key using their instructions [here](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/). Once the API key is created, copy it, it will not be displayed later. Copy this API key into the `dns_cloudflare_api_token` field, replacing the dummy text. 
![Add Certificate Modal](cert-config.png)
## Step 6: Creating our First Proxy Host

Navigate to the Hosts menu, and select Proxy Hosts. Select Add Proxy Host. We'll use the below entries to generate a proxy for the Pi-hole web interface:
* Enter the domain you'd like to use when accessing the Pi-hole web interface. This should match the Local DNS Record created in Step 4.
* Set scheme to `https`.
* In forward hostname / IP, we'll enter the Pi-hole container's hostname, which is `pihole`.
* Enter 443 for the Forward Port.
* Since we're not exposing this to the internet, we can leave access list as "Publicly Accessible"
* Under Options, select:
    * Block common exploits
    * Websockets support

![Details Tab](details.png)
* Select the SSL tab, and under SSL certificate, select the certificate generated in Step 5.
* Select "Force SSL", "HSTS Enabled", "HTTP/2 Support" and "HSTS Sub-domains".
* ***Optional**: to redirect directly to the /admin panel in Pi-hole, select the gear icon and add the below text:* 
        
    ```conf
    location = / {
        return 301 /admin;
    }
    ```

* Finally, select save.

Now the Proxy Hosts dashboard will show the entry we just created, and we can click the domain to confirm it works. 

***Note**: You may initially receive a 502 Bad Gateway error, if so, this should resolve itself in less than 5 minutes. If it continues, check the logs folder in the nginx-proxy-manager directory for more information.*

## Wrap Up

That's it! You now have an internal reverse proxy, with a Pi-hole and unbound container as your first service. Steps 4 through 6 can be repeated for any new services you would like to add. Just ensure the `docker-compose.yml` file you use is connected to the nginx docker network, by adding the below configuration to the bottom of the file:
```yml
networks:
  default:
    external: true
    name: nginx
```