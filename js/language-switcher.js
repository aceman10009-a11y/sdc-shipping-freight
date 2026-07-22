document.addEventListener("DOMContentLoaded", () => {
    const selector = document.querySelector("#language-select");
    if (!selector) return;

    selector.value = localStorage.getItem("language") || "en";

    selector.addEventListener("change", async function () {
        localStorage.setItem("language", this.value);
        translator.language = this.value;

        const file = window.location.pathname.split("/").pop();

        const page =
            !file || file === "" || file === "index.html"
                ? "home"
                : file.replace(".html", "");

        await translator.load(page);
    });
});