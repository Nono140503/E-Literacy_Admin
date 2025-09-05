@@ .. @@
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-gradient-to-b from-[#EC643A] via-[#EB6937] via-[#EA6E34] via-[#E97331] via-[#E8772E] via-[#E77C2B] to-[#E68128] text-white transition-all duration-300 z-50 ${
        isSidebarOpen ? 'w-64' : 'w-16'
      }`}>
@@ .. @@
                <div className="p-3 rounded-full bg-gradient-to-r from-[#EC643A] to-[#E68128] text-white">
@@ .. @@
                <div className="p-3 rounded-full bg-gradient-to-r from-[#EB6937] to-[#E77C2B] text-white">
@@ .. @@
                <div className="p-3 rounded-full bg-gradient-to-r from-[#EA6E34] to-[#E8772E] text-white">
@@ .. @@
                <div className="p-3 rounded-full bg-gradient-to-r from-[#E97331] to-[#E77C2B] text-white">
@@ .. @@
               <button 
                 id="view-detailed-stats"
                  className="w-full p-4 bg-gradient-to-r from-[#EC643A] via-[#EB6937] via-[#EA6E34] via-[#E97331] via-[#E8772E] via-[#E77C2B] to-[#E68128] text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
               >
@@ .. @@
               <button 
                 id="download-report"
                 onClick={generatePDFReport}
                  className="w-full p-4 bg-gradient-to-r from-[#EC643A] via-[#EB6937] via-[#EA6E34] via-[#E97331] via-[#E8772E] via-[#E77C2B] to-[#E68128] text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
               >
@@ .. @@
                   <button className={`w-full text-left p-2 rounded hover:bg-gradient-to-r hover:from-[#EC643A] hover:to-[#E68128] hover:text-white transition-all duration-200 ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}>
@@ .. @@
                   <button className={`w-full text-left p-2 rounded hover:bg-gradient-to-r hover:from-[#EB6937] hover:to-[#E77C2B] hover:text-white transition-all duration-200 ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}>
@@ .. @@
                   <button className={`w-full text-left p-2 rounded hover:bg-gradient-to-r hover:from-[#EA6E34] hover:to-[#E8772E] hover:text-white transition-all duration-200 ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}>
@@ .. @@
           itemStyle: {
            color: function(params: any) {
                const colors = ['#EC643A', '#EB6937', '#EA6E34', '#E97331', '#E8772E', '#E77C2B', '#E68128'];
               return colors[params.dataIndex % colors.length];
            }
          }