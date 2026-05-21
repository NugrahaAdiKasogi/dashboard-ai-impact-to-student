import React, { useState, useEffect } from 'react';
import { Users, BrainCircuit, TrendingUp } from 'lucide-react';
import { supabase } from './lib/supabaseClient.js';
// 1. IMPORT KOMPONEN RECHARTS
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Warna estetik untuk Pie Chart
const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#6366f1'];

function App() {
  const [kpiData, setKpiData] = useState({
    totalSamples: 0,
    avgHours: 0,
    avgGpaPost: 0,
  });

  // 2. TAMBAHKAN WADAH STATE UNTUK GRAFIK & TABEL
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // 3. PERBAIKAN SELECT: Masukkan risk_id dan Pre_Semester_GPA
        const { data, error } = await supabase
          .from('fact_student_ai_impact')
          .select(
            'student_id, risk_id, Pre_Semester_GPA, Post_Semester_GPA, Weekly_GenAI_Hours'
          );

        if (error) throw error;

        if (data && data.length > 0) {
          const totalSamples = data.length;

          // --- LOGIKA KPI ---
          const totalHours = data.reduce(
            (sum, row) => sum + (Number(row.Weekly_GenAI_Hours) || 0),
            0
          );
          const totalGpa = data.reduce(
            (sum, row) => sum + (Number(row.Post_Semester_GPA) || 0),
            0
          );
          setKpiData({
            totalSamples,
            avgHours: (totalHours / totalSamples).toFixed(1),
            avgGpaPost: (totalGpa / totalSamples).toFixed(2),
          });

          // --- LOGIKA PIE CHART ---
          const riskCounts = data.reduce((acc, row) => {
            const riskLabel =
              row.risk_id !== null && row.risk_id !== undefined
                ? `Risk Level ${row.risk_id}`
                : 'Unknown';
            acc[riskLabel] = (acc[riskLabel] || 0) + 1;
            return acc;
          }, {});

          const finalPieData = Object.keys(riskCounts).map((key) => ({
            name: key,
            value: riskCounts[key],
          }));

          // --- LOGIKA BAR CHART ---
          const gpaByRisk = data.reduce((acc, row) => {
            // Mengecek secara spesifik agar angka 0 tetap diakui
            const riskLabel =
              row.risk_id !== null && row.risk_id !== undefined
                ? `Risk Level ${row.risk_id}`
                : 'Unknown';
            if (!acc[riskLabel]) {
              acc[riskLabel] = { total_pre: 0, total_post: 0, count: 0 };
            }
            acc[riskLabel].total_pre += Number(row.Pre_Semester_GPA) || 0;
            acc[riskLabel].total_post += Number(row.Post_Semester_GPA) || 0;
            acc[riskLabel].count += 1;
            return acc;
          }, {});

          const finalBarData = Object.keys(gpaByRisk).map((key) => ({
            name: key,
            pre_gpa: Number(
              (gpaByRisk[key].total_pre / gpaByRisk[key].count).toFixed(2)
            ),
            post_gpa: Number(
              (gpaByRisk[key].total_post / gpaByRisk[key].count).toFixed(2)
            ),
          }));

          // --- LOGIKA TABLE ---
          const finalTableData = data.slice(0, 5); // Ambil 5 data pertama

          // 4. SIMPAN SEMUA HASIL KE DALAM STATE
          setPieData(finalPieData);
          setBarData(finalBarData);
          setTableData(finalTableData);
        }
      } catch (err) {
        console.error('Gagal menarik data:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-slate-50 font-sans">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">AI Student Impact</h1>
        <p className="text-slate-500 mt-2">
          Analisis Pengaruh Generative AI terhadap Performa Akademik Mahasiswa
        </p>
      </header>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <p className="text-slate-500 font-medium">
            Menyedot data dari cloud...
          </p>
        </div>
      ) : (
        <>
          {/* KPI CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <Users size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">
                  Total Sampel Mahasiswa
                </p>
                <p className="text-2xl font-bold text-slate-800">
                  {kpiData.totalSamples}
                </p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                <BrainCircuit size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">
                  Rata-rata Jam Penggunaan AI
                </p>
                <p className="text-2xl font-bold text-slate-800">
                  {kpiData.avgHours} Jam/Minggu
                </p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">
                  Rata-rata IPK (Post-AI)
                </p>
                <p className="text-2xl font-bold text-slate-800">
                  {kpiData.avgGpaPost}
                </p>
              </div>
            </div>
          </div>

          {/* CHARTS AREA */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* PIE CHART */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 min-h-[350px]">
              <h2 className="text-lg font-semibold text-slate-800 mb-6">
                Distribusi Risiko Burnout
              </h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* BAR CHART */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 min-h-[350px]">
              <h2 className="text-lg font-semibold text-slate-800 mb-6">
                Perbandingan IPK: Pre vs Post AI
              </h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={barData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 4]} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="pre_gpa"
                      fill="#94a3b8"
                      name="IPK Sebelum AI"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="post_gpa"
                      fill="#3b82f6"
                      name="IPK Sesudah AI"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* DATA TABLE (Flexing) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Sampel Data Mentah (Top 5)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-500">
                <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 rounded-tl-lg">Student ID</th>
                    <th className="px-6 py-3">Risk Level</th>
                    <th className="px-6 py-3">Jam AI / Minggu</th>
                    <th className="px-6 py-3">Pre-GPA</th>
                    <th className="px-6 py-3 rounded-tr-lg">Post-GPA</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, index) => (
                    <tr
                      key={index}
                      className="bg-white border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {row.student_id}
                      </td>
                      <td className="px-6 py-4">{row.risk_id}</td>
                      <td className="px-6 py-4">
                        {row.Weekly_GenAI_Hours} Jam
                      </td>
                      <td className="px-6 py-4">{row.Pre_Semester_GPA}</td>
                      <td className="px-6 py-4 font-semibold text-blue-600">
                        {row.Post_Semester_GPA}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
