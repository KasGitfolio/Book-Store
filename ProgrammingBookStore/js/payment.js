document.getElementById("paymentForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let card = document.getElementById("cardNumber").value.trim();
    let exp = document.getElementById("expDate").value;
    let cvv = document.getElementById("cvv").value.trim();
    let msg = document.getElementById("message");

    msg.innerText = "";

    //card validation
    if (card.length !== 16 || isNaN(card)) {
        msg.innerText = "Card number must be 16 digits";
        return;
    }

    if (!/^5[1-5]/.test(card)) {
        msg.innerText = "MasterCard must start with 51, 52, 53, 54, or 55";
        return;
    }

    //expiry date validation
    if (!exp) {
        msg.innerText = "Enter expiry date";
        return;
    }

    let [year, month] = exp.split("-").map(Number);

    let today = new Date();
    let expiry = new Date(year, month - 1, 1); //JS months indexed
    expiry.setMonth(expiry.getMonth() + 1); //move to first day of next month
    if (expiry <= today) {
        msg.innerText = "MasterCard is expired, please try another MasterCard";
        return;
    }

    //CVV validation
    if (cvv.length < 3 || cvv.length > 4 || isNaN(cvv)) {
        msg.innerText = "CVV must be 3 or 4 digits";
        return;
    }

    //prepare data for validation against mudfoot api requirements
    let data = {
        master_card: Number(card),
        exp_year: year,
        exp_month: month,
        cvv_code: cvv
    };

    fetch("https://mudfoot.doc.stu.mmu.ac.uk/node/api/creditcard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(res => res.json().then(body => ({ status: res.status, body })))
    .then(result => {
        if (result.status === 200) {
            msg.innerText = result.body.message;
            
            //store last 4 digits temporarily
            let last4 = card.slice(-4); //get last four digits
            sessionStorage.setItem("last4", last4);

            //redirect to success page if successful
            setTimeout(() => window.location.href = "success.html", 800);
        } 
        else if (result.status === 400) { //shouldnt reach this stage, validation ensures valid data
            msg.innerText = "Payment failed: Please enter a MasterCard starting with 51, 52, 53, 54, or 55";
        } 
        else {
            msg.innerText = result.body.message || "Payment failed";
        }
    })
    .catch(() => {
        msg.innerText = "Network error"; //incase server doesnt send any response to website
    });
});