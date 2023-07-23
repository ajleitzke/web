---
title: "Fedora Post-Installation Tweaks"
date: 2023-04-28T13:21:17-05:00
draft: true
---

Below is a list of post-installation tasks and tweaks I perform after installing Fedora Linux.
## System Basics

### Set DNF Flags

```bash
vim /etc/dnf/dnf.conf
```

I add the following:

```bash
max_parallel_downloads=10
deltarpm=True
defaultyes=True
```

* `max_parallel_downloads=10` allows DNF to download 10 packages at a time rather than 3 (the default).
* `deltarpm=True` enables deltarpms
* `defaultyes=True` makes the yes/no prompt default to yes (similar to apt and pacman)

### Update Fedora

```bash
sudo dnf upgrade
```

Should do this before doing anything else on your system.

### Install KDE

```bash
sudo dnf install @kde
```

### Install ZSH

```bash
sudo dnf install zsh
```

### Add RPM Fusion Repositories

```bash
sudo dnf install https://mirrors.rpmfusion.org/free/fedora/rpmfusion-free-release-$(rpm -E %fedora).noarch.rpm https://mirrors.rpmfusion.org/nonfree/fedora/rpmfusion-nonfree-release-$(rpm -E %fedora).noarch.rpm
```

## Applications

### Install Firefox

```bash
sudo dnf install firefox
```

### Install Brave

```bash
sudo dnf install dnf-plugins-core
sudo dnf config-manager --add-repo https://brave-browser-rpm-release.s3.brave.com/brave-browser.repo
sudo rpm --import https://brave-browser-rpm-release.s3.brave.com/brave-core.asc
sudo dnf install brave-browser
```

Used as a backup when a site doesn't work on Firefox.
