import React from 'react';
import QuestionModeration from '../components/moderator/QuestionModeration';
import ReportedContent from '../components/moderator/ReportedContent';
import ModeratorStats from '../components/moderator/ModeratorStats';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { MessageSquare, Flag, AlertTriangle, BarChart2 } from 'lucide-react';

const ModeratorDashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Moderator Dashboard</h1>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart2 size={20} />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="questions" className="flex items-center space-x-2">
            <MessageSquare size={20} />
            <span>Questions</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center space-x-2">
            <Flag size={20} />
            <span>Reports</span>
          </TabsTrigger>
          <TabsTrigger value="flagged" className="flex items-center space-x-2">
            <AlertTriangle size={20} />
            <span>Flagged Content</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <ModeratorStats />
        </TabsContent>

        <TabsContent value="questions">
          <QuestionModeration />
        </TabsContent>

        <TabsContent value="reports">
          <ReportedContent />
        </TabsContent>

        <TabsContent value="flagged">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Flagged Content</h2>
            <p className="text-gray-600">
              Content that has been automatically flagged for review based on user reports
              and system rules.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ModeratorDashboard;