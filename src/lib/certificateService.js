import { supabase, isConfigured } from './supabase';
import { calculateCertificateHash, calculateBlockHash, verifyCertificateHash } from './crypto';
import { FileStorage } from './fileStorage';

const STORAGE_KEY_CERTS = 'certichain_certificates_v1';
const STORAGE_KEY_BLOCKS = 'certichain_blocks_v1';
const STORAGE_KEY_LOGS = 'certichain_verification_logs_v1';
const STORAGE_KEY_ADMIN_SESSION = 'certichain_demo_admin_session';

/**
 * Resilient localStorage setter that prevents DOMException QuotaExceededError
 */
function safeSetItem(key, value) {
  const serialized = typeof value === 'string' ? value : JSON.stringify(value);
  try {
    localStorage.setItem(key, serialized);
  } catch (e) {
    console.warn(`localStorage quota exceeded for key "${key}". Running auto-compression...`, e);

    if (key === STORAGE_KEY_CERTS) {
      try {
        const certs = typeof value === 'string' ? JSON.parse(value) : value;
        // Strip out any oversized embedded base64 URLs
        const sanitized = certs.map((c) => {
          if (c.file_url && c.file_url.length > 300 && !c.file_url.startsWith('http')) {
            return { ...c, file_url: '' };
          }
          return c;
        });
        localStorage.setItem(key, JSON.stringify(sanitized));
        return;
      } catch (err) {
        console.error('Failed to sanitize certificates for storage:', err);
      }
    }

    // Try trimming logs to free storage quota
    try {
      localStorage.removeItem(STORAGE_KEY_LOGS);
      localStorage.setItem(key, serialized);
    } catch (err2) {
      console.warn('Storage quota full. Keeping volatile state in memory.', err2);
    }
  }
}

// Clean up any oversized base64 data currently residing in localStorage
function cleanExistingBloat() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CERTS);
    if (raw && raw.length > 50000) {
      const parsed = JSON.parse(raw);
      let modified = false;
      const cleaned = parsed.map((c) => {
        if (c.file_url && c.file_url.length > 300 && !c.file_url.startsWith('http')) {
          modified = true;
          return { ...c, file_url: '' };
        }
        return c;
      });
      if (modified) {
        localStorage.setItem(STORAGE_KEY_CERTS, JSON.stringify(cleaned));
      }
    }
  } catch (err) {
    console.warn('Error during storage cleanup:', err);
  }
}

cleanExistingBloat();

