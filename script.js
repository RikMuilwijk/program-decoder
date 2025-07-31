function decodeSID() {
    const input = document.getElementById('sidInput').value.trim();
    const output = document.getElementById('output');
    if (!input) {
        output.innerHTML = "<p>Please enter a SID code.</p>";
        return;
    }

    const parts = input.split('-');
    if (parts.length < 2) {
        output.innerHTML = "<p>Invalid SID code format.</p>";
        return;
    }

    const prefix = parts[0];
    const suffix = parts[1];
    const extra = parts.length > 2 ? parts[2] : "";

    let result = "<h2>Decoded SID Information</h2><ul>";

    // Prefix positions
    result += `<li><strong>Breeding Group:</strong> ${prefix[0] === 'E' ? 'EU' : prefix[0] === 'U' ? 'US' : 'Unknown'}</li>`;
    result += `<li><strong>Season/Location:</strong> ${prefix[1]}</li>`;
    result += `<li><strong>Harvest Year:</strong> 20${prefix.slice(2,4)}</li>`;

    // Suffix positions
    result += `<li><strong>Activity:</strong> ${suffix[0]}</li>`;
    result += `<li><strong>Propagation Material:</strong> ${suffix[1]}</li>`;
    result += `<li><strong>Generation/Material Type:</strong> ${suffix[2]}</li>`;

    if (extra) {
        result += `<li><strong>Running Number:</strong> ${extra}</li>`;
    }

    result += "</ul>";
    output.innerHTML = result;
}
