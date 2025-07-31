let definitions = {};

fetch('sid_definitions.json')
  .then(response => response.json())
  .then(data => definitions = data);

function decodeCode() {
  const code = document.getElementById('codeInput').value.trim();
  displayDecodedInfo(code);
}

function scanImage(input) {
  const file = input.files[0];
  if (!file) return;

  document.getElementById('ocrStatus').innerText = "Scanning image...";

  Tesseract.recognize(
    file,
    'eng',
    { logger: m => console.log(m) }
  ).then(({ data: { text } }) => {
    const extractedCode = text.match(/[A-Z]{2}\d{2}-[A-Za-z0-9]{3,}/);
    if (extractedCode) {
      document.getElementById('codeInput').value = extractedCode[0];
      decodeCode();
      document.getElementById('ocrStatus').innerText = "Code extracted: " + extractedCode[0];
    } else {
      document.getElementById('ocrStatus').innerText = "No valid SID code found.";
    }
  });
}

function displayDecodedInfo(code) {
  const output = document.getElementById('output');
  output.innerHTML = "";

  if (!code || code.length < 7) {
    output.innerText = "Invalid SID code.";
    return;
  }

  const parts = {
    1: code[0],
    2: code[1],
    3: code[2],
    4: code[3],
    5: code[5],
    6: code[6],
    7: code[7],
    8: code.length > 8 ? code[8] : "",
    9: code.length > 9 ? code[9] : ""
  };

  for (let i = 1; i <= 9; i++) {
    if (parts[i] && definitions[i] && definitions[i][parts[i]]) {
      const info = definitions[i][parts[i]];
      output.innerHTML += `<p><strong>Position ${i} (${parts[i]}):</strong> ${info}</p>`;
    } else if (parts[i]) {
      output.innerHTML += `<p><strong>Position ${i} (${parts[i]}):</strong> No definition found.</p>`;
    }
  }
}
