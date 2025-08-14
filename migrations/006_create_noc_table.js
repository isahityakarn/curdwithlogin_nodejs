const { pool } = require('../config/database');

async function createNocTable() {
  try {
    // Create NOC table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS noc_certificates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        institute_name VARCHAR(255) NOT NULL,
        complete_address TEXT NOT NULL,
        application_number VARCHAR(100) UNIQUE NOT NULL,
        mis_code VARCHAR(50),
        category VARCHAR(100) NOT NULL,
        state_name VARCHAR(100) NOT NULL,
        issue_date DATE NOT NULL,
        expiry_date DATE NOT NULL,
        status ENUM('active', 'expired', 'revoked') DEFAULT 'active',
        remarks TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create NOC trades table for the many-to-many relationship
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS noc_trades (
        id INT AUTO_INCREMENT PRIMARY KEY,
        noc_id INT NOT NULL,
        trade_name VARCHAR(255) NOT NULL,
        shift_1_units INT DEFAULT 0,
        shift_2_units INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (noc_id) REFERENCES noc_certificates(id) ON DELETE CASCADE,
        INDEX idx_noc_id (noc_id),
        INDEX idx_trade_name (trade_name)
      )
    `);

    console.log('NOC tables created successfully');

    // Insert sample NOC certificates data
    const nocData = [
      {
        institute_name: 'Delhi Technical Institute',
        complete_address: '123 Nehru Place, New Delhi, Delhi - 110019',
        application_number: 'NOC/2025/DTI/001',
        mis_code: 'DTI001',
        category: 'New ITI',
        state_name: 'Delhi',
        issue_date: '2025-01-15',
        expiry_date: '2026-01-14',
        status: 'active',
        remarks: 'Certificate issued for new ITI establishment'
      },
      {
        institute_name: 'Mumbai Industrial Training Center',
        complete_address: '456 Andheri East, Mumbai, Maharashtra - 400069',
        application_number: 'NOC/2025/MITC/002',
        mis_code: 'MITC002',
        category: 'Addition of Trade Unit',
        state_name: 'Maharashtra',
        issue_date: '2025-02-01',
        expiry_date: '2026-01-31',
        status: 'active',
        remarks: 'Certificate for adding new trade units'
      },
      {
        institute_name: 'Bangalore Skill Development Institute',
        complete_address: '789 Electronic City, Bangalore, Karnataka - 560100',
        application_number: 'NOC/2025/BSDI/003',
        mis_code: 'BSDI003',
        category: 'Shifting',
        state_name: 'Karnataka',
        issue_date: '2025-01-20',
        expiry_date: '2026-01-19',
        status: 'active',
        remarks: 'Certificate for institute relocation'
      },
      {
        institute_name: 'Chennai Technical Academy',
        complete_address: '321 T. Nagar, Chennai, Tamil Nadu - 600017',
        application_number: 'NOC/2025/CTA/004',
        mis_code: 'CTA004',
        category: 'New ITI',
        state_name: 'Tamil Nadu',
        issue_date: '2025-03-01',
        expiry_date: '2026-02-28',
        status: 'active',
        remarks: 'New ITI establishment in Chennai'
      },
      {
        institute_name: 'Kolkata Industrial Institute',
        complete_address: '654 Salt Lake City, Kolkata, West Bengal - 700064',
        application_number: 'NOC/2025/KII/005',
        mis_code: 'KII005',
        category: 'Relocation of Existing ITI',
        state_name: 'West Bengal',
        issue_date: '2024-12-15',
        expiry_date: '2025-12-14',
        status: 'active',
        remarks: 'Relocation from previous address'
      },
      {
        institute_name: 'Pune Technical Training Center',
        complete_address: '987 Hinjewadi, Pune, Maharashtra - 411057',
        application_number: 'NOC/2024/PTTC/006',
        mis_code: 'PTTC006',
        category: 'Addition of Trade Unit',
        state_name: 'Maharashtra',
        issue_date: '2024-11-01',
        expiry_date: '2025-10-31',
        status: 'expired',
        remarks: 'Certificate expired, renewal required'
      },
      {
        institute_name: 'Hyderabad Vocational Institute',
        complete_address: '147 HITEC City, Hyderabad, Telangana - 500081',
        application_number: 'NOC/2025/HVI/007',
        mis_code: 'HVI007',
        category: 'New ITI',
        state_name: 'Telangana',
        issue_date: '2025-02-15',
        expiry_date: '2026-02-14',
        status: 'active',
        remarks: 'New establishment approved'
      },
      {
        institute_name: 'Ahmedabad Industrial Academy',
        complete_address: '258 Satellite Road, Ahmedabad, Gujarat - 380015',
        application_number: 'NOC/2025/AIA/008',
        mis_code: 'AIA008',
        category: 'Shifting',
        state_name: 'Gujarat',
        issue_date: '2025-01-10',
        expiry_date: '2026-01-09',
        status: 'active',
        remarks: 'Shifting to larger facility'
      },
      {
        institute_name: 'Jaipur Craft Training Institute',
        complete_address: '369 Malviya Nagar, Jaipur, Rajasthan - 302017',
        application_number: 'NOC/2025/JCTI/009',
        mis_code: 'JCTI009',
        category: 'Addition of Trade Unit',
        state_name: 'Rajasthan',
        issue_date: '2025-03-10',
        expiry_date: '2026-03-09',
        status: 'active',
        remarks: 'Adding traditional craft trades'
      },
      {
        institute_name: 'Lucknow Technical College',
        complete_address: '741 Gomti Nagar, Lucknow, Uttar Pradesh - 226010',
        application_number: 'NOC/2025/LTC/010',
        mis_code: 'LTC010',
        category: 'New ITI',
        state_name: 'Uttar Pradesh',
        issue_date: '2025-02-20',
        expiry_date: '2026-02-19',
        status: 'active',
        remarks: 'New ITI in UP region'
      },
      {
        institute_name: 'Bhopal Skill Academy',
        complete_address: '852 New Market, Bhopal, Madhya Pradesh - 462003',
        application_number: 'NOC/2024/BSA/011',
        mis_code: 'BSA011',
        category: 'Relocation of Existing ITI',
        state_name: 'Madhya Pradesh',
        issue_date: '2024-10-15',
        expiry_date: '2025-10-14',
        status: 'expired',
        remarks: 'Certificate expired'
      },
      {
        institute_name: 'Chandigarh Modern Institute',
        complete_address: '963 Sector 34, Chandigarh, Chandigarh - 160022',
        application_number: 'NOC/2025/CMI/012',
        mis_code: 'CMI012',
        category: 'New ITI',
        state_name: 'Chandigarh',
        issue_date: '2025-03-05',
        expiry_date: '2026-03-04',
        status: 'active',
        remarks: 'Modern training facility'
      },
      {
        institute_name: 'Guwahati Technical Institute',
        complete_address: '174 Paltan Bazaar, Guwahati, Assam - 781008',
        application_number: 'NOC/2025/GTI/013',
        mis_code: 'GTI013',
        category: 'Addition of Trade Unit',
        state_name: 'Assam',
        issue_date: '2025-01-25',
        expiry_date: '2026-01-24',
        status: 'active',
        remarks: 'Expanding trade offerings'
      },
      {
        institute_name: 'Kochi Marine Training Center',
        complete_address: '285 Marine Drive, Kochi, Kerala - 682031',
        application_number: 'NOC/2025/KMTC/014',
        mis_code: 'KMTC014',
        category: 'New ITI',
        state_name: 'Kerala',
        issue_date: '2025-02-10',
        expiry_date: '2026-02-09',
        status: 'active',
        remarks: 'Specialized in marine trades'
      },
      {
        institute_name: 'Bhubaneswar Industrial School',
        complete_address: '396 Khandagiri, Bhubaneswar, Odisha - 751030',
        application_number: 'NOC/2025/BIS/015',
        mis_code: 'BIS015',
        category: 'Shifting',
        state_name: 'Odisha',
        issue_date: '2025-03-15',
        expiry_date: '2026-03-14',
        status: 'active',
        remarks: 'Relocated to new campus'
      }
    ];

    // Insert NOC certificates
    for (const noc of nocData) {
      const [result] = await pool.execute(`
        INSERT INTO noc_certificates 
        (institute_name, complete_address, application_number, mis_code, category, state_name, issue_date, expiry_date, status, remarks)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        noc.institute_name,
        noc.complete_address,
        noc.application_number,
        noc.mis_code,
        noc.category,
        noc.state_name,
        noc.issue_date,
        noc.expiry_date,
        noc.status,
        noc.remarks
      ]);

      // Add sample trades for each NOC
      const sampleTrades = [
        { trade_name: 'Electrician', shift_1_units: 24, shift_2_units: 0 },
        { trade_name: 'Fitter', shift_1_units: 20, shift_2_units: 20 },
        { trade_name: 'Turner', shift_1_units: 16, shift_2_units: 0 },
        { trade_name: 'Welder', shift_1_units: 24, shift_2_units: 24 }
      ];

      // Randomly assign 2-4 trades to each NOC
      const numTrades = Math.floor(Math.random() * 3) + 2; // 2-4 trades
      const selectedTrades = sampleTrades.slice(0, numTrades);

      for (const trade of selectedTrades) {
        await pool.execute(`
          INSERT INTO noc_trades (noc_id, trade_name, shift_1_units, shift_2_units)
          VALUES (?, ?, ?, ?)
        `, [result.insertId, trade.trade_name, trade.shift_1_units, trade.shift_2_units]);
      }
    }

    console.log('Sample NOC data inserted successfully');
    console.log(`Inserted ${nocData.length} NOC certificates with associated trades`);

  } catch (error) {
    console.error('Error creating NOC table:', error);
    throw error;
  }
}

// Run the migration
createNocTable()
  .then(() => {
    console.log('NOC table migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('NOC table migration failed:', error);
    process.exit(1);
  });
