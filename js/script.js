// ===============================
// FIREBASE INIT
// ===============================

const firebaseConfig = {
  apiKey: "AIzaSyAL9prhiT_d4aBnHVxZu2X0DDjhaBZplOA",
  authDomain: "sdc-shipping-freight.firebaseapp.com",
  projectId: "sdc-shipping-freight",
  storageBucket: "sdc-shipping-freight.appspot.com",
  messagingSenderId: "1017468157423",
  appId: "1:1017468157423:web:a8fe3a223ca5e4f80a0a1a"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();


// ===============================
// TRACK SHIPMENT (FIXED)
// ===============================

function trackShipment() {
    const id = document.getElementById("trackingId").value.trim();
    const result = document.getElementById("trackResult");

    if (!id) {
        result.innerText = "Please enter a Tracking ID";
        return;
    }

    result.innerText = "Tracking shipment...";

    db.collection("shipments").doc(id).get()
        .then(doc => {

            if (!doc.exists) {
                result.innerText = "Shipment not found";
                return;
            }

            const data = doc.data();
            console.log("DATA:", data);
console.log("TIMELINE:", data.timeline)

            let html =
                `<h3>Status: ${data.status}</h3>
                <p>Location: ${data.location}</p>
                <p>Updated: ${data.updated}</p>
                <h4>📦 Timeline</h4>`;

            if (data.timeline && data.timeline.length > 0) {
                data.timeline.forEach(step => {
                    html += `
                    <div class="timeline-step">
                        <strong>${step.status}</strong><br>
                        ${step.location}<br>
                        <small>${step.time}</small>
                    </div>`;
                });
            } else {
                html += `<p>No timeline available</p>`;
            }

            result.innerHTML = html;
        })
        .catch(error => {
            console.log(error);
            result.innerText = "Error fetching shipment";
        });
}


// ===============================
// LOGIN
// ===============================

function login() {
    auth.signInWithEmailAndPassword(
        document.getElementById("adminEmail").value,
        document.getElementById("adminPass").value
    );
}


// ===============================
// LOGOUT
// ===============================

function logout() {
    auth.signOut();
}


// ===============================
// AUTH STATE
// ===============================

auth.onAuthStateChanged(user => {
    const loginBox = document.getElementById("loginBox");
    const adminPanel = document.getElementById("adminPanel");
    const logoutBtn = document.getElementById("logoutBtn");

    if (!loginBox || !adminPanel) return;

    if (user) {
        loginBox.style.display = "none";
        adminPanel.style.display = "block";
        if (logoutBtn) logoutBtn.style.display = "block";
    } else {
        loginBox.style.display = "block";
        adminPanel.style.display = "none";
        if (logoutBtn) logoutBtn.style.display = "none";
    }
});


// ===============================
// SAVE SHIPMENT
// ===============================

function saveShipment() {
    const id = document.getElementById("shipId").value;

    if (!id) {
        document.getElementById("adminResult").innerText = "Missing Tracking ID";
        return;
    }

    db.collection("shipments").doc(id).set({
        status: document.getElementById("shipStatus").value,
        location: document.getElementById("shipLocation").value,
        updated: new Date().toISOString()
    });

    document.getElementById("adminResult").innerText = "Saved ✔";
}
// ===============================
// CONTACT FORM
// ===============================

function sendEmail() {

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    emailjs.send(
        "service_kvozp58",
        "template_oyp0p6u",
        {
            from_name: name,
            from_email: email,
            message: message
        }
    )
    .then(() => {
        document.getElementById("emailResult").innerText =
            "Message sent successfully!";
    })
    .catch((error) => {
        console.log(error);
        document.getElementById("emailResult").innerText =
            "Failed to send message.";
    });
}
console.log("SITE LOADED SUCCESSFULLY");