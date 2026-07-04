async function run() {
  try {
    console.log('1. Testing login with default seeded employee...');
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'employee@company.com',
        password: 'employee123'
      })
    });
    const loginData = await loginRes.json();
    console.log('Login Response:', loginRes.status, loginData);

    console.log('2. Testing registration endpoint with valid Gmail and ID...');
    const regRes = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: 'EM54321',
        name: 'Test User',
        email: 'testuser@gmail.com',
        password: 'StrongPass123!',
        role: 'employee'
      })
    });
    const regData = await regRes.json();
    console.log('Registration Response:', regRes.status, regData);

    console.log('3. Testing login with newly registered credentials...');
    const newLoginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'testuser@gmail.com',
        password: 'StrongPass123!'
      })
    });
    const newLoginData = await newLoginRes.json();
    console.log('New Login Response:', newLoginRes.status, newLoginData);

  } catch (err) {
    console.error('Error during test:', err.message);
  }
}

run();
