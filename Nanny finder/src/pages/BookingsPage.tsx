import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User } from 'lucide-react';
import Button from '../components/ui/Button';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/auth';

interface Booking {
  id: string;
  parent_id: string;
  nanny_id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  start_date: string;
  end_date: string;
  created_at: string;
  profiles: {
    full_name: string;
    avatar_url: string;
  };
  nanny_profiles: {
    hourly_rate: number;
  };
}

const BookingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadBookings();
    }
  }, [user]);

  const loadBookings = async () => {
    try {
      const isNanny = profile?.role === 'nanny';
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          parent_id,
          nanny_id,
          status,
          start_date,
          end_date,
          created_at,
          profiles!parent_id (
            full_name,
            avatar_url
          ),
          nanny_profiles!nanny_id (
            hourly_rate
          )
        `)
        .eq(isNanny ? 'nanny_id' : 'parent_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: Booking['status']) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId);

      if (error) throw error;
      loadBookings();
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-warning-100 text-warning-700';
      case 'accepted':
        return 'bg-success-100 text-success-700';
      case 'rejected':
        return 'bg-error-100 text-error-700';
      case 'completed':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
        {profile?.role === 'parent' && (
          <Button onClick={() => navigate('/nannies')}>Find a Nanny</Button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Nanny</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Dates</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Rate</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bookings.map(booking => (
                <tr key={booking.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full overflow-hidden">
                        <img
                          src={booking.profiles.avatar_url || 'https://via.placeholder.com/40'}
                          alt={booking.profiles.full_name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {booking.profiles.full_name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-gray-500">
                      <Calendar size={16} className="mr-2" />
                      <span>
                        {new Date(booking.start_date).toLocaleDateString()} -{' '}
                        {new Date(booking.end_date).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900">
                      UGX {booking.nanny_profiles.hourly_rate}/hr
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {profile?.role === 'nanny' && booking.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => updateBookingStatus(booking.id, 'accepted')}
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateBookingStatus(booking.id, 'rejected')}
                        >
                          Decline
                        </Button>
                      </>
                    )}
                    {booking.status === 'accepted' && (
                      <Button
                        size="sm"
                        onClick={() => navigate(`/messages/${
                          profile?.role === 'nanny' ? booking.parent_id : booking.nanny_id
                        }`)}
                      >
                        Message
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BookingsPage;