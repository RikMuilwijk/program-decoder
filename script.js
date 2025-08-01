let definitions = {};

fetch('sid_definitions_complete.json')
  .then(response => response.json())
  .then(data => definitions = data);

function decodeSID() {
  const input = document.getElementById("sidInput").value.trim().toUpperCase();
  const output = document.getElementById("output");
  output.innerHTML = "";

  const match = input.match(/^([A-Z]{2})(\d{2})-([A-Z0-9]{3})(?:-([A-Z0-9]+))?$/);
  if (!match) {
    output.innerHTML = "<p>Invalid SID format. Expected format: EW25-HkA or EW25-HkA-P1</p>";
    return;
  }

  const [_, prefix, year, mid, suffix] = match;
  const chars = [...prefix, ...year, ...mid];
  const parts = chars.map((char, i) => {
    const key = "position_" + (i + 1);
    const meaning = definitions[key]?.[char] || "Unknown";
    return `<strong>Position ${i + 1} (${char}):</strong> ${meaning}`;
  });

  if (suffix) {
    parts.push(`<strong>Position 8-9 (${suffix}):</strong> ${definitions["position_8_9"]?.[suffix] || "Optional identifier or experiment code"}`);
  }

  output.innerHTML = parts.map(p => `<p>${p}</p>`).join("");
}

function captureAndDecode() {
  const canvas = document.createElement("canvas");
  const video = document.getElementById("video");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  Tesseract.recognize(canvas, 'eng').then(({ data: { text } }) => {
    const match = text.match(/[A-Z]{2}\d{2}-[A-Z0-9]{3}(?:-[A-Z0-9]+)?/);
    if (match) {
      document.getElementById("sidInput").value = match[0];
      decodeSID();
    } else {
      document.getElementById("output").innerHTML = "<p>No valid SID code found in scan.</p>";
    }
  });
}

navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
  const video = document.getElementById("video");
  video.srcObject = stream;

  const overlay = document.getElementById("overlay");
  overlay.width = video.clientWidth;
  overlay.height = video.clientHeight;
  const ctx = overlay.getContext("2d");

  function drawOverlay() {
    ctx.clearRect(0, 0, overlay.width, overlay.height);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    const rectWidth = overlay.width * 0.8;
    const rectHeight = 50;
    const x = (overlay.width - rectWidth) / 2;
    const y = (overlay.height - rectHeight) / 2;
    ctx.strokeRect(x, y, rectWidth, rectHeight);
    requestAnimationFrame(drawOverlay);
  }

  drawOverlay();
});