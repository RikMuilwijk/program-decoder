let definitions = {};
fetch('sid_definitions_complete.json')
  .then(response => response.json())
  .then(data => definitions = data);

function decodeCode() {
  const input = document.getElementById("codeInput").value.trim();
  const formatted = formatSID(input);
  const parts = parseSID(formatted);
  displayInfo(parts);
}

function formatSID(code) {
  const raw = code.replace(/[^a-zA-Z0-9]/g, '');
  if (raw.length < 7) return raw;
  let formatted = raw.slice(0, 4) + '-' + raw.slice(4, 7);
  if (raw.length > 7) formatted += '-' + raw.slice(7);
  return formatted;
}

function parseSID(code) {
  const clean = code.replace(/-/g, '');
  const parts = [];
  for (let i = 0; i < clean.length; i++) {
    parts.push({ position: i + 1, value: clean[i] });
  }
  if (clean.length > 7) {
    parts.push({ position: 8, value: clean.slice(7, 8) });
    parts.push({ position: 9, value: clean.slice(8) });
  }
  return parts;
}

function displayInfo(parts) {
  const output = document.getElementById("output");
  output.innerHTML = "<h3>Decoded Information:</h3>";
  parts.forEach(p => {
    const key = "position_" + p.position;
    const def = definitions[key] && definitions[key][p.value.toUpperCase()] || "Unknown";
    output.innerHTML += `<p><strong>Position ${p.position} (${p.value}):</strong> ${def}</p>`;
  });
}

let videoStream = null;
async function startScan() {
  const video = document.getElementById("video");
  const canvas = document.getElementById("overlay");
  const ctx = canvas.getContext("2d");

  try {
    videoStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "environment",
        width: { ideal: 640 },
        height: { ideal: 480 }
      },
      audio: false
    });
    video.srcObject = videoStream;

    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      drawOverlay();
    };
  } catch (err) {
    alert("Camera access denied or not available.");
  }
}

function drawOverlay() {
  const canvas = document.getElementById("overlay");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "red";
  ctx.lineWidth = 3;
  const w = canvas.width * 0.6;
  const h = canvas.height * 0.2;
  const x = (canvas.width - w) / 2;
  const y = (canvas.height - h) / 2;
  ctx.strokeRect(x, y, w, h);

  setTimeout(() => captureAndRecognize(x, y, w, h), 2000);
}

function captureAndRecognize(x, y, w, h) {
  const video = document.getElementById("video");
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = w;
  tempCanvas.height = h;
  const tempCtx = tempCanvas.getContext("2d");
  tempCtx.drawImage(video, x, y, w, h, 0, 0, w, h);

  Tesseract.recognize(tempCanvas, 'eng')
    .then(result => {
      const text = result.data.text.trim();
      document.getElementById("codeInput").value = text;
      decodeCode();
    })
    .catch(err => {
      alert("OCR failed: " + err.message);
    });
}
