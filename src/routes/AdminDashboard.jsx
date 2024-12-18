import React from 'react';
import UserManagement from '../components/admin/UserManagement';
import ReportManagement from '../components/admin/ReportManagement';
import Analytics from '../components/admin/Analytics';
import SystemSettings from '../components/admin/SystemSettings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { Users, Flag, BarChart2, Settings } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <BarChart2 size={20} />
            <span>Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center space-x-2">
            <Users size={20} />
            <span>Users</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center space-x-2">
            <Flag size={20} />
            <span>Reports</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings size={20} />
            <span>Settings</span>
          </TabsTrigger>
         

        </TabsList>

        <TabsContent value="analytics">
          <Analytics />
        </TabsContent>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>

        <TabsContent value="reports">
          <ReportManagement />
        </TabsContent>

        <TabsContent value="settings">
          <SystemSettings />
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default AdminDashboard;