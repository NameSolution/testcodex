import React from 'react';
import Card from './components/Card';

const hotel = {
  name: 'Grand Codex Hotel',
  amenities: ['Free WiFi', 'Pool', 'Spa', 'Gym'],
  contact: 'Dial 0 from your room phone for reception',
  description:
    'Welcome to the Grand Codex Hotel. Enjoy our comfortable rooms and quality services during your stay.'
};

export default function InfoPanel() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <Card className="max-w-xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold">{hotel.name}</h1>
        <p>{hotel.description}</p>
        <div>
          <h2 className="text-xl mb-1 font-semibold">Amenities</h2>
          <ul className="list-disc list-inside space-y-1">
            {hotel.amenities.map(a => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>
        <p className="font-semibold">{hotel.contact}</p>
      </Card>
    </div>
  );
}
