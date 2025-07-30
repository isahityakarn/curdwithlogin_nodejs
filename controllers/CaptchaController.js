const { v4: uuidv4 } = require('uuid');
const CryptoJS = require('crypto-js');
const Captcha = require('../models/Captcha');

class CaptchaController {
  static decryptData(encryptedData) {
    try {
      const secretKey = process.env.REACT_APP_SECRET_KEY || 'your-secret-key';
      const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
      const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
      // console.log("Decrypted data:", decryptedText);
      
      return JSON.parse(decryptedText);
    } catch (error) {
      console.error('❌ Decryption failed:', error);
      return null;
    }
  }

  static async getCaptchaRequest(req, res) {
    try {
      let browserInfo, captcha;
      
      if (req.body.data) {
        const decryptedData = CaptchaController.decryptData(req.body.data);
        
        if (!decryptedData) {
          return res.status(400).json({ 
            success: false, 
            message: 'Failed to decrypt data' 
          });
        }
        
        browserInfo = decryptedData.browserInfo;
        captcha = decryptedData.captcha;
        // console.log("captcha:", typeof(captcha));
        
      } else {
        browserInfo = req.body.browserInfo;
        captcha = req.body.captcha;
      }

      if (!captcha) {
        return res.status(400).json({ 
          success: false, 
          message: 'CAPTCHA must be a valid 6-digit number and string' 
        });
      }

      if (!browserInfo || typeof browserInfo !== 'object') {
        return res.status(400).json({ 
          success: false, 
          message: 'Browser information is required' 
        });
      }

      const token = uuidv4();

      await Captcha.create(token, captcha, browserInfo);

      const response = { 
        success: true, 
        message: 'Get CAPTCHA successfully', 
        token 
      };
      
      res.json(response);
    } catch (error) {
      console.error('❌ Error in getCaptchaRequest:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Database error' 
      });
    }
  }

  static async verifyCaptcha(req, res) {
    
    try {
      let token, captcha, browserInfo;
      
      if (req.body.data) {
        const decryptedData = CaptchaController.decryptData(req.body.data);
        
        if (!decryptedData) {
          return res.status(400).json({ 
            success: false, 
            message: 'Failed to decrypt data' 
          });
        }
        
        token = decryptedData.token;
        captcha = decryptedData.captcha;
        browserInfo = decryptedData.browserInfo;
      } else {
        token = req.body.token;
        captcha = req.body.captcha;
        browserInfo = req.body.browserInfo;
      }

      if (!token || !captcha || !browserInfo) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required fields' 
        });
      }

      const result = await Captcha.verify(token, captcha, browserInfo);

      if (!result.success) {
        const statusCode = result.message === 'Token not found' ? 404 : 400;
        return res.status(statusCode).json(result);
      }

      res.json(result);
    } catch (error) {
      console.error('❌ Error in verifyCaptcha:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Server error' 
      });
    }
  }
}

module.exports = CaptchaController;
