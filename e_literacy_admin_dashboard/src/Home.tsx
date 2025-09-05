import React, { useState, useRef } from 'react';
import * as echarts from 'echarts';
import { useEffect } from 'react';
import UserInsightsMap from './components/UserInsightsMap.tsx';
import Settings from './components/Settings.tsx';
import PDFReport from './components/PDFReport.tsx';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface HomeProps {
  onLogout: () => void;
}

const Home: React.FC<HomeProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [profileImage, setProfileImage] = useState("https://public.readdy.ai/ai/img_res/d1dc43f1807fb29c90e715375bb00667.jpg");
  const chartRef = useRef<HTMLDivElement>(null);
  const pdfRef = useRef<HTMLDivElement>(null);

  const stats = {
    totalUsers: 12847,
    beginnerLevel: 4523,
    intermediateLevel: 6234,
    advancedLevel: 2090
  };

  const userProfile = {
    name: "Alexander Mitchell",
    role: "System Administrator"
  };

  const handleProfileUpdate = (newImage: string) => {
    setProfileImage(newImage);
  };

  const generatePDFReport = async () => {
    if (!pdfRef.current) return;

    try {
      const canvas = await html2canvas(pdfRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save('e-literacy-dashboard-report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'dashboard' && chartRef.current) {
      const chart = echarts.init(chartRef.current);
      
      const option = {
        title: {
          text: 'User Distribution by Level',
          left: 'center',
          textStyle: {
            color: isDarkMode ? '#ffffff' : '#333333',
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          textStyle: {
            color: isDarkMode ? '#ffffff' : '#333333'
          }
        },
        series: [
          {
            name: 'User Levels',
            type: 'pie',
            radius: '50%',
            data: [
              { value: stats.beginnerLevel, name: 'Beginner' },
              { value: stats.intermediateLevel, name: 'Intermediate' },
              { value: stats.advancedLevel, name: 'Advanced' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            itemStyle: {
              color: function(params: any) {
                const colors = ['#EC643A', '#E8772E', '#E68128'];
                return colors[params.dataIndex % colors.length];
              }
            }
          }
        ],
        backgroundColor: 'transparent'
      };

      chart.setOption(option);

      const handleResize = () => {
        chart.resize();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chart.dispose();
      };
    }
  }, [activeTab, isDarkMode, stats]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className={`p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-gradient-to-r from-[#EC643A] to-[#E68128] text-white">
                    <i className="fas fa-users text-2xl"></i>
                  </div>
                  <div className="ml-4">
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Users</p>
                    <p className="text-2xl font-bold text-[#EC643A]">{stats.totalUsers.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-gradient-to-r from-[#EB6937] to-[#E77C2B] text-white">
                    <i className="fas fa-seedling text-2xl"></i>
                  </div>
                  <div className="ml-4">
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Beginner Level</p>
                    <p className="text-2xl font-bold text-[#EB6937]">{stats.beginnerLevel.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-gradient-to-r from-[#EA6E34] to-[#E8772E] text-white">
                    <i className="fas fa-chart-line text-2xl"></i>
                  </div>
                  <div className="ml-4">
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Intermediate Level</p>
                    <p className="text-2xl font-bold text-[#EA6E34]">{stats.intermediateLevel.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-gradient-to-r from-[#E97331] to-[#E77C2B] text-white">
                    <i className="fas fa-trophy text-2xl"></i>
                  </div>
                  <div className="ml-4">
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Advanced Level</p>
                    <p className="text-2xl font-bold text-[#E97331]">{stats.advancedLevel.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart and Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className={`lg:col-span-2 p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div ref={chartRef} style={{ width: '100%', height: '400px' }}></div>
              </div>

              <div className="space-y-4">
                <button 
                  id="view-detailed-stats"
                  className="w-full p-4 bg-gradient-to-r from-[#EC643A] via-[#EA6E34] to-[#E68128] text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <i className="fas fa-chart-bar"></i>
                  <span>View Detailed Stats</span>
                </button>

                <button 
                  id="download-report"
                  onClick={generatePDFReport}
                  className="w-full p-4 bg-gradient-to-r from-[#EB6937] via-[#E8772E] to-[#E77C2B] text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <i className="fas fa-download"></i>
                  <span>Download Report</span>
                </button>

                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h3 className="font-semibold mb-2">Quick Actions</h3>
                  <div className="space-y-2">
                    <button className={`w-full text-left p-2 rounded hover:bg-gradient-to-r hover:from-[#EC643A] hover:to-[#E68128] hover:text-white transition-all duration-200 ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}>
                      <i className="fas fa-user-plus mr-2"></i>Add New User
                    </button>
                    <button className={`w-full text-left p-2 rounded hover:bg-gradient-to-r hover:from-[#EB6937] hover:to-[#E77C2B] hover:text-white transition-all duration-200 ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}>
                      <i className="fas fa-cog mr-2"></i>System Settings
                    </button>
                    <button className={`w-full text-left p-2 rounded hover:bg-gradient-to-r hover:from-[#EA6E34] hover:to-[#E8772E] hover:text-white transition-all duration-200 ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}>
                      <i className="fas fa-bell mr-2"></i>Notifications
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* User Insights Map */}
            <UserInsightsMap isDarkMode={isDarkMode} />

            {/* Hidden PDF Report Component */}
            <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
              <PDFReport ref={pdfRef} stats={stats} userProfile={userProfile} />
            </div>
          </div>
        );

      case 'users':
        return (
          <div className={`p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-2xl font-bold mb-4">User Management</h2>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>User management features will be implemented here.</p>
          </div>
        );

      case 'analytics':
        return (
          <div className={`p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-2xl font-bold mb-4">Analytics</h2>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Advanced analytics and reporting features will be implemented here.</p>
          </div>
        );

      case 'settings':
        return <Settings isDarkMode={isDarkMode} onProfileUpdate={handleProfileUpdate} />;

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-gradient-to-b from-[#EC643A] via-[#EA6E34] via-[#E8772E] to-[#E68128] text-white transition-all duration-300 z-50 ${
        isSidebarOpen ? 'w-64' : 'w-16'
      }`}>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${isSidebarOpen ? '' : 'justify-center'}`}>
              <img src="/src/assets/Logo.jpeg" alt="Logo" className="w-10 h-10 rounded-full" />
              {isSidebarOpen && <span id="logo-text" className="ml-3 font-bold">E-Literacy</span>}
            </div>
            <button 
              id="toggle-menu-icon"
              onClick={toggleSidebar}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <i className={`fas ${isSidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
          </div>
        </div>

        <nav className="mt-8">
          <div className="px-4 space-y-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === 'dashboard' 
                  ? 'bg-white bg-opacity-20 shadow-lg' 
                  : 'hover:bg-white hover:bg-opacity-10'
              } ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}
            >
              <i className="fas fa-tachometer-alt text-lg"></i>
              {isSidebarOpen && <span className="ml-3">Dashboard</span>}
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === 'users' 
                  ? 'bg-white bg-opacity-20 shadow-lg' 
                  : 'hover:bg-white hover:bg-opacity-10'
              } ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}
            >
              <i className="fas fa-users text-lg"></i>
              {isSidebarOpen && <span className="ml-3">Users</span>}
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === 'analytics' 
                  ? 'bg-white bg-opacity-20 shadow-lg' 
                  : 'hover:bg-white hover:bg-opacity-10'
              } ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}
            >
              <i className="fas fa-chart-line text-lg"></i>
              {isSidebarOpen && <span className="ml-3">Analytics</span>}
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === 'settings' 
                  ? 'bg-white bg-opacity-20 shadow-lg' 
                  : 'hover:bg-white hover:bg-opacity-10'
              } ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}
            >
              <i className="fas fa-cog text-lg"></i>
              {isSidebarOpen && <span className="ml-3">Settings</span>}
            </button>
          </div>
        </nav>

        <div className="absolute bottom-4 left-0 right-0 px-4">
          <button
            onClick={onLogout}
            className={`w-full flex items-center px-4 py-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all duration-200 ${
              isSidebarOpen ? 'justify-start' : 'justify-center'
            }`}
          >
            <i className="fas fa-sign-out-alt text-lg"></i>
            {isSidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}>
        {/* Header */}
        <header className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">
                  {activeTab === 'dashboard' && 'Dashboard'}
                  {activeTab === 'users' && 'User Management'}
                  {activeTab === 'analytics' && 'Analytics'}
                  {activeTab === 'settings' && 'Settings'}
                </h1>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Welcome back, Alexander Mitchell
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleDarkMode}
                  className={`p-2 rounded-lg transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  }`}
                >
                  <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
                </button>

                <div className="flex items-center space-x-3">
                  <img 
                    id="profile-image"
                    src={profileImage} 
                    alt="Profile" 
                    className="w-10 h-10 rounded-full border-2 border-[#EC643A]"
                  />
                  <div className="hidden md:block">
                    <p className="font-medium">Alexander Mitchell</p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Administrator</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Home;