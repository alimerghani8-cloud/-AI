
import React, { useState, useRef, useEffect } from 'react';
import { analyzeText } from '../services/geminiService';
import { AnalysisResult, HistoryItem } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

// These functions would be in a separate utils file in a larger app
declare const jspdf: any;
declare const html2canvas: any;

const generatePdf = (elementId: string) => {
  const input = document.getElementById(elementId);
  if (input) {
    html2canvas(input, {
        useCORS: true,
        scale: 2, 
        backgroundColor: document.documentElement.classList.contains('dark') ? '#111827' : '#FFFFFF'
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jspdf.jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save("Mograt_Text_Detector_Report.pdf");
    });
  }
};


const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-royal-blue-600 rounded-full animate-spin"></div>
      <p className="text-lg text-gray-600 dark:text-gray-300">...جاري تحليل النص</p>
    </div>
);

const ResultDisplay: React.FC<{ result: AnalysisResult; onDownload: () => void }> = ({ result, onDownload }) => {
    const isAI = result.isAI;
    const confidence = Math.round(result.confidence);
    const barColor = isAI ? 'bg-red-500' : 'bg-green-500';
    const resultText = isAI ? 'هذا النص كُتب على الأرجح بواسطة الذكاء الاصطناعي.' : 'هذا النص يبدو أنه مكتوب بواسطة إنسان.';

    return (
        <div id="pdf-report" className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 w-full">
            <h2 className="text-2xl font-bold mb-4 text-center">نتيجة التحليل</h2>
            <div className={`p-4 rounded-lg text-center mb-6 ${isAI ? 'bg-red-100 dark:bg-red-900/50' : 'bg-green-100 dark:bg-green-900/50'}`}>
                <p className={`text-xl font-semibold ${isAI ? 'text-red-800 dark:text-red-200' : 'text-green-800 dark:text-green-200'}`}>
                    {resultText}
                </p>
            </div>

            <div className="mb-6">
                <div className="flex justify-between items-center mb-2 font-bold">
                    <span className="text-gray-600 dark:text-gray-300">مستوى الثقة</span>
                    <span className={`text-xl ${isAI ? 'text-red-500' : 'text-green-500'}`}>{confidence}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                    <div className={`${barColor} h-4 rounded-full transition-all duration-500`} style={{ width: `${confidence}%` }}></div>
                </div>
            </div>
            
            <div className="mb-6">
                 <h3 className="font-bold mb-2 text-gray-700 dark:text-gray-200">السبب:</h3>
                 <p className="text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50 p-3 rounded-md">{result.reasoning}</p>
            </div>

            <button onClick={onDownload} className="w-full mt-4 px-6 py-2 bg-royal-blue-800 text-white font-semibold rounded-lg shadow-md hover:bg-royal-blue-700 transition-colors duration-300">
                تحميل التقرير (PDF)
            </button>
        </div>
    );
};


const DetectorPage = () => {
    const [text, setText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [history, setHistory] = useLocalStorage<HistoryItem[]>('detectionHistory', []);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [text]);

    const handleAnalyze = async () => {
        if (!text.trim()) {
            setError("يرجى إدخال نص للتحليل.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);
        try {
            const result = await analyzeText(text);
            setAnalysisResult(result);
            const newHistoryItem: HistoryItem = {
                id: new Date().toISOString(),
                text: text,
                result: result,
                timestamp: new Date().toLocaleString('ar-EG'),
            };
            setHistory([newHistoryItem, ...history.slice(0, 9)]); // Keep last 10
        } catch (e: any) {
            setError(e.message || "حدث خطأ غير متوقع.");
        } finally {
            setIsLoading(false);
        }
    };

    const loadFromHistory = (item: HistoryItem) => {
        setText(item.text);
        setAnalysisResult(item.result);
        setError(null);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 flex flex-col">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 flex-grow flex flex-col">
                    <h1 className="text-3xl font-bold mb-4 text-royal-blue-900 dark:text-royal-blue-200">كاشف المحتوى</h1>
                    <textarea
                        ref={textareaRef}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="الصق النص هنا لتحليله..."
                        className="w-full flex-grow p-4 text-lg bg-gray-100 dark:bg-gray-900 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-royal-blue-500 min-h-[200px]"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleAnalyze}
                        disabled={isLoading || !text.trim()}
                        className="mt-4 w-full px-6 py-3 bg-royal-blue-800 text-white font-bold text-lg rounded-lg shadow-md hover:bg-royal-blue-700 transition-all duration-300 disabled:bg-gray-400 disabled:dark:bg-gray-600 disabled:cursor-not-allowed"
                    >
                        {isLoading ? '...جاري التحليل' : 'تحليل النص'}
                    </button>
                    {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
                </div>

                <div className="mt-8">
                    {isLoading && <LoadingSpinner />}
                    {analysisResult && !isLoading && <ResultDisplay result={analysisResult} onDownload={() => generatePdf('pdf-report')} />}
                </div>
            </div>

            <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold mb-4 text-royal-blue-900 dark:text-royal-blue-200">آخر عمليات الفحص</h2>
                    {history.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400">لا توجد سجلات بعد.</p>
                    ) : (
                        <ul className="space-y-3 max-h-[600px] overflow-y-auto">
                            {history.map(item => (
                                <li key={item.id} onClick={() => loadFromHistory(item)} className="p-3 bg-gray-100 dark:bg-gray-900 rounded-lg cursor-pointer hover:bg-royal-blue-100 dark:hover:bg-royal-blue-900/50 transition-colors">
                                    <p className="truncate text-gray-800 dark:text-gray-200">{item.text}</p>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex justify-between">
                                        <span>{item.timestamp}</span>
                                        <span className={`font-bold ${item.result.isAI ? 'text-red-500' : 'text-green-500'}`}>
                                            {item.result.isAI ? 'ذكاء اصطناعي' : 'إنسان'} ({Math.round(item.result.confidence)}%)
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DetectorPage;
