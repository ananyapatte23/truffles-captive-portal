import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Wifi,
  Check,
  Loader2,
  Shield,
  User,
  Phone,
  Mail,
  UserPlus,
  KeyRound,
  X,
  FileText,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

export const Screen1CaptivePortal: React.FC = () => {
  const {
    setCurrentScreen,
    selectedTable,
    setSelectedTable,
    branchName,
    setIsWifiConnected,
    userInfo,
    setUserInfo,
    addToast,
    findRegisteredUserByPhone,
  } = useApp();

  // Navigation tab state: 'new_guest' or 'returning_member'
  const [activeTab, setActiveTab] = useState<'new_guest' | 'returning_member'>('new_guest');

  // Existing user detection from saved localStorage/context
  const isExistingUser = Boolean(userInfo.phoneNumber && userInfo.fullName);

  // Form Fields
  const [fullName, setFullName] = useState(userInfo.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(userInfo.phoneNumber || '');
  const [email, setEmail] = useState(userInfo.email || '');
  const [optInMarketing, setOptInMarketing] = useState(userInfo.optInMarketing ?? true);
  const [acceptTerms, setAcceptTerms] = useState(true);

  // OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);

  // Form Submission & Validation States
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnectedSuccess, setIsConnectedSuccess] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showTableSelector, setShowTableSelector] = useState(false);

  // Registered user lookup for current entered phone number
  const isPhoneValid = /^[6-9]\d{9}$/.test(phoneNumber.trim());
  const existingRegisteredUser = isPhoneValid ? findRegisteredUserByPhone(phoneNumber) : undefined;

  // Auto fill name/email if user switches to returning member tab or enters a registered phone number in returning member tab
  useEffect(() => {
    if (activeTab === 'returning_member' && existingRegisteredUser) {
      if (!fullName || fullName !== existingRegisteredUser.fullName) {
        setFullName(existingRegisteredUser.fullName);
      }
      if (existingRegisteredUser.email && (!email || email !== existingRegisteredUser.email)) {
        setEmail(existingRegisteredUser.email);
      }
    }
  }, [activeTab, existingRegisteredUser, fullName, email]);

  // Reset OTP whenever Phone Number or Name changes, ensuring user must re-verify
  const handleNameChange = (val: string) => {
    setFullName(val);
    if (isOtpVerified || otpSent) {
      setIsOtpVerified(false);
      setOtpSent(false);
      setOtpCode('');
    }
  };

  const handlePhoneChange = (val: string) => {
    const cleaned = val.replace(/\D/g, '');
    setPhoneNumber(cleaned);
    if (isOtpVerified || otpSent) {
      setIsOtpVerified(false);
      setOtpSent(false);
      setOtpCode('');
    }
  };

  // Auto-verify OTP when 4 digits are entered - state change only (NO toast in effect)
  useEffect(() => {
    if (otpCode.length === 4) {
      if (otpCode === '1234') {
        if (!isOtpVerified) {
          setIsOtpVerified(true);
        }
      } else {
        if (isOtpVerified) {
          setIsOtpVerified(false);
        }
      }
    } else if (otpCode.length < 4 && isOtpVerified) {
      setIsOtpVerified(false);
    }
  }, [otpCode, isOtpVerified]);

  // OTP Countdown Timer Effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpCountdown > 0) {
      timer = setTimeout(() => setOtpCountdown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpCountdown]);

  // Validation Functions
  const isNameValid = fullName.trim().length >= 2;
  const isEmailValid = email.trim() === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  // Error Messages
  const errors = {
    fullName: touched.fullName && !isNameValid ? 'Full name is required (at least 2 characters)' : '',
    phoneNumber: touched.phoneNumber && !isPhoneValid ? 'Enter a valid 10-digit mobile number starting with 6-9' : '',
    email: touched.email && !isEmailValid ? 'Please enter a valid email address' : '',
    terms: touched.terms && !acceptTerms ? 'You must accept the Wi-Fi Terms of Use' : '',
    otp: otpSent && !isOtpVerified && otpCode.length === 4 && otpCode !== '1234' ? 'Invalid OTP code. Enter 1234 for demo.' : '',
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSendOtp = () => {
    setTouched((prev) => ({ ...prev, phoneNumber: true }));
    if (!isPhoneValid) {
      addToast('Please enter a valid 10-digit mobile number first', 'info');
      return;
    }

    if (activeTab === 'new_guest' && existingRegisteredUser) {
      addToast(`Mobile number +91 ${phoneNumber} is already registered. Please switch to Returning Member tab.`, 'info');
      return;
    }

    if (activeTab === 'returning_member' && !existingRegisteredUser) {
      addToast(`Mobile number +91 ${phoneNumber} is not registered yet. Please switch to New Guest Access to register.`, 'info');
      return;
    }

    setOtpSent(true);
    setOtpCountdown(30);
    setOtpCode('');
    setIsOtpVerified(false);
    addToast(`📱 Demo OTP sent to +91 ${phoneNumber}. Code is 1234`, 'success');
  };

  const handleVerifyOtp = () => {
    if (otpCode === '1234') {
      if (!isOtpVerified) {
        setIsOtpVerified(true);
        addToast('✓ Mobile number verified!', 'success');
      }
    } else {
      setIsOtpVerified(false);
      addToast('Invalid OTP code. Use 1234 for demo.', 'info');
    }
  };

  // Quick Reconnect for Saved User
  const handleQuickReconnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnectedSuccess(true);
      setIsWifiConnected(true);
      addToast(`Welcome back ${userInfo.fullName}! Connected to Wi-Fi.`, 'success');
      setTimeout(() => {
        setCurrentScreen('landing');
      }, 1000);
    }, 1200);
  };

  // Switch Account or Clear Saved Session
  const handleSwitchUser = () => {
    setUserInfo({ fullName: '', phoneNumber: '', email: '', optInMarketing: true });
    setFullName('');
    setPhoneNumber('');
    setEmail('');
    setOtpSent(false);
    setIsOtpVerified(false);
    setOtpCode('');
    setTouched({});
    addToast('Cleared saved session. Please register or sign in.', 'info');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({
      fullName: true,
      phoneNumber: true,
      email: true,
      terms: true,
    });

    if (!isPhoneValid) {
      addToast('Please enter a valid 10-digit mobile number', 'info');
      return;
    }

    // STRICT VALIDATION: Check existing registered user
    if (activeTab === 'new_guest') {
      if (!isNameValid) {
        addToast('Please enter your full name (min 2 characters)', 'info');
        return;
      }

      if (existingRegisteredUser) {
        addToast(`Mobile number +91 ${phoneNumber} is already registered. Please switch to the Returning Member tab to sign in.`, 'info');
        return;
      }
    }

    if (activeTab === 'returning_member') {
      if (!existingRegisteredUser) {
        addToast(`Mobile number +91 ${phoneNumber} is not registered yet. Please switch to New Guest Access to register.`, 'info');
        return;
      }
    }

    if (!otpSent || !isOtpVerified) {
      if (!otpSent) {
        addToast('Please click "SEND OTP" to receive code', 'info');
      } else {
        addToast('Please enter and verify the 4-digit OTP code (1234)', 'info');
      }
      return;
    }

    if (!isEmailValid) {
      addToast('Please enter a valid email address', 'info');
      return;
    }

    if (!acceptTerms) {
      addToast('You must accept the Wi-Fi Terms of Use', 'info');
      return;
    }

    setIsConnecting(true);

    const finalName = activeTab === 'returning_member'
      ? (existingRegisteredUser?.fullName || fullName || 'Truffles VIP Member')
      : fullName;

    setUserInfo({
      fullName: finalName,
      phoneNumber,
      email,
      optInMarketing,
    });

    setTimeout(() => {
      setIsConnecting(false);
      setIsConnectedSuccess(true);
      setIsWifiConnected(true);

      addToast('🎁 Welcome Voucher Unlocked! 15% OFF applied.', 'success');

      setTimeout(() => {
        setCurrentScreen('landing');
      }, 1000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col justify-between p-3 sm:p-6 text-[#2D2D2D] relative overflow-hidden">
      {/* Background subtle ambiance */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#800020]/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#F0EEE6] rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-md mx-auto w-full my-auto py-4 sm:py-6 flex flex-col items-center">
        
        {/* Existing User Quick Reconnect Box */}
        {isExistingUser && (
          <div className="w-full bg-[#FDF0F2] border border-[#F5D0D6] rounded-3xl p-5 mb-5 shadow-sm text-left relative overflow-hidden animate-fade-in">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#800020] text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
                  {userInfo.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black uppercase text-[#800020] tracking-wider">
                      WELCOME BACK
                    </span>
                    <span className="bg-[#800020]/10 text-[#800020] text-[9px] font-extrabold px-2 py-0.5 rounded-full border border-[#800020]/20">
                      SAVED MEMBER
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-[#1A1A1A]">
                    {userInfo.fullName}
                  </h3>
                  <p className="text-xs text-[#8A8475] font-medium">
                    +91 {userInfo.phoneNumber} {userInfo.email ? `• ${userInfo.email}` : ''}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#F5D0D6]/60 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleQuickReconnect}
                disabled={isConnecting || isConnectedSuccess}
                className="w-full py-3.5 px-4 bg-[#800020] hover:bg-[#600018] text-white rounded-xl font-extrabold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>RECONNECTING...</span>
                  </>
                ) : isConnectedSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>CONNECTED!</span>
                  </>
                ) : (
                  <>
                    <Wifi className="w-4 h-4" />
                    <span>1-CLICK QUICK CONNECT TO WI-FI</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleSwitchUser}
                className="text-[11px] text-[#8A8475] hover:text-[#800020] font-bold text-center underline pt-1"
              >
                Not {userInfo.fullName}? Switch account or register as new guest
              </button>
            </div>
          </div>
        )}

        {/* Main Card with Top Bar & Tabs */}
        <div className="bg-white rounded-3xl shadow-sm border border-[#E5E2D9] w-full overflow-hidden relative">
          
          {/* Top Red Gradient Bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#800020] via-red-600 to-[#800020]" />

          {/* Top Access Mode Tabs */}
          <div className="bg-[#FAF9F6] border-b border-[#E5E2D9] p-1.5 flex gap-1">
            <button
              type="button"
              onClick={() => {
                setActiveTab('new_guest');
                setTouched({});
              }}
              className={`flex-1 py-2.5 px-3 rounded-2xl text-xs font-black tracking-wide uppercase flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'new_guest'
                  ? 'bg-white text-[#800020] shadow-2xs border border-[#E5E2D9]'
                  : 'text-[#8A8475] hover:text-[#1A1A1A]'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5 text-[#800020]" />
              <span>NEW GUEST ACCESS</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('returning_member');
                setTouched({});
              }}
              className={`flex-1 py-2.5 px-3 rounded-2xl text-xs font-black tracking-wide uppercase flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'returning_member'
                  ? 'bg-white text-[#800020] shadow-2xs border border-[#E5E2D9]'
                  : 'text-[#8A8475] hover:text-[#1A1A1A]'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5 text-[#800020]" />
              <span>RETURNING MEMBER</span>
            </button>
          </div>

          <div className="p-5 sm:p-8 space-y-6">
            
            {/* Header Badges & Titles */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 bg-[#FDF0F2] text-[#800020] px-3.5 py-1 rounded-full text-[11px] font-extrabold border border-[#F5D0D6]">
                <Wifi className="w-3.5 h-3.5 text-[#800020]" />
                <span>TRUFFLES GUEST WI-FI</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-wider text-[#1A1A1A] uppercase pt-1">
                TRUFFLES
              </h1>

              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#8A8475]">
                {activeTab === 'new_guest'
                  ? 'NEW GUEST REGISTRATION & REWARD'
                  : 'QUICK MEMBER SIGN-IN'}
              </p>

              <div className="inline-flex items-center gap-1.5 bg-[#F5F3EF] border border-[#E5E2D9] px-3 py-1 rounded-full text-[10px] font-bold text-[#2D2D2D] mt-1">
                <Shield className="w-3 h-3 text-[#800020]" />
                <span>In-Store Wi-Fi • Table {selectedTable < 10 ? `0${selectedTable}` : selectedTable} • {branchName.split('•')[1]?.trim() || 'Koramangala'}</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* FULL NAME (Only for New Guest) */}
              {activeTab === 'new_guest' && (
                <div>
                  <label className="text-[11px] font-black uppercase tracking-wider text-[#1A1A1A] flex items-center justify-between mb-1">
                    <span>
                      FULL NAME <span className="text-[#800020]">*</span>
                    </span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#8A8475] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => handleNameChange(e.target.value)}
                      onBlur={() => handleBlur('fullName')}
                      placeholder="Enter your full name"
                      className={`w-full bg-[#FAF9F6] border rounded-xl text-sm pl-10 pr-3.5 py-3 font-medium text-[#1A1A1A] focus:outline-none transition-all placeholder:text-[#8A8475]/60 ${
                        errors.fullName
                          ? 'border-red-500 bg-red-50/20 ring-1 ring-red-500'
                          : isNameValid && touched.fullName
                          ? 'border-emerald-500 bg-emerald-50/10'
                          : 'border-[#E5E2D9] focus:ring-2 focus:ring-[#800020] focus:bg-white'
                      }`}
                    />
                  </div>
                  {errors.fullName && (
                    <span className="text-[10px] font-bold text-red-600 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {errors.fullName}
                    </span>
                  )}
                </div>
              )}

              {/* MOBILE NUMBER */}
              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-[#1A1A1A] flex items-center justify-between mb-1">
                  <span>
                    MOBILE NUMBER <span className="text-[#800020]">*</span>
                  </span>
                </label>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Phone className="w-4 h-4 text-[#8A8475] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      onBlur={() => handleBlur('phoneNumber')}
                      placeholder="10-Digit Mobile No."
                      maxLength={10}
                      className={`w-full bg-[#FAF9F6] border rounded-xl text-sm pl-10 pr-3.5 py-3 font-medium text-[#1A1A1A] focus:outline-none transition-all placeholder:text-[#8A8475]/60 ${
                        errors.phoneNumber
                          ? 'border-red-500 bg-red-50/20 ring-1 ring-red-500'
                          : isPhoneValid
                          ? 'border-emerald-500 bg-emerald-50/10'
                          : 'border-[#E5E2D9] focus:ring-2 focus:ring-[#800020] focus:bg-white'
                      }`}
                    />
                  </div>

                  {/* SEND OTP BUTTON */}
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={!isPhoneValid || otpCountdown > 0}
                    className={`px-4 py-3 rounded-xl text-xs font-black tracking-wider uppercase transition-all shrink-0 ${
                      isOtpVerified
                        ? 'bg-emerald-600 text-white'
                        : isPhoneValid
                        ? 'bg-[#800020] hover:bg-[#600018] text-white shadow-sm active:scale-98'
                        : 'bg-[#E5E2D9] text-[#8A8475] cursor-not-allowed'
                    }`}
                  >
                    {isOtpVerified ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED
                      </span>
                    ) : otpCountdown > 0 ? (
                      `RESEND (${otpCountdown}s)`
                    ) : otpSent ? (
                      'RESEND OTP'
                    ) : (
                      'SEND OTP'
                    )}
                  </button>
                </div>
                {errors.phoneNumber && (
                  <span className="text-[10px] font-bold text-red-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {errors.phoneNumber}
                  </span>
                )}

                {/* New Guest: Mobile Number Already Registered Alert */}
                {activeTab === 'new_guest' && isPhoneValid && existingRegisteredUser && (
                  <div className="mt-2.5 p-3.5 bg-amber-50/90 border border-amber-300 rounded-2xl text-left space-y-2 animate-fade-in shadow-xs">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-950">
                      <AlertTriangle className="w-4.5 h-4.5 text-amber-600 shrink-0" />
                      <span>Mobile Number Already Registered</span>
                    </div>
                    <p className="text-[11px] text-amber-900 leading-relaxed font-medium">
                      +91 {phoneNumber} is already registered in our system. Please switch to the Returning Member tab to sign in.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('returning_member');
                          if (existingRegisteredUser.email) setEmail(existingRegisteredUser.email);
                          addToast(`Switched to Returning Member tab`, 'info');
                        }}
                        className="px-3.5 py-1.5 bg-[#800020] text-white rounded-xl text-[11px] font-extrabold hover:bg-[#600018] transition-colors shadow-2xs"
                      >
                        Switch to Returning Member →
                      </button>
                    </div>
                  </div>
                )}

                {/* Returning Member: Registered Member Found Badge */}
                {activeTab === 'returning_member' && isPhoneValid && existingRegisteredUser && (
                  <div className="mt-2.5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-left flex items-center justify-between animate-fade-in">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider block">
                          REGISTERED ACCOUNT FOUND
                        </span>
                        <span className="text-xs font-extrabold text-emerald-950 block">
                          Mobile No. +91 {existingRegisteredUser.phoneNumber} Verified
                        </span>
                      </div>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  </div>
                )}

                {/* Returning Member: Mobile Number Not Found Alert */}
                {activeTab === 'returning_member' && isPhoneValid && !existingRegisteredUser && (
                  <div className="mt-2.5 p-3.5 bg-amber-50 border border-amber-300 rounded-2xl text-left space-y-2 animate-fade-in">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-950">
                      <AlertTriangle className="w-4.5 h-4.5 text-amber-600 shrink-0" />
                      <span>Mobile Number Not Registered</span>
                    </div>
                    <p className="text-[11px] text-amber-900 leading-relaxed font-medium">
                      +91 {phoneNumber} is not registered yet. Please switch to "New Guest Access" to create an account and unlock your 15% OFF welcome voucher!
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('new_guest');
                        addToast('Switched to New Guest Access registration', 'info');
                      }}
                      className="px-3.5 py-1.5 bg-[#800020] text-white rounded-xl text-[11px] font-extrabold hover:bg-[#600018] transition-colors"
                    >
                      Register as New Guest →
                    </button>
                  </div>
                )}
              </div>

              {/* OTP Input Drawer */}
              {otpSent && (
                <div className={`p-4 rounded-2xl border space-y-2.5 transition-all animate-fade-in ${
                  isOtpVerified ? 'bg-emerald-50/60 border-emerald-300' : 'bg-[#FAF9F6] border-[#800020]/30'
                }`}>
                  <div className="flex items-center justify-between text-xs font-bold text-[#800020]">
                    <span className="flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5" />
                      {isOtpVerified ? 'Mobile Number Verified!' : `Enter 4-Digit OTP sent to +91 ${phoneNumber}`}
                    </span>
                    {!isOtpVerified && (
                      <span className="text-[10px] font-extrabold bg-[#800020]/10 text-[#800020] px-2 py-0.5 rounded-full">
                        DEMO CODE: 1234
                      </span>
                    )}
                  </div>

                  {!isOtpVerified ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={4}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="1234"
                        className="flex-1 bg-white border border-[#E5E2D9] rounded-xl text-center font-mono font-bold text-lg py-2.5 text-[#1A1A1A] tracking-widest focus:outline-none focus:ring-2 focus:ring-[#800020]"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        className="px-4 bg-[#800020] text-white rounded-xl text-xs font-extrabold hover:bg-[#600018] transition-colors"
                      >
                        VERIFY
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>OTP verified! You can now connect to Wi-Fi.</span>
                    </div>
                  )}

                  {errors.otp && (
                    <span className="text-[10px] font-bold text-red-600 block">
                      {errors.otp}
                    </span>
                  )}
                </div>
              )}

              {/* EMAIL ADDRESS (OPTIONAL for New Guest) */}
              {activeTab === 'new_guest' && (
                <div>
                  <label className="text-[11px] font-black uppercase tracking-wider text-[#1A1A1A] flex items-center justify-between mb-1">
                    <span className="text-[#8A8475]">EMAIL ADDRESS (OPTIONAL)</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#8A8475] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (touched.email) handleBlur('email');
                      }}
                      onBlur={() => handleBlur('email')}
                      placeholder="your.email@domain.com"
                      className={`w-full bg-[#FAF9F6] border rounded-xl text-sm pl-10 pr-3.5 py-3 font-medium text-[#1A1A1A] focus:outline-none transition-all placeholder:text-[#8A8475]/60 ${
                        errors.email
                          ? 'border-red-500 bg-red-50/20 ring-1 ring-red-500'
                          : 'border-[#E5E2D9] focus:ring-2 focus:ring-[#800020] focus:bg-white'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <span className="text-[10px] font-bold text-red-600 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {errors.email}
                    </span>
                  )}
                </div>
              )}

              {/* Table Selection Bar */}
              <div className="pt-1">
                <div className="flex items-center justify-between bg-[#F5F3EF] p-3 rounded-xl border border-[#E5E2D9]">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#800020] text-white font-black text-xs flex items-center justify-center">
                      T{selectedTable}
                    </div>
                    <div className="text-left">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#8A8475]">
                        Seated Table
                      </div>
                      <div className="text-xs font-bold text-[#1A1A1A]">
                        Table {selectedTable} • {branchName}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowTableSelector(!showTableSelector)}
                    className="text-xs font-bold text-[#800020] hover:underline"
                  >
                    {showTableSelector ? 'Close' : 'Change'}
                  </button>
                </div>

                {/* Collapsible Table Grid */}
                {showTableSelector && (
                  <div className="mt-2 p-3 bg-[#FAF9F6] rounded-xl border border-[#E5E2D9] animate-fade-in">
                    <span className="text-[10px] font-bold uppercase text-[#8A8475] block mb-2">
                      Select Your Table Number:
                    </span>
                    <div className="grid grid-cols-6 gap-1.5">
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((tNum) => (
                        <button
                          key={tNum}
                          type="button"
                          onClick={() => {
                            setSelectedTable(tNum);
                            setShowTableSelector(false);
                          }}
                          className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                            selectedTable === tNum
                              ? 'bg-[#800020] text-white border-[#800020]'
                              : 'bg-white text-[#2D2D2D] border-[#E5E2D9] hover:bg-[#F0EEE6]'
                          }`}
                        >
                          {tNum}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Checkboxes */}
              <div className="space-y-2.5 pt-1">
                {/* Marketing Opt-in */}
                <label className="flex items-start gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={optInMarketing}
                    onChange={(e) => setOptInMarketing(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-[#800020] focus:ring-[#800020] border-[#E5E2D9] cursor-pointer"
                  />
                  <span className="text-xs text-[#8A8475] leading-snug">
                    I want to receive exclusive offers, food updates & VIP privileges from Truffles.
                  </span>
                </label>

                {/* Terms Acceptance */}
                <div>
                  <label className="flex items-start gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => {
                        setAcceptTerms(e.target.checked);
                        setTouched((p) => ({ ...p, terms: true }));
                      }}
                      className="mt-0.5 w-4 h-4 rounded text-[#800020] focus:ring-[#800020] border-[#E5E2D9] cursor-pointer"
                    />
                    <span className="text-xs text-[#8A8475] leading-snug">
                      I accept the{' '}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowTermsModal(true);
                        }}
                        className="text-[#800020] font-bold underline hover:text-[#600018]"
                      >
                        Wi-Fi Terms of Use
                      </button>{' '}
                      and acknowledge the Privacy Policy.
                    </span>
                  </label>
                  {errors.terms && (
                    <span className="text-[10px] font-bold text-red-600 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {errors.terms}
                    </span>
                  )}
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isConnecting || isConnectedSuccess}
                className={`w-full py-4 px-6 rounded-2xl font-extrabold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 mt-2 ${
                  isConnecting
                    ? 'bg-[#800020] text-white opacity-80'
                    : isConnectedSuccess
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#800020] hover:bg-[#600018] text-white shadow-[#800020]/20 active:scale-98'
                }`}
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>CONNECTING TO WI-FI...</span>
                  </>
                ) : isConnectedSuccess ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>CONNECTED TO WI-FI!</span>
                  </>
                ) : (
                  <>
                    <Wifi className="w-4 h-4" />
                    <span>CONNECT TO WI-FI →</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Terms of Use Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E5E2D9] space-y-4 max-h-[85vh] flex flex-col relative">
            <button
              onClick={() => setShowTermsModal(false)}
              className="absolute top-4 right-4 p-2 text-[#8A8475] hover:text-[#1A1A1A] rounded-full hover:bg-[#F0EEE6]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 pr-8">
              <div className="p-3 bg-[#FDF0F2] text-[#800020] rounded-2xl border border-[#F5D0D6]">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1A1A1A]">Wi-Fi Terms of Use</h3>
                <p className="text-xs text-[#8A8475]">Truffles Guest Network Policy</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto text-xs text-[#8A8475] space-y-3 pr-2 leading-relaxed bg-[#FAF9F6] p-4 rounded-2xl border border-[#E5E2D9]">
              <p className="font-bold text-[#1A1A1A]">1. Acceptable Use</p>
              <p>
                By connecting to Truffles Guest Wi-Fi, you agree to use the service responsibly. Illegal activity, spamming, or excessive bandwidth consuming behavior is strictly prohibited.
              </p>

              <p className="font-bold text-[#1A1A1A]">2. Privacy & Data</p>
              <p>
                We respect your privacy. Mobile numbers and optional details provided during sign-in are used solely for in-store order processing, loyalty privileges, and digital bill verification.
              </p>

              <p className="font-bold text-[#1A1A1A]">3. Welcome Reward Voucher</p>
              <p>
                Connecting grants you a 15% discount welcome voucher automatically applied to your table's active dining session.
              </p>
            </div>

            <button
              onClick={() => {
                setAcceptTerms(true);
                setShowTermsModal(false);
              }}
              className="w-full py-3.5 bg-[#800020] text-white rounded-xl font-bold text-xs hover:bg-[#600018] transition-colors"
            >
              I ACCEPT & CLOSE
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="max-w-md mx-auto w-full text-center text-[11px] text-[#8A8475] py-2">
        <span>Truffles In-Store Wi-Fi • High-Speed Fiber Network</span>
      </footer>
    </div>
  );
};
