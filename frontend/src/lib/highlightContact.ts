export function highlightContact() {
  const contactSection = document.getElementById("footer-contact");

  if (contactSection) {
    contactSection.scrollIntoView({ behavior: "smooth", block: "center" });

    // Add highlight
    contactSection.classList.add("ring-2", "ring-gold-400", "rounded-sm");

    // Blink once (remove and add quickly)
    setTimeout(() => {
      contactSection.classList.remove("ring-2", "ring-gold-400", "rounded-sm");
      setTimeout(() => {
        contactSection.classList.add("ring-2", "ring-gold-400", "rounded-sm");
      }, 150);
    }, 500);

    // Remove after 2 seconds total
    setTimeout(() => {
      contactSection.classList.remove("ring-2", "ring-gold-400", "rounded-sm");
    }, 2000);
  }
}
