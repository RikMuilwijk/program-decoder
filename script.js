
async function decodeSIDCode(code) {
    const sidDefinitions = await fetch('sid_definitions_complete.json').then(res => res.json());
    const parts = code.split('-');
    if (parts.length < 2) {
        return { error: "Invalid SID code format" };
    }

    const prefix = parts[0];
    const suffix = parts.slice(1).join('');

    let result = {};
    if (prefix.length >= 4) {
        result['Position 1'] = sidDefinitions['position_1'][prefix[0]] || 'Unknown';
        result['Position 2'] = sidDefinitions['position_2'][prefix[1]] || 'Unknown';
        result['Position 3-4'] = "Year of harvest: 20" + prefix.slice(2, 4);
    } else {
        return { error: "Prefix too short" };
    }

    if (suffix.length >= 3) {
        result['Position 5'] = sidDefinitions['position_5'][suffix[0]] || 'Unknown';
        result['Position 6'] = sidDefinitions['position_6'][suffix[1]] || 'Unknown';
        result['Position 7'] = sidDefinitions['position_7'][suffix[2]] || 'Unknown';
    }

    if (suffix.length > 3) {
        result['Position 8-9'] = sidDefinitions['position_8_9'][suffix.slice(3)] || 'Running number or experiment code';
    }

    return result;
}

document.getElementById('decodeBtn').addEventListener('click', async () => {
    const code = document.getElementById('sidInput').value.trim();
    const result = await decodeSIDCode(code);
    const output = document.getElementById('output');
    output.innerHTML = '';
    for (const [key, value] of Object.entries(result)) {
        const p = document.createElement('p');
        p.textContent = `${key}: ${value}`;
        output.appendChild(p);
    }
});
