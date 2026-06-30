#!/usr/bin/env python3
"""
============================================================

Techno Electric & Engineering Company Pvt. Ltd.
Certificate Token Generator

Creates:
    • Secure verification token
    • SHA-256 fingerprint of certificate PDF
    • Ready-to-paste JSON record
    • Verification URL

============================================================
"""

import hashlib
import json
import secrets
from pathlib import Path


# ==========================================================
# CONFIGURATION
# ==========================================================

BASE_URL = "https://teec.com.np/verify/"


# ==========================================================
# SHA256
# ==========================================================

def sha256(filename: Path):

    h = hashlib.sha256()

    with open(filename, "rb") as f:

        while True:

            chunk = f.read(65536)

            if not chunk:
                break

            h.update(chunk)

    return h.hexdigest().upper()


# ==========================================================
# USER INPUT
# ==========================================================

print("\n")

print("=" * 60)

print(" TEEC WARRANTY CERTIFICATE TOKEN GENERATOR ")

print("=" * 60)

print()

certificate_no = input("Certificate Number : ").strip()

document_type = input("Document Type [Warranty Certificate] : ").strip()

if document_type == "":
    document_type = "Warranty Certificate"

issued_to = input("Issued To : ").strip()

client_code = input("Client Code : ").strip()

bid_notice = input("Bid Notice : ").strip()

procurement = input("Procurement : ").strip()

contract = input("Contract Agreement : ").strip()

issue_date = input("Issue Date (YYYY-MM-DD) : ").strip()

delivery_date = input("Delivery Date (YYYY-MM-DD) : ").strip()

warranty_months = int(input("Warranty Months : "))

pdf_path = Path(input("PDF Path : ").strip())


# ==========================================================
# TOKEN
# ==========================================================

token = secrets.token_hex(16).upper()


# ==========================================================
# HASH
# ==========================================================

pdf_hash = sha256(pdf_path)


# ==========================================================
# PDF RELATIVE PATH
# ==========================================================

pdf_relative = "pdf/" + pdf_path.name


# ==========================================================
# JSON RECORD
# ==========================================================

record = {

    certificate_no:{

        "token":token,

        "status":"Active",

        "document_type":document_type,

        "certificate_no":certificate_no,

        "issued_to":issued_to,

        "client_code":client_code,

        "bid_notice":bid_notice,

        "procurement":procurement,

        "contract_agreement":contract,

        "issue_date":issue_date,

        "delivery_date":delivery_date,

        "warranty_months":warranty_months,

        "pdf":pdf_relative,

        "pdf_sha256":pdf_hash,

        "equipment":[],

        "history":[],

        "verification":{

            "qr_verified":True,

            "pdf_available":True,

            "revoked":False

        }

    }

}


# ==========================================================
# OUTPUT
# ==========================================================

verification_url = (

    BASE_URL +

    "?id=" +

    certificate_no +

    "&token=" +

    token

)

print()

print("=" * 60)

print("TOKEN")

print(token)

print()

print("SHA-256")

print(pdf_hash)

print()

print("Verification URL")

print(verification_url)

print()

print("=" * 60)

print("COPY THE JSON BELOW INTO certificates.json")

print("=" * 60)

print()

print(json.dumps(record, indent=4))

print()

print("=" * 60)