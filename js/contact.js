// ===============================
// CONTACT FORM (NODEMAILER BACKEND)
// ===============================

async function sendEmail() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();
    const result = document.getElementById("emailResult");

    if (!name || !email || !message) {
        result.innerText = "Please complete all fields.";
        return;
    }

    result.innerText = "Sending message...";

   try {
    const response = await fetch("https://sdc-shipping-freight.onrender.com/contact", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name,
            email,
            message
        })
    });

        const data = await response.json();

        if (response.ok) {
            result.innerText = "✅ Message sent successfully.";

            document.getElementById("name").value = "";
            document.getElementById("email").value = "";
            document.getElementById("message").value = "";
        } else {
            result.innerText = data.message || "Failed to send message.";
        }
    } catch (error) {
        console.error(error);
        result.innerText = "Cannot connect to the server.";
    }
}