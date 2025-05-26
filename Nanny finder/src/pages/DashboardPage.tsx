import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MessageCircle, Star, Clock, Users } from 'lucide-react';
import Button from '../components/ui/Button';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/auth';

interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  totalMessages: number;
  unreadMessages: number;
  averageRating?: number;
  totalReviews: number;
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    pendingBookings: 0,
    totalMessages: 0,
    unreadMessages: 0,
    totalReviews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardStats();
    }
  }, [user]);

  const loadDashboardStats = async () => {
    try {
      const isNanny = profile?.role === 'nanny';
      const userIdField = isNanny ? 'nanny_id' : 'parent_id';

      // Get bookings stats
      const { data: bookings } = await supabase
        .from('bookings')
        .select('status')
        .eq(userIdField, user!.id);

      const { data: messages } = await supabase
        .from('messages')
        .select('read')
        .eq('receiver_id', user!.id);

      const { data: reviews } = await supabase
        .from('reviews')
        .select('rating')
        .eq(isNanny ? 'nanny_id' : 'parent_id', user!.id);

      setStats({
        totalBookings: bookings?.length || 0,
        pendingBookings: bookings?.filter(b => b.status === 'pending').length || 0,
        totalMessages: messages?.length || 0,
        unreadMessages: messages?.filter(m => !m.read).length || 0,
        averageRating: reviews?.length 
          ? reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length 
          : undefined,
        totalReviews: reviews?.length || 0,
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Button onClick={() => navigate('/bookings')}>View All Bookings</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Total Bookings</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalBookings}</h3>
            </div>
            <Calendar className="text-primary-600" size={24} />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {stats.pendingBookings} pending requests
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Messages</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalMessages}</h3>
            </div>
            <MessageCircle className="text-primary-600" size={24} />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {stats.unreadMessages} unread messages
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Rating</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {stats.averageRating?.toFixed(1) || 'N/A'}
              </h3>
            </div>
            <Star className="text-primary-600" size={24} />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {stats.totalReviews} reviews
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Response Time</p>
              <h3 className="text-2xl font-bold text-gray-900">2h</h3>
            </div>
            <Clock className="text-primary-600" size={24} />
          </div>
          <p className="mt-2 text-sm text-gray-500">Average response time</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-card p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
          {/* Recent bookings list */}
        </div>

        <div className="bg-white rounded-lg shadow-card p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Messages</h2>
          {/* Recent messages list */}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;