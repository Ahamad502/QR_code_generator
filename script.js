// This would normally be in a separate server.js file
// For this demo, we'll simulate the backend with frontend code
document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const qrContentInput = document.getElementById('qr-content');
    const generateBtn = document.getElementById('generate-btn');
    const qrPlaceholder = document.getElementById('qr-placeholder');
    const qrResult = document.getElementById('qr-result');
    const qrCanvas = document.getElementById('qr-canvas');
    const downloadPngBtn = document.getElementById('download-png');
    const downloadSvgBtn = document.getElementById('download-svg');
    const downloadBtns = document.getElementById('download-btns');
    
    // Customization controls
    const qrColor = document.getElementById('qr-color');
    const qrBgColor = document.getElementById('qr-bgcolor');
    const qrSize = document.getElementById('qr-size');
    const sizeValue = document.getElementById('size-value');
    const qrMargin = document.getElementById('qr-margin');
    const marginValue = document.getElementById('margin-value');
    const qrError = document.getElementById('qr-error');
    
    // Update size and margin display values
    qrSize.addEventListener('input', () => sizeValue.textContent = qrSize.value);
    qrMargin.addEventListener('input', () => marginValue.textContent = qrMargin.value);
    
    // Generate QR code
    generateBtn.addEventListener('click', generateQRCode);
    
    // Download handlers
    downloadPngBtn.addEventListener('click', downloadPNG);
    downloadSvgBtn.addEventListener('click', downloadSVG);
    
    // Generate QR code function
    function generateQRCode() {
        const content = qrContentInput.value.trim();
        
        if (!content) {
            alert('Please enter a URL or text to generate a QR code');
            return;
        }
        
        // Show loading state
        generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Generating...';
        generateBtn.disabled = true;
        
        // Simulate backend processing delay
        setTimeout(() => {
            try {
                // In a real app, this would be an API call to your backend
                // For this demo, we'll use a frontend QR code library
                
                // Load QRCode.js dynamically
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/qrcode@1.5.1/build/qrcode.min.js';
                script.onload = () => {
                    const options = {
                        color: {
                            dark: qrColor.value,
                            light: qrBgColor.value
                        },
                        width: parseInt(qrSize.value),
                        margin: parseInt(qrMargin.value),
                        errorCorrectionLevel: qrError.value
                    };
                    
                    QRCode.toCanvas(qrCanvas, content, options, (error) => {
                        if (error) {
                            console.error(error);
                            alert('Failed to generate QR code. Please try again.');
                            resetGenerateButton();
                            return;
                        }
                        
                        // Show the result
                        qrPlaceholder.classList.add('hidden');
                        qrResult.classList.remove('hidden');
                        downloadBtns.classList.remove('hidden');
                        resetGenerateButton();
                    });
                };
                document.body.appendChild(script);
                
            } catch (error) {
                console.error('QR generation error:', error);
                alert('An error occurred while generating the QR code.');
                resetGenerateButton();
            }
        }, 500);
    }
    
    function resetGenerateButton() {
        generateBtn.innerHTML = 'Generate';
        generateBtn.disabled = false;
    }
    
    // Download as PNG
    function downloadPNG() {
        const link = document.createElement('a');
        link.download = 'qr-code.png';
        link.href = qrCanvas.toDataURL('image/png');
        link.click();
    }
    
    // Download as SVG
    function downloadSVG() {
        const content = qrContentInput.value.trim();
        const options = {
            color: {
                dark: qrColor.value,
                light: qrBgColor.value
            },
            margin: parseInt(qrMargin.value),
            errorCorrectionLevel: qrError.value
        };
        
        // Load QRCode.js for SVG generation
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/qrcode@1.5.1/build/qrcode.min.js';
        script.onload = () => {
            QRCode.toString(content, options, (err, svg) => {
                if (err) {
                    console.error(err);
                    alert('Failed to generate SVG. Please try again.');
                    return;
                }
                
                const blob = new Blob([svg], {type: 'image/svg+xml'});
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.download = 'qr-code.svg';
                link.href = url;
                link.click();
                URL.revokeObjectURL(url);
            });
        };
        document.body.appendChild(script);
    }
    
    // In a real implementation, you would have a backend server like this:
    /*
    // server.js
    const express = require('express');
    const qrcode = require('qrcode');
    const app = express();
    const port = 3000;
    
    app.use(express.json());
    app.use(express.static('public'));
    
    app.post('/generate-qr', async (req, res) => {
        try {
            const { content, color, bgColor, size, margin, errorCorrection } = req.body;
            
            const options = {
                color: {
                    dark: color || '#000000',
                    light: bgColor || '#ffffff'
                },
                width: size || 200,
                margin: margin || 4,
                errorCorrectionLevel: errorCorrection || 'M'
            };
            
            const dataUrl = await qrcode.toDataURL(content, options);
            res.json({ success: true, dataUrl });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Failed to generate QR code' });
        }
    });
    
    app.listen(port, () => {
        console.log(`QR Code Generator running on http://localhost:${port}`);
    });
    */
});
