---
title: "Repair a Disk on macOS using FSCK"
date: 2023-09-21T11:30:27-05:00
draft: true
---

After attempting to resize my macOS partitions, I received an error stating there was corruption on my disk, and the resize wasn't possible. I attemped to use the "First Aid" feature of the Disk Utility app, where I received another similar error, and a reccomendation to use fsck to repair the disk.

## Boot into Recovery or Single-User Mode

### M-series Processor

In order to use fsck, you must be in recovery mode. To enter recovery mode:

- Shutdown your Mac
- Hold down the power button until the screen displays "Loading startup options..."
- From the recovery menu, select "Options"
