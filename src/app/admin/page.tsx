'use client';

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLeads, updateLeadStatus, Lead } from "../leadsSlice";
import { RootState, AppDispatch } from "../store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function AdminPage() {
  const dispatch = useDispatch<AppDispatch>();
  const leads = useSelector((state: RootState) => state.leads.data);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const fetchLeads = async () => {
      const res = await fetch("/api/leads");
      const data: Lead[] = await res.json();
      dispatch(setLeads(data));
    };

    fetchLeads();
  }, [dispatch]);

  const handleStatusUpdate = async (id: number) => {
    try {
      const res = await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "Reached Out" }),
      });

      if (!res.ok) throw new Error("Failed to update");

      dispatch(updateLeadStatus({ id, status: "Reached Out" }));
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const filteredLeads = leads.filter((lead: Lead) => {
    const matchesSearch = lead.firstName.toLowerCase().includes(search.toLowerCase()) || lead.lastName.toLowerCase().includes(search.toLowerCase());;
    const matchesStatus = statusFilter === "All" || statusFilter === "" || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-neutral-100 text-black flex">
      <aside className="w-64 bg-gradient-to-b from-lime-100 to-white border-r p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-10">almà</h2>
          <nav className="space-y-4">
            <div className="font-semibold text-black">Leads</div>
            <div className="text-gray-400 cursor-not-allowed">Settings</div>
          </nav>
        </div>
        <div className="text-sm text-black font-medium flex items-center gap-2">
          <div className="bg-black text-white rounded-full w-6 h-6 flex items-center justify-center">A</div>
          Admin
        </div>
      </aside>

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Leads</h1>
        <div className="flex gap-4 mb-4">
          <Input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-1/3"
          />
          <Select onValueChange={(value) => setStatusFilter(value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Reached Out">Reached Out</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-white rounded-xl shadow border overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="border-b">
              <tr>
                <th className="p-4">First Name</th>
                <th className="p-4">Last Name</th>
                <th className="p-4">Submitted</th>
                <th className="p-4">Status</th>
                <th className="p-4">Country</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="border-t">
                  <td className="p-4">{lead.firstName}</td>
                  <td className="p-4">{lead.lastName}</td>
                  <td className="p-4">{lead.submitted}</td>
                  <td className="p-4">{lead.status}</td>
                  <td className="p-4">{lead.country}</td>
                  <td className="p-4">
                    {lead.status === "Pending" && (
                      <Button onClick={() => handleStatusUpdate(lead.id)}>
                        Mark as Reached Out
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Mock */}
        <div className="flex justify-end items-center mt-4">
          <div className="flex items-center space-x-2 text-sm">
            <button className="text-gray-400" disabled>{"<"}</button>
            <button className="border rounded px-2 py-1 bg-black text-white">1</button>
            <button className="border rounded px-2 py-1">2</button>
            <button className="border rounded px-2 py-1">3</button>
            <button className="text-gray-400" disabled>{">"}</button>
          </div>
        </div>
      </main>
    </div>
  );
}
