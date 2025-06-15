// The exported code uses standard Tailwind CSS. Ensure Tailwind is properly configured in your React app.
import React, { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import Settings from './components/Settings.tsx';
import PDFReport from './components/PDFReport.tsx';
import 'swiper/css';
import 'swiper/css/pagination';

// Type definitions
type NavItem = "Dashboard" | "Reports" | "User Insights" | "Settings";

interface HomeProps {
  onLogout: () => void;
}

interface NotificationState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | '';
}

interface UserProfile {
    name: string;
    role: string;
    lastLogin: string;
    avatar: string;
}

interface Stats {
    totalUsers: number;
    beginnerLevel: number;
    intermediateLevel: number;
    advancedLevel: number;
}

const Home: React.FC<HomeProps> = ({ onLogout }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState('All Provinces');
  const [selectedAge, setSelectedAge] = useState('All Ages');
  const [selectedSkill, setSelectedSkill] = useState('All Levels');
  const [showExportModal, setShowExportModal] = useState(false);
  const [activeNav, setActiveNav] = useState<NavItem>('Dashboard');
  const [profileImage, setProfileImage] = useState("https://public.readdy.ai/ai/img_res/d1dc43f1807fb29c90e715375bb00667.jpg");
  const barChartRef = useRef<HTMLDivElement>(null);
  const pieChartRef = useRef<HTMLDivElement>(null);
  const barChartInstance = useRef<echarts.ECharts | null>(null);
  const pieChartInstance = useRef<echarts.ECharts | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const pdfReportRef = useRef<HTMLDivElement>(null);
  const [notification, setNotification] = useState<NotificationState>({ show: false, message: '', type: '' });

  const navIcons: Record<NavItem, string> = {
    "Dashboard": "chart-line",
    "Reports": "file-alt",
    "User Insights": "lightbulb",
    "Settings": "cog"
  };

  const userProfile: UserProfile = {
    name: 'Alexander Mitchell',
    role: 'Education Administrator',
    lastLogin: '2025-03-21 09:30 AM',
    avatar: 'https://public.readdy.ai/ai/img_res/d1dc43f1807fb29c90e715375bb00667.jpg',
  };

  const stats: Stats = {
    totalUsers: 24567,
    beginnerLevel: 8923,
    intermediateLevel: 10234,
    advancedLevel: 5410,
  };

  const initializeCharts = () => {
    if (activeNav !== 'Dashboard') return;

    // Initialize Bar Chart
    if (barChartRef.current) {
      if (barChartInstance.current) {
        barChartInstance.current.dispose();
      }
      barChartInstance.current = echarts.init(barChartRef.current);
      const barOption: echarts.EChartsOption = {
        animation: false,
        tooltip: { trigger: 'axis' },
        xAxis: {
          type: 'category',
          data: ['Beginner', 'Intermediate', 'Advanced'],
          axisLabel: { color: isDarkMode ? '#fff' : '#333' },
        },
        yAxis: {
          type: 'value',
          axisLabel: { color: isDarkMode ? '#fff' : '#333' },
        },
        series: [
          {
            data: [8923, 10234, 5410],
            type: 'bar',
            itemStyle: { color: '#E67012' },
          },
        ],
      };
      barChartInstance.current.setOption(barOption);
    }

    // Initialize Pie Chart
    if (pieChartRef.current) {
      if (pieChartInstance.current) {
        pieChartInstance.current.dispose();
      }
      pieChartInstance.current = echarts.init(pieChartRef.current);
      const pieOption: echarts.EChartsOption = {
        animation: false,
        tooltip: { trigger: 'item' },
        series: [
          {
            type: 'pie',
            radius: '70%',
            data: [
              { value: 35, name: '18-25' },
              { value: 30, name: '26-35' },
              { value: 20, name: '36-45' },
              { value: 15, name: '46+' },
            ],
            label: {
              color: isDarkMode ? '#fff' : '#333'
            },
            itemStyle: {
              color: (params: any) => {
                const colors = ['#E67012', '#3498DB', '#2ECC71', '#E74C3C'];
                return colors[params.dataIndex];
              },
            },
          },
        ],
      };
      pieChartInstance.current.setOption(pieOption);
    }
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      barChartInstance.current?.resize();
      pieChartInstance.current?.resize();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize charts when component mounts or when dependencies change
  useEffect(() => {
    initializeCharts();
  }, [isDarkMode, activeNav]);

  // Cleanup charts when component unmounts
  useEffect(() => {
    return () => {
      barChartInstance.current?.dispose();
      pieChartInstance.current?.dispose();
    };
  }, []);

  const handleNavClick = (item: NavItem) => {
    setActiveNav(item);
    // You can add navigation logic here
    console.log(`Navigating to ${item}`);
  };

  const handleProfileUpdate = (newImage: string) => {
    setProfileImage(newImage);
  };

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const generatePDF = async () => {
    try {
      setIsGeneratingPDF(true);
      setShowExportModal(false);

      // Import jsPDF and html2canvas dynamically
      const { default: jsPDF } = await import('jspdf');
      const { default: html2canvas } = await import('html2canvas');

      // Create temporary chart canvases and render the charts
      const tempBarChart = document.createElement('canvas');
      const tempPieChart = document.createElement('canvas');
      
      // Set dimensions for the charts
      tempBarChart.width = 500;
      tempBarChart.height = 300;
      tempPieChart.width = 500;
      tempPieChart.height = 300;

      // Initialize charts with the temporary canvases
      const pdfBarChart = echarts.init(tempBarChart);
      const pdfPieChart = echarts.init(tempPieChart);

      // Get options from existing charts and disable animation
      const barOptions = barChartInstance.current?.getOption();
      const pieOptions = pieChartInstance.current?.getOption();
      if (!barOptions || !pieOptions) {
          throw new Error("Chart options not available");
      }
      barOptions.animation = false;
      pieOptions.animation = false;

      // Set options to temporary charts
      pdfBarChart.setOption(barOptions);
      pdfPieChart.setOption(pieOptions);

      // Wait for charts to render
      await new Promise(resolve => setTimeout(resolve, 500));

      // Convert charts to data URLs
      const barChartUrl = tempBarChart.toDataURL('image/png');
      const pieChartUrl = tempPieChart.toDataURL('image/png');

      // Clean up temporary charts
      pdfBarChart.dispose();
      pdfPieChart.dispose();

      // Get the logo as base64
      const logoUrl = await new Promise<string>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = () => {
          reject(new Error('Failed to load logo'));
        };
        img.src = '/src/assets/Logo_transparent.png';
      }).catch(() => {
        console.warn('Failed to load logo, continuing without it');
        return '';
      });

      const reportHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                    color: #333;
                    line-height: 1.6;
                    max-width: 1000px;
                    margin: 0 auto;
                    padding: 40px;
                    background-color: #f5f5f5;
                }
                .report-container {
                    background-color: #ffffff;
                    padding-left: 80px;
                    padding-right: 40px;
                    padding-top: 40px;
                    padding-bottom: 40px;
                    border-radius: 10px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                h1, h2 {
                    color: #E67012;
                    text-align: center;
                    font-size: 24px;
                    margin-bottom: 20px;
                }
                h2 {
                    font-size: 20px;
                    color: #1F2937;
                    margin-top: 30px;
                    position: relative;
                }
                h2::after {
                    content: '';
                    display: block;
                    width: 50px;
                    height: 3px;
                    background-color: #E67012;
                    margin: 10px auto;
                }
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                    padding-bottom: 20px;
                    border-bottom: 2px solid #E5E7EB;
                }
                .logo-section {
                    display: flex;
                    align-items: center;
                }
                .logo {
                    width: 74px;
                    height: 74px;
                    margin-right: 16px;
                    ${!logoUrl ? 'display: none;' : ''}
                }
                .date {
                    color: #6B7280;
                    font-size: 14px;
                }
                .user-info {
                    text-align: right;
                }
                .user-name {
                    font-weight: 600;
                    color: #1F2937;
                    margin-bottom: 4px;
                }
                .user-role {
                    color: #6B7280;
                    font-size: 14px;
                }
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 20px;
                    margin-bottom: 30px;
                }
                .stat-box {
                    border: 1px solid #E5E7EB;
                    border-radius: 8px;
                    padding: 20px;
                    background-color: #F9FAFB;
                }
                .stat-label {
                    color: #6B7280;
                    font-size: 16px;
                    margin-bottom: 8px;
                }
                .stat-value {
                    color: #E67012;
                    font-size: 28px;
                    font-weight: bold;
                    margin-bottom: 8px;
                }
                .stat-percentage {
                    color: #4B5563;
                    font-size: 14px;
                }
                .charts-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 24px;
                    margin: 30px 0;
                }
                .chart-container {
                    border: 1px solid #E5E7EB;
                    border-radius: 8px;
                    padding: 24px;
                    background-color: #F9FAFB;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                }
                .chart-title {
                    color: #1F2937;
                    font-size: 16px;
                    font-weight: 600;
                    margin-bottom: 20px;
                    text-align: center;
                }
                .chart-image {
                    width: 100%;
                    height: auto;
                    border-radius: 4px;
                }
                .insights {
                    margin-top: 40px;
                    background-color: #F9FAFB;
                    padding: 24px;
                    border-radius: 8px;
                    border: 1px solid #E5E7EB;
                }
                .insights ul {
                    list-style-type: none;
                    padding-left: 0;
                }
                .insights li {
                    margin-bottom: 12px;
                    color: #4B5563;
                    padding-left: 24px;
                    position: relative;
                }
                .insights li::before {
                    content: '•';
                    color: #E67012;
                    font-size: 20px;
                    position: absolute;
                    left: 0;
                }
                .footer {
                    margin-top: 40px;
                    padding-top: 20px;
                    border-top: 2px solid #E5E7EB;
                    text-align: center;
                    color: #6B7280;
                }
                .footer p {
                    margin: 4px 0;
                }
            </style>
        </head>
        <body>
            <div class="report-container">
                <div class="header">
                    <div class="logo-section">
                        ${logoUrl ? `<img src="${logoUrl}" alt="Logo" class="logo" />` : ''}
                        <div>
                            <h1>E-Literacy Dashboard Report</h1>
                            <p class="date">Generated on ${new Date().toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div class="user-info">
                        <p class="user-name">${userProfile.name}</p>
                        <p class="user-role">${userProfile.role}</p>
                    </div>
                </div>

                <div class="stats-grid">
                    <div class="stat-box">
                        <div class="stat-label">Total Users</div>
                        <div class="stat-value">${stats.totalUsers.toLocaleString()}</div>
                        <div class="stat-percentage">Active participants</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-label">Beginner Level</div>
                        <div class="stat-value">${stats.beginnerLevel.toLocaleString()}</div>
                        <div class="stat-percentage">${((stats.beginnerLevel / stats.totalUsers) * 100).toFixed(1)}% of total users</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-label">Intermediate Level</div>
                        <div class="stat-value">${stats.intermediateLevel.toLocaleString()}</div>
                        <div class="stat-percentage">${((stats.intermediateLevel / stats.totalUsers) * 100).toFixed(1)}% of total users</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-label">Advanced Level</div>
                        <div class="stat-value">${stats.advancedLevel.toLocaleString()}</div>
                        <div class="stat-percentage">${((stats.advancedLevel / stats.totalUsers) * 100).toFixed(1)}% of total users</div>
                    </div>
                </div>

                <h2>Analytics Overview</h2>
                <div class="charts-grid">
                    <div class="chart-container">
                        <div class="chart-title">Literacy Level Distribution</div>
                        <img src="${barChartUrl}" alt="Literacy Level Distribution" class="chart-image"/>
                    </div>
                    <div class="chart-container">
                        <div class="chart-title">Age Demographics</div>
                        <img src="${pieChartUrl}" alt="Age Demographics" class="chart-image"/>
                    </div>
                </div>

                <div class="insights">
                    <h2>Key Insights</h2>
                    <ul>
                        <li>Intermediate level users form the largest group with ${((stats.intermediateLevel / stats.totalUsers) * 100).toFixed(1)}% of total participation</li>
                        <li>Beginner level engagement represents ${((stats.beginnerLevel / stats.totalUsers) * 100).toFixed(1)}% of the user base</li>
                        <li>Advanced users make up ${((stats.advancedLevel / stats.totalUsers) * 100).toFixed(1)}% of total users</li>
                    </ul>
                </div>

                <div class="footer">
                    <p>E-Literacy Administration Dashboard</p>
                    <p>Confidential Report • ${new Date().getFullYear()}</p>
                </div>
            </div>
        </body>
        </html>
      `;

      // Create a temporary container for the HTML
      const container = document.createElement('div');
      container.innerHTML = reportHTML;
      document.body.appendChild(container);

      // Convert HTML to canvas
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 1000, // Match the max-width from the template
        windowWidth: 1000,
        logging: false
      });

      // Remove the temporary container
      document.body.removeChild(container);

      // Create PDF (A4 size: 210x297mm)
      const pdf = new jsPDF('portrait', 'mm', 'a4');
      
      // Calculate dimensions to fit A4
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add the image to PDF
      pdf.addImage(
        canvas.toDataURL('image/jpeg', 1.0),
        'JPEG',
        0,
        0,
        imgWidth,
        imgHeight
      );

      // Save the PDF
      const fileName = `E-Literacy_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

      // Show success notification
      showNotification(`PDF report "${fileName}" has started downloading`);

    } catch (error) {
      console.error('Detailed error in PDF generation:', error);
      const message = error instanceof Error ? error.message : String(error);
      showNotification(`Failed to generate PDF: ${message}`, 'error');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Function to render the active page content
  const renderActivePage = () => {
    switch (activeNav) {
      case 'Settings':
        return <Settings isDarkMode={isDarkMode} onProfileUpdate={handleProfileUpdate} />;
      case 'Dashboard':
        return (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Total Users', value: stats.totalUsers, icon: 'users' },
                { label: 'Beginner Level', value: stats.beginnerLevel, icon: 'star' },
                { label: 'Intermediate', value: stats.intermediateLevel, icon: 'star-half-alt' },
                { label: 'Advanced', value: stats.advancedLevel, icon: 'stars' },
              ].map((stat) => (
                <div key={stat.label} className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#2E2E2E]' : 'bg-white'} shadow-lg hover:shadow-[#E6701240] hover:border-[#E67012] border-2 border-transparent transition-all duration-300`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">{stat.label}</p>
                      <h3 className="text-xl font-bold">{stat.value.toLocaleString()}</h3>
                    </div>
                    <i className={`fas fa-${stat.icon} text-xl text-[#E67012]`}></i>
                  </div>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
              {[
                { label: 'Province', value: selectedProvince, setValue: setSelectedProvince, options: ['Provinces: All Provinces', 'Gauteng', 'Western Cape', 'KwaZulu-Natal'] },
                { label: 'Age Range', value: selectedAge, setValue: setSelectedAge, options: ['Ages: All Ages', '18-25', '26-35', '36-45', '46+'] },
                { label: 'Skill Level', value: selectedSkill, setValue: setSelectedSkill, options: ['Skill Levels: All Levels', 'Beginner', 'Intermediate', 'Advanced'] },
              ].map((filter) => (
                <div key={filter.label} className="relative">
                  <select
                    value={filter.value}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => filter.setValue(e.target.value)}
                    className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-[#2E2E2E] text-white' : 'bg-white text-gray-800'} shadow-md hover:shadow-[#E6701240] transition-all appearance-none pr-10 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E67012]`}
                  >
                    {filter.options.map((option) => (
                      <option key={option} value={option} className={isDarkMode ? 'bg-[#2E2E2E]' : 'bg-white'}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <i className="fas fa-chevron-down text-[#E67012]"></i>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#2E2E2E]' : 'bg-white'} shadow-lg`}>
                <h3 className="text-base font-bold mb-3">Literacy Level Distribution</h3>
                <div ref={barChartRef} style={{ height: '250px' }}></div>
              </div>
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#2E2E2E]' : 'bg-white'} shadow-lg`}>
                <h3 className="text-base font-bold mb-3">Age Demographics</h3>
                <div ref={pieChartRef} style={{ height: '250px' }}></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-end gap-3">
              <button
                onClick={() => setShowExportModal(true)}
                className="px-4 py-2 bg-[#E67012] text-white rounded-lg shadow-lg hover:shadow-[#E6701240] text-sm"
                id='download-report'
              >
                <i className="fas fa-download mr-2"></i>
                Download Report
              </button>
              <button className="px-4 py-2 bg-[#3498DB] text-white rounded-lg shadow-lg hover:shadow-[#3498DB40] text-sm" id='view-detailed-stats'>
                <i className="fas fa-chart-line mr-2"></i>
                View Detailed Stats
              </button>
            </div>
          </>
        );
      default:
        return <div className="p-6">Page under construction</div>;
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      width: '100%',
      backgroundColor: isDarkMode ? '#141414' : '#f3f4f6',
      color: isDarkMode ? '#ffffff' : '#1f2937'
    }}>
      {/* Sidebar */}
      <div style={{
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100vh',
        width: isMenuCollapsed ? '4rem' : '14rem',
        backgroundColor: '#272727',
        transition: 'all 0.3s',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        zIndex: 50
      }}>
        <div className="p-2 flex items-center justify-between">
          <img src="../src/assets/Logo_transparent.png" alt="Logo" className="w-10 h-10" />
          {!isMenuCollapsed && <span style={{ color: '#E67012' }} className="font-bold text-sm">E-Literacy</span>}
          <button onClick={() => setIsMenuCollapsed(!isMenuCollapsed)} style={{ color: '#E67012' }} className="text-sm">
            <i className={`fas fa-${isMenuCollapsed ? 'chevron-right' : 'chevron-left'}`}></i>
          </button>
        </div>

        <nav className="mt-10 flex flex-col h-[calc(100vh-6rem)] justify-between">
          <div>
            {(Object.keys(navIcons) as NavItem[]).map((item) => (
              <div
                key={item}
                onClick={() => handleNavClick(item)}
                style={{
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  color: activeNav === item ? '#ffffff' : '#d1d5db',
                  backgroundColor: activeNav === item ? 'rgba(230, 112, 18, 0.2)' : 'transparent',
                  borderLeft: `4px solid ${activeNav === item ? '#E67012' : 'transparent'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <i className={`fas fa-${navIcons[item]} ${activeNav === item ? 'text-[#E67012]' : ''} ml-4`}></i>
                {!isMenuCollapsed && (
                  <span className={`ml-2 ${activeNav === item ? 'text-[#E67012] font-medium' : ''}`}>
                    {item}
                  </span>
                )}
              </div>
            ))}
          </div>
          <div>
            <div
              onClick={onLogout}
              style={{
                padding: '0.75rem 1rem',
                display: 'flex',
                alignItems: 'center',
                color: '#d1d5db',
                borderLeft: `4px solid transparent`,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              className='hover:bg-[rgba(230,112,18,0.2)]'
            >
              <i className={`fas fa-sign-out-alt ml-4`}></i>
              {!isMenuCollapsed && (
                <span className={`ml-2`}>
                  Logout
                </span>
              )}
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div style={{
        marginLeft: isMenuCollapsed ? '4rem' : '14rem',
        padding: '1rem',
        transition: 'all 0.3s'
      }}>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          {activeNav !== 'Settings' && (
            <div className="flex items-center space-x-3">
              <img src={profileImage} alt="Profile" className="w-10 h-10 rounded-full border-2 border-[#E67012]" id='profile-image'/>
              <div>
                <h2 className="text-lg font-bold">Alexander Mitchell</h2>
                <p className="text-xs text-gray-500">Administrator | Last login: 2025-04-20</p>
              </div>
            </div>
          )}
          <div className={activeNav === 'Settings' ? 'ml-auto' : ''}>
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full bg-gray-800 text-white">
              <i className={`fas fa-${isDarkMode ? 'sun' : 'moon'}`}></i>
            </button>
          </div>
        </div>

        {/* Dynamic Content */}
        {renderActivePage()}
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" 
             style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', backdropFilter: 'blur(4px)' }}>
          <div style={{ 
            backgroundColor: isDarkMode ? 'rgba(46, 46, 46, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            maxWidth: '28rem',
            width: '100%',
            margin: '0 1rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Export Report</h3>
              <button 
                onClick={() => setShowExportModal(false)} 
                style={{ color: '#6b7280' }}
                className="hover:text-gray-700"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="space-y-4">
              <button 
                onClick={generatePDF}
                disabled={isGeneratingPDF}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  backgroundColor: isGeneratingPDF ? '#f3a15f' : '#E67012',
                  color: '#ffffff',
                  borderRadius: '0.5rem',
                  opacity: isGeneratingPDF ? 0.5 : 1,
                  cursor: isGeneratingPDF ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <i className="fas fa-file-pdf"></i>
                <span>{isGeneratingPDF ? 'Generating PDF...' : 'Export as PDF'}</span>
              </button>
              <button 
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  backgroundColor: '#FF0000',
                  color: '#ffffff',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <i className="fas fa-file-csv"></i>
                <span>Export as CSV</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification.show && (
        <div 
          style={{ 
            position: 'fixed',
            top: '1rem',
            right: '1rem',
            zIndex: 50,
            padding: '1rem',
            borderRadius: '0.5rem',
            backgroundColor: notification.type === 'error' ? '#EF4444' : '#10B981',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            animation: 'fadeIn 0.3s ease-out'
          }}
        >
          <i className={`fas fa-${notification.type === 'error' ? 'exclamation-circle' : 'check-circle'}`}></i>
          <p>{notification.message}</p>
        </div>
      )}

      {/* Hidden PDF Report Template */}
      <div style={{ display: 'none' }}>
        <div ref={pdfReportRef}>
          <PDFReport
            stats={stats}
            userProfile={userProfile}
          />
        </div>
      </div>
    </div>
  );
};

// Animation styles
const styles = `
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default Home;
