const banner = document.getElementById("cookie-banner");

if (!localStorage.getItem("cookieConsent")) {
    banner.style.display = "block";
} else {
    banner.style.display = "none";
}

document.getElementById("acceptCookies").addEventListener("click", () => {
    localStorage.setItem("cookieConsent", "accepted");
    banner.style.display = "none";
});

document.getElementById("declineCookies").addEventListener("click", () => {
    localStorage.setItem("cookieConsent", "declined");
    banner.style.display = "none";
});