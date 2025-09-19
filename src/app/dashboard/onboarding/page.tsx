// src/app/(dashboard)/dashboard/onboarding/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';
import { useUser } from '../../context/UserContext';
import DashboardSidebar from '../../components/DashboardSidebar'

export default function OnboardingPage() {
    const router = useRouter();
    const { user } = useUser();
    
    // Sử dụng state để quản lý các lựa chọn
    const [targetExam, setTargetExam] = useState('IELTS');
    const [targetScore, setTargetScore] = useState('');
    const [studyTime, setStudyTime] = useState(30); // Giá trị mặc định là 30 phút

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        
        if (!targetScore || parseFloat(targetScore) <= 0) {
            setError('Vui lòng nhập một điểm số hợp lệ.');
            return;
        }

        setIsLoading(true);
        setError('');

        const { error: updateError } = await supabase
            .from('profiles')
            .update({
                target_exam: targetExam,
                target_score: parseFloat(targetScore),
                study_time_per_day: studyTime,
                onboarding_completed: true,
            })
            .eq('id', user.id);

        if (updateError) {
            setError('Đã có lỗi xảy ra: ' + updateError.message);
            setIsLoading(false);
        } else {
            router.push('/dashboard');
        }
    };
    
    // Các lựa chọn về thời gian học
    const timeOptions = [
        { label: '15 phút', value: 15 },
        { label: '30 phút', value: 30 },
        { label: '60 phút', value: 60 },
        { label: '90+ phút', value: 90 },
    ];

    return (
        <>
            <DashboardSidebar />
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4 pt-20">
                <div className="w-full max-w-2xl">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl sm:text-5xl font-bold">Chào mừng bạn đến với HIDAYBETA!</h1>
                        <p className="text-gray-400 mt-3 text-lg">Hãy dành vài giây để chúng tôi cá nhân hóa lộ trình học cho bạn.</p>
                    </div>
                    
                    <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Lựa chọn mục tiêu */}
                            <div>
                                <label className="block text-xl font-medium text-gray-200 mb-4">1. Mục tiêu chính của bạn là gì?</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button type="button" onClick={() => setTargetExam('IELTS')} className={`p-4 rounded-lg text-lg font-semibold transition-all ${targetExam === 'IELTS' ? 'bg-pink-600 text-white ring-2 ring-pink-400' : 'bg-gray-700 hover:bg-gray-600'}`}>IELTS</button>
                                    <button type="button" onClick={() => setTargetExam('TOEIC')} className={`p-4 rounded-lg text-lg font-semibold transition-all ${targetExam === 'TOEIC' ? 'bg-pink-600 text-white ring-2 ring-pink-400' : 'bg-gray-700 hover:bg-gray-600'}`}>TOEIC</button>
                                </div>
                            </div>

                            {/* Lựa chọn điểm số */}
                             <div>
                                <label htmlFor="targetScore" className="block text-xl font-medium text-gray-200 mb-4">2. Điểm số bạn muốn đạt được?</label>
                                <input id="targetScore" type="number" step="0.5" value={targetScore} onChange={(e) => setTargetScore(e.target.value)} className="w-full bg-gray-700 rounded-lg h-14 px-4 text-lg border border-transparent focus:ring-2 focus:ring-pink-500 focus:border-pink-500" placeholder="Ví dụ: 7.5" required />
                            </div>

                            {/* Lựa chọn thời gian học */}
                            <div>
                                <label className="block text-xl font-medium text-gray-200 mb-4">3. Bạn có thể học bao lâu mỗi ngày?</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {timeOptions.map(option => (
                                        <button key={option.value} type="button" onClick={() => setStudyTime(option.value)} className={`p-4 rounded-lg font-semibold transition-all ${studyTime === option.value ? 'bg-pink-600 text-white ring-2 ring-pink-400' : 'bg-gray-700 hover:bg-gray-600'}`}>
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            {error && <p className="text-red-400 text-center">{error}</p>}
                            
                            <button type="submit" disabled={isLoading} className="w-full h-14 text-lg font-bold text-white bg-gradient-to-r from-pink-500 to-orange-500 rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                {isLoading ? 'Đang lưu...' : 'Bắt đầu hành trình'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}