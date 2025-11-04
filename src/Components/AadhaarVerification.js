import React, { useState } from 'react';
import './AadhaarVerification.css';
import axios from 'axios';
import { HandPlatter } from 'lucide-react';

const AadhaarVerification = ({handleSubmit,setShowAadhaarVerificationPage,formDetails, setFormDetails}) => {
  const [step, setStep] = useState(1);
  const [aadhaarNumber, setAadhaarNumber] = useState(formDetails.aadharNumber || '');
  const [otp, setOtp] = useState('');
  const [referenceId, setReferenceId] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userData, setUserData] = useState(null);
  const [consent, setConsent] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);


  const handleBack = ()=>{
    setStep(1);
  }

  const validateAadhaar = (aadhaar) => {
    // Basic validation: 12 digits
    const aadhaarRegex = /^\d{12}$/;
    return aadhaarRegex.test(aadhaar);
  };

  const validateMobile = (mobile) => {
    // Basic validation: 10 digits
    const mobileRegex = /^\d{10}$/;
    return mobileRegex.test(mobile);
  };

  const formatAadhaar = (value) => {
    // Format as XXXX XXXX XXXX
    const cleaned = value.replace(/\D/g, '');
    const matches = cleaned.match(/(\d{0,4})(\d{0,4})(\d{0,4})/);
    
    if (matches) {
      return matches
        .slice(1)
        .filter(segment => segment)
        .join(' ');
    }
    return cleaned;
  };

  const handleGenerateOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    const cleanAadhaar = aadhaarNumber.replace(/\s/g, '');
    
    if (!validateAadhaar(cleanAadhaar)) {
      setError('Please enter a valid 12-digit Aadhaar number');
      return;
    }
    
    if (!consent) {
      setError('Please provide consent to proceed with verification');
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:4000/api/aadhaar/generate-otp', {
        aadhaarNumber: cleanAadhaar,
        purpose: 'ForKYC',
        consent: 'Y'
      });
      
      console.log('Generate OTP Response:', response);
      console.log('Response Status:', response.status);
      console.log('Response Data:', response.data);
      
      // Backend now returns consistent format with success field
      if (response.data.success && response.data.reference_id) {
        setReferenceId(response.data.reference_id);
        setSuccess(response.data.message || 'OTP has been sent to your registered mobile number');
        startResendCountdown();
        setStep(2);
      } else if (response.data.success) {
        // Success but no reference_id (unusual but handle it)
        setSuccess(response.data.message || 'OTP has been sent to your registered mobile number');
        startResendCountdown();
        setStep(2);
      } else {
        setError(response.data.message || 'Failed to generate OTP');
      }
    } catch (err) {
      console.error('Error generating OTP:', err);
      handleApiError(err, 'generate OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    
    if (mobileNumber && !validateMobile(mobileNumber)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:4000/api/aadhaar/verify-otp', {
        otp,
        referenceId,
        mobileNumber: mobileNumber || '',
        purpose: 'ForKYC',
        consent: 'Y',
        generatePdf: false
      });
      
      console.log('Verify OTP Response:', response);
      console.log('Response Status:', response.status);
      console.log('Response Data:', response.data);
      
      // Backend now returns consistent format
      if (response.data.success && response.data.data) {
        setSuccess(response.data.message || 'Aadhaar verification successful!');
        
        // Extract user data
        const extractedData = response.data.data;
        console.log('Received verification data:', extractedData);
        
        setUserData(extractedData);
        
        // Update form details
        setFormDetails((prev)=> ({
          ...prev,
          aadhaarVerified: true,
          aadhaarData: extractedData
        }));
        
        setStep(3);
      } else {
        setError(response.data.message || 'OTP verification failed. Please try again.');
      }
    } catch (err) {
      console.error('Error verifying OTP:', err);
      handleApiError(err, 'verify OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendDisabled) return;
    
    setError('');
    setSuccess('');
    
    const cleanAadhaar = aadhaarNumber.replace(/\s/g, '');
    
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:4000/api/aadhaar/generate-otp', {
        aadhaarNumber: cleanAadhaar,
        purpose: 'ForKYC',
        consent: 'Y'
      });
      
      console.log('Resend OTP Response:', response.data);
      
      if (response.data.success && response.data.reference_id) {
        setReferenceId(response.data.reference_id);
        setSuccess(response.data.message || 'OTP has been resent to your registered mobile number');
        startResendCountdown();
      } else if (response.data.success) {
        setSuccess(response.data.message || 'OTP has been resent to your registered mobile number');
        startResendCountdown();
      } else {
        setError(response.data.message || 'Failed to resend OTP');
      }
    } catch (err) {
      console.error('Error resending OTP:', err);
      handleApiError(err, 'resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleApiError = (err, action) => {
    console.error(`Error during ${action}:`, err);
    
    if (err.response) {
      const statusCode = err.response.status;
      const responseData = err.response.data;
      
      console.log('Error Response Data:', responseData);
      
      // Backend now returns consistent error format
      if (responseData.message) {
        setError(responseData.message);
      } else if (statusCode === 400) {
        setError(responseData.message || `Invalid request while trying to ${action}`);
      } else if (statusCode === 401) {
        setError("Authentication failed. Please try again later.");
      } else if (statusCode === 403) {
        setError("Access denied. You don't have permission to perform this action.");
      } else if (statusCode === 409) {
        // Verification pending - check if we got a reference_id
        if (responseData.reference_id) {
          setReferenceId(responseData.reference_id);
          setSuccess('A verification is already pending. OTP has been sent to your registered mobile number');
          startResendCountdown();
          setStep(2);
          return;
        } else {
          setError(responseData.message || `Conflict while trying to ${action}`);
        }
      } else if (statusCode === 422) {
        setError("Invalid Aadhaar number format. Please check and try again.");
      } else if (statusCode === 500) {
        if (responseData.sub_code === "INVALID_SESSION") {
          setError("Your session has expired. Please start over.");
        } else if (responseData.sub_code === "SOURCE_FAILURE") {
          setError("There was an issue with the verification service. Please try again later.");
        } else {
          setError(responseData.message || `Server error while trying to ${action}`);
        }
      } else {
        setError(responseData.message || responseData.detail || `Failed to ${action}. Please try again.`);
      }
    } else if (err.request) {
      setError(`Network error. Please check your connection and try again.`);
    } else {
      setError(`Something went wrong while trying to ${action}. Please try again.`);
    }
  };

  const startResendCountdown = () => {
    setResendDisabled(true);
    setCountdown(30);
    
    const timer = setInterval(() => {
      setCountdown(prevCount => {
        if (prevCount <= 1) {
          clearInterval(timer);
          setResendDisabled(false);
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);
  };

  const handleStartOver = () => {
    setStep(1);
    setAadhaarNumber('');
    setOtp('');
    setReferenceId('');
    setMobileNumber('');
    setError('');
    setSuccess('');
    setUserData(null);
    setConsent(false);
  };

  // Format address object into a readable string
  const formatAddress = (addressObj) => {
    if (!addressObj) return '';
    
    if (typeof addressObj === 'string') {
      return addressObj;
    }
    
    // Format the address object into a readable string
    const parts = [];
    
    if (addressObj.house) parts.push(addressObj.house);
    if (addressObj.street) parts.push(addressObj.street);
    if (addressObj.landmark) parts.push(`Near ${addressObj.landmark}`);
    if (addressObj.locality) parts.push(addressObj.locality);
    if (addressObj.vtc) parts.push(addressObj.vtc);
    if (addressObj.subDistrict) parts.push(addressObj.subDistrict);
    if (addressObj.district) parts.push(addressObj.district);
    if (addressObj.state) parts.push(addressObj.state);
    if (addressObj.pin) parts.push(`PIN: ${addressObj.pin}`);
    
    return parts.join(', ');
  };
  
  // Get user photo from response
  const getUserPhoto = (userData) => {
    if (userData.face_image) {
      return `data:image/jpeg;base64,${userData.face_image}`;
    } else if (userData.photo) {
      return `data:image/jpeg;base64,${userData.photo}`;
    }
    return null;
  };

  return (
    <div className="aadhaar-verification-container">
      <div className="verification-card">
        <div className="card-header">
          <h1>Aadhaar eKYC Verification</h1>
          <div className="step-indicator">
            <div className={`step ${step >= 1 ? 'active' : ''}`}>1</div>
            <div className="step-line"></div>
            <div className={`step ${step >= 2 ? 'active' : ''}`}>2</div>
            <div className="step-line"></div>
            <div className={`step ${step >= 3 ? 'active' : ''}`}>3</div>
          </div>
        </div>
        
        {error && <div className="error-message"><i className="error-icon">!</i>{error}</div>}
        {success && <div className="success-message"><i className="success-icon">✓</i>{success}</div>}
        
        {step === 1 && (
          <form onSubmit={handleGenerateOTP} className="verification-form">
            <div className="form-description">
              Enter your 12-digit Aadhaar number to begin the verification process
            </div>
            
            <div className="form-group">
              <label htmlFor="aadhaar">Aadhaar Number</label>
              <input
                type="text"
                id="aadhaar"
                value={aadhaarNumber}
                onChange={(e) => setAadhaarNumber(formatAadhaar(e.target.value))}
                placeholder="XXXX XXXX XXXX"
                maxLength={14}
                required
              />
            </div>
            
            <div className="consent-section">
              <label className="checkbox-container">
                <input 
                  type="checkbox" 
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)} 
                  required 
                />
                <span className="checkmark"></span>
                I consent to verify my Aadhaar and authorize the use of my Aadhaar details for KYC purpose
              </label>
            </div>
            
            <button type="submit" disabled={loading} className="submit-button">
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Processing...
                </>
              ) : (
                'Generate OTP'
              )}
            </button>
          </form>
        )}
        
        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="verification-form">
            <div className="form-description">
              An OTP has been sent to your Aadhaar-registered mobile number
            </div>
            
            <div className="form-group">
              <label htmlFor="otp">Enter OTP</label>
              <div className="otp-input-container">
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="6-digit OTP"
                  maxLength={6}
                  required
                />
              </div>
              <div className="resend-container">
                {resendDisabled ? (
                  <span className="countdown">Resend OTP in {countdown}s</span>
                ) : (
                  <button 
                    type="button" 
                    onClick={handleResendOTP} 
                    className="resend-button"
                    disabled={loading}
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="mobile">Mobile Number (Optional)</label>
              <input
                type="text"
                id="mobile"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="10-digit mobile number"
                maxLength={10}
              />
              <div className="input-hint">
                Enter only if you want to verify with a different mobile number
              </div>
            </div>
            
            <div className="button-group">
              <button type="button" onClick={handleStartOver} className="back-button">
                Back
              </button>
              <button type="submit" disabled={loading} className="submit-button">
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Verifying...
                  </>
                ) : (
                  'Verify OTP'
                )}
              </button>
            </div>
          </form>
        )}
        
        {step === 3 && userData && (
          <div className="verification-result">
            <div className="result-header">
              <div className="verification-success-icon">✓</div>
              <h2>Verification Successful</h2>
            </div>
            
            <div className="user-details">
              {getUserPhoto(userData) && (
                <div className="user-image">
                  <img src={getUserPhoto(userData)} alt="User" />
                </div>
              )}
              
              <div className="details-container">
                {userData.name && (
                  <div className="detail-row">
                    <div className="detail-label">Name</div>
                    <div className="detail-value">{userData.name}</div>
                  </div>
                )}
                
                {userData.gender && (
                  <div className="detail-row">
                    <div className="detail-label">Gender</div>
                    <div className="detail-value">
                      {userData.gender === 'M' ? 'Male' : 
                       userData.gender === 'F' ? 'Female' : 
                       userData.gender === 'T' ? 'Transgender' : 
                       userData.gender}
                    </div>
                  </div>
                )}
                
                {(userData.dob || userData.dateOfBirth) && (
                  <div className="detail-row">
                    <div className="detail-label">Date of Birth</div>
                    <div className="detail-value">{userData.dob || userData.dateOfBirth}</div>
                  </div>
                )}
                
                {userData.address && (
                  <div className="detail-row">
                    <div className="detail-label">Address</div>
                    <div className="detail-value address">{formatAddress(userData.address)}</div>
                  </div>
                )}
                
                {userData.maskedNumber && (
                  <div className="detail-row">
                    <div className="detail-label">Aadhaar Number</div>
                    <div className="detail-value">{userData.maskedNumber}</div>
                  </div>
                )}
                
                {userData.phone && (
                  <div className="detail-row">
                    <div className="detail-label">Phone</div>
                    <div className="detail-value">
                      <span className="masked-data">Verified ✓</span>
                    </div>
                  </div>
                )}
                
                {userData.email && (
                  <div className="detail-row">
                    <div className="detail-label">Email</div>
                    <div className="detail-value">
                      <span className="masked-data">Verified ✓</span>
                    </div>
                  </div>
                )}
                
                {userData.aadhaar_linked_mobile_match && (
                  <div className="detail-row">
                    <div className="detail-label">Mobile Match</div>
                    <div className="detail-value">{userData.aadhaar_linked_mobile_match}</div>
                  </div>
                )}
              </div>
            </div>
            
            <button onClick={handleBack} className="back-button">
                Back
            </button>

            <button onClick={handleSubmit} className="submit-button">
                Submit donor details
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AadhaarVerification;