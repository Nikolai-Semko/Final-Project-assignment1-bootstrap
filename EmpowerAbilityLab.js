// EmpowerAbilityLab.js - Single Page Application functionality
// Implements the SPA behavior, navigation, modal dialog, form validation, and accessibility features

// Make navigateToSection available globally for keyboard navigation
let navigateToSection;

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initSPA();
  initModalDialog();
  initFormBehavior();
  initSwitchComponent();
  initNavigationToggle();
  
  // Add keyboard arrow navigation
  initKeyboardNavigation();
  
  // Explicitly set home link as active on page load
  const homeLink = document.querySelector('[data-section="home"]');
  if (homeLink) {
    homeLink.classList.add('active');
    homeLink.setAttribute('aria-current', 'page');
  }
});

// Add keyboard arrow navigation support
function initKeyboardNavigation() {
  // Define the order of sections for navigation
  const sectionOrder = ['home', 'services', 'schedule'];
  
  // Add keyboard event listener to the document
  document.addEventListener('keydown', function(e) {
    // Only handle left/right arrow keys when not in form fields or other input elements
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
      return;
    }
    
    // Get current section
    let currentSection = 'home';
    const activeSection = document.querySelector('.section-container.active');
    if (activeSection) {
      currentSection = activeSection.id;
    }
    
    const currentIndex = sectionOrder.indexOf(currentSection);
    
    // Left arrow key (previous section)
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : sectionOrder.length - 1;
      const prevSection = sectionOrder[prevIndex];
      navigateToSection(prevSection);
      
      // Simulate click on back button for visual feedback
      const backBtn = document.getElementById('back-btn');
      if (backBtn) {
        backBtn.classList.add('active-key');
        setTimeout(() => {
          backBtn.classList.remove('active-key');
        }, 200);
      }
    }
    
    // Right arrow key (next section)
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = currentIndex < sectionOrder.length - 1 ? currentIndex + 1 : 0;
      const nextSection = sectionOrder[nextIndex];
      navigateToSection(nextSection);
      
      // Simulate click on forward button for visual feedback
      const forwardBtn = document.getElementById('forward-btn');
      if (forwardBtn) {
        forwardBtn.classList.add('active-key');
        setTimeout(() => {
          forwardBtn.classList.remove('active-key');
        }, 200);
      }
    }
  });
}

