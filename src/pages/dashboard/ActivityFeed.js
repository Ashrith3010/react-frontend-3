import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../ui/Card';
import { Clock, Utensils, Share2 } from 'lucide-react';

const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActivities = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/activity/recent', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch activities');
      }

      const data = await response.json();
      setActivities(data.activities);
      setError(null);
    } catch (err) {
      setError('Failed to load recent activity');
      console.error('Error fetching activities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
    // Fetch new activities every 30 seconds for more frequent updates
    const intervalId = setInterval(fetchActivities, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const getTimeAgo = (timestamp) => {
    const minutes = Math.floor((new Date() - new Date(timestamp)) / 60000);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    return `${Math.floor(hours / 24)} days ago`;
  };

  const getActivityIcon = (type) => {
    return type === 'donation' ? Utensils : Share2;
  };

  if (loading) {
    return (
      <Card className="activity-feed">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="h-16 bg-gray-100 animate-pulse rounded"></div>
            <div className="h-16 bg-gray-100 animate-pulse rounded"></div>
            <div className="h-16 bg-gray-100 animate-pulse rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="activity-feed">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        {error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <div className="space-y-4">
            {activities.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No recent activity</p>
            ) : (
              activities.map((activity, index) => {
                const ActivityIcon = getActivityIcon(activity.type);
                return (
                  <motion.div
                    key={`${activity.timestamp}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="activity-item flex items-center p-3 rounded-lg hover:bg-gray-50"
                  >
                    <div className={`activity-icon p-2 rounded-full mr-4 ${
                      activity.type === 'donation' ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      <ActivityIcon className={`h-4 w-4 ${
                        activity.type === 'donation' ? 'text-green-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <div className="activity-content flex-1">
                      <p className="activity-message text-sm font-medium text-gray-700">
                        {activity.message}
                      </p>
                      <p className="activity-time text-xs text-gray-500 mt-1 flex items-center">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {getTimeAgo(activity.timestamp)}
                      </p>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;