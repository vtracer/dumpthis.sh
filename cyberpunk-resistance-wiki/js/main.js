// Binary glitch effect for links
document.addEventListener('DOMContentLoaded', () => {
  // Generate random binary string of same length
  function randomBinary(length) {
    return Array.from({length}, () => Math.random() > 0.5 ? '1' : '0').join('');
  }

  // Apply glitch effect to all links
  const links = document.querySelectorAll('a');
  
  links.forEach(link => {
    // Store original text
    const originalText = link.textContent;
    let glitchInterval = null;
    
    link.addEventListener('mouseenter', () => {
      if (!glitchInterval) {
        // Rapid binary glitch effect
        glitchInterval = setInterval(() => {
          link.textContent = randomBinary(originalText.length);
        }, 50); // 50ms flicker rate
      }
    });
    
    link.addEventListener('mouseleave', () => {
      if (glitchInterval) {
        clearInterval(glitchInterval);
        glitchInterval = null;
        link.textContent = originalText;
      }
    });
  });
});