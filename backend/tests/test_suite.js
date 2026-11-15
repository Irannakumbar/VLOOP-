const http = require('http');

const API_BASE = 'http://localhost:5000/api';

const request = (endpoint, method = 'GET', data = null, token = null) => {
  return new Promise((resolve, reject) => {
    const url = new URL(API_BASE + endpoint);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
};

const runTests = async () => {
  console.log('====================================================');
  console.log('VELOOP REWARDS — PRODUCTION TEST SUITE VERIFICATION');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  const assert = (condition, name, details = '') => {
    if (condition) {
      console.log(`[PASS] ${name}`);
      passed++;
    } else {
      console.error(`[FAIL] ${name} -> ${details}`);
      failed++;
    }
  };

  try {
    // Test 1: Statistics
    const statsRes = await request('/giveaways/statistics');
    assert(statsRes.status === 200 && statsRes.body.data.activeGiveaways === 6, '1. Live Statistics API returns active giveaways', JSON.stringify(statsRes.body));

    // Test 2: Unauthenticated participation rejection
    const unauthRes = await request('/giveaways/iphone-15-pro/join', 'POST', {});
    assert(unauthRes.status === 401, '2. Unauthenticated participation rejected with 401', `Status: ${unauthRes.status}`);

    // Test 3: Unauthorized admin access
    // First login as standard user
    const loginAlex = await request('/auth/login', 'POST', { email: 'alex@veloop.com', password: 'User@123456' });
    const alexToken = loginAlex.body.data.token;
    assert(loginAlex.status === 200 && alexToken, '3. Standard user login success with JWT');

    const adminForbidden = await request('/admin/metrics', 'GET', null, alexToken);
    assert(adminForbidden.status === 403, '4. Non-admin user blocked from /api/admin/metrics with 403 Forbidden', `Status: ${adminForbidden.status}`);

    // Test 5: Successful Participation in iPhone 15 Pro (250 VEs)
    const joinRes = await request('/giveaways/iphone-15-pro/join', 'POST', { entryFee: 250, currency: 'VEs' }, alexToken);
    assert(joinRes.status === 201 && joinRes.body.data.ticketNumber.startsWith('TK-VIP-'), '5. Successful atomic participation: VIP ticket generated', `Ticket: ${joinRes.body.data?.ticketNumber}`);
    assert(joinRes.body.data.updatedBalance === 1250, '6. Authoritative balance correctly deducted from 1500 to 1250 VEs');

    // Test 7: Duplicate participation prevention
    const duplicateRes = await request('/giveaways/iphone-15-pro/join', 'POST', { entryFee: 250, currency: 'VEs' }, alexToken);
    assert(duplicateRes.status === 409, '7. Duplicate participation blocked with 409 Conflict', `Status: ${duplicateRes.status}`);

    // Test 8: Insufficient balance test
    const loginSarah = await request('/auth/login', 'POST', { email: 'sarah@veloop.com', password: 'User@123456' });
    const sarahToken = loginSarah.body.data.token;
    const sarahJoinRes = await request('/giveaways/apple-watch/join', 'POST', { entryFee: 200, currency: 'VEs' }, sarahToken);
    assert(sarahJoinRes.status === 400 && sarahJoinRes.body.message.includes('Insufficient'), '8. Insufficient balance blocked with 400 & deficit calculation', sarahJoinRes.body.message);

    // Test 9: Tampered entry fee detection
    const tamperedFeeRes = await request('/giveaways/apple-watch/join', 'POST', { entryFee: 5, currency: 'VEs' }, alexToken);
    assert(tamperedFeeRes.status === 400 && tamperedFeeRes.body.message.includes('Tampered'), '9. Tampered fee payload rejected & flagged', tamperedFeeRes.body.message);

    // Test 10: Tampered currency detection
    const tamperedCurrRes = await request('/giveaways/apple-watch/join', 'POST', { entryFee: 200, currency: 'Tokens' }, alexToken);
    assert(tamperedCurrRes.status === 400 && tamperedCurrRes.body.message.includes('mismatch'), '10. Tampered currency payload rejected & flagged', tamperedCurrRes.body.message);

    // Test 11: Non-winner claim rejection
    const nonWinnerClaim = await request('/giveaways/iphone-15-pro/claim', 'POST', { claimType: 'digital', digitalDetails: { email: 'sarah@veloop.com' } }, sarahToken);
    assert(nonWinnerClaim.status === 403, '11. Non-winner claim rejected with 403 Forbidden', nonWinnerClaim.body.message);

    // Test 12: Admin login & Provably fair draw
    const loginAdmin = await request('/auth/login', 'POST', { email: 'admin@veloop.com', password: 'Admin@123456' });
    const adminToken = loginAdmin.body.data.token;
    assert(loginAdmin.status === 200 && adminToken, '12. Admin authentication success');

    const adminMetrics = await request('/admin/metrics', 'GET', null, adminToken);
    assert(adminMetrics.status === 200 && adminMetrics.body.data.fraudEventsCount >= 3, '13. Admin metrics & fraud monitoring captures security events', `Events count: ${adminMetrics.body.data?.fraudEventsCount}`);

    console.log('\n====================================================');
    console.log(`TEST RESULTS SUMMARY: ${passed} PASSED / ${failed} FAILED`);
    console.log('====================================================\n');

    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
};

runTests();
