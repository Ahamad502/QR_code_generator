// Global variable to store current QR code data URL
let currentQRDataURL = null;

/**
 * Main function to generate QR code
 */
function generateQR() {
    const text = document.getElementById('textInput').value.trim();
    const size = parseInt(document.getElementById('sizeSelect').value);
    const color = document.getElementById('colorSelect').value;
    const qrcodeDiv = document.getElementById('qrcode');
    const message = document.getElementById('message');
    const qrOutput = document.getElementById('qrOutput');
    const downloadSection = document.getElementById('downloadSection');

    // Clear previous results
    message.innerHTML = '';
    qrcodeDiv.innerHTML = '';
    qrOutput.classList.remove('has-qr');
    downloadSection.style.display = 'none';

    // Validate input
    if (!text) {
        showMessage('Please enter some text or a URL to generate a QR code.', 'error');
        return;
    }

    // Show loading state
    document.getElementById('generateBtn').textContent = 'Generating...';
    document.getElementById('generateBtn').disabled = true;

    try {
        // Generate QR code using the QRCode library
        QRCode.toCanvas(text, {
            width: size,
            height: size,
            color: {
                dark: color,
                light: '#FFFFFF'
            },
            margin: 2,
            errorCorrectionLevel: 'M'
        }, function (error, canvas) {
            // Reset button state
            document.getElementById('generateBtn').textContent = 'Generate QR Code';
            document.getElementById('generateBtn').disabled = false;

            if (error) {
                showMessage('Error generating QR code: ' + error.message, 'error');
                return;
            }

            // Display the generated QR code
            qrcodeDiv.innerHTML = '';
            qrcodeDiv.appendChild(canvas);
            qrOutput.classList.add('has-qr');
            
            // Store canvas data for download functionality
            currentQRDataURL = canvas.toDataURL('image/png');
            
            // Show download button
            downloadSection.style.display = 'block';
            
            // Show success message
            showMessage('QR code generated successfully! Right-click to save or use the download button.', 'success');
        });
    } catch (error) {
        // Handle any unexpected errors
        document.getElementById('generateBtn').textContent = 'Generate QR Code';
        document.getElementById('generateBtn').disabled = false;
        showMessage('Error: ' + error.message, 'error');
    }
}

/**
 * Function to download the generated QR code
 */
function downloadQR() {
    if (!currentQRDataURL) {
        showMessage('No QR code to download. Please generate one first.', 'error');
        return;
    }

    // Create download link and trigger download
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = currentQRDataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showMessage('QR code downloaded successfully!', 'success');
}

/**
 * Function to display messages to the user
 * @param {string} text - The message text
 * @param {string} type - The message type ('error' or 'success')
 */
function showMessage(text, type) {
    const message = document.getElementById('message');
    message.innerHTML = `<div class="${type}">${text}</div>`;
    
    // Auto-hide success messages after 3 seconds
    if (type === 'success') {
        setTimeout(() => {
            message.innerHTML = '';
        }, 3000);
    }
}

// Event listeners for enhanced user experience

/**
 * Generate QR code when Enter is pressed in the text area
 */
document.getElementById('textInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        generateQR();
    }
});

/**
 * Auto-generate QR code when text changes (with debounce)
 */
let debounceTimer;
document.getElementById('textInput').addEventListener('input', function() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        if (this.value.trim()) {
            generateQR();
        }
    }, 1000);
});