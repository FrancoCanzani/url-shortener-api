import QRCode from 'qrcode';
import yup from 'yup';

export const generateQR = async (req, res) => {
  const { url } = req.params;

  const urlValidation = yup.string().url();

  if (!urlValidation.isValidSync(decodedURL)) {
    return res.status(400).send('Invalid URL');
  }

  const decodedURL = decodeURIComponent(url);

  const options = {
    errorCorrectionLevel: 'H',
    width: 400,
  };

  try {
    const QR = await QRCode.toDataURL(decodedURL, options);
    res.setHeader('Content-Type', 'image/png');
    res.type('image/png'); // Set the content type
    res.send(Buffer.from(QR.split(',')[1], 'base64'));
  } catch (err) {
    res.status(500).send('Error generating QR code');
  }
};