// SPA Navigation functionality
function initSPA() {
  const sections = document.querySelectorAll('.section-container');
  const navLinks = document.querySelectorAll('[data-section]');
  const backBtn = document.getElementById('back-btn');
  const forwardBtn = document.getElementById('forward-btn');
  
  // Set page titles for each section
  const pageTitles = {
    'home': 'Home - Empower Ability Labs',
    'services': 'Services - Empower Ability Labs',
    'schedule': 'Schedule a Call - Empower Ability Labs'
  };
  
  // Define the order of sections for navigation
  const sectionOrder = ['home', 'services', 'schedule'];
  
  // Track current section
  let currentSection = 'home';
  
  // Set initial state
  updateNavigationButtons();
  
  // Handle navigation clicks
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetSection = this.getAttribute('data-section');
      navigateToSection(targetSection);
      
      // Close mobile menu if open
      const navbarCollapse = document.getElementById('navbarNav');
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        navbarCollapse.classList.remove('show');
        const navbarToggler = document.querySelector('.navbar-toggler');
        if (navbarToggler) {
          navbarToggler.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });
  
  // Back button functionality
  backBtn.addEventListener('click', function() {
    navigateToPreviousSection();
  });
  
  // Forward button functionality
  forwardBtn.addEventListener('click', function() {
    navigateToNextSection();
  });
  
  // Navigate to previous section
  function navigateToPreviousSection() {
    const currentIndex = sectionOrder.indexOf(currentSection);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : sectionOrder.length - 1;
    navigateToSection(sectionOrder[prevIndex]);
  }
  
  // Navigate to next section
  function navigateToNextSection() {
    const currentIndex = sectionOrder.indexOf(currentSection);
    const nextIndex = currentIndex < sectionOrder.length - 1 ? currentIndex + 1 : 0;
    navigateToSection(sectionOrder[nextIndex]);
  }
  
  // Make navigateToSection available globally for keyboard navigation
  navigateToSection = function(sectionId) {
    // Update current section
    currentSection = sectionId;
    
    // Update active section
    sections.forEach(section => {
      if (section.id === sectionId) {
        section.classList.add('active');
      } else {
        section.classList.remove('active');
      }
    });
    
    // Update active navigation link
    navLinks.forEach(link => {
      const linkSection = link.getAttribute('data-section');
      if (linkSection === sectionId) {
        link.setAttribute('aria-current', 'page');
        link.classList.add('active');
      } else {
        link.removeAttribute('aria-current');
        link.classList.remove('active');
      }
    });
    
    // Update page title for screen readers and browser tab
    document.title = pageTitles[sectionId] || 'Empower Ability Labs';
    
    // Update URL without page reload
    window.history.pushState({ section: sectionId }, '', `#${sectionId}`);
    
    // Update navigation buttons
    updateNavigationButtons();
    
    // Move focus to the section heading for accessibility
    const headingId = `${sectionId}-title`;
    const heading = document.getElementById(headingId);
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus();
      // Remove tabindex after focus to maintain normal tab order
      setTimeout(() => {
        heading.removeAttribute('tabindex');
      }, 100);
    }
    
    // Announce section change to screen readers
    announceToScreenReader(`Navigated to ${sectionId} section`);
  };
  
  // Update navigation buttons based on current section
  function updateNavigationButtons() {
    const currentIndex = sectionOrder.indexOf(currentSection);
    
    // Option 1: Enable/disable buttons based on position
    // backBtn.disabled = currentIndex === 0;
    // forwardBtn.disabled = currentIndex === sectionOrder.length - 1;
    
    // Option 2: Always enable both buttons for cyclic navigation
    backBtn.disabled = false;
    forwardBtn.disabled = false;
    
    // Update visual indicators
    if (backBtn.disabled) {
      backBtn.classList.add('disabled');
    } else {
      backBtn.classList.remove('disabled');
    }
    
    if (forwardBtn.disabled) {
      forwardBtn.classList.add('disabled');
    } else {
      forwardBtn.classList.remove('disabled');
    }
  }
  
  // Check URL hash on page load
  function checkInitialHash() {
    const hash = window.location.hash.substring(1);
    if (hash && sectionOrder.includes(hash)) {
      navigateToSection(hash);
    } else {
      // Set initial history state if no valid hash
      window.history.replaceState({ section: 'home' }, '', '#home');
      navigateToSection('home');
    }
  }
  
  // Handle browser back/forward buttons
  window.addEventListener('popstate', function(event) {
    if (event.state && event.state.section) {
      navigateToSection(event.state.section);
    }
  });
  
  // Run initial hash check
  checkInitialHash();
}

// Modal dialog functionality
function initModalDialog() {
  const meetCommunityBtn = document.getElementById('meet-community-btn');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalClose = document.getElementById('modal-close');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalContainer = document.querySelector('.modal-container');
  
  if (!meetCommunityBtn || !modalOverlay) return;
  
  // Keep track of element that had focus before modal opened
  let previousFocus = null;

  // Open modal function
  const openModal = () => {
    // Store current focus
    previousFocus = document.activeElement;
    
    // Show modal
    modalOverlay.classList.add('active');
    modalOverlay.setAttribute('aria-hidden', 'false');
    
    // Set focus to modal container
    modalContainer.setAttribute('tabindex', '-1');
    modalContainer.focus();
    
    // Trap focus inside modal
    trapFocus(modalContainer);
    
    // Prevent page scrolling when modal is open
    document.body.style.overflow = 'hidden';
    
    // Announce to screen readers
    announceToScreenReader('Dialog opened: Community Steering Committee');
  };

  // Close modal function
  const closeModal = () => {
    modalOverlay.classList.remove('active');
    modalOverlay.setAttribute('aria-hidden', 'true');
    
    // Restore page scrolling
    document.body.style.overflow = '';
    
    // Return focus to the element that opened the modal
    if (previousFocus) {
      previousFocus.focus();
    }
    
    // Announce to screen readers
    announceToScreenReader('Dialog closed');
  };

  // Event listeners
  meetCommunityBtn.addEventListener('click', openModal);
  modalClose.addEventListener('click', closeModal);
  modalCloseBtn.addEventListener('click', closeModal);
  
  // Close when clicking outside the modal
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  // Close with ESC key
  document.addEventListener('keydown', (e) => {
    if (modalOverlay.classList.contains('active') && e.key === 'Escape') {
      closeModal();
    }
  });
}