// Initial pre-populated certificates as requested
const INITIAL_DEMO_CERTS = [
  {
    id: 'cert-1',
    certificate_number: 'CERT-2026-001',
    student_name: 'Rahul Sharma',
    student_email: 'rahul.sharma@example.com',
    course: 'Bachelor of Computer Engineering',
    institution: 'ABC Institute of Technology',
    certificate_type: 'Undergraduate Degree',
    issue_date: '2026-09-15',
    expiry_date: '',
    description: 'Conferred for successfully meeting all academic requirements for the Bachelor of Computer Engineering with First Class Distinction.',
    status: 'active',
    issuer_name: 'Dr. S. K. Mehta (Registrar)',
    issuer_organization: 'ABC Institute of Technology',
    file_url: '',
    created_at: '2026-09-15T10:30:22Z',
    updated_at: '2026-09-15T10:30:22Z'
  },
  {
    id: 'cert-2',
    certificate_number: 'CERT-2026-002',
    student_name: 'Priya Patel',
    student_email: 'priya.patel@example.com',
    course: 'Full Stack Web Development',
    institution: 'XYZ University',
    certificate_type: 'Professional Certification',
    issue_date: '2026-09-20',
    expiry_date: '',
    description: 'Conferred upon demonstrating proficiency in frontend, backend, database architectures, and distributed systems.',
    status: 'active',
    issuer_name: 'Prof. Ananya Sen (Dean)',
    issuer_organization: 'XYZ University',
    file_url: '',
    created_at: '2026-09-20T11:15:00Z',
    updated_at: '2026-09-20T11:15:00Z'
  },
  {
    id: 'cert-3',
    certificate_number: 'CERT-2026-003',
    student_name: 'Aarav Shah',
    student_email: 'aarav.shah@example.com',
    course: 'Python & Data Science',
    institution: 'Tech Academy',
    certificate_type: 'Specialization Certificate',
    issue_date: '2026-09-25',
    expiry_date: '',
    description: 'Awarded for completing hands-on mastery in Python, Pandas, Machine Learning models, and Big Data processing.',
    status: 'active',
    issuer_name: 'Director Neha Verma',
    issuer_organization: 'Tech Academy',
    file_url: '',
    created_at: '2026-09-25T14:45:10Z',
    updated_at: '2026-09-25T14:45:10Z'
  },
  {
    id: 'cert-4',
    certificate_number: 'CERT-2026-004',
    student_name: 'Devendra Roy',
    student_email: 'devendra.roy@example.com',
    course: 'Advanced Network Defense',
    institution: 'CyberDefense Institute',
    certificate_type: 'Executive Diploma',
    issue_date: '2026-01-10',
    expiry_date: '',
    description: 'Revoked by authority due to institutional transfer and credential supersession.',
    status: 'revoked',
    issuer_name: 'Security Board Chair',
    issuer_organization: 'CyberDefense Institute',
    file_url: '',
    created_at: '2026-01-10T09:00:00Z',
    updated_at: '2026-02-01T12:00:00Z'
  },
  {
    id: 'cert-5',
    certificate_number: 'CERT-2026-005',
    student_name: 'Kavita Nair',
    student_email: 'kavita.nair@example.com',
    course: 'Cloud Security Associate',
    institution: 'Global Cloud Board',
    certificate_type: 'Annual Credential',
    issue_date: '2025-01-01',
    expiry_date: '2026-01-01',
    description: 'Expired validity certification.',
    status: 'expired',
    issuer_name: 'Certification Officer',
    issuer_organization: 'Global Cloud Board',
    file_url: '',
    created_at: '2025-01-01T08:00:00Z',
    updated_at: '2025-01-01T08:00:00Z'
  }
];

// Seed generator to compute initial hashes and block records
async function initializeStorageData() {
  const existingCerts = localStorage.getItem(STORAGE_KEY_CERTS);
  if (existingCerts) return;

  const seededCerts = [];
  const seededBlocks = [];
  let prevHash = '0000000000000000000000000000000000000000000000000000000000000000';

  for (let i = 0; i < INITIAL_DEMO_CERTS.length; i++) {
    const cert = { ...INITIAL_DEMO_CERTS[i] };
    const certHash = await calculateCertificateHash(cert);
    cert.certificate_hash = certHash;
    seededCerts.push(cert);

    const blockNum = i + 1;
    const blockHash = await calculateBlockHash(blockNum, prevHash, certHash, cert.created_at);

    seededBlocks.push({
      id: `block-${blockNum}`,
      certificate_id: cert.id,
      certificate_number: cert.certificate_number,
      block_number: blockNum,
      previous_hash: prevHash,
      certificate_hash: certHash,
      block_hash: blockHash,
      created_at: cert.created_at
    });

    prevHash = blockHash;
  }

  safeSetItem(STORAGE_KEY_CERTS, seededCerts);
  safeSetItem(STORAGE_KEY_BLOCKS, seededBlocks);

  // Seed sample verification logs
  const sampleLogs = [
    {
      id: 'log-1',
      certificate_number: 'CERT-2026-001',
      result: 'verified',
      reason: 'Hash match & valid status',
      hash_checked: seededCerts[0].certificate_hash,
      created_at: new Date(Date.now() - 3600000 * 5).toISOString()
    },
    {
      id: 'log-2',
      certificate_number: 'CERT-UNKNOWN-999',
      result: 'failed',
      reason: 'Certificate number does not exist',
      hash_checked: null,
      created_at: new Date(Date.now() - 3600000 * 2).toISOString()
    }
  ];
  safeSetItem(STORAGE_KEY_LOGS, sampleLogs);
}

// Guarantee storage is initialized
initializeStorageData();

