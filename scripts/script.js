document.addEventListener("DOMContentLoaded", () => {
  // Initialize AOS (Animate On Scroll)
  AOS.init({
    duration: 800, // values from 0 to 3000, with step 50ms
    easing: "ease-in-out", // default easing for AOS animations
    once: true, // whether animation should happen only once - while scrolling down
    mirror: false, // whether elements should animate out while scrolling past them
  });

  // Dark Mode Toggle
  const darkModeToggle = document.getElementById("darkModeToggle");
  const body = document.body;

  // Check for saved dark mode preference
  if (localStorage.getItem("darkMode") === "enabled") {
    body.classList.add("dark-mode");
  }

  darkModeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    if (body.classList.contains("dark-mode")) {
      localStorage.setItem("darkMode", "enabled");
    } else {
      localStorage.removeItem("darkMode");
    }
  });

  // Mobile Menu Toggle
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.querySelector(".nav-links");

  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    menuToggle.classList.toggle("active");
    const isExpanded =
      menuToggle.getAttribute("aria-expanded") === "true" || false;
    menuToggle.setAttribute("aria-expanded", !isExpanded);
    menuToggle.setAttribute(
      "aria-label",
      isExpanded ? "Abrir menu" : "Fechar menu"
    );
  });

  // Smooth Scroll for Nav Links & Close Mobile Menu on Click
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
        });
      }

      // Close mobile menu if open and link is clicked
      if (navLinks.classList.contains("active")) {
        navLinks.classList.remove("active");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menu");
      }
    });
  });

  // Dynamic Year in Footer
  const currentYearSpan = document.getElementById("currentYear");
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // Optional: Contact Form Submission (basic alert, replace with actual submission logic)
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const form = e.target;
      const data = new FormData(form);

      // Remove qualquer mensagem de status anterior
      let existingStatus = form.parentNode.querySelector(
        ".form-status-message"
      );
      if (existingStatus) {
        existingStatus.remove();
      }

      const statusElement = document.createElement("p");
      statusElement.classList.add("form-status-message"); // Adiciona a classe base

      const submitButton = form.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.textContent;
      submitButton.disabled = true;
      submitButton.textContent = "Enviando...";

      try {
        const response = await fetch(form.action, {
          method: form.method,
          body: data,
          headers: {
            Accept: "application/json",
          },
        });

        if (response.ok) {
          statusElement.textContent =
            "Obrigado pela sua mensagem! Entrarei em contato em breve.";
          statusElement.classList.add("success"); // Adiciona classe de sucesso
          form.reset();
        } else {
          const responseData = await response.json();
          if (Object.hasOwn(responseData, "errors")) {
            statusElement.textContent = responseData["errors"]
              .map((error) => error["message"])
              .join(", ");
          } else {
            statusElement.textContent =
              "Oops! Houve um problema ao enviar seu formulário.";
          }
          statusElement.classList.add("error"); // Adiciona classe de erro
        }
      } catch (error) {
        console.error("Erro no envio do formulário:", error); // Log do erro no console
        statusElement.textContent =
          "Oops! Houve um problema de conexão ao enviar seu formulário.";
        statusElement.classList.add("error");
      } finally {
        // Insere o statusElement após o formulário
        // (ou você pode escolher um local específico dentro do .contact-form)
        form.parentNode.insertBefore(statusElement, form.nextSibling);

        // Remove a mensagem de status após alguns segundos
        setTimeout(() => {
          statusElement.remove();
        }, 7000); // Remove após 7 segundos

        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    });
  }
  // Optional: Add a simple loading animation on first visit (very basic)
  // You can make this more sophisticated with a dedicated loader element
  if (!sessionStorage.getItem("siteVisited")) {
    body.style.opacity = "0";
    setTimeout(() => {
      body.style.transition = "opacity 0.5s ease-in-out";
      body.style.opacity = "1";
    }, 100); // Small delay to ensure CSS transition applies
    sessionStorage.setItem("siteVisited", "true");
  }
});
