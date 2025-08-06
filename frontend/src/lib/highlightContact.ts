export function highlightContact() {
  const contactSection = document.getElementById("footer-contact");

  if (contactSection) {
    contactSection.scrollIntoView({ behavior: "smooth", block: "center" });

    // Add highlight
    contactSection.classList.add("ring-2", "ring-gold-400", "rounded-lg");

    // Blink once (remove and add quickly)
    setTimeout(() => {
      contactSection.classList.remove("ring-2", "ring-gold-400", "rounded-lg");
      setTimeout(() => {
        contactSection.classList.add("ring-2", "ring-gold-400", "rounded-lg");
      }, 150);
    }, 500);

    // Remove after 2 seconds total
    setTimeout(() => {
      contactSection.classList.remove("ring-2", "ring-gold-400", "rounded-lg");
    }, 2000);
  }
}