export const CertificateService = {
  // Check if live Supabase is currently connected
  isLiveSupabase() {
    return isConfigured && Boolean(supabase);
  },

  // 1. Get all certificates (merging Supabase cloud + local cache)
  async getAllCertificates() {
    let supabaseCerts = [];
    if (this.isLiveSupabase()) {
      try {
        const { data, error } = await supabase
          .from('certificates')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          supabaseCerts = data;
        }
      } catch (err) {
        console.warn('Falling back to local cache:', err);
      }
    }

    const raw = localStorage.getItem(STORAGE_KEY_CERTS);
    const localCerts = raw ? JSON.parse(raw) : [];

    // Merge by certificate_number (local + supabase)
    const certMap = new Map();
    localCerts.forEach((c) => {
      if (c && c.certificate_number) {
        certMap.set(c.certificate_number.toUpperCase(), c);
      }
    });
    supabaseCerts.forEach((c) => {
      if (c && c.certificate_number) {
        certMap.set(c.certificate_number.toUpperCase(), c);
      }
    });

    return Array.from(certMap.values());
  },

  // 2. Get certificate by number (checks Supabase and local cache)
  async getCertificateByNumber(certificateNumber) {
    if (!certificateNumber) return null;
    const normalizedNumber = certificateNumber.trim().toUpperCase();

    // 1. Check live Supabase
    if (this.isLiveSupabase()) {
      try {
        const { data, error } = await supabase
          .from('certificates')
          .select('*')
          .ilike('certificate_number', normalizedNumber)
          .maybeSingle();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase lookup note:', err);
      }
    }

    // 2. Check local storage directly
    try {
      const raw = localStorage.getItem(STORAGE_KEY_CERTS);
      const localCerts = raw ? JSON.parse(raw) : [];
      const found = localCerts.find(
        (c) => c.certificate_number && c.certificate_number.toUpperCase() === normalizedNumber
      );
      if (found) return found;
    } catch (e) {
      console.warn('Local cache read error:', e);
    }

    return null;
  },

  // 3. Get blockchain block records (merging Supabase + local cache)
  async getBlockchainRecords() {
    let supabaseBlocks = [];
    if (this.isLiveSupabase()) {
      try {
        const { data, error } = await supabase
          .from('blockchain_records')
          .select('*')
          .order('block_number', { ascending: true });
        if (!error && data && data.length > 0) {
          supabaseBlocks = data;
        }
      } catch (err) {
        console.warn('Falling back to local blocks:', err);
      }
    }

    const raw = localStorage.getItem(STORAGE_KEY_BLOCKS);
    const localBlocks = raw ? JSON.parse(raw) : [];

    const blockMap = new Map();
    localBlocks.forEach((b) => {
      if (b && b.block_number) blockMap.set(String(b.block_number), b);
    });
    supabaseBlocks.forEach((b) => {
      if (b && b.block_number) blockMap.set(String(b.block_number), b);
    });

    return Array.from(blockMap.values()).sort(
      (a, b) => Number(a.block_number) - Number(b.block_number)
    );
  },

  // 4. Get blockchain record for a specific certificate
  async getBlockchainRecordForCertificate(certId, certNumber) {
    const blocks = await this.getBlockchainRecords();
    const normalizedNum = (certNumber || '').toUpperCase();
    return (
      blocks.find(
        (b) =>
          b.certificate_id === certId ||
          (b.certificate_number && b.certificate_number.toUpperCase() === normalizedNum)
      ) || null
    );
  },

  // 5. Verification logic as defined in specification
  async verifyCertificate({ certificate_number, student_name }) {
    const certNum = (certificate_number || '').trim().toUpperCase();
    const inputName = (student_name || '').trim();

    if (!certNum) {
      return {
        isVerified: false,
        status: 'error',
        reason: 'Certificate number is required',
        certificate: null
      };
    }

    // Search database for certificate
    const cert = await this.getCertificateByNumber(certNum);

    if (!cert) {
      await this.logVerification({
        certificate_number: certNum,
        result: 'failed',
        reason: 'Certificate does not exist in the database',
        hash_checked: null
      });

      return {
        isVerified: false,
        status: 'not_found',
        reason: 'The certificate number was not found in our official records.',
        certificate: null
      };
    }

    // Compare student name
    const storedNameNormalized = (cert.student_name || '').trim().toLowerCase();
    const inputNameNormalized = inputName.toLowerCase();

    if (storedNameNormalized !== inputNameNormalized) {
      await this.logVerification({
        certificate_number: certNum,
        result: 'failed',
        reason: 'Student details do not match',
        hash_checked: null
      });

      return {
        isVerified: false,
        status: 'mismatch',
        reason: 'Student name does not match the official record for this certificate.',
        certificate: cert
      };
    }

    // Verify cryptographic integrity
    const hashCheck = await verifyCertificateHash(cert, cert.certificate_hash);

    if (!hashCheck.isValid) {
      await this.logVerification({
        certificate_number: certNum,
        result: 'failed',
        reason: 'Certificate data integrity compromised (hash mismatch)',
        hash_checked: hashCheck.calculatedHash
      });

      return {
        isVerified: false,
        status: 'tampered',
        reason: 'Certificate data appears modified or compromised. Cryptographic hash mismatch.',
        certificate: cert
      };
    }

    // Check certificate status
    if (cert.status === 'revoked') {
      await this.logVerification({
        certificate_number: certNum,
        result: 'revoked',
        reason: 'Certificate has been officially revoked',
        hash_checked: cert.certificate_hash
      });

      return {
        isVerified: false,
        status: 'revoked',
        reason: 'This certificate has been officially revoked by the issuing authority.',
        certificate: cert
      };
    }

    if (cert.status === 'expired') {
      await this.logVerification({
        certificate_number: certNum,
        result: 'expired',
        reason: 'Certificate has passed its expiration date',
        hash_checked: cert.certificate_hash
      });

      return {
        isVerified: false,
        status: 'expired',
        reason: 'This certificate has expired.',
        certificate: cert
      };
    }

    // Check expiry date if specified
    if (cert.expiry_date) {
      const exp = new Date(cert.expiry_date);
      if (!isNaN(exp.getTime()) && exp < new Date()) {
        await this.logVerification({
          certificate_number: certNum,
          result: 'expired',
          reason: 'Certificate has expired based on expiration date',
          hash_checked: cert.certificate_hash
        });

        return {
          isVerified: false,
          status: 'expired',
          reason: 'This certificate has expired.',
          certificate: cert
        };
      }
    }

    // Blockchain block lookup
    const blockRecord = await this.getBlockchainRecordForCertificate(cert.id, cert.certificate_number);

    // Everything matches! Log success
    await this.logVerification({
      certificate_number: certNum,
      result: 'verified',
      reason: 'Cryptographic hash and student identity confirmed',
      hash_checked: cert.certificate_hash
    });

    return {
      isVerified: true,
      status: 'verified',
      certificate: cert,
      blockRecord: blockRecord,
      hashDetails: hashCheck
    };
  },

  // 6. Log verification attempt
  async logVerification({ certificate_number, result, reason, hash_checked }) {
    const newLog = {
      id: 'log-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      certificate_number,
      result,
      reason,
      hash_checked: hash_checked || null,
      created_at: new Date().toISOString()
    };

    if (this.isLiveSupabase()) {
      try {
        await supabase.from('verification_logs').insert([newLog]);
      } catch (err) {
        console.warn('Could not write log to Supabase:', err);
      }
    }

    const raw = localStorage.getItem(STORAGE_KEY_LOGS);
    const logs = raw ? JSON.parse(raw) : [];
    logs.unshift(newLog);
    // Keep last 50 logs to conserve quota
    if (logs.length > 50) logs.pop();
    safeSetItem(STORAGE_KEY_LOGS, logs);
  },

  // 7. Get verification logs (merges Supabase + local cache, sorted newest first)
  async getVerificationLogs() {
    let supabaseLogs = [];
    if (this.isLiveSupabase()) {
      try {
        const { data, error } = await supabase
          .from('verification_logs')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          supabaseLogs = data;
        }
      } catch (err) {
        console.warn('Falling back to local logs:', err);
      }
    }

    const raw = localStorage.getItem(STORAGE_KEY_LOGS);
    const localLogs = raw ? JSON.parse(raw) : [];

    // Combine Supabase cloud logs with local storage logs
    const logMap = new Map();
    localLogs.forEach((l) => {
      if (l && l.id) logMap.set(l.id, l);
    });
    supabaseLogs.forEach((l) => {
      if (l && l.id) logMap.set(l.id, l);
    });

    const merged = Array.from(logMap.values());
    merged.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return merged;
  },

  // 8. Issue a new Certificate
  async issueCertificate(certData) {
    const existing = await this.getCertificateByNumber(certData.certificate_number);
    if (existing) {
      throw new Error(`Certificate number ${certData.certificate_number} already exists!`);
    }

    const now = new Date().toISOString();
    const certHash = await calculateCertificateHash(certData);

    const newCert = {
      id: 'cert-' + Date.now(),
      certificate_number: certData.certificate_number.trim().toUpperCase(),
      student_name: certData.student_name.trim(),
      student_email: certData.student_email?.trim() || '',
      course: certData.course.trim(),
      institution: certData.institution.trim(),
      certificate_type: certData.certificate_type || 'Certificate of Completion',
      issue_date: certData.issue_date || now.split('T')[0],
      expiry_date: certData.expiry_date || '',
      description: certData.description || '',
      certificate_hash: certHash,
      status: certData.status || 'active',
      issuer_name: certData.issuer_name || 'Academic Dean',
      issuer_organization: certData.issuer_organization || certData.institution,
      file_url: certData.file_url || '',
      created_at: now,
      updated_at: now
    };

    // Calculate simulated blockchain block
    const allBlocks = await this.getBlockchainRecords();
    const lastBlock = allBlocks.length > 0 ? allBlocks[allBlocks.length - 1] : null;
    const prevHash = lastBlock ? lastBlock.block_hash : '0000000000000000000000000000000000000000000000000000000000000000';
    const nextBlockNum = (lastBlock ? Number(lastBlock.block_number) : 0) + 1;
    const blockHash = await calculateBlockHash(nextBlockNum, prevHash, certHash, now);

    const newBlock = {
      id: 'block-' + nextBlockNum,
      certificate_id: newCert.id,
      certificate_number: newCert.certificate_number,
      block_number: nextBlockNum,
      previous_hash: prevHash,
      certificate_hash: certHash,
      block_hash: blockHash,
      created_at: now
    };

    // Save to live Supabase if connected
    if (this.isLiveSupabase()) {
      try {
        const { error: certErr } = await supabase.from('certificates').insert([newCert]);
        if (certErr) throw certErr;
        await supabase.from('blockchain_records').insert([newBlock]);
      } catch (err) {
        console.error('Supabase insert failed:', err);
      }
    }

    // Always update local cache safely
    const allCerts = await this.getAllCertificates();
    allCerts.unshift(newCert);
    safeSetItem(STORAGE_KEY_CERTS, allCerts);

    allBlocks.push(newBlock);
    safeSetItem(STORAGE_KEY_BLOCKS, allBlocks);

    return { certificate: newCert, block: newBlock };
  },

  // 9. Update existing certificate
  async updateCertificate(certId, updateData) {
    const certs = await this.getAllCertificates();
    const index = certs.findIndex(c => c.id === certId || c.certificate_number === certId);
    if (index === -1) {
      throw new Error('Certificate not found');
    }

    const currentCert = certs[index];
    const previousCertHash = currentCert.certificate_hash;
    const now = new Date().toISOString();

    const mergedCert = {
      ...currentCert,
      ...updateData,
      updated_at: now
    };

    // Recalculate certificate hash
    const newCertHash = await calculateCertificateHash(mergedCert);
    mergedCert.certificate_hash = newCertHash;

    // Create an audit trail block record linking the change
    const allBlocks = await this.getBlockchainRecords();
    const lastBlock = allBlocks.length > 0 ? allBlocks[allBlocks.length - 1] : null;
    const prevBlockHash = lastBlock ? lastBlock.block_hash : previousCertHash;
    const nextBlockNum = (lastBlock ? Number(lastBlock.block_number) : 0) + 1;
    const blockHash = await calculateBlockHash(nextBlockNum, prevBlockHash, newCertHash, now);

    const updateBlock = {
      id: 'block-' + nextBlockNum,
      certificate_id: mergedCert.id,
      certificate_number: mergedCert.certificate_number,
      block_number: nextBlockNum,
      previous_hash: prevBlockHash,
      certificate_hash: newCertHash,
      block_hash: blockHash,
      is_update_audit: true,
      created_at: now
    };

    if (this.isLiveSupabase()) {
      try {
        await supabase
          .from('certificates')
          .update(mergedCert)
          .eq('id', mergedCert.id);

        await supabase.from('blockchain_records').insert([updateBlock]);
      } catch (err) {
        console.warn('Supabase update failed:', err);
      }
    }

    certs[index] = mergedCert;
    safeSetItem(STORAGE_KEY_CERTS, certs);

    allBlocks.push(updateBlock);
    safeSetItem(STORAGE_KEY_BLOCKS, allBlocks);

    return { certificate: mergedCert, block: updateBlock };
  },

  // 10. Delete / Revoke shortcut
  async revokeCertificate(certId, reason = 'Administrative revocation') {
    return this.updateCertificate(certId, {
      status: 'revoked',
      description: `[Revoked on ${new Date().toLocaleDateString()}]: ${reason}`
    });
  },

  // 11. Reset to initial demo dataset
  async resetDemoData() {
    localStorage.removeItem(STORAGE_KEY_CERTS);
    localStorage.removeItem(STORAGE_KEY_BLOCKS);
    localStorage.removeItem(STORAGE_KEY_LOGS);
    await initializeStorageData();
    return true;
  },

  // 12. Upload file to Supabase Storage or IndexedDB
  async uploadCertificateFile(file) {
    if (!file) return null;

    if (this.isLiveSupabase()) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `certificates/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('certificates')
          .upload(filePath, file);

        if (!uploadError) {
          const { data } = supabase.storage.from('certificates').getPublicUrl(filePath);
          return data?.publicUrl || null;
        }
      } catch (err) {
        console.warn('Storage upload error, using local fallback:', err);
      }
    }

    // Save in IndexedDB without consuming localStorage quota
    try {
      const idbRef = await FileStorage.saveFile(file);
      if (idbRef) return idbRef;
    } catch (idbErr) {
      console.warn('IndexedDB save failed:', idbErr);
    }

    // Short metadata reference (never multi-megabyte base64 strings)
    return `local://${file.name}`;
  },

  // 13. Resolve any file URI into a previewable URL
  async resolveFileUrl(fileUri) {
    if (!fileUri) return null;
    return FileStorage.getFileUrl(fileUri);
  },

  // 14. Admin Auth methods
  async adminLogin(email, password, instituteData = null) {
    const defaultInst = instituteData || {
      name: 'ABC Institute of Technology',
      code: 'INST-2026-IT',
      aishe: 'C-41235',
      accreditation: "NAAC 'A+' Grade • AICTE Approved",
      department: 'Office of the Controller of Examinations'
    };

    if (this.isLiveSupabase()) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        const user = {
          ...data.user,
          institution: defaultInst.name,
          institution_code: defaultInst.code,
          institution_aishe: defaultInst.aishe,
          institution_department: defaultInst.department
        };
        safeSetItem(STORAGE_KEY_ADMIN_SESSION, user);
        return { success: true, user, isDemoAuth: false };
      } catch (err) {
        throw err;
      }
    }

    // Built-in Demo Admin account for effortless demonstration
    if (
      (email === 'admin@certichain.org' && password === 'admin123') ||
      ((email === 'admin' || email.includes('admin')) && (password === 'admin' || password === 'admin123'))
    ) {
      const demoUser = {
        id: 'admin-demo-user',
        email: email.includes('@') ? email : 'admin@certichain.org',
        institution: defaultInst.name,
        institution_code: defaultInst.code,
        institution_aishe: defaultInst.aishe,
        institution_accreditation: defaultInst.accreditation,
        institution_department: defaultInst.department,
        user_metadata: {
          full_name: 'Dr. S. K. Mehta (Registrar)',
          role: 'admin',
          institution: defaultInst.name,
          institution_code: defaultInst.code,
          department: defaultInst.department
        }
      };
      safeSetItem(STORAGE_KEY_ADMIN_SESSION, demoUser);
      return { success: true, user: demoUser, isDemoAuth: true };
    }

    throw new Error('Invalid credentials. Use demo login: admin@certichain.org / admin123');
  },

  async adminLogout() {
    if (this.isLiveSupabase()) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn(e);
      }
    }
    localStorage.removeItem(STORAGE_KEY_ADMIN_SESSION);
    return true;
  },

  async getAdminSession() {
    if (this.isLiveSupabase()) {
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session?.user) {
          return data.session.user;
        }
      } catch (e) {
        console.warn(e);
      }
    }
    const raw = localStorage.getItem(STORAGE_KEY_ADMIN_SESSION);
    return raw ? JSON.parse(raw) : null;
  }
};
