"use client"
import Link from 'next/link'

export default function ViewDataPage() {
  // Data contoh (nanti kita ambil dari database)
  const dummyData = [
    { id: 1, nama: "Budi Santoso", tanggal: "2024-05-20", status: "Selesai" },
    { id: 2, nama: "Siti Aminah", tanggal: "2024-05-21", status: "Pending" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Daftar Data</h2>
        <Link href="/dashboard/tambah" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
          + Tambah Data
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">ID</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Nama Customer</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Tanggal</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {dummyData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm text-gray-600">{item.id}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.nama}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{item.tanggal}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${item.status === 'Selesai' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button className="text-blue-600 hover:underline text-sm">Download PDF</button>
                  <button className="text-red-500 hover:underline text-sm">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}