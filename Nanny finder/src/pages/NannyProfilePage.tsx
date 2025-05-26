import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Clock, Award, Shield, Calendar } from 'lucide-react';
import Button from '../components/ui/Button';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/auth';

interface NannyProfile {
  id: string;
  profiles: {
    full_name: string;
    avatar_url: string;
    phone: string;
  };
  bio: string;
  experience_years: number;
  hourly_rate: number;
  availability: string[];
  specialties: string[];
  background_check: boolean;
  verified: boolean;
}

const NannyProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [nanny, setNanny] = useState<NannyProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadNannyProfile(id);
    }
  }, [id]);

  const loadNannyProfile = async (nannyId: string) => {
    try {
      const { data, error } = await supabase
        .from('nanny_profiles')
        .select(`
          id,
          profiles (
            full_name,
            avatar_url,
            phone
          ),
          bio,
          experience_years,
          hourly_rate,
          availability,
          specialties,
          background_check,
          verified
        `)
        .eq('id', nannyId)
        .single();

      if (error) throw error;
      setNanny(data);
    } catch (error) {
      console.error('Error loading nanny profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!user) {
      navigate('/signin');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          parent_id: user.id,
          nanny_id: id,
          status: 'pending',
          start_date: new Date().toISOString(),
          end_date: new Date().toISOString(),
        });

      if (error) throw error;
      navigate('/bookings');
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!nanny) {
    return <div className="container mx-auto px-4 py-8">Nanny not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3">
            <div className="h-64 md:h-full relative">
              <img
                src={nanny.profiles.avatar_url || 'https://via.placeholder.com/400'}
                alt={nanny.profiles.full_name}
                className="w-full h-full object-cover"
              />
              {nanny.verified && (
                <div className="absolute top-4 right-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                  <Shield size={16} className="mr-1" />
                  Verified
                </div>
              )}
            </div>
          </div>

          <div className="md:w-2/3 p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {nanny.profiles.full_name}
                </h1>
                <div className="mt-2 flex items-center text-gray-600">
                  <MapPin size={18} className="mr-1" />
                  <span>Kampala, Uganda</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-primary-600">
                UGX {nanny.hourly_rate}/hr
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">About Me</h2>
              <p className="text-gray-600">{nanny.bio}</p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <Award size={20} className="text-primary-600 mr-2" />
                <div>
                  <div className="font-medium">Experience</div>
                  <div className="text-gray-600">{nanny.experience_years} years</div>
                </div>
              </div>

              <div className="flex items-center">
                <Clock size={20} className="text-primary-600 mr-2" />
                <div>
                  <div className="font-medium">Availability</div>
                  <div className="text-gray-600">
                    {nanny.availability?.join(', ') || 'Flexible'}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-medium mb-2">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {nanny.specialties?.map((specialty, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 flex space-x-4">
              <Button size="lg" onClick={handleBooking}>
                Book Now
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate(`/messages/${nanny.id}`)}
              >
                Send Message
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NannyProfilePage;