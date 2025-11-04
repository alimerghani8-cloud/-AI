
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface HomePageProps {
  userCountState: [number, React.Dispatch<React.SetStateAction<number>>];
}

const HomePage: React.FC<HomePageProps> = ({ userCountState }) => {
  const [userCount, setUserCount] = userCountState;
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('userCount', userCount.toString());
  }, [userCount]);

  const handleStartClick = () => {
    setUserCount(prevCount => prevCount + 1);
    navigate('/detector');
  };

  return (
    <div className="flex flex-col items-center justify-center text-center h-full pt-16">
      <div className="absolute top-24 right-4 sm:top-20 sm:right-8 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400">عدد المستخدمين</h3>
        <p className="text-3xl font-black text-royal-blue-800 dark:text-royal-blue-300 tracking-wider">
          {userCount.toLocaleString('ar-EG')}
        </p>
      </div>

      <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-royal-blue-700 to-royal-blue-500 dark:from-royal-blue-400 dark:to-royal-blue-200 mb-6 animate-fade-in-down">
        MOGRAT TEXT DETECTOR
      </h1>
      <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl animate-fade-in-up">
        كاشف النصوص الأكثر تقدماً باللغة العربية. اكتشف ما إذا كان النص مكتوباً بواسطة الذكاء الاصطناعي أم الإنسان بدقة عالية.
      </p>
      
      <button
        onClick={handleStartClick}
        className="px-12 py-4 bg-royal-blue-800 text-white text-xl font-bold rounded-lg shadow-lg hover:bg-royal-blue-700 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-royal-blue-300 dark:focus:ring-royal-blue-900"
      >
        ابدأ الآن
      </button>
    </div>
  );
};

export default HomePage;
