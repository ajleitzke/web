---
title: "Fedora Post-Installation Tweaks"
date: 2023-04-28T13:21:17-05:00
draft: false
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

### Install and Set ZSH as Login Shell

```bash
sudo dnf install zsh
chsh -s $(which zsh)
```

### Add RPM Fusion Repositories

```bash
sudo dnf install https://mirrors.rpmfusion.org/free/fedora/rpmfusion-free-release-$(rpm -E %fedora).noarch.rpm https://mirrors.rpmfusion.org/nonfree/fedora/rpmfusion-nonfree-release-$(rpm -E %fedora).noarch.rpm
```

### Add Flathub Repository (should be already enabled on Fedora 38+)

```bash
flatpak remote-add --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo
```

## Applications

### Install Firefox

```bash
sudo dnf install firefox
```

#### Install ffmpeg

```bash
sudo dnf install ffmpeg
```

If the above command doesn't work, you'll need to swap Fedora's ffmpeg-free for RPMFusion's ffmpeg:

```bash
sudo dnf swap ffmpeg-free ffmpeg --allowerasing
```

Be cautious with `--allowerasing`. Read the dnf prompt carefully to ensure you aren't removing any needed packages.

### Install Brave

```bash
sudo dnf install dnf-plugins-core
sudo dnf config-manager --add-repo https://brave-browser-rpm-release.s3.brave.com/brave-browser.repo
sudo rpm --import https://brave-browser-rpm-release.s3.brave.com/brave-core.asc
sudo dnf install brave-browser
```

Used as a backup when a site doesn't work on Firefox.
