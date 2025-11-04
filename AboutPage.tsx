
import React from 'react';

const AboutPage = () => {
    return (
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h1 className="text-4xl font-black text-royal-blue-900 dark:text-royal-blue-200 mb-6 text-center">
                حول MOGRAT TEXT DETECTOR
            </h1>

            <div className="space-y-6 text-lg text-gray-700 dark:text-gray-300">
                <p>
                    <span className="font-bold">MOGRAT TEXT DETECTOR</span> هو أداة متقدمة مصممة خصيصًا للمحتوى العربي، تهدف إلى التمييز بين النصوص التي يكتبها البشر وتلك التي يتم إنشاؤها بواسطة نماذج الذكاء الاصطناعي (AI). في عصر يتزايد فيه المحتوى المُنشأ آليًا، تصبح الحاجة إلى التحقق من أصالة النصوص أمرًا بالغ الأهمية.
                </p>

                <h2 className="text-2xl font-bold text-royal-blue-800 dark:text-royal-blue-300 pt-4 border-t border-gray-200 dark:border-gray-700">
                    كيف يعمل؟
                </h2>
                <p>
                    تعتمد أداتنا على نماذج لغوية متطورة من Google Gemini لتحليل الخصائص اللغوية الدقيقة للنص. يقوم النموذج بفحص عوامل متعددة مثل:
                </p>
                <ul className="list-disc list-inside space-y-2 pr-4">
                    <li>
                        <span className="font-semibold">التعقيد والترابط:</span> قدرة النص على بناء جمل معقدة ومترابطة بشكل منطقي.
                    </li>
                    <li>
                        <span className="font-semibold">التكرار والنمطية:</span> ميل الذكاء الاصطناعي أحيانًا إلى تكرار كلمات أو عبارات معينة.
                    </li>
                    <li>
                        <span className="font-semibold">الأصالة والإبداع:</span> اللمسة البشرية الفريدة التي تظهر في استخدام الاستعارات أو الأسلوب الشخصي.
                    </li>
                    <li>
                        <span className="font-semibold">الأخطاء الدقيقة:</span> الأخطاء غير النمطية التي قد يرتكبها البشر ولا تظهر عادةً في نصوص الذكاء الاصطناعي.
                    </li>
                </ul>
                <p>
                    بناءً على هذا التحليل، يقدم الكاشف تقييمًا احتماليًا مع نسبة ثقة، مما يمنحك فكرة واضحة عن مصدر النص المحتمل.
                </p>

                <h2 className="text-2xl font-bold text-royal-blue-800 dark:text-royal-blue-300 pt-4 border-t border-gray-200 dark:border-gray-700">
                    الخصوصية والأمان
                </h2>
                <p>
                    نحن نحترم خصوصيتك. النصوص التي تقوم بتحليلها تُرسل إلى واجهة برمجة تطبيقات Google Gemini للمعالجة فقط ولا يتم تخزينها على خوادمنا. جميع سجلات الفحص الأخيرة يتم حفظها محليًا في متصفحك فقط ولا يمكن لأي شخص آخر الوصول إليها.
                </p>
            </div>
        </div>
    );
};

export default AboutPage;
