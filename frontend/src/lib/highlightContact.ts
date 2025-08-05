export function highlightContact() {
    const footer = document.querySelector("footer");
    const contactSection = document.getElementById("footer-contact");

    if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth", block: "center" });

        contactSection.classList.add("ring-2", "ring-gold-400", "rounded-lg");

        setTimeout(() => {
            contactSection.classList.remove("ring-2", "ring-gold-400", "rounded-lg");
        }, 2000);
    }
}