// Form behavior and validation
function initFormBehavior() {
  const contactForm = document.getElementById('contact-form');
  const formNotification = document.getElementById('form-notification');
  const speakerCheckbox = document.getElementById('speaker-checkbox');
  const eventDetails = document.getElementById('event-details');
  
  if (!contactForm || !formNotification || !speakerCheckbox || !eventDetails) return;

  // Show/hide event details based on speaker checkbox
  speakerCheckbox.addEventListener('change', function() {
    if (this.checked) {
      eventDetails.classList.add('visible');
      // Announce to screen readers
      announceToScreenReader('Event details section is now visible');
    } else {
      eventDetails.classList.remove('visible');
      // Announce to screen readers
      announceToScreenReader('Event details section is now hidden');
    }
  });

  // Form validation and submission
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Reset previous errors
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.classList.remove('is-invalid');
    });
    
    // Validate form
    let isValid = true;
    
    // Email validation (required)
    const email = document.getElementById('email');
    if (!email.value.trim()) {
      showError(email, 'email-error', 'Email is required');
      isValid = false;
    } else if (!isValidEmail(email.value)) {
      showError(email, 'email-error', 'Please enter a valid email address');
      isValid = false;
    }
    
    // Phone validation (if provided)
    const phone = document.getElementById('phone');
    if (phone.value.trim() && !isValidPhone(phone.value)) {
      showError(phone, 'phone-error', 'Please enter a valid phone number (format: 613-123-1234)');
      isValid = false;
    }
    
    // Event details validation (if speaker checkbox is checked)
    if (speakerCheckbox.checked) {
      const eventDescription = document.getElementById('event-description');
      if (!eventDescription.value.trim()) {
        showError(eventDescription, 'event-description-error', 'Please provide details about your event');
        isValid = false;
      }
    }
    
    // If form is valid, submit
    if (isValid) {
      // Show success message
      formNotification.textContent = 'Thank you! We will contact you soon to schedule a call.';
      formNotification.className = 'alert alert-success';
      formNotification.classList.remove('d-none');
      
      // Reset form
      contactForm.reset();
      eventDetails.classList.remove('visible');
      
      // Set focus to notification for screen readers
      formNotification.setAttribute('tabindex', '-1');
      formNotification.focus();
      setTimeout(() => {
        formNotification.removeAttribute('tabindex');
      }, 100);
    } else {
      // Show error message
      formNotification.textContent = 'Please correct the errors in the form.';
      formNotification.className = 'alert alert-danger';
      formNotification.classList.remove('d-none');
      
      // Focus the first error field
      const firstErrorField = contactForm.querySelector('.is-invalid');
      if (firstErrorField) {
        firstErrorField.focus();
      }
    }
  });

  // Helper function to show validation errors
  function showError(inputElement, errorId, message) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
    }
    inputElement.classList.add('is-invalid');
  }

  // Email validation helper
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Phone validation helper
  function isValidPhone(phone) {
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    return phoneRegex.test(phone);
  }
}

// Switch component functionality
function initSwitchComponent() {
  const switchInput = document.getElementById('email-updates');
  const switchLabel = document.getElementById('email-updates-label');
  
  if (!switchInput || !switchLabel) return;
  
  // Ensure ARIA attributes are set
  switchInput.setAttribute('role', 'switch');
  switchInput.setAttribute('aria-checked', 'false');
  
  // Update ARIA state when switch changes
  switchInput.addEventListener('change', function() {
    this.setAttribute('aria-checked', this.checked.toString());
    
    // Announce state change to screen readers
    const state = this.checked ? 'on' : 'off';
    announceToScreenReader(`Email updates ${state}`);
  });
}

// Responsive navigation toggle
function initNavigationToggle() {
  const navbarToggler = document.querySelector('.navbar-toggler');
  const navbarNav = document.getElementById('navbarNav');
  
  if (!navbarToggler || !navbarNav) return;
  
  navbarToggler.addEventListener('click', function() {
    const expanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', (!expanded).toString());
    
    if (expanded) {
      navbarNav.classList.remove('show');
    } else {
      navbarNav.classList.add('show');
    }
  });
}

// Utility Functions

// Focus trap for modal dialog
function trapFocus(element) {
  const focusableElements = element.querySelectorAll('a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select');
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  element.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      // Trap focus inside the modal
      if (e.shiftKey && document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      } else if (!e.shiftKey && document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  });
}

// Screen reader announcements
function announceToScreenReader(message) {
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', 'assertive');
  announcer.setAttribute('role', 'status');
  announcer.className = 'sr-only';
  document.body.appendChild(announcer);
  
  // Set the message after a small delay for screen readers to detect the element
  setTimeout(() => {
    announcer.textContent = message;
    
    // Remove the announcer after it's been read
    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 1000);
  }, 50);
}