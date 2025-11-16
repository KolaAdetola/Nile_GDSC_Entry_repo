// import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Form from './components/Form';
import Dashboard from './components/Dashboard';

function App() {
  // const [activeTab, setActiveTab] = useState('form');

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <Toaster 
        position="bottom-right"
        toastOptions={{
          duration: 2000,
          className: 'bg-white text-gray-800 shadow-lg border border-gray-200',
          success: {
            className: 'bg-green-50 text-green-800 border-green-200',
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            className: 'bg-red-50 text-red-800 border-red-200',
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center py-4">
            <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 sm:mb-0">
              Customer Feedback
            </h1>
            
            {/* Navigation Tabs */}
            {/* <nav className="flex space-x-1 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setActiveTab('form')}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'form'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Submit Form
              </button>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'dashboard'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                View Submissions
              </button>
            </nav> */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fade-in">
          {/* {activeTab === 'form' ? <Form /> : <Dashboard />} */}
          <Form />
        </div>
      </main>
    </div>
  );
}

export default App;