import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserService from '../../services/user-services/User-Service';
import useAuth from '../../hooks/useAuth';
import '../../css/userstyle/login.css';

function Login() {
  const { postLogin } = UserService();
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();  
   
    setLoading(true);
    setError('');

    try {
      const response = await postLogin({ email, password });
      const data = response.data;

      if (data && data.success) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("role", data.role || "user");
        localStorage.setItem("isAdmin", data.isAdmin ? "true" : "false");
        localStorage.setItem("isSuperAdmin", data.isSuperAdmin ? "true" : "false");
        localStorage.setItem("userId", data.userId || "");
        localStorage.setItem("name", data.name || "");
        localStorage.setItem("profileImage", data.profileImage || "");

        const normalizedRole = data.role ? data.role.toLowerCase() : "user";

        setAuth({
          accessToken: data.accessToken,
          role: normalizedRole,
          isAdmin: !!data.isAdmin,
          isSuperAdmin: !!data.isSuperAdmin,
          id: data.userId,
          name: data.name,
          image: data.profileImage
        });
        
     

        alert("Login successful!");
        if (normalizedRole === 'superadmin' || data.isSuperAdmin) {
          navigate('/superadmin/dashboard');
        } else if (normalizedRole === 'admin' || data.isAdmin) {
          navigate('/admin/dashboard');
        } else {
          navigate('/user/upload');
        }
      } else {
        throw new Error(data.error || "Invalid credentials.");
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="login-page-wrapper py-5 px-3">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4">
            <div className="login-container shadow border rounded-3 p-4 bg-white">
              <h2 className="login-title text-center fw-bold mb-4 text-dark fs-3">Sign In</h2>
              {error && <div className="alert alert-danger py-2 px-3 mb-3 text-start" role="alert">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3 text-start">
                  <label className="form-label fw-semibold text-secondary small">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control form-control-lg fs-6"
                    placeholder="name@example.com"
                  />
                </div>

                <div className="mb-4 text-start">
                  <label className="form-label fw-semibold text-secondary small">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control form-control-lg fs-6"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-100 py-2.5 fw-semibold"
                >
                  {loading ? (
                    <span className="d-flex align-items-center justify-content-center gap-2">
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span>Authenticating...</span>
                    </span>
                  ) : 'Sign In'}
                </button>
              </form>

              <p className="login-redirect-text text-center mt-4 mb-0 fs-6 text-muted">
                Don't have an account?{' '}
                <Link to="/signup" className="text-decoration-none fw-semibold login-link">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
