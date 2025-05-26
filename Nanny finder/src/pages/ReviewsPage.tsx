import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/auth';

interface Review {
  id: string;
  booking_id: string;
  parent_id: string;
  nanny_id: string;
  rating: number;
  comment: string;
  created_at: string;
  profiles: {
    full_name: string;
    avatar_url: string;
  };
}

const ReviewsPage: React.FC = () => {
  const { user, profile } = useAuthStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadReviews();
    }
  }, [user]);

  const loadReviews = async () => {
    try {
      const isNanny = profile?.role === 'nanny';
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          booking_id,
          parent_id,
          nanny_id,
          rating,
          comment,
          created_at,
          profiles!parent_id (
            full_name,
            avatar_url
          )
        `)
        .eq(isNanny ? 'nanny_id' : 'parent_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={16}
        className={index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Reviews</h1>

      <div className="grid gap-6">
        {reviews.map(review => (
          <div key={review.id} className="bg-white rounded-lg shadow-card p-6">
            <div className="flex items-start space-x-4">
              <div className="h-12 w-12 rounded-full overflow-hidden">
                <img
                  src={review.profiles.avatar_url || 'https://via.placeholder.com/48'}
                  alt={review.profiles.full_name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">{review.profiles.full_name}</h3>
                  <div className="flex items-center space-x-1">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <p className="mt-2 text-gray-600">{review.comment}</p>
                <div className="mt-2 text-sm text-gray-500">
                  {new Date(review.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        ))}

        {reviews.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No reviews yet
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsPage;