import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Eye, EyeOff, Users, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { useSiteSettings } from '../hooks/useSiteSettings';
import axios from 'axios';

const TeamLogin = () => {
  const navigate = useNavigate();
  const { siteSettings } = useSiteSettings();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const companyInfo = siteSettings?.companyInfo || {
    name: 'G.M.B Travels Kashmir',
    logo: 'https://customer-assets.emergentagent.com/job_gmb-tours/artifacts/u7oxyvzc_logo.jpg'
  };

  const handleInputChange = (field, value) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/team/login`, credentials);
      
      if (response.data.access_token) {
        localStorage.setItem('teamToken', response.data.access_token);
        toast.success('Login successful! Welcome to the team portal.');
        
        // For now, redirect to admin dashboard (you can create a separate team dashboard later)
        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.error('Team login error:', error);
      if (error.response?.status === 401) {
        toast.error('Invalid username or password');
      } else {
        toast.error('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <img 
              src={companyInfo.logo} 
              alt={companyInfo.name} 
              className="h-16 w-16 rounded-full shadow-lg"
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{companyInfo.name}</h1>
          <p className="text-slate-300">Team Portal</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 p-3 bg-amber-100 rounded-full w-fit">
              <Users className="h-8 w-8 text-amber-600" />
            </div>
            <CardTitle className="text-2xl text-slate-800">Team Login</CardTitle>
            <CardDescription>
              Enter your credentials to access the team dashboard
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-2">
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={credentials.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={credentials.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                    className="h-12 pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-400" />
                    )}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-amber-600 hover:bg-amber-700 text-white text-base font-semibold"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </div>
                )}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <h4 className="text-sm font-semibold text-amber-800 mb-2">Demo Credentials:</h4>
              <div className="text-xs text-amber-700 space-y-1">
                <div><strong>Manager:</strong> rajesh_manager / manager123</div>
                <div><strong>Agent:</strong> priya_agent / agent123</div>
              </div>
            </div>

            {/* Links */}
            <div className="mt-6 text-center space-y-2">
              <Link 
                to="/admin/login" 
                className="text-sm text-slate-600 hover:text-amber-600 transition-colors"
              >
                Admin Login →
              </Link>
              <br />
              <Link 
                to="/" 
                className="text-sm text-slate-600 hover:text-amber-600 transition-colors"
              >
                ← Back to Website
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-slate-400 text-sm">
          <p>&copy; 2024 {companyInfo.name}. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default TeamLogin;