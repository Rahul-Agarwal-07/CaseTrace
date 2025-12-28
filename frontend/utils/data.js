// Frontend data storage utilities
import { getRole } from './auth';

// localStorage-based storage (simulated database)
const STORAGE_KEYS = {
  CASES: 'dems_cases',
  EVIDENCE: 'dems_evidence',
  AUDIT_TRAIL: 'dems_audit_trail',
};

// Helper functions for localStorage
const getStorageData = (key, defaultValue = []) => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    return defaultValue;
  }
};

const setStorageData = (key, data) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Case management
// export const addCase = (caseData) => {
//   const cases = getStorageData(STORAGE_KEYS.CASES);
//   const newCase = {
//     id: Date.now().toString(),
//     name: caseData.name,
//     description: caseData.description,
//     createdAt: new Date().toISOString(),
//   };
//   cases.push(newCase);
//   setStorageData(STORAGE_KEYS.CASES, cases);
  
//   addAuditTrail({
//     caseName: newCase.name,
//     evidenceName: 'N/A',
//     action: 'Case Created',
//     userRole: getRole(),
//     timestamp: newCase.createdAt,
//   });
  
//   return newCase;
// };

export const getCases = () => {
  return getStorageData(STORAGE_KEYS.CASES);
};

// Evidence management
export const addEvidence = (evidenceData) => {
  const evidence = getStorageData(STORAGE_KEYS.EVIDENCE);
  const cases = getStorageData(STORAGE_KEYS.CASES);
  
  const newEvidence = {
    id: Date.now().toString(),
    caseId: evidenceData.caseId,
    name: evidenceData.name,
    description: evidenceData.description,
    uploadedAt: new Date().toISOString(),
    verified: false,
  };
  evidence.push(newEvidence);
  setStorageData(STORAGE_KEYS.EVIDENCE, evidence);
  
  const caseObj = cases.find(c => c.id === evidenceData.caseId);
  addAuditTrail({
    caseName: caseObj ? caseObj.name : 'Unknown',
    evidenceName: newEvidence.name,
    action: 'Evidence Uploaded',
    userRole: getRole(),
    timestamp: newEvidence.uploadedAt,
  });
  
  return newEvidence;
};

export const getEvidence = () => {
  return getStorageData(STORAGE_KEYS.EVIDENCE);
};

export const verifyEvidence = (evidenceId) => {
  const evidence = getStorageData(STORAGE_KEYS.EVIDENCE);
  const cases = getStorageData(STORAGE_KEYS.CASES);
  
  const ev = evidence.find(e => e.id === evidenceId);
  if (ev) {
    ev.verified = true;
    setStorageData(STORAGE_KEYS.EVIDENCE, evidence);
    
    const caseObj = cases.find(c => c.id === ev.caseId);
    addAuditTrail({
      caseName: caseObj ? caseObj.name : 'Unknown',
      evidenceName: ev.name,
      action: 'Evidence Verified',
      userRole: getRole(),
      timestamp: new Date().toISOString(),
    });
  }
  return ev;
};

// Audit trail
const addAuditTrail = (entry) => {
  const auditTrail = getStorageData(STORAGE_KEYS.AUDIT_TRAIL);
  auditTrail.push({
    id: Date.now().toString(),
    ...entry,
  });
  setStorageData(STORAGE_KEYS.AUDIT_TRAIL, auditTrail);
};

export const getAuditTrail = () => {
  const auditTrail = getStorageData(STORAGE_KEYS.AUDIT_TRAIL);
  return auditTrail.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};


