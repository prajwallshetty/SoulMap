"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  Users, 
  FileText, 
  Activity, 
  Search, 
  Trash2, 
  ShieldAlert, 
  Loader2, 
  Shield, 
  Filter, 
  Globe, 
  Terminal, 
  ArrowLeft,
  RefreshCw,
  Check,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserMeta {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  reportCount: number;
}

interface AuditLogEntry {
  _id: string;
  userId?: string;
  userEmail: string;
  action: string;
  details: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export default function AdminPanelPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "logs">("overview");
  const [users, setUsers] = useState<UserMeta[]>([]);
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  
  // Search & Filter state
  const [userSearch, setUserSearch] = useState("");
  const [logSearch, setLogSearch] = useState("");
  const [logActionFilter, setLogActionFilter] = useState("");
  
  // Fetch users list
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Fetch logs list
  const fetchLogs = async (searchQuery = "", actionFilter = "") => {
    setLoadingLogs(true);
    try {
      let url = "/api/admin/logs?limit=100";
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
      if (actionFilter) url += `&action=${encodeURIComponent(actionFilter)}`;
      
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error("Failed to load logs:", err);
    } finally {
      setLoadingLogs(false);
    }
  };

  // Check auth and initial load
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      if (session.user?.role !== "admin") {
        // We will show forbidden UI instead of forcing redirect immediately
      } else {
        fetchUsers();
        fetchLogs();
      }
    }
  }, [status, session, router]);

  // Handle log filter/search trigger
  useEffect(() => {
    if (status === "authenticated" && session.user?.role === "admin") {
      const delayDebounce = setTimeout(() => {
        fetchLogs(logSearch, logActionFilter);
      }, 300);
      return () => clearTimeout(delayDebounce);
    }
  }, [logSearch, logActionFilter, status, session]);

  // Toggle user role
  const handleToggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      return;
    }
    setActionLoadingId(userId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );
        fetchLogs(logSearch, logActionFilter);
      } else {
        const data = await res.json();
        alert(data.message || "Failed to update role");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete user
  const handleDeleteUser = async (userId: string, email: string) => {
    if (
      !confirm(
        `WARNING: Are you sure you want to delete user ${email}?\n\nThis will permanently remove their user record AND ALL astrology reports they have generated. This action cannot be undone.`
      )
    ) {
      return;
    }
    setActionLoadingId(userId);
    try {
      const res = await fetch(`/api/admin/users?userId=${userId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u._id !== userId));
        fetchLogs(logSearch, logActionFilter);
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete user");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Loading state
  if (status === "loading") {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 flex-grow flex flex-col justify-center items-center bg-[#FAFAFA]">
        <Loader2 className="h-8 w-8 text-[#3B0A45] animate-spin mb-4" />
        <p className="text-sm text-zinc-500">Loading admin credentials...</p>
      </div>
    );
  }

  // Forbidden State
  if (status === "authenticated" && session.user?.role !== "admin") {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 flex-grow flex flex-col justify-center items-center text-center bg-[#FAFAFA]">
        <div className="h-14 w-14 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-600 mb-6 shadow-sm">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-[#18181B] tracking-tight mb-2">
          Access Denied
        </h1>
        <p className="text-sm text-zinc-500 font-light max-w-sm mb-8 leading-relaxed">
          You do not have the administration privileges required to view this page. If you believe this is an error, please contact your database administrator.
        </p>
        <Link href="/dashboard">
          <Button className="bg-[#3B0A45] hover:bg-[#3B0A45]/90 text-white font-medium rounded-lg px-6 h-10 shadow-sm flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  // Filtered lists
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  // Statistics calculation
  const totalReports = users.reduce((sum, u) => sum + (u.reportCount || 0), 0);
  const totalAdmins = users.filter((u) => u.role === "admin").length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 w-full flex-grow flex flex-col gap-8 bg-[#FAFAFA] text-[#18181B]">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-[#3B0A45]" />
            <h1 className="font-serif text-2xl font-bold tracking-tight text-[#18181B]">
              System Administration
            </h1>
          </div>
          <p className="text-xs text-[#71717A] mt-1 font-light">
            Manage users, toggle access roles, delete records, and audit event logs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              fetchUsers();
              fetchLogs(logSearch, logActionFilter);
            }}
            className="border-zinc-200 text-zinc-600 hover:bg-zinc-50 h-9 rounded-lg"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Refresh Data
          </Button>
          <Link href="/dashboard">
            <Button
              variant="outline"
              size="sm"
              className="border-zinc-200 text-zinc-600 hover:bg-zinc-50 h-9 rounded-lg"
            >
              Seeker Panel
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-zinc-200 -mt-4">
        <button
          onClick={() => setActiveTab("overview")}
          className={`py-3 px-5 text-sm font-medium border-b-2 transition-all ${
            activeTab === "overview"
              ? "border-[#3B0A45] text-[#3B0A45]"
              : "border-transparent text-zinc-500 hover:text-zinc-800"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`py-3 px-5 text-sm font-medium border-b-2 transition-all ${
            activeTab === "users"
              ? "border-[#3B0A45] text-[#3B0A45]"
              : "border-transparent text-zinc-500 hover:text-zinc-800"
          }`}
        >
          Seekers ({users.length})
        </button>
        <button
          onClick={() => setActiveTab("logs")}
          className={`py-3 px-5 text-sm font-medium border-b-2 transition-all ${
            activeTab === "logs"
              ? "border-[#3B0A45] text-[#3B0A45]"
              : "border-transparent text-zinc-500 hover:text-zinc-800"
          }`}
        >
          Audit Logs
        </button>
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-[#E4E4E7] rounded-xl p-6 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Total Seekers</p>
                <h3 className="font-serif text-3xl font-bold text-[#18181B]">{users.length}</h3>
                <p className="text-[10px] text-zinc-400">{totalAdmins} Admin Accounts</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center text-[#3B0A45]">
                <Users className="h-6 w-6" />
              </div>
            </div>

            <div className="bg-white border border-[#E4E4E7] rounded-xl p-6 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Reports Generated</p>
                <h3 className="font-serif text-3xl font-bold text-[#18181B]">{totalReports}</h3>
                <p className="text-[10px] text-zinc-400">
                  Avg {(totalReports / (users.length || 1)).toFixed(1)} per seeker
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-[#E8C47A]">
                <FileText className="h-6 w-6" />
              </div>
            </div>

            <div className="bg-white border border-[#E4E4E7] rounded-xl p-6 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Logged Audit Trails</p>
                <h3 className="font-serif text-3xl font-bold text-[#18181B]">{logs.length}</h3>
                <p className="text-[10px] text-zinc-400">Recent events captured</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <Activity className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Users list */}
            <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <h4 className="font-serif text-base font-bold text-[#18181B]">Newly Joined Seekers</h4>
                <button
                  onClick={() => setActiveTab("users")}
                  className="text-xs text-[#3B0A45] hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="divide-y divide-zinc-100">
                {users.slice(0, 5).map((user) => (
                  <div key={user._id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-zinc-800">{user.name}</span>
                      <span className="text-zinc-400 block">{user.email}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-zinc-500 font-light block">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 mt-1 text-[9px] font-medium border ${
                        user.role === "admin"
                          ? "bg-purple-50 text-[#3B0A45] border-purple-100"
                          : "bg-zinc-50 text-zinc-600 border-zinc-200"
                      }`}>
                        {user.role}
                      </span>
                    </div>
                  </div>
                ))}
                {users.length === 0 && (
                  <p className="text-xs text-zinc-400 py-4 text-center">No users registered yet.</p>
                )}
              </div>
            </div>

            {/* Quick logs preview */}
            <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <h4 className="font-serif text-base font-bold text-[#18181B]">Recent Audit Activity</h4>
                <button
                  onClick={() => setActiveTab("logs")}
                  className="text-xs text-[#3B0A45] hover:underline"
                >
                  View Logs
                </button>
              </div>
              <div className="space-y-3">
                {logs.slice(0, 5).map((log) => (
                  <div key={log._id} className="flex gap-3 text-xs leading-relaxed">
                    <div className={`mt-0.5 shrink-0 h-6 w-6 rounded-full flex items-center justify-center text-[10px] ${
                      log.action.startsWith("admin")
                        ? "bg-red-50 text-red-600"
                        : log.action.startsWith("report")
                        ? "bg-amber-50 text-[#3B0A45]"
                        : "bg-blue-50 text-blue-600"
                    }`}>
                      {log.action.includes("login") ? "LI" : log.action.includes("register") ? "RG" : "AC"}
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium text-zinc-800">
                        {log.action}{" "}
                        <span className="font-light text-zinc-400 text-[10px]">
                          ({new Date(log.createdAt).toLocaleTimeString()})
                        </span>
                      </p>
                      <p className="text-zinc-500 font-light text-[11px] truncate max-w-sm">{log.details}</p>
                    </div>
                  </div>
                ))}
                {logs.length === 0 && (
                  <p className="text-xs text-zinc-400 py-4 text-center">No activities recorded yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. USERS TAB */}
      {activeTab === "users" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white border border-zinc-200 p-4 rounded-xl shadow-sm">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search seeker by name or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="pl-9 pr-4 py-2 w-full text-xs bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#3B0A45] focus:border-[#3B0A45] focus:bg-white transition-all"
              />
            </div>
            <div className="text-[10px] text-zinc-400 font-light shrink-0">
              Showing {filteredUsers.length} of {users.length} Seeker Records
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
            {loadingUsers ? (
              <div className="py-20 flex flex-col justify-center items-center">
                <Loader2 className="h-6 w-6 text-[#3B0A45] animate-spin mb-2" />
                <p className="text-xs text-zinc-500">Retrieving seeker registers...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-50/50 border-b border-zinc-200 text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                      <th className="py-3 px-6">Seeker</th>
                      <th className="py-3 px-6">Access Role</th>
                      <th className="py-3 px-6">Charts Compiled</th>
                      <th className="py-3 px-6">Registered Date</th>
                      <th className="py-3 px-6 text-right">Administrative Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-xs">
                    {filteredUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-zinc-50/30">
                        {/* Name & Email */}
                        <td className="py-4 px-6">
                          <div className="font-semibold text-zinc-800">{user.name}</div>
                          <div className="text-zinc-400 font-light text-[11px]">{user.email}</div>
                        </td>
                        {/* Role */}
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-medium border ${
                            user.role === "admin"
                              ? "bg-purple-50 text-[#3B0A45] border-purple-100"
                              : "bg-zinc-50 text-zinc-600 border-zinc-200"
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${
                              user.role === "admin" ? "bg-[#3B0A45]" : "bg-zinc-400"
                            }`} />
                            {user.role}
                          </span>
                        </td>
                        {/* Charts compiled */}
                        <td className="py-4 px-6 font-semibold text-zinc-700">
                          {user.reportCount} {user.reportCount === 1 ? "chart" : "charts"}
                        </td>
                        {/* Created At */}
                        <td className="py-4 px-6 text-zinc-500 font-light">
                          {new Date(user.createdAt).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        {/* Actions */}
                        <td className="py-4 px-6 text-right">
                          <div className="flex gap-2 justify-end">
                            {/* Toggle Role */}
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={actionLoadingId !== null || user._id === session?.user?.id}
                              onClick={() => handleToggleRole(user._id, user.role)}
                              className="border-zinc-200 text-zinc-600 hover:bg-zinc-50 h-8 text-[11px] rounded-lg px-2"
                              title={user._id === session?.user?.id ? "Cannot toggle own role" : "Toggle Access Role"}
                            >
                              {actionLoadingId === user._id ? (
                                <Loader2 className="h-3 w-3 animate-spin text-zinc-500" />
                              ) : (
                                <>
                                  <Shield className="h-3 w-3 mr-1 text-zinc-400" />
                                  Make {user.role === "admin" ? "User" : "Admin"}
                                </>
                              )}
                            </Button>
                            {/* Delete User */}
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={actionLoadingId !== null || user._id === session?.user?.id}
                              onClick={() => handleDeleteUser(user._id, user.email)}
                              className="text-zinc-400 hover:text-red-600 hover:bg-red-50 h-8 text-[11px] rounded-lg px-2"
                              title={user._id === session?.user?.id ? "Cannot delete own account" : "Delete User"}
                            >
                              {actionLoadingId === user._id ? (
                                <Loader2 className="h-3 w-3 animate-spin text-red-500" />
                              ) : (
                                <>
                                  <Trash2 className="h-3 w-3 mr-1" />
                                  Delete
                                </>
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-zinc-400 font-light">
                          No seeker records found matching the query.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. AUDIT LOGS TAB */}
      {activeTab === "logs" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white border border-zinc-200 p-4 rounded-xl shadow-sm">
            <div className="flex flex-col sm:flex-row gap-3 w-full md:max-w-2xl">
              {/* Search input */}
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search log by seeker email..."
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 w-full text-xs bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#3B0A45] focus:border-[#3B0A45] focus:bg-white transition-all"
                />
              </div>
              {/* Action Filter */}
              <div className="relative shrink-0 min-w-[180px]">
                <Filter className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
                <select
                  value={logActionFilter}
                  onChange={(e) => setLogActionFilter(e.target.value)}
                  className="pl-9 pr-4 py-2 w-full text-xs bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-800 focus:outline-none focus:ring-1 focus:ring-[#3B0A45] focus:border-[#3B0A45] focus:bg-white transition-all appearance-none cursor-pointer"
                >
                  <option value="">All Event Actions</option>
                  <option value="user.register">Registration (user.register)</option>
                  <option value="user.login">Login Success (user.login)</option>
                  <option value="user.login_failed">Login Failed (user.login_failed)</option>
                  <option value="report.generate">Report Build (report.generate)</option>
                  <option value="report.delete">Report Delete (report.delete)</option>
                  <option value="admin.role_update">Role Change (admin.role_update)</option>
                  <option value="admin.user_delete">User Wipe (admin.user_delete)</option>
                </select>
              </div>
            </div>
            <div className="text-[10px] text-zinc-400 font-light shrink-0">
              Showing {logs.length} capturing logs
            </div>
          </div>

          {/* Audit Logs Feed */}
          <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
            {loadingLogs ? (
              <div className="py-20 flex flex-col justify-center items-center">
                <Loader2 className="h-6 w-6 text-[#3B0A45] animate-spin mb-2" />
                <p className="text-xs text-zinc-500">Retrieving system activity log...</p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-100">
                {logs.map((log) => (
                  <div key={log._id} className="p-4 sm:px-6 hover:bg-zinc-50/30 flex flex-col sm:flex-row sm:items-start justify-between gap-4 text-xs">
                    <div className="space-y-1.5 flex-grow">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Action tag */}
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[9px] font-semibold border uppercase ${
                          log.action.startsWith("admin")
                            ? "bg-red-50 text-red-600 border-red-100"
                            : log.action.startsWith("report")
                            ? "bg-amber-50 text-[#3B0A45] border-amber-100"
                            : log.action.includes("failed")
                            ? "bg-rose-50 text-rose-600 border-rose-100"
                            : "bg-blue-50 text-blue-600 border-blue-100"
                        }`}>
                          {log.action}
                        </span>
                        {/* User Email */}
                        <span className="font-semibold text-zinc-700">{log.userEmail}</span>
                      </div>
                      {/* Details */}
                      <p className="text-zinc-600 font-light leading-relaxed text-[11px] max-w-3xl">
                        {log.details}
                      </p>
                      {/* Metadata (IP and User-Agent) */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-zinc-400 font-light pt-0.5">
                        {log.ipAddress && (
                          <span className="flex items-center gap-1">
                            <Globe className="h-3 w-3 text-zinc-300" />
                            IP: {log.ipAddress}
                          </span>
                        )}
                        {log.userAgent && (
                          <span className="flex items-center gap-1 truncate max-w-[280px]" title={log.userAgent}>
                            <Terminal className="h-3 w-3 text-zinc-300 shrink-0" />
                            Client: {log.userAgent}
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Timestamp */}
                    <div className="shrink-0 text-right text-[10px] text-zinc-400 font-light mt-0.5">
                      <div>
                        {new Date(log.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                      <div>
                        {new Date(log.createdAt).toLocaleTimeString(undefined, {
                          hour: "numeric",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                ))}
                {logs.length === 0 && (
                  <div className="py-16 text-center text-zinc-400 font-light text-xs">
                    No activity logs recorded matching the criteria.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
