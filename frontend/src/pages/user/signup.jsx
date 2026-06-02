import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import UserService from '../../services/user-services/User-Service';
import '../../css/userstyle/sighup.css';

function Signup() {
  const { postRegister } = UserService();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('User'); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await postRegister({ name, email, password, role });
      const data = response.data;
      
      if (data && data.success) {
        setSuccess("Registration successful! You can now log in.");
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setRole('User');
      } else {
        throw new Error(data.error || "Registration failed.");
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page-wrapper py-5 px-3">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
            <div className="signup-container shadow border rounded-3 p-4 bg-white">
              <h2 className="signup-title text-center fw-bold mb-4 text-dark fs-3">Create Account</h2>
              {error && <div className="alert alert-danger py-2 px-3 mb-3 text-start" role="alert">{error}</div>}
              {success && <div className="alert alert-success py-2 px-3 mb-3 text-start" role="alert">{success}</div>}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3 text-start">
                  <label className="form-label fw-semibold text-secondary small">Full Name</label>
                  <input 
                    type="text" 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)} 
                    className="form-control fs-6"
                    placeholder="John Doe"
                  />
                </div>

                <div className="mb-3 text-start">
                  <label className="form-label fw-semibold text-secondary small">Email Address</label>
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                    className="form-control fs-6"
                    placeholder="name@example.com"
                  />
                </div>

                <div className="mb-3 text-start">
                  <label className="form-label fw-semibold text-secondary small">Role Category</label>
                  <select 
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="form-select fs-6" 
                    style={{ cursor: 'pointer' }}
                  >
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                    <option value="SuperAdmin">SuperAdmin</option>
                  </select>
                </div>
                
                <div className="mb-3 text-start">
                  <label className="form-label fw-semibold text-secondary small">Password</label>
                  <input 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                    className="form-control fs-6"
                    placeholder="••••••••"
                  />
                </div>

                <div className="mb-4 text-start">
                  <label className="form-label fw-semibold text-secondary small">Confirm Password</label>
                  <input 
                    type="password" 
                    required 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    className="form-control fs-6"
                    placeholder="••••••••"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn btn-success w-100 py-2.5 fw-semibold"
                >
                  {loading ? (
                    <span className="d-flex align-items-center justify-content-center gap-2">
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span>Registering...</span>
                    </span>
                  ) : 'Register'}
                </button>
              </form>

              <p className="signup-redirect-text text-center mt-4 mb-0 fs-6 text-muted">
                Already have an account?{' '}
                <Link to="/login" className="text-decoration-none fw-semibold signup-link">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
