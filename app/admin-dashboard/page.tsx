"use client"
import { supabase } from "@/lib/supabase";
import { use, useEffect, useState } from "react";

import { Loader2 } from "lucide-react";


import Navbar from "@/components/Navbar";

interface UserAccount {
    id: number;
    username: string;
    status: string;
}

export default function AdminDashboardPage() {
    const [users, setUsers] = useState<UserAccount[]>([]);
    const [loading, setLoading] = useState(true);
    const [editModalOpen, setEditModalOpen] = useState(false);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("UserAccount")
                .select("*")
                .order("id", { ascending: false });
            if (error) throw error;
            setUsers(data || []);
        } catch (err: any) {
            console.error("ユーザーデータの取得に失敗:", err.message); 
        } finally {
            setLoading(false);

    }}

    useEffect(() => {
        fetchUsers();
    }, []);

    //Delete User Function
    const deleteUser = async (userId: number) => {
        try {
            const { error } = await supabase
                .from("UserAccount")
                .delete()
                .eq("id", userId);

            if (error) throw error;
            setUsers((prevUsers) => prevUsers.filter((u) => u.id !== userId));
        } catch (err: any) {
            console.error("ユーザー削除に失敗:", err.message);
        }
    };

    //Save User Status Function
    const saveUserStatus = async (userId: number, newStatus: string) => {
        try {  
            const { error } = await supabase
                .from("UserAccount")
                .update({ status: newStatus })
                .eq("id", userId);

            if (error) throw error;
            setUsers((prevUsers) => prevUsers.map((u) => u.id === userId ? { ...u, status: newStatus } : u));
        } catch (err: any) {
            console.error("ユーザー状態の保存に失敗:", err.message);
        }
    };

    return (
        <div className="min-h-screen bg-[#f0f4f8]">
            <Navbar />

            


            {loading ? (
                //Loading State
                <div className="flex items-center justify-center h-screen">
                    <Loader2 className="animate-spin text-gray-500" size={48} />
                </div>
            ) : (
                //Main Content
                <main className="p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">管理ダッシュボード</h1>
                    <p className="text-gray-600 mb-4">ここでは、システムの管理や設定を行うことができます。</p>
                    
                    {/* User Table List */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">ユーザー一覧</h2>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ユーザー名</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ステータス</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">アクション</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr  key={user.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.username}</td>
                                        {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.status}</td> */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <select 
                                                className="px-6 py-4 whitespace-nowrap mt-3 mb-3 text-sm text-gray-500 bg-gray-100 rounded" 
                                                value={user.status} 
                                                    onChange={(e) => {
                                                    const newStatus = e.target.value;
                                                    saveUserStatus(user.id, newStatus);
                                            }}>
                                                <option value="admin">管理者</option>
                                                <option value="user">ユーザー</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <button 
                                                className="mr-4 text-blue-600 hover:text-blue-900"
                                                onClick={() => setEditModalOpen(true)}
                                            >
                                                編集
                                            </button>
                                            <button 
                                                className="text-red-600 hover:text-red-900"
                                                onClick={() => deleteUser(user.id)}
                                            >
                                                削除
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>
            )}

            {/* Modal for User Edit  */}
            {editModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">ユーザー編集</h2>
                        <p className="text-gray-600 mb-4">ユーザー編集が完了しました。</p>
                        <button 
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            onClick={() => setEditModalOpen(false)}
                        >
                            閉じる
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
    }