/* ==========================================================
   Techno Electric & Engineering Company Pvt. Ltd.
   Certificate Verification Portal
========================================================== */

(() => {

"use strict";

/* ==========================================================
   DOM ELEMENTS
========================================================== */

const loading = document.getElementById("loading");
const certificate = document.getElementById("certificate");
const notFound = document.getElementById("notFound");

const portalSubtitle = document.getElementById("portalSubtitle");
const statusBadge = document.getElementById("statusBadge");

const certificate_no = document.getElementById("certificate_no");
const document_type = document.getElementById("document_type");
const issued_to = document.getElementById("issued_to");
const client_code = document.getElementById("client_code");
const bid_notice = document.getElementById("bid_notice");
const procurement = document.getElementById("procurement");
const contract = document.getElementById("contract");

const issue_date = document.getElementById("issue_date");
const delivery_date = document.getElementById("delivery_date");
const warranty_period = document.getElementById("warranty_period");
const expiry_date = document.getElementById("expiry_date");
const remaining_days = document.getElementById("remaining_days");
const coverage = document.getElementById("coverage");
const exclusions = document.getElementById("exclusions");

const manufacturer = document.getElementById("manufacturer");
const country_origin = document.getElementById("country_origin");

const supplier = document.getElementById("supplier");
const supplierWebsite = document.getElementById("supplierWebsite");
const supplierCountry = document.getElementById("supplierCountry");

const equipmentTable = document.getElementById("equipmentTable");

const timeline_issue = document.getElementById("timeline_issue");
const timeline_delivery = document.getElementById("timeline_delivery");
const timeline_expiry = document.getElementById("timeline_expiry");

const hash = document.getElementById("hash");
const copyHash = document.getElementById("copyHash");
const verifiedOn = document.getElementById("verifiedOn");
const revision = document.getElementById("revision");

const pdfLink = document.getElementById("pdfLink");

/* ==========================================================
   URL PARAMETERS
========================================================== */

const params = new URLSearchParams(window.location.search);
const certificateId = params.get("id");

/* ==========================================================
   HELPER FUNCTIONS
========================================================== */

function formatDate(dateString){

    const d = new Date(dateString + "T00:00:00");

    return d.toLocaleDateString("en-GB",{

        day:"2-digit",
        month:"short",
        year:"numeric"

    });

}

function addMonths(dateString,months){

    const d=new Date(dateString+"T00:00:00");

    d.setMonth(d.getMonth()+months);

    d.setDate(d.getDate()-1);

    return d;

}

function daysRemaining(date){

    const today=new Date();

    today.setHours(0,0,0,0);

    return Math.ceil((date-today)/(1000*60*60*24));

}

function showStatus(status){

    statusBadge.className="badge";

    switch(status){

        case "Active":

            statusBadge.classList.add("active");
            statusBadge.textContent="🟢 ACTIVE";
            break;

        case "Expired":

            statusBadge.classList.add("expired");
            statusBadge.textContent="🟠 WARRANTY EXPIRED";
            break;

        case "Revoked":

            statusBadge.classList.add("revoked");
            statusBadge.textContent="🔴 REVOKED";
            break;

        case "Cancelled":

            statusBadge.classList.add("cancelled");
            statusBadge.textContent="⚫ CANCELLED";
            break;

        default:

            statusBadge.classList.add("revoked");
            statusBadge.textContent="UNKNOWN";

    }

}

function renderEquipment(equipment){

    equipmentTable.innerHTML="";

    equipment.forEach(item=>{

        equipmentTable.innerHTML+=`

<tr>

<td>${item.description}</td>

<td>${item.model}</td>

<td>${item.origin}</td>

<td>${item.quantity}</td>

<td>${item.serial_numbers.join("<br>")}</td>

</tr>

`;

    });

}

function fillTimeline(history){

    if(!history || history.length<3){

        timeline_issue.textContent="-";
        timeline_delivery.textContent="-";
        timeline_expiry.textContent="-";

        return;

    }

    timeline_issue.textContent=formatDate(history[0].date);
    timeline_delivery.textContent=formatDate(history[1].date);
    timeline_expiry.textContent=formatDate(history[2].date);

}

function updateVerificationTime(){

    const now=new Date();

    verifiedOn.textContent=now.toLocaleString("en-GB",{

        dateStyle:"medium",
        timeStyle:"medium"

    });

}

/* ==========================================================
   LOAD DATABASE
========================================================== */

fetch("certificates.json")

.then(response=>response.json())

.then(database=>{

    loading.style.display="none";

    if(!certificateId){

        notFound.style.display="block";
        return;

    }

    const cert=database[certificateId];

    if(!cert){

        notFound.style.display="block";
        return;

    }

    certificate.style.display="block";

    portalSubtitle.textContent=
        cert.document_type+" Verification Portal";

    certificate_no.textContent=
        cert.reference.certificate_no;

    document_type.textContent=
        cert.document_type;

    issued_to.textContent=
        cert.customer.organization;

    client_code.textContent=
        cert.reference.client_code;

    bid_notice.textContent=
        cert.reference.bid_notice;

    procurement.textContent=
        cert.reference.procurement;

    contract.textContent=
        cert.reference.contract;

    issue_date.textContent=
        formatDate(cert.warranty.issue_date);

    delivery_date.textContent=
        formatDate(cert.warranty.delivery_date);

    warranty_period.textContent=
        cert.warranty.validity_months+" Month(s)";

    const expiry=addMonths(

        cert.warranty.delivery_date,

        cert.warranty.validity_months

    );

    expiry_date.textContent=formatDate(expiry);

    let status;

    switch(cert.status){

        case "Revoked":
            status="Revoked";
            break;

        case "Cancelled":
            status="Cancelled";
            break;

        default:
            status=
            daysRemaining(expiry)<0
            ?"Expired"
            :"Active";

    }

    showStatus(status);

    if(status==="Active"){

        remaining_days.textContent=
        daysRemaining(expiry)+" day(s) remaining";

    }

    else if(status==="Expired"){

        remaining_days.textContent=
        "Warranty Expired";

    }

    else{

        remaining_days.textContent=status;

    }

    coverage.textContent=
        cert.warranty.coverage;

    exclusions.textContent=
        cert.warranty.exclusions.join(", ");

    manufacturer.textContent=
        cert.manufacturer.name;

    country_origin.textContent=
        cert.manufacturer.country;

    supplier.textContent=
        cert.supplier.name;

    supplierWebsite.href=
        cert.supplier.website;

    supplierWebsite.textContent=
        cert.supplier.website;

    supplierCountry.textContent=
        cert.supplier.country;

    renderEquipment(cert.equipment);

    fillTimeline(cert.history);

    hash.textContent=
        cert.files.sha256;

    revision.textContent=
        "Version "+
        cert.revision.version+
        " ("+
        formatDate(cert.revision.last_updated)+
        ")";

    updateVerificationTime();

    pdfLink.href=
        "pdf/"+cert.files.pdf;

})

.catch(error=>{

    console.error(error);

    loading.style.display="none";

    notFound.style.display="block";

    notFound.querySelector("h2").textContent=
        "Unable to Connect";

    notFound.querySelector("p").textContent=
        "The certificate registry could not be reached. Please try again later.";

});

/* ==========================================================
   COPY SHA-256
========================================================== */

copyHash.addEventListener("click",()=>{

    if(navigator.clipboard){

        navigator.clipboard.writeText(hash.textContent);

    }

    else{

        window.prompt(

            "Copy SHA-256",

            hash.textContent

        );

    }

    copyHash.textContent="Copied";

    setTimeout(()=>{

        copyHash.textContent="Copy";

    },2000);

});

})();