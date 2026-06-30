#!/usr/bin/env python3

"""
==========================================================

Techno Electric & Engineering Company Pvt. Ltd.

QR Code Generator

Reads certificates.json
and generates QR codes
for every certificate.

Author: TEEC

==========================================================
"""

import json
from pathlib import Path

import qrcode

# ==========================================================
# CONFIGURATION
# ==========================================================

BASE_URL = "https://teec.com.np/verify/"

JSON_FILE = Path("certificates.json")

QR_FOLDER = Path("qr")

# ==========================================================

QR_FOLDER.mkdir(exist_ok=True)

# ==========================================================

with open(JSON_FILE, "r", encoding="utf-8") as f:

    certificates = json.load(f)

# ==========================================================

print()

print("=" * 70)
print("Generating QR Codes")
print("=" * 70)

count = 0

for cert_no, cert in certificates.items():

    token = cert["token"]

    url = f"{BASE_URL}?id={cert_no}&token={token}"

    qr = qrcode.QRCode(

        version=4,

        error_correction=qrcode.constants.ERROR_CORRECT_H,

        box_size=10,

        border=4

    )

    qr.add_data(url)

    qr.make(fit=True)

    image = qr.make_image(

        fill_color="black",

        back_color="white"

    )

    output = QR_FOLDER / f"{cert_no}.png"

    image.save(output)

    count += 1

    print(f"✓ {cert_no}")

print()

print(f"{count} QR code(s) generated.")

print()

print("Saved to:")

print(QR_FOLDER.resolve())

print()

print("=" * 70)