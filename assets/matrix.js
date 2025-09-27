(function () {
  const canvas = document.getElementById("matrix");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  function size() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  size();
  window.addEventListener("resize", size);

  const letters = "01";
  const fontSize = 14;
  let columns = Math.floor(canvas.width / fontSize);
  let drops = Array(columns).fill(1);

  function getVar(name) {
    return getComputedStyle(document.body).getPropertyValue(name).trim();
  }

  function draw() {
    // trail
    ctx.fillStyle = "rgba(0, 0, 0, 0.09)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // digits color from CSS variable
    ctx.fillStyle = getVar('--red') || '#ff4d4d';
    ctx.font = fontSize + "px monospace";

    for (let i = 0; i < drops.length; i++) {
      const text = letters.charAt(Math.floor(Math.random() * letters.length));
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  setInterval(draw, 35);
})();
